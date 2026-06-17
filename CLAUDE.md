# AliPlay — read this before adding or changing ANYTHING

AliPlay is a collection of browser games for **Ali, a 2.5-year-old boy**. His
dad built this for him. Every change — a new game, a tweak, a color — must keep
the experience consistent, calm, and right for a toddler. Read this whole file
first, then match what's already here.

> The golden rule: **when in doubt, make it simpler, calmer, and shorter.**
> A 2.5-year-old can't read, has tiny hands, a short attention span, and is
> easily over-stimulated. Build for *that* child, not for a clever demo.

---

## The four promises (every game must keep all four)

1. **Educational** — it teaches one small thing: a color, a shape, a number, an
   animal, a sound, cause-and-effect. One concept per game. Never two.
2. **Engaging** — big, tappable, responsive. Something happy happens on *every*
   tap. No empty taps, no dead zones, no waiting.
3. **Not over-stimulating** — calm palette, gentle sounds, slow motion. No
   flashing, no loud noises, no fast color changes, no chaos on screen. If it
   feels exciting to an adult, it's probably too much for Ali.
4. **It ends.** ⭐ This is the newest and most important rule. A game must reach
   a natural finish after a short while so Ali learns a session is "done" and
   isn't glued to the screen forever. See **"Every game must end"** below.

---

## Every game must end (the session model)

Toddlers don't self-regulate screen time — the game has to. Each game runs a
**short, finite session** and then shows a calm "All done!" finish screen.

- **Length:** aim for **~2–3 minutes**, or a small fixed number of rounds
  (e.g. **5 rounds**) or actions (e.g. **pop 20 bubbles**). Pick whichever fits
  the game and keep it small.
- **Finish gently:** when the session is complete, stop spawning/advancing, play
  ONE celebration (`Sound.yay()` + `FX.rain()`), and show a finish card with a
  big friendly message ("All done, Ali! 🎉") and two big buttons:
  **"Play again"** and **"Back home"** (← also always works).
- **No endless loops.** Do not auto-start a new round forever. The current games
  (Pop, Colors, Counting, etc.) loop indefinitely — **they need retrofitting to
  this model**, and any *new* game must ship with an ending from day one.
- **No timers that punish.** The clock is invisible to Ali. No countdown bars, no
  "hurry up", no score pressure. It just gently winds down and celebrates.

There is a shared helper for this — use it instead of hand-rolling:
`Session.start({ goal, onProgress, onFinish })` / `Session.finish(stage, {...})`.
If it doesn't exist yet, create it in `js/session.js` and wire it into a game;
keep its look consistent with the finish card described above.

---

## Visual identity — "Minimalist Play" (do not drift from this)

The whole system lives in `css/styles.css` `:root`. **Always use these tokens;
never introduce new raw colors, radii, or shadows.**

**Palette (warm, earthy, soft — never neon):**
- Backgrounds: `--cream` `#FDFBF7`, `--sand` `#F3EDE2`, `--sand-deep` `#E9E0D0`
- Text/shapes: `--walnut` `#3A3530`, `--walnut-soft` `#6B6259`
- Accents (use sparingly, one or two per screen): `--sun` `#E5A93C`,
  `--sage` `#7FA185`, `--rust` `#D06A4C`, `--clay` `#C98B6B`
- Soft tints for surfaces: `--sun-soft`, `--sage-soft`, `--rust-soft`, `--clay-soft`

**Form language:**
- Rounded everything: `--r-lg 36px`, `--r-md 28px`, `--r-sm 20px`, `--r-pill`.
- "Wooden-token" solid block shadow (no blur): `--shadow-walnut`,
  `--shadow-soft`. Pressing a control pushes it *down* into its shadow.
- Squishy, springy motion via `--ease-squish`. Keep animations slow and soft.
- Faint paper `grain` texture overlay — leave it on.

**Type:** **Fredoka** for headings / labels (`.logo__word`, `.card__label`,
`.prompt`), **Nunito** for everything else. No other fonts.

**Touch & layout:**
- Minimum tap target `--tap: 76px`. Bigger is better. Tiny targets are banned.
- **One screenful, no scrolling, ever.** Everything fits `100dvh` on phone,
  tablet, and desktop. Use `clamp()` for sizing like the existing code does.
- Respect `prefers-reduced-motion` (the reduced-motion block already handles it —
  don't add motion that ignores it).

---

## How the code is organized (match these patterns)

Plain HTML/CSS/vanilla JS. **No build step, no dependencies, no frameworks, no
npm packages.** It must keep working offline and from `file://`.

```
index.html        home menu + game stage shell; <script> tags load each game
css/styles.css    the design system (tokens, home, topbar, stage, shared anims)
css/games.css     per-game styles (bubble, blob, tile, fruit, keys…)
js/audio.js        window.Sound  — synthesized tones + speech (no audio files)
js/fx.js           window.FX     — confetti burst / rain
js/main.js         tiny router: home ⇄ game, mount/unmount, sound toggle
js/games/<name>.js each game registers window.Games.<name>
```

**To add a new game:**
1. Create `js/games/<name>.js` following this exact shape:
   ```js
   window.Games = window.Games || {};
   window.Games.<name> = {
     title: "Friendly Name",
     mount(stage) { /* build DOM into stage; start the session */ },
     unmount() { /* cancel rAF/timeouts/intervals so nothing leaks */ },
   };
   ```
2. Add its `<script>` tag in `index.html` (before `js/main.js`).
3. Add a home card in `index.html`'s `.grid` using an existing
   `card--sun/sage/rust/clay` color, a single emoji icon, and a one-word label.
   Keep the grid balanced (it's a 2×3 layout — adding a 7th game means rethinking
   the grid; prefer replacing/curating over endless growth).
4. Put game-specific CSS in `css/games.css`, reusing tokens and the `.tile` base.

**Cleanup is mandatory:** `unmount()` must stop every `requestAnimationFrame`,
`setTimeout`, and `setInterval` the game started. The router calls it on "Back".

---

## Sound & speech (gentle, never startling)

Use `window.Sound` — never add audio files. Keep it quiet and soft.
- `Sound.tap()` light blip · `Sound.pop()` bubble pop · `Sound.good()` /
  `Sound.yay()` happy arpeggios · `Sound.nope()` *soft, non-scary* "try again".
- `Sound.tone(freq, {dur,type,gain})` and `Sound.melody([...])` for custom cues.
  Keep `gain` low (~0.14–0.18) and tones in a pleasant range. No harsh buzzes.
- `Sound.say("word")` speaks warmly; `Sound.praise()` / `Sound.cheer()` for
  varied happy phrases. Always name what Ali sees ("Cow!", "Three!", "Blue!") —
  spoken words are how a pre-reader learns from this site.
- Everything must honor the sound toggle (it sets `Sound.on`). Don't bypass it.

## Reward & feedback rules

- **Every tap gives feedback** — a sound, a bounce, a little confetti
  (`FX.burstAt(el, n)` with a small `n` like 8–18). Keep bursts modest.
- **No fail states, no losing, no "wrong" punishment.** A wrong tap = gentle
  `Sound.nope()` + a `.wiggle`, and Ali tries again. The game is always solvable.
- **Celebrate the finish once**, calmly (`Sound.yay()` + `FX.rain()`), then show
  the "All done!" card. Don't chain celebrations or spam confetti.

---

## Content rules

- One concept per game; toddler-appropriate vocabulary; real things Ali knows
  (animals, fruit, colors, shapes, numbers 1–5, simple music).
- Numbers stay small (count 1–5, not 1–20). Few choices on screen (3–4 max).
- No reading required to play. No text instructions Ali must read — the *spoken*
  prompt and big visuals carry the game.
- Friendly, warm, lowercase-feeling tone. Address him by name where natural
  ("Hi Ali!", "All done, Ali!").

---

## Before you finish any change — checklist

- [ ] Keeps all **four promises** (educational, engaging, calm, **ends**).
- [ ] Uses only existing design tokens (colors, radii, shadows, fonts).
- [ ] Fits one screenful, no scroll, tap targets ≥ 76px, works on a phone.
- [ ] Sounds are soft and respect the toggle; speech names what's on screen.
- [ ] No new dependencies/build step; still works offline / from `file://`.
- [ ] `unmount()` cleans up all timers/loops.
- [ ] Honors `prefers-reduced-motion`.
- [ ] Test it: `node serve.js` → http://127.0.0.1:8137 (or just open index.html).

When unsure, re-read the golden rule at the top.
