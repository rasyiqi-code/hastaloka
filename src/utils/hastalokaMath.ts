import type { VectorScore, ArchetypeMatch, SynergyProtocol } from '../types/hastaloka';
import { HASTALOKA_ARCHETYPES, ARCHETYPE_SYNERGY_RULES } from '../data/hastalokaData';

/**
 * Konversi Skor Kuesioner Mentah (5-25) ke Skala Persentase 0 - 100
 * Formula BAB 9: Skor Vektor = ((Skor Mentah - 5) / 20) * 100
 */
export function calculateVectorScore(rawScores: Record<string, number>): VectorScore {
  const vectors: Record<'drive' | 'adaptability' | 'stability' | 'synthesis' | 'connectivity', number> = {
    drive: 0,
    adaptability: 0,
    stability: 0,
    synthesis: 0,
    connectivity: 0
  };

  // Jumlahkan 5 butir soal per vektor
  for (let i = 1; i <= 5; i++) {
    vectors.drive += (rawScores[`D${i}`] || 3);
    vectors.adaptability += (rawScores[`A${i}`] || 3);
    vectors.stability += (rawScores[`S${i}`] || 3);
    vectors.synthesis += (rawScores[`N${i}`] || 3);
    vectors.connectivity += (rawScores[`K${i}`] || 3);
  }

  const convert = (raw: number) => {
    const clamped = Math.max(5, Math.min(25, raw));
    return Math.round(((clamped - 5) / 20) * 100);
  };

  return {
    drive: convert(vectors.drive),
    adaptability: convert(vectors.adaptability),
    stability: convert(vectors.stability),
    synthesis: convert(vectors.synthesis),
    connectivity: convert(vectors.connectivity)
  };
}

/**
 * Formula Cosine Similarity (BAB 6.2)
 * Similarity(k) = (u . ak) / (||u|| * ||ak||)
 * Mengukur keselarasan profil vektor pengguna (u) terhadap vektor ideal masing-masing arketipe (ak).
 * Menggunakan Centered Cosine Similarity (Korelasi Profil Pearson) agar distribusi kemiripan
 * memiliki rentang daya beda yang realistis (bukan menumpuk di 95-99% akibat Narrow Cone Problem ruang koordinat positif).
 */
export function calculateCosineSimilarity(u: VectorScore, ak: VectorScore): number {
  const uArr = [u.drive, u.adaptability, u.stability, u.synthesis, u.connectivity];
  const akArr = [ak.drive, ak.adaptability, ak.stability, ak.synthesis, ak.connectivity];

  const meanU = uArr.reduce((sum, val) => sum + val, 0) / 5;
  const meanAk = akArr.reduce((sum, val) => sum + val, 0) / 5;

  let dotProduct = 0;
  let varU = 0;
  let varAk = 0;

  for (let i = 0; i < 5; i++) {
    const du = uArr[i] - meanU;
    const dak = akArr[i] - meanAk;
    dotProduct += du * dak;
    varU += du * du;
    varAk += dak * dak;
  }

  // Jika tidak ada variasi bentuk profil (misal semua skor sama persis)
  if (varU === 0 || varAk === 0) {
    // Ketika salah satu vektor konstan (tidak ada variasi), centered cosine tidak terdefinisi.
    // Gunakan pendekatan: jika vektor konstan sama persis -> 100%, jika berbeda -> 50% (netral)
    let allEqual = true;
    for (let i = 0; i < 5; i++) {
      if (uArr[i] !== akArr[i]) {
        allEqual = false;
        break;
      }
    }
    return allEqual ? 100 : 50;
  }

  // Centered Cosine / Pearson Correlation r [-1.0 s/d +1.0]
  const r = dotProduct / (Math.sqrt(varU) * Math.sqrt(varAk));

  // Konversi rentang korelasi r [-1.0 s/d +1.0] ke persentase kecocokan intuitif [0% s/d 100%]
  // Menggunakan non-linear contrast scaling (kuadrat normalisasi) agar daya beda tajam dan tidak menumpuk di 60-90%:
  // - r = 1.0  -> 100% (kecocokan pola sempurna)
  // - r = 0.8  -> 81%  (kecocokan sangat kuat)
  // - r = 0.5  -> 56%  (kecocokan moderat)
  // - r = 0.0  -> 25%  (netral / tidak berkorelasi)
  // - r = -0.5 -> 6%   (pola berlawanan)
  // - r = -1.0 -> 0%   (sangat kontras)
  const rNorm = Math.max(0, Math.min(1, (r + 1) / 2));
  const percentage = Math.round(Math.pow(rNorm, 2.0) * 100);
  return Math.min(100, Math.max(0, percentage));
}

/**
 * Mengurutkan 8 Arketipe berdasarkan Cosine Similarity
 */
export function matchAllArchetypes(userVector: VectorScore): ArchetypeMatch[] {
  const matches = HASTALOKA_ARCHETYPES.map((archetype) => {
    const sim = calculateCosineSimilarity(userVector, archetype.idealVector);
    return {
      archetype,
      similarity: sim
    };
  });

  return matches.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Formula Indeks Kesiapan Harian (Daily Readiness Index - Rt) (BAB 6.1)
 * Rt = [(wc * Ct) + (wk * Kt) - (ws * St)] / W
 * Ambang batas:
 * Rt >= 75: Kondisi Optimal
 * 50 <= Rt < 75: Kondisi Standar
 * Rt < 50: Kondisi Kritis (Tunda keputusan besar)
 */
export function calculateReadinessIndex(
  ct: number,
  kt: number,
  st: number,
  wc = 0.40,
  wk = 0.35,
  ws = 0.25
): {
  rt: number;
  status: 'Optimal' | 'Standar' | 'Kritis';
  recommendation: string;
} {
  const clampedCt = Math.max(0, Math.min(100, ct));
  const clampedKt = Math.max(0, Math.min(100, kt));
  const clampedSt = Math.max(0, Math.min(100, st));

  // Normalisasi bobot W
  // Catatan: Karena St mengurangi kesiapan, kita menghitung nilai kesiapan bersih
  const rawScore = (wc * clampedCt) + (wk * clampedKt) + (ws * (100 - clampedSt));
  const rt = Math.round(rawScore);

  let status: 'Optimal' | 'Standar' | 'Kritis';
  let recommendation: string;

  if (rt >= 75) {
    status = 'Optimal';
    recommendation = 'Kondisi Puncak! Waktu terbaik untuk negosiasi penting, tanda tangan kontrak, dan keputusan strategis berisiko tinggi.';
  } else if (rt >= 50) {
    status = 'Standar';
    recommendation = 'Kondisi Standar. Cocok untuk eksekusi tugas terarah, kerja kolaboratif harian, dan penyelesaian alur rutin.';
  } else {
    status = 'Kritis';
    recommendation = 'Kondisi Kritis! Beban allostatic tinggi atau energi rendah. Tunda keputusan besar selama 24 jam; prioritaskan istirahat sirkadian dan tugas ringan.';
  }

  return { rt, status, recommendation };
}

/**
 * Formula Indeks Probabilitas Keberuntungan / Hoki (Psukses) (BAB 6.3)
 * Psukses = [1 - (1 - p)^n] * Ks
 */
export function calculatePsukses(p: number, n: number, ks: number): number {
  const baseP = Math.max(0.01, Math.min(0.99, p));
  const attempts = Math.max(1, n);
  const competence = Math.max(0.1, Math.min(1.0, ks));

  const prob = (1 - Math.pow(1 - baseP, attempts)) * competence;
  return Math.min(100, Math.round(prob * 100));
}

/**
 * Analisis Sinergi Antar-Arketipe (BAB 11)
 */
export function getArchetypeSynergy(idA: string, idB: string): SynergyProtocol {
  const key1 = `${idA}_${idB}`;
  const key2 = `${idB}_${idA}`;

  if (ARCHETYPE_SYNERGY_RULES[key1]) {
    return ARCHETYPE_SYNERGY_RULES[key1];
  }
  if (ARCHETYPE_SYNERGY_RULES[key2]) {
    return ARCHETYPE_SYNERGY_RULES[key2];
  }

  if (idA === idB) {
    return {
      type: 'Rawan Gesekan',
      tagline: 'Polaritas Arketipe Serupa',
      description: 'Dua kepribadian dengan gaya operasi yang sama. Berpotensi menghasilkan resonansi tinggi namun memperbesar titik buta bersama.',
      protocol: 'Tetapkan pembagian domain tanggung jawab secara eksplisit agar tidak saling tumpang tindih.'
    };
  }

  return {
    type: 'Netral Komplementer',
    tagline: 'Sinergi Fungsional Dinamis',
    description: 'Kombinasi yang dapat saling mengisi jika masing-masing pihak menghormati ritme kerja dan keunggulan arketipe rekannya.',
    protocol: 'Jaga komunikasi terbuka dan selaraskan ekspektasi di awal sebelum proyek dijalankan.'
  };
}
