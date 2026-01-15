let selectedToy = 'rattle';
let lastShake = 0;
let wakeLock = null;
let silentStream = null;

// Audio Context for Web Audio API
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};

// Load Audio Files (Mocking paths - replace with your actual hosted assets)
const sounds = {
    rattle: 'assets/rattle.mp3',
    bell: 'assets/bell.mp3',
    maraca: 'assets/maraca.mp3',
    wood: 'assets/wood.mp3',
    silent: 'assets/silent_loop.mp3' // 1 second of silence
};

// UI Elements
const overlay = document.getElementById('permission-overlay');
const appContainer = document.getElementById('app-container');
const cards = document.querySelectorAll('.toy-card');

// 1. Initialize Audio and Permissions
document.getElementById('btn-start').addEventListener('click', async () => {
    // Resume Audio Context (Browser requirement)
    await audioCtx.resume();
    
    // Request Motion Permissions (iOS 13+ requirement)
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission !== 'granted') return alert("Motion access required!");
        } catch (e) { console.error(e); }
    }

    // Start Wake Lock & Silent Loop
    requestWakeLock();
    startSilentLoop();

    overlay.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    // Listen for Motion
    window.addEventListener('devicemotion', handleMotion);
});

// 2. Shake Detection Logic
function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    /**
     * SHAKE THRESHOLD MATH:
     * We calculate the magnitude of the 3D vector: sqrt(x² + y² + z²).
     * Gravity is approx 9.8 m/s². A vigorous shake typically exceeds 15-20 m/s².
     */
    const threshold = 18;
    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    const now = Date.now();

    if (magnitude > threshold && (now - lastShake) > 150) {
        triggerToy();
        lastShake = now;
    }
}

// 3. Audio Trigger Logic
function triggerToy() {
    // 1. Stop any current sound immediately
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // 2. Haptics
    if (navigator.vibrate) navigator.vibrate(50);

    // 3. Visual Feedback
    const activeCard = document.querySelector(`[data-sound="${selectedToy}"]`);
    activeCard.classList.add('pulse');
    setTimeout(() => activeCard.classList.remove('pulse'), 300);

    // 4. Play the new sound and store it in the global variable
    currentAudio = new Audio(sounds[selectedToy]);
    currentAudio.play().catch(e => console.log("Audio play interrupted"));
}

// 5. Toy Selection Modification
const cards = document.querySelectorAll('.toy-card');
cards.forEach(card => {
    card.addEventListener('click', () => {
        // Stop current sound immediately when switching icons
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        selectedToy = card.dataset.sound;
        
        // UI Update
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Play the new toy sound once to confirm selection
        triggerToy(); 
    });
});

// 6. Persistence Hacks
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
        }
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

// 6. Silent-loop Hacks
function startSilentLoop() {
    const silentAudio = new Audio(sounds.silent);
    silentAudio.loop = true;
    silentAudio.volume = 0.05; // Low volume keeps the audio process alive
    silentAudio.play();
}