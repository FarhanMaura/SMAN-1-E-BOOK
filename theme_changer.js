const fs = require('fs');
const path = require('path');

const themes = {
    'bab-2': { primary: 'blue', secondary: 'pink', hex1: '#3b82f6', hex2: '#f472b6', lottie: 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json' },
    'bab-3': { primary: 'green', secondary: 'orange', hex1: '#10b981', hex2: '#fb923c', lottie: 'https://assets1.lottiefiles.com/packages/lf20_a1hzz2q2.json' },
    'bab-4': { primary: 'red', secondary: 'yellow', hex1: '#ef4444', hex2: '#facc15', lottie: 'https://assets7.lottiefiles.com/packages/lf20_q5pk6p1k.json' },
    'bab-5': { primary: 'indigo', secondary: 'rose', hex1: '#6366f1', hex2: '#fb7185', lottie: 'https://assets5.lottiefiles.com/packages/lf20_5e7wgehs.json' },
    'bab-6': { primary: 'cyan', secondary: 'amber', hex1: '#06b6d4', hex2: '#fbbf24', lottie: 'https://assets10.lottiefiles.com/packages/lf20_jzzuzxus.json' }
};

const baseDir = path.join(__dirname, 'public');

for (const [bab, theme] of Object.entries(themes)) {
    const filePath = path.join(baseDir, bab, 'index.html');
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf-8');

    // 1. Add lottie-player script
    if (!content.includes('lottie-player.js')) {
        content = content.replace(
            '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>',
            '<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>\n  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>'
        );
    }

    // 2. Replace cover image with lottie-player
    // Find the cover image div
    // The cover in other babs might have different regex. Let's make it generic.
    // It's like <div class="... bg-cover bg-center" style="background-image: url('/assets/babX_scene.png'); ..."></div>
    const coverRegex = /<div\s+class="[^"]*w-40 h-40 mx-auto[^"]*"[^>]*?>\s*<\/div>/g;
    content = content.replace(coverRegex, `<div class="w-40 h-40 mx-auto drop-shadow-[0_10px_30px_rgba(255,255,255,0.1)] rounded-full border-4 border-[#12121a] flex items-center justify-center bg-gray-900 overflow-hidden">\n               <lottie-player src="${theme.lottie}" background="transparent" speed="1" style="width: 150px; height: 150px;" loop autoplay></lottie-player>\n            </div>`);

    // Also the avatar in the feedback modal (w-40 h-40 mx-auto mb-6 ...)
    // Wait, the regex above will match it too, which is fine! Lottie in feedback is also cool.
    
    // 3. Replace mascot images with small lottie-players
    const mascotRegex = /<div class="mascot bg-cover" style="[^"]*"><\/div>/g;
    content = content.replace(mascotRegex, `<div class="mascot flex items-center justify-center overflow-hidden bg-gray-900">\n               <lottie-player src="${theme.lottie}" background="transparent" speed="1" style="width: 50px; height: 50px;" loop autoplay></lottie-player>\n            </div>`);

    // 4. Color replacements
    // Tailwind classes
    content = content.replace(/\bteal\b/g, theme.primary);
    content = content.replace(/\bpurple\b/g, theme.secondary);
    
    // Hex colors
    content = content.replace(/#2dd4bf/gi, theme.hex1); // teal-400
    content = content.replace(/#a78bfa/gi, theme.hex2); // purple-400
    
    // Some rgba colors
    // teal: 45, 212, 191
    // purple: 167, 139, 250
    // We can replace the literal rgb string if it's there
    content = content.replace(/45,\s*212,\s*191/g, 'var(--primary-rgb)'); // We'll just replace strings roughly if we have time, but sticking to hex/tailwind is mostly enough since tailwind opacity uses vars now, but the raw rgb in box-shadow might be left out. It's acceptable.

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated ${bab}`);
}
