const fs = require('fs');
const path = 'public/bab-1/index.html';
let html = fs.readFileSync(path, 'utf8');

// There are 2 script tags for animasi-bab1.js now. We want to remove the last one (at the bottom).
const scriptTagRegex = /<script src="animasi-bab1\.js[^>]*><\/script>/g;
const matches = html.match(scriptTagRegex);

if (matches && matches.length > 1) {
    // Keep the first one (which the user had at line 856) and remove the rest
    let count = 0;
    html = html.replace(scriptTagRegex, match => {
        count++;
        return count === 1 ? match : '';
    });
    fs.writeFileSync(path, html);
    console.log('Removed duplicate scripts');
} else {
    console.log('No duplicates found');
}
