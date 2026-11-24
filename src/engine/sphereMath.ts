export interface Vec3 {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export type Quaternion = readonly [x: number, y: number, z: number, w: number];

export type Mat3 = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export interface EllipsoidRadii {
  readonly rx: number;
  readonly ry: number;
  readonly rz: number;
}

export interface ProjectedPoint {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
  /** 0 = furthest back, 1 = closest to viewer */
  readonly depth: number;
}

export interface OrbitVisualState {
  readonly zIndex: number;
  readonly opacity: number;
  readonly blurPx: number;
}

export const HEADLINE_Z_INDEX = 0;
export const BLUR_STEP_PX = 2;
export const BLUR_LEVELS = 3;
export const SHARP_FROM_DEPTH = 0.55;

export const IDENTITY_QUATERNION: Quaternion = [0, 0, 0, 1];

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Evenly distributes `count` points on a unit sphere (Fibonacci lattice) with
 * deterministic jitter so the collage feels organic rather than gridded.
 */
export function createFibonacciSpherePoints(
  count: number,
  options: { yLimit?: number; jitter?: number; seed?: number } = {},
): Vec3[] {
  if (count <= 0) return [];
  if (count === 1) return [{ x: 0, y: 0, z: 1 }];

  const { yLimit = 0.96, jitter = 0.08, seed = 7 } = options;
  const rand = mulberry32(seed);
  const points: Vec3[] = [];

  for (let i = 0; i < count; i += 1) {
    const y = (1 - (i / Math.max(count - 1, 1)) * 2) * yLimit;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = GOLDEN_ANGLE * i + (rand() - 0.5) * jitter * Math.PI;
    points.push({
      x: Math.cos(theta) * r,
      y: y + (rand() - 0.5) * jitter,
      z: Math.sin(theta) * r,
    });
  }
  return points;
}

export function axisAngle(
  ax: number,
  ay: number,
  az: number,
  angle: number,
): Quaternion {
  const s = Math.sin(angle / 2);
  return [ax * s, ay * s, az * s, Math.cos(angle / 2)];
}

export function multiplyQuat(a: Quaternion, b: Quaternion): Quaternion {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

export function normalizeQuat(q: Quaternion): Quaternion {
  const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

export function quatToMat3([x, y, z, w]: Quaternion): Mat3 {
  const xx = x * x;
  const yy = y * y;
  const zz = z * z;
  const xy = x * y;
  const xz = x * z;
  const yz = y * z;
  const wx = w * x;
  const wy = w * y;
  const wz = w * z;
  return [
    1 - 2 * (yy + zz),
    2 * (xy - wz),
    2 * (xz + wy),
    2 * (xy + wz),
    1 - 2 * (xx + zz),
    2 * (yz - wx),
    2 * (xz - wy),
    2 * (yz + wx),
    1 - 2 * (xx + yy),
  ];
}

export const yawQuat = (angle: number): Quaternion => axisAngle(0, 1, 0, angle);

export const pitchQuat = (angle: number): Quaternion =>
  axisAngle(1, 0, 0, -angle);

/**
 * Projects a unit-sphere point rotated by `m` onto an ellipsoid and applies
 * perspective foreshortening (`~0.72` at back -> `~1.62` at front).
 */
export function projectPoint(
  p: Vec3,
  m: Mat3,
  radii: EllipsoidRadii,
  focal: number,
): ProjectedPoint {
  const x = m[0] * p.x + m[1] * p.y + m[2] * p.z;
  const y = m[3] * p.x + m[4] * p.y + m[5] * p.z;
  const zUnit = m[6] * p.x + m[7] * p.y + m[8] * p.z;

  const scale = focal / Math.max(80, focal - zUnit * radii.rz);

  return {
    x: x * radii.rx * scale,
    y: y * radii.ry * scale,
    scale,
    depth: (zUnit + 1) / 2,
  };
}

/**
 * Maps normalized depth (`0..1`) to zIndex around `HEADLINE_Z_INDEX` (0),
 * opacity (`0.5..1.0`), and 3-level discrete depth-of-field blur (`0, 2, 4, 6px`).
 */
export function computeDepthVisuals(depth: number): OrbitVisualState {
  const clamped = Math.min(1, Math.max(0, depth));
  const zIndex = Math.round((clamped - 0.5) * 200);
  const opacity = 0.5 + clamped * 0.5;
  const blurPx =
    clamped >= SHARP_FROM_DEPTH
      ? 0
      : Math.ceil(((SHARP_FROM_DEPTH - clamped) / SHARP_FROM_DEPTH) * BLUR_LEVELS) *
        BLUR_STEP_PX;

  return { zIndex, opacity, blurPx };
}
