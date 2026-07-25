import { describe, it, expect } from "vitest";
import { customerOpening, customerReply, evaluateRoleplay } from "@/lib/roleplay";
import { gradeOf } from "@/lib/progress";
import { EVAL_ITEMS, SCENARIOS } from "@/data/seed";
import type { ChatMessage } from "@/lib/ai/types";
import type { Scenario } from "@/lib/types";

const scenario = (over: Partial<Scenario> = {}): Scenario => ({
  id: "t",
  no: 0,
  title: "テスト",
  carrier: "au",
  familyType: "一人利用",
  internetLine: "未契約",
  interest: "普通",
  resistance: "普通",
  difficulty: 5,
  goal: "テスト",
  ...over,
});

const helper = (content: string): ChatMessage => ({ role: "helper", content });
const customer = (content: string): ChatMessage => ({ role: "customer", content });

describe("customerOpening", () => {
  it("空でない発話を返す", () => {
    for (const s of SCENARIOS) {
      expect(customerOpening(s, s.difficulty).length).toBeGreaterThan(0);
    }
  });
  it("警戒が高い／難易度7以上は素直に乗ってこない", () => {
    const s = scenario({ resistance: "高い", interest: "普通" });
    expect(customerOpening(s, 8)).toContain("急いで");
  });
  it("関心が高いと現状を少し話す入口になる", () => {
    const s = scenario({ resistance: "低い", interest: "高い", carrier: "楽天モバイル" });
    expect(customerOpening(s, 3)).toContain("楽天モバイル");
  });
  it("決定的（同じ入力なら同じ出力）", () => {
    const s = scenario();
    expect(customerOpening(s, 5)).toBe(customerOpening(s, 5));
  });
});

describe("customerReply", () => {
  it("質問には現状（キャリア・世帯・回線）を答える", () => {
    const s = scenario({ carrier: "ソフトバンク", internetLine: "ソフトバンク光" });
    const r = customerReply({
      scenario: s,
      difficulty: 3,
      history: [],
      message: "今どちらをお使いですか？",
    });
    expect(r).toContain("ソフトバンク");
  });
  it("警戒が高い相手にクロージングを急ぐと保留される", () => {
    const s = scenario({ resistance: "高い" });
    const r = customerReply({
      scenario: s,
      difficulty: 8,
      history: [],
      message: "今回お手続きを進めましょう",
    });
    expect(r).toContain("決められない");
  });
  it("警戒が高い相手に価格の話をすると値下げを疑う", () => {
    const s = scenario({ resistance: "高い" });
    const r = customerReply({
      scenario: s,
      difficulty: 7,
      history: [],
      message: "毎月の料金が割引で安くなります",
    });
    expect(r).toContain("高くなる");
  });
  it("決定的（同じ入力なら同じ出力）", () => {
    const s = scenario();
    const args = { scenario: s, difficulty: 5, history: [], message: "こんにちは" };
    expect(customerReply(args)).toBe(customerReply(args));
  });

  // ---- ペルソナに基づく一貫応答（ヒアリングのズレ対策）----
  const persona11 = {
    monthlyFee: 8500,
    dataUsage: "毎月20GBくらい",
    household: "自分ひとりの1回線",
    painPoint: "特に困っていない",
    switchBarrier: "乗り換えが不安",
    personality: "警戒心が強い",
  } as const;

  it("料金を聞かれたらペルソナの今の月額で答える", () => {
    const s = scenario({ resistance: "高い", persona: { ...persona11 } });
    const r = customerReply({
      scenario: s,
      difficulty: 8,
      history: [],
      message: "月額はどれくらいになっていますか？",
    });
    expect(r).toContain("8,500");
  });

  it("データ量を聞かれたらペルソナの使用量で答える", () => {
    const s = scenario({ persona: { ...persona11 } });
    const r = customerReply({
      scenario: s,
      difficulty: 5,
      history: [],
      message: "毎月のギガはどれくらい使いますか？",
    });
    expect(r).toContain("20GB");
  });

  it("『困っていることは？』を現状回答と誤爆せず、不満で受ける", () => {
    const s = scenario({
      persona: { ...persona11, painPoint: "電池の減りが早いこと" },
    });
    const r = customerReply({
      scenario: s,
      difficulty: 5,
      history: [],
      message: "今お使いで困っていることはありますか？",
    });
    expect(r).toContain("電池");
  });

  it("具体的な金額を提示されたら疑問を繰り返さず、その額に反応する", () => {
    const s = scenario({ resistance: "高い", persona: { ...persona11 } });
    const r = customerReply({
      scenario: s,
      difficulty: 8,
      history: [],
      message: "このプランなら2970円になりますよ",
    });
    expect(r).toContain("2,970");
    expect(r).not.toContain("本当に下がるんですか");
  });
});

describe("evaluateRoleplay", () => {
  it("12項目すべてを 0–100 で採点する", () => {
    const evalResult = evaluateRoleplay({
      scenario: scenario(),
      difficulty: 5,
      transcript: [helper("こんにちは")],
    });
    expect(evalResult.items).toHaveLength(EVAL_ITEMS.length);
    for (const i of evalResult.items) {
      expect(i.score).toBeGreaterThanOrEqual(0);
      expect(i.score).toBeLessThanOrEqual(100);
    }
  });

  it("発話なしは低評価（D）で改善コメントが出る", () => {
    const evalResult = evaluateRoleplay({ scenario: scenario(), difficulty: 5, transcript: [] });
    expect(evalResult.rank).toBe("D");
    expect(evalResult.score).toBeLessThan(60);
    expect(evalResult.feedback.length).toBeGreaterThan(0);
  });

  it("5ステップを一通り押さえた会話は高評価になる", () => {
    const transcript: ChatMessage[] = [
      helper("こんにちは、失礼します。お買い物の途中ですみません、少しだけお時間いただけますか。"),
      customer("はい。"),
      helper(
        "今はどちらのスマホをお使いですか。毎月のギガは足りていますか、お困りの点はありますか。",
      ),
      customer("auで、動作が遅いのが不満です。"),
      helper(
        "動作の不満、よく分かります。お客様の使い方に合わせて、料金プランやdカード、ドコモ光まで合わせてご提案できます。",
      ),
      customer("へえ。"),
      helper("毎月の割引とポイント還元で年間の負担がどれくらい変わるか、数字でお見せしますね。"),
      customer("なるほど。"),
      helper(
        "ご本人確認の書類だけ確認しつつ、今回この形でお手続きを進めましょう。難しければ後日のご来店でも大丈夫です。",
      ),
    ];
    const evalResult = evaluateRoleplay({ scenario: scenario(), difficulty: 5, transcript });
    expect(evalResult.score).toBeGreaterThanOrEqual(80);
    expect(["S", "A"]).toContain(evalResult.rank);
  });

  it("コンプライアンス違反（顧客の代わりに入力）は当該項目が大きく下がる", () => {
    const evalResult = evaluateRoleplay({
      scenario: scenario(),
      difficulty: 5,
      transcript: [helper("パスワードはこちらで入力しますね。私が入力します。")],
    });
    const compliance = evalResult.items.find((i) => i.key === "compliance");
    expect(compliance?.score).toBeLessThan(40);
  });

  it("本人確認に触れるとコンプライアンス項目が満点側になる", () => {
    const evalResult = evaluateRoleplay({
      scenario: scenario(),
      difficulty: 5,
      transcript: [helper("本人確認書類を確認し、認証はお客様ご自身で入力をお願いします。")],
    });
    const compliance = evalResult.items.find((i) => i.key === "compliance");
    expect(compliance?.score).toBe(95);
  });

  it("総合点は項目平均、ランクは gradeOf 準拠", () => {
    const transcript = [helper("こんにちは")];
    const evalResult = evaluateRoleplay({ scenario: scenario(), difficulty: 5, transcript });
    const avg = Math.round(
      evalResult.items.reduce((n, i) => n + i.score, 0) / evalResult.items.length,
    );
    expect(evalResult.score).toBe(avg);
  });

  it("ランク判定は gradeOf に委譲（複数の会話で常に一致）", () => {
    const transcripts: ChatMessage[][] = [
      [],
      [helper("こんにちは")],
      [helper("今お使いのスマホはどちらですか、毎月のギガは足りていますか")],
      [
        helper("こんにちは、失礼します。お時間少しいいですか。"),
        helper("お客様の使い方に合わせてdカードやドコモ光、料金プランをご提案できます。"),
        helper("割引とポイント還元で年間の負担がどう変わるか数字でお見せします。"),
        helper("本人確認のうえ、今回この形でお手続きを進めましょう。後日のご来店でも大丈夫です。"),
      ],
    ];
    for (const transcript of transcripts) {
      const r = evaluateRoleplay({ scenario: scenario(), difficulty: 5, transcript });
      expect(r.rank).toBe(gradeOf(r.score));
    }
  });

  it("決定的（同じ会話なら同じ評価）", () => {
    const transcript = [helper("こんにちは、今お使いのスマホはどちらですか")];
    const a = evaluateRoleplay({ scenario: scenario(), difficulty: 5, transcript });
    const b = evaluateRoleplay({ scenario: scenario(), difficulty: 5, transcript });
    expect(a).toEqual(b);
  });
});
