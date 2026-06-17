# 🎈 AliPlay

A calm, cozy collection of browser games for toddlers — built around a
**"Minimalist Play"** aesthetic: warm earthy tones, big chubby buttons, soft
rounded edges, and gentle happy sounds. Designed to be clear and instinctive
for little hands, while staying easy on a grown-up's eyes.

## Games

| Game | What you do |
|------|-------------|
| 🫧 **Pop!** | Tap drifting bubbles to pop them — endless and calm, with occasional star treats. |
| 🐮 **Animals** | Tap a friend; it bounces, sparkles, and says its name and sound aloud. |
| 🎨 **Colors** | "Find Blue!" — tap the matching paint blob. |
| 🔺 **Shapes** | Match the named shape. |
| 🍎 **Counting** | Tap each fruit and count up out loud, then celebrate. |
| 🎹 **Music** | Big keys tuned to a pentatonic scale, so every combination sounds nice. |

## Design principles

- **Simplicity first** — zero clutter, instinctive navigation, enormous tap targets (76px+).
- **Calm but engaging** — warm cream backdrop, soft palette accents, no flashing neon.
- **Safe & fluid** — generously rounded corners and solid "wooden-token" block shadows.
- **Friendly voice** — picks a natural speech voice and uses an upbeat, varied tone for celebrations.
- **One screenful** — everything fits the viewport with no scrolling, on phone, tablet, or desktop.
- Respects `prefers-reduced-motion`.

## Running it

It's a static site with **no build step and no dependencies**. Either:

```bash
# Option 1: just open it
open index.html

# Option 2: run the tiny included server (Node)
node serve.js          # then visit http://127.0.0.1:8137
# (set a custom port with: PORT=3000 node serve.js)
```

## Tech

Plain HTML, CSS, and vanilla JavaScript. Sounds are synthesized live via the
Web Audio API (no audio files), and words/numbers use the browser's built-in
speech synthesis — so it works offline.

## Fonts

[Fredoka](https://fonts.google.com/specimen/Fredoka) for headers,
[Nunito](https://fonts.google.com/specimen/Nunito) for UI text (loaded from Google Fonts).
