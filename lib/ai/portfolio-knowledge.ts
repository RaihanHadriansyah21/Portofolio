import {
  certificateCategoryLabels,
  certificateKindLabels,
  certificates,
} from "@/lib/certificates";
import {
  copy,
  profile,
  projects,
  type Locale,
  type Project,
} from "@/lib/portfolio";
import type { ChatMode, PortfolioSource } from "@/lib/ai/types";

type KnowledgeSection = {
  id: string;
  title: string;
  tags: string[];
  body: string;
  sources: PortfolioSource[];
  priority: number;
};

const aliases: Record<string, string[]> = {
  ai: ["artificial intelligence", "kecerdasan buatan", "machine learning", "ml"],
  backend: ["api", "fastapi", "flask", "server", "database", "redis", "supabase", "mysql", "postgresql"],
  certificate: ["credential", "credentials", "sertifikat", "certification", "course", "kelas", "jam", "hours", "silabus", "kurikulum", "submission", "dicoding"],
  cv: [
    "cv",
    "resume",
    "curriculum vitae",
    "riwayat hidup",
    "biodata",
    "unduh cv",
    "download cv",
    "file cv",
    "dokumen cv",
    "preview cv",
    "pratinjau cv",
    "ats",
  ],
  frontend: ["react", "next.js", "nextjs", "ui", "web", "interface", "antarmuka", "tailwind"],
  internship: [
    "bima technologies",
    "bima",
    "indihome",
    "telkom indonesia",
    "magang",
    "intern",
    "pengalaman kerja",
    "work experience",
    "cv bima",
  ],
  mobile: ["flutter", "dart", "aplikasi mobile", "quizint"],
  organization: [
    "komisi 3",
    "komisi iii",
    "dpa",
    "hmtt",
    "dpa hmtt",
    "dewan perwakilan anggota",
    "pengawasan",
    "legislatif",
    "badan pengurus",
    "bp hmtt",
    "monev",
    "surat pengawasan",
    "pedoman baku",
    "sidang lpj",
    "muker",
    "organisasi",
    "leadership",
    "kepemimpinan",
    "@dpa_hmtt",
    "dpa_hmtt",
  ],
  project: ["projects", "proyek", "portfolio", "portofolio", "karya", "scovis", "dermascan"],
  recruiter: ["hire", "hiring", "rekrut", "recruiter", "strength", "kelebihan", "fit", "gaji", "salary", "kualifikasi"],
};

function normalize(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function expandedTerms(query: string) {
  const normalized = normalize(query);
  const terms = new Set(
    normalized
      .split(" ")
      .map((term) => term.replace(/^[.\-]+|[.\-]+$/g, ""))
      .filter((term) => term.length > 2),
  );
  const paddedQuery = ` ${normalized} `;

  for (const [key, values] of Object.entries(aliases)) {
    const phrases = [key, ...values].map(normalize);
    if (phrases.some((phrase) => paddedQuery.includes(` ${phrase} `))) {
      terms.add(key);
      values.flatMap((value) => normalize(value).split(" ")).forEach((term) => {
        if (term.length > 2) terms.add(term);
      });
    }
  }

  return [...terms];
}

function localizedList(items: { en: string; id: string }[], locale: Locale) {
  return items.map((item) => `- ${item[locale]}`).join("\n");
}

function projectSection(project: Project, locale: Locale): KnowledgeSection {
  const route = `/${locale}/projects/${project.slug}`;
  const sources: PortfolioSource[] = [
    {
      id: `case-${project.slug}`,
      title: `${project.title} case study`,
      description: locale === "id" ? "Konteks, arsitektur, bukti, dan batasan proyek." : "Project context, architecture, evidence, and limitations.",
      href: route,
      kind: "case-study",
    },
    ...project.repositories.map((repository, index) => ({
      id: `repo-${project.slug}-${index}`,
      title: repository.label[locale],
      description: `${project.title} · GitHub`,
      href: repository.href,
      kind: "repository" as const,
    })),
    ...project.links.map((link, index) => ({
      id: `live-${project.slug}-${index}`,
      title: link.label[locale],
      description: project.title,
      href: link.href,
      kind: "live-product" as const,
    })),
  ];

  return {
    id: `project-${project.slug}`,
    title: project.title,
    tags: [project.slug, project.tier, ...project.categories, ...project.stack],
    priority: project.number === "01" ? 12 : project.number === "02" ? 9 : 5,
    sources,
    body: [
      `PROJECT: ${project.title} (${project.tier})`,
      `SUMMARY: ${project.summary[locale]}`,
      `CONTEXT: ${project.context[locale]}`,
      `REYY'S CONTRIBUTION: ${project.role[locale]}`,
      `STACK: ${project.stack.join(", ")}`,
      `CAPABILITIES:\n${localizedList(project.features, locale)}`,
      `ARCHITECTURE:\n${localizedList(project.architecture, locale)}`,
      `ENGINEERING DECISIONS:\n${localizedList(project.decisions, locale)}`,
      `VERIFIED EVIDENCE:\n${localizedList(project.evidence, locale)}`,
      `LIMITATIONS:\n${localizedList(project.limitations, locale)}`,
    ].join("\n"),
  };
}

function profileSection(locale: Locale): KnowledgeSection {
  const content = copy[locale];
  const isIndo = locale === "id";

  return {
    id: "profile-reyy",
    title: isIndo ? "Profil & Pengalaman Reyy" : "Reyy Profile & Work Experience",
    tags: [
      "Reyy",
      "Mohammad Raihan",
      "Mohammad Raihan Hadriansyah Prasetya",
      "AI ML Engineer",
      "Full Stack Developer",
      "Software Engineer",
      "Indonesia",
      "Bandung",
      "Telkom University",
      "Bima Technologies",
      "IndiHome",
      "Telkom Indonesia",
      "HMTT",
      "DPA HMTT",
      "Komisi 3",
      "@dpa_hmtt",
      "EPrT",
      "CV",
      "Resume",
    ],
    priority: 22,
    sources: [
      {
        id: "profile-cv",
        title: "Master Hybrid CV (PDF)",
        description: isIndo ? "Pratinjau & Unduh CV 3 Halaman ATS" : "Preview & Download 3-Page ATS CV",
        href: "/cv/Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf",
        kind: "profile",
      },
      {
        id: "profile-about",
        title: isIndo ? "Tentang Reyy" : "About Reyy",
        description: content.about.title,
        href: `/${locale}/about`,
        kind: "profile",
      },
      {
        id: "profile-github",
        title: "GitHub",
        description: "RaihanHadriansyah21",
        href: profile.github,
        kind: "profile",
      },
      {
        id: "profile-linkedin",
        title: "LinkedIn",
        description: "reyhadri",
        href: profile.linkedin,
        kind: "profile",
      },
      {
        id: "profile-dpa-ig",
        title: "Instagram @dpa_hmtt",
        description: isIndo ? "Akun Instagram resmi DPA HMTT Telkom University" : "Official DPA HMTT Telkom University Instagram",
        href: "https://www.instagram.com/dpa_hmtt",
        kind: "profile",
      },
    ],
    body: [
      `PROFILE: ${profile.legalName}, usually called ${profile.displayName}.`,
      `POSITIONING: AI/ML Engineer and Full-Stack Developer focused on moving machine-learning work beyond notebooks into APIs, data systems, interfaces, and deployment-ready production workflows.`,
      `CURRENT STATUS: Officially graduated with a Bachelor of Engineering (S.T.) in Telecommunication Engineering from Telkom University via Yudisium (GPA 3.29/4.00, formal commencement ceremony scheduled November 2026). Reyy is immediately available for full-time on-site, hybrid, or remote engineering roles.`,
      `LOCATION: ${profile.location}.`,
      `OFFICIAL CV: Reyy provides a single unified Master Hybrid CV (3 full pages, A4 standard, ATS Scored 90+) unifying Applied AI/ML Engineering and Full-Stack Software Engineering with all 5 flagship technical projects, quantifiable internship achievements, and verified credentials. Visitors can preview or download it directly via the 'Preview CV' button in the portfolio or via /cv/Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf.`,
      `INTERNSHIP ACHIEVEMENTS (QUANTIFIED & FACT-BASED):`,
      `- CV. Bima Technologies (IT Intern, June - Sept 2025): Maintained internal operational web systems, resolved 15+ frontend UI and API integration bugs across modular services, executed and optimized dozens of transactional SQL queries (MySQL) to maintain data consistency, authored module documentation, and collaborated via Git pull requests.`,
      `- PT Telkom Indonesia / IndiHome (FTTH & Wi-Fi Installation Intern, July - Aug 2021): Deployed fiber-optic customer cabling and configured 30+ client router/ONT units with a 100% connectivity test pass rate, troubleshooting optical signal loss and local networks.`,
      `LEADERSHIP & GOVERNANCE:`,
      `- Coordinator / Head of Commission 3 (Komisi III Pengawasan) at Dewan Perwakilan Anggota (DPA) HMTT Telkom University (June 2025 - April 2026; official Instagram: @dpa_hmtt), previously Legislative Staff (Sept 2024 - June 2025). Acting as the 'Eyes and Ears' of DPA HMTT, Reyy enforced constitutional compliance (AD/ART, PDK, GBHO, Muker) over the Executive Board (BP HMTT), drafted the official Pedoman Baku Pengawasan BP HMTT, issued formal Surat Pengawasan audit letters, and presided over the 100-Day Work MONEV Assembly and Sidang LPJ.`,
      `- Event Planner at HIPMI PT Telkom University (2024); Event Planning Staff at Mightyducks Basketball Competition (2024).`,
      `SPECIAL COHORT: AI Engineer Cohort at Coding Camp 2026 powered by DBS Foundation & Dicoding Indonesia (Feb-July 2026) covering Python, ML, Deep Learning, and AI capstone deployment.`,
      `EDUCATION: Bachelor of Engineering (S.T.) in Telecommunication Engineering from Telkom University, 2022-2026 (GPA 3.29, yudisium completed, Nov 2026 commencement); Vocational High School at SMK Telkom Bandung, Access Network Engineering (2019-2022).`,
      `ENGLISH & CERTIFICATIONS: EPrT score 490, equivalent to CEFR B1 (April 30, 2026 - April 30, 2028); English for Business Communication score 90% (The British Institute & DBS Foundation); certified in Advanced Deep Learning (90 hrs), Fundamental Deep Learning (110 hrs), Machine Learning (90 hrs), and Azure Generative AI (45 hrs).`,
      `INFRASTRUCTURE & RELIABILITY: Deployed this portfolio with Next.js 16, React 19, Supabase PostgreSQL, automated Vercel Cron keep-alive (/api/cron/keep-alive) running every 2 days, anti-bot telemetry filtering, and automated Playwright E2E testing.`,
      `OPPORTUNITIES: Open to full-time AI/ML, backend, frontend, and full-stack roles at startups or larger technology companies in Indonesia and beyond.`,
      `ABOUT: ${content.about.body}`,
      `CORE STRENGTHS: ${content.proof.join("; ")}.`,
      `CONTACT: Email ${profile.email}; GitHub ${profile.github}; LinkedIn ${profile.linkedin}; Instagram ${profile.instagram}; DPA HMTT Instagram @dpa_hmtt.`,
    ].join("\n"),
  };
}

function leadershipSection(locale: Locale): KnowledgeSection {
  const isIndo = locale === "id";
  return {
    id: "org-komisi3-dpa-hmtt",
    title: isIndo ? "Kepemimpinan & Pengawasan Komisi 3 DPA HMTT" : "Commission 3 DPA HMTT Leadership & Oversight",
    tags: [
      "komisi 3",
      "komisi iii",
      "dpa",
      "hmtt",
      "dpa hmtt",
      "dewan perwakilan anggota",
      "pengawasan",
      "legislatif",
      "badan pengurus",
      "bp hmtt",
      "pedoman baku",
      "surat pengawasan",
      "monev",
      "100 hari kerja",
      "sidang lpj",
      "muker",
      "organisasi",
      "leadership",
      "kepemimpinan",
      "@dpa_hmtt",
      "dpa_hmtt",
      "telkom university",
    ],
    priority: 17,
    sources: [
      {
        id: "org-dpa-instagram",
        title: "Instagram @dpa_hmtt",
        description: isIndo ? "Akun resmi DPA HMTT Telkom University" : "Official Instagram of DPA HMTT Telkom University",
        href: "https://www.instagram.com/dpa_hmtt",
        kind: "profile",
      },
      {
        id: "profile-about",
        title: isIndo ? "Tentang Reyy (Organisasi & Kepemimpinan)" : "About Reyy (Leadership & Governance)",
        description: isIndo ? "Riwayat kepemimpinan dan tata kelola legislatif" : "Leadership and legislative governance record",
        href: `/${locale}/about`,
        kind: "profile",
      },
    ],
    body: isIndo
      ? [
          "ORGANISASI: Dewan Perwakilan Anggota (DPA) HMTT Telkom University (Akun Instagram resmi: @dpa_hmtt).",
          "PERAN REYY: Koordinator / Ketua Komisi 3 (Komisi III Pengawasan) DPA HMTT periode Juni 2025 - April 2026; sebelumnya menjabat sebagai Staf Legislatif DPA HMTT (September 2024 - Juni 2025).",
          "FUNGSI & FILOSOFI UTAMA: Komisi 3 bertindak sebagai 'Mata dan Telinga' DPA HMTT dalam menjalankan fungsi pengawasan legislatif terhadap Badan Pengurus (BP) HMTT di tingkat Program Studi S1 Teknik Telekomunikasi, Fakultas Teknik Elektro, Telkom University.",
          "LANDASAN KEPATUHAN: Mengawal dan memastikan seluruh program kerja (Proker) dan agenda BP HMTT berjalan sesuai konstitusi: AD/ART, Pedoman Dasar Kepengurusan (PDK), Garis-Garis Besar Haluan Organisasi (GBHO), dan ketetapan Musyawarah Kerja (Muker).",
          "INSTRUMEN BAKU PENGAWASAN: Menyusun dan menegakkan 'Pedoman Baku Pengawasan BP HMTT' dengan parameter kuantitatif dan kualitatif terukur, mencakup ketepatan undangan & proposal (H-5), inovasi konsep kegiatan, target kuantitatif peserta (keberhasilan 76-100%), ketepatan timeline, akuntabilitas sumber dana (dana kemahasiswaan/universitas dan sponsorship), serta kepatuhan penyusunan Laporan Pertanggungjawaban (LPJ).",
          "SURAT PENGAWASAN: Menerbitkan instrumen hukum formal 'Surat Pengawasan BP HMTT' sebagai bukti inspeksi langsung lapangan pada setiap agenda/acara (contohnya Open Mind ASTE, Open Mind LINK, Bina Desa, TelcoTalk, dll.) yang ditandatangani oleh Penanggung Jawab Acara dan Komisi 3 DPA HMTT.",
          "FORUM PERSIDANGAN RESMI: Bertindak sebagai Presidium Sidang Monitoring dan Evaluasi (MONEV) 100 Hari Kerja BP HMTT, memimpin Pleno Pengawasan berkala DPA HMTT, serta mengawal Sidang LPJ Akhir Tahun kepengurusan.",
          "AKUN SOSIAL RESMI DPA HMTT: Pengunjung dapat melihat dokumentasi publik dan informasi kepengurusan di akun Instagram resmi @dpa_hmtt.",
        ].join("\n")
      : [
          "ORGANIZATION: Dewan Perwakilan Anggota (DPA) HMTT Telkom University / Student Representative Council (Official Instagram: @dpa_hmtt).",
          "REYY'S ROLE: Coordinator / Head of Commission 3 (Supervisory & Oversight Commission) DPA HMTT from June 2025 - April 2026; previously Legislative Staff from September 2024 - June 2025.",
          "CORE MANDATE & PHILOSOPHY: Commission 3 acts as the 'Eyes and Ears' of DPA HMTT, conducting legislative oversight and operational audit of the Executive Board (Badan Pengurus / BP HMTT) at the Telecommunication Engineering Undergraduate Program, School of Electrical Engineering, Telkom University.",
          "CONSTITUTIONAL COMPLIANCE: Enforces compliance with organizational statutes: AD/ART, PDK (Organizational Guidelines), GBHO (Broad Outlines of Organizational Policy), and Muker (Work Conference Mandates).",
          "STANDARD OVERSIGHT INSTRUMENT: Authored and executed the 'Pedoman Baku Pengawasan BP HMTT' measuring quantitative and qualitative metrics: advance proposal & invitation notice (H-5), concept innovation, quantitative participant target achievement (76-100%), timeline adherence, transparent budgeting (university student affairs funding and external sponsorship), and audit-ready LPJ reporting.",
          "FORMAL SUPERVISORY LETTERS: Issued legally binding 'Surat Pengawasan BP HMTT' oversight audit records for each monitored program (such as Open Mind ASTE, Open Mind LINK, Bina Desa, TelcoTalk, etc.) co-signed by Event Project Managers and Commission 3.",
          "LEGISLATIVE HEARINGS: Served as Presidium at the 100-Day Work Monitoring & Evaluation (MONEV) Assembly, led periodic Supervisory Plenary Sessions, and directed final annual Accountability Hearing (Sidang LPJ).",
          "OFFICIAL SOCIAL CHANNEL: Visitors can view official public documentation and organizational updates on Instagram @dpa_hmtt.",
        ].join("\n"),
  };
}

function cvSection(locale: Locale): KnowledgeSection {
  const isIndo = locale === "id";
  return {
    id: "cv-master-hybrid",
    title: isIndo ? "Master Hybrid Curriculum Vitae (CV)" : "Master Hybrid Curriculum Vitae (CV)",
    tags: [
      "cv",
      "resume",
      "curriculum vitae",
      "riwayat hidup",
      "biodata",
      "unduh cv",
      "download cv",
      "preview cv",
      "ats",
      "pdf",
      "master cv",
      "hybrid cv",
    ],
    priority: 18,
    sources: [
      {
        id: "source-cv-pdf",
        title: "Master Hybrid CV (PDF)",
        description: isIndo ? "Unduh CV 3 Halaman Standar ATS" : "Download 3-Page ATS Standard CV",
        href: "/cv/Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf",
        kind: "profile",
      },
    ],
    body: isIndo
      ? [
          "DOKUMEN CV RESMI: Mohammad Raihan Hadriansyah Prasetya memiliki 1 Master Hybrid CV resmi (3 Halaman penuh, standar A4, skor ATS 90+) yang menyatukan keahlian AI/ML Engineering dan Full-Stack Software Engineering.",
          "CARA AKSES & UNDUH: Pengunjung dapat langsung melihat pratinjau dokumen melalui tombol 'Pratinjau CV' di header/hero portofolio, atau mengunduh langsung berkas PDF di /cv/Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf.",
          "PROYEK UNGGULAN DALAM CV: Memuat 5 proyek teknik nyata siap produksi: SCOVIS (Next.js 16, React 19, FastAPI, Supabase, Redis/RQ, Docker Compose, Playwright), DermaScan (React, FastAPI, TFLite), Vehicle Classification (MobileNetV2), Interactive Portfolio Platform (Next.js 16, Streaming AI, Vercel Cron keep-alive, Playwright), dan QuizInt (Flutter, Dart, Supabase).",
          "PENGALAMAN MAGANG BERKUANTITAS: CV. Bima Technologies (IT Intern: memelihara modul web, menyelesaikan 15+ bug UI/API, optimasi puluhan kueri MySQL, Git feature-branch) dan PT Telkom Indonesia IndiHome (Instalasi FTTH & Wi-Fi: kabel optik dan konfigurasi 30+ router/ONT dengan tingkat uji konektivitas 100%).",
          "PENDIDIKAN & KREDENSIAL: S1 Teknik Telekomunikasi Telkom University (IPK 3.29, yudisium selesai, wisuda November 2026), Coding Camp 2026 AI Engineer Specialization (DBS Foundation & Dicoding), dan Microsoft Certified.",
        ].join("\n")
      : [
          "OFFICIAL CV DOCUMENT: Mohammad Raihan Hadriansyah Prasetya maintains a single official Master Hybrid CV (3 full pages, A4 standard, ATS Scored 90+) unifying Applied AI/ML Engineering and Full-Stack Software Engineering.",
          "ACCESS & DOWNLOAD: Visitors can preview the document via the 'Preview CV' button in the portfolio hero/navigation or download the PDF at /cv/Mohammad_Raihan_CV_AI_Fullstack_Engineer.pdf.",
          "FEATURED PROJECTS: Includes 5 production-grade technical projects: SCOVIS (Next.js 16, React 19, FastAPI, Supabase, Redis/RQ, Docker Compose, Playwright), DermaScan (React, FastAPI, TFLite), Vehicle Classification (MobileNetV2), Interactive Portfolio Platform (Next.js 16, Streaming AI, Vercel Cron keep-alive, Playwright), and QuizInt (Flutter, Dart, Supabase).",
          "QUANTIFIED INTERNSHIP ACHIEVEMENTS: CV. Bima Technologies (IT Intern: internal web maintenance, resolved 15+ UI/API bugs, MySQL optimization, Git workflows) and PT Telkom Indonesia IndiHome (FTTH & Wi-Fi Installation Intern: optical cabling, configured 30+ router/ONT units with 100% connectivity test pass rate).",
          "EDUCATION & CREDENTIALS: Bachelor of Engineering (S.T.) in Telecommunication Engineering from Telkom University (GPA 3.29, yudisium completed, commencement Nov 2026), Coding Camp 2026 AI Engineer Specialization (DBS Foundation & Dicoding), and Microsoft Certified.",
        ].join("\n"),
  };
}

function certificateSections(locale: Locale): KnowledgeSection[] {
  return certificates.map((certificate) => {
    const category = certificateCategoryLabels[certificate.category][locale];
    const kind = certificateKindLabels[certificate.kind][locale];
    const credentialPage = `/${locale}/credentials`;
    const sources: PortfolioSource[] = [
      {
        id: `certificate-${certificate.slug}`,
        title: certificate.title,
        description: `${certificate.issuer} · ${certificate.issuedAt}`,
        href: certificate.verificationUrl || credentialPage,
        kind: "certificate",
      },
    ];

    const bodyLines = [
      `CERTIFICATE: ${certificate.title}`,
      `ISSUER: ${certificate.issuer}`,
      `ISSUED: ${certificate.issuedAt}`,
      `CATEGORY: ${category}`,
      `TYPE: ${kind}`,
    ];

    if (certificate.hours) {
      bodyLines.push(`DURATION / HOURS: ${certificate.hours} ${locale === "id" ? "Jam Pembelajaran" : "Learning Hours"}`);
    }

    if (certificate.skills && certificate.skills.length > 0) {
      bodyLines.push(`SKILLS COVERED: ${certificate.skills.join(", ")}`);
    }

    if (certificate.syllabus && certificate.syllabus.length > 0) {
      bodyLines.push(`CURRICULUM / SYLLABUS:\n${certificate.syllabus.map((s) => `- ${s}`).join("\n")}`);
    }

    if (certificate.submission) {
      bodyLines.push(`FINAL PROJECT / SUBMISSION: ${certificate.submission}`);
    }

    bodyLines.push(
      `OFFICIAL VERIFICATION: ${certificate.verificationUrl ? "Available through the supplied source card." : "No direct public issuer verification link is recorded."}`
    );
    bodyLines.push(
      `PRIVACY: The public website uses a reviewed preview and never exposes the raw PDF.`
    );

    const tags = [
      certificate.title,
      certificate.issuer,
      category,
      kind,
      certificate.category,
      certificate.kind,
      ...(certificate.skills || []),
    ];

    return {
      id: `certificate-${certificate.slug}`,
      title: certificate.title,
      tags,
      priority: certificate.featured ? 7 : certificate.kind === "course" || certificate.kind === "program" ? 4 : 1,
      sources,
      body: bodyLines.join("\n"),
    };
  });
}

function scoreSection(section: KnowledgeSection, terms: string[], mode: ChatMode) {
  const title = normalize(section.title);
  const tags = normalize(section.tags.join(" "));
  const body = normalize(section.body);
  let score = section.priority * 0.08;

  for (const term of terms) {
    if (title.includes(term)) score += 8;
    if (tags.includes(term)) score += 4;
    if (body.includes(term)) score += 1;
  }

  if (mode === "recruiter" && section.id.startsWith("project-")) score += section.priority * 0.22;
  if (mode === "technical" && section.id.startsWith("project-")) score += 2;
  if (mode === "explore" && (section.id === "project-scovis" || section.id === "project-dermascan")) score += 1.5;

  return score;
}

function uniqueSources(sections: KnowledgeSection[]) {
  const seen = new Set<string>();

  return sections
    .flatMap((section) => section.sources)
    .filter((source) => {
      if (seen.has(source.href)) return false;
      seen.add(source.href);
      return true;
    })
    .slice(0, 6);
}

export function retrievePortfolioKnowledge(query: string, locale: Locale, mode: ChatMode) {
  const profileKnowledge = profileSection(locale);
  const leadershipKnowledge = leadershipSection(locale);
  const cvKnowledge = cvSection(locale);
  const projectKnowledge = projects.map((project) => projectSection(project, locale));
  const generalSections = [leadershipKnowledge, cvKnowledge, ...projectKnowledge];
  const allSections = [...generalSections, ...certificateSections(locale)];
  const terms = expandedTerms(query);
  const ranked = allSections
    .map((section) => ({ section, score: scoreSection(section, terms, mode) }))
    .sort((a, b) => b.score - a.score);

  const hasCertificateIntent = terms.some((term) =>
    ["certificate", "certificates", "credential", "credentials", "sertifikat", "sertifikasi", "certification", "course", "kelas", "jam", "hours", "silabus", "kurikulum", "submission", "dicoding"].includes(term)
  );

  const candidates = hasCertificateIntent
    ? ranked
    : ranked.filter((item) =>
        item.section.id.startsWith("project-") ||
        item.section.id.startsWith("org-") ||
        item.section.id.startsWith("cv-")
      );

  const minimumScore = terms.length === 0 ? Number.POSITIVE_INFINITY : 2;
  const normalizedQuery = normalize(query);
  const explicitlyNamedProjects = projectKnowledge.filter((section) =>
    [section.title, section.id.replace("project-", "")].some((name) => normalizedQuery.includes(normalize(name))),
  );

  const selected = explicitlyNamedProjects.length > 0
    ? explicitlyNamedProjects.slice(0, 2)
    : candidates
        .filter((item) => item.score >= minimumScore)
        .slice(0, hasCertificateIntent ? 5 : 3)
        .map((item) => item.section);

  if (selected.length === 0) {
    selected.push(projectKnowledge[0], projectKnowledge[1]);
  }

  const sections = [profileKnowledge, ...selected.filter((section) => section.id !== profileKnowledge.id)];

  return {
    context: sections.map((section) => section.body).join("\n\n---\n\n"),
    sources: uniqueSources([...selected, profileKnowledge]),
  };
}
