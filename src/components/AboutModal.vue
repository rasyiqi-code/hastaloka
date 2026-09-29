<script setup lang="ts">
import { ref } from 'vue';
import {
  Compass,
  X,
  BookOpen,
  Layers,
  Cpu,
  ShieldCheck,
  Brain,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Code2
} from '@lucide/vue';

defineEmits<{
  (e: 'close'): void;
}>();

const activeSection = ref<'filosofi' | 'arsitektur' | 'arketipe' | 'sistem' | 'developer'>('filosofi');

const sixLayers = [
  {
    level: 'Layer 1',
    name: 'Environmental & Chronobiology Field',
    desc: 'Memetakan data objektif temporal (musim, fotoperiode lintang khatulistiwa/temperate, ritme biologis sirkadian).',
    badge: 'Input Ekologis'
  },
  {
    level: 'Layer 2',
    name: 'Human State Vector (Ht)',
    desc: 'Mengukur keadaan dinamis harian: kualitas tidur (Ct), fase sirkadian (Kt), dan beban stresor (St) untuk menghasilkan Kesiapan Energi (Rt).',
    badge: 'Vektor Status'
  },
  {
    level: 'Layer 3',
    name: 'Hastaloka 5 Vectors (H5V)',
    desc: 'Pemetaan 5 dimensi neuro-perilaku: Output Vitalitas (O), Dinamika Strategis (D), Stabilitas Emosional (S), Kecepatan Kognitif (K), dan Afinitas Relasional (A).',
    badge: 'Dimensi Inti'
  },
  {
    level: 'Layer 4',
    name: 'Archetype Matching Engine',
    desc: 'Menghitung profil korelasi Pearson (Centered Cosine) terhadap 8 matriks arketipe kepemimpinan dan adaptasi ekologis.',
    badge: 'Matematis & Vektor'
  },
  {
    level: 'Layer 5',
    name: 'Life Domain Engine',
    desc: 'Simulasi proyeksi ke 4 domain kehidupan nyata: Karir & Kepemimpinan, Dinamika Tim & Relasi, Manajemen Finansial, dan Vitalitas & Energi.',
    badge: 'Domain Praktis'
  },
  {
    level: 'Layer 6',
    name: 'Strategic AI Diagnostic Engine',
    desc: 'Sintesis konteks mendalam oleh AI Copilot multi-provider untuk simulasi dilema strategis dan rekomendasi keputusan.',
    badge: 'Kognitif AI'
  }
];

const threeAxioms = [
  {
    title: '1. Realitas Ekologis, Bukan Astrologis',
    desc: 'Karakter manusia dibentuk oleh adaptasi biologi, evolusi, ritme fotoperiode matahari bumi, dan neurobiologi — bukan oleh pengaruh gravitasi atau mistisisme konstelasi bintang.'
  },
  {
    title: '2. Probabilitas, Bukan Determinisme',
    desc: 'Pola biologis memberikan kecenderungan bawaan dan spektrum toleransi energi, bukan takdir kaku yang tak dapat diubah. Manusia memiliki agensi untuk berkembang.'
  },
  {
    title: '3. Kedaulatan Agensi Manusia',
    desc: 'Melalui kesadaran metakognitif dan neuroplastisitas, manusia mampu melatih strategi dan meregulasi kelemahannya untuk mencapai performa puncak.'
  }
];
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
    <div
      class="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl border-0 sm:border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden"
    >
      <!-- Modal Header -->
      <div class="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <Compass class="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-black text-slate-900 tracking-tight">Tentang HASTALOKA</h2>
              <span class="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
                Enterprise v2.0
              </span>
            </div>
            <p class="text-xs text-slate-500">
              Sains Pemetaan Potensi, Karier & Navigasi Keputusan Berbasis Sistemik
            </p>
          </div>
        </div>

        <button
          @click="$emit('close')"
          class="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          title="Tutup"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex items-center border-b border-slate-200 bg-white px-3 shrink-0 overflow-x-auto text-xs font-semibold">
        <button
          @click="activeSection = 'filosofi'"
          class="px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          :class="activeSection === 'filosofi' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <BookOpen class="w-4 h-4" />
          <span>Filosofi & Epistemologi</span>
        </button>

        <button
          @click="activeSection = 'arsitektur'"
          class="px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          :class="activeSection === 'arsitektur' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Layers class="w-4 h-4" />
          <span>Arsitektur 6-Layer</span>
        </button>

        <button
          @click="activeSection = 'arketipe'"
          class="px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          :class="activeSection === 'arketipe' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Brain class="w-4 h-4" />
          <span>Arketipe & Sains H5V</span>
        </button>

        <button
          @click="activeSection = 'sistem'"
          class="px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          :class="activeSection === 'sistem' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Cpu class="w-4 h-4" />
          <span>Sistem & Privasi</span>
        </button>

        <button
          @click="activeSection = 'developer'"
          class="px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          :class="activeSection === 'developer' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Code2 class="w-4 h-4" />
          <span>Tentang Developer</span>
        </button>
      </div>

      <!-- Tab Content Area -->
      <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-slate-700">
        <!-- 1. TAB: FILOSOFI & EPISTEMOLOGI -->
        <div v-if="activeSection === 'filosofi'" class="space-y-6">
          <!-- Hero Explanation -->
          <div class="p-4 rounded-xl bg-gradient-to-r from-indigo-50/80 via-slate-50 to-indigo-50/50 border border-indigo-100/80">
            <h3 class="text-sm font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-indigo-600" />
              Etimologi: Hasta & Loka
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed">
              Nama <strong>Hastaloka</strong> berakar dari dua konsep filosofis kuno yang direvitalisasi dengan kaidah epistemologi modern:
              <strong class="text-indigo-700"> Hasta</strong> (Sanskerta: Tangan) melambangkan instrumen tindakan, daya cipta sadar, dan agensi proaktif manusia;
              sedangkan <strong class="text-indigo-700">Loka</strong> (Sanskerta: Ranah atau Tempat) merujuk pada multidimensi ruang hidup dan ekosistem tempat potensi diejawantahkan.
            </p>
          </div>

          <!-- 3 Aksioma Rasional -->
          <div>
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              3 Aksioma Rasional (Menggantikan Mistisisme & Astrologi)
            </h4>
            <div class="grid grid-cols-1 gap-3">
              <div
                v-for="axiom in threeAxioms"
                :key="axiom.title"
                class="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 text-left space-y-1"
              >
                <div class="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{{ axiom.title }}</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed pl-6">
                  {{ axiom.desc }}
                </p>
              </div>
            </div>
          </div>

          <!-- Metodologi -->
          <div class="border-t border-slate-200 pt-4">
            <h4 class="text-xs font-bold text-slate-900 mb-2">Metodologi Ilmiah & Anti-Barnum Effect</h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Berbeda dari tes kepribadian generik (MBTI/Horoskop) yang rentan terhadap <em>Barnum Effect</em> (pernyataan samar yang seolah cocok untuk semua orang), Hastaloka menggunakan <strong>vektor numerik 5 dimensi riil (H5V)</strong> yang dihitung secara matematis menggunakan <strong>Centered Cosine Similarity (Pearson Correlation Profile)</strong>, membedakan secara tegas keunggulan komparatif spesifik antar individu.
            </p>
          </div>
        </div>

        <!-- 2. TAB: ARSITEKTUR 6-LAYER -->
        <div v-else-if="activeSection === 'arsitektur'" class="space-y-5">
          <div class="space-y-1">
            <h3 class="text-sm font-bold text-slate-900">Arsitektur Modular 6 Lapisan Hastaloka</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Pipeline analitik komputasional dari data ritme biologis mentah hingga pengambilan keputusan strategis.
            </p>
          </div>

          <div class="space-y-3">
            <div
              v-for="layer in sixLayers"
              :key="layer.level"
              class="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {{ layer.level }}
                  </span>
                  <span class="text-xs font-bold text-slate-900">{{ layer.name }}</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed">
                  {{ layer.desc }}
                </p>
              </div>

              <span class="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 self-start sm:self-center">
                {{ layer.badge }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. TAB: ARKETIPE & H5V -->
        <div v-else-if="activeSection === 'arketipe'" class="space-y-5">
          <!-- H5V Vector -->
          <div class="space-y-2">
            <h3 class="text-sm font-bold text-slate-900">5 Vektor Neuro-Perilaku (H5V)</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-bold text-indigo-600">Output Vitalitas (O)</span>: Kapasitas stamina fisik, daya dorong eksekusi langsung, dan ketahanan terhadap kelelahan kerja.
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-bold text-indigo-600">Dinamika Strategis (D)</span>: Ketajaman berpikir jangka panjang, perencanaan taktis, dan pemecahan masalah kompleks.
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-bold text-indigo-600">Stabilitas Emosional (S)</span>: Regulasi stres neuro-afektif, ketenangan di bawah tekanan krisis, dan konsistensi suasana hati.
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span class="font-bold text-indigo-600">Kecepatan Kognitif (K)</span>: Agilitas pemrosesan informasi baru, kemampuan pivoting cepat, dan adaptasi perubahan mendadak.
              </div>
              <div class="p-3 rounded-xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <span class="font-bold text-indigo-600">Afinitas Relasional (A)</span>: Kecerdasan sosial empatik, kemampuan persuasi kolaboratif, dan pembentukan kohesi tim.
              </div>
            </div>
          </div>

          <!-- Formula Matematika -->
          <div class="p-4 rounded-xl bg-slate-900 text-slate-100 space-y-2">
            <div class="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">
              Formula Kesiapan Dinamis Harian (Rt)
            </div>
            <div class="font-mono text-xs text-amber-300 bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
              Rt = 0.45 · Ct + 0.35 · Kt - 0.20 · St
            </div>
            <p class="text-[11px] text-slate-300 leading-relaxed">
              Di mana <em>Ct</em> adalah Kualitas Tidur (Circadian Recovery), <em>Kt</em> adalah Alinyemen Jam Emas Kronotipe (Chronotype Golden Hour), dan <em>St</em> adalah Beban Stresor (Stress Dampener).
            </p>
          </div>
        </div>

        <!-- 4. TAB: SISTEM & PRIVASI -->
        <div v-else-if="activeSection === 'sistem'" class="space-y-5">
          <div class="space-y-3">
            <h3 class="text-sm font-bold text-slate-900">Arsitektur Keamanan & Privasi Data</h3>
            
            <div class="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 space-y-2">
              <div class="font-bold flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600" />
                <span>Local-First & Kedaulatan Privasi Penuh</span>
              </div>
              <p class="leading-relaxed text-emerald-800">
                Seluruh hasil asesmen neuro-perilaku, profil H5V, riwayat komputasi, dan API Keys Anda disimpan <strong>hanya di penyimpanan lokal peramban (browser LocalStorage) perangkat Anda</strong>. Tidak ada pelacak pihak ketiga (zero telemetry), dan data Anda tidak pernah dijual atau dikumpulkan di server eksternal.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div class="font-bold text-slate-900 flex items-center gap-2">
                <Cpu class="w-4 h-4 text-indigo-600" />
                <span>Multi-Model AI Integration</span>
              </div>
              <p class="text-slate-600 leading-relaxed">
                Hastaloka mendukung koneksi fleksibel ke penyedia LLM terdepan: Google Gemini (Gemini 2.5 Flash / Pro), Anthropic Claude, OpenAI GPT-4o, DeepSeek, serta Local Ollama / OpenWebUI untuk lingkungan kerja offline dan rahasia perusahaan.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-1 text-slate-500">
              <div class="font-bold text-slate-700">Spesifikasi Rilis</div>
              <div>Versi: <strong>Hastaloka Enterprise v2.0.4</strong></div>
              <div>Mesin Analitik: <strong>H5V Centered Cosine Kernel v2</strong></div>
              <div>Standar Antarmuka: <strong>Full-Edge Executive Design System</strong></div>
            </div>
          </div>
        </div>

        <!-- 5. TAB: TENTANG DEVELOPER -->
        <div v-else-if="activeSection === 'developer'" class="space-y-6">
          <!-- Developer Profile Hero Card -->
          <div class="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
            <div class="absolute -right-6 -bottom-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
            
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0">
                R
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-black tracking-tight">Rasyiqi</h3>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Lead Developer & Architect
                  </span>
                </div>
                <p class="text-xs text-slate-300 leading-relaxed">
                  Full-Stack Engineer, Cognitive System Designer & Computational Psychometrics Researcher.
                </p>
                <div class="text-[11px] text-indigo-300 font-mono pt-0.5">
                  Hastaloka Engineering & Research Labs
                </div>
              </div>
            </div>

            <!-- Social Links & Connect Channels -->
            <div class="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center gap-2.5 relative z-10">
              <span class="text-[11px] font-semibold text-slate-400">Media Sosial:</span>
              
              <a
                href="https://www.instagram.com/rasyiqi/"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-500/30 hover:border-pink-500/50 text-pink-200 hover:text-white text-xs font-semibold transition-all cursor-pointer group shadow-xs"
                title="Buka Instagram @rasyiqi"
              >
                <svg class="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>Instagram: @rasyiqi</span>
                <ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="https://www.tiktok.com/@rasyiqi"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer group shadow-xs"
                title="Buka TikTok @rasyiqi"
              >
                <svg class="w-3.5 h-3.5 text-cyan-300 group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.328 0 .642.054.935.152V9.43a6.33 6.33 0 0 0-.935-.07A6.337 6.337 0 0 0 3.146 15.69 6.337 6.337 0 0 0 9.483 22.03a6.337 6.337 0 0 0 6.337-6.338V9.176a8.16 8.16 0 0 0 4.887 1.602V7.333c-.392 0-.765-.224-1.118-.647z"/>
                </svg>
                <span>TikTok: @rasyiqi</span>
                <ExternalLink class="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

          <!-- Misi & Filosofi Rekayasa -->
          <div class="space-y-3">
            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Prinsip Rekayasa Perangkat Lunak
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div class="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck class="w-4 h-4 text-emerald-600" />
                  <span>Kedaulatan Privasi Penuh</span>
                </div>
                <p class="text-slate-600 leading-relaxed text-[11px]">
                  Arsitektur Local-First. Data asesmen, hasil profiling, dan kunci API tidak pernah diunggah ke server terpusat. Anda memiliki kontrol 100% atas data Anda.
                </p>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div class="font-bold text-slate-900 flex items-center gap-2">
                  <Cpu class="w-4 h-4 text-indigo-600" />
                  <span>Zero Server Cost (Rp 0)</span>
                </div>
                <p class="text-slate-600 leading-relaxed text-[11px]">
                  Didesain untuk model beli putus mandiri tanpa beban langganan bulanan server atau ketergantungan cloud berbayar dari pihak ketiga.
                </p>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div class="font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles class="w-4 h-4 text-amber-600" />
                  <span>Sains Matematis Murni</span>
                </div>
                <p class="text-slate-600 leading-relaxed text-[11px]">
                  Mengimplementasikan algoritma Pearson Correlation Profile (Centered Cosine) untuk mematahkan Barnum Effect pada tes kepribadian konvensional.
                </p>
              </div>

              <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                <div class="font-bold text-slate-900 flex items-center gap-2">
                  <Brain class="w-4 h-4 text-violet-600" />
                  <span>Multi-Model AI (BYOK)</span>
                </div>
                <p class="text-slate-600 leading-relaxed text-[11px]">
                  Dukungan bebas koneksi ke Google Gemini, OpenAI GPT-4o, Claude, DeepSeek, maupun Local LLM (Ollama) yang berjalan offline di komputer Anda.
                </p>
              </div>
            </div>
          </div>

          <!-- Stack & Ekosistem -->
          <div class="p-4 rounded-xl bg-white border border-slate-200 text-xs space-y-2">
            <h4 class="font-bold text-slate-900">Teknologi & Lingkungan Eksekusi</h4>
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">Vue 3 (Composition API)</span>
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">TypeScript</span>
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">Vite 8</span>
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">Tailwind CSS v4</span>
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">Electron (Windows .exe)</span>
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">Capacitor (Android APK)</span>
              <span class="px-2.5 py-1 bg-slate-100 text-slate-700 font-mono text-[11px] rounded-lg">Chart.js & SVG Radar</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs shrink-0">
        <span class="text-slate-500 font-medium">
          © 2026 Hastaloka System. All rights reserved.
        </span>
        <button
          @click="$emit('close')"
          class="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
</template>
