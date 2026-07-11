// Layer 3: エルシノア城（クロンボー城）と城下の座標系。
// 城の中庭を正方形の石畳とし、四方を城壁・四隅を塔で囲う。南門の先に
// 城下町・市場・酒場「錨亭」・港の桟橋・オフィーリアの庭が広がる（大改修）。
// 舞台装置とNPCの立ち位置はここに集約し、Scene と pack が同じ地図を共有する。

// 中庭の広さ。歩ける範囲は ±COURT_HALF の正方形（内壁の内側）。
export const COURT_HALF = 33;
export const WALL = 34; // 城壁の中心線（歩行範囲の外）
export const WALL_H = 7.5; // 城壁の高さ
export const GATE_HALF = 4.5; // 南の門の開口（±GATE_HALF）
export const TOWER = 3.2; // 四隅の塔の半径

// 主要な場所（XZ）。物語はこの地図の上を移動して進む。
export const SPAWN: [number, number] = [0, 27]; // 南の門を入ってすぐ
export const BATTLEMENTS: [number, number] = [0, -29]; // 北の胸壁——亡霊が現れる
export const THRONE: [number, number] = [0, -19]; // 玉座の壇（クローディアスとガートルード）
export const STAGE: [number, number] = [24, -5]; // 旅役者の舞台（東）
export const GALLERY: [number, number] = [-25, 6]; // 西の回廊——独白の場
export const CHAPEL: [number, number] = [-24, -20]; // 礼拝堂の祭壇（北西）——王の祈り
export const CLOSET: [number, number] = [23, -22]; // 王妃の私室（北東）——アラス（壁掛け）
export const GRAVEYARD: [number, number] = [-21, 22]; // 墓地（南西）——ヨリックの髑髏
export const DUEL: [number, number] = [0, 5]; // 中庭中央——決闘の場

// NPC の立ち位置（城内）。
export const POS = {
  horatio: [5, 15] as [number, number],
  claudius: [-2.2, -20.2] as [number, number],
  gertrude: [2.2, -20.2] as [number, number],
  polonius: [7, -13] as [number, number],
  ophelia: [-9, 3] as [number, number],
  laertes: [4, 9] as [number, number],
  leadPlayer: [23.5, -2] as [number, number], // 旅役者座長
  gravedigger: [-20, 19.5] as [number, number],
};

// === 城下の拡張（大改修） ===
// 歩ける矩形 [x1, z1, x2, z2]。城の中庭∪門の通路∪これらの和が歩行域。
export const TOWN_RECT = [-24, 37, 24, 92] as const; // 城下町
export const GARDEN_RECT = [-56, 42, -24, 76] as const; // オフィーリアの庭（西）
export const HARBOR_RECT = [24, 60, 56, 96] as const; // 港（南東）
export const PIER_RECT = [36.5, 96, 41.5, 106] as const; // 桟橋（海の上）

export const SQUARE: [number, number] = [0, 62]; // 町の広場（中心に井戸）
export const TAVERN: [number, number] = [-14, 66]; // 酒場「錨亭」
export const TAVERN_DOOR: [number, number] = [-9.7, 65.2]; // 女将の立ち位置（東の戸口の外）
export const MARKET: [number, number] = [13.5, 69]; // 市場の露店
export const PIER_ROOT: [number, number] = [39, 96]; // 桟橋の付け根
export const PIER_END: [number, number] = [39, 104.5]; // 桟橋の先端
export const WILLOW: [number, number] = [-44, 58]; // 小川の柳（オフィーリアの木）
export const GARDEN_CENTER: [number, number] = [-36, 59];
export const BROOK_X = [-52.5, -48.5] as const; // 小川の帯（x範囲）
export const BROOK_BRIDGE_Z = [57.5, 60.5] as const; // 板橋（この z 帯だけ渡れる）

// 家並み。[中心x, 中心z, 半幅x, 半幅z, 軒の高さ] — 描画も当たり判定もこの一枚から。
export const HOUSES: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [-12, 44, 2.6, 2.2, 2.6],
  [-19, 53, 2.4, 2.4, 3.0],
  [-14, 66, 3.8, 2.9, 3.2], // 酒場「錨亭」
  [-13, 80, 2.6, 2.3, 2.8],
  [13, 42, 2.5, 2.2, 2.7],
  [18, 56, 2.4, 2.4, 3.1],
  [13, 84, 2.9, 2.4, 2.9],
];
export const TAVERN_INDEX = 2; // HOUSES の中で錨亭はどれか
export const STALLS: ReadonlyArray<readonly [number, number]> = [
  [12, 66.5],
  [15, 72],
];

// 町NPCの立ち位置
export const TOWN_POS = {
  bernardo: [4.3, 38.2] as [number, number], // 城門の衛兵
  merchant: [12, 64.4] as [number, number], // 市場の商人
  hostess: TAVERN_DOOR, // 錨亭の女将
  fisher: [39, 93.5] as [number, number], // 年老いた漁師
  madOphelia: [-40, 61] as [number, number], // 狂乱のオフィーリア（庭）
};

// 歩行を遮る中庭内の構造物（軸並行の箱）。[中心x, 中心z, 半幅x, 半幅z]
export const BLOCKERS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, -20.6, 6, 3], // 玉座の壇
  [24, -5.5, 4, 3.2], // 旅役者の舞台
  [-24, -20.5, 3.4, 3], // 礼拝堂の祭壇
  [-21.5, 23.5, 5, 3.5], // 墓地の盛土・墓石群
  [10, 26.5, 0.8, 0.8], // 剣の稽古の的
  [-28.5, 1, 1.0, 0.55], // 回廊の書見の腰掛け
];

// 城下の構造物（家・露店・井戸）。
export const TOWN_BLOCKERS: ReadonlyArray<readonly [number, number, number, number]> = [
  ...HOUSES.map(([cx, cz, hx, hz]) => [cx, cz, hx, hz] as const),
  ...STALLS.map(([cx, cz]) => [cx, cz, 1.5, 1.0] as const),
  [SQUARE[0], SQUARE[1], 1.4, 1.4], // 井戸
];

function inBoxes(
  boxes: ReadonlyArray<readonly [number, number, number, number]>,
  x: number,
  z: number,
): boolean {
  return boxes.some(([cx, cz, hx, hz]) => Math.abs(x - cx) < hx && Math.abs(z - cz) < hz);
}

const inRect = (r: readonly [number, number, number, number], x: number, z: number) =>
  x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];

// 城内も城下も平坦（standing on flat promontory）。標高は 0。
export function elsinoreHeight(): number {
  return 0;
}

export function elsinoreWalkable(x: number, z: number): boolean {
  // 城の中庭
  if (Math.abs(x) <= COURT_HALF && Math.abs(z) <= COURT_HALF) {
    const inner = COURT_HALF - 2.5;
    if (Math.abs(x) > inner && Math.abs(z) > inner) return false; // 四隅の塔
    return !inBoxes(BLOCKERS, x, z);
  }
  // 南門の通路（城→町）
  if (Math.abs(x) < GATE_HALF - 0.8 && z > COURT_HALF && z < TOWN_RECT[1] + 0.5) return true;
  // 城下：町・庭・港・桟橋
  if (
    inRect(TOWN_RECT, x, z) ||
    inRect(GARDEN_RECT, x, z) ||
    inRect(HARBOR_RECT, x, z) ||
    inRect(PIER_RECT, x, z)
  ) {
    if (inBoxes(TOWN_BLOCKERS, x, z)) return false;
    // オフィーリアの小川——板橋の上だけ渡れる
    if (
      x >= BROOK_X[0] &&
      x <= BROOK_X[1] &&
      z >= GARDEN_RECT[1] &&
      !(z >= BROOK_BRIDGE_Z[0] && z <= BROOK_BRIDGE_Z[1])
    )
      return false;
    return true;
  }
  return false;
}
