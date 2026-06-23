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

  it("テキストロープレを開始→送信→評価まで一巡できる", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /研修生として入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });

    await clickHref(user, "/roleplay");
    await screen.findByRole("heading", { name: "ロープレ設定" });

    // テキストロープレ開始（デモはモックで動く）→ 顧客の最初の発話が出る
    await user.click(screen.getByRole("button", { name: /テキストロープレを開始/ }));
    expect(await screen.findByText("お客様", {}, { timeout: 3000 })).toBeInTheDocument();

    // 研修生の発話を送信 → 顧客が返答する（メッセージが増える）
    const field = screen.getByLabelText("お客様への発話");
    await user.type(field, "こんにちは、今お使いのスマホはどちらですか");
    await user.click(screen.getByRole("button", { name: /送信/ }));
    await screen.findByText(/今は.*を使っていて/, {}, { timeout: 3000 });

    // 終了して評価 → 結果画面（総合評価・ランク）に遷移
    await user.click(screen.getByRole("button", { name: /終了して評価する/ }));
    expect(
      await screen.findByRole("heading", { name: "ロープレ評価" }, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.getByText("総合評価")).toBeInTheDocument();
  });

  it("SVは承認可能な研修生をクローザー認定でき、状態が反映される", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /SVとして入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });

    // SVダッシュボードへ → メンバー一覧
    await clickHref(user, "/sv");
    await screen.findByRole("heading", { name: "SVダッシュボード" });

    // 承認可能な研修生（t-1 田中 太郎）の詳細へ
    await clickHref(user, "/sv/t-1");
    await screen.findByRole("heading", { name: "田中 太郎" });

    // 承認 → 確認 → 実行
    await user.click(screen.getByRole("button", { name: /クローザーとして承認/ }));
    await user.click(screen.getByRole("button", { name: "承認する" }));

    // 認定済み状態が表示される
    expect(await screen.findByText(/認定クローザー（Lv.10）/)).toBeInTheDocument();
  });

  it("認定済みの研修生には承認ボタンが出ない（二重承認防止）", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /SVとして入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });

    await clickHref(user, "/sv");
    await screen.findByRole("heading", { name: "SVダッシュボード" });
    // t-4（山本 結衣）は認定済み（Lv.10）
    await clickHref(user, "/sv/t-4");
    await screen.findByRole("heading", { name: "山本 結衣" });
    expect(await screen.findByText(/認定クローザー（Lv.10）/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /クローザーとして承認/ })).toBeNull();
  });

  it("研修生は /sv に入れずダッシュボードへ戻される", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /研修生として入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });
    // 研修生に SV リンクは出ない
    expect(document.querySelector('a[href="/sv"]')).toBeNull();
    // 直接遷移しても弾かれて学習側に戻る
    window.history.pushState({}, "", "/sv");
    expect(await screen.findByRole("heading", { name: "ダッシュボード" })).toBeInTheDocument();
  });

  it("コンプラ（合格点100）を全問正解すると合格になる", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("button", { name: /研修生として入る/ }));
    await screen.findByRole("heading", { name: "ダッシュボード" });
    await clickHref(user, "/roadmap");
    await screen.findByRole("heading", { name: "研修ロードマップ" });
    await user.click(document.querySelector('a[href="/quiz/p1m4"]') as HTMLElement);

    const qs = quizForModule("p1m4");
    for (const q of qs) {
      const inputs = document.querySelectorAll(`input[name="${q.id}"]`);
      await user.click(inputs[q.correct[0]] as HTMLElement);
    }
    await user.click(screen.getByRole("button", { name: /採点する/ }));
    expect(await screen.findByText("合格しました")).toBeInTheDocument();
  });
});
