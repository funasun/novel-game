import * as THREE from 'three';
import { fbm, smoothstep, valueNoise } from './noise';

export const ISLAND_SIZE = 280; // 地形メッシュの一辺
export const ISLAND_RADIUS = 105; // 陸地のおおよその半径
export const SEA_LEVEL = 0;

// 島の標高関数。地形メッシュ・プレイヤー接地・植生散布のすべてがこれを共有する。
export function islandHeight(x: number, z: number): number {
  const d = Math.sqrt(x * x + z * z) / ISLAND_RADIUS;
  const falloff = 1 - smoothstep(0.38, 1.0, d);
  const base = fbm(x * 0.014 + 7.3, z * 0.014 + 2.1, 4);
  const detail = fbm(x * 0.06 + 3.7, z * 0.06 + 9.2, 3);
  const hill = Math.max(0, 1 - d * 1.6); // 中央の見晴らし丘
  return (base * 15 + detail * 2.5 + hill * 6) * falloff - 2.4;
}

export function islandSlope(x: number, z: number): number {
  const e = 0.8;
  const hx = islandHeight(x + e, z) - islandHeight(x - e, z);
  const hz = islandHeight(x, z + e) - islandHeight(x, z - e);
  return Math.sqrt(hx * hx + hz * hz) / (2 * e);
}

const SAND = new THREE.Color('#e6d29a');
const GRASS_A = new THREE.Color('#5da24c');
const GRASS_B = new THREE.Color('#7cb85a');
const ROCK = new THREE.Color('#8d8578');
const SEABED = new THREE.Color('#c9b98d');

// フラットシェーディングの低ポリ島ジオメトリを生成（面ごとに頂点色を塗る）。
// 高さ関数とメッシュ一辺は差し替え可能 — 作品側が拡張した地形（湖・川など）でも同じ見た目文法で描ける。
export function buildIslandGeometry(
  segments = 150,
  heightFn: (x: number, z: number) => number = islandHeight,
  size: number = ISLAND_SIZE,
): THREE.BufferGeometry {
  const plane = new THREE.PlaneGeometry(size, size, segments, segments);
  plane.rotateX(-Math.PI / 2);
  const pos = plane.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setY(i, heightFn(pos.getX(i), pos.getZ(i)));
  }
  const geo = plane.toNonIndexed();
  plane.dispose();
  geo.computeVertexNormals();

  const p = geo.attributes.position;
  const n = geo.attributes.normal;
  const colors = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const cx = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3;
    const cy = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    const cz = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    const ny = (n.getY(i) + n.getY(i + 1) + n.getY(i + 2)) / 3;

    if (cy < -0.6) {
      c.copy(SEABED);
    } else if (cy < 1.1) {
      c.copy(SAND);
    } else if (ny < 0.62) {
      c.copy(ROCK);
    } else {
      const t = valueNoise(cx * 0.11 + 31, cz * 0.11 + 17);
      c.copy(GRASS_A).lerp(GRASS_B, t);
    }
    // わずかな明度ゆらぎで低ポリのタイル感を出す
    const shade = 0.94 + valueNoise(cx * 0.5, cz * 0.5) * 0.12;
    for (let j = 0; j < 3; j++) {
      colors[(i + j) * 3] = c.r * shade;
      colors[(i + j) * 3 + 1] = c.g * shade;
      colors[(i + j) * 3 + 2] = c.b * shade;
    }
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  return geo;
}
