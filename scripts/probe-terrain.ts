// 拡張地形の座標検証スクリプト（開発用）。npx tsx scripts/probe-terrain.ts
import {
  chairmanHeight,
  chairmanWalkable,
  bridgeDeck,
  LAKE,
  BRIDGE,
  FORD,
} from '../src/content/two-years-vacation/terrain';
import { islandHeight } from '../src/shared-assets/procedural/terrain';

const p = (label: string, x: number, z: number) => {
  const h = chairmanHeight(x, z);
  console.log(
    label.padEnd(22),
    `(${x}, ${z})`.padEnd(14),
    'h=' + h.toFixed(2).padStart(6),
    chairmanWalkable(x, z) ? 'WALK' : '----',
  );
};

console.log('=== 既存座標の高さ差（0であるべき）===');
const olds: [string, number, number][] = [
  ['SPAWN', 0, 82],
  ['CAMP', 8, 74],
  ['SHIP', -13, 83],
  ['LOOKOUT', 2, 6],
  ['CAVE', -36, 12],
  ['NORTH', 0, -76],
  ['BOAT', 4, 86],
  ['grave', -31, 16.5],
  ['traps', -20, 4],
  ['moors', -55, 45],
  ['severn', 62, 10],
  ['SALT_ROCK', 14, 81],
  ['SEAL_ROCK', -24, 74],
  ['SUGAR_TREE', -12, 34],
  ['RHEA', -28, 19],
  ['CORRAL', -44, 20],
];
for (const [l, x, z] of olds) {
  const d = chairmanHeight(x, z) - islandHeight(x, z);
  console.log(l.padEnd(12), 'delta=' + d.toFixed(3), Math.abs(d) > 0.3 ? ' *** 大きい ***' : '');
}

console.log('\n=== 新地物 ===');
p('LAKE center', LAKE[0], LAKE[1]);
p('LAKE shore E', LAKE[0] + 14, LAKE[1]);
p('LAKE shore S', LAKE[0], LAKE[1] + 14);
p('LAKE shore N', LAKE[0] + 2, LAKE[1] - 14);
p('BRIDGE center', BRIDGE[0], BRIDGE[1]);
console.log('bridge deck =', bridgeDeck(BRIDGE[0], BRIDGE[1])?.toFixed(2));
p('FORD', FORD[0], FORD[1]);
p('knoll top', 30, -40);

console.log('\n=== 川の遮断チェック（z=20 と z=44 で横断・橋なし地点）===');
for (let x = -58; x <= -42; x += 2) p('cross z=20', x, 20);
for (let x = -50; x <= -34; x += 2) p('cross z=44', x, 44);
console.log('=== 浅瀬の横断（z=95）===');
for (let x = -58; x <= -36; x += 2) p('cross z=95', x, 95);
console.log('=== 橋の横断（橋の軸に沿って）===');
for (let u = -7; u <= 7; u += 1.4) {
  const x = BRIDGE[0] + 0.824 * u;
  const z = BRIDGE[1] - 0.566 * u;
  const d = bridgeDeck(x, z);
  console.log(
    'bridge u=' + u.toFixed(1).padStart(5),
    'h=' + chairmanHeight(x, z).toFixed(2).padStart(6),
    'deck=' + (d === null ? ' null' : d.toFixed(2)),
    chairmanWalkable(x, z) ? 'WALK' : '----',
  );
}
console.log('=== 湖岸の釣り場候補（東岸を放射走査）===');
for (let r = 8; r <= 15; r += 1) p('lake east r=' + r, LAKE[0] + r, LAKE[1]);
for (let r = 8; r <= 15; r += 1) p('lake north r=' + r, LAKE[0], LAKE[1] - r);
console.log('=== 桟橋・湖の小物・粘土の最終候補 ===');
p('pier a', 5, 85.5);
p('pier b', 7, 85);
p('pier c', 3, 84.5);
p('bathe', -52, -20);
p('fish lake E', -45, -8);
p('fish lake N', -52, -19);
p('clay ford', -41, 91);
p('reed river mid', -36.5, 44.5);
p('fish river bank', -37, 45);

console.log('\n=== リング走査：方位ごとの新しい土地（歩ける帯）===');
for (let deg = 0; deg < 360; deg += 15) {
  const a = (deg * Math.PI) / 180;
  let from = -1;
  let to = -1;
  let maxH = -99;
  for (let r = 96; r <= 136; r += 1.5) {
    const x = Math.cos(a) * r;
    const z = Math.sin(a) * r;
    if (chairmanWalkable(x, z)) {
      if (from < 0) from = r;
      to = r;
      maxH = Math.max(maxH, chairmanHeight(x, z));
    }
  }
  console.log(
    `deg=${String(deg).padStart(3)}`,
    from < 0 ? '（陸なし）' : `r=${from}..${to} maxH=${maxH.toFixed(1)}`,
  );
}

console.log('\n=== 候補地の検証 ===');
const cands: [string, number, number][] = [
  ['east cape 1', 118, 15],
  ['east cape 2', 112, 25],
  ['east cape 3', 120, 0],
  ['north cape 1', 8, -116],
  ['north cape 2', -10, -114],
  ['south beach 1', 30, 112],
  ['south beach 2', -8, 118],
  ['west cape 1', -114, -30],
  ['west cape 2', -110, 20],
  ['berry 1', -16, 48],
  ['berry 2', 22, 42],
  ['berry 3', -6, -30],
  ['stone 1', 24, -34],
  ['stone 2', 38, -46],
  ['stone 3', 45, -20],
  ['reed 1', -35, 42],
  ['reed 2', -46, 60],
  ['clay 1', -38, 70],
  ['egg 1', 34, -44],
  ['egg 2', 12, -100],
  ['herb 1', -52, 52],
  ['herb 2', -60, 38],
  ['fish river', -33, 46],
  ['tower site', 33, -37],
  ['smoke site', -30, 6],
  ['pier site', 6, 87],
  ['pier site2', 7, 86.5],
  ['turtle south', 20, 108],
  ['wreck east', 108, 30],
  ['survey west', -104, -12],
  ['ford west landing', -54, 96],
  ['ford east landing', -40, 94],
  ['reed 1b', -34, 40],
  ['reed 2b', -43, 58],
  ['clay 1b', -40, 74],
  ['clay 2', -44, 86],
];
for (const [l, x, z] of cands) p(l, x, z);

console.log('\n=== 倒木（再取得の薪）候補と大凧の丘 ===');
p('wood grove A', 12, 30);
p('wood grove B', -8, 52);
p('wood grove C', 24, -12);
p('wood grove D', -14, -52);
p('KNOLL', 30, -40);
p('TOWER_SITE', 33, -37);
