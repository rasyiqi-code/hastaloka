import type { Question, ArchetypeProfile, LifeDomain, SynergyProtocol } from '../types/hastaloka';

export const HASTALOKA_QUESTIONS: Question[] = [
  // Bagian A: Vektor Drive (D1 - D5)
  {
    id: 'D1',
    vector: 'drive',
    categoryTitle: 'Vektor Drive (Dorongan Aksi)',
    text: 'Saya lebih suka langsung memulai proyek baru daripada menunggu semua rencana sempurna.'
  },
  {
    id: 'D2',
    vector: 'drive',
    categoryTitle: 'Vektor Drive (Dorongan Aksi)',
    text: 'Saya merasa terdorong oleh target-target ambisius yang menuntut pencapaian nyata.'
  },
  {
    id: 'D3',
    vector: 'drive',
    categoryTitle: 'Vektor Drive (Dorongan Aksi)',
    text: 'Penolakan atau kegagalan awal tidak menghentikan langkah saya untuk mencoba kembali.'
  },
  {
    id: 'D4',
    vector: 'drive',
    categoryTitle: 'Vektor Drive (Dorongan Aksi)',
    text: 'Saya berani mengambil risiko yang diperhitungkan demi mencapai hasil yang signifikan.'
  },
  {
    id: 'D5',
    vector: 'drive',
    categoryTitle: 'Vektor Drive (Dorongan Aksi)',
    text: 'Saya memiliki dorongan bawaan untuk memimpin dan menggerakkan orang lain ketika situasi macet.'
  },

  // Bagian B: Vektor Adaptabilitas (A1 - A5)
  {
    id: 'A1',
    vector: 'adaptability',
    categoryTitle: 'Vektor Adaptabilitas (Kelenturan Emosional)',
    text: 'Saya merasa nyaman ketika rencana mendadak berubah di tengah jalan.'
  },
  {
    id: 'A2',
    vector: 'adaptability',
    categoryTitle: 'Vektor Adaptabilitas (Kelenturan Emosional)',
    text: 'Saya mudah memahami sudut pandang dan suasana hati orang lain tanpa harus dijelaskan panjang lebar.'
  },
  {
    id: 'A3',
    vector: 'adaptability',
    categoryTitle: 'Vektor Adaptabilitas (Kelenturan Emosional)',
    text: 'Saya mampu tetap tenang dan fleksibel saat menghadapi situasi yang penuh ketidakpastian.'
  },
  {
    id: 'A4',
    vector: 'adaptability',
    categoryTitle: 'Vektor Adaptabilitas (Kelenturan Emosional)',
    text: 'Saya cepat mempelajari cara kerja baru jika metode lama terbukti tidak relevan.'
  },
  {
    id: 'A5',
    vector: 'adaptability',
    categoryTitle: 'Vektor Adaptabilitas (Kelenturan Emosional)',
    text: 'Saya lebih mengutamakan solusi yang menyatukan daripada mempertahankan gengsi pendapat pribadi.'
  },

  // Bagian C: Vektor Stabilitas (S1 - S5)
  {
    id: 'S1',
    vector: 'stability',
    categoryTitle: 'Vektor Stabilitas (Regulasi Operasional)',
    text: 'Saya selalu menyelesaikan tugas hingga tuntas meskipun terasa monoton dan repetitif.'
  },
  {
    id: 'S2',
    vector: 'stability',
    categoryTitle: 'Vektor Stabilitas (Regulasi Operasional)',
    text: 'Jadwal, daftar periksa (checklist), dan keteraturan membuat hidup saya jauh lebih tenang dan produktif.'
  },
  {
    id: 'S3',
    vector: 'stability',
    categoryTitle: 'Vektor Stabilitas (Regulasi Operasional)',
    text: 'Saya sangat teliti dalam memperhatikan detail kecil yang sering diabaikan orang lain.'
  },
  {
    id: 'S4',
    vector: 'stability',
    categoryTitle: 'Vektor Stabilitas (Regulasi Operasional)',
    text: 'Saya jarang sekali terlambat memenuhi tenggat waktu atau janji yang sudah disepakati.'
  },
  {
    id: 'S5',
    vector: 'stability',
    categoryTitle: 'Vektor Stabilitas (Regulasi Operasional)',
    text: 'Saya secara konsisten mematuhi protokol dan prosedur yang sudah terbukti aman.'
  },

  // Bagian D: Vektor Sintesis (N1 - N5)
  {
    id: 'N1',
    vector: 'synthesis',
    categoryTitle: 'Vektor Sintesis (Kapasitas Abstraksi)',
    text: 'Saya sering melihat hubungan tersembunyi antara dua bidang ilmu yang tampak tidak berkaitan.'
  },
  {
    id: 'N2',
    vector: 'synthesis',
    categoryTitle: 'Vektor Sintesis (Kapasitas Abstraksi)',
    text: 'Saya lebih tertarik memahami prinsip-prinsip mendasar dan visi jangka panjang daripada masalah teknis harian.'
  },
  {
    id: 'N3',
    vector: 'synthesis',
    categoryTitle: 'Vektor Sintesis (Kapasitas Abstraksi)',
    text: 'Saya menikmati proses memecahkan teka-teki logika atau masalah sistemik yang rumit.'
  },
  {
    id: 'N4',
    vector: 'synthesis',
    categoryTitle: 'Vektor Sintesis (Kapasitas Abstraksi)',
    text: 'Saya kerap memikirkan arah tren 5 hingga 10 tahun ke depan dan bagaimana dampaknya bagi masyarakat.'
  },
  {
    id: 'N5',
    vector: 'synthesis',
    categoryTitle: 'Vektor Sintesis (Kapasitas Abstraksi)',
    text: 'Saya mampu menyederhanakan gagasan yang sangat rumit menjadi kerangka pemikiran yang mudah dipahami.'
  },

  // Bagian E: Vektor Konektivitas (K1 - K5)
  {
    id: 'K1',
    vector: 'connectivity',
    categoryTitle: 'Vektor Konektivitas (Modal Sosial & Kepercayaan)',
    text: 'Orang-orang merasa aman menceritakan masalah pribadi atau rahasia mereka kepada saya.'
  },
  {
    id: 'K2',
    vector: 'connectivity',
    categoryTitle: 'Vektor Konektivitas (Modal Sosial & Kepercayaan)',
    text: 'Saya mudah memulai percakapan hangat dengan orang yang baru pertama kali saya temui.'
  },
  {
    id: 'K3',
    vector: 'connectivity',
    categoryTitle: 'Vektor Konektivitas (Modal Sosial & Kepercayaan)',
    text: 'Saya secara berkala merawat hubungan baik dengan jejaring teman, kolega, dan mitra lama.'
  },
  {
    id: 'K4',
    vector: 'connectivity',
    categoryTitle: 'Vektor Konektivitas (Modal Sosial & Kepercayaan)',
    text: 'Saya terampil menyusun kata-kata persuasif yang membuat orang lain terinspirasi dan percaya.'
  },
  {
    id: 'K5',
    vector: 'connectivity',
    categoryTitle: 'Vektor Konektivitas (Modal Sosial & Kepercayaan)',
    text: 'Saya percaya bahwa kolaborasi tulus selalu menghasilkan dampak yang jauh lebih besar daripada bekerja sendirian.'
  }
];

export const HASTALOKA_ARCHETYPES: ArchetypeProfile[] = [
  {
    id: 'architect',
    name: 'Architect',
    indonesianName: 'Pembuat Sistem',
    role: 'Membangun struktur kerja, tata kelola, dan cetak biru bisnis yang dapat diskalakan.',
    vectorDominance: 'Sintesis (95) & Stabilitas (85)',
    description: 'Arsitek sistem yang menyukai struktur teratur, pemodelan jangka panjang, arsitektur data, dan tata kelola berulang.',
    idealVector: {
      drive: 50,
      adaptability: 60,
      stability: 85,
      synthesis: 95,
      connectivity: 50
    },
    strengths: [
      'Pemikiran konseptual dan pemetaan sistemik kelas dunia',
      'Mampu merancang SOP dan cetak biru yang rapi dan skalabel',
      'Objektif, berbasis logika, dan tahan uji jangka panjang'
    ],
    blindSpots: [
      'Bisa terjebak analysis paralysis (terlalu lama menyempurnakan rancangan)',
      'Toleransi rendah terhadap ketidakpastian dan orang yang tidak teratur'
    ],
    careerStrategy: 'Fokus pada peran arsitektur sistem, CTO, perancang proses bisnis, konsultan manajemen, atau pendiri berbasis infrastruktur.',
    wealthStrategy: 'Membangun aset dengan sistem otomatis, royalti kekayaan intelektual, dan platform yang menghasilkan pendapatan berulang.',
    circadianGuidance: 'Alokasikan deep work di blok waktu tanpa gangguan (pagi/malam tergantung kronotipe) untuk perancangan kompleks.',
    color: '#6366f1' // Indigo
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    indonesianName: 'Penggerak Momentum',
    role: 'Menyalakan inisiatif proyek baru, mendobrak kemandekan, dan mendorong eksekusi cepat.',
    vectorDominance: 'Drive (95) & Adaptabilitas (85)',
    description: 'Energi kinetik murni yang mendobrak inersia, membuka babak baru, dan berani mengambil risiko pelopor.',
    idealVector: {
      drive: 95,
      adaptability: 85,
      stability: 45,
      synthesis: 65,
      connectivity: 70
    },
    strengths: [
      'Inisiator alami dengan kecepatan eksekusi tinggi',
      'Tahan terhadap penolakan awal dan sangat berani mengambil risiko',
      'Sangat lincah berputar (pivot) di tengah perubahan'
    ],
    blindSpots: [
      'Sangat mudah bosan dengan administrasi, pelaporan rutin, dan pemeliharaan harian',
      'Cenderung memulai terlalu banyak proyek tanpa menyelesaikannya hingga tuntas'
    ],
    careerStrategy: 'Wajib dipasangkan dengan tipe Mechanic/Specialist. Sangat cocok sebagai Head of Growth, Entrepreneur, Inisiator Produk Baru, atau Turnaround Specialist.',
    wealthStrategy: 'Penciptaan modal dari peluang fase awal, spin-off proyek, dan memperbesar probabilitas sukses lewat frekuensi percobaan (n membesar).',
    circadianGuidance: 'Manfaatkan jendela energi puncak untuk pitching, negosiasi, dan kick-off. Delegasikan tugas pemeliharaan di jam energi rendah.',
    color: '#f97316' // Orange
  },
  {
    id: 'evangelist',
    name: 'Evangelist',
    indonesianName: 'Pembentuk Narasi',
    role: 'Mengomunikasikan visi, membangun merek, memikat pelanggan, dan menggalang dukungan publik.',
    vectorDominance: 'Konektivitas (95) & Drive (80)',
    description: 'Pencerita ulung yang memikat massa, membangun rasa percaya instan, dan mengonversi ide menjadi gerakan bersama.',
    idealVector: {
      drive: 80,
      adaptability: 75,
      stability: 50,
      synthesis: 60,
      connectivity: 95
    },
    strengths: [
      'Daya persuasi dan kecerdasan naratif di atas rata-rata',
      'Magnet sosial yang cepat membangun jejaring aliansi strategis',
      'Mampu menghidupkan visi kering menjadi inspirasi yang menggerakkan orang'
    ],
    blindSpots: [
      'Rawan menjanjikan hal yang melampaui kemampuan kapasitas teknis operasional',
      'Rentan terhadap sindrom people-pleasing dan kelelahan sosial'
    ],
    careerStrategy: 'CMO, VP of Public Relations, Chief Storyteller, Keynote Speaker, Penggalang Dana, atau Pemimpin Brand.',
    wealthStrategy: 'Monetisasi pengaruh, kemitraan strategis, distribusi penawaran berskala luas, dan komisi nilai transaksi tinggi.',
    circadianGuidance: 'Lindungi jeda istirahat kognitif sebelum tampil di hadapan publik agar ketajaman karisma emosional tetap prima.',
    color: '#ec4899' // Pink
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    indonesianName: 'Pengoptimal Operasi',
    role: 'Memperbaiki celah inefisiensi, memangkas biaya pemborosan, dan menjaga kelancaran alur harian.',
    vectorDominance: 'Stabilitas (90) & Adaptabilitas (75)',
    description: 'Insinyur proses yang memastikan mesin organisasi bekerja mulus tanpa gesekan, hemat biaya, dan tahan benturan.',
    idealVector: {
      drive: 55,
      adaptability: 75,
      stability: 90,
      synthesis: 60,
      connectivity: 50
    },
    strengths: [
      'Sangat teliti mendeteksi kebocoran operasional dan inefisiensi',
      'Daya tahan kerja repetitif tinggi dengan disiplin mutu konsisten',
      'Penyelesai masalah taktis di lapangan dengan akal sehat'
    ],
    blindSpots: [
      'Bisa terlalu skeptis terhadap ide-ide baru yang belum terbukti secara matematis',
      'Cenderung lambat dalam memutuskan ekspansi yang menuntut spekulasi agresif'
    ],
    careerStrategy: 'COO, Head of Operations, Manajer Mutu (QA), Supply Chain Director, atau Pengawas Alur Logistik.',
    wealthStrategy: 'Penghematan biaya marjinal, arbitrase efisiensi, dan pengelolaan portofolio instrumen berbunga tetap yang aman.',
    circadianGuidance: 'Gunakan jam pagi atau jadwal tetap untuk audit checklist harian dan pengawasan mutu alur kerja.',
    color: '#06b6d4' // Cyan
  },
  {
    id: 'allocator',
    name: 'Allocator',
    indonesianName: 'Pengelola Modal',
    role: 'Mendistribusikan modal uang, waktu, dan tenaga kerja ke aset dengan rasio imbal-hasil terbaik.',
    vectorDominance: 'Stabilitas (90) & Sintesis (90)',
    description: 'Ahli matematika alokasi sumber daya yang melihat dunia sebagai portofolio imbal hasil dan manajemen risiko terukur.',
    idealVector: {
      drive: 65,
      adaptability: 60,
      stability: 90,
      synthesis: 90,
      connectivity: 55
    },
    strengths: [
      'Kalkulasi risiko-keuntungan yang sangat disiplin dan dingin',
      'Objektivitas tinggi tanpa terpengaruh euforia sesaat',
      'Mampu memetakan alokasi aset jangka panjang hingga berlipat ganda'
    ],
    blindSpots: [
      'Bisa terkesan tidak berempati terhadap aspek emosional tim',
      'Enggan berkomitmen jika data historis belum memadai'
    ],
    careerStrategy: 'Chief Investment Officer (CIO), CFO, Pengelola Hedge Fund, Venture Capitalist, atau Perencana Portofolio Korporat.',
    wealthStrategy: 'Compounding modal bunga majemuk, investasi nilai (value investing), dan akuisisi aset undervalued dengan margin of safety lebar.',
    circadianGuidance: 'Lakukan analisis numerik di jam puncak kejernihan mental, hindari keputusan trading saat kadar stres (St) tinggi.',
    color: '#10b981' // Emerald Green
  },
  {
    id: 'arbitrageur',
    name: 'Arbitrageur',
    indonesianName: 'Pemburu Peluang',
    role: 'Menemukan asimetri informasi dan celah pasar yang terlewatkan orang lain, lalu mengeksekusinya.',
    vectorDominance: 'Adaptabilitas (95) & Drive (90)',
    description: 'Radar pasar paling tajam yang mengeksploitasi perbedaan harga, tren baru, dan celah inefisiensi untuk keuntungan instan.',
    idealVector: {
      drive: 90,
      adaptability: 95,
      stability: 45,
      synthesis: 75,
      connectivity: 60
    },
    strengths: [
      'Kemampuan membaca asimetri informasi jauh sebelum disadari publik',
      'Respons manuver secepat kilat dengan fleksibilitas tanpa beban',
      'Naluri komersial alami yang lihai memanfaatkan peluang sempit'
    ],
    blindSpots: [
      'Toleransi risiko seringkali terlalu tinggi hingga mendekati spekulasi murni',
      'Enggan membangun infrastruktur permanen, selalu tergoda melompat ke tren berikutnya'
    ],
    careerStrategy: 'Trader pasar keuangan, Makelar Properti & Komoditas, Pemburu Celah E-commerce, Penegosiasi Lisensi Pasar.',
    wealthStrategy: 'Memanfaatkan ketimpangan pasar, eksekusi kecepatan tinggi, dan segera mengunci keuntungan sebelum celah tertutup.',
    circadianGuidance: 'Waspadai kelelahan saraf akibat memantau dinamika volatilitas terus-menerus; pasang cut-loss waktu tidur ketat.',
    color: '#eab308' // Yellow
  },
  {
    id: 'specialist',
    name: 'Specialist',
    indonesianName: 'Pemilik Keahlian',
    role: 'Menguasai keterampilan teknis tingkat tinggi yang memiliki hambatan masuk (moat) tinggi.',
    vectorDominance: 'Stabilitas (90) & Sintesis Fokus (85)',
    description: 'Ahli ilmu mendalam yang membangun benteng pertahanan karier melalui keahlian langka yang tak mudah digantikan kecerdasan buatan sekalipun.',
    idealVector: {
      drive: 50,
      adaptability: 45,
      stability: 90,
      synthesis: 85,
      connectivity: 40
    },
    strengths: [
      'Presisi teknis mutlak dan kedalaman pengetahuan tanpa tanding',
      'Kemampuan fokus mendalam (deep work) selama berjam-jam tanpa terdistraksi',
      'Menjadi rujukan otoritas tertinggi dalam bidang kepakaran khusus'
    ],
    blindSpots: [
      'Sering kesulitan menyederhanakan bahasa teknis kepada orang awam atau klien',
      'Resisten terhadap kompromi bisnis yang dianggap merusak idealisme kualitas'
    ],
    careerStrategy: 'Spesialis Medis, Insinyur Perangkat Lunak Inti / AI Researcher, Konsultan Hukum Korporat Spesifik, Ilmuwan Laboratorium.',
    wealthStrategy: 'Menetapkan tarif premium berbasis nilai (value pricing) atas keahlian langka, konsultasi eksklusif, dan kepemilikan paten.',
    circadianGuidance: 'Ciptakan ruang isolasi kerja akustik bebas interupsi di jam ritme sirkadian terbaik untuk menghasilkan karya rumit.',
    color: '#8b5cf6' // Violet
  },
  {
    id: 'accumulator',
    name: 'Accumulator',
    indonesianName: 'Penjaga Ketahanan',
    role: 'Menjaga cadangan likuiditas, manajemen risiko ketat, dan melindungi sistem agar tidak bangkrut saat krisis.',
    vectorDominance: 'Stabilitas (95) & Konservasi (65)',
    description: 'Benteng pertahanan terakhir yang memastikan organisasi dan keluarga selamat melewati musim kemarau dan badai ekonomi terburuk.',
    idealVector: {
      drive: 40,
      adaptability: 45,
      stability: 95,
      synthesis: 65,
      connectivity: 55
    },
    strengths: [
      'Disiplin penghematan dan proteksi cadangan likuiditas yang tak tertandingi',
      'Mendeteksi bahaya kebangkrutan jauh sebelum radar orang lain berbunyi',
      'Sangat setia, dapat diandalkan, dan tahan banting dalam krisis panjang'
    ],
    blindSpots: [
      'Terkadang terlalu lambat mengambil peluang emas karena ketakutan berlebihan akan kerugian',
      'Bisa berselisih dengan pasangan atau rekan tim yang bertipe pendorong risiko (Catalyst/Arbitrageur)'
    ],
    careerStrategy: 'Chief Risk Officer (CRO), Auditor Forensik, Kepala Kepatuhan Regulasi (Compliance), Penjaga Cadangan Kas.',
    wealthStrategy: 'Menjaga dana darurat 6-12 bulan, kepemilikan aset riil bernilai intrinsik (tanah, emas, kas likuid), dan proteksi asuransi komprehensif.',
    circadianGuidance: 'Rutinitas tidur dan jam kerja yang teratur adalah kunci utama stabilitas saraf; hindari jadwal kerja yang acak-acakan.',
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
  'catalyst_mechanic': {
    type: 'Tinggi',
    tagline: 'Sinergi Inisiator & Pelaksana Mutu',
    description: 'Pasangan kerja paling ideal di dunia bisnis. Catalyst menyalakan momentum dan membuka pintu peluang baru, Mechanic menata alur harian agar tidak runtuh berantakan.',
    protocol: 'Catalyst memimpin pembukaan peluang awal dan negosiasi pasar; Mechanic memegang kendali penuh atas SOP, alur kerja harian, dan standarisasi mutu eksekusi.'
  },
  'architect_allocator': {
    type: 'Tinggi',
    tagline: 'Duet Strategis & Arsitektur Nilai',
    description: 'Kombinasi papan atas. Architect menyusun cetak biru sistematis jangka panjang, Allocator menguji kelayakan ekonomi dan mengucurkan modal tepat sasaran.',
    protocol: 'Architect menyusun rancangan sistem dan estimasi kapasitas; Allocator menentukan parameter alokasi dana, metrik efisiensi biaya, dan jadwal audit per kuartal.'
  },
  'evangelist_specialist': {
    type: 'Tinggi',
    tagline: 'Sinergi Produk Hebat & Pemasaran Memikat',
    description: 'Specialist membangun karya teknis berbobot tinggi, Evangelist merangkai narasi emosional memikat yang membuat dunia berebut membelinya.',
    protocol: 'Specialist berfokus pada riset mendalam dan kesempurnaan produk; Evangelist mengemasnya menjadi cerita dan materi publikasi bernilai jual tinggi tanpa mendistorsi fakta teknis.'
  },
  'allocator_arbitrageur': {
    type: 'Tinggi',
    tagline: 'Sinergi Modal Strategis & Kecepatan Menangkap Celah',
    description: 'Arbitrageur mendeteksi ketimpangan harga dan peluang taktis di pasar; Allocator menyaring kelayakan dan mengucurkan likuiditas dengan disiplin portofolio.',
    protocol: 'Tetapkan batas toleransi risiko (stop-loss) eksplisit dan plafon modal per transaksi sebelum Arbitrageur mengeksekusi peluang di pasar.'
  },
  'specialist_accumulator': {
    type: 'Tinggi',
    tagline: 'Sinergi Keahlian Inti & Pengamanan Nilai Jangka Panjang',
    description: 'Specialist menghasilkan karya bernilai tinggi yang langka; Accumulator memastikan setiap pendapatan dari karya tersebut dikunci menjadi aset produktif dan cadangan kas yang kokoh.',
    protocol: 'Accumulator mengelola arus kas dan penagihan bisnis secara disiplin, membebaskan Specialist dari urusan administrasi keuangan agar fokus 100% pada riset & keahlian teknis.'
  },
  'architect_evangelist': {
    type: 'Tinggi',
    tagline: 'Sinergi Fondasi Sistem & Magnet Publik',
    description: 'Architect membangun mesin produk dan fondasi logika yang kokoh; Evangelist mengomunikasikan visi dan membangun reputasi agar dipercaya publik luas.',
    protocol: 'Rancang sesi sinkronisasi mingguan: Evangelist menyampaikan aspirasi pasar terkini, Architect menyesuaikan prioritas pengembangan fitur tanpa merusak stabilitas sistem.'
  },
  'arbitrageur_accumulator': {
    type: 'Rawan Gesekan',
    tagline: 'Dilema Cuan Cepat vs Benteng Proteksi',
    description: 'Sering terjadi gesekan psikologis terkait selera risiko. Arbitrageur menganggap Accumulator terlalu kaku dan lambat; Accumulator memandang Arbitrageur sembrono.',
    protocol: 'Buat kesepakatan tertulis: Batasi alokasi dana spekulasi peluang maksimal 15-25% dari total portofolio, sisanya wajib dikunci di rekening tabungan aman yang dikelola Accumulator.'
  },
  'catalyst_catalyst': {
    type: 'Rawan Gesekan',
    tagline: 'Dua Kapten Satu Kemudi',
    description: 'Berisiko saling berebut arah inisiatif. Sangat banyak ide proyek baru dinyalakan, namun tidak ada yang diselesaikan hingga tuntas.',
    protocol: 'Bagi wilayah kewenangan dengan batas tegas: satu memegang kendali produk/inisiatif A, satu memegang ekspansi pasar/inisiatif B. Wajib rekrut seorang Mechanic untuk operasional.'
  },
  'specialist_evangelist': {
    type: 'Rawan Gesekan',
    tagline: 'Kekakuan Teknis vs Dramatisasi Narasi',
    description: 'Potensi salah paham komunikasi. Specialist menuntut keakuratan fakta tanpa kompromi, Evangelist suka mempercantik narasi demi memikat audiens.',
    protocol: 'Setiap materi rilis publik wajib diverifikasi oleh Specialist sebelum disebarkan untuk mencegah misinformasi.'
  }
};
