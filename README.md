# HASTALOKA v1.0 — Sistem Diagnostik, Profiling & Navigasi Keputusan

Sistem profiling dan navigasi keputusan manusia berbasis sains terpadu yang dirancang lintas platform (**Windows Desktop** & **Android Mobile**) dengan arsitektur **Local-First (Tanpa Biaya Server / Rp 0 Selamanya)** untuk model bisnis **Beli Putus / Sekali Jual**.

---

## 🛠️ Tech Stack & Arsitektur

* **Core Framework**: Vite + Vue 3 (Composition API & `<script setup lang="ts">`) + TypeScript Versi Terbaru
* **Styling**: Tailwind CSS v4 + Glassmorphism UI
* **Icons**: `@lucide/vue`
* **Visualisasi**: Geometri Radar 5 Vektor H5V (SVG Presisi Tinggi) + Chart.js
* **Mesin AI Terintegrasi (BYOK - Bring Your Own Key)**: Konsultan AI Navigasi Keputusan (mendukung API Key model apa pun: Groq, Gemini, DeepSeek, OpenAI, OpenRouter, hingga Local Ollama)
* **Desktop Runtime (Windows)**: Electron (`electron/main.cjs` & `electron/preload.cjs`)
* **Mobile Runtime (Android)**: Capacitor (`@capacitor/core`, `@capacitor/android`)
* **Backend & Storage**: Local-First Architecture (Embedded Node.js di Windows, Capacitor Bridge di Android, LocalStorage/SQLite Abstraction)
* **Sistem Lisensi**: Built-in Offline Serial Key Validator untuk model jual putus

---

## 🚀 Perintah Menjalankan Aplikasi

### 1. Menjalankan di Mode Web / Pengembangan
```bash
npm run dev
```
Akses di browser: `http://localhost:5173`

### 2. Menjalankan di Mode Desktop Windows (Electron)
```bash
# Menjalankan aplikasi desktop saat pengembangan
npm run electron:dev

# Mem-build installer resmi Windows (.exe / Portable)
npm run electron:build
```
*Hasil installer `.exe` akan otomatis tersimpan di folder `release/`.*

### 3. Menjalankan di Mode Android (Capacitor)
```bash
# Sinkronisasi aset web terbaru ke proyek Android
npm run cap:sync

# Buka proyek native Android di Android Studio untuk membuat APK
npm run cap:open:android
```

---

## 📦 Fitur Lengkap Sesuai Buku Acuan Hastaloka

1. **Kuesioner Diagnostik Mandiri (25 Soal - BAB 9)**:
   - 5 Soal Vektor Drive (D1 - D5)
   - 5 Soal Vektor Adaptabilitas (A1 - A5)
   - 5 Soal Vektor Stabilitas (S1 - S5)
   - 5 Soal Vektor Sintesis (N1 - N5)
   - 5 Soal Vektor Konektivitas (K1 - K5)
   - Formula konversi skor: `Skor = ((Raw - 5) / 20) * 100`

2. **Engine 8 Arketipe & Cosine Similarity (BAB 6 & 10)**:
   - *Architect, Catalyst, Evangelist, Mechanic, Allocator, Arbitrageur, Specialist, Accumulator*.
   - Perhitungan Cosine Similarity presisi terhadap vektor ideal acuan.
   - Penentuan Arketipe Dominan & Sekunder beserta strategi karier, jalan kemakmuran, dan titik buta.

3. **Geometri Radar Chart 5 Vektor (H5V)**:
   - Tampilan visual pentagon modern membandingkan profil subjek dengan arketipe ideal secara interaktif.

4. **Kalkulator Indeks Kesiapan Harian ($R_t$) (BAB 6.1 & 8)**:
   - Formula: `[(0.40 × Ct) + (0.35 × Kt) + (0.25 × (100 - St))]`
   - Kategori: Optimal ($\ge 75$), Standar ($50 - 74$), Kritis ($< 50$).
   - Dilengkapi rekomendasi aksi keputusan instan dan penyimpanan ke riwayat harian.

5. **Matriks Kompatibilitas Relasi 8x8 (BAB 11)**:
   - Pengecek sinergi antar-arketipe untuk tim kerja, co-founder bisnis, maupun pasangan hidup lengkap dengan protokol pencegahan gesekan.

6. **Audit 12 Domain Kehidupan (BAB 5)**:
   - Pengganti 12 rumah astrologi dengan 12 area audit fungsional riil (Fisik, Sirkadian, Kognisi, Emosi, Hunian, Finansial, Karier, Asmara, Sosial, Keluarga, Istirahat, dan Makna Hidup).

7. **Protokol Operasional Harian & Kalkulator Probabilitas Keberuntungan ($P_{sukses}$) (BAB 6.3 & 8)**:
   - *Chrono-Audit* (Pagi), *Decision-Audit* (Siang), *Stoic Closure* (Malam).
   - Kalkulator rumus hoki: `Psukses = [1 - (1 - p)^n] * Ks`.

8. **Ekspor Laporan Eksekutif PDF Resmi**:
   - Lembar hasil diagnosis lengkap dengan KOP resmi, tabel skor, visualisasi radar, rekomendasi karier, dan tanda verifikasi siap cetak atau disimpan ke file PDF.

9. **Sistem Lisensi Beli Putus (Lifetime Access)**:
   - Dialog aktivasi nomor lisensi unik dan fitur ekspor/impor cadangan data JSON.

---

## 💰 Cara Menjual (Strategi Sekali Jual / Beli Putus)

1. **Jual ke Pengguna PC/Laptop (Windows)**:
   - Jalankan `npm run electron:build` untuk menghasilkan file `Hastaloka-Setup-1.0.0.exe` (atau versi portable).
   - Kirimkan file installer ini kepada pembeli (via Google Drive / Lynk.id / Shopee / WhatsApp).
   - Berikan nomor Serial Lisensi unik kepada pembeli untuk diaktifkan di menu **Lisensi**.

2. **Jual ke Pengguna Android**:
   - Build file `.apk` lewat Android Studio (`npm run cap:open:android` -> Build APK).
   - Kirimkan file `.apk` langsung ke pembeli.

3. **Keuntungan untuk Anda**:
   - **0 Biaya Server**: Tidak ada pengeluaran rutin sepeser pun.
   - **Beli Putus**: Pembeli membayar sekali seumur hidup, Anda mendapatkan keuntungan penuh 100%.
