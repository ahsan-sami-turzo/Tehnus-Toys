# 🧸 Tehnus Toys (PWA)

## Built with love, patience, and a very full heart

Hello there.

This little app exists because one day I was holding my daughter, watching her discover the world one shake at a time. Every rattle made her eyes light up. Every bell earned a smile. I thought: *what if a phone could become a toy too, but a safe one, gentle one, built with care?*

So I built **Tehnus Toys**.

It is not just an app. It is a pocket-sized toy chest, tuned for tiny hands, curious minds, and parents who want something simple, calm, and trustworthy.

---

## ✨ What Tehnus Toys Does

Tehnus Toys turns your smartphone into a sensory toy for infants and toddlers.

No menus to get lost in. No flashing chaos. Just soft colors, big buttons, and happy sounds that respond to movement.

Shake the phone and it responds like a real toy would.

Because babies understand motion long before they understand screens.

---

## 🌈 Core Features

- **Shake-to-Play Magic**  
  Uses the Device Motion API so a gentle shake becomes a rattle, a bell, a chime, or a squeak.

- **Always Awake When It Matters**  
  A clever silent audio loop and the Screen Wake Lock API keep the app alive even when the screen dims. No sudden silence during playtime.

- **Install Once, Play Anywhere**  
  Fully installable as a Progressive Web App on Android and iOS. Works offline. Perfect for trips, queues, and tired arms.

- **Tiny Hands Friendly**  
  Big touch targets, soft pastel colors, and a calm layout designed for accidental taps and curious fingers.

- **Little Buzz of Joy**  
  Gentle haptic feedback on every shake so play feels physical, not flat.

---

## 🧠 Designed with Babies in Mind

This app avoids the usual noise of modern software.

No ads.
No accounts.
No scrolling.
No surprises.

Just cause and effect.

Shake. Hear a sound. Smile.

---

## 🛠 Tech Stack (For Curious Parents and Developers)

- **Frontend**: HTML5, CSS3 (Grid and Flexbox), Vanilla JavaScript (ES6+)
- **Motion Sensors**: Device Motion API (accelerometer)
- **Audio**: Web Audio API for overlapping, natural sound playback
- **Persistence**: Screen Wake Lock API and silent audio loop
- **PWA**: Service Workers and `manifest.json` for offline use and home-screen install

Everything is intentionally lightweight, fast, and battery-conscious.

---

## 🚀 Installation and Deployment

### Hosting on GitHub Pages

1. Push the project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Select the `main` branch as the source.
4. Make sure the site is accessed over **https**. Motion sensors and service workers only work in secure contexts.

### Local Development

To test locally, use a secure local server like VS Code Live Server. Motion and Wake Lock APIs require HTTPS, even during development.

---

## 📱 Mobile Setup (Important)

For the best, app-like experience:

- **iOS (Safari)**: Tap **Share → Add to Home Screen**
- **Android (Chrome)**: Tap **⋮ → Install App**

### A Note on Permissions

For safety and privacy, the app asks for permission before using motion sensors and audio. The first tap on the Start button unlocks everything.

On iOS 13+, you must tap **Allow** when asked for motion access.

---

## 📂 File Structure

```
├── index.html        # App shell and toy grid
├── style.css         # Pastel UI and responsive layout
├── script.js         # Motion logic, audio engine, wake lock
├── sw.js             # Service worker for offline support
├── manifest.json     # PWA configuration
├── icon-192.png      # App icon
├── icon-512.png      # Splash icon
```

---

## 🧮 How Shake Detection Works

The app measures total movement energy to tell the difference between a tilt and a real shake.

- **Gravity baseline**: ~9.81 m/s²
- **Shake threshold**: 18.0 m/s²
- **Cooldown**: 150 ms debounce to prevent sound overload

This keeps play responsive but never frantic.

---

## 🎮 How to Play

- **Choose a Toy**: Tap any icon. It plays once so you know it is ready.
- **Shake the Phone**: Just like a real rattle.
- **Loop Mode**: Press LOOP to play continuously. Great for calming or distraction.
- **Override**: Shake the phone while looping to instantly return to manual play.

---

## 🔧 Troubleshooting

- **No Sound**: Check that the phone is not muted. On iOS, the physical mute switch can silence web audio.
- **App Sleeps**: Make sure you pressed the Start button to activate wake lock.
- **Motion Not Working**: If permission was denied once, reset site permissions or clear browser settings.

---

## ⚖️ License

MIT License.

Free to use, learn from, and improve.

Built for parents, developers, and small humans discovering the world.

---

## ❤️ A Final Note

This app was built for my beloved daughter,

**Tehniyaat Akter Binte Sami**

May every shake bring laughter. May every sound spark wonder. And may technology always be gentle enough for little hands.

