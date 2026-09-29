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

  // 2. JALUR UANG & LEVERAGE FINANSIAL (LEVERAGE CAPITAL)
  const leverageModels: SystemicLeverageModel[] = [
    {
      id: 1,
      title: 'Membangun Bisnis / Proyek Rintisan Baru',
      badge: 'USAHA SENDIRI',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconName: 'TrendingUp',
      whyFits: `Gabungan karakter ${p.name} dan ${s.name} membuat Anda lihai melihat kebutuhan orang yang belum terlayani, mengajak rekan yang tepat, dan langsung membuat solusi nyata dalam tempo cepat.`,
      steps: [
        'Cari 2–3 masalah nyata di sekitar Anda yang sering dikeluhkan orang tapi belum ada solusi praktisnya.',
        'Ajak 1–2 rekan kerja yang teliti dan rapi (tipe Mechanic atau Specialist) untuk membantu operasional teknis.',
        'Terapkan bagi hasil atau kepemilikan usaha yang adil sejak awal agar semua bersemangat membesarkan usaha.',
        'Setelah bisnis mulai berjalan teratur, serahkan tugas harian ke tim agar Anda bisa mencari peluang pengembangan berikutnya.'
      ]
    },
    {
      id: 2,
      title: 'Jasa Konsultasi / Pendampingan Proyek Bernilai Tinggi',
      badge: 'JASA KEAHLIAN',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      iconName: 'Zap',
      whyFits: `Daya aksi dan kemampuan bergaul Anda sangat cocok untuk membantu klien menyelesaikan masalah macet atau meluncurkan program baru dalam waktu 1–2 bulan.`,
      steps: [
        'Kemas keahlian Anda menjadi paket pendampingan singkat (misal 30 hari) dengan target hasil yang jelas.',
        'Berikan langkah praktis dan solusi langsung yang mudah dijalankan oleh klien.',
        'Minta bantuan asisten untuk urusan rekap laporan dan jadwal agar tenaga Anda tidak habis di urusan administrasi.'
      ]
    },
    {
      id: 3,
      title: 'Kerja Sama Kemitraan & Distribusi (Bagi Hasil / Komisi)',
      badge: 'KOLABORASI CUAN',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      iconName: 'Coins',
      whyFits: `Jaringan pertemanan luas dan keluwesan Anda memudahkan Anda menghubungkan pemilik produk yang bagus dengan calon pembeli yang membutuhkan.`,
      steps: [
        'Temukan rekan atau pemilik produk berkualitas yang belum pintar memasarkan produknya ke pasar luas.',
        'Sepakati komisi atau sistem bagi hasil yang menarik (misal 20–40%) tanpa Anda harus repot membuat produk sendiri dari nol.',
        'Gunakan aplikasi pencatat transaksi otomatis agar Anda tidak repot merekap penjualan secara manual setiap hari.'
      ]
    }
  ];

  // 3. POLA SABOTASE DIRI (ANTI-BLINDSPOT PROTOCOL)
  const hazardProtocols: SystemicHazardProtocol[] = [
    {
      id: 1,
      name: 'Jebakan 1: Cepat Bosan Saat Pekerjaan Mulai Masuk Fase Rutin',
      riskLevel: v.stability < 45 ? 'Tinggi' : 'Moderat',
      riskBadgeColor: v.stability < 45 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200',
      realImpact: 'Proyek yang awalnya dirintis dengan penuh semangat bisa terbengkalai begitu memasuki tahap rutinitas; rekan kerja bisa mengira Anda kurang konsisten.',
      steps: [
        {
          num: 1,
          title: 'Kumpulkan Tugas Rutin di Satu Waktu Khusus',
          action: 'Kerjakan seluruh urusan laporan dan administrasi dalam 1–2 jam tertentu saja per minggu, jangan dicicil setiap hari agar tidak menguras mood.'
        },
        {
          num: 2,
          title: 'Beri Hadiah Kecil untuk Diri Sendiri',
          action: 'Buat daftar centang sederhana dan beri reward menyenangkan pada diri sendiri (misal kopi favorit atau istirahat santai) saat tugas rutin tuntas.'
        },
        {
          num: 3,
          title: 'Ajak Rekan yang Suka Keteraturan',
          action: 'Segera serahkan pemeliharaan sistem ke rekan yang rapi dan teliti (tipe Mechanic/Specialist) begitu proyek sudah masuk tahap operasional stabil.'
        }
      ]
    },
    {
      id: 2,
      name: 'Jebakan 2: Membuka Terlalu Banyak Hal Baru Sekaligus',
      riskLevel: 'Tinggi',
      riskBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      realImpact: 'Pikiran terpecah ke mana-mana, tenaga cepat terkuras habis, dan akhirnya tidak ada satu pun proyek yang selesai menghasilkan uang secara maksimal.',
      steps: [
        {
          num: 1,
          title: 'Batasi Maksimal 2 Proyek Prioritas',
          action: 'Tahan diri dari godaan mencoba ide baru sampai 2 proyek utama yang sedang Anda kerjakan benar-benar selesai dan menghasilkan.'
        },
        {
          num: 2,
          title: 'Evaluasi Rutin Setiap 30 Hari',
          action: 'Periksa hasil nyata tiap bulan: jika suatu ide tidak menunjukkan kemajuan berarti, ikhlaskan untuk ditutup agar energi tidak terbuang sia-sia.'
        },
        {
          num: 3,
          title: 'Sadari Peran Terbaik Anda',
          action: 'Ingat bahwa kelebihan terbesar Anda adalah pemantik awal dan pencari ide, bukan orang yang harus mengurus detail administrasi selamanya.'
        }
      ]
    }
  ];

  // 4. GOLDEN HOURS & RITME EKSEKUSI (CIRCADIAN & DELEGATION)
  const isOwl = chrono.toLowerCase().includes('owl') || chrono.toLowerCase().includes('malam');
  const circadianSchedule: SystemicCircadianBlock[] = isOwl
    ? [
        {
          id: 1,
          time: '07:00 – 09:00',
          phase: 'Pagi Hari (Pemanasan Santai)',
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

  const delegationTasks: SystemicDelegationTask[] = [
    {
      id: 1,
      task: 'Merekap Data & Membuat Laporan Rutin Harian',
      whyUnfit: 'Bikin Anda cepat bosan, lesu, dan kehabisan tenaga untuk hal-hal yang lebih penting.',
      targetDelegation: 'Minta bantuan asisten, staf administrasi, atau gunakan rumus spreadsheet otomatis.'
    },
    {
      id: 2,
      task: 'Membaca Dokumen Panjang & Aturan Hukum yang Kaku',
      whyUnfit: 'Membutuhkan ketelitian kata demi kata yang menguras kesabaran dan bukan keahlian alami Anda.',
      targetDelegation: 'Gunakan jasa konsultan hukum, bagian legal, atau template perjanjian yang sudah standar.'
    },
    {
      id: 3,
      task: 'Mencatat Stok Barang & Administrasi Karyawan',
      whyUnfit: 'Tugas berulang yang menyita banyak waktu tanpa mendatangkan penghasilan baru secara langsung.',
      targetDelegation: 'Gunakan aplikasi pencatat stok/karyawan digital atau pekerjakan staf administrasi.'
    },
    {
      id: 4,
      task: 'Membalas Chat Tanya Jawab yang Berulang-ulang',
      whyUnfit: 'Menyita konsentrasi dan waktu Anda yang seharusnya bisa dipakai untuk mencari peluang rezeki yang lebih besar.',
      targetDelegation: 'Gunakan pesan template, fitur auto-reply, atau bantuan admin layanan pelanggan (CS).'
    }
  ];

  return {
    nicheTitle: `Posisi Paling Pas: Penggerak Cepat & Tanggap Peluang (${p.name} + ${s.name})`,
    nicheTag: `Karakter Dominan: ${p.name} · Didukung: ${s.name}`,
    moatSummary: `Gabungan kelebihan ${p.name} dan ${s.name} membuat Anda sangat lincah membaca peluang. Keunggulan alami Anda adalah kecepatan bergerak: Anda mampu meluncurkan ide dan mencoba hal baru jauh lebih cepat dibandingkan orang lain yang sering kebanyakan mikir atau terjebak rapat bertele-tele.`,
    vectorMoats,
    leverageModels,
    hazardProtocols,
    circadianSchedule,
    delegationTasks
  };
}
