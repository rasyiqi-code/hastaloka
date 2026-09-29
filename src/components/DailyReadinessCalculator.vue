<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Brain,
  Flame,
  Save
} from '@lucide/vue';
import { calculateReadinessIndex } from '../utils/hastalokaMath';
import { StorageService } from '../services/storage';
import type { DailyReadinessRecord } from '../types/hastaloka';

const ct = ref(85); // Kognitif
const kt = ref(80); // Kronotipe
const st = ref(25); // Beban Stres

const readiness = computed(() => {
  return calculateReadinessIndex(ct.value, kt.value, st.value);
});

// Presets untuk simulasi cepat
function applyPreset(presetType: 'optimal' | 'standard' | 'critical') {
  if (presetType === 'optimal') {
    ct.value = 90;
    kt.value = 85;
    st.value = 20;
  } else if (presetType === 'standard') {
    ct.value = 65;
    kt.value = 60;
    st.value = 45;
  } else {
    ct.value = 35;
    kt.value = 30;
    st.value = 85;
  }
}

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
  <div class="exec-card p-6 bg-white border border-slate-200 space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
            <Activity class="w-4 h-4 text-slate-700" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Kalkulator Kesiapan Eksekusi Keputusan (Rt)</h3>
            <p class="text-xs text-slate-500 font-normal">Evaluasi objektif kondisi biologis dan mental sebelum menandatangani kontrak atau negosiasi besar</p>
          </div>
        </div>
      </div>

      <!-- Presets Cepat -->
      <div class="flex items-center gap-1.5 self-start sm:self-auto">
        <span class="text-xs text-slate-400 font-medium mr-1 hidden sm:inline">Simulasi:</span>
        <button
          @click="applyPreset('optimal')"
          class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
        >
          Kondisi Prima
        </button>
        <button
          @click="applyPreset('standard')"
          class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
        >
          Kondisi Rata-rata
        </button>
        <button
          @click="applyPreset('critical')"
          class="px-2.5 py-1 text-xs font-semibold rounded bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
        >
          Kondisi Tertekan
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Sliders Input (7 Cols) -->
      <div class="lg:col-span-7 space-y-4">
        <!-- Slider 1: Ct (Kapasitas Kognitif) -->
        <div class="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Brain class="w-4 h-4 text-slate-700" />
              1. Kualitas Pemulihan & Konsentrasi (Kognitif)
            </span>
            <span class="font-mono font-bold text-xs text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200">
              {{ ct }}%
            </span>
          </div>
          <input
            v-model.number="ct"
            type="range"
            min="0"
            max="100"
            class="w-full accent-slate-900 cursor-pointer"
          />
          <p class="text-[11px] text-slate-500">
            Kualitas tidur semalam dan kejernihan persepsi tanpa kabut mental (brain fog).
          </p>
        </div>

        <!-- Slider 2: Kt (Keselarasan Jam Kerja) -->
        <div class="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Clock class="w-4 h-4 text-slate-700" />
              2. Keselarasan Jam Sirkadian (Peak Energy Hour)
            </span>
            <span class="font-mono font-bold text-xs text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200">
              {{ kt }}%
            </span>
          </div>
          <input
            v-model.number="kt"
            type="range"
            min="0"
            max="100"
            class="w-full accent-slate-900 cursor-pointer"
          />
          <p class="text-[11px] text-slate-500">
            Kesesuaian jam saat ini dengan ritme biologis tubuh Anda (pagi untuk early lark, malam untuk night owl).
          </p>
        </div>

        <!-- Slider 3: St (Beban Stres) -->
        <div class="p-4 rounded-lg bg-slate-50/70 border border-slate-200 space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Flame class="w-4 h-4 text-slate-700" />
              3. Beban Tekanan & Kelelahan Fisik (Stres)
            </span>
            <span class="font-mono font-bold text-xs text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200">
              {{ st }}%
            </span>
          </div>
          <input
            v-model.number="st"
            type="range"
            min="0"
            max="100"
            class="w-full accent-slate-900 cursor-pointer"
          />
          <p class="text-[11px] text-slate-500">
            Tingkat kejenuhan beban masalah atau stres eksternal yang sedang dihadapi.
          </p>
        </div>
      </div>

      <!-- Result Card (5 Cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between p-5 rounded-lg border border-slate-200 bg-white space-y-4">
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Hasil Kalkulasi Rt</span>
            <span
              class="px-2 py-0.5 text-[10px] font-bold rounded font-mono uppercase"
              :class="{
                'bg-emerald-50 text-emerald-800 border border-emerald-200': readiness.status === 'Optimal',
                'bg-amber-50 text-amber-800 border border-amber-200': readiness.status === 'Standar',
                'bg-rose-50 text-rose-800 border border-rose-200': readiness.status === 'Kritis',
              }"
            >
              {{ readiness.status === 'Optimal' ? 'Kondisi Prima' : readiness.status === 'Standar' ? 'Kondisi Cukup' : 'Kondisi Kritis' }}
            </span>
          </div>

          <div class="text-center py-3 bg-slate-50 rounded-lg border border-slate-100">
            <div
              class="text-5xl font-black font-mono tracking-tight"
              :class="{
                'text-emerald-700': readiness.status === 'Optimal',
                'text-amber-700': readiness.status === 'Standar',
                'text-rose-700': readiness.status === 'Kritis',
              }"
            >
              {{ readiness.rt }}%
            </div>
            <div class="text-[11px] text-slate-500 font-medium mt-1">Indeks Kesiapan Keputusan</div>
          </div>

          <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700">
            <div class="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 v-if="readiness.status === 'Optimal'" class="w-3.5 h-3.5 text-emerald-600" />
              <AlertTriangle v-else class="w-3.5 h-3.5 text-amber-600" />
              Rekomendasi Operasional:
            </div>
            {{ readiness.recommendation }}
          </div>
        </div>

        <div class="pt-2 border-t border-slate-100">
          <button
            @click="saveCurrentLog"
            class="btn-exec-primary w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Save class="w-3.5 h-3.5 text-slate-300" />
            <span v-if="!savedMessage">Simpan Log Kesiapan</span>
            <span v-else class="text-emerald-300">Tersimpan dalam Riwayat!</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
