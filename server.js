require('dotenv').config();
const express = require('express');
const path    = require('path');
const db      = require('./db');

const app  = express();
let PORT   = parseInt(process.env.PORT, 10) || 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Page Routes ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'book.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

app.get('/bab-:num', (req, res) => {
  const num = req.params.num;
  res.sendFile(path.join(__dirname, 'public', `bab-${num}`, 'index.html'));
});

// ─── API: GET semua data bab ──────────────────────────────────────────────────
app.get('/api/bab', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT b.*, bk.judul_buku, bk.mata_pelajaran, bk.kurikulum
       FROM bab b
       JOIN buku bk ON b.id_buku = bk.id_buku
       ORDER BY b.nomor_bab ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[API /api/bab]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API: POST simpan skor siswa ──────────────────────────────────────────────
app.post('/api/skor', async (req, res) => {
  const { nama_siswa, id_bab, tipe, skor } = req.body;

  // Validasi input
  if (!nama_siswa || !id_bab || !tipe || skor === undefined) {
    return res.status(400).json({ success: false, error: 'Data tidak lengkap.' });
  }
  if (!['latihan', 'ujian'].includes(tipe)) {
    return res.status(400).json({ success: false, error: 'Tipe tidak valid.' });
  }
  const namaClean = String(nama_siswa).trim().substring(0, 100);
  const skorNum   = Math.min(100, Math.max(0, parseInt(skor) || 0));

  try {
    const [result] = await db.query(
      `INSERT INTO skor_siswa (nama_siswa, id_bab, tipe, skor) VALUES (?, ?, ?, ?)`,
      [namaClean, id_bab, tipe, skorNum]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('[API /api/skor]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API: GET leaderboard per bab ────────────────────────────────────────────
app.get('/api/leaderboard/:id_bab', async (req, res) => {
  const { id_bab } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT nama_siswa, tipe, skor, created_at
       FROM skor_siswa
       WHERE id_bab = ?
       ORDER BY skor DESC, created_at ASC
       LIMIT 20`,
      [id_bab]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[API /api/leaderboard]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── API: GET leaderboard semua bab (untuk halaman leaderboard global) ────────
app.get('/api/leaderboard', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT s.nama_siswa, s.id_bab, b.judul_bab, b.ikon_bab,
              s.tipe, s.skor, s.created_at
       FROM skor_siswa s
       JOIN bab b ON s.id_bab = b.id_bab
       ORDER BY s.skor DESC, s.created_at ASC
       LIMIT 50`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[API /api/leaderboard]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────
function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`\n🚀 Flipbook KKA SMA Kelas 10 berjalan di: http://localhost:${portToUse}`);
    console.log(`📖 BUKU LENGKAP : http://localhost:${portToUse}/book`);
    console.log(`🏆 LEADERBOARD  : http://localhost:${portToUse}/leaderboard`);
    console.log(`📚 Daftar Bab   :`);
    for (let i = 1; i <= 6; i++) {
      console.log(`   Bab ${i}: http://localhost:${portToUse}/bab-${i}`);
    }
    console.log('\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${portToUse} sedang digunakan. Mencoba port ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
