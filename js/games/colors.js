/* ============================================================
   MATCH THE COLORS — a target color is named and shown big.
   Tap the matching paint blob. Right = celebrate, wrong = gentle
   wiggle and try again. Always solvable, never punishing.
   ============================================================ */
(function () {
  const COLORS = [
    { name: "Red",    hex: "#D06A4C" },
    { name: "Yellow", hex: "#E5A93C" },
    { name: "Green",  hex: "#7FA185" },
    { name: "Blue",   hex: "#6E97C4" },
    { name: "Purple", hex: "#A87FB0" },
    { name: "Brown",  hex: "#C98B6B" },
  ];

  const GOAL = 5; // correct matches, then "All done!"
  let stageEl, target, found;

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pickRound() {
    // Show 4 blobs, one of which is the target.
    const choices = shuffle(COLORS).slice(0, 4);
    target = choices[(Math.random() * choices.length) | 0];
    render(choices);
  }

  function render(choices) {
    const swatch = document.getElementById("color-target");
    swatch.style.background = target.hex;
    const label = document.getElementById("color-label");
    label.textContent = "Find " + target.name + "!";
    Sound.say("Find " + target.name);

    const tray = document.getElementById("color-tray");
    tray.innerHTML = "";
    shuffle(choices).forEach((c, i) => {
      const blob = document.createElement("button");
      blob.className = "tile blob pop-in";
      blob.style.animationDelay = (i * 70) + "ms";
      blob.style.background = c.hex;
      blob.setAttribute("aria-label", c.name);
      blob.addEventListener("pointerdown", (e) => { e.preventDefault(); choose(blob, c); });
      tray.appendChild(blob);
    });
  }

  function choose(blob, c) {
    if (c.name === target.name) {
      Sound.good();
      Sound.praise(c.name + "!");
      FX.burstAt(blob, 18);
      blob.classList.add("bounce");
      found++;
      if (found >= GOAL) {
        setTimeout(() => Session.finish(stageEl, {
          message: "You found them all, Ali! 🎨",
          onAgain: () => play(stageEl),
        }), 1100);
      } else {
        setTimeout(pickRound, 1100);
      }
    } else {
      Sound.nope();
      blob.classList.remove("wiggle");
      void blob.offsetWidth;
      blob.classList.add("wiggle");
    }
  }

  function play(stage) {
    stageEl = stage;
    found = 0;
    stage.innerHTML =
      '<p class="prompt" id="color-label">Find a color!</p>' +
      '<div class="color-target-wrap"><div class="color-target" id="color-target"></div></div>' +
      '<div class="color-tray" id="color-tray"></div>';
    pickRound();
  }

  window.Games = window.Games || {};
  window.Games.colors = {
    title: "Colors",
    mount(stage) { play(stage); },
    unmount() {},
  };
})();
