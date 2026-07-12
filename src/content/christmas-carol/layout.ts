// Layer 3: 『クリスマス・キャロル』の舞台——雪のロンドン。
// 中央に現在のシティ（事務所・広場・教会・市場・クラチット家・フレッドの家）、
// はるか西に「過去」の夢の街区、はるか東に「未来」の夢の街区。
// 三つの街区は歩いては行き来できず、精霊のテレポートだけが結ぶ。
// 当たり判定と描画はこの一枚の地図から生成する（ハムレット方式）。

// 歩ける矩形 [x1, z1, x2, z2]
export const MAIN_RECT = [-46, -38, 46, 42] as const; // 現在のロンドン
export const PAST_RECT = [-140, -16, -100, 26] as const; // 過去の街区（夢）
export const FUTURE_RECT = [100, -16, 140, 26] as const; // 未来の街区（夢）

// ── 現在の街の主要地点（XZ） ──
export const SPAWN: [number, number] = [8, -14]; // 事務所の前の通り
export const OFFICE: [number, number] = [14, -20]; // スクルージ＆マーレイ商会
export const OFFICE_DOOR: [number, number] = [10.2, -20];
export const HOME: [number, number] = [-16, -27]; // スクルージの住まい（陰気な中庭の奥）
export const KNOCKER: [number, number] = [-16, -23.6]; // 玄関のノッカー
export const BED: [number, number] = [-12.4, -25.5]; // 寝室（東の窓ぎわ）
export const HEARTH: [number, number] = [-16, -30.3]; // 暖炉（南側）
export const SQUARE: [number, number] = [0, 2]; // 広場（クリスマス・ツリー）
export const CHURCH: [number, number] = [-29, 8];
export const CHURCH_DOOR: [number, number] = [-24.2, 8];
export const CRATCHIT: [number, number] = [-20, 31]; // クラチット家（カムデン・タウン風）
export const CRATCHIT_WIN: [number, number] = [-20, 27.9];
export const FRED: [number, number] = [24, 28]; // 甥フレッドの家
export const FRED_WIN: [number, number] = [24, 24.7];
export const POULTERER: [number, number] = [13, 9]; // 鶏肉屋の店先
export const BRAZIER: [number, number] = [8.5, 13.5]; // 焼き栗の火鉢
export const VISION_SQ: [number, number] = [0, -6]; // 現在の精霊が立つ場所

// ── 過去の街区 ──
export const PAST_C: [number, number] = [-120, 4]; // 過去の精霊
export const PAST_ENTRY: [number, number] = [-120, 0];
export const SCHOOL: [number, number] = [-130, -8]; // 寄宿学校の教室
export const SCHOOL_SPOT: [number, number] = [-130, -4.6];
export const FEZZIWIG: [number, number] = [-112, -8]; // フェジウィッグの倉庫
export const FEZZIWIG_SPOT: [number, number] = [-112, -4.2];
export const BARE_TREE: [number, number] = [-120, 17]; // 冬枯れの木
export const BELLE_BENCH: [number, number] = [-121, 15.4];
export const BELLE_SPOT: [number, number] = [-119.8, 15.9];

// ── 未来の街区 ──
export const FUT_C: [number, number] = [120, 4]; // 未来の精霊（黒衣・無言）
export const FUT_ENTRY: [number, number] = [120, 0];
export const EXCHANGE: [number, number] = [110, -8]; // 取引所の柱廊
export const EXCHANGE_SPOT: [number, number] = [110, -4.5];
export const RAGSHOP: [number, number] = [130, -8]; // 古着屋ジョーの店
export const RAGSHOP_SPOT: [number, number] = [130, -4.8];
export const DIM_TABLE: [number, number] = [110, 17]; // 火の消えたクラチット家の食卓
export const DIM_SPOT: [number, number] = [110, 15.5];
export const GRAVE: [number, number] = [128, 16]; // 名前のない墓
export const GRAVE_SPOT: [number, number] = [128, 14.4];

// ── 建物。[中心x, 中心z, 半幅x, 半幅z, 軒高] — 描画も当たり判定もこの一枚から ──
export const BUILDINGS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [OFFICE[0], OFFICE[1], 3.4, 2.8, 3.6], // 0: 事務所
  [HOME[0], HOME[1], 3.2, 2.8, 4.0], // 1: スクルージの住まい
  [CHURCH[0], CHURCH[1], 4.2, 5.4, 6.0], // 2: 教会
  [CRATCHIT[0], CRATCHIT[1], 3.0, 2.5, 2.8], // 3: クラチット家
  [FRED[0], FRED[1], 3.4, 2.8, 3.4], // 4: フレッドの家
  [-14, -8, 2.6, 2.2, 3.0], // 5: 街の家
  [8, 22, 2.6, 2.4, 3.2], // 6: 街の家
  [28, -12, 2.8, 2.4, 3.0], // 7: 街の家
  [-30, -20, 2.6, 2.4, 3.4], // 8: 街の家
  [18, 15, 2.4, 2.0, 2.9], // 9: パン屋
];
export const OFFICE_INDEX = 0;
export const HOME_INDEX = 1;
export const CHURCH_INDEX = 2;
export const CRATCHIT_INDEX = 3;
export const FRED_INDEX = 4;
export const BAKERY_INDEX = 9;

// 夢の街区の建物
export const PAST_BUILDINGS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [SCHOOL[0], SCHOOL[1], 3.0, 2.5, 3.0], // 教室
  [FEZZIWIG[0], FEZZIWIG[1], 4.2, 3.2, 3.8], // 倉庫
];
export const FUTURE_BUILDINGS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [EXCHANGE[0], EXCHANGE[1], 3.5, 1.2, 4.0], // 柱廊
  [RAGSHOP[0], RAGSHOP[1], 3.2, 2.6, 3.2], // 古着屋
];

// 露店・小物の当たり判定 [中心x, 中心z, 半幅x, 半幅z]
export const PROP_BLOCKERS: ReadonlyArray<readonly [number, number, number, number]> = [
  [POULTERER[0], POULTERER[1], 1.6, 1.1], // 鶏肉屋の露店
  [BRAZIER[0], BRAZIER[1], 0.8, 0.8], // 焼き栗の火鉢
  [SQUARE[0], SQUARE[1], 1.6, 1.6], // 広場のツリー
  [BARE_TREE[0], BARE_TREE[1], 0.7, 0.7], // 冬枯れの木（過去）
  [BELLE_BENCH[0], BELLE_BENCH[1], 0.9, 0.5], // ベルの腰掛け（過去）
  [DIM_TABLE[0], DIM_TABLE[1], 1.4, 0.8], // 火の消えた食卓（未来）
  [GRAVE[0], GRAVE[1], 1.2, 0.9], // 名前のない墓（未来）
];

// 町NPCの立ち位置
export const FOLK_POS = {
  lamplighter: [3, -13] as [number, number], // 点灯夫
  carolboy: [3.2, 4.6] as [number, number], // 聖歌の子
  chestnutman: [8.5, 14.9] as [number, number], // 焼き栗売り
  poulterer: [13, 10.4] as [number, number], // 鶏肉屋
  beggar: [-24.6, 0.4] as [number, number], // 教会わきの物乞い
};

const inRect = (r: readonly [number, number, number, number], x: number, z: number) =>
  x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];

function inBoxes(
  boxes: ReadonlyArray<readonly [number, number, number, number]>,
  x: number,
  z: number,
): boolean {
  return boxes.some(([cx, cz, hx, hz]) => Math.abs(x - cx) < hx && Math.abs(z - cz) < hz);
}

const allBlockers: ReadonlyArray<readonly [number, number, number, number]> = [
  ...BUILDINGS.map(([cx, cz, hx, hz]) => [cx, cz, hx, hz] as const),
  ...PAST_BUILDINGS.map(([cx, cz, hx, hz]) => [cx, cz, hx, hz] as const),
  ...FUTURE_BUILDINGS.map(([cx, cz, hx, hz]) => [cx, cz, hx, hz] as const),
  ...PROP_BLOCKERS,
];

// 雪の街は平坦。標高は 0。
export function carolHeight(): number {
  return 0;
}

export function carolWalkable(x: number, z: number): boolean {
  if (!(inRect(MAIN_RECT, x, z) || inRect(PAST_RECT, x, z) || inRect(FUTURE_RECT, x, z)))
    return false;
  return !inBoxes(allBlockers, x, z);
}
