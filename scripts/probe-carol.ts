// 『クリスマス・キャロル』の座標検証スクリプト（開発用）。npx tsx scripts/probe-carol.ts
import {
  carolWalkable,
  SPAWN,
  OFFICE_DOOR,
  KNOCKER,
  BED,
  HEARTH,
  CHURCH_DOOR,
  CRATCHIT_WIN,
  FRED_WIN,
  VISION_SQ,
  PAST_ENTRY,
  SCHOOL_SPOT,
  FEZZIWIG_SPOT,
  BELLE_SPOT,
  FUT_ENTRY,
  EXCHANGE_SPOT,
  RAGSHOP_SPOT,
  DIM_SPOT,
  GRAVE_SPOT,
  FOLK_POS,
} from '../src/content/christmas-carol/layout';

let fails = 0;
const w = (label: string, x: number, z: number, expect = true) => {
  const ok = carolWalkable(x, z) === expect;
  if (!ok) fails++;
  console.log(
    ok ? 'ok  ' : 'FAIL',
    label.padEnd(24),
    `(${x}, ${z})`.padEnd(18),
    expect ? '歩けるべき' : '塞がるべき',
  );
};

console.log('=== 現在の街 ===');
w('SPAWN', SPAWN[0], SPAWN[1]);
w('office door', OFFICE_DOOR[0], OFFICE_DOOR[1]);
w('office inside', 14, -20, false);
w('visitor fred spot', 12, -16);
w('visitor charity spot', 16, -16.5);
w('knocker', KNOCKER[0], KNOCKER[1]);
w('home inside', -16, -27, false);
w('bed', BED[0], BED[1]);
w('hearth', HEARTH[0], HEARTH[1]);
w('square center tree', 0, 2, false);
w('square edge', 2.5, 3.5);
w('church door', CHURCH_DOOR[0], CHURCH_DOOR[1]);
w('church inside', -29, 8, false);
w('cratchit window', CRATCHIT_WIN[0], CRATCHIT_WIN[1]);
w('cratchit inside', -20, 31, false);
w('fred window', FRED_WIN[0], FRED_WIN[1]);
w('fred deed spot', 25.5, 24.7);
w('vision square', VISION_SQ[0], VISION_SQ[1]);
w('poulterer stall', 13, 9, false);
w('turkey deed spot', 13, 7.6);
w('brazier', 8.5, 13.5, false);
w('chestnut spot', 8.5, 12.3);
w('charity deed spot', 6, -8);
w('alms spot', -24, 1);
w('bob deed spot', 10.2, -19);
w('main north edge', 0, -37.5);
w('main beyond north', 0, -39, false);
w('between main and past', -70, 0, false);

console.log('=== 過去の街区 ===');
w('past entry', PAST_ENTRY[0], PAST_ENTRY[1]);
w('school spot', SCHOOL_SPOT[0], SCHOOL_SPOT[1]);
w('school inside', -130, -8, false);
w('fezziwig spot', FEZZIWIG_SPOT[0], FEZZIWIG_SPOT[1]);
w('fezziwig inside', -112, -8, false);
w('belle spot', BELLE_SPOT[0], BELLE_SPOT[1]);
w('bare tree', -120, 17, false);
w('past west edge', -139.5, 4);

console.log('=== 未来の街区 ===');
w('future entry', FUT_ENTRY[0], FUT_ENTRY[1]);
w('exchange spot', EXCHANGE_SPOT[0], EXCHANGE_SPOT[1]);
w('exchange colonnade', 110, -8, false);
w('ragshop spot', RAGSHOP_SPOT[0], RAGSHOP_SPOT[1]);
w('ragshop inside', 130, -8, false);
w('dim table spot', DIM_SPOT[0], DIM_SPOT[1]);
w('dim table', 110, 17, false);
w('grave spot', GRAVE_SPOT[0], GRAVE_SPOT[1]);
w('grave stone', 128, 16, false);
w('between main and future', 70, 0, false);

console.log('=== 紙片（言葉の欠片）と町の人 ===');
w('cq1 office lane', 10, -13.5);
w('cq2 square', 2.5, 3.5);
w('cq3 church side', -24.4, 12.5);
w('cq4 cratchit lane', -16, 26);
w('cq5 market', 16.5, 11.8);
w('cq6 past tree', -122, 14.5);
w('cq7 future grave', 126, 13.4);
for (const [k, [x, z]] of Object.entries(FOLK_POS)) w('folk ' + k, x, z);

console.log(fails === 0 ? '\nすべて合格' : `\n*** ${fails} 件の不合格 ***`);
process.exit(fails === 0 ? 0 : 1);
