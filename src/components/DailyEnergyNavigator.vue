<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  Flame,
  Save,
  Sun,
  Moon,
  ArrowRight,
  ShieldCheck,
  ShieldAlert
} from '@lucide/vue';
import { calculateReadinessIndex } from '../utils/hastalokaMath';
import { StorageService } from '../services/storage';
import type { DailyReadinessRecord, AssessmentResult } from '../types/hastaloka';

const props = defineProps<{
  assessment: AssessmentResult | null;
}>();

const emit = defineEmits<{
  (e: 'open-simulator'): void;
}>();

// State interaktif 10-detik
const sleepQuality = ref<'good' | 'average' | 'poor'>('good');
const stressLevel = ref<'low' | 'moderate' | 'high'>('low');

// Mapping ke nilai numerik Ct & St
const ct = computed(() => {
  if (sleepQuality.value === 'good') return 90;
  if (sleepQuality.value === 'average') return 65;
  return 35;
});

const st = computed(() => {
  if (stressLevel.value === 'low') return 20;
  if (stressLevel.value === 'moderate') return 50;
  return 85;
});

// Keselarasan kronotipe saat ini berdasarkan waktu lokal
const kt = computed(() => {
  const currentHour = new Date().getHours();
  const chronotype = props.assessment?.chronotype || 'owl';

  if (chronotype === 'lark') {
    // Early Lark puncak jam 08:00 - 12:00
    if (currentHour >= 7 && currentHour <= 12) return 90;
    if (currentHour > 12 && currentHour <= 17) return 65;
    return 40;
  } else if (chronotype === 'owl') {
    // Night Owl puncak jam 14:00 - 21:00
    if (currentHour >= 13 && currentHour <= 21) return 90;
    if (currentHour >= 9 && currentHour < 13) return 60;
    return 40;
  }
  return 75; // Intermediate
});

const readiness = computed(() => {
  return calculateReadinessIndex(ct.value, kt.value, st.value);
});

const savedMessage = ref(false);

function saveCurrentLog() {
  const now = new Date();
  const record: DailyReadinessRecord = {
    id: `RT-${Date.now().toString(36)}`,
    date: now.toLocaleDateString('id-ID', { dateStyle: 'medium' }),
    time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    ct: ct.value,
    kt: kt.value,
    st: st.value,
    rt: readiness.value.rt,
    status: readiness.value.status,
    recommendation: readiness.value.recommendation,
  };

  StorageService.saveDailyReadiness(record);
  savedMessage.value = true;
  setTimeout(() => {
    savedMessage.value = false;
  }, 2500);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <div class="exec-card p-6 bg-white border border-slate-200 space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-xs">
            <Activity class="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Navigasi Kesiapan Energi & Keputusan (Rt Harian)</h3>
            <p class="text-xs text-slate-500 font-normal">
              Check-in 10 detik untuk memastikan apakah kondisi kognitif Anda aman untuk komitmen berisiko hari ini
            </p>
          </div>
        </div>

        <button
          @click="saveCurrentLog"
          class="btn-exec-secondary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Save class="w-3.5 h-3.5 text-slate-600" />
          <span v-if="!savedMessage">Simpan Log Hari Ini</span>
          <span v-else class="text-emerald-700 font-bold">Tersimpan!</span>
        </button>
      </div>

      <!-- 10-Second Check-In Buttons -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Input 1: Kualitas Tidur -->
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Brain class="w-4 h-4 text-slate-600" /> Kualitas Pemulihan Tidur Semalam
            </span>
            <span class="text-[10px] font-mono text-slate-500 font-semibold">Skor: {{ ct }}%</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              @click="sleepQuality = 'good'"
              class="p-2 rounded border text-center transition-all cursor-pointer text-xs"
              :class="sleepQuality === 'good' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              Nyenyak & Segar
            </button>
            <button
              @click="sleepQuality = 'average'"
              class="p-2 rounded border text-center transition-all cursor-pointer text-xs"
              :class="sleepQuality === 'average' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              Biasa Saja
            </button>
            <button
              @click="sleepQuality = 'poor'"
              class="p-2 rounded border text-center transition-all cursor-pointer text-xs"
              :class="sleepQuality === 'poor' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              Kurang / Begadang
            </button>
          </div>
        </div>

        <!-- Input 2: Beban Tekanan & Stres -->
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Flame class="w-4 h-4 text-slate-600" /> Beban Pikiran & Stres Saat Ini
            </span>
            <span class="text-[10px] font-mono text-slate-500 font-semibold">Beban: {{ st }}%</span>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <button
              @click="stressLevel = 'low'"
              class="p-2 rounded border text-center transition-all cursor-pointer text-xs"
              :class="stressLevel === 'low' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              Rileks & Terkendali
            </button>
            <button
              @click="stressLevel = 'moderate'"
              class="p-2 rounded border text-center transition-all cursor-pointer text-xs"
              :class="stressLevel === 'moderate' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              Padat / Sibuk
            </button>
            <button
              @click="stressLevel = 'high'"
              class="p-2 rounded border text-center transition-all cursor-pointer text-xs"
              :class="stressLevel === 'high' ? 'bg-slate-900 text-white font-bold border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'"
            >
              Tertekan / Burnout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Readiness Verdict & Golden Hour Panel -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <!-- Left (5 Cols): Live Gauge Card -->
      <div
        class="lg:col-span-5 exec-card p-6 border flex flex-col justify-between space-y-4"
        :class="
          readiness.status === 'Optimal'
            ? 'bg-emerald-50/40 border-emerald-200'
            : readiness.status === 'Standar'
            ? 'bg-slate-50 border-slate-200'
            : 'bg-rose-50/50 border-rose-200'
        "
      >
        <div>
          <div class="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-600">Status Kesiapan Eksekusi</span>
            <span
              class="px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase tracking-wider"
              :class="
                readiness.status === 'Optimal'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : readiness.status === 'Standar'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              "
            >
              {{ readiness.status === 'Optimal' ? 'Kondisi Prima' : readiness.status === 'Standar' ? 'Kondisi Cukup' : 'Kondisi Kritis' }}
            </span>
          </div>

          <div class="text-center py-4">
            <div
              class="text-6xl font-black font-mono tracking-tight"
              :class="
                readiness.status === 'Optimal'
                  ? 'text-emerald-800'
                  : readiness.status === 'Standar'
                  ? 'text-slate-900'
                  : 'text-rose-800'
              "
            >
              {{ readiness.rt }}%
            </div>
            <div class="text-xs text-slate-500 font-medium mt-1">Indeks Kesiapan Biologis & Kognitif</div>
          </div>

          <div class="p-3.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-2xs space-y-1">
            <div class="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck v-if="readiness.status === 'Optimal'" class="w-4 h-4 text-emerald-600" />
              <ShieldAlert v-else class="w-4 h-4 text-amber-600" />
              <span>Izin Keputusan Hari Ini:</span>
            </div>
            <p>
              {{ readiness.recommendation }}
            </p>
          </div>
        </div>

        <button
          @click="emit('open-simulator')"
          class="btn-exec-primary w-full py-2.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs mt-2"
        >
          <span>Uji Dilema di Simulator Keputusan</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Right (7 Cols): Golden Hours Operational Protocol -->
      <div class="lg:col-span-7 exec-card p-6 bg-white border border-slate-200 flex flex-col justify-between space-y-4">
        <div>
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-slate-700" />
              <h4 class="text-sm font-bold text-slate-900">Alokasi Jam Emas Sirkadian Anda</h4>
            </div>
            <span class="text-xs text-slate-500 font-mono">
              Kronotipe: {{ assessment?.chronotype === 'owl' ? 'Night Owl' : 'Early Lark' }}
            </span>
          </div>

          <!-- Chrono Operational Windows -->
          <div class="space-y-3 pt-3">
            <!-- Window 1: Puncak Fokus -->
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-7 h-7 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0 font-bold">
                ⭐
              </div>
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900">Jam Emas Keputusan Kritis:</span>
                  <span class="text-xs font-mono font-bold text-blue-700">
                    {{ assessment?.chronotype === 'owl' ? '14:00 – 18:30 WIB' : '08:30 – 12:00 WIB' }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600">
                  Alokasikan untuk negosiasi kontrak, kesepakatan uang, presentasi ke investor, atau pemecahan masalah rumit.
                </p>
              </div>
            </div>

            <!-- Window 2: Pekerjaan Rutin / Pasif -->
            <div class="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-3">
              <div class="w-7 h-7 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0 font-bold">
                📋
              </div>
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-slate-900">Fase Kerja Administratif / Eksekusi Ringan:</span>
                  <span class="text-xs font-mono font-bold text-slate-700">
                    {{ assessment?.chronotype === 'owl' ? '10:00 – 13:00 WIB' : '13:30 – 16:30 WIB' }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600">
                  Waktu terbaik membalas email, merapikan dokumen kerja, dan koordinasi harian yang tidak berisiko tinggi.
                </p>
              </div>
            </div>

            <!-- Window 3: Larangan Keputusan -->
            <div class="p-3 rounded-lg bg-rose-50/70 border border-rose-200 flex items-start gap-3">
              <div class="w-7 h-7 rounded bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0 font-bold">
                ⚠️
              </div>
              <div class="space-y-0.5">
                <span class="text-xs font-bold text-rose-900">Protokol Pencegahan Kebocoran Energi:</span>
                <p class="text-[11px] text-slate-700">
                  Hindari berdebat atau mengambil keputusan impulsif saat kelelahan malam hari. Terapkan prinsip penundaan 24 jam jika emosi belum stabil.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="pt-2 text-[11px] text-slate-400 font-mono">
          Model Komputasi: Rt = [(wc * Ct) + (wk * Kt) - (ws * St)] / W
        </div>
      </div>
    </div>
  </div>
</template>
