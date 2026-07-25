import type { Scenario } from "@/lib/types";
import { EVAL_ITEMS } from "@/data/seed";
import { gradeOf, type Grade } from "@/lib/progress";
import type { ChatMessage, Evaluation, EvalItemScore } from "@/lib/ai/types";

/**
 * ロープレの純粋ロジック（デモのモック顧客＋ヒューリスティック評価）。
 *
 * 重要：評価は「会話の振る舞い」だけを採点する。料金・還元・補償などの事実値は
 * ここで判定・捏造しない（正誤は商材ナレッジと公式情報の責務）。
 * 本番の AI 評価は Edge Function 側に置き、ここはデモで確実に動く土台とする。
 * 決定的（同じ入力なら同じ出力）にして Vitest で境界を検証する。
 */

function hasAny(text: string, keywords: readonly string[]): boolean {
  return keywords.some((k) => text.includes(k));
}

function countSignals(text: string, keywords: readonly string[]): number {
  return keywords.reduce((n, k) => (text.includes(k) ? n + 1 : n), 0);
}

const clamp = (n: number, min = 0, max = 100) => Math.min(max, Math.max(min, n));

// ===== 顧客（モック）=====

// 具体額を伴わない値下げ提案の匂い（例「割引で安くなります」）。
const PRICE_SIGNALS = ["ポイント", "割引", "還元", "％", "%", "安く", "お得", "月額", "年会費"];
const CLOSE_SIGNALS = [
  "今回",
  "お手続き",
  "進めましょう",
  "始めましょう",
  "切り替え",
  "お作り",
  "この場で",
  "決めて",
  "申し込",
];
const GREETING_SIGNALS = ["こんにちは", "失礼します", "お疲れ", "はじめまして", "よろしく"];

// ---- 質問トピックの判定キーワード（ヒアリングの意図を読む）----
const TOPIC_FEE = ["月額", "料金", "いくら", "おいくら", "支払", "払って", "月々", "何円", "円くらい"];
const TOPIC_DATA = ["ギガ", "GB", "ＧＢ", "データ", "容量", "通信量", "何ギガ"];
const TOPIC_HOUSEHOLD = ["家族", "世帯", "何人", "何回線", "台数", "お一人", "おひとり", "誰が", "ご家族"];
const TOPIC_PAIN = ["不満", "困り", "お困り", "気になる", "遅い", "電池", "バッテリー", "悩み", "不便"];
const TOPIC_CURRENT = ["お使い", "どちら", "どこの", "キャリア", "今の", "使って", "ご利用"];
const QUESTION_WORDS = ["どちら", "どれくらい", "どのくらい", "いくら", "おいくら", "何ギガ", "何円", "教えて"];

/** 3桁以上＋「円」を金額として拾う（カンマは無視）。見つからなければ null。 */
function extractOfferedYen(text: string): number | null {
  const m = text.replace(/,/g, "").match(/(\d{3,6})\s*円/);
  return m ? Number(m[1]) : null;
}

/** ロケール非依存の 3 桁区切り（決定的にするため toLocaleString は使わない）。 */
function yen(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 疑問文かどうか（「？」/「〜か」/明示的な疑問語）。「安くなります」等の平叙文は除外。 */
function isQuestion(text: string): boolean {
  if (text.includes("？") || text.includes("?")) return true;
  if (/(です|ます|しょう|ありま|でき|いかが)か/.test(text)) return true;
  return hasAny(text, QUESTION_WORDS);
}

/** 現状のざっくり共有（フォールバック）。ペルソナがあれば具体値を混ぜる。 */
function shareInfo(s: Scenario): string {
  const p = s.persona;
  if (p) {
    return (
      `今は${s.carrier}を使っていて、${p.household}です。` +
      `${p.dataUsage}で、正直あまり気にしたことはなかったですね。`
    );
  }
  return (
    `今は${s.carrier}を使っていて、${s.familyType}なんです。` +
    `ネットは${s.internetLine}で、正直あまり気にしたことはなかったですね。`
  );
}

/** ヒアリングの質問に、ペルソナの具体値で一貫して答える。 */
function answerQuestion(s: Scenario, t: string): string {
  const p = s.persona;
  if (hasAny(t, TOPIC_FEE)) {
    return p
      ? `今は${p.household}で、だいたい月${yen(p.monthlyFee)}円くらいですね。`
      : `今は${s.carrier}で、料金はあまり気にしたことがなかったですね。`;
  }
  if (hasAny(t, TOPIC_DATA)) {
    return p ? `データは${p.dataUsage}ですね。足りないほどではないです。` : "データ量はあまり意識したことがないですね。";
  }
  if (hasAny(t, TOPIC_HOUSEHOLD)) {
    return p ? `うちは${p.household}です。` : `${s.familyType}ですね。`;
  }
  if (hasAny(t, TOPIC_PAIN)) {
    return p ? `強いて言えば、${p.painPoint}くらいですかね。` : "特に困ってはいないんですよ。";
  }
  if (hasAny(t, TOPIC_CURRENT)) {
    return p
      ? `今は${s.carrier}を使っていて、${p.household}です。ネットは${s.internetLine}ですね。`
      : `今は${s.carrier}で、${s.familyType}です。ネットは${s.internetLine}です。`;
  }
  return shareInfo(s);
}

/** 具体的な金額提示に、今の支払い（ペルソナ）と比べて反応する。 */
function reactToOffer(s: Scenario, difficulty: number, offered: number): string {
  const high = s.resistance === "高い" || difficulty >= 7;
  const p = s.persona;
  if (p) {
    const now = p.monthlyFee;
    if (offered < now) {
      return high
        ? `${yen(offered)}円ですか…今が${yen(now)}円なので、本当にそんなに下がるなら気になりますけど、裏がないか心配ですね。`
        : `${yen(offered)}円ですか。今より${yen(now - offered)}円くらい安くなりますね、それはいいかも。`;
    }
    if (offered > now) {
      return `${yen(offered)}円ですか。今が${yen(now)}円なので、それだと高くなっちゃいますね。`;
    }
    return `${yen(offered)}円だと、今とあまり変わらない感じですね。`;
  }
  return high
    ? `${yen(offered)}円ですか。本当にその金額で収まるんですか。`
    : `${yen(offered)}円なら、ちょっと気になりますね。`;
}

/** 会話の最初の顧客発話（モール通行中・他社利用・乗り換え未経験を前提）。 */
export function customerOpening(scenario: Scenario, difficulty: number): string {
  const guarded = scenario.resistance === "高い" || difficulty >= 7;
  const curious = scenario.interest === "高い";
  if (guarded && !curious) {
    return "（歩きながら）あ、大丈夫です。今ちょっと急いでいるので。";
  }
  if (guarded && curious) {
    return "うーん、話だけなら。でも乗り換えとかは考えてないですよ。";
  }
  if (curious) {
    return `あ、ちょっと気になってたんですよね。今は${scenario.carrier}を使ってるんですけど。`;
  }
  return "なんですか、スマホのご案内ですか。";
}

/** 研修生の発話に対する顧客の返答（決定的なヒューリスティック）。 */
export function customerReply(input: {
  scenario: Scenario;
  difficulty: number;
  history: ChatMessage[];
  message: string;
}): string {
  const { scenario, difficulty, history, message } = input;
  const t = message;
  const high = scenario.resistance === "高い" || difficulty >= 7;

  // 1) クロージングを急がれたら
  if (hasAny(t, CLOSE_SIGNALS)) {
    return high
      ? "いや、その場ですぐには決められないです。家族にも相談しないと。"
      : "そこまで言ってもらえるなら、ちょっと前向きに考えてみてもいいかな。";
  }

  // 2) 質問には、現状（料金・データ・世帯・不満・キャリア）を具体的に答える
  if (isQuestion(t)) {
    return answerQuestion(scenario, t);
  }

  // 3) 具体的な金額を提示されたら、今の支払いと比べて反応する（同じ疑問を繰り返さない）
  const offered = extractOfferedYen(t);
  if (offered !== null) {
    return reactToOffer(scenario, difficulty, offered);
  }

  // 4) 具体額のない値下げ提案は、警戒度に応じて疑う／少し気になる
  if (hasAny(t, PRICE_SIGNALS)) {
    return high
      ? "正直、今より高くなるのは嫌ですね。本当に下がるんですか。"
      : "へえ、それで今より下がるなら少し気になりますね。";
  }

  // 5) 困りごと・不満に触れられたら、ペルソナの痛点で受ける
  if (scenario.persona && hasAny(t, TOPIC_PAIN)) {
    return `そうですね、${scenario.persona.painPoint}。それが解決するなら聞いてみたいです。`;
  }

  // 6) あいさつ
  if (hasAny(t, GREETING_SIGNALS) && history.length <= 1) {
    return high ? "はあ、どうも。" : "こんにちは。";
  }

  // 7) それ以外：警戒度と会話の進み具合で少し表情を変える
  if (high) {
    return history.length >= 4
      ? "うーん、言いたいことは分かるんですけど、まだ決めきれないですね。"
      : "ふーん、そうなんですね。でも今ので特に困ってはいないんですよ。";
  }
  return history.length >= 4
    ? "なるほど、だいぶ分かってきました。もう少し詳しく聞いてもいいですか。"
    : "へえ、そうなんですね。続けてください。";
}

// ===== 評価（ヒューリスティック）=====

/** 各評価項目の「望ましい振る舞い」を表すシグナル語。事実の正誤は見ない。 */
const ITEM_SIGNALS: Record<string, readonly string[]> = {
  greeting: ["こんにちは", "失礼します", "お疲れ", "ありがとうございます", "よろしくお願い"],
  icebreak: [
    "お買い物",
    "お出かけ",
    "お忙しい",
    "ついで",
    "通りがかり",
    "景品",
    "アプリ",
    "お時間",
  ],
  hearing: [
    "お使い",
    "どちら",
    "どのくらい",
    "毎月",
    "いくら",
    "ギガ",
    "教えて",
    "ありますか",
    "でしょうか",
  ],
  discover: [
    "不満",
    "お困り",
    "遅い",
    "電池",
    "バッテリー",
    "足りない",
    "気になる",
    "我慢",
    "ストレス",
  ],
  product: [
    "dカード",
    "GOLD",
    "PLATINUM",
    "ドコモ光",
    "home 5G",
    "でんき",
    "ガス",
    "MAX",
    "ポイ活",
    "プラン",
  ],
  fit: ["お客様", "使い方", "合わせ", "ぴったり", "に合う", "ご家族", "世帯", "ライフスタイル"],
  numbers: ["円", "ポイント", "％", "%", "割引", "還元", "年間", "月額", "万"],
  objection: [
    "確かに",
    "おっしゃる",
    "そうですよね",
    "ただ",
    "一緒に",
    "なるほど",
    "わかります",
    "ご不安",
  ],
  closing: [
    "今回",
    "お手続き",
    "進めましょう",
    "いかがでしょう",
    "始めましょう",
    "切り替え",
    "ご案内",
    "お作り",
  ],
  next: ["次回", "後日", "また", "ご来店", "確認しておき", "書類", "ご連絡", "お調べ", "お持ち"],
};

/** コンプライアンス違反語（顧客のパスワード・暗証番号を代わりに扱う等）。 */
const COMPLIANCE_VIOLATIONS = [
  "パスワードを入力します",
  "パスワードを教え",
  "暗証番号を教え",
  "暗証番号を入力します",
  "認証コードを教え",
  "代わりに入力",
  "私が入力します",
  "こちらで入力します",
];
const COMPLIANCE_GOOD = ["本人確認", "ご本人", "書類", "お客様ご自身", "ご自身で入力"];

/** キーワード型の項目：シグナル数に応じて 30→100 で段階加点。 */
function signalScore(text: string, keywords: readonly string[]): number {
  return clamp(30 + countSignals(text, keywords) * 22);
}

/** 分かりやすさ：発話の長さ・ターン数から構造を推定（事実は見ない）。 */
function clarityScore(helperMessages: string[]): number {
  if (helperMessages.length === 0) return 30;
  const avg = helperMessages.reduce((n, m) => n + m.length, 0) / helperMessages.length;
  let score: number;
  if (avg < 8)
    score = 40; // 短すぎて情報がない
  else if (avg > 220)
    score = 55; // 長すぎて要点がぼやける
  else score = 85; // 適度な長さ
  if (helperMessages.length >= 3) score += 15; // 対話が継続している
  return clamp(score);
}

/** コンプライアンス：原則満点。違反語で大きく減点、本人確認の言及で加点。 */
function complianceScore(text: string): number {
  let score = 85;
  if (hasAny(text, COMPLIANCE_GOOD)) score += 10;
  if (hasAny(text, COMPLIANCE_VIOLATIONS)) score -= 65;
  return clamp(score);
}

const FEEDBACK_TIPS: Record<string, string> = {
  greeting: "最初の挨拶と名乗りで警戒を解き、話してよい相手になりましょう。",
  icebreak: "いきなり本題に入らず、景品やお困りごとなど受け取りやすい一言で足を止めましょう。",
  hearing: "現在のキャリア・毎月の料金・ギガの過不足を、雑談の流れで質問して引き出しましょう。",
  discover: "動作の遅さ・電池・料金など、お客様が我慢している不満を一緒に見つけましょう。",
  product: "料金プラン・dカード・光・home 5G など、合いそうな商材を具体名で提示しましょう。",
  fit: "お客様の使い方に合わせて、なぜそれが合うのかを結びつけて提案しましょう。",
  numbers: "割引・ポイント・実質額を数字で示しましょう（値は必ず公式情報で確認）。",
  clarity: "一文を短く区切り、要点を一つずつ。長すぎる説明は要点がぼやけます。",
  objection: "反論はまず受け止めてから、一緒に確認する流れで切り返しましょう。",
  closing: "次の一歩（お手続き・切り替え）を、前向きな未来とともに具体的に促しましょう。",
  compliance: "パスワードや認証コードはお客様ご自身に入力いただき、本人確認書類も確認しましょう。",
  next: "その場で決まらなくても、書類準備や再来店など次アクションを残しましょう。",
};

/**
 * 会話全体を評価する（決定的）。事実の正誤ではなく振る舞いを採点する。
 * scenario / difficulty は SessionInput と揃えるため受け取るが、現状の採点では未使用
 * （将来、難易度に応じた採点係数などの拡張余地として保持）。
 */
export function evaluateRoleplay(input: {
  scenario: Scenario;
  difficulty: number;
  transcript: ChatMessage[];
}): Evaluation {
  const helperMessages = input.transcript.filter((m) => m.role === "helper").map((m) => m.content);
  const text = helperMessages.join("\n");

  const items: EvalItemScore[] = EVAL_ITEMS.map((item) => {
    let score: number;
    if (item.key === "clarity") score = clarityScore(helperMessages);
    else if (item.key === "compliance") score = complianceScore(text);
    else score = signalScore(text, ITEM_SIGNALS[item.key] ?? []);
    return { key: item.key, label: item.label, score };
  });

  const score =
    items.length === 0 ? 0 : Math.round(items.reduce((n, i) => n + i.score, 0) / items.length);
  const rank: Grade = gradeOf(score);

  const feedback = items
    .filter((i) => i.score < 70)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((i) => FEEDBACK_TIPS[i.key] ?? `${i.label}を意識して改善しましょう。`);

  if (feedback.length === 0) {
    feedback.push("全体的に良い流れです。数値は必ず公式情報で確認し、自信を持って提案しましょう。");
  }

  return { items, score, rank, feedback };
}
