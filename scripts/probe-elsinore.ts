// エルシノア城下拡張の座標検証スクリプト（開発用）。npx tsx scripts/probe-elsinore.ts
import { elsinoreWalkable, TOWN_POS, POS } from '../src/content/hamlet/layout';

let fails = 0;
const w = (label: string, x: number, z: number, expect = true) => {
  const ok = elsinoreWalkable(x, z) === expect;
  if (!ok) fails++;
  console.log(
    ok ? 'ok  ' : 'FAIL',
    label.padEnd(24),
    `(${x}, ${z})`.padEnd(16),
    expect ? '歩けるべき' : '塞がるべき',
  );
};

console.log('=== 城内の既存座標（回帰） ===');
w('SPAWN', 0, 27);
w('battlements', 0, -29);
w('feign_madness', -7, 3);
w('soliloquy', -26, 6);
w('edit_script', 21, -1.5);
w('closet', 21, -20);
w('yorick', -20, 19.5);
w('accept_duel', 0, 6);
w('throne blocker', 0, -20.6, false);
w('stage blocker', 24, -5.5, false);
w('tower corner', 32, 32, false);

console.log('=== 門の通路 ===');
for (const z of [33.5, 34.5, 35.5, 36.5, 37.5]) w('gate z=' + z, 0, z);
w('gate wall east', 6, 35, false);

console.log('=== 町 ===');
w('street 40', 0, 40);
w('street 50', 0, 50);
w('square well edge', 2.2, 62);
w('well center', 0, 62, false);
w('square 8', 8, 62);
w('tavern inside', -14, 66, false);
w('tavern door spot', -9.7, 65.2);
w('act_tavern', -9.7, 67.5);
w('house A inside', -12, 44, false);
w('stall inside', 12, 66.5, false);
w('merchant', 12, 64.4);
w('bernardo', 4.3, 38.2);
w('paper_prison', 0, 39.5);
w('town south edge', 0, 91.5);
w('town beyond', 0, 93, false);

console.log('=== 庭 ===');
w('garden center', -36, 59);
w('rosemary', -38, 50);
w('pansy', -33, 64);
w('fennel', -45, 68);
w('willow side', -42.5, 58);
w('paper_sparrow', -44.5, 55.8);
w('brook north', -50.5, 50, false);
w('brook south', -50.5, 70, false);
w('bridge', -50.5, 59);
w('west bank rue', -54.5, 52);
w('madOphelia', TOWN_POS.madOphelia[0], TOWN_POS.madOphelia[1]);
w('town-garden seam a', -24, 60);
w('town-garden seam b', -23.9, 60);
w('town-garden seam c', -24.1, 60);

console.log('=== 港・桟橋 ===');
w('harbor mid', 36, 80);
w('fisher', TOWN_POS.fisher[0], TOWN_POS.fisher[1]);
w('town-harbor seam', 24, 80);
w('pier root', 39, 96);
w('pier mid', 39, 101);
w('act_sea', 39, 103.5);
w('paper_true', 39, 105);
w('pier end edge', 39, 106);
w('off pier', 34, 101, false);
w('sea east', 58, 80, false);

console.log('=== 城内の新設小物 ===');
w('pell blocker', 10, 26.5, false);
w('act_fence', 10, 28.2);
w('bench blocker', -28.5, 1, false);
w('act_read', -28.3, 2.4);
w('act_chapel', -24, -17);
w('act_horatio', 5.5, 16.5);
w('paper_joint', 3, -28);
w('paper_frailty', -28, 12);
w('paper_brevity', 8.5, -10);
w('paper_mirror', 25.5, 0.5);
w('daisy graveyard', -15.5, 26.5);

console.log('=== 城内NPC回帰（王と王妃は玉座の壇の上＝非歩行域が正） ===');
for (const [k, [x, z]] of Object.entries(POS)) {
  const onDais = k === 'claudius' || k === 'gertrude';
  w('pos ' + k, x, z, !onDais);
}

console.log(fails === 0 ? '\nすべて合格' : `\n*** ${fails} 件の不合格 ***`);
process.exit(fails === 0 ? 0 : 1);
