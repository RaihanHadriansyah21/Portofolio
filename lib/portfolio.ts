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
  features: LocalizedText[];
  architecture: LocalizedText[];
  decisions: LocalizedText[];
  evidence: LocalizedText[];
  limitations: LocalizedText[];
  repositories: { label: LocalizedText; href: string }[];
  links: { label: LocalizedText; href: string }[];
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
      en: "A human-in-the-loop platform that connects 24-section answer submission, asynchronous image-based score classification, lecturer review, and controlled result release.",
      id: "Platform human-in-the-loop yang menghubungkan pengumpulan jawaban 24 bagian, klasifikasi nilai berbasis gambar secara asinkron, review dosen, dan perilisan hasil yang terkontrol.",
    },
    context: {
      en: "SCOVIS is an undergraduate thesis team project for handling structured handwritten-answer assessment without turning model output into an automatic final grade. It classifies answer images directly—rather than transcribing them with OCR—and keeps the lecturer responsible for the final decision.",
      id: "SCOVIS adalah proyek tim tugas akhir untuk menangani penilaian jawaban tulisan tangan yang terstruktur tanpa menjadikan keluaran model sebagai nilai akhir otomatis. Sistem mengklasifikasikan gambar jawaban secara langsung—bukan mentranskripsikannya dengan OCR—dan tetap menempatkan dosen sebagai pengambil keputusan akhir.",
    },
    role: {
      en: "As part of the thesis team, I worked across the Next.js product surface, FastAPI/AI integration, multi-role workflows, Supabase data operations, tests, documentation, and deployment readiness. I do not present the model or the full system as solo work.",
      id: "Sebagai bagian dari tim tugas akhir, saya bekerja lintas antarmuka produk Next.js, integrasi FastAPI/AI, alur multi-peran, operasi data Supabase, pengujian, dokumentasi, dan kesiapan deployment. Saya tidak mengklaim model maupun keseluruhan sistem sebagai pekerjaan individu.",
    },
    features: [
      { en: "Students join courses by code or QR, crop and upload 24 answer sections, submit work, respond to section-level re-upload requests, and view released results.", id: "Mahasiswa bergabung ke mata kuliah melalui kode atau QR, melakukan crop dan upload 24 bagian jawaban, mengirim tugas, merespons permintaan re-upload per bagian, dan melihat hasil yang telah dirilis." },
      { en: "Lecturers manage courses, tasks, and rosters; start individual or batch AI jobs; compare answer images with recommendations; override scores; comment; request re-uploads; and finalize results.", id: "Dosen mengelola mata kuliah, tugas, dan peserta; menjalankan job AI individual atau batch; membandingkan gambar jawaban dengan rekomendasi; mengubah nilai; memberi komentar; meminta re-upload; dan memfinalisasi hasil." },
      { en: "Administrators provision users and enrollments, inspect audit and diagnostic views, manage settings, and review active model configuration.", id: "Administrator melakukan provisioning pengguna dan enrollment, memeriksa tampilan audit dan diagnostik, mengelola pengaturan, serta meninjau konfigurasi model aktif." },
      { en: "Finalized assessment data can be exported through controlled CSV and Excel workflows.", id: "Data penilaian yang telah difinalisasi dapat diekspor melalui alur CSV dan Excel yang terkontrol." },
    ],
    architecture: [
      { en: "Next.js 16 and React 19 provide role-specific student, lecturer, and administrator interfaces.", id: "Next.js 16 dan React 19 menyediakan antarmuka khusus untuk peran mahasiswa, dosen, dan administrator." },
      { en: "Supabase handles authentication, PostgreSQL data, Row Level Security, RPC operations, and answer-image storage.", id: "Supabase menangani autentikasi, data PostgreSQL, Row Level Security, operasi RPC, dan penyimpanan gambar jawaban." },
      { en: "FastAPI exposes the trusted AI and administration boundary; the audited snapshot documents 31 routes.", id: "FastAPI menjadi batas tepercaya untuk AI dan administrasi; snapshot yang diaudit mendokumentasikan 31 route." },
      { en: "Redis/RQ runs prediction jobs outside the request path with per-submission locking, one prediction retry, and stale-state reconciliation.", id: "Redis/RQ menjalankan job prediksi di luar request utama dengan lock per submission, satu retry prediksi, dan rekonsiliasi state yang stale." },
      { en: "A TensorFlow/Keras worker lazily loads an LRU-cached registry of 72 H5 artifacts: three backbone families across 24 answer sections.", id: "Worker TensorFlow/Keras melakukan lazy loading dengan cache LRU terhadap registry 72 artefak H5: tiga keluarga backbone untuk 24 bagian jawaban." },
    ],
    decisions: [
      { en: "Human review is a product invariant: model recommendations remain editable and are not released as final scores without lecturer action.", id: "Review manusia menjadi invariant produk: rekomendasi model tetap dapat diubah dan tidak dirilis sebagai nilai akhir tanpa tindakan dosen." },
      { en: "Asynchronous inference separates heavy model work from the browser request and exposes job progress to the interface.", id: "Inferensi asinkron memisahkan pekerjaan model yang berat dari request browser serta mengekspos progres job ke antarmuka." },
      { en: "Manifest, checksum, model-loading, and golden-regression checks protect runtime compatibility; they are intentionally not presented as proof of predictive generalization.", id: "Pemeriksaan manifest, checksum, model loading, dan golden regression melindungi kompatibilitas runtime; semuanya sengaja tidak dipresentasikan sebagai bukti generalisasi prediktif." },
    ],
    evidence: [
      { en: "The public repositories contain separate, working frontend and backend codebases with documented local validation commands.", id: "Repository publik memuat codebase frontend dan backend yang terpisah dan berfungsi, lengkap dengan perintah validasi lokal yang terdokumentasi." },
      { en: "The source implements the complete student → AI queue → lecturer review → result-release state flow, including score override and re-upload handling.", id: "Source mengimplementasikan alur state mahasiswa → queue AI → review dosen → perilisan hasil secara lengkap, termasuk perubahan nilai dan penanganan re-upload." },
      { en: "A public frontend and API health surface make the integration inspectable beyond screenshots.", id: "Frontend publik dan endpoint kesehatan API membuat integrasi dapat diperiksa melampaui screenshot." },
    ],
    limitations: [
      { en: "Artifact compatibility checks do not establish independent predictive accuracy or generalization.", id: "Pemeriksaan kompatibilitas artefak tidak membuktikan akurasi prediktif independen atau generalisasi." },
      { en: "Broader end-to-end rehearsal and dataset-to-model lineage remain areas to strengthen.", id: "Pengujian end-to-end yang lebih luas dan lineage dataset-ke-model masih perlu diperkuat." },
    ],
    repositories: [
      { label: { en: "Frontend repository", id: "Repository frontend" }, href: "https://github.com/RaihanHadriansyah21/scovis-frontend" },
      { label: { en: "Backend repository", id: "Repository backend" }, href: "https://github.com/RaihanHadriansyah21/scovis-backend" },
    ],
    links: [{ label: { en: "Live product", id: "Produk live" }, href: "https://scovis.vercel.app" }],
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
      en: "DermaScan is a Coding Camp 2026 capstone team prototype that moves a skin-lesion model artifact beyond a notebook into a guarded web workflow. It returns educational risk and lesion-class outputs with a medical disclaimer; it is not a diagnostic system.",
      id: "DermaScan adalah prototipe capstone tim Coding Camp 2026 yang membawa artefak model lesi kulit keluar dari notebook menuju alur web yang terjaga. Sistem menghasilkan keluaran risiko dan kelas lesi untuk edukasi dengan disclaimer medis; sistem ini bukan alat diagnosis.",
    },
    role: {
      en: "My documented contribution covered TFLite model conversion, FastAPI integration, Railway/Vercel deployment work, and end-to-end frontend–backend integration. Repository history shows multiple contributors, so I do not claim sole ownership of the model, dataset work, or React interface.",
      id: "Kontribusi saya yang terdokumentasi mencakup konversi model TFLite, integrasi FastAPI, pekerjaan deployment Railway/Vercel, dan integrasi frontend–backend secara end-to-end. Riwayat repository menunjukkan beberapa kontributor, sehingga saya tidak mengklaim kepemilikan tunggal atas model, pekerjaan dataset, maupun antarmuka React.",
    },
    features: [
      { en: "Drag-and-drop JPG/PNG upload with file-type and size validation before inference.", id: "Upload JPG/PNG melalui drag-and-drop dengan validasi tipe dan ukuran file sebelum inferensi." },
      { en: "A binary Low Risk / High Risk output and a five-class lesion prediction across AKIEC, BCC, BKL, MEL, and NV.", id: "Keluaran biner Low Risk / High Risk serta prediksi lima kelas lesi: AKIEC, BCC, BKL, MEL, dan NV." },
      { en: "Risk gauge, class-probability breakdown, lesion education, prevention guidance, and a visible medical disclaimer.", id: "Risk gauge, rincian probabilitas kelas, edukasi lesi, panduan pencegahan, dan disclaimer medis yang terlihat." },
      { en: "Public web deployment plus a health endpoint for checking whether the inference service and model are available.", id: "Deployment web publik serta health endpoint untuk memeriksa ketersediaan layanan inferensi dan model." },
    ],
    architecture: [
      { en: "React 18 and Vite manage the upload, scanning, probability, and educational interface.", id: "React 18 dan Vite menangani antarmuka upload, scanning, probabilitas, dan edukasi." },
      { en: "FastAPI validates multipart uploads and performs EXIF correction, memory-conscious image decoding, color constancy, resize, and center crop.", id: "FastAPI memvalidasi upload multipart lalu menjalankan koreksi EXIF, decoding gambar yang hemat memori, color constancy, resize, dan center crop." },
      { en: "The backend prefers a multi-task TFLite artifact and can fall back to the saved Keras model when required.", id: "Backend mengutamakan artefak multi-task TFLite dan dapat menggunakan model Keras tersimpan sebagai fallback bila diperlukan." },
      { en: "Railway hosts the Python inference service while Vercel hosts the web client.", id: "Railway meng-host layanan inferensi Python, sedangkan Vercel meng-host web client." },
    ],
    decisions: [
      { en: "TFLite is used as the preferred cloud runtime artifact to reduce the model-serving footprint; the repository supports a Keras fallback for compatibility.", id: "TFLite digunakan sebagai artefak runtime cloud utama untuk mengurangi footprint model serving; repository mendukung fallback Keras untuk kompatibilitas." },
      { en: "Preprocessing is encoded in the inference service so the deployed path applies the same resize, crop, and color-constancy contract.", id: "Preprocessing ditanamkan pada layanan inferensi agar jalur deployment menerapkan kontrak resize, crop, dan color constancy yang sama." },
      { en: "The result UI communicates uncertainty through probabilities and safety copy instead of presenting an output as a medical diagnosis.", id: "UI hasil mengomunikasikan ketidakpastian melalui probabilitas dan safety copy, bukan menyajikan keluaran sebagai diagnosis medis." },
    ],
    evidence: [
      { en: "The repository includes both TFLite and Keras artifacts, mappings, preprocessing configuration, FastAPI code, React code, and authentic product screenshots.", id: "Repository menyertakan artefak TFLite dan Keras, mapping, konfigurasi preprocessing, source FastAPI, source React, serta screenshot produk autentik." },
      { en: "The live product and API health surface demonstrate the deployed model-to-product integration.", id: "Produk live dan endpoint kesehatan API menunjukkan integrasi model-ke-produk yang telah dideploy." },
    ],
    limitations: [
      { en: "Educational decision support only; not a diagnostic tool or medical device.", id: "Hanya pendukung keputusan edukasional; bukan alat diagnosis atau perangkat medis." },
      { en: "The repository does not provide an independently reproducible clinical training pipeline.", id: "Repository belum menyediakan pipeline pelatihan klinis yang dapat direproduksi secara independen." },
    ],
    repositories: [{ label: { en: "GitHub repository", id: "Repository GitHub" }, href: "https://github.com/RaihanHadriansyah21/DermaScan_Project" }],
    links: [{ label: { en: "Live product", id: "Produk live" }, href: "https://dermascan-azure.vercel.app" }],
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
    features: [
      { en: "Four-way image classification for bus, car, motorcycle, and truck classes.", id: "Klasifikasi gambar empat kelas untuk bus, mobil, motor, dan truk." },
      { en: "Training augmentation and MobileNetV2-specific preprocessing inside the notebook workflow.", id: "Augmentasi data training dan preprocessing khusus MobileNetV2 di dalam alur notebook." },
      { en: "Evaluation artifacts include learning curves, a confusion matrix, and example predictions.", id: "Artefak evaluasi mencakup kurva pembelajaran, confusion matrix, dan contoh prediksi." },
      { en: "The trained model is exported for SavedModel, TensorFlow Lite, and TensorFlow.js runtimes.", id: "Model terlatih diekspor untuk runtime SavedModel, TensorFlow Lite, dan TensorFlow.js." },
    ],
    architecture: [
      { en: "80/10/10 stratified train, validation, and test split", id: "Pembagian train, validation, dan test terstratifikasi 80/10/10" },
      { en: "Frozen ImageNet-pretrained MobileNetV2 backbone with global average pooling, dropout, a 128-unit dense layer, and four-class softmax output", id: "Backbone MobileNetV2 pretrained ImageNet yang dibekukan dengan global average pooling, dropout, dense layer 128 unit, dan keluaran softmax empat kelas" },
      { en: "SavedModel, TFLite, and TensorFlow.js exports", id: "Ekspor SavedModel, TFLite, dan TensorFlow.js" },
    ],
    decisions: [
      { en: "The pretrained backbone remains frozen, making this a transfer-learning feature-extraction experiment rather than a separate fine-tuning study.", id: "Backbone pretrained tetap dibekukan, sehingga proyek ini merupakan eksperimen feature extraction berbasis transfer learning, bukan studi fine-tuning terpisah." },
      { en: "Multiple export formats test portability across server, mobile, and browser runtimes.", id: "Beberapa format ekspor digunakan untuk menguji portabilitas pada runtime server, mobile, dan browser." },
      { en: "The TFLite file is described as converted—not quantized—because the notebook does not configure an optimization or representative-dataset policy.", id: "File TFLite disebut sebagai hasil konversi—bukan quantized—karena notebook tidak mengatur kebijakan optimasi atau representative dataset." },
    ],
    evidence: [
      { en: "Saved notebook outputs record 96.46% final-epoch training accuracy, 94.77% validation accuracy, and 93.46% held-out test accuracy for this split.", id: "Output notebook tersimpan mencatat akurasi epoch akhir 96,46% pada training, 94,77% pada validation, dan 93,46% pada held-out test untuk split ini." },
      { en: "The repository packages the notebook, plots, sample images, class labels, and all three model export formats.", id: "Repository menyertakan notebook, plot, contoh gambar, label kelas, dan ketiga format ekspor model." },
    ],
    limitations: [
      { en: "The complete dataset is not packaged in the repository.", id: "Dataset lengkap tidak disertakan dalam repository." },
      { en: "The recorded test result is not an external real-world benchmark.", id: "Hasil test tercatat bukan benchmark eksternal dunia nyata." },
    ],
    repositories: [{ label: { en: "GitHub repository", id: "Repository GitHub" }, href: "https://github.com/RaihanHadriansyah21/vehicle-image-classification-mobileNetV2" }],
    links: [],
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
    features: [
      { en: "Learners join classes by code or QR, take timed quizzes, activate Double Score, Freeze Timer, 50:50, and Second Chance power-ups, then review scores and leaderboards.", id: "Mahasiswa bergabung ke kelas melalui kode atau QR, mengerjakan kuis bertimer, memakai power-up Double Score, Freeze Timer, 50:50, dan Second Chance, lalu meninjau nilai serta leaderboard." },
      { en: "Instructors manage question banks and quiz assignments, inspect analytics, export PDF gradebooks, and connect to optional Google Classroom flows.", id: "Dosen mengelola bank soal dan penugasan kuis, melihat analitik, mengekspor gradebook PDF, serta terhubung ke alur Google Classroom opsional." },
      { en: "Administrators manage users and platform data through a dedicated role surface.", id: "Administrator mengelola pengguna dan data platform melalui antarmuka peran khusus." },
      { en: "Optional device authentication, QR scanning, shared preferences, and Shorebird hooks extend the mobile experience beyond standard forms.", id: "Autentikasi perangkat opsional, pemindaian QR, shared preferences, dan hook Shorebird memperluas pengalaman mobile di luar form standar." },
    ],
    architecture: [
      { en: "Flutter and Dart provide separate learner, instructor, administrator, and authentication presentation flows.", id: "Flutter dan Dart menyediakan alur presentasi terpisah untuk mahasiswa, dosen, administrator, dan autentikasi." },
      { en: "Provider coordinates authentication, role data, gameplay, and theme state through dedicated ChangeNotifier modules.", id: "Provider mengoordinasikan state autentikasi, data peran, gameplay, dan tema melalui modul ChangeNotifier khusus." },
      { en: "Service and model layers connect Supabase Auth/PostgreSQL with a SharedPreferences-backed local fallback.", id: "Layer service dan model menghubungkan Supabase Auth/PostgreSQL dengan fallback lokal berbasis SharedPreferences." },
      { en: "Native plugins provide biometrics, camera QR scanning, PDF/printing, media, and sharing capabilities.", id: "Plugin native menyediakan biometrik, pemindaian QR melalui kamera, PDF/printing, media, dan kemampuan berbagi." },
    ],
    decisions: [
      { en: "Role-specific presentation folders keep learner, instructor, and administrator workflows explicit while shared providers coordinate state.", id: "Folder presentasi khusus peran menjaga alur mahasiswa, dosen, dan administrator tetap eksplisit, sementara provider bersama mengoordinasikan state." },
      { en: "The application can enter an offline/cached mode when Supabase configuration is unavailable, which keeps the academic prototype inspectable locally.", id: "Aplikasi dapat masuk ke mode offline/cached ketika konfigurasi Supabase tidak tersedia, sehingga prototipe akademik tetap dapat diperiksa secara lokal." },
      { en: "Sensitive device actions are delegated to platform plugins instead of being simulated in the UI layer.", id: "Aksi perangkat yang sensitif didelegasikan ke plugin platform, bukan disimulasikan pada layer UI." },
    ],
    evidence: [
      { en: "The repository contains implemented models, providers, services, and role-specific screens rather than interface mockups alone.", id: "Repository memuat model, provider, service, dan screen khusus peran yang terimplementasi, bukan sekadar mockup antarmuka." },
      { en: "At the audited snapshot, the public Git history records 21 commits under my GitHub identity; team documentation separately credits product and requirements work.", id: "Pada snapshot yang diaudit, riwayat Git publik mencatat 21 commit dengan identitas GitHub saya; dokumentasi tim secara terpisah mencatat kontribusi produk dan requirements." },
    ],
    limitations: [
      { en: "Academic prototype, not a production learning-management system.", id: "Prototipe akademik, bukan learning-management system produksi." },
      { en: "Automated test coverage and external configuration remain limited.", id: "Cakupan pengujian otomatis dan konfigurasi eksternal masih terbatas." },
    ],
    repositories: [{ label: { en: "GitHub repository", id: "Repository GitHub" }, href: "https://github.com/RaihanHadriansyah21/quizint-learning" }],
    links: [],
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
    features: [
      { en: "Exploratory analysis covers feature correlation, seasonal decomposition, and ACF/PACF behavior before modeling.", id: "Analisis eksploratif mencakup korelasi fitur, seasonal decomposition, dan perilaku ACF/PACF sebelum modeling." },
      { en: "The input combines Volume USDT, RSI, MACD histogram, Close, and a derived 24-period rolling mean.", id: "Input menggabungkan Volume USDT, RSI, MACD histogram, Close, dan rolling mean 24 periode yang diturunkan." },
      { en: "Three experiment tracks compare a baseline LSTM, an attention-enhanced LSTM, and an encoder-decoder Seq2Seq model.", id: "Tiga jalur eksperimen membandingkan baseline LSTM, LSTM dengan attention, dan model encoder-decoder Seq2Seq." },
      { en: "The repository includes saved Keras artifacts and plots for inspecting the sequence-modeling workflow.", id: "Repository menyertakan artefak Keras tersimpan dan plot untuk memeriksa alur sequence modeling." },
    ],
    architecture: [
      { en: "72-step input window and 24-step forecast horizon", id: "Input window 72 langkah dan forecast horizon 24 langkah" },
      { en: "Chronological 70/20/10 split with train-only scaling", id: "Pembagian kronologis 70/20/10 dengan scaling hanya pada train" },
      { en: "TensorFlow data windows feed baseline, custom-attention, and encoder-decoder LSTM architectures", id: "Window data TensorFlow memasok arsitektur baseline, custom attention, dan encoder-decoder LSTM" },
      { en: "The final Seq2Seq path uses model subclassing, a custom training loop, and weighted MAE", id: "Jalur Seq2Seq akhir menggunakan model subclassing, custom training loop, dan weighted MAE" },
    ],
    decisions: [
      { en: "Chronological splitting preserves time order, and scaling is fitted on the training partition before validation and test transformation.", id: "Chronological split mempertahankan urutan waktu, dan scaling di-fit pada partisi training sebelum transformasi validation serta test." },
      { en: "Custom dense, dropout, and multi-head-attention layers demonstrate lower-level TensorFlow/Keras construction beyond a Sequential baseline.", id: "Custom dense, dropout, dan multi-head-attention layer menunjukkan konstruksi TensorFlow/Keras tingkat lebih rendah di luar baseline Sequential." },
      { en: "Evaluation remains on the scaled target so the reported MAE is kept in its actual mathematical context.", id: "Evaluasi tetap dilakukan pada target yang telah di-scale, sehingga MAE dilaporkan dalam konteks matematis yang sebenarnya." },
    ],
    evidence: [{ en: "Recorded test MAE: 0.00418 on the scaled target", id: "Test MAE tercatat: 0,00418 pada target yang telah di-scale" }],
    limitations: [
      { en: "The MAE is not a dollar value and does not demonstrate profitable forecasting.", id: "Nilai MAE bukan nilai dolar dan tidak membuktikan forecasting yang menguntungkan." },
      { en: "No repeated backtest, transaction costs, or uncertainty intervals are included.", id: "Belum terdapat repeated backtest, biaya transaksi, atau interval ketidakpastian." },
    ],
    repositories: [{ label: { en: "GitHub repository", id: "Repository GitHub" }, href: "https://github.com/RaihanHadriansyah21/bitcoin-price-forecasting-seq2seq" }],
    links: [],
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
    features: [
      { en: "A collection notebook retrieves Google Play reviews, while the analysis notebook cleans Indonesian text and applies tokenization, stop-word handling, and Sastrawi stemming.", id: "Notebook pengumpulan mengambil ulasan Google Play, sedangkan notebook analisis membersihkan teks Bahasa Indonesia serta menerapkan tokenisasi, penanganan stop-word, dan stemming Sastrawi." },
      { en: "Positive, neutral, and negative targets are generated from external positive and negative lexicons.", id: "Target positif, netral, dan negatif dibentuk dari lexicon positif dan negatif eksternal." },
      { en: "Logistic Regression, a source-verified linear SVM, and a 128 → 64 → 3 dense neural network are trained and compared.", id: "Logistic Regression, SVM linear yang diverifikasi dari source, dan dense neural network 128 → 64 → 3 dilatih serta dibandingkan." },
      { en: "The repository packages the processed dataset, sentiment distribution, word cloud, and model-comparison visualizations.", id: "Repository menyertakan dataset terproses, distribusi sentimen, word cloud, dan visualisasi perbandingan model." },
    ],
    architecture: [
      { en: "Indonesian cleaning, lexicon scoring, and Sastrawi stemming produce the modeled text and labels", id: "Pembersihan Bahasa Indonesia, scoring lexicon, dan stemming Sastrawi menghasilkan teks serta label untuk modeling" },
      { en: "Logistic Regression uses TF-IDF unigram/bigram features with a 70/30 split", id: "Logistic Regression menggunakan fitur TF-IDF unigram/bigram dengan split 70/30" },
      { en: "The SVM path uses Bag of Words, a 90/10 split, C=2, balanced class weights, and a linear kernel", id: "Jalur SVM menggunakan Bag of Words, split 90/10, C=2, class weight seimbang, dan kernel linear" },
      { en: "The dense network uses TF-IDF, an 80/20 split, two hidden layers, softmax output, and early stopping", id: "Dense network menggunakan TF-IDF, split 80/20, dua hidden layer, keluaran softmax, dan early stopping" },
    ],
    decisions: [
      { en: "The notebook compares classical linear models with a small dense network to show both scikit-learn and TensorFlow workflows.", id: "Notebook membandingkan model linear klasik dengan dense network kecil untuk menunjukkan alur scikit-learn dan TensorFlow." },
      { en: "Modeling claims follow the executable notebook: the implemented SVM uses a linear kernel with C=2 and balanced class weights.", id: "Klaim modeling mengikuti notebook yang dapat dieksekusi: SVM yang diimplementasikan menggunakan kernel linear dengan C=2 dan class weight seimbang." },
      { en: "The three paths use different feature spaces and split ratios, so their saved accuracies are presented as within-notebook results rather than a strict apples-to-apples benchmark.", id: "Ketiga jalur menggunakan ruang fitur dan rasio split berbeda, sehingga akurasi tersimpan dipresentasikan sebagai hasil dalam notebook, bukan benchmark yang benar-benar setara." },
    ],
    evidence: [
      { en: "Saved outputs record rounded test accuracies of approximately 87% for Logistic Regression, 92% for the linear SVM, and 88% for the dense network.", id: "Output tersimpan mencatat akurasi test setelah pembulatan sekitar 87% untuk Logistic Regression, 92% untuk SVM linear, dan 88% untuk dense network." },
      { en: "The complete scraping, preprocessing, labeling, modeling, and comparison notebooks are public alongside a processed CSV.", id: "Notebook pengumpulan, preprocessing, pelabelan, modeling, dan perbandingan tersedia secara publik bersama CSV terproses." },
    ],
    limitations: [
      { en: "Labels are lexicon-derived, not human-annotated ground truth.", id: "Label berasal dari lexicon, bukan ground truth yang dianotasi manusia." },
      { en: "Vectorization before the split introduces a leakage risk.", id: "Vectorisasi sebelum pembagian data menimbulkan risiko leakage." },
      { en: "The experiment uses single, model-specific splits without cross-validation, so the recorded scores do not establish general Indonesian sentiment performance.", id: "Eksperimen menggunakan single split yang berbeda per model tanpa cross-validation, sehingga skor tercatat tidak membuktikan performa umum sentimen Bahasa Indonesia." },
    ],
    repositories: [{ label: { en: "GitHub repository", id: "Repository GitHub" }, href: "https://github.com/RaihanHadriansyah21/gojek-sentiment-analysis-ml-dl" }],
    links: [],
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
    features: [
      { en: "Create products with name, price, and stock fields through POST /produk.", id: "Membuat produk dengan field nama, harga, dan stok melalui POST /produk." },
      { en: "List all stored products through GET /produk with MongoDB ObjectIds serialized for JSON.", id: "Menampilkan seluruh produk tersimpan melalui GET /produk dengan MongoDB ObjectId yang diserialisasi untuk JSON." },
      { en: "Update selected fields and delete records by ObjectId through dedicated PUT and DELETE routes.", id: "Memperbarui field terpilih dan menghapus record berdasarkan ObjectId melalui route PUT dan DELETE khusus." },
    ],
    architecture: [
      { en: "A synchronous Flask application exposes four product CRUD routes.", id: "Aplikasi Flask sinkron mengekspos empat route CRUD produk." },
      { en: "Flask-PyMongo connects to a local MongoDB swalayanDB database and produk collection.", id: "Flask-PyMongo terhubung ke database MongoDB lokal swalayanDB dan collection produk." },
      { en: "The service binds to 0.0.0.0:5000 for a single-VM lab topology.", id: "Layanan bind ke 0.0.0.0:5000 untuk topologi lab single-VM." },
    ],
    decisions: [
      { en: "The project intentionally keeps the topology small to demonstrate the HTTP → Flask → MongoDB request path.", id: "Proyek sengaja menjaga topologi tetap kecil untuk mendemonstrasikan jalur request HTTP → Flask → MongoDB." },
      { en: "ObjectId conversion at the API boundary makes MongoDB identifiers usable in JSON responses and route parameters.", id: "Konversi ObjectId pada batas API membuat identifier MongoDB dapat digunakan dalam respons JSON dan parameter route." },
    ],
    evidence: [
      { en: "The public source implements all four CRUD operations and documents runnable requests.", id: "Source publik mengimplementasikan keempat operasi CRUD dan mendokumentasikan request yang dapat dijalankan." },
      { en: "The repository is deliberately compact: application code, dependencies, ignore rules, and setup documentation.", id: "Repository sengaja ringkas: source aplikasi, dependency, ignore rules, dan dokumentasi setup." },
    ],
    limitations: [
      { en: "Foundational lab only: no authentication, tests, pagination, or schema validation.", id: "Hanya lab fondasi: belum ada autentikasi, test, pagination, atau schema validation." },
      { en: "It should not be presented as a production cloud system.", id: "Tidak boleh dipresentasikan sebagai sistem cloud produksi." },
    ],
    repositories: [{ label: { en: "GitHub repository", id: "Repository GitHub" }, href: "https://github.com/RaihanHadriansyah21/Project-1-Cloud-Computing" }],
    links: [],
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
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  return (configuredUrl || "https://portoreyy.vercel.app").replace(/\/$/, "");
}
