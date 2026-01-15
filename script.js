/**
 * TEHNUS TOYS - Final Stable Edition
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
    
    const bufferSize = audioCtx.sampleRate * 2;
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
}

// 2. RAINBOW & VISUALS
function triggerRainbow() {
    const newHue = Math.floor(Math.random() * 360);
    document.body.style.setProperty('--bg-hue', newHue);
}

const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');
let particles = [];

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
        this.opacity -= 0.02;
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

function createBurst(x, y) {
    const burstX = x || Math.random() * canvas.width;
    const burstY = y || Math.random() * canvas.height;
    const hue = getComputedStyle(document.body).getPropertyValue('--bg-hue');
    for (let i = 0; i < 30; i++) {
        const color = `hsl(${(parseInt(hue) + 40) % 360}, 70%, 60%)`;
        particles.push(new Particle(burstX, burstY, color));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// 3. SYNTH ENGINE (Volume Balanced)
const ToySynth = {
    rattle() {
        const now = audioCtx.currentTime;
        for (let i = 0; i < 8; i++) {
            const startTime = now + (Math.random() * 0.05);
            const source = audioCtx.createBufferSource();
            source.buffer = noiseBuffer;
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 3000 + (Math.random() * 2000);
            const gain = audioCtx.createGain();
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.2, startTime + 0.002);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
            source.connect(filter).connect(gain).connect(audioCtx.destination);
            source.start(startTime);
        }
    },
    bell(freq = 880) {
        const now = audioCtx.currentTime;
        [1, 2, 3].forEach((ratio, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = freq * ratio;
            gain.gain.setValueAtTime(0.1 / (i + 1), now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(now); osc.stop(now + 1);
        });
    },
    wood() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = 600;
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
    },
    maraca() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass'; filter.frequency.value = 5000;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },
    crinkle() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'highpass'; filter.frequency.value = 8000;
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
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
    },
    jingle() {
        const now = audioCtx.currentTime;
        [1200, 2500].forEach(f => {
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
        filter.type = 'bandpass'; filter.frequency.value = 900; filter.Q.value = 5;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },
    musicbox() {
        const now = audioCtx.currentTime;
        [523, 659, 784, 1046].forEach((freq, i) => {
            const time = now + (i * 0.2);
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.15, time);
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
        filter.type = 'bandpass'; filter.frequency.value = 1500; filter.Q.value = 2;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        source.connect(filter).connect(gain).connect(audioCtx.destination);
        source.start(now);
    },
    splash() {
        const now = audioCtx.currentTime;
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass'; filter.frequency.value = 1000;
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
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.2);
    },
    twinkle() {
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.value = 1500 + Math.random() * 500;
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now); osc.stop(now + 0.1);
    }
};

// 4. HANDLERS
function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const mag = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    const now = Date.now();
    if (mag > 18.0 && (now - lastShake) > 150) {
        if (isLooping) stopLoop();
        initAudio();
        triggerRainbow(); // Fixed: Function now exists
        createBurst(); // Shake burst at random location
        if (ToySynth[selectedToy]) ToySynth[selectedToy]();
        if (navigator.vibrate) navigator.vibrate(50);
        lastShake = now;        
    }
}

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

// 5. EVENT LISTENERS
document.getElementById('btn-start').addEventListener('click', async () => {
    initAudio();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
            await DeviceMotionEvent.requestPermission();
        } catch (e) { console.error(e); }
    }
    document.getElementById('permission-overlay').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');
    window.addEventListener('devicemotion', handleMotion);
});

document.querySelectorAll('.toy-card').forEach(card => {
    card.addEventListener('click', (e) => {
        stopLoop();
        initAudio();
        selectedToy = card.dataset.sound;
        document.querySelectorAll('.toy-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        triggerRainbow(); // Fixed: Using function
        createBurst(e.clientX, e.clientY); // Fixed: Burst at tap location
        if (ToySynth[selectedToy]) ToySynth[selectedToy]();
    });
});

document.getElementById('btn-loop').addEventListener('click', startLoop);
document.getElementById('btn-stop').addEventListener('click', stopLoop);

// 6. PWA UPDATER
if ('serviceWorker' in navigator) {
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            refreshing = true;
            window.location.reload();
        }
    });
    // Matches GitHub Pages path
    navigator.serviceWorker.register('./sw.js');
}