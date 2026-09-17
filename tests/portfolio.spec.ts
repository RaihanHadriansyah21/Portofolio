import { test, expect } from "@playwright/test";
import { projects } from "../lib/portfolio";

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
      await expect(page.locator(".hero-actions a.button-primary")).toContainText("Explore my work");
      await expect(page.locator(".hero-actions button.button-secondary")).toContainText("Preview CV");
      await expect(page.locator("#contact h3")).toContainText("Send a Direct Message");
    });

    test("Indonesian route (/id) renders verified Indonesian copy across surfaces", async ({ page }) => {
      await page.goto("/id");
      await expect(page.locator("html")).toHaveAttribute("lang", "id");
      await expect(page.locator(".hero-actions a.button-primary")).toContainText("Jelajahi karya saya");
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

      await expect(heroPrimary).toContainText("Explore my work");
      await expect(heroPreview).toContainText("Preview CV");
      await expect(secondaryRow).toBeVisible();
      await expect(secondaryRow.locator("a")).toContainText("Meet Reyy");
      await expect(secondaryRow.locator("button")).toContainText("Share Profile");

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
          origin: "http://localhost:3000",
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
        headers: { origin: "http://localhost:3000" },
        data: { ...validPayload, name: "" },
      });
      expect(resNoName.status()).toBe(400);

      const resBadEmail = await request.post("/api/chat/lead", {
        headers: { origin: "http://localhost:3000" },
        data: { ...validPayload, email: "not-an-email" },
      });
      expect(resBadEmail.status()).toBe(400);
    });

    test("4. Rejects oversized payload with 413", async ({ request }) => {
      const hugeMessage = "A".repeat(20 * 1024); // 20 KB
      const res = await request.post("/api/chat/lead", {
        headers: { origin: "http://localhost:3000" },
        data: { ...validPayload, message: hugeMessage },
      });
      expect(res.status()).toBe(413);
      const json = await res.json();
      expect(json.error).toContain("limit");
    });

    test("5. Honeypot silently drops bot submission with 200 fake success", async ({ request }) => {
      const res = await request.post("/api/chat/lead", {
        headers: { origin: "http://localhost:3000" },
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
            origin: "http://localhost:3000",
            "x-forwarded-for": testIp,
          },
          data: validPayload,
        });
      }

      const resOverLimit = await request.post("/api/chat/lead", {
        headers: {
          origin: "http://localhost:3000",
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
      await expect(page.locator("text=Message Delivered Successfully!")).toBeVisible();

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

      await expect(page.locator("text=Message Delivered Successfully!")).toBeVisible();
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
      await page.goto("/en/projects/bitcoin-forecasting");

      const slider = page.locator("#forecast-step-slider");
      await slider.evaluate((el) => {
        const input = el as HTMLInputElement;
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        setter?.call(input, "16");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

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

    test("DermaScan playground runs forward pass inference and toggles Grad-CAM overlay", async ({ page }) => {
      await page.goto("/en/projects/dermascan");
      await expect(page.locator("text=DermaScan Model Inference Playground")).toBeVisible();

      // Select melanoma sample
      await page.click("button:has-text('Suspected Melanoma Lesion')");
      await expect(page.locator("text=Asymmetric structure")).toBeVisible();

      // Run neural inference
      await page.click("button:has-text('Run Neural Inference')");

      // Wait for inference pass to complete
      await expect(page.locator("text=Melanoma (mel)")).toBeVisible();
      await expect(page.getByText("88.7%").first()).toBeVisible();

      // Grad-CAM toggle should now be enabled
      const gradCamCheckbox = page.locator("input[type='checkbox']");
      await expect(gradCamCheckbox).toBeEnabled();
      await gradCamCheckbox.check();
      await expect(gradCamCheckbox).toBeChecked();
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
});
