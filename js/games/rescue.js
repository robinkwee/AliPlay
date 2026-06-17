/* ============================================================
   RESCUE — Tap the flickering fires to put them out. A puppy
   pops up where each fire was, water splashes, and the score
   climbs. Tap the firetruck for a siren. Endless and gentle.
   Adapted from the standalone "Puppy Rescue Firetruck!".
   ============================================================ */
(function () {
  const PUPS = ["🐶", "🐕", "🐩", "🦮", "🐱"];

  let scene, scoreEl, score, timers, spawnInt, alive;

  function later(fn, ms) {
    const id = setTimeout(fn, ms);
    timers.push(id);
    return id;
  }

  function spawnFire() {
    if (!alive) return;
    const f = document.createElement("button");
    f.className = "ember fire";
    f.textContent = "🔥";
    f.style.left = (8 + Math.random() * 74) + "%";
    f.style.top = (10 + Math.random() * 50) + "%";
    f.setAttribute("aria-label", "fire — tap to put out");
    f.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      rescue(f);
    });
    scene.appendChild(f);
  }

  function rescue(fire) {
    if (fire._done) return;
    fire._done = true;
    Sound.spray();
    Sound.good();
    FX.burstAt(fire, 14);

    const left = fire.style.left, top = fire.style.top;

    // Water splash where the fire was.
    const w = document.createElement("div");
    w.className = "splash";
    w.textContent = "💦";
    w.style.left = left;
    w.style.top = top;
    scene.appendChild(w);
    later(() => w.remove(), 600);

    fire.remove();

    // A happy puppy pops up in its place.
    const pup = document.createElement("div");
    pup.className = "ember happy";
    pup.textContent = PUPS[(Math.random() * PUPS.length) | 0];
    pup.style.left = left;
    pup.style.top = top;
    scene.appendChild(pup);
    later(() => pup.remove(), 1300);

    score++;
    scoreEl.textContent = "🐶 " + score;
    scoreEl.classList.remove("hud-pop");
    void scoreEl.offsetWidth;
    scoreEl.classList.add("hud-pop");
    if (score % 5 === 0) Sound.praise("");  // an occasional spoken cheer

    later(spawnFire, 500 + Math.random() * 500);
  }

  window.Games = window.Games || {};
  window.Games.rescue = {
    title: "Rescue",
    immersive: true,
    mount(stage) {
      score = 0;
      timers = [];
      alive = true;
      stage.innerHTML =
        '<div class="rescue-scene" id="rescue-scene">' +
        '  <div class="hud" id="rescue-score">🐶 0</div>' +
        '  <button class="rescue-truck" id="rescue-truck" aria-label="firetruck">🚒</button>' +
        "</div>";
      scene = document.getElementById("rescue-scene");
      scoreEl = document.getElementById("rescue-score");

      const truck = document.getElementById("rescue-truck");
      truck.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        Sound.siren();
        truck.classList.remove("go");
        void truck.offsetWidth;
        truck.classList.add("go");
      });

      spawnFire();
      spawnFire();
      // Keep a couple of fires around so there's always something to tap.
      spawnInt = setInterval(() => {
        if (alive && scene.querySelectorAll(".fire").length < 2) spawnFire();
      }, 2200);
    },
    unmount() {
      alive = false;
      clearInterval(spawnInt);
      timers.forEach(clearTimeout);
      timers = [];
    },
  };
})();
