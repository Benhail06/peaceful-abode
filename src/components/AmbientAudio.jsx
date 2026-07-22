import { useEffect, useRef, useState } from "react";

/* Builds a soft, looping ambient soundscape entirely in code — a slow
   evolving pad plus a filtered-noise "waves washing ashore" texture —
   so there's no external audio file or licensing to worry about. */
function buildSoundscape(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  /* --- filtered noise: soft waves washing in and out --- */
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  noiseSource.loop = true;

  const waveFilter = ctx.createBiquadFilter();
  waveFilter.type = "bandpass";
  waveFilter.frequency.value = 500;
  waveFilter.Q.value = 0.6;

  const waveGain = ctx.createGain();
  waveGain.gain.value = 0.05;

  /* slow LFO swells the noise cutoff + volume, like waves rolling in */
  const waveLfo = ctx.createOscillator();
  waveLfo.type = "sine";
  waveLfo.frequency.value = 0.09;
  const waveLfoFilterGain = ctx.createGain();
  waveLfoFilterGain.gain.value = 260;
  waveLfo.connect(waveLfoFilterGain);
  waveLfoFilterGain.connect(waveFilter.frequency);

  const waveLfoVol = ctx.createGain();
  waveLfoVol.gain.value = 0.035;
  waveLfo.connect(waveLfoVol);
  waveLfoVol.connect(waveGain.gain);

  noiseSource.connect(waveFilter);
  waveFilter.connect(waveGain);
  waveGain.connect(master);

  noiseSource.start();
  waveLfo.start();

  /* --- soft piano bus: mellow tone, gentle room reverb --- */
  const pianoGain = ctx.createGain();
  pianoGain.gain.value = 0.5;
  const pianoFilter = ctx.createBiquadFilter();
  pianoFilter.type = "lowpass";
  pianoFilter.frequency.value = 2200;

  /* small synthetic reverb: short noise burst shaped into a decaying
     impulse response, no external file needed */
  const reverb = ctx.createConvolver();
  const irLength = ctx.sampleRate * 2.2;
  const irBuffer = ctx.createBuffer(2, irLength, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const irData = irBuffer.getChannelData(ch);
    for (let i = 0; i < irLength; i++) {
      irData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLength, 2.5);
    }
  }
  reverb.buffer = irBuffer;
  const reverbGain = ctx.createGain();
  reverbGain.gain.value = 0.55;

  pianoFilter.connect(pianoGain);
  pianoGain.connect(master);
  pianoFilter.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(master);

  /* plucked, piano-like note: fundamental + soft harmonics, fast
     attack, natural exponential decay */
  function playPianoNote(freq, time, duration, velocity = 1) {
    const partials = [
      { mult: 1, gain: 1 },
      { mult: 2, gain: 0.28 },
      { mult: 3, gain: 0.1 },
      { mult: 4.2, gain: 0.04 }, // slightly inharmonic, like a real string
    ];
    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq * p.mult;

      const g = ctx.createGain();
      const peak = 0.22 * velocity * p.gain;
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(peak, time + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc.connect(g);
      g.connect(pianoFilter);
      osc.start(time);
      osc.stop(time + duration + 0.1);
    });
  }

  return {
    master,
    playPianoNote,
    stopAll() {
      noiseSource.stop();
      waveLfo.stop();
    },
  };
}

/* A gentle, original I–V–vi–IV progression in A major — the same
   warm, flowing-water feel as slow ambient piano pieces, built from
   an ordinary diatonic progression rather than any existing melody.
   Each chord carries its own arpeggio tones (low to high) and a
   couple of "singing" melody tones above it. */
const PROGRESSION = [
  {
    // A major (I)
    arp: [220.0, 277.18, 329.63, 440.0],
    melody: [659.25, 554.37],
  },
  {
    // E major (V)
    arp: [164.81, 207.65, 246.94, 329.63],
    melody: [493.88, 415.3],
  },
  {
    // F#minor (vi)
    arp: [185.0, 220.0, 277.18, 369.99],
    melody: [554.37, 440.0],
  },
  {
    // D major (IV) — resolves the phrase before it loops
    arp: [146.83, 185.0, 220.0, 293.66],
    melody: [587.33, 369.99],
  },
];
/* rolling up-down pattern through each chord's 4 arpeggio tones —
   the "river" motion under the melody */
const ARP_PATTERN = [0, 1, 2, 3, 2, 1, 2, 3];

export default function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef(null);
  const soundRef = useRef(null);
  const melodyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(melodyTimerRef.current);
      soundRef.current?.stopAll();
      ctxRef.current?.close();
    };
  }, []);

  /* slow, flowing piano piece: a rolling arpeggio "current" under a
     held, singing melody line, looping through the 4-bar progression
     — this is what makes it feel like an actual piece rather than
     random notes, matching the site's calm, flowing-water mood. */
  function scheduleMelody() {
    const ctx = ctxRef.current;
    const sound = soundRef.current;
    const barDuration = 5.6; // slow tempo, ~ one bar every 5.6s
    const stepDuration = barDuration / ARP_PATTERN.length;
    let bar = 0;

    const playBar = () => {
      const chord = PROGRESSION[bar % PROGRESSION.length];
      const barStart = ctx.currentTime + 0.05;

      /* the flowing arpeggio current underneath */
      ARP_PATTERN.forEach((toneIndex, i) => {
        const jitter = (Math.random() - 0.5) * 0.03;
        const time = barStart + i * stepDuration + jitter;
        const velocity = 0.4 + Math.random() * 0.18;
        sound.playPianoNote(chord.arp[toneIndex], time, stepDuration * 2.1, velocity);
      });

      /* the slow singing melody line above it, two long notes per bar */
      sound.playPianoNote(chord.melody[0], barStart + 0.02, barDuration * 0.62, 0.85);
      sound.playPianoNote(
        chord.melody[1],
        barStart + barDuration * 0.58,
        barDuration * 0.55,
        0.7
      );

      bar += 1;
      melodyTimerRef.current = setTimeout(playBar, barDuration * 1000);
    };

    playBar();
  }

  const toggle = () => {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctxRef.current = new AudioCtx();
      soundRef.current = buildSoundscape(ctxRef.current);
    }
    const ctx = ctxRef.current;
    const master = soundRef.current.master;
    const now = ctx.currentTime;

    if (!playing) {
      ctx.resume();
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0.8, now + 2.5);
      scheduleMelody();
    } else {
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 1.2);
      clearTimeout(melodyTimerRef.current);
    }
    setPlaying(!playing);
  };

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-black/40 hover:bg-black/55 backdrop-blur-md text-white flex items-center justify-center transition shadow-lg"
    >
      {playing ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 6a9 9 0 0 1 0 12" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 5 6 9H3v6h3l5 4V5Z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
