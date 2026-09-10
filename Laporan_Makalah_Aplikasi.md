# LAPORAN PENGEMBANGAN APLIKASI
**Aplikasi Pembelajaran Bahasa Jepang (JFT-Basic) Berbasis Spaced Repetition System (SRS)**

---

## BAB I: PENDAHULUAN

### 1.1 Latar Belakang Permasalahan di Lapangan
Mempelajari bahasa asing, khususnya bahasa Jepang untuk persiapan ujian seperti JFT-Basic (Japan Foundation Test for Basic Japanese), menuntut penguasaan ribuan kosakata dan huruf Kanji. Di lapangan, pelajar sering kali menghadapi masalah utama berupa **Kurva Kelupaan (Ebbinghaus Forgetting Curve)**, di mana kosakata yang baru dipelajari akan cepat dilupakan dalam hitungan hari jika tidak diulang secara berkala.

Metode pembelajaran konvensional seperti membaca buku atau menggunakan *flashcard* fisik dinilai kurang efisien karena:
1. Tidak ada pelacakan sistematis terhadap materi mana yang sudah dikuasai dan mana yang belum.
2. Pelajar menghabiskan waktu yang sama untuk mempelajari kosakata yang mudah dan kosakata yang sulit.
3. Tidak ada penentuan waktu yang optimal kapan sebuah kosakata harus diulang kembali sebelum memori tersebut hilang.

### 1.2 Tujuan Pengembangan Aplikasi
Berdasarkan permasalahan di atas, aplikasi ini dikembangkan dengan tujuan:
1. **Meningkatkan Efisiensi Belajar:** Mengimplementasikan algoritma *Spaced Repetition System* (SRS) agar pelajar hanya mengulang kosakata yang akan segera dilupakan atau yang belum dikuasai (Weak points).
2. **Digitalisasi dan Aksesibilitas:** Menyediakan platform digital berupa Web App/PWA yang terpusat sehingga pelajar bisa mengakses *Flashcard* dan *Kuis* di mana saja.
3. **Memonitor Perkembangan Terukur:** Menyediakan dashboard dan analitik yang melacak jumlah kosakata yang "Sudah Hafal" (Ingat) dan "Belum Hafal" agar progres belajar terlihat nyata dan memotivasi pengguna.

---

## BAB II: METODE DAN PENDEKATAN

### 2.1 Pendekatan Pembelajaran
Aplikasi ini menggunakan dua pendekatan ilmu kognitif utama:
- **Active Recall (Pemanggilan Aktif):** Proses menstimulasi memori dengan mencoba mengingat arti suatu kosakata sebelum melihat jawabannya (diimplementasikan via UI *Flashcard* yang harus dibalik).
- **Spaced Repetition System (SRS):** Teknik pengulangan interval berskala. Semakin sering pengguna menebak kartu dengan benar, semakin lama kartu tersebut disembunyikan sebelum muncul lagi di sesi *Review*.

### 2.2 Teknologi yang Digunakan
- **Frontend (Antarmuka):** React.js dengan TypeScript dan Tailwind CSS untuk menciptakan antarmuka yang cepat, responsif (Mobile-First), dan modern.
- **Backend & Database:** Firebase Auth (Manajemen Akun) dan Firestore Database (Menyimpan status interval SRS masing-masing kosakata per pengguna secara terenkripsi di *cloud*).

---

## BAB III: DIAGRAM DAN ALGORITMA SISTEM

### 3.1 Algoritma Interval (SRS Logic)
Aplikasi ini menggunakan modifikasi dari algoritma SM-2 (SuperMemo-2). Setiap kosakata memiliki data memori berupa: `interval` (waktu jeda) dan `nextReviewTime` (waktu kuis berikutnya).

**Logika Penentuan Interval:**
1. **Kondisi Awal (Baru Belajar):** Kartu muncul.
2. **Jika Menjawab Salah (Belum Ingat / Incorrect):**
   - Interval di-reset ke nilai minimal (misal: pengulangan dalam sesi yang sama atau besok harinya).
3. **Jika Menjawab Benar (Ingat / Correct):**
   - Pengulangan ke-1: Interval menjadi 1 Hari.
   - Pengulangan ke-2: Interval menjadi 3 Hari.
   - Pengulangan ke-3: Interval menjadi 7 Hari, dan akan terus dikalikan (multiplier) seiring keberhasilan pengguna menjawab benar secara konsisten.

### 3.2 Alur Kerja (Flowchart Sistem)
Berikut adalah alur logika aplikasi dari perspektif pengguna:

```text
[Mulai Aplikasi] 
       ↓
[Pilih Kategori/Bab (Contoh: Kanji JFT)]
       ↓
[Sistem Memeriksa Database Firestore]
   ├──> Apakah ada kartu dengan 'nextReviewTime' <= Waktu Sekarang?
   │       └──> [YA] Masukkan ke Antrean Belajar (Due Queue).
   │       └──> [TIDAK] Gunakan kartu berurutan dari indeks 0.
       ↓
[Tampilkan Flashcard / Kuis]
       ↓
[Pengguna Memberikan Jawaban (Ingat / Belum Ingat)]
       ↓
[Algoritma SRS Menghitung Interval Baru]
       ↓
[Simpan ke Firestore ('user_progress')]
       ↓
[Selesai Sesi -> Tampilkan Laporan Progres]
```

---

## BAB IV: ANTARMUKA PENGGUNA (UI APLIKASI)

Bagian ini menunjukkan implementasi desain dari kode ke dalam tampilan visual yang digunakan oleh pengguna. 
*(Catatan di Microsoft Word: Masukkan tangkapan layar / screenshot aplikasi pada bagian ini)*

**1. Halaman Kategori (Deck View)**
- **Fungsi:** Menampilkan daftar sesi atau bab (misalnya Latihan 1 - 10). Terdapat indikator jumlah kartu yang "Sudah Hafal" dan "Belum Hafal".
- **Screenshot:** *(Masukkan Screenshot daftar menu di sini)*

**2. Halaman Flashcard (Active Recall)**
- **Fungsi:** Menampilkan karakter Kanji/Hiragana secara statis berurutan. Pengguna harus mengingat maknanya, lalu mengetuk kartu untuk membalik dan melihat jawaban benarnya (terdapat tombol "Belum Ingat" dan "Ingat"). Terdapat mode 3-Arah untuk Kanji.
- **Screenshot:** *(Masukkan Screenshot Flashcard Kanji JFT yang baru Anda unggah di sini)*

**3. Halaman Kuis (Multiple Choice)**
- **Fungsi:** Menguji pengguna dengan 4 opsi pilihan ganda yang dirancang secara dinamis. Jawaban yang salah akan langsung mereset interval SRS ke awal.
- **Screenshot:** *(Masukkan Screenshot Kuis Hiragana -> Arti dengan 4 opsi jawaban di sini)*

---

## BAB V: PENUTUP

### 5.1 Kesimpulan
Aplikasi pembelajaran bahasa Jepang JFT-Basic ini berhasil mengintegrasikan metode *Active Recall* dan *Spaced Repetition System* secara digital. Dengan merubah kartu fisik menjadi *database cloud* adaptif, sistem dapat melacak ratusan hingga ribuan kosakata per pengguna secara otomatis, menyajikan kartu di saat yang paling tepat secara psikologis, dan pada akhirnya membantu penguasaan bahasa Jepang secara jauh lebih efisien, terukur, dan terhindar dari siklus kelupaan memori.
