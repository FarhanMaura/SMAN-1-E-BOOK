const fs = require('fs');
const path = 'public/bab-1/index.html';
let html = fs.readFileSync(path, 'utf8');

// Regex yang mencari tag script animasi (baik path relatif maupun absolute)
const scriptRegex = /<script src="(\/bab-1\/)?animasi-bab1\.js[^>]*><\/script>/g;

// Ganti dengan versi absolute path yang baru
const newScriptTag = `<script src="/bab-1/animasi-bab1.js?v=${Date.now()}"></script>`;

html = html.replace(scriptRegex, newScriptTag);

fs.writeFileSync(path, html);
console.log('Cache busted in index.html');
