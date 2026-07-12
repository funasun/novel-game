import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { setGround } from '../../../engine/ground';
import { Solid } from '../../../engine/Solid';
import { Character, CharacterPalette } from '../../../engine/Character';
import { useGame } from '../../../engine/store/gameStore';
import {
  takaseHeight,
  takaseWalkable,
  CANAL_HALF,
  CANAL_LEN,
  MOORINGS,
  M1,
  M2,
  M3,
  M4,
  BOAT_POS,
  KISUKE_SEAT,
  SENDO,
  KOSATSU,
  YANAGI1,
  HOTARU1,
  JIZO,
  YANAGI2,
  TSUKIMI,
  HOTARU2,
  KUI,
  YANAGI3,
  TOURO,
  BRIDGES,
  KURA_ROW,
} from '../layout';

// Layer 3: 『高瀬舟』の舞台——智恩院の桜が散った後の、夜の高瀬川。
// 朧月・柳・白壁の蔵・蛍。すべてプロシージャル生成の最小の夜景に、
// 罪人を乗せた一艘の舟が浮かぶ。舟は章が進むごとに川を下る。

export function TakaseScene() {
  useEffect(() => {
    setGround({ heightAt: takaseHeight, isWalkable: takaseWalkable });
  }, []);

  return (
    <group>
      {/* 朧夜の空気。World の昼夜に、藍色の夜靄を重ねる */}
      <ambientLight intensity={0.42} color="#7285a8" />
      <directionalLight position={[40, 60, -20]} intensity={0.22} color="#aebfdd" />
      <OboroMoon />
      <Grounds />
      <Water />
      <Statics />
      <Willows />
      <Boat />
      <Fireflies />
      <ShoreLights />
    </group>
  );
}

// ── 朧月（東の空に霞む月） ─────────────────────────
function OboroMoon() {
  return (
    <group position={[70, 46, -30]}>
      <mesh>
        <sphereGeometry args={[4.2, 20, 20]} />
        <meshBasicMaterial color="#f2ecd8" />
      </mesh>
      {/* 霞の暈（かさ） */}
      <mesh>
        <sphereGeometry args={[7.5, 20, 20]} />
        <meshBasicMaterial color="#d8d4c2" transparent opacity={0.16} />
      </mesh>
      <mesh>
        <sphereGeometry args={[11, 20, 20]} />
        <meshBasicMaterial color="#c8c8bc" transparent opacity={0.07} />
      </mesh>
      <pointLight color="#e8e2c8" intensity={0.5} distance={220} decay={0.6} />
    </group>
  );
}

// ── 地面（両岸の土手と石積みの川縁） ─────────────────────────
function Grounds() {
  const canalLen = CANAL_LEN[1] - CANAL_LEN[0];
  const midZ = (CANAL_LEN[0] + CANAL_LEN[1]) / 2;
  return (
    <group>
      {/* 西岸の土手（歩ける岸辺を含む） */}
      <mesh receiveShadow position={[-14, -0.05, midZ]}>
        <boxGeometry args={[20, 0.1, canalLen + 8]} />
        <meshStandardMaterial color="#2c3140" roughness={1} />
      </mesh>
      {/* 東岸の土手 */}
      <mesh receiveShadow position={[14, -0.05, midZ]}>
        <boxGeometry args={[20, 0.1, canalLen + 8]} />
        <meshStandardMaterial color="#2a2e3c" roughness={1} />
      </mesh>
      {/* 石積みの川縁（両岸） */}
      <mesh position={[-CANAL_HALF - 0.3, 0.08, midZ]}>
        <boxGeometry args={[0.7, 0.28, canalLen]} />
        <meshStandardMaterial color="#4a4f5e" roughness={1} />
      </mesh>
      <mesh position={[CANAL_HALF + 0.3, 0.08, midZ]}>
        <boxGeometry args={[0.7, 0.28, canalLen]} />
        <meshStandardMaterial color="#4a4f5e" roughness={1} />
      </mesh>
      {/* 各舫いの岸辺（薄明るい土の面） */}
      {MOORINGS.map((mz, i) => (
        <mesh key={i} receiveShadow position={[-8.8, 0.01, mz]}>
          <boxGeometry args={[8.4, 0.06, 24]} />
          <meshStandardMaterial color="#3a3f4e" roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

// ── 黒い水の面 ─────────────────────────
function Water() {
  const glints = useRef<THREE.InstancedMesh>(null);
  const N = 40;
  const seeds = useMemo(
    () =>
      Array.from({ length: N }, (_, i) => ({
        x: (Math.random() - 0.5) * (CANAL_HALF * 2 - 1),
        z: CANAL_LEN[0] + ((CANAL_LEN[1] - CANAL_LEN[0]) * (i + Math.random())) / N,
        ph: Math.random() * Math.PI * 2,
        sp: 0.5 + Math.random() * 0.8,
      })),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    if (!glints.current) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      // 月光の欠片が、ゆっくり川を下ってゆく
      const z = s.z + ((t * s.sp) % 12);
      const wrapped = z > CANAL_LEN[1] ? z - (CANAL_LEN[1] - CANAL_LEN[0]) : z;
      dummy.position.set(s.x + Math.sin(t * 0.6 + s.ph) * 0.4, -0.22, wrapped);
      dummy.rotation.x = -Math.PI / 2;
      const sc = 0.5 + Math.sin(t * s.sp + s.ph) * 0.25;
      dummy.scale.set(sc, sc * 0.4, 1);
      dummy.updateMatrix();
      glints.current!.setMatrixAt(i, dummy.matrix);
    });
    glints.current.instanceMatrix.needsUpdate = true;
  });
  const midZ = (CANAL_LEN[0] + CANAL_LEN[1]) / 2;
  return (
    <group>
      <mesh position={[0, -0.28, midZ]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[CANAL_HALF * 2, CANAL_LEN[1] - CANAL_LEN[0]]} />
        <meshStandardMaterial color="#0c1422" roughness={0.35} metalness={0.35} />
      </mesh>
      <instancedMesh ref={glints} args={[undefined, undefined, N]}>
        <planeGeometry args={[0.8, 0.16]} />
        <meshBasicMaterial color="#8ea4c8" transparent opacity={0.35} />
      </instancedMesh>
    </group>
  );
}

// ── 静物（高札場・地蔵・石灯籠・舫い杭・蔵・橋） ─────────────────────────
function Statics() {
  const nodes = useMemo(() => {
    const g: React.ReactNode[] = [];
    let key = 0;
    const box = (
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      color: string,
      opts: { ry?: number; emissive?: string; ei?: number } = {},
    ) =>
      g.push(
        <mesh key={key++} castShadow position={[x, y, z]} rotation={[0, opts.ry ?? 0, 0]}>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial
            color={color}
            roughness={1}
            emissive={opts.emissive ?? '#000000'}
            emissiveIntensity={opts.ei ?? 0}
          />
        </mesh>,
      );
    const cyl = (x: number, y: number, z: number, r1: number, r2: number, h: number, color: string) =>
      g.push(
        <mesh key={key++} castShadow position={[x, y, z]}>
          <cylinderGeometry args={[r1, r2, h, 10]} />
          <meshStandardMaterial color={color} roughness={1} />
        </mesh>,
      );

    // 高札場（第一の舫い）——屋根つきの掲示板
    {
      const [x, z] = KOSATSU;
      box(x - 0.8, 0.9, z, 0.12, 1.8, 0.12, '#4a3c2e');
      box(x + 0.8, 0.9, z, 0.12, 1.8, 0.12, '#4a3c2e');
      box(x, 1.25, z, 1.9, 1.0, 0.08, '#6b5a44');
      box(x, 1.05, z + 0.05, 0.5, 0.62, 0.02, '#c9bda0'); // 札
      box(x - 0.55, 1.1, z + 0.05, 0.42, 0.5, 0.02, '#c2b698');
      box(x + 0.58, 1.0, z + 0.05, 0.42, 0.5, 0.02, '#bfb394');
      box(x, 1.95, z, 2.3, 0.12, 0.7, '#33291e'); // 小屋根
    }

    // 地蔵（第二の舫い）——石の御姿に赤い前掛け
    {
      const [x, z] = JIZO;
      box(x, 0.12, z, 1.0, 0.24, 0.8, '#565b66'); // 台座
      cyl(x, 0.55, z, 0.24, 0.3, 0.62, '#6c7280'); // 御体
      g.push(
        <mesh key={key++} castShadow position={[x, 1.0, z]}>
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial color="#767c8a" roughness={1} />
        </mesh>,
      );
      box(x, 0.62, z + 0.24, 0.3, 0.34, 0.03, '#8a3038'); // 前掛け
      box(x, 0.36, z + 0.3, 0.16, 0.1, 0.12, '#8a8f9a'); // 供え椀
    }

    // 石灯籠（地蔵のそば・灯がともる）
    {
      const [x, z] = TOURO;
      cyl(x, 0.35, z, 0.1, 0.14, 0.7, '#5a5f6a');
      box(x, 0.85, z, 0.42, 0.34, 0.42, '#666b76');
      box(x, 0.86, z + 0.2, 0.16, 0.16, 0.02, '#e8c87a', { emissive: '#e8b455', ei: 1.2 }); // 火袋
      box(x, 1.1, z, 0.52, 0.12, 0.52, '#565b66');
    }

    // 舫い杭（第四の舫い）
    {
      const [x, z] = KUI;
      cyl(x, 0.45, z, 0.12, 0.14, 0.9, '#3e3428');
      // 巻かれた綱
      g.push(
        <mesh key={key++} position={[x, 0.55, z]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.17, 0.045, 8, 14]} />
          <meshStandardMaterial color="#7a6a4e" roughness={1} />
        </mesh>,
      );
    }

    // 東岸の蔵の列（白壁が朧に浮かぶ）
    for (const [z, w, d] of KURA_ROW) {
      const x = CANAL_HALF + 4 + d / 2;
      box(x, 1.5, z, d, 3.0, w, '#b9b4a6'); // 白壁（夜色）
      box(x, 3.2, z, d + 0.5, 0.5, w + 0.5, '#22242c'); // 瓦屋根
      box(x - d / 2 + 0.02, 0.7, z, 0.06, 1.4, 1.0, '#3a3e48'); // 川に向く戸
      // 腰の海鼠壁
      box(x - d / 2 + 0.03, 0.35, z, 0.05, 0.7, w - 0.6, '#565a66');
    }

    // 西岸の町家の影（歩行域の外・黒い影絵）
    const machiya: ReadonlyArray<readonly [number, number]> = [
      [-58, 7],
      [-30, 6],
      [-16, 8],
      [8, 7],
      [30, 6],
      [52, 8],
      [68, 6],
    ];
    for (const [z, w] of machiya) {
      box(-17.5, 1.3, z, 5, 2.6, w, '#1b1e28');
      box(-17.5, 2.85, z, 5.6, 0.5, w + 0.6, '#14161e');
    }

    // 橋（舫いの間に三つ、夜空に黒く架かる）
    for (const bz of BRIDGES) {
      box(0, 1.15, bz, CANAL_HALF * 2 + 4, 0.18, 2.2, '#2e2a24');
      box(0, 1.45, bz - 1.0, CANAL_HALF * 2 + 4, 0.08, 0.1, '#3a3630'); // 欄干
      box(0, 1.45, bz + 1.0, CANAL_HALF * 2 + 4, 0.08, 0.1, '#3a3630');
      for (const px of [-CANAL_HALF - 1, CANAL_HALF + 1]) {
        cyl(px, 0.55, bz - 0.9, 0.12, 0.14, 1.3, '#2a261f');
        cyl(px, 0.55, bz + 0.9, 0.12, 0.14, 1.3, '#2a261f');
      }
    }

    return g;
  }, []);
  return <group>{nodes}</group>;
}

// ── 柳（枝垂れが夜風に揺れる） ─────────────────────────
function Willow({ pos, seed = 0 }: { pos: [number, number]; seed?: number }) {
  const sway = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (sway.current) sway.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5 + seed) * 0.03;
  });
  const strands = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const r = 0.7 + (i % 3) * 0.28;
        return { x: Math.cos(a) * r, z: Math.sin(a) * r, h: 1.6 + (i % 4) * 0.35 };
      }),
    [],
  );
  return (
    <group position={[pos[0], 0, pos[1]]}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.16, 0.24, 2.2, 8]} />
        <meshStandardMaterial color="#3c3226" roughness={1} />
      </mesh>
      <group ref={sway} position={[0, 2.4, 0]}>
        <mesh>
          <sphereGeometry args={[1.05, 10, 10]} />
          <meshStandardMaterial color="#2f4432" roughness={1} />
        </mesh>
        {strands.map((s, i) => (
          <mesh key={i} position={[s.x, -s.h / 2 + 0.3, s.z]}>
            <boxGeometry args={[0.1, s.h, 0.1]} />
            <meshStandardMaterial color="#35503a" roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Willows() {
  return (
    <group>
      <Willow pos={YANAGI1} seed={0} />
      <Willow pos={YANAGI2} seed={2.1} />
      <Willow pos={YANAGI3} seed={4.2} />
      {/* 歩行域の外の点景の柳 */}
      <Willow pos={[-6.5, -44]} seed={1.3} />
      <Willow pos={[-6.5, 44]} seed={3.4} />
    </group>
  );
}

// ── 高瀬舟（章が進むごとに川を下る） ─────────────────────────
const PAL: Record<string, CharacterPalette> = {
  kisuke: { skin: '#cfae8c', shirt: '#7c8794', vest: '#5a636e', pants: '#4a505c', hair: '#2c2620' },
  sendo: { skin: '#b98d68', shirt: '#3d4a5c', vest: '#2e3844', pants: '#333c48', hair: '#1f1c18' },
};

function Boat() {
  const flags = useGame((s) => s.flags);
  const mz = flags.ch4 ? M4 : flags.ch3 ? M3 : flags.ch2 ? M2 : M1;
  const [bx, bz] = BOAT_POS(mz);
  const [kx, kz] = KISUKE_SEAT(mz);
  const bob = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bob.current) bob.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.03 - 0.06;
  });
  return (
    <group>
      <group ref={bob} position={[bx, 0, bz]}>
        {/* 船体——底の浅い川舟 */}
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[2.9, 0.22, 5.6]} />
          <meshStandardMaterial color="#4e4030" roughness={1} />
        </mesh>
        {/* 舷（両側） */}
        <mesh castShadow position={[-1.38, 0.28, 0]}>
          <boxGeometry args={[0.14, 0.36, 5.6]} />
          <meshStandardMaterial color="#42362a" roughness={1} />
        </mesh>
        <mesh castShadow position={[1.38, 0.28, 0]}>
          <boxGeometry args={[0.14, 0.36, 5.6]} />
          <meshStandardMaterial color="#42362a" roughness={1} />
        </mesh>
        {/* 舳先（高瀬舟らしく反り上がる） */}
        <mesh castShadow position={[0, 0.32, -3.0]} rotation={[-0.5, 0, 0]}>
          <boxGeometry args={[2.6, 0.2, 1.4]} />
          <meshStandardMaterial color="#4e4030" roughness={1} />
        </mesh>
        {/* 艫の梶座 */}
        <mesh castShadow position={[0, 0.3, 2.95]} rotation={[0.35, 0, 0]}>
          <boxGeometry args={[2.4, 0.18, 0.9]} />
          <meshStandardMaterial color="#483c2e" roughness={1} />
        </mesh>
        {/* 棹（舷に立てかけられている） */}
        <mesh castShadow position={[1.2, 0.9, 0.8]} rotation={[0.5, 0, 0.12]}>
          <cylinderGeometry args={[0.035, 0.035, 3.6, 6]} />
          <meshStandardMaterial color="#8a7454" roughness={1} />
        </mesh>
        {/* 舳先の提灯 */}
        <group position={[0, 0.95, -2.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.3, 10]} />
            <meshStandardMaterial color="#d8c290" emissive="#e8b455" emissiveIntensity={1.1} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <boxGeometry args={[0.06, 0.24, 0.06]} />
            <meshStandardMaterial color="#3a3226" />
          </mesh>
          <pointLight color="#eab868" intensity={7} distance={12} decay={1.6} />
        </group>
      </group>
      {/* 喜助——甲板にちんまりと座る（膝を抱えるように小さく） */}
      <group position={[kx, -0.28, kz]} scale={0.92}>
        <Solid x={kx} z={kz} r={0.5} />
        <Character palette={PAL.kisuke} />
      </group>
      {/* 船頭——歩み板のたもとで、出立の合図を待つ */}
      <group position={[SENDO(mz)[0], 0, SENDO(mz)[1]]} rotation={[0, Math.PI * 0.3, 0]}>
        <Solid x={SENDO(mz)[0]} z={SENDO(mz)[1]} r={0.45} />
        <Character palette={PAL.sendo} />
        {/* 手にした小さな提灯 */}
        <mesh position={[0.42, 0.85, 0.15]}>
          <cylinderGeometry args={[0.11, 0.11, 0.2, 8]} />
          <meshStandardMaterial color="#d8c290" emissive="#e8b455" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0.42, 0.9, 0.15]} color="#eab868" intensity={2.5} distance={6} decay={1.8} />
      </group>
    </group>
  );
}

// ── 蛍（岸の茂みに点滅しながら漂う） ─────────────────────────
function FireflyCluster({ pos, n = 26 }: { pos: [number, number]; n?: number }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: n }, () => ({
        r: 0.6 + Math.random() * 2.6,
        a: Math.random() * Math.PI * 2,
        h: 0.3 + Math.random() * 1.6,
        sp: 0.3 + Math.random() * 0.5,
        ph: Math.random() * Math.PI * 2,
        bl: 1.2 + Math.random() * 2.0, // 明滅の周期
      })),
    [n],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    seeds.forEach((s, i) => {
      const a = s.a + t * s.sp;
      dummy.position.set(
        pos[0] + Math.cos(a) * s.r,
        s.h + Math.sin(t * 0.9 + s.ph) * 0.35,
        pos[1] + Math.sin(a * 0.8 + s.ph) * s.r,
      );
      const on = Math.max(0, Math.sin(t * (Math.PI / s.bl) + s.ph));
      const sc = 0.35 + on * 0.65;
      dummy.scale.set(sc, sc, sc);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, n]}>
      <sphereGeometry args={[0.05, 6, 6]} />
      <meshBasicMaterial color="#c8e87a" transparent opacity={0.9} />
    </instancedMesh>
  );
}

function Fireflies() {
  return (
    <group>
      <FireflyCluster pos={HOTARU1} />
      <FireflyCluster pos={HOTARU2} n={36} />
      <FireflyCluster pos={[TSUKIMI[0] - 2, TSUKIMI[1] + 3]} n={14} />
      {/* 川面を渡る少数の蛍 */}
      <FireflyCluster pos={[0, M3 - 10]} n={8} />
    </group>
  );
}

// ── 岸の灯（各舫いの行灯） ─────────────────────────
function ShoreLights() {
  const spots: ReadonlyArray<readonly [number, number]> = [
    [-5.6, M1 - 1.5],
    [-5.6, M2 - 1.5],
    [-5.6, M3 - 1.5],
    [-5.6, M4 + 1.5],
  ];
  return (
    <group>
      {spots.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[0.22, 1.0, 0.22]} />
            <meshStandardMaterial color="#3a342a" roughness={1} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <boxGeometry args={[0.34, 0.4, 0.34]} />
            <meshStandardMaterial color="#e2cf9a" emissive="#e0aa50" emissiveIntensity={0.9} />
          </mesh>
          <pointLight position={[0, 1.15, 0]} color="#e8b868" intensity={5} distance={10} decay={1.7} />
        </group>
      ))}
      {/* 朧月の照り返し（全体を仄かに持ち上げる） */}
      <pointLight position={[0, 24, 0]} color="#8fa0c0" intensity={3} distance={90} decay={1.8} />
    </group>
  );
}
