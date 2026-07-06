import * as THREE from 'three';
import { mulberry32 } from './noise';
import { islandHeight, islandSlope, ISLAND_RADIUS } from './terrain';

export interface ScatterPoint {
  x: number;
  z: number;
  h: number;
  rand: number; // 0..1 個体差用
}

// 島の上に条件を満たす散布点を作る（決定論的）
export function scatterOnIsland(
  count: number,
  seed: number,
  accept: (h: number, slope: number) => boolean,
): ScatterPoint[] {
  const rng = mulberry32(seed);
  const points: ScatterPoint[] = [];
  let attempts = 0;
  while (points.length < count && attempts < count * 30) {
    attempts++;
    const a = rng() * Math.PI * 2;
    const r = Math.sqrt(rng()) * ISLAND_RADIUS;
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    const h = islandHeight(x, z);
    if (accept(h, islandSlope(x, z))) {
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
