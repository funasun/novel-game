// Layer 1: 誘導ガイドの共有状態。3D世界（Canvas内）で毎フレーム算出した「目標地点までの
// 距離と、カメラ基準の方位」を、Canvas外のHUDへ橋渡しするための可変オブジェクト。
// playerPosition と同じく、毎フレーム更新のためZustandではなく素のオブジェクトで持つ。

export interface Guidance {
  active: boolean; // 目標地点（waypoint）が設定されているか
  distance: number; // プレイヤー→目標 の水平距離（メートル≒歩数の目安）
  // 画面基準の方位角（ラジアン）。上向き矢印を rotate(relAngle) すると目標方向を指す。
  // 0=正面、+で右、±πで背後。
  relAngle: number;
}

export const guidance: Guidance = {
  active: false,
  distance: 0,
  relAngle: 0,
};

// 開発時のみ：E2E/デバッグ用に誘導状態を覗けるようにする。
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__guidance = guidance;
}
