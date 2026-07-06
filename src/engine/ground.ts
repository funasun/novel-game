// Layer 1: 接地インターフェース。
// エンジンは地形の中身を知らず、コンテンツ側が標高・歩行可否を登録する。

export interface GroundProvider {
  heightAt(x: number, z: number): number;
  isWalkable(x: number, z: number): boolean;
}

let ground: GroundProvider = {
  heightAt: () => 0,
  isWalkable: () => true,
};

export function setGround(provider: GroundProvider): void {
  ground = provider;
}

export function getGround(): GroundProvider {
  return ground;
}
