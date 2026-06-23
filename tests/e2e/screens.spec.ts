import { test, type Page } from "@playwright/test";

// 実機確認用のスクリーンショットを9画面分撮る（mobile/desktop 両プロジェクト）。
// 出力は playwright-screens/<project>/ に保存（git 管理外）。

async function loginAs(page: Page, label: string) {
  await page.goto("/login");
  await page.getByRole("button", { name: `${label}として入る` }).click();
  await page.getByRole("heading", { name: "ダッシュボード" }).waitFor();
}

async function navigate(page: Page, href: string) {
  // 表示中（:visible）のリンクのみ（モバイルで非表示のサイドバーを掴まない）。
  await page.locator(`a[href="${href}"]:visible`).first().click();
}

test("9画面のスクリーンショット", async ({ page }, testInfo) => {
  const dir = `playwright-screens/${testInfo.project.name}`;
  const shot = async (name: string) =>
    page.screenshot({ path: `${dir}/${name}.png`, fullPage: true });

  // 1. Login
  await page.goto("/login");
  await page.getByRole("heading", { name: "ログイン" }).waitFor();
  await shot("01-login");

  // 2. Dashboard
  await loginAs(page, "研修生");
  await shot("02-dashboard");

  // 3. Roadmap
  await navigate(page, "/roadmap");
  await page.getByRole("heading", { name: "研修ロードマップ" }).waitFor();
  await shot("03-roadmap");

  // 4. Products
  await navigate(page, "/products");
  await page.getByRole("heading", { name: "商材ナレッジ" }).waitFor();
  await shot("04-products");

  // 5. ProductDetail（一覧はカテゴリ順なので dカード GOLD を href で直接開く）
  await page.locator('a[href="/products/dcard-gold"]').click();
  await page
    .getByText(/約18,600円相当/)
    .first()
    .waitFor();
  await shot("05-product-detail");

  // 6. TalkScripts
  await navigate(page, "/scripts");
  await page.getByRole("heading", { name: "トークスクリプト集" }).waitFor();
  await shot("06-scripts");

  // 7. TalkScriptDetail（「トーク一覧」を含む戻りリンクが2つあるため戻る側に限定）
  await page.locator('a[href^="/scripts/"]').first().click();
  await page.getByRole("link", { name: "トーク一覧へ戻る" }).waitFor();
  await shot("07-script-detail");

  // 8. Roleplay
  await navigate(page, "/roleplay");
  await page.getByRole("heading", { name: "ロープレ設定" }).waitFor();
  await shot("08-roleplay");

  // 9. Certification
  await navigate(page, "/certification");
  await page.getByRole("heading", { name: "クローザー認定" }).waitFor();
  await shot("09-certification");
});
