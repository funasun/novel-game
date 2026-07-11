import * as THREE from 'three';
import { mulberry32 } from './noise';
import { islandHeight, islandSlope, ISLAND_RADIUS } from './terrain';

export interface ScatterPoint {
  x: number;
  z: number;
  h: number;
  rand: number; // 0..1 個体差用
}

// 島の上に条件を満たす散布点を作る（決定論的）。
// 高さ関数と散布半径は差し替え可能 — 作品側の拡張地形にもそのまま使える。
export function scatterOnIsland(
  count: number,
  seed: number,
  accept: (h: number, slope: number) => boolean,
  heightFn: (x: number, z: number) => number = islandHeight,
  radius: number = ISLAND_RADIUS,
): ScatterPoint[] {
  const rng = mulberry32(seed);
  const points: ScatterPoint[] = [];
  const slopeOf = (x: number, z: number): number => {
    if (heightFn === islandHeight) return islandSlope(x, z);
    const e = 0.8;
    const hx = heightFn(x + e, z) - heightFn(x - e, z);
    const hz = heightFn(x, z + e) - heightFn(x, z - e);
    return Math.sqrt(hx * hx + hz * hz) / (2 * e);
  };
  let attempts = 0;
  while (points.length < count && attempts < count * 30) {
    attempts++;
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * radius;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = heightFn(x, z);
    if (accept(h, slopeOf(x, z))) {
      points.push({ x, z, h, rand: rng() });
    }
  }
  return points;
}

export function applyInstances(
  mesh: THREE.InstancedMesh,
  points: ScatterPoint[],
  place: (p: ScatterPoint, dummy: THREE.Object3D, i: number) => void,
): void {
  const dummy = new THREE.Object3D();
  points.forEach((p, i) => {
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1, 1, 1);
    place(p, dummy, i);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
}
