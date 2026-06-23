import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { quizForModule } from "@/data/quiz";

// デモモード（Supabase 未設定）で全画面が実行時エラーなく描画・遷移できることを担保する。
// ブラウザ無しの環境でもランタイムクラッシュを検出するためのスモークテスト。

async function clickHref(user: ReturnType<typeof userEvent.setup>, href: string) {
  const link = document.querySelector(`a[href="${href}"]`);
  expect(link, `link ${href} should exist`).not.toBeNull();
  await user.click(link as HTMLElement);
}

async function clickFirst(user: ReturnType<typeof userEvent.setup>, selector: string) {
  const el = document.querySelector(selector);
  expect(el, `element ${selector} should exist`).not.toBeNull();
  await user.click(el as HTMLElement);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("smoke: デモモードで全9画面が落ちずに描画・遷移できる", () => {
  it("ログイン → 9画面を一巡しても実行時エラーが出ない", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();
    render(<App />);

    // Login（デモ）
    expect(await screen.findByRole("heading", { name: "ログイン" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /研修生として入る/ }));

    // Dashboard
    expect(await screen.findByRole("heading", { name: "ダッシュボード" })).toBeInTheDocument();

    // Roadmap
    await clickHref(user, "/roadmap");
    expect(await screen.findByRole("heading", { name: "研修ロードマップ" })).toBeInTheDocument();

    // Products
    await clickHref(user, "/products");
    expect(await screen.findByRole("heading", { name: "商材ナレッジ" })).toBeInTheDocument();

    // ProductDetail（最初の商材）
    await clickFirst(user, 'a[href^="/products/"]');
    expect(await screen.findByText("公式ページを開く")).toBeInTheDocument();

    // TalkScripts
    await clickHref(user, "/scripts");
    expect(await screen.findByRole("heading", { name: "トークスクリプト集" })).toBeInTheDocument();

    // TalkScriptDetail（最初のトーク）
    await clickFirst(user, 'a[href^="/scripts/"]');
    expect(await screen.findByText("このトークでロープレを始める")).toBeInTheDocument();

    // Roleplay
    await clickHref(user, "/roleplay");
    expect(await screen.findByRole("heading", { name: "ロープレ設定" })).toBeInTheDocument();

    // Certification
    await clickHref(user, "/certification");
    expect(await screen.findByRole("heading", { name: "クローザー認定" })).toBeInTheDocument();

    // React の実行時エラー（key 警告以外の error）が出ていないこと
    const realErrors = errorSpy.mock.calls.filter(
      (c) => !String(c[0] ?? "").includes("not wrapped in act"),
    );
    expect(realErrors).toEqual([]);
  });

  it("非管理者は /admin に入れずダッシュボードへ戻される", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /研修生として入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });
    // 研修生に管理画面リンクは出ない
    expect(document.querySelector('a[href="/admin"]')).toBeNull();
    // 直接遷移しても弾かれて学習側に戻る
    window.history.pushState({}, "", "/admin");
    expect(await screen.findByRole("heading", { name: "ダッシュボード" })).toBeInTheDocument();
  });

  it("管理者は商材を編集でき、学習側の商材詳細に反映される", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /管理者として入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });

    // 管理画面 → 商材 → 最初の商材を編集
    await user.click(document.querySelector('a[href="/admin"]') as HTMLElement);
    expect(await screen.findByRole("heading", { name: "概要" })).toBeInTheDocument();
    await user.click(document.querySelector('a[href="/admin/products"]') as HTMLElement);
    await screen.findByRole("heading", { name: "商材の管理" });
    await user.click(document.querySelector('a[href^="/admin/products/"]') as HTMLElement);

    // 「ひとこと説明」をラベルで特定して書き換えて保存
    const oneLiner = await screen.findByLabelText("ひとこと説明");
    await user.clear(oneLiner);
    await user.type(oneLiner, "スモークテスト用の説明");
    await user.click(screen.getByRole("button", { name: /保存する/ }));
    expect(await screen.findByText(/保存しました/)).toBeInTheDocument();

    // 学習側の商材一覧→詳細に反映されていること
    await user.click(document.querySelector('a[href="/"]') as HTMLElement);
    await screen.findByRole("heading", { name: "ダッシュボード" });
    await user.click(document.querySelector('a[href="/products"]') as HTMLElement);
    await screen.findByRole("heading", { name: "商材ナレッジ" });
    expect(await screen.findByText("スモークテスト用の説明")).toBeInTheDocument();
  });

  it("クイズを全問正解で合格し、進捗がロードマップに反映される", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /研修生として入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });

    // ロードマップ → p3m1（dカード）のテストを受験（デモ未受験なので「受験」リンク）
    await clickHref(user, "/roadmap");
    await screen.findByRole("heading", { name: "研修ロードマップ" });
    await user.click(document.querySelector('a[href="/quiz/p3m1"]') as HTMLElement);

    // 全問、正解の選択肢を選ぶ
    const qs = quizForModule("p3m1");
    for (const q of qs) {
      const inputs = document.querySelectorAll(`input[name="${q.id}"]`);
      await user.click(inputs[q.correct[0]] as HTMLElement);
    }
    await user.click(screen.getByRole("button", { name: /採点する/ }));
    expect(await screen.findByText("合格しました")).toBeInTheDocument();

    // ロードマップに戻ると、p3m1 が「復習」（=合格済み）になっている
    await user.click(document.querySelector('a[href="/roadmap"]') as HTMLElement);
    await screen.findByRole("heading", { name: "研修ロードマップ" });
    const link = document.querySelector('a[href="/quiz/p3m1"]');
    expect(link?.textContent).toContain("復習");
  });
});
