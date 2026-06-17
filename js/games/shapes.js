/* ============================================================
   SHAPE SHUFFLE — a shape is named; tap the matching shape.
   Shapes are drawn as inline SVG so they stay crisp and on-brand.
   ============================================================ */
(function () {
  const SHAPES = ["circle", "square", "triangle", "star", "heart"];
  const NAMES = {
    circle: "Circle", square: "Square", triangle: "Triangle",
    star: "Star", heart: "Heart",
  };
  const FILLS = ["var(--sun)", "var(--sage)", "var(--rust)", "var(--clay)", "#6E97C4"];

  function svg(shape, fill) {
    const s = (inner) =>
      '<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">' +
      inner + "</svg>";
    switch (shape) {
      case "circle":   return s('<circle cx="50" cy="50" r="42" fill="' + fill + '"/>');
      case "square":   return s('<rect x="12" y="12" width="76" height="76" rx="16" fill="' + fill + '"/>');
      case "triangle": return s('<path d="M50 12 L90 84 L10 84 Z" fill="' + fill + '" stroke-linejoin="round"/>');
      case "star":     return s('<path d="M50 8 L61 38 L93 38 L67 58 L77 90 L50 70 L23 90 L33 58 L7 38 L39 38 Z" fill="' + fill + '" stroke-linejoin="round"/>');
      case "heart":    return s('<path d="M50 86 C18 62 12 40 28 28 C40 19 50 30 50 30 C50 30 60 19 72 28 C88 40 82 62 50 86 Z" fill="' + fill + '"/>');
    }
  }

  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  let target;

  function round() {
    const choices = shuffle(SHAPES).slice(0, 4);
    target = choices[(Math.random() * choices.length) | 0];

    document.getElementById("shape-label").textContent = "Find the " + NAMES[target] + "!";
    Sound.say("Find the " + NAMES[target]);

    const tray = document.getElementById("shape-tray");
    tray.innerHTML = "";
    shuffle(choices).forEach((sh, i) => {
      const btn = document.createElement("button");
      btn.className = "tile shape pop-in";
      btn.style.animationDelay = (i * 70) + "ms";
      btn.style.background = "var(--sand)";
      btn.innerHTML = svg(sh, FILLS[i % FILLS.length]);
      btn.setAttribute("aria-label", NAMES[sh]);
      btn.addEventListener("pointerdown", (e) => { e.preventDefault(); choose(btn, sh); });
      tray.appendChild(btn);
    });
  }

  function choose(btn, sh) {
    if (sh === target) {
      Sound.good();
      Sound.praise(NAMES[sh] + "!");
      FX.burstAt(btn, 18);
      btn.classList.add("bounce");
      setTimeout(round, 1100);
    } else {
      Sound.nope();
      btn.classList.remove("wiggle");
      void btn.offsetWidth;
      btn.classList.add("wiggle");
    }
  }

  window.Games = window.Games || {};
  window.Games.shapes = {
    title: "Shapes",
    mount(stage) {
      stage.innerHTML =
        '<p class="prompt" id="shape-label">Find a shape!</p>' +
        '<div class="shape-tray" id="shape-tray"></div>';
      round();
    },
    unmount() {},
  };
})();
