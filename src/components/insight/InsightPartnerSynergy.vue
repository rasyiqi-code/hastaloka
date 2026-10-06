<script setup lang="ts">
import { ref, computed } from 'vue';
import { HASTALOKA_ARCHETYPES } from '../../data/hastalokaData';
import { getArchetypeSynergy } from '../../utils/hastalokaMath';
import type { AssessmentResult } from '../../types/hastaloka';
import { Users2, ChevronRight, X, Check } from '@lucide/vue';

const props = defineProps<{
  assessment: AssessmentResult | null;
}>();

const primaryArch = computed(() => props.assessment?.primaryArchetype);
const partnerArchetypeId = ref('mechanic');
const isDrawerOpen = ref(false);

function selectArchetype(id: string) {
  partnerArchetypeId.value = id;
  isDrawerOpen.value = false;
}

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
        doText: 'Jelaskan ide Anda dengan runtut, pakai contoh nyata, dan kasih waktu dia buat mencerna dan bikin rencana dulu.',
        dontText: 'Jangan todong dia ambil keputusan besar mendadak tanpa data yang jelas, dia bakal stres.',
        roleSplit: `Anda yang aktif gerak dan tes lapangan, sementara ${p.name} yang merapikan cara kerja dan rencananya.`
      };
    case 'catalyst':
      return {
        doText: 'Langsung to-the-point ke inti peluang, tunjukkan hasil cepatnya, dan kasih ruang dia buat langsung tancap gas.',
        dontText: 'Jangan dijejali aturan berbelit-belit atau disuruh ngisi laporan tabel yang rumit di awal-awal ide muncul.',
        roleSplit: `${p.name} yang membuka jalan dan menyalakan semangat awal, sementara Anda yang menjaga agar kerjaan tuntas sampai akhir.`
      };
    case 'evangelist':
      return {
        doText: 'Bahas cerita serunya, siapa saja orang yang bakal senang, dan puji antusiasme bicaranya.',
        dontText: 'Jangan langsung potong semangatnya atau buru-buru menyiram dengan angka-angka teknis yang bikin suasana dingin.',
        roleSplit: `${p.name} yang jago ngomong, presentasi ke klien, dan cari muka di depan publik, sementara Anda yang siapin substansi di balik layar.`
      };
    case 'mechanic':
      return {
        doText: 'Hargai cara kerjanya yang rapi, tunjukkan cara hemat biaya, dan kasih dia kebebasan membereskan alur kerja yang macet.',
        dontText: 'Jangan asal gonta-ganti aturan main di tengah jalan tanpa ngobrol dan rembukan dulu sama dia.',
        roleSplit: `Anda yang bawa proyek atau kerjaan baru masuk, sementara ${p.name} yang memastikan kerjaan beres tanpa bocor dan tanpa cacat.`
      };
    case 'allocator':
      return {
        doText: 'Bawa hitungan untung-rugi yang masuk akal, batas aman risiko, dan kapan modalnya bisa balik.',
        dontText: 'Jangan minta dia keluar modal cuma bermodalkan feeling atau omongan "pokoknya percaya deh".',
        roleSplit: `${p.name} yang ngitung budget dan jaga uang, sementara Anda yang mengeksekusi peluangnya di lapangan.`
      };
    case 'arbitrageur':
      return {
        doText: 'Bicara soal kecepatan menangkap peluang sebelum keduluan orang lain, dan langsung putuskan dengan gesit.',
        dontText: 'Jangan lelet membalas pesan atau nunda-nunda keputusan pas jendela kesempatan lagi terbuka lebar.',
        roleSplit: `${p.name} yang jago berburu celah untung cepat, sementara Anda yang menjaga nama baik dan fondasi jangka panjangnya.`
      };
    case 'specialist':
      return {
        doText: 'Hargai keahlian teknisnya yang langka, dengarkan sarannya soal standar mutu, dan beri dia ketenangan bekerja.',
        dontText: 'Jangan paksa dia banyak basa-basi sosial atau disuruh jualan keliling yang menguras fokus otaknya.',
        roleSplit: `${p.name} yang meracik karya berstandar tinggi, sementara Anda yang mengurus urusan penjualan dan urusan luarnya.`
      };
    case 'accumulator':
    default:
      return {
        doText: 'Yakinkan bahwa uang aman, ada tabungan darurat, dan risikonya sudah dihitung matang.',
        dontText: 'Jangan ajak dia berspekulasi atau mempertaruhkan seluruh tabungan dalam satu tempat yang belum pasti.',
        roleSplit: `${p.name} yang menjaga benteng agar tidak bangkrut pas krisis, sementara Anda yang jadi mesin pencari pemasukan baru.`
      };
  }
});
</script>

<template>
  <div class="space-y-4 pt-4 border-t border-slate-200">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <Users2 class="w-4 h-4 text-purple-600 shrink-0" />
        <h3 class="text-sm font-bold text-slate-900 tracking-tight text-left">Kecocokan Kerja Sama Tim & Komunikasi</h3>
      </div>
      <span class="text-[11px] sm:text-xs text-slate-500 font-mono shrink-0">Simulasi Partner</span>
    </div>

    <!-- Mobile: Drawer trigger button (NO DROPDOWN ON MOBILE) -->
    <div class="sm:hidden space-y-1.5 text-left">
      <span class="text-xs font-bold text-slate-600 block">Jika berpartner dengan:</span>
      <button
        type="button"
        @click="isDrawerOpen = true"
        class="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-2xl text-left transition-all shadow-2xs group cursor-pointer"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span
            class="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
            :style="{ backgroundColor: partnerArchetype.color }"
          ></span>
          <div class="min-w-0 truncate">
            <span class="text-xs font-bold text-slate-900">
              {{ partnerArchetype.name }}
            </span>
            <span class="text-xs font-medium text-slate-500 ml-1">
              ({{ partnerArchetype.indonesianName }})
            </span>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0 text-indigo-600 font-semibold text-xs ml-2">
          <span>Pilih</span>
          <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </div>
      </button>
    </div>

    <!-- Desktop: Inline select -->
    <div class="hidden sm:flex items-center gap-2.5 text-xs text-left">
      <label for="partner-archetype-select" class="font-bold text-slate-600 shrink-0">Jika berpartner dengan:</label>
      <div class="flex-1 min-w-0">
        <select
          id="partner-archetype-select"
          v-model="partnerArchetypeId"
          class="w-full px-3.5 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-full text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-2xs truncate cursor-pointer"
        >
          <option v-for="arch in HASTALOKA_ARCHETYPES" :key="arch.id" :value="arch.id">
            {{ arch.name }} ({{ arch.indonesianName }})
          </option>
        </select>
      </div>
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

    <!-- MOBILE BOTTOM SHEET DRAWER -->
    <Teleport to="body">
      <div
        v-if="isDrawerOpen"
        class="fixed inset-0 z-50 flex flex-col justify-end sm:hidden"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          @click="isDrawerOpen = false"
        ></div>

        <!-- Sheet Panel -->
        <div
          class="relative z-10 w-full bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300 overflow-hidden"
          style="padding-bottom: max(env(safe-area-inset-bottom, 0px), 1rem);"
        >
          <!-- Drag / Dismiss Handle -->
          <div class="pt-3 pb-1.5 flex justify-center cursor-pointer" @click="isDrawerOpen = false">
            <div class="w-10 h-1.5 bg-slate-300 rounded-full"></div>
          </div>

          <!-- Drawer Header -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <div>
              <h3 class="text-sm font-bold text-slate-900">Pilih Partner Kerja Sama</h3>
              <p class="text-[11px] text-slate-500">Simulasikan kecocokan komunikasi & kerja tim</p>
            </div>
            <button
              type="button"
              @click="isDrawerOpen = false"
              class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Archetypes List -->
          <div class="p-3.5 space-y-2 overflow-y-auto overscroll-contain">
            <button
              v-for="arch in HASTALOKA_ARCHETYPES"
              :key="arch.id"
              type="button"
              @click="selectArchetype(arch.id)"
              class="w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left border cursor-pointer"
              :class="partnerArchetypeId === arch.id
                ? 'bg-indigo-50/80 border-indigo-200 ring-1 ring-indigo-500/20 shadow-xs'
                : 'bg-white hover:bg-slate-50 border-slate-100 active:bg-slate-100'"
            >
              <div class="flex items-center gap-3 min-w-0 pr-2">
                <span
                  class="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                  :style="{ backgroundColor: arch.color }"
                ></span>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-bold text-slate-900">{{ arch.name }}</span>
                    <span class="text-[11px] font-medium text-slate-500">({{ arch.indonesianName }})</span>
                  </div>
                  <p class="text-[11px] text-slate-500 line-clamp-1 leading-tight mt-0.5">
                    {{ arch.role }}
                  </p>
                </div>
              </div>

              <div
                v-if="partnerArchetypeId === arch.id"
                class="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 ml-2 shadow-2xs"
              >
                <Check class="w-3.5 h-3.5 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
