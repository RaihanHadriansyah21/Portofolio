"use client";

import { useEffect, useEffectEvent, type RefObject } from "react";

/** Focus and background isolation for dialogs portalled outside .site-frame. */
export function useModalFocus(
  panelRef: RefObject<HTMLDivElement | null>,
  open: boolean,
  onClose: () => void,
) {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    const panel = panelRef.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const frame = document.querySelector<HTMLElement>(".site-frame");
    const previousInert = frame?.inert ?? false;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
    if (frame) frame.inert = true;

    const focusable = () => Array.from(panel.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const focusFirst = () => (focusable()[0] ?? panel).focus();
    focusFirst();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (event.key === "Tab") {
        const items = focusable();
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !panel.contains(document.activeElement)
          || (event.shiftKey && document.activeElement === first)
          || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last ?? panel : first ?? panel).focus();
        }
      }
    }
    function handleFocus(event: FocusEvent) {
      if (event.target instanceof Node && !panel.contains(event.target)) focusFirst();
    }
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("focusin", handleFocus);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("focusin", handleFocus);
      if (frame) frame.inert = previousInert;
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, panelRef]);
}
