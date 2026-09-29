<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Sun,
  Scale,
  Moon,
  TrendingUp,
  CheckCircle2
} from '@lucide/vue';
import { calculatePsukses } from '../utils/hastalokaMath';

// State untuk Kalkulator Keberuntungan Probabilistik (BAB 6.3)
const baseP = ref(0.15); // Probabilitas dasar (15%)
const attempts = ref(10); // Jumlah percobaan (n = 10 proposal)
const competence = ref(0.85); // Kesiapan kompetensi Ks (85%)

const pSukses = computed(() => {
  return calculatePsukses(baseP.value, attempts.value, competence.value);
});
</script>

<template>
  <div class="space-y-6">
    <!-- Protokol Operasional Harian (BAB 8) -->
    <div class="exec-card p-6 bg-white border border-slate-200 space-y-5">
      <div class="border-b border-slate-100 pb-3">
        <h3 class="text-base font-bold text-slate-900 tracking-tight">Protokol Harian untuk Manajemen Energi & Keputusan</h3>
        <p class="text-xs text-slate-500 font-normal">Panduan operasional pagi, siang, dan malam untuk meminimalkan kelelahan kognitif dan kebocoran energi</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 1. Pagi Hari -->
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
              <Sun class="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Fase 1 • Pagi</span>
              <h4 class="text-xs font-bold text-slate-900">Audit Sirkadian (Chrono-Audit)</h4>
            </div>
          </div>
          <ul class="text-xs text-slate-600 space-y-1.5 font-normal">
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Verifikasi kecukupan pemulihan tidur sebelum memulai agenda berat.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Sinkronisasi jam kerja primer dengan kronotipe Anda.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Paparan cahaya alami 10 menit untuk menekan hormon melatonin.</span>
            </li>
          </ul>
        </div>

        <!-- 2. Siang Hari -->
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
              <Scale class="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Fase 2 • Siang</span>
              <h4 class="text-xs font-bold text-slate-900">Audit Keputusan (Decision-Audit)</h4>
            </div>
          </div>
          <ul class="text-xs text-slate-600 space-y-1.5 font-normal">
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Evaluasi kondisi emosi dan saturasi kognitif sebelum menandatangani komitmen.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Jika skor Rt berada di bawah batas ambang, tunda keputusan berisiko tinggi selama 24 jam.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Alihkan ke tugas administratif atau evaluasi data pasif.</span>
            </li>
          </ul>
        </div>

        <!-- 3. Malam Hari -->
        <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded bg-white border border-slate-200 text-slate-700 flex items-center justify-center">
              <Moon class="w-4 h-4 text-slate-800" />
            </div>
            <div>
              <span class="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold">Fase 3 • Malam</span>
              <h4 class="text-xs font-bold text-slate-900">Penutupan Stoik (Stoic Closure)</h4>
            </div>
          </div>
          <ul class="text-xs text-slate-600 space-y-1.5 font-normal">
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Inventarisasi objektif hal-hal yang terselesaikan vs pending.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Dekompresi pikiran dari variabel eksternal di luar kendali kendali pribadi.</span>
            </li>
            <li class="flex items-start gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>Hentikan stimulasi perangkat layar 30-45 menit menjelang fase tidur.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Kalkulator Matematika Keberuntungan (Psukses) (BAB 6.3) -->
    <div class="exec-card p-6 bg-white border border-slate-200 space-y-5">
      <div class="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <TrendingUp class="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Kalkulator Probabilitas Keberhasilan (P_sukses)</h3>
            <p class="text-xs text-slate-500 font-normal">Model matematis peluang kumulatif berbasis kompetensi dan frekuensi iterasi</p>
          </div>
        </div>
        <div class="font-mono text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded border border-slate-200">
          P_sukses = [1 - (1 - p)^n] × Ks
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Input 1: Probabilitas Dasar (p) -->
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-800">1. Peluang Basis Pasar (p)</span>
            <span class="font-mono font-bold text-slate-900">{{ Math.round(baseP * 100) }}%</span>
          </div>
          <input
            v-model.number="baseP"
            type="range"
            min="0.01"
            max="0.50"
            step="0.01"
            class="w-full accent-slate-900 cursor-pointer"
          />
          <p class="text-[11px] text-slate-500">Tingkat konversi rata-rata industri untuk inisiatif atau proposal serupa.</p>
        </div>

        <!-- Input 2: Jumlah Upaya (n) -->
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-800">2. Frekuensi Iterasi (n)</span>
            <span class="font-mono font-bold text-slate-900">{{ attempts }} kali</span>
          </div>
          <input
            v-model.number="attempts"
            type="range"
            min="1"
            max="50"
            class="w-full accent-slate-900 cursor-pointer"
          />
          <p class="text-[11px] text-slate-500">Jumlah percobaan, lembar penawaran, atau iterasi produk yang diluncurkan.</p>
        </div>

        <!-- Input 3: Indeks Kesiapan Kompetensi (Ks) -->
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-800">3. Kesiapan Kompetensi (Ks)</span>
            <span class="font-mono font-bold text-slate-900">{{ Math.round(competence * 100) }}%</span>
          </div>
          <input
            v-model.number="competence"
            type="range"
            min="0.10"
            max="1.00"
            step="0.05"
            class="w-full accent-slate-900 cursor-pointer"
          />
          <p class="text-[11px] text-slate-500">Tingkat kesiapan teknis, kredibilitas rekam jejak, dan kualitas eksekusi.</p>
        </div>
      </div>

      <!-- Result Outcome Box -->
      <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
            Probabilitas Keberhasilan Kumulatif:
          </span>
          <h4 class="text-base font-bold text-slate-900">
            Total Peluang Berhasil: <span class="text-slate-900 font-mono text-2xl font-black">{{ pSukses }}%</span>
          </h4>
          <p class="text-xs text-slate-600 mt-1 font-normal leading-relaxed">
            Secara matematis, peluang keberhasilan meningkat eksponensial seiring pertambahan frekuensi eksekusi yang dipadukan dengan kesiapan kompetensi teknis.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
