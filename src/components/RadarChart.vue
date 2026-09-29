<script setup lang="ts">
import { computed } from 'vue';
import type { VectorScore } from '../types/hastaloka';

const props = withDefaults(
  defineProps<{
    userScores: VectorScore;
    compareScores?: VectorScore | null;
    compareLabel?: string;
    size?: number;
  }>(),
  {
    compareScores: null,
    compareLabel: 'Profil Ideal',
    size: 320,
  }
);

// 5 Sumbu Vektor Neuro-Perilaku
const vectors = [
  { key: 'drive', label: 'Daya Aksi (Drive)', angle: -90 },
  { key: 'adaptability', label: 'Kelenturan (Adaptasi)', angle: -18 },
  { key: 'stability', label: 'Keteraturan (Stabilitas)', angle: 54 },
  { key: 'synthesis', label: 'Visi Pola (Sintesis)', angle: 126 },
  { key: 'connectivity', label: 'Relasi (Koneksi)', angle: 198 },
] as const;

const center = computed(() => props.size / 2);
const radius = computed(() => (props.size / 2) * 0.70);

// Hitung koordinat (x, y) dari nilai 0 - 100 dan sudut derajat
function getPoint(value: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const r = (value / 100) * radius.value;
  const x = center.value + r * Math.cos(rad);
  const y = center.value + r * Math.sin(rad);
  return { x, y };
}

// Polygon grid lingkaran (20%, 40%, 60%, 80%, 100%)
const gridLevels = [20, 40, 60, 80, 100];

function getPolygonPoints(level: number) {
  return vectors
    .map((v) => {
      const { x, y } = getPoint(level, v.angle);
      return `${x},${y}`;
    })
    .join(' ');
}

// Polygon profil pengguna
const userPolygon = computed(() => {
  return vectors
    .map((v) => {
      const val = props.userScores[v.key] ?? 50;
      const { x, y } = getPoint(val, v.angle);
      return `${x},${y}`;
    })
    .join(' ');
});

// Polygon pembanding
const comparePolygon = computed(() => {
  if (!props.compareScores) return null;
  return vectors
    .map((v) => {
      const val = props.compareScores![v.key] ?? 50;
      const { x, y } = getPoint(val, v.angle);
      return `${x},${y}`;
    })
    .join(' ');
});
</script>

<template>
  <div class="flex flex-col items-center justify-center select-none py-1">
    <div class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg :width="size" :height="size" class="overflow-visible">
        <defs>
          <linearGradient id="execUserGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2563eb" stop-opacity="0.22" />
            <stop offset="100%" stop-color="#1d4ed8" stop-opacity="0.10" />
          </linearGradient>
        </defs>

        <!-- Grid Jaring Presisi (Executive Slate) -->
        <polygon
          v-for="level in gridLevels"
          :key="level"
          :points="getPolygonPoints(level)"
          fill="none"
          :stroke="level === 100 ? '#cbd5e1' : '#f1f5f9'"
          :stroke-width="level === 100 ? '1.5' : '1'"
        />

        <!-- Sumbu Radial -->
        <line
          v-for="v in vectors"
          :key="v.key"
          :x1="center"
          :y1="center"
          :x2="getPoint(100, v.angle).x"
          :y2="getPoint(100, v.angle).y"
          stroke="#e2e8f0"
          stroke-width="1"
        />

        <!-- Poligon Pembanding (Ideal Benchmark) -->
        <polygon
          v-if="comparePolygon"
          :points="comparePolygon"
          fill="#f8fafc"
          fill-opacity="0.5"
          stroke="#94a3b8"
          stroke-width="1.5"
          stroke-dasharray="3 3"
        />

        <!-- Poligon Profil Pengguna -->
        <polygon
          :points="userPolygon"
          fill="url(#execUserGradient)"
          stroke="#2563eb"
          stroke-width="2"
          class="transition-all duration-300 ease-out"
        />

        <!-- Titik Poin Vektor Pengguna -->
        <circle
          v-for="v in vectors"
          :key="`point-${v.key}`"
          :cx="getPoint(userScores[v.key], v.angle).x"
          :cy="getPoint(userScores[v.key], v.angle).y"
          r="4"
          fill="#1d4ed8"
          stroke="#ffffff"
          stroke-width="2"
          class="transition-all duration-300 ease-out"
        />

        <!-- Label Sudut & Nilai Skor -->
        <g v-for="v in vectors" :key="`lbl-${v.key}`">
          <!-- Text Label -->
          <text
            :x="getPoint(124, v.angle).x"
            :y="getPoint(124, v.angle).y - 6"
            text-anchor="middle"
            dominant-baseline="central"
            class="text-[11px] font-semibold fill-slate-700 tracking-tight"
          >
            {{ v.label }}
          </text>
          <!-- Score Badge -->
          <text
            :x="getPoint(124, v.angle).x"
            :y="getPoint(124, v.angle).y + 8"
            text-anchor="middle"
            dominant-baseline="central"
            class="text-[11px] font-bold fill-slate-900 font-mono"
          >
            {{ userScores[v.key] }}%
          </text>
        </g>
      </svg>
    </div>

    <!-- Legend Indikator Bersih -->
    <div class="mt-4 flex items-center gap-5 text-xs text-slate-500 font-medium border-t border-slate-100 pt-3 w-full justify-center">
      <div class="flex items-center gap-1.5">
        <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
        <span class="text-slate-800 font-semibold">Skor Aktual Anda</span>
      </div>
      <div v-if="compareScores" class="flex items-center gap-1.5">
        <span class="w-3 h-0.5 border-t border-dashed border-slate-500"></span>
        <span class="text-slate-600">{{ compareLabel }}</span>
      </div>
    </div>
  </div>
</template>
