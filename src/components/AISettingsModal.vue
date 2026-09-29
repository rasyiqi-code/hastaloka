<script setup lang="ts">
import { ref } from 'vue';
import {
  Bot,
  X,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck
} from '@lucide/vue';
import {
  AIService,
  DEFAULT_AI_PROVIDERS,
  OLLAMA_CLOUD_FREE_MODELS,
  type AIProviderConfig
} from '../services/aiService';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved', config: AIProviderConfig): void;
}>();

const currentConfig = ref<AIProviderConfig>(AIService.getConfig());
const showKey = ref(false);
const isTesting = ref(false);
const testResult = ref<{ success: boolean; message: string } | null>(null);

function onProviderChange() {
  const p = currentConfig.value.provider;
  if (DEFAULT_AI_PROVIDERS[p]) {
    currentConfig.value.baseUrl = DEFAULT_AI_PROVIDERS[p].baseUrl;
    currentConfig.value.model = DEFAULT_AI_PROVIDERS[p].defaultModel;
    // Jika kembali ke bawaan, bersihkan string apiKey lokal agar terkubur
    if (p === 'ollama_cloud') {
      currentConfig.value.apiKey = '';
    }
  }
}

async function handleTestConnection() {
  isTesting.value = true;
  testResult.value = null;
  const res = await AIService.testConnection(currentConfig.value);
  testResult.value = res;
  isTesting.value = false;
}

function handleSave() {
  AIService.saveConfig(currentConfig.value);
  emit('saved', currentConfig.value);
  emit('close');
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs">
    <div class="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-4 sm:p-5 space-y-3.5">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div class="flex items-center gap-2.5">
          <div class="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Bot class="w-4 h-4" />
          </div>
          <div>
            <h3 class="text-sm font-extrabold text-slate-900 tracking-tight">Pengaturan Model & Koneksi AI</h3>
            <p class="text-[11px] text-slate-500 font-medium">Koneksi bawaan siap pakai atau gunakan API Key pilihan Anda</p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Form Inputs -->
      <div class="space-y-3">
        <!-- 1. Pilih Provider -->
        <div>
          <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Penyedia / Provider AI
          </label>
          <select
            v-model="currentConfig.provider"
            @change="onProviderChange"
            class="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs cursor-pointer"
          >
            <option v-for="(info, key) in DEFAULT_AI_PROVIDERS" :key="key" :value="key">
              {{ info.name }}
            </option>
          </select>
        </div>

        <!-- 2. Status Bawaan (Jika Ollama Cloud Bawaan Dipilih) -->
        <div
          v-if="currentConfig.provider === 'ollama_cloud'"
          class="px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs"
        >
          <div class="flex items-center gap-2 min-w-0">
            <ShieldCheck class="w-4 h-4 text-emerald-600 shrink-0" />
            <div class="truncate">
              <span class="text-xs font-bold text-slate-900 block truncate">Koneksi Cloud AI Siap Pakai</span>
              <span class="text-[10px] text-slate-600 block">Sistem aktif dan siap digunakan</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px] tracking-wide shrink-0">
            AKTIF
          </span>
        </div>

        <!-- 2b. Form Input API Key (HANYA MUNCUL JIKA USER MEMILIH PROVIDER LAIN) -->
        <div v-else class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
              API Key Pribadi
            </label>
            <span class="text-[10px] text-slate-400">tersimpan lokal di peramban</span>
          </div>
          <div class="relative">
            <input
              v-model="currentConfig.apiKey"
              :type="showKey ? 'text' : 'password'"
              :placeholder="DEFAULT_AI_PROVIDERS[currentConfig.provider]?.placeholder || 'Masukkan API Key...'"
              class="w-full px-2.5 py-1.5 pr-8 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
            <button
              type="button"
              @click="showKey = !showKey"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <EyeOff v-if="showKey" class="w-3.5 h-3.5" />
              <Eye v-else class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- 3. Model Name & Base URL -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Model Utama
            </label>
            <select
              v-if="currentConfig.provider === 'ollama_cloud'"
              v-model="currentConfig.model"
              class="w-full px-2.5 py-1.5 text-xs font-mono font-bold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
            >
              <option v-for="m in OLLAMA_CLOUD_FREE_MODELS" :key="m" :value="m">
                {{ m }}
              </option>
            </select>
            <input
              v-else
              v-model="currentConfig.model"
              type="text"
              class="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>
          <div>
            <label class="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Base URL Endpoint
            </label>
            <input
              v-model="currentConfig.baseUrl"
              type="text"
              class="w-full px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-600 shadow-2xs"
            />
          </div>
        </div>

        <!-- Checkbox Auto Rotate -->
        <div class="flex items-start gap-2 pt-0.5">
          <input
            id="autoRotate"
            v-model="currentConfig.autoRotate"
            type="checkbox"
            class="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label for="autoRotate" class="text-xs text-slate-700 cursor-pointer select-none leading-snug">
            <span class="font-bold">Auto-Rotate Cadangan</span>
            <span class="text-slate-500 text-[11px] block">Otomatis rotasi ke model alternatif jika model utama sibuk.</span>
          </label>
        </div>
      </div>

      <!-- Test Connection Result -->
      <div
        v-if="testResult"
        class="p-2.5 rounded-lg text-xs font-medium flex items-start gap-2"
        :class="testResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'"
      >
        <CheckCircle2 v-if="testResult.success" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
        <AlertCircle v-else class="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
        <span class="leading-snug">{{ testResult.message }}</span>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-between pt-2.5 border-t border-slate-100">
        <button
          type="button"
          @click="handleTestConnection"
          :disabled="isTesting"
          class="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-2xs"
        >
          <Zap class="w-3.5 h-3.5 text-amber-600" />
          <span v-if="!isTesting">Uji Koneksi</span>
          <span v-else>Menguji...</span>
        </button>

        <button
          type="button"
          @click="handleSave"
          class="px-4 py-2 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  </div>
</template>
