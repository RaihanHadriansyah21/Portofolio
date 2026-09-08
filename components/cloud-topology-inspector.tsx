"use client";

import { useState } from "react";
import type { Locale } from "@/lib/portfolio";

type RouteItem = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  label: Record<Locale, string>;
  description: Record<Locale, string>;
  requestBody?: string;
  mongoOperation: string;
  responseJson: string;
  status: string;
};

const routes: RouteItem[] = [
  {
    method: "GET",
    path: "/produk",
    label: { en: "List All Products", id: "Daftar Semua Produk" },
    description: {
      en: "Fetches all documents from swalayanDB.produk, serializing BSON ObjectIds to JSON-compatible strings.",
      id: "Mengambil semua dokumen dari swalayanDB.produk, mengonversi BSON ObjectId menjadi string kompatibel JSON.",
    },
    mongoOperation: "db.produk.find({})",
    responseJson: JSON.stringify(
      [
        { _id: "66be51a8f9c2a1001", nama: "Beras Premium 5kg", harga: 75000, stok: 40 },
        { _id: "66be51b2f9c2a1002", nama: "Minyak Goreng 2L", harga: 34000, stok: 65 },
        { _id: "66be51b9f9c2a1003", nama: "Gula Pasir 1kg", harga: 17500, stok: 120 },
      ],
      null,
      2
    ),
    status: "200 OK",
  },
  {
    method: "POST",
    path: "/produk",
    label: { en: "Create New Product", id: "Tambah Produk Baru" },
    description: {
      en: "Validates JSON payload (nama, harga, stok) and inserts a new document with an auto-generated ObjectId.",
      id: "Memvalidasi payload JSON (nama, harga, stok) dan menyisipkan dokumen baru dengan ObjectId otomatis.",
    },
    requestBody: JSON.stringify(
      { nama: "Kopi Arabika 250g", harga: 48000, stok: 25 },
      null,
      2
    ),
    mongoOperation: "db.produk.insert_one({\"nama\": ..., \"harga\": ..., \"stok\": ...})",
    responseJson: JSON.stringify(
      {
        message: "Produk berhasil ditambahkan",
        inserted_id: "66be52cef9c2a1004",
      },
      null,
      2
    ),
    status: "201 Created",
  },
  {
    method: "PUT",
    path: "/produk/66be51b2f9c2a1002",
    label: { en: "Update Product by ID", id: "Perbarui Produk per ID" },
    description: {
      en: "Updates selected document attributes using $set modifier after validating ObjectId format.",
      id: "Memperbarui atribut dokumen terpilih menggunakan modifier $set setelah validasi format ObjectId.",
    },
    requestBody: JSON.stringify({ harga: 36000, stok: 58 }, null, 2),
    mongoOperation: "db.produk.update_one({\"_id\": ObjectId(...)}, {\"$set\": ...})",
    responseJson: JSON.stringify(
      { message: "Produk berhasil diperbarui", modified_count: 1 },
      null,
      2
    ),
    status: "200 OK",
  },
  {
    method: "DELETE",
    path: "/produk/66be51b9f9c2a1003",
    label: { en: "Delete Product by ID", id: "Hapus Produk per ID" },
    description: {
      en: "Permanently deletes matching product document from MongoDB collection.",
      id: "Menghapus dokumen produk yang cocok secara permanen dari koleksi MongoDB.",
    },
    mongoOperation: "db.produk.delete_one({\"_id\": ObjectId(\"66be51b9f9c2a1003\")})",
    responseJson: JSON.stringify(
      { message: "Produk berhasil dihapus", deleted_count: 1 },
      null,
      2
    ),
    status: "200 OK",
  },
];

const copy = {
  en: {
    eyebrow: "Interactive API Contract & Schema Reference",
    title: "Flask & PyMongo CRUD Contract Inspector",
    subtitle: "Inspect HTTP method semantics, BSON ObjectId serialization, and PyMongo operations implemented in the academic inventory coursework.",
    selectEndpoint: "Select REST Endpoint",
    requestFlow: "HTTP Request ➔ Flask Handler ➔ PyMongo Query",
    requestPayload: "Request Payload (JSON)",
    responsePayload: "Response Output (JSON)",
    mongoQuery: "MongoDB PyMongo Query",
    runtimeNote: "Academic Coursework Lab · Local Flask Dev Server (0.0.0.0:5000)",
  },
  id: {
    eyebrow: "Referensi Kontrak API & Skema Interaktif",
    title: "Inspektor Kontrak CRUD Flask & PyMongo",
    subtitle: "Periksa semantik metode HTTP, serialisasi BSON ObjectId, dan operasi PyMongo yang diimplementasikan pada tugas akademik inventaris.",
    selectEndpoint: "Pilih Endpoint REST",
    requestFlow: "HTTP Request ➔ Handler Flask ➔ Query PyMongo",
    requestPayload: "Payload Request (JSON)",
    responsePayload: "Output Respons (JSON)",
    mongoQuery: "Operasi Query MongoDB PyMongo",
    runtimeNote: "Lab Coursework Akademik · Server Dev Flask Lokal (0.0.0.0:5000)",
  },
} as const;

export function CloudTopologyInspector({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const activeRoute = routes[activeIdx];

  const methodColors: Record<string, { bg: string; text: string; border: string }> = {
    GET: { bg: "rgba(96, 165, 250, 0.15)", text: "#60a5fa", border: "rgba(96, 165, 250, 0.3)" },
    POST: { bg: "rgba(74, 222, 128, 0.15)", text: "#4ade80", border: "rgba(74, 222, 128, 0.3)" },
    PUT: { bg: "rgba(250, 204, 21, 0.15)", text: "#facc15", border: "rgba(250, 204, 21, 0.3)" },
    DELETE: { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", border: "rgba(239, 68, 68, 0.3)" },
  };

  return (
    <div
      className="glass-panel"
      style={{
        borderRadius: "16px",
        padding: "clamp(1rem, 2.5vw, 1.75rem)",
        margin: "2rem 0",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#4ade80",
            display: "inline-block",
            marginBottom: "0.3rem",
          }}
        >
          ● {t.eyebrow}
        </span>
        <h3 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 0.35rem" }}>
          {t.title}
        </h3>
        <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: 0, lineHeight: 1.5, maxWidth: "50rem" }}>
          {t.subtitle}
        </p>
      </div>

      {/* Endpoint Selector Tabs */}
      <div style={{ marginBottom: "1.5rem" }}>
        <span style={{ fontSize: "0.78rem", opacity: 0.6, fontWeight: 600, display: "block", marginBottom: "0.6rem" }}>
          {t.selectEndpoint}
        </span>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.5rem" }}>
          {routes.map((r, idx) => {
            const isSelected = activeIdx === idx;
            const color = methodColors[r.method];
            return (
              <button
                key={`${r.method}-${r.path}`}
                type="button"
                onClick={() => setActiveIdx(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 0.8rem",
                  borderRadius: "8px",
                  border: isSelected ? "1px solid var(--foreground, #fff)" : "1px solid rgba(255, 255, 255, 0.1)",
                  background: isSelected ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.25)",
                  color: "inherit",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  textAlign: "left",
                  transition: "all 120ms ease",
                }}
              >
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    padding: "0.15rem 0.4rem",
                    borderRadius: "4px",
                    background: color.bg,
                    color: color.text,
                    border: `1px solid ${color.border}`,
                  }}
                >
                  {r.method}
                </span>
                <span style={{ fontWeight: isSelected ? 600 : 400, opacity: isSelected ? 1 : 0.8 }}>
                  {r.path}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pipeline Flow Board */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.3)",
          borderRadius: "12px",
          padding: "1.25rem",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <strong style={{ fontSize: "0.85rem" }}>{activeRoute.label[locale]}</strong>
          <span
            style={{
              fontSize: "0.72rem",
              padding: "0.15rem 0.5rem",
              borderRadius: "4px",
              background: "rgba(74, 222, 128, 0.2)",
              color: "#4ade80",
              fontWeight: 600,
            }}
          >
            HTTP {activeRoute.status}
          </span>
        </div>
        <p style={{ fontSize: "0.82rem", opacity: 0.8, margin: "0 0 1rem", lineHeight: 1.5 }}>
          {activeRoute.description[locale]}
        </p>

        {/* 3-Step Flow Map */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "0.75rem", borderRadius: "8px", minWidth: 0 }}>
            <span style={{ fontSize: "0.68rem", opacity: 0.6, display: "block" }}>STEP 01</span>
            <strong style={{ fontSize: "0.8rem" }}>Client HTTP Call</strong>
            <p style={{ fontSize: "0.72rem", opacity: 0.6, margin: "0.2rem 0 0", wordBreak: "break-all" }}>{activeRoute.method} {activeRoute.path}</p>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "0.75rem", borderRadius: "8px", minWidth: 0 }}>
            <span style={{ fontSize: "0.68rem", opacity: 0.6, display: "block" }}>STEP 02</span>
            <strong style={{ fontSize: "0.8rem" }}>Flask Route Handler</strong>
            <p style={{ fontSize: "0.72rem", opacity: 0.6, margin: "0.2rem 0 0" }}>Flask-PyMongo & ObjectId</p>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.04)", padding: "0.75rem", borderRadius: "8px", minWidth: 0 }}>
            <span style={{ fontSize: "0.68rem", opacity: 0.6, display: "block" }}>STEP 03</span>
            <strong style={{ fontSize: "0.8rem" }}>MongoDB Collection</strong>
            <p style={{ fontSize: "0.72rem", opacity: 0.6, margin: "0.2rem 0 0" }}>swalayanDB.produk</p>
          </div>
        </div>
      </div>

      {/* Code / Payload Inspector */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Mongo Operation */}
        <div style={{ background: "#0a0a0d", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)", minWidth: 0, overflow: "hidden" }}>
          <span style={{ fontSize: "0.72rem", opacity: 0.6, display: "block", marginBottom: "0.4rem" }}>
            {t.mongoQuery}
          </span>
          <pre
            style={{
              fontSize: "0.75rem",
              margin: 0,
              color: "#60a5fa",
              fontFamily: "var(--font-geist-mono), monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowX: "auto",
            }}
          >
            {activeRoute.mongoOperation}
          </pre>
        </div>

        {/* JSON Response */}
        <div style={{ background: "#0a0a0d", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)", minWidth: 0, overflow: "hidden" }}>
          <span style={{ fontSize: "0.72rem", opacity: 0.6, display: "block", marginBottom: "0.4rem" }}>
            {t.responsePayload}
          </span>
          <pre
            style={{
              fontSize: "0.75rem",
              margin: 0,
              color: "#4ade80",
              fontFamily: "var(--font-geist-mono), monospace",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              maxHeight: "140px",
              overflowY: "auto",
              overflowX: "auto",
            }}
          >
            {activeRoute.responseJson}
          </pre>
        </div>
      </div>

      {/* Footer Runtime Note */}
      <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.6, fontSize: "0.72rem" }}>
        <span>ℹ</span>
        <span>{t.runtimeNote}</span>
      </div>
    </div>
  );
}
