import { islandHeight, ISLAND_RADIUS } from '../../shared-assets/procedural/terrain';
import { fbm, smoothstep } from '../../shared-assets/procedural/noise';

// Layer 3: チェアマン島の拡張地形。共有ライブラリの基本島に、
//   ・沿岸低地リング（島の外周に新しい土地 — 内陸の高さは1mmも変えない）
//   ・静かな湖（西の窪み）
//   ・湖から南海岸へ流れる川（丸木橋と河口の浅瀬で渡れる）
//   ・北東の高丘（眺望）
// を重ねる。既存のキャンプ・洞窟・丘などの座標の高さは維持される
// （リングは r>86 でのみ効き、湖・川は既存導線から離してある）。

export const WORLD_RADIUS = 137; // 歩ける限界（拡張後）
export const WORLD_SIZE = 380; // 地形メッシュの一辺

export const LAKE: [number, number] = [-54, -8]; // 静かな湖の中心
export const BRIDGE: [number, number] = [-48, 33.5]; // 丸木橋（洞窟→湿原の道すがら）
export const FORD: [number, number] = [-46.7, 95]; // 河口の浅瀬（南の砂州— 歩いて渡れる）

// 川の流路：湖から南海岸へ（グアナコの囲い(-44,20)を避けて西寄りに流れる）
const RIVER: [number, number][] = [
  [-54, -8],
  [-52, 8],
  [-49, 32],
  [-38, 48],
  [-44, 80],
  [-48, 102],
];

function riverDistSq(x: number, z: number): number {
  let best = Infinity;
  for (let i = 0; i < RIVER.length - 1; i++) {
    const [ax, az] = RIVER[i];
    const [bx, bz] = RIVER[i + 1];
    const abx = bx - ax;
    const abz = bz - az;
    const t = Math.max(0, Math.min(1, ((x - ax) * abx + (z - az) * abz) / (abx * abx + abz * abz)));
    const dx = x - (ax + abx * t);
    const dz = z - (az + abz * t);
    const d = dx * dx + dz * dz;
    if (d < best) best = d;
  }
  return best;
}

export function chairmanHeight(x: number, z: number): number {
  let h = islandHeight(x, z);
  const d = Math.hypot(x, z) / ISLAND_RADIUS;

  // 沿岸低地リング：旧海岸線(r≈95)の外へゆるやかな低地が続き、r≈135で海に落ちる
  const ring = smoothstep(0.82, 1.0, d) * (1 - smoothstep(1.15, 1.32, d));
  if (ring > 0) {
    const rn = fbm(x * 0.02 + 11.7, z * 0.02 + 5.3, 3);
    h += ring * (1.2 + rn * 5.5);
  }

  // 北東の高丘（島を見晴らす新しい眺望）
  const kx = x - 30;
  const kz = z + 40;
  h += Math.exp(-(kx * kx + kz * kz) / (2 * 14 * 14)) * 4.5;

  // 静かな湖（平底のボウル。海面下まで掘れば全体水面プレーンが水を張る。
  // 影響半径16で打ち切り — フレンチ・デン(距離27)には一切届かない）
  const ld = Math.hypot(x - LAKE[0], z - LAKE[1]);
  if (ld < 16) h -= (1 - smoothstep(9, 16, ld)) * 8;

  // 川：湖から南海岸へ。中心は海面下（渡れない）
  const rdSq = riverDistSq(x, z);
  if (rdSq < 49) {
    const t = 1 - Math.sqrt(rdSq) / 7;
    const s = t * t * (3 - 2 * t);
    h += (Math.min(h, -1.9) - h) * s;
  }

  // 河口の浅瀬（砂州）：南の海辺の周回路が川で切れないよう、くるぶし水深で渡れる
  const fx = x - FORD[0];
  const fz = z - FORD[1];
  const ford = Math.exp(-(fx * fx + fz * fz) / (2 * 5 * 5));
  if (ford > 0.05) h = Math.max(h, -0.62 + ford * 0.5);

  return h;
}

// ---- 丸木橋：川を歩いて渡れる唯一の内陸ポイント ----
// 橋は川と直交して架かる。デッキ高さは両岸の地形に接続する。
const RIVER_DIR: [number, number] = [11 / 19.42, 16 / 19.42]; // 橋の位置の川の流向
const PERP: [number, number] = [RIVER_DIR[1], -RIVER_DIR[0]]; // 橋の長手方向
export const BRIDGE_HALF_LEN = 5.8;
const BRIDGE_HALF_WID = 1.7;

let deckEnds: [number, number] | null = null;
function getDeckEnds(): [number, number] {
  if (!deckEnds) {
    deckEnds = [
      chairmanHeight(BRIDGE[0] - PERP[0] * BRIDGE_HALF_LEN, BRIDGE[1] - PERP[1] * BRIDGE_HALF_LEN),
      chairmanHeight(BRIDGE[0] + PERP[0] * BRIDGE_HALF_LEN, BRIDGE[1] + PERP[1] * BRIDGE_HALF_LEN),
    ];
  }
  return deckEnds;
}

// 橋の上ならデッキ高さ、外なら null
export function bridgeDeck(x: number, z: number): number | null {
  const dx = x - BRIDGE[0];
  const dz = z - BRIDGE[1];
  const u = dx * PERP[0] + dz * PERP[1]; // 長手
  const v = dx * RIVER_DIR[0] + dz * RIVER_DIR[1]; // 幅
  if (Math.abs(u) > BRIDGE_HALF_LEN || Math.abs(v) > BRIDGE_HALF_WID) return null;
  const [hA, hB] = getDeckEnds();
  const t = (u + BRIDGE_HALF_LEN) / (BRIDGE_HALF_LEN * 2);
  const arch = Math.cos((u / BRIDGE_HALF_LEN) * Math.PI * 0.5) * 0.45;
  return hA + (hB - hA) * t + arch + 0.12;
}

// 橋の描画用（長手方向の単位ベクトルとデッキ高さ関数を舞台側へ）
export const BRIDGE_AXIS = PERP;
export function bridgeDeckAt(u: number): number {
  const [hA, hB] = getDeckEnds();
  const t = (u + BRIDGE_HALF_LEN) / (BRIDGE_HALF_LEN * 2);
  return hA + (hB - hA) * t + Math.cos((u / BRIDGE_HALF_LEN) * Math.PI * 0.5) * 0.45 + 0.12;
}

// 接地用の高さ（橋の上を歩ける）
export function chairmanGroundHeight(x: number, z: number): number {
  const deck = bridgeDeck(x, z);
  const h = chairmanHeight(x, z);
  return deck !== null ? Math.max(h, deck) : h;
}

export function chairmanWalkable(x: number, z: number): boolean {
  if (bridgeDeck(x, z) !== null) return true;
  return chairmanHeight(x, z) > -0.45 && Math.hypot(x, z) < WORLD_RADIUS;
}
