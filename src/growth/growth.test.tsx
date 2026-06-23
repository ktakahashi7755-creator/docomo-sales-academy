import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { quizForModule } from "@/data/quiz";

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
    await user.click(screen.getByRole("button", { name: /完了にする/ }));
    expect(await screen.findByText(/完了しています/)).toBeInTheDocument();

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
