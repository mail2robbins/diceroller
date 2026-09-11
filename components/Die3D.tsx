"use client";

import { DiePips } from "@/components/DiePips";
import {
  computeRollFrame,
  eulerToTransform,
  FACE_EULER,
  faceTransforms,
} from "@/lib/dieRotation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Die3DProps = {
  targetValue: number;
  rollToken: number;
  index?: number;
  size?: "md" | "lg";
  onSettled?: () => void;
};

export function Die3D({
  targetValue,
  rollToken,
  index = 0,
  size = "lg",
  onSettled,
}: Die3DProps) {
  const face = Math.min(6, Math.max(1, targetValue));
  const [phase, setPhase] = useState<"idle" | "rolling" | "settled">("idle");
  const [depth, setDepth] = useState(40);
  const cubeRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const onSettledRef = useRef(onSettled);
  onSettledRef.current = onSettled;

  const sizeClass =
    size === "lg"
      ? "h-[clamp(5rem,25vw,10rem)] w-[clamp(5rem,25vw,10rem)]"
      : "h-16 w-16";

  useLayoutEffect(() => {
    const cube = cubeRef.current;
    if (!cube) return;

    const measure = () => {
      const w = cube.clientWidth;
      if (w > 0) setDepth(w / 2);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(cube);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (rollToken === 0) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const target = FACE_EULER[face];
      if (cubeRef.current) {
        cubeRef.current.style.transform = eulerToTransform(target, 0);
      }
      setPhase("settled");
      onSettledRef.current?.();
      return;
    }

    setPhase("rolling");
    const duration = 1250 + index * 140;
    const seed = rollToken * 3.17 + index * 1.91 + face * 0.33;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const frame = computeRollFrame(t, face, seed);

      if (cubeRef.current) {
        cubeRef.current.style.transform = eulerToTransform(
          frame.euler,
          frame.translateY,
        );
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = `scale(${frame.shadowScale.toFixed(3)})`;
        shadowRef.current.style.opacity = frame.shadowOpacity.toFixed(3);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const target = FACE_EULER[face];
      if (cubeRef.current) {
        cubeRef.current.style.transform = eulerToTransform(target, 0);
      }
      if (shadowRef.current) {
        shadowRef.current.style.transform = "scale(1)";
        shadowRef.current.style.opacity = "0.45";
      }
      setPhase("settled");
      onSettledRef.current?.();
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [rollToken, face, index]);

  const transforms = depth > 0 ? faceTransforms(depth) : null;
  const settledTransform = eulerToTransform(FACE_EULER[face], 0);

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={sceneRef} className={`die-scene ${sizeClass}`}>
        <div
          ref={cubeRef}
          className={`die-cube relative h-full w-full will-change-transform ${
            phase === "settled" ? "die-cube-settled" : ""
          }`}
          style={
            phase === "idle" && depth > 0
              ? { transform: settledTransform }
              : undefined
          }
          role="img"
          aria-label={
            phase === "rolling" ? "Die rolling" : `Die showing ${face}`
          }
        >
          {transforms ? (
            <>
              <CubeFace
                style={{ transform: transforms.front }}
                className="bg-[var(--color-surface)]"
              >
                <DiePips value={1} />
              </CubeFace>
              <CubeFace
                style={{ transform: transforms.back }}
                className="bg-[var(--color-primary-light)]"
              >
                <DiePips value={6} />
              </CubeFace>
              <CubeFace
                style={{ transform: transforms.right }}
                className="bg-[var(--color-surface)]"
              >
                <DiePips value={3} />
              </CubeFace>
              <CubeFace
                style={{ transform: transforms.left }}
                className="bg-[var(--color-primary-light)]"
              >
                <DiePips value={4} />
              </CubeFace>
              <CubeFace
                style={{ transform: transforms.top }}
                className="bg-[var(--color-surface)]"
              >
                <DiePips value={2} />
              </CubeFace>
              <CubeFace
                style={{ transform: transforms.bottom }}
                className="bg-[var(--color-primary-light)]"
              >
                <DiePips value={5} />
              </CubeFace>
            </>
          ) : null}
        </div>
      </div>
      <div
        ref={shadowRef}
        className="die-floor-shadow h-2 w-[70%] rounded-[50%] bg-black/50 blur-[3px]"
        aria-hidden
      />
    </div>
  );
}

function CubeFace({
  className,
  style,
  children,
}: {
  className?: string;
  style: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center rounded-[14%] border border-[var(--color-border-light)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-3px_8px_rgba(0,0,0,0.2)] backface-hidden ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}
