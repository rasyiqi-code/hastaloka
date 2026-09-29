<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Users2,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Bot,
  ShieldAlert,
  Sparkles,
  ArrowRight
} from '@lucide/vue';
import { HASTALOKA_ARCHETYPES } from '../data/hastalokaData';
import { getArchetypeSynergy } from '../utils/hastalokaMath';
import type { AssessmentResult } from '../types/hastaloka';

const props = defineProps<{
  assessment: AssessmentResult | null;
}>();

const emit = defineEmits<{
  (e: 'open-ai-chat', prompt: string): void;
}>();

const myArchetypeId = computed(() => props.assessment?.primaryArchetype.id || 'catalyst');
const partnerArchetypeId = ref('mechanic');

const myArchetype = computed(() => {
  return HASTALOKA_ARCHETYPES.find((a) => a.id === myArchetypeId.value) || HASTALOKA_ARCHETYPES[0];
});

const partnerArchetype = computed(() => {
  return HASTALOKA_ARCHETYPES.find((a) => a.id === partnerArchetypeId.value) || HASTALOKA_ARCHETYPES[3];
});

const synergy = computed(() => {
  return getArchetypeSynergy(myArchetypeId.value, partnerArchetypeId.value);
});

// Dynamic Communication Cheat Sheet
const commCheatSheet = computed(() => {
  const p = partnerArchetype.value;
  switch (p.id) {
    case 'architect':
      return {
        doText: 'Sajikan ide dengan struktur logis, data pendukung, dan rencana jangka panjang yang jelas.',
        dontText: 'Jangan ajak mereka memutuskan hal besar secara mendadak atau tanpa landasan data yang jelas.',
        roleSplit: `Anda memegang inisiatif & adaptasi lapangan, sementara ${p.name} merancang cetak biru sistem & tata kelola.`
      };
    case 'catalyst':
      return {
        doText: 'Fokus pada kecepatan eksekusi, peluang terobosan, dan dampak langsung ke pertumbuhan.',
        dontText: 'Jangan bebani mereka dengan birokrasi berbelit atau spreadsheet kepatuhan di tahap awal ide.',
        roleSplit: `${p.name} menyalakan momentum awal, sementara Anda menjaga kesinambungan dan penyelesaian akhir.`
      };
    case 'evangelist':
      return {
        doText: 'Bicarakan visi besar, resonansi cerita, dan bagaimana publik/klien akan menyambutnya.',
        dontText: 'Jangan mengabaikan antusiasme mereka atau langsung menyiram dengan detail angka yang dingin.',
        roleSplit: `${p.name} memegang narasi, hubungan klien & pitching, sementara Anda menyiapkan substansi teknis.`
      };
    case 'mechanic':
      return {
        doText: 'Hargai alur kerja yang sudah rapi, jelaskan efisiensi biaya, dan beri ruang merapikan sistem.',
        dontText: 'Jangan merombak aturan main seenaknya di tengah jalan tanpa diskusi teknis terlebih dahulu.',
        roleSplit: `Anda membawa proyek/ide baru masuk, sementara ${p.name} memastikan operasional berjalan tanpa bocor.`
      };
    case 'allocator':
      return {
        doText: 'Tunjukkan rasio imbal-hasil (ROI), manajemen risiko kerugian modal, dan proyeksi jangka menengah.',
        dontText: 'Jangan meminta komitmen modal besar hanya berdasarkan firasat atau intuisi abstrak.',
        roleSplit: `${p.name} mengontrol alokasi anggaran & kalkulasi risiko, sementara Anda mengeksekusi peluang di pasar.`
      };
    case 'arbitrageur':
      return {
        doText: 'Bicara tentang kecepatan menangkap celah pasar sebelum kompetitor lain sadar.',
        dontText: 'Jangan terlalu lambat membalas atau menunda-nunda keputusan saat jendela peluang sudah terbuka.',
        roleSplit: `${p.name} memburu celah asimetri pasar, sementara Anda membangun fondasi reputasi yang langgeng.`
      };
    case 'specialist':
      return {
        doText: 'Hargai keahlian teknis mendalam mereka, dengarkan pertimbangan standar mutu dari mereka.',
        dontText: 'Jangan memaksa mereka melakukan pekerjaan sosial/networking yang menguras energi fokus mereka.',
        roleSplit: `${p.name} memproduksi karya berkualitas standar tinggi, sementara Anda mengurus aspek komersialnya.`
      };
    case 'accumulator':
    default:
      return {
        doText: 'Tekankan perlindungan modal, cadangan kas darurat, dan jaminan keamanan bisnis.',
        dontText: 'Jangan mengajak mereka berspekulasi atau mempertaruhkan seluruh aset dalam satu keranjang.',
        roleSplit: `${p.name} menjaga benteng pertahanan dari krisis, sementara Anda menjadi mesin pencari arus kas baru.`
      };
  }
});

function consultRelationshipAI() {
  const prompt = `Saya adalah seorang ${myArchetype.value.name} dan sedang bekerja sama/berelasi dengan seorang ${partnerArchetype.value.name}. Bagaimana strategi terbaik agar kerja sama kami saling melipatgandakan hasil dan bebas dari salah paham?`;
  emit('open-ai-chat', prompt);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header Card -->
    <div class="exec-card p-6 bg-white border border-slate-200 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center border border-slate-800 shadow-xs">
            <Users2 class="w-4 h-4 text-purple-300" />
          </div>
          <div>
            <h3 class="text-base font-bold text-slate-900 tracking-tight">Sinergi Partner & Tim (People Dyad Navigator)</h3>
            <p class="text-xs text-slate-500 font-normal">
              Panduan interaksi praktis, cheat sheet persuasi, dan pembagian peran ideal dengan rekan kerja atau pasangan
            </p>
          </div>
        </div>

        <button
          @click="consultRelationshipAI"
          class="btn-exec-primary px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Bot class="w-3.5 h-3.5 text-blue-300" />
          <span>Bahas Dinamika di Co-Pilot</span>
        </button>
      </div>

      <!-- Partner Archetype Selector -->
      <div class="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span class="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Pilih Arketipe Rekan Kerja / Pasangan Anda:
          </span>
          <span class="text-xs text-slate-500">
            Profil Anda: <strong class="text-slate-900">{{ myArchetype.name }}</strong> ({{ myArchetype.indonesianName }})
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            v-for="arch in HASTALOKA_ARCHETYPES"
            :key="arch.id"
            @click="partnerArchetypeId = arch.id"
            class="p-2.5 rounded-lg border text-left transition-all cursor-pointer text-xs"
            :class="
              partnerArchetypeId === arch.id
                ? 'bg-slate-900 text-white border-slate-900 font-semibold shadow-xs'
                : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-800'
            "
          >
            <div class="font-bold truncate">{{ arch.name }}</div>
            <div class="text-[10px] truncate opacity-75">{{ arch.indonesianName }}</div>
          </button>
        </div>
      </div>
    </div>

    <!-- Synergy Results & Communication Cheat Sheet Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left Column (5 Cols): Synergy Overview -->
      <div class="lg:col-span-5 exec-card p-6 bg-white border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Tingkat Keselarasan Dyad</span>
          <span
            class="px-2 py-0.5 text-[10px] font-mono font-bold rounded uppercase tracking-wider"
            :class="{
              'bg-emerald-100 text-emerald-800 border border-emerald-300': synergy.type === 'Tinggi',
              'bg-rose-100 text-rose-800 border border-rose-300': synergy.type === 'Rawan Gesekan',
              'bg-blue-100 text-blue-800 border border-blue-300': synergy.type === 'Netral Komplementer',
            }"
          >
            {{ synergy.type === 'Tinggi' ? 'Sinergi Sangat Klop' : synergy.type === 'Rawan Gesekan' ? 'Rawan Gesekan Friksi' : 'Saling Melengkapi' }}
          </span>
        </div>

        <div>
          <h4 class="text-base font-bold text-slate-900">{{ synergy.tagline }}</h4>
          <p class="text-xs text-slate-600 leading-relaxed font-normal mt-1.5">
            {{ synergy.description }}
          </p>
        </div>

        <!-- Role Split Blueprint -->
        <div class="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <span class="text-[11px] font-bold uppercase tracking-wider text-slate-900 block">
            ⚖️ Pembagian Tanggung Jawab Alami:
          </span>
          <p class="text-xs text-slate-700 leading-relaxed">
            {{ commCheatSheet.roleSplit }}
          </p>
        </div>

        <!-- Protocol jika ada -->
        <div v-if="synergy.protocol" class="p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-1">
          <div class="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle class="w-3.5 h-3.5 text-amber-600" />
            <span>Kunci Kesepakatan Bersama:</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed">
            {{ synergy.protocol }}
          </p>
        </div>
      </div>

      <!-- Right Column (7 Cols): Communication Cheat Sheet -->
      <div class="lg:col-span-7 exec-card p-6 bg-white border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="flex items-center gap-2">
            <MessageSquare class="w-4 h-4 text-slate-700" />
            <h4 class="text-sm font-bold text-slate-900">
              Cheat Sheet Komunikasi Efektif dengan {{ partnerArchetype.name }}
            </h4>
          </div>
          <span class="text-xs text-slate-400 font-mono">Persuasi Rasional</span>
        </div>

        <!-- DO & DONT CARDS -->
        <div class="space-y-3">
          <!-- Cara Bicara yang Efektif (DO) -->
          <div class="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-1.5">
            <div class="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 class="w-4 h-4 text-emerald-600" />
              <span>Pendekatan yang Sangat Mereka Hargai (DO):</span>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed">
              {{ commCheatSheet.doText }}
            </p>
          </div>

          <!-- Cara Bicara yang Dihindari (DONT) -->
          <div class="p-4 rounded-lg bg-rose-50/50 border border-rose-200 space-y-1.5">
            <div class="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <XCircle class="w-4 h-4 text-rose-600" />
              <span>Pemicu Resistensi / Friksi (DON'T):</span>
            </div>
            <p class="text-xs text-slate-700 leading-relaxed">
              {{ commCheatSheet.dontText }}
            </p>
          </div>
        </div>

        <!-- Prompt Shortcut to AI -->
        <div class="pt-2">
          <button
            @click="consultRelationshipAI"
            class="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Minta Co-Pilot AI menyusun simulasi percakapan atau pembagian saham/peran</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
