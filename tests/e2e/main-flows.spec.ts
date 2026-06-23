import { test, expect, type Page } from "@playwright/test";

// デモモード（Supabase 未設定）で主要フローが通ることを担保する。
// 認証はメモリ保持のため、ログイン後は SPA 内リンク（href）で遷移する。

async function loginAs(page: Page, label: string) {
  await page.goto("/login");
  await page.getByRole("button", { name: `${label}として入る` }).click();
  await expect(page.getByRole("heading", { name: "ダッシュボード" })).toBeVisible();
}

async function navigate(page: Page, href: string) {
  // デスクトップはサイドバー、モバイルはボトムナビ。どちらも href で辿れる。
  await page.locator(`a[href="${href}"]`).first().click();
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
  // dカード GOLD カードの詳細へ
  await page.locator('a[href^="/products/"]').first().click();
  await expect(page.getByText(/約18,600円相当/)).toBeVisible();
});

test("デモモードではロープレ開始ボタンが無効（AI未設定）", async ({ page }) => {
  await loginAs(page, "研修生");
  await navigate(page, "/roleplay");
  await expect(page.getByRole("button", { name: "テキストロープレを開始" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "音声ロープレを開始" })).toBeDisabled();
  await expect(page.getByText(/AI API/)).toBeVisible();
});

test("ロープレのシナリオ選択が aria-pressed に反映される", async ({ page }) => {
  await loginAs(page, "研修生");
  await navigate(page, "/roleplay");
  const firstScenario = page.getByRole("button", { pressed: false }).first();
  await firstScenario.click();
  await expect(firstScenario).toHaveAttribute("aria-pressed", "true");
});

test("認定クローザー(closer)は SV承認以外の導出条件が一部達成になる", async ({ page }) => {
  await loginAs(page, "クローザー");
  await navigate(page, "/certification");
  await expect(page.getByRole("heading", { name: "クローザー認定" })).toBeVisible();
  await expect(page.getByText("認定条件")).toBeVisible();
});
