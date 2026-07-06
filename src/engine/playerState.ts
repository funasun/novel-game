import * as THREE from 'three';

// Layer 1: プレイヤーの物理位置。毎フレーム更新されるためZustandではなく可変ベクトルで持つ。
export const playerPosition = new THREE.Vector3();
