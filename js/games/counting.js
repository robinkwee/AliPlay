/* ============================================================
   COUNT ALONG — a friendly number of fruits appear. Tap each
   one; it bounces and counts up out loud. Count them all to
   celebrate, then a fresh basket arrives.
   ============================================================ */
(function () {
  const FRUITS = ["🍎", "🍌", "🍓", "🍊", "🍐", "🍇", "🥕", "🍋"];
  const GOAL = 4; // baskets, then "All done!"
  let count, tapped, fruit, stageEl, baskets;

  function round() {
    count = 1 + ((Math.random() * 5) | 0); // 1..5, gentle range
    tapped = 0;
    fruit = FRUITS[(Math.random() * FRUITS.length) | 0];

    document.getElementById("count-label").textContent = "Tap each one and count!";
    Sound.say("How many? Tap to count!");

    const tray = document.getElementById("count-tray");
    tray.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const btn = document.createElement("button");
      btn.className = "tile fruit pop-in";
      btn.style.animationDelay = (i * 90) + "ms";
      btn.style.background = "var(--sand)";
      btn.textContent = fruit;
      btn.setAttribute("aria-label", "fruit");
      btn.addEventListener("pointerdown", (e) => { e.preventDefault(); tapFruit(btn); });
      tray.appendChild(btn);
    }
    updateTally();
  }

  function updateTally() {
    document.getElementById("count-tally").textContent =
      tapped === 0 ? "" : "🔢 " + tapped;
  }

  function tapFruit(btn) {
    if (btn._done) return;
    btn._done = true;
    tapped++;
    Sound.tone(440 + tapped * 70, { dur: 0.22, type: "triangle", gain: 0.16 });
    Sound.say(String(tapped));
    btn.classList.add("fruit--done", "bounce");
    FX.burstAt(btn, 8);
    updateTally();

    if (tapped === count) {
      baskets++;
      setTimeout(() => {
        Sound.yay();
        Sound.praise("That's " + count + "!");
        FX.rain(40);
        document.getElementById("count-label").textContent = "🎉 " + count + "! Hooray!";
      }, 350);
      if (baskets >= GOAL) {
        setTimeout(() => Session.finish(stageEl, {
          message: "Great counting, Ali! 🍎",
          onAgain: () => play(stageEl),
        }), 1900);
      } else {
        setTimeout(round, 1900);
      }
    }
  }

  function play(stage) {
    stageEl = stage;
    baskets = 0;
    stage.innerHTML =
      '<p class="prompt" id="count-label">Tap each one and count!</p>' +
      '<div class="count-tray" id="count-tray"></div>' +
      '<p class="prompt count-tally" id="count-tally"></p>';
    round();
  }

  window.Games = window.Games || {};
  window.Games.counting = {
    title: "Counting",
    mount(stage) { play(stage); },
    unmount() {},
  };
})();
