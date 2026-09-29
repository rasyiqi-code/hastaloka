<script setup lang="ts">
import { ref, computed } from 'vue';
import RadarChart from '../RadarChart.vue';
import type { AssessmentResult } from '../../types/hastaloka';
import type { SystemicDiagnosticDossier } from '../../utils/hastalokaDiagnostic';
import { BarChart3, ChevronDown } from '@lucide/vue';

const props = defineProps<{
  assessment: AssessmentResult | null;
  systemicDossier: SystemicDiagnosticDossier | null;
}>();

const primaryArch = computed(() => props.assessment?.primaryArchetype);

const expandedVectors = ref<string[]>(['drive']);
function toggleVectorAccordion(key: string) {
  if (expandedVectors.value.includes(key)) {
    expandedVectors.value = expandedVectors.value.filter((k) => k !== key);
  } else {
    expandedVectors.value.push(key);
  }
}

const vectorMetrics = computed(() => {
  if (!props.assessment) return [];
  const v = props.assessment.vectorScores;
  const d = props.systemicDossier;
  return [
    {
      key: 'drive' as const,
      label: 'Daya Aksi (Keberanian Memulai)',
      val: v.drive,
      tier: v.drive >= 75 ? 'Sangat Tinggi' : v.drive >= 50 ? 'Cukup Baik' : 'Perlu Didukung',
      desc: 'Seberapa berani dan cepat Anda langsung bertindak memulai hal baru tanpa ragu-ragu.',
      moat: d?.vectorMoats.find((m) => m.key === 'drive')
    },
    {
      key: 'adaptability' as const,
      label: 'Kelenturan (Mudah Menyesuaikan Diri)',
      val: v.adaptability,
      tier: v.adaptability >= 75 ? 'Sangat Tinggi' : v.adaptability >= 50 ? 'Cukup Baik' : 'Perlu Didukung',
      desc: 'Seberapa luwes Anda menghadapi perubahan mendadak tanpa panik atau kaget.',
      moat: d?.vectorMoats.find((m) => m.key === 'adaptability')
    },
    {
      key: 'stability' as const,
      label: 'Keteraturan (Rapi & Disiplin)',
      val: v.stability,
      tier: v.stability >= 75 ? 'Sangat Tinggi' : v.stability >= 50 ? 'Cukup Baik' : 'Perlu Bantuan Partner',
      desc: 'Ketelitian dalam menjaga jadwal, kepatuhan pada aturan, dan konsistensi kerja rutin.',
      moat: d?.vectorMoats.find((m) => m.key === 'stability')
    },
    {
      key: 'synthesis' as const,
      label: 'Visi Pola (Melihat Gambaran Besar)',
      val: v.synthesis,
      tier: v.synthesis >= 75 ? 'Sangat Tinggi' : v.synthesis >= 50 ? 'Cukup Baik' : 'Perlu Didukung',
      desc: 'Kemampuan membaca peluang masa depan dan menyambungkan berbagai ide rumit.',
      moat: d?.vectorMoats.find((m) => m.key === 'synthesis')
    },
    {
      key: 'connectivity' as const,
      label: 'Relasi Sosial (Mudah Bergaul & Bekerja Sama)',
      val: v.connectivity,
      tier: v.connectivity >= 75 ? 'Sangat Tinggi' : v.connectivity >= 50 ? 'Cukup Baik' : 'Perlu Didukung',
      desc: 'Kemampuan menjalin hubungan akrab, meyakinkan orang lain, dan merangkul kerja sama tim.',
      moat: d?.vectorMoats.find((m) => m.key === 'connectivity')
    },
  ];
});
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between pb-3 border-b border-slate-200">
      <div class="flex items-center gap-2">
        <BarChart3 class="w-4 h-4 text-indigo-600" />
        <h3 class="text-sm font-bold text-slate-900 tracking-tight">Peta 5 Kekuatan Karakter Anda</h3>
      </div>
      <span class="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
        Kecocokan: {{ assessment?.allArchetypeMatches[0]?.similarity || 98 }}%
      </span>
    </div>

    <!-- Radar Chart -->
    <div class="flex justify-center py-2">
      <RadarChart
        v-if="assessment && primaryArch"
        :user-scores="assessment.vectorScores"
        :compare-scores="primaryArch.idealVector"
        :compare-label="`Ideal ${primaryArch.name}`"
        :size="260"
      />
    </div>

    <!-- 5 Vektor Metrics List: divider-separated, no boxes -->
    <div class="divide-y divide-slate-200">
      <div
        v-for="item in vectorMetrics"
        :key="item.key"
        class="py-3 space-y-2"
      >
        <div class="flex items-center justify-between text-xs">
          <span class="font-bold text-slate-900">{{ item.label }}</span>
          <div class="flex items-center gap-1.5">
            <span class="text-[10px] text-indigo-700 font-bold px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100/80">
              {{ item.tier }}
            </span>
            <span class="font-mono font-bold text-slate-900 text-xs w-8 text-right">
              {{ item.val }}%
            </span>
          </div>
        </div>
        <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500" :style="{ width: `${item.val}%` }"></div>
        </div>
        <p class="text-[11px] text-slate-500 leading-tight">
          {{ item.desc }}
        </p>

        <!-- Moat Accordion Toggle -->
        <div v-if="item.moat" class="pt-0.5">
          <button
            type="button"
            @click="toggleVectorAccordion(item.key)"
            class="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-600 cursor-pointer transition-colors text-left hover:text-slate-900"
          >
            <span class="text-left font-semibold text-slate-700">Lihat Keunggulan & Solusi Karakter Ini</span>
            <div class="flex items-center gap-1 shrink-0">
              <span class="text-[10px] text-slate-400 font-medium">
                {{ expandedVectors.includes(item.key) ? 'Tutup' : 'Buka' }}
              </span>
              <ChevronDown
                class="w-3 h-3 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedVectors.includes(item.key) }"
              />
            </div>
          </button>

          <!-- Accordion Content -->
          <div
            v-if="expandedVectors.includes(item.key)"
            class="mt-1.5 pl-3 border-l-2 border-indigo-200 space-y-2 text-xs text-left"
          >
            <div class="space-y-0.5">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Keunikan Karakter Anda:</span>
              <p class="text-xs text-slate-700 leading-relaxed font-normal">
                {{ item.moat.rarityInMarket }}
              </p>
            </div>
            <div class="space-y-0.5">
              <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {{ item.moat.isLow ? 'Cara Mengatasi / Solusi:' : 'Keuntungan Nyata dalam Karier/Bisnis:' }}
              </span>
              <p class="text-xs text-slate-900 leading-relaxed font-medium">
                {{ item.moat.economicMoat }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
