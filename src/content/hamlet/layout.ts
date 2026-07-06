// Layer 3: エルシノア城（クロンボー城）の座標系。
// 中庭を正方形の石畳とし、四方を城壁・四隅を塔で囲う。南に門。
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

// NPC の立ち位置。
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

// 歩行を遮る中庭内の構造物（軸並行の箱）。[中心x, 中心z, 半幅x, 半幅z]
export const BLOCKERS: ReadonlyArray<readonly [number, number, number, number]> = [
  [0, -20.6, 6, 3], // 玉座の壇
  [24, -5.5, 4, 3.2], // 旅役者の舞台
  [-24, -20.5, 3.4, 3], // 礼拝堂の祭壇
  [-21.5, 23.5, 5, 3.5], // 墓地の盛土・墓石群
];

function inBlocker(x: number, z: number): boolean {
  return BLOCKERS.some(
    ([cx, cz, hx, hz]) => Math.abs(x - cx) < hx && Math.abs(z - cz) < hz,
  );
}

// 城内はほぼ平坦な石畳。標高は 0。
export function elsinoreHeight(): number {
  return 0;
}

export function elsinoreWalkable(x: number, z: number): boolean {
  if (Math.abs(x) > COURT_HALF || Math.abs(z) > COURT_HALF) return false;
  // 四隅の塔の内側は塞ぐ
  const inner = COURT_HALF - 2.5;
  if (Math.abs(x) > inner && Math.abs(z) > inner) return false;
  return !inBlocker(x, z);
}
