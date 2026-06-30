const fs = require('fs');
const path = 'public/bab-1/index.html';
let html = fs.readFileSync(path, 'utf8');

// Remove any div that has id="animasi-halaman..." or id="animasi-cover"
const idsToRemove = [
    'animasi-cover', 'animasi-halaman2', 'animasi-halaman3',
    'animasi-halaman4', 'animasi-halaman5', 'animasi-halaman6',
    'animasi-halaman7', 'animasi-halaman8', 'animasi-halaman9',
    'animasi-halaman10', 'animasi-halaman11', 'animasi-halaman12',
    'animasi-halaman13', 'animasi-halaman14', 'animasi-halaman15',
    'animasi-halaman16'
];

idsToRemove.forEach(id => {
    // regex to remove <div ... id="id" ...></div>
    const regex = new RegExp(`<div[^>]*id="${id}"[^>]*>[\\s\\S]*?<\\/div>`, 'g');
    html = html.replace(regex, '');
});

fs.writeFileSync(path, html);
console.log('Cleaned specific inner containers');
