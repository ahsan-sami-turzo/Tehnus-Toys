/**
 * TEHNUS TOYS - 16 Sound Edition
 * Features: Synthetic noise generation, rhythmic looping, and shake detection.
 */

let audioCtx;
let noiseBuffer;
let selectedToy = 'rattle';
let lastShake = 0;
let loopInterval = null;
let isLooping = false;

// 1. SYSTEM INITIALIZATION
function initAudio() {
    if (audioCtx) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create shared noise buffer for Rattle, Maraca, Crinkle, etc.
    const bufferSize = audioCtx.sampleRate * 2;
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
}

// Utility to get shake intensity (scaled for audio)
const getIntensity = () => 0.8; 

/**
 * 2. THE TOY SYNTH ENGINE
 */
const ToySynth = {
    rattle() {
        const now = audioCtx.currentTime;
        const beadCount = 8;
        for (let i = 0; i < beadCount; i++) {
            const startTime = now + (Math.random() * 0.05);
            const source = audioCtx.createBufferSource();
            source.buffer = noiseBuffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 3000 + (Math.random() * 2000);
            const gain = audioCtx.createGain();
            const duration = 0.02 + (Math.random() * 0.03);
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.3, startTime + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            source.connect(filter).connect(gain).connect(audioCtx.destination);
            source.start(startTime);
        }
    },

    bell(freq = 880) {
        const now = audioCtx.currentTime;
        [1, 2, 3, 4.2].forEach((ratio, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.setValueAtTime(freq * ratio, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.3 / (i + 1), now + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (1.0 / ratio));
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 1);
        });
    },

    wood() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.6, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
    },

    maraca() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },

    crinkle() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now, Math.random(), 0.2);
    },

    squeak() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
    },

    jingle() {
        const now = audioCtx.currentTime;
        [1200, 2500, 3100].forEach(f => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = f;
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 0.3);
        });
    },

    thump() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
    },

    duck() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 900;
        filter.Q.value = 5;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },

    musicbox() {
        const now = audioCtx.currentTime;
        const sequence = [523, 659, 784, 1046];
        sequence.forEach((freq, i) => {
            const time = now + (i * 0.2);
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(time); osc.stop(time + 0.4);
        });
    },

    whistle() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },

    splash() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.5);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },

    pop() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + 0.02);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.05);
    },

    laser() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.15);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.15);
    },

    boing() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        // Tin cans have a metallic, slightly dissonant "ping"
        osc.type = 'triangle'; 
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.01);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        // Add a second high-pitched oscillator for the "metallic" ring
        const ring = audioCtx.createOscillator();
        const ringGain = audioCtx.createGain();
        ring.frequency.setValueAtTime(2450, now);
        ringGain.gain.setValueAtTime(0.1, now);
        ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain).connect(audioCtx.destination);
        ring.connect(ringGain).connect(audioCtx.destination);
        
        osc.start(now); osc.stop(now + 0.2);
        ring.start(now); ring.stop(now + 0.1);
    },

    twinkle() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(1500 + Math.random() * 500, now);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.1);
    }
};

/**
 * 3. CONTROLS & EVENT LISTENERS
 */
function startLoop() {
    if (isLooping) stopLoop();
    isLooping = true;
    document.getElementById('btn-loop').classList.add('active-loop');
    const playTick = () => {
        if (!isLooping) return;
        ToySynth[selectedToy]();
        loopInterval = setTimeout(playTick, 300);
    };
    playTick();
}

function stopLoop() {
    isLooping = false;
    clearTimeout(loopInterval);
    document.getElementById('btn-loop').classList.remove('active-loop');
}

function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const mag = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    if (mag > 18.0 && (Date.now() - lastShake) > 150) {
        if (isLooping) stopLoop();

        // RAINBOW LOGIC START
        const newHue = Math.floor(Math.random() * 360);
        document.body.style.setProperty('--bg-hue', newHue);
        
        // PARTICLE VISUALIZER
        createBurst(); 
        triggerRainbow()

        // SOUND GENERATION
        initAudio();
        ToySynth[selectedToy]();
        if (navigator.vibrate) navigator.vibrate(50);
        lastShake = Date.now();        
    }
}


/**
 * PARTICLE SYSTEM ENGINE
 */
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let particles = [];

// Resize canvas to fit screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() * 10 - 5);
        this.speedY = (Math.random() * 10 - 5);
        this.color = color;
        this.opacity = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 0.02; // Fade out speed
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createBurst() {
    // Generate particles in a random location or center
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const hue = getComputedStyle(document.body).getPropertyValue('--bg-hue');
    
    for (let i = 0; i < 30; i++) {
        // Particles are slightly offset in color from the background for visibility
        const color = `hsl(${(parseInt(hue) + 40) % 360}, 70%, 60%)`;
        particles.push(new Particle(x, y, color));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Remove "dead" particles
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateParticles);
}

// Start the animation loop
animateParticles();

// User Start Button
document.getElementById('btn-start').addEventListener('click', async () => {
    initAudio();
    await audioCtx.resume();
    // iOS Motion Permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        await DeviceMotionEvent.requestPermission();
    }
    document.getElementById('permission-overlay').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    window.addEventListener('devicemotion', handleMotion);
});

// Grid Selection
document.querySelectorAll('.toy-card').forEach(card => {
    card.addEventListener('click', () => {
        stopLoop();
        initAudio();
        selectedToy = card.dataset.sound;
        document.querySelectorAll('.toy-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        ToySynth[selectedToy](); // Play once to test

        // Add this to test color change on tap:
        const newHue = Math.floor(Math.random() * 360);
        document.body.style.setProperty('--bg-hue', newHue);
    });
});

document.getElementById('btn-loop').addEventListener('click', startLoop);
document.getElementById('btn-stop').addEventListener('click', stopLoop);


/**
 * PWA AUTO-UPDATE LOGIC
 */
if ('serviceWorker' in navigator) {
    let refreshing = false;

    // Detect when the new Service Worker takes control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            // Reload the page to load the new code (fireworks, sounds, etc.)
            window.location.reload();
        }
    });

    navigator.serviceWorker.register('./sw.js').then(registration => {
        // Optional: Check for updates every 10 minutes
        setInterval(() => {
            registration.update();
            console.log("Checking for toy updates...");
        }, 1000 * 60 * 10);
    });
}