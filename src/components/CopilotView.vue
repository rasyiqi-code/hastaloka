<script setup lang="ts">
import { ref, watch } from 'vue';
import { marked } from 'marked';
import {
  BrainCircuit,
  MessageSquare,
  Bot,
  Zap,
  RotateCcw,
  Send,
  CheckCircle2,
  User,
  Copy,
  Check,
  Lightbulb,
  Sparkles,
  PenLine,
  Plus
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

const activeMode = ref<'simulator' | 'chat'>('simulator');
const chatSubTab = ref<'form' | 'conversation'>('form');

// Configure marked markdown parser
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

// Simulator State with Persistence
const savedSim = StorageService.getCopilotSimulatorState();
const dilemmaInput = ref(savedSim?.dilemma || props.initialDilemma || '');
const isSimulating = ref(false);
const simulationResult = ref<string | null>(savedSim?.result || null);
const simulatorError = ref<string | null>(null);

// Interactive Follow-Up in Simulator
const followUpInput = ref('');
const isFollowingUp = ref(false);
const followUpMessages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>(savedSim?.followUps || []);

// Persist Simulator State
watch([dilemmaInput, simulationResult, followUpMessages], () => {
  StorageService.saveCopilotSimulatorState({
    dilemma: dilemmaInput.value,
    result: simulationResult.value,
    followUps: followUpMessages.value
  });
}, { deep: true });

function clearSimulator() {
  dilemmaInput.value = '';
  simulationResult.value = null;
  followUpMessages.value = [];
  simulatorError.value = null;
  StorageService.clearCopilotSimulatorState();
}

const presetDilemmas = [
  {
    title: 'Tawaran Kerja Baru vs Bertahan',
    category: 'Karier & Kompensasi',
    icon: '💼',
    color: 'bg-purple-100 text-purple-700',
    text: 'Saya ditawari posisi baru dengan kenaikan kompensasi 40% di perusahaan lain, namun ritme kerja lebih padat. Di tempat lama peran saya sudah nyaman tapi jenjang karier melambat. Apakah saya harus pindah sekarang?'
  },
  {
    title: 'Ekspansi Agresif vs Tabung Kas',
    category: 'Finansial & Bisnis',
    icon: '📈',
    color: 'bg-blue-100 text-blue-700',
    text: 'Bisnis saya menghasilkan profit stabil. Saya bimbang apakah harus menginvestasikan 70% kas untuk ekspansi tim dan pemasaran baru, atau mempertahankan cadangan kas likuiditas menghadapi ketidakpastian pasar?'
  },
  {
    title: 'Bahas Masalah dengan Partner',
    category: 'Relasi & Kemitraan',
    icon: '🤝',
    color: 'bg-emerald-100 text-emerald-700',
    text: 'Saya merasa pembagian beban kerja dengan rekan kerja/partner bisnis tidak seimbang dan alur komunikasi sering macet. Bagaimana cara terbaik mengonfrontasi hal ini tanpa merusak hubungan kerja sama?'
  },
  {
    title: 'Proyek Sampingan vs Fokus',
    category: 'Prioritas & Energi',
    icon: '⚡',
    color: 'bg-amber-100 text-amber-700',
    text: 'Ada tawaran freelance menarik bernilai besar yang datang, tapi saya sedang punya proyek prioritas yang belum selesai. Apakah saya harus ambil atau tolak demi fokus mutu?'
  }
];

// Chat Advisor State with Persistence
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const defaultWelcomeMessage: Message = {
  role: 'assistant',
  content: `Halo! Saya adalah **Copilot Strategis Hastaloka** Anda.\n\nSaya memegang data pemetaan 5 vektor neuro-perilaku Anda (${props.assessment ? props.assessment.primaryArchetype.name : 'Standar Eksekutif'}). Ada keputusan karier, alokasi modal, strategi negosiasi, atau masalah relasi yang ingin Anda diskusikan secara rasional hari ini?`
};

const savedChat = StorageService.getCopilotChatHistory();
const chatMessages = ref<Message[]>(
  savedChat && savedChat.length > 0 ? savedChat : [defaultWelcomeMessage]
);

// If there are prior conversation messages, start on conversation subtab
if (savedChat && savedChat.length > 1) {
  chatSubTab.value = 'conversation';
}

// Persist Chat History on changes
watch(chatMessages, (val) => {
  StorageService.saveCopilotChatHistory(val);
}, { deep: true });

const chatInput = ref('');
const followUpChatInput = ref('');
const isChatLoading = ref(false);
const copiedIdx = ref<number | null>(null);

const suggestedChatPrompts = [
  'Bagaimana strategi leverage terbaik untuk arketipe saya dalam 90 hari ke depan?',
  'Saya sedang menghadapi 2 opsi investasi/karier, bantu saya membedah risikonya.',
  'Apa protokol mitigasi titik buta (blind spot) saya saat memimpin tim?',
  'Bagaimana cara menjaga stabilitas eksekusi tanpa cepat burnout?'
];

// Simulator Actions
function selectPreset(text: string) {
  dilemmaInput.value = text;
  simulationResult.value = null;
  followUpMessages.value = [];
  simulatorError.value = null;
  StorageService.saveCopilotSimulatorState({
    dilemma: text,
    result: null,
    followUps: []
  });
}

async function runSimulation() {
  const text = dilemmaInput.value.trim();
  if (!text || isSimulating.value) return;

  if (!AIService.hasApiKey()) {
    emit('open-settings');
    return;
  }

  isSimulating.value = true;
  simulatorError.value = null;

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

  try {
    const res = await AIService.simulateDecision(text, props.assessment, currentReadinessRecord);
    simulationResult.value = res;
    followUpMessages.value = [];
    StorageService.saveCopilotSimulatorState({
      dilemma: text,
      result: res,
      followUps: []
    });
  } catch (err: any) {
    simulatorError.value = err.message || 'Kendala saat menjalankan simulasi keputusan.';
  } finally {
    isSimulating.value = false;
  }
}

async function sendFollowUpQuestion() {
  const q = followUpInput.value.trim();
  if (!q || isFollowingUp.value || !simulationResult.value) return;

  followUpMessages.value.push({ role: 'user', content: q });
  followUpInput.value = '';
  isFollowingUp.value = true;

  try {
    const messages = [
      { role: 'user' as const, content: `Dilema saya: "${dilemmaInput.value}". Hasil analisis awal: ${simulationResult.value}` },
      ...followUpMessages.value.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))
    ];

    const reply = await AIService.askConsultant(messages, props.assessment, null);
    followUpMessages.value.push({ role: 'assistant', content: reply });
  } catch (err: any) {
    followUpMessages.value.push({ role: 'assistant', content: `⚠️ Kendala: ${err.message || err}` });
  } finally {
    isFollowingUp.value = false;
  }
}

// Chat Actions
function selectChatPrompt(prompt: string) {
  chatInput.value = prompt;
}

async function sendChatMessage() {
  const text = chatInput.value.trim();
  if (!text || isChatLoading.value) return;

  if (!AIService.hasApiKey()) {
    emit('open-settings');
    return;
  }

  chatMessages.value.push({ role: 'user', content: text });
  chatInput.value = '';
  chatSubTab.value = 'conversation';
  isChatLoading.value = true;

  try {
    const reply = await AIService.askConsultant(
      chatMessages.value.map(m => ({ role: m.role, content: m.content })),
      props.assessment,
      null
    );
    chatMessages.value.push({ role: 'assistant', content: reply });
  } catch (err: any) {
    chatMessages.value.push({
      role: 'assistant',
      content: `⚠️ Terjadi kendala saat menghubungi AI: ${err.message || err}. Periksa kembali konfigurasi di Pengaturan AI.`
    });
  } finally {
    isChatLoading.value = false;
  }
}

async function sendFollowUpChatMessage() {
  const text = followUpChatInput.value.trim();
  if (!text || isChatLoading.value) return;

  if (!AIService.hasApiKey()) {
    emit('open-settings');
    return;
  }

  chatMessages.value.push({ role: 'user', content: text });
  followUpChatInput.value = '';
  isChatLoading.value = true;

  try {
    const reply = await AIService.askConsultant(
      chatMessages.value.map(m => ({ role: m.role, content: m.content })),
      props.assessment,
      null
    );
    chatMessages.value.push({ role: 'assistant', content: reply });
  } catch (err: any) {
    chatMessages.value.push({
      role: 'assistant',
      content: `⚠️ Terjadi kendala saat menghubungi AI: ${err.message || err}. Periksa kembali konfigurasi di Pengaturan AI.`
    });
  } finally {
    isChatLoading.value = false;
  }
}

function resetChat() {
  chatInput.value = '';
  followUpChatInput.value = '';
  StorageService.clearCopilotChatHistory();
  chatMessages.value = [defaultWelcomeMessage];
  chatSubTab.value = 'form';
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
  <div class="space-y-4 sm:space-y-6">
    <!-- Top Header & Mode Switcher -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 pt-4 sm:px-0 sm:pt-0">
      <div>
        <h2 class="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <span>Copilot Strategis Hastaloka</span>
          <span class="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Decision AI
          </span>
        </h2>
        <p class="text-xs text-slate-500 font-normal">
          Penasihat keputusan terarah berbasis profil 5 Vektor H5V, arketipe, dan kondisi kesiapan biologis Anda
        </p>
      </div>

      <!-- Segmented Switcher -->
      <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto text-xs shrink-0">
        <button
          @click="activeMode = 'simulator'"
          class="px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          :class="activeMode === 'simulator' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
        >
          <BrainCircuit class="w-3.5 h-3.5" :class="activeMode === 'simulator' ? 'text-[#6366f1]' : 'text-slate-400'" />
          <span class="whitespace-nowrap">Simulator Keputusan</span>
        </button>
        <button
          @click="activeMode = 'chat'"
          class="px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          :class="activeMode === 'chat' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'"
        >
          <MessageSquare class="w-3.5 h-3.5" :class="activeMode === 'chat' ? 'text-[#6366f1]' : 'text-slate-400'" />
          <span class="whitespace-nowrap">Obrolan Strategis Bebas</span>
        </button>
      </div>
    </div>

    <!-- UNIFIED CARD CONTAINER (Full edge on mobile, container on desktop) -->
    <div class="bg-white rounded-none sm:rounded-3xl border-0 sm:border border-slate-200/90 shadow-none sm:shadow-sm px-4 py-5 sm:p-8 border-t border-b sm:border-t-0 sm:border-b-0">
      
      <!-- MODE 1: DECISION SIMULATOR -->
      <div v-if="activeMode === 'simulator'" class="space-y-6">
        <!-- Input & Scenario Section with Rich Micro-UI -->
        <div class="space-y-5">
          <!-- Section Header & Biological Readiness Pill -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center shadow-xs shrink-0">
                <BrainCircuit class="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight">Bedah Keputusan Nyata (Multi-Layer Simulation)</h3>
                <p class="text-[11px] text-slate-500">Evaluasi terpadu keselarasan profil 5 Vektor, momentum sirkadian, dan mitigasi risiko</p>
              </div>
            </div>

            <!-- Prodify-style Status Badge -->
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs self-start sm:self-auto shrink-0 whitespace-nowrap">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span class="whitespace-nowrap">Kesiapan Biologis (Rt): {{ readiness.rt }}% • {{ readiness.status }}</span>
            </div>
          </div>

          <!-- Textarea Input Area with Micro-UI Details -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-800">
                Uraikan Keputusan atau Dilema yang Sedang Anda Hadapi:
              </label>
              <button
                v-if="dilemmaInput"
                @click="dilemmaInput = ''"
                class="text-indigo-600 font-semibold normal-case cursor-pointer hover:underline text-[11px]"
              >
                Kosongkan Formulir
              </button>
            </div>

            <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-2 focus-within:bg-white focus-within:border-[#6366f1] focus-within:ring-4 focus-within:ring-indigo-100/60 transition-all shadow-2xs">
              <textarea
                v-model="dilemmaInput"
                rows="3"
                placeholder="Tuliskan pilihan yang sedang Anda timbang, kekhawatiran terbesar, atau komitmen finansial/karier (misal: 'Saya bimbang antara menerima tawaran promosi ke divisi lain atau bertahan di tim sekarang')..."
                class="w-full p-2.5 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed resize-y"
                :disabled="isSimulating"
              ></textarea>

              <div class="flex items-center justify-between px-2.5 pb-1 pt-1 text-[11px] text-slate-400 border-t border-slate-100/80">
                <span class="flex items-center gap-1.5 text-slate-500">
                  <Lightbulb class="w-3.5 h-3.5 text-amber-500" />
                  <span>Tips: Sebutkan opsi yang Anda pertimbangkan & risiko terbesarnya.</span>
                </span>
                <span class="font-mono text-[10px]">{{ dilemmaInput.length }} karakter</span>
              </div>
            </div>
          </div>

          <!-- Pilihan Cepat (Kecil di Bawah Textarea) -->
          <div class="space-y-1.5 pt-0.5">
            <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles class="w-3 h-3 text-indigo-500" />
              <span>Pilihan Cepat:</span>
            </div>
            
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="(item, idx) in presetDilemmas"
                :key="idx"
                @click="selectPreset(item.text)"
                class="px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
                :class="
                  dilemmaInput === item.text
                    ? 'border-[#6366f1] bg-[#f5f3ff] text-indigo-700 font-bold ring-1 ring-[#6366f1]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:border-slate-300'
                "
                :title="item.text"
              >
                <span>{{ item.icon }}</span>
                <span>{{ item.title }}</span>
              </button>
            </div>
          </div>

          <!-- Action Button Row with Solid Vibrant Button -->
          <div class="flex items-center justify-between pt-2">
            <button
              v-if="dilemmaInput || simulationResult"
              @click="clearSimulator"
              class="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Bersihkan Formulir</span>
            </button>
            <div v-else></div>

            <button
              @click="runSimulation"
              :disabled="!dilemmaInput.trim() || isSimulating"
              class="btn-exec-primary px-7 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-300 hover:shadow-lg hover:shadow-indigo-400 transition-all"
            >
              <Zap class="w-4 h-4 text-white fill-white" />
              <span v-if="!isSimulating">Jalankan Simulasi Keputusan (AI Multi-Layer)</span>
              <span v-else>Menganalisis 5 Vektor & Menghitung Risiko...</span>
            </button>
          </div>
        </div>

        <!-- Simulator Error -->
        <div v-if="simulatorError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center justify-between">
          <span>{{ simulatorError }}</span>
          <button @click="emit('open-settings')" class="font-bold underline cursor-pointer">Buka Pengaturan AI</button>
        </div>

        <!-- Simulation Result & Follow-Up (Unified inside the container) -->
        <div v-if="simulationResult" class="border-t border-slate-100 pt-6 space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <h4 class="text-sm font-bold text-slate-900 tracking-tight">Lembar Analisis Keputusan Strategis</h4>
            </div>
            <span class="text-xs font-mono text-slate-500 font-bold">
              Subjek: {{ assessment?.primaryArchetype.name }} • Rt: {{ readiness.rt }}%
            </span>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal prose-copilot overflow-x-auto" v-html="renderMarkdown(simulationResult)"></div>

          <!-- Follow-up Conversation within the simulator -->
          <div v-if="followUpMessages.length > 0" class="space-y-3 pt-2">
            <div
              v-for="(fmsg, fidx) in followUpMessages"
              :key="fidx"
              class="p-3.5 rounded-xl text-xs leading-relaxed"
              :class="fmsg.role === 'user' ? 'bg-slate-900 text-white ml-6 font-medium [&_*]:text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
            >
              <div class="text-[10px] font-mono opacity-70 mb-0.5">
                {{ fmsg.role === 'user' ? 'Pertanyaan Anda' : 'Jawaban Copilot AI' }}:
              </div>
              <div class="prose-copilot" v-html="renderMarkdown(fmsg.content)"></div>
            </div>
          </div>

          <!-- Interactive Follow-Up Input (Prodify Search Pill Style) -->
          <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
            <div class="flex-1 flex items-center bg-slate-50 border border-slate-200/90 rounded-full px-4 py-2 focus-within:bg-white focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-2xs">
              <input
                v-model="followUpInput"
                type="text"
                placeholder="Tanyakan langkah taktis lanjutan (misal: 'Bagaimana draf negosiasi kontraknya?')..."
                class="flex-1 text-xs bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                :disabled="isFollowingUp"
                @keydown.enter.prevent="sendFollowUpQuestion"
              />
            </div>
            <button
              @click="sendFollowUpQuestion"
              :disabled="!followUpInput.trim() || isFollowingUp"
              class="btn-exec-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span>Tanya Lanjut</span>
              <Send class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- MODE 2: FREE STRATEGIC ADVISOR CHAT -->
      <div v-else class="space-y-6">
        <!-- Section Header & Biological Readiness Pill -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6366f1] to-[#8b5cf6] text-white flex items-center justify-center shadow-xs">
              <MessageSquare class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 tracking-tight">Konsultasi Strategis Bebas (Interactive Advisor)</h3>
              <p class="text-[11px] text-slate-500">Eksplorasi langkah strategis, negosiasi, dan alokasi sumber daya bersama AI</p>
            </div>
          </div>

          <!-- Prodify-style Status Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs self-start sm:self-auto shrink-0 whitespace-nowrap">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="whitespace-nowrap">Kesiapan Biologis (Rt): {{ readiness.rt }}% • {{ readiness.status }}</span>
          </div>
        </div>

        <!-- Sub-Tabs: Formulir Topik vs Sesi Obrolan -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold shrink-0">
            <button
              @click="chatSubTab = 'form'"
              class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              :class="chatSubTab === 'form' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >
              <PenLine class="w-3.5 h-3.5" :class="chatSubTab === 'form' ? 'text-[#6366f1]' : 'text-slate-400'" />
              <span class="whitespace-nowrap">Formulir Topik Baru</span>
            </button>
            <button
              @click="chatSubTab = 'conversation'"
              class="px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              :class="chatSubTab === 'conversation' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'"
            >
              <MessageSquare class="w-3.5 h-3.5" :class="chatSubTab === 'conversation' ? 'text-[#6366f1]' : 'text-slate-400'" />
              <span class="whitespace-nowrap">Sesi Obrolan Aktif</span>
              <span
                v-if="chatMessages.length > 1"
                class="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-50 text-indigo-700 font-bold whitespace-nowrap"
              >
                {{ chatMessages.length }}
              </span>
            </button>
          </div>

          <div v-if="chatSubTab === 'conversation'" class="flex items-center gap-2 shrink-0">
            <button
              @click="chatSubTab = 'form'"
              class="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0"
            >
              <Plus class="w-3.5 h-3.5 text-indigo-600" />
              <span>Topik Baru</span>
            </button>
            <button
              v-if="chatMessages.length > 1"
              @click="resetChat"
              class="px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs whitespace-nowrap shrink-0"
              title="Bersihkan riwayat obrolan"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- TAB 1: FORMULIR TOPIK BARU (Matches Simulator Input 1-to-1) -->
        <div v-if="chatSubTab === 'form'" class="space-y-5">
          <!-- Textarea Input Area with Micro-UI Details -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-800">
                Ajukan Pertanyaan atau Topik Diskusi Strategis:
              </label>
              <button
                v-if="chatInput"
                @click="chatInput = ''"
                class="text-indigo-600 font-semibold normal-case cursor-pointer hover:underline text-[11px]"
              >
                Kosongkan Formulir
              </button>
            </div>

            <div class="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-2 focus-within:bg-white focus-within:border-[#6366f1] focus-within:ring-4 focus-within:ring-indigo-100/60 transition-all shadow-2xs">
              <textarea
                v-model="chatInput"
                rows="3"
                placeholder="Tuliskan topik atau pertanyaan strategis yang ingin Anda diskusikan (misal: 'Bagaimana pendekatan terbaik merestrukturisasi alur delegasi tanpa menurunkan moral tim?')..."
                class="w-full p-2.5 text-xs sm:text-sm bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed resize-y"
                :disabled="isChatLoading"
              ></textarea>

              <div class="flex items-center justify-between px-2.5 pb-1 pt-1 text-[11px] text-slate-400 border-t border-slate-100/80">
                <span class="flex items-center gap-1.5 text-slate-500">
                  <Lightbulb class="w-3.5 h-3.5 text-amber-500" />
                  <span>Tips: Sertakan konteks situasi, target hasil, atau pihak yang terlibat.</span>
                </span>
                <span class="font-mono text-[10px]">{{ chatInput.length }} karakter</span>
              </div>
            </div>
          </div>

          <!-- Pilihan Cepat (Kecil di Bawah Textarea) -->
          <div class="space-y-1.5 pt-0.5">
            <div class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <Sparkles class="w-3 h-3 text-indigo-500" />
              <span>Pilihan Cepat:</span>
            </div>
            
            <div class="flex flex-wrap items-center gap-2">
              <button
                v-for="(sp, idx) in suggestedChatPrompts"
                :key="idx"
                @click="selectChatPrompt(sp)"
                class="px-3 py-1.5 rounded-full border text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs group"
                :class="
                  chatInput === sp
                    ? 'border-[#6366f1] bg-[#f5f3ff] text-indigo-700 font-bold ring-1 ring-[#6366f1]'
                    : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-700 hover:border-slate-300'
                "
                :title="sp"
              >
                <span>💡</span>
                <span>{{ sp }}</span>
              </button>
            </div>
          </div>

          <!-- Action Button Row with Solid Vibrant Button -->
          <div class="flex items-center justify-between pt-2">
            <button
              v-if="chatMessages.length > 1"
              @click="chatSubTab = 'conversation'"
              class="text-indigo-600 hover:text-indigo-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Lihat Sesi Obrolan Aktif ({{ chatMessages.length }}) →</span>
            </button>
            <div v-else></div>

            <button
              @click="sendChatMessage"
              :disabled="!chatInput.trim() || isChatLoading"
              class="btn-exec-primary px-7 py-3 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-300 hover:shadow-lg hover:shadow-indigo-400 transition-all"
            >
              <Send class="w-4 h-4 text-white" />
              <span v-if="!isChatLoading">Kirim ke Copilot Strategis</span>
              <span v-else>Menganalisis & Merumuskan Solusi...</span>
            </button>
          </div>
        </div>

        <!-- TAB 2: SESI OBROLAN AKTIF (Single clean input at bottom) -->
        <div v-else class="space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-indigo-600" />
              <h4 class="text-sm font-bold text-slate-900 tracking-tight">Lembar Diskusi & Konsultasi Strategis</h4>
            </div>
            <span class="text-xs font-mono text-slate-500 font-bold">
              Subjek: {{ assessment?.primaryArchetype.name || 'Eksekutif' }} • Rt: {{ readiness.rt }}%
            </span>
          </div>

          <!-- Messages Stream -->
          <div class="space-y-3 pt-1">
            <div
              v-for="(msg, idx) in chatMessages"
              :key="idx"
              class="p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed relative group border shadow-2xs"
              :class="
                msg.role === 'user'
                  ? 'bg-slate-900 text-white border-slate-900 font-medium ml-8 [&_*]:text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              "
            >
              <div class="flex items-center justify-between mb-1.5 text-[10px] font-mono opacity-70">
                <span class="font-bold flex items-center gap-1.5">
                  <User v-if="msg.role === 'user'" class="w-3 h-3 text-slate-300" />
                  <Bot v-else class="w-3 h-3 text-indigo-600" />
                  <span>{{ msg.role === 'user' ? 'Pertanyaan Anda' : 'Rekomendasi Copilot AI' }}</span>
                </span>
                <button
                  v-if="msg.role === 'assistant'"
                  @click="copyMessage(msg.content, idx)"
                  class="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center gap-1"
                  title="Salin Pesan"
                >
                  <Check v-if="copiedIdx === idx" class="w-3 h-3 text-emerald-600" />
                  <Copy v-else class="w-3 h-3" />
                  <span class="text-[10px] font-sans">{{ copiedIdx === idx ? 'Tersalin' : 'Salin' }}</span>
                </button>
              </div>

              <div class="prose-copilot overflow-x-auto" v-html="renderMarkdown(msg.content)"></div>
            </div>

            <!-- Loading State -->
            <div v-if="isChatLoading" class="p-4 rounded-2xl bg-white border border-slate-200 text-xs font-medium text-slate-600 flex items-center gap-2.5 shadow-2xs">
              <span class="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping"></span>
              <span>Copilot sedang menganalisis profil dan merumuskan jawaban strategis...</span>
            </div>
          </div>

          <!-- The ONLY Interactive Input in Conversation Tab -->
          <div class="pt-4 border-t border-slate-100 flex items-center gap-2">
            <div class="flex-1 flex items-center bg-slate-50 border border-slate-200/90 rounded-full px-4 py-2 focus-within:bg-white focus-within:border-[#6366f1] focus-within:ring-2 focus-within:ring-indigo-100 transition-all shadow-2xs">
              <input
                v-model="followUpChatInput"
                type="text"
                placeholder="Tanyakan respon lanjutan atau eksplorasi taktis..."
                class="flex-1 text-xs bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
                :disabled="isChatLoading"
                @keydown.enter.prevent="sendFollowUpChatMessage"
              />
            </div>
            <button
              @click="sendFollowUpChatMessage"
              :disabled="!followUpChatInput.trim() || isChatLoading"
              class="btn-exec-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span>Tanya Lanjut</span>
              <Send class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
