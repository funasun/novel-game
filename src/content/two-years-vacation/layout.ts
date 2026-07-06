import { scatterOnIsland, ScatterPoint } from '../../shared-assets/procedural/vegetation';

// Layer 3: チェアマン島の舞台配置。スポーン地点・キャンプ・採集物の位置。

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

// 浜辺の流木（砂の上）
export const DRIFTWOOD_POINTS = nearPoint(
  scatterOnIsland(240, 4242, (h) => h > 0.25 && h < 1.0),
  SPAWN,
  6,
);

// 潮だまりの貝(波打ち際)
export const SHELLFISH_POINTS = nearPoint(
  scatterOnIsland(240, 7777, (h) => h > -0.25 && h < 0.3),
  SPAWN,
  6,
);

// フレンチ・デン周辺の薪（森の中）
export const FIREWOOD_POINTS = nearPoint(
  scatterOnIsland(240, 5151, (h) => h > 1.2 && h < 4.5),
  CAVE,
  6,
);
