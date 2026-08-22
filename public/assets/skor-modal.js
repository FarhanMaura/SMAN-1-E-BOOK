/**
 * skor-modal.js
 * Menambahkan fitur simpan skor ke MySQL secara non-invasif.
 * Di-include di akhir setiap halaman bab.
 *
 * Cara kerja:
 * - Mendeteksi overlay "Latihan Selesai" dan "Ujian Selesai" dari Alpine.js
 * - Menyisipkan form kecil (input nama + tombol kirim) ke dalamnya
 * - Mengirim skor ke POST /api/skor
 */

(function () {
  'use strict';

  // Ambil id_bab dari URL: /bab-1 → "BAB-1"
  const pathMatch = window.location.pathname.match(/\/bab-(\d+)/i);
  const BAB_ID    = pathMatch ? `BAB-${pathMatch[1]}` : null;

  if (!BAB_ID) return; // bukan halaman bab, skip

  // ─── CSS untuk modal simpan skor ──────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .skor-save-form {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      max-width: 240px;
    }
    .skor-save-form label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .skor-save-form input {
      width: 100%;
      padding: 0.5rem 0.9rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      text-align: center;
      outline: none;
      transition: border-color 0.2s;
      background: white;
      color: #0f172a;
    }
    .skor-save-form input:focus { border-color: #0d9488; }
    .skor-save-btn {
      width: 100%;
      padding: 0.5rem 1rem;
      background: linear-gradient(135deg, #0d9488, #7c3aed);
      color: white;
      font-size: 0.82rem;
      font-weight: 800;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(13,148,136,0.3);
    }
    .skor-save-btn:hover { opacity: 0.9; transform: scale(1.03); }
    .skor-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    .skor-saved-msg {
      font-size: 0.78rem;
      font-weight: 700;
      color: #059669;
      animation: fadeInUp 0.3s ease;
    }
    .skor-err-msg {
      font-size: 0.75rem;
      color: #dc2626;
      font-weight: 600;
    }
    @keyframes fadeInUp {
      from { opacity:0; transform:translateY(6px); }
      to   { opacity:1; transform:translateY(0); }
    }
  `;
  document.head.appendChild(style);

  // ─── Fungsi kirim skor ke API ──────────────────────────────────────────────
  async function kirimSkor(nama, tipe, skor) {
    const res  = await fetch('/api/skor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_siswa: nama, id_bab: BAB_ID, tipe, skor })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Gagal menyimpan skor.');
    return json;
  }

  // ─── Buat form simpan skor ─────────────────────────────────────────────────
  function buatForm(tipe, getSkor) {
    const wrap = document.createElement('div');
    wrap.className = 'skor-save-form';
    wrap.innerHTML = `
      <label>💾 Simpan skormu ke papan skor</label>
      <input type="text" placeholder="Masukkan namamu..." maxlength="50" class="skor-input-${tipe}" autocomplete="off" />
      <button class="skor-save-btn skor-btn-${tipe}">🏆 Simpan Skor</button>
      <div class="skor-msg-${tipe}"></div>
    `;

    const input = wrap.querySelector(`.skor-input-${tipe}`);
    const btn   = wrap.querySelector(`.skor-btn-${tipe}`);
    const msg   = wrap.querySelector(`.skor-msg-${tipe}`);

    btn.addEventListener('click', async () => {
      const nama = input.value.trim();
      if (!nama) { msg.className = 'skor-err-msg'; msg.textContent = '⚠️ Masukkan namamu dulu!'; return; }

      btn.disabled     = true;
      btn.textContent  = '⏳ Menyimpan...';
      msg.textContent  = '';

      try {
        await kirimSkor(nama, tipe, getSkor());
        btn.style.display    = 'none';
        input.style.display  = 'none';
        wrap.querySelector('label').style.display = 'none';
        msg.className   = 'skor-saved-msg';
        msg.textContent = `✅ Skor berhasil disimpan! Lihat leaderboard →`;

        // Buat link ke leaderboard
        const link = document.createElement('a');
        link.href  = '/leaderboard';
        link.target = '_blank';
        link.style.cssText = 'font-size:0.75rem;font-weight:700;color:#0d9488;text-decoration:none;';
        link.textContent   = '🏆 Lihat Leaderboard';
        wrap.appendChild(link);

      } catch (err) {
        btn.disabled    = false;
        btn.textContent = '🏆 Simpan Skor';
        msg.className   = 'skor-err-msg';
        msg.textContent = `❌ ${err.message}`;
      }
    });

    return wrap;
  }

  // ─── Inject form ke overlay Alpine.js saat terlihat ───────────────────────
  function injectForms() {
    // Cari semua overlay "Selesai" di halaman
    // Bab-1 pakai Alpine scope — kita pantau via MutationObserver

    const observer = new MutationObserver(() => {
      // Cari div yang berisi teks "Latihan Selesai" atau "Ujian Selesai"
      document.querySelectorAll('[x-show]').forEach(el => {
        const xshow = el.getAttribute('x-show') || '';
        const alreadyInjected = el.dataset.skorInjected;
        if (alreadyInjected) return;

        // Latihan overlay
        if (xshow.includes('latihanSelesai')) {
          el.dataset.skorInjected = '1';
          el.appendChild(buatForm('latihan', () => {
            // Cari elemen Alpine yang punya latihanScore
            const root = el.closest('[x-data]') || document.querySelector('[x-data]');
            try {
              return root ? (root.__x || root._x_dataStack?.[0] || {}).latihanScore ?? 0 : 0;
            } catch(e) { return 0; }
          }));
        }

        // Ujian overlay
        if (xshow.includes('ujianSelesai')) {
          el.dataset.skorInjected = '1';
          el.appendChild(buatForm('ujian', () => {
            const root = el.closest('[x-data]') || document.querySelector('[x-data]');
            try {
              return root ? (root.__x || root._x_dataStack?.[0] || {}).ujianScore ?? 0 : 0;
            } catch(e) { return 0; }
          }));
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }

  // Tunggu Alpine.js siap
  document.addEventListener('DOMContentLoaded', () => {
    // Delay sedikit biar Alpine init dulu
    setTimeout(injectForms, 500);
  });

})();
