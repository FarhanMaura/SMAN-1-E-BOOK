const fs = require('fs');
const path = require('path');

const themes = {
    'bab-2': { primary: 'blue', secondary: 'pink', hex1: '#3b82f6', hex2: '#f472b6', rgb: '59, 130, 246', lottie: 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json' },
    'bab-3': { primary: 'green', secondary: 'orange', hex1: '#10b981', hex2: '#fb923c', rgb: '16, 185, 129', lottie: 'https://assets1.lottiefiles.com/packages/lf20_a1hzz2q2.json' },
    'bab-4': { primary: 'red', secondary: 'yellow', hex1: '#ef4444', hex2: '#facc15', rgb: '239, 68, 68', lottie: 'https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json' },
    'bab-5': { primary: 'indigo', secondary: 'rose', hex1: '#6366f1', hex2: '#fb7185', rgb: '99, 102, 241', lottie: 'https://assets5.lottiefiles.com/packages/lf20_5e7wgehs.json' },
    'bab-6': { primary: 'cyan', secondary: 'amber', hex1: '#06b6d4', hex2: '#fbbf24', rgb: '6, 182, 212', lottie: 'https://assets10.lottiefiles.com/packages/lf20_jzzuzxus.json' }
};

const baseDir = path.join(__dirname, 'public');

for (const [bab, theme] of Object.entries(themes)) {
    const filePath = path.join(baseDir, bab, 'index.html');
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Add :root to style if not present
    if (!content.includes(':root {')) {
        content = content.replace('<style>', `<style>\n    :root { --primary-rgb: ${theme.rgb}; }`);
    } else {
        // Replace existing --primary-rgb just in case
        content = content.replace(/--primary-rgb:\s*[^;]+;/, `--primary-rgb: ${theme.rgb};`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Added root vars to ${bab}`);
}
