// 『高瀬舟』の座標検証スクリプト（開発用）。npx tsx scripts/probe-takasebune.ts
import {
  takaseWalkable,
  SPAWN,
  MOORINGS,
  KISUKE_SEAT,
  TALK_SPOT,
  SENDO,
  KOSATSU,
  YANAGI1,
  HOTARU1,
  JIZO,
  YANAGI2,
  MIZUOTO,
  TSUKIMI,
  HOTARU2,
  TE_HITASU,
  KUI,
  AKATSUKI,
  TOURO,
} from '../src/content/takasebune/layout';

let fails = 0;
const w = (label: string, x: number, z: number, expect = true) => {
  const ok = takaseWalkable(x, z) === expect;
  if (!ok) fails++;
  console.log(
    ok ? 'ok  ' : 'FAIL',
    label.padEnd(24),
    `(${x}, ${z})`.padEnd(18),
    expect ? '歩けるべき' : '塞がるべき',
  );
};

console.log('=== 舟と歩み板 ===');
w('SPAWN (deck M1)', SPAWN[0], SPAWN[1]);
for (const [i, mz] of MOORINGS.entries()) {
  w(`deck M${i + 1}`, 0, mz);
  w(`kisuke seat M${i + 1}`, KISUKE_SEAT(mz)[0], KISUKE_SEAT(mz)[1]);
  w(`talk spot M${i + 1}`, TALK_SPOT(mz)[0], TALK_SPOT(mz)[1]);
  w(`plank M${i + 1}`, -3, mz);
  w(`sendo M${i + 1}`, SENDO(mz)[0], SENDO(mz)[1]);
  w(`bank M${i + 1}`, -8, mz);
  w(`bank north edge M${i + 1}`, -8, mz - 11.5);
  w(`bank south edge M${i + 1}`, -8, mz + 11.5);
  w(`east water M${i + 1}`, 3, mz - 4, false); // 甲板の外の川面
  w(`east bank M${i + 1}`, 8, mz, false); // 東岸は歩けない
}

console.log('=== 舫いの間は川だけ ===');
w('between M1-M2', -8, -40, false);
w('between M2-M3', -8, 0, false);
w('between M3-M4', -8, 40, false);
w('north of M1', -8, -73, false);
w('south of M4', -8, 73, false);
w('canal center between', 0, -40, false);

console.log('=== 点景と当たり ===');
w('kosatsu blocked', KOSATSU[0], KOSATSU[1], false);
w('kosatsu approach', KOSATSU[0], KOSATSU[1] + 1.2);
w('yanagi1 blocked', YANAGI1[0], YANAGI1[1], false);
w('yanagi1 approach', YANAGI1[0] + 1.2, YANAGI1[1]);
w('hotaru1 spot', HOTARU1[0], HOTARU1[1]);
w('jizo blocked', JIZO[0], JIZO[1], false);
w('jizo approach', JIZO[0], JIZO[1] + 1);
w('yanagi2 approach', YANAGI2[0] + 1.2, YANAGI2[1]);
w('mizuoto spot', MIZUOTO[0], MIZUOTO[1]);
w('touro blocked', TOURO[0], TOURO[1], false);
w('tsukimi spot', TSUKIMI[0], TSUKIMI[1]);
w('hotaru2 spot', HOTARU2[0], HOTARU2[1]);
w('te hitasu spot', TE_HITASU[0], TE_HITASU[1]);
w('kui blocked', KUI[0], KUI[1], false);
w('kui approach', KUI[0] - 1, KUI[1]);
w('akatsuki spot', AKATSUKI[0], AKATSUKI[1]);

console.log(fails === 0 ? '\nすべて合格' : `\n*** ${fails} 件の不合格 ***`);
process.exit(fails === 0 ? 0 : 1);
