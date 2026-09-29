<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Bot,
  Send,
  KeyRound,
  RotateCcw,
  Copy,
  Check,
  User,
  Lightbulb
} from '@lucide/vue';
import { AIService } from '../services/aiService';
import type { AssessmentResult, DailyReadinessRecord } from '../types/hastaloka';

const props = defineProps<{
  assessment: AssessmentResult | null;
  readiness?: DailyReadinessRecord | null;
  initialPrompt?: string;
}>();

const emit = defineEmits<{
  (e: 'open-settings'): void;
}>();

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: `Selamat datang di **Konsultan Strategis Hastaloka**. 

Sistem telah menyelaraskan analisis dengan data vektor neuro-perilaku Anda (H5V: ${props.assessment ? props.assessment.primaryArchetype.name : 'Standar Eksekutif'}). 

Silakan ajukan permasalahan spesifik terkait keputusan karier, mitigasi risiko bisnis, pembagian peran tim, atau alokasi modal.`
  }
]);

const userInput = ref('');
const isLoading = ref(false);
const copiedIdx = ref<number | null>(null);

const suggestedPrompts = [
  'Bagaimana strategi leverage terbaik untuk arketipe saya dalam 90 hari ke depan?',
  'Saya sedang menghadapi 2 opsi investasi/karier, bantu saya membedah risikonya.',
  'Apa protokol mitigasi titik buta (blind spot) saya saat memimpin tim?',
  'Bagaimana cara menjaga stabilitas eksekusi tanpa cepat burnout?'
];

function selectPrompt(prompt: string) {
  userInput.value = prompt;
  sendMessage();
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || isLoading.value) return;

  if (!AIService.hasApiKey()) {
    emit('open-settings');
    return;
  }

  messages.value.push({ role: 'user', content: text });
  userInput.value = '';
  isLoading.value = true;

  try {
    const aiResponse = await AIService.askConsultant(
      messages.value.map(m => ({ role: m.role, content: m.content })),
      props.assessment,
      props.readiness
    );

    messages.value.push({ role: 'assistant', content: aiResponse });
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      content: `⚠️ Kendala komunikasi AI: ${err.message || err}. Periksa konfigurasi model atau rotasi endpoint pada Pengaturan AI.`
    });
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => props.initialPrompt,
  (newVal) => {
    if (newVal && newVal.trim().length > 0) {
      userInput.value = newVal;
      sendMessage();
    }
  },
  { immediate: true }
);

function copyMessage(text: string, idx: number) {
  navigator.clipboard.writeText(text);
  copiedIdx.value = idx;
  setTimeout(() => {
    copiedIdx.value = null;
  }, 2000);
}

function resetChat() {
  messages.value = [
    {
      role: 'assistant',
      content: 'Sesi konsultasi telah diperbarui. Silakan ajukan studi kasus atau permasalahan strategis baru.'
    }
  ];
}
</script>

<template>
  <div class="exec-card overflow-hidden flex flex-col min-h-[640px] bg-white border border-slate-200">
    <!-- Header Chat (Executive Advisory Bar) -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-xs">
          <Bot class="w-4 h-4 text-slate-100" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-sm font-bold text-slate-900 tracking-tight">Konsultan Strategis & Pengambilan Keputusan</h3>
            <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-slate-100 text-slate-700 border border-slate-200">
              Model Reasoning
            </span>
          </div>
          <p class="text-xs text-slate-500 font-normal">Sintesis terarah berbasis sains neuro-perilaku & arketipe Hastaloka</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="resetChat"
          class="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
          title="Reset Sesi Percakapan"
        >
          <RotateCcw class="w-3.5 h-3.5" />
        </button>
        <button
          @click="emit('open-settings')"
          class="btn-exec-secondary px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
        >
          <KeyRound class="w-3.5 h-3.5 text-slate-600" />
          <span>Konfigurasi AI</span>
        </button>
      </div>
    </div>

    <!-- Alert API Key jika belum diset -->
    <div
      v-if="!AIService.hasApiKey()"
      class="p-3 bg-amber-50 border-b border-amber-200 px-6 flex items-center justify-between gap-4 text-xs text-amber-900"
    >
      <div class="flex items-center gap-2 font-medium">
        <KeyRound class="w-4 h-4 text-amber-700 shrink-0" />
        <span>Koneksi AI memerlukan konfigurasi model atau API Key. Tersedia model cloud gratis atau model kustom Anda.</span>
      </div>
      <button
        @click="emit('open-settings')"
        class="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded shrink-0 cursor-pointer"
      >
        Buka Pengaturan
      </button>
    </div>

    <!-- Chat Messages Scroll Area -->
    <div class="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/60">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        class="flex gap-3 max-w-3xl"
        :class="msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''"
      >
        <!-- Avatar -->
        <div
          class="w-7 h-7 rounded-md flex items-center justify-center shrink-0 border"
          :class="msg.role === 'user' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-800'"
        >
          <User v-if="msg.role === 'user'" class="w-3.5 h-3.5" />
          <Bot v-else class="w-3.5 h-3.5" />
        </div>

        <!-- Bubble Message -->
        <div
          class="p-4 rounded-lg text-xs sm:text-sm leading-relaxed relative group border"
          :class="
            msg.role === 'user'
              ? 'bg-slate-900 text-white border-slate-900 font-medium'
              : 'bg-white border-slate-200 text-slate-800 shadow-xs'
          "
        >
          <div class="whitespace-pre-wrap">{{ msg.content }}</div>

          <!-- Copy Button -->
          <button
            v-if="msg.role === 'assistant'"
            @click="copyMessage(msg.content, idx)"
            class="absolute right-2 top-2 p-1.5 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            title="Salin Respon"
          >
            <Check v-if="copiedIdx === idx" class="w-3.5 h-3.5 text-emerald-600" />
            <Copy v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-if="isLoading" class="flex gap-3 max-w-3xl">
        <div class="w-7 h-7 rounded-md bg-white border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
          <Bot class="w-3.5 h-3.5 animate-pulse" />
        </div>
        <div class="p-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-2 shadow-xs">
          <span class="w-2 h-2 rounded-full bg-slate-900 animate-ping"></span>
          Konsultan AI sedang memproses analisis strategis...
        </div>
      </div>
    </div>

    <!-- Suggested Quick Prompts -->
    <div class="px-6 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
      <span class="text-slate-400 font-semibold shrink-0 flex items-center gap-1 text-[11px] uppercase tracking-wider">
        <Lightbulb class="w-3.5 h-3.5 text-amber-500" /> Rekomendasi Kasus:
      </span>
      <button
        v-for="(sp, idx) in suggestedPrompts"
        :key="idx"
        @click="selectPrompt(sp)"
        class="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap transition-colors cursor-pointer shrink-0 font-medium text-xs"
      >
        {{ sp }}
      </button>
    </div>

    <!-- Chat Input Area -->
    <div class="p-4 bg-white border-t border-slate-200">
      <form @submit.prevent="sendMessage" class="flex items-center gap-2">
        <input
          v-model="userInput"
          type="text"
          placeholder="Tanyakan analisis keputusan, skenario karier, atau negosiasi bisnis..."
          class="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white transition-colors"
          :disabled="isLoading"
        />
        <button
          type="submit"
          :disabled="!userInput.trim() || isLoading"
          class="btn-exec-primary px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <span>Kirim</span>
          <Send class="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  </div>
</template>
