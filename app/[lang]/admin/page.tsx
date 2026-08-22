import { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/portfolio";
import { AdminDashboardClient } from "./admin-client";

export const metadata: Metadata = {
  title: "Admin Analytics | Reyy",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return <AdminDashboardClient locale={lang} />;
}
