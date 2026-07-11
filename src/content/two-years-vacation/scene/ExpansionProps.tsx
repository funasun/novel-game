import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../../engine/store/gameStore';
import { Solid } from '../../../engine/Solid';
import {
  chairmanHeight,
  BRIDGE,
  BRIDGE_AXIS,
  BRIDGE_HALF_LEN,
  bridgeDeckAt,
  LAKE,
  FORD,
} from '../terrain';
import {
  BERRY_SPOTS,
  STONE_SPOTS,
  REED_SPOTS,
  CLAY_SPOTS,
  EGG_SPOTS,
  HERB_SPOTS,
  FISH_SPOTS,
  WOOD_GROVES,
  BATHE_ROCK,
  TOWER_SITE,
  SMOKE_SITE,
  PIER_SITE,
  WRECK_EAST,
  TURTLE_SOUTH,
  CAIRN_WEST,
} from '../layout';

// Layer 3: 世界拡張の舞台装置。丸木橋・資源ポイント・建設物・岬の宝。
// すべてプリミティブ構成のプロシージャル小物（ライセンス完全クリーン）。

export function ExpansionProps() {
  const flags = useGame((s) => s.flags);
  const used = useGame((s) => s.usedInteractables);

  return (
    <group>
      <LogBridge />
      <FordStones />
      <LakeDressing />
      {BERRY_SPOTS.map(([x, z], i) => (
        <BerryBush key={i} x={x} z={z} seed={i} />
      ))}
      {STONE_SPOTS.map(([x, z], i) => (
        <StoneQuarry key={i} x={x} z={z} seed={i} />
      ))}
      {REED_SPOTS.map(([x, z], i) => (
        <ReedClump key={i} x={x} z={z} seed={i * 3 + 1} />
      ))}
      {CLAY_SPOTS.map(([x, z], i) => (
        <ClayPit key={i} x={x} z={z} />
      ))}
      {EGG_SPOTS.map(([x, z], i) => (
        <SeabirdNest key={i} x={x} z={z} />
      ))}
      {HERB_SPOTS.map(([x, z], i) => (
        <HerbPatch key={i} x={x} z={z} seed={i} />
      ))}
      {WOOD_GROVES.map(([x, z], i) => (
        <FallenLog key={i} x={x} z={z} seed={i * 1.7 + 0.4} />
      ))}
      {flags.rod_made &&
        FISH_SPOTS.map(([x, z], i) => <FishingStake key={i} x={x} z={z} />)}
      <BatheRock />
      {/* 建設物：クラフトで建てると風景に現れる */}
      {flags.tower_built && <WatchTower />}
      {flags.smokehouse_built && <Smokehouse />}
      {flags.pier_built && <Pier />}
      {flags.pier_built && flags.rod_made && (
        <FishingStake x={PIER_SITE[0]} z={PIER_SITE[1]} />
      )}
      {/* 岬の宝：見つけるまで（使うまで）そこにある */}
      <WreckBox opened={!!used.tr_wreck} />
      <TurtleNest taken={!!used.tr_turtle} />
      <SurveyCairn />
    </group>
  );
}

const WOOD = '#7a5836';
const WOOD_DARK = '#5f4428';

// ---- 丸木橋：ジーランド川に架かる、島でただひとつの渡河点 ----
function LogBridge() {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const [ax, az] = BRIDGE_AXIS;
    const nx = az;
    const nz = -ax; // 橋軸に直交（幅方向）
    const wood = new THREE.MeshStandardMaterial({ color: WOOD, flatShading: true });
    const dark = new THREE.MeshStandardMaterial({ color: WOOD_DARK, flatShading: true });
    const yaw = Math.atan2(ax, az);

    // 渡し板
    const plankGeo = new THREE.BoxGeometry(2.3, 0.1, 0.46);
    for (let u = -BRIDGE_HALF_LEN + 0.3; u <= BRIDGE_HALF_LEN - 0.29; u += 0.52) {
      const m = new THREE.Mesh(plankGeo, wood);
      m.position.set(BRIDGE[0] + ax * u, bridgeDeckAt(u) - 0.05, BRIDGE[1] + az * u);
      m.rotation.y = yaw;
      m.castShadow = true;
      g.add(m);
    }

    // 縦通しの丸太（アーチに沿って分割）と手すり杭 — 左右
    const up = new THREE.Vector3(0, 1, 0);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const u1 = -BRIDGE_HALF_LEN + (i / 4) * BRIDGE_HALF_LEN * 2;
        const u2 = -BRIDGE_HALF_LEN + ((i + 1) / 4) * BRIDGE_HALF_LEN * 2;
        const p1 = new THREE.Vector3(
          BRIDGE[0] + ax * u1 + nx * 0.95 * side,
          bridgeDeckAt(u1) - 0.17,
          BRIDGE[1] + az * u1 + nz * 0.95 * side,
        );
        const p2 = new THREE.Vector3(
          BRIDGE[0] + ax * u2 + nx * 0.95 * side,
          bridgeDeckAt(u2) - 0.17,
          BRIDGE[1] + az * u2 + nz * 0.95 * side,
        );
        const len = p1.distanceTo(p2);
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, len + 0.2, 5), dark);
        m.position.copy(p1).add(p2).multiplyScalar(0.5);
        m.quaternion.setFromUnitVectors(up, p2.clone().sub(p1).normalize());
        m.castShadow = true;
        g.add(m);
      }
      for (const uu of [-4.4, -1.5, 1.5, 4.4]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.85, 5), dark);
        post.position.set(
          BRIDGE[0] + ax * uu + nx * 1.05 * side,
          bridgeDeckAt(uu) + 0.3,
          BRIDGE[1] + az * uu + nz * 1.05 * side,
        );
        g.add(post);
      }
    }
    return g;
  }, []);
  return <primitive object={group} />;
}

// ---- 河口の浅瀬：砂州に頭を出す飛び石（見た目の目印。渡れるのは砂州そのもの） ----
function FordStones() {
  const stones = useMemo(
    () =>
      [
        [-3.2, -0.6],
        [-1.2, 0.8],
        [0.6, -0.8],
        [2.4, 0.5],
        [4.0, -0.4],
      ].map(([dx, dz], i) => ({
        x: FORD[0] + dx,
        z: FORD[1] + dz,
        s: 0.5 + ((i * 7) % 3) * 0.14,
      })),
    [],
  );
  return (
    <group>
      {stones.map((st, i) => (
        <mesh key={i} position={[st.x, 0.02, st.z]} scale={[st.s, st.s * 0.4, st.s]} castShadow>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#9a9284" flatShading />
        </mesh>
      ))}
    </group>
  );
}

// ---- ファミリー湖の岸辺：葦の茂みと睡蓮 ----
function LakeDressing() {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const reedMat = new THREE.MeshStandardMaterial({ color: '#8f9a4a', flatShading: true });
    const padMat = new THREE.MeshStandardMaterial({ color: '#3f7a44', flatShading: true });
    // 岸をぐるりと葦
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2 + Math.sin(i * 7.3) * 0.1;
      const r = 10.2 + ((i * 13) % 6) * 0.5;
      const x = LAKE[0] + Math.cos(a) * r;
      const z = LAKE[1] + Math.sin(a) * r;
      const h = chairmanHeight(x, z);
      if (h < -0.45 || h > 0.9) continue;
      for (let k = 0; k < 3; k++) {
        const reed = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.045, 1.0 + ((i + k) % 3) * 0.25, 4),
          reedMat,
        );
        reed.position.set(
          x + Math.sin(i * 3.1 + k * 2.4) * 0.3,
          Math.max(h, 0) + 0.5,
          z + Math.cos(i * 5.7 + k * 1.7) * 0.3,
        );
        reed.rotation.z = Math.sin(i * 1.9 + k) * 0.12;
        g.add(reed);
      }
    }
    // 睡蓮の葉（湖面）
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + 0.4;
      const r = 4.5 + (i % 3) * 1.6;
      const pad = new THREE.Mesh(new THREE.CircleGeometry(0.42 + (i % 2) * 0.18, 7), padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(LAKE[0] + Math.cos(a) * r, 0.09, LAKE[1] + Math.sin(a) * r);
      g.add(pad);
    }
    return g;
  }, []);
  return <primitive object={group} />;
}

// ---- 資源ポイント ----
function BerryBush({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = chairmanHeight(x, z);
  const berries = useMemo(
    () =>
      [...Array(9)].map((_, i) => {
        const a = (i / 9) * Math.PI * 2 + seed;
        const rr = 0.55 + ((i * 7) % 3) * 0.12;
        return [Math.cos(a) * rr, 0.55 + ((i * 5) % 4) * 0.16, Math.sin(a) * rr] as const;
      }),
    [seed],
  );
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.75} />
      <mesh position={[0, 0.45, 0]} castShadow>
        <icosahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial color="#3d6b35" flatShading />
      </mesh>
      <mesh position={[0.5, 0.35, 0.3]} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#46783c" flatShading />
      </mesh>
      {berries.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]}>
          <sphereGeometry args={[0.06, 5, 4]} />
          <meshStandardMaterial color="#c43b3b" />
        </mesh>
      ))}
    </group>
  );
}

function StoneQuarry({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={1.2} />
      <mesh position={[0, 0.5, 0]} rotation={[seed, seed * 2, 0.3]} castShadow>
        <icosahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial color="#8d8578" flatShading />
      </mesh>
      <mesh position={[1.1, 0.25, 0.4]} rotation={[0.5, seed, 0.2]} castShadow>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#7d766a" flatShading />
      </mesh>
      <mesh position={[-0.9, 0.2, -0.5]} rotation={[0.2, seed * 3, 0.7]} castShadow>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshStandardMaterial color="#98917f" flatShading />
      </mesh>
    </group>
  );
}

function ReedClump({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = Math.max(chairmanHeight(x, z), 0);
  return (
    <group position={[x, y, z]}>
      {[...Array(7)].map((_, i) => (
        <mesh
          key={i}
          position={[Math.sin(i * 2.3 + seed) * 0.45, 0.65, Math.cos(i * 4.1 + seed) * 0.45]}
          rotation={[0, 0, Math.sin(i * 1.3) * 0.14]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.05, 1.3 + (i % 3) * 0.3, 4]} />
          <meshStandardMaterial color="#9aa14e" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function ClayPit({ x, z }: { x: number; z: number }) {
  const y = Math.max(chairmanHeight(x, z), -0.1);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.3, 1.5, 0.12, 8]} />
        <meshStandardMaterial color="#a3705a" flatShading />
      </mesh>
      <mesh position={[0.6, 0.18, -0.3]} castShadow>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="#8f5f4c" flatShading />
      </mesh>
      <mesh position={[-0.5, 0.14, 0.4]} castShadow>
        <icosahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial color="#8f5f4c" flatShading />
      </mesh>
    </group>
  );
}

function SeabirdNest({ x, z }: { x: number; z: number }) {
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.55, 0.42, 0.22, 7]} />
        <meshStandardMaterial color="#8a6f4a" flatShading />
      </mesh>
      {[
        [-0.14, 0.05],
        [0.16, 0.1],
        [0.0, -0.16],
      ].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.26, dz]} scale={[1, 1.25, 1]}>
          <sphereGeometry args={[0.11, 6, 5]} />
          <meshStandardMaterial color="#f2ede0" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function HerbPatch({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]}>
      {[...Array(5)].map((_, i) => (
        <group
          key={i}
          position={[Math.sin(i * 2.51 + seed) * 0.5, 0, Math.cos(i * 3.77 + seed) * 0.5]}
        >
          <mesh position={[0, 0.18, 0]} castShadow>
            <coneGeometry args={[0.16, 0.4, 5]} />
            <meshStandardMaterial color="#57b06a" flatShading />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.05, 5, 4]} />
            <meshStandardMaterial color="#e8f0d8" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 釣り場の目印杭（釣り竿を作ると立つ）
function FishingStake({ x, z }: { x: number; z: number }) {
  const y = Math.max(chairmanHeight(x, z), 0);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.5, 0]} rotation={[0.12, 0, -0.08]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.1, 5]} />
        <meshStandardMaterial color={WOOD_DARK} flatShading />
      </mesh>
      <mesh position={[0, 0.92, 0]} rotation={[0, 0.6, Math.PI / 2.2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 4]} />
        <meshStandardMaterial color={WOOD} flatShading />
      </mesh>
    </group>
  );
}

// 倒木：薪の再取得ポイント。大きな幹と切り株、まさかりが刺さっている
function FallenLog({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, seed * 3, 0]}>
      <Solid x={x} z={z} r={1.1} />
      <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2 - 0.06]} castShadow>
        <cylinderGeometry args={[0.32, 0.4, 3.2, 6]} />
        <meshStandardMaterial color={WOOD} flatShading />
      </mesh>
      <mesh position={[2.1, 0.3, 0.5]} castShadow>
        <cylinderGeometry args={[0.34, 0.42, 0.6, 6]} />
        <meshStandardMaterial color={WOOD_DARK} flatShading />
      </mesh>
      {/* 切り株に刺さったまさかり */}
      <group position={[2.1, 0.62, 0.5]} rotation={[0.5, 0.3, -0.4]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.03, 0.04, 0.7, 4]} />
          <meshStandardMaterial color="#9a8a6a" flatShading />
        </mesh>
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.26, 0.16, 0.05]} />
          <meshStandardMaterial color="#9aa0a6" metalness={0.5} roughness={0.4} flatShading />
        </mesh>
      </group>
      {/* 割った薪 */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          position={[-1.2 + i * 0.35, 0.12, 0.9]}
          rotation={[Math.PI / 2, 0, i * 0.5]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.09, 0.8, 5]} />
          <meshStandardMaterial color="#8a6844" flatShading />
        </mesh>
      ))}
    </group>
  );
}

function BatheRock() {
  const [x, z] = BATHE_ROCK;
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.15, 0]} scale={[1.6, 0.35, 1.3]} castShadow>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#9a9488" flatShading />
      </mesh>
    </group>
  );
}

// ---- 建設物 ----
// 物見やぐら：大凧の丘の頂に建つ。島でいちばん高い人工物。
function WatchTower() {
  const [x, z] = TOWER_SITE;
  const y = chairmanHeight(x, z);
  const legs: [number, number][] = [
    [-0.9, -0.9],
    [0.9, -0.9],
    [-0.9, 0.9],
    [0.9, 0.9],
  ];
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={1.4} />
      {legs.map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 1.7, dz]} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 3.4, 5]} />
          <meshStandardMaterial color={WOOD_DARK} flatShading />
        </mesh>
      ))}
      {/* 筋交い */}
      {[0, 1].map((i) => (
        <mesh key={i} position={[0, 1.1, (i === 0 ? -1 : 1) * 0.92]} rotation={[0, 0, 0.8]}>
          <cylinderGeometry args={[0.05, 0.05, 2.4, 4]} />
          <meshStandardMaterial color={WOOD} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 3.45, 0]} castShadow>
        <boxGeometry args={[2.5, 0.14, 2.5]} />
        <meshStandardMaterial color={WOOD} flatShading />
      </mesh>
      {/* 手すり */}
      {legs.map(([dx, dz], i) => (
        <mesh key={`r${i}`} position={[dx * 1.22, 3.95, dz * 1.22]}>
          <cylinderGeometry args={[0.045, 0.045, 0.9, 4]} />
          <meshStandardMaterial color={WOOD_DARK} flatShading />
        </mesh>
      ))}
      {[0, 1, 2, 3].map((i) => {
        const horiz = i < 2;
        return (
          <mesh
            key={`h${i}`}
            position={[horiz ? 0 : (i === 2 ? -1.1 : 1.1), 4.3, horiz ? (i === 0 ? -1.1 : 1.1) : 0]}
            rotation={horiz ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.035, 0.035, 2.35, 4]} />
            <meshStandardMaterial color={WOOD} flatShading />
          </mesh>
        );
      })}
      {/* 旗 */}
      <mesh position={[1.05, 4.9, 1.05]}>
        <cylinderGeometry args={[0.035, 0.035, 1.6, 4]} />
        <meshStandardMaterial color={WOOD_DARK} flatShading />
      </mesh>
      <mesh position={[1.35, 5.45, 1.05]}>
        <boxGeometry args={[0.6, 0.36, 0.03]} />
        <meshStandardMaterial color="#c9d4dd" side={THREE.DoubleSide} />
      </mesh>
      {/* はしご */}
      <group position={[0, 0, -1.05]} rotation={[0.22, 0, 0]}>
        {[-0.25, 0.25].map((dx, i) => (
          <mesh key={i} position={[dx, 1.7, 0]}>
            <cylinderGeometry args={[0.045, 0.045, 3.5, 4]} />
            <meshStandardMaterial color={WOOD} flatShading />
          </mesh>
        ))}
        {[...Array(6)].map((_, i) => (
          <mesh key={`s${i}`} position={[0, 0.5 + i * 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5, 4]} />
            <meshStandardMaterial color={WOOD} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 燻製小屋：石積みの土台＋木の壁＋粘土の煙突。煙がたなびく。
function Smokehouse() {
  const [x, z] = SMOKE_SITE;
  const y = chairmanHeight(x, z);
  const puffs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    puffs.current.forEach((m, i) => {
      if (!m) return;
      const cycle = (t * 0.35 + i * 0.33) % 1;
      m.position.y = 2.15 + cycle * 1.8;
      m.position.x = 0.55 + Math.sin(t * 0.8 + i * 2) * 0.12 + cycle * 0.5;
      const s = 0.14 + cycle * 0.3;
      m.scale.setScalar(s);
      (m.material as THREE.MeshStandardMaterial).opacity = 0.55 * (1 - cycle);
    });
  });

  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={1.7} />
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.4, 0.6, 2.2]} />
        <meshStandardMaterial color="#8d8578" flatShading />
      </mesh>
      <mesh position={[0, 1.15, 0]} castShadow>
        <boxGeometry args={[2.1, 1.1, 1.9]} />
        <meshStandardMaterial color={WOOD} flatShading />
      </mesh>
      <mesh position={[0, 2.0, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.75, 0.9, 4]} />
        <meshStandardMaterial color={WOOD_DARK} flatShading />
      </mesh>
      {/* 扉 */}
      <mesh position={[0, 0.95, 0.96]}>
        <boxGeometry args={[0.6, 0.9, 0.06]} />
        <meshStandardMaterial color={WOOD_DARK} flatShading />
      </mesh>
      {/* 煙突と煙 */}
      <mesh position={[0.55, 2.45, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.2, 0.7, 5]} />
        <meshStandardMaterial color="#a3705a" flatShading />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) puffs.current[i] = el;
          }}
          position={[0.55, 2.3, 0]}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#d9d5cc" transparent opacity={0.5} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// 桟橋：スルギ湾の波打ち際から海へ。杭は海底まで届く。
function Pier() {
  const group = useMemo(() => {
    const g = new THREE.Group();
    const wood = new THREE.MeshStandardMaterial({ color: WOOD, flatShading: true });
    const dark = new THREE.MeshStandardMaterial({ color: WOOD_DARK, flatShading: true });
    const [px, pz] = PIER_SITE;
    const deckY = 0.55;
    // デッキ板（z+方向＝沖へ 7.5m）
    const plankGeo = new THREE.BoxGeometry(1.7, 0.09, 0.5);
    for (let d = 0.3; d <= 7.5; d += 0.56) {
      const m = new THREE.Mesh(plankGeo, wood);
      m.position.set(px, deckY, pz + d);
      m.castShadow = true;
      g.add(m);
    }
    // 縦通し材
    for (const side of [-1, 1]) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 7.6), dark);
      st.position.set(px + 0.72 * side, deckY - 0.11, pz + 3.85);
      g.add(st);
    }
    // 杭（海底まで）
    for (let d = 0.6; d <= 7.4; d += 2.26) {
      for (const side of [-1, 1]) {
        const wx = px + 0.8 * side;
        const wz = pz + d;
        const bottom = Math.min(chairmanHeight(wx, wz), 0) - 0.25;
        const len = deckY + 0.25 - bottom;
        const pile = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, len, 5), dark);
        pile.position.set(wx, (deckY + 0.25 + bottom) / 2, wz);
        pile.castShadow = true;
        g.add(pile);
      }
    }
    // 係留柱
    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.6, 5), dark);
    bollard.position.set(px + 0.7, deckY + 0.3, pz + 7.2);
    g.add(bollard);
    return g;
  }, []);
  return <primitive object={group} />;
}

// ---- 岬の宝 ----
// 東の岬に流れ着いた難破物の木箱
function WreckBox({ opened }: { opened: boolean }) {
  const [x, z] = WRECK_EAST;
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, 0.7, 0]}>
      <Solid x={x} z={z} r={0.9} />
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[1.2, 0.84, 0.9]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
      {/* 箱のたが */}
      {[-0.4, 0.4].map((dx, i) => (
        <mesh key={i} position={[dx, 0.42, 0]}>
          <boxGeometry args={[0.1, 0.9, 0.96]} />
          <meshStandardMaterial color="#5a4a34" flatShading />
        </mesh>
      ))}
      {/* ふた：開封後はずれて立てかかる */}
      <mesh
        position={opened ? [0.9, 0.5, 0.1] : [0, 0.9, 0]}
        rotation={opened ? [0.3, 0.2, 1.25] : [0, 0, 0]}
        castShadow
      >
        <boxGeometry args={[1.26, 0.1, 0.96]} />
        <meshStandardMaterial color="#7a5a3c" flatShading />
      </mesh>
      {/* 流れ着いた海藻 */}
      <mesh position={[-0.7, 0.06, 0.5]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshStandardMaterial color="#4a6b46" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 南の砂浜のウミガメの産卵地
function TurtleNest({ taken }: { taken: boolean }) {
  const [x, z] = TURTLE_SOUTH;
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <mesh position={[0, 0.12, 0]} scale={[1.6, 0.35, 1.6]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshStandardMaterial color="#e6d29a" flatShading />
      </mesh>
      {(taken ? [[-0.3, 0.2]] : [
        [-0.3, 0.2],
        [0.25, -0.1],
        [0.05, 0.35],
      ]).map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.42, dz]} scale={[1, 1.2, 1]}>
          <sphereGeometry args={[0.12, 6, 5]} />
          <meshStandardMaterial color="#f5f0e2" flatShading />
        </mesh>
      ))}
      {/* 亀の足あと */}
      {[...Array(5)].map((_, i) => (
        <mesh key={`t${i}`} position={[0.6 + i * 0.5, 0.01, 0.8 + i * 0.42]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.14, 6]} />
          <meshStandardMaterial color="#d4bd82" />
        </mesh>
      ))}
    </group>
  );
}

// 西の岬、ボードワンの測量石塚
function SurveyCairn() {
  const [x, z] = CAIRN_WEST;
  const y = chairmanHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.9} />
      {[
        [0, 0.25, 0, 0.62],
        [0.1, 0.7, 0.05, 0.46],
        [-0.06, 1.05, -0.04, 0.34],
        [0.03, 1.3, 0.02, 0.22],
      ].map(([dx, dy, dz, s], i) => (
        <mesh key={i} position={[dx, dy, dz]} rotation={[i * 0.4, i * 1.3, 0]} castShadow>
          <icosahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color="#8d8578" flatShading />
        </mesh>
      ))}
      {/* 朽ちた標柱 */}
      <mesh position={[0.55, 0.55, -0.3]} rotation={[0.12, 0, -0.18]} castShadow>
        <cylinderGeometry args={[0.05, 0.07, 1.1, 5]} />
        <meshStandardMaterial color="#6b5a44" flatShading />
      </mesh>
    </group>
  );
}
