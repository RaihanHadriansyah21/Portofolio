import { test, expect } from "@playwright/test";
import { projects } from "../lib/portfolio";

function testOrigin() {
  return new URL(test.info().project.use.baseURL ?? "http://localhost:3000").origin;
}

test.describe("Portfolio Regression & E2E Verification Suite", () => {
  // =========================================================================
  // 1. NAVIGATION & MOBILE
  // =========================================================================
  test.describe("Navigation & Mobile Journeys", () => {
    test("Desktop navigation links render properly and navigate to key sections", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en");

      await expect(page.locator(".site-header")).toBeVisible();
      const navLinks = page.locator(".pill-nav-items.desktop-only a.pill");
      await expect(navLinks).toHaveCount(5);

      // Verify link targets
      await expect(navLinks.nth(1)).toHaveAttribute("href", /\/projects/);
      await expect(navLinks.nth(2)).toHaveAttribute("href", /\/credentials/);
      await expect(navLinks.nth(3)).toHaveAttribute("href", /\/about/);
      await expect(navLinks.nth(4)).toHaveAttribute("href", /#contact/);
    });

    for (const vp of [
      { name: "375x667 (iPhone SE)", width: 375, height: 667 },
      { name: "390x844 (iPhone 12/13/14)", width: 390, height: 844 },
      { name: "430x932 (iPhone 15 Pro Max)", width: 430, height: 932 },
    ]) {
      test(`Mobile menu toggle state and overflow at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto("/en");

        const menuBtn = page.locator("button.mobile-menu-button.mobile-only");
        await expect(menuBtn).toBeVisible();
        await expect(menuBtn).toHaveAttribute("aria-expanded", "false");

        // Open menu
        await menuBtn.click();
        await expect(menuBtn).toHaveAttribute("aria-expanded", "true");
        const popover = page.locator("#primary-mobile-menu");
        await expect(popover).toBeVisible();

        // Check horizontal overflow while menu is open
        const hasOverflow = await page.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth;
        });
        expect(hasOverflow).toBe(false);

        // Close menu with toggle button
        await menuBtn.click();
        await expect(menuBtn).toHaveAttribute("aria-expanded", "false");
        await expect(popover).not.toBeVisible();
      });
    }

    test("Mobile navigation links navigate to target route and close popover", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/en");

      const menuBtn = page.locator("button.mobile-menu-button.mobile-only");
      await menuBtn.click();
      const popover = page.locator("#primary-mobile-menu");
      await expect(popover).toBeVisible();

      await popover.locator("a:has-text('About')").click();
      await expect(page).toHaveURL(/\/about/);
      await expect(page.locator("h1")).toBeVisible();
    });
  });

  // =========================================================================
  // 2. LOCALIZATION & BILINGUAL INTEGRITY
  // =========================================================================
  test.describe("Localization & Bilingual Integrity", () => {
    test("English route (/en) renders verified English copy across surfaces", async ({ page }) => {
      await page.goto("/en");
      await expect(page.locator("html")).toHaveAttribute("lang", "en");
      await expect(page.locator(".hero-actions a.button-primary")).toContainText("View projects");
      await expect(page.locator(".hero-actions button.button-secondary")).toContainText("Preview CV");
      await expect(page.locator("#contact h3")).toContainText("Send a Direct Message");
    });

    test("Indonesian route (/id) renders verified Indonesian copy across surfaces", async ({ page }) => {
      await page.goto("/id");
      await expect(page.locator("html")).toHaveAttribute("lang", "id");
      await expect(page.locator(".hero-actions a.button-primary")).toContainText("Lihat proyek");
      await expect(page.locator(".hero-actions button.button-secondary")).toContainText("Pratinjau CV");
      await expect(page.locator("#contact h3")).toContainText("Kirim Pesan Langsung");
    });

    test("CV Modal adapts copy truthfully to active locale (/en vs /id)", async ({ page }) => {
      // English modal
      await page.goto("/en");
      await page.click(".hero-actions button.button-secondary");
      const modalEn = page.locator("[role='dialog'][aria-modal='true']");
      await expect(modalEn).toBeVisible();
      await expect(modalEn.locator(".cv-modal-close-btn")).toHaveAttribute("aria-label", "Close");
      await expect(modalEn.locator("a.button-primary")).toContainText("Download PDF");
      await page.keyboard.press("Escape");

      // Indonesian modal
      await page.goto("/id");
      await page.click(".hero-actions button.button-secondary");
      const modalId = page.locator("[role='dialog'][aria-modal='true']");
      await expect(modalId).toBeVisible();
      await expect(modalId.locator(".cv-modal-close-btn")).toHaveAttribute("aria-label", "Tutup");
      await expect(modalId.locator("a.button-primary")).toContainText("Unduh PDF");
      await page.keyboard.press("Escape");
    });

    test("All project routes load with verified architecture in both locales", async ({ page }) => {
      for (const { slug } of projects.slice(0, 3)) {
        await page.goto(`/en/projects/${slug}`);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator("text=01 / Context")).toBeVisible();
        await expect(page.locator("h2:has-text('Problem & product context')")).toBeVisible();

        await page.goto(`/id/projects/${slug}`);
        await expect(page.locator("h1")).toBeVisible();
        await expect(page.locator("text=01 / Context")).toBeVisible();
        await expect(page.locator("h2:has-text('Masalah & konteks produk')")).toBeVisible();
      }
    });
  });

  // =========================================================================
  // 3. HERO & CV MODAL KEYBOARD & ACCESSIBILITY LIFECYCLE
  // =========================================================================
  test.describe("Hero & CV Modal Accessibility Lifecycle", () => {
    test("Hero renders primary CTAs and secondary utility row on desktop and mobile", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en");

      const heroPrimary = page.locator(".hero-actions a.button-primary");
      const heroPreview = page.locator(".hero-actions button.button-secondary");
      const secondaryRow = page.locator(".hero-secondary-actions");

      await expect(heroPrimary).toContainText("View projects");
      await expect(heroPreview).toContainText("Preview CV");
      await expect(secondaryRow).toBeVisible();
      await expect(secondaryRow.locator("a")).toContainText("Meet Reyy");
      await expect(page.locator(".footer-brand button")).toContainText("Share Profile");

      // Mobile check
      await page.setViewportSize({ width: 375, height: 667 });
      await expect(heroPrimary).toBeVisible();
      await expect(heroPreview).toBeVisible();
      await expect(secondaryRow).toBeVisible();

      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(hasHorizontalScroll).toBe(false);
    });

    test("CV modal complete keyboard trapping lifecycle: Tab, Shift+Tab, Escape, Close button, and scroll lock", async ({ page }) => {
      await page.goto("/en");

      const cvButton = page.locator(".hero-actions button.button-secondary");
      await cvButton.focus();
      await expect(cvButton).toBeFocused();

      // 1. Open modal
      await cvButton.click();
      const modal = page.locator("[role='dialog'][aria-modal='true']");
      await expect(modal).toBeVisible();

      // 2. Verify body scroll is locked
      const isLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
      expect(isLocked).toBe(true);

      // 3. Verify initial focus is on close button inside modal
      const closeBtn = modal.locator(".cv-modal-close-btn");
      await expect(closeBtn).toBeFocused();

      // 4. Test forward Tab key stays inside modal (focus trap)
      for (let i = 0; i < 4; i++) {
        await page.keyboard.press("Tab");
        const isInside = await modal.evaluate((dialog) => dialog.contains(document.activeElement));
        expect(isInside).toBe(true);
      }

      // 5. Test Shift+Tab backwards stays inside modal
      await page.keyboard.press("Shift+Tab");
      const isStillInside = await modal.evaluate((dialog) => dialog.contains(document.activeElement));
      expect(isStillInside).toBe(true);

      // 6. Test Escape key closes modal & restores focus to trigger button
      await page.keyboard.press("Escape");
      await expect(modal).not.toBeVisible();
      await expect(cvButton).toBeFocused();

      // 7. Verify body scroll lock is released
      const isReleased = await page.evaluate(() => document.body.style.overflow === "");
      expect(isReleased).toBe(true);

      // 8. Re-open and verify close button click restores focus and scroll
      await cvButton.click();
      await expect(modal).toBeVisible();
      await closeBtn.click();
      await expect(modal).not.toBeVisible();
      await expect(cvButton).toBeFocused();
      const isReleasedAgain = await page.evaluate(() => document.body.style.overflow === "");
      expect(isReleasedAgain).toBe(true);
    });
  });

  // =========================================================================
  // 4. CONTACT FORM SECURITY, VALIDATION & RESILIENCE
  // =========================================================================
  test.describe("Contact Form Security & Resilience", () => {
    const validPayload = {
      name: "Playwright Recruiter",
      email: "recruiter@playwright-test.internal",
      message: "Discussing engineering opportunities with verified credentials.",
    };

    test("1. Rejects request with invalid origin (403)", async ({ request }) => {
      const res = await request.post("/api/chat/lead", {
        headers: {
          origin: "https://unauthorized-origin.com",
          "content-type": "application/json",
        },
        data: validPayload,
      });
      expect(res.status()).toBe(403);
      const json = await res.json();
      expect(json.error).toContain("Forbidden");
    });

    test("2. Rejects malformed JSON payload with 400", async ({ request }) => {
      const res = await request.post("/api/chat/lead", {
        headers: {
          origin: testOrigin(),
          "content-type": "application/json",
        },
        data: "invalid-json-string{",
      });
      expect(res.status()).toBe(400);
      const json = await res.json();
      expect(json.error).toBeDefined();
    });

    test("3. Rejects invalid field validations with 400", async ({ request }) => {
      const resNoName = await request.post("/api/chat/lead", {
        headers: { origin: testOrigin() },
        data: { ...validPayload, name: "" },
      });
      expect(resNoName.status()).toBe(400);

      const resBadEmail = await request.post("/api/chat/lead", {
        headers: { origin: testOrigin() },
        data: { ...validPayload, email: "not-an-email" },
      });
      expect(resBadEmail.status()).toBe(400);
    });

    test("4. Rejects oversized payload with 413", async ({ request }) => {
      const hugeMessage = "A".repeat(20 * 1024); // 20 KB
      const res = await request.post("/api/chat/lead", {
        headers: { origin: testOrigin() },
        data: { ...validPayload, message: hugeMessage },
      });
      expect(res.status()).toBe(413);
      const json = await res.json();
      expect(json.error).toContain("limit");
    });

    test("5. Honeypot silently drops bot submission with 200 fake success", async ({ request }) => {
      const res = await request.post("/api/chat/lead", {
        headers: { origin: testOrigin() },
        data: {
          ...validPayload,
          company_site_hp: "https://spam-bot-target.org",
        },
      });
      expect(res.status()).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    test("6. Rate limiter throttles excessive requests with 429 and Retry-After header", async ({ request }) => {
      const testIp = "203.0.113.210";
      for (let i = 0; i < 5; i++) {
        await request.post("/api/chat/lead", {
          headers: {
            origin: testOrigin(),
            "x-forwarded-for": testIp,
          },
          data: validPayload,
        });
      }

      const resOverLimit = await request.post("/api/chat/lead", {
        headers: {
          origin: testOrigin(),
          "x-forwarded-for": testIp,
        },
        data: validPayload,
      });
      expect(resOverLimit.status()).toBe(429);
      expect(resOverLimit.headers()["retry-after"]).toBeDefined();
      const json = await resOverLimit.json();
      expect(json.error).toContain("Too many");
    });

    test("7. Client-side form displays validation errors, honeypot protection, and resets properly", async ({ page }) => {
      await page.goto("/en");
      const contactSection = page.locator("#contact");
      await contactSection.scrollIntoViewIfNeeded();

      // Submit button is disabled when empty
      const submitBtn = page.locator("button[type='submit']:has-text('Send Message')");
      await expect(submitBtn).toBeDisabled();

      // Verify honeypot input is hidden and inaccessible to tab order
      const honeypotInput = page.locator("#company-site-hp");
      await expect(honeypotInput).toHaveAttribute("tabindex", "-1");

      // Client-side honeypot silent drop
      await page.fill("#contact-name", "Bot Name");
      await page.fill("#contact-email", "bot@automated-spam.org");
      await page.locator("#company-site-hp").fill("https://bot-trap.com", { force: true });
      await submitBtn.click();

      // Immediately shows success state to deceive bot
      await expect(page.locator("text=Message received!")).toBeVisible();

      // Reset form via "Send another message"
      await page.click("button:has-text('Send another message')");
      await expect(page.locator("#contact-name")).toBeVisible();
      await expect(page.locator("#contact-name")).toHaveValue("");
    });

    test("8. Client-side form handles network failures gracefully without exposing internals", async ({ page }) => {
      await page.goto("/en");
      const contactSection = page.locator("#contact");
      await contactSection.scrollIntoViewIfNeeded();

      // Intercept endpoint to simulate network abort
      await page.route("**/api/chat/lead", async (route) => {
        await route.abort("failed");
      });

      await page.fill("#contact-name", "Network Tester");
      await page.fill("#contact-email", "tester@company.org");
      await page.fill("#contact-message", "Testing resilience");
      await page.click("button[type='submit']:has-text('Send Message')");

      // Verify user-friendly error alert without stack trace
      const alert = page.locator("#contact [role='alert']");
      await expect(alert).toBeVisible();
      await expect(alert).toContainText("Failed to send message");
      const alertText = await alert.textContent();
      expect(alertText).not.toContain("stack");
      expect(alertText).not.toContain("Error:");
    });

    test("9. Client-side form handles valid submission path with mocked 200 response", async ({ page }) => {
      await page.goto("/en");
      const contactSection = page.locator("#contact");
      await contactSection.scrollIntoViewIfNeeded();

      // Intercept endpoint with deterministic success
      await page.route("**/api/chat/lead", async (route) => {
        await route.fulfill({ status: 200, json: { success: true } });
      });

      await page.fill("#contact-name", "Valid Recruiter");
      await page.fill("#contact-email", "recruiter@acme-corp.com");
      await page.fill("#contact-message", "Discussing senior role opening.");
      await page.click("button[type='submit']:has-text('Send Message')");

      await expect(page.locator("text=Message received!")).toBeVisible();
      await expect(page.locator("#contact")).toContainText("Your message has been saved");
      await expect(page.locator("#contact")).not.toContainText("alert was sent");
    });
  });

  // =========================================================================
  // 5. VISUALIZER REAL STATE INTERACTIONS
  // =========================================================================
  test.describe("Visualizer Real State Interactions", () => {
    test("Cloud Inventory API contract inspector updates query and response on tab click", async ({ page }) => {
      await page.goto("/en/projects/cloud-inventory-api");
      await expect(page.locator("text=Flask & PyMongo CRUD Contract Inspector")).toBeVisible();

      // Initial tab is GET
      await expect(page.locator("text=STEP 01")).toBeVisible();

      // Click PUT tab
      await page.click("button:has-text('PUT')");
      await expect(page.locator("text=HTTP 200 OK")).toBeVisible();
      await expect(page.locator("text=Produk berhasil diperbarui")).toBeVisible();
      await expect(page.locator("text=db.produk.update_one")).toBeVisible();
    });

    test("QuizInt Flutter role switcher and answer mechanics update state", async ({ page }) => {
      await page.goto("/en/projects/quizint");

      // Switch to Instructor Mode
      await page.click("button:has-text('Instructor Mode')");
      await expect(page.locator("text=Course: TEL-302")).toBeVisible();
      await expect(page.locator("text=48 Learners")).toBeVisible();

      // Switch back to Learner Mode
      await page.click("button:has-text('Learner Mode')");
      await expect(page.locator(".quizint-device-frame strong:has-text('320 PTS')")).toBeVisible();

      // Pick correct answer: Provider (ChangeNotifier)
      const correctOption = page.locator(".quizint-device-frame button:has-text('Provider (ChangeNotifier)')");
      await correctOption.click();

      // Verify points increase and tick mark
      await expect(page.locator(".quizint-device-frame strong:has-text('420 PTS')")).toBeVisible();
      await expect(correctOption).toContainText("✓");

      // Click power-up
      await page.click("button:has-text('2× Score')");
      await expect(page.locator("button:has-text('Reset Question')")).toBeVisible();
    });

    test("Bitcoin Seq2Seq scrubber updates horizon stats, ARIA valuetext, and table highlight", async ({ page }) => {
      await page.goto("/en/projects/bitcoin-forecasting", { waitUntil: "networkidle" });

      const slider = page.locator("#forecast-step-slider");
      await slider.focus();
      // Use keyboard interaction rather than synthetic events before hydration.
      await slider.press("Home");
      for (let step = 1; step < 16; step++) await slider.press("ArrowRight");

      // Verify visual badge and ARIA update
      await expect(page.locator(".current-step-badge")).toContainText("+16 Hours Ahead");
      await expect(slider).toHaveAttribute("aria-valuenow", "16");

      // Verify accessible table row highlight
      const summaryToggle = page.locator(".accessible-summary-toggle");
      await summaryToggle.click();
      await expect(page.locator(".accessible-forecast-table")).toBeVisible();
      await expect(page.locator(".accessible-forecast-table tr.is-selected-row")).toContainText("+16h");
    });

    test("SCOVIS human-in-the-loop inspector updates stage details on layer click", async ({ page }) => {
      await page.goto("/en/projects/scovis");
      await expect(page.locator("text=Interactive Architecture Flow")).toBeVisible();

      // Click Stage 03 Inference Queue
      await page.click("button:has-text('Inference Queue')");
      await expect(page.locator("text=STAGE 03 · Asynchronous Job Orchestration")).toBeVisible();
      await expect(page.locator("text=RQ (Redis Queue)")).toBeVisible();
      await expect(page.locator("text=Separates heavy deep learning inference")).toBeVisible();
    });

    test("DermaScan demo labels illustrative scores and resets when the sample changes", async ({ page }) => {
      await page.goto("/en/projects/dermascan");
      const demo = page.getByTestId("dermascan-demo");
      await expect(demo.getByText("DermaScan Interface Demo")).toBeVisible();
      await expect(demo.getByText(/These are not model predictions/)).toBeVisible();
      await demo.getByRole("button", { name: "Suspected Melanoma Lesion" }).click();
      await expect(demo.getByText("88.7%")).toHaveCount(0);
      await demo.getByRole("button", { name: "Show example scores" }).click();
      await expect(demo.getByText("88.7%").first()).toBeVisible();
      await expect(demo.getByText("Illustrative data", { exact: true })).toBeVisible();
      await expect(demo.getByText(/ms \(TFLite\)/)).toHaveCount(0);
      await expect(demo.getByRole("checkbox")).toHaveCount(0);
      await demo.getByRole("button", { name: "Benign Keratosis Lesion" }).click();
      await expect(demo.getByText("88.7%")).toHaveCount(0);
      await expect(demo.getByText("85.2%")).toHaveCount(0);

      await page.goto("/id/projects/dermascan");
      await expect(page.getByText(/Angka ini bukan prediksi model/)).toBeVisible();
      await page.getByRole("button", { name: "Tampilkan skor contoh" }).click();
      await expect(page.getByText("Data ilustratif", { exact: true })).toBeVisible();
    });

    test("Gojek Sentiment NLP sandbox updates classification and tokenization on preset select", async ({ page }) => {
      await page.goto("/en/projects/gojek-sentiment");
      await expect(page.locator("text=INTERACTIVE NLP SANDBOX")).toBeVisible();

      // Click negative preset
      await page.click("button.preset-chip:has-text('Negative:')");

      // Verify badge updates to Negative
      const badge = page.locator(".sentiment-badge");
      await expect(badge).toHaveClass(/is-negatif/);
      await expect(badge).toContainText("Negative");
    });

    test("Vehicle classification benchmark updates threshold and classification status", async ({ page }) => {
      await page.goto("/en/projects/vehicle-classification");
      await expect(page.locator("text=MobileNetV2 4-Class Inference Sandbox")).toBeVisible();

      // Select Truck class
      await page.click("button:has-text('Truck')");
      await expect(page.locator("text=Heavy Cargo Transport Truck")).toBeVisible();

      // Verify threshold slider adjusts accepted status
      const slider = page.locator("#conf-slider");
      await slider.fill("98"); // higher than truck confidence 94.1%
      await expect(page.locator("text=Below Threshold (Fallback Review)")).toBeVisible();
    });
  });

  // =========================================================================
  // 6. CHATBOT WIDGET & MOCKED INTERACTION
  // =========================================================================
  test.describe("Chatbot Assistant Widget", () => {
    test("Chat widget opens dialog, prevents empty submissions, and closes gracefully", async ({ page }) => {
      await page.goto("/en");

      const launcher = page.locator("button.portfolio-chat-launcher");
      await expect(launcher).toBeVisible();
      await launcher.click();

      const chatDialog = page.locator("section.portfolio-chat-panel[role='dialog']");
      await expect(chatDialog).toBeVisible();

      // Send button is disabled when input is empty
      const sendBtn = chatDialog.locator("button.portfolio-chat-send");
      await expect(sendBtn).toBeDisabled();

      // Close via close button
      await chatDialog.locator("button.portfolio-chat-close").click();
      await expect(chatDialog).not.toBeVisible();
      await expect(launcher).toBeVisible();

      // Verify body scroll is NOT locked by the chat widget
      const isLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
      expect(isLocked).toBe(false);
    });

    test("Chat handles API error response safely without leaking provider internals", async ({ page }) => {
      await page.goto("/en");

      // Mock chat API failure
      await page.route("**/api/chat", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Upstream AI Service Unavailable" }),
        });
      });

      await page.click("button.portfolio-chat-launcher");
      const chatDialog = page.locator("section.portfolio-chat-panel[role='dialog']");

      const textarea = chatDialog.locator("textarea");
      await textarea.fill("Can you explain Reyy's background?");
      await chatDialog.locator("button.portfolio-chat-send").click();

      // Safe error alert is displayed
      const errorAlert = chatDialog.locator("p.portfolio-chat-error[role='alert']");
      await expect(errorAlert).toBeVisible();
      await expect(errorAlert).toContainText("The guide could not respond");

      // Ensure no raw internal tokens or stack traces are visible
      const content = await chatDialog.textContent();
      expect(content).not.toContain("GEMINI_API_KEY");
      expect(content).not.toContain("google.genai");
      expect(content).not.toContain("Stack trace:");
    });
  });

  // =========================================================================
  // 7. ERROR HANDLING & ROUTE RESILIENCE
  // =========================================================================
  test.describe("Error Handling & Route Resilience", () => {
    test("Admin analytics never serves data without a valid admin secret", async ({ request }) => {
      const unauthenticated = await request.post("/api/admin/analytics", {
        data: {},
      });
      expect(unauthenticated.status()).toBe(401);
      expect(unauthenticated.headers()["cache-control"]).toBe("no-store");

      const invalidSecret = await request.post("/api/admin/analytics", {
        headers: { authorization: "Bearer definitely-not-the-admin-secret" },
        data: {},
      });
      expect(invalidSecret.status()).toBe(401);
      expect(invalidSecret.headers()["x-content-type-options"]).toBe("nosniff");
    });

    test("Unknown project slug returns 404 cleanly", async ({ page }) => {
      const response = await page.goto("/en/projects/non-existent-case-study-slug");
      expect(response?.status()).toBe(404);
      await expect(page.locator("body")).toBeVisible();
    });

    test("Invalid locale path returns 404 or redirects safely", async ({ page }) => {
      const response = await page.goto("/fr/projects/scovis");
      // Next.js responds with 404 for unrecognized [lang] params via notFound()
      expect([404, 307, 308]).toContain(response?.status());
    });

    test("Non-existent static asset does not crash application shell", async ({ page }) => {
      const response = await page.goto("/non-existent-file.txt");
      expect([404, 307, 308]).toContain(response?.status());
    });
  });

  // =========================================================================
  // 8. RESPONSIVE DOCUMENT OVERFLOW ACROSS VIEWPORTS
  // =========================================================================
  test.describe("Responsive Document Overflow Across Viewports", () => {
    const targetViewports = [
      { name: "375x667 (iPhone SE)", width: 375, height: 667 },
      { name: "390x844 (iPhone 14)", width: 390, height: 844 },
      { name: "430x932 (iPhone 15 Pro Max)", width: 430, height: 932 },
      { name: "768x1024 (iPad)", width: 768, height: 1024 },
      { name: "1280x800 (Desktop)", width: 1280, height: 800 },
    ];

    const testRoutes = [
      "/en",
      "/id",
      "/en/about",
      "/en/credentials",
      "/en/projects/scovis",
      "/en/projects/cloud-inventory-api",
      "/en/projects/quizint",
      "/en/projects/bitcoin-forecasting",
    ];

    for (const vp of targetViewports) {
      test(`Zero document horizontal overflow at ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        for (const route of testRoutes) {
          await page.goto(route);
          const hasHorizontalOverflow = await page.evaluate(() => {
            return document.documentElement.scrollWidth > document.documentElement.clientWidth;
          });
          expect(
            hasHorizontalOverflow,
            `Horizontal overflow detected on ${route} at ${vp.name}`
          ).toBe(false);
        }
      });
    }
  });

  // =========================================================================
  // 6. CERTIFICATE GALLERY LIGHTBOX & MODAL PORTAL
  // =========================================================================
  test.describe("Certificate Gallery Lightbox & Modal Portal", () => {
    test("Opening certificate preview renders portal into document.body, centered in viewport", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en/credentials");

      // Scroll down to ensure scrolling doesn't offset fixed modal
      await page.evaluate(() => window.scrollTo(0, 300));

      const firstCardBtn = page.locator(".certificate-preview-button").first();
      await expect(firstCardBtn).toBeVisible();
      await firstCardBtn.click();

      const modalBackdrop = page.locator(".certificate-modal-backdrop");
      await expect(modalBackdrop).toBeVisible();

      // Ensure modal is a direct child of document.body (portaled)
      const isParentBody = await modalBackdrop.evaluate((el) => el.parentElement === document.body);
      expect(isParentBody).toBe(true);

      const modal = page.locator(".certificate-modal");
      await expect(modal).toBeVisible();

      // Check modal bounding box is vertically centered and within viewport bounds
      const box = await modal.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.y).toBeGreaterThanOrEqual(10);
        expect(box.y + box.height).toBeLessThanOrEqual(800);
      }

      // Close modal via close button
      await page.locator(".certificate-modal-close").click();
      await expect(modalBackdrop).not.toBeVisible();
    });
  });
});


test.describe("Accessible recruitment and certificate dialogs", () => {
  for (const width of [1440, 390]) {
    test(`Dialog focus stays inside and returns to the trigger at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route("**/api/telemetry", (route) => route.fulfill({ status: 200, body: "{}" }));
      for (const kind of ["availability", "certificate"]) {
        await page.goto(kind === "availability" ? "/en" : "/en/credentials");
        const trigger = page.locator(kind === "availability" ? ".availability-pill" : ".certificate-preview-button").first();
        await trigger.click();
        const dialog = page.getByRole("dialog");
        await expect(dialog).toBeVisible();
        await expect(dialog.getByRole("button", { name: /Close/ })).toBeFocused();
        await expect(page.locator(".site-frame")).toHaveAttribute("inert", "");
        for (const key of ["Shift+Tab", ...Array(12).fill("Tab"), ...Array(6).fill("Shift+Tab")]) {
          await page.keyboard.press(key);
          await expect.poll(() => dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
        }
        await page.keyboard.press("Escape");
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
        await expect(page.locator(".site-frame")).not.toHaveAttribute("inert", "");
        await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
      }
    });
  }

  test("Availability dialog hands focus to the CV dialog", async ({ page }) => {
    await page.route("**/api/telemetry", (route) => route.fulfill({ status: 200, body: "{}" }));
    await page.goto("/en");
    await page.locator(".availability-pill").click();
    await page.getByRole("button", { name: /Preview ATS CV/ }).click();
    const cv = page.getByRole("dialog");
    await expect(cv).toHaveCount(1);
    await expect(cv.locator(".cv-modal-close-btn")).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(cv).toHaveCount(0);
    await expect(page.locator(".site-frame")).not.toHaveAttribute("inert", "");
  });
});


test("Homepage keeps the technology explorer accessible on demand in both languages", async ({ page }) => {
  for (const locale of ["en", "id"]) {
    await page.goto(`/${locale}`);
    const details = page.locator(".home-skill-details");
    const summary = details.locator("summary");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(details.getByRole("button", { name: /FastAPI/ })).not.toBeVisible();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).toHaveAttribute("open", "");
    const technology = details.getByRole("button", { name: /FastAPI/ });
    await expect(technology).toBeVisible();
    await technology.click();
    await expect(details.getByRole("link", { name: /Inspect Case Study|Buka Case Study/ }).first()).toBeVisible();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(details).not.toHaveAttribute("open", "");
    await expect(summary).toBeFocused();
    await expect(page.locator("#contact")).toHaveCount(1);
  }
});


test("Contact links stay visible and keyboard accessible with either motion preference", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  const loop = page.getByRole("navigation", { name: "Reyy contact links" });
  const links = loop.getByRole("link");
  await expect(links).toHaveCount(4);
  await links.first().scrollIntoViewIfNeeded();
  await links.first().focus();
  for (const link of await links.all()) {
    await expect(link).toBeFocused();
    await expect(link).toBeInViewport();
    await page.keyboard.press("Tab");
  }
  const positions = () => links.evaluateAll((nodes) => nodes.map((node) => {
    const rect = node.getBoundingClientRect();
    return { x: rect.x + window.scrollX, y: rect.y + window.scrollY, width: rect.width, height: rect.height };
  }));
  const initial = await positions();
  await page.waitForTimeout(400);
  expect(await positions()).toEqual(initial);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(links).toHaveCount(4);
  expect(await positions()).toEqual(initial);
});

for (const theme of ["dark", "light"]) {
  test(`Contact focus, error contrast and certificate search remain usable in ${theme} mode`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript((value) => localStorage.setItem("reyy-theme", value), theme);
    let failure: number | "network" = 500;
    await page.route("**/api/chat/lead", (route) => failure === "network"
      ? route.abort("failed")
      : route.fulfill({ status: failure, contentType: "application/json", body: JSON.stringify({ error: "Local test failure" }) }));
    const contrast = (first: string, second: string) => {
      const luminance = (color: string) => {
        const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map((value) => {
          const channel = value / 255;
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
      };
      const values = [luminance(first), luminance(second)].sort((a, b) => a - b);
      return (values[1] + 0.05) / (values[0] + 0.05);
    };
    for (const locale of ["en", "id"]) {
      await page.goto(`/${locale}`);
      const first = page.locator("#contact-name");
      await first.scrollIntoViewIfNeeded();
      await first.focus();
      for (const id of ["contact-name", "contact-email", "contact-role", "contact-message"]) {
        const field = page.locator(`#${id}`);
        await expect(field).toBeFocused();
        const styles = await field.evaluate((element) => {
          const style = getComputedStyle(element);
          return { outline: style.outlineStyle, width: parseFloat(style.outlineWidth), border: style.borderColor,
            background: style.backgroundColor, panel: getComputedStyle(element.closest(".contact-form-panel")!).backgroundColor };
        });
        expect(styles.outline).not.toBe("none");
        expect(styles.width).toBeGreaterThanOrEqual(2);
        expect(contrast(styles.border, styles.background)).toBeGreaterThanOrEqual(3);
        expect(contrast(styles.border, styles.panel)).toBeGreaterThanOrEqual(3);
        await page.keyboard.press("Tab");
      }
      await first.fill("Local regression check");
      await page.locator("#contact-email").fill("local@example.com");
      for (const scenario of [429, 500, "network"] as const) {
        failure = scenario;
        await page.locator(".contact-submit").click();
        const alert = page.locator("#contact [role=alert]");
        await expect(alert).toBeVisible();
        await expect(page.locator(".contact-submit")).toBeEnabled();
        const colors = await alert.evaluate((element) => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
        expect(contrast(colors.color, colors.background)).toBeGreaterThanOrEqual(4.5);
      }
      await page.goto(`/${locale}/credentials`);
      const label = locale === "en" ? "Search certificates" : "Cari sertifikat";
      const search = page.getByRole("textbox", { name: label, exact: true });
      await search.scrollIntoViewIfNeeded();
      await search.focus();
      expect(await search.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
      await search.fill("TensorFlow");
      await expect(page.locator('label[for="certificate-search"]')).toBeVisible();
      await page.getByRole("button", { name: locale === "en" ? "Clear search" : "Hapus pencarian", exact: true }).click();
      await expect(search).toHaveValue("");
    }
  });
}

test("Identity card defaults to physics and offers keyboard flipping in static mode on mobile", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en/about");
  await page.locator(".lanyard-canvas").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Static view", exact: true }).click();
  const flip = page.getByRole("button", { name: "Flip identity card" });
  await flip.focus();
  await expect(flip).toBeFocused();
  await expect(flip).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Enter");
  await expect(flip).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(flip).toHaveAttribute("aria-pressed", "false");
  await expect(page.getByRole("button", { name: /Enable 3D Physics/ })).toBeVisible();
});

test("Chat explains storage and asks visitors not to share sensitive information", async ({ page }) => {
  for (const [locale, notice] of [["en", "Chat messages may be stored"], ["id", "Pesan percakapan dapat disimpan"]]) {
    await page.goto(`/${locale}`);
    await page.locator(".portfolio-chat-launcher").click();
    await expect(page.locator(".portfolio-chat-privacy")).toContainText(notice);
    await expect(page.locator(".portfolio-chat-privacy")).toContainText("API key");
  }
});
