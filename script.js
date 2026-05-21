document.addEventListener("DOMContentLoaded", () => {
    // 1. Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
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
        const photo1 = document.getElementById('lobby-photo-1');
        const photo2 = document.getElementById('lobby-photo-2');
        const info1top = document.getElementById('lobby-info-1-top');
        const info1bot = document.getElementById('lobby-info-1-bottom');
        const info2top = document.getElementById('lobby-info-2-top');
        const info2bot = document.getElementById('lobby-info-2-bottom');

        window.addEventListener('scroll', () => {
            const rect = lobbySection.getBoundingClientRect();
            // rect.top is 0 when section hits the top of viewport
            const progress = -rect.top / window.innerHeight;
            
            // 0 -> 0.5: scale down photo 1
            if (progress > 0) {
                photo1.classList.add('scaled');
            } else {
                photo1.classList.remove('scaled');
            }

            // 0.5 -> 1.0: crossfade to photo 2 and info 2
            if (progress > 0.5) {
                photo1.classList.remove('active');
                if (info1top) info1top.classList.remove('active');
                if (info1bot) info1bot.classList.remove('active');
                photo2.classList.add('active');
                if (info2top) info2top.classList.add('active');
                if (info2bot) info2bot.classList.add('active');
                photo2.classList.add('scaled');
            } else {
                photo1.classList.add('active');
                if (info1top) info1top.classList.add('active');
                if (info1bot) info1bot.classList.add('active');
                photo2.classList.remove('active');
                if (info2top) info2top.classList.remove('active');
                if (info2bot) info2bot.classList.remove('active');
                photo2.classList.remove('scaled');
            }
        });
    }
});
