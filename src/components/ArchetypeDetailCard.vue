<script setup lang="ts">
import { ref } from 'vue';
import type { ArchetypeMatch } from '../types/hastaloka';
import {
  ShieldAlert,
  Award,
  TrendingUp,
  Clock,
  Compass,
  CheckCircle2,
  AlertCircle
} from '@lucide/vue';

const props = defineProps<{
  primaryMatch: ArchetypeMatch;
  secondaryMatch?: ArchetypeMatch | null;
}>();

const activeTab = ref<'overview' | 'career' | 'blindspots'>('overview');
</script>

<template>
  <div class="card-clean p-6 sm:p-7 rounded-2xl space-y-6">
    <!-- Header Card -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="px-2.5 py-0.5 text-xs font-bold font-mono rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider">
            Tipe Kepribadian Utama
          </span>
          <span class="text-xs font-bold text-emerald-700 font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
            {{ primaryMatch.similarity }}% Sangat Cocok
          </span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-baseline gap-2">
          {{ primaryMatch.archetype.name }}
          <span class="text-base sm:text-lg font-bold text-slate-500">
            — {{ primaryMatch.archetype.indonesianName }}
          </span>
        </h2>
        <p class="text-xs text-indigo-700 font-medium mt-1">
          Kekuatan Dominan: {{ primaryMatch.archetype.vectorDominance }}
        </p>
      </div>

      <!-- Arketipe Sekunder Badge jika ada -->
      <div v-if="secondaryMatch" class="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-left md:text-right self-start md:self-auto shadow-2xs">
        <span class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Tipe Pendukung (Sekunder)</span>
        <div class="text-sm font-extrabold text-slate-800 mt-0.5">
          {{ secondaryMatch.archetype.name }} ({{ secondaryMatch.similarity }}%)
        </div>
        <span class="text-[11px] text-slate-600 font-medium">{{ secondaryMatch.archetype.indonesianName }}</span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-sm">
      <button
        @click="activeTab = 'overview'"
        class="pb-3 px-1 font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'overview' ? 'text-indigo-700 border-b-2 border-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'"
      >
        <Award class="w-4 h-4" /> Ikhtisar & Kelebihan Diri
      </button>
      <button
        @click="activeTab = 'career'"
        class="pb-3 px-1 font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'career' ? 'text-indigo-700 border-b-2 border-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'"
      >
        <TrendingUp class="w-4 h-4" /> Karier & Jalan Cuan
      </button>
      <button
        @click="activeTab = 'blindspots'"
        class="pb-3 px-1 font-bold transition-all relative flex items-center gap-2 whitespace-nowrap cursor-pointer"
        :class="activeTab === 'blindspots' ? 'text-indigo-700 border-b-2 border-indigo-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'"
      >
        <ShieldAlert class="w-4 h-4" /> Titik Lemah & Jam Kerja
      </button>
    </div>

    <!-- Tab 1: Overview -->
    <div v-if="activeTab === 'overview'" class="space-y-5">
      <p class="text-sm leading-relaxed text-slate-700 font-medium">
        {{ primaryMatch.archetype.description }}
      </p>

      <div class="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
        <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5 flex items-center gap-1.5">
          <Compass class="w-4 h-4" /> Peran Utama yang Paling Alami Bagi Anda:
        </h4>
        <p class="text-sm font-semibold text-slate-900 leading-snug">
          "{{ primaryMatch.archetype.role }}"
        </p>
      </div>

      <div>
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Kekuatan Terbesar yang Bisa Diandalkan:
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            v-for="(st, idx) in primaryMatch.archetype.strengths"
            :key="idx"
            class="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 shadow-2xs"
          >
            <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span class="text-xs text-slate-800 font-medium leading-relaxed">{{ st }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Karier & Kemakmuran -->
    <div v-else-if="activeTab === 'career'" class="space-y-4">
      <div class="p-5 rounded-xl bg-cyan-50/60 border border-cyan-200/70 space-y-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-cyan-900 flex items-center gap-2">
          <TrendingUp class="w-4 h-4 text-cyan-700" /> Karier & Posisi Pekerjaan yang Paling Cocok
        </h4>
        <p class="text-sm text-slate-800 leading-relaxed font-medium">
          {{ primaryMatch.archetype.careerStrategy }}
        </p>
      </div>

      <div class="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-2">
          <Award class="w-4 h-4 text-emerald-700" /> Cara Terbaik Mengumpulkan Uang & Kemakmuran (Jalan Cuan)
        </h4>
        <p class="text-sm text-slate-800 leading-relaxed font-medium">
          {{ primaryMatch.archetype.wealthStrategy }}
        </p>
      </div>
    </div>

    <!-- Tab 3: Titik Lemah & Sirkadian -->
    <div v-else class="space-y-4">
      <div class="p-5 rounded-xl bg-rose-50/70 border border-rose-200/80 space-y-2.5">
        <h4 class="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-2">
          <AlertCircle class="w-4 h-4 text-rose-600" /> Titik Lemah / Jebakan yang Harus Anda Waspadai
        </h4>
        <ul class="space-y-2 pt-1">
          <li
            v-for="(bs, idx) in primaryMatch.archetype.blindSpots"
            :key="idx"
            class="text-xs text-slate-800 font-medium flex items-start gap-2.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
            <span>{{ bs }}</span>
          </li>
        </ul>
      </div>

      <div class="p-5 rounded-xl bg-indigo-50/60 border border-indigo-200/70 space-y-2">
        <h4 class="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
          <Clock class="w-4 h-4 text-indigo-600" /> Ritme Jam Kerja Paling Efektif
        </h4>
        <p class="text-sm text-slate-800 leading-relaxed font-medium">
          {{ primaryMatch.archetype.circadianGuidance }}
        </p>
      </div>
    </div>
  </div>
</template>
