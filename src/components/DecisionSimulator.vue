<script setup lang="ts">
import { ref } from 'vue';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  Bot,
  RotateCcw,
  Zap
} from '@lucide/vue';
import { AIService } from '../services/aiService';
import type { AssessmentResult, DailyReadinessRecord } from '../types/hastaloka';

const props = defineProps<{
  assessment: AssessmentResult | null;
  readiness?: DailyReadinessRecord | null;
}>();

const emit = defineEmits<{
  (e: 'open-ai-chat', initialPrompt: string): void;
  (e: 'open-settings'): void;
}>();

const dilemmaInput = ref('');
const isSimulating = ref(false);
const simulationResult = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const presetDilemmas = [
  {
    title: 'Tawaran Kerja Baru vs Bertahan',
    text: 'Saya ditawari posisi baru dengan kenaikan gaji 40% di perusahaan lain, namun jam kerja lebih padat. Di tempat lama peran saya sudah nyaman tapi jenjang karier melambat. Apakah saya harus pindah sekarang?'
  },
  {
    title: 'Ekspansi Agresif vs Tabung Kas',
    text: 'Bisnis saya menghasilkan profit stabil. Saya bimbang apakah harus menginvestasikan 70% kas untuk ekspansi tim dan pemasaran baru, atau mempertahankan cadangan kas likuiditas menghadapi ketidakpastian pasar?'
  },
  {
    title: 'Bahas Masalah dengan Partner vs Mengalah',
    text: 'Saya merasa pembagian beban kerja dengan rekan kerja/partner bisnis tidak seimbang dan alur komunikasi sering macet. Bagaimana cara terbaik mengonfrontasi hal ini tanpa merusak hubungan kerja sama?'
  },
  {
    title: 'Ambil Proyek Sampingan vs Selesaikan Portofolio Utama',
    text: 'Ada tawaran freelance menarik bernilai besar yang datang, tapi saya sedang punya proyek prioritas yang belum selesai. Apakah saya harus ambil atau tolak demi fokus mutu?'
  }
];

function selectPreset(text: string) {
  dilemmaInput.value = text;
  simulationResult.value = null;
  errorMessage.value = null;
}

async function runSimulation() {
  const text = dilemmaInput.value.trim();
  if (!text || isSimulating.value) return;

  if (!AIService.hasApiKey()) {
    emit('open-settings');
    return;
  }

  isSimulating.value = true;
  errorMessage.value = null;

  try {
    const res = await AIService.simulateDecision(text, props.assessment, props.readiness);
    simulationResult.value = res;
  } catch (err: any) {
    errorMessage.value = err.message || 'Terjadi kendala saat menjalankan simulasi keputusan.';
  } finally {
    isSimulating.value = false;
  }
}

function discussInAI() {
  if (!dilemmaInput.value) return;
  const prompt = `Saya baru saja menjalankan simulasi keputusan terkait: "${dilemmaInput.value}". Bantu saya mendiskusikan langkah taktisnya lebih dalam.`;
  emit('open-ai-chat', prompt);
}

function resetSimulation() {
  dilemmaInput.value = '';
  simulationResult.value = null;
  errorMessage.value = null;
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <div class="exec-card p-6 bg-white border border-slate-200 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-xs">
            <BrainCircuit class="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Simulator Bedah Keputusan (Decision Intelligence)</h3>
            <p class="text-xs text-slate-500 font-normal">
              Evaluasi multi-lapisan terhadap dilema nyata berdasarkan vektor H5V, kesiapan biologis (Rt), dan mitigasi titik buta
            </p>
          </div>
        </div>

        <!-- Real-Time Context Badge -->
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <span
            v-if="assessment"
            class="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-slate-100 text-slate-800 border border-slate-200"
          >
            Arketipe: {{ assessment.primaryArchetype.name }}
          </span>
          <span
            class="px-2.5 py-1 text-xs font-mono font-semibold rounded"
            :class="
              (readiness?.rt || 85) >= 75
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-amber-50 text-amber-800 border border-amber-200'
            "
          >
            Status Rt: {{ readiness?.rt || 85 }}% ({{ (readiness?.rt || 85) >= 75 ? 'Aman' : 'Perlu Waspada' }})
          </span>
        </div>
      </div>

      <!-- Quick Preset Dilemmas -->
      <div class="space-y-2">
        <span class="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
          Pilih Studi Kasus / Skenario Eksekutif Cepat:
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            v-for="(item, idx) in presetDilemmas"
            :key="idx"
            @click="selectPreset(item.text)"
            class="p-2.5 rounded-lg border text-left transition-all cursor-pointer text-xs"
            :class="
              dilemmaInput === item.text
                ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            "
          >
            <div class="font-bold truncate">{{ item.title }}</div>
            <div class="text-[10px] mt-0.5 line-clamp-1 opacity-75">
              {{ item.text }}
            </div>
          </button>
        </div>
      </div>

      <!-- Dilemma Input Area -->
      <div class="space-y-2 pt-2">
        <label class="block text-xs font-bold text-slate-700">
          Uraikan Dilema / Keputusan yang Sedang Anda Hadapi:
        </label>
        <textarea
          v-model="dilemmaInput"
          rows="3"
          placeholder="Tuliskan opsi yang sedang Anda timbang, kekhawatiran terbesar Anda, atau keputusan kritis yang harus diambil..."
          class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors leading-relaxed"
          :disabled="isSimulating"
        ></textarea>
      </div>

      <!-- Action Button Row -->
      <div class="flex items-center justify-between pt-1">
        <button
          v-if="simulationResult || dilemmaInput"
          @click="resetSimulation"
          class="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw class="w-3.5 h-3.5" /> Reset Formulir
        </button>
        <div v-else></div>

        <button
          @click="runSimulation"
          :disabled="!dilemmaInput.trim() || isSimulating"
          class="btn-exec-primary px-5 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
        >
          <Zap class="w-3.5 h-3.5 text-blue-300" />
          <span v-if="!isSimulating">Jalankan Simulasi Keputusan (AI Multi-Lapisan)</span>
          <span v-else>Menganalisis Vektor & Menghitung Risiko...</span>
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div
      v-if="errorMessage"
      class="p-4 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between gap-3"
    >
      <div class="flex items-center gap-2">
        <AlertTriangle class="w-4 h-4 text-rose-600 shrink-0" />
        <span>{{ errorMessage }}</span>
      </div>
      <button
        @click="emit('open-settings')"
        class="px-2.5 py-1 rounded bg-slate-900 text-white font-semibold shrink-0 cursor-pointer"
      >
        Pengaturan AI
      </button>
    </div>

    <!-- Simulation Result Card -->
    <div v-if="simulationResult" class="exec-card p-6 bg-white border border-slate-200 space-y-5 animate-in fade-in duration-300">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 class="w-4 h-4" />
          </div>
          <div>
            <h4 class="text-sm font-bold text-slate-900 tracking-tight">Lembar Analisis Keputusan Strategis</h4>
            <p class="text-xs text-slate-500">Hasil sintesis terintegrasi sains Hastaloka dan penalaran AI</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="discussInAI"
            class="btn-exec-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Bot class="w-3.5 h-3.5 text-blue-300" />
            <span>Diskusi Lanjut di Co-Pilot</span>
          </button>
        </div>
      </div>

      <!-- Result Text Content -->
      <div class="p-5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
        {{ simulationResult }}
      </div>
    </div>
  </div>
</template>
