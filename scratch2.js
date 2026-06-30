const fs = require('fs');
const path = 'public/bab-1/index.html';
let html = fs.readFileSync(path, 'utf8');

// Replace all divs that contain animasi-robot-container
// Because there might be newlines, we can use [\s\S]*?
html = html.replace(/<div[^>]*class="animasi-robot-container[^>]*>[\s\S]*?<\/div>/g, '');

fs.writeFileSync(path, html);
console.log('Removed inner containers, count: ' + (html.match(/animasi-robot-container/g) || []).length);
