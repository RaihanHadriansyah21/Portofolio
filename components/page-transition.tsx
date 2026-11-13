"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "./use-reduced-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // If navigating to a page with a hash (e.g. /id#contact), scroll to the anchor smoothly
    if (typeof window !== "undefined" && window.location.hash) {
      const targetId = window.location.hash.replace("#", "");
      const timer = setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }
      }, 150);
      return () => clearTimeout(timer);
    }

    // Otherwise scroll to top on clean route change
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reducedMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, filter: "blur(2px)" }}
        transition={{
          duration: reducedMotion ? 0 : 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ width: "100%", minHeight: "calc(100vh - var(--header-height, 4.5rem))" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
