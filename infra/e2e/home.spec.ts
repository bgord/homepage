import { expect, test } from "@playwright/test";

test("Homepage", async ({ page }) => {
  await page.goto("/");

  const header = page.getByText("Homepage");
  await expect(header).toBeVisible();
});
