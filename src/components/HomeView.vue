<script setup lang="ts">
import { computed } from 'vue';
import {
  Sparkles,
  Plus,
  Maximize2,
  MoreHorizontal,
  Layers,
  ChevronDown,
  CalendarDays,
  Bell,
  Check
} from '@lucide/vue';
import type { AssessmentResult } from '../types/hastaloka';
import MobileHomeView from './MobileHomeView.vue';

const props = defineProps<{
  assessment: AssessmentResult | null;
  readiness: { rt: number; status: string; recommendation: string };
  sleepQuality: 'good' | 'average' | 'poor';
  stressLevel: 'low' | 'moderate' | 'high';
}>();

const emit = defineEmits<{
  (e: 'navigate', tab: 'home' | 'insight' | 'copilot'): void;
  (e: 'open-assessment'): void;
  (e: 'open-report'): void;
  (e: 'open-settings'): void;
  (e: 'update-sleep', val: 'good' | 'average' | 'poor'): void;
  (e: 'update-stress', val: 'low' | 'moderate' | 'high'): void;
  (e: 'quick-simulate', text: string): void;
}>();

const primaryArch = computed(() => props.assessment?.primaryArchetype);

// 5 Vektor List (For My Goals card)
const vectorGoals = computed(() => {
  if (!props.assessment) return [];
  const v = props.assessment.vectorScores;
  return [
    { label: 'Daya Aksi (Drive)', category: 'Inisiatif & Momentum', val: v.drive, color: 'bg-cyan-500' },
    { label: 'Kelenturan (Adaptasi)', category: 'Fleksibilitas Sosial', val: v.adaptability, color: 'bg-cyan-500' },
    { label: 'Relasi (Konektivitas)', category: 'Modal Sosial & Persuasi', val: v.connectivity, color: 'bg-indigo-500' },
    { label: 'Visi Pola (Sintesis)', category: 'Logika & Tren Makro', val: v.synthesis, color: 'bg-amber-400' },
    { label: 'Keteraturan (Stabilitas)', category: 'Regulasi SOP & Detail', val: v.stability, color: 'bg-rose-400' },
  ];
});

// Current Indonesian Date
const currentDateFormatted = computed(() => {
  const d = new Date();
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  return `${dayNames[d.getDay()]}, ${d.getDate()} ${monthNames[d.getMonth()]}`;
});

const calendarDays = [
  { day: 'Min', date: '27', active: false },
  { day: 'Sen', date: '28', active: false },
  { day: 'Sel', date: '29', active: true },
  { day: 'Rab', date: '30', active: false },
  { day: 'Kam', date: '01', active: false },
  { day: 'Jum', date: '02', active: false },
  { day: 'Sab', date: '03', active: false },
];
</script>

<template>
  <div>
    <!-- DEDICATED MOBILE VIEW (< md) -->
    <div class="block md:hidden">
      <MobileHomeView
        :assessment="assessment"
        :readiness="readiness"
        :sleep-quality="sleepQuality"
        :stress-level="stressLevel"
        @navigate="emit('navigate', $event)"
        @open-assessment="emit('open-assessment')"
        @open-report="emit('open-report')"
        @open-settings="emit('open-settings')"
        @update-sleep="emit('update-sleep', $event)"
        @update-stress="emit('update-stress', $event)"
        @quick-simulate="emit('quick-simulate', $event)"
      />
    </div>

    <!-- ORIGINAL UNTOUCHED PRODIFY DESKTOP VIEW (>= md) -->
    <div class="hidden md:block space-y-6 max-w-7xl mx-auto">
      <!-- HERO GREETING SECTION -->
      <div class="space-y-3 relative">
        <!-- Date -->
        <div class="text-xs font-semibold text-slate-500">
          {{ currentDateFormatted }}
        </div>

        <!-- Headline & Gradient Subheadline -->
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">
            Halo, {{ assessment?.userName || 'Pengguna Hastaloka' }}
          </h1>
          <div class="text-3xl font-black text-gradient-cyan mt-1">
            Apa keputusan yang ingin Anda navigasikan hari ini?
          </div>
        </div>

        <!-- Horizontal Action Pills -->
        <div class="flex flex-wrap items-center gap-2.5 pt-2">
          <!-- Solid Purple Pill (* Ask AI) -->
          <button
            @click="emit('navigate', 'copilot')"
            class="px-4 py-2 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles class="w-3.5 h-3.5 text-violet-200" />
            <span>* Tanya Copilot AI</span>
          </button>

          <!-- White Outline Pill (Bedah Keputusan) -->
          <button
            @click="emit('quick-simulate', 'Saya ingin mengevaluasi opsi karier baru vs bertahan')"
            class="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Bedah Keputusan Nyata
          </button>

          <!-- White Outline Pill (Lihat Insight) -->
          <button
            @click="emit('navigate', 'insight')"
            class="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Peta 5 Vektor (H5V)
          </button>

          <!-- White Outline Pill (Asesmen Baru) -->
          <button
            @click="emit('open-assessment')"
            class="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 font-medium text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            Tes Ulang (25 Soal)
          </button>
        </div>
      </div>

      <!-- UNIFIED DASHBOARD CARD CONTAINER (Desktop Prodify Layout) -->
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8">
        <div class="grid grid-cols-12 gap-8 items-start">
          
          <!-- LEFT COLUMN (7 COLS): AGENDA & KESIAPAN (Rt) + VEKTOR (H5V) -->
          <div class="col-span-7 space-y-6">
            
            <!-- SECTION 1: AGENDA & KESIAPAN KEPUTUSAN -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-slate-900">Agenda & Kesiapan Keputusan</span>
                </div>
                <div class="flex items-center gap-2 text-slate-400">
                  <button @click="emit('navigate', 'copilot')" class="p-1 hover:text-slate-700 cursor-pointer" title="Simulasi Baru">
                    <Plus class="w-4 h-4" />
                  </button>
                  <button class="p-1 hover:text-slate-700 cursor-pointer">
                    <Maximize2 class="w-3.5 h-3.5" />
                  </button>
                  <button class="p-1 hover:text-slate-700 cursor-pointer">
                    <MoreHorizontal class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- In Progress Badge & Items -->
              <div class="space-y-3">
                <div class="flex items-center gap-2 text-xs">
                  <span class="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold text-[10px] uppercase tracking-wider">
                    STATUS KESIAPAN (Rt) • AKTIF
                  </span>
                </div>

                <!-- Task Item 1: Rt Status -->
                <div class="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3">
                  <div class="space-y-1">
                    <div class="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>Indeks Kesiapan Biologis: {{ readiness.rt }}%</span>
                    </div>
                    <div class="text-[11px] text-slate-500">
                      {{ readiness.recommendation }}
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      Tinggi
                    </span>
                    <span class="text-xs font-semibold text-rose-500">
                      Hari Ini
                    </span>
                  </div>
                </div>

                <!-- Task Item 2: Golden Hour Window -->
                <div class="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3">
                  <div class="space-y-1">
                    <div class="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                      <span>Jam Emas Sirkadian: {{ assessment?.chronotype === 'owl' ? '14:00 – 18:30 WIB' : '08:30 – 12:00 WIB' }}</span>
                    </div>
                    <div class="text-[11px] text-slate-500">
                      Waktu terbaik negosiasi, presentasi penting, atau keputusan komitmen modal.
                    </div>
                  </div>

                  <div class="flex items-center gap-2 shrink-0">
                    <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      Standar
                    </span>
                    <span class="text-xs font-semibold text-slate-500">
                      Sore
                    </span>
                  </div>
                </div>

                <!-- Quick 1-Click Toggles for Rt -->
                <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold text-slate-500">Tidur:</span>
                    <button
                      @click="emit('update-sleep', 'good')"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                      :class="sleepQuality === 'good' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
                    >Nyenyak</button>
                    <button
                      @click="emit('update-sleep', 'average')"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                      :class="sleepQuality === 'average' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
                    >Biasa</button>
                    <button
                      @click="emit('update-sleep', 'poor')"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                      :class="sleepQuality === 'poor' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
                    >Kurang</button>
                  </div>

                  <div class="flex items-center gap-2">
                    <span class="text-[11px] font-bold text-slate-500">Stres:</span>
                    <button
                      @click="emit('update-stress', 'low')"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                      :class="stressLevel === 'low' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
                    >Rileks</button>
                    <button
                      @click="emit('update-stress', 'moderate')"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                      :class="stressLevel === 'moderate' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
                    >Padat</button>
                    <button
                      @click="emit('update-stress', 'high')"
                      class="px-2 py-0.5 rounded text-[10px] font-semibold cursor-pointer"
                      :class="stressLevel === 'high' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'"
                    >Tertekan</button>
                  </div>
                </div>

                <div class="pt-1">
                  <button
                    @click="emit('navigate', 'copilot')"
                    class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>+ Bedah Dilema Baru dengan Copilot AI</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- SECTION 2: 5 VEKTOR KEKUATAN -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                <span class="text-sm font-bold text-slate-900">Distribusi 5 Vektor Kekuatan (H5V)</span>
                <button
                  @click="emit('navigate', 'insight')"
                  class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Lihat Radar →</span>
                </button>
              </div>

              <div class="space-y-3.5">
                <div
                  v-for="(item, idx) in vectorGoals"
                  :key="idx"
                  class="flex items-center justify-between gap-4 text-xs"
                >
                  <div class="space-y-0.5 flex-1 min-w-0">
                    <div class="font-bold text-slate-800 truncate">{{ item.label }}</div>
                    <div class="text-[10px] text-slate-400 truncate">{{ item.category }}</div>
                  </div>

                  <!-- Bar Fill -->
                  <div class="flex items-center gap-3 w-40 shrink-0">
                    <div class="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all duration-500"
                        :class="item.color"
                        :style="{ width: `${item.val}%` }"
                      ></div>
                    </div>
                    <span class="font-mono font-bold text-slate-900 text-xs w-9 text-right">
                      {{ item.val }}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (5 COLS): ARKETIPE & ENTITAS + KALENDER SIRKADIAN -->
          <div class="col-span-5 space-y-6 border-l border-slate-100 pl-8">
            
            <!-- SECTION 3: ARKETIPE & ENTITAS -->
            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers class="w-4 h-4 text-indigo-600" /> Arketipe & Entitas
                </span>
                <span class="text-xs text-slate-400 flex items-center gap-1">
                  Aktif <ChevronDown class="w-3 h-3" />
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <!-- Project 1: Asesmen Baru -->
                <button
                  @click="emit('open-assessment')"
                  class="p-3 rounded-xl border border-dashed border-slate-300 hover:border-slate-400 flex flex-col items-center justify-center text-center space-y-1 transition-colors cursor-pointer group bg-slate-50/50"
                >
                  <div class="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs group-hover:scale-105 transition-transform">
                    <Plus class="w-4 h-4" />
                  </div>
                  <span class="text-xs font-bold text-slate-800">Tes Asesmen Baru</span>
                </button>

                <!-- Project 2: Arketipe Utama -->
                <div
                  @click="emit('navigate', 'insight')"
                  class="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1.5"
                >
                  <div class="w-6 h-6 rounded-md bg-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ★
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 truncate">{{ primaryArch?.name || 'Catalyst' }}</div>
                    <div class="text-[10px] text-slate-500">{{ assessment?.allArchetypeMatches[0]?.similarity || 98 }}% Match</div>
                  </div>
                </div>

                <!-- Project 3: Partner Ideal -->
                <div
                  @click="emit('navigate', 'insight')"
                  class="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1.5"
                >
                  <div class="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    ◆
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 truncate">Mechanic</div>
                    <div class="text-[10px] text-slate-500">Partner Komplementer</div>
                  </div>
                </div>

                <!-- Project 4: Laporan Dokumen -->
                <div
                  @click="emit('open-report')"
                  class="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1.5"
                >
                  <div class="w-6 h-6 rounded-md bg-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    📄
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-900 truncate">Laporan Resmi</div>
                    <div class="text-[10px] text-slate-500">Ekspor PDF</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- DIVIDER -->
            <div class="border-t border-slate-100 pt-6 space-y-6">
              <!-- SECTION 4: KALENDER SIRKADIAN -->
              <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CalendarDays class="w-4 h-4 text-indigo-600" /> Kalender Sirkadian
                  </span>
                  <span class="text-xs text-slate-500 font-medium">September 2026</span>
                </div>

                <!-- Day Strip -->
                <div class="flex items-center justify-between gap-1 text-center">
                  <div
                    v-for="(day, idx) in calendarDays"
                    :key="idx"
                    class="flex-1 py-1.5 rounded-xl transition-all cursor-pointer text-xs"
                    :class="
                      day.active
                        ? 'bg-[#6366f1] text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    "
                  >
                    <div class="text-[10px] opacity-75">{{ day.day }}</div>
                    <div class="font-bold text-sm mt-0.5">{{ day.date }}</div>
                  </div>
                </div>

                <!-- Scheduled Focus Session -->
                <div class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="text-xs font-bold text-slate-900">
                      Puncak Fokus & Keputusan Penting
                    </div>
                    <span class="text-[10px] font-mono text-indigo-600 font-bold">14:00 - 18:30 WIB</span>
                  </div>
                  <p class="text-[11px] text-slate-600 leading-relaxed">
                    Jendela performa kognitif optimal berdasarkan kronotipe {{ assessment?.chronotype === 'owl' ? 'Night Owl' : 'Early Lark' }} Anda.
                  </p>
                </div>
              </div>

              <!-- SECTION 5: PROTOKOL HARIAN -->
              <div class="space-y-3 pt-2">
                <div class="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Bell class="w-4 h-4 text-indigo-600" /> Protokol Harian
                  </span>
                  <span class="text-[10px] font-bold text-slate-400 uppercase">Hari Ini • 2</span>
                </div>

                <div class="space-y-2.5 text-xs text-slate-700">
                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start justify-between gap-2">
                    <div class="flex items-start gap-2">
                      <Check class="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>Tinjau stabilitas emosi (Rt) sebelum menandatangani persetujuan penting.</span>
                    </div>
                  </div>

                  <div class="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2">
                    <div class="flex items-start gap-2">
                      <Check class="w-3.5 h-3.5 text-indigo-600 mt-0.5 shrink-0" />
                      <span>Terapkan prinsip dikotomi kendali (Stoic Closure) saat istirahat malam hari.</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
