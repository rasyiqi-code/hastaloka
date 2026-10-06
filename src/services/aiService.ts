import type { AssessmentResult, DailyReadinessRecord } from '../types/hastaloka';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

export interface AIProviderConfig {
  provider: 'ollama_cloud' | 'groq' | 'gemini' | 'deepseek' | 'openai' | 'openrouter' | 'custom';
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  autoRotate: boolean;
}

const STORAGE_KEY_AI_CONFIG = 'hastaloka_ai_config';

// 6 Model Gratis Resmi dari Ollama Cloud
export const OLLAMA_CLOUD_FREE_MODELS = [
  'gpt-oss:120b',
  'gemma4:31b',
  'gpt-oss:20b',
  'nemotron-3-nano:30b',
  'nemotron-3-super',
  'nemotron-3-ultra'
] as const;

export const DEFAULT_AI_PROVIDERS: Record<string, {
  name: string;
  baseUrl: string;
  defaultModel: string;
  placeholder: string;
  freeTierNote?: string;
  availableModels?: readonly string[];
}> = {
  ollama_cloud: {
    name: 'Ollama Cloud (Bawaan Aplikasi - Siap Pakai)',
    baseUrl: 'https://ollama.com/api',
    defaultModel: 'gpt-oss:120b',
    placeholder: 'Otomatis aktif (tidak perlu input key)',
    freeTierNote: 'AI Cloud Bawaan aktif dengan 6 model gratis berfitur Auto-Rotate!',
    availableModels: OLLAMA_CLOUD_FREE_MODELS
  },
  groq: {
    name: 'Groq (Sangat Cepat & Free Tier)',
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    placeholder: 'gsk_...',
    freeTierNote: 'Bisa daftar gratis di console.groq.com untuk dapat API key pribadi.'
  },
  gemini: {
    name: 'Google Gemini (OpenAI Compatible Endpoint)',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    defaultModel: 'gemini-2.0-flash',
    placeholder: 'AIzaSy...',
    freeTierNote: 'Ambil API Key gratis di Google AI Studio (aistudio.google.com).'
  },
  deepseek: {
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    placeholder: 'sk-...',
  },
  openai: {
    name: 'OpenAI (ChatGPT)',
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    placeholder: 'sk-proj-...',
  },
  openrouter: {
    name: 'OpenRouter (Ratusan Model)',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'meta-llama/llama-3.3-70b-instruct:free',
    placeholder: 'sk-or-v1-...',
    freeTierNote: 'Mendukung model gratis berakhiran :free'
  },
  custom: {
    name: 'Custom Endpoint / Localhost Ollama (Offline)',
    baseUrl: 'http://localhost:11434/v1',
    defaultModel: 'llama3',
    placeholder: 'bisa dikosongkan untuk lokal',
    freeTierNote: 'Jalankan Ollama di laptop Anda, 100% offline dan gratis!'
  }
};

// API Key bawaan dari environment variable
const BURIED_OLLAMA_API_KEY = (import.meta as any).env?.VITE_OLLAMA_API_KEY || '';

/**
 * Universal Request Dispatcher:
 * - Di Electron: Lewat IPC bridge bawaan Node.js (0 CORS).
 * - Di Android APK (Capacitor): Lewat CapacitorHttp native Android OkHttp (0 CORS, bypass WebView).
 * - Di Web Browser Dev: Lewat /ollama-proxy jika memanggil ollama.com agar tidak kena blokir CORS browser.
 */
async function dispatchAIRequest(
  endpoint: string,
  headers: Record<string, string>,
  body: any
): Promise<{ ok: boolean; status: number; data?: any; errorText?: string }> {
  // 1. Electron IPC Bridge
  if (typeof window !== 'undefined' && window.electronAPI?.requestAI) {
    const res = await window.electronAPI.requestAI({
      url: endpoint,
      method: 'POST',
      headers,
      body,
    });
    if (res.ok) {
      return { ok: true, status: res.status, data: res.data };
    }
    return { ok: false, status: res.status, errorText: res.error || JSON.stringify(res.data) };
  }

  // 2. Android APK / Native Capacitor HTTP Bridge (Bebas kendala CORS WebView)
  if (Capacitor.isNativePlatform()) {
    try {
      const res = await CapacitorHttp.request({
        url: endpoint,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        data: body,
      });

      let resData = res.data;
      if (typeof resData === 'string') {
        try {
          resData = JSON.parse(resData);
        } catch {
          // Tetap gunakan string jika bukan format JSON
        }
      }

      if (res.status >= 200 && res.status < 300) {
        return { ok: true, status: res.status, data: resData };
      }

      const errorText = resData?.error?.message || resData?.error || (typeof resData === 'string' ? resData : JSON.stringify(resData));
      return { ok: false, status: res.status, errorText };
    } catch (err: any) {
      return { ok: false, status: 0, errorText: err.message || String(err) };
    }
  }

  // 3. Web Browser Proxy Bypasser (Hanya aktif di Vite Dev Server di Komputer)
  let resolvedUrl = endpoint;
  if (import.meta.env.DEV && resolvedUrl.startsWith('https://ollama.com')) {
    resolvedUrl = resolvedUrl.replace('https://ollama.com', '/ollama-proxy');
  }

  try {
    const response = await fetch(resolvedUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedError = errorText;
      try {
        const errorJson = JSON.parse(errorText);
        parsedError = errorJson?.error?.message || errorJson?.error || errorText;
      } catch {}
      return { ok: false, status: response.status, errorText: parsedError };
    }

    const data = await response.json();
    return { ok: true, status: response.status, data };
  } catch (err: any) {
    return { ok: false, status: 0, errorText: err.message || String(err) };
  }
}

export const AIService = {
  getConfig(): AIProviderConfig {
    try {
      const data = localStorage.getItem(STORAGE_KEY_AI_CONFIG);
      if (data) {
        const parsed = JSON.parse(data);
        return parsed;
      }
    } catch {}

    // Default utama: Ollama Cloud bawaan
    return {
      provider: 'ollama_cloud',
      apiKey: '',
      baseUrl: DEFAULT_AI_PROVIDERS.ollama_cloud.baseUrl,
      model: DEFAULT_AI_PROVIDERS.ollama_cloud.defaultModel,
      temperature: 0.7,
      autoRotate: true,
    };
  },

  saveConfig(config: AIProviderConfig): void {
    localStorage.setItem(STORAGE_KEY_AI_CONFIG, JSON.stringify(config));
  },

  hasApiKey(): boolean {
    const config = this.getConfig();
    if (config.provider === 'ollama_cloud' || config.provider === 'custom') return true;
    return Boolean(config.apiKey && config.apiKey.trim().length > 4);
  },

  getEffectiveApiKey(config: AIProviderConfig): string {
    if (config.provider === 'ollama_cloud') {
      return BURIED_OLLAMA_API_KEY;
    }
    return config.apiKey.trim();
  },

  buildSystemPrompt(assessment: AssessmentResult | null, readiness?: DailyReadinessRecord | null): string {
    let subjectContext = 'Subjek belum mengisi kuesioner mandiri lengkap.';
    if (assessment) {
      subjectContext = `
PROFIL SUBJEK HASTALOKA:
- Nama: ${assessment.userName}
- Usia: ${assessment.userAge || 'Tidak disebutkan'}
- Profesi: ${assessment.userProfession}
- Kronotipe Sirkadian: Tipe ${assessment.chronotype}
- Skor 5 Vektor Neuro-Perilaku (H5V):
  * Drive (Dorongan Aksi): ${assessment.vectorScores.drive}%
  * Adaptabilitas (Kelenturan Emosional): ${assessment.vectorScores.adaptability}%
  * Stabilitas (Regulasi Operasional): ${assessment.vectorScores.stability}%
  * Sintesis (Kapasitas Abstraksi): ${assessment.vectorScores.synthesis}%
  * Konektivitas (Modal Sosial & Relasi): ${assessment.vectorScores.connectivity}%
- Arketipe Dominan: ${assessment.primaryArchetype.name} (${assessment.primaryArchetype.indonesianName})
  * Peran: ${assessment.primaryArchetype.role}
  * Kekuatan: ${assessment.primaryArchetype.strengths.join(', ')}
  * Titik Buta: ${assessment.primaryArchetype.blindSpots.join(', ')}
  * Strategi Karier: ${assessment.primaryArchetype.careerStrategy}
  * Jalan Kemakmuran: ${assessment.primaryArchetype.wealthStrategy}
- Arketipe Sekunder: ${assessment.secondaryArchetype.name} (${assessment.secondaryArchetype.indonesianName})
`;
    }

    let readinessContext = '';
    if (readiness) {
      readinessContext = `
KONDISI KESIAPAN HARIAN SAAT INI (Rt):
- Skor Rt: ${readiness.rt}% (${readiness.status})
- Kapasitas Kognitif (Ct): ${readiness.ct}%, Ritme Jam (Kt): ${readiness.kt}%, Beban Stres (St): ${readiness.st}%
- Status Tindakan: ${readiness.recommendation}
`;
    }

    return `Anda adalah Konsultan Diagnostik & Navigasi Keputusan HASTALOKA.
Hastaloka adalah sistem diagnostik kepribadian dan panduan keputusan rasional berbasis sains terpadu (neuro-perilaku, sirkadian, dan teori probabilitas), bukan astrologi.

${subjectContext}
${readinessContext}

PRINSIP RESPON:
1. Berikan nasihat yang terarah, berempati, rasional, dan aplikatif dalam bahasa Indonesia yang santun, hangat, dan ramah orang awam.
2. Gunakan profil vektor H5V dan arketipe di atas untuk memecahkan dilema karier, keuangan, atau relasi.
3. Hindari jargon rumit tanpa analogi sederhana. Berikan langkah nyata (actionable steps).
4. Terapkan prinsip Dikotomi Kendali: dorong subjek fokus pada hal yang bisa dikendalikannya.`;
  },

  async testConnection(config: AIProviderConfig): Promise<{ success: boolean; message: string }> {
    try {
      const cleanBaseUrl = config.baseUrl.replace(/\/+$/, '');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const effectiveKey = this.getEffectiveApiKey(config);

      // Validasi awal: Jika provider non-lokal belum diisi API Key
      if (config.provider !== 'ollama_cloud' && config.provider !== 'custom' && (!effectiveKey || effectiveKey.length < 5)) {
        const providerName = DEFAULT_AI_PROVIDERS[config.provider]?.name || config.provider;
        return {
          success: false,
          message: `API Key untuk ${providerName} belum diisi. Silakan masukkan API Key Anda di kolom yang tersedia.`
        };
      }

      if (effectiveKey) headers['Authorization'] = `Bearer ${effectiveKey}`;

      const isOllamaNative = cleanBaseUrl.endsWith('/api');
      const endpoint = isOllamaNative ? `${cleanBaseUrl}/chat` : `${cleanBaseUrl}/chat/completions`;

      const result = await dispatchAIRequest(endpoint, headers, {
        model: config.model,
        messages: [{ role: 'user', content: 'Halo! Jawab: Siap.' }],
        stream: false,
      });

      if (!result.ok) {
        return { success: false, message: `Gagal terhubung (${result.status}): ${result.errorText || 'Terjadi kesalahan'}` };
      }

      const reply = result.data?.message?.content || result.data?.choices?.[0]?.message?.content || 'Sukses';
      const cleanReply = reply.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
      return { success: true, message: `Koneksi Berhasil! Model "${config.model}" siap digunakan. (Respon: "${cleanReply}")` };
    } catch (e: any) {
      return { success: false, message: `Koneksi gagal: ${e.message || e}` };
    }
  },

  /**
   * Mengirim pertanyaan ke AI dengan sistem Auto-Rotate otomatis
   */
  async askConsultant(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    assessment: AssessmentResult | null,
    readiness?: DailyReadinessRecord | null
  ): Promise<string> {
    const config = this.getConfig();
    const effectiveKey = this.getEffectiveApiKey(config);
    if (!effectiveKey && config.provider !== 'custom') {
      throw new Error('API Key belum diatur. Silakan buka menu Pengaturan AI.');
    }

    const cleanBaseUrl = config.baseUrl.replace(/\/+$/, '');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (effectiveKey) headers['Authorization'] = `Bearer ${effectiveKey}`;

    const isOllamaNative = cleanBaseUrl.endsWith('/api');
    const endpoint = isOllamaNative ? `${cleanBaseUrl}/chat` : `${cleanBaseUrl}/chat/completions`;

    const systemPrompt = this.buildSystemPrompt(assessment, readiness);
    const fullMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    // Daftar model untuk auto-rotate
    const candidateModels: string[] = [];
    candidateModels.push(config.model);

    if (config.provider === 'ollama_cloud' && config.autoRotate) {
      for (const m of OLLAMA_CLOUD_FREE_MODELS) {
        if (!candidateModels.includes(m)) {
          candidateModels.push(m);
        }
      }
    }

    let lastError = '';

    for (let i = 0; i < candidateModels.length; i++) {
      const activeModel = candidateModels[i];
      try {
        const result = await dispatchAIRequest(endpoint, headers, {
          model: activeModel,
          messages: fullMessages,
          stream: false,
          temperature: config.temperature || 0.7,
        });

        if (!result.ok) {
          lastError = `Model ${activeModel} gagal (${result.status}): ${result.errorText}`;
          console.warn(`[Hastaloka AI] ${lastError}. Mencoba rotasi model berikutnya...`);
          continue;
        }

        let content: string = result.data?.message?.content || result.data?.choices?.[0]?.message?.content || '';

        // Bersihkan tag <think> jika ada
        content = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

        // Update model aktif jika berbeda
        if (activeModel !== config.model && config.autoRotate) {
          config.model = activeModel;
          this.saveConfig(config);
        }

        return content || 'Maaf, model tidak menghasilkan respon teks.';
      } catch (err: any) {
        lastError = err.message || String(err);
        console.warn(`[Hastaloka AI] Fetch error pada model ${activeModel}: ${lastError}`);
      }
    }

    throw new Error(`Semua model dalam antrean gagal dihubungi. Error terakhir: ${lastError}`);
  },

  /**
   * Simulator Keputusan Multi-Lapisan (H5V + Rt + Probabilitas + AI Verdict)
   */
  async simulateDecision(
    dilemma: string,
    assessment: AssessmentResult | null,
    readiness?: DailyReadinessRecord | null
  ): Promise<string> {
    const prompt = `
Sebagai Chief of Staff dan Konsultan Keputusan Strategis Hastaloka, bedah dilema keputusan berikut secara multi-lapisan:

DILEMA PENGGUNA:
"${dilemma}"

INSTRUKSI ANALISIS WAJIB:
Sajikan hasil analisis secara komprehensif, tajam, dan aplikatif dengan format terstruktur berikut:

1. **Vonis Strategis (Strategic Verdict)**:
   - Nyatakan dengan tegas: [DIREKOMENDASIKAN / BERSYARAT KETAT / TUNDA SEMENTARA / TIDAK DIREKOMENDASIKAN]
   - Skor Keselarasan Keputusan (0 - 100%) dan rasional singkatnya.

2. **Analisis Keselarasan Vektor H5V (Fit vs Friction)**:
   - Vektor mana yang mendukung keputusan ini?
   - Vektor mana yang menjadi risiko (misal: Stability rendah rentan teledor kontrak, atau Drive tinggi memicu gegabah)?

3. **Audit Kesiapan Real-Time (Rt & Waktu Eksekusi)**:
   - Berdasarkan kondisi kesiapan energi/kronotipe subjek, kapan waktu eksekusi terbaik dan apa yang harus dihindari?

4. **Peringatan Titik Buta Kritis (Blindspots)**:
   - 2 hal paling berbahaya yang kemungkinan besar luput dari pertimbangan subjek karena bias kepribadiannya.

5. **Rencana Aksi 48 Jam (3 Langkah Taktis)**:
   - Langkah 1, 2, dan 3 yang konkret dan terukur untuk memitigasi risiko.
`;

    return this.askConsultant([
      { role: 'user', content: prompt }
    ], assessment, readiness);
  },

  /**
   * Sintesis Intelijen Mendalam (Deep Executive Dossier)
   */
  async generateDeepDossier(
    assessment: AssessmentResult
  ): Promise<string> {
    const prompt = `
Susun **Executive Deep Diagnostic Dossier** untuk subjek ini. Jangan hanya mengulang teks standar buku, melainkan sintesiskan kombinasi unik dari 5 vektornya (${assessment.primaryArchetype.name}, Drive: ${assessment.vectorScores.drive}%, Adaptability: ${assessment.vectorScores.adaptability}%, Stability: ${assessment.vectorScores.stability}%, Synthesis: ${assessment.vectorScores.synthesis}%, Connectivity: ${assessment.vectorScores.connectivity}%):

FORMAT WAJIB:
Sajikan output terbagi persis dalam 4 bagian dengan header Markdown Level 2 (##) berikut agar sistem antarmuka dapat membaginya menjadi 4 Kartu Insight Eksekutif:

## 1. Anatomi Superpower & Daya Tawar Ekonomi
Uraikan nilai kelangkaan (economic moat) alami subjek di pasar kerja/bisnis, keunggulan taktis gabungan vektor tertingginya, dan nilai asimetri yang sulit ditiru kompetitor.

## 2. Jalur Uang & Leverage Finansial
Uraikan model penghasilan dan leverage yang paling melipatgandakan energinya tanpa membakar dirinya (burnout), serta bentuk instrumen/bisnis yang paling selaras.

## 3. Pola Sabotase Diri (Anti-Blindspot Protocol)
Uraikan kesalahan klasik yang paling sering merusak karier/bisnis orang dengan profil seperti ini, pemicu bias psikologisnya, dan protokol pencegahan mitigasi risikonya.

## 4. Golden Hours & Ritme Eksekusi
Uraikan jam kerja produktif paling tajam (sesuai kronotipe subjek) dan panduan tegas apa saja tugas yang WAJIB didelegasikan ke arketipe komplementer.
`;

    return this.askConsultant([
      { role: 'user', content: prompt }
    ], assessment, null);
  }
};
