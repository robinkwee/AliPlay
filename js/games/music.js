/* ============================================================
   MUSIC — a row of big, chubby keys. Each plays a warm note and
   lights up when pressed. A pentatonic scale so any combination
   sounds pleasant (no "wrong" notes for little fingers).
   ============================================================ */
(function () {
  // C-major pentatonic across an octave-and-a-bit: always harmonious.
  const KEYS = [
    { note: "C", freq: 261.63, color: "var(--rust)" },
    { note: "D", freq: 293.66, color: "var(--sun)" },
    { note: "E", freq: 329.63, color: "var(--clay)" },
    { note: "G", freq: 392.00, color: "var(--sage)" },
    { note: "A", freq: 440.00, color: "#6E97C4" },
    { note: "C", freq: 523.25, color: "#A87FB0" },
  ];

  function press(key, k) {
    Sound.tone(k.freq, { dur: 0.6, type: "triangle", gain: 0.2 });
    Sound.tone(k.freq * 2, { dur: 0.4, type: "sine", gain: 0.06 }); // soft shimmer
    key.classList.remove("key--lit");
    void key.offsetWidth;
    key.classList.add("key--lit");
    FX.burstAt(key, 8);
  }

  window.Games = window.Games || {};
  window.Games.music = {
    title: "Music",
    mount(stage) {
      stage.innerHTML =
        '<p class="prompt">Tap the keys to make a song! 🎵</p>' +
        '<div class="keyboard" id="keyboard"></div>';
      const kb = document.getElementById("keyboard");
      KEYS.forEach((k, i) => {
        const key = document.createElement("button");
        key.className = "tile key pop-in";
        key.style.animationDelay = (i * 60) + "ms";
        key.style.background = k.color;
        key.innerHTML = '<span class="key__dot" aria-hidden="true"></span>';
        key.setAttribute("aria-label", "note " + k.note);
        key.addEventListener("pointerdown", (e) => { e.preventDefault(); press(key, k); });
        kb.appendChild(key);
      });
    },
    unmount() {},
  };
})();
