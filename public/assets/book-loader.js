// Global Alpine Data Store
window.globalChaptersData = {};

document.addEventListener('alpine:init', () => {
   Alpine.data('globalApp', () => ({
      showDetailModal: false,
      activeDetail: null,
      activeTipe: '',
      activeIndex: 0,
      activeBab: 1,
      showFeedback: false,
      isFeedbackCorrect: false,
      
      // Video Modal state for /book mode
      showVideoModal: false,
      videoModalUrl: '',
      videoModalYtUrl: '',
      videoModalTitle: '',
      videoModalSubtitle: '',
      videoModalNote: '',
      currentViewingBab: 1,

      openVideoModal(bab) {
         const targetBab = bab || this.currentViewingBab || 1;
         const videoMap = {
            1: {
               url: "https://www.youtube.com/embed/IkOMyk02uik?autoplay=1&rel=0",
               ytUrl: "https://www.youtube.com/watch?v=IkOMyk02uik",
               title: "Video Penjelasan: Informatika & Keterampilan Generik",
               subtitle: "Informatika Fase E Kelas X • Kurikulum Merdeka",
               note: "Pahami peran informatika, profil pelajar Pancasila, dan keterampilan generik."
            },
            2: {
               url: "https://www.youtube.com/embed/QyY5cfz2390?autoplay=1&rel=0",
               ytUrl: "https://www.youtube.com/watch?v=QyY5cfz2390",
               title: "Video Penjelasan: Algoritma & Pemrograman Lanjut",
               subtitle: "Informatika Fase E Kelas X • Kurikulum Merdeka",
               note: "Pahami konsep algoritma, pseudocode, flowchart, dan logika pemrograman."
            },
            3: {
               url: "https://www.youtube.com/embed/EX_Ib7wD2e4?autoplay=1&rel=0",
               ytUrl: "https://www.youtube.com/watch?v=EX_Ib7wD2e4",
               title: "Video Penjelasan: Literasi Digital & Etika Berinternet",
               subtitle: "Informatika Fase E Kelas X • Kurikulum Merdeka",
               note: "Pahami rekam jejak digital, cyberbullying, privasi data, dan netiket."
            },
            4: {
               url: "https://www.youtube.com/embed/cRG4qQe_OVA?autoplay=1&rel=0",
               ytUrl: "https://www.youtube.com/watch?v=cRG4qQe_OVA",
               title: "Video Penjelasan: Prompt Engineering & Generative AI",
               subtitle: "Informatika Fase E Kelas X • Kurikulum Merdeka",
               note: "Pelajari cara menyusun instruksi / prompt efektif untuk AI secara optimal."
            },
            5: {
               url: "https://www.youtube.com/embed/oIkEZLdCGuQ?autoplay=1&rel=0",
               ytUrl: "https://www.youtube.com/watch?v=oIkEZLdCGuQ",
               title: "Video Penjelasan: Kreativitas Konten Digital",
               subtitle: "Informatika Fase E Kelas X • Kurikulum Merdeka",
               note: "Pelajari produksi konten visual, infografis, dan etika hak cipta digital."
            },
            6: {
               url: "https://www.youtube.com/embed/0eB4nELrrrU?autoplay=1&rel=0",
               ytUrl: "https://www.youtube.com/watch?v=0eB4nELrrrU",
               title: "Video Penjelasan: Pengelolaan Informasi Digital",
               subtitle: "Informatika Fase E Kelas X • Kurikulum Merdeka",
               note: "Pelajari konsep basis data, tabel, record & field, serta relasi data."
            }
         };
         const info = videoMap[targetBab] || videoMap[1];
         this.videoModalUrl = info.url;
         this.videoModalYtUrl = info.ytUrl;
         this.videoModalTitle = info.title;
         this.videoModalSubtitle = info.subtitle;
         this.videoModalNote = info.note;
         this.showVideoModal = true;
      },

      closeVideoModal() {
         this.showVideoModal = false;
         this.videoModalUrl = '';
      },

      toggleCinemaFullscreen() {
         const container = document.getElementById('cinema-modal-card');
         if (!document.fullscreenElement) {
            if (container && container.requestFullscreen) {
               container.requestFullscreen();
            } else if (document.documentElement.requestFullscreen) {
               document.documentElement.requestFullscreen();
            }
         } else {
            if (document.exitFullscreen) {
               document.exitFullscreen();
            }
         }
      },

      // Result Modal for Completed Quiz / Exercise
      showScoreModal: false,
      scoreModalData: {
         bab: 1,
         babTitle: '',
         tipe: 'Latihan',
         score: 0,
         maxScore: 100,
         benar: 0,
         salah: 0,
         comment: '',
         badgeClass: '',
         icon: '🏆'
      },

      openScoreModal(bab, tipe) {
         const s = this.chapters[bab];
         const isLatihan = tipe === 'latihan';
         const score = isLatihan ? s.latihanScore : s.ujianScore;
         const questions = isLatihan ? s.latihan : s.ujian;
         const total = questions && questions.length ? questions.length : 10;
         const maxScore = total * 10;
         const benar = Math.round(score / 10);
         const salah = Math.max(0, total - benar);

         let comment = "";
         let icon = "🏆";
         let badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-300";

         if (score >= 80) {
            comment = "🎉 Selamat Anda berhasil! Pemahaman materi Anda sangat memuaskan.";
            icon = "🎉";
            badgeClass = "bg-emerald-50 text-emerald-800 border-emerald-300";
         } else if (score >= 60) {
            comment = "👍 Kerja bagus! Anda sudah memahami sebagian besar materi, tingkatkan lagi ya.";
            icon = "👍";
            badgeClass = "bg-amber-50 text-amber-800 border-amber-300";
         } else {
            comment = "💪 Maaf Anda belum sempurna, belajar lagi ya! Jangan berkecil hati, ayo pelajari materinya lagi.";
            icon = "💪";
            badgeClass = "bg-rose-50 text-rose-800 border-rose-300";
         }

         const babTitles = {
            1: "Informatika & Keterampilan Generik",
            2: "Algoritma & Pemrograman",
            3: "Literasi & Etika AI",
            4: "Prompt Engineering & AI",
            5: "Kreativitas Konten Digital",
            6: "Pengelolaan Informasi Digital"
         };

         this.scoreModalData = {
            bab,
            babTitle: babTitles[bab] || `Bab ${bab}`,
            tipe: isLatihan ? 'Latihan Formatif' : 'Ujian Kompetensi',
            score,
            maxScore,
            benar,
            salah,
            comment,
            badgeClass,
            icon
         };
         this.showScoreModal = true;
      },

      closeScoreModal() {
         this.showScoreModal = false;
      },

      getScoreComment(score) {
         if (score >= 80) return "🎉 Selamat Anda berhasil! Sangat memuaskan.";
         if (score >= 60) return "👍 Kerja bagus! Tingkatkan lagi ya.";
         return "💪 Maaf Anda belum sempurna, belajar lagi ya!";
      },

      // We will populate this from the loader
      chapters: {
         1: { latihan: [], ujian: [], latihanScore: 0, ujianScore: 0, latihanSelesai: false, ujianSelesai: false },
         2: { latihan: [], ujian: [], latihanScore: 0, ujianScore: 0, latihanSelesai: false, ujianSelesai: false },
         3: { latihan: [], ujian: [], latihanScore: 0, ujianScore: 0, latihanSelesai: false, ujianSelesai: false },
         4: { latihan: [], ujian: [], latihanScore: 0, ujianScore: 0, latihanSelesai: false, ujianSelesai: false },
         5: { latihan: [], ujian: [], latihanScore: 0, ujianScore: 0, latihanSelesai: false, ujianSelesai: false },
         6: { latihan: [], ujian: [], latihanScore: 0, ujianScore: 0, latihanSelesai: false, ujianSelesai: false }
      },

      init() {
         window.addEventListener('set-chapter-data', (e) => {
            const dataMap = e.detail;
            for(let i=1; i<=6; i++) {
               if(dataMap[i]) {
                  this.chapters[i].latihan = dataMap[i].latihan || [];
                  this.chapters[i].ujian = dataMap[i].ujian || [];
               }
            }
         });
      },

      initData(bab, data) {
         if (data.latihan) this.chapters[bab].latihan = data.latihan;
         if (data.ujian) this.chapters[bab].ujian = data.ujian;
      },

      openDetail(bab, tipe, index) {
         this.activeBab = bab;
         this.activeTipe = tipe;
         this.activeIndex = index;
         this.activeDetail = tipe === 'latihan' ? this.chapters[bab].latihan[index] : this.chapters[bab].ujian[index];
         this.showDetailModal = true;
      },

      jawabDariDetail(optIdx) {
         if(this.activeTipe === 'latihan') this.jawabLatihan(this.activeBab, this.activeIndex, optIdx);
         else this.jawabUjian(this.activeBab, this.activeIndex, optIdx);
         this.showDetailModal = false;
      },

      triggerFeedback() {
         this.showFeedback = true;
         setTimeout(() => { this.showFeedback = false; }, 800);
      },

      jawabLatihan(bab, idx, optIdx) {
         let soal = this.chapters[bab].latihan[idx];
         soal.dijawab = true;
         soal.userAns = optIdx;
         let correct = (optIdx === soal.ans);
         if(correct) this.chapters[bab].latihanScore += 10;
         
         this.triggerFeedback();
         this.checkLatihan(bab);
      },

      jawabUjian(bab, idx, optIdx) {
         let soal = this.chapters[bab].ujian[idx];
         soal.dijawab = true;
         soal.userAns = optIdx;
         let correct = (optIdx === soal.ans);
         if(correct) this.chapters[bab].ujianScore += 10;
         
         this.triggerFeedback();
         this.checkUjian(bab);
      },

      getBtnClass(bab, idx, optIdx, tipe) {
         let soal = tipe === 'latihan' ? this.chapters[bab].latihan[idx] : this.chapters[bab].ujian[idx];
         if(!soal || !soal.dijawab) return '';
         if(optIdx === soal.userAns) return 'bg-teal-600 border-teal-600 text-white font-bold shadow-md shadow-teal-600/20';
         return 'opacity-40';
      },

      testBerikutnya(bab, tipe) {
         const list = tipe === 'latihan' ? this.chapters[bab].latihan : this.chapters[bab].ujian;
         if (!list || !list.length) return;
         list.forEach(s => {
            s.dijawab = false;
            s.userAns = -1;
            if (s.opts && s.opts.length) {
               const mapped = s.opts.map((opt, i) => ({ opt, isAns: i === s.ans }));
               for (let i = mapped.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
               }
               s.opts = mapped.map(m => m.opt);
               s.ans = mapped.findIndex(m => m.isAns);
            }
         });
         for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
         }
         if (tipe === 'latihan') {
            this.chapters[bab].latihanScore = 0;
            this.chapters[bab].latihanSelesai = false;
         } else {
            this.chapters[bab].ujianScore = 0;
            this.chapters[bab].ujianSelesai = false;
         }
         this.showScoreModal = false;
         this.goToChapter(bab);
      },

      checkLatihan(bab) {
         if(this.chapters[bab].latihan.every(s => s.dijawab)) {
            setTimeout(() => { 
               this.chapters[bab].latihanSelesai = true; 
               confetti({particleCount: 200, spread: 100}); 
               this.openScoreModal(bab, 'latihan');
            }, 2200);
         }
      },

      checkUjian(bab) {
         if(this.chapters[bab].ujian.every(s => s.dijawab)) {
            setTimeout(() => { 
               this.chapters[bab].ujianSelesai = true; 
               confetti({particleCount: 300, spread: 120, origin: {y: 0.4}}); 
               this.openScoreModal(bab, 'ujian');
            }, 2200);
         }
      },
      
      goToChapter(bab) {
         this.currentViewingBab = bab;
         if (window.pageFlip) {
            // Find the first page of the chapter
            const targetPage = document.querySelector(`.page[data-bab="${bab}"]`);
            if (targetPage) {
               // We need to calculate the index of this page
               const pages = Array.from(document.querySelectorAll('.page'));
               const index = pages.indexOf(targetPage);
               if (index !== -1) {
                  window.pageFlip.turnToPage(index);
                  if (typeof window.playFlipSound === 'function') {
                     window.playFlipSound();
                  }
               }
            }
         }
      }
   }));
});

// Load Chapters Dynamically
document.addEventListener('DOMContentLoaded', async () => {
   const flipbookEl = document.getElementById('digitalbook') || document.getElementById('flipbook');
   const loaderText = document.getElementById('loader-text');
   const loaderBar = document.getElementById('loader-bar');
   const totalChapters = 6;
   let combinedHtml = "";

   for (let i = 1; i <= totalChapters; i++) {
      if (loaderText) loaderText.innerText = `Memuat Bab ${i}...`;
      if (loaderBar) loaderBar.style.width = `${(i / totalChapters) * 100}%`;
      
      try {
         const res = await fetch(`/bab-${i}/index.html`);
         if (!res.ok) continue;
         
         const html = await res.text();
         
         // Extract Pages
         const pagesMatch = html.match(/<div id="(?:digitalbook|flipbook)"[^>]*>([\s\S]*?)<\/div>\s*<!--\s*End (?:Digital Book|Flipbook)\s*-->/i);
         if (pagesMatch) {
            let pagesHtml = pagesMatch[1];
            
            // Mark each page with its chapter number for TOC navigation
            pagesHtml = pagesHtml.replace(/<div class="page/g, `<div data-bab="${i}" class="page`);
            
            // Fix Hard page styles specific to chapters (keep original hard page styles if needed)
            pagesHtml = pagesHtml.replace(/--hard/g, `--hard-${i}`);

            // Replace Alpine Bindings with Namespaced ones
            pagesHtml = pagesHtml.replace(/latihanScore/g, `chapters[${i}].latihanScore`);
            pagesHtml = pagesHtml.replace(/ujianScore/g, `chapters[${i}].ujianScore`);
            pagesHtml = pagesHtml.replace(/latihanSelesai/g, `chapters[${i}].latihanSelesai`);
            pagesHtml = pagesHtml.replace(/ujianSelesai/g, `chapters[${i}].ujianSelesai`);
            
            // Replace in latihan/ujian arrays
            pagesHtml = pagesHtml.replace(/in latihan\.slice/g, `in chapters[${i}].latihan.slice`);
            pagesHtml = pagesHtml.replace(/in ujian\.slice/g, `in chapters[${i}].ujian.slice`);
            pagesHtml = pagesHtml.replace(/in latihan(?!\.)/g, `in chapters[${i}].latihan`); // for bab 5 that doesn't use slice
            pagesHtml = pagesHtml.replace(/in ujian(?!\.)/g, `in chapters[${i}].ujian`);
            
            // Replace Functions
            pagesHtml = pagesHtml.replace(/jawabLatihan\((.*?)\)/g, `jawabLatihan(${i}, $1)`);
            pagesHtml = pagesHtml.replace(/jawabUjian\((.*?)\)/g, `jawabUjian(${i}, $1)`);
            pagesHtml = pagesHtml.replace(/getBtnClass\((.*?)\)/g, (match, p1) => {
               // The original is getBtnClass(index, oidx, 'latihan')
               // We need to inject chapter ID as first param: getBtnClass(bab, index, oidx, 'latihan')
               return `getBtnClass(${i}, ${p1})`;
            });
            pagesHtml = pagesHtml.replace(/openDetail\('latihan',\s*(.*?)\)/g, `openDetail(${i}, 'latihan', $1)`);
            pagesHtml = pagesHtml.replace(/openDetail\('ujian',\s*(.*?)\)/g, `openDetail(${i}, 'ujian', $1)`);
            pagesHtml = pagesHtml.replace(/testBerikutnya\((.*?)\)/g, `testBerikutnya(${i}, $1)`);
            
            // Replace Video Modal triggers with Chapter-Specific function call for /book mode
            pagesHtml = pagesHtml.replace(/@click="showVideoModal\s*=\s*true"/g, `@click="openVideoModal(${i})"`);
            pagesHtml = pagesHtml.replace(/x-on:click="showVideoModal\s*=\s*true"/g, `@click="openVideoModal(${i})"`);
            
            combinedHtml += pagesHtml;
         }

         // Extract Alpine Data Object using a safe evaluation sandbox
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, 'text/html');
         const scriptEl = Array.from(doc.querySelectorAll('script')).find(s => s.textContent.includes("Alpine.data('quizApp'"));
         
         if (scriptEl) {
             const fakeEnv = `
                 (function() {
                     let extractedData = null;
                     const Alpine = {
                         data: function(name, fn) {
                             if(name === 'quizApp') extractedData = fn();
                         }
                     };
                     const document = {
                         addEventListener: function(evt, cb) {
                             if(evt === 'alpine:init') cb();
                         }
                     };
                     ${scriptEl.textContent}
                     return extractedData;
                 })();
             `;
             try {
                 const dataObj = eval(fakeEnv);
                 window.globalChaptersData[i] = dataObj;
             } catch(e) {
                 console.error("Failed to eval chapter data for bab", i, e);
             }
         }
         
      } catch(err) {
         console.error(`Error loading chapter ${i}`, err);
      }
   }

   // Pass extracted data to Alpine reactively before injecting HTML
   window.dispatchEvent(new CustomEvent('set-chapter-data', { detail: window.globalChaptersData }));

   // Inject HTML
   flipbookEl.innerHTML = combinedHtml;

   // Hide loader
   const loader = document.getElementById('loader');
   if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
         loader.style.display = 'none';
         if (typeof window.playFlipSound === 'function') {
            window.playFlipSound();
         }
      }, 500);
   }

   // Wait for Alpine to render the templates before initializing StPageFlip
   setTimeout(() => {
      // Function to dynamically scale the digital book to perfectly fit any screen
      function resizeFlipbook() {
         const wrapper = document.querySelector('.digitalbook-wrapper') || document.querySelector('.flipbook-wrapper');
         if (!wrapper) return;
         
         const isMobile = window.innerWidth < 768;
         const baseWidth = isMobile ? 450 : 900;
         const baseHeight = 600;
         
         // Set fixed physical dimensions
         flipbookEl.style.width = baseWidth + 'px';
         flipbookEl.style.height = baseHeight + 'px';
         
         // Calculate scaling factor
         const padding = isMobile ? 30 : 60;
         const availableWidth = wrapper.clientWidth - padding;
         const availableHeight = wrapper.clientHeight - padding - (isMobile ? 60 : 0);
         
         const scaleX = availableWidth / baseWidth;
         const scaleY = availableHeight / baseHeight;
         const scale = Math.min(scaleX, scaleY, 1); // Max scale 1x
         
         flipbookEl.style.transform = `scale(${scale})`;
         flipbookEl.style.transformOrigin = 'center center';
      }

      // Initial sizing
      resizeFlipbook();
      window.addEventListener('resize', resizeFlipbook);
      
      window.pageFlip = new St.PageFlip(flipbookEl, {
         width: 450,
         height: 600,
         size: "stretch",
         minWidth: 315,
         maxWidth: 1000,
         minHeight: 420,
         maxHeight: 1350,
         maxShadowOpacity: 0.3,
         showCover: true,
         mobileScrollSupport: true,
         usePortrait: true 
      });

      window.pageFlip.loadFromHTML(document.querySelectorAll('.page'));

      // Reveal with animation
      setTimeout(() => { flipbookEl.classList.add('initialized'); }, 200);

      // Helper function for flip sound
      const triggerFlipAudio = () => {
         if (typeof window.playFlipSound === 'function') {
            window.playFlipSound();
         }
      };

      // Bind Navigation Buttons with sound
      document.getElementById('btn-prev')?.addEventListener('click', () => { window.pageFlip.flipPrev(); triggerFlipAudio(); });
      document.getElementById('btn-next')?.addEventListener('click', () => { window.pageFlip.flipNext(); triggerFlipAudio(); });
      document.getElementById('btn-prev-mobile')?.addEventListener('click', () => { window.pageFlip.flipPrev(); triggerFlipAudio(); });
      document.getElementById('btn-next-mobile')?.addEventListener('click', () => { window.pageFlip.flipNext(); triggerFlipAudio(); });

      // Handle Content Animations
      const triggerAnimation = () => {
         const allContents = document.querySelectorAll('.page-content');
         allContents.forEach(p => p.classList.remove('animate-ready'));
         setTimeout(() => { 
           allContents.forEach(p => {
             const page = p.closest('.page');
             if(page && (page.classList.contains('st-page-active') || page.classList.contains('st-page-visible') || page.style.display !== 'none')) {
               p.classList.add('animate-ready');
             }
           }); 
         }, 100);
      };

      window.pageFlip.on('flip', (e) => {
         triggerAnimation();
         triggerFlipAudio();

         // Ubah animasi luar kiri dan kanan berdasarkan halaman
         const pageIndex = (e.data !== undefined) ? e.data : window.pageFlip.getCurrentPageIndex();
         if (typeof window.changeLottieOnFlip === 'function') {
            window.changeLottieOnFlip(pageIndex);
         }

         // Update current active chapter
         const allPages = document.querySelectorAll('.page');
         if (allPages && allPages[pageIndex]) {
            const babAttr = allPages[pageIndex].getAttribute('data-bab');
            if (babAttr) {
               const babNum = parseInt(babAttr);
               const alpineRoot = document.querySelector('[x-data="globalApp()"]');
               if (alpineRoot && window.Alpine) {
                  try {
                     const app = Alpine.$data(alpineRoot);
                     if (app) app.currentViewingBab = babNum;
                  } catch(err) {}
               }
            }
         }
      });

      window.pageFlip.on('changeState', (e) => {
         if (e.data === 'flipping') {
            triggerFlipAudio();
         }
      });

      setTimeout(triggerAnimation, 500);
   }, 300);
   
   // StPageFlip handles resize and portrait switching natively when usePortrait: true is set
});
