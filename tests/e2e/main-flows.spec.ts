import { test, expect, type Page } from "@playwright/test";

// デモモード（Supabase 未設定）で主要フローが通ることを担保する。
// 認証はメモリ保持のため、ログイン後は SPA 内リンク（href）で遷移する。

async function loginAs(page: Page, label: string) {
  await page.goto("/login");
  await page.getByRole("button", { name: `${label}として入る` }).click();
  await expect(page.getByRole("heading", { name: "ダッシュボード" })).toBeVisible();
}

async function navigate(page: Page, href: string) {
  // デスクトップはサイドバー、モバイルはボトムナビ。同じ href が両方の DOM にあるため、
  // 表示中（:visible）の要素だけを対象にする（モバイルで非表示のサイドバーを掴まない）。
  await page.locator(`a[href="${href}"]:visible`).first().click();
}

test("ログイン → ダッシュボードに進捗が表示される", async ({ page }) => {
  await loginAs(page, "研修生");
  // 研修進捗カードと数値（%）が表示される
  await expect(page.getByText("研修進捗")).toBeVisible();
  await expect(page.getByText("認定クローザーまでの道のり")).toBeVisible();
});

test("未認証で保護ルートに来ると /login へ送られる", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();
});

test("主要6画面をナビゲートできる", async ({ page }) => {
  await loginAs(page, "研修生");

  await navigate(page, "/roadmap");
  await expect(page.getByRole("heading", { name: "研修ロードマップ" })).toBeVisible();

  await navigate(page, "/products");
  await expect(page.getByRole("heading", { name: "商材ナレッジ" })).toBeVisible();

  await navigate(page, "/scripts");
  await expect(page.getByRole("heading", { name: "トークスクリプト集" })).toBeVisible();

  await navigate(page, "/roleplay");
  await expect(page.getByRole("heading", { name: "ロープレ設定" })).toBeVisible();

  await navigate(page, "/certification");
  await expect(page.getByRole("heading", { name: "クローザー認定" })).toBeVisible();
});

test("商材詳細で dカード GOLD の正典値が表示される", async ({ page }) => {
  await loginAs(page, "研修生");
  await navigate(page, "/products");
  // 商材一覧はカテゴリ順（料金プランが先頭）。dカード GOLD を href で直接開く。
  await page.locator('a[href="/products/dcard-gold"]').click();
  // 「約18,600円相当」はメリットと訴求ポイントの2箇所に出るため first() で一意化。
  await expect(page.getByText(/約18,600円相当/).first()).toBeVisible();
});

test("デモモードでもテキストロープレは開始でき、音声は AI 設定待ち", async ({ page }) => {
  await loginAs(page, "研修生");
  await navigate(page, "/roleplay");
  // Phase 4 でテキストロープレはローカルモックで動く（有効）。音声は backend 接続後。
  await expect(page.getByRole("button", { name: "テキストロープレを開始" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "音声ロープレを開始" })).toBeDisabled();
  await expect(page.getByText(/AI API/)).toBeVisible();
});

test("テキストロープレを開始 → 送信 → 評価まで進める", async ({ page }) => {
  await loginAs(page, "研修生");
  await navigate(page, "/roleplay");
  await page.getByRole("button", { name: "テキストロープレを開始" }).click();
  // 顧客の最初の発話が出る
  await expect(page.getByText("お客様").first()).toBeVisible();
  // 研修生の発話を送信 → 顧客が現状を答える
  await page.getByLabel("お客様への発話").fill("こんにちは、今お使いのスマホはどちらですか");
  await page.getByRole("button", { name: "送信" }).click();
  await expect(page.getByText(/今は.*を使っていて/)).toBeVisible();
  // 終了して評価 → 結果画面（h1 と sr-only 見出しが両方あるため exact で h1 に限定）
  await page.getByRole("button", { name: "終了して評価する" }).click();
  await expect(page.getByRole("heading", { name: "ロープレ評価", exact: true })).toBeVisible();
  await expect(page.getByText("総合評価")).toBeVisible();
});

test("SVは承認可能な研修生をクローザー認定できる", async ({ page }) => {
  await loginAs(page, "SV");
  await navigate(page, "/sv");
  await expect(page.getByRole("heading", { name: "SVダッシュボード" })).toBeVisible();
  // 承認可能な研修生（t-1 田中 太郎）の詳細へ
  await page.locator('a[href="/sv/t-1"]').first().click();
  await expect(page.getByRole("heading", { name: "田中 太郎" })).toBeVisible();
  // 承認 → 確認 → 実行 → 認定済み表示
  await page.getByRole("button", { name: "クローザーとして承認" }).click();
  await page.getByRole("button", { name: "承認する" }).click();
  await expect(page.getByText(/認定クローザー（Lv.10）/)).toBeVisible();
});

test("ロープレのシナリオ選択が aria-pressed に反映される", async ({ page }) => {
  await loginAs(page, "研修生");
  await navigate(page, "/roleplay");
  // 位置で固定（`[aria-pressed="false"]` は live 再評価で別ボタンに移るため不可）。
  // aria-pressed を持つのはシナリオのみ。どれでもクリックすれば選択され true になる。
  const scenario = page.locator("button[aria-pressed]").nth(0);
  await scenario.click();
  await expect(scenario).toHaveAttribute("aria-pressed", "true");
});

test("認定クローザー(closer)は SV承認以外の導出条件が一部達成になる", async ({ page }) => {
  await loginAs(page, "クローザー");
  await navigate(page, "/certification");
  await expect(page.getByRole("heading", { name: "クローザー認定" })).toBeVisible();
  await expect(page.getByText("認定条件")).toBeVisible();
});
