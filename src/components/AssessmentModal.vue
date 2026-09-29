<script setup lang="ts">
import { ref, computed } from 'vue';
import confetti from 'canvas-confetti';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  User,
  Lock
} from '@lucide/vue';
import { HASTALOKA_QUESTIONS } from '../data/hastalokaData';
import { calculateVectorScore, matchAllArchetypes } from '../utils/hastalokaMath';
import type { AssessmentResult } from '../types/hastaloka';

const props = withDefaults(defineProps<{
  canClose?: boolean;
}>(), {
  canClose: true,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'completed', result: AssessmentResult): void;
}>();

// Form info subjek
const userName = ref('');
const userAge = ref<number | undefined>(undefined);
const userProfession = ref('');

// === DIAGNOSTIK KRONOTIPE SIRKADIAN (BAB 13: HYBRID MSF + MEQ) ===
const sleepOnset = ref('23:30'); // Jam biasa tidur
const wakeOnset = ref('07:30');  // Jam biasa bangun

const meqAnswers = ref<Record<number, number>>({
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 2,
});

const meqQuestions = [
  {
    id: 1,
    text: '1. Seberapa cepat Anda sadar penuh dan siap beraktivitas?',
    options: [
      { score: 3, code: 'A', text: 'Langsung segar & siap beraktivitas dalam 10–15 menit' },
      { score: 2, code: 'B', text: 'Butuh sekitar 30 menit & peregangan ringan' },
      { score: 1, code: 'C', text: 'Butuh >45 menit, mandi dingin, atau kafein dosis tinggi' },
    ]
  },
  {
    id: 2,
    text: '2. Bagaimana kesiapan Anda jika harus mengerjakan tugas kognitif berat pukul 07.30 pagi?',
    options: [
      { score: 3, code: 'A', text: 'Sangat siap, otak di kondisi paling jernih di pagi hari' },
      { score: 2, code: 'B', text: 'Cukup siap jika sudah sarapan atau pemanasan' },
      { score: 1, code: 'C', text: 'Sangat berat, otak terasa berkabut (brain fog) & rawan salah' },
    ]
  },
  {
    id: 3,
    text: '3. Kapan rasa kantuk alami biasanya mulai terasa?',
    options: [
      { score: 3, code: 'A', text: 'Mulai mengantuk antara pukul 21.00 – 22.30' },
      { score: 2, code: 'B', text: 'Mulai mengantuk antara pukul 22.30 – 23.45' },
      { score: 1, code: 'C', text: 'Masih sangat segar di atas tengah malam (lewat 00.30)' },
    ]
  },
  {
    id: 4,
    text: '4. Di rentang waktu mana ide kreatif dan produktivitas puncak Anda muncul?',
    options: [
      { score: 3, code: 'A', text: 'Pagi hari sebelum siang' },
      { score: 2, code: 'B', text: 'Siang menjelang sore' },
      { score: 1, code: 'C', text: 'Sore hari menjelang larut malam' },
    ]
  },
  {
    id: 5,
    text: '5. Bagaimana kebiasaan bangun tidur Anda sehari-hari?',
    options: [
      { score: 3, code: 'A', text: 'Hampir selalu terbangun beberapa menit sebelum alarm' },
      { score: 2, code: 'B', text: 'Terbangun tepat saat alarm berbunyi' },
      { score: 1, code: 'C', text: 'Kerap mematikan tombol snooze berulang kali dan sulit bangun' },
    ]
  }
];

// Perhitungan Titik Tengah Tidur (Mid-Sleep on Free Days)
const midSleepData = computed(() => {
  const [sH = 0, sM = 0] = (sleepOnset.value || '23:30').split(':').map(Number);
  const [wH = 0, wM = 0] = (wakeOnset.value || '07:30').split(':').map(Number);
  const sDec = sH + sM / 60;
  const wDec = wH + wM / 60;

  let duration = wDec - sDec;
  if (duration < 0) duration += 24;

  const mid = (sDec + duration / 2) % 24;

  let type: 'lark' | 'owl' | 'intermediate' = 'intermediate';
  if (mid < 3.5) {
    type = 'lark';
  } else if (mid > 5.0) {
    type = 'owl';
  }
  return { type, mid, duration };
});

const meqTotalScore = computed(() => {
  return Object.values(meqAnswers.value).reduce((sum, val) => sum + val, 0);
});

// Gabungan Terpadu (Hybrid) MSF + MEQ Sesuai BAB 13
// MEQ score range: 5-15 (5 questions, each scored 1-3)
// Thresholds based on Horne-Östberg MEQ adaptation:
//   13-15: Morning type (Lark)
//   9-12:  Intermediate
//   5-8:   Evening type (Owl)
const detectedChronotype = computed<'lark' | 'owl' | 'intermediate'>(() => {
  const msfPoint = midSleepData.value.type === 'lark' ? 3 : midSleepData.value.type === 'intermediate' ? 2 : 1;
  const meqPoint = meqTotalScore.value >= 13 ? 3 : meqTotalScore.value >= 9 ? 2 : 1;
  const total = msfPoint + meqPoint;

  if (total >= 5) return 'lark';
  if (total <= 3 && (msfPoint === 1 || meqPoint === 1)) return 'owl';
  return 'intermediate';
});

// State jawaban 25 butir soal (default netral = 3)
const answers = ref<Record<string, number>>({});
HASTALOKA_QUESTIONS.forEach((q) => {
  answers.value[q.id] = 3;
});

// 5 Dimensi Vektor
const sections = [
  { key: 'drive', title: 'Daya Dorong & Aksi', sub: 'Drive', desc: 'Mengukur ketahanan eksekusi, inisiatif mandiri, dan keberanian menembus inersia.' },
  { key: 'adaptability', title: 'Kelenturan & Empati', sub: 'Adaptabilitas', desc: 'Mengukur responsivitas terhadap perubahan dinamika pasar dan kepekaan sosial.' },
  { key: 'stability', title: 'Keteraturan & Disiplin', sub: 'Stabilitas', desc: 'Mengukur ketelitian proses, konsistensi operasional, dan kepatuhan sistemik.' },
  { key: 'synthesis', title: 'Visi & Pola Pikir', sub: 'Sintesis', desc: 'Mengukur pemahaman konseptual makro, peramalan tren, dan logika strategis.' },
  { key: 'connectivity', title: 'Komunikasi & Relasi', sub: 'Konektivitas', desc: 'Mengukur kapabilitas naratif persuasif, kemitraan, dan modal reputasi jaringan.' },
];

const currentSectionIdx = ref(0);

const currentQuestions = computed(() => {
  const currentKey = sections[currentSectionIdx.value].key;
  return HASTALOKA_QUESTIONS.filter((q) => q.vector === currentKey);
});

const progressPercent = computed(() => {
  return Math.round(((currentSectionIdx.value + 1) / sections.length) * 100);
});

// Pilihan Skala Likert 1 - 5
const likertOptions = [
  { val: 1, label: 'Sangat Tidak Setuju', short: 'Sangat Tidak', code: 'STS' },
  { val: 2, label: 'Kurang Setuju',       short: 'Kurang',       code: 'TS' },
  { val: 3, label: 'Netral',              short: 'Netral',       code: 'N' },
  { val: 4, label: 'Setuju',             short: 'Setuju',       code: 'S' },
  { val: 5, label: 'Sangat Setuju',      short: 'Sangat Setuju',code: 'SS' },
];

function selectAnswer(questionId: string, val: number) {
  answers.value[questionId] = val;
}

function nextSection() {
  if (currentSectionIdx.value < sections.length - 1) {
    currentSectionIdx.value++;
  } else {
    finishAssessment();
  }
}

function prevSection() {
  if (currentSectionIdx.value > 0) {
    currentSectionIdx.value--;
  }
}


function finishAssessment() {
  const vectorScores = calculateVectorScore(answers.value);
  const matches = matchAllArchetypes(vectorScores);

  const primary = matches[0].archetype;
  const secondary = matches[1].archetype;

  const result: AssessmentResult = {
    id: `HASTA-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    userName: userName.value.trim() || 'Subjek Diagnostik',
    userAge: userAge.value,
    userProfession: userProfession.value.trim() || 'Profesional Eksekutif',
    chronotype: detectedChronotype.value,
    rawScores: { ...answers.value },
    vectorScores,
    primaryArchetype: primary,
    secondaryArchetype: secondary,
    allArchetypeMatches: matches,
  };

  try {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  } catch {}

  emit('completed', result);
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
    @click.self="canClose ? emit('close') : null"
  >
    <div class="relative w-full max-w-2xl h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col bg-white rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden border-0 sm:border border-slate-200/80">

      <!-- Unified Single-Row Modal Header -->
      <div class="relative flex-none bg-white border-b border-slate-200/80 px-3.5 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2.5">
        <!-- Section Pills -->
        <div class="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div
            v-for="(sec, idx) in sections"
            :key="sec.key"
            class="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all shrink-0 cursor-default"
            :class="idx === currentSectionIdx
              ? 'bg-indigo-600 text-white shadow-xs'
              : idx < currentSectionIdx
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-400'"
          >
            <span>{{ idx + 1 }}</span>
            <span>{{ sec.sub }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            v-if="canClose"
            @click="emit('close')"
            class="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center touch-manipulation"
            title="Tutup Modal"
          >
            <X class="w-4 h-4" />
          </button>
          <div
            v-else
            class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 sm:px-2.5 py-1 rounded-full flex items-center gap-1 select-none shadow-xs whitespace-nowrap"
            title="Asesmen wajib diisi untuk membuka fitur sistem"
          >
            <Lock class="w-3 h-3 text-amber-600" />
            <span>Wajib Diisi</span>
          </div>
        </div>

        <!-- Integrated bottom progress bar on header boundary -->
        <div class="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden">
          <div
            class="bg-indigo-600 h-full transition-all duration-500"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>

      <!-- Content Scrollable Body -->
      <div class="flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6 sm:py-5 space-y-4 sm:space-y-5">

        <!-- Data Subjek (only on section 1) - Flat on mobile, Card on desktop -->
        <div v-if="currentSectionIdx === 0" class="space-y-4 sm:space-y-3.5 sm:rounded-xl sm:border sm:border-slate-200/90 sm:bg-slate-50/70 sm:p-4">
          <div class="flex items-center justify-between pb-1 sm:pb-0">
            <h3 class="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
              <User class="w-3.5 h-3.5 text-indigo-600" /> Data Subjek Penilaian
            </h3>
            <span class="text-[10px] text-slate-400 font-medium">Identitas & Kronobiologi</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Nama -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Nama Lengkap</label>
              <input
                v-model="userName"
                type="text"
                placeholder="Nama Anda"
                class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 sm:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
              />
            </div>

            <!-- Usia & Profesi -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Usia & Profesi</label>
              <div class="flex gap-2">
                <input
                  v-model.number="userAge"
                  type="number"
                  placeholder="Usia"
                  class="w-20 px-2.5 py-2.5 text-xs sm:text-sm bg-slate-50 sm:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all text-center"
                />
                <input
                  v-model="userProfession"
                  type="text"
                  placeholder="Jabatan / Profesi"
                  class="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 sm:bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all"
                />
              </div>
            </div>

            <!-- Jam Tidur -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Jam berapa Anda tidur?</label>
              <div class="relative">
                <select
                  v-model="sleepOnset"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 sm:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all cursor-pointer font-medium appearance-none pr-8"
                >
                  <option value="21:00">21:00 WIB (Lebih Awal)</option>
                  <option value="21:30">21:30 WIB</option>
                  <option value="22:00">22:00 WIB</option>
                  <option value="22:30">22:30 WIB</option>
                  <option value="23:00">23:00 WIB</option>
                  <option value="23:30">23:30 WIB</option>
                  <option value="00:00">00:00 WIB (Tengah Malam)</option>
                  <option value="00:30">00:30 WIB</option>
                  <option value="01:00">01:00 WIB</option>
                  <option value="01:30">01:30 WIB</option>
                  <option value="02:00">02:00 WIB</option>
                  <option value="02:30">02:30 WIB</option>
                  <option value="03:00">03:00 WIB (Larut Malam)</option>
                  <option value="03:30">03:30 WIB</option>
                  <option value="04:00">04:00 WIB</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown class="w-4 h-4" />
                </div>
              </div>
            </div>

            <!-- Jam Bangun -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Jam berapa Anda bangun?</label>
              <div class="relative">
                <select
                  v-model="wakeOnset"
                  class="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 sm:bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all cursor-pointer font-medium appearance-none pr-8"
                >
                  <option value="04:30">04:30 WIB (Subuh / Awal)</option>
                  <option value="05:00">05:00 WIB</option>
                  <option value="05:30">05:30 WIB</option>
                  <option value="06:00">06:00 WIB</option>
                  <option value="06:30">06:30 WIB</option>
                  <option value="07:00">07:00 WIB</option>
                  <option value="07:30">07:30 WIB</option>
                  <option value="08:00">08:00 WIB</option>
                  <option value="08:30">08:30 WIB</option>
                  <option value="09:00">09:00 WIB</option>
                  <option value="09:30">09:30 WIB</option>
                  <option value="10:00">10:00 WIB (Siang)</option>
                  <option value="10:30">10:30 WIB</option>
                  <option value="11:00">11:00 WIB</option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                  <ChevronDown class="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <!-- Skrining Refleks Jam Biologis (5 Indikator MEQ - Bab 13.3) -->
          <div class="border-t border-slate-200/80 pt-4 sm:pt-3.5 space-y-3">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <h4 class="text-xs font-bold text-slate-800">Skrining Refleks Jam Biologis (5 Indikator)</h4>
              <span class="text-[10px] text-slate-500">Pilih opsi yang paling mencerminkan ritme alami Anda:</span>
            </div>

            <div class="space-y-3.5 sm:space-y-3">
              <div
                v-for="q in meqQuestions"
                :key="q.id"
                class="space-y-1.5"
              >
                <div class="text-xs font-semibold text-slate-800 leading-snug">
                  {{ q.text }}
                </div>
                <!-- Vertically stacked cards for mobile-first legibility and easy tap target -->
                <div class="flex flex-col gap-1.5">
                  <button
                    v-for="opt in q.options"
                    :key="opt.code"
                    type="button"
                    @click="meqAnswers[q.id] = opt.score"
                    class="w-full px-3 py-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center gap-2.5 touch-manipulation active:scale-[0.99]"
                    :class="
                      meqAnswers[q.id] === opt.score
                        ? 'bg-indigo-600 border-indigo-600 text-white font-medium shadow-xs'
                        : 'bg-slate-50 sm:bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    "
                  >
                    <span
                      class="w-5 h-5 rounded-md text-[10px] font-bold font-mono flex items-center justify-center shrink-0"
                      :class="meqAnswers[q.id] === opt.score ? 'bg-white/20 text-white' : 'bg-slate-200/70 sm:bg-slate-100 text-slate-600'"
                    >
                      {{ opt.code }}
                    </span>
                    <span class="leading-snug flex-1">{{ opt.text }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Title -->
        <div class="pt-1">
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Bagian {{ currentSectionIdx + 1 }} dari {{ sections.length }}
            </span>
          </div>
          <h3 class="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">{{ sections[currentSectionIdx].title }}</h3>
          <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ sections[currentSectionIdx].desc }}</p>
        </div>

        <!-- Questions - Flat list on mobile, Cards on desktop -->
        <div class="divide-y divide-slate-100 sm:divide-y-0 sm:space-y-3">
          <div
            v-for="q in currentQuestions"
            :key="q.id"
            class="py-3.5 first:pt-1 sm:py-4 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:p-4 space-y-2.5 sm:space-y-3"
          >
            <div class="flex items-start gap-2.5">
              <span class="mt-0.5 px-1.5 py-0.5 text-[10px] font-bold font-mono rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                {{ q.id }}
              </span>
              <p class="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">{{ q.text }}</p>
            </div>

            <!-- Likert Scale: 5 buttons with number & psychometric code -->
            <div class="space-y-1.5">
              <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
                <button
                  v-for="opt in likertOptions"
                  :key="opt.val"
                  type="button"
                  @click="selectAnswer(q.id, opt.val)"
                  class="py-2 sm:py-2.5 px-1 sm:px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 min-h-[46px] touch-manipulation active:scale-[0.97]"
                  :class="
                    answers[q.id] === opt.val
                      ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 font-medium'
                  "
                >
                  <span class="text-sm font-bold font-mono leading-none">{{ opt.val }}</span>
                  <span class="text-[9px] sm:text-[11px] leading-tight block truncate max-w-full">
                    <span class="sm:hidden">{{ opt.code }}</span>
                    <span class="hidden sm:inline">{{ opt.short }}</span>
                  </span>
                </button>
              </div>

              <!-- Legend hint on mobile -->
              <div class="flex items-center justify-between text-[10px] text-slate-400 px-1 sm:hidden">
                <span>1: Sangat Tidak Setuju</span>
                <span>5: Sangat Setuju</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex-none flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-t border-slate-200/80 bg-white pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          v-if="currentSectionIdx > 0"
          @click="prevSection"
          class="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl flex items-center gap-1 cursor-pointer transition-colors touch-manipulation"
        >
          <ChevronLeft class="w-4 h-4" />
          <span>Sebelumnya</span>
        </button>
        <div v-else></div>

        <button
          @click="nextSection"
          class="btn-exec-primary px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm touch-manipulation active:scale-[0.98]"
        >
          <span v-if="currentSectionIdx < sections.length - 1">Lanjut Berikutnya</span>
          <span v-else>Hitung Hasil Diagnostik</span>
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>

    </div>
  </div>
</template>
