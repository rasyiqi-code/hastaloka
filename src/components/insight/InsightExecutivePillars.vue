<script setup lang="ts">
import type { AssessmentResult } from '../../types/hastaloka';
import type { SystemicDiagnosticDossier } from '../../utils/hastalokaDiagnostic';
import { Zap, Award, ShieldAlert, Clock } from '@lucide/vue';

defineProps<{
  assessment: AssessmentResult | null;
  systemicDossier: SystemicDiagnosticDossier | null;
  activePilar?: 1 | 2 | 3 | 4;
}>();
</script>

<template>
  <div v-if="systemicDossier" class="space-y-6">

    <!-- PILAR 01: ANATOMI SUPERPOWER -->
    <div v-if="!activePilar || activePilar === 1" class="space-y-5">
      <!-- Header -->
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shrink-0">
            <Zap class="w-4 h-4 text-white" />
          </div>
          <h4 class="text-sm font-extrabold text-slate-900 tracking-tight">
            Kelebihan Utama & Nilai Jual Diri
          </h4>
        </div>
        <span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
          Kekuatan Utama
        </span>
      </div>

      <!-- Niche Summary -->
      <div class="pl-4 border-l-2 border-indigo-300 space-y-1">
        <div class="text-xs font-bold text-indigo-900">{{ systemicDossier.nicheTitle }}</div>
        <span class="inline-flex px-2.5 py-0.5 rounded-full bg-white text-indigo-700 border border-indigo-200 text-[10px] font-mono font-bold">
          {{ systemicDossier.nicheTag }}
        </span>
        <p class="text-xs text-slate-600 leading-relaxed font-normal">{{ systemicDossier.moatSummary }}</p>
      </div>

      <!-- Vector Moats: clean divider list, no grid -->
      <div>
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Penjelasan 5 Karakter Kekuatan Anda:</span>
          <span class="text-[10px] text-slate-400 font-mono">Bakat Alami</span>
        </div>
        <div class="divide-y divide-slate-200">
          <div
            v-for="vMoat in systemicDossier.vectorMoats"
            :key="vMoat.key"
            class="py-3.5 flex items-start gap-4"
          >
            <!-- Score column -->
            <div class="shrink-0 text-right w-10">
              <span class="font-mono text-sm font-bold text-slate-800">{{ vMoat.score }}%</span>
            </div>
            <!-- Content column -->
            <div class="flex-1 space-y-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-slate-900">{{ vMoat.name }}</span>
                <span class="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap" :class="vMoat.badgeColor">{{ vMoat.badge }}</span>
              </div>
              <p class="text-[11px] text-slate-500 leading-relaxed">{{ vMoat.rarityInMarket }}</p>
              <p class="text-[11px] text-slate-800 font-semibold leading-relaxed">{{ vMoat.economicMoat }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PILAR 02: MODEL MONETISASI -->
    <div v-if="!activePilar || activePilar === 2" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shrink-0">
            <Award class="w-4 h-4 text-white" />
          </div>
          <h4 class="text-sm font-extrabold text-slate-900 tracking-tight">
            Peluang Rezeki & Jalur Penghasilan
          </h4>
        </div>
        <span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
          Peluang Cuan
        </span>
      </div>

      <div class="divide-y divide-slate-200">
        <div
          v-for="model in systemicDossier.leverageModels"
          :key="model.id"
          class="py-4 space-y-2"
        >
          <div class="flex items-start justify-between gap-3">
            <h5 class="text-sm font-bold text-slate-900 leading-snug">{{ model.title }}</h5>
            <span class="inline-flex px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider shrink-0" :class="model.badgeColor">
              {{ model.badge }}
            </span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed font-normal">{{ model.whyFits }}</p>
          <div class="space-y-1 pt-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Langkah Praktis yang Bisa Dijalankan:</span>
            <ul class="space-y-1 text-slate-700">
              <li v-for="(step, sIdx) in model.steps" :key="sIdx" class="flex items-start gap-2">
                <span class="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono text-[9px] font-bold shrink-0 mt-0.5">
                  {{ sIdx + 1 }}
                </span>
                <span class="text-[11px] leading-tight">{{ step }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- PILAR 03: POLA SABOTASE DIRI -->
    <div v-if="!activePilar || activePilar === 3" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 text-white flex items-center justify-center shrink-0">
            <ShieldAlert class="w-4 h-4 text-white" />
          </div>
          <h4 class="text-sm font-extrabold text-slate-900 tracking-tight">
            Jebakan Diri & Titik Lengah (Cara Mengatasinya)
          </h4>
        </div>
        <span class="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/70 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
          Waspada
        </span>
      </div>

      <div class="pl-4 border-l-2 border-rose-300">
        <p class="text-xs text-slate-700 leading-relaxed font-normal">
          Setiap kelebihan alami selalu menyimpan sisi bayangan jika tidak disadari. Kenali titik lengah bawah sadar Anda di bawah ini dan ikuti 3 langkah mudah agar tidak menghambat langkah Anda.
        </p>
      </div>

      <div class="divide-y divide-slate-200">
        <div
          v-for="hazard in systemicDossier.hazardProtocols"
          :key="hazard.id"
          class="py-4 space-y-2"
        >
          <div class="flex items-start justify-between gap-3">
            <h5 class="text-sm font-bold text-slate-900 leading-snug">{{ hazard.name }}</h5>
            <span class="inline-flex px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase shrink-0" :class="hazard.riskBadgeColor">
              Risiko {{ hazard.riskLevel }}
            </span>
          </div>
          <p class="text-[11px] text-slate-600 leading-relaxed font-normal">{{ hazard.realImpact }}</p>
          <div class="space-y-1.5 pt-1">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">3 Langkah Mengatasinya:</span>
            <div class="space-y-2">
              <div
                v-for="st in hazard.steps"
                :key="st.num"
                class="flex items-start gap-2.5"
              >
                <span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-mono font-bold shrink-0 mt-0.5">L{{ st.num }}</span>
                <div class="space-y-0.5">
                  <div class="font-bold text-slate-900 text-[11px]">{{ st.title }}</div>
                  <p class="text-[11px] text-slate-600 leading-relaxed font-normal">{{ st.action }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- PILAR 04: RITME SIRKADIAN & MATRIKS DELEGASI -->
    <div v-if="!activePilar || activePilar === 4" class="space-y-5">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 text-white flex items-center justify-center shrink-0">
            <Clock class="w-4 h-4 text-white" />
          </div>
          <h4 class="text-sm font-extrabold text-slate-900 tracking-tight">
            Jam Kerja Paling Produktif & Pembagian Tugas
          </h4>
        </div>
        <span class="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0">
          Jam Biologis
        </span>
      </div>

      <!-- Circadian Schedule -->
      <div>
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Rekomendasi Jadwal Kerja Harian (Tipe {{ assessment?.chronotype || 'Owl' }}):</span>
          <span class="text-[10px] text-slate-400 font-mono">Ritme Tubuh</span>
        </div>
        <div class="divide-y divide-slate-200">
          <div
            v-for="block in systemicDossier.circadianSchedule"
            :key="block.id"
            class="py-3 flex items-start gap-4"
          >
            <div class="shrink-0 text-right min-w-[5.5rem]">
              <span class="font-mono text-xs font-bold text-indigo-700 block">{{ block.time }}</span>
            </div>
            <div class="space-y-0.5 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs font-bold text-slate-900">{{ block.phase }}</span>
                <span
                  class="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold whitespace-nowrap"
                  :class="block.isPeak ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'"
                >{{ block.badge }}</span>
              </div>
              <div class="text-[11px] text-slate-700 leading-snug">{{ block.activity }}</div>
              <div class="text-[10px] text-slate-500 leading-relaxed">{{ block.guidance }}</div>
            </div>

          </div>
        </div>
      </div>

      <!-- Matriks Delegasi -->
      <div class="pt-2 border-t border-slate-200">
        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
          <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Tugas yang Sebaiknya Dikerjakan Orang Lain (Biar Gak Cepat Lelah):</span>
          <span class="text-[10px] text-slate-400 font-mono">Cegah Capek Berlebihan</span>
        </div>
        <div class="divide-y divide-slate-200">
          <div
            v-for="task in systemicDossier.delegationTasks"
            :key="task.id"
            class="py-3 flex items-start gap-3 text-xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <div class="space-y-0.5 flex-1">
              <div class="font-bold text-slate-900 leading-snug">{{ task.task }}</div>
              <div class="text-[11px] text-slate-500 leading-relaxed">
                <strong class="text-slate-700">Kenapa kurang cocok buat Anda:</strong> {{ task.whyUnfit }}
              </div>
              <div class="text-[11px] text-emerald-800 font-medium">
                <strong class="text-emerald-900">Solusi terbaik:</strong> {{ task.targetDelegation }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
