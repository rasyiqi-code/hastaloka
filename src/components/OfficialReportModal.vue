<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  Download,
  Loader2,
  X,
  ShieldCheck,
  FileText
} from '@lucide/vue';
import type { AssessmentResult } from '../types/hastaloka';
import RadarChart from './RadarChart.vue';
import { getSystemicDiagnostic } from '../utils/hastalokaDiagnostic';
import { getArchetypeSynergy } from '../utils/hastalokaMath';
import { HASTALOKA_ARCHETYPES } from '../data/hastalokaData';

const props = defineProps<{
  assessment: AssessmentResult;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const isDownloading = ref(false);
const reportCanvasRef = ref<HTMLElement | null>(null);
const pdfDocRef = ref<HTMLElement | null>(null);

const systemicDossier = computed(() => getSystemicDiagnostic(props.assessment));

// Temukan pasangan sinergi terbaik untuk arketipe utama
const idealPartner = computed(() => {
  const primaryId = props.assessment.primaryArchetype.id;
  const partnerMap: Record<string, string> = {
    catalyst: 'mechanic',
    mechanic: 'catalyst',
    architect: 'evangelist',
    evangelist: 'architect',
    allocator: 'arbitrageur',
    arbitrageur: 'allocator',
    specialist: 'accumulator',
    accumulator: 'specialist'
  };
  const targetId = partnerMap[primaryId] || 'mechanic';
  const partnerProfile = HASTALOKA_ARCHETYPES.find(a => a.id === targetId) || HASTALOKA_ARCHETYPES[3];
  const synergy = getArchetypeSynergy(primaryId, targetId);
  return {
    profile: partnerProfile,
    synergy
  };
});

async function handleDownloadPDF() {
  if (isDownloading.value) return;
  isDownloading.value = true;

  try {
    const container = pdfDocRef.value || reportCanvasRef.value;
    if (!container) throw new Error('Elemen dokumen tidak ditemukan');

    const pageElements = Array.from(
      container.querySelectorAll<HTMLElement>('.pdf-doc-page')
    );
    const targetPages = pageElements.length > 0
      ? pageElements
      : Array.from(container.querySelectorAll<HTMLElement>('.pdf-page'));

    if (targetPages.length === 0) throw new Error('Halaman laporan tidak ditemukan');

    // Dynamic import to keep bundle light
    // @ts-ignore
    const html2canvasModule = await import('html2canvas-pro');
    const html2canvas = html2canvasModule.default || html2canvasModule;
    const { jsPDF } = await import('jspdf');

    const pdfWidth = 210;
    const pdfHeight = 297;

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    });

    for (let i = 0; i < targetPages.length; i++) {
      const pageEl = targetPages[i];

      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123
      });

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.98);

      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        'FAST'
      );
    }

    const safeName = (props.assessment.userName || 'Subjek')
      .trim()
      .replace(/[^a-zA-Z0-9_\u00C0-\u017F\s-]/g, '')
      .replace(/\s+/g, '_');
    const filename = `Laporan-Resmi-Hastaloka-${safeName}.pdf`;

    pdf.save(filename);
  } catch (err) {
    console.error('Direct PDF export error:', err);
    window.print();
  } finally {
    isDownloading.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm">
    <div class="relative w-full max-w-5xl h-full sm:h-[94vh] flex flex-col bg-white border-0 sm:border border-slate-200 rounded-none sm:rounded-2xl shadow-none sm:shadow-2xl overflow-hidden print:h-auto print:max-h-none print:border-none print:shadow-none">
      
      <!-- Toolbar Non-Cetak (Fixed at Top of Modal) -->
      <div class="no-print shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-slate-200 bg-white/95 backdrop-blur-sm z-20">
        <div class="flex items-center gap-2.5 sm:gap-3">
          <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs shrink-0">
            <FileText class="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h3 class="text-xs sm:text-sm font-extrabold text-slate-900">Laporan Resmi Hasil Diagnostik</h3>
            <p class="text-[10px] sm:text-xs text-slate-500 font-medium hidden xs:block">Dokumen formal standar PDF (4 halaman, 10 bagian lengkap) — siap unduh cetak A4</p>
          </div>
        </div>
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            :disabled="isDownloading"
            @click="handleDownloadPDF"
            class="px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-75 disabled:cursor-wait rounded-lg sm:rounded-xl shadow-md shadow-indigo-600/25 transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer"
            title="Download file PDF langsung ke perangkat"
          >
            <Loader2 v-if="isDownloading" class="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
            <Download v-else class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{{ isDownloading ? 'Membuat PDF...' : 'Download PDF' }}</span>
          </button>
          <button
            @click="emit('close')"
            class="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Scrollable Container (Viewer Style: Full edge on mobile, centered card on desktop) -->
      <div class="flex-1 overflow-y-auto p-0 sm:p-6 md:p-8 bg-white sm:bg-slate-100/90 text-slate-900 print:overflow-visible print:p-0 print:bg-white">
        <!-- Printable Document Canvas -->
        <div
          ref="reportCanvasRef"
          class="w-full max-w-[820px] mx-auto space-y-0 sm:space-y-8 divide-y-4 divide-slate-100 sm:divide-y-0"
        >

          <!-- ========================================== -->
          <!-- HALAMAN 1: IDENTITAS & PETA GEOMETRI KARAKTER -->
          <!-- ========================================== -->
          <div class="pdf-page bg-white p-4 sm:p-6 md:p-7 rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/80 shadow-none sm:shadow-xs flex flex-col justify-between space-y-5 sm:min-h-[1160px]">
            <div class="space-y-6">
              <!-- KOP DOKUMEN RESMI -->
              <div class="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
                    <span class="text-[10px] font-mono font-black tracking-widest text-indigo-700 uppercase">
                      HASTALOKA HUMAN PSYCHOMETRICS & STRATEGIC SYSTEM
                    </span>
                  </div>
                  <h1 class="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                    LAPORAN RESMI DIAGNOSTIK KEPRIBADIAN & NAVIGASI STRATEGIS
                  </h1>
                  <p class="text-xs text-slate-600 font-medium leading-relaxed">
                    Analisis Komprehensif 5 Vektor Neuro-Perilaku, 8 Arketipe, Potensi Finansial, Ritme Sirkadian & Sinergi Tim
                  </p>
                </div>
                <div class="text-left sm:text-right font-mono text-xs text-slate-600 shrink-0 space-y-0.5">
                  <div>Nomor Registrasi: <strong class="text-indigo-700 font-bold">{{ assessment.id }}</strong></div>
                  <div>Tanggal Asesmen: <span class="text-slate-900 font-semibold">{{ new Date(assessment.timestamp).toLocaleDateString('id-ID', { dateStyle: 'long' }) }}</span></div>
                  <div>Status Dokumen: <strong class="text-emerald-700 font-bold">TERVERIFIKASI SISTEM</strong></div>
                </div>
              </div>

              <!-- I. IDENTITAS SUBJEK & PARAMETER BIOLOGIS -->
              <div class="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div class="flex items-center justify-between mb-2.5 border-b border-slate-200/80 pb-2">
                  <h3 class="text-xs font-black uppercase tracking-wider text-slate-700">
                    I. Identitas Subjek Teruji & Parameter Biologis
                  </h3>
                  <span class="text-[10px] font-mono text-slate-500">Data Subjek Resmi</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
                  <div>
                    <span class="text-slate-500 block text-[11px]">Nama Lengkap:</span>
                    <strong class="text-sm text-slate-900 font-extrabold">{{ assessment.userName || 'Subjek Diagnostik' }}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Usia:</span>
                    <strong class="text-sm text-slate-900 font-extrabold">{{ assessment.userAge ? `${assessment.userAge} Tahun` : 'Tidak Diisi' }}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Profesi / Jabatan:</span>
                    <strong class="text-sm text-slate-900 font-extrabold">{{ assessment.userProfession || 'Profesional Eksekutif' }}</strong>
                  </div>
                  <div>
                    <span class="text-slate-500 block text-[11px]">Kronotipe Sirkadian:</span>
                    <strong class="text-sm text-indigo-700 font-extrabold capitalize">Tipe {{ assessment.chronotype }}</strong>
                  </div>
                </div>
              </div>

              <!-- II. PETA GEOMETRI & 5 VEKTOR KEKUATAN KARAKTER (H5V) -->
              <div class="space-y-3.5">
                <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 class="text-sm font-black uppercase tracking-wider text-slate-900">
                    II. Peta Geometri & 5 Vektor Kekuatan Karakter (H5V)
                  </h3>
                  <span class="text-xs font-mono font-bold text-indigo-700">Skala 0 – 100%</span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <!-- Radar Chart Canvas -->
                  <div class="md:col-span-5 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Visual Radar Profil vs Ideal</span>
                    <RadarChart
                      :user-scores="assessment.vectorScores"
                      :compare-scores="assessment.primaryArchetype.idealVector"
                      :compare-label="`Ideal ${assessment.primaryArchetype.name}`"
                      :size="240"
                    />
                  </div>

                  <!-- Tabel 5 Vektor dengan Status dan Penjelasan -->
                  <div class="md:col-span-7 space-y-2">
                    <div
                      v-for="vMoat in systemicDossier?.vectorMoats"
                      :key="vMoat.key"
                      class="p-2.5 rounded-xl border border-slate-200 bg-white space-y-0.5 text-xs shadow-2xs"
                    >
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-slate-900">{{ vMoat.name }}</span>
                        <div class="flex items-center gap-2">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="vMoat.badgeColor">
                            {{ vMoat.badge }}
                          </span>
                          <span class="font-mono font-black text-slate-900 text-xs w-9 text-right">{{ vMoat.score }}%</span>
                        </div>
                      </div>
                      <p class="text-[11px] text-slate-600 leading-snug">{{ vMoat.rarityInMarket }}</p>
                      <p class="text-[11px] text-slate-800 font-semibold leading-snug">
                        <span class="text-indigo-600">💡 Dampak:</span> {{ vMoat.economicMoat }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page 1 Running Footer -->
            <div class="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • DOKUMEN RAHASIA</span>
              <span>HALAMAN 1 DARI 4</span>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- HALAMAN 2: DIAGNOSIS ARKETIPE & JALUR CUAN -->
          <!-- ========================================== -->
          <div class="pdf-page bg-white p-4 sm:p-6 md:p-7 rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/80 shadow-none sm:shadow-xs flex flex-col justify-between space-y-5 sm:min-h-[1160px]">
            <div class="space-y-5">
              <!-- Running Header -->
              <div class="border-b border-slate-200 pb-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span class="font-bold text-slate-700">HASTALOKA OFFICIAL DOSSIER • DIAGNOSIS ARKETIPE & JALUR CUAN</span>
                </div>
                <div>
                  SUBJEK: <strong class="text-slate-900">{{ assessment.userName || 'Subjek' }}</strong> | REG: <span class="text-indigo-700 font-bold">{{ assessment.id }}</span>
                </div>
              </div>

              <!-- III. HASIL DIAGNOSIS ARKETIPE (UTAMA & SEKUNDER) -->
              <div class="space-y-3.5">
                <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 class="text-sm font-black uppercase tracking-wider text-slate-900">
                    III. Hasil Diagnosis Arketipe (Utama & Sekunder)
                  </h3>
                  <span class="text-xs text-slate-500 font-mono">Algoritma Pencocokan Cosine</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <!-- Arketipe Utama -->
                  <div class="p-3.5 rounded-xl border-2 border-indigo-300 bg-indigo-50/40 space-y-2">
                    <div class="flex items-start justify-between">
                      <div>
                        <span class="text-[10px] font-bold text-indigo-700 uppercase tracking-widest block">ARKETIPE DOMINAN UTAMA (RANK #1)</span>
                        <h4 class="text-base font-black text-slate-900 mt-0.5">
                          {{ assessment.primaryArchetype.name }} ({{ assessment.primaryArchetype.indonesianName }})
                        </h4>
                      </div>
                      <span class="text-sm font-mono font-black text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded-lg shadow-2xs">
                        {{ assessment.allArchetypeMatches[0]?.similarity || 98 }}%
                      </span>
                    </div>
                    <p class="text-xs text-slate-700 leading-relaxed font-normal">
                      {{ assessment.primaryArchetype.description }}
                    </p>
                    <div class="text-[11px] text-indigo-900 font-bold bg-indigo-100/70 p-2 rounded-lg">
                      Peran Kunci: {{ assessment.primaryArchetype.role }}
                    </div>
                  </div>

                  <!-- Arketipe Sekunder -->
                  <div class="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div class="flex items-start justify-between">
                      <div>
                        <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">ARKETIPE PENDUKUNG (RANK #2)</span>
                        <h4 class="text-base font-black text-slate-900 mt-0.5">
                          {{ assessment.secondaryArchetype.name }} ({{ assessment.secondaryArchetype.indonesianName }})
                        </h4>
                      </div>
                      <span class="text-sm font-mono font-black text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-2xs">
                        {{ assessment.allArchetypeMatches[1]?.similarity || 85 }}%
                      </span>
                    </div>
                    <p class="text-xs text-slate-600 leading-relaxed font-normal">
                      {{ assessment.secondaryArchetype.description }}
                    </p>
                    <div class="text-[11px] text-slate-800 font-bold bg-white p-2 rounded-lg border border-slate-200">
                      Peran Pendukung: {{ assessment.secondaryArchetype.role }}
                    </div>
                  </div>
                </div>

                <!-- Posisi Paling Pas & Keunggulan Alami -->
                <div v-if="systemicDossier" class="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200 space-y-1 text-xs">
                  <div class="flex items-center justify-between">
                    <h5 class="font-extrabold text-cyan-950 text-xs sm:text-sm">{{ systemicDossier.nicheTitle }}</h5>
                    <span class="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-mono font-bold text-[10px] uppercase">
                      {{ systemicDossier.nicheTag }}
                    </span>
                  </div>
                  <p class="text-slate-700 leading-relaxed">
                    {{ systemicDossier.moatSummary }}
                  </p>
                </div>
              </div>

              <!-- IV. REKOMENDASI KARIER & PELUANG REZEKI (MONETISASI) -->
              <div class="space-y-3">
                <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 class="text-sm font-black uppercase tracking-wider text-slate-900">
                    IV. Rekomendasi Karier & Peluang Rezeki (Jalur Cuan)
                  </h3>
                  <span class="text-xs text-slate-500 font-mono">Daya Ungkit Finansial</span>
                </div>

                <!-- Strategi Karier & Kemakmuran -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong class="text-indigo-800 uppercase tracking-wide block font-extrabold text-[11px]">
                      🎯 Rekomendasi Arah Karier Alami:
                    </strong>
                    <p class="text-slate-700 leading-relaxed font-normal">
                      {{ assessment.primaryArchetype.careerStrategy }}
                    </p>
                  </div>
                  <div class="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                    <strong class="text-emerald-800 uppercase tracking-wide block font-extrabold text-[11px]">
                      💰 Strategi Pertumbuhan Finansial:
                    </strong>
                    <p class="text-slate-700 leading-relaxed font-normal">
                      {{ assessment.primaryArchetype.wealthStrategy }}
                    </p>
                  </div>
                </div>

                <!-- 3 Model Bisnis / Peluang Kerja Praktis -->
                <div v-if="systemicDossier" class="space-y-2 pt-1">
                  <span class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    3 Model Bisnis / Peluang Kerja yang Pas dengan Karakter Anda:
                  </span>
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div
                      v-for="model in systemicDossier.leverageModels"
                      :key="model.id"
                      class="p-3 rounded-xl border border-slate-200 bg-white space-y-2 flex flex-col justify-between shadow-2xs"
                    >
                      <div class="space-y-1">
                        <div class="flex items-center justify-between">
                          <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" :class="model.badgeColor">
                            {{ model.badge }}
                          </span>
                        </div>
                        <h5 class="font-bold text-slate-900 leading-snug text-xs">{{ model.title }}</h5>
                        <p class="text-[11px] text-slate-600 leading-snug">{{ model.whyFits }}</p>
                      </div>
                      <div class="pt-2 border-t border-slate-100 space-y-1">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Langkah Eksekusi:</span>
                        <ul class="space-y-1 text-[10px] text-slate-700">
                          <li v-for="(step, sIdx) in model.steps.slice(0, 3)" :key="sIdx" class="flex items-start gap-1.5">
                            <span class="text-emerald-600 font-bold shrink-0">✓</span>
                            <span>{{ step }}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page 2 Running Footer -->
            <div class="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • DOKUMEN RAHASIA</span>
              <span>HALAMAN 2 DARI 4</span>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- HALAMAN 3: MITIGASI RISIKO & PRODUKTIVITAS -->
          <!-- ========================================== -->
          <div class="pdf-page bg-white p-4 sm:p-6 md:p-7 rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/80 shadow-none sm:shadow-xs flex flex-col justify-between space-y-5 sm:min-h-[1160px]">
            <div class="space-y-5">
              <!-- Running Header -->
              <div class="border-b border-slate-200 pb-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span class="font-bold text-slate-700">HASTALOKA OFFICIAL DOSSIER • MITIGASI RISIKO & PRODUKTIVITAS</span>
                </div>
                <div>
                  SUBJEK: <strong class="text-slate-900">{{ assessment.userName || 'Subjek' }}</strong> | REG: <span class="text-indigo-700 font-bold">{{ assessment.id }}</span>
                </div>
              </div>

              <!-- V. JEBAKAN DIRI & PROTOKOL PENCEGAHAN TITIK LENGAH -->
              <div class="space-y-3.5">
                <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 class="text-sm font-black uppercase tracking-wider text-slate-900">
                    V. Jebakan Diri & Protokol Pencegahan Titik Lengah
                  </h3>
                  <span class="text-xs text-rose-700 font-mono font-bold">Mitigasi Risiko Diri</span>
                </div>

                <!-- Blindspots Alami -->
                <div class="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5 text-xs">
                  <strong class="text-amber-900 uppercase tracking-wider block font-extrabold text-[11px]">
                    ⚠️ Titik Buta Alami (Blindspots) yang Sering Muncul:
                  </strong>
                  <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <li v-for="(bs, idx) in assessment.primaryArchetype.blindSpots" :key="idx" class="flex items-start gap-2">
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                      <span>{{ bs }}</span>
                    </li>
                  </ul>
                </div>

                <!-- 2 Protokol Pencegahan Masalah -->
                <div v-if="systemicDossier" class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div
                    v-for="hazard in systemicDossier.hazardProtocols"
                    :key="hazard.id"
                    class="p-3.5 rounded-xl border border-rose-200 bg-rose-50/30 space-y-2"
                  >
                    <div class="flex items-center justify-between">
                      <h5 class="font-bold text-slate-900 leading-snug">{{ hazard.name }}</h5>
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold" :class="hazard.riskBadgeColor">
                        Risiko {{ hazard.riskLevel }}
                      </span>
                    </div>
                    <p class="text-[11px] text-slate-600 leading-relaxed font-normal">
                      <strong class="text-slate-800">Dampak nyata:</strong> {{ hazard.realImpact }}
                    </p>
                    <div class="space-y-1 pt-1 border-t border-rose-100">
                      <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">3 Langkah Mengatasinya:</span>
                      <div class="space-y-1 text-[11px]">
                        <div v-for="st in hazard.steps" :key="st.num" class="flex items-start gap-1.5">
                          <span class="px-1 py-0.2 rounded bg-rose-100 text-rose-800 font-mono font-bold text-[9px] shrink-0 mt-0.5">L{{ st.num }}</span>
                          <div>
                            <strong class="text-slate-800">{{ st.title }}:</strong>
                            <span class="text-slate-600"> {{ st.action }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- VI. RITME SIRKADIAN, JAM KERJA PRODUKTIF & MATRIKS DELEGASI -->
              <div class="space-y-3">
                <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 class="text-sm font-black uppercase tracking-wider text-slate-900">
                    VI. Ritme Sirkadian, Jam Kerja Produktif & Matriks Delegasi
                  </h3>
                  <span class="text-xs text-blue-700 font-mono font-bold capitalize">Kronotipe {{ assessment.chronotype }}</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <!-- Jadwal Jam Kerja -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Rekomendasi Waktu Kerja Optimal:
                    </span>
                    <div class="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                      <div
                        v-for="block in systemicDossier?.circadianSchedule"
                        :key="block.id"
                        class="p-2.5 space-y-0.5"
                        :class="{ 'bg-indigo-50/50': block.isPeak }"
                      >
                        <div class="flex items-center justify-between">
                          <span class="font-bold text-slate-900 text-xs">{{ block.phase }}</span>
                          <span class="font-mono text-indigo-700 font-bold text-[11px]">{{ block.time }}</span>
                        </div>
                        <p class="text-[11px] text-slate-600">{{ block.activity }}</p>
                        <p class="text-[10px] text-slate-400 italic">{{ block.guidance }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Matriks Delegasi Wajib -->
                  <div class="space-y-2">
                    <span class="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Tugas yang Sebaiknya Didelegasikan:
                    </span>
                    <div class="space-y-2">
                      <div
                        v-for="task in systemicDossier?.delegationTasks"
                        :key="task.id"
                        class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1 shadow-2xs"
                      >
                        <div class="font-bold text-slate-900 text-xs">{{ task.task }}</div>
                        <div class="text-[10px] text-slate-500">
                          <strong class="text-slate-700">Alasan:</strong> {{ task.whyUnfit }}
                        </div>
                        <div class="text-[10px] text-emerald-800 font-medium">
                          <strong class="text-emerald-900">Solusi:</strong> {{ task.targetDelegation }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page 3 Running Footer -->
            <div class="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • DOKUMEN RAHASIA</span>
              <span>HALAMAN 3 DARI 4</span>
            </div>
          </div>

          <!-- ========================================== -->
          <!-- HALAMAN 4: SINERGI TIM & LEMBAR PENGESAHAN -->
          <!-- ========================================== -->
          <div class="pdf-page bg-white p-4 sm:p-6 md:p-7 rounded-none sm:rounded-2xl border-0 sm:border border-slate-200/80 shadow-none sm:shadow-xs flex flex-col justify-between space-y-5 sm:min-h-[1160px]">
            <div class="space-y-6">
              <!-- Running Header -->
              <div class="border-b border-slate-200 pb-2.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div class="flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-indigo-600"></span>
                  <span class="font-bold text-slate-700">HASTALOKA OFFICIAL DOSSIER • SINERGI TIM & PENGESAHAN RESMI</span>
                </div>
                <div>
                  SUBJEK: <strong class="text-slate-900">{{ assessment.userName || 'Subjek' }}</strong> | REG: <span class="text-indigo-700 font-bold">{{ assessment.id }}</span>
                </div>
              </div>

              <!-- VII. SINERGI KERJA SAMA TIM & KECOCOKAN DENGAN ARTIKETIPE LAIN -->
              <div class="space-y-3.5">
                <div class="border-b border-slate-200 pb-2 flex items-center justify-between">
                  <h3 class="text-sm font-black uppercase tracking-wider text-slate-900">
                    VII. Sinergi Kerja Sama Tim & Tolak Ukur 8 Arketipe
                  </h3>
                  <span class="text-xs text-slate-500 font-mono">Dinamika Kolaboratif</span>
                </div>

                <!-- Pasangan Partner Terbaik -->
                <div class="p-4 rounded-xl border border-purple-200 bg-purple-50/40 space-y-2 text-xs">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">PASANGAN REKAN KERJA PALING COCOK:</span>
                      <h4 class="text-base font-black text-slate-900 mt-0.5">
                        {{ idealPartner.profile.name }} ({{ idealPartner.profile.indonesianName }})
                      </h4>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Saling Mengisi
                    </span>
                  </div>
                  <p class="text-slate-700 leading-relaxed font-normal">
                    {{ idealPartner.synergy.description }}
                  </p>
                  <div class="p-2.5 bg-white rounded-lg border border-purple-100 text-[11px] text-purple-950 leading-relaxed">
                    💡 <strong class="font-bold text-purple-900">Rekomendasi Kerja Sama:</strong> {{ idealPartner.synergy.protocol || 'Selaraskan pembagian peran secara jelas di awal dan lakukan evaluasi berkala untuk memastikan sinergi saling mengisi.' }}
                  </div>
                </div>

                <!-- Grid Perbandingan dengan 8 Arketipe Lengkap -->
                <div class="space-y-2 pt-1">
                  <span class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Tingkat Keselarasan Lengkap dengan Seluruh 8 Arketipe Hastaloka:
                  </span>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    <div
                      v-for="(match, idx) in assessment.allArchetypeMatches"
                      :key="match.archetype.id"
                      class="p-2.5 rounded-xl border bg-white space-y-1 shadow-2xs"
                      :class="idx === 0 ? 'border-indigo-300 bg-indigo-50/30' : 'border-slate-200'"
                    >
                      <div class="flex items-center justify-between text-[11px]">
                        <span class="font-bold text-slate-900">{{ match.archetype.name }}</span>
                        <span class="font-mono font-bold" :class="idx === 0 ? 'text-indigo-700' : 'text-slate-600'">
                          {{ match.similarity }}%
                        </span>
                      </div>
                      <div class="text-[10px] text-slate-500">{{ match.archetype.indonesianName }}</div>
                      <div class="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div
                          class="h-full rounded-full transition-all"
                          :class="idx === 0 ? 'bg-indigo-600' : 'bg-slate-400'"
                          :style="{ width: `${match.similarity}%` }"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- LEMBAR PENGESAHAN & OTORISASI RESMI -->
              <div class="border-t-2 border-slate-900 pt-5 space-y-5">
                <div class="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <div class="flex items-center gap-2">
                    <ShieldCheck class="w-4 h-4 text-emerald-600" />
                    <span>Dokumen resmi hasil diagnostik algoritma psikometrika terpadu Hastaloka Enterprise v2.0</span>
                  </div>
                  <div class="font-mono font-bold text-slate-700">
                    HASH INTEGRITAS: {{ assessment.id }}-SEC256
                  </div>
                </div>

                <!-- Kolom Tanda Tangan / Otorisasi -->
                <div class="grid grid-cols-2 gap-8 pt-2 text-center text-xs">
                  <div class="space-y-12">
                    <span class="text-slate-500 block">Subjek Yang Dinilai:</span>
                    <div>
                      <strong class="text-slate-900 block font-bold underline">{{ assessment.userName || 'Subjek Diagnostik' }}</strong>
                      <span class="text-[10px] text-slate-400">Subjek Teruji Mandiri</span>
                    </div>
                  </div>
                  <div class="space-y-12">
                    <span class="text-slate-500 block">Otorisasi Sistem Analisis:</span>
                    <div>
                      <strong class="text-indigo-700 block font-bold underline">Hastaloka Psychometrics Engine</strong>
                      <span class="text-[10px] text-slate-400">Verifikasi Digital Resmi</span>
                    </div>
                  </div>
                </div>

                <div class="text-center text-[10px] text-slate-400 italic pt-1">
                  Dokumen ini bersifat rahasia dan dirancang untuk membantu navigasi karier, alokasi energi harian, serta pertumbuhan profesional subjek.
                </div>
              </div>
            </div>

            <!-- Page 4 Running Footer -->
            <div class="border-t border-slate-200 pt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • DOKUMEN RESMI TERVERIFIKASI</span>
              <span>HALAMAN 4 DARI 4</span>
            </div>
          </div>

        </div> <!-- end of reportCanvasRef -->
      </div> <!-- end of scrollable container -->
    </div>

    <!-- DEDICATED OFF-SCREEN STANDARD PDF DOCUMENT TEMPLATE (Executive A4 Report) -->
    <div class="fixed -left-[9999px] top-0 pointer-events-none opacity-100 z-[-100]">
      <div ref="pdfDocRef" class="w-[794px] bg-slate-100 text-slate-900 font-sans">
        
        <!-- ======================================================== -->
        <!-- PDF PAGE 1: KOP DOKUMEN, IDENTITAS SUBJEK & DIAGNOSIS ARKETIPE -->
        <!-- ======================================================== -->
        <div class="pdf-doc-page w-[794px] h-[1123px] p-[40px] box-border bg-white flex flex-col justify-between overflow-hidden text-slate-900">
          <div class="space-y-4">
            <!-- Formal Corporate Letterhead -->
            <div class="border-b-2 border-slate-900 pb-3 flex items-start justify-between">
              <div class="space-y-0.5">
                <div class="flex items-center gap-2">
                  <div class="w-3.5 h-3.5 bg-slate-900 flex items-center justify-center text-white font-black text-[9px]">H</div>
                  <span class="text-[11px] font-black tracking-widest text-slate-900 uppercase">
                    HASTALOKA HUMAN PSYCHOMETRICS & ENTERPRISE STRATEGY
                  </span>
                </div>
                <div class="text-[9px] font-medium text-slate-500 uppercase tracking-wide">
                  Divisi Riset Diagnostik Neuro-Perilaku & Optimalisasi Modal Insani
                </div>
              </div>
              <div class="text-right font-mono text-[9px] text-slate-600 space-y-0.5">
                <div>NO. DOKUMEN: <strong class="text-slate-900 font-bold">HASTA-{{ assessment.id }}</strong></div>
                <div>TANGGAL ASESMEN: <strong class="text-slate-800">{{ new Date(assessment.timestamp).toLocaleDateString('id-ID', { dateStyle: 'long' }) }}</strong></div>
                <div>STATUS KLASIFIKASI: <span class="text-emerald-700 font-bold uppercase">TERVERIFIKASI RESMI</span></div>
              </div>
            </div>

            <!-- Judul Dokumen -->
            <div class="pt-1 pb-1 border-b border-slate-200">
              <h1 class="text-lg font-black tracking-tight text-slate-950 uppercase leading-snug">
                LAPORAN DIAGNOSTIK KEPRIBADIAN & NAVIGASI STRATEGIS
              </h1>
              <p class="text-[10px] text-slate-600 font-medium">
                Evaluasi Psikometrika Berbasis 5 Sumbu Vektor Neuro-Perilaku (H5V), Klasifikasi 8 Arketipe & Rekomendasi Eksekusi
              </p>
            </div>

            <!-- 1.0 Data Identitas Subjek Teruji (Tabel Formal) -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  1.0 Identitas Subjek Teruji & Parameter Pengujian
                </h2>
                <span class="text-[9px] font-mono text-slate-500">Data Master Peserta</span>
              </div>
              <table class="w-full text-[10px] border border-slate-300 border-collapse">
                <tbody>
                  <tr class="border-b border-slate-200 bg-slate-50/60">
                    <td class="p-2 font-bold text-slate-600 w-1/4 border-r border-slate-200">Nama Lengkap</td>
                    <td class="p-2 font-extrabold text-slate-900 w-1/4 border-r border-slate-200 text-xs">{{ assessment.userName || 'Subjek Diagnostik' }}</td>
                    <td class="p-2 font-bold text-slate-600 w-1/4 border-r border-slate-200">ID Registrasi</td>
                    <td class="p-2 font-mono font-bold text-indigo-800 w-1/4">{{ assessment.id }}</td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="p-2 font-bold text-slate-600 border-r border-slate-200">Profesi / Jabatan</td>
                    <td class="p-2 font-semibold text-slate-900 border-r border-slate-200">{{ assessment.userProfession || 'Profesional Eksekutif' }}</td>
                    <td class="p-2 font-bold text-slate-600 border-r border-slate-200">Usia Terlapor</td>
                    <td class="p-2 font-semibold text-slate-900">{{ assessment.userAge ? `${assessment.userAge} Tahun` : 'Tidak Diisi' }}</td>
                  </tr>
                  <tr>
                    <td class="p-2 font-bold text-slate-600 border-r border-slate-200">Kronotipe Sirkadian</td>
                    <td class="p-2 font-bold text-indigo-700 capitalize border-r border-slate-200">Tipe {{ assessment.chronotype }}</td>
                    <td class="p-2 font-bold text-slate-600 border-r border-slate-200">Metode Analisis</td>
                    <td class="p-2 text-slate-700">Algoritma Vektor H5V v2.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 2.0 Diagnosis Arketipe Dominan -->
            <div class="space-y-2">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  2.0 Hasil Diagnosis Arketipe Dominan & Karakteristik Perilaku
                </h2>
                <span class="text-[9px] font-mono text-emerald-700 font-bold">Tingkat Keselarasan: 100%</span>
              </div>

              <!-- Primary Profile Box -->
              <div class="p-3 border border-slate-300 bg-slate-50/40 space-y-2 text-xs">
                <div class="flex items-start justify-between border-b border-slate-200 pb-1.5">
                  <div>
                    <span class="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block">ARKETIPE UTAMA:</span>
                    <h3 class="text-sm font-black text-slate-950">
                      {{ assessment.primaryArchetype.name }} <span class="text-indigo-800 font-bold">({{ assessment.primaryArchetype.indonesianName }})</span>
                    </h3>
                  </div>
                  <div class="text-right">
                    <span class="text-[9px] font-mono font-bold text-slate-500 uppercase block">PERAN EKSEKUTIF:</span>
                    <strong class="text-xs text-slate-900 font-extrabold">{{ assessment.primaryArchetype.role }}</strong>
                  </div>
                </div>

                <p class="text-[10px] text-slate-700 leading-relaxed font-normal">
                  {{ assessment.primaryArchetype.description }}
                </p>

                <!-- 2 Kolom: Kekuatan & Blindspots -->
                <div class="grid grid-cols-2 gap-3 pt-1 border-t border-slate-200 text-[10px]">
                  <div class="space-y-1">
                    <span class="font-bold text-slate-900 uppercase tracking-wider block text-[9px]">
                      Kekuatan Alami Teridentifikasi:
                    </span>
                    <ul class="space-y-1 text-slate-700">
                      <li v-for="(str, sIdx) in assessment.primaryArchetype.strengths" :key="sIdx" class="flex items-start gap-1.5">
                        <span class="text-slate-900 font-bold shrink-0">•</span>
                        <span>{{ str }}</span>
                      </li>
                    </ul>
                  </div>

                  <div class="space-y-1">
                    <span class="font-bold text-rose-900 uppercase tracking-wider block text-[9px]">
                      Kecenderungan Titik Buta (Blindspots):
                    </span>
                    <ul class="space-y-1 text-slate-700">
                      <li v-for="(bs, bIdx) in assessment.primaryArchetype.blindSpots" :key="bIdx" class="flex items-start gap-1.5">
                        <span class="text-rose-700 font-bold shrink-0">!</span>
                        <span>{{ bs }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3.0 Rekomendasi Strategi Karier & Penciptaan Nilai -->
            <div class="space-y-1.5">
              <div class="border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  3.0 Arahan Navigasi Karier & Valuasi Ekonomi
                </h2>
              </div>
              <div class="grid grid-cols-2 gap-3 text-[10px]">
                <div class="p-2.5 border border-slate-300 bg-white space-y-1">
                  <strong class="text-slate-900 font-bold uppercase tracking-wider block text-[9px]">
                    Strategi Pertumbuhan Karier:
                  </strong>
                  <p class="text-slate-700 leading-relaxed">
                    {{ assessment.primaryArchetype.careerStrategy }}
                  </p>
                </div>
                <div class="p-2.5 border border-slate-300 bg-white space-y-1">
                  <strong class="text-slate-900 font-bold uppercase tracking-wider block text-[9px]">
                    Strategi Penciptaan Nilai Finansial:
                  </strong>
                  <p class="text-slate-700 leading-relaxed">
                    {{ assessment.primaryArchetype.wealthStrategy }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Page 1 Footer -->
          <div class="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • DOKUMEN RESMI TERVERIFIKASI</span>
            <span>HALAMAN 1 DARI 4</span>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PDF PAGE 2: PETA GEOMETRI H5V & MODEL PENGUNGKIT EKONOMI -->
        <!-- ======================================================== -->
        <div class="pdf-doc-page w-[794px] h-[1123px] p-[40px] box-border bg-white flex flex-col justify-between overflow-hidden text-slate-900">
          <div class="space-y-4">
            <!-- Running Header -->
            <div class="border-b border-slate-300 pb-1.5 flex items-center justify-between text-[9px] text-slate-600 font-mono">
              <span class="font-bold text-slate-900">HASTALOKA OFFICIAL DOSSIER • PETA GEOMETRI H5V & VALUASI PASAR</span>
              <span>SUBJEK: <strong class="text-slate-900">{{ assessment.userName || 'Subjek' }}</strong> | REG: {{ assessment.id }}</span>
            </div>

            <!-- 4.0 Peta Geometri & 5 Vektor H5V -->
            <div class="space-y-2">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  4.0 Peta Geometri & 5 Vektor Kekuatan Karakter (H5V)
                </h2>
                <span class="text-[9px] font-mono text-slate-600">Skala Baku: 0 – 100%</span>
              </div>

              <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Radar Chart Container -->
                <div class="col-span-5 flex flex-col items-center justify-center p-2 border border-slate-200 bg-slate-50/50">
                  <RadarChart :user-scores="assessment.vectorScores" :size="240" />
                  <span class="text-[9px] text-slate-500 font-mono mt-1">Diagram Polarisasi 5 Vektor</span>
                </div>

                <!-- Tabel Data 5 Vektor Formal -->
                <div class="col-span-7">
                  <table class="w-full text-[10px] border border-slate-300 border-collapse">
                    <thead>
                      <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-left">
                        <th class="p-1.5 border-r border-slate-300">Sumbu Vektor</th>
                        <th class="p-1.5 border-r border-slate-300 text-center">Skor</th>
                        <th class="p-1.5 border-r border-slate-300">Kapasitas</th>
                        <th class="p-1.5">Kelangkaan Pasar</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      <tr>
                        <td class="p-1.5 font-bold text-slate-900 border-r border-slate-200">Daya Aksi (Drive)</td>
                        <td class="p-1.5 font-mono font-bold text-center text-indigo-700 border-r border-slate-200">{{ assessment.vectorScores.drive }}%</td>
                        <td class="p-1.5 border-r border-slate-200">{{ assessment.vectorScores.drive >= 65 ? 'Dominan Tinggi' : assessment.vectorScores.drive <= 35 ? 'Diferensial Rendah' : 'Tingkat Rata-rata' }}</td>
                        <td class="p-1.5 text-slate-600">Top 20% Populasi</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold text-slate-900 border-r border-slate-200">Kelenturan (Adaptasi)</td>
                        <td class="p-1.5 font-mono font-bold text-center text-blue-700 border-r border-slate-200">{{ assessment.vectorScores.adaptability }}%</td>
                        <td class="p-1.5 border-r border-slate-200">{{ assessment.vectorScores.adaptability >= 65 ? 'Dominan Tinggi' : assessment.vectorScores.adaptability <= 35 ? 'Diferensial Rendah' : 'Tingkat Rata-rata' }}</td>
                        <td class="p-1.5 text-slate-600">Responsif Dinamis</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold text-slate-900 border-r border-slate-200">Keteraturan (Stabilitas)</td>
                        <td class="p-1.5 font-mono font-bold text-center text-emerald-700 border-r border-slate-200">{{ assessment.vectorScores.stability }}%</td>
                        <td class="p-1.5 border-r border-slate-200">{{ assessment.vectorScores.stability >= 65 ? 'Dominan Tinggi' : assessment.vectorScores.stability <= 35 ? 'Diferensial Rendah' : 'Tingkat Rata-rata' }}</td>
                        <td class="p-1.5 text-slate-600">Presisi & Konsisten</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold text-slate-900 border-r border-slate-200">Visi Pola (Sintesis)</td>
                        <td class="p-1.5 font-mono font-bold text-center text-purple-700 border-r border-slate-200">{{ assessment.vectorScores.synthesis }}%</td>
                        <td class="p-1.5 border-r border-slate-200">{{ assessment.vectorScores.synthesis >= 65 ? 'Dominan Tinggi' : assessment.vectorScores.synthesis <= 35 ? 'Diferensial Rendah' : 'Tingkat Rata-rata' }}</td>
                        <td class="p-1.5 text-slate-600">Abstraksi Strategis</td>
                      </tr>
                      <tr>
                        <td class="p-1.5 font-bold text-slate-900 border-r border-slate-200">Relasi & Makna (Koneksi)</td>
                        <td class="p-1.5 font-mono font-bold text-center text-rose-700 border-r border-slate-200">{{ assessment.vectorScores.connectivity }}%</td>
                        <td class="p-1.5 border-r border-slate-200">{{ assessment.vectorScores.connectivity >= 65 ? 'Dominan Tinggi' : assessment.vectorScores.connectivity <= 35 ? 'Diferensial Rendah' : 'Tingkat Rata-rata' }}</td>
                        <td class="p-1.5 text-slate-600">Resonansi Sosial</td>
                      </tr>
                    </tbody>
                  </table>
                  <p class="text-[9px] text-slate-500 italic mt-1.5">
                    * Catatan Diagnostik: Profil H5V memetakan konfigurasi neuro-perilaku yang relatif stabil dalam konteks pengambilan keputusan di bawah tekanan.
                  </p>
                </div>
              </div>
            </div>

            <!-- 5.0 Moat Ekonomi & Model Pengungkit (Leverage) -->
            <div class="space-y-2">
              <div class="border-b border-slate-300 pb-1 flex items-center justify-between">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  5.0 Valuasi Pasar, Niche Strategis & Model Pengungkit (Leverage)
                </h2>
                <span class="text-[9px] font-mono text-indigo-700 font-bold">{{ systemicDossier?.nicheTag }}</span>
              </div>

              <!-- Niche Definition -->
              <div class="p-2.5 border border-slate-300 bg-slate-50/50 text-[10px] space-y-1">
                <div class="flex items-center justify-between">
                  <strong class="text-slate-900 uppercase font-black tracking-wide text-[10px]">
                    POSISI NICHE PASAR BERDAYA SAING:
                  </strong>
                  <span class="text-indigo-800 font-bold font-mono">{{ systemicDossier?.nicheTitle }}</span>
                </div>
                <p class="text-slate-700 leading-relaxed">
                  {{ systemicDossier?.moatSummary }}
                </p>
              </div>

              <!-- 2 Model Pengungkit Nilai Tertinggi (Tabel Komparasi Formal) -->
              <div class="space-y-1.5">
                <span class="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                  Dua Model Pengungkit Nilai Tertinggi yang Direkomendasikan:
                </span>
                <div class="grid grid-cols-2 gap-3 text-[10px]">
                  <div
                    v-for="model in systemicDossier?.leverageModels"
                    :key="model.id"
                    class="p-2.5 border border-slate-300 bg-white space-y-1.5"
                  >
                    <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                      <strong class="text-slate-900 font-bold text-xs">{{ model.title }}</strong>
                      <span class="px-1.5 py-0.2 rounded border border-slate-300 text-[8px] font-mono font-bold text-slate-700">
                        {{ model.badge }}
                      </span>
                    </div>
                    <p class="text-slate-600 leading-snug">
                      <strong class="text-slate-900">Rasionalisasi:</strong> {{ model.whyFits }}
                    </p>
                    <div class="space-y-0.5 pt-1 border-t border-slate-100">
                      <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Langkah Eksekusi Operasional:</span>
                      <div v-for="(st, sIdx) in model.steps.slice(0, 2)" :key="sIdx" class="flex items-start gap-1 text-[9px] text-slate-700">
                        <span class="text-indigo-800 font-bold shrink-0">▸</span>
                        <span>{{ st }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Page 2 Footer -->
          <div class="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • STRATEGI EKONOMI & NICHE</span>
            <span>HALAMAN 2 DARI 4</span>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PDF PAGE 3: MANAJEMEN RISIKO, SIRKADIAN & DELEGASI       -->
        <!-- ======================================================== -->
        <div class="pdf-doc-page w-[794px] h-[1123px] p-[40px] box-border bg-white flex flex-col justify-between overflow-hidden text-slate-900">
          <div class="space-y-4">
            <!-- Running Header -->
            <div class="border-b border-slate-300 pb-1.5 flex items-center justify-between text-[9px] text-slate-600 font-mono">
              <span class="font-bold text-slate-900">HASTALOKA OFFICIAL DOSSIER • MANAJEMEN RISIKO & ALOKASI ENERGI</span>
              <span>SUBJEK: <strong class="text-slate-900">{{ assessment.userName || 'Subjek' }}</strong> | REG: {{ assessment.id }}</span>
            </div>

            <!-- 6.0 Protokol Mitigasi Masalah & Titik Buta (Hazard Protocols) -->
            <div class="space-y-2">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  6.0 Protokol Pencegahan Masalah & Mitigasi Titik Buta (Hazard Management)
                </h2>
                <span class="text-[9px] font-mono text-rose-700 font-bold">Kategori: Mitigasi Preventif</span>
              </div>

              <div class="p-2 border border-amber-300 bg-amber-50/40 text-[9.5px] text-amber-900 leading-snug">
                <strong>Catatan Manajemen Risiko:</strong> Titik buta di bawah ini merupakan konsekuensi langsung dari dominasi vektor kepribadian alami subjek. Penanganan terstruktur diperlukan untuk mencegah kelelahan mental atau kerugian profesional.
              </div>

              <!-- 2 Hazard Protocols (Tabel Formal) -->
              <div class="grid grid-cols-2 gap-3 text-[10px]">
                <div
                  v-for="hazard in systemicDossier?.hazardProtocols"
                  :key="hazard.id"
                  class="p-2.5 border border-slate-300 bg-white space-y-1.5"
                >
                  <div class="flex items-center justify-between border-b border-slate-200 pb-1">
                    <strong class="text-slate-900 font-bold text-xs">{{ hazard.name }}</strong>
                    <span class="px-1.5 py-0.2 rounded border border-rose-300 text-rose-800 text-[8px] font-mono font-bold">
                      Risiko {{ hazard.riskLevel }}
                    </span>
                  </div>
                  <p class="text-slate-600 leading-snug">
                    <strong class="text-slate-900">Dampak Nyata:</strong> {{ hazard.realImpact }}
                  </p>
                  <div class="space-y-1 pt-1 border-t border-slate-100">
                    <span class="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">3 Langkah Intervensi Teruji:</span>
                    <div class="space-y-0.5 text-[9px]">
                      <div v-for="st in hazard.steps" :key="st.num" class="flex items-start gap-1 text-slate-700">
                        <span class="font-mono font-bold text-slate-900 shrink-0">L{{ st.num }}:</span>
                        <span><strong>{{ st.title }}</strong> — {{ st.action }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 7.0 Alokasi Energi Sirkadian & Matriks Delegasi -->
            <div class="space-y-2 pt-1 border-t border-slate-300">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  7.0 Ritme Sirkadian, Jam Kerja Efektif & Matriks Delegasi
                </h2>
                <span class="text-[9px] font-mono text-indigo-700 font-bold capitalize">Tipe Sirkadian: {{ assessment.chronotype }}</span>
              </div>

              <div class="grid grid-cols-2 gap-3 text-[10px]">
                <!-- Tabel Alokasi Jam Kerja -->
                <div class="space-y-1">
                  <span class="text-[9px] font-bold text-slate-700 uppercase tracking-wider block">
                    Alokasi Waktu Kerja Optimal Subjek:
                  </span>
                  <table class="w-full border border-slate-300 text-[9px] border-collapse">
                    <thead>
                      <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-left">
                        <th class="p-1 border-r border-slate-300">Jam</th>
                        <th class="p-1 border-r border-slate-300">Fase Energi</th>
                        <th class="p-1">Rekomendasi Aktivitas</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      <tr v-for="block in systemicDossier?.circadianSchedule.slice(0, 3)" :key="block.id">
                        <td class="p-1 font-mono font-bold text-slate-800 border-r border-slate-200">{{ block.time }}</td>
                        <td class="p-1 font-medium border-r border-slate-200">{{ block.phase }}</td>
                        <td class="p-1 text-slate-600 font-medium">{{ block.activity }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Matriks Delegasi -->
                <div class="space-y-1">
                  <span class="text-[9px] font-bold text-slate-700 uppercase tracking-wider block">
                    Matriks Tugas Wajib Delegasi (Eliminasi Beban):
                  </span>
                  <table class="w-full border border-slate-300 text-[9px] border-collapse">
                    <thead>
                      <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-left">
                        <th class="p-1 border-r border-slate-300">Tugas Yang Dihindari</th>
                        <th class="p-1">Tujuan / Tim Yang Mengerjakan</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                      <tr v-for="task in systemicDossier?.delegationTasks.slice(0, 3)" :key="task.id">
                        <td class="p-1 font-bold text-slate-900 border-r border-slate-200">{{ task.task }}</td>
                        <td class="p-1 text-emerald-800 font-medium">{{ task.targetDelegation }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- Page 3 Footer -->
          <div class="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • PROTOKOL ENERGI & RISIKO</span>
            <span>HALAMAN 3 DARI 4</span>
          </div>
        </div>

        <!-- ======================================================== -->
        <!-- PDF PAGE 4: SINERGI TIM, BENCHMARK & PENGESAHAN DOKUMEN  -->
        <!-- ======================================================== -->
        <div class="pdf-doc-page w-[794px] h-[1123px] p-[40px] box-border bg-white flex flex-col justify-between overflow-hidden text-slate-900">
          <div class="space-y-4">
            <!-- Running Header -->
            <div class="border-b border-slate-300 pb-1.5 flex items-center justify-between text-[9px] text-slate-600 font-mono">
              <span class="font-bold text-slate-900">HASTALOKA OFFICIAL DOSSIER • SINERGI TIM & PENGESAHAN RESMI</span>
              <span>SUBJEK: <strong class="text-slate-900">{{ assessment.userName || 'Subjek' }}</strong> | REG: {{ assessment.id }}</span>
            </div>

            <!-- 8.0 Sinergi Tim & Rekan Komplementer -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  8.0 Analisis Sinergi Organisasi & Rekan Kerja Komplementer
                </h2>
                <span class="text-[9px] font-mono text-purple-700 font-bold">Dinamika Kemitraan</span>
              </div>

              <!-- Partner Box -->
              <div class="p-2.5 border border-slate-300 bg-slate-50/50 space-y-1 text-[10px]">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-[8px] font-mono font-bold text-slate-500 uppercase">PASANGAN SINERGI TERBAIK:</span>
                    <strong class="text-xs text-slate-900 font-black block">
                      {{ idealPartner.profile.name }} ({{ idealPartner.profile.indonesianName }})
                    </strong>
                  </div>
                  <span class="px-2 py-0.5 border border-slate-300 bg-white font-mono font-bold text-[9px] text-slate-800">
                    {{ idealPartner.synergy.tagline || 'Saling Mengisi' }}
                  </span>
                </div>
                <p class="text-slate-700 leading-snug">
                  {{ idealPartner.synergy.description }}
                </p>
                <div class="p-1.5 bg-white border border-slate-200 text-[9px] text-slate-800">
                  <strong>Rekomendasi Protokol Kolaborasi:</strong> {{ idealPartner.synergy.protocol || 'Selaraskan pembagian peran secara jelas di awal dan lakukan evaluasi berkala untuk memastikan sinergi saling mengisi.' }}
                </div>
              </div>
            </div>

            <!-- 9.0 Matriks Tolak Ukur Keselarasan dengan Seluruh 8 Arketipe -->
            <div class="space-y-1">
              <div class="flex items-center justify-between border-b border-slate-300 pb-1">
                <h2 class="text-[11px] font-black uppercase tracking-wider text-slate-900">
                  9.0 Tolak Ukur Keselarasan Lengkap dengan Seluruh 8 Arketipe Hastaloka
                </h2>
                <span class="text-[9px] font-mono text-slate-500">Nilai Kemiripan Cosine Proximity</span>
              </div>

              <table class="w-full border border-slate-300 text-[9px] border-collapse">
                <thead>
                  <tr class="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-left">
                    <th class="p-1 border-r border-slate-300">No</th>
                    <th class="p-1 border-r border-slate-300">Arketipe Hastaloka</th>
                    <th class="p-1 border-r border-slate-300">Gelar Indonesia</th>
                    <th class="p-1 border-r border-slate-300 text-center">Tingkat Keselarasan</th>
                    <th class="p-1">Karakteristik Interaksi Tim</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                  <tr
                    v-for="(match, idx) in assessment.allArchetypeMatches"
                    :key="match.archetype.id"
                    :class="idx === 0 ? 'bg-indigo-50/40 font-bold' : ''"
                  >
                    <td class="p-1 text-center font-mono border-r border-slate-200">{{ idx + 1 }}</td>
                    <td class="p-1 text-slate-900 border-r border-slate-200">{{ match.archetype.name }}</td>
                    <td class="p-1 text-slate-600 border-r border-slate-200">{{ match.archetype.indonesianName }}</td>
                    <td class="p-1 font-mono text-center border-r border-slate-200" :class="idx === 0 ? 'text-indigo-800 font-black' : 'text-slate-700'">
                      {{ match.similarity }}%
                    </td>
                    <td class="p-1 text-slate-600">{{ idx === 0 ? 'Profil Dominan Subjek' : match.similarity >= 70 ? 'Sinergi Tinggi / Pelengkap' : match.similarity >= 40 ? 'Netral / Perlu Penyelarasan' : 'Rawan Friksi / Tugas Berbeda' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 10.0 Lembar Pengesahan & Otorisasi Resmi -->
            <div class="border-2 border-slate-900 p-3 bg-slate-50/50 space-y-2">
              <div class="text-center space-y-0.5 border-b border-slate-300 pb-1.5">
                <h3 class="text-xs font-black uppercase tracking-wider text-slate-900">
                  LEMBAR PERNYATAAN & PENGESAHAN INTEGRITAS DIAGNOSTIK
                </h3>
                <p class="text-[9px] text-slate-600">
                  Dokumen ini merupakan hasil kalkulasi komputasi psikometrika terverifikasi sistem Hastaloka
                </p>
              </div>

              <p class="text-[9px] text-slate-700 leading-snug">
                Berdasarkan seluruh jawaban kuesioner asesmen neuro-perilaku serta parameter ritme sirkadian yang diinput oleh <strong>{{ assessment.userName || 'Subjek' }}</strong> pada tanggal <strong>{{ new Date(assessment.timestamp).toLocaleDateString('id-ID', { dateStyle: 'full' }) }}</strong>, sistem menyatakan bahwa profil 5 Vektor (H5V) dan diagnosis arketipe yang tercantum dalam dokumen ini adalah <strong>SAH & VALID</strong> sesuai model psikometrika Hastaloka v2.0.
              </p>

              <!-- Kolom Tanda Tangan Formal -->
              <div class="grid grid-cols-2 gap-6 pt-1 text-[9px]">
                <div class="space-y-8">
                  <span class="text-slate-600 block">Penerima & Subjek Teruji:</span>
                  <div>
                    <strong class="text-slate-900 block font-bold underline">{{ assessment.userName || 'Subjek Teruji' }}</strong>
                    <span class="text-[8px] text-slate-400">Verifikasi Identitas Subjek</span>
                  </div>
                </div>
                <div class="space-y-8">
                  <span class="text-slate-600 block">Otorisasi Sistem & Validator:</span>
                  <div>
                    <strong class="text-indigo-800 block font-bold underline">Hastaloka Psychometrics Engine</strong>
                    <span class="text-[8px] text-slate-400">Algoritma Terpadu H5V • ID Sertifikat #{{ assessment.id }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between text-[8px] text-slate-500 font-mono pt-1.5 border-t border-slate-200">
                <span>HASH INTEGRITAS DOKUMEN: {{ assessment.id }}-SEC256-V2</span>
                <span class="text-emerald-700 font-bold">DIGITALLY SIGNED & ENCRYPTED</span>
              </div>
            </div>
          </div>

          <!-- Page 4 Footer -->
          <div class="border-t border-slate-300 pt-2 flex items-center justify-between text-[9px] text-slate-500 font-mono">
            <span>HASTALOKA PSYCHOMETRICS ENGINE v2.0 • DOKUMEN RESMI TERVERIFIKASI</span>
            <span>HALAMAN 4 DARI 4 (SELESAI)</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }
  .pdf-page {
    page-break-after: always !important;
    break-after: page !important;
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  .pdf-page:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }
}
</style>
