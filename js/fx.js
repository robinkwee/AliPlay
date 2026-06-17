/* ============================================================
   AliPlay FX — soft confetti bursts in the brand palette.
   Used to reward correct taps and finished rounds.
   ============================================================ */
(function () {
  const layer = () => document.getElementById("fx");
  const COLORS = ["#E5A93C", "#7FA185", "#D06A4C", "#C98B6B", "#F7E6C4"];

  const reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function burst(x, y, count = 16) {
    const root = layer();
    if (!root || reduce) return;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");
      bit.className = "confetti";
      bit.style.left = x + "px";
      bit.style.top = y + "px";
      bit.style.background = COLORS[i % COLORS.length];
      if (i % 3 === 0) bit.style.borderRadius = "50%";
      root.appendChild(bit);

      const angle = (Math.PI * 2 * i) / count + Math.random();
      const dist = 60 + Math.random() * 120;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 40; // bias upward
      const rot = (Math.random() * 720 - 360) + "deg";

      bit.animate(
        [
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy + 160}px) rotate(${rot})`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = () => bit.remove();
    }
  }

  /* Burst centered on an element. */
  function burstAt(el, count) {
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  /* Celebration rain from the top. */
  function rain(count = 40) {
    const root = layer();
    if (!root || reduce) return;
    const W = window.innerWidth;
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("span");
      bit.className = "confetti";
      bit.style.left = Math.random() * W + "px";
      bit.style.top = "-20px";
      bit.style.background = COLORS[i % COLORS.length];
      if (i % 2 === 0) bit.style.borderRadius = "50%";
      root.appendChild(bit);
      const dx = (Math.random() * 120 - 60) + "px";
      const rot = (Math.random() * 720) + "deg";
      bit.animate(
        [
          { transform: "translate(0,0) rotate(0)", opacity: 1 },
          { transform: `translate(${dx}, ${window.innerHeight + 60}px) rotate(${rot})`, opacity: 1 },
          { opacity: 0 },
        ],
        { duration: 1600 + Math.random() * 1200, easing: "cubic-bezier(.3,.6,.4,1)" }
      ).onfinish = () => bit.remove();
    }
  }

  window.FX = { burst, burstAt, rain };
})();
