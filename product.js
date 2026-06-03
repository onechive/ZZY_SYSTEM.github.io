document.addEventListener('DOMContentLoaded', () => {
    // Section 5 Carousel Logic
    const sec05Data = [
        {
            title: 'Three Steps to Synthetic Sight<br><span>STEP 01 SCAN</span>',
            desc: 'NERVISION begins by scanning the surrounding environment through its synthetic optical layer. It collects light, motion, depth, surface texture, temperature shifts, and biological micro-signals that the natural eye cannot fully detect. Instead of simply enlarging what you already see, NERVISION captures the hidden structure behind the visible world.',
            features: [
                'Core<br>Function',
                'Light<br>Density',
                'Motion<br>Frequency',
                'Spatial<br>Depth',
                'Low-light<br>Patterns'
            ],
            image: 'img/product04_Lens1.png',
            bigImage: 'img/product04_big01.png'
        },
        {
            title: 'Three Steps to Synthetic Sight<br><span>STEP 02 INTERPRET</span>',
            desc: 'After scanning, NERVISION filters visual noise and converts fragmented signals into structured information.<br><br>The lens separates what is important from what is distracting, identifying movement patterns, hidden risks, unstable surfaces, and visual blind spots in real time.',
            features: [
                'Noise<br>Reduction',
                'Threat<br>Recognition',
                'Visual DATA<br>Compression'
            ],
            image: 'img/product04_Lens2.png',
            bigImage: 'img/product04_big02.png'
        },
        {
            title: 'Three Steps to Synthetic Sight<br><span>STEP 03 PROCESS</span>',
            desc: 'NERVISION projects the processed information back into the user’s field of view as a minimal visual overlay.<br><br>The interface appears only when needed, allowing the user to recognize direction, distance, motion, and environmental changes without interrupting natural sight.',
            features: [
                'Direction<br>Markers',
                'Signal<br>Pulses',
                'Risk<br>Indicators'
            ],
            image: 'img/product04_Lens3.png',
            bigImage: 'img/product04_big03.png'
        }
    ];

    let currentStep = 0;
    let isScrolling = false;

    class ScrambleText {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\\\/[]{}—=+*^?#_ABCDE0123';
            this.update = this.update.bind(this);
        }
        
        setText(newHTML, duration = 1000) {
            const temp = document.createElement('div');
            temp.innerHTML = newHTML;
            this.queue = [];
            const extractText = (node) => {
                if (node.nodeType === 3) {
                    const text = node.nodeValue;
                    if (text.trim().length > 0) {
                        this.queue.push({
                            node: node,
                            text: text,
                            length: text.length
                        });
                    }
                } else {
                    node.childNodes.forEach(extractText);
                }
            };
            extractText(temp);
            
            this.el.innerHTML = '';
            this.el.appendChild(temp);
            
            cancelAnimationFrame(this.frameRequest);
            this.speedMs = 35; 
            this.duration = duration;
            this.startTime = Date.now();
            this.lastTime = this.startTime;
            this.update();
        }
        
        update() {
            const now = Date.now();
            const elapsed = now - this.startTime;

            if (now - this.lastTime >= this.speedMs) {
                this.lastTime = now;
                let allSettled = true;
                
                const progress = Math.min(elapsed / this.duration, 1);
                
                this.queue.forEach(q => {
                    const settled = Math.floor(q.length * progress);
                    if (settled < q.length) {
                        allSettled = false;
                        let display = '';
                        for (let i = 0; i < q.length; i++) {
                            if (i < settled) {
                                display += q.text[i];
                            } else if (q.text[i] === ' ') {
                                display += ' ';
                            } else {
                                display += this.chars[Math.floor(Math.random() * this.chars.length)];
                            }
                        }
                        q.node.nodeValue = display;
                    } else {
                        q.node.nodeValue = q.text;
                    }
                });
                
                if (progress >= 1 || allSettled) return;
            }
            this.frameRequest = requestAnimationFrame(this.update);
        }
    }

    const titleEl = document.getElementById('step-title');
    const descEl = document.getElementById('step-desc');
    const featuresEl = document.getElementById('step-features');
    const imageEl = document.getElementById('step-image');
    const bigImageEl = document.getElementById('step-big-image');
    const sec05 = document.querySelector('.sec-05');
    
    // Check if elements exist before attaching listeners
    if (sec05 && titleEl && descEl && featuresEl && imageEl && bigImageEl) {
        
        const titleScrambler = new ScrambleText(titleEl);
        const descScrambler = new ScrambleText(descEl);

        const contentWrap = document.getElementById('sec05-content-wrap');

        const updateContent = (index, direction = 1) => {
            const data = sec05Data[index];
            
            // Clone current content wrap for out-animation
            const clone = contentWrap.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.top = contentWrap.offsetTop + 'px';
            clone.style.left = contentWrap.offsetLeft + 'px';
            clone.style.width = contentWrap.offsetWidth + 'px';
            clone.style.height = contentWrap.offsetHeight + 'px';
            clone.style.margin = '0';
            clone.style.zIndex = '1';
            
            // Overlay to darken the background
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = '#000';
            overlay.style.opacity = '0';
            overlay.style.zIndex = '2';
            overlay.style.pointerEvents = 'none';
            overlay.style.transition = 'opacity 0.8s ease';
            
            sec05.appendChild(clone);
            sec05.appendChild(overlay);
            
            contentWrap.style.position = 'relative';
            contentWrap.style.zIndex = '3';
            
            // Determine starting position based on scroll direction
            const startY = direction > 0 ? 150 : -150;
            const cloneEndY = direction > 0 ? -100 : 100;
            
            contentWrap.style.transition = 'none';
            contentWrap.style.transform = `translateY(${startY}px)`;
            contentWrap.style.opacity = '0';
            
            // Start scramble and update DOM
            titleScrambler.setText(data.title, 1000);
            descScrambler.setText(data.desc, 1000);
            imageEl.src = data.image;
            bigImageEl.src = data.bigImage;
            
            featuresEl.innerHTML = '';
            data.features.forEach(feat => {
                const div = document.createElement('div');
                div.className = 'feat';
                div.innerHTML = feat;
                featuresEl.appendChild(div);
            });
            
            // Ensure any previous inline opacity is cleared
            titleEl.style.opacity = '';
            descEl.style.opacity = '';
            featuresEl.style.opacity = '';
            imageEl.style.opacity = '';
            bigImageEl.style.opacity = '';
            
            // Force reflow
            void contentWrap.offsetWidth;
            
            // Animate new content in
            contentWrap.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.8s ease';
            contentWrap.style.transform = 'translateY(0)';
            contentWrap.style.opacity = '1';
            
            // Animate old content and overlay out
            overlay.style.opacity = '0.6';
            clone.style.transition = 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
            clone.style.transform = `translateY(${cloneEndY}px) scale(0.95)`;
            clone.style.opacity = '0';
            
            setTimeout(() => {
                clone.remove();
                overlay.remove();
            }, 800);
        };

        sec05.addEventListener('wheel', (e) => {
            if (isScrolling) {
                e.preventDefault();
                return;
            }

            const rect = sec05.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            // Only activate scroll hijack when the section is comfortably in view
            const threshold = viewHeight * 0.35;
            const isActive = rect.top <= threshold && rect.bottom >= (viewHeight - threshold);

            if (e.deltaY > 0) {
                // Scroll down
                if (currentStep < sec05Data.length - 1) {
                    if (isActive) {
                        e.preventDefault();
                        isScrolling = true;
                        currentStep++;
                        updateContent(currentStep, 1);
                        setTimeout(() => { isScrolling = false; }, 1000);
                    }
                }
            } else if (e.deltaY < 0) {
                // Scroll up
                if (currentStep > 0) {
                    if (isActive) {
                        e.preventDefault();
                        isScrolling = true;
                        currentStep--;
                        updateContent(currentStep, -1);
                        setTimeout(() => { isScrolling = false; }, 1000);
                    }
                }
            }
        }, { passive: false });
    }

    // Section 5.5 Lens Case Interactive Scroll Logic
    const secLensCase = document.querySelector('.sec-lens-case');
    const lensContainer = document.querySelector('.lens-case-container');
    const textLeft = document.getElementById('lens-text-left');
    const textRight = document.getElementById('lens-text-right');

    const lensData = [
        {
            left: "Its compact size<br>makes it convenient<br>to wear anywhere,<br>anytime",
            right: "A special tool that can<br>be used indefinitely as<br>long as it isn't broken"
        },
        {
            left: "NERVISION is kept in a specialized sterile container that continuously calibrates its nanotech components.",
            right: "Removal from the case triggers immediate synchronization, preparing the organ for integration the moment it contacts the user's biological system."
        }
    ];

    let lensStep = 0;
    let isLensScrolling = false;

    if (secLensCase && lensContainer && textLeft && textRight) {
        
        const updateLensStep = (step) => {
            // Fade out text
            textLeft.style.opacity = '0';
            textRight.style.opacity = '0';
            
            setTimeout(() => {
                textLeft.innerHTML = lensData[step].left;
                textRight.innerHTML = lensData[step].right;
                
                // Fade in text
                textLeft.style.opacity = '1';
                textRight.style.opacity = '1';
            }, 600); // Wait for text fade out (CSS is 0.6s)

            // Toggle video state via CSS class
            if (step === 1) {
                lensContainer.classList.add('step-1');
            } else {
                lensContainer.classList.remove('step-1');
            }
        };

        secLensCase.addEventListener('wheel', (e) => {
            if (isLensScrolling) {
                e.preventDefault();
                return;
            }

            const rect = secLensCase.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            // Activate scroll hijack when mostly centered
            const threshold = viewHeight * 0.25;
            const isActive = rect.top <= threshold && rect.bottom >= (viewHeight - threshold);

            if (e.deltaY > 0) {
                // Scroll down
                if (lensStep < 1) {
                    if (isActive) {
                        e.preventDefault();
                        isLensScrolling = true;
                        lensStep++;
                        updateLensStep(lensStep);
                        setTimeout(() => { isLensScrolling = false; }, 1000);
                    }
                }
            } else if (e.deltaY < 0) {
                // Scroll up
                if (lensStep > 0) {
                    if (isActive) {
                        e.preventDefault();
                        isLensScrolling = true;
                        lensStep--;
                        updateLensStep(lensStep);
                        setTimeout(() => { isLensScrolling = false; }, 1000);
                    }
                }
            }
        }, { passive: false });
    }
});
