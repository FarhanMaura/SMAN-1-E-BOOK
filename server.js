const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`\n🚀 Flipbook KKA SMA Kelas 10 berjalan di: http://localhost:${PORT}`);
  console.log(`\n📚 Daftar Bab:`);
  for (let i = 1; i <= 6; i++) {
    console.log(`   Bab ${i}: http://localhost:${PORT}/bab-${i}`);
  }
  console.log('\n');
});
