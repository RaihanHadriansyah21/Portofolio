export const locales = ["en", "id"] as const;

export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;

export type Project = {
  slug: string;
  number: string;
  title: string;
  tier: "Flagship" | "Featured" | "ML Laboratory" | "Foundation";
  categories: string[];
  stack: string[];
  summary: LocalizedText;
  context: LocalizedText;
  role: LocalizedText;
  architecture: LocalizedText[];
  evidence: LocalizedText[];
  limitations: LocalizedText[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "scovis",
    number: "01",
    title: "SCOVIS",
    tier: "Flagship",
    categories: ["Applied AI", "Full Stack", "Backend"],
    stack: ["Next.js", "TypeScript", "FastAPI", "TensorFlow", "Supabase", "Redis/RQ"],
    summary: {
      en: "A human-in-the-loop system that helps lecturers review handwritten-answer score classifications across a complete academic workflow.",
      id: "Sistem human-in-the-loop yang membantu dosen meninjau klasifikasi nilai jawaban tulisan tangan dalam alur akademik yang lengkap.",
    },
    context: {
      en: "SCOVIS connects student submissions, asynchronous model inference, lecturer review, and controlled result release. The model classifies answer images directly; it is not an OCR system.",
      id: "SCOVIS menghubungkan pengumpulan jawaban mahasiswa, inferensi model asinkron, peninjauan dosen, dan perilisan hasil yang terkontrol. Model mengklasifikasikan gambar jawaban secara langsung; sistem ini bukan OCR.",
    },
    role: {
      en: "I worked across the product surface, AI service integration, multi-role workflows, data operations, testing, and deployment readiness as part of a team project.",
      id: "Saya bekerja lintas permukaan produk, integrasi layanan AI, alur multi-peran, operasi data, pengujian, dan kesiapan deployment sebagai bagian dari proyek tim.",
    },
    architecture: [
      { en: "Next.js interface for student, lecturer, and administrator workflows", id: "Antarmuka Next.js untuk alur mahasiswa, dosen, dan administrator" },
      { en: "Supabase Auth, PostgreSQL, RLS, RPC, and object storage", id: "Supabase Auth, PostgreSQL, RLS, RPC, dan object storage" },
      { en: "FastAPI orchestration with Redis/RQ asynchronous jobs", id: "Orkestrasi FastAPI dengan pekerjaan asinkron Redis/RQ" },
      { en: "TensorFlow/Keras workers with lazy loading and a model registry", id: "Worker TensorFlow/Keras dengan lazy loading dan model registry" },
    ],
    evidence: [
      { en: "31 documented FastAPI routes at the audited snapshot", id: "31 route FastAPI terdokumentasi pada snapshot audit" },
      { en: "72 H5 artifacts organized as 3 backbone families × 24 answer sections", id: "72 artefak H5 yang tersusun sebagai 3 keluarga backbone × 24 bagian jawaban" },
      { en: "Public frontend and backend deployment surfaces", id: "Deployment frontend dan backend yang dapat diakses publik" },
    ],
    limitations: [
      { en: "Artifact compatibility checks do not establish independent predictive accuracy or generalization.", id: "Pemeriksaan kompatibilitas artefak tidak membuktikan akurasi prediktif independen atau generalisasi." },
      { en: "Broader end-to-end rehearsal and dataset-to-model lineage remain areas to strengthen.", id: "Pengujian end-to-end yang lebih luas dan lineage dataset-ke-model masih perlu diperkuat." },
    ],
    links: [
      { label: "Live product", href: "https://scovis.vercel.app" },
      { label: "Frontend", href: "https://github.com/RaihanHadriansyah21/scovis-frontend" },
      { label: "Backend", href: "https://github.com/RaihanHadriansyah21/scovis-backend" },
    ],
  },
  {
    slug: "dermascan",
    number: "02",
    title: "DermaScan",
    tier: "Featured",
    categories: ["Applied AI", "Full Stack"],
    stack: ["TensorFlow Lite", "FastAPI", "React", "Railway", "Vercel"],
    summary: {
      en: "An educational skin-lesion decision-support prototype connecting a multi-task TFLite model, inference API, and web interface.",
      id: "Prototipe edukasi pendukung keputusan lesi kulit yang menghubungkan model multi-task TFLite, API inferensi, dan antarmuka web.",
    },
    context: {
      en: "The team project explores how a model artifact can be moved beyond a notebook into a guarded upload, preprocessing, inference, and result flow.",
      id: "Proyek tim ini mengeksplorasi bagaimana artefak model dapat dibawa keluar dari notebook menuju alur upload, preprocessing, inferensi, dan hasil yang terjaga.",
    },
    role: {
      en: "My documented contribution covered TFLite conversion, FastAPI integration, Railway/Vercel deployment, and full-stack integration.",
      id: "Kontribusi saya yang terdokumentasi mencakup konversi TFLite, integrasi FastAPI, deployment Railway/Vercel, dan integrasi full-stack.",
    },
    architecture: [
      { en: "React upload and probability interface", id: "Antarmuka React untuk upload dan probabilitas" },
      { en: "FastAPI validation and image preprocessing", id: "Validasi FastAPI dan preprocessing gambar" },
      { en: "Binary-risk and five-class TFLite outputs", id: "Output TFLite binary-risk dan lima kelas" },
    ],
    evidence: [
      { en: "Live web deployment and API health surface", id: "Deployment web dan endpoint kesehatan API" },
      { en: "Upload validation, EXIF correction, and color-constancy implementation", id: "Implementasi validasi upload, koreksi EXIF, dan color constancy" },
    ],
    limitations: [
      { en: "Educational decision support only; not a diagnostic tool or medical device.", id: "Hanya pendukung keputusan edukasional; bukan alat diagnosis atau perangkat medis." },
      { en: "The repository does not provide an independently reproducible clinical training pipeline.", id: "Repository belum menyediakan pipeline pelatihan klinis yang dapat direproduksi secara independen." },
    ],
    links: [
      { label: "Live product", href: "https://dermascan-azure.vercel.app" },
      { label: "Repository", href: "https://github.com/RaihanHadriansyah21/DermaScan_Project" },
    ],
  },
  {
    slug: "vehicle-classification",
    number: "03",
    title: "Vehicle Classification",
    tier: "Featured",
    categories: ["Machine Learning", "Computer Vision"],
    stack: ["TensorFlow", "MobileNetV2", "TFLite", "TensorFlow.js"],
    summary: {
      en: "A four-class transfer-learning experiment with model exports for server, mobile, and browser runtimes.",
      id: "Eksperimen transfer learning empat kelas dengan ekspor model untuk runtime server, mobile, dan browser.",
    },
    context: {
      en: "The experiment classifies buses, cars, motorcycles, and trucks using a frozen ImageNet MobileNetV2 backbone.",
      id: "Eksperimen mengklasifikasikan bus, mobil, motor, dan truk menggunakan backbone ImageNet MobileNetV2 yang dibekukan.",
    },
    role: {
      en: "I built the experiment workflow from stratified data splitting and training through evaluation and multi-runtime export.",
      id: "Saya membangun alur eksperimen dari pembagian data terstratifikasi dan pelatihan hingga evaluasi serta ekspor multi-runtime.",
    },
    architecture: [
      { en: "80/10/10 stratified train, validation, and test split", id: "Pembagian train, validation, dan test terstratifikasi 80/10/10" },
      { en: "Frozen backbone, global average pooling, dropout, and softmax head", id: "Frozen backbone, global average pooling, dropout, dan softmax head" },
      { en: "SavedModel, TFLite, and TensorFlow.js exports", id: "Ekspor SavedModel, TFLite, dan TensorFlow.js" },
    ],
    evidence: [
      { en: "Recorded held-out test accuracy: 93.46% for this dataset split", id: "Akurasi held-out test tercatat: 93,46% untuk pembagian dataset ini" },
      { en: "Training curves, confusion matrix, and prediction examples", id: "Kurva pelatihan, confusion matrix, dan contoh prediksi" },
    ],
    limitations: [
      { en: "The complete dataset is not packaged in the repository.", id: "Dataset lengkap tidak disertakan dalam repository." },
      { en: "The recorded test result is not an external real-world benchmark.", id: "Hasil test tercatat bukan benchmark eksternal dunia nyata." },
    ],
    links: [{ label: "Repository", href: "https://github.com/RaihanHadriansyah21/vehicle-image-classification-mobileNetV2" }],
  },
  {
    slug: "quizint",
    number: "04",
    title: "QuizInt",
    tier: "Featured",
    categories: ["Mobile", "Full Stack"],
    stack: ["Flutter", "Dart", "Supabase", "Provider", "Biometrics"],
    summary: {
      en: "A role-based learning prototype combining gamified quizzes, QR onboarding, biometrics, leaderboards, analytics, and PDF export.",
      id: "Prototipe pembelajaran berbasis peran yang menggabungkan kuis gamifikasi, onboarding QR, biometrik, leaderboard, analitik, dan ekspor PDF.",
    },
    context: {
      en: "QuizInt explores learner, instructor, and administrator journeys in one mobile product connected to Supabase.",
      id: "QuizInt mengeksplorasi perjalanan learner, instructor, dan administrator dalam satu produk mobile yang terhubung ke Supabase.",
    },
    role: {
      en: "Team documentation credits me with leading the Flutter codebase, quiz gameplay, Provider state management, Supabase integration, biometric authentication, QR scanning, and UI flows.",
      id: "Dokumentasi tim mencatat saya memimpin codebase Flutter, gameplay kuis, state management Provider, integrasi Supabase, autentikasi biometrik, pemindaian QR, dan alur UI.",
    },
    architecture: [
      { en: "Flutter role-based application surface", id: "Permukaan aplikasi Flutter berbasis peran" },
      { en: "Supabase authentication and PostgreSQL data workflows", id: "Autentikasi Supabase dan alur data PostgreSQL" },
      { en: "Device integrations for QR, local authentication, and PDF output", id: "Integrasi perangkat untuk QR, autentikasi lokal, dan keluaran PDF" },
    ],
    evidence: [
      { en: "Substantial implemented mobile workflow and integration surface", id: "Alur mobile dan permukaan integrasi yang terimplementasi secara substansial" },
      { en: "Documented division of team responsibilities", id: "Pembagian tanggung jawab tim yang terdokumentasi" },
    ],
    limitations: [
      { en: "Academic prototype, not a production learning-management system.", id: "Prototipe akademik, bukan learning-management system produksi." },
      { en: "Automated test coverage and external configuration remain limited.", id: "Cakupan pengujian otomatis dan konfigurasi eksternal masih terbatas." },
    ],
    links: [{ label: "Repository", href: "https://github.com/RaihanHadriansyah21/quizint-learning" }],
  },
  {
    slug: "bitcoin-forecasting",
    number: "05",
    title: "Bitcoin Forecasting",
    tier: "ML Laboratory",
    categories: ["Machine Learning", "Time Series"],
    stack: ["TensorFlow", "LSTM", "Attention", "Seq2Seq", "Python"],
    summary: {
      en: "A 24-step forecasting laboratory comparing baseline LSTM, attention-enhanced LSTM, and encoder-decoder Seq2Seq models.",
      id: "Laboratorium forecasting 24 langkah yang membandingkan baseline LSTM, LSTM dengan attention, dan encoder-decoder Seq2Seq.",
    },
    context: {
      en: "The experiment studies multi-step sequence modeling over five selected market and technical-indicator features.",
      id: "Eksperimen mempelajari sequence modeling multi-langkah pada lima fitur pasar dan indikator teknikal terpilih.",
    },
    role: {
      en: "I implemented chronological splitting, train-only scaling, custom attention, weighted MAE, and a custom training loop.",
      id: "Saya mengimplementasikan chronological split, train-only scaling, custom attention, weighted MAE, dan custom training loop.",
    },
    architecture: [
      { en: "72-step input window and 24-step forecast horizon", id: "Input window 72 langkah dan forecast horizon 24 langkah" },
      { en: "Chronological 70/20/10 split with train-only scaling", id: "Pembagian kronologis 70/20/10 dengan scaling hanya pada train" },
      { en: "Baseline, attention, and Seq2Seq comparison", id: "Perbandingan baseline, attention, dan Seq2Seq" },
    ],
    evidence: [{ en: "Recorded test MAE: 0.00418 on the scaled target", id: "Test MAE tercatat: 0,00418 pada target yang telah di-scale" }],
    limitations: [
      { en: "The MAE is not a dollar value and does not demonstrate profitable forecasting.", id: "Nilai MAE bukan nilai dolar dan tidak membuktikan forecasting yang menguntungkan." },
      { en: "No repeated backtest, transaction costs, or uncertainty intervals are included.", id: "Belum terdapat repeated backtest, biaya transaksi, atau interval ketidakpastian." },
    ],
    links: [{ label: "Repository", href: "https://github.com/RaihanHadriansyah21/bitcoin-price-forecasting-seq2seq" }],
  },
  {
    slug: "gojek-sentiment",
    number: "06",
    title: "Gojek Sentiment Analysis",
    tier: "ML Laboratory",
    categories: ["Machine Learning", "NLP"],
    stack: ["scikit-learn", "TensorFlow", "Sastrawi", "TF-IDF", "Python"],
    summary: {
      en: "An Indonesian review-sentiment experiment comparing Logistic Regression, linear SVM, and a dense neural network.",
      id: "Eksperimen sentimen ulasan Bahasa Indonesia yang membandingkan Logistic Regression, linear SVM, dan dense neural network.",
    },
    context: {
      en: "The project covers Google Play review collection, Indonesian preprocessing, lexicon labeling, and three-model comparison.",
      id: "Proyek mencakup pengumpulan ulasan Google Play, preprocessing Bahasa Indonesia, pelabelan lexicon, dan perbandingan tiga model.",
    },
    role: {
      en: "I implemented the collection, preprocessing, feature extraction, model comparison, and evaluation notebook workflow.",
      id: "Saya mengimplementasikan alur notebook untuk pengumpulan, preprocessing, feature extraction, perbandingan model, dan evaluasi.",
    },
    architecture: [
      { en: "Indonesian cleaning and Sastrawi stemming", id: "Pembersihan Bahasa Indonesia dan stemming Sastrawi" },
      { en: "TF-IDF features with Logistic Regression and source-verified linear SVM", id: "Fitur TF-IDF dengan Logistic Regression dan linear SVM yang diverifikasi dari source" },
      { en: "Dense neural-network comparison", id: "Perbandingan dense neural network" },
    ],
    evidence: [{ en: "Recorded rounded test accuracies: approximately 87%, 92%, and 88%", id: "Akurasi test tercatat setelah pembulatan: sekitar 87%, 92%, dan 88%" }],
    limitations: [
      { en: "Labels are lexicon-derived, not human-annotated ground truth.", id: "Label berasal dari lexicon, bukan ground truth yang dianotasi manusia." },
      { en: "Vectorization before the split introduces a leakage risk.", id: "Vectorisasi sebelum pembagian data menimbulkan risiko leakage." },
    ],
    links: [{ label: "Repository", href: "https://github.com/RaihanHadriansyah21/gojek-sentiment-analysis-ml-dl" }],
  },
  {
    slug: "cloud-inventory-api",
    number: "07",
    title: "Cloud Inventory API",
    tier: "Foundation",
    categories: ["Backend", "Cloud"],
    stack: ["Flask", "MongoDB", "Python", "REST API"],
    summary: {
      en: "An academic Flask and MongoDB CRUD API that established my early backend and single-VM cloud foundations.",
      id: "API CRUD akademik dengan Flask dan MongoDB yang membangun fondasi awal backend dan cloud single-VM saya.",
    },
    context: {
      en: "The lab implements product create, read, update, and delete operations using Flask-PyMongo and ObjectId.",
      id: "Lab mengimplementasikan operasi create, read, update, dan delete produk menggunakan Flask-PyMongo dan ObjectId.",
    },
    role: {
      en: "I implemented the API as a foundational cloud-computing coursework project.",
      id: "Saya mengimplementasikan API sebagai proyek coursework fondasi cloud computing.",
    },
    architecture: [
      { en: "Flask REST endpoints", id: "Endpoint REST Flask" },
      { en: "MongoDB persistence on a single-VM-oriented topology", id: "Persistensi MongoDB pada topologi berorientasi single-VM" },
    ],
    evidence: [{ en: "Complete product CRUD surface", id: "Permukaan CRUD produk yang lengkap" }],
    limitations: [
      { en: "Foundational lab only: no authentication, tests, pagination, or schema validation.", id: "Hanya lab fondasi: belum ada autentikasi, test, pagination, atau schema validation." },
      { en: "It should not be presented as a production cloud system.", id: "Tidak boleh dipresentasikan sebagai sistem cloud produksi." },
    ],
    links: [{ label: "Repository", href: "https://github.com/RaihanHadriansyah21/Project-1-Cloud-Computing" }],
  },
];

export const credentials = [
  { title: "Membangun Proyek Deep Learning Tingkat Mahir", issuer: "Dicoding", date: "May 2026", duration: "90 hours", focus: { en: "Custom TensorFlow architecture, multivariate time series, and project submission", id: "Arsitektur TensorFlow kustom, multivariate time series, dan submission proyek" } },
  { title: "Belajar Fundamental Deep Learning", issuer: "Dicoding", date: "May 2026", duration: "110 hours", focus: { en: "Computer vision, NLP, time series, recommendations, and model deployment", id: "Computer vision, NLP, time series, recommendation, dan deployment model" } },
  { title: "Belajar Machine Learning untuk Pemula", issuer: "Dicoding", date: "Apr 2026", duration: "90 hours", focus: { en: "Supervised and unsupervised workflows with project submission", id: "Alur supervised dan unsupervised dengan submission proyek" } },
  { title: "Memulai Pemrograman dengan Python", issuer: "Dicoding", date: "Mar 2026", duration: "60 hours", focus: { en: "Python foundations, object-oriented programming, testing, and libraries", id: "Fondasi Python, OOP, pengujian, dan library" } },
  { title: "Membangun Aplikasi Gen AI dengan Microsoft Azure", issuer: "Dicoding × Microsoft", date: "Mar 2026", duration: "", focus: { en: "Model deployment, Prompt Flow, RAG, responsible AI, and evaluation", id: "Deployment model, Prompt Flow, RAG, responsible AI, dan evaluasi" } },
  { title: "Belajar Penerapan Data Science dengan Microsoft Fabric", issuer: "Dicoding × Microsoft", date: "Mar 2026", duration: "", focus: { en: "Fabric notebooks, MLflow, deployment, monitoring, and batch prediction", id: "Fabric notebooks, MLflow, deployment, monitoring, dan batch prediction" } },
] as const;

export const profile = {
  displayName: "Reyy",
  legalName: "Mohammad Raihan Hadriansyah Prasetya",
  github: "https://github.com/RaihanHadriansyah21",
  linkedin: "https://www.linkedin.com/in/reyhadri",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const copy = {
  en: {
    nav: { work: "Work", credentials: "Credentials", about: "About", contact: "Contact" },
    hero: {
      eyebrow: "Applied AI · Full-Stack Product Engineering",
      title: "AI/ML Engineer & Full-Stack Developer",
      intro: "I move machine-learning work beyond the notebook—connecting models to APIs, data, interfaces, and deployment-ready product workflows.",
      primary: "Explore my work",
      secondary: "Meet Reyy",
      availability: "Open to full-time opportunities",
      status: "Graduate transition · Indonesia",
    },
    proof: ["Applied AI systems", "Model-to-product integration", "Web, backend & mobile", "Evidence-led engineering"],
    flagship: { eyebrow: "Flagship case study", title: "AI that stays accountable to people.", intro: "SCOVIS is the clearest expression of how I work: machine learning surrounded by intentional product, data, review, and deployment systems." },
    selected: { eyebrow: "Selected work", title: "Built across the stack, grounded in evidence.", intro: "Seven public projects, organized by the strength of their engineering story—not displayed as an undifferentiated list." },
    capabilities: { eyebrow: "Capabilities", title: "From experiment to usable system.", groups: [
      { title: "AI & Data", body: "TensorFlow, Keras, scikit-learn, pandas, NumPy, OpenCV, sequence modeling, computer vision, and NLP." },
      { title: "Backend & Data Services", body: "Python, FastAPI, Redis/RQ, Supabase, PostgreSQL, Flask, MongoDB, API contracts, and asynchronous jobs." },
      { title: "Web & Mobile", body: "Next.js, React, TypeScript, Tailwind CSS, Flutter, Dart, responsive interfaces, and role-based workflows." },
      { title: "Delivery & Quality", body: "Docker Compose, Caddy, Vercel, Railway, CI, pytest, Vitest, Playwright, documentation, and measured limitations." },
    ] },
    learning: { eyebrow: "Selected credentials", title: "Continuous learning with depth behind it.", intro: "Technical courses and submissions support the project evidence; they do not replace it." },
    about: { eyebrow: "About", title: "Hello, I’m Mohammad Raihan Hadriansyah Prasetya—Reyy for short.", body: "I have completed my Telecommunication Engineering thesis defense and am transitioning into full-time work while awaiting formal commencement. I am drawn to problems where models, software systems, and real user workflows have to work together—not just look convincing in a notebook." },
    contact: { eyebrow: "Let’s talk", title: "Building an AI or software team with real product ambition?", body: "I am exploring full-time AI/ML and full-stack engineering opportunities in startups and larger technology companies.", cta: "Connect on LinkedIn" },
    common: { viewCase: "View case study", viewAll: "View all projects", repository: "Repository", evidence: "Evidence", limitations: "Limits & next steps", architecture: "How it works", role: "My contribution", back: "Back to projects", all: "All", noResults: "No projects in this filter yet." },
  },
  id: {
    nav: { work: "Proyek", credentials: "Kredensial", about: "Tentang", contact: "Kontak" },
    hero: {
      eyebrow: "Applied AI · Full-Stack Product Engineering",
      title: "AI/ML Engineer & Full-Stack Developer",
      intro: "Saya membawa pekerjaan machine learning keluar dari notebook—menghubungkan model dengan API, data, antarmuka, dan alur produk yang siap dideploy.",
      primary: "Jelajahi karya saya",
      secondary: "Kenali Reyy",
      availability: "Terbuka untuk peluang full-time",
      status: "Transisi lulusan · Indonesia",
    },
    proof: ["Sistem applied AI", "Integrasi model-ke-produk", "Web, backend & mobile", "Engineering berbasis bukti"],
    flagship: { eyebrow: "Case study utama", title: "AI yang tetap bertanggung jawab kepada manusia.", intro: "SCOVIS adalah representasi terjelas dari cara saya bekerja: machine learning yang dikelilingi sistem produk, data, peninjauan, dan deployment yang dirancang dengan sengaja." },
    selected: { eyebrow: "Karya terpilih", title: "Dibangun lintas stack, berpijak pada bukti.", intro: "Tujuh proyek publik, diurutkan berdasarkan kekuatan cerita engineering—bukan ditampilkan sebagai daftar tanpa hierarki." },
    capabilities: { eyebrow: "Kapabilitas", title: "Dari eksperimen menjadi sistem yang dapat digunakan.", groups: [
      { title: "AI & Data", body: "TensorFlow, Keras, scikit-learn, pandas, NumPy, OpenCV, sequence modeling, computer vision, dan NLP." },
      { title: "Backend & Data Services", body: "Python, FastAPI, Redis/RQ, Supabase, PostgreSQL, Flask, MongoDB, kontrak API, dan pekerjaan asinkron." },
      { title: "Web & Mobile", body: "Next.js, React, TypeScript, Tailwind CSS, Flutter, Dart, antarmuka responsif, dan alur berbasis peran." },
      { title: "Delivery & Quality", body: "Docker Compose, Caddy, Vercel, Railway, CI, pytest, Vitest, Playwright, dokumentasi, dan batasan yang terukur." },
    ] },
    learning: { eyebrow: "Kredensial terpilih", title: "Belajar berkelanjutan dengan kedalaman nyata.", intro: "Kelas teknis dan submission mendukung bukti proyek; bukan menggantikannya." },
    about: { eyebrow: "Tentang", title: "Halo, saya Mohammad Raihan Hadriansyah Prasetya—biasa dipanggil Reyy.", body: "Saya telah menyelesaikan sidang tugas akhir Teknik Telekomunikasi dan sedang bertransisi menuju pekerjaan full-time sambil menunggu wisuda. Saya tertarik pada masalah ketika model, sistem perangkat lunak, dan alur pengguna nyata harus bekerja bersama—bukan sekadar terlihat meyakinkan di notebook." },
    contact: { eyebrow: "Mari berbicara", title: "Sedang membangun tim AI atau software dengan ambisi produk yang nyata?", body: "Saya sedang menjajaki peluang full-time AI/ML dan full-stack engineering di startup maupun perusahaan teknologi besar.", cta: "Terhubung di LinkedIn" },
    common: { viewCase: "Lihat case study", viewAll: "Lihat semua proyek", repository: "Repository", evidence: "Bukti", limitations: "Batasan & langkah berikutnya", architecture: "Cara kerja", role: "Kontribusi saya", back: "Kembali ke proyek", all: "Semua", noResults: "Belum ada proyek dalam filter ini." },
  },
} as const;

export function siteUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (host) return `https://${host}`;
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
