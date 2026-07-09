import { test, expect, type Page } from "@playwright/test";

// Provide Growth Academy（フロント完結デモ）の主要フローを実機ブラウザで担保する。

async function nav(page: Page, href: string) {
  // デスクトップはサイドバー、モバイルはボトムナビ。表示中のリンクのみ対象。
  await page.locator(`a[href="${href}"]:visible`).first().click();
}

/** 入室ゲートを通過する（未入室のときのみ表示される）。 */
async function enterApp(page: Page) {
  const enterButton = page.getByRole("button", { name: "入室する" });
  await expect(enterButton).toBeVisible();
  await enterButton.click();
}

/** 指定パスへ入室済み状態で到達する。 */
async function gotoEntered(page: Page, path: string) {
  await page.goto(path);
  const enterButton = page.getByRole("button", { name: "入室する" });
  if (await enterButton.isVisible().catch(() => false)) {
    await enterButton.click();
  }
}

test("入室してダッシュボードが表示される", async ({ page }) => {
  await page.goto("/");
  // 役割選択のない、シンプルな入室画面
  await expect(page.getByRole("heading", { name: "Provide Growth Academy" })).toBeVisible();
  await expect(page.getByText(/SVとして/)).toHaveCount(0);
  await enterApp(page);
  await expect(page.getByText("現在のカリキュラム")).toBeVisible();
});

test("名前を入れて入室するとヘッダーに反映される", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel(/おなまえ/).fill("高橋 一郎");
  await enterApp(page);
  // sm(640px)以上は氏名、未満はアバターの頭文字が表示される。
  const width = page.viewportSize()?.width ?? 0;
  if (width >= 640) {
    await expect(page.getByText("高橋 一郎 さん")).toBeVisible();
  } else {
    await expect(page.getByText("高", { exact: true })).toBeVisible();
  }
});

test("主要タブをナビゲートできる", async ({ page }) => {
  await gotoEntered(page, "/");
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
  await gotoEntered(page, "/content/l2-3");
  await expect(page.getByRole("heading", { name: "ヒアリングの型と深掘り" })).toBeVisible();
  await page.getByRole("button", { name: /完了にする/ }).click();
  await expect(page.getByText(/完了しています/)).toBeVisible();
});

test("AIサポートBotを開ける", async ({ page }) => {
  await gotoEntered(page, "/");
  await expect(page.getByText("現在のカリキュラム")).toBeVisible();
  // lg(1024px)以上はサイドバーの「相談する」、未満はフローティングのFABが表示される。
  // viewport 幅で起動ボタンを決定的に選び、表示を待ってからクリックする。
  const width = page.viewportSize()?.width ?? 0;
  const trigger =
    width >= 1024
      ? page.getByRole("button", { name: "相談する", exact: true })
      : page.getByRole("button", { name: "AIサポートBotを開く" });
  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("dialog", { name: "AIサポートBot" })).toBeVisible();
});

test("ログアウトすると入室画面に戻る", async ({ page }) => {
  await gotoEntered(page, "/");
  await expect(page.getByText("現在のカリキュラム")).toBeVisible();
  await page.getByRole("button", { name: "ログアウト" }).click();
  await expect(page.getByRole("button", { name: "入室する" })).toBeVisible();
});
