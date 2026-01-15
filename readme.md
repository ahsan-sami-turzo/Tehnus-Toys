# 🧸 Tehnus Toys (PWA)

**Tehnus Toys** is a high-performance, mobile-first Progressive Web App (PWA) designed for infants and toddlers. It transforms a smartphone into a tactile sensory toy that responds to physical movement (shaking) with high-quality audio and haptic feedback.

---

## ✨ Core Features

* **Motion-Triggered Audio:** Uses the `DeviceMotion` API to trigger sounds based on physical acceleration.
* **Background Persistence:** Implements a **Silent Loop** audio hack combined with the **Screen Wake Lock API** to ensure the app stays active even if the screen dims or the user doesn't touch the display.
* **PWA Ready:** Fully installable on Android and iOS with offline support via Service Workers.
* **Haptic Feedback:** Physical vibration feedback (`navigator.vibrate`) synchronizes with every shake.
* **Baby-Safe UI:** Large touch targets, high-contrast pastel colors, and a simplified "No-Menu" interface.

---

## 🛠 Tech Stack

* **Frontend:** HTML5, CSS3 (Grid & Flexbox), Vanilla JavaScript (ES6+).
* **Sensors:** Device Motion API (Accelerometer).
* **Audio:** Web Audio API for polyphonic playback (overlapping sounds).
* **Persistence:** Screen Wake Lock API & HTML5 Audio Loop.
* **PWA:** Service Workers for offline caching and `manifest.json` for home-screen installation.

---

## 🚀 Installation & Deployment

### Hosting on GitHub Pages
1. Push your code to a GitHub repository.
2. Navigate to **Settings > Pages**.
3. Set the source to the `main` branch.
4. **Important:** Ensure you access the site via `https://`. Sensor APIs and Service Workers will not function over insecure `http`.

### Local Development
To test locally, you must use a secure server (like VS Code Live Server) because `DeviceMotion` and `WakeLock` require a **Secure Context**.

---

## 📱 Mobile Setup (Crucial)

To get the "Native App" experience:
1.  **iOS (Safari):** Tap the **Share** button → **Add to Home Screen**.
2.  **Android (Chrome):** Tap the **Three Dots** → **Install App**.

> **Note on Permissions:** Due to privacy standards, the app requires a "User Gesture" (the Start Button) to unlock audio and motion sensors. On iOS 13+, you must click "Allow" when prompted for Motion access.

---

## 📂 File Structure

```text
├── index.html          # App shell and UI grid
├── style.css           # Responsive layout and shake animations
├── script.js           # Audio logic, Motion math, and WakeLock
├── sw.js               # Service Worker for offline caching
├── manifest.json       # PWA configuration and icons
├── icon-192.png        # App Icon (Standard)
├── icon-512.png        # App Icon (Splash Screen)
└── assets/
    ├── rattle.mp3      # Sound effects
    ├── bell.mp3
    ├── maraca.mp3
    ├── wood.mp3
    └── silent_loop.mp3 # 1s silent file for background persistence
```

---
## 🧮 Shake Threshold Math

The app calculates the magnitude of movement to distinguish between a gentle tilt and a deliberate shake.
Magnitude=acc.x2+acc.y2+acc.z2​

    Gravity: Constant at approx 9.81m/s2.

    Threshold: Set to 18.0 m/s² to prevent accidental triggers.

    Cooldown: A 150ms debounce prevents audio clipping (the "machine gun" effect) during a single vigorous shake.

---

## 🔧 Troubleshooting

    No Sound on Shake: Ensure the phone is not on "Silent/Vibrate" mode. On iOS, the physical mute switch can block web audio.

    App Closes/Sleeps: Ensure you clicked "Let's Play" to activate the Wake Lock.

    Permissions: If you denied motion permissions once, you must clear your browser cache or reset site settings to see the prompt again.

---

## ⚖️ License

MIT License - Created for parents and developers everywhere.

---

### Developed for my beloved firstborn Tehniyaat Akter Binte Sami
