import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Solid } from '../../../engine/Solid';
import { Character, CharacterPalette } from '../../../engine/Character';
import { useGame } from '../../../engine/store/gameStore';
import {
  HOUSES,
  TAVERN_INDEX,
  STALLS,
  SQUARE,
  TOWN_POS,
  WILLOW,
  BROOK_X,
  BROOK_BRIDGE_Z,
  GARDEN_RECT,
} from '../layout';

// Layer 3: エルシノア城下（大改修）。南門の先の町・市場・酒場「錨亭」・
// 港の桟橋・オフィーリアの庭・海峡——すべてプロシージャル生成。
// 家並みの当たり判定は layout.ts の HOUSES/TOWN_BLOCKERS と同じデータから描く。

const PLASTERS = ['#cfc4ae', '#c4b8a4', '#d6c9b0'];
const ROOFS = ['#7a4030', '#5a4a5e', '#6b4a34'];
const TIMBER = '#4a3a2a';
const WOOD = '#5f4a32';
const STONE = '#5b616d';

export function TownDistrict() {
  return (
    <group>
      <GroundAndSea />
      <Statics />
      <GardenLife />
      <TownPeople />
      <QuotePapers />
      <TownLights />
    </group>
  );
}

// ── 大地と海峡 ─────────────────────────────────────────
function GroundAndSea() {
  const sea = useRef<THREE.Mesh>(null!);
  const seaGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(560, 560, 46, 46);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const base = useMemo(() => Float32Array.from(seaGeo.attributes.position.array), [seaGeo]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = sea.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const z = base[i * 3 + 2];
      pos.setY(i, Math.sin(x * 0.05 + t * 0.9) * 0.14 + Math.sin(z * 0.06 + t * 0.6) * 0.12);
    }
    pos.needsUpdate = true;
  });

  const pads = useMemo(() => {
    const g = new THREE.Group();
    const cliff = new THREE.MeshStandardMaterial({ color: '#37342e', roughness: 1, flatShading: true });
    const pad = (cx: number, cz: number, w: number, d: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 1.75, d), cliff);
      m.position.set(cx, -0.92, cz); // 上面 y≈-0.045（地表カバーの下）
      g.add(m);
    };
    pad(0, 0, 92, 92); // 城の岬
    pad(0, 65, 60, 62); // 町
    pad(-42, 59, 36, 42); // 庭
    pad(42, 78, 36, 44); // 港

    const cover = (
      cx: number,
      cz: number,
      w: number,
      d: number,
      color: string,
      y: number,
    ) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, 0.08, d),
        new THREE.MeshStandardMaterial({ color, roughness: 1, flatShading: true }),
      );
      m.position.set(cx, y, cz);
      m.receiveShadow = true;
      g.add(m);
    };
    // 城壁まわりの草地（南は門前を空ける）
    cover(0, -41, 92, 10, '#46543e', 0.01);
    cover(-41, 0, 10, 92, '#46543e', 0.01);
    cover(41, 0, 10, 92, '#46543e', 0.01);
    cover(-26.75, 41, 38.5, 10, '#46543e', 0.01);
    cover(26.75, 41, 38.5, 10, '#46543e', 0.01);
    // 町の地面（土）と大通りの石畳
    cover(0, 65, 60, 62, '#5c5346', 0.012);
    cover(0, 63, 7, 58, '#6a6e74', 0.045);
    // 庭の草地・港の土
    cover(-42, 59, 36, 42, '#4c6b3c', 0.02);
    cover(42, 78, 36, 44, '#6b5b45', 0.02);

    // 広場の石畳（円形）
    const plaza = new THREE.Mesh(
      new THREE.CylinderGeometry(11, 11, 0.08, 18),
      new THREE.MeshStandardMaterial({ color: '#70747a', roughness: 1, flatShading: true }),
    );
    plaza.position.set(SQUARE[0], 0.05, SQUARE[1]);
    plaza.receiveShadow = true;
    g.add(plaza);

    // オフィーリアの小川（庭の西を南へ流れ、崖から海峡へ落ちる）
    const bx = (BROOK_X[0] + BROOK_X[1]) / 2;
    const bw = BROOK_X[1] - BROOK_X[0];
    const bz1 = GARDEN_RECT[1] - 2;
    const bz2 = GARDEN_RECT[3] + 4;
    const water = new THREE.Mesh(
      new THREE.BoxGeometry(bw, 0.06, bz2 - bz1),
      new THREE.MeshStandardMaterial({
        color: '#3f6f8e',
        roughness: 0.35,
        metalness: 0.1,
        flatShading: true,
      }),
    );
    water.position.set(bx, 0.03, (bz1 + bz2) / 2);
    g.add(water);
    for (const side of [-1, 1]) {
      const bank = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.1, bz2 - bz1),
        new THREE.MeshStandardMaterial({ color: '#3a4a35', roughness: 1, flatShading: true }),
      );
      bank.position.set(bx + side * (bw / 2 + 0.2), 0.05, (bz1 + bz2) / 2);
      g.add(bank);
    }
    // 板橋
    const bridgeZ = (BROOK_BRIDGE_Z[0] + BROOK_BRIDGE_Z[1]) / 2;
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(bw + 1.4, 0.14, 2.6),
      new THREE.MeshStandardMaterial({ color: WOOD, roughness: 0.9, flatShading: true }),
    );
    deck.position.set(bx, 0.12, bridgeZ);
    deck.castShadow = true;
    g.add(deck);
    for (const side of [-1, 1]) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(bw + 1.4, 0.1, 0.1),
        new THREE.MeshStandardMaterial({ color: TIMBER, roughness: 1, flatShading: true }),
      );
      rail.position.set(bx, 0.75, bridgeZ + side * 1.2);
      g.add(rail);
    }
    return g;
  }, []);

  return (
    <group>
      <primitive object={pads} />
      <mesh ref={sea} geometry={seaGeo} position={[0, -1.0, 30]}>
        <meshStandardMaterial
          color="#28536e"
          transparent
          opacity={0.85}
          roughness={0.35}
          metalness={0.05}
          flatShading
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 30]}>
        <planeGeometry args={[560, 560]} />
        <meshStandardMaterial color="#122c3d" roughness={1} />
      </mesh>
    </group>
  );
}

// ── 静的な建築群（家並み・井戸・露店・桟橋・稽古の的・腰掛け） ──────
function Statics() {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const mat = (color: string, rough = 1) =>
      new THREE.MeshStandardMaterial({ color, roughness: rough, flatShading: true });
    const box = (
      w: number,
      h: number,
      d: number,
      m: THREE.Material,
      pos: [number, number, number],
      shadow = false,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
      mesh.position.set(...pos);
      if (shadow) mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    };
    const timberM = mat(TIMBER);
    const woodM = mat(WOOD, 0.9);
    const stoneM = mat(STONE);
    const glowM = new THREE.MeshStandardMaterial({
      color: '#ffd98a',
      emissive: '#ffb85a',
      emissiveIntensity: 1.5,
      flatShading: true,
    });

    // ── 家並み（HOUSES と同じデータから） ──
    HOUSES.forEach(([cx, cz, hx, hz, h], i) => {
      const plaster = mat(PLASTERS[i % PLASTERS.length]);
      const roofM = mat(ROOFS[i % ROOFS.length], 0.9);
      // 母屋
      box(hx * 2, h, hz * 2, plaster, [cx, h / 2, cz], true);
      // 四隅の柱
      for (const sx of [-1, 1])
        for (const sz of [-1, 1])
          box(0.2, h, 0.2, timberM, [cx + sx * (hx - 0.1), h / 2, cz + sz * (hz - 0.1)]);
      // 中段の梁
      box(hx * 2 + 0.05, 0.16, hz * 2 + 0.05, timberM, [cx, h * 0.55, cz]);
      // 切妻屋根（棟はx方向）
      const roofH = 1.15 + (i % 3) * 0.2;
      const ang = Math.atan2(roofH, hz);
      const slope = Math.hypot(hz, roofH);
      for (const sz of [-1, 1]) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(hx * 2 + 0.7, 0.14, slope + 0.25), roofM);
        s.position.set(cx, h + roofH / 2, cz + (sz * hz) / 2);
        s.rotation.x = sz * ang;
        s.castShadow = true;
        g.add(s);
      }
      // 屋根裏（切妻の穴ふさぎ）
      box(hx * 2 - 0.25, roofH - 0.1, hz * 2 - 0.5, plaster, [cx, h + (roofH - 0.1) / 2 - 0.02, cz]);
      // 通りに向く面（西側の家は東向き、東側の家は西向き）
      const face = cx < 0 ? 1 : -1;
      const fx = cx + face * (hx + 0.04);
      // 扉と窓（窓明かりは夜の町の命）
      box(0.12, 1.5, 0.95, timberM, [fx, 0.75, cz + 0.2]);
      box(0.08, 0.62, 0.55, glowM, [fx, 1.55, cz - hz * 0.5]);
      box(0.08, 0.62, 0.55, glowM, [fx, 1.55, cz + hz * 0.55 + 0.2]);
      // 煙突（家ごとに気まぐれ）
      if (i % 2 === 0) box(0.5, 1.4, 0.5, stoneM, [cx - hx * 0.4, h + roofH + 0.4, cz], true);

      // 錨亭：吊り看板と樽
      if (i === TAVERN_INDEX) {
        box(0.14, 1.1, 0.14, timberM, [fx + 0.55, 2.9, cz + 1.6]); // 腕木の支柱
        box(0.9, 0.12, 0.12, timberM, [fx + 0.28, 3.4, cz + 1.6]);
        const board = box(0.06, 0.75, 0.95, mat('#2e3a4a'), [fx + 0.6, 2.75, cz + 1.6], true);
        board.rotation.x = 0.03;
        // 錨のかたち（白）
        const anchor = mat('#e8e4d8');
        box(0.08, 0.5, 0.08, anchor, [fx + 0.63, 2.78, cz + 1.6]);
        box(0.08, 0.08, 0.5, anchor, [fx + 0.63, 2.6, cz + 1.6]);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.03, 6, 10), anchor);
        ring.position.set(fx + 0.63, 3.02, cz + 1.6);
        ring.rotation.y = Math.PI / 2;
        g.add(ring);
        for (const dz of [-2.2, -1.5]) box(0.8, 0.9, 0.8, woodM, [fx + 0.5, 0.45, cz + dz], true);
      }
    });

    // ── 井戸（広場の中心） ──
    const [wx, wz] = SQUARE;
    const ringOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.35, 0.85, 10), stoneM);
    ringOuter.position.set(wx, 0.42, wz);
    ringOuter.castShadow = true;
    g.add(ringOuter);
    const ringInner = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.9, 10), mat('#1c2530'));
    ringInner.position.set(wx, 0.48, wz);
    g.add(ringInner);
    box(0.16, 2.0, 0.16, woodM, [wx - 1.05, 1.0, wz], true);
    box(0.16, 2.0, 0.16, woodM, [wx + 1.05, 1.0, wz], true);
    box(2.6, 0.14, 0.14, woodM, [wx, 2.0, wz]);
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.9, 5), mat('#b0a080'));
    rope.position.set(wx, 1.55, wz);
    g.add(rope);
    box(0.4, 0.35, 0.4, woodM, [wx, 1.05, wz]);

    // ── 市場の露店 ──
    STALLS.forEach(([sx, sz], i) => {
      for (const dx of [-1.3, 1.3])
        for (const dz of [-0.8, 0.8]) box(0.14, 2.1, 0.14, timberM, [sx + dx, 1.05, sz + dz]);
      const awn = new THREE.Mesh(
        new THREE.BoxGeometry(3.1, 0.1, 2.3),
        mat(i === 0 ? '#a34d3f' : '#3f6b5e', 0.9),
      );
      awn.position.set(sx, 2.2, sz - 0.15);
      awn.rotation.x = -0.18;
      awn.castShadow = true;
      g.add(awn);
      box(2.8, 0.75, 1.6, woodM, [sx, 0.38, sz], true);
      // 売り物（布袋と果実）
      box(0.5, 0.4, 0.5, mat('#c0a060'), [sx - 0.8, 0.95, sz]);
      box(0.5, 0.35, 0.5, mat('#8a4a3a'), [sx + 0.1, 0.93, sz + 0.2]);
      const fruit = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), mat('#b03a2a'));
      fruit.position.set(sx + 0.8, 0.85, sz - 0.2);
      g.add(fruit);
    });

    // ── 港：桟橋・舫い舟・樽と木箱・網干し ──
    // 桟橋（z=96..106、幅5）：張り板と杭
    for (let z = 96.4; z <= 105.8; z += 0.85) {
      const plank = box(4.6, 0.12, 0.72, woodM, [39, 0.06, z]);
      plank.castShadow = true;
    }
    for (const dx of [-2.0, 2.0])
      box(0.28, 0.2, 10.4, timberM, [39 + dx, -0.08, 101]);
    for (const dz of [97, 100, 103, 105.6])
      for (const dx of [-2.1, 2.1]) {
        const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 1.7, 6), timberM);
        pile.position.set(39 + dx, -0.7, dz);
        g.add(pile);
      }
    box(0.35, 0.7, 0.35, timberM, [40.9, 0.4, 105.2], true); // 舫い杭
    // 舫い舟
    const boat = new THREE.Group();
    const hullM = mat('#4a3a28', 0.85);
    const hull = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.7, 4.2), hullM);
    hull.position.y = -0.1;
    boat.add(hull);
    for (const side of [-1, 1]) {
      const wale = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.45, 4.3), mat('#5f4a32'));
      wale.position.set(side * 0.85, 0.12, 0);
      wale.rotation.z = side * -0.12;
      boat.add(wale);
    }
    const bow = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.1, 4), hullM);
    bow.rotation.x = -Math.PI / 2;
    bow.rotation.y = Math.PI / 4;
    bow.position.set(0, -0.05, 2.6);
    boat.add(bow);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.4, 6), timberM);
    mast.position.y = 1.7;
    boat.add(mast);
    const furl = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 2.4), mat('#d8d2c0', 0.9));
    furl.position.y = 2.9;
    furl.rotation.y = Math.PI / 2;
    boat.add(furl);
    boat.position.set(44.5, -0.55, 101.5);
    boat.rotation.y = 0.25;
    g.add(boat);
    // 樽と木箱
    const barrelM = mat('#6b4a2e', 0.85);
    for (const [bx2, bz2] of [
      [29, 89],
      [30.4, 90.2],
      [29.6, 91.6],
      [37, 94.6],
    ]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.95, 8), barrelM);
      b.position.set(bx2, 0.48, bz2);
      b.castShadow = true;
      g.add(b);
    }
    box(1.0, 1.0, 1.0, woodM, [33, 0.5, 92.4], true);
    box(0.8, 0.8, 0.8, woodM, [34.1, 0.4, 91.2], true);
    box(0.8, 0.8, 0.8, woodM, [33.4, 1.4, 92.2], true);
    // 網干し
    box(0.14, 1.8, 0.14, timberM, [46, 0.9, 90]);
    box(0.14, 1.8, 0.14, timberM, [50, 0.9, 90]);
    box(4.2, 0.1, 0.1, timberM, [48, 1.75, 90]);
    const net = new THREE.Mesh(
      new THREE.PlaneGeometry(3.8, 1.4),
      new THREE.MeshStandardMaterial({
        color: '#3a4438',
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      }),
    );
    net.position.set(48, 1.0, 90);
    g.add(net);

    // ── 沖の帆影（遠景） ──
    for (const [sx, sz, ry] of [
      [66, 114, 0.4],
      [-70, 96, -0.5],
      [12, 128, 0.1],
    ]) {
      const ship = new THREE.Group();
      const sh = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 1.3), mat('#2e2a24'));
      ship.add(sh);
      const sm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.4, 5), timberM);
      sm.position.y = 1.9;
      ship.add(sm);
      const sail = new THREE.Mesh(
        new THREE.PlaneGeometry(1.9, 2.2),
        new THREE.MeshStandardMaterial({ color: '#d9d4c6', side: THREE.DoubleSide, roughness: 0.9 }),
      );
      sail.position.set(0, 2.0, 0.02);
      ship.add(sail);
      ship.position.set(sx, -0.5, sz);
      ship.rotation.y = ry;
      g.add(ship);
    }

    // ── 城内の新設小物：剣の稽古の的（南門の内側） ──
    box(0.18, 1.9, 0.18, timberM, [10, 0.95, 26.5], true);
    box(1.5, 0.14, 0.14, timberM, [10, 1.55, 26.5]);
    const straw = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.4, 0.9, 7), mat('#b09a5a', 0.95));
    straw.position.set(10, 1.15, 26.5);
    g.add(straw);
    const strawHead = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), mat('#c0aa66', 0.95));
    strawHead.position.set(10, 1.85, 26.5);
    g.add(strawHead);
    const targe = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.08, 10), mat('#7a2a20', 0.8));
    targe.position.set(10.78, 1.55, 26.5);
    targe.rotation.z = Math.PI / 2;
    g.add(targe);

    // ── 城内の新設小物：回廊の書見の腰掛け ──
    box(1.9, 0.14, 0.6, woodM, [-28.5, 0.55, 1], true);
    for (const dx of [-0.8, 0.8]) box(0.14, 0.55, 0.5, woodM, [-28.5 + dx, 0.27, 1]);
    box(1.9, 0.6, 0.12, woodM, [-28.5, 0.95, 0.72]);
    const bookL = box(0.3, 0.04, 0.42, mat('#e8e2d0', 0.9), [-28.65, 0.66, 1.05]);
    bookL.rotation.z = 0.16;
    const bookR = box(0.3, 0.04, 0.42, mat('#efe9d8', 0.9), [-28.35, 0.66, 1.05]);
    bookR.rotation.z = -0.16;

    // ── 門前の衛兵の矛（立てかけ） ──
    const hal = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 2.6, 5), timberM);
    hal.add(pole);
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.5, 4), mat('#b8c0cc', 0.3));
    blade.position.y = 1.5;
    hal.add(blade);
    hal.position.set(5.1, 1.3, 37.6);
    hal.rotation.z = 0.12;
    g.add(hal);

    return g;
  }, []);

  return <primitive object={group} />;
}

// ── オフィーリアの庭：柳・花畑・木立・（供えた後の）花冠 ─────────
function GardenLife() {
  const wreathDone = useGame((s) => !!s.flags.wreath_done);

  const group = useMemo(() => {
    const g = new THREE.Group();
    const mat = (color: string, rough = 1) =>
      new THREE.MeshStandardMaterial({ color, roughness: rough, flatShading: true });

    // 柳（小川へ斜めに枝垂れる）
    const [wx, wz] = WILLOW;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 3.4, 7), mat('#4a3c2c'));
    trunk.position.set(wx, 1.7, wz);
    trunk.rotation.z = -0.16; // 西の小川へ傾く
    trunk.castShadow = true;
    g.add(trunk);
    const canopyM = mat('#7da26a');
    for (const [dx, dy, dz, s] of [
      [-0.8, 3.6, 0, 1.5],
      [0.3, 3.3, 0.8, 1.1],
      [0.1, 3.4, -0.9, 1.0],
    ]) {
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(s, 0), canopyM);
      c.position.set(wx + dx, dy, wz + dz);
      c.castShadow = true;
      g.add(c);
    }
    // 枝垂れ（細い簾）
    const strandM = mat('#8fb07a');
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const r = 1.3 + (i % 3) * 0.3;
      const len = 1.6 + ((i * 7) % 4) * 0.35;
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, len, 4), strandM);
      s.position.set(wx - 0.6 + Math.cos(a) * r, 3.1 - len / 2, wz + Math.sin(a) * r);
      g.add(s);
    }

    // 庭の木立
    for (const [tx, tz] of [
      [-30, 47],
      [-28, 70],
      [-47.5, 45],
      [-33, 73],
    ]) {
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.24, 1.7, 5), mat('#5a4632'));
      t.position.set(tx, 0.85, tz);
      t.castShadow = true;
      g.add(t);
      const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 0), mat('#5e8250'));
      c.position.set(tx, 2.2, tz);
      c.castShadow = true;
      g.add(c);
    }

    // 花畑（採れる5つの花の場所＋彩りの2つ）
    const beds: [number, number][] = [
      [-38, 50],
      [-33, 64],
      [-45, 68],
      [-54.5, 52],
      [-15.5, 26.5], // 墓地のひなぎく
      [-36, 54],
      [-41, 63.5],
    ];
    const colors = ['#e8e6ee', '#9a6ab8', '#e2c84a', '#d87a9a', '#f0f0e0', '#7a9ae0'];
    const heads: { x: number; z: number; c: string }[] = [];
    beds.forEach(([bx, bz], bi) => {
      const n = 11 + (bi % 3) * 3;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + bi;
        const r = 0.4 + ((i * 13) % 10) * 0.14;
        heads.push({
          x: bx + Math.cos(a) * r,
          z: bz + Math.sin(a) * r * 0.8,
          c: colors[(i + bi) % colors.length],
        });
      }
    });
    const stemGeo = new THREE.ConeGeometry(0.05, 0.4, 4);
    const stemM = mat('#4c7040');
    const stems = new THREE.InstancedMesh(stemGeo, stemM, heads.length);
    const headGeo = new THREE.IcosahedronGeometry(0.1, 0);
    const headM = new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 });
    const headMesh = new THREE.InstancedMesh(headGeo, headM, heads.length);
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    heads.forEach((h, i) => {
      dummy.position.set(h.x, 0.22, h.z);
      dummy.rotation.set(0, i, 0);
      dummy.updateMatrix();
      stems.setMatrixAt(i, dummy.matrix);
      dummy.position.y = 0.44;
      dummy.updateMatrix();
      headMesh.setMatrixAt(i, dummy.matrix);
      headMesh.setColorAt(i, col.set(h.c));
    });
    headMesh.instanceColor!.needsUpdate = true;
    g.add(stems, headMesh);

    return g;
  }, []);

  return (
    <group>
      <primitive object={group} />
      <Solid x={WILLOW[0]} z={WILLOW[1]} r={1.0} />
      <Solid x={-30} z={47} r={0.5} />
      <Solid x={-28} z={70} r={0.5} />
      <Solid x={-47.5} z={45} r={0.5} />
      <Solid x={-33} z={73} r={0.5} />
      {/* 供えられた花冠（sq_flowers 達成後、柳の枝に掛かる） */}
      {wreathDone && (
        <group position={[WILLOW[0] - 0.9, 2.35, WILLOW[1] + 0.7]} rotation={[0.5, 0.2, 0.15]}>
          <mesh>
            <torusGeometry args={[0.42, 0.09, 6, 12]} />
            <meshStandardMaterial color="#8faa6a" roughness={0.9} flatShading />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = (i / 5) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.42, Math.sin(a) * 0.42, 0.06]}>
                <icosahedronGeometry args={[0.09, 0]} />
                <meshStandardMaterial
                  color={['#e8e6ee', '#9a6ab8', '#e2c84a', '#d87a9a', '#f0f0e0'][i]}
                  roughness={0.9}
                  flatShading
                />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}

// ── 町の人々 ───────────────────────────────────────────
const TOWN_PAL = {
  bernardo: { skin: '#d9a878', shirt: '#4a4f5a', vest: '#6a3f2a', pants: '#2c2f38', hair: '#3a2a1c' },
  merchant: { skin: '#dcae82', shirt: '#7a5a2a', vest: '#a3702e', pants: '#4a3a22', hair: '#5a4028' },
  hostess: { skin: '#ecc19b', shirt: '#7a3a4a', vest: '#e8e2d4', pants: '#5a2a36', hair: '#8a5a30' },
  fisher: { skin: '#cfa070', shirt: '#3a5a5e', vest: '#2c4448', pants: '#33301f', hair: '#c8c2b4' },
  ophelia: { skin: '#f0d4b6', shirt: '#c5d3e8', vest: '#e6eef7', pants: '#aebfd6', hair: '#c9a24e' },
} satisfies Record<string, CharacterPalette>;

function TownFigure({
  position,
  palette,
  facing,
  scale = 1,
}: {
  position: [number, number];
  palette: CharacterPalette;
  facing?: number;
  scale?: number;
}) {
  const [x, z] = position;
  const ry = facing ?? Math.atan2(-x, -z);
  return (
    <>
      <Solid x={x} z={z} r={0.55 * scale} />
      <group position={[x, 0, z]} rotation={[0, ry, 0]} scale={scale}>
        <Character palette={palette} />
      </group>
    </>
  );
}

function TownPeople() {
  const flags = useGame((s) => s.flags);
  // 狂乱のオフィーリア：父の死後、庭をさまよう（墓地の場までのあいだ）
  const madOphelia = !!flags.polonius_dead && !flags.yorick;
  return (
    <group>
      <TownFigure
        position={TOWN_POS.bernardo}
        palette={TOWN_PAL.bernardo}
        scale={1.06}
        facing={Math.PI + 0.5}
      />
      <TownFigure position={TOWN_POS.merchant} palette={TOWN_PAL.merchant} facing={-2.2} />
      <TownFigure position={TOWN_POS.hostess} palette={TOWN_PAL.hostess} facing={1.4} />
      <TownFigure position={TOWN_POS.fisher} palette={TOWN_PAL.fisher} scale={1.02} facing={Math.PI} />
      {madOphelia && (
        <TownFigure position={TOWN_POS.madOphelia} palette={TOWN_PAL.ophelia} facing={-0.9} />
      )}
    </group>
  );
}

// ── 台詞の欠片（光る紙片、拾うと消える） ──────────────────
const PAPERS: { flag: string; pos: [number, number] }[] = [
  { flag: 'paper_joint', pos: [3, -28] },
  { flag: 'paper_frailty', pos: [-28, 12] },
  { flag: 'paper_brevity', pos: [8.5, -10] },
  { flag: 'paper_prison', pos: [0, 39.5] },
  { flag: 'paper_mirror', pos: [25.5, 0.5] },
  { flag: 'paper_sparrow', pos: [-44.5, 55.8] },
  { flag: 'paper_true', pos: [39, 105] },
];

function QuotePapers() {
  const flags = useGame((s) => s.flags);
  const refs = useRef<(THREE.Group | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((r, i) => {
      if (!r) return;
      r.position.y = 0.75 + Math.sin(t * 1.8 + i * 1.3) * 0.14;
      r.rotation.y = t * 0.9 + i;
    });
  });
  return (
    <group>
      {PAPERS.map((p, i) =>
        flags[p.flag] ? null : (
          <group
            key={p.flag}
            position={[p.pos[0], 0.75, p.pos[1]]}
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            <mesh rotation={[0.5, 0, 0.2]}>
              <boxGeometry args={[0.34, 0.02, 0.46]} />
              <meshStandardMaterial
                color="#f4ecd2"
                emissive="#ffe9a3"
                emissiveIntensity={1.1}
                flatShading
              />
            </mesh>
            <mesh position={[0, 0.32, 0]}>
              <octahedronGeometry args={[0.1, 0]} />
              <meshStandardMaterial
                color="#ffe9a3"
                emissive="#ffd76a"
                emissiveIntensity={2.4}
                flatShading
              />
            </mesh>
          </group>
        ),
      )}
    </group>
  );
}

// ── 町の灯（提灯柱と控えめな光源） ──────────────────────
const LAMP_POSTS: [number, number][] = [
  [3.4, 44],
  [-3.4, 52],
  [3.4, 58],
  [-3.4, 68],
  [3.4, 74],
  [-3.4, 86],
  [8, 65.5],
  [-8, 58.5],
  [37.4, 96.5],
  [-49.5, 61.8],
];

function TownLights() {
  return (
    <group>
      {LAMP_POSTS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.25, 0]}>
            <boxGeometry args={[0.14, 2.5, 0.14]} />
            <meshStandardMaterial color="#2c241a" flatShading />
          </mesh>
          <mesh position={[0, 2.42, 0]}>
            <boxGeometry args={[0.3, 0.4, 0.3]} />
            <meshStandardMaterial
              color="#ffd98a"
              emissive="#ffb85a"
              emissiveIntensity={1.7}
              flatShading
            />
          </mesh>
          <mesh position={[0, 2.68, 0]}>
            <coneGeometry args={[0.28, 0.18, 4]} />
            <meshStandardMaterial color="#2c241a" flatShading />
          </mesh>
        </group>
      ))}
      {/* 光源は絞って配置（性能のため） */}
      <pointLight position={[0, 3.2, 46]} color="#ffb96a" intensity={4.5} distance={16} decay={1.7} />
      <pointLight position={[0, 3.4, 62]} color="#ffb96a" intensity={5.5} distance={20} decay={1.7} />
      <pointLight position={[-9.7, 3.0, 64.5]} color="#ffc27a" intensity={4.5} distance={14} decay={1.7} />
      <pointLight position={[39, 3.0, 97]} color="#ffb96a" intensity={4.5} distance={16} decay={1.7} />
    </group>
  );
}
