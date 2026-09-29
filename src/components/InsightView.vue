<script setup lang="ts">
import { ref, computed } from 'vue';
import { FileText } from '@lucide/vue';
import { getSystemicDiagnostic } from '../utils/hastalokaDiagnostic';
import type { AssessmentResult } from '../types/hastaloka';
import InsightVectorMap from './insight/InsightVectorMap.vue';
import InsightStrategicPlaybook from './insight/InsightStrategicPlaybook.vue';
import InsightPartnerSynergy from './insight/InsightPartnerSynergy.vue';
import InsightExecutivePillars from './insight/InsightExecutivePillars.vue';
import InsightArchetypeBenchmark from './insight/InsightArchetypeBenchmark.vue';

const props = defineProps<{
  assessment: AssessmentResult | null;
}>();

const emit = defineEmits<{
  (e: 'open-report'): void;
  (e: 'open-settings'): void;
}>();

const systemicDossier = computed(() => getSystemicDiagnostic(props.assessment));

type Tab = 'vectors' | 'pilar1' | 'pilar2' | 'pilar3' | 'pilar4' | 'benchmark';
const activeTab = ref<Tab>('vectors');

const tabs: { key: Tab; label: string }[] = [
  { key: 'vectors',    label: '5 Kekuatan Diri'  },
  { key: 'pilar1',    label: 'Kelebihan Utama'   },
  { key: 'pilar2',    label: 'Peluang Rezeki'    },
  { key: 'pilar3',    label: 'Jebakan Diri'      },
  { key: 'pilar4',    label: 'Jam Produktif'     },
  { key: 'benchmark', label: 'Karakter Lain'     },
];

const pilarMap: Record<string, 1 | 2 | 3 | 4 | undefined> = {
  pilar1: 1, pilar2: 2, pilar3: 3, pilar4: 4,
};
</script>

<template>
  <div class="space-y-4">
    <!-- Top Header & Export -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-4 sm:px-0 sm:pt-0">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight">Insight Diagnostik & Analisis Strategis</h2>
        <p class="text-xs text-slate-500 font-normal">Penjelasan mudah dipahami tentang kekuatan alami, peluang rezeki, kebiasaan buruk yang perlu dicegah, dan jam kerja terbaik Anda.</p>
      </div>
      <button
        @click="emit('open-report')"
        class="btn-exec-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-xs"
      >
        <FileText class="w-3.5 h-3.5 text-slate-600" />
        <span>Ekspor Dokumen PDF</span>
      </button>
    </div>

    <!-- UNIFIED CARD CONTAINER (Full edge on mobile, container on desktop) -->
    <div class="bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 shadow-none sm:shadow-sm overflow-hidden border-t border-b sm:border-t-0 sm:border-b-0">

      <!-- Tab Bar — horizontal scroll on mobile -->
      <div class="flex overflow-x-auto border-b-2 border-slate-200 px-4 pt-3 gap-0 scrollbar-none">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="relative flex flex-col items-start px-3.5 pb-3 pt-1 shrink-0 text-left cursor-pointer transition-colors group"
          :class="activeTab === tab.key ? 'text-indigo-700' : 'text-slate-500 hover:text-slate-700'"
        >
          <span class="text-xs font-bold leading-tight whitespace-nowrap">{{ tab.label }}</span>
          <!-- Active Indicator -->
          <span
            class="absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full transition-all duration-200"
            :class="activeTab === tab.key ? 'bg-indigo-600' : 'bg-transparent group-hover:bg-slate-200'"
          ></span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="p-6 sm:p-8">

        <!-- TAB: ANALISIS VEKTOR -->
        <div v-if="activeTab === 'vectors'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div class="lg:col-span-6">
            <InsightVectorMap
              :assessment="assessment"
              :systemic-dossier="systemicDossier"
            />
          </div>
          <div class="lg:col-span-6 lg:border-l-2 lg:border-slate-200 lg:pl-8 space-y-0">
            <InsightStrategicPlaybook
              :assessment="assessment"
              :systemic-dossier="systemicDossier"
            />
            <InsightPartnerSynergy
              :assessment="assessment"
            />
          </div>
        </div>

        <!-- TABS: PILAR 01-04 (shared component, filtered by activePilar) -->
        <div v-else-if="activeTab === 'pilar1' || activeTab === 'pilar2' || activeTab === 'pilar3' || activeTab === 'pilar4'">
          <InsightExecutivePillars
            :assessment="assessment"
            :systemic-dossier="systemicDossier"
            :active-pilar="pilarMap[activeTab]"
          />
        </div>

        <!-- TAB: BENCHMARK ARKETIPE -->
        <div v-else-if="activeTab === 'benchmark' && assessment">
          <InsightArchetypeBenchmark
            :assessment="assessment"
          />
        </div>
        <div v-else-if="activeTab === 'benchmark'" class="py-12 text-center text-sm text-slate-400">
          Selesaikan assessment terlebih dahulu untuk melihat benchmark arketipe.
        </div>

      </div>
    </div>
  </div>
</template>
