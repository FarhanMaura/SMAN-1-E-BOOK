const fs = require('fs');
const path = 'public/bab-1/index.html';
let html = fs.readFileSync(path, 'utf8');

// Update script tag to bust cache
html = html.replace(/<script src="animasi-bab1\.js(\?v=\d+)?"/g, '<script src="animasi-bab1.js?v=' + Date.now() + '"');

fs.writeFileSync(path, html);
console.log('Cache busted in index.html');
