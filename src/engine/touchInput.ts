// Layer 1: タッチ移動入力の共有状態。バーチャルジョイスティック（Canvas外のDOM）が書き込み、
// Player の useFrame（Canvas内）が毎フレーム読む。毎フレーム更新のためZustandではなく
// 素の可変オブジェクトで持つ——playerPosition / guidance と同じ「Canvas内外ブリッジ」の型。

export interface TouchMove {
  // カメラ基準の移動入力。キーボードの inX/inZ と同じ意味に揃える。
  x: number; // 右+ / 左−
  y: number; // 前+ / 後−
  active: boolean; // 現在ジョイスティックに触れているか
}

export const touchMove: TouchMove = { x: 0, y: 0, active: false };

// 移動入力を無効化（会話突入・アンマウント時などに暴走を防ぐ）。
export function clearTouchMove(): void {
  touchMove.x = 0;
  touchMove.y = 0;
  touchMove.active = false;
}

// 開発時のみ：E2E/デバッグ用に覗けるようにする。
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__touch = touchMove;
}
