const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      console.log('Status:', res.statusCode, '| Content-Type:', res.headers['content-type']);
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(dest); });
      } else if (res.statusCode === 302 || res.statusCode === 301) {
        file.close();
        fs.unlink(dest, () => {});
        console.log('Redirect to:', res.headers.location);
        download(res.headers.location, dest).then(resolve).catch(reject);
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`HTTP ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

const urls = [
  ['https://assets.mixkit.co/music/135/135.mp3', 'public/assets/bgm.mp3'],
  // fallback candidates
  ['https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3', 'public/assets/bgm2.mp3'],
];

(async () => {
  for (const [url, dest] of urls) {
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✅ Saved: ${dest} (${(size/1024).toFixed(0)} KB)`);
    } catch(e) {
      console.error(`❌ Failed ${dest}: ${e.message}`);
    }
  }
})();
