<script setup lang="ts">
import type { AssessmentResult } from '../../types/hastaloka';

defineProps<{
  assessment: AssessmentResult | null;
}>();
</script>

<template>
  <div v-if="assessment" class="space-y-4">
    <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
      <h3 class="text-xs font-bold text-slate-900 uppercase tracking-wider text-left">
        Tingkat Kemiripan dengan 8 Karakter Hastaloka Lainnya:
      </h3>
      <span class="text-[11px] text-slate-400 font-mono">Tingkat Kemiripan</span>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="(match, idx) in assessment.allArchetypeMatches"
        :key="match.archetype.id"
        class="p-4 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between space-y-2.5 text-left"
        :class="idx === 0 ? 'bg-indigo-50/50 border-indigo-200 ring-2 ring-indigo-200/50' : 'bg-white border-slate-200/80 hover:bg-slate-50/60'"
      >
        <div class="flex items-start justify-between gap-2">
          <span
            class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
            :class="idx === 0 ? 'bg-indigo-600 text-white shadow-2xs' : idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-slate-100 text-slate-500'"
          >
            #{{ idx + 1 }}
          </span>
          <span class="text-xs font-mono font-bold" :class="idx === 0 ? 'text-indigo-700 font-extrabold' : 'text-slate-800'">
            {{ match.similarity }}%
          </span>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-900 tracking-tight text-left">
            {{ match.archetype.name }}
          </h4>
          <div class="text-[11px] text-slate-500 font-medium text-left">
            {{ match.archetype.indonesianName }}
          </div>
          <p class="text-[10px] text-slate-600 leading-snug line-clamp-2 mt-1 text-left">
            {{ match.archetype.role }}
          </p>
        </div>

        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="idx === 0 ? 'bg-indigo-600' : 'bg-slate-400'"
            :style="{ width: `${match.similarity}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
