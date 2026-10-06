import type { AssessmentResult } from '../types/hastaloka';

export interface SystemicVectorMoat {
  key: 'drive' | 'adaptability' | 'stability' | 'synthesis' | 'connectivity';
  name: string;
  score: number;
  badge: string;
  badgeColor: string;
  cardBorder: string;
  cardBg: string;
  isHigh: boolean;
  isLow: boolean;
  rarityInMarket: string;
  economicMoat: string;
}

export interface SystemicLeverageModel {
  id: number;
  title: string;
  badge: string;
  badgeColor: string;
  iconName: string;
  whyFits: string;
  steps: string[];
}

export interface SystemicHazardProtocol {
  id: number;
  name: string;
  riskLevel: 'Tinggi' | 'Moderat';
  riskBadgeColor: string;
  realImpact: string;
  steps: Array<{ num: number; title: string; action: string }>;
}

export interface SystemicCircadianBlock {
  id: number;
  time: string;
  phase: string;
  isPeak: boolean;
  badge: string;
  activity: string;
  guidance: string;
}

export interface SystemicDelegationTask {
  id: number;
  task: string;
  whyUnfit: string;
  targetDelegation: string;
}

export interface SystemicDiagnosticDossier {
  nicheTitle: string;
  nicheTag: string;
  moatSummary: string;
  vectorMoats: SystemicVectorMoat[];
  leverageModels: SystemicLeverageModel[];
  hazardProtocols: SystemicHazardProtocol[];
  circadianSchedule: SystemicCircadianBlock[];
  delegationTasks: SystemicDelegationTask[];
}

/**
 * Menghasilkan Diagnosis Eksekutif 4 Pilar secara sistemik & statis
 * berdasarkan profil penilaian Hastaloka pengguna (H5V, Arketipe, & Kronotipe).
 */
export function getSystemicDiagnostic(assessment: AssessmentResult | null): SystemicDiagnosticDossier | null {
  if (!assessment) return null;

  const v = assessment.vectorScores;
  const p = assessment.primaryArchetype;
  const s = assessment.secondaryArchetype;
  const chrono = assessment.chronotype || 'Owl';

  // 1. ANATOMI SUPERPOWER & DAYA TAWAR EKONOMI (ECONOMIC MOAT)
  const vectorMoats: SystemicVectorMoat[] = [
    {
      key: 'drive',
      name: 'Daya Aksi (Keberanian Memulai)',
      score: v.drive,
      badge: v.drive >= 75 ? 'Kekuatan Utama' : v.drive >= 50 ? 'Cukup Aktif' : 'Perlu Didukung',
      badgeColor: v.drive >= 75 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-slate-100 text-slate-700 border-slate-200',
      cardBorder: v.drive >= 75 ? 'border-orange-200/80 hover:border-orange-300' : 'border-slate-200/80',
      cardBg: 'bg-white',
      isHigh: v.drive >= 75,
      isLow: v.drive < 45,
      rarityInMarket: v.drive >= 75
        ? 'Jarang ada orang yang seberani Anda dalam memulai hal baru tanpa menunggu semua rencana serba sempurna.'
        : 'Anda tipe orang yang berhati-hati dan lebih nyaman jika ada arahan atau kepastian sebelum melangkah.',
      economicMoat: v.drive >= 75
        ? 'Kecepatan bertindak: Anda bisa meluncurkan ide dan mencoba pasar jauh lebih cepat dibanding orang lain yang kelamaan berpikir.'
        : 'Sangat cocok bekerja sama dengan orang yang berani memulai agar Anda terdorong untuk ikut bergerak.'
    },
    {
      key: 'adaptability',
      name: 'Kelenturan (Mudah Menyesuaikan Diri)',
      score: v.adaptability,
      badge: v.adaptability >= 75 ? 'Sangat Luwes' : v.adaptability >= 50 ? 'Cukup Fleksibel' : 'Suka Keteraturan Pasti',
      badgeColor: v.adaptability >= 75 ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-700 border-slate-200',
      cardBorder: v.adaptability >= 75 ? 'border-blue-200/80 hover:border-blue-300' : 'border-slate-200/80',
      cardBg: 'bg-white',
      isHigh: v.adaptability >= 75,
      isLow: v.adaptability < 45,
      rarityInMarket: v.adaptability >= 75
        ? 'Anda tidak gampang stres saat rencana mendadak berubah, dan bisa cepat mencari cara baru yang pas.'
        : 'Anda lebih menyukai kepastian dan butuh waktu tenang untuk membiasakan diri jika ada perubahan rencana.',
      economicMoat: v.adaptability >= 75
        ? 'Tahan banting: Anda tidak mudah patah arang dan sangat cepat belajar dari kesalahan di lapangan.'
        : 'Keunggulan Anda ada pada kesetiaan dan konsistensi menjaga satu hal sampai benar-benar mapan.'
    },
    {
      key: 'connectivity',
      name: 'Relasi Sosial (Mudah Bergaul & Bekerja Sama)',
      score: v.connectivity,
      badge: v.connectivity >= 75 ? 'Jejaring Luas' : v.connectivity >= 50 ? 'Pertemanan Terpilih' : 'Mandiri & Fokus',
      badgeColor: v.connectivity >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-700 border-slate-200',
      cardBorder: v.connectivity >= 75 ? 'border-emerald-200/80 hover:border-emerald-300' : 'border-slate-200/80',
      cardBg: 'bg-white',
      isHigh: v.connectivity >= 75,
      isLow: v.connectivity < 45,
      rarityInMarket: v.connectivity >= 75
        ? 'Anda mudah akrab, dipercaya orang baru, dan pintu silaturahmi bisnis selalu terbuka lebar.'
        : 'Lingkaran pertemanan Anda lebih selektif pada beberapa orang yang sudah benar-benar terbukti setia.',
      economicMoat: v.connectivity >= 75
        ? 'Pintu rezeki dari relasi: Peluang sering datang langsung dari obrolan santai dan rekomendasi teman baik.'
        : 'Pikiran Anda tenang dari drama sosial sehingga bisa fokus mengasah keahlian teknis secara mendalam.'
    },
    {
      key: 'synthesis',
      name: 'Visi Pola (Melihat Gambaran Besar)',
      score: v.synthesis,
      badge: v.synthesis >= 75 ? 'Pemikir Visioner' : v.synthesis >= 50 ? 'Cukup Luas' : 'Fokus Hal Nyata',
      badgeColor: v.synthesis >= 75 ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-700 border-slate-200',
      cardBorder: v.synthesis >= 75 ? 'border-purple-200/80 hover:border-purple-300' : 'border-slate-200/80',
      cardBg: 'bg-white',
      isHigh: v.synthesis >= 75,
      isLow: v.synthesis < 45,
      rarityInMarket: v.synthesis >= 75
        ? 'Mampu melihat arah masa depan, mengaitkan berbagai tren, dan merangkainya jadi ide yang menarik.'
        : 'Anda lebih suka hal-hal yang nyata dan terbukti berhasil dibanding teori-teori abstrak yang belum tentu jalan.',
      economicMoat: v.synthesis >= 75
        ? 'Daya cipta produk: Pandai menggabungkan ide yang berserakan menjadi produk atau layanan yang disukai orang.'
        : 'Eksekusi lapangan Anda cepat tanpa membuang waktu untuk overthinking yang tidak perlu.'
    },
    {
      key: 'stability',
      name: 'Keteraturan (Rapi, Teliti & Disiplin)',
      score: v.stability,
      badge: v.stability >= 75 ? 'Sangat Tertib' : v.stability >= 50 ? 'Cukup Rapi' : 'Titik Lemah (Perlu Dibantu)',
      badgeColor: v.stability < 45 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-700 border-slate-200',
      cardBorder: v.stability < 45 ? 'border-rose-200/90 hover:border-rose-300' : 'border-slate-200/80',
      cardBg: v.stability < 45 ? 'bg-rose-50/20' : 'bg-white',
      isHigh: v.stability >= 75,
      isLow: v.stability < 45,
      rarityInMarket: v.stability < 45
        ? 'Titik rawan: Anda cepat bosan dengan urusan surat-menyurat, laporan rutin, atau aturan checklist yang diulang-ulang.'
        : 'Ketelitian tinggi dalam menjaga kerapian kerja, jadwal rapi, dan menuntaskan hal detail hingga tuntas.',
      economicMoat: v.stability < 45
        ? 'Perlu pagar pendukung: Energi besar Anda rawan bocor ke mana-mana jika tidak dibantu rekan yang tertib administrasi.'
        : 'Bisa diandalkan penuh: Pekerjaan selesai rapi sesuai standar tanpa ada detail penting yang terlewat.'
    }
  ];

  // 2. DOSSIER PERSONALISASI PER-ARKETIPE (BAHASA AWAM & MEMBUMI)
  const archetypeDossierMap: Record<string, {
    nicheTitle: string;
    nicheTag: string;
    moatSummary: string;
    leverageModels: SystemicLeverageModel[];
    hazardProtocols: SystemicHazardProtocol[];
    delegationTasks: SystemicDelegationTask[];
  }> = {
    architect: {
      nicheTitle: `Posisi Paling Pas: Perancang Sistem & Fondasi Bisnis (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah kemampuan berpikir logis dan melihat gambaran besar. Anda jago membuat alur kerja yang rapi, SOP yang mudah dipahami, dan sistem yang bisa berjalan sendiri tanpa perlu Anda awasi setiap menit.`,
      leverageModels: [
        {
          id: 1,
          title: 'Membangun Bisnis Berbasis Sistem Otomatis',
          badge: 'SISTEM MANDIRI',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'TrendingUp',
          whyFits: `Kecerdasan sistemik Anda memungkinkan Anda merancang bisnis dengan SOP jelas sehingga bisa didelegasikan tanpa pusing.`,
          steps: [
            'Rancang alur kerja utama bisnis Anda dari hulu ke hilir.',
            'Tulis panduan kerja (SOP) sederhana yang gampang dipahami oleh staf baru.',
            'Gunakan aplikasi digital untuk mengotomatisasi pencatatan dan pelaporan.',
            'Setelah sistem stabil, Anda tinggal fokus mengawasi arah pengembangan besarnya.'
          ]
        },
        {
          id: 2,
          title: 'Konsultan Tata Kelola & Perbaikan Alur Kerja',
          badge: 'JASA STRATEGIS',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconName: 'Zap',
          whyFits: `Banyak pemilik bisnis pusing karena kerjaan mereka berantakan; Anda punya kemampuan alami untuk masuk dan membereskannya.`,
          steps: [
            'Bantu klien memetakan di mana letak kebocoran waktu dan biaya dalam kerjaan mereka.',
            'Susun cetak biru perbaikan alur kerja yang praktis dan bertahap.',
            'Dampingi tim mereka sampai cara kerja baru berjalan lancar.'
          ]
        },
        {
          id: 3,
          title: 'Menciptakan Produk Panduan / Template Berlisensi',
          badge: 'ASET DIGITAL',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconName: 'Coins',
          whyFits: `Sekali Anda membuat modul atau template panduan yang rapi, produk itu bisa dijual berulang kali tanpa menguras tenaga Anda lagi.`,
          steps: [
            'Kemas sistem kerja terbaik Anda menjadi paket panduan atau template siap pakai.',
            'Jual secara digital kepada para profesional atau pemilik usaha yang membutuhkan.',
            'Rutin perbarui materi agar nilai produk Anda tetap relevan dan dicari.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Terlalu Lama Merancang Sampai Lupa Mulai Eksekusi',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Terlalu asyik menyempurnakan rencana di atas kertas membuat kesempatan pasar keburu diambil orang lain.',
          steps: [
            { num: 1, title: 'Terapkan Aturan Versi 1.0', action: 'Luncurkan ide Anda begitu rencana sudah 70% siap; sempurnakan sisanya sambil jalan di lapangan.' },
            { num: 2, title: 'Pasang Batas Waktu Mulai', action: 'Tentukan tanggal pasti kapan harus mulai melangkah, apa pun yang terjadi.' },
            { num: 3, title: 'Gandeng Teman yang Suka Gerak Cepat', action: 'Ajak rekan tipe Catalyst yang bakal menarik Anda untuk segera tancap gas.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Gampang Kesal dengan Orang yang Kurang Rapi',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Rekan kerja bisa merasa tertekan atau takut salah jika standar kerapian Anda terlalu tinggi dan kaku.',
          steps: [
            { num: 1, title: 'Fokus ke Hasil Inti', action: 'Beri kebebasan cara kerja kepada tim selama target utama tercapai tepat waktu.' },
            { num: 2, title: 'Bikin Format yang Simpel', action: 'Sederhanakan formulir agar orang lain tidak malas mengisinya.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Menghadiri Acara Sosialisasi Basa-Basi Tanpa Agenda Jelas', whyUnfit: 'Menguras energi pikiran Anda tanpa menghasilkan solusi konkret.', targetDelegation: 'Kirim perwakilan tim relasi atau humas.' },
        { id: 2, task: 'Pekerjaan Mendadak yang Sering Berubah-ubah', whyUnfit: 'Bikin Anda stres karena membutuhkan kepastian alur yang runtut.', targetDelegation: 'Serahkan ke rekan penggerak lapangan yang lincah.' },
        { id: 3, task: 'Tawar-Menawar Harga dan Jualan Eceran', whyUnfit: 'Fokus Anda ada di kualitas sistem, bukan meyakinkan orang di pasar.', targetDelegation: 'Serahkan ke tim sales.' },
        { id: 4, task: 'Urusan Perbaikan Teknis Alat Sehari-hari', whyUnfit: 'Waktu Anda lebih berharga jika dipakai merancang rencana masa depan.', targetDelegation: 'Panggil teknisi atau staf perbaikan.' }
      ]
    },

    catalyst: {
      nicheTitle: `Posisi Paling Pas: Inisiator Proyek & Penggerak Cepat (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah keberanian melangkah dan kecepatan memulai. Di saat orang lain masih ragu-ragu dan kebanyakan mikir, Anda sudah mencoba duluan dan langsung belajar dari pengalaman nyata di lapangan.`,
      leverageModels: [
        {
          id: 1,
          title: 'Merintis Usaha Baru / Buka Cabang Baru',
          badge: 'USAHA SENDIRI',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconName: 'TrendingUp',
          whyFits: `Daya dobrak Anda paling pas dipakai membuka jalan baru dan menyalakan api semangat awal sebuah bisnis.`,
          steps: [
            'Cari 2–3 masalah nyata di sekitar Anda yang belum ada solusi praktisnya.',
            'Ajak 1–2 rekan kerja yang teliti dan rapi (tipe Mechanic atau Specialist) untuk urusan dapur.',
            'Terapkan bagi hasil yang adil agar semua bersemangat membesarkan usaha.',
            'Setelah bisnis mulai berjalan teratur, serahkan tugas harian ke tim agar Anda bisa mencari peluang baru.'
          ]
        },
        {
          id: 2,
          title: 'Konsultan Penyelamat Proyek Macet',
          badge: 'PEMECAH KEBUNTUAN',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'Zap',
          whyFits: `Keahlian Anda mendobrak kelambatan sangat dicari oleh tim yang sedang kehilangan arah atau macet di tengah jalan.`,
          steps: [
            'Kemas keahlian Anda jadi pendampingan intensif 30–60 hari untuk mengejar target.',
            'Bongkar kebiasaan rapat bertele-tele dan dorong eksekusi nyata setiap hari.',
            'Tinggalkan tim dengan ritme kerja baru yang lebih bersemangat.'
          ]
        },
        {
          id: 3,
          title: 'Kemitraan Berbasis Bagi Hasil / Komisi',
          badge: 'KOLABORASI CUAN',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconName: 'Coins',
          whyFits: `Anda jago membuka pintu penjualan baru tanpa perlu repot membuat produk dari nol sendirian.`,
          steps: [
            'Temukan pemilik produk bagus yang kesulitan mencari jalur pembeli baru.',
            'Sepakati bagi hasil yang menarik atas setiap kesepakatan yang Anda buka.',
            'Gunakan aplikasi otomatis agar rekap penjualan tercatat rapi tanpa menyita waktu Anda.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Cepat Bosan Saat Pekerjaan Mulai Masuk Fase Rutin',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Proyek yang awalnya dirintis dengan penuh semangat bisa terbengkalai begitu masuk tahap rutinitas.',
          steps: [
            { num: 1, title: 'Kumpulkan Tugas Rutin di Satu Waktu', action: 'Selesaikan urusan laporan dalam 1–2 jam khusus per minggu, jangan dicicil tiap hari agar tidak merusak mood.' },
            { num: 2, title: 'Segera Serahkan ke Tim Operasional', action: 'Begitu bisnis sudah mulai jalan, serahkan kendali harian ke orang yang suka keteraturan.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Membuka Terlalu Banyak Hal Baru Sekaligus',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Pikiran terpecah ke mana-mana, tenaga cepat habis, dan tidak ada proyek yang tuntas menghasilkan.',
          steps: [
            { num: 1, title: 'Batasi Maksimal 2 Proyek Prioritas', action: 'Tahan diri dari godaan mencoba ide baru sampai proyek yang ada benar-benar menghasilkan.' },
            { num: 2, title: 'Evaluasi Tiap 30 Hari', action: 'Jika sebuah ide tidak menunjukkan hasil jelas dalam sebulan, ikhlaskan untuk ditutup.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Merekap Data & Membuat Laporan Rutin Harian', whyUnfit: 'Bikin Anda cepat bosan dan kehabisan tenaga untuk hal penting.', targetDelegation: 'Serahkan ke staf administrasi atau sekretaris.' },
        { id: 2, task: 'Membaca Dokumen Kontrak Panjang yang Kaku', whyUnfit: 'Membutuhkan ketelitian kata demi kata yang menguras kesabaran Anda.', targetDelegation: 'Gunakan jasa konsultan hukum atau bagian legal.' },
        { id: 3, task: 'Mencatat Stok Barang & Administrasi Karyawan', whyUnfit: 'Menyita banyak waktu tanpa mendatangkan pemasukan baru secara langsung.', targetDelegation: 'Gunakan aplikasi digital atau serahkan ke staf.' },
        { id: 4, task: 'Membalas Chat Tanya Jawab yang Berulang-ulang', whyUnfit: 'Menyita waktu yang seharusnya bisa Anda pakai mencari peluang rezeki baru.', targetDelegation: 'Gunakan template pesan atau admin CS.' }
      ]
    },

    evangelist: {
      nicheTitle: `Posisi Paling Pas: Komunikator Publik & Pembawa Pengaruh (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah kemampuan memikat hati orang lewat kata-kata dan cerita. Anda punya karisma alami yang membuat orang percaya, nyaman, dan tergerak untuk ikut serta dalam rencana Anda.`,
      leverageModels: [
        {
          id: 1,
          title: 'Bisnis Berbasis Komunitas & Personal Brand',
          badge: 'BRAND & PENGARUH',
          badgeColor: 'bg-pink-50 text-pink-800 border-pink-200',
          iconName: 'TrendingUp',
          whyFits: `Kepercayaan publik kepada Anda adalah aset paling berharga yang mudah diubah menjadi penjualan produk atau jasa.`,
          steps: [
            'Bangun kehadiran rutin di media sosial atau komunitas dengan konten yang menginspirasi.',
            'Luncurkan produk atau program edukasi yang menjawab kebutuhan pengikut Anda.',
            'Ajak tim operasional di belakang layar agar kualitas produk tetap terjaga prima.'
          ]
        },
        {
          id: 2,
          title: 'Penjualan Bernilai Besar & Kemitraan Strategis',
          badge: 'DEAL MAKER',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'Zap',
          whyFits: `Karisma persuasi Anda sangat ampuh saat menghadapi klien institusi atau investor bernilai ratusan juta.`,
          steps: [
            'Fokuskan waktu Anda hanya untuk presentasi tingkat tinggi dan penutupan kesepakatan besar.',
            'Biarkan tim teknis menyiapkan proposal dan detail berkas pendukungnya.',
            'Ambil bagian persentase komisi yang menarik dari setiap kesepakatan yang sukses.'
          ]
        },
        {
          id: 3,
          title: 'Pembicara Publik, Pelatihan, & Duta Merek',
          badge: 'MEDIA & EVENT',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconName: 'Coins',
          whyFits: `Anda dibayar mahal untuk kemampuan Anda menggerakkan audiens dan menghidupkan suasana panggung.`,
          steps: [
            'Kemas topik keahlian Anda menjadi materi presentasi yang memukau dan menghibur.',
            'Bangun hubungan baik dengan penyelenggara acara dan agensi media.',
            'Jual produk lanjutan (buku, kursus, konsultasi) kepada audiens yang terkesan.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Terlalu Gampang Mengiyakan Permintaan (People Pleasing)',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Energi habis melayani semua orang sampai urusan penting diri sendiri terbengkalai.',
          steps: [
            { num: 1, title: 'Beri Waktu Jeda Sebelum Menjawab', action: 'Biasakan bilang "Saya cek jadwal dulu ya" agar tidak langsung mengiyakan secara spontan.' },
            { num: 2, title: 'Tetapkan Batasan Waktu Bersosialisasi', action: 'Sediakan waktu istirahat yang tidak bisa diganggu siapa pun untuk memulihkan energi.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Mengobral Janji Manis yang Bikin Tim Operasional Keteteran',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Klien kecewa jika tim di belakang layar ternyata tidak sanggup memenuhi apa yang Anda janjikan saat presentasi.',
          steps: [
            { num: 1, title: 'Tanya Tim Sebelum Janji', action: 'Selalu pastikan kapasitas tim operasional sebelum menjanjikan tenggat waktu instan kepada klien.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Menyusun Laporan Anggaran Detail & Pajak', whyUnfit: 'Menguras mood sosial Anda dengan cepat.', targetDelegation: 'Serahkan ke akuntan atau konsultan pajak.' },
        { id: 2, task: 'Pekerjaan Teknis Hening di Depan Layar Komputer', whyUnfit: 'Anda butuh interaksi manusia agar tetap bersemangat.', targetDelegation: 'Serahkan ke staf teknis atau desainer.' },
        { id: 3, task: 'Rapat Operasional Panjang yang Membosankan', whyUnfit: 'Cukup minta ringkasan 3 poin intinya saja dari manajer operasional.', targetDelegation: 'Wakilkan ke asisten.' },
        { id: 4, task: 'Pengecekan Detail Tata Bahasa dan Dokumen', whyUnfit: 'Fokus Anda di ide besar dan emosi cerita, bukan tanda baca.', targetDelegation: 'Gunakan jasa editor.' }
      ]
    },

    mechanic: {
      nicheTitle: `Posisi Paling Pas: Pengendali Mutu & Ahli Efisiensi (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah mata yang jeli melihat mana alur kerja yang bocor, boros, atau rusak. Anda adalah orang yang memastikan roda organisasi berputar mulus tanpa hambatan dan minim pemborosan biaya.`,
      leverageModels: [
        {
          id: 1,
          title: 'Jasa Audit Efisiensi & Pemangkasan Biaya Usaha',
          badge: 'HEMAT BIAYA',
          badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          iconName: 'TrendingUp',
          whyFits: `Klien akan senang membayar Anda jika Anda bisa membuktikan cara menghemat pengeluaran mereka jutaan rupiah per bulan.`,
          steps: [
            'Bantu pemilik usaha mendata semua pos pengeluaran dan menemukan pos mana yang mubazir.',
            'Tata ulang alur kerja agar waktu produksi menjadi 30% lebih cepat.',
            'Ambil bagian bagi hasil dari total penghematan yang berhasil Anda ciptakan.'
          ]
        },
        {
          id: 2,
          title: 'Pengelolaan Unit Bisnis / Waralaba Mandiri',
          badge: 'OPERATOR PRIMA',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconName: 'Zap',
          whyFits: `Anda sangat handal menjalankan sistem yang sudah terbukti tanpa ada kebocoran uang kas atau kerusakan alat.`,
          steps: [
            'Pilih model waralaba atau unit cabang yang sistem produknya sudah terkenal bagus.',
            'Jaga standar mutu kebersihan, stok, dan pelayanan agar pelanggan selalu puas dan balik lagi.',
            'Nikmati arus kas stabil dari bisnis yang berjalan tertib.'
          ]
        },
        {
          id: 3,
          title: 'Bisnis Logistik, Perawatan, atau Pengadaan Perlengkapan',
          badge: 'LAYANAN HANDAL',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconName: 'Coins',
          whyFits: `Keandalan Anda dalam merawat mesin dan peralatan membuat Anda jadi mitra terpercaya jangka panjang.`,
          steps: [
            'Sediakan jasa pemeliharaan berkala untuk peralatan kerja para pebisnis.',
            'Tawarkan paket langganan bulanan agar Anda memiliki penghasilan rutin yang pasti.',
            'Jaga reputasi tepat waktu dan hasil kerja bersih.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Terlalu Skeptis Terhadap Ide Baru',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Menolak ide bagus hanya karena belum pernah dicoba sebelumnya bisa membuat bisnis Anda ketinggalan zaman.',
          steps: [
            { num: 1, title: 'Beri Ruang Uji Coba Skala Kecil', action: 'Jangan langsung menolak ide baru; tes dulu dengan anggaran kecil dan pantau hasilnya.' },
            { num: 2, title: 'Dengarkan Ide Rekan Visioner', action: 'Beri kesempatan rekan tipe Catalyst atau Evangelist untuk menjelaskan potensi pasarnya.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Terjebak Menyelesaikan Semua Hal Teknis Sendirian',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Badan Anda kelelahan karena merasa tidak ada orang lain yang kerjanya sebersih dan seteliti Anda.',
          steps: [
            { num: 1, title: 'Latih Asisten dengan Checklist', action: 'Tuliskan daftar periksa sederhana agar staf Anda bisa meniru cara kerja rapi Anda.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Presentasi Penjualan yang Butuh Banyak Basa-Basi Manis', whyUnfit: 'Bukan gaya Anda yang lugas, jujur, dan apa adanya.', targetDelegation: 'Serahkan ke tim marketing atau sales.' },
        { id: 2, task: 'Spekulasi Bisnis Baru yang Serba Tidak Pasti', whyUnfit: 'Bikin cemas karena minim bukti nyata di lapangan.', targetDelegation: 'Biarkan diuji coba dulu oleh rekan tipe petualang.' },
        { id: 3, task: 'Menangani Komplain Pelanggan yang Terlalu Emosional', whyUnfit: 'Menguras kesabaran akal sehat Anda.', targetDelegation: 'Serahkan ke staf CS yang berjiwa sabar.' },
        { id: 4, task: 'Membuat Desain Estetika yang Terlalu Abstrak', whyUnfit: 'Fokus Anda di fungsi kerja, bukan gaya visual.', targetDelegation: 'Gunakan jasa desainer profesional.' }
      ]
    },

    allocator: {
      nicheTitle: `Posisi Paling Pas: Pengelola Modal & Ahli Kalkulasi (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah ketenangan dan disiplin dalam mengelola uang. Anda tidak gampang panik saat situasi gonjang-ganjing dan sangat jago menempatkan modal ke tempat yang paling menghasilkan untung jangka panjang.`,
      leverageModels: [
        {
          id: 1,
          title: 'Investasi Pertumbuhan & Bunga Berbunga (Compounding)',
          badge: 'INVESTASI NILAI',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconName: 'TrendingUp',
          whyFits: `Kesabaran analitis Anda membuat Anda jago membeli aset bagus di harga diskon dan membiarkannya tumbuh berlipat ganda.`,
          steps: [
            'Fokus pada instrumen aset yang punya arus kas nyata (saham dividen bagus, properti sewa, bisnis yang jalan).',
            'Terapkan manajemen risiko ketat: jangan taruh semua telur dalam satu keranjang.',
            'Biarkan keuntungan digulung kembali (reinvestasi) agar uang bekerja otomatis untuk Anda.'
          ]
        },
        {
          id: 2,
          title: 'Pemodal Usaha / Kemitraan Bagi Hasil',
          badge: 'BAGI HASIL USAHA',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'Zap',
          whyFits: `Anda punya modal dan ketajaman hitungan; rekan Anda punya tenaga dan keterampilan lapangan.`,
          steps: [
            'Danai pelaku usaha berbakat yang jago jualan tapi kekurangan modal ekspansi.',
            'Tentukan batas target keuntungan dan perjanjian batas risiko yang adil di awal.',
            'Pantau laporan keuangan bulanan secara berkala tanpa perlu ikut campur urusan teknis harian.'
          ]
        },
        {
          id: 3,
          title: 'Konsultan Pengatur Anggaran & Restrukturisasi Keuangan',
          badge: 'DOKTER KEUANGAN',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconName: 'Coins',
          whyFits: `Banyak pemilik usaha omsetnya besar tapi uangnya selalu habis entah ke mana; Anda bisa menyelamatkan mereka.`,
          steps: [
            'Audit alur uang masuk dan keluar dari bisnis klien Anda.',
            'Pisahkan rekening operasional, rekening pajak, dan rekening tabungan laba bersih.',
            'Tetapkan batas plafon belanja yang wajib dipatuhi oleh pemilik usaha.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Terlalu Dingin Berhitung Sampai Mengabaikan Perasaan Orang',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Rekan kerja atau tim merasa tidak dihargai sebagai manusia jika semua hal selalu dinilai hanya dengan angka rupiah.',
          steps: [
            { num: 1, title: 'Sisipkan Ruang Empati', action: 'Ingat bahwa semangat dan loyalitas tim juga punya nilai ekonomi tak kasat mata yang sangat mahal.' },
            { num: 2, title: 'Ajak Rekan Komunikator', action: 'Biarkan rekan tipe Evangelist yang menyampaikan kabar keputusan keuangan agar tidak terasa kaku.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Menunda Keputusan Karena Menunggu Data 100% Sempurna',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Di dunia bisnis nyata, data tidak pernah 100% lengkap; menunggu terlalu lama bisa bikin harga aset keburu naik.',
          steps: [
            { num: 1, title: 'Ambil Keputusan Saat Data Sudah 75% Lengkap', action: 'Gunakan batas batas rugi (margin of safety) untuk melindungi sisa ketidakpastiannya.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Menawarkan Barang Satu per Satu ke Calon Pembeli', whyUnfit: 'Waktu Anda terlalu bernilai untuk urusan jualan eceran.', targetDelegation: 'Pekerjakan tim sales komisi.' },
        { id: 2, task: 'Pekerjaan Fisik & Perbaikan Alat Sehari-hari', whyUnfit: 'Fokuskan pikiran Anda pada keputusan alokasi dana bernilai besar.', targetDelegation: 'Panggil teknisi profesional.' },
        { id: 3, task: 'Acara Ngobrol Santai Tanpa Tujuan Bisnis Jelas', whyUnfit: 'Menyita waktu produktif Anda tanpa hasil terukur.', targetDelegation: 'Batasi atau tolak dengan sopan.' },
        { id: 4, task: 'Pekerjaan Desain Kreatif Bebas Tanpa Angka', whyUnfit: 'Bukan keahlian alami Anda.', targetDelegation: 'Serahkan ke tim kreatif.' }
      ]
    },

    arbitrageur: {
      nicheTitle: `Posisi Paling Pas: Pemburu Peluang Cepat & Ahli Negosiasi (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah insting tajam membaca celah pasar yang terlewat orang lain. Anda tahu barang apa yang sedang dicari, di mana mendapatkannya dengan harga miring, dan bisa menjualnya cepat sebelum tren berakhir.`,
      leverageModels: [
        {
          id: 1,
          title: 'Perdagangan Selisih Harga / Makelar Bisnis Cepat',
          badge: 'JUAL-BELI CEPAT',
          badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
          iconName: 'TrendingUp',
          whyFits: `Mata Anda sangat jeli melihat perbedaan harga antara penjual yang butuh uang cepat dan pembeli yang siap bayar tunai.`,
          steps: [
            'Cari barang, kendaraan, atau properti yang dijual di bawah harga pasar karena pemiliknya terdesak.',
            'Segera tawarkan kepada pembeli di jaringan Anda yang sudah siap membeli dengan harga normal.',
            'Kunci selisih keuntungannya langsung dalam hitungan hari.'
          ]
        },
        {
          id: 2,
          title: 'Bisnis Mengikuti Tren Musiman / Produk Viral',
          badge: 'TREND RIDER',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconName: 'Zap',
          whyFits: `Anda tidak punya gengsi untuk melompat ke tren apa pun yang sedang menghasilkan uang banyak.`,
          steps: [
            'Pantau tren yang baru mulai ramai di luar negeri atau media sosial.',
            'Amankan stok barang secepat mungkin dan langsung jual di platform online.',
            'Begitu tren mulai lesu dan banyak saingan, segera habiskan sisa stok dan pindah ke tren berikutnya.'
          ]
        },
        {
          id: 3,
          title: 'Mengamankan Hak Distribusi Eksklusif di Suatu Wilayah',
          badge: 'DISTRIBUSI',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'Coins',
          whyFits: `Kelihaian lobi Anda membuat produsen percaya memberikan hak jual eksklusif kepada Anda.`,
          steps: [
            'Negosiasikan harga terbaik langsung dari pabrik atau produsen pertama.',
            'Salurkan barang tersebut ke jaringan toko-toko retail yang sudah Anda kenal.',
            'Dapatkan keuntungan rutin dari setiap pengiriman barang.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Mengambil Risiko Terlalu Nekat Dekat ke Spekulasi Murni',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Keuntungan besar yang sudah dikumpulkan berbulan-bulan bisa ludes dalam satu transaksi ceroboh.',
          steps: [
            { num: 1, title: 'Pasang Batas Modal Maksimal', action: 'Jangan pernah pertaruhkan lebih dari 20% modal Anda dalam satu transaksi peluang.' },
            { num: 2, title: 'Segera Amankan Keuntungan', action: 'Tarik modal pokok begitu untung sudah didapat, biarkan cuma labanya yang diputar.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Malas Membangun Pondasi Jangka Panjang',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Jika tren habis dan Anda tidak punya aset tetap, Anda harus mulai berburu lagi dari nol dengan kelelahan.',
          steps: [
            { num: 1, title: 'Kunci Laba ke Aset Diam', action: 'Sisihkan 50% dari setiap keuntungan cepat untuk dibelikan tanah, emas, atau tabungan aman.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Membangun Pabrik Sendiri dari Nol', whyUnfit: 'Terlalu lama dan kaku; lebih baik beli jadi dan fokus jual cepat.', targetDelegation: 'Gunakan sistem maklon atau beli putus.' },
        { id: 2, task: 'Menjaga Toko / Duduk Menunggu Pelanggan Datang', whyUnfit: 'Membosankan bagi jiwa pemburu Anda.', targetDelegation: 'Pekerjakan karyawan penjaga toko.' },
        { id: 3, task: 'Membuat Laporan Pajak dan Berkas Hukum Panjang', whyUnfit: 'Bikin pusing dan menyita waktu berburu Anda.', targetDelegation: 'Gunakan biro jasa akuntansi.' },
        { id: 4, task: 'Rapat Evaluasi Rutin yang Bertele-tele', whyUnfit: 'Anda lebih suka langsung telepon dan sepakat di tempat.', targetDelegation: 'Hindari atau kirim wakil.' }
      ]
    },

    specialist: {
      nicheTitle: `Posisi Paling Pas: Pakar Kualitas & Pemilik Ilmu Langka (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah kedalaman ilmu dan presisi kerja. Anda mampu menghasilkan karya yang sangat sulit ditiru orang lain, sehingga orang rela membayar mahal hanya demi mendapatkan hasil tangan Anda.`,
      leverageModels: [
        {
          id: 1,
          title: 'Jasa Keahlian Bertarif Mahal (Premium Pricing)',
          badge: 'KONSULTAN AHLI',
          badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
          iconName: 'TrendingUp',
          whyFits: `Keahlian Anda sangat langka; jangan jual murah berdasarkan jam kerja, tapi pasang harga berdasarkan nilai hasil kerja Anda.`,
          steps: [
            'Fokus hanya melayani klien yang paham kualitas dan siap membayar mahal.',
            'Berikan garansi standar mutu tinggi yang tidak berani dijanjikan oleh pesaing murahan.',
            'Kumpulkan portofolio bukti hasil kerja nyata untuk memperkuat reputasi kepakaran Anda.'
          ]
        },
        {
          id: 2,
          title: 'Membuat Karya Master / Produk Unggulan Berlisensi',
          badge: 'KARYA UNGGUL',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'Zap',
          whyFits: `Sekali Anda menciptakan karya berstandar dunia, karya itu akan menjadi aset berharga yang terus dicari.`,
          steps: [
            'Dedikasikan waktu fokus Anda untuk menyelesaikan produk atau software inti terbaik.',
            'Daftarkan hak cipta atau paten resmi agar tidak mudah dibajak orang lain.',
            'Gandeng rekan tipe Evangelist untuk mengurus penjualan dan pemasarannya ke pasar luas.'
          ]
        },
        {
          id: 3,
          title: 'Pelatihan Eksklusif untuk Kalangan Terbatas',
          badge: 'MASTERCLASS',
          badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
          iconName: 'Coins',
          whyFits: `Banyak praktisi pemula yang ingin belajar rahasia teknik Anda dan bersedia membayar biaya tinggi untuk kelas privat.`,
          steps: [
            'Susun kurikulum mendalam berdasarkan pengalaman jam terbang Anda.',
            'Buka kelas dengan kuota sangat terbatas agar terkesan eksklusif dan bergengsi.',
            'Bina alumni kelas Anda menjadi jaringan pendukung karya-karya Anda berikutnya.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Terlalu Perfeksionis Sampai Karyanya Tidak Pernah Dirilis',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Karya hebat Anda tidak pernah menghasilkan uang karena Anda selalu merasa masih ada sedikit kekurangan yang harus diperbaiki.',
          steps: [
            { num: 1, title: 'Selesai Lebih Baik daripada Sempurna', action: 'Ingat bahwa karya yang sudah rilis dan dinikmati orang jauh lebih bermanfaat daripada karya sempurna yang cuma disimpan di laptop.' },
            { num: 2, title: 'Pasang Tenggat Waktu Rilis yang Ketat', action: 'Minta rekan kerja Anda untuk mengambil paksa hasil kerja Anda begitu batas waktu habis.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Kaku Saat Bicara dengan Orang Awam',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Klien bingung mendengarkan penjelasan teknis Anda dan akhirnya batal membeli karena merasa terlalu rumit.',
          steps: [
            { num: 1, title: 'Gunakan Perumpamaan Sederhana', action: 'Jelaskan manfaatnya buat kehidupan sehari-hari klien, bukan nama istilah teknisnya.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Tawar-Menawar Harga dan Tagih-Menagih Pembayaran', whyUnfit: 'Bikin Anda tidak enak hati dan merusak fokus berkarya.', targetDelegation: 'Serahkan urusan kasir dan invoice ke admin.' },
        { id: 2, task: 'Bikin Konten Medsos / Basa-Basi Pemasaran Harian', whyUnfit: 'Menguras energi konsentrasi deep work Anda.', targetDelegation: 'Pekerjakan tim konten marketing.' },
        { id: 3, task: 'Urusan Logistik, Pengiriman, dan Packing Barang', whyUnfit: 'Bukan keahlian bernilai tinggi Anda.', targetDelegation: 'Serahkan ke tim kurir atau staf gudang.' },
        { id: 4, task: 'Rapat Basa-Basi yang Memotong Waktu Kerja Fokus', whyUnfit: 'Otak Anda butuh keheningan berjam-jam untuk menyelesaikan hal rumit.', targetDelegation: 'Tolak atau batasi jadwal rapat.' }
      ]
    },

    accumulator: {
      nicheTitle: `Posisi Paling Pas: Penjaga Brankas & Ahli Perlindungan Aset (${p.name} + ${s.name})`,
      nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
      moatSummary: `Kekuatan terbesar Anda adalah kehati-hatian dan kepatuhan pada keamanan. Anda adalah alasan kenapa keluarga atau bisnis Anda bisa selamat melewati krisis ekonomi terburuk di saat orang lain yang gegabah pada gulung tikar.`,
      leverageModels: [
        {
          id: 1,
          title: 'Pengumpulan Aset Riil Bernilai Abadi',
          badge: 'ASET AMAN',
          badgeColor: 'bg-slate-50 text-slate-800 border-slate-200',
          iconName: 'TrendingUp',
          whyFits: `Ketenangan batin Anda berasal dari kepemilikan aset yang nyata, anti-rusak, dan tidak bisa hilang karena penipuan.`,
          steps: [
            'Fokuskan tabungan Anda untuk membeli emas murni, tanah di lokasi strategis, dan surat berharga negara.',
            'Pastikan semua dokumen legalitas kepemilikan beres dan disimpan di tempat paling aman.',
            'Nikmati ketenangan hidup karena Anda punya cadangan biaya hidup untuk bertahun-tahun ke depan.'
          ]
        },
        {
          id: 2,
          title: 'Jasa Pengawasan Kepatuhan & Audit Risiko Keuangan',
          badge: 'BENTENG PENCEGAH',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconName: 'Zap',
          whyFits: `Perusahaan besar sangat butuh orang yang jujur dan teliti seperti Anda untuk mencegah kecurangan dan kebocoran kas.`,
          steps: [
            'Bantu bisnis merapikan pencatatan bukti transaksi dan kepatuhan hukum.',
            'Tutup celah-celah pengeluaran yang rawan dimanipulasi oknum.',
            'Jadilah penasihat terpercaya yang memegang kunci brankas pengeluaran.'
          ]
        },
        {
          id: 3,
          title: 'Pengelola Dana Bersama / Koperasi Mandiri',
          badge: 'DANA AMANAH',
          badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          iconName: 'Coins',
          whyFits: `Orang-orang merasa sangat aman menitipkan dana darurat mereka kepada Anda karena reputasi Anda yang terpercaya.`,
          steps: [
            'Bentuk kelompok tabungan bersama atau koperasi keluarga dengan aturan pencairan yang ketat.',
            'Putar dana hanya di instrumen yang sangat aman dengan jaminan pasti.',
            'Bagi hasil keuntungan secara transparan kepada seluruh anggota.'
          ]
        }
      ],
      hazardProtocols: [
        {
          id: 1,
          name: 'Jebakan 1: Terlalu Takut Rugi Sampai Melewatkan Peluang Emas',
          riskLevel: 'Tinggi',
          riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
          realImpact: 'Menyimpan uang tunai terlalu lama tanpa diputar membuat nilai uang Anda tergerus inflasi kenaikan harga barang.',
          steps: [
            { num: 1, title: 'Sisihkan Sedikit Uang Uji Coba', action: 'Alokasikan 5–10% tabungan untuk dicoba ke instrumen bisnis yang bertumbuh.' },
            { num: 2, title: 'Bermitra dengan Rekan yang Jeli Peluang', action: 'Ajak rekan tipe Allocator atau Arbitrageur untuk memandu penempatan uang yang aman.' }
          ]
        },
        {
          id: 2,
          name: 'Jebakan 2: Terlalu Kaku Soal Pengeluaran Sampai Bikin Stres Hubungan',
          riskLevel: 'Moderat',
          riskBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
          realImpact: 'Pasangan atau rekan kerja bisa merasa terkekang jika setiap pengeluaran kecil selalu didebat secara berlebihan.',
          steps: [
            { num: 1, title: 'Buat Anggaran Senang-Senang', action: 'Sisihkan jatah uang jajan bulanan yang bebas dihabiskan tanpa perlu pencatatan kaku.' }
          ]
        }
      ],
      delegationTasks: [
        { id: 1, task: 'Melakukan Spekulasi Peluang Berisiko Tinggi', whyUnfit: 'Bikin Anda tidak bisa tidur nyenyak karena was-was.', targetDelegation: 'Hindari instrumen yang tidak Anda pahami risikonya.' },
        { id: 2, task: 'Negosiasi Penjualan Agresif yang Butuh Janji Manis', whyUnfit: 'Bukan gaya Anda yang jujur dan menjaga amanah.', targetDelegation: 'Serahkan ke tim promosi.' },
        { id: 3, task: 'Eksperimen Bisnis Baru Tanpa Rencana Jelas', whyUnfit: 'Serahkan eksperimen ke rekan yang berani rugi.', targetDelegation: 'Anda fokus menjaga brankas cadangan kas saja.' },
        { id: 4, task: 'Pekerjaan Cepat yang Menuntut Putusan Terburu-Buru', whyUnfit: 'Anda butuh waktu untuk meneliti keamanannya dulu.', targetDelegation: 'Minta waktu jeda 24 jam.' }
      ]
    }
  };

  const selectedDossier = archetypeDossierMap[p.id] || archetypeDossierMap['catalyst'];
  const { nicheTitle, nicheTag, moatSummary, leverageModels, hazardProtocols, delegationTasks } = selectedDossier;

  // 3. GOLDEN HOURS & RITME EKSEKUSI (CIRCADIAN)
  const isOwl = chrono.toLowerCase().includes('owl') || chrono.toLowerCase().includes('malam');
  const circadianSchedule: SystemicCircadianBlock[] = isOwl
    ? [
        {
          id: 1,
          time: '09:00 – 11:30',
          phase: 'Pagi Menjelang Siang (Aktivitas Santai & Cek Pesan)',
          isPeak: false,
          badge: 'MULAI SANTAI',
          activity: 'Cek hal penting dari semalam, tentukan 3 target utama hari ini, dan sarapan santai.',
          guidance: 'Hindari perdebatan sengit atau mengambil keputusan besar di jam ini karena pikiran belum segar sepenuhnya.'
        },
        {
          id: 2,
          time: '12:00 – 13:00',
          phase: 'Siang Hari (Istirahat & Makan Siang)',
          isPeak: false,
          badge: 'REHAT',
          activity: 'Makan siang bergizi, minum air putih cukup, dan istirahat sejenak dari layar HP atau laptop.',
          guidance: 'Jangan gunakan jam istirahat untuk scrolling media sosial yang bikin emosi atau lelah mental.'
        },
        {
          id: 3,
          time: '18:00 – 23:00',
          phase: 'Malam Hari (Jam Paling Fokus & Produktif)',
          isPeak: true,
          badge: 'JAM EMAS FOKUS (PEAK)',
          activity: 'Waktu terbaik untuk berpikir kreatif, menyusun rencana besar, menyelesaikan tugas berat, dan membuat karya.',
          guidance: 'Singkirkan gangguan; manfaatkan energi malam ini untuk menuntaskan pekerjaan penentu masa depan Anda.'
        },
        {
          id: 4,
          time: '23:30 – 00:30',
          phase: 'Menjelang Tidur (Evaluasi Santai & Catat Ide)',
          isPeak: false,
          badge: 'PENUTUPAN',
          activity: 'Catat ide-ide yang muncul ke buku catatan, siapkan agenda esok hari, lalu relaksasi menuju istirahat.',
          guidance: 'Tuliskan hal-hal yang masih mengganjal di kepala ke kertas agar Anda bisa tidur nyenyak tanpa kepikiran.'
        }
      ]
    : [
        {
          id: 1,
          time: '05:30 – 08:30',
          phase: 'Pagi Hari (Jam Paling Segar & Fokus Penuh)',
          isPeak: true,
          badge: 'JAM EMAS FOKUS (PEAK)',
          activity: 'Waktu terbaik untuk pekerjaan paling berat, memikirkan ide penting, dan membuat keputusan besar.',
          guidance: 'Lindungi jam pagi ini dari obrolan basa-basi atau urusan remeh yang menyedot konsentrasi.'
        },
        {
          id: 2,
          time: '10:00 – 12:30',
          phase: 'Menjelang Siang (Waktu Bertemu & Kerja Sama)',
          isPeak: false,
          badge: 'KOLABORASI',
          activity: 'Waktu pas untuk ngobrol dengan tim, presentasi ke klien, dan merundingkan kerja sama.',
          guidance: 'Gunakan energi ramah Anda yang masih segar untuk meyakinkan orang lain.'
        },
        {
          id: 3,
          time: '14:00 – 16:00',
          phase: 'Sore Hari (Tugas Ringan & Rapi-Rapi)',
          isPeak: false,
          badge: 'TUGAS RINGAN',
          activity: 'Merapikan dokumen, membalas pesan, mengecek jadwal, dan pekerjaan rutin lainnya.',
          guidance: 'Karena tenaga mulai berkurang di sore hari, cocokkan untuk pekerjaan yang tidak butuh mikir keras.'
        },
        {
          id: 4,
          time: '21:00 – 22:30',
          phase: 'Malam Hari (Waktu Tenang & Bersiap Istirahat)',
          isPeak: false,
          badge: 'PENUTUPAN',
          activity: 'Evaluasi apa yang sudah tercapai hari ini, rencanakan hal esok hari, dan istirahatkan tubuh.',
          guidance: 'Redupkan lampu kamar dan hindari menatap layar gadget terlalu lama agar tidur berkualitas.'
        }
      ];

  return {
    nicheTitle,
    nicheTag,
    moatSummary,
    vectorMoats,
    leverageModels,
    hazardProtocols,
    circadianSchedule,
    delegationTasks
  };
}
