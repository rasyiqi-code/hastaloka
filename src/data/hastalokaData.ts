import type { Question, ArchetypeProfile, LifeDomain, SynergyProtocol } from '../types/hastaloka';

export const HASTALOKA_QUESTIONS: Question[] = [
  // Bagian A: Vektor Drive (D1 - D5)
  {
    id: 'D1',
    vector: 'drive',
    categoryTitle: 'Dorongan Bertindak (Drive)',
    text: 'Saya lebih suka langsung memulai proyek baru daripada menunggu semua rencana sempurna.'
  },
  {
    id: 'D2',
    vector: 'drive',
    categoryTitle: 'Dorongan Bertindak (Drive)',
    text: 'Saya merasa terdorong oleh target-target ambisius yang menuntut pencapaian nyata.'
  },
  {
    id: 'D3',
    vector: 'drive',
    categoryTitle: 'Dorongan Bertindak (Drive)',
    text: 'Penolakan atau kegagalan awal tidak menghentikan langkah saya untuk mencoba kembali.'
  },
  {
    id: 'D4',
    vector: 'drive',
    categoryTitle: 'Dorongan Bertindak (Drive)',
    text: 'Saya berani mengambil risiko yang diperhitungkan demi mencapai hasil yang signifikan.'
  },
  {
    id: 'D5',
    vector: 'drive',
    categoryTitle: 'Dorongan Bertindak (Drive)',
    text: 'Saya memiliki dorongan bawaan untuk memimpin dan menggerakkan orang lain ketika situasi macet.'
  },

  // Bagian B: Vektor Adaptabilitas (A1 - A5)
  {
    id: 'A1',
    vector: 'adaptability',
    categoryTitle: 'Keluwesan Beradaptasi (Adaptability)',
    text: 'Saya merasa nyaman ketika rencana mendadak berubah di tengah jalan.'
  },
  {
    id: 'A2',
    vector: 'adaptability',
    categoryTitle: 'Keluwesan Beradaptasi (Adaptability)',
    text: 'Saya mudah memahami sudut pandang dan suasana hati orang lain tanpa harus dijelaskan panjang lebar.'
  },
  {
    id: 'A3',
    vector: 'adaptability',
    categoryTitle: 'Keluwesan Beradaptasi (Adaptability)',
    text: 'Saya mampu tetap tenang dan fleksibel saat menghadapi situasi yang penuh ketidakpastian.'
  },
  {
    id: 'A4',
    vector: 'adaptability',
    categoryTitle: 'Keluwesan Beradaptasi (Adaptability)',
    text: 'Saya cepat mempelajari cara kerja baru jika metode lama terbukti tidak relevan.'
  },
  {
    id: 'A5',
    vector: 'adaptability',
    categoryTitle: 'Keluwesan Beradaptasi (Adaptability)',
    text: 'Saya lebih mengutamakan solusi yang menyatukan daripada mempertahankan gengsi pendapat pribadi.'
  },

  // Bagian C: Vektor Stabilitas (S1 - S5)
  {
    id: 'S1',
    vector: 'stability',
    categoryTitle: 'Kerapian & Konsistensi (Stability)',
    text: 'Saya selalu menyelesaikan tugas hingga tuntas meskipun terasa monoton dan repetitif.'
  },
  {
    id: 'S2',
    vector: 'stability',
    categoryTitle: 'Kerapian & Konsistensi (Stability)',
    text: 'Jadwal, daftar periksa (checklist), dan keteraturan membuat hidup saya jauh lebih tenang dan produktif.'
  },
  {
    id: 'S3',
    vector: 'stability',
    categoryTitle: 'Kerapian & Konsistensi (Stability)',
    text: 'Saya sangat teliti dalam memperhatikan detail kecil yang sering diabaikan orang lain.'
  },
  {
    id: 'S4',
    vector: 'stability',
    categoryTitle: 'Kerapian & Konsistensi (Stability)',
    text: 'Saya jarang sekali terlambat memenuhi tenggat waktu atau janji yang sudah disepakati.'
  },
  {
    id: 'S5',
    vector: 'stability',
    categoryTitle: 'Kerapian & Konsistensi (Stability)',
    text: 'Saya secara konsisten mematuhi protokol dan prosedur yang sudah terbukti aman.'
  },

  // Bagian D: Vektor Sintesis (N1 - N5)
  {
    id: 'N1',
    vector: 'synthesis',
    categoryTitle: 'Daya Pikir & Visi (Synthesis)',
    text: 'Saya sering melihat hubungan tersembunyi antara dua bidang ilmu yang tampak tidak berkaitan.'
  },
  {
    id: 'N2',
    vector: 'synthesis',
    categoryTitle: 'Daya Pikir & Visi (Synthesis)',
    text: 'Saya lebih tertarik memahami prinsip-prinsip mendasar dan visi jangka panjang daripada masalah teknis harian.'
  },
  {
    id: 'N3',
    vector: 'synthesis',
    categoryTitle: 'Daya Pikir & Visi (Synthesis)',
    text: 'Saya menikmati proses memecahkan teka-teki logika atau masalah sistemik yang rumit.'
  },
  {
    id: 'N4',
    vector: 'synthesis',
    categoryTitle: 'Daya Pikir & Visi (Synthesis)',
    text: 'Saya kerap memikirkan arah tren 5 hingga 10 tahun ke depan dan bagaimana dampaknya bagi masyarakat.'
  },
  {
    id: 'N5',
    vector: 'synthesis',
    categoryTitle: 'Daya Pikir & Visi (Synthesis)',
    text: 'Saya mampu menyederhanakan gagasan yang sangat rumit menjadi kerangka pemikiran yang mudah dipahami.'
  },

  // Bagian E: Vektor Konektivitas (K1 - K5)
  {
    id: 'K1',
    vector: 'connectivity',
    categoryTitle: 'Hubungan & Kerja Sama (Connectivity)',
    text: 'Orang-orang merasa aman menceritakan masalah pribadi atau rahasia mereka kepada saya.'
  },
  {
    id: 'K2',
    vector: 'connectivity',
    categoryTitle: 'Hubungan & Kerja Sama (Connectivity)',
    text: 'Saya mudah memulai percakapan hangat dengan orang yang baru pertama kali saya temui.'
  },
  {
    id: 'K3',
    vector: 'connectivity',
    categoryTitle: 'Hubungan & Kerja Sama (Connectivity)',
    text: 'Saya secara berkala merawat hubungan baik dengan jejaring teman, kolega, dan mitra lama.'
  },
  {
    id: 'K4',
    vector: 'connectivity',
    categoryTitle: 'Hubungan & Kerja Sama (Connectivity)',
    text: 'Saya terampil menyusun kata-kata persuasif yang membuat orang lain terinspirasi dan percaya.'
  },
  {
    id: 'K5',
    vector: 'connectivity',
    categoryTitle: 'Hubungan & Kerja Sama (Connectivity)',
    text: 'Saya percaya bahwa kolaborasi tulus selalu menghasilkan dampak yang jauh lebih besar daripada bekerja sendirian.'
  }
];

export const HASTALOKA_ARCHETYPES: ArchetypeProfile[] = [
  {
    id: 'architect',
    name: 'Architect',
    indonesianName: 'Perancang Sistem',
    role: 'Membangun cara kerja yang rapi, teratur, dan bisa jalan sendiri tanpa harus diawasi tiap detik.',
    vectorDominance: 'Sintesis (95) & Stabilitas (80)',
    description: 'Otak perancang yang suka keteraturan. Paling jago bikin alur kerja yang jelas, rencana jangka panjang, dan memastikan semua orang tahu tugasnya masing-masing.',
    idealVector: {
      drive: 55,
      adaptability: 65,
      stability: 80,
      synthesis: 95,
      connectivity: 50
    },
    strengths: [
      'Pikiran sangat logis dan jago melihat gambaran besar masa depan',
      'Mampu bikin panduan kerja (SOP) yang gampang ditiru dan dikembangkan',
      'Tenang, berbasis fakta, dan tidak gampang panik saat ada masalah'
    ],
    blindSpots: [
      'Bisa kelamaan mikir dan bikin rencana sampai lupa mulai eksekusi',
      'Gampang kesal kalau ketemu orang yang kerjanya berantakan dan asal-asalan'
    ],
    careerStrategy: 'Paling pas jadi Manajer Proyek, Kepala Sistem/IT, Perancang Alur Kerja Bisnis, atau Konsultan Manajemen.',
    wealthStrategy: 'Membangun aset yang bisa jalan otomatis: bisnis berbasis sistem, lisensi karya/IP, atau properti sewaan yang rutin memberi hasil.',
    circadianGuidance: 'Sediakan blok waktu khusus yang tenang tanpa gangguan chat/email untuk memikirkan rencana dan strategi utama.',
    color: '#6366f1' // Indigo
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    indonesianName: 'Penggerak Cepat',
    role: 'Menyalakan semangat proyek baru, mendobrak rasa malas/ragu, dan maunya serba cepat.',
    vectorDominance: 'Drive (95) & Adaptabilitas (80)',
    description: 'Tipe gaspol yang penuh energi. Paling benci kebanyakan wacana atau rapat panjang tanpa tindakan nyata. Kalau ada ide, maunya langsung dicoba sekarang juga.',
    idealVector: {
      drive: 95,
      adaptability: 80,
      stability: 35,
      synthesis: 55,
      connectivity: 65
    },
    strengths: [
      'Inisiatif sangat tinggi dan punya nyali memulai sesuatu dari nol',
      'Tahan banting menghadapi penolakan awal dan sangat berani ambil risiko',
      'Sangat lincah banting setir mencari jalan keluar kalau rencana awal macet'
    ],
    blindSpots: [
      'Gampang bosan setengah mati kalau disuruh ngerjain tugas rutin dan bikin laporan berkas',
      'Sering buka banyak proyek baru sekaligus tapi suka terbengkalai di tengah jalan'
    ],
    careerStrategy: 'Wajib dipasangkan dengan rekan kerja yang teliti. Sangat cocok jadi Founder, Manajer Pertumbuhan Bisnis, Pembuka Cabang Baru, atau Penyelamat Proyek Macet.',
    wealthStrategy: 'Mencari cuan dari peluang tahap awal, merintis bisnis baru lalu dijual, atau memperbanyak coba peluang sampai ketemu yang meledak.',
    circadianGuidance: 'Pakai jam energi terbaik Anda untuk ketemu orang, presentasi ide, dan negosiasi. Serahkan urusan administrasi ke tim lain.',
    color: '#f97316' // Orange
  },
  {
    id: 'evangelist',
    name: 'Evangelist',
    indonesianName: 'Penyampai Cerita',
    role: 'Menyampaikan ide jadi cerita seru, memikat hati orang, dan membangun kepercayaan publik.',
    vectorDominance: 'Konektivitas (98) & Drive (75)',
    description: 'Jagoan komunikasi yang magnetis. Punya bakat alami bikin hal biasa terdengar luar biasa, gampang akrab dengan siapa saja, dan bisa bikin orang tergerak ikut visinya.',
    idealVector: {
      drive: 75,
      adaptability: 75,
      stability: 40,
      synthesis: 55,
      connectivity: 98
    },
    strengths: [
      'Pintar merangkai kata dan sangat persuasif saat bicara di depan orang',
      'Gampang bikin koneksi pertemanan dan disukai banyak kalangan',
      'Bisa mengubah ide rumit jadi cerita yang gampang dipahami dan menyentuh perasaan'
    ],
    blindSpots: [
      'Sering kelepasan ngasih janji manis ke klien yang bikin tim operasional keteteran',
      'Gampang lelah mental karena terlalu berusaha menyenangkan semua orang (people pleasing)'
    ],
    careerStrategy: 'Kepala Hubungan Masyarakat (PR), Juru Bicara, Pemimpin Brand, Presenter, Pemasaran, atau Penggalang Dana Komunitas.',
    wealthStrategy: 'Manfaatkan pengaruh sosial, jaringan relasi, komisi dari penjualan bernilai tinggi, dan kerja sama kemitraan strategis.',
    circadianGuidance: 'Jangan paksa diri tampil di depan umum saat energi fisik lagi drop; istirahat sejenak agar daya pikat alami Anda tetap maksimal.',
    color: '#ec4899' // Pink
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    indonesianName: 'Beres-Beres Operasi',
    role: 'Memperbaiki alur yang bocor, memangkas biaya boros, dan menjaga kerja harian tetap lancar.',
    vectorDominance: 'Stabilitas (95) & Adaptabilitas (80)',
    description: 'Tangan dingin yang bikin segala hal berjalan mulus. Nggak banyak omong, tapi paling jeli melihat mana biaya yang bocor, mana alat yang rusak, dan bagaimana bikin pekerjaan jadi lebih hemat dan cepat.',
    idealVector: {
      drive: 50,
      adaptability: 80,
      stability: 95,
      synthesis: 50,
      connectivity: 45
    },
    strengths: [
      'Sangat teliti menemukan pemborosan uang atau waktu yang terlewat oleh orang lain',
      'Tahan kerja tekun dalam rutinitas tanpa gampang bosan',
      'Praktis dan selalu punya solusi akal sehat untuk masalah di lapangan'
    ],
    blindSpots: [
      'Bisa terlalu curiga atau menolak ide baru cuma karena belum ada buktinya',
      'Sering ragu saat harus mengambil langkah ekspansi yang butuh sedikit spekulasi'
    ],
    careerStrategy: 'Manajer Operasional, Pengawas Mutu (QA), Kepala Logistik/Gudang, Insinyur Pemeliharaan, atau Manajer Kantor.',
    wealthStrategy: 'Hemat biaya pengeluaran, cari selisih efisiensi, dan simpan uang di tabungan atau investasi berbunga stabil yang aman.',
    circadianGuidance: 'Jadwalkan pagi hari atau jam kerja tetap untuk cek daftar tugas harian agar alur kerja tim terkendali rapi.',
    color: '#06b6d4' // Cyan
  },
  {
    id: 'allocator',
    name: 'Allocator',
    indonesianName: 'Pengelola Modal',
    role: 'Menempatkan uang, waktu, dan tenaga hanya ke tempat yang paling menghasilkan hasil terbaik.',
    vectorDominance: 'Stabilitas (85), Sintesis (85) & Drive (75)',
    description: 'Pakar kalkulasi yang tenang dan berhitung matang. Setiap melangkah selalu bertanya: "Berapa modalnya? Apa risikonya? Kapan balik modal?". Tidak gampang terbawa tren sesaat.',
    idealVector: {
      drive: 75,
      adaptability: 50,
      stability: 85,
      synthesis: 85,
      connectivity: 45
    },
    strengths: [
      'Sangat disiplin soal uang dan tidak gampang tergoda FOMO atau euforia sesaat',
      'Bisa berpikir dingin memakai data, bukan firasat kosong semata',
      'Jago melihat potensi nilai jangka panjang yang bakal berlipat ganda'
    ],
    blindSpots: [
      'Kadang dicap kaku atau pelit karena terlalu fokus pada hitungan angka',
      'Bisa kelamaan menimbang keputusan kalau datanya dirasa belum lengkap 100%'
    ],
    careerStrategy: 'Direktur Keuangan (CFO), Manajer Investasi, Pengelola Anggaran, Analis Portofolio, atau Pemodal Usaha.',
    wealthStrategy: 'Kekuatan bunga berbunga (compounding), beli aset bagus di harga diskon, dan fokus pada imbal hasil nyata bukan spekulasi.',
    circadianGuidance: 'Gunakan jam saat otak paling segar untuk menganalisis angka dan laporan. Hindari memutuskan urusan uang saat badan lelah.',
    color: '#10b981' // Emerald Green
  },
  {
    id: 'arbitrageur',
    name: 'Arbitrageur',
    indonesianName: 'Pemburu Peluang',
    role: 'Melihat celah cuan dan peluang cepat yang terlewat orang lain, lalu langsung mengeksekusinya.',
    vectorDominance: 'Adaptabilitas (95) & Drive (90)',
    description: 'Paling cerdik membaca situasi pasar. Punya insting tajam tahu barang apa yang bakal laku, siapa yang butuh apa, dan langsung menyambungkan rantai peluang sebelum orang lain sadar.',
    idealVector: {
      drive: 90,
      adaptability: 95,
      stability: 35,
      synthesis: 70,
      connectivity: 45
    },
    strengths: [
      'Bisa melihat celah keuntungan di mana orang lain cuma melihat masalah biasa',
      'Manuver super cepat, nggak ribet, dan sangat berani ambil momentum',
      'Naluri dagang alami yang lihai menegosiasikan kesepakatan manis'
    ],
    blindSpots: [
      'Sering berani mengambil risiko terlalu liar sampai mepet ke arah spekulasi murni',
      'Males bikin sistem jangka panjang, maunya cepat cuan lalu pindah ke tren berikutnya'
    ],
    careerStrategy: 'Trader pasar uang/komoditas, Makelar Properti/Bisnis, Pebisnis Celah E-commerce, atau Negosiator Kesepakatan Khusus.',
    wealthStrategy: 'Manfaatkan perbedaan harga di pasar, putar modal dengan kecepatan tinggi, dan segera amankan keuntungan sebelum celah pasar tutup.',
    circadianGuidance: 'Hati-hati burnout karena mantau layar dan tren terus-menerus; pasang jam tidur yang ketat biar pikiran nggak gampang oleng.',
    color: '#eab308' // Yellow
  },
  {
    id: 'specialist',
    name: 'Specialist',
    indonesianName: 'Ahli Spesifik',
    role: 'Menguasai satu keahlian mendalam yang sulit ditiru atau digantikan orang lain.',
    vectorDominance: 'Stabilitas (95) & Sintesis Mendalam (75)',
    description: 'Ahli di bidangnya yang mencintai kualitas dan kedalaman ilmu. Lebih suka fokus menyelesaikan satu karya rumit sampai sempurna daripada mengurusi politik kantor atau basa-basi sosial.',
    idealVector: {
      drive: 45,
      adaptability: 35,
      stability: 95,
      synthesis: 75,
      connectivity: 30
    },
    strengths: [
      'Ketelitian teknis luar biasa dan punya ilmu yang sangat dalam di bidangnya',
      'Bisa fokus berjam-jam tanpa gampang terdistraksi hal sepele',
      'Jadi rujukan utama kalau ada masalah rumit yang orang lain sudah angkat tangan'
    ],
    blindSpots: [
      'Sering kesulitan menjelaskan hal teknis memakai bahasa sederhana ke orang awam',
      'Keras kepala soal standar mutu dan benci kompromi bisnis yang menurunkan kualitas'
    ],
    careerStrategy: 'Ahli Software Inti/AI, Dokter Spesialis, Peneliti Laboratorium, Arsitek Teknis, Konsultan Hukum Spesialis.',
    wealthStrategy: 'Pasang tarif premium atas keahlian langka Anda, jasa konsultasi khusus, atau punya hak paten/karya intelektual.',
    circadianGuidance: 'Cari ruangan kerja yang hening tanpa banyak gangguan orang lewat saat jam fokus terbaik Anda.',
    color: '#8b5cf6' // Violet
  },
  {
    id: 'accumulator',
    name: 'Accumulator',
    indonesianName: 'Penjaga Cadangan',
    role: 'Menjaga tabungan darurat, membatasi risiko, dan memastikan aman dari krisis.',
    vectorDominance: 'Stabilitas (98) & Konservasi (65)',
    description: 'Benteng pertahanan terakhir yang bikin tenang. Selalu memikirkan skenario terburuk agar keluarga atau kantor tidak sampai gulung tikar kalau tiba-tiba ada krisis ekonomi.',
    idealVector: {
      drive: 30,
      adaptability: 40,
      stability: 98,
      synthesis: 50,
      connectivity: 65
    },
    strengths: [
      'Paling jago menabung dan mengerem pengeluaran yang tidak penting',
      'Paling cepat mencium gelagat bahaya atau penipuan sebelum orang lain sadar',
      'Sangat setia, bisa dipercaya memegang rahasia atau brankas penting'
    ],
    blindSpots: [
      'Sering kehilangan peluang bagus karena terlalu parno dan takut rugi uang',
      'Bisa gampang ribut sama rekan kerja/pasangan yang suka belanja atau ambil risiko spekulasi'
    ],
    careerStrategy: 'Pengawas Risiko Bisnis, Auditor Keuangan, Bagian Kepatuhan (Compliance), Pengelola Kas Darurat, atau Administrasi Legal.',
    wealthStrategy: 'Punya dana darurat aman untuk 6–12 bulan ke depan, punya aset nyata (emas, tanah, uang tunai), dan proteksi asuransi yang jelas.',
    circadianGuidance: 'Jaga jam tidur yang konsisten setiap malam, karena stres keuangan paling cepat reda saat fisik Anda bugar.',
    color: '#64748b' // Slate
  }
];

export const HASTALOKA_LIFE_DOMAINS: LifeDomain[] = [
  {
    id: 1,
    name: 'Vitalitas Fisik',
    category: 'Fisik & Energi',
    description: 'Kapasitas paru, kekuatan otot, imunitas seluler, dan kualitas nutrisi harian.',
    auditAspects: ['Olahraga aerobik & beban mingguan', 'Nutrisi rendah inflamasi', 'Kapasitas energi harian']
  },
  {
    id: 2,
    name: 'Kesehatan Tidur & Sirkadian',
    category: 'Fisik & Energi',
    description: 'Keteraturan tidur sesuai kronotipe alami dan ritme pemulihan biologis.',
    auditAspects: ['Tidur 7-8 jam efektif', 'Paparan matahari pagi', 'Minim cahaya biru malam hari']
  },
  {
    id: 3,
    name: 'Ketajaman Kognitif',
    category: 'Kognisi & Psikologis',
    description: 'Daya konsentrasi mendalam, memori kerja, dan pembelajaran keterampilan baru.',
    auditAspects: ['Sesi Deep Work tanpa notifikasi', 'Membaca materi berbobot', 'Latihan pemecahan masalah rumit']
  },
  {
    id: 4,
    name: 'Stabilitas Emosional',
    category: 'Kognisi & Psikologis',
    description: 'Regulasi stres, pencegahan kejenuhan mental (burnout), dan kesadaran diri.',
    auditAspects: ['Pemantauan Allostatic Load', 'Praktek dikotomi kendali', 'Kesehatan mental & relaksasi']
  },
  {
    id: 5,
    name: 'Ergonomi Lingkungan Hunian',
    category: 'Fisik & Energi',
    description: 'Kebersihan, ventilasi udara (kadar CO2 rendah), tata letak ruang kerja, dan pencahayaan.',
    auditAspects: ['Ventilasi silang ruangan', 'Decluttering meja kerja', 'Pencahayaan spektrum penuh']
  },
  {
    id: 6,
    name: 'Kapasitas Finansial',
    category: 'Karier & Finansial',
    description: 'Arus kas positif berkesinambungan, aset produktif, dan manajemen risiko utang.',
    auditAspects: ['Cadangan darurat 6 bulan', 'Investasi rutin instrumen produktif', 'Bebas utang konsumtif']
  },
  {
    id: 7,
    name: 'Karier & Karya Strategis',
    category: 'Karier & Finansial',
    description: 'Kesesuaian arketipe diri dengan tuntutan riil industri dan pasar kerja bernilai tinggi.',
    auditAspects: ['Sinergi arketipe dengan jobdesk', 'Hambatan masuk (moat) keahlian', 'Pertumbuhan dampak nyata']
  },
  {
    id: 8,
    name: 'Hubungan Intim & Asmara',
    category: 'Relasi & Makna',
    description: 'Keselarasan nilai inti hidup, gaya komunikasi jujur, dan pemenuhan emosional bersama pasangan.',
    auditAspects: ['Keselarasan visi masa depan', 'Resolusi konflik yang sehat', 'Kualitas waktu berdua']
  },
  {
    id: 9,
    name: 'Jejaring Sosial & Kolega',
    category: 'Relasi & Makna',
    description: 'Lingkaran pertemanan yang saling memberdayakan dan bebas dari hubungan toksik manipulatif.',
    auditAspects: ['Lingkaran dalam yang suportif', 'Pertukaran gagasan bermutu', 'Keluasan jaringan profesional']
  },
  {
    id: 10,
    name: 'Keluarga & Regenerasi',
    category: 'Relasi & Makna',
    description: 'Keharmonisan hubungan keluarga besar serta pendidikan generasi penerus.',
    auditAspects: ['Kualitas komunikasi antar-generasi', 'Keteladanan nilai moral keluarga', 'Kehangatan rumah tangga']
  },
  {
    id: 11,
    name: 'Istirahat & Pemulihan Jiwa',
    category: 'Kognisi & Psikologis',
    description: 'Alokasi waktu senggang berkualitas tanpa rasa bersalah atau gangguan tuntutan kerja.',
    auditAspects: ['Waktu jeda bebas layar (digital detox)', 'Hobi kreatif non-komersial', 'Kontemplasi batin yang tenang']
  },
  {
    id: 12,
    name: 'Integritas Moral & Makna Hidup',
    category: 'Relasi & Makna',
    description: 'Keselarasan tindakan harian dengan nilai etika pribadi serta kontribusi sosial nyata.',
    auditAspects: ['Konsistensi antara ucapan dan tindakan', 'Kontribusi sosial bagi sesama', 'Ketenangan hati nurani']
  }
];

export const ARCHETYPE_SYNERGY_RULES: Record<string, SynergyProtocol> = {
  // === 1. ARCHITECT PAIRINGS ===
  'architect_catalyst': {
    type: 'Netral Komplementer',
    tagline: 'Perancang Rencana & Eksekutor Gaspol',
    description: 'Catalyst maunya buru-buru jalan dan coba hal baru; Architect menjaga alurnya tetap rapi biar bisnis nggak berantakan pas lagi ngebut.',
    protocol: 'Kasih Catalyst kebebasan bereksperimen di awal; libatkan Architect saat ide tersebut mau dibikin jadi aturan kerja resmi.'
  },
  'architect_evangelist': {
    type: 'Tinggi',
    tagline: 'Mesin Produk di Balik Layar & Corong Suara ke Publik',
    description: 'Architect bikin produk atau sistemnya berjalan kokoh tanpa error; Evangelist yang maju ke depan buat menceritakannya ke khalayak ramai sampai orang terpikat.',
    protocol: 'Adakan obrolan santai mingguan: Evangelist lapor apa mau pasar, Architect menyesuaikan mana fitur yang realistis dikerjakan duluan.'
  },
  'architect_mechanic': {
    type: 'Tinggi',
    tagline: 'Bikin Denah & Tukang Bangun yang Solid',
    description: 'Pasangan paling rapi dan tertib. Architect menggambar rencana besarnya, Mechanic yang turun tangan memastikan mesin dan kerjaan harian berjalan tanpa bocor.',
    protocol: 'Architect fokus memikirkan cara kerja masa depan; Mechanic yang mengetes apakah rencana baru itu masuk akal dan gampang dikerjakan tim di lapangan.'
  },
  'architect_allocator': {
    type: 'Tinggi',
    tagline: 'Otak Strategi & Pengendali Anggaran',
    description: 'Duet pemikir ulung. Architect merancang cetak biru kerja yang luas, Allocator yang menghitung kebutuhan modal dan memastikan setiap rupiah ada hasilnya.',
    protocol: 'Architect bikin daftar rencana dan kebutuhan alat; Allocator yang menetapkan batas budget belanja dan jadwal evaluasi hasil.'
  },
  'architect_arbitrageur': {
    type: 'Rawan Gesekan',
    tagline: 'Satu Suka Tertib, Satu Suka Gerak Cepat',
    description: 'Arbitrageur mau cepat-cepat sikat peluang sebelum keburu diambil orang; Architect malah minta waktu buat meneliti dulu apakah sesuai prosedur atau tidak.',
    protocol: 'Siapkan jalur cepat tanpa birokrasi bertele-tele untuk peluang Arbitrageur dengan batas modal tertentu; kalau terbukti sukses, baru masukkan ke sistem utama.'
  },
  'architect_specialist': {
    type: 'Tinggi',
    tagline: 'Perancang Sistem & Jagoan Teknis',
    description: 'Architect melihat gambar besar keseluruhan proyek; Specialist menyelam ke dalam satu bagian paling sulit dengan kualitas sempurna.',
    protocol: 'Architect menjaga agar bagian yang dibikin Specialist tetap nyambung dan pas dengan bagian kerjaan tim lainnya.'
  },
  'architect_accumulator': {
    type: 'Netral Komplementer',
    tagline: 'Perencana Aman & Penjaga Tabungan',
    description: 'Keduanya sama-sama cinta ketenangan dan keteraturan. Architect merancang organisasi yang kokoh, Accumulator memastikan brankas cadangan kas selalu terisi.',
    protocol: 'Keduanya harus rajin memantau perkembangan luar agar tidak terlalu pasif atau ketinggalan zaman karena terlalu asyik di zona nyaman.'
  },
  'architect_architect': {
    type: 'Rawan Gesekan',
    tagline: 'Dua Perancang dalam Satu Meja',
    description: 'Sama-sama punya konsep dan cara berpikir ideal. Sering berdebat soal teori atau metode mana yang paling sempurna sampai lupa mulai kerja.',
    protocol: 'Bagi wilayah kerja secara tegas: satu mengurus alur kerja internal kantor, satu lagi mengurus konsep produk ke pasar luar.'
  },

  // === 2. CATALYST PAIRINGS ===
  'catalyst_evangelist': {
    type: 'Tinggi',
    tagline: 'Duo Paling Heboh & Penuh Semangat',
    description: 'Energi mereka meledak-ledak. Catalyst memulai langkah pertama dan mendobrak pintu, Evangelist menghebohkan publik dan mengumpulkan banyak pengikut.',
    protocol: 'Wajib ada orang tipe Mechanic di tim untuk mengurus berkas, bayar tagihan, dan membereskan pekerjaan rumah yang mereka tinggalkan.'
  },
  'catalyst_mechanic': {
    type: 'Tinggi',
    tagline: 'Paling Klop: Satu Nyari Kerja, Satu Beresin Kerja',
    description: 'Pasangan kerja paling ideal di dunia nyata. Catalyst membuka peluang dan bikin proyek baru, Mechanic menjaga kerjaan harian beres tanpa kacau balau.',
    protocol: 'Biarkan Catalyst fokus ke luar mencari klien atau peluang; serahkan urusan aturan kerja harian dan mutu kepada Mechanic sepenuhnya.'
  },
  'catalyst_allocator': {
    type: 'Netral Komplementer',
    tagline: 'Nafsu Buka Cabang vs Hitungan Balik Modal',
    description: 'Catalyst selalu datang bawa ide bisnis baru yang menggiurkan; Allocator yang menyaring dingin mana yang beneran menguntungkan dan mana yang cuma buang uang.',
    protocol: 'Catalyst wajib siapin jawaban: "Berapa kemungkinan terburuk ruginya?" sebelum minta persetujuan modal ke Allocator.'
  },
  'catalyst_arbitrageur': {
    type: 'Tinggi',
    tagline: 'Duo Gaspol & Paling Cepat Ambil Cuan',
    description: 'Dua orang paling lincah dan berani ambil risiko. Arbitrageur menemukan celah untung yang belum dilihat orang, Catalyst langsung tancap gas mengeksekusinya.',
    protocol: 'Tentukan batas waktu tuntas untuk setiap proyek agar energi kalian tidak buyar karena terlalu banyak coba hal baru bersamaan.'
  },
  'catalyst_specialist': {
    type: 'Netral Komplementer',
    tagline: 'Pencari Kerjaan & Tukang Masak Handal',
    description: 'Catalyst yang mencari proyek menantang dan meyakinkan klien; Specialist yang meracik karya teknisnya dengan mutu tingkat tinggi.',
    protocol: 'Catalyst jangan gampang janji "besok selesai ya" ke klien sebelum rembukan dulu sama Specialist berapa lama waktu pengerjaan aslinya.'
  },
  'catalyst_accumulator': {
    type: 'Rawan Gesekan',
    tagline: 'Satu Mau Gaspol, Satu Takut Nabrak',
    description: 'Sering bikin pusing satu sama lain. Catalyst merasa langkahnya ditahan-tahan, sementara Accumulator cemas uang tabungan bakal habis dipakai coba-coba.',
    protocol: 'Kuncinya bagi uang: 80% tabungan wajib dikunci aman oleh Accumulator, sisanya 20% silakan dipakai Catalyst buat uji coba peluang baru.'
  },
  'catalyst_catalyst': {
    type: 'Rawan Gesekan',
    tagline: 'Dua Nakhoda Berebut Setir',
    description: 'Sama-sama mau memimpin dan banyak ide. Proyek baru terus dibuka tiap minggu, tapi ujung-ujungnya nggak ada yang kelar sampai akhir.',
    protocol: 'Bagi wilayah terpisah: satu pegang urusan produk baru, satu urus kemitraan luar. Dan wajib ajak orang operasional biar ada yang nyelesaiin tugas.'
  },

  // === 3. EVANGELIST PAIRINGS ===
  'evangelist_mechanic': {
    type: 'Netral Komplementer',
    tagline: 'Janji Manis ke Pembeli & Kesiapan Dapur',
    description: 'Evangelist jago mendatangkan pembeli berbondong-bondong; Mechanic yang memastikan stok barang, pengiriman, dan layanan siap melayani mereka.',
    protocol: 'Evangelist wajib tanya kesiapan tim dapur ke Mechanic sebelum pasang promosi besar-besaran agar pelanggan tidak kecewa.'
  },
  'evangelist_allocator': {
    type: 'Netral Komplementer',
    tagline: 'Daya Pikat Iklan & Hitungan Untung Rugi',
    description: 'Evangelist bikin brand dikenal luas dan disukai orang; Allocator yang menghitung apakah uang yang keluar untuk promosi sebanding dengan keuntungan yang masuk.',
    protocol: 'Tentukan target angka penjualan yang jelas sebelum menggelontorkan uang untuk acara promosi atau iklan besar.'
  },
  'evangelist_arbitrageur': {
    type: 'Tinggi',
    tagline: 'Nemu Tren Cepat + Jago Bikin Viral',
    description: 'Arbitrageur paling cepat tahu tren barang apa yang lagi naik; Evangelist langsung meracik ceritanya agar viral dan diserbu pembeli sebelum trennya reda.',
    protocol: 'Bagi tugas jelas: Arbitrageur amankan barang dan stoknya, Evangelist yang jualan dan urus pembelinya.'
  },
  'evangelist_specialist': {
    type: 'Tinggi',
    tagline: 'Barang Hebat + Penjual Ulung',
    description: 'Specialist bikin produk yang luar biasa bagus dan canggih; Evangelist yang membungkusnya jadi cerita menarik sampai orang awam pun kepincut beli.',
    protocol: 'Specialist fokus bikin produk terbaik; Evangelist fokus jualan tanpa mengubah fakta keaslian produknya.'
  },
  'evangelist_accumulator': {
    type: 'Netral Komplementer',
    tagline: 'Pencari Relasi & Pengaman Uang Masuk',
    description: 'Evangelist gampang dapat kenalan dan uang dari mana-mana; Accumulator yang memastikan uangnya ditabung dan tidak habis buat foya-foya gaya hidup.',
    protocol: 'Beri kuasa ke Accumulator untuk mengamankan potongan pajak dan tabungan masa depan dari setiap komisi yang didapat Evangelist.'
  },
  'evangelist_evangelist': {
    type: 'Netral Komplementer',
    tagline: 'Dua Bintang dalam Satu Panggung',
    description: 'Sama-sama pintar bicara dan karismatik. Bisa menjangkau banyak orang, tapi rawan saling berebut lampu sorot kalau tidak diatur pembagian panggungnya.',
    protocol: 'Bagi wilayah bicara: misal satu pegang presentasi ke rekan bisnis/kantor, satu lagi pegang interaksi dengan komunitas atau media sosial.'
  },

  // === 4. MECHANIC PAIRINGS ===
  'mechanic_allocator': {
    type: 'Tinggi',
    tagline: 'Hemat Pengeluaran & Investasi Tepat Sasaran',
    description: 'Pasangan paling cermat soal urusan dapur. Mechanic memangkas pemborosan kerja harian; Allocator yang membelikan mesin atau alat yang paling menguntungkan.',
    protocol: 'Mechanic ajukan alat apa yang perlu diperbarui lengkap dengan hitungan berapa lama alat itu bisa balik modal bagi kas kantor.'
  },
  'mechanic_arbitrageur': {
    type: 'Rawan Gesekan',
    tagline: 'Satu Ikut Aturan, Satu Suka Terabas Jalur',
    description: 'Mechanic maunya kerja rapi sesuai aturan tertulis; Arbitrageur suka potong kompas demi kecepatan menangkap peluang cuan.',
    protocol: 'Sepakati rambu-rambu: jalan pintas apa saja yang boleh diambil Arbitrageur selama tidak melanggar hukum dan tidak bikin rusak barang.'
  },
  'mechanic_specialist': {
    type: 'Tinggi',
    tagline: 'Tempat Kerja Nyaman & Hasil Karya Presisi',
    description: 'Duet pekerja hening tapi hasilnya nyata. Specialist memecahkan persoalan rumit; Mechanic menyiapkan peralatan dan alur kerja yang bebas gangguan.',
    protocol: 'Mechanic jadi tameng pelindung agar Specialist tidak diganggu oleh urusan chat sepele pas lagi fokus ngerjain hal rumit.'
  },
  'mechanic_accumulator': {
    type: 'Tinggi',
    tagline: 'Benteng Paling Kokoh dan Anti Bangkrut',
    description: 'Perusahaan atau keluarga yang sangat aman. Mechanic merawat semua barang biar awet; Accumulator menjaga tabungan darurat selalu cukup.',
    protocol: 'Kalian berdua jangan terlalu tertutup; sesekali dengarkan ide orang luar agar tidak ketinggalan peluang baru yang menguntungkan.'
  },
  'mechanic_mechanic': {
    type: 'Tinggi',
    tagline: 'Semua Rapi, Minim Inovasi',
    description: 'Kerjaan dijamin sangat tertib, rapi, dan minim kesalahan. Tapi saking nyamannya dengan rutinitas, jarang ada ide baru yang lahir.',
    protocol: 'Tunjuk salah satu orang untuk rutin mencari tahu cara atau teknologi baru dari luar agar cara kerja kalian tidak ketinggalan zaman.'
  },

  // === 5. ALLOCATOR PAIRINGS ===
  'allocator_arbitrageur': {
    type: 'Tinggi',
    tagline: 'Pemodal Bijak & Pemburu Untung Cepat',
    description: 'Arbitrageur melihat peluang selisih harga di pasar; Allocator yang menilai kelayakannya dan mencairkan modal dengan hitungan risiko yang aman.',
    protocol: 'Tentukan batas maksimal uang yang boleh dimainkan dan batas rugi (cut-loss) sebelum Arbitrageur belanja peluang di pasar.'
  },
  'allocator_specialist': {
    type: 'Tinggi',
    tagline: 'Pendana Sabar & Ilmuwan Berbakat',
    description: 'Allocator paham nilai jangka panjang dari kepakaran unik Specialist, dan siap mendanai risetnya sampai jadi produk yang tidak ada tandingannya.',
    protocol: 'Bikin target tahapan yang jelas: kalau tahap A selesai dan terbukti, modal tahap B baru dicairkan.'
  },
  'allocator_accumulator': {
    type: 'Tinggi',
    tagline: 'Pengatur Investasi & Penjaga Brankas',
    description: 'Pasangan pengelola kekayaan terbaik. Allocator memutar modal di bisnis atau investasi yang tumbuh; Accumulator menjaga uang kas siap pakai di tempat aman.',
    protocol: 'Bagi rekening jelas: satu rekening tabungan darurat (dipegang Accumulator) dan satu rekening modal usaha (dikelola Allocator).'
  },
  'allocator_allocator': {
    type: 'Tinggi',
    tagline: 'Keputusan Dingin Berbasis Angka',
    description: 'Semua keputusan diambil murni pakai data dan kalkulator. Bebas baper dan bebas drama, tapi rawan kelamaan mikir detail desimalnya.',
    protocol: 'Pasang batas waktu kapan harus ambil keputusan, jangan sampai debat rumus kelamaan sampai peluangnya lewat.'
  },

  // === 6. ARBITRAGEUR PAIRINGS ===
  'arbitrageur_specialist': {
    type: 'Netral Komplementer',
    tagline: 'Paham Kebutuhan Pasar & Pembuat Solusi Unik',
    description: 'Arbitrageur tahu masalah apa yang lagi dicari pembeli; Specialist yang meracik solusi khususnya yang orang lain nggak bisa tiru.',
    protocol: 'Arbitrageur yang pasang badan tawar-menawar harga dengan klien; Specialist fokus bikin solusinya tanpa pusing urusan jualan.'
  },
  'arbitrageur_accumulator': {
    type: 'Rawan Gesekan',
    tagline: 'Suka Ambil Risiko vs Parno Kehilangan Uang',
    description: 'Sering berantem soal cara pakai uang. Arbitrageur merasa rekannya terlalu penakut; Accumulator memandang Arbitrageur seperti orang suka buang duit.',
    protocol: 'Bikin perjanjian tegas: batasi uang belanja peluang maksimal 15-20% dari total tabungan, sisanya mutlak disimpan aman oleh Accumulator.'
  },
  'arbitrageur_arbitrageur': {
    type: 'Rawan Gesekan',
    tagline: 'Dua Pemburu Berebut Buruan yang Sama',
    description: 'Sama-sama gesit dan maunya serba cepat. Rawan saling sikut atau curiga kalau lagi mengincar barang atau celah pasar yang serupa.',
    protocol: 'Bagi kavling atau wilayah dagang yang beda sejak awal agar tidak saling berebut pelanggan yang sama.'
  },

  // === 7. SPECIALIST PAIRINGS ===
  'specialist_accumulator': {
    type: 'Tinggi',
    tagline: 'Karya Mahal yang Diamankan Jadi Aset',
    description: 'Specialist menghasilkan karya langka yang bayarannya mahal; Accumulator yang memastikan uang hasil karya itu tidak habis tapi jadi aset abadi.',
    protocol: 'Biar Accumulator yang menagih pembayaran dan mengurus administrasi, biar Specialist bisa bebas fokus 100% pada karyanya.'
  },
  'specialist_specialist': {
    type: 'Netral Komplementer',
    tagline: 'Dua Jagoan di Bidang Masing-Masing',
    description: 'Saling menghormati keahlian rekan. Pembahasan kerja sangat mendalam dan bermutu tinggi, asalkan tidak saling mengajari keahlian rekannya.',
    protocol: 'Sepakati batas keahlian masing-masing: jangan mencampuri cara kerja teknis rekan kerja kalau itu bukan bidang utama Anda.'
  },

  // === 8. ACCUMULATOR PAIRINGS ===
  'accumulator_accumulator': {
    type: 'Tinggi',
    tagline: 'Paling Aman di Dunia, Tapi Susah Kaya Cepat',
    description: 'Tingkat keamanan uang 100% terjamin dan risiko bangkrut hampir nol. Masalahnya cuma satu: terlalu takut coba hal baru sehingga uang tidak berkembang.',
    protocol: 'Wajib sisihkan sedikit uang (5–10%) untuk dicoba ke instrumen usaha atau investasi baru agar tidak kalah oleh inflasi.'
  }
};
