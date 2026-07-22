import { useRef } from "react";

/* Thin wispy steam tendrils rising off the tea surface — curling and
   swaying rather than round puffs, reads as real steam against the
   photo's dark background. */
const WISPS = [
  { left: "62%", top: "37%", w: 6, h: 40, dur: "4.2s", delay: "0.1s", sway: 8, peak: 0.46 },
  { left: "66%", top: "36%", w: 6, h: 42, dur: "4.4s", delay: "0.6s", sway: 9, peak: 0.5 },
  { left: "69%", top: "32%", w: 8, h: 50, dur: "5s", delay: "1s", sway: 12, peak: 0.55 },
  { left: "72%", top: "35%", w: 5, h: 38, dur: "3.8s", delay: "1.4s", sway: 8, peak: 0.45 },
  { left: "75%", top: "30%", w: 7, h: 48, dur: "4.8s", delay: "0.3s", sway: 10, peak: 0.5 },
  { left: "68%", top: "39%", w: 6, h: 34, dur: "4.6s", delay: "1.9s", sway: 10, peak: 0.42 },
  { left: "78%", top: "34%", w: 6, h: 44, dur: "4.3s", delay: "2.2s", sway: 9, peak: 0.47 },
  { left: "81%", top: "38%", w: 5, h: 36, dur: "4s", delay: "2.6s", sway: 7, peak: 0.4 },
  { left: "73%", top: "28%", w: 7, h: 46, dur: "5.2s", delay: "2.9s", sway: 11, peak: 0.48 },
  { left: "84%", top: "40%", w: 5, h: 32, dur: "3.6s", delay: "1.1s", sway: 6, peak: 0.38 },
  { left: "64%", top: "42%", w: 5, h: 30, dur: "4.1s", delay: "3.2s", sway: 7, peak: 0.4 },
  { left: "77%", top: "42%", w: 6, h: 36, dur: "4.7s", delay: "0.9s", sway: 8, peak: 0.44 },
];

function SteamPuffs() {
  return WISPS.map((s, i) => (
    <span
      key={i}
      aria-hidden
      className="tea-wisp"
      style={{
        left: s.left,
        top: s.top,
        "--w": `${s.w}px`,
        "--h": `${s.h}px`,
        "--dur": s.dur,
        "--delay": s.delay,
        "--sway": `${s.sway}px`,
        "--peak": s.peak,
      }}
    />
  ));
}

/* Hot herbal tea card: real photo + rising steam + 3D mouse-tilt,
   matching the site's other 3D-card treatments. */
export default function TeaCard({ src, className = "" }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-py * 6}deg) rotateY(${
      px * 6
    }deg) scale3d(1.015, 1.015, 1.015)`;
  };
  const handleLeave = () => {
    ref.current.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`relative rounded-3xl overflow-hidden shadow-2xl ${className}`}
      style={{ transformStyle: "preserve-3d", transition: "transform 0.18s ease-out" }}
    >
      <img src={src} className="absolute inset-0 w-full h-full object-cover" />
      <SteamPuffs />
    </div>
  );
}
