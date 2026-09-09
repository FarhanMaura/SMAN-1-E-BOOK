/**
 * skor-modal.js
 * Menambahkan fitur evaluasi / komentar skor dosen dan simpan skor ke MySQL secara non-invasif.
 * Di-include di akhir setiap halaman bab.
 */

(function () {
  'use strict';

  // Ambil id_bab dari URL: /bab-1 → "BAB-1"
  const pathMatch = window.location.pathname.match(/\/bab-(\d+)/i);
  const BAB_ID    = pathMatch ? `BAB-${pathMatch[1]}` : 'BAB-1';

  // ─── CSS untuk modal komentar & simpan skor ──────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    .skor-komentar-box {
      margin: 0.5rem 0;
      padding: 0.55rem 0.85rem;
      border-radius: 14px;
      font-size: 0.75rem;
      font-weight: 700;
      text-align: center;
      max-width: 250px;
      line-height: 1.35;
      animation: popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .skor-komentar-success {
      background: #ecfdf5;
      color: #065f46;
      border: 1.5px solid #6ee7b7;
      box-shadow: 0 4px 12px rgba(16,185,129,0.15);
    }
    .skor-komentar-warning {
      background: #fffbeb;
      color: #92400e;
      border: 1.5px solid #fcd34d;
      box-shadow: 0 4px 12px rgba(245,158,11,0.15);
    }
    .skor-komentar-danger {
      background: #fff1f2;
      color: #9f1239;
      border: 1.5px solid #fda4af;
      box-shadow: 0 4px 12px rgba(244,63,94,0.15);
    }
    .skor-save-form {
      margin-top: 0.4rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      width: 100%;
      max-width: 240px;
    }
    .skor-save-form label {
      font-size: 0.68rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .skor-save-form input {
      width: 100%;
      padding: 0.45rem 0.85rem;
      border: 1.5px solid #cbd5e1;
      border-radius: 9999px;
      font-size: 0.80rem;
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
      padding: 0.45rem 1rem;
      background: linear-gradient(135deg, #0d9488, #7c3aed);
      color: white;
      font-size: 0.78rem;
      font-weight: 800;
      border: none;
      border-radius: 9999px;
      cursor: pointer;
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: opacity 0.2s, transform 0.15s;
      box-shadow: 0 4px 14px rgba(13,148,136,0.3);
    }
    .skor-save-btn:hover { opacity: 0.9; transform: scale(1.02); }
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

    /* Floating Score Result Popup */
    .skor-popup-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.25s ease-out;
    }
    .skor-popup-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 1.75rem;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      position: relative;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // ─── Fungsi ambil teks komentar berdasarkan skor ─────────────────────────
  function getScoreData(skor) {
    const num = Number(skor) || 0;
    if (num >= 80) {
      return {
        comment: "🎉 Selamat Anda berhasil! Pemahaman materi Anda sangat memuaskan.",
        badgeClass: "skor-komentar-success",
        badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
        icon: "🏆",
        grade: "SANGAT BAIK"
      };
    } else if (num >= 60) {
      return {
        comment: "👍 Kerja bagus! Anda sudah memahami sebagian besar materi, tingkatkan lagi ya.",
        badgeClass: "skor-komentar-warning",
        badgeBg: "bg-amber-50 text-amber-800 border-amber-300",
        icon: "👍",
        grade: "CUKUP BAIK"
      };
    } else {
      return {
        comment: "💪 Maaf Anda belum sempurna, belajar lagi ya! Jangan berkecil hati, ayo pelajari materinya lagi.",
        badgeClass: "skor-komentar-danger",
        badgeBg: "bg-rose-50 text-rose-800 border-rose-300",
        icon: "💪",
        grade: "PERLU BELAJAR LAGI"
      };
    }
  }

  // ─── Buat badge komentar untuk in-page overlay ───────────────────────────
  function buatKomentarBadge(skor) {
    const wrap = document.createElement('div');
    const data = getScoreData(skor);
    wrap.className = `skor-komentar-box ${data.badgeClass}`;
    wrap.innerHTML = `
      <div style="font-size:0.65rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;opacity:0.75;margin-bottom:3px;">
        💬 Komentar Dosen:
      </div>
      <div>${data.comment}</div>
    `;
    return wrap;
  }

  // ─── Pop-up Modal Hasil Selesai ──────────────────────────────────────────
  function tampilkanModalHasil(tipe, skor) {
    // Cegah duplikasi popup
    if (document.getElementById('skor-popup-modal')) return;

    const data = getScoreData(skor);
    const labelTipe = tipe === 'latihan' ? 'Latihan Formatif' : 'Ujian Kompetensi';
    const num = Number(skor) || 0;

    const backdrop = document.createElement('div');
    backdrop.id = 'skor-popup-modal';
    backdrop.className = 'skor-popup-backdrop';

    backdrop.innerHTML = `
      <div class="skor-popup-card">
        <div style="display:inline-flex;align-items:center;gap:0.4rem;padding:0.25rem 0.8rem;border-radius:9999px;font-size:0.72rem;font-weight:800;background:#f1f5f9;color:#334155;border:1px solid #e2e8f0;margin-bottom:0.75rem;">
          ${labelTipe} • ${BAB_ID}
        </div>

        <div style="font-size:3.5rem;line-height:1;margin-bottom:0.5rem;filter:drop-shadow(0 4px 6px rgba(0,0,0,0.1));">${data.icon}</div>

        <h3 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin:0 0 0.25rem 0;font-family:'Sora',sans-serif;">${labelTipe} Selesai!</h3>
        <p style="font-size:0.75rem;color:#64748b;margin:0 0 1rem 0;">Evaluasi hasil belajar Anda untuk bab ini</p>

        <div style="background:linear-gradient(135deg, #f8fafc, #f1f5f9);border:1px solid #e2e8f0;border-radius:18px;padding:1rem;margin-bottom:1rem;">
          <div style="font-size:0.68rem;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.25rem;">Skor Akhir Anda</div>
          <div style="font-size:2.8rem;font-weight:900;color:#0f172a;line-height:1.1;font-family:'Sora',sans-serif;">${num} <span style="font-size:1.2rem;color:#94a3b8;font-weight:600;">/ 100</span></div>
        </div>

        <div class="skor-komentar-box ${data.badgeClass}" style="max-width:100%;margin:0 0 1rem 0;padding:0.75rem 1rem;font-size:0.85rem;">
          <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;opacity:0.75;margin-bottom:3px;">
            💬 Evaluasi / Komentar Dosen:
          </div>
          <div>${data.comment}</div>
        </div>

        <div id="skor-popup-form-slot"></div>

        <button id="btn-test-berikutnya-popup" style="width:100%;margin-top:0.75rem;padding:0.7rem 1rem;background:linear-gradient(135deg, #0d9488, #7c3aed);color:white;font-size:0.82rem;font-weight:800;border:none;border-radius:9999px;cursor:pointer;transition:all 0.2s;box-shadow:0 4px 14px rgba(13,148,136,0.3);display:flex;align-items:center;justify-content:center;gap:0.4rem;">
          <span>🔄</span> Soal Berikutnya (Diacak)
        </button>

        <button id="btn-tutup-skor-popup" style="width:100%;margin-top:0.5rem;padding:0.65rem 1rem;background:#1e293b;color:white;font-size:0.80rem;font-weight:700;border:none;border-radius:9999px;cursor:pointer;transition:background 0.2s;">
          Tutup &amp; Lanjutkan Membaca
        </button>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Sisipkan form simpan skor ke dalam popup
    const formSlot = backdrop.querySelector('#skor-popup-form-slot');
    if (formSlot) {
      formSlot.appendChild(buatForm(tipe, () => num));
    }

    // Event listener soal berikutnya (acak)
    const btnNext = backdrop.querySelector('#btn-test-berikutnya-popup');
    if (btnNext) {
      btnNext.addEventListener('click', () => {
        backdrop.remove();
        const root = document.querySelector('[x-data]');
        const alpineData = root ? (root.__x || root._x_dataStack?.[0]) : null;
        if (alpineData && typeof alpineData.testBerikutnya === 'function') {
          alpineData.testBerikutnya(tipe);
        }
      });
    }

    // Event listener tutup
    backdrop.querySelector('#btn-tutup-skor-popup').addEventListener('click', () => {
      backdrop.remove();
    });
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) backdrop.remove();
    });
  }

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
        msg.textContent = `✅ Skor berhasil disimpan!`;

        // Buat link ke leaderboard
        const link = document.createElement('a');
        link.href  = '/leaderboard';
        link.target = '_blank';
        link.style.cssText = 'font-size:0.75rem;font-weight:700;color:#0d9488;text-decoration:none;margin-top:4px;display:inline-block;';
        link.textContent   = '🏆 Lihat Leaderboard →';
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

  // ─── Inject komentar & form ke overlay Alpine.js saat terlihat ─────────────
  function injectForms() {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('[x-show]').forEach(el => {
        const xshow = el.getAttribute('x-show') || '';
        const alreadyInjected = el.dataset.skorInjected;
        if (alreadyInjected) return;

        const root = el.closest('[x-data]') || document.querySelector('[x-data]');
        let alpineData = {};
        try {
          alpineData = root ? (root.__x || root._x_dataStack?.[0] || (window.Alpine && window.Alpine.$data ? window.Alpine.$data(root) : {})) : {};
        } catch(e) {}

        // Latihan overlay - WAJIB cek bahwa latihanSelesai benar-benar bernilai true!
        if (xshow.includes('latihanSelesai')) {
          if (!alpineData.latihanSelesai) return;
          el.dataset.skorInjected = '1';
          const getSkor = () => {
            try {
              return root ? (root.__x || root._x_dataStack?.[0] || {}).latihanScore ?? 0 : 0;
            } catch(e) { return 0; }
          };
          const skor = getSkor();

          // 1. Sisipkan badge komentar ke dalam overlay halaman jika belum ada di template
          if (!el.querySelector('.skor-komentar-box') && !el.querySelector('[x-text*="Selamat Anda berhasil"]')) {
            el.appendChild(buatKomentarBadge(skor));
          }

          // 2. Sisipkan form simpan skor ke dalam overlay halaman
          if (!el.querySelector('.skor-save-form')) {
            el.appendChild(buatForm('latihan', getSkor));
          }

          // 3. Tampilkan popup modal hasil dengan delay lembut di akhir
          setTimeout(() => {
            tampilkanModalHasil('latihan', getSkor());
          }, 400);
        }

        // Ujian overlay - WAJIB cek bahwa ujianSelesai benar-benar bernilai true!
        if (xshow.includes('ujianSelesai')) {
          if (!alpineData.ujianSelesai) return;
          el.dataset.skorInjected = '1';
          const getSkor = () => {
            try {
              return root ? (root.__x || root._x_dataStack?.[0] || {}).ujianScore ?? 0 : 0;
            } catch(e) { return 0; }
          };
          const skor = getSkor();

          // 1. Sisipkan badge komentar ke dalam overlay halaman jika belum ada di template
          if (!el.querySelector('.skor-komentar-box') && !el.querySelector('[x-text*="Selamat Anda berhasil"]')) {
            el.appendChild(buatKomentarBadge(skor));
          }

          // 2. Sisipkan form simpan skor ke dalam overlay halaman
          if (!el.querySelector('.skor-save-form')) {
            el.appendChild(buatForm('ujian', getSkor));
          }

          // 3. Tampilkan popup modal hasil dengan delay lembut di akhir
          setTimeout(() => {
            tampilkanModalHasil('ujian', getSkor());
          }, 400);
        }
      });
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }

  // Tunggu Alpine.js siap
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(injectForms, 500);
  });

})();
