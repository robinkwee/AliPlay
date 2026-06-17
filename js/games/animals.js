/* ============================================================
   ANIMAL FRIENDS — a calm grid of animals. Tap one and it
   bounces, sparkles, and says its name + sound out loud.
   A free-play toy, so it ends on a gentle timer rather than a
   score: after PLAY_MS it winds down to "All done!".
   ============================================================ */
(function () {
  const PLAY_MS = 150000; // ~2.5 minutes of calm free play
  const ANIMALS = [
    { emoji: "🐮", name: "Cow",   says: "Moooo",     note: 261.6 },
    { emoji: "🐱", name: "Cat",   says: "Meow",      note: 392.0 },
    { emoji: "🐶", name: "Dog",   says: "Woof woof", note: 196.0 },
    { emoji: "🐑", name: "Sheep", says: "Baaa",      note: 349.2 },
    { emoji: "🐸", name: "Frog",  says: "Ribbit",    note: 220.0 },
    { emoji: "🦆", name: "Duck",  says: "Quack",     note: 440.0 },
    { emoji: "🐝", name: "Bee",   says: "Bzzzz",     note: 587.3 },
    { emoji: "🐴", name: "Horse", says: "Neigh",     note: 293.7 },
    { emoji: "🐷", name: "Pig",   says: "Oink oink", note: 233.1 },
  ];

  function tap(btn, a) {
    Sound.tone(a.note, { dur: 0.4, type: "triangle", gain: 0.16 });
    Sound.say(a.name + ". " + a.says, { pitch: 1.25 });
    FX.burstAt(btn, 12);
    btn.classList.remove("bounce");
    void btn.offsetWidth; // restart animation
    btn.classList.add("bounce");
  }

  function play(stage) {
    stage.innerHTML =
      '<p class="prompt">Tap a friend to say hello!</p>' +
      '<div class="petgrid" id="petgrid"></div>';
    const grid = document.getElementById("petgrid");
    ANIMALS.forEach((a, i) => {
      const btn = document.createElement("button");
      btn.className = "tile animal pop-in";
      btn.style.animationDelay = (i * 60) + "ms";
      btn.style.background = "var(--sand)";
      btn.innerHTML =
        '<span class="animal__emoji" aria-hidden="true">' + a.emoji + "</span>" +
        '<span class="animal__name">' + a.name + "</span>";
      btn.setAttribute("aria-label", a.name);
      btn.addEventListener("pointerdown", (e) => { e.preventDefault(); tap(btn, a); });
      grid.appendChild(btn);
    });
    Session.countdown(PLAY_MS, () => Session.finish(stage, {
      message: "What lovely friends, Ali! 🐮",
      onAgain: () => play(stage),
    }));
  }

  window.Games = window.Games || {};
  window.Games.animals = {
    title: "Animals",
    mount(stage) { play(stage); },
    unmount() { Session.clear(); },
  };
})();
