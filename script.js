/**
 * TEHNUS TOYS - Core Logic
 * Includes: Shake detection, persistence hacks, and audio management.
 */

let selectedToy = 'rattle';
let lastShake = 0;
let wakeLock = null;
let currentAudio = null; // Global instance to manage "One sound at a time"
let silentLoop = null;

// Audio Asset Paths
const sounds = {
    rattle: 'assets/rattle.mp3',
    bell: 'assets/bell.mp3',
    maraca: 'assets/maraca.mp3',
    wood: 'assets/wood.mp3',
    silent: 'assets/silent_loop.mp3'
};

// UI Elements
const overlay = document.getElementById('permission-overlay');
const appContainer = document.getElementById('app-container');
const cards = document.querySelectorAll('.toy-card');
const startBtn = document.getElementById('btn-start');

/**
 * 1. INITIALIZATION & PERMISSIONS
 * Triggered by the user gesture (Start Button)
 */
startBtn.addEventListener('click', async () => {
    // A. Request Motion Permissions (Required for iOS 13+)
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        try {
            const permission = await DeviceMotionEvent.requestPermission();
            if (permission !== 'granted') {
                alert("Permission denied. The app needs motion access to work!");
                return;
            }
        } catch (error) {
            console.error("DeviceMotion permission error:", error);
        }
    }

    // B. Activate Persistence Hacks
    requestWakeLock();
    startSilentLoop();

    // C. Transition UI
    overlay.classList.add('hidden');
    appContainer.classList.remove('hidden');
    
    // D. Start listening for shakes
    window.addEventListener('devicemotion', handleMotion);
});

/**
 * 2. SHAKE DETECTION LOGIC
 */
function handleMotion(event) {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;

    /**
     * SHAKE MATH:
     * Magnitude = sqrt(x² + y² + z²)
     * Gravity is ~9.8 m/s². A threshold of 18.0 ensures 
     * we only trigger on a deliberate physical shake.
     */
    const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
    const threshold = 18.0;
    const now = Date.now();

    // 150ms Debounce (Cooldown) prevents sound clipping
    if (magnitude > threshold && (now - lastShake) > 150) {
        triggerToySound();
        lastShake = now;
    }
}

/**
 * 3. AUDIO PLAYBACK ENGINE
 */
function triggerToySound() {
    // A. Stop current sound if it's already playing (Modification: stop previous)
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    // B. Haptics
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }

    // C. Visual Feedback
    const activeCard = document.querySelector(`[data-sound="${selectedToy}"]`);
    activeCard.classList.add('pulse');
    setTimeout(() => activeCard.classList.remove('pulse'), 300);

    // D. Play Sound
    currentAudio = new Audio(sounds[selectedToy]);
    currentAudio.play().catch(err => console.warn("Playback blocked:", err));
}

/**
 * 4. TOY SELECTION LOGIC
 */
cards.forEach(card => {
    card.addEventListener('click', () => {
        // Stop any sound currently playing before switching
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        selectedToy = card.dataset.sound;
        
        // Update UI visuals
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Play once to confirm selection
        triggerToySound();
    });
});

/**
 * 5. BACKGROUND PERSISTENCE HACKS
 */
async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            // Re-request if app is minimized and then returned to
            document.addEventListener('visibilitychange', async () => {
                if (wakeLock !== null && document.visibilityState === 'visible') {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            });
        } catch (err) {
            console.error(`Wake Lock Error: ${err.message}`);
        }
    }
}

function startSilentLoop() {
    silentLoop = new Audio(sounds.silent);
    silentLoop.loop = true;
    silentLoop.volume = 0.05; // Low volume keeps the audio channel open
    silentLoop.play().catch(() => {
        console.log("Silent loop requires user interaction first");
    });
}

/**
 * 6. SERVICE WORKER REGISTRATION (PWA)
 */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW Registered'))
            .catch(err => console.log('SW Registration failed', err));
    });
}