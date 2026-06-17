/* ============================================================
   AliPlay audio — gentle synthesized tones via Web Audio API.
   No external files; everything is generated on the fly so the
   site works offline and from file://. Speech uses the built-in
   speechSynthesis voice for friendly word play.
   ============================================================ */
(function () {
  const Sound = {
    on: true,
    _ctx: null,

    ctx() {
      if (!this._ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this._ctx = new AC();
      }
      // Browsers suspend audio until a gesture; resume on demand.
      if (this._ctx && this._ctx.state === "suspended") this._ctx.resume();
      return this._ctx;
    },

    setEnabled(v) {
      this.on = v;
      if (!v) {
        this._queued = 0;
        window.speechSynthesis && window.speechSynthesis.cancel();
      }
    },

    /* A single soft sine/triangle "blip" with a gentle envelope. */
    tone(freq, { dur = 0.28, type = "sine", gain = 0.18, when = 0 } = {}) {
      if (!this.on) return;
      const ctx = this.ctx();
      if (!ctx) return;
      const t = ctx.currentTime + when;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    },

    /* Play a little ascending arpeggio of notes. */
    melody(freqs, { step = 0.12, type = "triangle", gain = 0.16, dur = 0.26 } = {}) {
      freqs.forEach((f, i) => this.tone(f, { when: i * step, type, gain, dur }));
    },

    /* Named friendly cues -------------------------------------------------- */
    pop() {
      if (!this.on) return;
      const ctx = this.ctx();
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(660, t);
      osc.frequency.exponentialRampToValueAtTime(1180, t + 0.07);
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(g).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    },
    tap()    { this.tone(523.25, { dur: 0.16, type: "triangle", gain: 0.14 }); },
    good()   { this.melody([523.25, 659.25, 783.99], { step: 0.1 }); },        // C E G
    yay()    { this.melody([523.25, 659.25, 783.99, 1046.5], { step: 0.09 }); },// + high C
    nope()   { this.tone(196, { dur: 0.22, type: "sine", gain: 0.14 });
               this.tone(174.6, { dur: 0.26, type: "sine", gain: 0.12, when: 0.12 }); },

    /* A gentle two-tone firetruck siren. */
    siren() {
      if (!this.on) return;
      const a = this.ctx();
      if (!a) return;
      const t = a.currentTime;
      const o = a.createOscillator();
      const g = a.createGain();
      o.type = "sine";
      o.connect(g).connect(a.destination);
      g.gain.setValueAtTime(0.16, t);
      o.frequency.setValueAtTime(660, t);
      o.frequency.linearRampToValueAtTime(990, t + 0.25);
      o.frequency.linearRampToValueAtTime(660, t + 0.5);
      o.frequency.linearRampToValueAtTime(990, t + 0.75);
      g.gain.linearRampToValueAtTime(0, t + 0.95);
      o.start(t);
      o.stop(t + 0.95);
    },

    /* A soft "whoosh" of water spray (filtered white noise). */
    spray() {
      if (!this.on) return;
      const a = this.ctx();
      if (!a) return;
      const t = a.currentTime;
      const buf = a.createBuffer(1, (a.sampleRate * 0.4) | 0, a.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = a.createBufferSource();
      s.buffer = buf;
      const f = a.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 600;
      const g = a.createGain();
      g.gain.setValueAtTime(0.22, t);
      g.gain.linearRampToValueAtTime(0, t + 0.4);
      s.connect(f).connect(g).connect(a.destination);
      s.start(t);
    },

    /* ---- Voice selection ------------------------------------------------ */
    _voice: null,

    /* Prefer warm, natural-sounding voices over the flat default. The
       priority list spans macOS, Chrome, and Windows; we fall back to any
       English voice, then whatever exists. */
    pickVoice() {
      if (!("speechSynthesis" in window)) return null;
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return null;
      const prefer = [
        /Google US English/i,
        /Samantha/i, /Karen/i, /Tessa/i, /Moira/i, /Serena/i,  // macOS, natural
        /Microsoft (Aria|Jenny|Michelle|Zira)/i,               // Windows, natural
        /Google UK English Female/i,
        /\bAva\b|\bAllison\b|\bSusan\b|\bNicky\b/i,
        /female/i,
      ];
      const english = voices.filter((v) => /^en(-|_|$)/i.test(v.lang));
      const pool = english.length ? english : voices;
      for (const re of prefer) {
        const v = pool.find((vo) => re.test(vo.name));
        if (v) return v;
      }
      // Avoid known "novelty"/robotic macOS voices if we can.
      const robotic = /Albert|Zarvox|Trinoids|Bad News|Bahh|Bells|Boing|Cellos|Deranged|Hysterical|Jester|Organ|Superstar|Whisper|Wobble|Fred|Junior|Ralph|Kathy/i;
      return pool.find((v) => !robotic.test(v.name)) || pool[0];
    },

    _ensureVoice() {
      if (!this._voice) this._voice = this.pickVoice();
      return this._voice;
    },

    /* How many of our utterances are still queued/playing. We let speech
       finish naturally (never call cancel mid-word), so nothing is ever cut
       off. To avoid a runaway backlog from rapid taps, we simply skip a new
       line once a couple are already waiting — dropping is silent, it never
       interrupts what's already being said. */
    _queued: 0,

    /* Speak a short word/number warmly. `cheer:true` makes it bright and
       excited for celebrations. A little pitch jitter keeps it lively
       instead of robotic and repetitive. */
    say(text, { rate, pitch, cheer = false, jitter = true } = {}) {
      if (!this.on || !("speechSynthesis" in window)) return;
      // Don't pile up: keep at most one playing + one waiting.
      if (this._queued >= 2) return;
      try {
        const u = new SpeechSynthesisUtterance(String(text));
        const v = this._ensureVoice();
        if (v) u.voice = v;
        u.lang = (v && v.lang) || "en-US";

        let r = rate != null ? rate : (cheer ? 1.06 : 0.96);
        let p = pitch != null ? pitch : (cheer ? 1.55 : 1.18);
        if (jitter) {
          r += (Math.random() - 0.5) * 0.06;
          p += (Math.random() - 0.5) * (cheer ? 0.12 : 0.08);
        }
        u.rate = Math.max(0.6, Math.min(1.4, r));
        u.pitch = Math.max(0.5, Math.min(2, p));
        u.volume = 1;

        // Release the slot exactly once, whichever fires first. The watchdog
        // covers the Chrome bug where onend never fires and would otherwise
        // wedge the queue shut forever.
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          this._queued = Math.max(0, this._queued - 1);
        };
        u.onend = settle;
        u.onerror = settle;
        this._queued++;
        setTimeout(settle, 1600 + String(text).length * 120);

        window.speechSynthesis.speak(u);
      } catch (e) { /* ignore */ }
    },

    /* An upbeat, congratulatory line. */
    cheer(text) { this.say(text, { cheer: true }); },

    /* A random happy phrase — keeps celebrations from feeling repetitive. */
    PRAISE: ["Yay!", "Hooray!", "Woohoo!", "Great job!", "Well done!",
             "Awesome!", "You did it!", "Nice one!", "Wonderful!"],
    praise(prefix) {
      const p = this.PRAISE[(Math.random() * this.PRAISE.length) | 0];
      this.cheer(prefix ? prefix + " " + p : p);
    },
  };

  /* Voices load asynchronously in most browsers — grab the best one as soon
     as the list is ready, and refresh if it changes. */
  if ("speechSynthesis" in window) {
    Sound._voice = Sound.pickVoice();
    window.speechSynthesis.addEventListener("voiceschanged", () => {
      Sound._voice = Sound.pickVoice();
    });
  }

  window.Sound = Sound;
})();
