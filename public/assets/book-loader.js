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

      triggerFeedback(correct) {
         this.isFeedbackCorrect = correct;
         this.showFeedback = true;
         if(correct) {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#2dd4bf', '#a78bfa', '#fcd34d'] });
         }
         setTimeout(() => { this.showFeedback = false; }, 2000);
      },

      jawabLatihan(bab, idx, optIdx) {
         let soal = this.chapters[bab].latihan[idx];
         soal.dijawab = true;
         soal.userAns = optIdx;
         let correct = (optIdx === soal.ans);
         if(correct) this.chapters[bab].latihanScore += 10;
         
         this.triggerFeedback(correct);
         this.checkLatihan(bab);
      },

      jawabUjian(bab, idx, optIdx) {
         let soal = this.chapters[bab].ujian[idx];
         soal.dijawab = true;
         soal.userAns = optIdx;
         let correct = (optIdx === soal.ans);
         if(correct) this.chapters[bab].ujianScore += 10;
         
         this.triggerFeedback(correct);
         this.checkUjian(bab);
      },

      getBtnClass(bab, idx, optIdx, tipe) {
         let soal = tipe === 'latihan' ? this.chapters[bab].latihan[idx] : this.chapters[bab].ujian[idx];
         if(!soal || !soal.dijawab) return '';
         if(optIdx === soal.ans) return 'bg-teal-600 border-teal-400 text-white font-bold';
         if(optIdx === soal.userAns) return 'bg-red-600/80 border-red-500 text-white';
         return 'opacity-30';
      },

      checkLatihan(bab) {
         if(this.chapters[bab].latihan.every(s => s.dijawab)) {
            setTimeout(() => { 
               this.chapters[bab].latihanSelesai = true; 
               confetti({particleCount: 200, spread: 100}); 
            }, 2200);
         }
      },

      checkUjian(bab) {
         if(this.chapters[bab].ujian.every(s => s.dijawab)) {
            setTimeout(() => { 
               this.chapters[bab].ujianSelesai = true; 
               confetti({particleCount: 300, spread: 120, origin: {y: 0.4}}); 
            }, 2200);
         }
      },
      
      goToChapter(bab) {
         if (window.pageFlip) {
            // Find the first page of the chapter
            const targetPage = document.querySelector(`.page[data-bab="${bab}"]`);
            if (targetPage) {
               // We need to calculate the index of this page
               const pages = Array.from(document.querySelectorAll('.page'));
               const index = pages.indexOf(targetPage);
               if (index !== -1) {
                  window.pageFlip.turnToPage(index);
               }
            }
         }
      }
   }));
});

// Load Chapters Dynamically
document.addEventListener('DOMContentLoaded', async () => {
   const flipbookEl = document.getElementById('flipbook');
   const loaderText = document.getElementById('loader-text');
   const loaderBar = document.getElementById('loader-bar');
   const totalChapters = 6;
   let combinedHtml = "";

   for (let i = 1; i <= totalChapters; i++) {
      loaderText.innerText = `Memuat Bab ${i}...`;
      loaderBar.style.width = `${(i / totalChapters) * 100}%`;
      
      try {
         const res = await fetch(`/bab-${i}/index.html`);
         if (!res.ok) continue;
         
         const html = await res.text();
         
         // Extract Pages
         const pagesMatch = html.match(/<div id="flipbook"[^>]*>([\s\S]*?)<\/div>\s*<!--\s*End Flipbook\s*-->/i);
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
   loader.style.opacity = '0';
   setTimeout(() => loader.style.display = 'none', 500);

   // Wait for Alpine to render the templates before initializing StPageFlip
   setTimeout(() => {
      // Function to dynamically scale the flipbook to perfectly fit any screen
      function resizeFlipbook() {
         const wrapper = document.querySelector('.flipbook-wrapper');
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
         maxShadowOpacity: 0.5,
         showCover: true,
         mobileScrollSupport: true,
         usePortrait: true 
      });

      window.pageFlip.loadFromHTML(document.querySelectorAll('.page'));

      // Reveal with animation
      setTimeout(() => { flipbookEl.classList.add('initialized'); }, 200);

      // Bind Navigation Buttons
      document.getElementById('btn-prev').addEventListener('click', () => window.pageFlip.flipPrev());
      document.getElementById('btn-next').addEventListener('click', () => window.pageFlip.flipNext());
      document.getElementById('btn-prev-mobile').addEventListener('click', () => window.pageFlip.flipPrev());
      document.getElementById('btn-next-mobile').addEventListener('click', () => window.pageFlip.flipNext());

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

      window.pageFlip.on('flip', () => triggerAnimation());
      setTimeout(triggerAnimation, 500);
   }, 300);
   
   // StPageFlip handles resize and portrait switching natively when usePortrait: true is set
});
