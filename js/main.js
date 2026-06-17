/* ============================================================
   AliPlay — navigation between the home menu and game screens.
   Tiny, dependency-free "router". Restores the menu cleanly and
   tears down the active game so timers/loops don't pile up.
   ============================================================ */
(function () {
  const home = document.getElementById("home");
  const gameScreen = document.getElementById("game");
  const stage = document.getElementById("stage");
  const titleEl = document.getElementById("game-title");
  const backBtn = document.getElementById("back-btn");
  const soundToggle = document.getElementById("sound-toggle");

  let current = null;

  function show(el) {
    [home, gameScreen].forEach((s) => {
      const active = s === el;
      s.classList.toggle("screen--active", active);
      s.hidden = !active;
    });
  }

  function openGame(name) {
    const game = window.Games && window.Games[name];
    if (!game) return;
    current = game;
    titleEl.textContent = game.title;
    show(gameScreen);
    stage.innerHTML = "";
    // Immersive games fill the whole area below the top bar, edge to edge.
    stage.classList.toggle("stage--full", !!game.immersive);
    game.mount(stage);
    Sound.tap();
  }

  function goHome() {
    if (current && current.unmount) current.unmount();
    current = null;
    stage.innerHTML = "";
    show(home);
    Sound.tap();
  }

  // Wire up the game cards.
  document.querySelectorAll(".card[data-game]").forEach((card) => {
    card.addEventListener("click", () => {
      // First tap unlocks/resumes the audio context.
      Sound.ctx();
      openGame(card.dataset.game);
    });
  });

  backBtn.addEventListener("click", goHome);

  // Hardware/browser back returns to the menu rather than leaving.
  window.addEventListener("popstate", () => { if (current) goHome(); });

  // Sound on/off.
  soundToggle.addEventListener("click", () => {
    const on = soundToggle.getAttribute("aria-pressed") === "true";
    const next = !on;
    soundToggle.setAttribute("aria-pressed", String(next));
    soundToggle.querySelector(".chip__icon").textContent = next ? "🔊" : "🔈";
    soundToggle.querySelector(".chip__text").textContent = next ? "Sound on" : "Sound off";
    Sound.setEnabled(next);
    if (next) { Sound.ctx(); Sound.tap(); }
  });

  // Warm up speech voices (some browsers load them lazily).
  if ("speechSynthesis" in window) window.speechSynthesis.getVoices();
})();
