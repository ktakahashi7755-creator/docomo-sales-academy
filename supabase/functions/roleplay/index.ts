// Supabase Edge Function: roleplay
//
// ロープレの顧客応答と評価をサーバー側で生成する。
// AI プロバイダの API キーはこの関数のサーバー環境変数だけに置き、
// フロントには絶対に出さない（フロントは anon キーで invoke するのみ）。
//
// デプロイ前提（未デプロイ・テンプレート）:
//   supabase secrets set AI_API_KEY=... AI_PROVIDER=anthropic
//   supabase functions deploy roleplay --no-verify-jwt=false
//
// 認証: 既定で JWT 必須（ログイン済みユーザーのみ呼べる）。
//
// 注意: 事実値（料金・還元・補償）は捏造させない。プロンプトで「数値は断定せず、
// 公式情報の確認を促す」方針を固定し、評価は会話の振る舞いを対象にする。

// 注: 本ファイルは Deno 実行環境（URL import・Deno グローバル）。
// フロントの tsconfig/ESLint 対象外で、Supabase CLI / Deno で型検査・デプロイする。
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// フロント表示に合わせ、キーと日本語ラベルを対で持つ（label が英語キーのまま出るのを防ぐ）。
const EVAL_ITEMS = [
  { key: "greeting", label: "挨拶" },
  { key: "icebreak", label: "アイスブレイク" },
  { key: "hearing", label: "ヒアリング" },
  { key: "discover", label: "課題発見" },
  { key: "product", label: "商材理解" },
  { key: "fit", label: "お客様に合わせた提案" },
  { key: "numbers", label: "数値説明" },
  { key: "clarity", label: "分かりやすさ" },
  { key: "objection", label: "反論処理" },
  { key: "closing", label: "クロージング" },
  { key: "compliance", label: "コンプライアンス" },
  { key: "next", label: "次アクション提示" },
];
const EVAL_KEYS = EVAL_ITEMS.map((i) => i.key);

const SYSTEM_GUARDRAILS = [
  "あなたはドコモ販売研修のロープレ相手（顧客役）または評価者です。",
  "料金・還元・補償・仕様などの具体的な数値は断定せず、必要なら『公式情報の確認が必要』と促してください。",
  "事実を創作しないでください。評価は会話の振る舞い（挨拶・ヒアリング・提案・反論処理・クロージング・コンプライアンス等）を対象にします。",
  "パスワードや認証コードはお客様ご自身が入力する前提を崩さないでください。",
].join("\n");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  try {
    const { action, payload } = await req.json();
    const apiKey = Deno.env.get("AI_API_KEY");
    const provider = Deno.env.get("AI_PROVIDER") ?? "anthropic";
    if (!apiKey) return json({ error: "AI_API_KEY is not configured" }, 500);

    if (action === "opening" || action === "reply") {
      const text = await generateCustomerTurn(provider, apiKey, action, payload);
      return json({ text });
    }
    if (action === "evaluate") {
      const evaluation = await generateEvaluation(provider, apiKey, payload);
      return json(evaluation);
    }
    return json({ error: `unknown action: ${action}` }, 400);
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
});

// --- プロバイダ・アダプタ（差し替え可能）。既定は Anthropic Messages API。---

async function chat(
  provider: string,
  apiKey: string,
  system: string,
  user: string,
): Promise<string> {
  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: Deno.env.get("AI_MODEL") ?? "claude-sonnet-4-6",
        max_tokens: 1024,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    if (!res.ok) throw new Error(`anthropic API error: ${res.status}`);
    const data = await res.json();
    return data?.content?.[0]?.text ?? "";
  }
  // openai 互換
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: Deno.env.get("AI_MODEL") ?? "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`openai API error: ${res.status}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

async function generateCustomerTurn(
  provider: string,
  apiKey: string,
  action: string,
  payload: { scenario: unknown; difficulty: number; history?: unknown[]; message?: string },
): Promise<string> {
  const system = `${SYSTEM_GUARDRAILS}\nあなたは顧客役です。1〜2文で自然に短く返答してください。`;
  const user = JSON.stringify({ action, ...payload });
  const text = await chat(provider, apiKey, system, user);
  return text.trim();
}

async function generateEvaluation(
  provider: string,
  apiKey: string,
  payload: { scenario: unknown; difficulty: number; transcript: unknown[] },
): Promise<{
  items: { key: string; label: string; score: number }[];
  score: number;
  rank: string;
  feedback: string[];
}> {
  const system = `${SYSTEM_GUARDRAILS}\n以下の評価項目を各0-100で採点し、JSONのみを返してください。項目キー: ${EVAL_KEYS.join(", ")}。形式: {"items":[{"key","score"}],"feedback":[]}`;
  const user = JSON.stringify(payload);
  const raw = await chat(provider, apiKey, system, user);
  let parsed: { items?: { key: string; score: number }[]; feedback?: string[] };
  try {
    parsed = JSON.parse(extractJson(raw));
  } catch {
    throw new Error("evaluation response was not valid JSON");
  }
  const items = EVAL_ITEMS.map(({ key, label }) => ({
    key,
    label,
    score: clampScore(parsed?.items?.find((i: { key: string }) => i.key === key)?.score),
  }));
  const score = Math.round(items.reduce((n, i) => n + i.score, 0) / items.length);
  return { items, score, rank: rankOf(score), feedback: parsed?.feedback ?? [] };
}

function extractJson(s: string): string {
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  return start >= 0 && end > start ? s.slice(start, end + 1) : "{}";
}

function clampScore(n: unknown): number {
  const v = typeof n === "number" ? n : 0;
  return Math.min(100, Math.max(0, Math.round(v)));
}

function rankOf(score: number): string {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  if (score >= 60) return "C";
  return "D";
}
