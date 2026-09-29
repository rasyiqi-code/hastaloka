<script setup lang="ts">
import {
  Compass,
  FileText,
  PlayCircle,
  Settings,
  Sparkles,
  Bot,
  Home
} from '@lucide/vue';
defineProps<{
  activeTab: 'home' | 'insight' | 'copilot';
  hasAssessment: boolean;
  subjectName?: string;
  archetypeName?: string;
  matchScore?: number;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'home' | 'insight' | 'copilot'): void;
  (e: 'open-assessment'): void;
  (e: 'open-report'): void;
  (e: 'open-settings'): void;
}>();

const navTabs = [
  { id: 'home' as const, label: 'Beranda', icon: Home },
  { id: 'insight' as const, label: 'Insight', icon: Sparkles },
  { id: 'copilot' as const, label: 'Copilot', icon: Bot, isBadge: 'AI' },
];

function selectTab(id: 'home' | 'insight' | 'copilot') {
  emit('update:activeTab', id);
}
</script>

<template>
  <header class="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
      <!-- App Brand Logo & Title -->
      <div class="flex items-center gap-3 cursor-pointer shrink-0" @click="selectTab('home')">
        <div class="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
          <Compass class="w-5 h-5 text-slate-100" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-base font-extrabold tracking-tight text-slate-900 font-sans">HASTALOKA</span>
            <span class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              Decision OS
            </span>
          </div>
          <span class="text-[11px] text-slate-500 font-medium block -mt-0.5">Sistem Diagnostik & Navigasi Keputusan</span>
        </div>
      </div>

      <!-- Center 3 Tabs: Beranda, Insight, Copilot -->
      <nav class="hidden md:flex items-center bg-slate-100/90 p-1 rounded-lg border border-slate-200">
        <button
          v-for="tab in navTabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          class="px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
          :class="
            activeTab === tab.id
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
          "
        >
          <component :is="tab.icon" class="w-3.5 h-3.5" :class="activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'" />
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.isBadge"
            class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded leading-none"
            :class="activeTab === tab.id ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-200 text-slate-600'"
          >
            {{ tab.isBadge }}
          </span>
        </button>
      </nav>

      <!-- Right Action Controls -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- PDF Export Button -->
        <button
          v-if="hasAssessment"
          @click="emit('open-report')"
          class="btn-exec-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          title="Unduh / Cetak Laporan Lengkap"
        >
          <FileText class="w-3.5 h-3.5 text-slate-600" />
          <span class="hidden sm:inline">Ekspor PDF</span>
        </button>

        <!-- Settings Cog -->
        <button
          @click="emit('open-settings')"
          class="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
          title="Pengaturan AI & Model"
        >
          <Settings class="w-4 h-4" />
        </button>

        <!-- Primary CTA: Mulai Asesmen Baru -->
        <button
          @click="emit('open-assessment')"
          class="btn-exec-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <PlayCircle class="w-3.5 h-3.5 text-slate-300" />
          <span>Tes Baru (25 Soal)</span>
        </button>
      </div>
    </div>
  </header>
</template>
