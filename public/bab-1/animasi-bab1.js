// ============================================================
// ANIMASI ROBOT BAB 1 - VERSION 3 (KARTUN 3D STYLE)
// Gaya Pixar/Disney - bulat, menggemaskan, ekspresif
// ============================================================

class AnimasiRobotBab1 {
    constructor(containerId) {
        this.containerId = containerId;
        this.posisiKertas = containerId.includes('kiri') ? 'kiri' : (containerId.includes('kanan') ? 'kanan' : 'tengah');

        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.warn('Container tidak ditemukan:', containerId);
            return;
        }

        // Setup Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.clientWidth || 300;
        this.canvas.height = this.container.clientHeight || 160;
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.display = 'block';
        this.container.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.halamanAktif = 1;
        this.waktu = 0;
        this.animasiId = null;
        this.isRunning = false;
        this.lastFrameTime = 0;

        // Scene definitions
        this.scenes = {
            1: { nama: 'Robot Muncul', durasi: 5 },
            2: { nama: 'Robot Melambai', durasi: 5 },
            3: { nama: 'Robot Berpikir', durasi: 5 },
            4: { nama: 'Dekomposisi', durasi: 5 },
            5: { nama: 'Pengenalan Pola', durasi: 5 },
            6: { nama: 'Abstraksi', durasi: 5 },
            7: { nama: 'Algoritma', durasi: 5 },
            8: { nama: 'Integrasi AI', durasi: 5 },
            9: { nama: 'Peta Konsep', durasi: 5 },
            10: { nama: 'Robot Semangat', durasi: 5 },
            11: { nama: 'Robot Fokus', durasi: 5 },
            12: { nama: 'Robot Ujian', durasi: 5 },
            13: { nama: 'Robot Menang', durasi: 5 },
            14: { nama: 'Robot Selesai', durasi: 5 },
            15: { nama: 'Robot Pamit', durasi: 5 },
            16: { nama: 'Tamat', durasi: 5 },
            17: { nama: 'Luar Kertas', durasi: 10 }
        };

        // State robot - gaya kartun 3D
        this.robot = {
            x: 150,
            y: 100,
            targetX: 150,
            targetY: 100,

            // Ukuran
            ukuran: 1,

            // Gerakan halus
            headAngle: 0,
            headBob: 0,
            bodyBob: 0,
            bodySquish: 1, // untuk efek squash & stretch

            // Mata besar ekspresif
            mataBesar: 1,
            mataBlink: 0,
            mataArahX: 0,
            mataArahY: 0,
            mataBersinar: 0,

            // Mulut
            mulutBuka: 0,
            mulutShape: 'normal',
            mulutLebar: 1,

            // Tangan mungil
            tanganKiri: 0,
            tanganKanan: 0,
            tanganKiriAngle: 0,
            tanganKananAngle: 0,

            // Kaki mungil
            kakiKiri: 0,
            kakiKanan: 0,

            // Ekspresi
            ekspresi: 'normal',
            arah: 1,
            progress: 0,

            // Glow & efek
            glowIntensity: 0.3,
            blush: 0, // efek pipi merah

            // Partikel
            particles: []
        };

        this.init();
    }

    init() {
        const resizeObserver = new ResizeObserver(() => {
            this.canvas.width = this.container.clientWidth || 300;
            this.canvas.height = this.container.clientHeight || 160;
        });
        resizeObserver.observe(this.container);

        window.addEventListener('resize', () => {
            this.canvas.width = this.container.clientWidth || 300;
            this.canvas.height = this.container.clientHeight || 160;
        });

        this.start();
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.waktu = 0;
        this.lastFrameTime = performance.now();
        this.loop();
    }

    stop() {
        this.isRunning = false;
        if (this.animasiId) {
            cancelAnimationFrame(this.animasiId);
            this.animasiId = null;
        }
    }

    setHalaman(halaman) {
        if ((halaman >= 1 && halaman <= 16) || halaman === 17) {
            this.halamanAktif = halaman;
            this.waktu = 0;
            this.robot.progress = 0;
        }
    }

    loop() {
        if (!this.isRunning) return;

        const now = performance.now();
        const delta = Math.min((now - this.lastFrameTime) / 1000, 0.05);
        this.lastFrameTime = now;

        this.waktu += delta;
        this.robot.progress = Math.min(this.waktu / this.scenes[this.halamanAktif].durasi, 1);

        this.updateRobot(this.halamanAktif, this.robot.progress, delta);
        this.draw();

        this.animasiId = requestAnimationFrame(() => this.loop());
    }

    updateRobot(halaman, progress, delta) {
        const r = this.robot;
        const t = this.waktu;

        // Reset
        r.arah = 1;
        r.ekspresi = 'normal';
        r.mulutShape = 'normal';
        r.mulutBuka = 0.3;
        r.blush = 0;
        r.bodySquish = 1;
        r.glowIntensity = 0.3;

        // Gerakan dasar - lebih smooth dengan gelombang komposit (mengurangi kesan kaku)
        const breathe = Math.sin(t * 1.5) + Math.sin(t * 0.5) * 0.5; // gelombang bertumpuk
        r.bodyBob = breathe * 1.5;
        r.headBob = Math.sin(t * 1.5 - 0.5) * 1.8; // overlap action, kepala terlambat
        
        // Secondary action untuk lengan (mengayun natural)
        const armIdle = Math.sin(t * 1.5 - 1.0) * 0.1;

        // Kedip mata alami (setiap 2.5-4 detik)
        const blinkCycle = t % 3.8;
        if (blinkCycle > 3.5 && blinkCycle < 3.65) {
            r.mataBesar = 0.1;
        } else {
            r.mataBesar = 1 + Math.sin(t * 1.8) * 0.03;
        }

        // Mata bersinar
        r.mataBersinar = 0.3 + Math.sin(t * 2.5) * 0.15;

        // Scene-specific
        switch (halaman) {
            case 1: // Muncul - squash & stretch
                r.ukuran = 0.3 + progress * 0.7;
                r.x = 40 + progress * 110;
                r.y = 100 - Math.sin(progress * Math.PI) * 15;
                r.bodySquish = 1 + Math.sin(progress * Math.PI * 2) * 0.05;
                r.ekspresi = 'senang';
                r.mulutShape = 'senang';
                r.mulutBuka = 0.5;
                r.blush = 0.3;
                r.glowIntensity = 0.3 + progress * 0.4;
                break;

            case 2: // Melambai
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.2) * 2;
                r.ekspresi = 'senang';
                r.mulutShape = 'senang';
                r.mulutBuka = 0.5 + Math.sin(t * 2.5) * 0.15;
                r.tanganKananAngle = Math.sin(t * 4) * 0.8 + 0.5;
                r.tanganKiriAngle = Math.sin(t * 1.5) * 0.1;
                r.blush = 0.4;
                r.glowIntensity = 0.5;
                break;

            case 3: // Berpikir
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.3) * 2;
                r.ekspresi = 'bingung';
                r.mulutShape = 'bingung';
                r.mulutBuka = 0.2;
                r.headAngle = Math.sin(t * 0.5) * 0.08;
                r.tanganKananAngle = -0.3 + Math.sin(t * 1.5) * 0.05;
                r.tanganKiriAngle = Math.sin(t * 2) * 0.15;
                r.mataArahX = Math.sin(t * 0.7) * 0.2;
                r.mataArahY = Math.sin(t * 0.5 + 0.3) * 0.1;
                r.glowIntensity = 0.4;
                break;

            case 4: // Dekomposisi
                r.ukuran = 1;
                r.x = 130 + Math.sin(t * 1.8) * 12;
                r.y = 100 + Math.sin(t * 1.2) * 3;
                r.ekspresi = 'fokus';
                r.mulutShape = 'fokus';
                r.mulutBuka = 0.15;
                r.tanganKiriAngle = Math.sin(t * 2.5) * 0.4 + 0.2;
                r.tanganKananAngle = Math.sin(t * 2.5 + 0.5) * 0.4 - 0.2;
                r.bodySquish = 1 + Math.sin(t * 2) * 0.03;
                r.glowIntensity = 0.5;
                break;

            case 5: // Pengenalan Pola
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.3) * 2;
                r.ekspresi = 'senang';
                r.mulutShape = 'senang';
                r.mulutBuka = 0.5 + Math.sin(t * 2.5) * 0.1;
                r.tanganKananAngle = Math.sin(t * 2) * 0.15 + 0.15;
                r.tanganKiriAngle = Math.sin(t * 2 + 0.5) * 0.1;
                r.mataBesar = 1.15 + Math.sin(t * 2.5) * 0.05;
                r.mataBersinar = 0.6 + Math.sin(t * 3) * 0.15;
                r.blush = 0.3;
                r.glowIntensity = 0.6;
                break;

            case 6: // Abstraksi
                r.ukuran = 1;
                r.x = 140 + Math.sin(t * 1.5) * 8;
                r.y = 100 + Math.sin(t * 1.8) * 2;
                r.ekspresi = 'fokus';
                r.mulutShape = 'fokus';
                r.mulutBuka = 0.12;
                r.tanganKiriAngle = Math.sin(t * 2) * 0.2;
                r.tanganKananAngle = Math.sin(t * 2 + 0.5) * 0.2;
                r.glowIntensity = 0.4;
                break;

            case 7: // Algoritma
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.4) * 2;
                r.ekspresi = 'fokus';
                r.mulutShape = 'fokus';
                r.mulutBuka = 0.15;
                r.tanganKananAngle = Math.sin(t * 3.5) * 0.3 + 0.2;
                r.tanganKiriAngle = Math.sin(t * 2) * 0.1;
                r.headAngle = Math.sin(t * 0.8) * 0.03;
                r.glowIntensity = 0.45;
                break;

            case 8: // Integrasi AI
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 2) * 2;
                r.ekspresi = 'senang';
                r.mulutShape = 'senang';
                r.mulutBuka = 0.4 + Math.sin(t * 2.5) * 0.1;
                r.tanganKiriAngle = Math.sin(t * 2.5) * 0.15;
                r.tanganKananAngle = Math.sin(t * 2.5 + 0.5) * 0.15;
                r.bodySquish = 1 + Math.sin(t * 2.5) * 0.03;
                r.glowIntensity = 0.7 + Math.sin(t * 2.5) * 0.15;
                r.mataBesar = 1.1 + Math.sin(t * 2) * 0.05;
                r.blush = 0.3;
                break;

            case 9: // Peta Konsep
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.2) * 2;
                r.ekspresi = 'fokus';
                r.mulutShape = 'fokus';
                r.mulutBuka = 0.1;
                r.tanganKiriAngle = Math.sin(t * 1.5) * 0.08;
                r.tanganKananAngle = Math.sin(t * 1.5 + 0.5) * 0.08;
                r.headAngle = Math.sin(t * 0.6) * 0.02;
                r.glowIntensity = 0.35;
                break;

            case 10: // Semangat - melompat
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 - Math.sin(t * 4) * 22;
                r.ekspresi = 'senang';
                r.mulutShape = 'tertawa';
                r.mulutBuka = 0.8 + Math.sin(t * 3) * 0.1;
                r.tanganKiriAngle = Math.sin(t * 4) * 0.5 + 0.4;
                r.tanganKananAngle = Math.sin(t * 4 + 0.5) * 0.5 - 0.4;
                r.kakiKiri = Math.sin(t * 4) * 0.3;
                r.kakiKanan = Math.sin(t * 4 + 0.5) * 0.3;
                r.bodySquish = 1 + Math.sin(t * 4) * 0.05;
                r.mataBesar = 1.2 + Math.sin(t * 4.5) * 0.05;
                r.mataBersinar = 0.7 + Math.sin(t * 3) * 0.15;
                r.blush = 0.5;
                r.glowIntensity = 0.8 + Math.sin(t * 3) * 0.15;
                break;

            case 11: // Fokus
                r.ukuran = 1;
                r.x = 150;
                r.y = 100;
                r.ekspresi = 'fokus';
                r.mulutShape = 'fokus';
                r.mulutBuka = 0.08;
                r.tanganKiriAngle = Math.sin(t * 1) * 0.05;
                r.tanganKananAngle = Math.sin(t * 1 + 0.5) * 0.05;
                r.mataArahX = Math.sin(t * 0.4) * 0.15;
                r.mataArahY = Math.sin(t * 0.3 + 0.2) * 0.08;
                r.mataBesar = 0.85;
                r.glowIntensity = 0.25;
                break;

            case 12: // Ujian
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.8) * 1.5;
                r.ekspresi = 'fokus';
                r.mulutShape = 'fokus';
                r.mulutBuka = 0.12;
                r.tanganKiriAngle = Math.sin(t * 2) * 0.08;
                r.tanganKananAngle = Math.sin(t * 2 + 0.3) * 0.08;
                r.bodySquish = 1 + Math.sin(t * 1.5) * 0.02;
                r.glowIntensity = 0.35;
                break;

            case 13: // Menang - lompat tinggi
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 - Math.sin(t * 5) * 20;
                r.ekspresi = 'senang';
                r.mulutShape = 'tertawa';
                r.mulutBuka = 0.9 + Math.sin(t * 4) * 0.05;
                r.tanganKiriAngle = Math.sin(t * 5) * 0.6 + 0.5;
                r.tanganKananAngle = Math.sin(t * 5 + 0.7) * 0.6 - 0.5;
                r.kakiKiri = Math.sin(t * 5) * 0.4;
                r.kakiKanan = Math.sin(t * 5 + 0.7) * 0.4;
                r.bodySquish = 1 + Math.sin(t * 5) * 0.06;
                r.mataBesar = 1.3 + Math.sin(t * 5) * 0.05;
                r.mataBersinar = 0.8 + Math.sin(t * 3) * 0.1;
                r.blush = 0.6;
                r.glowIntensity = 1.0 + Math.sin(t * 3) * 0.15;
                break;

            case 14: // Selesai
                r.ukuran = 1;
                r.x = 150;
                r.y = 100 + Math.sin(t * 1.2) * 2;
                r.ekspresi = 'senang';
                r.mulutShape = 'senang';
                r.mulutBuka = 0.4 + Math.sin(t * 1.5) * 0.08;
                r.tanganKiriAngle = Math.sin(t * 1.2) * 0.08;
                r.tanganKananAngle = Math.sin(t * 1.2 + 0.5) * 0.08;
                r.bodySquish = 1 + Math.sin(t * 0.8) * 0.02;
                r.blush = 0.3;
                r.glowIntensity = 0.5;
                break;

            case 15: // Pamit
                r.ukuran = 1;
                r.x = 150 - progress * 80;
                r.y = 100 + Math.sin(t * 2) * 2;
                r.ekspresi = 'normal';
                r.mulutShape = 'normal';
                r.mulutBuka = 0.2;
                r.tanganKananAngle = Math.sin(t * 2.5) * 0.2 + 0.2;
                r.tanganKiriAngle = Math.sin(t * 2.5) * 0.15;
                r.kakiKiri = Math.sin(t * 3) * 0.25;
                r.kakiKanan = Math.sin(t * 3 + 0.5) * 0.25;
                r.glowIntensity = 0.3 + Math.sin(t * 2) * 0.05;
                break;

            case 16: // Tamat
                r.ukuran = 1;
                r.x = 130 + Math.sin(t * 1.5) * 12;
                r.y = 100 + Math.sin(t * 1.8) * 3;
                r.ekspresi = 'senang';
                r.mulutShape = 'senang';
                r.mulutBuka = 0.6 + Math.sin(t * 2) * 0.1;
                r.tanganKiriAngle = Math.sin(t * 2 - 0.5) * 0.2; // ditambah overlapping action
                r.tanganKananAngle = Math.sin(t * 2) * 0.2;
                r.bodySquish = 1 + Math.sin(t * 1.5) * 0.03;
                r.mataBesar = 1.1 + Math.sin(t * 2) * 0.05;
                r.mataBersinar = 0.5 + Math.sin(t * 2) * 0.1;
                r.blush = 0.4;
                r.glowIntensity = 0.7 + Math.sin(t * 2) * 0.1;
                break;

            case 17: // Luar Kertas - melayang santai, kadang ngomong, dadah
                r.ukuran = 1.6; // Dibesarkan sesuai permintaan
                // Global clock (sinkronisasi untuk kedua robot)
                const globalT = Date.now() / 1000;
                const siklus = globalT % 20;

                // Base floating
                const baseY = 100 + Math.sin(t * 1.2) * 8;
                
                if (siklus < 5) {
                    // 0-5s: KIRI ngomong, KANAN mendengarkan
                    if (this.posisiKertas === 'kiri') {
                        r.x = 180 + Math.sin(t * 0.8) * 3; // maju dikit
                        r.y = baseY;
                        r.mataArahX = 1; // nengok ke kanan (ke buku/robot kanan)
                        r.ekspresi = 'fokus';
                        r.mulutShape = 'normal';
                        r.mulutBuka = 0.2 + Math.abs(Math.sin(t * 15)) * 0.5; // ngomong cepat
                        r.mulutLebar = 0.8 + Math.abs(Math.cos(t * 10)) * 0.4;
                        r.headAngle = Math.sin(t * 2) * 0.05;
                        r.tanganKananAngle = Math.sin(t * 5) * 0.4 + 0.3; // gestur menjelaskan
                        r.tanganKiriAngle = armIdle;
                        r.kakiKiri = 0; r.kakiKanan = 0;
                    } else if (this.posisiKertas === 'kanan') {
                        r.x = 120 + Math.sin(t * 0.8) * 2;
                        r.y = baseY;
                        r.mataArahX = -1; // nengok ke kiri
                        r.ekspresi = 'normal';
                        r.mulutShape = 'senang';
                        r.mulutBuka = 0.1;
                        r.headBob = Math.sin(t * 2.5) * 2; // mengangguk paham
                        r.tanganKananAngle = armIdle;
                        r.tanganKiriAngle = armIdle;
                        r.kakiKiri = 0; r.kakiKanan = 0;
                    }
                } else if (siklus < 10) {
                    // 5-10s: KANAN ngomong, KIRI mendengarkan
                    if (this.posisiKertas === 'kanan') {
                        r.x = 120 + Math.sin(t * 0.8) * 3;
                        r.y = baseY;
                        r.mataArahX = -1;
                        r.ekspresi = 'fokus';
                        r.mulutShape = 'normal';
                        r.mulutBuka = 0.2 + Math.abs(Math.sin(t * 15)) * 0.5;
                        r.mulutLebar = 0.8 + Math.abs(Math.cos(t * 10)) * 0.4;
                        r.headAngle = Math.sin(t * 2) * 0.05;
                        r.tanganKiriAngle = Math.sin(t * 5) * 0.4 + 0.3;
                        r.tanganKananAngle = armIdle;
                        r.kakiKiri = 0; r.kakiKanan = 0;
                    } else if (this.posisiKertas === 'kiri') {
                        r.x = 180 + Math.sin(t * 0.8) * 2;
                        r.y = baseY;
                        r.mataArahX = 1;
                        r.ekspresi = 'normal';
                        r.mulutShape = 'senang';
                        r.mulutBuka = 0.1;
                        r.headBob = Math.sin(t * 2.5) * 2; // mengangguk paham
                        r.tanganKananAngle = armIdle;
                        r.tanganKiriAngle = armIdle;
                        r.kakiKiri = 0; r.kakiKanan = 0;
                    }
                } else if (siklus < 15) {
                    // 10-15s: Keduanya jalan-jalan melihat-lihat buku
                    const jalanPhase = (siklus - 10) / 5; // 0 to 1
                    // x bergerak bolak balik (pacing)
                    r.x = 150 + Math.sin(jalanPhase * Math.PI * 2) * 30;
                    r.y = baseY - Math.abs(Math.sin(t * 10)) * 4; // efek memantul saat jalan
                    
                    r.kakiKiri = Math.sin(t * 10) * 0.5;
                    r.kakiKanan = -Math.sin(t * 10) * 0.5;
                    
                    r.tanganKiriAngle = Math.sin(t * 10) * 0.3;
                    r.tanganKananAngle = -Math.sin(t * 10) * 0.3;
                    
                    if (this.posisiKertas === 'kiri') {
                        r.mataArahX = 1; // liat ke kanan (buku)
                    } else if (this.posisiKertas === 'kanan') {
                        r.mataArahX = -1; // liat ke kiri (buku)
                    }
                    r.ekspresi = 'bingung'; // seolah-olah membaca/menganalisa materi
                    r.mulutShape = 'normal';
                    r.mulutBuka = 0;
                } else {
                    // 15-20s: Keduanya menatap depan, tersenyum, melambaikan tangan ke user
                    r.x = 150 + Math.sin(t * 0.8) * 5;
                    r.y = baseY;
                    r.kakiKiri = 0; r.kakiKanan = 0;
                    
                    r.mataArahX = 0;
                    r.ekspresi = 'senang';
                    r.mulutShape = 'senang';
                    r.mulutBuka = 0.6;
                    r.blush = 0.5;
                    
                    // Dadah riang
                    if (this.posisiKertas === 'kiri') {
                        r.tanganKananAngle = Math.sin(t * 8) * 0.8 + 0.5;
                        r.tanganKiriAngle = armIdle;
                    } else if (this.posisiKertas === 'kanan') {
                        r.tanganKiriAngle = Math.sin(t * 8) * 0.8 + 0.5;
                        r.tanganKananAngle = armIdle;
                    }
                }
                r.glowIntensity = 0.4 + Math.sin(t * 1.2) * 0.1;
                break;
        }

        // Update partikel
        this.updateParticles(delta);
    }

    updateParticles(delta) {
        const r = this.robot;
        const halaman = this.halamanAktif;

        // Tambah partikel untuk scene tertentu
        if ([10, 13, 16].includes(halaman)) {
            if (Math.random() < 0.3) {
                r.particles.push({
                    x: 50 + Math.random() * 200,
                    y: -10,
                    size: 2 + Math.random() * 4,
                    speed: 30 + Math.random() * 40,
                    angle: Math.PI / 2 + (Math.random() - 0.5) * 0.5,
                    life: 1,
                    decay: 0.3 + Math.random() * 0.4,
                    color: ['#fcd34d', '#a78bfa', '#2dd4bf', '#f472b6', '#60a5fa'][Math.floor(Math.random() * 5)]
                });
            }
        }

        // Update partikel
        r.particles.forEach(p => {
            p.x += Math.cos(p.angle) * p.speed * delta;
            p.y += Math.sin(p.angle) * p.speed * delta;
            p.life -= p.decay * delta;
        });
        r.particles = r.particles.filter(p => p.life > 0);
    }

    draw() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const r = this.robot;

        ctx.clearRect(0, 0, w, h);

        this.drawBackground(ctx, w, h, r);
        this.drawParticles(ctx, w, h, r);
        this.drawRobot(ctx, r.x, r.y, r.ukuran, r);
        this.drawSceneEffects(ctx, w, h, this.halamanAktif, r.progress);

        // Label scene
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.font = '7px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Scene ${this.halamanAktif}`, w / 2, h - 4);
    }

    drawBackground(ctx, w, h, r) {
        // Soft gradient background
        const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        grad.addColorStop(0, `rgba(167, 139, 250, ${0.02 + r.glowIntensity * 0.02})`);
        grad.addColorStop(0.5, `rgba(45, 212, 191, ${0.01 + r.glowIntensity * 0.01})`);
        grad.addColorStop(1, 'rgba(18, 18, 26, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Subtle grid
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.03)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < w; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        for (let y = 0; y < h; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }

        // Ground with soft shadow
        const groundY = h - 22;
        const grad2 = ctx.createLinearGradient(0, groundY, 0, h);
        grad2.addColorStop(0, `rgba(167, 139, 250, ${0.04 + r.glowIntensity * 0.02})`);
        grad2.addColorStop(1, 'rgba(167, 139, 250, 0)');
        ctx.fillStyle = grad2;
        ctx.fillRect(0, groundY, w, h - groundY);

        // Ground line
        ctx.shadowColor = `rgba(167, 139, 250, ${0.03 + r.glowIntensity * 0.02})`;
        ctx.shadowBlur = 8;
        ctx.strokeStyle = `rgba(167, 139, 250, ${0.06 + r.glowIntensity * 0.03})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, groundY);
        ctx.lineTo(w, groundY);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Shadow di bawah robot
        const shadowSize = 30 + r.ukuran * 20;
        const shadowGrad = ctx.createRadialGradient(r.x, groundY + 2, 0, r.x, groundY + 2, shadowSize);
        shadowGrad.addColorStop(0, `rgba(0,0,0,${0.2 + r.glowIntensity * 0.05})`);
        shadowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = shadowGrad;
        ctx.beginPath();
        ctx.ellipse(r.x, groundY + 2, shadowSize, shadowSize * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawParticles(ctx, w, h, r) {
        r.particles.forEach(p => {
            const alpha = p.life * 0.6;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        ctx.globalAlpha = 1;
    }

    drawRobot(ctx, x, y, size, state) {
        const s = size * 30;
        const arah = state.arah || 1;
        const t = this.waktu;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(arah, 1);

        // Squash & stretch
        const squish = state.bodySquish || 1;
        ctx.scale(1 / Math.sqrt(squish), Math.sqrt(squish));

        // ============================================================
        // BADAN - bulat gemuk (gaya chibi)
        // ============================================================
        const bodyR = s * 0.45;
        const bodyY = s * 0.05 + state.bodyBob * 0.5;

        // Shadow badan
        ctx.shadowColor = `rgba(45, 212, 191, ${0.1 + state.glowIntensity * 0.05})`;
        ctx.shadowBlur = 20 + state.glowIntensity * 10;

        // Badan - gradient 3D
        const grad = ctx.createRadialGradient(
            -bodyR * 0.2, bodyY - bodyR * 0.2, 0,
            0, bodyY, bodyR
        );
        grad.addColorStop(0, '#5eead4');
        grad.addColorStop(0.4, '#2dd4bf');
        grad.addColorStop(0.8, '#14b8a6');
        grad.addColorStop(1, '#0d9488');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, bodyY, bodyR, 0, Math.PI * 2);
        ctx.fill();

        // Detail badan - tombol bulat mengkilap
        ctx.shadowBlur = 0;
        const buttonColors = ['#fcd34d', '#f472b6', '#60a5fa'];
        [-0.25, 0, 0.25].forEach((pos, i) => {
            const bx = Math.sin(pos * 1.5) * bodyR * 0.4;
            const by = bodyY + pos * bodyR * 0.5;

            // Tombol
            const gradBtn = ctx.createRadialGradient(
                bx - 1.5, by - 1.5, 0,
                bx, by, 4
            );
            gradBtn.addColorStop(0, '#ffffff');
            gradBtn.addColorStop(0.3, buttonColors[i]);
            gradBtn.addColorStop(1, buttonColors[i]);
            ctx.fillStyle = gradBtn;
            ctx.shadowColor = buttonColors[i];
            ctx.shadowBlur = 3 + Math.sin(t * 2 + i) * 1;
            ctx.beginPath();
            ctx.arc(bx, by, 3 + Math.sin(t * 2 + i) * 0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        });

        // ============================================================
        // KEPALA - bulat besar (gaya chibi)
        // ============================================================
        const headR = s * 0.42;
        const headY = bodyY - bodyR * 0.7 + state.headBob * 0.5;

        ctx.save();
        ctx.translate(0, headY - headR * 0.1);
        ctx.rotate(state.headAngle);

        // Shadow kepala
        ctx.shadowColor = `rgba(167, 139, 250, ${0.1 + state.glowIntensity * 0.05})`;
        ctx.shadowBlur = 15 + state.glowIntensity * 8;

        // Kepala - gradient 3D
        const gradHead = ctx.createRadialGradient(
            -headR * 0.25, -headR * 0.25, 0,
            0, 0, headR
        );
        gradHead.addColorStop(0, '#ddd6fe');
        gradHead.addColorStop(0.3, '#c4b5fd');
        gradHead.addColorStop(0.7, '#a78bfa');
        gradHead.addColorStop(1, '#7c3aed');
        ctx.fillStyle = gradHead;
        ctx.beginPath();
        ctx.arc(0, headR * 0.1, headR, 0, Math.PI * 2);
        ctx.fill();

        // Highlight kepala (cahaya)
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.ellipse(-headR * 0.2, -headR * 0.15, headR * 0.4, headR * 0.25, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // ============================================================
        // ANTENA - dengan bola berkilau
        // ============================================================
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -headR * 0.7);
        ctx.quadraticCurveTo(5, -headR * 1.1, 0, -headR * 1.3);
        ctx.stroke();

        // Bola antena - berkilau
        const glowPulse = 0.5 + Math.sin(t * 2.5) * 0.5;
        const gradAnt = ctx.createRadialGradient(
            -2, -headR * 1.3 - 2, 0,
            0, -headR * 1.3, 5 + glowPulse * 2
        );
        gradAnt.addColorStop(0, '#ffffff');
        gradAnt.addColorStop(0.3, '#fcd34d');
        gradAnt.addColorStop(1, '#f59e0b');
        ctx.fillStyle = gradAnt;
        ctx.shadowColor = `rgba(252, 211, 77, ${0.3 + glowPulse * 0.3})`;
        ctx.shadowBlur = 12 + glowPulse * 10;
        ctx.beginPath();
        ctx.arc(0, -headR * 1.3, 4 + glowPulse * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // ============================================================
        // MATA BESAR EKSPRESIF (gaya Pixar)
        // ============================================================
        const mataSize = 8 * state.mataBesar;
        const mataY = headR * 0.1;
        const mataSpacing = mataSize * 0.9;
        const mataOffX = state.mataArahX * 3;
        const mataOffY = state.mataArahY * 2;

        // Putih mata (besar)
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255,255,255,0.1)';
        ctx.shadowBlur = 5;

        // Mata kiri
        ctx.beginPath();
        ctx.ellipse(-mataSpacing + mataOffX * 0.3, mataY + mataOffY * 0.3, mataSize, mataSize * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mata kanan
        ctx.beginPath();
        ctx.ellipse(mataSpacing + mataOffX * 0.3, mataY + mataOffY * 0.3, mataSize, mataSize * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        // Iris (besar)
        const irisSize = mataSize * 0.55;
        const irisColor = '#4f46e5';

        // Iris kiri
        const gradIris = ctx.createRadialGradient(
            -mataSpacing + mataOffX - irisSize * 0.2, mataY + mataOffY - irisSize * 0.2, 0,
            -mataSpacing + mataOffX, mataY + mataOffY, irisSize
        );
        gradIris.addColorStop(0, '#818cf8');
        gradIris.addColorStop(0.5, '#4f46e5');
        gradIris.addColorStop(1, '#3730a3');
        ctx.fillStyle = gradIris;
        ctx.beginPath();
        ctx.arc(-mataSpacing + mataOffX, mataY + mataOffY, irisSize, 0, Math.PI * 2);
        ctx.fill();

        // Iris kanan
        ctx.beginPath();
        ctx.arc(mataSpacing + mataOffX, mataY + mataOffY, irisSize, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        const pupilSize = irisSize * 0.5;
        ctx.fillStyle = '#0f0f1a';
        ctx.beginPath();
        ctx.arc(-mataSpacing + mataOffX + pupilSize * 0.3, mataY + mataOffY + pupilSize * 0.2, pupilSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mataSpacing + mataOffX + pupilSize * 0.3, mataY + mataOffY + pupilSize * 0.2, pupilSize, 0, Math.PI * 2);
        ctx.fill();

        // Highlight mata (cahaya - bikin hidup)
        const highlightSize = pupilSize * 0.35;
        ctx.fillStyle = `rgba(255,255,255,${0.6 + state.mataBersinar * 0.2})`;
        ctx.beginPath();
        ctx.arc(-mataSpacing + mataOffX - pupilSize * 0.3, mataY + mataOffY - pupilSize * 0.3, highlightSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mataSpacing + mataOffX - pupilSize * 0.3, mataY + mataOffY - pupilSize * 0.3, highlightSize, 0, Math.PI * 2);
        ctx.fill();

        // Highlight kecil (secondary)
        ctx.fillStyle = `rgba(255,255,255,${0.2 + state.mataBersinar * 0.1})`;
        ctx.beginPath();
        ctx.arc(-mataSpacing + mataOffX + pupilSize * 0.2, mataY + mataOffY + pupilSize * 0.4, highlightSize * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(mataSpacing + mataOffX + pupilSize * 0.2, mataY + mataOffY + pupilSize * 0.4, highlightSize * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // ============================================================
        // PIPA MERAH (blush) - efek gemas
        // ============================================================
        if (state.blush > 0) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = `rgba(244, 63, 94, ${state.blush * 0.15})`;
            ctx.beginPath();
            ctx.ellipse(-mataSpacing * 1.3, mataY + mataSize * 0.6, mataSize * 0.6, mataSize * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(mataSpacing * 1.3, mataY + mataSize * 0.6, mataSize * 0.6, mataSize * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // ============================================================
        // MULUT - ekspresif
        // ============================================================
        ctx.shadowBlur = 0;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const mouthY = mataY + mataSize * 1.3;
        const mouthW = mataSize * 0.7 * state.mulutLebar;

        switch (state.mulutShape) {
            case 'senang':
                // Senyum lebar
                ctx.strokeStyle = '#0f0f1a';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(0, mouthY + 2, mouthW, 0.1, Math.PI - 0.1);
                ctx.stroke();
                // Gigi putih
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.fillRect(-mouthW * 0.25, mouthY + 1, mouthW * 0.5, 3);
                break;

            case 'tertawa':
                // Mulut terbuka lebar
                ctx.fillStyle = '#0f0f1a';
                ctx.shadowColor = 'rgba(0,0,0,0.2)';
                ctx.shadowBlur = 3;
                ctx.beginPath();
                ctx.arc(0, mouthY + 3, mouthW * 0.7, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                // Lidah
                ctx.fillStyle = '#ef4444';
                ctx.beginPath();
                ctx.arc(0, mouthY + 5, mouthW * 0.3, 0, Math.PI);
                ctx.fill();
                break;

            case 'bingung':
                // Mulut miring (asimetris)
                ctx.strokeStyle = '#0f0f1a';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(3, mouthY + 4, mouthW * 0.5, 0.2, Math.PI * 1.3);
                ctx.stroke();
                // Tanda tanya di atas
                ctx.fillStyle = '#fcd34d';
                ctx.font = `${mataSize * 1.2}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.fillText('❓', mataSize * 1.8, -mataSize * 0.5);
                break;

            case 'fokus':
                // Mulut kecil/tipis
                ctx.strokeStyle = '#0f0f1a';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(-mouthW * 0.4, mouthY + 3);
                ctx.quadraticCurveTo(0, mouthY + 2, mouthW * 0.4, mouthY + 3);
                ctx.stroke();
                break;

            default: // normal
                ctx.strokeStyle = '#0f0f1a';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(-mouthW * 0.35, mouthY + 3);
                ctx.quadraticCurveTo(0, mouthY + 2 + state.mulutBuka * 2, mouthW * 0.35, mouthY + 3);
                ctx.stroke();
        }

        ctx.shadowBlur = 0;
        ctx.restore(); // End head transform

        // ============================================================
        // TANGAN MUNGIL (gaya chibi)
        // ============================================================
        const armY = bodyY + bodyR * 0.1;
        const armLen = s * 0.3;

        // Tangan kiri
        ctx.save();
        ctx.translate(-bodyR * 0.7, armY);
        ctx.rotate(-0.2 + state.tanganKiriAngle);
        ctx.shadowColor = `rgba(167, 139, 250, ${0.05 + state.glowIntensity * 0.02})`;
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#c4b5fd';
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, armLen, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Tangan kanan
        ctx.save();
        ctx.translate(bodyR * 0.7, armY);
        ctx.rotate(0.2 - state.tanganKananAngle);
        ctx.shadowColor = `rgba(167, 139, 250, ${0.05 + state.glowIntensity * 0.02})`;
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#c4b5fd';
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, armLen, 4, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // ============================================================
        // KAKI MUNGIL
        // ============================================================
        const legY = bodyY + bodyR * 0.75;
        const legLen = s * 0.2;

        // Kaki kiri
        ctx.save();
        ctx.translate(-bodyR * 0.3, legY);
        ctx.rotate(state.kakiKiri * 0.3);
        ctx.shadowColor = `rgba(13, 148, 136, ${0.05 + state.glowIntensity * 0.02})`;
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#14b8a6';
        ctx.strokeStyle = '#0d9488';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, legLen, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Kaki kanan
        ctx.save();
        ctx.translate(bodyR * 0.3, legY);
        ctx.rotate(-state.kakiKanan * 0.3);
        ctx.shadowColor = `rgba(13, 148, 136, ${0.05 + state.glowIntensity * 0.02})`;
        ctx.shadowBlur = 5;
        ctx.fillStyle = '#14b8a6';
        ctx.strokeStyle = '#0d9488';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, legLen, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        ctx.shadowBlur = 0;
        ctx.restore(); // End main transform
    }

    drawSceneEffects(ctx, w, h, halaman, progress) {
        const t = this.waktu;

        switch (halaman) {
            case 3: // Berpikir - tanda tanya berkedip
                if (progress < 0.8) {
                    const alpha = 0.4 + Math.sin(t * 3) * 0.2;
                    ctx.fillStyle = `rgba(252, 211, 77, ${alpha})`;
                    ctx.font = '22px sans-serif';
                    ctx.textAlign = 'center';
                    const yOff = Math.sin(t * 2) * 5;
                    ctx.fillText('💭', w - 45, 35 + yOff);
                }
                break;

            case 4: // Dekomposisi - puzzle pieces
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 + t * 0.3;
                    const dist = 18 + Math.sin(t * 1.5 + i * 1.2) * 6;
                    const px = 35 + Math.cos(angle) * dist;
                    const py = 25 + Math.sin(angle) * dist;
                    const size = 5 + Math.sin(t * 2 + i * 1.5) * 2;
                    const alpha = 0.25 + Math.sin(t * 2 + i) * 0.15;
                    ctx.fillStyle = `rgba(167, 139, 250, ${alpha})`;
                    ctx.shadowColor = `rgba(167, 139, 250, ${alpha * 0.2})`;
                    ctx.shadowBlur = 8;
                    // Bentuk puzzle (kotak dengan bulatan)
                    ctx.beginPath();
                    ctx.roundRect(px - size / 2, py - size / 2, size, size, 2);
                    ctx.fill();
                    // Tombol puzzle
                    ctx.fillStyle = `rgba(167, 139, 250, ${alpha + 0.1})`;
                    ctx.beginPath();
                    ctx.arc(px, py, 2, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
                break;

            case 5: // Pengenalan Pola - pola berkilau
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + t * 0.15;
                    const dist = 16 + Math.sin(t * 1.5 + i * 1.7) * 4;
                    const px = w / 2 + 65 + Math.cos(angle) * dist;
                    const py = 22 + Math.sin(angle) * dist;
                    const size = 3 + Math.sin(t * 2.5 + i * 1.3) * 1.5;
                    const alpha = 0.3 + Math.sin(t * 2 + i * 1.5) * 0.2;
                    const colors = ['#2dd4bf', '#a78bfa', '#fcd34d', '#f472b6'];
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.shadowColor = colors[i % colors.length];
                    ctx.shadowBlur = 10 + size * 2;
                    ctx.globalAlpha = alpha;
                    ctx.beginPath();
                    ctx.arc(px, py, size + 1.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.globalAlpha = 1;
                    ctx.shadowBlur = 0;
                }
                break;

            case 7: // Algoritma - langkah berurutan
                for (let i = 0; i < 5; i++) {
                    const x = 15 + i * 20 + Math.sin(t * 1.5 + i * 1.2) * 2;
                    const y = 28 + Math.sin(t * 1.2 + i * 1.5) * 3;
                    const isActive = i < Math.floor(t * 1.5 % 5);
                    ctx.fillStyle = isActive ? 'rgba(45, 212, 191, 0.3)' : 'rgba(167, 139, 250, 0.12)';
                    ctx.shadowColor = isActive ? 'rgba(45, 212, 191, 0.2)' : 'transparent';
                    ctx.shadowBlur = isActive ? 8 : 0;
                    ctx.beginPath();
                    ctx.roundRect(x, y, 11, 11, 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;

                    ctx.fillStyle = isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.12)';
                    ctx.font = '6px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(i + 1, x + 5.5, y + 6);

                    if (i < 4) {
                        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(x + 11, y + 5.5);
                        ctx.lineTo(x + 20, y + 5.5);
                        ctx.stroke();
                    }
                }
                break;

            case 8: // Integrasi AI - WiFi berdenyut
                for (let i = 0; i < 3; i++) {
                    const radius = 8 + i * 9 + Math.sin(t * 2 + i * 0.5) * 2;
                    const alpha = 0.15 + i * 0.12 + Math.sin(t * 2.5 + i) * 0.05;
                    ctx.strokeStyle = `rgba(45, 212, 191, ${alpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = `rgba(45, 212, 191, ${alpha * 0.2})`;
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.arc(w - 38, 24, radius, -Math.PI * 0.6, Math.PI * 0.6);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }
                // Titik tengah
                ctx.fillStyle = `rgba(45, 212, 191, ${0.4 + Math.sin(t * 2) * 0.1})`;
                ctx.shadowColor = `rgba(45, 212, 191, ${0.2 + Math.sin(t * 2) * 0.1})`;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.arc(w - 38, 24, 2.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;

            case 10: // Semangat - bintang
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2 + t * 0.25;
                    const dist = 18 + Math.sin(t * 2 + i * 1.3) * 6;
                    const px = w / 2 + 55 + Math.cos(angle) * dist;
                    const py = 15 + Math.sin(angle) * dist;
                    const alpha = 0.3 + Math.sin(t * 2 + i * 1.5) * 0.2;
                    ctx.fillStyle = `rgba(252, 211, 77, ${alpha})`;
                    ctx.shadowColor = `rgba(252, 211, 77, ${alpha * 0.2})`;
                    ctx.shadowBlur = 10;
                    ctx.font = '10px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('✦', px, py);
                    ctx.shadowBlur = 0;
                }
                break;

            case 13: // Menang - confetti
                for (let i = 0; i < 12; i++) {
                    const x = (i / 12) * w + Math.sin(t * 3 + i * 1.7) * 12;
                    const y = Math.sin(t * 2.5 + i * 1.3) * 20 + 15;
                    const colors = ['#a78bfa', '#2dd4bf', '#fcd34d', '#f472b6', '#60a5fa', '#f97316'];
                    ctx.fillStyle = colors[i % colors.length];
                    ctx.shadowColor = colors[i % colors.length];
                    ctx.shadowBlur = 4;
                    const rot = Math.sin(t * 3 + i) * 0.3;
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(rot);
                    ctx.fillRect(-1.5, -3, 2.5, 6);
                    ctx.restore();
                    ctx.shadowBlur = 0;
                }
                break;

            case 16: // Tamat - bintang berkilau
                for (let i = 0; i < 6; i++) {
                    const angle = (i / 6) * Math.PI * 2 + t * 0.15;
                    const dist = 22 + Math.sin(t * 1.5 + i * 1.2) * 6;
                    const px = w / 2 + Math.cos(angle) * dist;
                    const py = 18 + Math.sin(angle) * dist;
                    const size = 8 + Math.sin(t * 2.5 + i * 1.7) * 3;
                    const alpha = 0.3 + Math.sin(t * 2 + i * 1.5) * 0.2;
                    ctx.fillStyle = `rgba(252, 211, 77, ${alpha})`;
                    ctx.shadowColor = `rgba(252, 211, 77, ${alpha * 0.2})`;
                    ctx.shadowBlur = 15;
                    ctx.font = `${size}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('⭐', px, py);
                    ctx.shadowBlur = 0;
                }
                break;
        }
    }
}

// ============================================================
// INISIALISASI
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
    const containerIds = [
        'animasi-cover', 'animasi-halaman2', 'animasi-halaman3',
        'animasi-halaman4', 'animasi-halaman5', 'animasi-halaman6',
        'animasi-halaman7', 'animasi-halaman8', 'animasi-halaman9',
        'animasi-halaman10', 'animasi-halaman11', 'animasi-halaman12',
        'animasi-halaman13', 'animasi-halaman14', 'animasi-halaman15',
        'animasi-halaman16', 'animasi-luar-kiri', 'animasi-luar-kanan'
    ];

    window.animasiInstances = {};

    containerIds.forEach((id, index) => {
        let halaman = index + 1;
        if (id === 'animasi-luar-kiri' || id === 'animasi-luar-kanan') {
            halaman = 17;
        }
        const container = document.getElementById(id);
        if (container) {
            const animasi = new AnimasiRobotBab1(id);
            animasi.setHalaman(halaman);
            window.animasiInstances[id] = animasi;
        }
    });
});

// ============================================================
// POLYFILL roundRect
// ============================================================
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (r > w / 2) r = w / 2;
        if (r > h / 2) r = h / 2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        this.closePath();
        return this;
    };
}