"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const VISITOR_ID_KEY = "reyy_visitor_id";
const EXTERNAL_DOMAINS = [
  { pattern: /linkedin\.com/i, platform: "linkedin", label: "LinkedIn Profile" },
  { pattern: /github\.com/i, platform: "github", label: "GitHub Profile" },
  { pattern: /instagram\.com/i, platform: "instagram", label: "Instagram Profile" },
];

/** Lazily get (or create) a stable anonymous visitor UUID from localStorage. */
function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_ID_KEY, id);
    }
    return id;
  } catch {
    return "anonymous";
  }
}

/** Classify the referrer string into a human-readable source label. */
function classifyReferrer(referrer: string, refParam: string | null): string {
  if (refParam) {
    // Custom ?ref= UTM-style params from CV links or direct shares
    const knownRefs: Record<string, string> = {
      cv: "CV PDF Link",
      "asg-intern": "ASG Application",
      bentang: "Bentang Application",
      gits: "GITS Application",
      jobstreet: "Jobstreet",
      glints: "Glints",
      linkedin: "LinkedIn",
      google: "Google Search",
    };
    const lower = refParam.toLowerCase();
    return knownRefs[lower] ?? `UTM: ${refParam}`;
  }
  if (!referrer) return "Direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("google.") || host.includes("googleusercontent")) return "Google Search";
    if (host.includes("jobstreet")) return "Jobstreet";
    if (host.includes("glints")) return "Glints";
    if (host.includes("github.com")) return "GitHub";
    if (host.includes("instagram.com")) return "Instagram";
    if (host.includes("t.co") || host.includes("twitter.com") || host.includes("x.com")) return "Twitter / X";
    if (host.includes("bing.com")) return "Bing Search";
    return host;
  } catch {
    return "Direct";
  }
}

/**
 * Returns true when the current browser session is an automated/headless client
 * (e.g. Playwright, Selenium, or a known bot/crawler).
 * This prevents test runs from polluting real analytics data.
 */
function isAutomatedClient(): boolean {
  if (typeof navigator === "undefined") return true; // SSR safety
  // navigator.webdriver is set to true by Playwright, Selenium, and CDP-based tools
  if (navigator.webdriver === true) return true;
  // Catch common bot / headless user agents as a secondary signal
  const ua = navigator.userAgent?.toLowerCase() ?? "";
  if (
    ua.includes("headlesschrome") ||
    ua.includes("phantomjs") ||
    ua.includes("bot") ||
    ua.includes("crawler") ||
    ua.includes("spider") ||
    ua.includes("googlebot") ||
    ua.includes("bingbot") ||
    ua.includes("slurp")
  ) {
    return true;
  }
  return false;
}

function fireTelemetry(eventType: string, metadata: Record<string, unknown>) {
  // Silently skip if running inside a headless/automated browser (e.g. Playwright)
  if (isAutomatedClient()) return;

  fetch("/api/telemetry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventType, metadata }),
    keepalive: true,
  }).catch(() => {
    /* fire-and-forget */
  });
}

/**
 * TelemetryTracker — mounts once in layout.tsx and automatically:
 *  1. Fires a page_view event on every route change.
 *  2. Listens for external link clicks (LinkedIn, GitHub, Instagram) and fires external_link events.
 */
export function TelemetryTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track the last tracked path to prevent double-fires caused by React StrictMode remounts.
  const lastTracked = useRef<string>("");

  // ── 1. Automatic Pageview Tracker ──────────────────────────────────────────
  useEffect(() => {
    const key = `${pathname}?${searchParams.toString()}`;
    if (lastTracked.current === key) return;
    lastTracked.current = key;

    const visitorId = getVisitorId();
    const referrer = typeof document !== "undefined" ? document.referrer : "";
    const refParam = searchParams.get("ref");
    const source = classifyReferrer(referrer, refParam);

    fireTelemetry("page_view", {
      path: pathname,
      source,
      referrer: referrer || null,
      refParam: refParam || null,
      visitorId,
    });
  }, [pathname, searchParams]);

  // ── 2. Global External Link Click Tracker ──────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      try {
        if (target.href.startsWith("mailto:")) {
          fireTelemetry("external_link", {
            platform: "email",
            label: "Direct Email (mailto)",
            url: target.href,
            visitorId: getVisitorId(),
          });
          return;
        }

        const url = new URL(target.href);
        // Only track external links — skip same-origin anchors
        if (url.origin === window.location.origin) return;

        const matched = EXTERNAL_DOMAINS.find((d) => d.pattern.test(url.hostname));
        if (!matched) return;

        fireTelemetry("external_link", {
          platform: matched.platform,
          label: matched.label,
          url: url.href,
          visitorId: getVisitorId(),
        });
      } catch {
        /* ignore malformed URLs */
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  // This component renders nothing — it's a pure side-effect tracker.
  return null;
}
