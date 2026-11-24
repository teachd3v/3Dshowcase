import { describe, expect, it } from 'vitest';
import {
  HEADLINE_Z_INDEX,
  IDENTITY_QUATERNION,
  computeDepthVisuals,
  createFibonacciSpherePoints,
  multiplyQuat,
  normalizeQuat,
  pitchQuat,
  projectPoint,
  quatToMat3,
  yawQuat,
} from './sphereMath';

describe('sphereMath', () => {
  it('generates deterministic near-unit Fibonacci sphere points', () => {
    const a = createFibonacciSpherePoints(28);
    const b = createFibonacciSpherePoints(28);
    expect(a).toHaveLength(28);
    expect(a).toEqual(b);

    for (const pt of a) {
      const len = Math.hypot(pt.x, pt.y, pt.z);
      expect(len).toBeGreaterThan(0.9);
      expect(len).toBeLessThan(1.1);
    }
  });

  it('handles edge counts cleanly', () => {
    expect(createFibonacciSpherePoints(0)).toEqual([]);
    expect(createFibonacciSpherePoints(1)).toEqual([{ x: 0, y: 0, z: 1 }]);
  });

  it('preserves rotation norm under repeated quaternion composition', () => {
    let q = IDENTITY_QUATERNION;
    for (let i = 0; i < 30; i += 1) {
      q = normalizeQuat(multiplyQuat(pitchQuat(-0.11), multiplyQuat(yawQuat(0.23), q)));
    }
    const norm = Math.hypot(q[0], q[1], q[2], q[3]);
    expect(norm).toBeCloseTo(1, 5);
  });

  it('projects front cards larger and splits zIndex cleanly around headline', () => {
    const m = quatToMat3(IDENTITY_QUATERNION);
    const radii = { rx: 460, ry: 240, rz: 380 };
    const focal = radii.rz * 2.6;

    const front = projectPoint({ x: 0, y: 0, z: 1 }, m, radii, focal);
    const back = projectPoint({ x: 0, y: 0, z: -1 }, m, radii, focal);

    expect(front.scale).toBeGreaterThan(1.4);
    expect(back.scale).toBeLessThan(0.8);
    expect(front.depth).toBeCloseTo(1, 5);
    expect(back.depth).toBeCloseTo(0, 5);

    const frontVisual = computeDepthVisuals(front.depth);
    const backVisual = computeDepthVisuals(back.depth);

    expect(frontVisual.zIndex).toBeGreaterThan(HEADLINE_Z_INDEX);
    expect(frontVisual.blurPx).toBe(0);
    expect(frontVisual.opacity).toBe(1);

    expect(backVisual.zIndex).toBeLessThan(HEADLINE_Z_INDEX);
    expect(backVisual.blurPx).toBe(6);
    expect(backVisual.opacity).toBeCloseTo(0.5, 3);
  });
});
