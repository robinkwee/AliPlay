/* ============================================================
   LETTERS — Tap anywhere (or press any key) to burst a big,
   colorful letter with a friendly emoji and a soft pentatonic
   note. Every so often a firetruck drives across with a siren.
   Adapted from the standalone "Firetruck Keyboard".
   ============================================================ */
(function () {
  const COLORS = ["var(--sun)", "var(--sage)", "var(--rust)", "var(--clay)", "#6E97C4", "#A87FB0"];
  const EMOJIS = ["🚒", "🐶", "🐕", "⭐", "🐾", "🐩", "🎈", "🍎"];
  const SCALE = [330, 392, 440, 494, 587]; // pentatonic — always pleasant

  let field, truck, hint, tapCount, lastSpeak, timers, onKey;

  function rand(a) { return a[(Math.random() * a.length) | 0]; }

  function burst(ch) {
    const b = document.createElement("div");
    b.className = "letter-burst";
    b.style.left = (12 + Math.random() * 72) + "%";
    b.style.top = (16 + Math.random() * 56) + "%";
    b.innerHTML =
      '<div class="lb-ch" style="color:' + rand(COLORS) + '">' + ch + "</div>" +
      '<div class="lb-em">' + rand(EMOJIS) + "</div>";
    field.appendChild(b);
    const t1 = setTimeout(() => b.classList.add("bye"), 1000);
    const t2 = setTimeout(() => b.remove(), 1800);
    timers.push(t1, t2);
  }

  function drive() {
    Sound.siren();
    truck.classList.remove("drive");
    void truck.offsetWidth;
    truck.classList.add("drive");
  }

  function blip(ch) {
    const code = (ch.charCodeAt(0) || 65);
    Sound.tone(SCALE[code % SCALE.length], { dur: 0.5, type: "sine", gain: 0.13 });
  }

  function play(ch, isTruck) {
    if (isTruck) { burst("🚒"); drive(); return; }
    blip(ch);
    burst(ch);
    // Name the letter, throttled so rapid taps stay snappy and uncluttered.
    const now = performance.now();
    if (/^[A-Z0-9]$/.test(ch) && now - lastSpeak > 650) {
      lastSpeak = now;
      Sound.say(ch);
    }
  }

  function onTap() {
    if (hint) { hint.classList.add("hud--gone"); hint = null; }
    tapCount++;
    if (tapCount % 7 === 0) play("🚒", true);
    else play(String.fromCharCode(65 + ((Math.random() * 26) | 0)), false);
  }

  window.Games = window.Games || {};
  window.Games.letters = {
    title: "Letters",
    immersive: true,
    mount(stage) {
      tapCount = 0;
      lastSpeak = 0;
      timers = [];
      stage.innerHTML =
        '<div class="letter-field" id="letter-field">' +
        '  <div class="hud hud--hint" id="letter-hint">Tap to make letters! 🚒</div>' +
        '  <div class="letter-truck" id="letter-truck" aria-hidden="true">🚒</div>' +
        "</div>";
      field = document.getElementById("letter-field");
      truck = document.getElementById("letter-truck");
      hint = document.getElementById("letter-hint");

      field.addEventListener("pointerdown", (e) => { e.preventDefault(); onTap(); });

      // Real keyboards (desktop) show the exact key; Space = firetruck.
      onKey = (e) => {
        if (e.key === " " || e.key === "Spacebar") { e.preventDefault(); play("🚒", true); }
        else if (e.key.length === 1) play(e.key.toUpperCase(), false);
      };
      window.addEventListener("keydown", onKey);
    },
    unmount() {
      window.removeEventListener("keydown", onKey);
      timers.forEach(clearTimeout);
      timers = [];
    },
  };
})();
