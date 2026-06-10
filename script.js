document.addEventListener("DOMContentLoaded", () => {
    // 0. Autoplay helper for robotic arms video
    const roboticArmsVideo = document.getElementById('robotic-arms-video');
    if (roboticArmsVideo) {
        roboticArmsVideo.muted = true;
        roboticArmsVideo.loop = true;
        roboticArmsVideo.setAttribute('playsinline', '');
        roboticArmsVideo.setAttribute('autoplay', '');
        
        const attemptPlay = () => {
            const playPromise = roboticArmsVideo.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Try playing on user interaction if blocked by browser policy
                    document.body.addEventListener('touchstart', attemptPlay, { once: true });
                    document.body.addEventListener('click', attemptPlay, { once: true });
                    document.body.addEventListener('scroll', attemptPlay, { once: true });
                });
            }
        };
        attemptPlay();
    }

    // 1. Hamburger Menu Toggle
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    
    if (hamburgerBtn && fullscreenOverlay) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            fullscreenOverlay.classList.toggle('active');
        });
    }

    // 2. Scroll Reveal Animations (Fade in & up)
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible'); // Remove this if you want it to reveal only once
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(el => observer.observe(el));



    // 3. Spotlight Effect on Section 2 (Company Text)
    const companySection = document.querySelector('.company');
    const companyText = document.querySelector('.company-text-spotlight');

    if(companySection && companyText) {
        companySection.addEventListener('mousemove', (e) => {
            const rect = companyText.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            companyText.style.setProperty('--x', `${x}px`);
            companyText.style.setProperty('--y', `${y}px`);
        });

        companySection.addEventListener('mouseenter', () => {
            companyText.style.setProperty('--opacity', `1`);
        });

        companySection.addEventListener('mouseleave', () => {
            companyText.style.setProperty('--opacity', `0`);
        });
    }

    // 4. Mouse Particle Effect
    const canvas = document.getElementById('mouse-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        const mouse = { x: null, y: null };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
            for (let i = 0; i < 2; i++) {
                particlesArray.push(new Particle());
            }
        });

        class Particle {
            constructor() {
                this.x = mouse.x;
                this.y = mouse.y;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = 'rgba(255, 255, 255, 0.6)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.1) this.size -= 0.05;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function handleParticles() {
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
                
                if (particlesArray[i].size <= 0.1) {
                    particlesArray.splice(i, 1);
                    i--;
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            handleParticles();
            requestAnimationFrame(animateParticles);
        }
        
        animateParticles();
    }

    // 6. Team Page Spotlight Effect
    const teamCybernetic = document.querySelector('.team-cybernetic');
    const teamCyberneticText = document.querySelector('.team-cybernetic-text-spotlight');

    if(teamCybernetic && teamCyberneticText) {
        teamCybernetic.addEventListener('mousemove', (e) => {
            const rect = teamCyberneticText.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            teamCyberneticText.style.setProperty('--x', `${x}px`);
            teamCyberneticText.style.setProperty('--y', `${y}px`);
        });

        teamCybernetic.addEventListener('mouseenter', () => {
            teamCyberneticText.style.setProperty('--opacity', `1`);
        });

        teamCybernetic.addEventListener('mouseleave', () => {
            teamCyberneticText.style.setProperty('--opacity', `0`);
        });
    }

    // 7. Team Lobby Scroll Animation
    const lobbySection = document.getElementById('lobby-section');
    if (lobbySection) {
        const photos = [
            document.getElementById('lobby-photo-1'),
            document.getElementById('lobby-photo-2'),
            document.getElementById('lobby-photo-3'),
            document.getElementById('lobby-photo-4')
        ];
        
        const infosTop = [
            document.getElementById('lobby-info-1-top'),
            document.getElementById('lobby-info-2-top'),
            document.getElementById('lobby-info-3-top'),
            document.getElementById('lobby-info-4-top')
        ];
        
        const infosBot = [
            document.getElementById('lobby-info-1-bottom'),
            document.getElementById('lobby-info-2-bottom'),
            document.getElementById('lobby-info-3-bottom'),
            document.getElementById('lobby-info-4-bottom')
        ];

        window.addEventListener('scroll', () => {
            const rect = lobbySection.getBoundingClientRect();
            // rect.top is 0 when section hits the top of viewport
            const progress = -rect.top / window.innerHeight;
            
            let activeIndex = 0;
            if (progress >= 2.5) activeIndex = 3;
            else if (progress >= 1.5) activeIndex = 2;
            else if (progress >= 0.5) activeIndex = 1;

            photos.forEach((photo, idx) => {
                if (photo) {
                    if (idx === activeIndex) {
                        photo.classList.add('active');
                    } else {
                        photo.classList.remove('active');
                    }
                    
                    let scaleThreshold = (idx === 0) ? 0 : (idx - 0.5);
                    if (progress > scaleThreshold) {
                        photo.classList.add('scaled');
                    } else {
                        photo.classList.remove('scaled');
                    }
                }
            });

            infosTop.forEach((info, idx) => {
                if (info) {
                    if (idx === activeIndex) info.classList.add('active');
                    else info.classList.remove('active');
                }
            });

            infosBot.forEach((info, idx) => {
                if (info) {
                    if (idx === activeIndex) info.classList.add('active');
                    else info.classList.remove('active');
                }
            });
        });
    }

    // 8. Stagger Reveal Animation for texts
    class StaggerReveal {
        constructor(element) {
            this.element = element;
            this.delay = parseInt(this.element.dataset.delay) || 60; 
            this.prepare();
        }
        
        prepare() {
            const textNodes = [];
            const walker = document.createTreeWalker(this.element, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while(node = walker.nextNode()) {
                if (node.nodeValue.trim() !== '') {
                    textNodes.push(node);
                }
            }
            
            let letterCount = 0;
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                const fragment = document.createDocumentFragment();
                
                const words = text.split(/(\s+)/); 
                
                words.forEach(word => {
                    if (word.trim() === '') {
                        fragment.appendChild(document.createTextNode(word));
                    } else {
                        const wordSpan = document.createElement('span');
                        wordSpan.style.display = 'inline-flex';
                        wordSpan.style.overflow = 'hidden';
                        wordSpan.style.verticalAlign = 'bottom';
                        
                        word.split('').forEach(char => {
                            const charSpan = document.createElement('span');
                            charSpan.className = 'stagger-char';
                            charSpan.textContent = char;
                            if (!prefersReducedMotion) {
                                charSpan.style.transitionDelay = `${letterCount * this.delay}ms`;
                            }
                            wordSpan.appendChild(charSpan);
                            letterCount++;
                        });
                        
                        fragment.appendChild(wordSpan);
                    }
                });
                
                textNode.parentNode.replaceChild(fragment, textNode);
            });
        }
    }

    const staggerTargets = document.querySelectorAll('.stagger-reveal');
    staggerTargets.forEach(el => new StaggerReveal(el));

    // 9. Hero Scroll Assembly & Text 3D Interaction
    const heroSection = document.getElementById('hero');
    const heroSystemText = document.getElementById('hero-system-text');
    const stickyContainer = document.querySelector('.hero-sticky-container');
    
    const heroLayers = [
        document.querySelector('.layer-0'),
        document.querySelector('.layer-1'),
        document.querySelector('.layer-2'),
        document.querySelector('.layer-3')
    ];

    if (heroSection && heroSystemText && stickyContainer) {
        
        // Scroll Assembly Interaction
        window.addEventListener('scroll', () => {
            const rect = heroSection.getBoundingClientRect();
            
            // Calculate progress (0 to 1) as we scroll down the 400vh section
            const scrollRange = heroSection.offsetHeight - window.innerHeight;
            let progress = -rect.top / scrollRange;
            
            if (progress < 0) progress = 0;
            if (progress > 1) progress = 1;
            
            // 4 Layers to reveal:
            // Layer 0: 0.00 to 0.25
            // Layer 1: 0.25 to 0.50
            // Layer 2: 0.50 to 0.75
            // Layer 3: 0.75 to 1.00
            
            heroLayers.forEach((layer, index) => {
                if (!layer) return;
                
                const start = index * 0.25;
                const end = (index + 1) * 0.25;
                
                let layerProgress = (progress - start) / (end - start);
                if (layerProgress < 0) layerProgress = 0;
                if (layerProgress > 1) layerProgress = 1;
                
                // Fade in
                layer.style.opacity = layerProgress;
                
                // Slide up and scale down to normal size
                const translateY = 150 * (1 - layerProgress);
                const scale = 1 + 0.05 * (1 - layerProgress);
                
                layer.style.transform = `translateY(${translateY}px) scale(${scale})`;
            });
        });

        // 3D Text Mouse Interaction (attached to sticky container so it works correctly while scrolling)
        stickyContainer.addEventListener('mousemove', (e) => {
            const rect = stickyContainer.getBoundingClientRect();
            
            // Calculate mouse position relative to the center of the sticky container
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Calculate rotation based on mouse position
            const rotateX = -(y / rect.height) * 15; // Max 7.5 deg
            const rotateY = (x / rect.width) * 15;   // Max 7.5 deg

            heroSystemText.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        stickyContainer.addEventListener('mouseleave', () => {
            heroSystemText.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    }

    // 10. Equipment Full Screen Slider
    const eqTrack = document.getElementById('eqTrack');
    const eqThumbs = document.querySelectorAll('.eq-thumb');
    const eqSlides = document.querySelectorAll('.eq-slide');
    
    if (eqTrack && eqThumbs.length > 0) {
        // Clone the first slide to the end for seamless looping
        const firstClone = eqSlides[0].cloneNode(true);
        eqTrack.appendChild(firstClone);
        
        const totalOriginalSlides = eqSlides.length;
        let currentOffset = 0;
        let isEqPaused = false;
        let rafId;
        const scrollSpeed = 2.8; // continuous pan speed (increased from 1.5)
        
        let slideWidth = window.innerWidth;
        let currentThumbIndex = -1;

        // Remove transitions from track initially for smooth JS scrolling
        eqTrack.style.transition = 'none';

        function smoothScrollLoop() {
            if (!isEqPaused) {
                currentOffset += scrollSpeed;
                
                const maxOffset = totalOriginalSlides * slideWidth;
                
                if (currentOffset >= maxOffset) {
                    // Seamless loop back to the start
                    currentOffset = 0;
                }
                
                eqTrack.style.transform = `translateX(-${currentOffset}px)`;
                
                // Update active thumb based on nearest slide index (only if it changed)
                const nearestIndex = Math.round(currentOffset / slideWidth) % totalOriginalSlides;
                if (nearestIndex !== currentThumbIndex) {
                    if (currentThumbIndex >= 0 && eqThumbs[currentThumbIndex]) {
                        eqThumbs[currentThumbIndex].classList.remove('active');
                    }
                    if (eqThumbs[nearestIndex]) {
                        eqThumbs[nearestIndex].classList.add('active');
                    }
                    currentThumbIndex = nearestIndex;
                }
            }
            rafId = requestAnimationFrame(smoothScrollLoop);
        }
        
        function stopEqSmoothScroll(targetIndex) {
            isEqPaused = true;
            
            currentOffset = targetIndex * slideWidth;
            
            // Re-enable CSS transition for smooth snapping (sped up from 0.8s to 0.5s)
            eqTrack.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            eqTrack.style.transform = `translateX(-${currentOffset}px)`;
            
            // Update thumbs and show description
            if (currentThumbIndex >= 0 && eqThumbs[currentThumbIndex]) {
                eqThumbs[currentThumbIndex].classList.remove('active');
            }
            if (eqThumbs[targetIndex]) {
                eqThumbs[targetIndex].classList.add('active');
            }
            currentThumbIndex = targetIndex;
            
            document.querySelectorAll('.eq-slide').forEach(s => s.classList.remove('active-desc'));
            eqSlides[targetIndex].classList.add('active-desc');
        }
        
        function resumeEqSmoothScroll() {
            isEqPaused = false;
            eqTrack.style.transition = 'none';
            document.querySelectorAll('.eq-slide').forEach(s => s.classList.remove('active-desc'));
        }
        
        eqThumbs.forEach((thumb, idx) => {
            thumb.addEventListener('click', () => {
                if (isEqPaused && thumb.classList.contains('active')) {
                    // Clicked the active thumb while paused -> resume
                    resumeEqSmoothScroll();
                } else {
                    // Clicked any thumb while playing or clicked a different thumb -> stop and snap
                    stopEqSmoothScroll(idx);
                }
            });
        });
        
        window.addEventListener('resize', () => {
            slideWidth = window.innerWidth;
            if (isEqPaused) {
                if (currentThumbIndex >= 0) {
                    currentOffset = currentThumbIndex * slideWidth;
                    eqTrack.style.transition = 'none';
                    eqTrack.style.transform = `translateX(-${currentOffset}px)`;
                }
            }
        });
        
        // Start smooth loop
        rafId = requestAnimationFrame(smoothScrollLoop);
    }

    // 11. Product Page Sec-01 Scroll Interaction (Smooth Sticky Lerp)
    const prodSec01 = document.querySelector('.sec-01');
    const prodSec01Sticky = document.getElementById('sec01-sticky');
    
    if (prodSec01 && prodSec01Sticky) {
        let targetProgress = 0;
        let currentProgress = 0;
        let isAnimating = false;

        window.addEventListener('scroll', () => {
            const rect = prodSec01.getBoundingClientRect();
            // scrollRange is how far we can scroll down while sec-01 is sticky
            const scrollRange = prodSec01.offsetHeight - window.innerHeight;
            let progress = -rect.top / scrollRange;
            
            targetProgress = Math.max(0, Math.min(1, progress));
            
            if (!isAnimating) {
                isAnimating = true;
                requestAnimationFrame(smoothScrollAnim);
            }
        });

        function smoothScrollAnim() {
            // Lerp for smooth easing ("스르륵 수웅")
            currentProgress += (targetProgress - currentProgress) * 0.08;
            
            // Elements
            const titles = prodSec01Sticky.querySelector('.sec-01-titles');
            const bgTexts = prodSec01Sticky.querySelectorAll('.sec-01-bg-text');
            const lens = prodSec01Sticky.querySelector('.sec-01-lens');
            
            // 1. Titles fade out (completely invisible by ~66% progress)
            const titlesOpacity = 1 - (currentProgress * 1.5);
            if (titles) {
                titles.style.opacity = Math.max(0, titlesOpacity);
                // Also pull titles slightly upwards as they fade
                titles.style.transform = `translateY(-${currentProgress * 150}px) translateX(-50%)`;
                titles.style.left = '50%';
            }

            // 2. Background texts and Lens move downwards and scale up
            const translateY = currentProgress * 400; // Moves down 400px
            const scaleValue = 1 + (currentProgress * 1.0); // Grows slightly
            // Fade out completely by 100% of the scroll
            const mainOpacity = 1 - (currentProgress * 1.0); 

            bgTexts.forEach(txt => {
                txt.style.transform = `translateX(-50%) translateY(${translateY}px) scale(${scaleValue})`;
                txt.style.opacity = Math.max(0, mainOpacity);
            });

            if (lens) {
                lens.style.transform = `rotate(-23.68deg) translateY(${translateY}px) scale(${scaleValue})`;
                lens.style.opacity = Math.max(0, mainOpacity);
            }

            // 3. Highlighter effect trigger
            const highlights = prodSec01Sticky.querySelectorAll('.magic-underline, .magic-highlight-solid');
            if (currentProgress < 0.05) {
                highlights.forEach(h => h.classList.add('active'));
            } else {
                highlights.forEach(h => h.classList.remove('active'));
            }

            // Continue animating if we haven't reached target
            if (Math.abs(targetProgress - currentProgress) > 0.001) {
                requestAnimationFrame(smoothScrollAnim);
            } else {
                isAnimating = false;
            }
        }
        
        // Initial setup
        const initialRect = prodSec01.getBoundingClientRect();
        if(initialRect.top <= 0) {
            targetProgress = Math.max(0, Math.min(1, -initialRect.top / (prodSec01.offsetHeight - window.innerHeight)));
            currentProgress = targetProgress;
            smoothScrollAnim();
        } else {
            // Force highlighter on initial load if at top
            const highlights = prodSec01Sticky.querySelectorAll('.magic-underline, .magic-highlight-solid');
            highlights.forEach(h => h.classList.add('active'));
        }
    }


    // 12. Page Transition (Blinds Effect)
    const sliceCount = 10;
    const transitionDuration = 600; // ms (must match CSS)
    const staggerDelay = 50; // ms

    // Get the existing overlay elements
    let transitionOverlay = document.getElementById('page-transition-overlay');
    
    if (transitionOverlay) {
        const slices = transitionOverlay.querySelectorAll('.pt-slice');

        // On Page Load: Un-blind (reveal the page)
        requestAnimationFrame(() => {
            slices.forEach((slice, idx) => {
                // We want the slices to shrink downwards
                slice.style.transformOrigin = 'bottom';
                setTimeout(() => {
                    slice.style.transform = 'scaleY(0)';
                }, idx * staggerDelay);
            });
            
            // Optional: pointer-events none is handled by CSS, but we can clean it up
            setTimeout(() => {
                transitionOverlay.style.pointerEvents = 'none';
            }, (sliceCount * staggerDelay) + transitionDuration);
        });

        // Handle Link Clicks: Blind (cover the page) then navigate
        const overlayLinks = document.querySelectorAll('.overlay-link');
        overlayLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetUrl = this.getAttribute('href');

                // Set transform origin to top so they slide down to cover
                transitionOverlay.style.pointerEvents = 'auto'; // Block clicks during transition
                slices.forEach((slice, idx) => {
                    slice.style.transformOrigin = 'top';
                    setTimeout(() => {
                        slice.style.transform = 'scaleY(1)';
                    }, idx * staggerDelay);
                });

                // Calculate total time: last slice's delay + CSS transition duration + slight buffer
                const totalAnimationTime = (sliceCount * staggerDelay) + transitionDuration + 100;
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, totalAnimationTime);
            });
        });
    }

});
