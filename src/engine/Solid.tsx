import { useEffect } from 'react';
import { addObstacle } from './obstacles';

// Layer 1: 「すり抜けさせない」印。人や物の足元に置くと、その場に当たり判定の円を張る。
// 見た目は描画せず（3Dは持たない）、マウントしている間だけ障害物として登録する。
// 物語フラグで現れ／消える人物や小物も、React の生存期間に自然に追従する。
// x,z は世界座標、r は半径（メートル）。y（高さ）は無関係。
export function Solid({ x, z, r = 0.7 }: { x: number; z: number; r?: number }) {
  useEffect(() => addObstacle({ x, z, r }), [x, z, r]);
  return null;
}
