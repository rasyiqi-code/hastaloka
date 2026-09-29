<script setup lang="ts">
import { ref, computed } from 'vue';
import type { AssessmentResult } from '../../types/hastaloka';
import type { SystemicDiagnosticDossier } from '../../utils/hastalokaDiagnostic';
import { ChevronDown } from '@lucide/vue';

const props = defineProps<{
  assessment: AssessmentResult | null;
  systemicDossier: SystemicDiagnosticDossier | null;
}>();

const primaryArch = computed(() => props.assessment?.primaryArchetype);

const expandedStrategicPanels = ref<string[]>(['career']);
function toggleStrategicAccordion(key: string) {
  if (expandedStrategicPanels.value.includes(key)) {
    expandedStrategicPanels.value = expandedStrategicPanels.value.filter((k) => k !== key);
  } else {
    expandedStrategicPanels.value.push(key);
  }
}
</script>

<template>
  <div v-if="primaryArch" class="space-y-0">
    <div class="flex items-center justify-between pb-2.5 border-b border-slate-200">
      <h3 class="text-sm font-bold text-slate-900 tracking-tight text-left">Panduan Praktis Pengembangan Diri</h3>
      <span class="text-[10px] text-slate-400 font-mono">Buka / Tutup</span>
    </div>

    <!-- ACCORDION: divider-separated, no box wrapper -->
    <div class="divide-y divide-slate-200">

      <!-- ACCORDION ITEM 1: KARIER & SUPERPOWER MOAT -->
      <div>
        <button
          type="button"
          @click="toggleStrategicAccordion('career')"
          class="w-full py-3 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
        >
          <div class="text-left">
            <span class="text-xs font-bold text-slate-900 block text-left">Pilihan Karier & Keunggulan Alami</span>
            <span class="text-[10px] text-slate-500 font-normal text-left">Pekerjaan yang paling cocok & peluang terbaik untuk Anda</span>
          </div>
          <ChevronDown
            class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': expandedStrategicPanels.includes('career') }"
          />
        </button>

        <div v-if="expandedStrategicPanels.includes('career')" class="pb-4 space-y-3 text-left pl-0">
          <p class="text-xs text-slate-700 leading-relaxed font-normal text-left">
            {{ primaryArch.careerStrategy }}
          </p>

          <!-- Integrated Systemic Moat & Market Niche -->
          <div v-if="systemicDossier" class="pl-3 border-l-2 border-cyan-300 space-y-1.5 text-left">
            <div class="text-xs font-bold text-slate-900 text-left leading-snug">
              {{ systemicDossier.nicheTitle }}
            </div>
            <div class="text-left">
              <span class="inline-flex px-2 py-0.5 rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 text-[9px] font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                {{ systemicDossier.nicheTag }}
              </span>
            </div>
            <p class="text-[11px] text-slate-600 leading-relaxed font-normal text-left">
              {{ systemicDossier.moatSummary }}
            </p>
          </div>
        </div>
      </div>

      <!-- ACCORDION ITEM 2: KEMAKMURAN & MODEL LEVERAGE -->
      <div>
        <button
          type="button"
          @click="toggleStrategicAccordion('wealth')"
          class="w-full py-3 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
        >
          <div class="text-left">
            <span class="text-xs font-bold text-slate-900 block text-left">Peluang Rezeki & Pengembangan Usaha</span>
            <span class="text-[10px] text-slate-500 font-normal text-left">Cara menghasilkan uang yang selaras dengan karakter Anda</span>
          </div>
          <ChevronDown
            class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': expandedStrategicPanels.includes('wealth') }"
          />
        </button>

        <div v-if="expandedStrategicPanels.includes('wealth')" class="pb-4 space-y-3 text-left">
          <p class="text-xs text-slate-700 leading-relaxed font-normal text-left">
            {{ primaryArch.wealthStrategy }}
          </p>

          <!-- Integrated Systemic Leverage Models -->
          <div v-if="systemicDossier" class="space-y-2 text-left">
            <div class="text-[10px] font-bold uppercase tracking-wider text-emerald-900 text-left">
              Pilihan Model Bisnis / Peluang Kerja yang Pas:
            </div>
            <div class="divide-y divide-slate-200">
              <div
                v-for="model in systemicDossier.leverageModels"
                :key="model.id"
                class="py-2 pl-3 border-l-2 border-emerald-300 space-y-1 text-left"
              >
                <div class="text-xs font-bold text-slate-900 text-left leading-snug">
                  {{ model.title }}
                </div>
                <div class="text-left">
                  <span class="inline-flex px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap" :class="model.badgeColor">
                    {{ model.badge }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed text-left font-normal">
                  {{ model.whyFits }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ACCORDION ITEM 3: TITIK LEMAH & PROTOKOL SABOTASE -->
      <div>
        <button
          type="button"
          @click="toggleStrategicAccordion('blindspots')"
          class="w-full py-3 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
        >
          <div class="text-left">
            <span class="text-xs font-bold text-slate-900 block text-left">Jebakan Diri & Titik Lengah</span>
            <span class="text-[10px] text-slate-500 font-normal text-left">Kebiasaan buruk bawah sadar & cara memperbaikinya</span>
          </div>
          <ChevronDown
            class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': expandedStrategicPanels.includes('blindspots') }"
          />
        </button>

        <div v-if="expandedStrategicPanels.includes('blindspots')" class="pb-4 space-y-3 text-left">
          <ul class="text-xs text-slate-700 space-y-1.5 text-left">
            <li v-for="(bs, idx) in primaryArch.blindSpots" :key="idx" class="flex items-start gap-2 text-left">
              <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <span>{{ bs }}</span>
            </li>
          </ul>

          <!-- Integrated Systemic Hazard Protocols -->
          <div v-if="systemicDossier" class="space-y-2 text-left">
            <div class="text-[10px] font-bold uppercase tracking-wider text-amber-900 text-left">
              Langkah Menghindari Kebiasaan Buruk Tersebut:
            </div>
            <div class="divide-y divide-slate-200">
              <div
                v-for="hazard in systemicDossier.hazardProtocols"
                :key="hazard.id"
                class="py-2 pl-3 border-l-2 border-amber-300 space-y-1 text-left"
              >
                <div class="text-xs font-bold text-slate-900 text-left leading-snug">
                  {{ hazard.name }}
                </div>
                <div class="text-left">
                  <span class="inline-flex px-2 py-0.5 rounded-md text-[9px] font-mono font-bold tracking-wider uppercase whitespace-nowrap" :class="hazard.riskBadgeColor">
                    Risiko {{ hazard.riskLevel }}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 leading-relaxed text-left font-normal">
                  <strong class="text-slate-800">Dampak nyata:</strong> {{ hazard.realImpact }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ACCORDION ITEM 4: RITME SIRKADIAN & DELEGASI -->
      <div>
        <button
          type="button"
          @click="toggleStrategicAccordion('circadian')"
          class="w-full py-3 flex items-center justify-between gap-2 text-left cursor-pointer transition-colors"
        >
          <div class="text-left">
            <span class="text-xs font-bold text-slate-900 block text-left">Jam Kerja Paling Fokus & Pembagian Tugas</span>
            <span class="text-[10px] text-slate-500 font-normal text-left">Waktu terbaik untuk berpikir jernih (Tipe {{ assessment?.chronotype }}) & tugas yang perlu dibantu</span>
          </div>
          <ChevronDown
            class="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': expandedStrategicPanels.includes('circadian') }"
          />
        </button>

        <div v-if="expandedStrategicPanels.includes('circadian')" class="pb-4 space-y-3 text-left">
          <div v-if="systemicDossier" class="space-y-2 text-left">
            <div class="divide-y divide-slate-200">
              <div
                v-for="item in systemicDossier.circadianSchedule"
                :key="item.id"
                class="py-2 pl-3 border-l-2 border-indigo-200 flex items-start justify-between gap-2"
              >
                <div class="space-y-0.5">
                  <span class="font-bold text-[11px] text-slate-800">{{ item.phase }}</span>
                  <p class="text-[10px] text-slate-600 leading-snug text-left">{{ item.activity }}</p>
                </div>
                <span class="font-mono text-[10px] text-indigo-600 font-bold shrink-0">{{ item.time }}</span>
              </div>
            </div>

            <div class="pt-1 space-y-1.5">
              <div class="text-[10px] font-bold uppercase tracking-wider text-rose-900">
                Tugas yang Sebaiknya Dikerjakan Orang Lain (Jangan Ditelan Sendiri):
              </div>
              <div class="divide-y divide-slate-200">
                <div
                  v-for="t in systemicDossier.delegationTasks.slice(0, 2)"
                  :key="t.id"
                  class="py-1.5 pl-3 border-l-2 border-rose-200"
                >
                  <div class="font-semibold text-slate-800 text-[11px]">{{ t.task }}</div>
                  <div class="text-[10px] text-emerald-700 font-medium">↳ {{ t.targetDelegation }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
