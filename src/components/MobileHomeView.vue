<script setup lang="ts">
import { computed } from 'vue';
import {
  Sparkles,
  ArrowRight,
  Layers,
  CalendarDays,
  Check,
  FileText,
  Clock,
  Activity,
  ChevronRight
} from '@lucide/vue';
import type { AssessmentResult } from '../types/hastaloka';

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

// 5 Vektor List
const vectorGoals = computed(() => {
  if (!props.assessment) return [];
  const v = props.assessment.vectorScores;
  return [
    { key: 'drive', label: 'Daya Aksi (Drive)', category: 'Inisiatif & Momentum', val: v.drive, color: 'bg-cyan-500' },
    { key: 'adaptability', label: 'Kelenturan (Adaptasi)', category: 'Fleksibilitas Sosial', val: v.adaptability, color: 'bg-cyan-500' },
    { key: 'connectivity', label: 'Relasi (Koneksi)', category: 'Modal Sosial & Persuasi', val: v.connectivity, color: 'bg-indigo-500' },
    { key: 'synthesis', label: 'Visi Pola (Sintesis)', category: 'Logika & Tren Makro', val: v.synthesis, color: 'bg-amber-400' },
    { key: 'stability', label: 'Keteraturan (Stabilitas)', category: 'Regulasi SOP & Detail', val: v.stability, color: 'bg-rose-400' },
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
  <!-- MOBILE VIEW: FULL-EDGE, ZERO CONTAINER BOXES, LINE DIVIDERS & HORIZONTAL SCROLL -->
  <div class="w-full bg-white text-slate-900 divide-y divide-slate-100">
    
    <!-- 1. GREETING & HORIZONTAL ACTIONS -->
    <section class="py-4 px-4 space-y-2.5">
      <div class="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>{{ currentDateFormatted }}</span>
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Sirkadian Aktif
        </span>
      </div>

      <div>
        <h1 class="text-xl font-black text-slate-900 tracking-tight">
          Halo, {{ assessment?.userName || 'Pengguna Hastaloka' }} 👋
        </h1>
        <p class="text-xs font-bold text-gradient-cyan mt-0.5">
          Apa keputusan yang ingin Anda navigasikan hari ini?
        </p>
      </div>

      <!-- Horizontal Action Pills (Swipeable) -->
      <div class="flex items-center gap-2 pt-1 pb-1 overflow-x-auto no-scrollbar scroll-smooth">
        <button
          @click="emit('navigate', 'copilot')"
          class="px-3.5 py-2 rounded-full bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
        >
          <Sparkles class="w-3.5 h-3.5 text-violet-200" />
          <span>Tanya Copilot AI</span>
        </button>

        <button
          @click="emit('quick-simulate', 'Saya ingin mengevaluasi opsi karier baru vs bertahan')"
          class="px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
        >
          Bedah Keputusan
        </button>

        <button
          @click="emit('navigate', 'insight')"
          class="px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
        >
          Peta 5 Vektor (H5V)
        </button>

        <button
          @click="emit('open-report')"
          class="px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 active:scale-95 flex items-center gap-1.5"
        >
          <FileText class="w-3.5 h-3.5 text-slate-500" />
          <span>Laporan PDF</span>
        </button>

        <button
          @click="emit('open-assessment')"
          class="px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 active:scale-95"
        >
          Tes Ulang
        </button>
      </div>
    </section>

    <!-- 2. PRIMARY ARCHETYPE SPOTLIGHT (Clean flat full-edge, no boxed container) -->
    <section v-if="primaryArch" class="py-4 px-4 space-y-2.5">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-xs shrink-0">
            ★
          </div>
          <div>
            <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">ARKETIPE DOMINAN UTAMA</span>
            <h2 class="text-base font-black text-slate-900 leading-snug">
              {{ primaryArch.name }} <span class="text-sm font-semibold text-slate-500">({{ primaryArch.indonesianName }})</span>
            </h2>
          </div>
        </div>

        <span class="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-mono font-black text-xs shrink-0">
          {{ assessment?.allArchetypeMatches[0]?.similarity || 95 }}% Match
        </span>
      </div>

      <p class="text-xs text-slate-600 leading-relaxed font-normal">
        {{ primaryArch.description }}
      </p>

      <div class="flex items-center justify-between gap-2 pt-1 text-xs">
        <span class="text-slate-600">
          <strong class="text-indigo-700 font-bold">Peran Kunci:</strong> {{ primaryArch.role }}
        </span>

        <button
          @click="emit('navigate', 'insight')"
          class="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 shrink-0 cursor-pointer active:scale-95"
        >
          <span>Detail Insight</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </section>

    <!-- 3. AGENDA & STATUS KESIAPAN (Rt) -->
    <section class="py-4 px-4 space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <div class="flex items-center gap-2">
          <Activity class="w-4 h-4 text-indigo-600" />
          <span class="text-sm font-bold text-slate-900">Agenda & Kesiapan Keputusan (Rt)</span>
        </div>
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Status Harian
        </span>
      </div>

      <!-- Status Info Rows (Vertical Stacking to Prevent Text Squishing) -->
      <div class="space-y-2.5 text-xs">
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-bold text-slate-900">
              <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse"></span>
              <span>Indeks Kesiapan Biologis</span>
            </div>
            <span class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200/80">
              {{ readiness.status }} • {{ readiness.rt }}%
            </span>
          </div>
          <p class="text-slate-600 leading-relaxed text-[11px] pl-3.5">
            {{ readiness.recommendation }}
          </p>
        </div>

        <div class="space-y-1 pt-2 border-t border-slate-100">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 font-bold text-slate-900">
              <Clock class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>Jam Emas Sirkadian</span>
            </div>
            <span class="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] border border-indigo-200/80">
              {{ assessment?.chronotype === 'owl' ? '14:00 – 18:30 WIB' : '08:30 – 12:00 WIB' }}
            </span>
          </div>
          <p class="text-slate-500 text-[11px] leading-relaxed pl-5">
            Waktu terbaik negosiasi, presentasi penting, atau keputusan komitmen modal.
          </p>
        </div>
      </div>

      <!-- Segmented Controls (Full-width clean rows, no box inside box) -->
      <div class="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
        <!-- Sleep Toggle -->
        <div class="space-y-1">
          <span class="text-[11px] font-bold text-slate-500 block">Kualitas Tidur Semalam:</span>
          <div class="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              @click="emit('update-sleep', 'good')"
              class="py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
              :class="sleepQuality === 'good' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >Nyenyak</button>
            <button
              @click="emit('update-sleep', 'average')"
              class="py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
              :class="sleepQuality === 'average' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >Biasa</button>
            <button
              @click="emit('update-sleep', 'poor')"
              class="py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
              :class="sleepQuality === 'poor' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >Kurang</button>
          </div>
        </div>

        <!-- Stress Toggle -->
        <div class="space-y-1">
          <span class="text-[11px] font-bold text-slate-500 block">Tingkat Stres Saat Ini:</span>
          <div class="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              @click="emit('update-stress', 'low')"
              class="py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
              :class="stressLevel === 'low' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >Rileks</button>
            <button
              @click="emit('update-stress', 'moderate')"
              class="py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
              :class="stressLevel === 'moderate' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >Padat</button>
            <button
              @click="emit('update-stress', 'high')"
              class="py-2 text-center text-xs font-semibold rounded-lg transition-all cursor-pointer active:scale-95"
              :class="stressLevel === 'high' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >Tertekan</button>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. PETA 5 VEKTOR KEKUATAN (Horizontal swipeable carousel on mobile) -->
    <section class="py-4 space-y-3">
      <div class="flex items-center justify-between px-4 border-b border-slate-100 pb-2">
        <span class="text-sm font-bold text-slate-900">5 Vektor Karakter (H5V)</span>
        <button
          @click="emit('navigate', 'insight')"
          class="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-0.5 cursor-pointer active:scale-95"
        >
          <span>Visual Radar</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

      <!-- Horizontal Scrollable Deck on Mobile -->
      <div class="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-4 snap-x snap-mandatory">
        <div
          v-for="item in vectorGoals"
          :key="item.key"
          class="min-w-[155px] p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 shrink-0 snap-start"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 text-xs truncate">{{ item.label.split(' ')[0] }}</span>
            <span class="font-mono font-black text-indigo-700 text-xs">{{ item.val }}%</span>
          </div>

          <div class="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="item.color"
              :style="{ width: `${item.val}%` }"
            ></div>
          </div>

          <div class="text-[10px] text-slate-500 truncate">{{ item.category }}</div>
        </div>
      </div>
    </section>

    <!-- 5. SINERGI ENTITAS & KALENDER SIRKADIAN (Horizontal swipeable row) -->
    <section class="py-4 space-y-3">
      <div class="flex items-center justify-between px-4 border-b border-slate-100 pb-2">
        <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Layers class="w-4 h-4 text-indigo-600" /> Sinergi & Entitas Terverifikasi
        </span>
        <span class="text-xs text-slate-400">Geser →</span>
      </div>

      <!-- Horizontal Swipeable Cards -->
      <div class="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth px-4 snap-x snap-mandatory">
        <!-- Card 1: Partner Ideal -->
        <div
          @click="emit('navigate', 'insight')"
          class="min-w-[170px] p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1 shrink-0 snap-start active:scale-95"
        >
          <div class="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Partner Terbaik</div>
          <div class="text-xs font-bold text-slate-900 truncate">Saling Mengisi</div>
          <div class="text-[10px] text-slate-500">Lihat Kompatibilitas →</div>
        </div>

        <!-- Card 2: Laporan Resmi PDF -->
        <div
          @click="emit('open-report')"
          class="min-w-[170px] p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1 shrink-0 snap-start active:scale-95"
        >
          <div class="text-[10px] font-bold text-cyan-700 uppercase tracking-wider">Dokumen Resmi</div>
          <div class="text-xs font-bold text-slate-900 truncate">Laporan 4 Halaman</div>
          <div class="text-[10px] text-slate-500">Unduh Berkas PDF →</div>
        </div>

        <!-- Card 3: Asesmen Ulang -->
        <div
          @click="emit('open-assessment')"
          class="min-w-[170px] p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors cursor-pointer space-y-1 shrink-0 snap-start active:scale-95"
        >
          <div class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Kuesioner 25 Butir</div>
          <div class="text-xs font-bold text-slate-900 truncate">Tes Ulang Profil</div>
          <div class="text-[10px] text-slate-500">Mulai Evaluasi Baru →</div>
        </div>
      </div>
    </section>

    <!-- 6. KALENDER SIRKADIAN & PROTOKOL HARIAN -->
    <section class="py-4 px-4 space-y-3">
      <div class="flex items-center justify-between border-b border-slate-100 pb-2">
        <span class="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays class="w-4 h-4 text-indigo-600" /> Kalender & Protokol Sirkadian
        </span>
        <span class="text-xs text-slate-500">Minggu Ini</span>
      </div>

      <!-- Horizontal Day Strip -->
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <div
          v-for="(day, idx) in calendarDays"
          :key="idx"
          class="flex-1 min-w-[42px] py-1.5 rounded-xl transition-all cursor-pointer text-center text-xs"
          :class="
            day.active
              ? 'bg-[#6366f1] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 bg-slate-50'
          "
        >
          <div class="text-[10px] opacity-75">{{ day.day }}</div>
          <div class="font-bold text-sm mt-0.5">{{ day.date }}</div>
        </div>
      </div>

      <!-- Daily Checklist Items (Clean line items, no boxed cards) -->
      <div class="divide-y divide-slate-100 pt-2 text-xs text-slate-700">
        <div class="py-2.5 flex items-start gap-2.5">
          <Check class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span class="leading-relaxed">Tinjau stabilitas emosi (Rt) sebelum menandatangani persetujuan penting.</span>
        </div>
        <div class="py-2.5 flex items-start gap-2.5">
          <Check class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span class="leading-relaxed">Terapkan prinsip dikotomi kendali (Stoic Closure) saat istirahat malam hari.</span>
        </div>
      </div>
    </section>

  </div>
</template>
