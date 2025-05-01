# Aplikasi Pencatatan Pinjaman Koperasi Nurul Ulum

Aplikasi web untuk mengelola data nasabah dan pinjaman di Koperasi Nurul Ulum.

## Fitur

- Sistem login admin
- Manajemen data nasabah
- Manajemen data pinjaman
- Perhitungan otomatis cicilan dan sisa angsuran
- Download data dalam format Excel
- Integrasi dengan Google Sheets sebagai database

## Teknologi

- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: Google Sheets API
- Export: ExcelJS

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM atau Yarn
- Google Cloud Platform account untuk Google Sheets API

## Setup Google Sheets API

1. Buat project baru di [Google Cloud Console](https://console.cloud.google.com)
2. Aktifkan Google Sheets API
3. Buat Service Account dan download credentials (JSON)
4. Buat spreadsheet baru di Google Sheets
5. Share spreadsheet dengan email service account
6. Buat dua sheet: "Nasabah" dan "Pinjaman"

### Format Sheet

#### Sheet "Nasabah":
- Kolom: ID, Nama, Alamat, Nomor Telepon

#### Sheet "Pinjaman":
- Kolom: ID, ID Nasabah, Jumlah Pinjaman, Tenor, Tanggal Pinjam, Bunga, Cicilan Bulanan, Sisa Angsuran

## Instalasi

1. Clone repository:
\`\`\`bash
git clone <repository-url>
cd koperasi-nurul-ulum
\`\`\`

2. Install dependencies backend:
\`\`\`bash
npm install
\`\`\`

3. Install dependencies frontend:
\`\`\`bash
cd frontend
npm install
\`\`\`

4. Setup environment variables:

Buat file \`.env\` di root folder:
\`\`\`
PORT=5000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
JWT_SECRET=your-secret-key
GOOGLE_SHEETS_ID=your-spreadsheet-id
GOOGLE_CLIENT_EMAIL=your-service-account-email
GOOGLE_PRIVATE_KEY=your-private-key
\`\`\`

## Menjalankan Aplikasi

1. Start backend server:
\`\`\`bash
npm run server
\`\`\`

2. Start frontend development server:
\`\`\`bash
cd frontend
npm start
\`\`\`

Aplikasi akan berjalan di:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Deployment

### Backend
1. Deploy ke platform seperti Heroku atau DigitalOcean
2. Set environment variables di platform deployment
3. Pastikan URL backend diupdate di frontend

### Frontend
1. Build frontend:
\`\`\`bash
cd frontend
npm run build
\`\`\`
2. Deploy folder build ke Netlify, Vercel, atau platform static hosting lainnya

## Penggunaan

1. Login menggunakan credentials admin
2. Kelola data nasabah di menu "Data Nasabah"
3. Kelola data pinjaman di menu "Data Pinjaman"
4. Lihat ringkasan data di "Dashboard"
5. Download data dalam format Excel menggunakan tombol "Download Data"

## Keamanan

- Gunakan HTTPS di production
- Ganti default admin password
- Simpan credentials Google Sheets dengan aman
- Backup data secara berkala

## Support

Untuk bantuan dan pertanyaan, hubungi admin sistem.
