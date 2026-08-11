const express = require('express');
const path = require('path');
const app = express();
let PORT = parseInt(process.env.PORT, 10) || 3000;

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Root redirect to index
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for bab routes
app.get('/bab-:num', (req, res) => {
  const num = req.params.num;
  res.sendFile(path.join(__dirname, 'public', `bab-${num}`, 'index.html'));
});

// Full Book Route
app.get('/book', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'book.html'));
});

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`\n🚀 Flipbook KKA SMA Kelas 10 berjalan di: http://localhost:${portToUse}`);
    console.log(`📖 BUKU LENGKAP: http://localhost:${portToUse}/book`);
    console.log(`📚 Daftar Bab (Terpisah):`);
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
