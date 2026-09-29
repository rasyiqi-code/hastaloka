<script setup lang="ts">
import { ref, computed } from 'vue';
import { Users2, ArrowRightLeft, AlertTriangle, CheckCircle2 } from '@lucide/vue';
import { HASTALOKA_ARCHETYPES } from '../data/hastalokaData';
import { getArchetypeSynergy } from '../utils/hastalokaMath';

const props = defineProps<{
  initialArchetypeAId?: string;
}>();

const archetypeAId = ref(props.initialArchetypeAId || 'catalyst');
const archetypeBId = ref('mechanic');

const archetypeA = computed(() => {
  return HASTALOKA_ARCHETYPES.find((a) => a.id === archetypeAId.value) || HASTALOKA_ARCHETYPES[0];
});

const archetypeB = computed(() => {
  return HASTALOKA_ARCHETYPES.find((a) => a.id === archetypeBId.value) || HASTALOKA_ARCHETYPES[3];
});

const synergy = computed(() => {
  return getArchetypeSynergy(archetypeAId.value, archetypeBId.value);
});

function swapArchetypes() {
  const temp = archetypeAId.value;
  archetypeAId.value = archetypeBId.value;
  archetypeBId.value = temp;
}
</script>

<template>
  <div class="exec-card p-6 bg-white border border-slate-200 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
        <Users2 class="w-4 h-4 text-slate-700" />
      </div>
      <div>
        <h3 class="text-base font-bold text-slate-900 tracking-tight">Analisis Sinergi & Kompatibilitas Antar-Arketipe</h3>
        <p class="text-xs text-slate-500 font-normal">Identifikasi friksi komunikasi, risiko delegasi, dan protokol kerja sama mutualistis</p>
      </div>
    </div>

    <!-- Selectors -->
    <div class="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-center">
      <!-- Arketipe Pihak 1 -->
      <div class="md:col-span-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Pihak Pertama (Profil Anda)
        </label>
        <select
          v-model="archetypeAId"
          class="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
        >
          <option v-for="arch in HASTALOKA_ARCHETYPES" :key="arch.id" :value="arch.id">
            {{ arch.name }} ({{ arch.indonesianName }})
          </option>
        </select>
        <div class="text-[11px] text-slate-600 font-medium">
          Vektor Dominan: {{ archetypeA.vectorDominance }}
        </div>
      </div>

      <!-- Swap Button -->
      <div class="flex justify-center">
        <button
          @click="swapArchetypes"
          title="Tukar Posisi"
          class="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <ArrowRightLeft class="w-4 h-4" />
        </button>
      </div>

      <!-- Arketipe Pihak 2 -->
      <div class="md:col-span-2 p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
        <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Pihak Kedua (Partner / Pasangan)
        </label>
        <select
          v-model="archetypeBId"
          class="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded text-slate-900 focus:outline-none focus:border-slate-900 shadow-2xs"
        >
          <option v-for="arch in HASTALOKA_ARCHETYPES" :key="arch.id" :value="arch.id">
            {{ arch.name }} ({{ arch.indonesianName }})
          </option>
        </select>
        <div class="text-[11px] text-slate-600 font-medium">
          Vektor Dominan: {{ archetypeB.vectorDominance }}
        </div>
      </div>
    </div>

    <!-- Synergy Result Box -->
    <div class="p-5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3.5">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div class="flex items-center gap-2">
          <span
            class="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider font-mono"
            :class="{
              'bg-emerald-100 text-emerald-800 border border-emerald-300': synergy.type === 'Tinggi',
              'bg-rose-100 text-rose-800 border border-rose-300': synergy.type === 'Rawan Gesekan',
              'bg-blue-100 text-blue-800 border border-blue-300': synergy.type === 'Netral Komplementer',
            }"
          >
            {{ synergy.type === 'Tinggi' ? 'Sinergi Tinggi' : synergy.type === 'Rawan Gesekan' ? 'Risiko Friksi Tinggi' : 'Komplementer Saling Isi' }}
          </span>
          <h4 class="text-sm font-bold text-slate-900">{{ synergy.tagline }}</h4>
        </div>
        <div class="text-xs text-slate-500 font-mono">
          {{ archetypeA.name }} × {{ archetypeB.name }}
        </div>
      </div>

      <p class="text-xs leading-relaxed text-slate-700 font-normal">
        {{ synergy.description }}
      </p>

      <!-- Protokol Khusus jika ada -->
      <div v-if="synergy.protocol" class="p-3.5 rounded-lg bg-white border border-slate-200 space-y-1">
        <div class="text-[11px] font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
          <AlertTriangle class="w-3.5 h-3.5 text-amber-600" />
          Protokol Mitigasi & Kesepakatan Bersama:
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">
          {{ synergy.protocol }}
        </p>
      </div>
    </div>
  </div>
</template>
