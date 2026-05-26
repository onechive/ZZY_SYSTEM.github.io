document.addEventListener("DOMContentLoaded", () => {
    // 1. Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

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

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-up-centered');
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

    // 5. Neuro Section Slider
    const neuroSection = document.querySelector('.neuro');
    if (neuroSection) {
        const bgTrack = document.getElementById('neuroBgTrack');
        const contentTrack = document.getElementById('neuroContentTrack');
        const prevBtn = neuroSection.querySelector('.neuro-prev');
        const nextBtn = neuroSection.querySelector('.neuro-next');
        const totalSlides = 2; // Assuming 2 slides for now based on markup
        let currentSlide = 0;

        function updateSlider() {
            if (bgTrack) bgTrack.style.transform = `translateX(-${currentSlide * 50}%)`;
            if (contentTrack) contentTrack.style.transform = `translateX(-${currentSlide * 50}%)`;
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider();
            });

            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            });
        }
    }

    // 6. Responsive Scaling for product.html Figma Container
    function adjustFigmaScale() {
        const container = document.querySelector('.figma-container');
        const viewport = document.querySelector('.figma-viewport');
        if (!container || !viewport) return;

        const baseWidth = 1920;
        const baseHeight = 11206;
        const viewportWidth = window.innerWidth;

        const scale = Math.min(1, viewportWidth / baseWidth);

        container.style.transform = `translateX(-50%) scale(${scale})`;
        container.style.transformOrigin = 'top center';
        viewport.style.height = `${baseHeight * scale}px`;
    }

    adjustFigmaScale();
    window.addEventListener('resize', adjustFigmaScale);
    window.addEventListener('load', adjustFigmaScale);
});
