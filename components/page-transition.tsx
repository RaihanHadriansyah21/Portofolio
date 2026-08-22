"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top smoothly on page transition
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
        transition={{
          duration: 0.28,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ width: "100%", minHeight: "calc(100vh - var(--header-height, 4.5rem))" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
