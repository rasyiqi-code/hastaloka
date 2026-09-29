<script setup lang="ts">
import {
  Home,
  Bot,
  Sparkles,
  FileText,
  Info
} from '@lucide/vue';

const props = defineProps<{
  activeTab: 'home' | 'insight' | 'copilot';
  hasAssessment: boolean;
}>();

const emit = defineEmits<{
  (e: 'navigate', tab: 'home' | 'insight' | 'copilot'): void;
  (e: 'open-assessment'): void;
  (e: 'open-report'): void;
  (e: 'open-about'): void;
}>();

function handleTabClick(tab: 'home' | 'insight' | 'copilot') {
  if (!props.hasAssessment) {
    emit('open-assessment');
  } else {
    emit('navigate', tab);
  }
}

function handleReportClick() {
  if (!props.hasAssessment) {
    emit('open-assessment');
  } else {
    emit('open-report');
  }
}
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl transition-all"
    style="padding-bottom: env(safe-area-inset-bottom, 0px);"
  >
    <div class="grid grid-cols-5 h-16 items-center px-1">
      <!-- 1. Beranda -->
      <button
        @click="handleTabClick('home')"
        class="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-colors cursor-pointer select-none"
        :class="activeTab === 'home' && hasAssessment ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'"
      >
        <div class="relative">
          <Home class="w-5 h-5" :class="activeTab === 'home' && hasAssessment ? 'stroke-[2.5]' : 'stroke-2'" />
          <span
            v-if="activeTab === 'home' && hasAssessment"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600"
          ></span>
        </div>
        <span class="text-[10px] tracking-tight leading-none">Beranda</span>
      </button>

      <!-- 2. Hastaloka AI Copilot -->
      <button
        @click="handleTabClick('copilot')"
        class="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-colors cursor-pointer select-none relative"
        :class="activeTab === 'copilot' && hasAssessment ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'"
      >
        <div class="relative">
          <Bot class="w-5 h-5" :class="activeTab === 'copilot' && hasAssessment ? 'stroke-[2.5]' : 'stroke-2'" />
          <span
            class="absolute -top-1.5 -right-3 text-[8px] font-bold px-1 rounded bg-indigo-100 text-indigo-700 leading-tight"
          >
            AI
          </span>
          <span
            v-if="activeTab === 'copilot' && hasAssessment"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600"
          ></span>
        </div>
        <span class="text-[10px] tracking-tight leading-none">Copilot</span>
      </button>

      <!-- 3. Insight & Vektor H5V -->
      <button
        @click="handleTabClick('insight')"
        class="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-colors cursor-pointer select-none"
        :class="activeTab === 'insight' && hasAssessment ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'"
      >
        <div class="relative">
          <Sparkles class="w-5 h-5" :class="activeTab === 'insight' && hasAssessment ? 'stroke-[2.5]' : 'stroke-2'" />
          <span
            v-if="activeTab === 'insight' && hasAssessment"
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600"
          ></span>
        </div>
        <span class="text-[10px] tracking-tight leading-none">Insight</span>
      </button>

      <!-- 4. Laporan PDF -->
      <button
        @click="handleReportClick"
        class="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-colors cursor-pointer select-none"
        :class="hasAssessment ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-300 opacity-60'"
      >
        <FileText class="w-5 h-5 stroke-2" />
        <span class="text-[10px] tracking-tight leading-none">Laporan</span>
      </button>

      <!-- 5. Tentang Hastaloka -->
      <button
        @click="emit('open-about')"
        class="flex flex-col items-center justify-center gap-1 h-full py-1 text-center text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer select-none"
      >
        <Info class="w-5 h-5 stroke-2" />
        <span class="text-[10px] tracking-tight leading-none">Tentang</span>
      </button>
    </div>
  </nav>
</template>
