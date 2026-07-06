// Layer 1: 動的な障害物レジストリ。人や物など「すり抜けさせたくない」ものを
// 実行時に円柱（XZ平面の円）として登録する。地形の歩行可否(ground.isWalkable)とは
// 別レイヤで、Scene が mount/unmount のたびに足し引きする（物語で現れる・消える人物にも追従）。

export interface Obstacle {
  x: number;
  z: number;
  r: number;
}

const obstacles = new Set<Obstacle>();

// 障害物を1つ登録し、取り消し関数を返す（useEffect のクリーンアップで呼ぶ）。
export function addObstacle(o: Obstacle): () => void {
  obstacles.add(o);
  return () => {
    obstacles.delete(o);
  };
}

export function clearObstacles(): void {
  obstacles.clear();
}

// 半径 selfR のプレイヤーが (x,z) に立つと、いずれかの障害物へ食い込むか。
export function obstructed(x: number, z: number, selfR = 0.34): boolean {
  for (const o of obstacles) {
    const dx = x - o.x;
    const dz = z - o.z;
    const rr = o.r + selfR;
    if (dx * dx + dz * dz < rr * rr) return true;
  }
  return false;
}

// 開発時のみ：E2E/デバッグ用に障害物レジストリを覗けるようにする。
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__obstacles = {
    obstructed,
    count: () => obstacles.size,
    list: () => [...obstacles],
  };
}
