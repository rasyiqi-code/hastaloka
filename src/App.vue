<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import HomeView from './components/HomeView.vue';
import InsightView from './components/InsightView.vue';
import CopilotView from './components/CopilotView.vue';
import AssessmentModal from './components/AssessmentModal.vue';
import OfficialReportModal from './components/OfficialReportModal.vue';
import AISettingsModal from './components/AISettingsModal.vue';
import AboutModal from './components/AboutModal.vue';
import BottomNav from './components/BottomNav.vue';

import { StorageService } from './services/storage';
import { calculateReadinessIndex } from './utils/hastalokaMath';
import type { AssessmentResult } from './types/hastaloka';

import {
  Sparkles,
  Menu,
  Compass,
  Lock,
  ShieldAlert,
  CheckCircle2,
  Info,
  Settings
} from '@lucide/vue';

// 3 Tab Utama: Home, Copilot, Insight
const activeTab = ref<'home' | 'insight' | 'copilot'>('home');
const currentAssessment = ref<AssessmentResult | null>(null);
const historyList = ref<AssessmentResult[]>([]);

// Modals
const isAssessmentModalOpen = ref(false);
const isReportModalOpen = ref(false);
const isAISettingsModalOpen = ref(false);
const isAboutModalOpen = ref(false);
const isMobileSidebarOpen = ref(false);

// Live Daily Readiness (Rt) State
const sleepQuality = ref<'good' | 'average' | 'poor'>('good');
const stressLevel = ref<'low' | 'moderate' | 'high'>('low');
const initialDilemmaForCopilot = ref('');

const ctScore = computed(() => {
  if (sleepQuality.value === 'good') return 90;
  if (sleepQuality.value === 'average') return 65;
  return 35;
});

const stScore = computed(() => {
  if (stressLevel.value === 'low') return 20;
  if (stressLevel.value === 'moderate') return 50;
  return 85;
});

const ktScore = computed(() => {
  const currentHour = new Date().getHours();
  const chronotype = currentAssessment.value?.chronotype || 'intermediate';
  if (chronotype === 'lark') {
    if (currentHour >= 7 && currentHour <= 12) return 90;
    if (currentHour > 12 && currentHour <= 17) return 65;
    return 40;
  } else if (chronotype === 'owl') {
    if (currentHour >= 13 && currentHour <= 21) return 90;
    if (currentHour >= 9 && currentHour < 13) return 60;
    return 40;
  }
  return 75;
});

const readiness = computed(() => {
  return calculateReadinessIndex(ctScore.value, ktScore.value, stScore.value);
});

onMounted(() => {
  const saved = StorageService.getCurrentAssessment();
  historyList.value = StorageService.getHistory();

  if (saved) {
    currentAssessment.value = saved;
  } else {
    currentAssessment.value = null;
    isAssessmentModalOpen.value = true;
  }
});

function handleAssessmentCompleted(result: AssessmentResult) {
  currentAssessment.value = result;
  StorageService.saveCurrentAssessment(result);
  historyList.value = StorageService.getHistory();
  isAssessmentModalOpen.value = false;
  activeTab.value = 'home';
}

function handleNavigate(tab: 'home' | 'insight' | 'copilot') {
  if (!currentAssessment.value) {
    isAssessmentModalOpen.value = true;
    return;
  }
  activeTab.value = tab;
  isMobileSidebarOpen.value = false;
}

function handleQuickSimulate(text: string) {
  if (!currentAssessment.value) {
    isAssessmentModalOpen.value = true;
    return;
  }
  initialDilemmaForCopilot.value = text;
  activeTab.value = 'copilot';
  isMobileSidebarOpen.value = false;
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] text-slate-900 flex selection:bg-indigo-600 selection:text-white">
    <!-- Desktop Left Sidebar (Prodify Layout) -->
    <div class="hidden md:block">
      <Sidebar
        :active-tab="activeTab"
        :user-name="currentAssessment?.userName || ''"
        :archetype-name="currentAssessment?.primaryArchetype?.name"
        :match-score="currentAssessment?.allArchetypeMatches?.[0]?.similarity"
        :has-assessment="!!currentAssessment"
        @update:active-tab="handleNavigate"
        @open-assessment="isAssessmentModalOpen = true"
        @open-report="isReportModalOpen = true"
        @open-settings="isAISettingsModalOpen = true"
        @open-about="isAboutModalOpen = true"
      />
    </div>

    <!-- Mobile Drawer Sidebar -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 z-50 flex md:hidden"
    >
      <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-xs" @click="isMobileSidebarOpen = false"></div>
      <div class="relative z-10 w-72 bg-white h-full shadow-2xl">
        <Sidebar
          :active-tab="activeTab"
          :user-name="currentAssessment?.userName || ''"
          :archetype-name="currentAssessment?.primaryArchetype?.name"
          :match-score="currentAssessment?.allArchetypeMatches?.[0]?.similarity"
          :has-assessment="!!currentAssessment"
          @update:active-tab="handleNavigate"
          @open-assessment="isAssessmentModalOpen = true; isMobileSidebarOpen = false"
          @open-report="isReportModalOpen = true; isMobileSidebarOpen = false"
          @open-settings="isAISettingsModalOpen = true; isMobileSidebarOpen = false"
          @open-about="isAboutModalOpen = true; isMobileSidebarOpen = false"
        />
      </div>
    </div>

    <!-- Main Workspace Area -->
    <div class="flex-1 flex flex-col min-w-0 bg-[#f8fafc] bg-prodify-grid">
      <!-- Mobile Top Navigation Header (Mobile-First Native App Bar) -->
      <header
        class="md:hidden sticky top-0 z-30 flex items-center justify-between px-3.5 py-2.5 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs"
        style="padding-top: max(env(safe-area-inset-top, 0px), 0.65rem);"
      >
        <!-- Brand Logo & Version -->
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Compass class="w-4 h-4 text-white" />
          </div>
          <div class="flex items-baseline gap-1.5">
            <span class="font-black text-sm text-slate-900 font-sans tracking-tight">HASTALOKA</span>
            <span class="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80">v2.0</span>
          </div>
        </div>

        <!-- Right Quick Actions -->
        <div class="flex items-center gap-1.5">
          <!-- User Archetype Badge (Clickable to open profile/re-test) -->
          <button
            v-if="currentAssessment"
            @click="isAssessmentModalOpen = true"
            class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-800 transition-colors cursor-pointer border border-slate-200/80 shadow-2xs active:scale-95"
            title="Klik untuk lihat / tes ulang profil"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="truncate max-w-[90px] text-[11px]">{{ currentAssessment.primaryArchetype.name }}</span>
          </button>

          <!-- Settings (AI Key & Engine Config) -->
          <button
            @click="isAISettingsModalOpen = true"
            class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
            title="Pengaturan AI & Kunci API"
          >
            <Settings class="w-4 h-4" />
          </button>

          <!-- Info / About -->
          <button
            @click="isAboutModalOpen = true"
            class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95"
            title="Tentang Hastaloka"
          >
            <Info class="w-4 h-4" />
          </button>
        </div>
      </header>

      <!-- Main Canvas Scroll Area -->
      <main class="flex-1 p-0 sm:p-8 lg:p-10 pb-24 sm:pb-8 lg:pb-10 overflow-y-auto">
        <!-- LOCKED DASHBOARD STATE (Saat Start dari 0 / Belum Ada Asesmen) -->
        <div v-if="!currentAssessment" class="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
          <div class="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
            <Lock class="w-8 h-8 text-indigo-600" />
          </div>

          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <ShieldAlert class="w-3.5 h-3.5 text-amber-600" /> Mode Fresh Start · Seluruh Fitur Terkunci
            </span>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Fitur Terkunci: Butuh Data Asesmen</h2>
            <p class="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
              Agar efisien dan tidak memboroskan token AI pada data kosong, Anda wajib mengisi 25 butir kuesioner neuro-perilaku serta ritme sirkadian terlebih dahulu.
            </p>
          </div>

          <div class="p-4 bg-white rounded-xl border border-slate-200 text-left space-y-3 shadow-xs">
            <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Modul yang Terbuka Setelah Asesmen:</div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>5 Vektor Neuro-Perilaku</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pencocokan 8 Arketipe</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Navigasi Kesiapan Energi (Rt)</span>
              </div>
              <div class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hastaloka Strategic AI Copilot</span>
              </div>
            </div>
          </div>

          <button
            @click="isAssessmentModalOpen = true"
            class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all cursor-pointer flex items-center justify-center gap-2 mx-auto"
          >
            <Sparkles class="w-4 h-4" />
            <span>Mulai Asesmen Diagnostik Sekarang</span>
          </button>
        </div>

        <!-- 1. HOME / BERANDA VIEW -->
        <HomeView
          v-else-if="activeTab === 'home'"
          :assessment="currentAssessment"
          :readiness="readiness"
          :sleep-quality="sleepQuality"
          :stress-level="stressLevel"
          @navigate="handleNavigate"
          @open-assessment="isAssessmentModalOpen = true"
          @open-report="isReportModalOpen = true"
          @open-settings="isAISettingsModalOpen = true"
          @update-sleep="sleepQuality = $event"
          @update-stress="stressLevel = $event"
          @quick-simulate="handleQuickSimulate"
        />

        <!-- 2. INSIGHT VIEW -->
        <InsightView
          v-else-if="activeTab === 'insight'"
          :assessment="currentAssessment"
          @open-report="isReportModalOpen = true"
          @open-settings="isAISettingsModalOpen = true"
        />

        <!-- 3. COPILOT VIEW -->
        <CopilotView
          v-else-if="activeTab === 'copilot'"
          :assessment="currentAssessment"
          :readiness="readiness"
          :initial-dilemma="initialDilemmaForCopilot"
          @open-settings="isAISettingsModalOpen = true"
        />
      </main>

      <!-- Bottom Minimalist Footer (Desktop Only) -->
      <footer class="hidden md:flex px-8 py-3.5 border-t border-slate-200/80 bg-white/70 text-[11px] text-slate-500 flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          HASTALOKA Enterprise v2.0 • Sistem Pemetaan Potensi, Karier & Navigasi Keputusan Berbasis Sains
        </div>
        <div class="font-mono text-slate-400">
          Prodify-Class Executive Layout • Standalone Offline & Cloud AI
        </div>
      </footer>
    </div>

    <!-- Floating Circular AI Copilot Bubble (Desktop Only) -->
    <button
      @click="handleNavigate('copilot')"
      class="hidden md:flex fixed bottom-6 right-6 w-12 h-12 rounded-full floating-copilot-btn text-white items-center justify-center cursor-pointer z-40 transition-transform shadow-lg"
      :title="currentAssessment ? 'Buka Copilot AI' : 'Selesaikan Asesmen Terlebih Dahulu'"
    >
      <Sparkles v-if="currentAssessment" class="w-5 h-5 text-white" />
      <Lock v-else class="w-5 h-5 text-amber-200" />
    </button>

    <!-- Mobile Bottom Navigation Bar -->
    <BottomNav
      :active-tab="activeTab"
      :has-assessment="!!currentAssessment"
      @navigate="handleNavigate"
      @open-assessment="isAssessmentModalOpen = true"
      @open-report="isReportModalOpen = true"
      @open-about="isAboutModalOpen = true"
    />

    <!-- MODALS -->
    <AssessmentModal
      v-if="isAssessmentModalOpen"
      :can-close="!!currentAssessment"
      @close="isAssessmentModalOpen = false"
      @completed="handleAssessmentCompleted"
    />

    <OfficialReportModal
      v-if="isReportModalOpen && currentAssessment"
      :assessment="currentAssessment"
      @close="isReportModalOpen = false"
    />

    <AISettingsModal
      v-if="isAISettingsModalOpen"
      @close="isAISettingsModalOpen = false"
    />

    <AboutModal
      v-if="isAboutModalOpen"
      @close="isAboutModalOpen = false"
    />
  </div>
</template>
