<script setup lang="ts">
import { ref, computed } from 'vue';
import { HASTALOKA_ARCHETYPES } from '../../data/hastalokaData';
import { getArchetypeSynergy } from '../../utils/hastalokaMath';
import type { AssessmentResult } from '../../types/hastaloka';
import { Users2 } from '@lucide/vue';

const props = defineProps<{
  assessment: AssessmentResult | null;
}>();

const primaryArch = computed(() => props.assessment?.primaryArchetype);
const partnerArchetypeId = ref('mechanic');

const partnerArchetype = computed(() => {
  return HASTALOKA_ARCHETYPES.find((a) => a.id === partnerArchetypeId.value) || HASTALOKA_ARCHETYPES[3];
});

const partnerSynergy = computed(() => {
  const myId = primaryArch.value?.id || 'catalyst';
  return getArchetypeSynergy(myId, partnerArchetypeId.value);
});

// Communication Cheat Sheet
const commCheatSheet = computed(() => {
  const p = partnerArchetype.value;
  switch (p.id) {
    case 'architect':
      return {
        doText: 'Sajikan ide dengan struktur logis, data pendukung, dan rencana jangka panjang yang jelas.',
        dontText: 'Jangan ajak mereka memutuskan hal besar secara mendadak tanpa landasan data yang jelas.',
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
</script>

<template>
  <div class="space-y-4 pt-4 border-t border-slate-200">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Users2 class="w-4 h-4 text-purple-600" />
        <h3 class="text-sm font-bold text-slate-900 tracking-tight text-left">Kecocokan Kerja Sama Tim & Komunikasi</h3>
      </div>
      <span class="text-xs text-slate-500 font-mono">Simulasi Partner</span>
    </div>

    <!-- Partner Selector -->
    <div class="flex items-center gap-2 text-xs text-left">
      <span class="font-bold text-slate-600 shrink-0">Jika berpartner dengan:</span>
      <select
        v-model="partnerArchetypeId"
        class="flex-1 px-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full text-slate-900 focus:outline-none focus:border-[#6366f1] focus:bg-white transition-all shadow-2xs"
      >
        <option v-for="arch in HASTALOKA_ARCHETYPES" :key="arch.id" :value="arch.id">
          {{ arch.name }} ({{ arch.indonesianName }})
        </option>
      </select>
    </div>

    <!-- Synergy Result: no box, just clean layout -->
    <div class="space-y-1 text-left">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="text-xs font-bold text-slate-900">{{ partnerSynergy.tagline }}</span>
        <span
          class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold"
          :class="{
            'bg-emerald-100 text-emerald-800 border border-emerald-200': partnerSynergy.type === 'Tinggi',
            'bg-rose-100 text-rose-800 border border-rose-200': partnerSynergy.type === 'Rawan Gesekan',
            'bg-blue-100 text-blue-800 border border-blue-200': partnerSynergy.type === 'Netral Komplementer'
          }"
        >
          {{ partnerSynergy.type === 'Tinggi' ? 'Sangat Cocok' : partnerSynergy.type === 'Rawan Gesekan' ? 'Perlu Hati-Hati' : 'Saling Melengkapi' }}
        </span>
      </div>
      <p class="text-[11px] text-slate-600 leading-relaxed font-normal text-left">
        {{ partnerSynergy.description }}
      </p>
    </div>

    <!-- DO / DON'T: divider-separated, no card boxes -->
    <div class="divide-y divide-slate-200">
      <div class="pb-3 space-y-1 text-left">
        <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-900 block">✓ CARA TERBAIK BERKOMUNIKASI (Dianjurkan):</span>
        <p class="text-[11px] text-slate-700 leading-relaxed text-left font-normal">
          {{ commCheatSheet.doText }}
        </p>
      </div>
      <div class="pt-3 space-y-1 text-left">
        <span class="text-[10px] font-bold uppercase tracking-wider text-rose-900 block">✕ HAL YANG BIKIN RUSAK KERJA SAMA (Hindari):</span>
        <p class="text-[11px] text-slate-700 leading-relaxed text-left font-normal">
          {{ commCheatSheet.dontText }}
        </p>
      </div>
    </div>

    <!-- Role Split -->
    <div class="space-y-0.5 border-l-2 border-slate-200 pl-3 text-left">
      <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pembagian Peran Ideal:</span>
      <p class="text-[11px] text-slate-600 italic leading-relaxed text-left">
        {{ commCheatSheet.roleSplit }}
      </p>
    </div>
  </div>
</template>
