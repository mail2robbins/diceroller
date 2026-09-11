export type Euler = { x: number; y: number; z: number };

/** Cube layout: front 1, back 6, right 3, left 4, top 2, bottom 5 */
export const FACE_EULER: Record<number, Euler> = {
  1: { x: 0, y: 0, z: 0 },
  6: { x: 0, y: 180, z: 0 },
  3: { x: 0, y: -90, z: 0 },
  4: { x: 0, y: 90, z: 0 },
  2: { x: -90, y: 0, z: 0 },
  5: { x: 90, y: 0, z: 0 },
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/** Deterministic wobble from seed (0–1-ish). */
function hash(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export type RollFrame = {
  euler: Euler;
  translateY: number;
  shadowScale: number;
  shadowOpacity: number;
};

export function computeRollFrame(
  t: number,
  targetFace: number,
  seed: number,
): RollFrame {
  const target = FACE_EULER[targetFace] ?? FACE_EULER[1];
  const clamped = Math.min(1, Math.max(0, t));

  if (clamped >= 1) {
    return {
      euler: target,
      translateY: 0,
      shadowScale: 1,
      shadowOpacity: 0.45,
    };
  }

  const hopCount = 2.5 + hash(seed) * 1.5;
  const hop = Math.abs(Math.sin(clamped * Math.PI * hopCount));
  const damp = Math.pow(1 - clamped, 1.6);
  const translateY = -hop * damp * (18 + hash(seed + 1) * 14);

  const shadowScale = 1 + hop * damp * 0.35;
  const shadowOpacity = 0.25 + (1 - hop * damp) * 0.25;

  const settleStart = 0.68 + hash(seed + 2) * 0.08;

  if (clamped >= settleStart) {
    const u = (clamped - settleStart) / (1 - settleStart);
    const ease = easeOutQuart(u);
    const spinX = (3 + hash(seed + 3) * 2) * 360;
    const spinY = (4 + hash(seed + 4) * 2) * 360;
    const spinZ = (1.5 + hash(seed + 5)) * 360;
    const from: Euler = {
      x: target.x + spinX * (1 - settleStart),
      y: target.y + spinY * (1 - settleStart),
      z: target.z + spinZ * (1 - settleStart),
    };
    const wild = wildEuler(clamped, seed);
    const blendFrom = {
      x: lerp(wild.x, from.x, 0.35),
      y: lerp(wild.y, from.y, 0.35),
      z: lerp(wild.z, from.z, 0.35),
    };
    return {
      euler: {
        x: lerp(blendFrom.x, target.x, ease),
        y: lerp(blendFrom.y, target.y, ease),
        z: lerp(blendFrom.z, target.z, ease),
      },
      translateY: lerp(translateY, 0, easeOutCubic(u)),
      shadowScale: lerp(shadowScale, 1, ease),
      shadowOpacity: lerp(shadowOpacity, 0.45, ease),
    };
  }

  return {
    euler: wildEuler(clamped, seed),
    translateY,
    shadowScale,
    shadowOpacity,
  };
}

function wildEuler(t: number, seed: number): Euler {
  const h1 = hash(seed);
  const h2 = hash(seed + 11);
  const h3 = hash(seed + 22);
  const turnsX = 2.5 + h1 * 3;
  const turnsY = 3 + h2 * 3.5;
  const turnsZ = 1 + h3 * 2;
  const wobble = (1 - t) * 0.85 + 0.15;
  return {
    x:
      t * turnsX * 360 * wobble +
      Math.sin(t * Math.PI * (6 + h1 * 4)) * 55 * wobble,
    y:
      t * turnsY * 360 * wobble +
      Math.cos(t * Math.PI * (5 + h2 * 3)) * 48 * wobble,
    z:
      t * turnsZ * 360 * wobble +
      Math.sin(t * Math.PI * (4 + h3 * 2)) * 32 * wobble,
  };
}

export function eulerToTransform(e: Euler, translateY = 0): string {
  return `translate3d(0, ${translateY.toFixed(2)}px, 0) rotateX(${e.x.toFixed(2)}deg) rotateY(${e.y.toFixed(2)}deg) rotateZ(${e.z.toFixed(2)}deg)`;
}

export function faceTransforms(depthPx: number): Record<
  string,
  string
> {
  const d = depthPx.toFixed(2);
  return {
    front: `rotateY(0deg) translateZ(${d}px)`,
    back: `rotateY(180deg) translateZ(${d}px)`,
    right: `rotateY(90deg) translateZ(${d}px)`,
    left: `rotateY(-90deg) translateZ(${d}px)`,
    top: `rotateX(90deg) translateZ(${d}px)`,
    bottom: `rotateX(-90deg) translateZ(${d}px)`,
  };
}
