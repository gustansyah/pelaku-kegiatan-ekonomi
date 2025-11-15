# Panduan Setup GitHub Repository

Ikuti langkah-langkah berikut untuk membuat repository GitHub dan meng-upload website Anda:

## 📋 Langkah 1: Buat Repository di GitHub

1. **Login ke GitHub**
   - Buka https://github.com
   - Login dengan akun Anda

2. **Buat Repository Baru**
   - Klik tombol "+" di kanan atas → "New repository"
   - Isi informasi repository:
     - Repository name: `pelaku-kegiatan-ekonomi` (atau nama lain yang Anda inginkan)
     - Description: `Website pembelajaran interaktif tentang pelaku kegiatan ekonomi`
     - Pilih "Public" (agar dapat diakses semua orang)
     - Jangan centang "Add a README file" (karena sudah ada di project)
   - Klik "Create repository"

## 📋 Langkah 2: Connect Local Repository ke GitHub

Setelah repository dibuat, GitHub akan menampilkan beberapa perintah. Ikuti langkah berikut:

1. **Tambahkan Remote URL**
   ```bash
   git remote add origin https://github.com/[USERNAME-GITHUB]/[NAMA-REPOSITORY].git
   ```
   
   Ganti `[USERNAME-GITHUB]` dengan username GitHub Anda dan `[NAMA-REPOSITORY]` dengan nama repository yang Anda buat.

2. **Rename Branch ke main**
   ```bash
   git branch -M main
   ```

3. **Push ke GitHub**
   ```bash
   git push -u origin main
   ```

## 📋 Langkah 3: Aktifkan GitHub Pages

1. **Buka Repository Settings**
   - Klik tab "Settings" di repository Anda
   - Pilih "Pages" dari menu samping kiri

2. **Konfigurasi GitHub Pages**
   - Di bagian "Build and deployment":
     - Source: Pilih "GitHub Actions"
   - GitHub akan otomatis menggunakan workflow yang sudah kita buat

3. **Tunggu Deployment**
   - Klik "Actions" tab untuk melihat proses deployment
   - Tunggu hingga workflow "Deploy to GitHub Pages" selesai (biasanya 2-5 menit)

## 📋 Langkah 4: Akses Website

Setelah deployment selesai:
1. Website akan tersedia di: `https://[USERNAME-GITHUB].github.io/[NAMA-REPOSITORY]/`
2. Buka URL tersebut di browser untuk melihat website Anda

## 🎉 Selamat! Website Anda Sudah Online

Website "Pelaku Kegiatan Ekonomi" sekarang dapat diakses oleh siapa saja di seluruh dunia melalui GitHub Pages!

## 📝 Update Konten di Masa Depan

Untuk mengupdate konten website di masa depan:
1. Edit file yang diperlukan
2. Commit perubahan:
   ```bash
   git add .
   git commit -m "Deskripsi perubahan"
   git push origin main
   ```
3. GitHub akan otomatis mengupdate website dalam beberapa menit

## 🐞 Troubleshooting

### Error: "remote origin already exists"
Jika muncul error ini, jalankan:
```bash
git remote remove origin
git remote add origin https://github.com/[USERNAME-GITHUB]/[NAMA-REPOSITORY].git
```

### Error: "Authentication failed"
Pastikan Anda sudah login ke GitHub CLI atau menggunakan Personal Access Token:
```bash
gh auth login
```

### Website tidak muncul
1. Periksa tab "Actions" untuk error pada workflow
2. Pastikan workflow "Deploy to GitHub Pages" berhasil
3. Tunggu beberapa menit untuk proses deployment

## 📱 Bagikan Website Anda

Setelah website online, Anda bisa:
- Share link ke sosial media
- Embed di website lain
- Gunakan sebagai portofolio
- Bagikan ke komunitas pendidikan

---

**Catatan**: Simpan file ini untuk referensi masa depan jika perlu setup ulang atau membantu orang lain.