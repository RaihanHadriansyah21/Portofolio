import type { UIMessage } from "ai";

export type ChatMode = "recruiter" | "technical" | "explore";

export type PortfolioSource = {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: "case-study" | "repository" | "live-product" | "certificate" | "profile";
};

export type PortfolioChatMessage = UIMessage<
  never,
  {
    sources: PortfolioSource[];
  }
>;
