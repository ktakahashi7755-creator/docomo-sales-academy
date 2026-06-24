import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { quizForModule } from "@/data/quiz";
import { botReply } from "@/growth/lib/bot";

// Provide Growth Academy：デモ（フロント完結）で全タブ・主要フローが
// 実行時エラーなく動くことを担保するスモークテスト。

async function clickHref(user: ReturnType<typeof userEvent.setup>, href: string) {
  const link = document.querySelector(`a[href="${href}"]`);
  expect(link, `link ${href} should exist`).not.toBeNull();
  await user.click(link as HTMLElement);
}

afterEach(() => {
  vi.restoreAllMocks();
  window.history.pushState({}, "", "/");
});

describe("Provide Growth Academy スモーク", () => {
  it("全タブを巡回し、レッスン完了とクイズ合格まで動く", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<App />);

    // ダッシュボード
    expect(screen.getAllByText("Provide Growth Academy").length).toBeGreaterThan(0);
    expect(await screen.findByText("現在のカリキュラム")).toBeInTheDocument();
    expect(screen.getByText("学習ステップ")).toBeInTheDocument();

    // カリキュラム一覧
    await clickHref(user, "/curriculum");
    expect(await screen.findByRole("heading", { name: "カリキュラム一覧" })).toBeInTheDocument();

    // 学習コンテンツ → レッスン詳細（未開始の l2-3）を完了にする
    await clickHref(user, "/content");
    expect(await screen.findByRole("heading", { name: "学習コンテンツ" })).toBeInTheDocument();
    await clickHref(user, "/content/l2-3");
    expect(
      await screen.findByRole("heading", { name: "ヒアリングの型と深掘り" }),
    ).toBeInTheDocument();
    // 濃密化セクション（会話台本・失敗リカバリー・実践課題）が描画される
    expect(screen.getByRole("heading", { name: "会話で学ぶ" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "よくある失敗とリカバリー" })).toBeInTheDocument();
    expect(screen.getByText("この回の実践課題")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /完了にする/ }));
    expect(await screen.findByText(/完了しています/)).toBeInTheDocument();

    // 現場ガイド → 4タブの切替が動く
    await clickHref(user, "/field-guide");
    expect(await screen.findByRole("heading", { name: "現場ガイド" })).toBeInTheDocument();
    expect(await screen.findByText("ファーストキャッチ")).toBeInTheDocument(); // 販売プロセス（初期）
    await user.click(screen.getByRole("button", { name: "場面別トーク" }));
    expect(await screen.findByText(/展示端末を見ている/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "ヒアリング" }));
    expect(await screen.findByText(/質問は量でなく順番/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "反論処理" }));
    expect(await screen.findByText("反論処理の基本型")).toBeInTheDocument();

    // クイズ・テスト → p1m5 を全問正解で合格
    await clickHref(user, "/quiz");
    expect(await screen.findByRole("heading", { name: "クイズ・テスト" })).toBeInTheDocument();
    await clickHref(user, "/quiz/p1m5");
    expect(await screen.findByRole("heading", { name: "販売の基本姿勢" })).toBeInTheDocument();
    for (const q of quizForModule("p1m5")) {
      const inputs = document.querySelectorAll(`input[name="${q.id}"]`);
      await user.click(inputs[q.correct[0]] as HTMLElement);
    }
    await user.click(screen.getByRole("button", { name: /採点する/ }));
    expect(await screen.findByText("合格しました")).toBeInTheDocument();

    // 実践・ロープレ
    await clickHref(user, "/roleplay");
    expect(await screen.findByRole("heading", { name: "実践・ロープレ" })).toBeInTheDocument();

    // 進捗レポート
    await clickHref(user, "/reports");
    expect(await screen.findByRole("heading", { name: "進捗レポート" })).toBeInTheDocument();

    // お知らせ
    await clickHref(user, "/announcements");
    expect(await screen.findByRole("heading", { name: "お知らせ" })).toBeInTheDocument();

    // ヘルプ・FAQ
    await clickHref(user, "/help");
    expect(await screen.findByRole("heading", { name: "ヘルプ・FAQ" })).toBeInTheDocument();

    const realErrors = errorSpy.mock.calls.filter(
      (c) => !String(c[0] ?? "").includes("not wrapped in act"),
    );
    expect(realErrors).toEqual([]);
  });

  it("AIサポートBotを開いて質問でき、応答が返る", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByText("現在のカリキュラム");

    // サイドバーの「相談する」でボットを開く
    await user.click(screen.getByRole("button", { name: "相談する" }));
    const dialog = await screen.findByRole("dialog", { name: "AIサポートBot" });
    expect(dialog).toBeInTheDocument();

    // 質問を送ると応答が返る
    await user.type(screen.getByLabelText("AIサポートBotへの質問"), "dカードの提案のコツは？");
    await user.click(screen.getByRole("button", { name: "送信" }));
    expect(await screen.findByText(/dカードは/, {}, { timeout: 2000 })).toBeInTheDocument();
  });
});

describe("AIサポートBot 応答ルール", () => {
  it("「実践課題」はロープレ応答に横取りされず、実践課題の案内を返す", () => {
    const reply = botReply("この回の実践課題のやり方は？");
    expect(reply).toMatch(/実践課題/);
  });
  it("「ロープレ」はロープレの案内を返す", () => {
    expect(botReply("ロープレってどう始める？")).toMatch(/ロープレ/);
  });
  it("「dカード」はdカードの案内を返す", () => {
    expect(botReply("dカードの提案のコツは？")).toMatch(/dカードは/);
  });
  it("「他社・楽天」は経済圏の切り返しを案内する", () => {
    expect(botReply("楽天で十分と言われたら？")).toMatch(/否定せず/);
  });
});
