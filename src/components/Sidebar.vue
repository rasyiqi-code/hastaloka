<script setup lang="ts">
import {
  Home,
  Sparkles,
  Bot,
  Settings,
  ChevronDown,
  Lock,
  Info
} from '@lucide/vue';

const props = defineProps<{
  activeTab: 'home' | 'insight' | 'copilot';
  userName: string;
  archetypeName?: string;
  matchScore?: number;
  hasAssessment?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'home' | 'insight' | 'copilot'): void;
  (e: 'open-assessment'): void;
  (e: 'open-report'): void;
  (e: 'open-settings'): void;
  (e: 'open-about'): void;
}>();

const navItems = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'copilot' as const, label: 'Hastaloka AI', icon: Bot, isBadge: 'AI' },
  { id: 'insight' as const, label: 'Insight & Analisis', icon: Sparkles },
];

function handleNavClick(itemId: 'home' | 'insight' | 'copilot') {
  if (!props.hasAssessment) {
    emit('open-assessment');
  } else {
    emit('update:activeTab', itemId);
  }
}
</script>

<template>
  <aside class="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none z-30">
    <!-- Top Section -->
    <div class="p-4 space-y-6 overflow-y-auto">
      <!-- User Profile Dropdown Pill -->
      <div
        @click="emit('open-assessment')"
        class="p-2 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-slate-200/60"
        :title="hasAssessment ? 'Lihat/Ubah Profil' : 'Klik untuk mulai asesmen'"
      >
        <div class="flex items-center gap-2.5">
          <!-- Avatar with Status Dot -->
          <div class="relative">
            <div
              class="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs"
              :class="hasAssessment ? 'bg-gradient-to-tr from-indigo-600 to-violet-500 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'"
            >
              <Lock v-if="!hasAssessment" class="w-3.5 h-3.5 text-slate-400" />
              <span v-else>{{ userName ? userName.charAt(0).toUpperCase() : 'U' }}</span>
            </div>
            <span
              class="absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-white rounded-full"
              :class="hasAssessment ? 'bg-emerald-500' : 'bg-amber-400'"
            ></span>
          </div>

          <!-- User Name & Status -->
          <div class="text-left">
            <div class="text-xs font-bold text-slate-900 truncate max-w-[120px]">
              {{ hasAssessment ? (userName || 'Pengguna Hastaloka') : 'Pengguna Baru' }}
            </div>
            <div class="text-[10px] font-medium" :class="hasAssessment ? 'text-slate-400' : 'text-amber-600 font-semibold'">
              {{ hasAssessment ? (archetypeName || 'Terpetakan') : 'Wajib Asesmen' }}
            </div>
          </div>
        </div>

        <ChevronDown class="w-4 h-4 text-slate-400" />
      </div>

      <!-- Main Navigation Menu -->
      <nav class="space-y-1">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="handleNavClick(item.id)"
          class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          :class="
            activeTab === item.id && hasAssessment
              ? 'bg-[#f0edff] text-[#6366f1] font-bold'
              : !hasAssessment
                ? 'text-slate-400 hover:text-slate-600 hover:bg-slate-50 opacity-80'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          "
        >
          <div class="flex items-center gap-3">
            <component
              :is="item.icon"
              class="w-4 h-4"
              :class="activeTab === item.id && hasAssessment ? 'text-[#6366f1]' : 'text-slate-400'"
            />
            <span>{{ item.label }}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <Lock v-if="!hasAssessment" class="w-3 h-3 text-slate-300" />
            <span
              v-else-if="item.isBadge"
              class="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
              :class="activeTab === item.id ? 'bg-[#6366f1] text-white' : 'bg-slate-100 text-slate-500'"
            >
              {{ item.isBadge }}
            </span>
          </div>
        </button>
      </nav>

      <!-- Secondary Workspaces / Projects Section -->
      <div class="pt-4 border-t border-slate-100 space-y-2">
        <div class="flex items-center justify-between px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Aksi Diagnostik</span>
        </div>

        <div class="space-y-1">
          <!-- Button Mulai Tes Baru -->
          <button
            @click="emit('open-assessment')"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            :class="!hasAssessment
              ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-indigo-500" :class="{ 'animate-pulse': !hasAssessment }"></span>
              <span>{{ hasAssessment ? 'Tes Ulang Profil' : 'Mulai Asesmen (Wajib)' }}</span>
            </div>
            <span v-if="!hasAssessment" class="text-[9px] font-bold bg-indigo-600 text-white px-1.5 py-0.5 rounded">Mulai</span>
          </button>

          <!-- Button Ekspor PDF -->
          <button
            :disabled="!hasAssessment"
            @click="hasAssessment ? emit('open-report') : emit('open-assessment')"
            class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            :class="hasAssessment ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 opacity-60 cursor-not-allowed'"
          >
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full" :class="hasAssessment ? 'bg-cyan-500' : 'bg-slate-300'"></span>
              <span>Laporan Resmi PDF</span>
            </div>
            <Lock v-if="!hasAssessment" class="w-3 h-3 text-slate-300" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Section: Settings & Promo Card (Like Prodify in image) -->
    <div class="p-4 space-y-3 border-t border-slate-100 bg-white">
      <!-- About Link -->
      <button
        @click="emit('open-about')"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
      >
        <Info class="w-4 h-4 text-slate-400" />
        <span>Tentang Hastaloka</span>
      </button>

      <!-- Settings Link -->
      <button
        @click="emit('open-settings')"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
      >
        <Settings class="w-4 h-4 text-slate-400" />
        <span>Settings & AI Key</span>
      </button>

      <!-- Purple Gradient Box (Like Prodify card in image) -->
      <div class="sidebar-promo-box p-4 rounded-2xl text-white space-y-2.5 shadow-md">
        <div class="flex items-center gap-1.5 font-extrabold text-xs tracking-tight">
          <Sparkles class="w-4 h-4 text-violet-200" />
          <span>Hastaloka Enterprise</span>
        </div>
        <p class="text-[11px] text-violet-100 leading-relaxed font-normal opacity-90">
          Sistem diagnostik & navigasi keputusan presisi tinggi berbasis sains terpadu.
        </p>
        <button
          @click="emit('open-assessment')"
          class="w-full py-2 px-3 rounded-xl bg-white text-indigo-900 text-xs font-bold hover:bg-violet-50 transition-colors cursor-pointer shadow-sm text-center"
        >
          + Tes Ulang Profil
        </button>
      </div>
    </div>
  </aside>
</template>
