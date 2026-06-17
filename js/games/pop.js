/* ============================================================
   POP! — Bubbles drift up from the bottom; tap to pop them.
   Endless and calm. No fail state, just satisfying pops.
   ============================================================ */
(function () {
  const PALETTE = [
    "var(--sun)", "var(--sage)", "var(--rust)", "var(--clay)",
    "#9CB7D4", "#C9A1C7",
  ];
  const FACES = ["", "", "", "⭐", "💛", "🌸"]; // some bubbles carry a treat

  let field, timer, bubbles, raf, lastSpawn, scoreEl, score;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function spawn() {
    const size = rnd(78, 130);
    const b = document.createElement("button");
    b.className = "bubble";
    b.style.width = b.style.height = size + "px";
    b.style.left = rnd(4, 96 - (size / field.clientWidth) * 100) + "%";
    b.style.bottom = -size + "px";
    b.style.background = PALETTE[(Math.random() * PALETTE.length) | 0];
    const face = FACES[(Math.random() * FACES.length) | 0];
    if (face) b.textContent = face;
    b.style.setProperty("--drift", rnd(-40, 40) + "px");
    b.style.setProperty("--rise", rnd(7, 12) + "s");
    b.setAttribute("aria-label", "bubble");

    b.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      pop(b);
    });

    field.appendChild(b);
    bubbles.push(b);
    // Clean up bubbles that float off the top untouched.
    b.addEventListener("animationend", () => remove(b));
  }

  function pop(b) {
    if (b._popped) return;
    b._popped = true;
    Sound.pop();
    FX.burstAt(b, 14);
    score++;
    scoreEl.textContent = "🫧 " + score;
    b.classList.add("bubble--pop");
    setTimeout(() => remove(b), 220);
  }

  function remove(b) {
    const i = bubbles.indexOf(b);
    if (i >= 0) bubbles.splice(i, 1);
    b.remove();
  }

  function loop(ts) {
    if (!lastSpawn) lastSpawn = ts;
    if (ts - lastSpawn > 900 && bubbles.length < 8) {
      spawn();
      lastSpawn = ts;
    }
    raf = requestAnimationFrame(loop);
  }

  window.Games = window.Games || {};
  window.Games.pop = {
    title: "Pop!",
    mount(stage) {
      score = 0;
      bubbles = [];
      lastSpawn = 0;
      stage.innerHTML =
        '<p class="prompt" id="pop-score">🫧 0</p>' +
        '<div class="bubble-field" id="bubble-field"></div>';
      field = document.getElementById("bubble-field");
      scoreEl = document.getElementById("pop-score");
      for (let i = 0; i < 4; i++) setTimeout(spawn, i * 500);
      raf = requestAnimationFrame(loop);
    },
    unmount() {
      cancelAnimationFrame(raf);
      raf = null;
      bubbles = [];
    },
  };
})();
