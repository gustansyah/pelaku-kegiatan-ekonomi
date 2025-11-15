# Panduan Deployment ke GitHub Pages

Dokumen ini menjelaskan cara meng-deploy website "Pelaku Kegiatan Ekonomi" ke GitHub Pages.

## 🚀 Cara Deployment Otomatis (Recommended)

Proyek ini sudah dikonfigurasi dengan GitHub Actions untuk deployment otomatis. Setiap kali Anda push perubahan ke branch `main`, website akan otomatis ter-deploy.

### Langkah-langkah:

1. **Pastikan repository sudah di-setup dengan GitHub Pages**
   - Buka repository GitHub Anda
   - Klik tab "Settings"
   - Pilih "Pages" dari menu samping
   - Di bagian "Build and deployment", pilih "GitHub Actions" sebagai source

2. **Push perubahan ke branch main**
   ```bash
   git add .
   git commit -m "Deskripsi perubahan Anda"
   git push origin main
   ```

3. **Tunggu proses deployment**
   - Buka tab "Actions" di repository
   - Tunggu hingga workflow "Deploy to GitHub Pages" selesai
   - Website akan tersedia di: `https://[username].github.io/[repository-name]/`

## 📝 Cara Manual Deployment

Jika deployment otomatis tidak berfungsi, Anda bisa melakukan deployment manual:

### Metode 1: Menggunakan GitHub Pages Settings

1. Buka repository GitHub
2. Klik "Settings" → "Pages"
3. Pilih "Deploy from a branch"
4. Pilih branch `main` dan folder `/ (root)`
5. Klik "Save"
6. Tunggu beberapa menit untuk proses deployment

### Metode 2: Menggunakan GitHub CLI

```bash
# Install GitHub CLI jika belum terinstall
# Kemudian jalankan perintah berikut:

gh repo view --web  # Buka repository di browser
# Ikuti langkah-langkah di bagian Settings → Pages
```

## 🔧 Konfigurasi Lokal

### Prasyarat:
- Git terinstall di komputer
- Akun GitHub
- Repository sudah dibuat di GitHub

### Setup awal:
```bash
# Clone repository (jika belum)
git clone https://github.com/[username]/[repository-name].git
cd [repository-name]

# Atur remote origin
git remote set-url origin https://github.com/[username]/[repository-name].git

# Checkout ke branch main
git checkout main
```

## 📝 Membuat Perubahan

### Menambah konten baru:
1. Edit file yang diperlukan (HTML, CSS, atau JavaScript)
2. Test secara lokal dengan membuka `index.html` di browser
3. Commit dan push perubahan:
   ```bash
   git add .
   git commit -m "Menambah materi baru tentang [topik]"
   git push origin main
   ```

### Menambah halaman baru:
1. Buat file HTML baru (misal: `materi-tambahan.html`)
2. Link dari halaman utama atau navigasi
3. Commit dan push perubahan

### Mengupdate konten:
1. Edit file yang diperlukan
2. Pastikan semua link dan referensi masih valid
3. Test perubahan secara lokal
4. Commit dan push perubahan

## 🐞 Troubleshooting

### Website tidak muncul setelah deployment:
1. Periksa tab "Actions" untuk error pada workflow
2. Pastikan file `index.html` ada di root directory
3. Cek apakah ada syntax error di HTML/CSS/JavaScript

### Deployment gagal:
1. Pastikan GitHub Actions sudah di-enable
2. Cek file `.github/workflows/deploy.yml` sudah benar
3. Pastikan permissions untuk Pages sudah diatur

### Perubahan tidak terlihat:
1. Clear browser cache (Ctrl+F5 atau Cmd+Shift+R)
2. Tunggu beberapa menit (GitHub Pages butuh waktu untuk update)
3. Periksa apakah deployment berhasil di tab "Actions"

## 📊 Monitoring Deployment

### Cara mengecek status deployment:
1. Buka repository GitHub
2. Klik tab "Actions"
3. Lihat workflow "Deploy to GitHub Pages"
4. Klik workflow terakhir untuk detail

### Cara mengecek website live:
1. Buka URL: `https://[username].github.io/[repository-name]/`
2. Gunakan browser incognito untuk melihat versi terbaru
3. Periksa console browser untuk error (F12 → Console)

## 🔄 Update Konten Rutin

### Untuk update rutin (misal: tambah materi baru):
1. Buat branch baru untuk fitur besar:
   ```bash
   git checkout -b fitur-baru
   ```
2. Lakukan perubahan
3. Test secara lokal
4. Merge ke main:
   ```bash
   git checkout main
   git merge fitur-baru
   git push origin main
   ```
5. Hapus branch fitur:
   ```bash
   git branch -d fitur-baru
   git push origin --delete fitur-baru
   ```

## 📱 PWA Features

Website ini sudah dilengkapi dengan:
- Web App Manifest (`site.webmanifest`)
- Responsive design untuk mobile
- Metadata untuk SEO

### Cara test PWA:
1. Buka website di Chrome mobile
2. Klik menu (tiga titik) → "Add to Home screen"
3. Website akan terinstall seperti aplikasi native

## 🌐 Custom Domain

Jika ingin menggunakan custom domain:
1. Buka "Settings" → "Pages" → "Custom domain"
2. Masukkan domain Anda (misal: `www.domain-anda.com`)
3. Konfigurasi DNS records sesuai petunjuk GitHub
4. Update URL di Open Graph meta tags di `index.html`

---

**Catatan**: Pastikan selalu commit perubahan dengan deskripsi yang jelas agar mudah dilacak di masa depan.