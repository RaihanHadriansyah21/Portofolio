import type { Metadata } from "next";
import { siteUrl } from "@/lib/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Reyy — AI/ML Engineer & Full-Stack Developer",
    template: "%s — Reyy",
  },
  description: "Applied AI and full-stack engineering portfolio of Mohammad Raihan Hadriansyah Prasetya (Reyy).",
  applicationName: "Reyy Portfolio",
  authors: [{ name: "Mohammad Raihan Hadriansyah Prasetya" }],
  creator: "Mohammad Raihan Hadriansyah Prasetya",
  keywords: ["AI Engineer", "Machine Learning Engineer", "Full-Stack Developer", "Next.js", "FastAPI", "TensorFlow", "Indonesia"],
  openGraph: {
    type: "website",
    title: "Reyy — AI/ML Engineer & Full-Stack Developer",
    description: "Models, APIs, interfaces, and deployment-ready product workflows.",
    siteName: "Reyy Portfolio",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Reyy — AI/ML Engineer & Full-Stack Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reyy — AI/ML Engineer & Full-Stack Developer",
    description: "Models, APIs, interfaces, and deployment-ready product workflows.",
    images: ["/og.png"],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('reyy-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
    >
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
