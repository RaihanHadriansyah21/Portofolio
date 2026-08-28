import { test, expect } from "@playwright/test";
import { projects } from "../lib/portfolio";

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

  test("All project case study routes load with verified architecture", async ({ page }) => {
    for (const { slug } of projects) {
      await page.goto(`/en/projects/${slug}`);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("text=01 / Context")).toBeVisible();
      await expect(page.locator("text=04 / System")).toBeVisible();
    }
  });

  test("Gojek sentiment loads interactive NLP sandbox", async ({ page }) => {
    await page.goto("/en/projects/gojek-sentiment");
    await expect(page.locator("text=INTERACTIVE NLP SANDBOX")).toBeVisible();
    await expect(page.locator("text=Overall Classification")).toBeVisible();
  });

  test("Bitcoin forecasting loads interactive Seq2Seq scrubber", async ({ page }) => {
    await page.goto("/en/projects/bitcoin-forecasting");
    await expect(page.locator("text=INTERACTIVE SEQ2SEQ SCRUBBER")).toBeVisible();
    await expect(page.locator("text=Seq2Seq (Encoder-Decoder)")).toBeVisible();
  });

  test("Homepage renders interactive availability badge and skill matrix", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator(".availability-pill.is-interactive")).toBeVisible();
    await expect(page.locator("text=Cross-Project Tech Radar")).toBeVisible();
  });

  test("Credentials page renders certificate proofs and searches certificate skills", async ({ page }) => {
    await page.goto("/en/credentials");
    await expect(page.locator("h1")).toContainText("Continuous learning with depth behind it.");
    const search = page.locator("input[placeholder*='Search']");
    await expect(search).toBeVisible();
    await search.fill("TensorFlow");
    await expect(page.locator(".certificate-gallery-card")).toHaveCount(1);
  });

  test("About page loads identity showcase and quote", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("blockquote")).toBeVisible();
  });
});
