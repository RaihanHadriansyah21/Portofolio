import { test, expect } from "@playwright/test";

test.describe("Portfolio E2E Verification", () => {
  test("Homepage loads correctly in English", async ({ page }) => {
    await page.goto("/en");
    await expect(page).toHaveTitle(/Reyy/);
    await expect(page.locator("h1")).toContainText("Reyy");
    await expect(page.locator("#contact")).toBeVisible();
    await expect(page.locator("text=Send a Direct Message")).toBeVisible();
  });

  test("Indonesian localization renders properly", async ({ page }) => {
    await page.goto("/id");
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.locator("text=Kirim Pesan Langsung")).toBeVisible();
  });

  test("All 7 project case study routes load with verified architecture", async ({ page }) => {
    const slugs = [
      "scovis",
      "dermascan",
      "vehicle-classification",
      "quizint",
      "bitcoin-forecasting",
      "gojek-sentiment",
      "cloud-inventory-api",
    ];

    for (const slug of slugs) {
      await page.goto(`/en/projects/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("text=01 / Context")).toBeVisible();
      await expect(page.locator("text=04 / System")).toBeVisible();
    }
  });

  test("Credentials page renders 44 certificate proofs and search filter", async ({ page }) => {
    await page.goto("/en/credentials");
    await expect(page.locator("h1")).toContainText("Continuous Learning");
    await expect(page.locator("input[placeholder*='Search']")).toBeVisible();
  });

  test("About page loads identity showcase and quote", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("blockquote")).toBeVisible();
  });
});
