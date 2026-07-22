import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

/* Wedge traced over the real front-right slice of the pizza photo. */
const ORIGIN = [48.3, 74.5]; // slice tip, lift pivot
const TIP_ORIGIN = "48.3% 74.5%";
const WEDGE_POINTS = [
  [48.3, 74.5],
  [59.2, 75.8],
  [70.2, 77.9],
  [69.9, 81.6],
  [66, 85.4],
  [60.5, 87.8],
  [54.5, 88.6],
];
/* axis from the tip toward the crust, used to slice the wedge into bend strips */
const AXIS_FAR = [66, 85.4];

function edgeMaskStyle(points) {
  const pts = points.map(([x, y]) => `${x},${y}`).join(" ");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><filter id='f' x='-20%' y='-20%' width='140%' height='140%'><feGaussianBlur stdDeviation='0.55'/></filter><polygon points='${pts}' fill='#fff' filter='url(#f)'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    WebkitMaskImage: url,
    maskImage: url,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };
}

/* Sutherland–Hodgman: clip a polygon to the half-plane dot(p - tip, u) <= limit
   (side = 1) or >= limit (side = -1). Used to cut the wedge into bend strips. */
function clipHalfPlane(poly, u, limit, side) {
  const value = ([x, y]) => (x - ORIGIN[0]) * u[0] + (y - ORIGIN[1]) * u[1];
  const inside = (p) => side * (value(p) - limit) <= 0;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const curr = poly[i];
    const prev = poly[(i - 1 + poly.length) % poly.length];
    const currIn = inside(curr);
    const prevIn = inside(prev);
    if (currIn !== prevIn) {
      const vPrev = value(prev);
      const vCurr = value(curr);
      const t = (limit - vPrev) / (vCurr - vPrev);
      out.push([prev[0] + t * (curr[0] - prev[0]), prev[1] + t * (curr[1] - prev[1])]);
    }
    if (currIn) out.push(curr);
  }
  return out;
}

/* Build N overlapping strips across the wedge, tip to crust. Overlap
   hides any seam between strips even though each is blurred/masked
   independently — together they read as one continuously bending slice. */
function buildBendStrips(n) {
  const dx = AXIS_FAR[0] - ORIGIN[0];
  const dy = AXIS_FAR[1] - ORIGIN[1];
  const len = Math.hypot(dx, dy);
  const u = [dx / len, dy / len];
  const tMax = Math.max(
    ...WEDGE_POINTS.map(([x, y]) => (x - ORIGIN[0]) * u[0] + (y - ORIGIN[1]) * u[1])
  );
  const overlap = tMax * 0.09;
  const strips = [];
  for (let i = 0; i < n; i++) {
    const lo = (tMax * i) / n - overlap;
    const hi = (tMax * (i + 1)) / n + overlap;
    let poly = clipHalfPlane(WEDGE_POINTS, u, lo, -1);
    poly = clipHalfPlane(poly, u, hi, 1);
    const f = (i + 0.5) / n; // 0 near the tip, 1 near the crust
    strips.push({ mask: edgeMaskStyle(poly), f });
  }
  return strips;
}
const BEND_STRIPS = buildBendStrips(6);
/* slice displacement at full lift, in % of the container (viewBox units) */
const TX = 4;
const TY = -15;

/* Where a point of the slice ends up after the lift transform —
   used so cheese strands stay glued to the slice's underside.
   w = hand-held wobble, amplitude gated by lift progress. */
function slicePoint(b, p, w = 0) {
  const s = 1 + 0.18 * p;
  const thz = ((-4 * Math.PI) / 180) * p;
  const foreshorten = Math.cos(((22 * Math.PI) / 180) * p);
  const rx = (b[0] - ORIGIN[0]) * s;
  const ry = (b[1] - ORIGIN[1]) * s;
  const zx = rx * Math.cos(thz) - ry * Math.sin(thz);
  const zy = (rx * Math.sin(thz) + ry * Math.cos(thz)) * foreshorten;
  return [
    ORIGIN[0] + zx + TX * p + 0.5 * w * p,
    ORIGIN[1] + zy + TY * p + 1.6 * p + 1.1 * w * p,
  ];
}

/* Filled, tapered mozzarella strand: wide meniscus at both ends,
   pinches thin in the middle as it stretches; optional hanging drip.
   bend = a slight asymmetric bulge so the strand isn't a perfectly
   symmetric taper (real cheese pulls kink and curl unevenly). */
function CheeseStrand({ progress, base, wTop, wBase, sag, drip, snappy, bend = 0 }) {
  const d = useTransform(progress, (p) => {
    const [tx, ty] = slicePoint(base, p);
    const [bx, by] = base;
    const mx = (tx + bx) / 2 + 0.3 + bend * p;
    const my = (ty + by) / 2 + sag * (1 - 0.35 * p);
    const pinch = 1 - 0.75 * p;
    const wt = wTop * (1 - 0.3 * p);
    const wb = wBase * (1 - 0.15 * p);
    const wm = ((wt + wb) / 2) * pinch;
    return `M ${tx - wt} ${ty}
      Q ${mx - wm - bend * 0.4 * p} ${my} ${bx - wb} ${by}
      L ${bx + wb} ${by}
      Q ${mx + wm - bend * 0.4 * p} ${my} ${tx + wt} ${ty} Z`;
  });
  const highlight = useTransform(progress, (p) => {
    const [tx, ty] = slicePoint(base, p);
    const [bx, by] = base;
    const mx = (tx + bx) / 2 + 0.3 + bend * p;
    const my = (ty + by) / 2 + sag * (1 - 0.35 * p);
    return `M ${tx - 0.15} ${ty} Q ${mx - 0.2} ${my} ${bx} ${by}`;
  });
  const opacity = useTransform(
    progress,
    snappy ? [0, 0.15, 0.8, 1] : [0, 0.15, 1],
    snappy ? [0, 0.97, 0.92, 0.3] : [0, 0.97, 0.92]
  );
  const dripCx = useTransform(
    progress,
    (p) => (slicePoint(base, p)[0] + base[0]) / 2 + 0.3 + bend * p
  );
  const dripCy = useTransform(progress, (p) => {
    const my = (slicePoint(base, p)[1] + base[1]) / 2 + sag * (1 - 0.35 * p);
    return my + 0.6 + 2.2 * p;
  });
  const dripRy = useTransform(progress, [0, 1], [0.4, 1.6]);
  const dripRx = useTransform(progress, [0, 1], [0.55, 0.38]);
  const dripGlossRx = useTransform(dripRx, (v) => v * 0.35);
  const dripGlossRy = useTransform(dripRy, (v) => v * 0.3);

  return (
    <motion.g style={{ opacity }}>
      <motion.path d={d} fill="url(#cheeseGrad)" />
      <motion.path
        d={highlight}
        stroke="rgba(255,255,250,0.75)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeLinecap="round"
      />
      {drip && (
        <>
          <motion.ellipse
            cx={dripCx}
            cy={dripCy}
            rx={dripRx}
            ry={dripRy}
            fill="url(#cheeseGrad)"
          />
          <motion.ellipse
            cx={dripCx}
            cy={dripCy}
            rx={dripGlossRx}
            ry={dripGlossRy}
            fill="rgba(255,255,255,0.55)"
          />
        </>
      )}
    </motion.g>
  );
}

/* steam sources spread across the whole pizza surface, not just the
   wedge (left/top in %, size in px) */
const STEAM = [
  { left: "22%", top: "62%", size: 52, dur: "3.6s", delay: "0.2s", drift: "-14px", peak: 0.5 },
  { left: "16%", top: "70%", size: 58, dur: "4.2s", delay: "1.4s", drift: "16px", peak: 0.46 },
  { left: "27%", top: "77%", size: 46, dur: "3.1s", delay: "0.6s", drift: "-10px", peak: 0.52 },
  { left: "34%", top: "60%", size: 44, dur: "3.8s", delay: "2s", drift: "14px", peak: 0.48 },
  { left: "38%", top: "68%", size: 60, dur: "3.4s", delay: "0s", drift: "18px", peak: 0.55 },
  { left: "46%", top: "63%", size: 50, dur: "3s", delay: "0.9s", drift: "-14px", peak: 0.58 },
  { left: "53%", top: "66%", size: 64, dur: "3.9s", delay: "0.4s", drift: "22px", peak: 0.5 },
  { left: "43%", top: "73%", size: 54, dur: "3.2s", delay: "1.6s", drift: "-18px", peak: 0.52 },
  { left: "58%", top: "71%", size: 46, dur: "3.6s", delay: "1.3s", drift: "12px", peak: 0.46 },
  { left: "33%", top: "74%", size: 52, dur: "4s", delay: "2.1s", drift: "16px", peak: 0.46 },
  { left: "50%", top: "58%", size: 44, dur: "3.3s", delay: "2.5s", drift: "-10px", peak: 0.52 },
  { left: "63%", top: "64%", size: 48, dur: "3.8s", delay: "2.8s", drift: "12px", peak: 0.47 },
  { left: "68%", top: "73%", size: 42, dur: "3.4s", delay: "0.7s", drift: "-15px", peak: 0.44 },
  { left: "24%", top: "84%", size: 40, dur: "4s", delay: "1.6s", drift: "10px", peak: 0.42 },
  { left: "40%", top: "58%", size: 40, dur: "3.5s", delay: "3.2s", drift: "-9px", peak: 0.48 },
  { left: "56%", top: "60%", size: 42, dur: "3.7s", delay: "1.9s", drift: "11px", peak: 0.5 },
  { left: "30%", top: "66%", size: 38, dur: "3.1s", delay: "2.9s", drift: "-12px", peak: 0.46 },
  { left: "61%", top: "68%", size: 40, dur: "4.1s", delay: "0.3s", drift: "13px", peak: 0.44 },
];

/* a couple of wisps rising off the lifted slice itself */
const SLICE_STEAM = [
  { left: "56%", top: "74%", size: 46, dur: "3.2s", delay: "0.4s", drift: "12px", peak: 0.55 },
  { left: "62%", top: "78%", size: 40, dur: "3.6s", delay: "1.5s", drift: "-11px", peak: 0.5 },
  { left: "59%", top: "83%", size: 36, dur: "3s", delay: "0.9s", drift: "9px", peak: 0.48 },
];

function SteamPuffs({ puffs }) {
  return puffs.map((s, i) => (
    <span
      key={i}
      aria-hidden
      className="steam-puff"
      style={{
        left: s.left,
        top: s.top,
        width: s.size,
        height: s.size,
        "--dur": s.dur,
        "--delay": s.delay,
        "--drift": s.drift,
        "--peak": s.peak,
      }}
    />
  ));
}

/* Cheese hanging directly off the slice's own cut edge — lives inside
   the slice's own transformed layer, so it rides along rigidly as one
   piece and simply grows/sways in the slice's local coordinate space
   (reads as gravity stretching it downward as the slice rises). */
function HangingCheese({ progress, x, y, len, width, curve, delayed }) {
  const d = useTransform(progress, (p) => {
    const pp = delayed ? Math.max(0, (p - 0.12) / 0.88) : p;
    const L = len * pp;
    const tipY = y + L;
    const cx = x + curve * pp;
    const wTop = width;
    const wBot = width * 0.32 * (1 - 0.3 * pp);
    return `M ${x - wTop} ${y}
      Q ${cx - wBot} ${(y + tipY) / 2} ${x - wBot} ${tipY}
      L ${x + wBot} ${tipY}
      Q ${cx + wBot} ${(y + tipY) / 2} ${x + wTop} ${y} Z`;
  });
  const dripCy = useTransform(progress, (p) => {
    const pp = delayed ? Math.max(0, (p - 0.12) / 0.88) : p;
    return y + len * pp + 0.3;
  });
  const dripCx = useTransform(progress, (p) => {
    const pp = delayed ? Math.max(0, (p - 0.12) / 0.88) : p;
    return x + curve * pp;
  });
  const dripR = useTransform(progress, [0, 1], [0.15, width * 0.55]);
  const glossR = useTransform(dripR, (v) => v * 0.4);
  const opacity = useTransform(progress, [0, 0.1, 1], [0, 0.95, 1]);
  const highlight = useTransform(progress, (p) => {
    const pp = delayed ? Math.max(0, (p - 0.12) / 0.88) : p;
    const tipY = y + len * pp;
    const cx = x + curve * pp;
    return `M ${x - width * 0.3} ${y} Q ${cx - width * 0.2} ${(y + tipY) / 2} ${x} ${tipY}`;
  });

  return (
    <motion.g style={{ opacity }}>
      <motion.path d={d} fill="url(#cheeseGrad)" />
      <motion.path
        d={highlight}
        stroke="rgba(255,255,250,0.7)"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        fill="none"
        strokeLinecap="round"
      />
      <motion.ellipse cx={dripCx} cy={dripCy} rx={dripR} ry={dripR} fill="url(#cheeseGrad)" />
      <motion.ellipse cx={dripCx} cy={dripCy} rx={glossR} ry={glossR} fill="rgba(255,255,255,0.6)" />
    </motion.g>
  );
}

/* anchor points along the slice's own cut edge (near the tip), in the
   slice's local coordinate space */
const HANGING_CHEESE = [
  { x: 49.6, y: 74.6, len: 9, width: 0.7, curve: 1.2 },
  { x: 51.8, y: 74.95, len: 13, width: 0.9, curve: -0.8, delayed: true },
  { x: 54.2, y: 75.25, len: 7.5, width: 0.6, curve: 1.5 },
  { x: 56.6, y: 75.55, len: 11, width: 0.8, curve: -1.1, delayed: true },
  { x: 48.9, y: 76.6, len: 8, width: 0.65, curve: 1.0 },
  { x: 49.6, y: 79.3, len: 10, width: 0.75, curve: -0.9, delayed: true },
  { x: 50.3, y: 83.0, len: 6.5, width: 0.55, curve: 0.8 },
];

/* strand roots along the two cut edges near the tip */
const STRANDS = [
  { base: [50.3, 74.73], wTop: 0.6, wBase: 0.9, sag: 4.5, bend: 0.6 },
  { base: [52.2, 74.97], wTop: 0.8, wBase: 1.1, sag: 7, drip: true, bend: -0.9 },
  { base: [54.3, 75.22], wTop: 0.55, wBase: 0.8, sag: 5.5, snappy: true, bend: 1.1 },
  { base: [56.2, 75.44], wTop: 0.7, wBase: 1.0, sag: 8, drip: true, bend: -0.5 },
  { base: [57.9, 75.64], wTop: 0.45, wBase: 0.7, sag: 6, snappy: true, bend: 0.8 },
  { base: [49.9, 78.0], wTop: 0.65, wBase: 0.95, sag: 5, bend: -0.7 },
  { base: [51.4, 81.55], wTop: 0.55, wBase: 0.85, sag: 6.5, drip: true, bend: 0.5 },
];

/* blurred melted-cheese beads along the cut edges (gap side + slice side) */
const RIM_GAP =
  "M 48.3 74.2 L 59.2 75.5 L 59.2 76.5 L 48.3 75.3 Z M 48 74.5 L 54.8 88.6 L 53.7 89 L 47.6 75 Z";

/* One overlapping strip of the slice, top + underside, with its own
   small extra rotation/droop scaled by how far it sits from the tip —
   together the strips read as one piece bending continuously. */
function BendStrip({ mask, f, progress, undersideY, src }) {
  const rotate = useTransform(progress, (p) => 7 * f * p);
  const droop = useTransform(progress, (p) => 2.6 * f * p);
  const transform = useTransform(
    [rotate, droop],
    ([r, t]) => `translateY(${t}%) rotate(${r}deg)`
  );
  return (
    <motion.div
      className="absolute inset-0"
      style={{ transform, transformOrigin: TIP_ORIGIN }}
    >
      <motion.img
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          ...mask,
          y: undersideY,
          filter: "brightness(0.5) saturate(1.3) sepia(0.35)",
        }}
      />
      <img
        src={src}
        className="absolute inset-0 w-full h-full object-cover"
        style={mask}
      />
    </motion.div>
  );
}

export default function PizzaSlice({ src, emptySrc, className = "" }) {
  const ref = useRef(null);
  const raw = useMotionValue(0);
  /* soft, slow spring — the slice eases up gently */
  const progress = useSpring(raw, { stiffness: 38, damping: 24 });

  useEffect(() => {
    const el = ref.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* longer scroll range = slower, more gradual lift */
      const start = vh * 0.95;
      const end = vh * 0.3;
      const p = (start - rect.top) / (start - end);
      raw.set(Math.min(1, Math.max(0, p)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [raw]);

  /* percentage-based so the lift scales with the container */
  const y = useTransform(progress, (p) => `${TY * p}%`);
  const x = useTransform(progress, (p) => `${TX * p}%`);
  const rotate = useTransform(progress, [0, 1], [0, -4]);
  const rotateX = useTransform(progress, [0, 1], [0, 22]);
  const scale = useTransform(progress, [0, 1], [1, 1.18]);
  const undersideY = useTransform(progress, (p) => `${1.6 * p}%`);
  const gapOpacity = useTransform(progress, [0, 0.25, 1], [0, 0.9, 1]);
  const rimOpacity = useTransform(progress, [0, 0.15, 1], [0, 0.75, 0.9]);
  const shadow = useTransform(
    progress,
    [0, 1],
    [
      "drop-shadow(0px 2px 2px rgba(20,10,4,0))",
      "drop-shadow(16px 46px 36px rgba(20,10,4,0.6))",
    ]
  );

  return (
    <div
      ref={ref}
      className={`relative rounded-3xl shadow-2xl ${className}`}
      style={{ perspective: 1000, aspectRatio: "3 / 2" }}
    >
      {/* base photo */}
      <img
        src={src}
        className="absolute inset-0 w-full h-full object-cover rounded-3xl"
      />

      {/* the same photo with the slice digitally removed — real board
          grain and shadow. Fades in as the slice lifts away. */}
      <motion.img
        aria-hidden
        src={emptySrc}
        className="absolute inset-0 w-full h-full object-cover rounded-3xl pointer-events-none"
        style={{ opacity: gapOpacity }}
      />

      {/* hot & just served — steam rising off the pizza */}
      <SteamPuffs puffs={STEAM} />

      {/* cheese layer */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          {/* baked, golden-brown cheese — matches the toasted crust and
              wooden pan tones instead of pale raw mozzarella */}
          <linearGradient id="cheeseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c876" />
            <stop offset="45%" stopColor="#d99f4a" />
            <stop offset="100%" stopColor="#a86b28" />
          </linearGradient>
          <filter id="cheeseBlur">
            <feGaussianBlur stdDeviation="0.45" />
          </filter>
        </defs>

        {/* melted rim where the slice tore away */}
        <motion.path
          d={RIM_GAP}
          fill="url(#cheeseGrad)"
          filter="url(#cheeseBlur)"
          style={{ opacity: rimOpacity }}
        />

        {STRANDS.map((s, i) => (
          <CheeseStrand key={i} progress={progress} {...s} />
        ))}
      </svg>

      {/* the lifting slice */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none will-change-transform"
        style={{
          y,
          x,
          rotate,
          rotateX,
          scale,
          filter: shadow,
          transformOrigin: TIP_ORIGIN,
        }}
      >
        {/* the slice as one continuous piece — built from overlapping
            strips so it can flex toward the crust with no visible seam */}
        {BEND_STRIPS.map((s, i) => (
          <BendStrip
            key={i}
            mask={s.mask}
            f={s.f}
            progress={progress}
            undersideY={undersideY}
            src={src}
          />
        ))}
        {/* cheese hanging off the slice's own cut edge — rigidly
            attached, rides with the slice as it lifts */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {HANGING_CHEESE.map((c, i) => (
            <HangingCheese key={i} progress={progress} {...c} />
          ))}
        </svg>
        {/* steam off the lifted slice too */}
        <SteamPuffs puffs={SLICE_STEAM} />
        {/* melted cheese bead on the slice's own cut edge */}
        <motion.svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ opacity: rimOpacity }}
        >
          <path
            d={RIM_GAP}
            fill="url(#cheeseGrad)"
            filter="url(#cheeseBlur)"
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}
