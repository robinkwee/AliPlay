/* ============================================================
   AliPlay Session — the shared "every game must end" helper.
   Toddlers don't self-regulate screen time, so the game does it
   for them: a short, finite session that winds down to one calm
   "All done!" celebration with big Play again / Back home buttons.

   Two ways a game ends:
     • Round / action based — the game counts (e.g. 5 rounds, pop
       20 bubbles) and calls Session.finish() itself.
     • Time based (free-play toys like Animals & Music) — call
       Session.countdown(ms, onDone); it ends gently after a while.

   See CLAUDE.md → "Every game must end".
   ============================================================ */
(function () {
  const Session = {
    _timer: null,

    /* Free-play timer: call onDone once after `ms`. Replaces any
       previous countdown. Cleared by the game's unmount via clear(). */
    countdown(ms, onDone) {
      this.clear();
      this._timer = setTimeout(() => {
        this._timer = null;
        onDone();
      }, ms);
    },

    clear() {
      if (this._timer) {
        clearTimeout(this._timer);
        this._timer = null;
      }
    },

    /* Render the calm finish card into the game stage. One happy
       celebration, then two big choices. Always honors the toggle
       through Sound/FX. `onAgain` restarts the game in place; the
       Back home button reuses the topbar back button (which runs the
       game's unmount cleanly). */
    finish(stage, { message = "All done, Ali!", onAgain } = {}) {
      this.clear();
      Sound.yay();
      setTimeout(() => Sound.praise(), 280);
      FX.rain(40);

      stage.innerHTML =
        '<div class="finish pop-in">' +
          '<div class="finish__mark" aria-hidden="true">🎉</div>' +
          '<p class="finish__msg">' + message + '</p>' +
          '<div class="finish__btns">' +
            '<button class="big-btn big-btn--go" id="finish-again">' +
              '<span aria-hidden="true">🔁</span> Play again</button>' +
            '<button class="big-btn" id="finish-home">' +
              '<span aria-hidden="true">🏠</span> All done</button>' +
          '</div>' +
        '</div>';

      const again = stage.querySelector("#finish-again");
      const home = stage.querySelector("#finish-home");
      again.addEventListener("click", () => {
        Sound.tap();
        if (onAgain) onAgain();
      });
      home.addEventListener("click", () => {
        Sound.tap();
        const back = document.getElementById("back-btn");
        if (back) back.click();
      });
    },
  };

  window.Session = Session;
})();
