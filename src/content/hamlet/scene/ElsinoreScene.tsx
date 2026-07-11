import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { setGround } from '../../../engine/ground';
import { Solid } from '../../../engine/Solid';
import { Character, CharacterPalette } from '../../../engine/Character';
import { useGame } from '../../../engine/store/gameStore';
import {
  elsinoreHeight,
  elsinoreWalkable,
  WALL,
  WALL_H,
  GATE_HALF,
  TOWER,
  POS,
  STAGE,
  CHAPEL,
  GRAVEYARD,
  CLOSET,
  THRONE,
} from '../layout';
import { TownDistrict } from './TownDistrict';

// Layer 3: ハムレットの舞台「エルシノア城（クロンボー城）」の中庭。
// 石壁・四隅の塔・松明・玉座・旅役者の舞台・回廊・礼拝堂・墓地——すべてプロシージャル生成。
// NPC は物語のフラグに応じて現れたり消えたりする。

export function ElsinoreScene() {
  useEffect(() => {
    setGround({ heightAt: elsinoreHeight, isWalkable: elsinoreWalkable });
  }, []);

  return (
    <group>
      {/* エルシノアの月あかり。物語は真夜中に始まり、暮らしの営みとともに日が巡る。
          World の昼夜に、青く沈んだ補助光を重ね、石壁と塔の陰翳を立ち上がらせる。
          夜は松明と城下の提灯が生き、昼は海峡の光が射す——ハムレットの陰鬱と両立する明度に。 */}
      <ambientLight intensity={0.42} color="#46527a" />
      <directionalLight position={[34, 54, 26]} intensity={0.4} color="#9fb4ff" />
      <CastleShell />
      <Torches />
      <People />
      <Foils />
      <TownDistrict />
    </group>
  );
}

// ── 静的な石造りの城（重い形状はまとめて一度だけ組む） ─────────────
function CastleShell() {
  const group = useMemo(() => build(), []);
  return <primitive object={group} />;
}

function build(): THREE.Group {
  const g = new THREE.Group();

  const stone = new THREE.MeshStandardMaterial({ color: '#4c525e', roughness: 1, flatShading: true });
  const stoneLite = new THREE.MeshStandardMaterial({ color: '#5b616d', roughness: 1, flatShading: true });
  const stoneDark = new THREE.MeshStandardMaterial({ color: '#383d47', roughness: 1, flatShading: true });
  const wood = new THREE.MeshStandardMaterial({ color: '#4a3423', roughness: 0.9, flatShading: true });
  const gold = new THREE.MeshStandardMaterial({ color: '#c8a349', roughness: 0.5, metalness: 0.6, flatShading: true });
  const royal = new THREE.MeshStandardMaterial({ color: '#7a1622', roughness: 0.85, flatShading: true });
  const roof = new THREE.MeshStandardMaterial({ color: '#3a4a5e', roughness: 0.9, flatShading: true });

  const box = (w: number, h: number, d: number, mat: THREE.Material, pos: [number, number, number], shadow = false) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(...pos);
    if (shadow) m.castShadow = true;
    g.add(m);
    return m;
  };

  // 床（石畳）
  const floor = new THREE.Mesh(new THREE.BoxGeometry(2 * WALL + 4, 0.4, 2 * WALL + 4), stoneDark);
  floor.position.set(0, -0.2, 0);
  floor.receiveShadow = true;
  g.add(floor);
  // 中央の敷石（少し明るい正方形）
  const inlay = new THREE.Mesh(new THREE.BoxGeometry(40, 0.42, 40), stone);
  inlay.position.set(0, -0.19, 0);
  inlay.receiveShadow = true;
  g.add(inlay);
  // 玉座へ延びる赤い絨毯
  const carpet = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.44, 44), royal);
  carpet.position.set(0, -0.18, 4);
  g.add(carpet);

  // ── 城壁（南は門で欠ける） ──
  const T = 1.4;
  const LEN = 2 * WALL + T;
  box(LEN, WALL_H, T, stone, [0, WALL_H / 2, -WALL]); // 北
  box(T, WALL_H, LEN, stone, [WALL, WALL_H / 2, 0]); // 東
  box(T, WALL_H, LEN, stone, [-WALL, WALL_H / 2, 0]); // 西
  // 南（左右に分割、中央は門）
  const half = (WALL + T / 2 - GATE_HALF) / 2;
  const cx = GATE_HALF + half;
  box(2 * half, WALL_H, T, stone, [cx, WALL_H / 2, WALL]);
  box(2 * half, WALL_H, T, stone, [-cx, WALL_H / 2, WALL]);

  // 銃眼（クレネル）を四辺の天端に InstancedMesh で
  const merlonPos: [number, number][] = [];
  const step = 3;
  for (let x = -WALL + 2; x <= WALL - 2; x += step) {
    merlonPos.push([x, -WALL]); // 北
    if (Math.abs(x) > GATE_HALF + 1) merlonPos.push([x, WALL]); // 南（門を避ける）
  }
  for (let z = -WALL + 2; z <= WALL - 2; z += step) {
    merlonPos.push([WALL, z]); // 東
    merlonPos.push([-WALL, z]); // 西
  }
  const merlonGeo = new THREE.BoxGeometry(1.2, 1.0, 1.2);
  const merlons = new THREE.InstancedMesh(merlonGeo, stoneLite, merlonPos.length);
  const dummy = new THREE.Object3D();
  merlonPos.forEach(([x, z], i) => {
    dummy.position.set(x, WALL_H + 0.4, z);
    dummy.updateMatrix();
    merlons.setMatrixAt(i, dummy.matrix);
  });
  g.add(merlons);

  // ── 四隅の塔 ──
  for (const sx of [-1, 1])
    for (const sz of [-1, 1]) {
      const tx = sx * WALL;
      const tz = sz * WALL;
      const body = new THREE.Mesh(new THREE.CylinderGeometry(TOWER, TOWER + 0.4, WALL_H + 3, 10), stone);
      body.position.set(tx, (WALL_H + 3) / 2, tz);
      body.castShadow = true;
      g.add(body);
      const band = new THREE.Mesh(new THREE.CylinderGeometry(TOWER + 0.25, TOWER + 0.25, 0.5, 10), stoneLite);
      band.position.set(tx, WALL_H + 2.6, tz);
      g.add(band);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(TOWER + 0.9, 4, 10), roof);
      cone.position.set(tx, WALL_H + 5.2, tz);
      cone.castShadow = true;
      g.add(cone);
    }

  // ── 南の門（門柱＋まぐさ） ──
  box(1.6, WALL_H + 1.5, T * 1.6, stoneLite, [GATE_HALF + 0.8, (WALL_H + 1.5) / 2, WALL], true);
  box(1.6, WALL_H + 1.5, T * 1.6, stoneLite, [-(GATE_HALF + 0.8), (WALL_H + 1.5) / 2, WALL], true);
  box(2 * GATE_HALF + 3.4, 1.4, T * 1.6, stoneLite, [0, WALL_H + 0.6, WALL]);

  // ── 玉座の壇 ──
  box(12, 0.5, 6, stoneLite, [0, 0.05, THRONE[1] - 1.5]);
  for (const dx of [-2.2, 2.2]) {
    // 椅子（座・背・肘掛け）
    box(1.6, 0.3, 1.4, wood, [dx, 0.55, THRONE[1] - 0.5], true);
    box(1.6, 2.2, 0.3, wood, [dx, 1.5, THRONE[1] - 1.1], true);
    box(0.25, 1.0, 1.4, wood, [dx - 0.7, 1.0, THRONE[1] - 0.5]);
    box(0.25, 1.0, 1.4, wood, [dx + 0.7, 1.0, THRONE[1] - 0.5]);
    // 金の装飾球
    const knob = new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), gold);
    knob.position.set(dx, 2.7, THRONE[1] - 1.1);
    g.add(knob);
  }
  // 玉座の背後の緞帳（王家の紋章色）
  box(9, 5, 0.2, royal, [0, 3.2, -WALL + 0.9]);
  const crownBanner = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.2, 3), gold);
  crownBanner.position.set(0, 3.6, -WALL + 1.05);
  crownBanner.rotation.x = Math.PI / 2;
  g.add(crownBanner);

  // ── 旅役者の舞台（東） ──
  const [stx, stz] = STAGE;
  box(8, 0.7, 6, wood, [stx, 0.35, stz]);
  box(0.3, 4, 0.3, wood, [stx - 3.6, 2, stz - 2.8]);
  box(0.3, 4, 0.3, wood, [stx + 3.6, 2, stz - 2.8]);
  box(8, 0.3, 0.3, wood, [stx, 4, stz - 2.8]);
  const curtain = new THREE.Mesh(new THREE.BoxGeometry(7.4, 3.4, 0.15), new THREE.MeshStandardMaterial({ color: '#5a2440', roughness: 1, flatShading: true }));
  curtain.position.set(stx, 2.4, stz - 2.7);
  g.add(curtain);
  // 台本の書見台
  box(0.7, 0.1, 0.5, wood, [stx - 1.5, 1.2, stz + 1], true);
  box(0.12, 0.8, 0.12, wood, [stx - 1.5, 0.75, stz + 1]);

  // ── 西の回廊（列柱） ──
  for (let z = -6; z <= 16; z += 3.4) {
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.5, 5.2, 8), stoneLite);
    col.position.set(-30, 2.6, z);
    col.castShadow = true;
    g.add(col);
    box(1.2, 0.5, 1.2, stone, [-30, 0.25, z]); // 柱脚
    box(1.2, 0.5, 1.2, stone, [-30, 5.3, z]); // 柱頭
  }
  box(0.7, 0.7, 24, stone, [-30, 5.7, 5]); // アーキトレーブ（梁）

  // ── 礼拝堂の祭壇（北西） ──
  const [chx, chz] = CHAPEL;
  box(3, 1.2, 1.6, stoneLite, [chx, 0.6, chz]);
  box(0.3, 2.2, 0.3, stone, [chx, 2.3, chz - 0.4]); // 十字（縦）
  box(1.2, 0.3, 0.3, stone, [chx, 2.9, chz - 0.4]); // 十字（横）
  for (const dx of [-0.9, 0.9]) {
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.5, 6), new THREE.MeshStandardMaterial({ color: '#e8e0c8', emissive: '#ffcf7a', emissiveIntensity: 0.6, flatShading: true }));
    candle.position.set(chx + dx, 1.45, chz + 0.4);
    g.add(candle);
  }

  // ── 王妃の私室のアラス（北東の壁掛け） ──
  const [clx, clz] = CLOSET;
  box(0.25, 4.2, 3.4, new THREE.MeshStandardMaterial({ color: '#3a4a3f', roughness: 1, flatShading: true }), [clx + 1.6, 2.6, clz]);
  box(0.4, 0.4, 3.8, wood, [clx + 1.6, 4.8, clz]); // 掛け竿

  // ── 墓地（南西） ──
  const [gx, gz] = GRAVEYARD;
  const mound = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.2, 0.6, 14), new THREE.MeshStandardMaterial({ color: '#403a2c', roughness: 1, flatShading: true }));
  mound.position.set(gx, 0.1, gz);
  mound.receiveShadow = true;
  g.add(mound);
  const stonesSeed = [
    [-2, -1.5, 0.2], [1.5, -2, -0.3], [2.6, 1, 0.1], [-1, 2.2, -0.15], [0.4, 0.3, 0.25],
  ];
  for (const [dx, dz, rot] of stonesSeed) {
    const hs = new THREE.Mesh(new THREE.BoxGeometry(1, 1.4, 0.28), stoneLite);
    hs.position.set(gx + dx, 0.9, gz + dz);
    hs.rotation.z = rot;
    hs.castShadow = true;
    g.add(hs);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.28, 8, 1, false, 0, Math.PI), stoneLite);
    cap.position.set(gx + dx, 1.6, gz + dz);
    cap.rotation.z = rot + Math.PI / 2;
    cap.rotation.y = Math.PI / 2;
    g.add(cap);
  }
  // 掘り返された墓穴の土
  const pit = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 1.6), stoneDark);
  pit.position.set(gx - 0.2, 0.3, gz - 0.2);
  g.add(pit);
  // ヨリックの髑髏（土の縁に）
  const skull = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 0), new THREE.MeshStandardMaterial({ color: '#d8d2c0', roughness: 0.9, flatShading: true }));
  skull.position.set(gx + 1.1, 0.7, gz - 0.9);
  g.add(skull);
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.24), new THREE.MeshStandardMaterial({ color: '#c8c2b0', roughness: 0.9, flatShading: true }));
  jaw.position.set(gx + 1.1, 0.52, gz - 0.78);
  g.add(jaw);
  // 枯れ木
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 5, 6), new THREE.MeshStandardMaterial({ color: '#2e2820', roughness: 1, flatShading: true }));
  trunk.position.set(gx - 3.5, 2.5, gz + 2.5);
  trunk.castShadow = true;
  g.add(trunk);
  for (const [ax, ay, az, rz] of [[-0.4, 4, 0, 0.9], [0.5, 3.4, 0.3, -0.8], [0, 4.6, -0.4, 0.2]]) {
    const br = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 2.2, 5), new THREE.MeshStandardMaterial({ color: '#2e2820', roughness: 1, flatShading: true }));
    br.position.set(gx - 3.5 + ax, ay, gz + 2.5 + az);
    br.rotation.z = rz;
    g.add(br);
  }

  return g;
}

// ── 松明（ゆらめく灯り） ──────────────────────────────
const TORCH_POS: [number, number][] = [
  [-11, -WALL + 1.3], [11, -WALL + 1.3],
  [WALL - 1.3, -9], [WALL - 1.3, 9],
  [-WALL + 1.3, -9], [-WALL + 1.3, 9],
];

function Torches() {
  return (
    <>
      {TORCH_POS.map((p, i) => (
        <Torch key={i} position={p} />
      ))}
    </>
  );
}

function Torch({ position }: { position: [number, number] }) {
  const light = useRef<THREE.PointLight>(null!);
  const flame = useRef<THREE.Mesh>(null!);
  const [x, z] = position;
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const f = 0.78 + Math.sin(t * 13 + x) * 0.12 + Math.sin(t * 7.3 + z) * 0.08;
    if (light.current) light.current.intensity = 7 * f;
    if (flame.current) flame.current.scale.set(1, 0.9 + f * 0.35, 1);
  });
  return (
    <group position={[x, 4, z]}>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.12, 1.1, 0.12]} />
        <meshStandardMaterial color="#241a12" flatShading />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.18, 0.1, 0.3, 6]} />
        <meshStandardMaterial color="#2a2018" flatShading />
      </mesh>
      <mesh ref={flame} position={[0, 0.4, 0]}>
        <coneGeometry args={[0.22, 0.75, 6]} />
        <meshStandardMaterial color="#ffb347" emissive="#ff7b1a" emissiveIntensity={2.4} flatShading />
      </mesh>
      <pointLight ref={light} position={[0, 0.4, 0.1]} color="#ff9a3c" intensity={7} distance={17} decay={1.6} />
    </group>
  );
}

// ── NPC（物語のフラグで登場・退場） ──────────────────
const PAL = {
  horatio: { skin: '#e6b98c', shirt: '#5f6672', vest: '#3a3f4a', pants: '#2c2f38', hair: '#4a3826' },
  claudius: { skin: '#d9a878', shirt: '#6a1420', vest: '#7a1f2b', pants: '#3a1016', hair: '#6b5030' },
  gertrude: { skin: '#ecc19b', shirt: '#1f5a44', vest: '#2f6b52', pants: '#24483a', hair: '#7a5330' },
  polonius: { skin: '#d8b48c', shirt: '#3a3320', vest: '#4a4028', pants: '#2a2618', hair: '#cfcabc' },
  ophelia: { skin: '#f0d4b6', shirt: '#c5d3e8', vest: '#e6eef7', pants: '#aebfd6', hair: '#c9a24e' },
  laertes: { skin: '#dcae82', shirt: '#463a52', vest: '#5a4763', pants: '#33283a', hair: '#3a2a1c' },
  leadPlayer: { skin: '#e0b487', shirt: '#8a4b16', vest: '#b5651d', pants: '#5a3210', hair: '#2a1c12' },
  gravedigger: { skin: '#cfa070', shirt: '#4a4030', vest: '#5a4a34', pants: '#33301f', hair: '#2a2018' },
} satisfies Record<string, CharacterPalette>;

function faceOrigin([x, z]: [number, number]): number {
  return Math.atan2(-x, -z);
}

function Figure({
  position,
  palette,
  scale = 1,
  facing,
  crown,
}: {
  position: [number, number];
  palette: CharacterPalette;
  scale?: number;
  facing?: number;
  crown?: string;
}) {
  const [x, z] = position;
  const ry = facing ?? faceOrigin(position);
  return (
    <>
      {/* 人をすり抜けない：立ち位置に当たり判定 */}
      <Solid x={x} z={z} r={0.55 * scale} />
      <group position={[x, 0, z]} rotation={[0, ry, 0]} scale={scale}>
        <Character palette={palette} />
        {crown && <CrownProp color={crown} />}
      </group>
    </>
  );
}

function CrownProp({ color }: { color: string }) {
  const pts = [0, 1, 2, 3, 4];
  return (
    <group position={[0, 1.56, 0]}>
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.13, 8]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} flatShading />
      </mesh>
      {pts.map((i) => {
        const a = (i / pts.length) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.2, 0.13, Math.sin(a) * 0.2]}>
            <coneGeometry args={[0.05, 0.16, 4]} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

function People() {
  const flags = useGame((s) => s.flags);
  const poloniusDead = !!flags.polonius_dead;
  const playersHere = !!flags.antic || !!flags.play_ready || !!flags.guilt_confirmed;

  return (
    <group>
      {/* 忠実なホレイショー：常にそばに */}
      <Figure position={POS.horatio} palette={PAL.horatio} scale={1.05} />

      {/* 王クローディアスと王妃ガートルード：玉座に（結末まで） */}
      {!flags.ending && (
        <>
          <Figure position={POS.claudius} palette={PAL.claudius} scale={1.12} facing={0} crown="#d9b64a" />
          <Figure position={POS.gertrude} palette={PAL.gertrude} scale={1.08} facing={0} crown="#e0c76a" />
        </>
      )}

      {/* ポローニアスとオフィーリア：ポローニアスが刺されるまで */}
      {!poloniusDead && (
        <>
          <Figure position={POS.polonius} palette={PAL.polonius} scale={1.08} />
          <Figure position={POS.ophelia} palette={PAL.ophelia} scale={1.02} />
        </>
      )}

      {/* 旅役者座長：狂気を装ってから登場 */}
      {playersHere && <Figure position={POS.leadPlayer} palette={PAL.leadPlayer} scale={1.06} facing={Math.PI} />}

      {/* 墓掘りとレアティーズ：終盤（ポローニアスの死後） */}
      {poloniusDead && (
        <>
          <Figure position={POS.gravedigger} palette={PAL.gravedigger} scale={1.05} />
          <Figure position={POS.laertes} palette={PAL.laertes} scale={1.08} />
        </>
      )}
    </group>
  );
}

// 決闘の剣架（終盤に中庭中央へ現れる）
function Foils() {
  const yorick = useGame((s) => !!s.flags.yorick);
  if (!yorick) return null;
  return (
    <group position={[3.5, 0, 6]}>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1.6, 0.2, 0.5]} />
        <meshStandardMaterial color="#4a3423" roughness={0.9} flatShading />
      </mesh>
      {[-0.4, 0, 0.4].map((dx, i) => (
        <mesh key={i} position={[dx, 1.5, 0]} rotation={[0, 0, 0.08 * (i - 1)]}>
          <cylinderGeometry args={[0.02, 0.02, 1.8, 5]} />
          <meshStandardMaterial color="#b8c0cc" metalness={0.7} roughness={0.3} flatShading />
        </mesh>
      ))}
    </group>
  );
}
