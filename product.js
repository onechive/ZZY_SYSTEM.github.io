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
    const lensSticky = document.getElementById('lens-sticky');
    const lensVideoWrapper = document.getElementById('lens-video-wrapper');
    const textLeft = document.getElementById('lens-text-left');
    const textRight = document.getElementById('lens-text-right');
    const video1 = document.getElementById('lens-video-1');
    const video2 = document.getElementById('lens-video-2');

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

    if (secLensCase && lensSticky && textLeft && textRight) {
        let currentLensPhase = 0;
        
        // Setup initial state
        textLeft.innerHTML = lensData[0].left;
        textRight.innerHTML = lensData[0].right;
        textRight.style.opacity = 1; // override any css hiding
        
        window.addEventListener('scroll', () => {
            const rect = secLensCase.getBoundingClientRect();
            const totalScroll = secLensCase.offsetHeight - window.innerHeight;
            let progress = 0;
            
            if (rect.top <= 0) {
                progress = -rect.top / totalScroll;
            }
            progress = Math.max(0, Math.min(1, progress));

            // Scale logic: 1 -> 4.5 -> 1
            let scale = 1;
            if (progress <= 0.3) {
                scale = 1 + (progress / 0.3) * 3.5;
            } else if (progress <= 0.6) {
                scale = 4.5;
            } else if (progress <= 0.9) {
                scale = 4.5 - ((progress - 0.6) / 0.3) * 3.5;
            } else {
                scale = 1;
            }
            lensVideoWrapper.style.transform = `scale(${scale})`;

            // Color logic: Background to white, Text to black while expanded
            if (progress > 0.15 && progress < 0.75) {
                lensSticky.style.backgroundColor = '#fff';
                textLeft.style.color = '#000';
                textRight.style.color = '#000';
            } else {
                lensSticky.style.backgroundColor = '#000';
                textLeft.style.color = '#fff';
                textRight.style.color = '#fff';
            }

            // Crossfade Video and Text logic
            if (progress < 0.35) {
                video1.style.opacity = 1;
                video2.style.opacity = 0;
                
                if (currentLensPhase !== 0) {
                    textLeft.style.opacity = 0;
                    textRight.style.opacity = 0;
                    setTimeout(() => {
                        textLeft.innerHTML = lensData[0].left;
                        textRight.innerHTML = lensData[0].right;
                        textLeft.style.opacity = 1;
                        textRight.style.opacity = 1;
                    }, 150);
                    currentLensPhase = 0;
                } else if (textLeft.style.opacity === '0') {
                    // Fail safe if timeout missed
                    textLeft.style.opacity = 1;
                    textRight.style.opacity = 1;
                }
            } else if (progress >= 0.35 && progress <= 0.55) {
                const fadeProgress = (progress - 0.35) / 0.2;
                video1.style.opacity = 1 - fadeProgress;
                video2.style.opacity = fadeProgress;
            } else {
                video1.style.opacity = 0;
                video2.style.opacity = 1;
                
                if (currentLensPhase !== 1) {
                    textLeft.style.opacity = 0;
                    textRight.style.opacity = 0;
                    setTimeout(() => {
                        textLeft.innerHTML = lensData[1].left;
                        textRight.innerHTML = lensData[1].right;
                        textLeft.style.opacity = 1;
                        textRight.style.opacity = 1;
                    }, 150);
                    currentLensPhase = 1;
                } else if (textLeft.style.opacity === '0') {
                    textLeft.style.opacity = 1;
                    textRight.style.opacity = 1;
                }
            }
        });
        
        // Force playback robustly for both videos
        [video1, video2].forEach(vid => {
            if (vid) {
                vid.muted = true;
                vid.setAttribute('playsinline', '');
                vid.setAttribute('autoplay', '');
                const attemptPlay = () => {
                    const playPromise = vid.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            document.body.addEventListener('touchstart', attemptPlay, { once: true });
                            document.body.addEventListener('click', attemptPlay, { once: true });
                            document.body.addEventListener('scroll', attemptPlay, { once: true });
                        });
                    }
                };
                attemptPlay();
            }
        });
    }

    // Section 5.7 Hamburger Scrub Logic
    const secHamburger = document.querySelector('.sec-hamburger');
    const hamburgerVideo = document.getElementById('hamburger-video');
    const hbTexts = [
        document.getElementById('hb-text-1'),
        document.getElementById('hb-text-2'),
        document.getElementById('hb-text-3'),
        document.getElementById('hb-text-4')
    ];

    if (secHamburger && hamburgerVideo) {
        let scrollProgress = 0;
        let currentVideoTime = 0;
        let targetVideoTime = 0;
        let scrubAnimationId = null;

        // Make sure video is loaded to get duration
        hamburgerVideo.load();

        function smoothScrub() {
            // Lerp current time towards target time for smooth "stop-motion" removal
            currentVideoTime += (targetVideoTime - currentVideoTime) * 0.1;
            
            // Only update if the difference is noticeable to save performance
            if (Math.abs(currentVideoTime - hamburgerVideo.currentTime) > 0.03) {
                hamburgerVideo.currentTime = currentVideoTime;
            }

            // Continue loop if not reached target yet
            if (Math.abs(targetVideoTime - currentVideoTime) > 0.005) {
                scrubAnimationId = requestAnimationFrame(smoothScrub);
            } else {
                scrubAnimationId = null;
            }
        }

        window.addEventListener('scroll', () => {
            const rect = secHamburger.getBoundingClientRect();
            const totalScroll = secHamburger.offsetHeight - window.innerHeight;
            let progress = 0;
            
            if (rect.top <= 0 && totalScroll > 0) {
                progress = -rect.top / totalScroll;
            }
            if (rect.top > 0) progress = 0;
            if (-rect.top >= totalScroll) progress = 1;
            
            scrollProgress = progress;

            // Handle Text Fading based on progress
            const thresholds = [0.1, 0.35, 0.6, 0.85];
            hbTexts.forEach((text, i) => {
                if (text) {
                    if (progress > thresholds[i]) {
                        text.style.opacity = 1;
                        text.style.transform = 'translateY(0)';
                    } else {
                        text.style.opacity = 0;
                        text.style.transform = 'translateY(20px)';
                    }
                }
            });

            if (hamburgerVideo.duration) {
                targetVideoTime = scrollProgress * hamburgerVideo.duration;
                if (!scrubAnimationId) {
                    scrubAnimationId = requestAnimationFrame(smoothScrub);
                }
            }
        });
    }

    // Section 2 Scroll Reveal Text
    const sec02 = document.querySelector('.sec-02');
    const sec02Text = document.getElementById('sec02-text');
    
    if (sec02 && sec02Text) {
        // Split text into words and wrap in spans
        const words = sec02Text.innerText.split(' ');
        sec02Text.innerHTML = '';
        words.forEach(word => {
            const span = document.createElement('span');
            span.innerText = word + ' ';
            sec02Text.appendChild(span);
        });

        const spans = sec02Text.querySelectorAll('span');

        window.addEventListener('scroll', () => {
            const rect = sec02.getBoundingClientRect();
            
            // The section is sticky. It starts sticking when rect.top <= 0.
            // The total scrollable distance for the effect is sec02 height minus viewport height.
            const totalScroll = sec02.offsetHeight - window.innerHeight;
            
            let progress = 0;
            
            if (rect.top <= 0) {
                // How far we've scrolled while it's sticking
                const scrolled = -rect.top;
                // Add a small buffer so it finishes revealing slightly before unsticking
                progress = scrolled / (totalScroll * 0.8);
            }
            
            progress = Math.max(0, Math.min(1, progress));
            
            const activeCount = Math.floor(progress * spans.length);
            
            spans.forEach((span, index) => {
                if (index < activeCount) {
                    span.classList.add('active');
                } else {
                    span.classList.remove('active');
                }
            });
        });
        
        // Trigger once on load
        window.dispatchEvent(new Event('scroll'));
    }

    // Section 3 Hand Scale Effect
    const sec03 = document.querySelector('.sec-03');
    const sec03HandContainer = document.querySelector('.sec-03-hand-container');
    const sec03Text = document.querySelector('.sec-03-text-content');
    
    if (sec03 && sec03HandContainer && sec03Text) {
        window.addEventListener('scroll', () => {
            const rect = sec03.getBoundingClientRect();
            const totalScroll = sec03.offsetHeight - window.innerHeight;
            
            let progress = 0;
            if (rect.top <= 0) {
                progress = -rect.top / totalScroll;
            }
            progress = Math.max(0, Math.min(1, progress));
            
            // Scale hand from 1 to 20 to fill the screen
            const scale = 1 + (progress * 19);
            sec03HandContainer.style.transform = `scale(${scale})`;
            
            // Smoothly fade out the big text AND the subtitle text as the image scales
            // "사진 화면이 커질 때 텍스트 투명도가 0%으로 해서 부드럽게 전환"
            const textOpacity = Math.max(0, 1 - (progress * 2.5));
            sec03Text.style.opacity = textOpacity;
            const subtitle = sec03HandContainer.querySelector('.sec-03-subtitle-new');
            if (subtitle) {
                subtitle.style.opacity = textOpacity;
            }
            
            // Fade out the hand image when it gets extremely large (progress > 0.6)
            // to prevent seeing broken pixels at the very end of the transition
            if (progress > 0.6) {
                sec03HandContainer.style.opacity = Math.max(0, 1 - ((progress - 0.6) * 3.33));
            } else {
                sec03HandContainer.style.opacity = 1;
            }
        });
        
        // Force video playback robustly
        const bgVideo = document.querySelector('.sec-03-bg-video');
        if (bgVideo) {
            bgVideo.muted = true;
            bgVideo.setAttribute('muted', '');
            bgVideo.setAttribute('playsinline', '');
            bgVideo.setAttribute('autoplay', '');
            
            const attemptPlay = () => {
                const playPromise = bgVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Autoplay blocked, wait for interaction
                        document.body.addEventListener('touchstart', attemptPlay, { once: true });
                        document.body.addEventListener('click', attemptPlay, { once: true });
                        document.body.addEventListener('scroll', attemptPlay, { once: true });
                    });
                }
            };
            attemptPlay();
        }
    }

    /**
     * Text Displacement Effect
     * Letters flinch around the cursor with a Gaussian falloff.
     */
    class TextDisplacement {
        constructor(element, options = {}) {
            this.el = element;
            this.strength = options.strength !== undefined ? options.strength : 60;
            this.radius = options.radius !== undefined ? options.radius : 32;
            
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            this.spans = [];
            this.rects = [];
            this.mouseX = 0;
            this.mouseY = 0;
            this.targetMouseX = 0;
            this.targetMouseY = 0;
            this.isHovering = false;
            
            this.init();
        }
        
        init() {
            const text = this.el.innerText;
            this.el.innerHTML = '';
            
            const words = text.split(' ');
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.style.display = 'inline-block';
                wordSpan.style.whiteSpace = 'nowrap';
                
                for (let i = 0; i < word.length; i++) {
                    const charSpan = document.createElement('span');
                    charSpan.innerText = word[i];
                    charSpan.style.display = 'inline-block';
                    charSpan.style.transition = 'transform 0.1s linear';
                    charSpan.style.willChange = 'transform';
                    wordSpan.appendChild(charSpan);
                    this.spans.push(charSpan);
                }
                
                this.el.appendChild(wordSpan);
                if (wordIndex < words.length - 1) {
                    this.el.appendChild(document.createTextNode(' '));
                }
            });

            window.addEventListener('resize', () => this.calcRects());
            // Need a small delay to ensure fonts/layout are loaded before calculating
            setTimeout(() => this.calcRects(), 100);

            document.addEventListener('mousemove', (e) => {
                this.targetMouseX = e.clientX;
                this.targetMouseY = e.clientY;
                if (!this.isHovering) {
                    this.isHovering = true;
                    this.update();
                }
            });
            
            this.update = this.update.bind(this);
        }
        
        calcRects() {
            this.scrollY = window.scrollY;
            this.rects = this.spans.map(span => {
                const rect = span.getBoundingClientRect();
                return {
                    cx: rect.left + rect.width / 2,
                    cy: rect.top + rect.height / 2 + this.scrollY
                };
            });
        }
        
        update() {
            this.mouseX += (this.targetMouseX - this.mouseX) * 0.2;
            this.mouseY += (this.targetMouseY - this.mouseY) * 0.2;

            let anyMoved = false;
            const currentScrollY = window.scrollY;

            // Only run if we actually have rects
            if (this.rects.length > 0) {
                for (let i = 0; i < this.spans.length; i++) {
                    const rect = this.rects[i];
                    const dx = rect.cx - this.mouseX;
                    const dy = (rect.cy - currentScrollY) - this.mouseY;
                    const distSq = dx * dx + dy * dy;
                    
                    const rSq = (this.radius * 10) * (this.radius * 10); 
                    const force = Math.exp(-distSq / (2 * rSq));
                    
                    if (force > 0.01) {
                        anyMoved = true;
                        const dist = Math.sqrt(distSq) || 1;
                        const pushX = (dx / dist) * force * this.strength;
                        const pushY = (dy / dist) * force * this.strength;
                        
                        this.spans[i].style.transform = `translate(${pushX}px, ${pushY}px)`;
                    } else {
                        this.spans[i].style.transform = `translate(0px, 0px)`;
                    }
                }
            }

            if (anyMoved || Math.abs(this.targetMouseX - this.mouseX) > 0.1) {
                requestAnimationFrame(this.update);
            } else {
                this.isHovering = false;
            }
        }
    }

    // Initialize Text Displacement for Sec-04 Text
    const sec04HeaderH2 = document.querySelector('.sec-04-header h2');
    const sec04HeaderP = document.querySelector('.sec-04-header p');
    if (sec04HeaderH2) new TextDisplacement(sec04HeaderH2, { strength: 60, radius: 32 });
    if (sec04HeaderP) new TextDisplacement(sec04HeaderP, { strength: 40, radius: 25 });
});
