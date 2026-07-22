import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import pondicherryBg from "../assets/pondicherry-bg.png";

/* ---------------------------------------------------------------
   Animated background — the hero photo rendered through a shader:
   flowing ripples on the water, wind sway on the trees, shimmer.
---------------------------------------------------------------- */
const BG_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BG_FRAGMENT = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uScale;
  varying vec2 vUv;

  /* value noise + fbm for organic, wind-driven motion */
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(17.3, 9.1);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    /* cover-fit the image */
    vec2 uv = (vUv - 0.5) * uScale + 0.5;

    /* slow-motion time base for the water — same size/strength of
       waves as before, just unfolding more languidly */
    float wt = uTime * 0.55;

    /* gusts shared by water and trees — wind picks up and dies down,
       higher floor now so the sea stays turbulent rather than calm */
    float gust = 0.7 + 0.5 * noise(vec2(wt * 0.45, 3.7));

    /* big slow swell rolling the shoreline in and out, like an
       incoming high tide surging up the rocks */
    float swell = sin(uv.x * 2.2 + wt * 0.9) * 0.02 + sin(uv.x * 5.1 - wt * 0.6) * 0.012;
    float waterMask = smoothstep(0.48 + swell, 0.08 + swell * 1.4, uv.y);

    /* WATER — noise-driven flow advected sideways by the wind, big
       powerful displacement but slowed down for a heavier, langorous roll */
    vec2 flowUv = uv * vec2(8.0, 22.0) + vec2(wt * 0.85, wt * 0.3);
    float n1 = fbm(flowUv);
    float n2 = fbm(flowUv * 1.8 - vec2(wt * 0.65, wt * 0.18));
    /* choppy short waves layered on the noise swell */
    float chop = sin(uv.x * 110.0 + uv.y * 160.0 + wt * 5.5) * 0.0026
      + sin(uv.x * 60.0 - uv.y * 90.0 + wt * 3.8) * 0.0018;
    vec2 waterOffset =
      (vec2(n1 - 0.5, n2 - 0.5) * 0.026 * (0.8 + 0.7 * gust) + vec2(chop, chop * 0.7)) *
      waterMask;

    /* WIND — only the tree canopies (upper band, above the rooflines).
       Buildings and trunks below stay perfectly still; horizontal-only
       displacement so straight edges never smear vertically. */
    float windMask = smoothstep(0.62, 0.78, uv.y) * (1.0 - smoothstep(0.88, 1.0, uv.y));
    float swayNoise = noise(vec2(uv.x * 4.0, uTime * 0.6)) - 0.5;
    vec2 windOffset = vec2(
      (sin(uv.y * 13.0 + uTime * 1.4) * 0.0045 +
        sin(uv.y * 30.0 + uTime * 0.9) * 0.0022 +
        swayNoise * 0.006) * (0.5 + gust),
      0.0
    ) * windMask;

    vec4 tex = texture2D(uTexture, uv + waterOffset + windOffset);

    /* sun glints drifting across the water, brighter and busier */
    float glint = smoothstep(
      0.62, 0.93,
      fbm(uv * vec2(30.0, 62.0) + vec2(wt * 1.6, -wt * 0.6))
    );
    tex.rgb += glint * 0.16 * waterMask;

    /* whitecap foam where the chop crests — high-tide turbulence */
    float crest = abs(n1 - 0.5) + abs(n2 - 0.5) + abs(chop) * 30.0;
    float foam = smoothstep(0.62, 0.95, crest) * waterMask;
    tex.rgb = mix(tex.rgb, vec3(1.0), foam * 0.4);

    /* full brightness + shadow lift so dark areas (rocks) stay visible */
    tex.rgb = pow(tex.rgb, vec3(0.8)) * 1.05;

    gl_FragColor = tex;
  }
`;

function OceanBackground() {
  const texture = useLoader(THREE.TextureLoader, pondicherryBg);
  const matRef = useRef();

  const uniforms = useMemo(() => {
    const tex = texture.clone();
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return {
      uTexture: { value: tex },
      uTime: { value: 0 },
      uScale: { value: new THREE.Vector2(1, 1) },
    };
  }, [texture]);

  /* plane sits at z = -5; camera at z = 8 → distance 13 */
  const distance = 13;
  const planeHeight = 2 * Math.tan((60 * Math.PI) / 360) * distance;
  const { viewport } = useThree();
  const planeWidth = planeHeight * viewport.aspect;

  useFrame((state) => {
    const u = matRef.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;

    /* cover-fit, recomputed so resize is handled */
    const img = texture.image;
    const imageAspect = img.width / img.height;
    const planeAspect = state.viewport.aspect;
    if (planeAspect > imageAspect) {
      u.uScale.value.set(1, imageAspect / planeAspect);
    } else {
      u.uScale.value.set(planeAspect / imageAspect, 1);
    }
  });

  return (
    <mesh position={[0, 0, -5]} scale={[planeWidth * 1.15, planeHeight * 1.15, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={BG_VERTEX}
        fragmentShader={BG_FRAGMENT}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

/* Mouse parallax wrapper */
function ParallaxGroup({ children }) {
  const group = useRef();
  useFrame((state) => {
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.12,
      0.05
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.08,
      0.05
    );
  });
  return <group ref={group}>{children}</group>;
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-[5] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <ParallaxGroup>
            <OceanBackground />
          </ParallaxGroup>
        </Suspense>
      </Canvas>
    </div>
  );
}
