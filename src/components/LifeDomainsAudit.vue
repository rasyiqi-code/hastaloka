<script setup lang="ts">
import { ref } from 'vue';
import { Layers, CheckCircle2 } from '@lucide/vue';
import { HASTALOKA_LIFE_DOMAINS } from '../data/hastalokaData';

// User ratings for 12 domains (1 - 10)
const domainRatings = ref<Record<number, number>>({
  1: 8, 2: 7, 3: 8, 4: 7,
  5: 8, 6: 7, 7: 9, 8: 8,
  9: 8, 10: 8, 11: 6, 12: 9
});

const categories = ['Fisik & Energi', 'Kognisi & Psikologis', 'Karier & Finansial', 'Relasi & Makna'] as const;

function getDomainsByCategory(category: string) {
  return HASTALOKA_LIFE_DOMAINS.filter((d) => d.category === category);
}
</script>

<template>
  <div class="exec-card p-6 bg-white border border-slate-200 space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
      <div class="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
        <Layers class="w-4 h-4 text-slate-700" />
      </div>
      <div>
        <h3 class="text-base font-bold text-slate-900 tracking-tight">Audit Komprehensif 12 Domain Kehidupan</h3>
        <p class="text-xs text-slate-500 font-normal">Pemetaan holistik 12 pilar keseimbangan hidup dan kinerja operasional jangka panjang</p>
      </div>
    </div>

    <!-- Domain Categories Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="cat in categories"
        :key="cat"
        class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3.5"
      >
        <div class="flex items-center justify-between border-b border-slate-200 pb-2">
          <h4 class="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
            Kategori: {{ cat }}
          </h4>
        </div>

        <div class="space-y-3">
          <div
            v-for="domain in getDomainsByCategory(cat)"
            :key="domain.id"
            class="p-3.5 rounded-lg bg-white border border-slate-200 space-y-2 shadow-xs"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-4 h-4 rounded bg-slate-100 text-slate-700 font-mono text-[10px] flex items-center justify-center font-bold border border-slate-200">
                  {{ domain.id }}
                </span>
                <span class="text-xs font-bold text-slate-900">{{ domain.name }}</span>
              </div>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-mono font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  Indeks: {{ domainRatings[domain.id] }} / 10
                </span>
              </div>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed font-normal">
              {{ domain.description }}
            </p>

            <!-- Audit Checklist Aspects -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span
                v-for="(aspect, idx) in domain.auditAspects"
                :key="idx"
                class="px-2 py-0.5 text-[10px] rounded bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1 font-medium"
              >
                <CheckCircle2 class="w-3 h-3 text-slate-500" />
                {{ aspect }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
