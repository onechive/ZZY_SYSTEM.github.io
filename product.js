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

    const prevBtn = document.getElementById('sec05-prev');
    const nextBtn = document.getElementById('sec05-next');
    
    const titleEl = document.getElementById('step-title');
    const descEl = document.getElementById('step-desc');
    const featuresEl = document.getElementById('step-features');
    const imageEl = document.getElementById('step-image');
    const bigImageEl = document.getElementById('step-big-image');
    
    // Check if elements exist before attaching listeners
    if (prevBtn && nextBtn && titleEl && descEl && featuresEl && imageEl && bigImageEl) {
        
        const updateContent = (index) => {
            const data = sec05Data[index];
            
            // Apply fade out effect
            titleEl.style.opacity = 0;
            descEl.style.opacity = 0;
            featuresEl.style.opacity = 0;
            imageEl.style.opacity = 0;
            bigImageEl.style.opacity = 0;
            
            setTimeout(() => {
                // Update content
                titleEl.innerHTML = data.title;
                descEl.innerHTML = data.desc;
                imageEl.src = data.image;
                bigImageEl.src = data.bigImage;
                
                // Update features list
                featuresEl.innerHTML = '';
                data.features.forEach(feat => {
                    const div = document.createElement('div');
                    div.className = 'feat';
                    div.innerHTML = feat;
                    featuresEl.appendChild(div);
                });
                
                // Apply fade in effect
                titleEl.style.transition = 'opacity 0.4s ease';
                descEl.style.transition = 'opacity 0.4s ease';
                featuresEl.style.transition = 'opacity 0.4s ease';
                imageEl.style.transition = 'opacity 0.4s ease';
                bigImageEl.style.transition = 'opacity 0.4s ease';
                
                titleEl.style.opacity = 1;
                descEl.style.opacity = 1;
                featuresEl.style.opacity = 1;
                imageEl.style.opacity = 1;
                bigImageEl.style.opacity = 1;
            }, 400); // match transition time
        };

        prevBtn.addEventListener('click', () => {
            currentStep = (currentStep - 1 + sec05Data.length) % sec05Data.length;
            updateContent(currentStep);
        });

        nextBtn.addEventListener('click', () => {
            currentStep = (currentStep + 1) % sec05Data.length;
            updateContent(currentStep);
        });
    }
});
