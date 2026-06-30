const fs = require('fs');
const path = 'public/bab-1/index.html';
let html = fs.readFileSync(path, 'utf8');

// Remove all inner robot containers
html = html.replace(/<div[^>]*class="animasi-robot-container[^>]*>[^<]*<\/div>/g, '');

// Increase size of outer robots
html = html.replace(/width:\s*220px;\s*height:\s*280px;/g, 'width: 340px; height: 400px; bottom: 0;');

fs.writeFileSync(path, html);
console.log('Done cleaning index.html');
