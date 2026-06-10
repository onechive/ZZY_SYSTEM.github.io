/* intro.js */
/* Core idea: 
   The script manages the state of the verification popup and drives the WebGL ripple effect.
   The Ripple effect uses a lightweight custom WebGL shader. On mouse/touch move, ripples are spawned and passed to the fragment shader. 
   The shader uses a sine wave function based on distance and age to displace UV coordinates of a generated grid pattern.
   It also draws a dreamy spotlight gradient at the lerped mouse coordinates, cycling colors smoothly between #3B1A4C, #1A234C, and #142F45.
   
   UX Optimization: Once verified, sessionStorage preserves the verified state so navigations back to Home (index.html) bypass verification.
*/

// Check verification status immediately to prevent layout flashes
if (sessionStorage.getItem('verified') === 'true') {
    window.location.replace('main.html');
}

document.addEventListener('DOMContentLoaded', () => {
    // If already verified, do not run any initialization
    if (sessionStorage.getItem('verified') === 'true') return;

    // --- UI Logic ---
    const verifyBtn = document.getElementById('verify-btn');
    const verifyUi = document.getElementById('verify-ui');
    const loadingUi = document.getElementById('loading-ui');
    const successUi = document.getElementById('success-ui');

    verifyBtn.addEventListener('click', () => {
        // Hide verify UI, Show loading UI
        verifyUi.classList.add('hidden');
        loadingUi.classList.remove('hidden');

        // Simulate 3 seconds loading
        setTimeout(() => {
            loadingUi.classList.add('hidden');
            successUi.classList.remove('hidden');
            
            // Save verified state in session storage
            sessionStorage.setItem('verified', 'true');

            // Redirect to main page after 1 second success message
            setTimeout(() => {
                window.location.replace('main.html');
            }, 1000);
        }, 3000);
    });

    // --- WebGL Ripple / Distortion on Hover ---
    const canvas = document.getElementById('ripple-canvas');
    const gl = canvas.getContext('webgl', { alpha: false, antialias: false });

    if (!gl) {
        console.warn('WebGL not supported');
        return;
    }

    // Tunable parameters as requested
    const params = {
        speed: 0.55 * 5.0, // Scaled for shader time
        freq: 32.0,
        amp: 0.05,
        life: 2.8
    };

    const VS = `
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
            vUv = position * 0.5 + 0.5;
            vUv.y = 1.0 - vUv.y;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `;

    // Fragment shader with up to 32 ripples to keep performance high
    const FS = `
        precision highp float;
        varying vec2 vUv;
        uniform vec2 uResolution;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseActive;
        
        uniform vec3 uRipples[32]; // x, y, age
        uniform int uRippleCount;

        uniform float uSpeed;
        uniform float uFreq;
        uniform float uAmp;
        uniform float uLife;

        void main() {
            vec2 uv = vUv;
            vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
            
            vec2 totalOffset = vec2(0.0);
            
            for(int i = 0; i < 32; i++) {
                if(i >= uRippleCount) break;
                
                vec2 center = uRipples[i].xy;
                float age = uRipples[i].z;
                
                vec2 dir = (uv - center) * aspect;
                float dist = length(dir);
                
                // Wave phase
                float phase = dist * uFreq - age * uSpeed;
                
                // Attenuation over time and distance
                float attenuation = max(0.0, 1.0 - (age / uLife));
                attenuation *= smoothstep(0.4, 0.0, dist); 
                
                float wave = sin(phase);
                
                // Displace UVs
                totalOffset += normalize(dir) * wave * uAmp * attenuation;
            }
            
            vec2 distortedUv = uv + totalOffset;
            
            // Draw a subtle dotted/line grid as background
            vec2 gridUv = distortedUv * 40.0;
            gridUv.x *= aspect.x;
            vec2 grid = fract(gridUv);
            
            float line = smoothstep(0.0, 0.05, grid.x) * smoothstep(0.95, 1.0, grid.x) + 
                         smoothstep(0.0, 0.05, grid.y) * smoothstep(0.95, 1.0, grid.y);
            
            // --- Dreamy background colors (spotlight) ---
            // Colors:
            // C1: #3B1A4C -> vec3(0.231, 0.102, 0.298)
            // C2: #1A234C -> vec3(0.102, 0.137, 0.298)
            // C3: #142F45 -> vec3(0.078, 0.184, 0.271)
            
            vec3 c1 = vec3(0.231, 0.102, 0.298);
            vec3 c2 = vec3(0.102, 0.137, 0.298);
            vec3 c3 = vec3(0.078, 0.184, 0.271);
            
            // Slowly cycle spotlight base color
            float t = uTime * 0.8;
            vec3 spotColor = mix(c1, c2, sin(t) * 0.5 + 0.5);
            spotColor = mix(spotColor, c3, cos(t * 0.6) * 0.5 + 0.5);
            
            // Calculate distance to lerped mouse position
            vec2 mouseDir = (distortedUv - uMouse) * aspect;
            float mouseDist = length(mouseDir);
            
            // Dreamy spotlight: soft circular gradient
            float spotGlow = smoothstep(0.65, 0.0, mouseDist) * uMouseActive;
            vec3 spotlight = spotColor * spotGlow * 1.8;
            
            // Slow floating background ambient light so it's not totally black when mouse is inactive
            vec2 amb1 = vec2(0.25 + sin(uTime * 0.15) * 0.08, 0.35 + cos(uTime * 0.2) * 0.08);
            vec2 amb2 = vec2(0.75 + cos(uTime * 0.12) * 0.08, 0.65 + sin(uTime * 0.25) * 0.08);
            
            float glow1 = smoothstep(0.6, 0.0, length((distortedUv - amb1) * aspect));
            float glow2 = smoothstep(0.6, 0.0, length((distortedUv - amb2) * aspect));
            
            vec3 ambient = c2 * glow1 * 0.4 + c3 * glow2 * 0.4;
            
            vec3 bgColor = vec3(0.01, 0.01, 0.015) + ambient + spotlight;
            vec3 lineColor = vec3(0.08, 0.12, 0.16) + ambient * 0.3 + spotlight * 0.2;
            
            // Vignette for aesthetic depth
            float vignette = 1.0 - length(vUv - 0.5) * 1.25;
            
            vec3 color = mix(bgColor, lineColor, line) * vignette;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    function compileShader(type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(gl.getShaderInfoLog(shader));
            return null;
        }
        return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, VS);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, FS);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full screen quad
    const vertices = new Float32Array([
        -1, -1,  1, -1, -1,  1,
        -1,  1,  1, -1,  1,  1
    ]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolutionLocation = gl.getUniformLocation(program, "uResolution");
    const uRipplesLocation = gl.getUniformLocation(program, "uRipples");
    const uRippleCountLocation = gl.getUniformLocation(program, "uRippleCount");
    const uTimeLocation = gl.getUniformLocation(program, "uTime");
    const uMouseLocation = gl.getUniformLocation(program, "uMouse");
    const uMouseActiveLocation = gl.getUniformLocation(program, "uMouseActive");
    
    gl.uniform1f(gl.getUniformLocation(program, "uSpeed"), params.speed);
    gl.uniform1f(gl.getUniformLocation(program, "uFreq"), params.freq);
    gl.uniform1f(gl.getUniformLocation(program, "uAmp"), params.amp);
    gl.uniform1f(gl.getUniformLocation(program, "uLife"), params.life);

    let ripples = [];
    let lastMouse = { x: 0, y: 0 };
    let targetMouse = { x: 0.5, y: 0.5 };
    let currentMouse = { x: 0.5, y: 0.5 };
    let mouseActive = 0.0;
    let mouseActiveTarget = 0.0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    // Spawn ripples and update mouse coords on interaction
    function handlePointer(e) {
        let clientX = e.clientX;
        let clientY = e.clientY;
        if(e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }
        
        const x = clientX / window.innerWidth;
        const y = 1.0 - (clientY / window.innerHeight);

        targetMouse.x = x;
        targetMouse.y = y;
        mouseActiveTarget = 1.0;

        const dx = clientX - lastMouse.x;
        const dy = clientY - lastMouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        // Spawn a ripple if moved enough
        if (dist > 15) {
            ripples.push({ x, y, age: 0 });
            if (ripples.length > 32) {
                ripples.shift();
            }
            lastMouse.x = clientX;
            lastMouse.y = clientY;
        }
    }

    document.addEventListener('mousemove', handlePointer);
    document.addEventListener('touchmove', handlePointer, {passive: true});

    document.addEventListener('mouseleave', () => {
        mouseActiveTarget = 0.0;
    });
    document.addEventListener('mouseenter', () => {
        mouseActiveTarget = 1.0;
    });

    const startTime = performance.now();
    let lastTime = performance.now();

    function render(time) {
        const dt = (time - lastTime) / 1000.0;
        lastTime = time;
        const elapsed = (time - startTime) / 1000.0;

        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            // Update ripple ages and filter out dead ones
            ripples.forEach(r => r.age += dt);
            ripples = ripples.filter(r => r.age < params.life);

            // Lerp mouse
            currentMouse.x += (targetMouse.x - currentMouse.x) * 0.08;
            currentMouse.y += (targetMouse.y - currentMouse.y) * 0.08;
            mouseActive += (mouseActiveTarget - mouseActive) * 0.05;

            // Pass to shader
            gl.uniform1f(uTimeLocation, elapsed);
            gl.uniform2f(uMouseLocation, currentMouse.x, currentMouse.y);
            gl.uniform1f(uMouseActiveLocation, mouseActive);

            if (ripples.length > 0) {
                const rippleData = new Float32Array(32 * 3);
                for (let i = 0; i < ripples.length; i++) {
                    rippleData[i*3] = ripples[i].x;
                    rippleData[i*3+1] = ripples[i].y;
                    rippleData[i*3+2] = ripples[i].age;
                }
                gl.uniform3fv(uRipplesLocation, rippleData);
            }
            gl.uniform1i(uRippleCountLocation, ripples.length);

            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        
        requestAnimationFrame(render);
    }
    
    requestAnimationFrame(render);
});
