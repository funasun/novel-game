import { scatterOnIsland, ScatterPoint } from '../../shared-assets/procedural/vegetation';
import { chairmanHeight, LAKE, BRIDGE, FORD } from './terrain';

// Layer 3: チェアマン島の舞台配置。スポーン地点・キャンプ・採集物の位置。
// 拡張地形（湖・川・橋・沿岸低地）の座標はすべて scripts/probe-terrain.ts で
// 高さ・歩行可否を検証済み — 当て推量の座標はひとつもない。

export { LAKE, BRIDGE, FORD };

export const SPAWN: [number, number] = [0, 82];
export const CAMP: [number, number] = [8, 74];

// 浜に乗り上げたスルギ号の位置（波打ち際、船首は海・船尾は砂の上）
export const SHIP: [number, number] = [-13, 83];

// 島の中央丘（見晴らしの高台）・フレンチ・デン（洞窟）・島の北端・出航ボート
export const LOOKOUT: [number, number] = [2, 6];
export const CAVE: [number, number] = [-36, 12];
export const NORTH: [number, number] = [0, -76];
export const BOAT: [number, number] = [4, 86];

// 少年たちの立ち位置（第一章：浜のキャンプ周辺＋船のそばのモコ）
export const NPC_POS: Record<string, [number, number]> = {
  briant: CAMP,
  gordon: [9.8, 72.9],
  doniphan: [4.8, 72.5],
  jacques: [9.7, 76.4],
  baxter: [3.6, 76.6],
  service: [12.6, 72.2],
  littles: [11.0, 75.0],
  moko: [-10, 80.5],
};

// 原作の地名（ゴードンの一年＝地図作りの年に命名する場所）
export const LANDMARKS: Record<string, [number, number]> = {
  bay: [-4, 81], // スルギ湾（漂着の浜）
  hill: [5, 9], // オークランドの丘（見張りの高台）
  grave: [-31, 16.5], // ボードワンの墓
  traps: [-20, 4], // 罠の森
  moors: [-55, 45], // サウス・ムーア（湿原）
  severn: [62, 10], // セヴァーン海岸（東岸・決戦後）
};

// 生活技術の場
export const SALT_ROCK: [number, number] = [14, 81]; // 天日製塩の岩場
export const SEAL_ROCK: [number, number] = [-24, 74]; // アザラシの岩
export const SUGAR_TREE: [number, number] = [-12, 34]; // 樹液の木
export const STARGAZE: [number, number] = [0, 2]; // 星空観察（丘の上）
export const RHEA: [number, number] = [-28, 19]; // サーヴィスのナンドゥ

// フレンチ・デンの暮らし（第二バッチ）
export const HALL_DIG: [number, number] = [-38, 12]; // 奥の広間の掘削
export const KITCHEN: [number, number] = [-36.5, 11]; // モコの台所
export const SCHOOL: [number, number] = [-33, 15.5]; // 日曜討論会の広場
export const WOODPILE: [number, number] = [-33.5, 9]; // 冬支度の薪の山
export const CORRAL: [number, number] = [-44, 20]; // グアナコの囲い

// 犬のファン・信号マスト・祝祭（第三バッチ）
export const DOG_BEACH: [number, number] = [8.5, 75.2]; // 浜のキャンプのファン
export const DOG_CAVE: [number, number] = [-36.8, 13.5]; // フレンチ・デンのファン
export const SIGNAL_MAST: [number, number] = [3.5, 7.5]; // オークランドの丘の信号マスト
export const FESTIVAL: [number, number] = [-34.5, 11]; // 前庭の祝いの場

// 洞窟（フレンチ・デン）時代の立ち位置。入口の前庭に集まる。
export const CAVE_POS: Record<string, [number, number]> = {
  briant: [-34, 14],
  gordon: [-38, 14.5],
  doniphan: [-33, 10],
  jacques: [-35.5, 16],
  moko: [-38, 9],
  baxter: [-32.5, 13],
  service: [-39, 12],
  littles: [-34, 8.5],
  kate: [-36.5, 15.5],
  evans: [-31, 11],
};

// === 世界拡張：新しい土地の要所 ===
export const KNOLL: [number, number] = [30, -40]; // 大凧の丘（北東の高丘）
export const EAST_CAPE: [number, number] = [118, 15]; // 東の岬
export const NORTH_CAPE: [number, number] = [8, -116]; // 北の岬
export const SOUTH_BEACH: [number, number] = [30, 112]; // 南の大砂浜
export const WEST_CAPE: [number, number] = [-114, -30]; // 西の岬
export const WRECK_EAST: [number, number] = [108, 30]; // 漂着物の入り江（宝箱）
export const TURTLE_SOUTH: [number, number] = [20, 108]; // ウミガメの浜（宝）
export const CAIRN_WEST: [number, number] = [-104, -12]; // 測量の石塚（宝）

// === 建設予定地 ===
export const TOWER_SITE: [number, number] = [33, -37]; // 物見やぐら（大凧の丘の頂）
export const SMOKE_SITE: [number, number] = [-30, 6]; // 燻製小屋（フレンチ・デンの上手）
export const PIER_SITE: [number, number] = [3, 84.5]; // 桟橋（スルギ湾の波打ち際）

// === 再取得できる資源ポイント（cooldownHours で復活） ===
export const BERRY_SPOTS: [number, number][] = [
  [-16, 48],
  [22, 42],
  [-6, -30],
];
export const STONE_SPOTS: [number, number][] = [
  [24, -34],
  [38, -46],
  [45, -20],
];
export const REED_SPOTS: [number, number][] = [
  [-36.5, 44.5],
  [-46, 60],
];
export const CLAY_SPOTS: [number, number][] = [
  [-41, 91],
  [-38, 70],
];
export const EGG_SPOTS: [number, number][] = [
  [34, -44],
  [12, -100],
];
export const HERB_SPOTS: [number, number][] = [
  [-52, 52],
  [-60, 38],
];
// 釣り場：湖の東岸・湖の北岸・川の中流の岸
export const FISH_SPOTS: [number, number][] = [
  [-45, -8],
  [-52, -19],
  [-37, 45],
];
// 倒木（薪の再取得ポイント）：島の森に散らばる
export const WOOD_GROVES: [number, number][] = [
  [12, 30],
  [-8, 52],
  [-14, -52],
];
export const BATHE_ROCK: [number, number] = [-52, -20]; // 湖の水浴び岩

// 植生散布の立ち入り禁止円（舞台装置・導線・建設地と重ならないように）
export const KEEP_OUT: [number, number, number][] = [
  [CAMP[0], CAMP[1], 7],
  [SHIP[0], SHIP[1], 8],
  [SPAWN[0], SPAWN[1], 5],
  [BOAT[0], BOAT[1], 5],
  [-35.5, 12.5, 9], // フレンチ・デン前庭
  [CORRAL[0], CORRAL[1], 6],
  [NORTH[0], NORTH[1], 6],
  [LANDMARKS.severn[0], LANDMARKS.severn[1], 5],
  [BRIDGE[0], BRIDGE[1], 8.5],
  [FORD[0], FORD[1], 7],
  [TOWER_SITE[0], TOWER_SITE[1], 5],
  [SMOKE_SITE[0], SMOKE_SITE[1], 5],
  [PIER_SITE[0], PIER_SITE[1], 6],
  [WRECK_EAST[0], WRECK_EAST[1], 4],
  [TURTLE_SOUTH[0], TURTLE_SOUTH[1], 4],
  [CAIRN_WEST[0], CAIRN_WEST[1], 4],
  [BATHE_ROCK[0], BATHE_ROCK[1], 4],
  ...BERRY_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3]),
  ...STONE_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3.5]),
  ...REED_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3]),
  ...CLAY_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3]),
  ...EGG_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3]),
  ...HERB_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3]),
  ...FISH_SPOTS.map(([x, z]): [number, number, number] => [x, z, 3]),
  ...WOOD_GROVES.map(([x, z]): [number, number, number] => [x, z, 3]),
];

export function clearOfKeepOut(x: number, z: number): boolean {
  for (const [kx, kz, kr] of KEEP_OUT) {
    if (Math.hypot(x - kx, z - kz) < kr) return false;
  }
  return true;
}

function nearPoint(
  points: ScatterPoint[],
  center: [number, number],
  count: number,
): ScatterPoint[] {
  return [...points]
    .sort(
      (a, b) =>
        Math.hypot(a.x - center[0], a.z - center[1]) -
        Math.hypot(b.x - center[0], b.z - center[1]),
    )
    .slice(0, count);
}

// 浜辺の流木（砂の上）。拡張地形の高さ関数で散布する
export const DRIFTWOOD_POINTS = nearPoint(
  scatterOnIsland(240, 4242, (h) => h > 0.25 && h < 1.0, chairmanHeight),
  SPAWN,
  6,
);

// 潮だまりの貝(波打ち際)
export const SHELLFISH_POINTS = nearPoint(
  scatterOnIsland(240, 7777, (h) => h > -0.25 && h < 0.3, chairmanHeight),
  SPAWN,
  6,
);

// フレンチ・デン周辺の薪（森の中）。川の東岸（デン側）に限る — 序盤に橋の大回りをさせない
export const FIREWOOD_POINTS = nearPoint(
  scatterOnIsland(300, 5151, (h) => h > 1.2 && h < 9.5, chairmanHeight).filter(
    (p) => p.x > -46,
  ),
  CAVE,
  6,
);
