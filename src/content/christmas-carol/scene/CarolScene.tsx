import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { setGround } from '../../../engine/ground';
import { Solid } from '../../../engine/Solid';
import { Character, CharacterPalette } from '../../../engine/Character';
import { playerPosition } from '../../../engine/playerState';
import { useGame } from '../../../engine/store/gameStore';
import {
  carolHeight,
  carolWalkable,
  PAST_RECT,
  FUTURE_RECT,
  BUILDINGS,
  PAST_BUILDINGS,
  FUTURE_BUILDINGS,
  CHURCH_INDEX,
  CRATCHIT_INDEX,
  SQUARE,
  OFFICE_DOOR,
  KNOCKER,
  POULTERER,
  BRAZIER,
  PAST_C,
  SCHOOL,
  FEZZIWIG,
  BARE_TREE,
  BELLE_BENCH,
  FUT_C,
  EXCHANGE,
  RAGSHOP,
  DIM_TABLE,
  GRAVE,
  FOLK_POS,
  DEBTOR_POS,
} from '../layout';

// Layer 3: 『クリスマス・キャロル』の舞台——1843年、雪のロンドン。
// 煉瓦の家並み・ガス灯・広場のツリー・教会の尖塔、すべてプロシージャル生成。
// はるか西の「過去」とはるか東の「未来」は、精霊のテレポートだけが結ぶ夢の街区。

export function CarolScene() {
  useEffect(() => {
    setGround({ heightAt: carolHeight, isWalkable: carolWalkable });
  }, []);

  return (
    <group>
      {/* 冬のロンドンの空気。World の昼夜に、冷たい青の補助光を重ねる */}
      <ambientLight intensity={0.5} color="#8fa3c8" />
      <directionalLight position={[30, 50, 20]} intensity={0.35} color="#cfe0ff" />
      <Grounds />
      <Statics />
      <Snowfall />
      <People />
      <QuotePapers />
      <NightLamps />
      <WarmthGlow />
    </group>
  );
}

// ── 地面（三つの街区の雪原と石畳） ─────────────────────────
function Grounds() {
  return (
    <group>
      {/* 現在の街の雪原 */}
      <mesh receiveShadow position={[0, -0.05, 2]}>
        <boxGeometry args={[96, 0.1, 84]} />
        <meshStandardMaterial color="#e7ecf2" roughness={1} />
      </mesh>
      {/* 石畳の大通り（南北）と横道（東西） */}
      <mesh receiveShadow position={[0, 0.02, 2]}>
        <boxGeometry args={[7, 0.08, 80]} />
        <meshStandardMaterial color="#c2c9d4" roughness={1} />
      </mesh>
      <mesh receiveShadow position={[0, 0.018, 1.5]}>
        <boxGeometry args={[92, 0.08, 7]} />
        <meshStandardMaterial color="#c2c9d4" roughness={1} />
      </mesh>
      {/* 広場の丸石畳 */}
      <mesh receiveShadow position={[SQUARE[0], 0.045, SQUARE[1]]}>
        <cylinderGeometry args={[9, 9, 0.08, 24]} />
        <meshStandardMaterial color="#cdd3dd" roughness={1} />
      </mesh>
      {/* 過去の街区——セピアがかった雪 */}
      <mesh receiveShadow position={[(PAST_RECT[0] + PAST_RECT[2]) / 2, -0.05, (PAST_RECT[1] + PAST_RECT[3]) / 2]}>
        <boxGeometry args={[PAST_RECT[2] - PAST_RECT[0] + 4, 0.1, PAST_RECT[3] - PAST_RECT[1] + 4]} />
        <meshStandardMaterial color="#e9e2cf" roughness={1} />
      </mesh>
      {/* 未来の街区——鉛色の雪 */}
      <mesh receiveShadow position={[(FUTURE_RECT[0] + FUTURE_RECT[2]) / 2, -0.05, (FUTURE_RECT[1] + FUTURE_RECT[3]) / 2]}>
        <boxGeometry args={[FUTURE_RECT[2] - FUTURE_RECT[0] + 4, 0.1, FUTURE_RECT[3] - FUTURE_RECT[1] + 4]} />
        <meshStandardMaterial color="#a9aeb9" roughness={1} />
      </mesh>
    </group>
  );
}

// ── 静的な街並み（重い形状はまとめて一度だけ組む） ─────────────
function Statics() {
  const group = useMemo(() => build(), []);
  return <primitive object={group} />;
}

function box(
  g: THREE.Group,
  w: number,
  h: number,
  d: number,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  ry = 0,
  rx = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.rotation.y = ry;
  m.rotation.x = rx;
  m.castShadow = true;
  m.receiveShadow = true;
  g.add(m);
  return m;
}

function build(): THREE.Group {
  const g = new THREE.Group();

  const brickA = new THREE.MeshStandardMaterial({ color: '#7c4f41', roughness: 1, flatShading: true });
  const brickB = new THREE.MeshStandardMaterial({ color: '#6b5348', roughness: 1, flatShading: true });
  const plaster = new THREE.MeshStandardMaterial({ color: '#b3a58c', roughness: 1, flatShading: true });
  const snowRoof = new THREE.MeshStandardMaterial({ color: '#eef2f7', roughness: 1, flatShading: true });
  const timber = new THREE.MeshStandardMaterial({ color: '#3c3129', roughness: 1, flatShading: true });
  const stone = new THREE.MeshStandardMaterial({ color: '#8b8f9a', roughness: 1, flatShading: true });
  const stoneDark = new THREE.MeshStandardMaterial({ color: '#5a5e69', roughness: 1, flatShading: true });
  const winWarm = new THREE.MeshStandardMaterial({
    color: '#ffcf7e',
    emissive: '#ffb85c',
    emissiveIntensity: 1.4,
  });
  const winCold = new THREE.MeshStandardMaterial({
    color: '#4a5468',
    emissive: '#22283a',
    emissiveIntensity: 0.4,
  });
  const door = new THREE.MeshStandardMaterial({ color: '#4a2f22', roughness: 1 });
  const green = new THREE.MeshStandardMaterial({ color: '#2f5d3a', roughness: 1, flatShading: true });
  const iron = new THREE.MeshStandardMaterial({ color: '#2b2e35', roughness: 0.9 });

  // 家を一軒建てる。dark=true なら未来の街区の陰気な色に。
  const house = (
    cx: number,
    cz: number,
    hx: number,
    hz: number,
    h: number,
    opts: { dark?: boolean; sepia?: boolean; church?: boolean; openFront?: boolean; brick?: boolean } = {},
  ) => {
    const wall = opts.dark ? stoneDark : opts.sepia ? plaster : opts.brick ? brickA : brickB;
    const win = opts.dark ? winCold : winWarm;
    if (opts.openFront) {
      // 南面がひらいた建物（倉庫・店）。三方の壁＋屋根。
      box(g, hx * 2, h, 0.3, cx, h / 2, cz - hz + 0.15, wall);
      box(g, 0.3, h, hz * 2, cx - hx + 0.15, h / 2, cz, wall);
      box(g, 0.3, h, hz * 2, cx + hx - 0.15, h / 2, cz, wall);
      box(g, hx * 2 + 0.5, 0.3, hz * 2 + 0.5, cx, h + 0.15, cz, snowRoof);
      return;
    }
    box(g, hx * 2, h, hz * 2, cx, h / 2, cz, wall);
    // 切妻の雪屋根
    const roofH = Math.min(hx, hz) * 0.9;
    const slope = Math.hypot(hz, roofH) + 0.35;
    const ang = Math.atan2(roofH, hz);
    const r1 = box(g, hx * 2 + 0.5, 0.22, slope, cx, h + roofH / 2, cz - hz / 2, snowRoof);
    r1.rotation.x = ang;
    const r2 = box(g, hx * 2 + 0.5, 0.22, slope, cx, h + roofH / 2, cz + hz / 2, snowRoof);
    r2.rotation.x = -ang;
    box(g, hx * 2 - 0.4, roofH, hz * 2 - 0.4, cx, h + roofH / 2 - 0.1, cz, wall); // 妻壁の詰め
    // 通りに面した戸口と窓。x<0 の家は東向き、x>=0 は西向き。
    const face = cx < 0 ? 1 : -1;
    const fx = cx + face * hx;
    box(g, 0.12, 1.5, 0.9, fx + face * 0.05, 0.75, cz, door);
    box(g, 0.1, 0.8, 0.7, fx + face * 0.08, 1.7, cz - hz * 0.55, win);
    box(g, 0.1, 0.8, 0.7, fx + face * 0.08, 1.7, cz + hz * 0.55, win);
    // 煙突
    box(g, 0.5, 1.2, 0.5, cx + hx * 0.4, h + roofH + 0.3, cz, wall);
    if (opts.church) {
      // 鐘楼と尖塔（北端）
      box(g, 2.4, h + 3.4, 2.4, cx, (h + 3.4) / 2, cz - hz + 1.2, stone);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(1.7, 3.6, 4), snowRoof);
      spire.position.set(cx, h + 3.4 + 1.8, cz - hz + 1.2);
      spire.rotation.y = Math.PI / 4;
      spire.castShadow = true;
      g.add(spire);
      box(g, 0.16, 1.0, 0.16, cx, h + 3.4 + 3.9, cz - hz + 1.2, iron);
      box(g, 0.6, 0.16, 0.16, cx, h + 3.4 + 4.1, cz - hz + 1.2, iron);
      // 尖頭窓
      box(g, 0.12, 1.6, 0.8, cx + hx + 0.02, 2.4, cz + 1.6, winWarm);
      box(g, 0.12, 1.6, 0.8, cx + hx + 0.02, 2.4, cz - 1.2, winWarm);
    }
  };

  // 現在の街の家並み
  BUILDINGS.forEach(([cx, cz, hx, hz, h], i) => {
    house(cx, cz, hx, hz, h, {
      church: i === CHURCH_INDEX,
      brick: i % 2 === 0,
      sepia: i === CRATCHIT_INDEX,
    });
  });

  // 事務所の看板「スクルージ＆マーレイ商会」——文字は使わず、掛け看板の形で。
  box(g, 0.08, 0.5, 1.3, OFFICE_DOOR[0] + 0.4, 2.4, OFFICE_DOOR[1] + 1.6, timber);
  box(g, 0.06, 0.34, 1.1, OFFICE_DOOR[0] + 0.42, 2.4, OFFICE_DOOR[1] + 1.6, plaster);
  box(g, 0.06, 0.06, 1.0, OFFICE_DOOR[0] + 0.45, 2.52, OFFICE_DOOR[1] + 1.6, timber);
  box(g, 0.06, 0.06, 0.7, OFFICE_DOOR[0] + 0.45, 2.36, OFFICE_DOOR[1] + 1.6, timber);

  // 玄関のノッカー（マーレイの顔になる真鍮の環）
  const knockerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.045, 8, 14),
    new THREE.MeshStandardMaterial({ color: '#c9a24b', metalness: 0.6, roughness: 0.4 }),
  );
  knockerRing.position.set(KNOCKER[0] + 0.2, 1.25, KNOCKER[1] - 0.55);
  g.add(knockerRing);

  // 広場のクリスマス・ツリー
  const treeTrunk = box(g, 0.5, 1.0, 0.5, SQUARE[0], 0.5, SQUARE[1], timber);
  void treeTrunk;
  const treeGreen = new THREE.MeshStandardMaterial({ color: '#2c5637', roughness: 1, flatShading: true });
  [
    [2.4, 1.6, 1.4],
    [1.9, 1.5, 2.5],
    [1.3, 1.4, 3.5],
  ].forEach(([r, h, y]) => {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r, h, 8), treeGreen);
    cone.position.set(SQUARE[0], y, SQUARE[1]);
    cone.castShadow = true;
    g.add(cone);
  });
  const star = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.3),
    new THREE.MeshStandardMaterial({ color: '#ffe28a', emissive: '#ffd45e', emissiveIntensity: 2.2 }),
  );
  star.position.set(SQUARE[0], 4.5, SQUARE[1]);
  g.add(star);
  const baubleColors = ['#d8574d', '#e8b04b', '#5f9ed8', '#d8574d', '#e8b04b', '#5f9ed8', '#c8dff0', '#d8574d'];
  baubleColors.forEach((c, i) => {
    const a = (i / baubleColors.length) * Math.PI * 2;
    const y = 1.3 + (i % 3) * 1.0;
    const r = 2.3 - (i % 3) * 0.55;
    const b = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.14),
      new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.1 }),
    );
    b.position.set(SQUARE[0] + Math.cos(a) * r, y, SQUARE[1] + Math.sin(a) * r);
    g.add(b);
  });

  // ガス灯の柱（街路沿い）
  const lampPosts: Array<[number, number]> = [
    [3.4, -30],
    [-3.4, -18],
    [3.4, -8],
    [-3.4, 8],
    [3.4, 16],
    [-3.4, 26],
    [3.4, 36],
    [-14, 1.2],
    [14, 1.2],
    [26, 1.2],
    [-26, -1.8],
    [10.5, -14.5],
  ];
  for (const [x, z] of lampPosts) {
    box(g, 0.14, 3.0, 0.14, x, 1.5, z, iron);
    box(g, 0.42, 0.5, 0.42, x, 3.2, z, winWarm);
    box(g, 0.5, 0.08, 0.5, x, 3.5, z, iron);
  }

  // 鶏肉屋の露店（ぶら下がる鳥たち）と焼き栗の火鉢
  box(g, 3.0, 0.9, 2.0, POULTERER[0], 0.45, POULTERER[1], timber);
  box(g, 3.3, 0.12, 2.3, POULTERER[0], 2.1, POULTERER[1], new THREE.MeshStandardMaterial({ color: '#7d3b34', roughness: 1 }));
  [-1.0, -0.3, 0.4, 1.1].forEach((dx) => {
    box(g, 0.28, 0.55, 0.24, POULTERER[0] + dx, 1.6, POULTERER[1] - 0.6, plaster);
  });
  box(g, 0.14, 2.2, 0.14, POULTERER[0] - 1.4, 1.1, POULTERER[1] - 0.9, timber);
  box(g, 0.14, 2.2, 0.14, POULTERER[0] + 1.4, 1.1, POULTERER[1] - 0.9, timber);
  const brazier = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.4, 0.7, 10), iron);
  brazier.position.set(BRAZIER[0], 0.35, BRAZIER[1]);
  g.add(brazier);
  const ember = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 0.12, 10),
    new THREE.MeshStandardMaterial({ color: '#ff7b3d', emissive: '#ff5a1f', emissiveIntensity: 1.8 }),
  );
  ember.position.set(BRAZIER[0], 0.72, BRAZIER[1]);
  g.add(ember);

  // 教会わきの柵と物乞いの焚き口
  for (let i = 0; i < 5; i++) box(g, 0.08, 0.9, 0.08, -24.9 + i * 0.001, 0.45, 2.6 - i * 1.1, iron);
  box(g, 0.06, 0.06, 5.0, -24.9, 0.85, 0.4, iron);

  // ── 過去の街区（セピアの夢） ──
  PAST_BUILDINGS.forEach(([cx, cz, hx, hz, h], i) => {
    house(cx, cz, hx, hz, h, { sepia: true, openFront: i === 1 });
  });
  // 教室の机と小さな学者（幼いスクルージ）は People 側で。机だけここに。
  box(g, 1.0, 0.55, 0.6, SCHOOL[0], 0.45, SCHOOL[1] + 0.6, timber);
  box(g, 0.5, 0.06, 0.36, SCHOOL[0], 0.78, SCHOOL[1] + 0.6, plaster);
  // フェジウィッグの倉庫の提灯
  [[-1.6, 0], [1.6, 0], [0, -1.4]].forEach(([dx, dz]) => {
    const lan = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.4, 0.3),
      new THREE.MeshStandardMaterial({ color: '#ffd98a', emissive: '#ffc25e', emissiveIntensity: 1.6 }),
    );
    lan.position.set(FEZZIWIG[0] + dx, 2.6, FEZZIWIG[1] + dz);
    g.add(lan);
  });
  // 冬枯れの木とベルの腰掛け
  const bare = new THREE.Group();
  const bareMat = new THREE.MeshStandardMaterial({ color: '#4d4034', roughness: 1, flatShading: true });
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.34, 2.6, 6), bareMat);
  trunk.position.y = 1.3;
  bare.add(trunk);
  [[0.3, 2.2, 0.5, 0.0], [-0.4, 2.5, -0.2, 0.5], [0.1, 2.8, -0.5, -0.4]].forEach(([bx, by, bz, rz]) => {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 1.6, 5), bareMat);
    branch.position.set(bx, by, bz);
    branch.rotation.z = 0.9 + rz;
    branch.rotation.x = bz;
    bare.add(branch);
  });
  bare.position.set(BARE_TREE[0], 0, BARE_TREE[1]);
  g.add(bare);
  box(g, 1.6, 0.1, 0.5, BELLE_BENCH[0], 0.42, BELLE_BENCH[1], timber);
  box(g, 0.14, 0.42, 0.4, BELLE_BENCH[0] - 0.6, 0.21, BELLE_BENCH[1], timber);
  box(g, 0.14, 0.42, 0.4, BELLE_BENCH[0] + 0.6, 0.21, BELLE_BENCH[1], timber);

  // ── 未来の街区（鉛色の夢） ──
  FUTURE_BUILDINGS.forEach(([cx, cz, hx, hz, h], i) => {
    if (i === 0) {
      // 取引所の柱廊
      box(g, 7.0, 0.4, 2.4, EXCHANGE[0], 4.0, EXCHANGE[1], stoneDark);
      [-2.8, -0.95, 0.95, 2.8].forEach((dx) => {
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.36, 3.8, 8), stoneDark);
        col.position.set(EXCHANGE[0] + dx, 1.9, EXCHANGE[1]);
        col.castShadow = true;
        g.add(col);
      });
      box(g, 7.4, 0.5, 2.8, EXCHANGE[0], 4.45, EXCHANGE[1], stone);
    } else {
      house(cx, cz, hx, hz, h, { dark: true, openFront: true });
    }
  });
  // 火の消えた食卓と、暖炉わきの小さな松葉杖
  box(g, 2.4, 0.12, 1.2, DIM_TABLE[0], 0.7, DIM_TABLE[1], timber);
  box(g, 0.14, 0.7, 0.14, DIM_TABLE[0] - 1.0, 0.35, DIM_TABLE[1] - 0.4, timber);
  box(g, 0.14, 0.7, 0.14, DIM_TABLE[0] + 1.0, 0.35, DIM_TABLE[1] + 0.4, timber);
  box(g, 0.1, 1.1, 0.1, DIM_TABLE[0] + 1.3, 0.55, DIM_TABLE[1] - 0.9, timber, 0, 0.28);
  box(g, 0.34, 0.1, 0.1, DIM_TABLE[0] + 1.45, 1.05, DIM_TABLE[1] - 0.93, timber);
  // 名前のない墓——傾いた墓石と鉄柵
  const grave = box(g, 0.8, 1.1, 0.18, GRAVE[0], 0.55, GRAVE[1], stoneDark);
  grave.rotation.z = 0.12;
  box(g, 1.6, 0.25, 1.0, GRAVE[0], 0.12, GRAVE[1] + 0.7, stoneDark);
  for (let i = 0; i < 4; i++) box(g, 0.06, 0.7, 0.06, GRAVE[0] - 1.05 + i * 0.7, 0.35, GRAVE[1] - 0.8, iron);
  box(g, 2.3, 0.05, 0.05, GRAVE[0], 0.62, GRAVE[1] - 0.8, iron);
  // 枯れヒイラギ
  const holly = new THREE.Mesh(new THREE.IcosahedronGeometry(0.3, 0), green);
  holly.position.set(GRAVE[0] - 0.5, 0.28, GRAVE[1] + 0.55);
  g.add(holly);

  return g;
}

// ── 降りしきる雪（プレイヤーの周りを包み、世界のどこでも降る） ────
function Snowfall() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const flakes = useMemo(() => {
    const n = 550;
    const arr: Array<{ x: number; y: number; z: number; s: number }> = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 90,
        y: Math.random() * 26,
        z: (Math.random() - 0.5) * 90,
        s: 0.6 + Math.random() * 0.9,
      });
    }
    return arr;
  }, []);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    flakes.forEach((f, i) => {
      f.y -= dt * (1.1 + f.s * 0.7);
      if (f.y < 0.2) {
        f.y = 24 + Math.random() * 2;
        f.x = (Math.random() - 0.5) * 90;
        f.z = (Math.random() - 0.5) * 90;
      }
      const sway = Math.sin(t * 0.8 + i) * 0.35;
      dummy.position.set(playerPosition.x + f.x + sway, f.y, playerPosition.z + f.z);
      const sc = 0.05 * f.s;
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 550]} frustumCulled={false}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  );
}

// ── 人々（物語のフラグで現れ、消える） ─────────────────────
const PAL: Record<string, CharacterPalette> = {
  bob: { skin: '#e8c39a', shirt: '#8e9aa8', vest: '#5a6273', pants: '#3c4250', hair: '#6b5133' },
  fred: { skin: '#eec9a2', shirt: '#b8543f', vest: '#7e3b2e', pants: '#42506b', hair: '#4e3a26' },
  charity: { skin: '#e6c19c', shirt: '#4e5a70', vest: '#333d4f', pants: '#2c3442', hair: '#8a8f98' },
  lamplighter: { skin: '#dcb692', shirt: '#6a5d4d', vest: '#48413a', pants: '#3a3f4a', hair: '#3f3428' },
  carolboy: { skin: '#f0cda6', shirt: '#7d4438', vest: '#5c3129', pants: '#4a5568', hair: '#59422c' },
  chestnutman: { skin: '#dfb894', shirt: '#7a5a3d', vest: '#59422e', pants: '#413c35', hair: '#75736e' },
  poulterer: { skin: '#e9c59e', shirt: '#d9d3c6', vest: '#7d3b34', pants: '#3f4650', hair: '#4f3d2c' },
  beggar: { skin: '#d8b18d', shirt: '#5f5a50', vest: '#4b463e', pants: '#3d3a34', hair: '#6e6a62' },
  belle: { skin: '#f2d2ac', shirt: '#a8bfae', vest: '#7f9c8b', pants: '#5d6d75', hair: '#7a5a35' },
  fezziwig: { skin: '#eec49b', shirt: '#c8a44e', vest: '#8f6f2f', pants: '#4c4436', hair: '#d9d5cc' },
  boy: { skin: '#f0cda6', shirt: '#7e8aa0', vest: '#5a6478', pants: '#46506b', hair: '#59422c' },
  tim: { skin: '#f2d4ae', shirt: '#9aa8b8', vest: '#6d7a8c', pants: '#4a5568', hair: '#6b5133' },
  merchant: { skin: '#e4bd96', shirt: '#3f4655', vest: '#2e3440', pants: '#282e3a', hair: '#7d7f86' },
  joe: { skin: '#d9b28c', shirt: '#655d4e', vest: '#514a3d', pants: '#3f3b33', hair: '#8b8778' },
  husband: { skin: '#dcb18c', shirt: '#5c6657', vest: '#454e42', pants: '#39404a', hair: '#4a3a2a' },
  widow: { skin: '#e3bd97', shirt: '#54495a', vest: '#413848', pants: '#35313d', hair: '#8d8a93' },
  clock: { skin: '#ecc79f', shirt: '#6f7d99', vest: '#4e5a75', pants: '#3d4660', hair: '#3a2f22' },
};

function Figure({
  pos,
  palette,
  face = 0,
  scale = 1,
  solid = true,
}: {
  pos: [number, number];
  palette: CharacterPalette;
  face?: number;
  scale?: number;
  solid?: boolean;
}) {
  return (
    <group position={[pos[0], 0, pos[1]]} rotation={[0, face, 0]} scale={scale}>
      {solid && <Solid x={pos[0]} z={pos[1]} r={0.55 * scale} />}
      <Character palette={palette} />
    </group>
  );
}

function People() {
  const flags = useGame((s) => s.flags);
  const eve = !flags.marley; // イヴの宵——事務所の前に人がいる
  const marleyGhost = !!flags.eve_done && !flags.past_begin;
  const presentVision = !!flags.present_begin && !flags.present_done;
  const morning = !!flags.christmas_morning;

  return (
    <group>
      {/* 町の人々（いつもいる） */}
      <Figure pos={FOLK_POS.lamplighter} palette={PAL.lamplighter} face={0.6} />
      <Figure pos={FOLK_POS.carolboy} palette={PAL.carolboy} face={-0.8} scale={0.78} />
      <Figure pos={FOLK_POS.chestnutman} palette={PAL.chestnutman} face={Math.PI} />
      <Figure pos={FOLK_POS.poulterer} palette={PAL.poulterer} face={Math.PI} />
      <Figure pos={FOLK_POS.beggar} palette={PAL.beggar} face={1.4} scale={0.92} />

      {/* イヴの宵——事務所のまわり */}
      {eve && (
        <group>
          <Figure pos={[9.4, -18.5]} palette={PAL.bob} face={1.2} />
          <Figure pos={[12, -14.9]} palette={PAL.fred} face={2.6} />
          <Figure pos={[16.6, -15]} palette={PAL.charity} face={2.9} />
          <Figure pos={[17.6, -15.7]} palette={PAL.charity} face={3.2} />
        </group>
      )}

      {/* マーレイの亡霊（半透明、鎖を引きずる） */}
      {marleyGhost && <MarleyGhost />}

      {/* 三人の精霊 */}
      <SpiritPast />
      {presentVision && <SpiritPresent />}
      <SpiritFuture />
      {presentVision && (
        <group>
          <Figure pos={[-0.9, -5.2]} palette={PAL.boy} scale={0.6} face={0.4} solid={false} />
          <Figure pos={[0.6, -4.9]} palette={PAL.beggar} scale={0.58} face={-0.3} solid={false} />
        </group>
      )}

      {/* 過去の街区の住人 */}
      <Figure pos={[SCHOOL[0], SCHOOL[1] + 1.4]} palette={PAL.boy} scale={0.75} face={Math.PI} solid={false} />
      <Figure pos={[BELLE_BENCH[0], BELLE_BENCH[1] + 0.1]} palette={PAL.belle} face={0.4} solid={false} />
      <FezziwigParty />

      {/* 未来の街区の住人 */}
      <Figure pos={[EXCHANGE[0] - 1.1, EXCHANGE[1] + 0.2]} palette={PAL.merchant} face={0.7} solid={false} />
      <Figure pos={[EXCHANGE[0] + 1.2, EXCHANGE[1] + 0.1]} palette={PAL.merchant} face={-0.9} solid={false} />
      <Figure pos={[RAGSHOP[0], RAGSHOP[1] + 0.4]} palette={PAL.joe} face={Math.PI} solid={false} />

      {/* クリスマスの朝——街に人が出る */}
      {morning && (
        <group>
          <Figure pos={[7, -11]} palette={PAL.boy} scale={0.8} face={-1.2} />
          <Figure pos={[-2.5, 12]} palette={PAL.fred} face={0.8} />
          <Figure pos={[2.6, 10.5]} palette={PAL.belle} face={-0.6} />
        </group>
      )}

      {/* 期日の借り手たち——線を引かれる（片が付く）と戸口から消える */}
      {morning && !flags.debt1_done && (
        <Figure pos={[DEBTOR_POS.husband[0], DEBTOR_POS.husband[1] + 1.4]} palette={PAL.husband} face={2.4} />
      )}
      {morning && !flags.debt2_done && (
        <Figure pos={[DEBTOR_POS.widow[0], DEBTOR_POS.widow[1] + 1.5]} palette={PAL.widow} face={2.8} scale={0.94} />
      )}
      {morning && !flags.debt3_done && (
        <Figure pos={[DEBTOR_POS.clockmaker[0], DEBTOR_POS.clockmaker[1] + 1.5]} palette={PAL.clock} face={3.0} />
      )}

      {/* 温もり80——広場のツリーに聖歌隊が集まる */}
      {flags.town_glow2 && (
        <group>
          <Figure pos={[2.6, 3.9]} palette={PAL.boy} scale={0.8} face={-1.8} solid={false} />
          <Figure pos={[3.4, 2.6]} palette={PAL.belle} face={-2.2} solid={false} />
          <Figure pos={[2.2, 1.4]} palette={PAL.lamplighter} face={-2.6} solid={false} />
        </group>
      )}

      {/* 結び——クラチット家の前に、生きているティムとボブ（灰の結末では現れない） */}
      {flags.ending && !flags.end_gray && (
        <group>
          <Figure pos={[-19.2, 27.4]} palette={PAL.bob} face={2.8} />
          <Figure pos={[-20.6, 27.2]} palette={PAL.tim} scale={0.62} face={2.6} />
        </group>
      )}
    </group>
  );
}

function MarleyGhost() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = 0.25 + Math.sin(state.clock.elapsedTime * 1.4) * 0.12;
  });
  const ghostMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#a8ded6',
        emissive: '#5ba79e',
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.55,
      }),
    [],
  );
  const chainMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#8a939f', metalness: 0.5, roughness: 0.6 }),
    [],
  );
  return (
    <group position={[KNOCKER[0] + 1.2, 0, KNOCKER[1] + 1.0]}>
      <group ref={ref}>
        <mesh material={ghostMat} position={[0, 0.9, 0]}>
          <boxGeometry args={[0.55, 1.3, 0.35]} />
        </mesh>
        <mesh material={ghostMat} position={[0, 1.75, 0]}>
          <boxGeometry args={[0.34, 0.36, 0.3]} />
        </mesh>
        {/* あごに巻いた布 */}
        <mesh material={ghostMat} position={[0, 1.6, 0]}>
          <boxGeometry args={[0.4, 0.12, 0.34]} />
        </mesh>
        {/* 鎖と金庫 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} material={chainMat} position={[0.3 + i * 0.22, 0.5 - i * 0.08, 0.1 + i * 0.12]} rotation={[Math.PI / 2, i * 0.6, 0]}>
            <torusGeometry args={[0.09, 0.03, 6, 10]} />
          </mesh>
        ))}
        <mesh material={chainMat} position={[1.35, 0.16, 0.75]}>
          <boxGeometry args={[0.34, 0.26, 0.26]} />
        </mesh>
      </group>
    </group>
  );
}

function SpiritPast() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 1.6 + Math.sin(state.clock.elapsedTime * 2.2) * 0.5;
    }
  });
  return (
    <group position={[PAST_C[0], 0, PAST_C[1]]}>
      <Solid x={PAST_C[0]} z={PAST_C[1]} r={0.6} />
      <mesh position={[0, 1.0, 0]} castShadow>
        <coneGeometry args={[0.55, 2.0, 8]} />
        <meshStandardMaterial color="#f2efe4" emissive="#d8d2b8" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#fff3c4" emissive="#ffe9a0" emissiveIntensity={1.8} />
      </mesh>
      <mesh ref={ref} position={[0, 2.75, 0]}>
        <coneGeometry args={[0.12, 0.36, 6]} />
        <meshStandardMaterial color="#ffe9a0" emissive="#ffd45e" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

function SpiritPresent() {
  return (
    <group position={[1.5, 0, -6.5]}>
      <Solid x={1.5} z={-6.5} r={0.8} />
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[0.9, 2.6, 8]} />
        <meshStandardMaterial color="#2f6b3f" emissive="#1d4227" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 2.75, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.36]} />
        <meshStandardMaterial color="#e8c39a" />
      </mesh>
      {/* ヒイラギの冠と松明 */}
      <mesh position={[0, 3.0, 0]}>
        <torusGeometry args={[0.24, 0.06, 6, 10]} />
        <meshStandardMaterial color="#2c5637" />
      </mesh>
      <mesh position={[0.7, 2.1, 0.2]} rotation={[0, 0, -0.4]}>
        <coneGeometry args={[0.14, 0.5, 6]} />
        <meshStandardMaterial color="#ffb85c" emissive="#ff9a3d" emissiveIntensity={1.6} />
      </mesh>
    </group>
  );
}

function SpiritFuture() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.08;
  });
  return (
    <group position={[FUT_C[0], 0, FUT_C[1]]}>
      <Solid x={FUT_C[0]} z={FUT_C[1]} r={0.7} />
      <group ref={ref}>
        <mesh position={[0, 1.35, 0]} castShadow>
          <coneGeometry args={[0.75, 2.7, 8]} />
          <meshStandardMaterial color="#14161c" roughness={1} />
        </mesh>
        {/* フードの奥の虚ろ */}
        <mesh position={[0, 2.35, 0.28]}>
          <boxGeometry args={[0.34, 0.4, 0.1]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        {/* 指さす腕 */}
        <mesh position={[0.55, 1.9, 0.3]} rotation={[0, 0, -1.1]}>
          <boxGeometry args={[0.7, 0.14, 0.14]} />
          <meshStandardMaterial color="#14161c" roughness={1} />
        </mesh>
      </group>
    </group>
  );
}

// フェジウィッグの舞踏会——倉庫の中で踊りつづける人影
function FezziwigParty() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.7;
  });
  return (
    <group position={[FEZZIWIG[0], 0, FEZZIWIG[1] - 0.6]}>
      <group ref={ref}>
        <group position={[1.1, 0, 0]}>
          <Character palette={PAL.fezziwig} />
        </group>
        <group position={[-1.1, 0, 0]} rotation={[0, Math.PI, 0]}>
          <Character palette={PAL.belle} />
        </group>
        <group position={[0, 0, 1.1]} rotation={[0, Math.PI / 2, 0]}>
          <Character palette={PAL.boy} />
        </group>
        <group position={[0, 0, -1.1]} rotation={[0, -Math.PI / 2, 0]}>
          <Character palette={PAL.carolboy} />
        </group>
      </group>
    </group>
  );
}

// ── 言葉の欠片（光る紙片）。拾われる（フラグが立つ）と消える ──
const PAPERS: ReadonlyArray<{ flag: string; pos: [number, number] }> = [
  { flag: 'cq1', pos: [10, -13.5] },
  { flag: 'cq2', pos: [2.5, 3.5] },
  { flag: 'cq3', pos: [-24.4, 12.5] },
  { flag: 'cq4', pos: [-16, 26] },
  { flag: 'cq5', pos: [16.5, 11.8] },
  { flag: 'cq6', pos: [-122, 14.5] },
  { flag: 'cq7', pos: [126, 13.4] },
];

function QuotePapers() {
  const flags = useGame((s) => s.flags);
  return (
    <group>
      {PAPERS.filter((p) => !flags[p.flag]).map((p) => (
        <Paper key={p.flag} x={p.pos[0]} z={p.pos[1]} />
      ))}
    </group>
  );
}

function Paper({ x, z }: { x: number; z: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.position.y = 0.7 + Math.sin(t * 1.7 + x) * 0.14;
      ref.current.rotation.y = t * 0.9;
    }
  });
  return (
    <group position={[x, 0, z]}>
      <group ref={ref}>
        <mesh>
          <boxGeometry args={[0.34, 0.02, 0.46]} />
          <meshStandardMaterial color="#fdf6dd" emissive="#e8d88a" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <octahedronGeometry args={[0.09, 0]} />
          <meshStandardMaterial color="#ffe9a0" emissive="#ffd45e" emissiveIntensity={2.0} />
        </mesh>
      </group>
    </group>
  );
}

// ── 温もりの残高で、街の見え方が変わる ─────────────────────
// warmth 45（town_glow1）: 家々の窓に灯がともる。80（town_glow2）: ツリーが輝きを増す。
function WarmthGlow() {
  const flags = useGame((s) => s.flags);
  if (!flags.town_glow1) return null;
  return (
    <group>
      {/* 灯り始めた窓——既存の窓の上に、ひとまわり明るい光の板を重ねる */}
      {BUILDINGS.map(([cx, cz, hx, hz], i) => {
        const face = cx < 0 ? 1 : -1;
        const fx = cx + face * hx;
        return (
          <group key={i}>
            <mesh position={[fx + face * 0.14, 1.7, cz - hz * 0.55]}>
              <boxGeometry args={[0.08, 0.9, 0.78]} />
              <meshStandardMaterial color="#ffd98a" emissive="#ffc25e" emissiveIntensity={2.2} />
            </mesh>
            <mesh position={[fx + face * 0.14, 1.7, cz + hz * 0.55]}>
              <boxGeometry args={[0.08, 0.9, 0.78]} />
              <meshStandardMaterial color="#ffd98a" emissive="#ffc25e" emissiveIntensity={2.2} />
            </mesh>
          </group>
        );
      })}
      <pointLight position={[-14, 3, -5]} intensity={10} distance={14} color="#ffc25e" />
      <pointLight position={[10, 3, 20]} intensity={10} distance={14} color="#ffc25e" />
      {flags.town_glow2 && (
        <group>
          <pointLight position={[SQUARE[0], 5, SQUARE[1]]} intensity={30} distance={26} color="#ffe28a" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2;
            return (
              <mesh
                key={i}
                position={[SQUARE[0] + Math.cos(a) * 1.9, 2.1, SQUARE[1] + Math.sin(a) * 1.9]}
              >
                <icosahedronGeometry args={[0.12, 0]} />
                <meshStandardMaterial color="#ffe9a0" emissive="#ffd45e" emissiveIntensity={2.4} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

// ── 夜を灯すポイントライト（数は絞る：性能のため） ────────────
function NightLamps() {
  return (
    <group>
      <pointLight position={[SQUARE[0], 4.4, SQUARE[1]]} intensity={26} distance={22} color="#ffd98a" />
      <pointLight position={[10.5, 3.4, -14.5]} intensity={16} distance={16} color="#ffb96a" />
      <pointLight position={[-14, 3.4, 1.2]} intensity={14} distance={15} color="#ffb96a" />
      <pointLight position={[14, 3.4, 1.2]} intensity={14} distance={15} color="#ffb96a" />
      <pointLight position={[BRAZIER[0], 1.2, BRAZIER[1]]} intensity={10} distance={8} color="#ff8a4d" />
      {/* 過去の街区は暖かなセピア、未来の街区は冷えた青 */}
      <pointLight position={[FEZZIWIG[0], 3.0, FEZZIWIG[1]]} intensity={22} distance={18} color="#ffc25e" />
      <pointLight position={[PAST_C[0], 3.4, PAST_C[1]]} intensity={10} distance={14} color="#ffe9a0" />
      <pointLight position={[FUT_C[0], 4.0, FUT_C[1]]} intensity={9} distance={20} color="#5a6f9e" />
      <pointLight position={[GRAVE[0], 2.0, GRAVE[1]]} intensity={5} distance={9} color="#4a5f8e" />
    </group>
  );
}
