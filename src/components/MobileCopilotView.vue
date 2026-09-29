<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { marked } from 'marked';
import {
  BrainCircuit,
  MessageSquare,
  Zap,
  RotateCcw,
  Send,
  User,
  Copy,
  Check,
  Sparkles,
  Settings,
  ShieldCheck,
  ChevronRight
} from '@lucide/vue';
import { AIService } from '../services/aiService';
import { StorageService } from '../services/storage';
import type { AssessmentResult, DailyReadinessRecord } from '../types/hastaloka';

const props = defineProps<{
  assessment: AssessmentResult | null;
  readiness: { rt: number; status: string; recommendation: string };
  initialDilemma?: string;
}>();

const emit = defineEmits<{
  (e: 'open-settings'): void;
}>();

marked.setOptions({
  gfm: true,
  breaks: true
});

function renderMarkdown(content: string | null | undefined): string {
  if (!content) return '';
  try {
    return marked.parse(content) as string;
  } catch {
    return content;
  }
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  type?: 'chat' | 'simulation';
  timestamp?: string;
}

const activeMode = ref<'chat' | 'simulator'>('chat');
const messageContainer = ref<HTMLElement | null>(null);
const inputField = ref<HTMLTextAreaElement | null>(null);
const inputText = ref('');
const isLoading = ref(false);
const copiedIdx = ref<number | null>(null);

const defaultWelcomeMessage: ChatMessage = {
  role: 'assistant',
  content: `Halo! Saya adalah **Copilot Strategis Hastaloka** Anda.\n\nSaya memegang data pemetaan 5 Vektor neuro-perilaku Anda (**${props.assessment ? props.assessment.primaryArchetype.name : 'Standar Eksekutif'}**, Rt: **${props.readiness.rt}%**).\n\nAda keputusan karier, alokasi modal, strategi negosiasi, atau masalah relasi yang ingin Anda diskusikan secara rasional hari ini?`,
  type: 'chat',
  timestamp: 'Sekarang'
};

// Load saved chat
const savedChat = StorageService.getCopilotChatHistory();
const messages = ref<ChatMessage[]>(
  savedChat && savedChat.length > 0
    ? savedChat.map(m => ({ ...m, type: 'chat', timestamp: 'Riwayat' }))
    : [defaultWelcomeMessage]
);

// If initial dilemma passed, prefill and switch to simulator
onMounted(() => {
  if (props.initialDilemma) {
    inputText.value = props.initialDilemma;
    activeMode.value = 'simulator';
  }
  scrollToBottom();
});

watch(messages, (val) => {
  StorageService.saveCopilotChatHistory(
    val.map(m => ({ role: m.role, content: m.content }))
  );
  scrollToBottom();
}, { deep: true });

function scrollToBottom() {
  nextTick(() => {
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
}

// Quick suggestions
const chatPrompts = [
  'Bagaimana strategi leverage terbaik untuk arketipe saya dalam 90 hari ke depan?',
  'Saya sedang menghadapi 2 opsi investasi/karier, bantu saya membedah risikonya.',
  'Apa protokol mitigasi titik buta (blind spot) saya saat memimpin tim?',
  'Bagaimana cara menjaga stabilitas eksekusi tanpa cepat burnout?'
];

const simulatorPresets = [
  {
    title: 'Tawaran Kerja vs Bertahan',
    icon: '💼',
    text: 'Saya ditawari posisi baru dengan kenaikan kompensasi 40% di perusahaan lain, namun ritme kerja lebih padat. Di tempat lama peran saya sudah nyaman tapi jenjang karier melambat. Apakah saya harus pindah sekarang?'
  },
  {
    title: 'Ekspansi vs Tabung Kas',
    icon: '📈',
    text: 'Bisnis saya menghasilkan profit stabil. Saya bimbang apakah harus menginvestasikan 70% kas untuk ekspansi tim dan pemasaran baru, atau mempertahankan cadangan kas likuiditas menghadapi ketidakpastian pasar?'
  },
  {
    title: 'Bahas Masalah Partner',
    icon: '🤝',
    text: 'Saya merasa pembagian beban kerja dengan rekan kerja/partner bisnis tidak seimbang dan alur komunikasi sering macet. Bagaimana cara terbaik mengonfrontasi hal ini tanpa merusak hubungan kerja sama?'
  },
  {
    title: 'Proyek Sampingan vs Fokus',
    icon: '⚡',
    text: 'Ada tawaran freelance menarik bernilai besar yang datang, tapi saya sedang punya proyek prioritas yang belum selesai. Apakah saya harus ambil atau tolak demi fokus mutu?'
  }
];

function selectPrompt(promptText: string) {
  inputText.value = promptText;
  if (inputField.value) {
    inputField.value.focus();
  }
}

async function handleSend() {
  const text = inputText.value.trim();
  if (!text || isLoading.value) return;

  if (!AIService.hasApiKey()) {
    emit('open-settings');
    return;
  }

  const now = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const userMode = activeMode.value;

  // Add user message
  messages.value.push({
    role: 'user',
    content: text,
    type: userMode,
    timestamp: now
  });

  inputText.value = '';
  isLoading.value = true;
  scrollToBottom();

  try {
    let reply = '';
    if (userMode === 'simulator') {
      const currentReadinessRecord: DailyReadinessRecord = {
        id: `RT-${Date.now().toString(36)}`,
        date: new Date().toLocaleDateString('id-ID'),
        time: new Date().toLocaleTimeString('id-ID'),
        ct: 85,
        kt: 80,
        st: 25,
        rt: props.readiness.rt,
        status: (['Optimal', 'Standar', 'Kritis'].includes(props.readiness.status) ? props.readiness.status : 'Standar') as 'Optimal' | 'Standar' | 'Kritis',
        recommendation: props.readiness.recommendation
      };
      reply = await AIService.simulateDecision(text, props.assessment, currentReadinessRecord);
    } else {
      reply = await AIService.askConsultant(
        messages.value.map(m => ({ role: m.role, content: m.content })),
        props.assessment,
        null
      );
    }

    messages.value.push({
      role: 'assistant',
      content: reply,
      type: userMode,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    });
  } catch (err: any) {
    messages.value.push({
      role: 'assistant',
      content: `⚠️ Kendala AI: ${err.message || err}. Periksa koneksi atau Pengaturan AI.`,
      type: userMode,
      timestamp: 'Error'
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
}

function handleReset() {
  if (confirm('Bersihkan seluruh obrolan Copilot?')) {
    StorageService.clearCopilotChatHistory();
    messages.value = [defaultWelcomeMessage];
    inputText.value = '';
  }
}

function copyMessage(text: string, idx: number) {
  navigator.clipboard.writeText(text);
  copiedIdx.value = idx;
  setTimeout(() => {
    copiedIdx.value = null;
  }, 2000);
}
</script>

<template>
  <div class="flex flex-col h-[calc(100dvh-120px)] bg-slate-50 overflow-hidden">
    
    <!-- TOP CHAT HEADER BAR (Compact Mobile Standard) -->
    <div class="bg-white border-b border-slate-200/90 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="relative shrink-0">
          <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles class="w-4 h-4 text-white" />
          </div>
          <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <h2 class="text-xs font-bold text-slate-900 truncate">Copilot Strategis</h2>
            <span class="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/80">AI</span>
          </div>
          <p class="text-[10px] text-slate-500 truncate">
            {{ assessment ? assessment.primaryArchetype.name : 'Eksekutif' }} • Rt: {{ readiness.rt }}%
          </p>
        </div>
      </div>

      <!-- Header Action Buttons -->
      <div class="flex items-center gap-1 shrink-0">
        <button
          @click="handleReset"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Bersihkan Obrolan"
        >
          <RotateCcw class="w-3.5 h-3.5" />
        </button>
        <button
          @click="emit('open-settings')"
          class="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Pengaturan AI"
        >
          <Settings class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- MODE SWITCHER (Segmented Pills Under Header) -->
    <div class="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 px-3 py-1.5 shrink-0 flex items-center justify-center">
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full border border-slate-200/80 text-xs">
        <button
          @click="activeMode = 'chat'"
          class="flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
          :class="activeMode === 'chat' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'"
        >
          <MessageSquare class="w-3.5 h-3.5" />
          <span>Obrolan Bebas</span>
        </button>
        <button
          @click="activeMode = 'simulator'"
          class="flex-1 py-1.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs"
          :class="activeMode === 'simulator' ? 'bg-white text-indigo-700 font-bold shadow-xs' : 'text-slate-600'"
        >
          <Zap class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Bedah Keputusan</span>
        </button>
      </div>
    </div>

    <!-- CHAT MESSAGES SCROLL AREA (Full-edge stream) -->
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
    >
      <!-- Message Bubbles -->
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        class="flex flex-col"
        :class="msg.role === 'user' ? 'items-end' : 'items-start'"
      >
        <!-- User Bubble -->
        <div
          v-if="msg.role === 'user'"
          class="max-w-[85%] bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2.5 shadow-xs space-y-1"
        >
          <p class="text-xs leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
          <div class="text-[9px] text-indigo-200 text-right font-medium">
            {{ msg.timestamp || 'Anda' }}
          </div>
        </div>

        <!-- Assistant Bubble -->
        <div
          v-else
          class="max-w-[92%] bg-white border border-slate-200/90 text-slate-800 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs space-y-2"
        >
          <!-- Assistant Header inside bubble -->
          <div class="flex items-center justify-between border-b border-slate-100 pb-1.5 text-[10px] text-slate-400 font-medium">
            <span class="flex items-center gap-1 text-indigo-600 font-bold">
              <Sparkles class="w-3 h-3" />
              <span>Copilot Hastaloka</span>
            </span>
            <span>{{ msg.timestamp }}</span>
          </div>

          <!-- Markdown Content -->
          <div
            class="prose prose-xs max-w-none text-slate-800 text-xs leading-relaxed space-y-2"
            v-html="renderMarkdown(msg.content)"
          ></div>

          <!-- Footer Actions inside bubble -->
          <div class="pt-1.5 border-t border-slate-100 flex items-center justify-end gap-2 text-[10px] text-slate-400">
            <button
              @click="copyMessage(msg.content, idx)"
              class="flex items-center gap-1 hover:text-slate-700 cursor-pointer transition-colors"
            >
              <Check v-if="copiedIdx === idx" class="w-3 h-3 text-emerald-600" />
              <Copy v-else class="w-3 h-3" />
              <span>{{ copiedIdx === idx ? 'Tersalin' : 'Salin' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading / Thinking Indicator -->
      <div v-if="isLoading" class="flex items-start gap-2 max-w-[90%]">
        <div class="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs px-4 py-3 shadow-2xs flex items-center gap-2">
          <div class="flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]"></span>
          </div>
          <span class="text-xs text-slate-500 font-medium">
            {{ activeMode === 'simulator' ? 'Membedah keselarasan 5 Vektor & waktu eksekusi...' : 'Copilot sedang merumuskan jawaban...' }}
          </span>
        </div>
      </div>
    </div>

    <!-- HORIZONTAL QUICK PROMPTS (Swipeable bar right above input) -->
    <div class="bg-white/95 backdrop-blur-xs border-t border-slate-100 px-3 py-1.5 shrink-0">
      <div class="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
        <span>{{ activeMode === 'simulator' ? '⚡ Pilihan Cepat Dilema:' : '💡 Ide Pertanyaan:' }}</span>
        <span class="text-[9px] text-slate-400 lowercase">geser →</span>
      </div>
      
      <!-- Horizontal Scrollable Row -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5">
        <template v-if="activeMode === 'simulator'">
          <button
            v-for="(item, idx) in simulatorPresets"
            :key="idx"
            @click="selectPrompt(item.text)"
            class="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-[11px] font-medium transition-all shrink-0 whitespace-nowrap active:scale-95 flex items-center gap-1"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.title }}</span>
          </button>
        </template>
        <template v-else>
          <button
            v-for="(prompt, idx) in chatPrompts"
            :key="idx"
            @click="selectPrompt(prompt)"
            class="px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-[11px] font-medium transition-all shrink-0 whitespace-nowrap active:scale-95"
          >
            {{ prompt }}
          </button>
        </template>
      </div>
    </div>

    <!-- CHAT INPUT BAR (Standard Mobile Chat Input docked at bottom) -->
    <div class="bg-white border-t border-slate-200/90 p-2.5 shrink-0 shadow-lg">
      <form @submit.prevent="handleSend" class="flex items-center gap-2">
        <textarea
          ref="inputField"
          v-model="inputText"
          rows="1"
          @keydown.enter.prevent="handleSend"
          :placeholder="activeMode === 'simulator' ? 'Uraikan keputusan atau dilema Anda...' : 'Ketik pertanyaan strategis Anda...'"
          class="flex-1 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 text-xs rounded-2xl px-3.5 py-2.5 border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-hidden resize-none transition-all placeholder:text-slate-400"
        ></textarea>
        
        <button
          type="submit"
          :disabled="!inputText.trim() || isLoading"
          class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="activeMode === 'simulator' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'"
          :title="activeMode === 'simulator' ? 'Jalankan Bedah Keputusan' : 'Kirim Pesan'"
        >
          <Zap v-if="activeMode === 'simulator'" class="w-4 h-4 fill-white" />
          <Send v-else class="w-4 h-4" />
        </button>
      </form>
    </div>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
