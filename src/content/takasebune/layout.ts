// Layer 3: 『高瀬舟』の舞台——夜の高瀬川。
// 北から南へ、川筋に沿って四つの舫い（章）が並ぶ。
// 舟は章が進むごとに川を下り、プレイヤーは各舫いで西岸の小さな岸辺だけを歩ける。
// 岸辺どうしは地続きではなく、舟（イベントのテレポート）だけが結ぶ。
// 当たり判定と描画はこの一枚の地図から生成する（ハムレット/キャロル方式）。

// ── 川筋 ──
// 川は x ∈ [-4, 4]、z は北(-)から南(+)へ流れる。
export const CANAL_HALF = 4; // 川幅の半分
export const CANAL_LEN: [number, number] = [-78, 78]; // 川の全長（z）

// 四つの舫い（章）の z 座標。北＝三条から、南＝伏見へ。
export const MOORINGS = [-60, -20, 20, 60] as const;
export const M1 = MOORINGS[0]; // 第一章: 晴れやかな罪人（三条の舫い）
export const M2 = MOORINGS[1]; // 第二章: 二百文の知足（蔵の岸）
export const M3 = MOORINGS[2]; // 第三章: 弟の告白（月見の州）
export const M4 = MOORINGS[3]; // 第四章: 暁の大阪へ（伏見の舫い）

// 舟のいる位置（章ごと）。舟は川の中央に浮かぶ。
export const BOAT_POS = (mz: number): [number, number] => [0, mz];

// 喜助の座る場所と、語らいの立ち位置（舟の上）
export const KISUKE_SEAT = (mz: number): [number, number] => [0, mz - 1.3];
export const TALK_SPOT = (mz: number): [number, number] => [0, mz + 0.6];

// 船頭の立ち位置（歩み板のたもと、岸の上）。
// 舟はここで待つ——出立はプレイヤーが船頭に告げたときだけ（岸の見のこし防止）。
export const SENDO = (mz: number): [number, number] => [-5.4, mz - 2.6];

// スポーン: 第一の舫いの舟の上（艫のほう）
export const SPAWN: [number, number] = [0, M1 + 1.5];

// ── 歩ける矩形 [x1, z1, x2, z2] ──
// 各舫い = 西岸の岸辺ポケット + 歩み板 + 舟の甲板。
const BANK = (mz: number) => [-13, mz - 12, -4.6, mz + 12] as const; // 西岸の岸辺
const PLANK = (mz: number) => [-4.8, mz - 0.9, -1.2, mz + 0.9] as const; // 歩み板
const DECK = (mz: number) => [-1.4, mz - 2.6, 1.4, mz + 2.6] as const; // 舟の甲板

export const WALK_RECTS: ReadonlyArray<readonly [number, number, number, number]> = MOORINGS.flatMap(
  (mz) => [BANK(mz), PLANK(mz), DECK(mz)],
);

// ── 岸辺の点景（西岸） ──
// 第一の舫い（三条）
export const KOSATSU: [number, number] = [-9, M1 - 6]; // 高札場
export const YANAGI1: [number, number] = [-11, M1 + 6]; // 柳
export const HOTARU1: [number, number] = [-7, M1 + 8.5]; // 蛍の茂み（点景・当たりなし）
// 第二の舫い（蔵の岸）
export const JIZO: [number, number] = [-9, M2 - 6]; // 地蔵の辻
export const YANAGI2: [number, number] = [-11, M2 + 4]; // 柳
export const MIZUOTO: [number, number] = [-5.4, M2 + 7]; // 水音を聴く岸っぷち（点景）
// 第三の舫い（月見の州）
export const TSUKIMI: [number, number] = [-8, M3 + 6]; // 朧月を仰ぐ州（点景）
export const HOTARU2: [number, number] = [-10, M3 - 6]; // 蛍の乱舞（点景）
export const TE_HITASU: [number, number] = [-5.4, M3 + 2]; // 流れに手を浸す岸っぷち（点景）
// 第四の舫い（伏見）
export const KUI: [number, number] = [-5.6, M4 - 2]; // 舫い杭
export const YANAGI3: [number, number] = [-11, M4 - 8]; // 柳
export const AKATSUKI: [number, number] = [-9, M4 + 7]; // 暁の気配を待つ岸（点景）

// 石灯籠（第二の舫い・地蔵のそば）
export const TOURO: [number, number] = [-7.5, M2 - 8];

// 火の消えた灯籠。各舫いにひとつ——第二の舫いでは、灯る TOURO と対のかたわれ。
// 岸の蛍を掬って火袋に放すと、蛍いろに灯る（フラグ lit1..lit4）。
export const KIETOURO1: [number, number] = [-10.5, M1 - 1];
export const KIETOURO2: [number, number] = [-10.5, M2 - 8];
export const KIETOURO3: [number, number] = [-10.8, M3 + 1.5];
export const KIETOURO4: [number, number] = [-9.5, M4 + 2.5];

// 蛍の茂み（掬える）。M1/M3 は既存の点景の茂みを使い、M2/M4 はここに新設。
export const HOTARU_M2: [number, number] = [-11, M2 + 8];
export const HOTARU_M4: [number, number] = [-11.5, M4 + 4];

// ── 岸辺の小物の当たり判定 [中心x, 中心z, 半幅x, 半幅z] ──
export const PROP_BLOCKERS: ReadonlyArray<readonly [number, number, number, number]> = [
  [KOSATSU[0], KOSATSU[1], 1.1, 0.5], // 高札場
  [YANAGI1[0], YANAGI1[1], 0.6, 0.6], // 柳の幹
  [JIZO[0], JIZO[1], 0.5, 0.5], // 地蔵
  [YANAGI2[0], YANAGI2[1], 0.6, 0.6],
  [TOURO[0], TOURO[1], 0.4, 0.4], // 石灯籠
  [KUI[0], KUI[1], 0.3, 0.3], // 舫い杭
  [YANAGI3[0], YANAGI3[1], 0.6, 0.6],
  [KIETOURO1[0], KIETOURO1[1], 0.35, 0.35], // 火の消えた灯籠×4
  [KIETOURO2[0], KIETOURO2[1], 0.35, 0.35],
  [KIETOURO3[0], KIETOURO3[1], 0.35, 0.35],
  [KIETOURO4[0], KIETOURO4[1], 0.35, 0.35],
];

// 橋（舫いと舫いの中間、視覚のリズム。歩行域の外なので当たりは不要）
export const BRIDGES = [-40, 0, 40] as const;

// 東岸の蔵と町家（すべて歩行域の外＝視覚のみ）
export const KURA_ROW: ReadonlyArray<readonly [number, number, number]> = [
  // [z, 幅, 奥行き] — x は東岸 +7.5 に固定
  [-66, 7, 4],
  [-56, 6, 4],
  [-24, 8, 4.5],
  [-14, 6, 4],
  [14, 7, 4],
  [26, 6, 4],
  [54, 8, 4.5],
  [66, 6, 4],
];

const inRect = (r: readonly [number, number, number, number], x: number, z: number) =>
  x >= r[0] && x <= r[2] && z >= r[1] && z <= r[3];

// 夜の川辺は平坦。標高は 0。
export function takaseHeight(): number {
  return 0;
}

export function takaseWalkable(x: number, z: number): boolean {
  if (!WALK_RECTS.some((r) => inRect(r, x, z))) return false;
  return !PROP_BLOCKERS.some(([cx, cz, hx, hz]) => Math.abs(x - cx) < hx && Math.abs(z - cz) < hz);
}
