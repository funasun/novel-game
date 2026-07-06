import * as THREE from 'three';

// Layer 1: プレイヤーの物理位置。毎フレーム更新されるためZustandではなく可変ベクトルで持つ。
export const playerPosition = new THREE.Vector3();

// 開発時のみ：E2E/デバッグ用に現在位置を公開
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__player = playerPosition;
}
