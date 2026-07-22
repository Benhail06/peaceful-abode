import { useRef } from "react";

/* 3D mouse-tracking tilt wrapper */
export default function TiltCard({ children, className = "", max = 8 }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateX(${-py * max}deg) rotateY(${
      px * max
    }deg) scale3d(1.02, 1.02, 1.02)`;
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
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.18s ease-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
