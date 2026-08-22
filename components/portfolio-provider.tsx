"use client";

import React, { createContext, useContext, useState } from "react";
import type { Locale } from "@/lib/portfolio";
import { CommandMenu } from "./command-menu";
import { CVModal, type CVType } from "./cv-modal";
import { ToastContainer } from "./toast-notification";

type PortfolioContextType = {
  openCV: (type?: CVType) => void;
  closeCV: () => void;
};

const PortfolioContext = createContext<PortfolioContextType>({
  openCV: () => {},
  closeCV: () => {},
});

export function usePortfolio() {
  return useContext(PortfolioContext);
}

export function PortfolioProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [isCVOpen, setIsCVOpen] = useState(false);
  const [cvType, setCvType] = useState<CVType>("ai-ml");

  function openCV(type: CVType = "ai-ml") {
    setCvType(type);
    setIsCVOpen(true);
  }

  function closeCV() {
    setIsCVOpen(false);
  }

  return (
    <PortfolioContext.Provider value={{ openCV, closeCV }}>
      {children}
      <CVModal
        isOpen={isCVOpen}
        onClose={closeCV}
        locale={locale}
        initialType={cvType}
      />
      <CommandMenu
        locale={locale}
        onOpenCV={openCV}
        onOpenChat={() => {
          // Trigger the AI chat button click
          const chatButton = document.querySelector(".portfolio-chat-launcher") as HTMLButtonElement;
          chatButton?.click();
        }}
      />
      <ToastContainer />
    </PortfolioContext.Provider>
  );
}
