// Layer 1: テレポートの橋渡し。Effects.teleport（store側）が書き込み、
// Player の useFrame が次フレームで消費して位置とカメラを切り替える。
// Canvas 内外をまたぐため、playerPosition 等と同じ共有ミュータブル方式を使う。

const request: { pos: [number, number] | null } = { pos: null };

export function requestWarp(x: number, z: number): void {
  request.pos = [x, z];
}

export function consumeWarp(): [number, number] | null {
  const p = request.pos;
  request.pos = null;
  return p;
}
