import { test, expect, type Page } from "@playwright/test";

// Provide Growth Academy（フロント完結デモ）の主要フローを実機ブラウザで担保する。

async function nav(page: Page, href: string) {
  // デスクトップはサイドバー、モバイルはボトムナビ。表示中のリンクのみ対象。
  await page.locator(`a[href="${href}"]:visible`).first().click();
}

test("ダッシュボードが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Provide Growth Academy" })).toBeVisible();
  await expect(page.getByText("現在のカリキュラム")).toBeVisible();
});

test("主要タブをナビゲートできる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("現在のカリキュラム")).toBeVisible();
  await nav(page, "/curriculum");
  await expect(page.getByRole("heading", { name: "カリキュラム一覧" })).toBeVisible();
  await nav(page, "/content");
  await expect(page.getByRole("heading", { name: "学習コンテンツ" })).toBeVisible();
  await nav(page, "/quiz");
  await expect(page.getByRole("heading", { name: "クイズ・テスト" })).toBeVisible();
  await nav(page, "/roleplay");
  await expect(page.getByRole("heading", { name: "実践・ロープレ" })).toBeVisible();
});

test("レッスンを開いて完了にできる", async ({ page }) => {
  await page.goto("/content/l2-3");
  await expect(page.getByRole("heading", { name: "ヒアリングの型と深掘り" })).toBeVisible();
  await page.getByRole("button", { name: /完了にする/ }).click();
  await expect(page.getByText(/完了しています/)).toBeVisible();
});

test("AIサポートBotを開ける", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("現在のカリキュラム")).toBeVisible();
  // lg(1024px)以上はサイドバーの「相談する」、未満はフローティングのFABが表示される。
  // viewport 幅で起動ボタンを決定的に選び、表示を待ってからクリックする。
  const width = page.viewportSize()?.width ?? 0;
  const trigger =
    width >= 1024
      ? page.getByRole("button", { name: "相談する" })
      : page.getByRole("button", { name: "AIサポートBotを開く" });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "AIサポートBot" })).toBeVisible();
});
