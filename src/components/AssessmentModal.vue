<script setup lang="ts">
import { ref, computed } from 'vue';
import confetti from 'canvas-confetti';
import {
  X,
  ChevronRight,
  ChevronLeft,
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
  { val: 1, label: 'Sangat Tidak Setuju', short: 'Sangat Tidak' },
  { val: 2, label: 'Kurang Setuju',       short: 'Kurang' },
  { val: 3, label: 'Netral',              short: 'Netral' },
  { val: 4, label: 'Setuju',             short: 'Setuju' },
  { val: 5, label: 'Sangat Setuju',      short: 'Sangat Setuju' },
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
    class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
    @click.self="canClose ? emit('close') : null"
  >
    <div class="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">

      <!-- Unified Single-Row Modal Header -->
      <div class="relative bg-white border-b border-slate-200/80 px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
        <!-- Section Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <div
            v-for="(sec, idx) in sections"
            :key="sec.key"
            class="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-default"
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
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center"
            title="Tutup Modal"
          >
            <X class="w-4 h-4" />
          </button>
          <div
            v-else
            class="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full flex items-center gap-1 select-none shadow-xs"
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
      <div class="flex-1 overflow-y-auto px-5 py-5 space-y-5">

        <!-- Data Subjek (only on section 1) -->
        <div v-if="currentSectionIdx === 0" class="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <h3 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <User class="w-3.5 h-3.5" /> Data Subjek Penilaian
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <!-- Nama -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Nama Lengkap</label>
              <input
                v-model="userName"
                type="text"
                placeholder="Nama Anda"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
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
                  class="w-20 px-2.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
                <input
                  v-model="userProfession"
                  type="text"
                  placeholder="Jabatan / Profesi"
                  class="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all"
                />
              </div>
            </div>

            <!-- Jam Tidur -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Jam berapa Anda tidur?</label>
              <select
                v-model="sleepOnset"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all cursor-pointer font-medium"
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
            </div>

            <!-- Jam Bangun -->
            <div class="space-y-1">
              <label class="block text-xs font-semibold text-slate-600">Jam berapa Anda bangun?</label>
              <select
                v-model="wakeOnset"
                class="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition-all cursor-pointer font-medium"
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
            </div>
          </div>

          <!-- Skrining Refleks Jam Biologis (5 Indikator MEQ - Bab 13.3) -->
          <div class="border-t border-slate-200/80 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-bold text-slate-800">Skrining Refleks Jam Biologis (5 Indikator)</h4>
              <span class="text-[10px] text-slate-500">Pilih kondisi biologis yang paling mencerminkan diri Anda:</span>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="q in meqQuestions"
                :key="q.id"
                class="space-y-1"
              >
                <div class="text-xs font-semibold text-slate-700">
                  {{ q.text }}
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                  <button
                    v-for="opt in q.options"
                    :key="opt.code"
                    type="button"
                    @click="meqAnswers[q.id] = opt.score"
                    class="px-2.5 py-1.5 rounded-lg border text-left text-[11px] transition-all cursor-pointer flex items-start gap-1.5"
                    :class="
                      meqAnswers[q.id] === opt.score
                        ? 'bg-indigo-600 border-indigo-600 text-white font-medium shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    "
                  >
                    <span
                      class="w-4 h-4 rounded text-[9px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5"
                      :class="meqAnswers[q.id] === opt.score ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'"
                    >
                      {{ opt.code }}
                    </span>
                    <span class="leading-tight">{{ opt.text }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section Title -->
        <div>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">
              Bagian {{ currentSectionIdx + 1 }} dari {{ sections.length }}
            </span>
          </div>
          <h3 class="text-base font-extrabold text-slate-900 tracking-tight">{{ sections[currentSectionIdx].title }}</h3>
          <p class="text-xs text-slate-500 mt-0.5 leading-relaxed">{{ sections[currentSectionIdx].desc }}</p>
        </div>

        <!-- Questions -->
        <div class="space-y-3">
          <div
            v-for="q in currentQuestions"
            :key="q.id"
            class="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
          >
            <div class="flex items-start gap-2.5">
              <span class="mt-0.5 px-1.5 py-0.5 text-[10px] font-bold font-mono rounded-md bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                {{ q.id }}
              </span>
              <p class="text-xs font-semibold text-slate-800 leading-snug">{{ q.text }}</p>
            </div>

            <!-- Likert Scale -->
            <div class="grid grid-cols-5 gap-1.5">
              <button
                v-for="opt in likertOptions"
                :key="opt.val"
                type="button"
                @click="selectAnswer(q.id, opt.val)"
                class="py-2.5 px-1.5 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-center min-h-[42px]"
                :class="
                  answers[q.id] === opt.val
                    ? 'bg-indigo-600 border-indigo-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 font-medium'
                "
              >
                <span class="text-xs leading-tight text-center">{{ opt.short }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-white">
        <button
          v-if="currentSectionIdx > 0"
          @click="prevSection"
          class="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ChevronLeft class="w-3.5 h-3.5" /> Sebelumnya
        </button>
        <div v-else></div>

        <button
          @click="nextSection"
          class="btn-exec-primary px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <span v-if="currentSectionIdx < sections.length - 1">Lanjut Berikutnya</span>
          <span v-else>Hitung Hasil Diagnostik</span>
          <ChevronRight class="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  </div>
</template>
