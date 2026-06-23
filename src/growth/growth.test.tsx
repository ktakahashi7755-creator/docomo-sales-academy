import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { GrowthDashboard } from "@/growth/GrowthDashboard";

// Provide Growth Academy ダッシュボードが実行時エラーなく描画されることを担保する。
// ルーター非依存（リンクではなくボタン）なので単独レンダリングで検証できる。

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Provide Growth Academy ダッシュボード", () => {
  it("実行時エラーなく主要セクションが描画される", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<GrowthDashboard />);

    // ブランド名はサイドバーとヘッダーの両方に出る
    expect(screen.getAllByText("Provide Growth Academy").length).toBeGreaterThanOrEqual(1);
    // 主要セクション
    expect(screen.getByText("現在のカリキュラム")).toBeInTheDocument();
    expect(screen.getByText("学習ステップ")).toBeInTheDocument();
    expect(screen.getByText("このステップのゴール")).toBeInTheDocument();
    expect(screen.getByText("今後のスケジュール")).toBeInTheDocument();
    expect(screen.getByText("学習サポート")).toBeInTheDocument();
    expect(screen.getByText("おすすめコンテンツ")).toBeInTheDocument();
    // 5ステップと主要CTA
    expect(screen.getByText("販売の基本を学ぶ")).toBeInTheDocument();
    expect(screen.getByText("実践・自立")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /続きから学習する/ })).toBeInTheDocument();

    const realErrors = errorSpy.mock.calls.filter(
      (c) => !String(c[0] ?? "").includes("not wrapped in act"),
    );
    expect(realErrors).toEqual([]);
  });
});
