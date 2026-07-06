import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from '../../../engine/store/gameStore';
import { Solid } from '../../../engine/Solid';
import { Character, type CharacterPalette } from '../../../engine/Character';
import { playerPosition } from '../../../engine/playerState';
import { islandHeight } from '../../../shared-assets/procedural/terrain';
import {
  CAMP,
  SHIP,
  LOOKOUT,
  CAVE,
  NORTH,
  BOAT,
  NPC_POS,
  CAVE_POS,
  LANDMARKS,
  SALT_ROCK,
  SEAL_ROCK,
  SUGAR_TREE,
  RHEA,
  KITCHEN,
  WOODPILE,
  CORRAL,
  DOG_BEACH,
  DOG_CAVE,
  SIGNAL_MAST,
  DRIFTWOOD_POINTS,
  SHELLFISH_POINTS,
  FIREWOOD_POINTS,
} from '../layout';

// Layer 3: 舞台装置。物語の進行フラグに合わせて、島の風景そのものが移り変わる。

export function StageProps() {
  const used = useGame((s) => s.usedInteractables);
  const flags = useGame((s) => s.flags);
  const caveMoved = !!flags.cave_moved;

  return (
    <group>
      {!caveMoved &&
        DRIFTWOOD_POINTS.map((p, i) =>
          used[`driftwood_${i}`] ? null : (
            <Driftwood key={i} x={p.x} z={p.z} seed={p.rand} />
          ),
        )}
      {!caveMoved &&
        flags.fire_lit &&
        SHELLFISH_POINTS.map((p, i) =>
          used[`shellfish_${i}`] ? null : (
            <Shellfish key={i} x={p.x} z={p.z} seed={p.rand} />
          ),
        )}
      {caveMoved &&
        FIREWOOD_POINTS.map((p, i) =>
          used[`firewood_${i}`] ? null : (
            <Driftwood key={i} x={p.x} z={p.z} seed={p.rand} />
          ),
        )}
      {caveMoved ? (
        <Campfire x={-35.5} z={12} />
      ) : (
        flags.fire_lit && <Campfire x={CAMP[0] - 1.6} z={CAMP[1] + 1.2} />
      )}
      {!flags.sloughi_broken && <ShipWreck />}
      <CaveMassif />
      <LookoutCairn />
      {flags.doniphan_left && !flags.doniphan_saved && <NorthCamp />}
      {flags.kite_built && !flags.walston_defeated && <Kite />}
      {flags.boat_built && <Boat />}
      {flags.found_cave && <BaudoinGrave flowers={!!used.lm_grave} />}
      {used.lm_bay && <Signpost pos={LANDMARKS.bay} />}
      {used.lm_hill && <Signpost pos={LANDMARKS.hill} />}
      {used.lm_moors && <Signpost pos={LANDMARKS.moors} />}
      {flags.map_started && <TrapFrame />}
      {used.lm_severn && <SevernCross />}
      {caveMoved && <Seals />}
      {caveMoved && <SaltPans />}
      {caveMoved && <SapBucket />}
      {caveMoved && <Rhea />}
      {caveMoved && <Kitchen />}
      {flags.map_done && <Woodpile grown={!!used.act_winterstock} />}
      {flags.map_done && <GuanacoCorral />}
      <Dog />
      {used.act_signal && <SignalMast />}
      <Boys />
    </group>
  );
}

// 少年たち。立ち位置は物語の時代（浜のキャンプ／フレンチ・デン）で切り替わる。
function Boys() {
  const flags = useGame((s) => s.flags);
  const pos = flags.cave_moved ? CAVE_POS : NPC_POS;
  const doniphanHere = !flags.doniphan_left || flags.doniphan_saved;

  return (
    <>
      <CampBoy pos={pos.briant} palette={PALETTES.briant} />
      <CampBoy pos={pos.gordon} palette={PALETTES.gordon} />
      {doniphanHere && <CampBoy pos={pos.doniphan} palette={PALETTES.doniphan} />}
      <CampBoy pos={pos.jacques} palette={PALETTES.jacques} scale={0.84} />
      <CampBoy pos={pos.baxter} palette={PALETTES.baxter} />
      <CampBoy pos={pos.service} palette={PALETTES.service} scale={0.94} />
      <CampBoy
        pos={[pos.littles[0] - 0.4, pos.littles[1] - 0.2]}
        palette={PALETTES.dole}
        scale={0.72}
      />
      <CampBoy
        pos={[pos.littles[0] + 0.5, pos.littles[1] + 0.4]}
        palette={PALETTES.costar}
        scale={0.68}
      />
      <CampBoy pos={pos.moko} palette={PALETTES.moko} scale={0.9} />
      {flags.kate_here && <CampBoy pos={CAVE_POS.kate} palette={PALETTES.kate} scale={1.08} />}
      {flags.evans_here && <CampBoy pos={CAVE_POS.evans} palette={PALETTES.evans} scale={1.16} />}
    </>
  );
}

function Driftwood({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = Math.max(islandHeight(x, z), 0.05);
  return (
    <mesh
      castShadow
      position={[x, y + 0.12, z]}
      rotation={[Math.PI / 2 + (seed - 0.5) * 0.3, 0, seed * Math.PI * 2]}
    >
      <cylinderGeometry args={[0.09, 0.14, 1.7, 5]} />
      <meshStandardMaterial color="#8a6844" flatShading />
    </mesh>
  );
}

function Shellfish({ x, z, seed }: { x: number; z: number; seed: number }) {
  const y = Math.max(islandHeight(x, z), -0.1);
  return (
    <group position={[x, y + 0.06, z]} rotation={[0, seed * Math.PI * 2, 0]}>
      <mesh castShadow scale={[1, 0.45, 0.85]}>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshStandardMaterial color="#d9c4a5" flatShading />
      </mesh>
      <mesh position={[0.12, 0.04, 0]} scale={[1, 0.4, 0.8]}>
        <sphereGeometry args={[0.14, 7, 5]} />
        <meshStandardMaterial color="#b89b7c" flatShading />
      </mesh>
    </group>
  );
}

function Campfire({ x, z }: { x: number; z: number }) {
  const flame = useRef<THREE.Mesh>(null!);
  const light = useRef<THREE.PointLight>(null!);
  const y = islandHeight(x, z);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const flicker = 1 + Math.sin(t * 9.3) * 0.12 + Math.sin(t * 23.7) * 0.07;
    flame.current.scale.set(flicker, 1.1 + Math.sin(t * 7.1) * 0.18, flicker);
    light.current.intensity = 26 * flicker;
  });

  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.55} />
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          castShadow
          position={[0, 0.12, 0]}
          rotation={[Math.PI / 2.3, 0, (i / 3) * Math.PI * 2]}
        >
          <cylinderGeometry args={[0.07, 0.09, 0.9, 5]} />
          <meshStandardMaterial color="#6b4c30" flatShading />
        </mesh>
      ))}
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.62, 0.08, Math.sin(a) * 0.62]}>
            <icosahedronGeometry args={[0.13, 0]} />
            <meshStandardMaterial color="#7d7568" flatShading />
          </mesh>
        );
      })}
      <mesh ref={flame} position={[0, 0.45, 0]}>
        <coneGeometry args={[0.28, 0.75, 6]} />
        <meshStandardMaterial
          color="#ff9a3c"
          emissive="#ff6a1a"
          emissiveIntensity={2.4}
          flatShading
        />
      </mesh>
      <pointLight ref={light} position={[0, 1, 0]} color="#ff9a4a" distance={22} decay={1.6} />
    </group>
  );
}

const PALETTES: Record<string, CharacterPalette> = {
  briant: { skin: '#f0c8a0', shirt: '#c9d4dd', vest: '#2f4a6b', pants: '#4a3d2e', hair: '#2c2118' },
  jacques: { skin: '#f0c8a0', shirt: '#b9c4cf', vest: '#3c5a78', pants: '#43382c', hair: '#2c2118' },
  gordon: { skin: '#ecc39a', shirt: '#d6d0bd', vest: '#4c5a44', pants: '#3c3630', hair: '#5a4632' },
  doniphan: { skin: '#f2cfa8', shirt: '#e3ddd0', vest: '#7c3030', pants: '#33302c', hair: '#c9a45a' },
  baxter: { skin: '#e8bd93', shirt: '#cbbfa4', vest: '#6b5a36', pants: '#3e3428', hair: '#3a2c1e' },
  service: { skin: '#efc59d', shirt: '#d8cdb4', vest: '#365a5e', pants: '#41392e', hair: '#6b4a2a' },
  dole: { skin: '#f2cba2', shirt: '#d9c9a8', vest: '#5a6a4a', pants: '#4a4034', hair: '#4a341f' },
  costar: { skin: '#f4cda4', shirt: '#d4b8b0', vest: '#6a4a5a', pants: '#443a30', hair: '#2e241a' },
  moko: { skin: '#8a5a3a', shirt: '#e8e2d2', vest: '#31425e', pants: '#2e3844', hair: '#171310' },
  kate: { skin: '#eec3a0', shirt: '#7a5a62', vest: '#4c3a44', pants: '#5a4a52', hair: '#6b5a3a' },
  evans: { skin: '#d9a878', shirt: '#3a4a5a', vest: '#2a3038', pants: '#31302c', hair: '#4a3c30' },
  cross: { skin: '#eec49c', shirt: '#c9c2b0', vest: '#5c4a6a', pants: '#3c342c', hair: '#3c2e20' },
  webb: { skin: '#f0c8a0', shirt: '#d0c6ae', vest: '#4a5a6c', pants: '#403830', hair: '#54422e' },
  wilcox: { skin: '#e9c096', shirt: '#ccc0a8', vest: '#6a5a2e', pants: '#3a342c', hair: '#2e2418' },
};

function CampBoy({
  pos,
  palette,
  scale = 1,
}: {
  pos: [number, number];
  palette: CharacterPalette;
  scale?: number;
}) {
  const group = useRef<THREE.Group>(null!);
  const [x, z] = pos;
  const y = islandHeight(x, z);

  useFrame(({ clock }) => {
    // 呼吸のゆらぎ＋プレイヤーの方を向く
    group.current.position.y = y + Math.sin(clock.elapsedTime * 1.7 + x * 1.3) * 0.02;
    const dx = playerPosition.x - x;
    const dz = playerPosition.z - z;
    if (Math.hypot(dx, dz) < 8) {
      const target = Math.atan2(dx, dz);
      let diff = target - group.current.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      group.current.rotation.y += diff * 0.06;
    }
  });

  return (
    <>
      {/* 人をすり抜けない：立ち位置に当たり判定 */}
      <Solid x={x} z={z} r={0.5 * scale} />
      <group ref={group} position={[x, y, z]} scale={scale}>
        <Character palette={palette} />
      </group>
    </>
  );
}

const HULL = '#5d4630';
const DECK = '#8a6844';
const SAIL = '#d8d2c2';

// 浜に乗り上げ、右舷に傾いたスルギ号。プリミティブ構成のプロシージャル難破船。
function ShipWreck() {
  const [x, z] = SHIP;
  // 船底が砂と波に半ば埋まるよう、接地より少し沈めて置く
  const y = Math.max(islandHeight(x, z), -0.2) - 0.55;
  return (
    <group position={[x, y, z]} rotation={[0, -0.65, 0]}>
      {/* 船体をすり抜けない：船軸に沿って三つの当たり判定 */}
      <Solid x={x + 3.18} z={z + 2.42} r={2.2} />
      <Solid x={x} z={z} r={2.2} />
      <Solid x={x - 3.18} z={z - 2.42} r={2.2} />
      {/* 傾いた船体一式 */}
      <group rotation={[0.04, 0, 0.2]} position={[0, 0.2, 0]}>
        <mesh castShadow position={[0, 1.25, 0]}>
          <boxGeometry args={[12.5, 2.6, 3.8]} />
          <meshStandardMaterial color={HULL} flatShading />
        </mesh>
        {/* 舳先 */}
        <mesh castShadow position={[6.9, 1.35, 0]} rotation={[0, Math.PI / 4, 0]}>
          <boxGeometry args={[2.7, 2.4, 2.7]} />
          <meshStandardMaterial color={HULL} flatShading />
        </mesh>
        {/* 甲板 */}
        <mesh position={[0, 2.62, 0]}>
          <boxGeometry args={[12.1, 0.16, 3.4]} />
          <meshStandardMaterial color={DECK} flatShading />
        </mesh>
        {/* 舷側の手すり */}
        {[1.85, -1.85].map((side) => (
          <mesh key={side} position={[0, 2.95, side]}>
            <boxGeometry args={[12.1, 0.5, 0.14]} />
            <meshStandardMaterial color={HULL} flatShading />
          </mesh>
        ))}
        {/* 船尾の小屋 */}
        <mesh castShadow position={[-4.4, 3.2, 0]}>
          <boxGeometry args={[3.2, 1.1, 3.0]} />
          <meshStandardMaterial color="#6e5638" flatShading />
        </mesh>
        {/* 船腹の破孔 */}
        <mesh position={[-2.6, 0.85, 1.93]}>
          <boxGeometry args={[2.2, 1.3, 0.12]} />
          <meshStandardMaterial color="#17110a" />
        </mesh>
        {/* 折れて残ったメインマスト */}
        <mesh castShadow position={[1.4, 4.4, 0]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.13, 0.2, 3.6, 6]} />
          <meshStandardMaterial color="#6b4c30" flatShading />
        </mesh>
        {/* 破れた帆 */}
        <mesh position={[2.3, 4.1, 0.1]} rotation={[0.1, 0.25, -0.35]}>
          <planeGeometry args={[1.9, 2.5]} />
          <meshStandardMaterial color={SAIL} side={THREE.DoubleSide} flatShading />
        </mesh>
      </group>
      {/* 砂の上に倒れた前マスト */}
      <mesh castShadow position={[2.5, 0.22, 5.6]} rotation={[Math.PI / 2, 0, 0.45]}>
        <cylinderGeometry args={[0.11, 0.17, 7.5, 6]} />
        <meshStandardMaterial color="#6b4c30" flatShading />
      </mesh>
      {/* 倒れたマストに絡んだ帆布 */}
      <mesh position={[3.4, 0.16, 6.6]} rotation={[-Math.PI / 2, 0, 0.5]}>
        <planeGeometry args={[4.2, 2.6]} />
        <meshStandardMaterial color={SAIL} side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  );
}

const ROCK = '#7d7568';

// フレンチ・デン。前庭の西側にそびえる岩山と、暗い入口。
function CaveMassif() {
  const cx = CAVE[0] - 5.5;
  const cz = CAVE[1];
  const y = islandHeight(cx, cz);
  return (
    <group position={[cx, y, cz]}>
      {/* 岩山をすり抜けない。前庭（東側）は少年たちがいるので空けておく */}
      <Solid x={cx - 1.5} z={cz} r={2.6} />
      <Solid x={cx - 2.2} z={cz + 3.8} r={1.8} />
      <Solid x={cx - 1.8} z={cz - 4.2} r={1.8} />
      <mesh castShadow position={[0, 2.2, 0]} scale={[4.6, 4.4, 6.5]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={ROCK} flatShading />
      </mesh>
      <mesh castShadow position={[-2.2, 1.4, 3.8]} scale={[3, 2.6, 3.2]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#6f675a" flatShading />
      </mesh>
      <mesh castShadow position={[-1.8, 1.6, -4.2]} scale={[3.4, 3, 3]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#867d6e" flatShading />
      </mesh>
      {/* 入口（東向きの暗い口） */}
      <mesh position={[3.55, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2.2, 2.4]} />
        <meshStandardMaterial color="#0d0a06" />
      </mesh>
    </group>
  );
}

// 高台の頂の石積み（ケルン）。少年たちの目印。
function LookoutCairn() {
  const [x, z] = LOOKOUT;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.6} />
      {[0.5, 0.34, 0.2].map((r, i) => (
        <mesh key={i} castShadow position={[0, 0.3 + i * 0.55, 0]}>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={ROCK} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// 島の北端、ドニファン派のキャンプ。分裂の間だけ存在する。
function NorthCamp() {
  const [x, z] = NORTH;
  const y = islandHeight(x, z);
  return (
    <>
      <Solid x={x} z={z} r={1.3} />
      <group position={[x, y, z]}>
        <mesh castShadow position={[0, 0.75, 0]} rotation={[0, 0.4, 0]}>
          <coneGeometry args={[1.5, 1.8, 4]} />
          <meshStandardMaterial color="#c9bda0" flatShading />
        </mesh>
        {[...Array(5)].map((_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <mesh key={i} position={[3 + Math.cos(a) * 0.5, 0.08, Math.sin(a) * 0.5]}>
              <icosahedronGeometry args={[0.11, 0]} />
              <meshStandardMaterial color={ROCK} flatShading />
            </mesh>
          );
        })}
      </group>
      <CampBoy pos={[x - 2.2, z + 1.6]} palette={PALETTES.doniphan} />
      <CampBoy pos={[x + 1.4, z - 2.2]} palette={PALETTES.cross} />
      <CampBoy pos={[x - 1.2, z - 2.6]} palette={PALETTES.webb} scale={0.96} />
      <CampBoy pos={[x + 2.6, z + 1.2]} palette={PALETTES.wilcox} scale={0.97} />
    </>
  );
}

// フレンチ・デンの空にあがる、ブリアンの八角大凧。ゆっくり揺れる。
function Kite() {
  const group = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current.position.x = CAVE[0] + 8 + Math.sin(t * 0.4) * 3;
    group.current.position.y = 42 + Math.sin(t * 0.7) * 2;
    group.current.rotation.z = Math.sin(t * 0.5) * 0.15;
  });
  return (
    <group ref={group} position={[CAVE[0] + 8, 42, CAVE[1] + 6]}>
      <mesh rotation={[0.5, 0, 0]}>
        <circleGeometry args={[2.6, 8]} />
        <meshStandardMaterial color={SAIL} side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* 尾 */}
      <mesh position={[0, -3.4, 1.4]} rotation={[0.6, 0, 0]}>
        <planeGeometry args={[0.25, 4.5]} />
        <meshStandardMaterial color="#b9553a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 修理されたセヴァーン号のボート。帰郷の船。
function Boat() {
  const [x, z] = BOAT;
  const y = Math.max(islandHeight(x, z), -0.15);
  return (
    <group position={[x, y, z]} rotation={[0, 0.5, 0]}>
      <Solid x={x} z={z} r={2} />
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[5.4, 1.0, 1.9]} />
        <meshStandardMaterial color={HULL} flatShading />
      </mesh>
      <mesh castShadow position={[2.9, 0.62, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.35, 0.9, 1.35]} />
        <meshStandardMaterial color={HULL} flatShading />
      </mesh>
      <mesh position={[0, 1.08, 0]}>
        <boxGeometry args={[5.1, 0.1, 1.6]} />
        <meshStandardMaterial color={DECK} flatShading />
      </mesh>
      <mesh castShadow position={[0.4, 2.6, 0]}>
        <cylinderGeometry args={[0.07, 0.1, 3.2, 6]} />
        <meshStandardMaterial color="#6b4c30" flatShading />
      </mesh>
      {/* スルギ号の帆布を張った帆 */}
      <mesh position={[1.3, 2.8, 0]} rotation={[0, 0, -0.08]}>
        <planeGeometry args={[1.7, 2.1]} />
        <meshStandardMaterial color={SAIL} side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  );
}

// ボードワンの墓。土まんじゅうと木の十字架。花は少年たちが供えてから。
function BaudoinGrave({ flowers }: { flowers: boolean }) {
  const [x, z] = LANDMARKS.grave;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.9} />
      <mesh castShadow position={[0, 0.12, 0]} scale={[1, 0.4, 1.6]}>
        <sphereGeometry args={[0.7, 8, 6]} />
        <meshStandardMaterial color="#5a4a38" flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.85, -0.7]}>
        <boxGeometry args={[0.1, 1.2, 0.1]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.15, -0.7]}>
        <boxGeometry args={[0.62, 0.1, 0.1]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
      {flowers &&
        [
          [-0.25, 0.3],
          [0.2, 0.15],
          [0.02, 0.5],
        ].map(([fx, fz], i) => (
          <mesh key={i} position={[fx, 0.36, fz]}>
            <icosahedronGeometry args={[0.09, 0]} />
            <meshStandardMaterial
              color={['#d8dce8', '#e0c860', '#c87890'][i]}
              flatShading
            />
          </mesh>
        ))}
    </group>
  );
}

// 命名した場所に立てる木の道しるべ。
function Signpost({ pos }: { pos: [number, number] }) {
  const [x, z] = pos;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.35} />
      <mesh castShadow position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.5, 6]} />
        <meshStandardMaterial color="#6b4c30" flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.35, 0]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.95, 0.28, 0.06]} />
        <meshStandardMaterial color={DECK} flatShading />
      </mesh>
    </group>
  );
}

// ウィルコックスの括り罠。曲げた若木と仕掛け枠。
function TrapFrame() {
  const [x, z] = LANDMARKS.traps;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.5} />
      <mesh castShadow position={[0.5, 0.6, 0]} rotation={[0, 0, -0.7]}>
        <cylinderGeometry args={[0.04, 0.06, 1.7, 5]} />
        <meshStandardMaterial color="#5a6a3a" flatShading />
      </mesh>
      {[
        [-0.4, 0.4],
        [0.4, 0.4],
        [-0.4, -0.4],
        [0.4, -0.4],
      ].map(([sx, sz], i) => (
        <mesh key={i} castShadow position={[sx, 0.22, sz]}>
          <boxGeometry args={[0.07, 0.44, 0.07]} />
          <meshStandardMaterial color="#6b4c30" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.44, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.4, 0.03, 5, 8]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
    </group>
  );
}

// セヴァーン海岸の十字架。海で死んだ者たちのために。
function SevernCross() {
  const [x, z] = LANDMARKS.severn;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]} rotation={[0, -0.5, 0]}>
      <Solid x={x} z={z} r={0.5} />
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[0.14, 2.2, 0.14]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.6, 0]}>
        <boxGeometry args={[1.1, 0.14, 0.14]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
      {[...Array(5)].map((_, i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.45, 0.1, Math.sin(a) * 0.45]}>
            <icosahedronGeometry args={[0.12, 0]} />
            <meshStandardMaterial color={ROCK} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

// アザラシの岩。黒く丸い体が寝そべる。
function Seals() {
  const [x, z] = SEAL_ROCK;
  const y = Math.max(islandHeight(x, z), 0);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={1.6} />
      {[
        [0, 0, 0, 1],
        [1.4, 0.6, 2.2, 0.8],
        [-1.2, -0.8, 4.4, 0.7],
      ].map(([sx, sz, rot, sc], i) => (
        <group key={i} position={[sx, 0.18 * sc, sz]} rotation={[0, rot, 0]} scale={sc}>
          <mesh castShadow scale={[1, 0.55, 0.45]}>
            <sphereGeometry args={[0.85, 8, 6]} />
            <meshStandardMaterial color="#3a3a40" flatShading />
          </mesh>
          <mesh castShadow position={[0.75, 0.14, 0]} scale={[0.5, 0.42, 0.34]}>
            <sphereGeometry args={[0.5, 7, 5]} />
            <meshStandardMaterial color="#44444c" flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 天日製塩の岩場。海水を張った浅いくぼみ。
function SaltPans() {
  const [x, z] = SALT_ROCK;
  const y = Math.max(islandHeight(x, z), 0);
  return (
    <group position={[x, y, z]}>
      {[
        [0, 0],
        [0.9, 0.7],
        [-0.7, 0.9],
      ].map(([sx, sz], i) => (
        <group key={i} position={[sx, 0, sz]}>
          <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.42, 0.09, 5, 9]} />
            <meshStandardMaterial color={ROCK} flatShading />
          </mesh>
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.4, 9]} />
            <meshStandardMaterial color="#e8ecee" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 樹液の木。幹の切りこみと受けの手桶。
function SapBucket() {
  const [x, z] = SUGAR_TREE;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.55} />
      <mesh castShadow position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.28, 0.4, 3.2, 7]} />
        <meshStandardMaterial color="#5d4630" flatShading />
      </mesh>
      <mesh castShadow position={[0, 3.6, 0]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial color="#4c6a38" flatShading />
      </mesh>
      {/* 切りこみ */}
      <mesh position={[0.34, 1.0, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.16, 0.06, 0.2]} />
        <meshStandardMaterial color="#2c2118" />
      </mesh>
      {/* 手桶 */}
      <mesh castShadow position={[0.55, 0.22, 0]}>
        <cylinderGeometry args={[0.2, 0.16, 0.42, 8, 1, true]} />
        <meshStandardMaterial color={DECK} flatShading side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 犬のファン。十六人目の漂流者。尾を振りながら少年たちのそばにいる。
function Dog() {
  const flags = useGame((s) => s.flags);
  const tail = useRef<THREE.Mesh>(null!);
  const [x, z] = flags.cave_moved ? DOG_CAVE : DOG_BEACH;
  const y = islandHeight(x, z);

  useFrame(({ clock }) => {
    tail.current.rotation.y = Math.sin(clock.elapsedTime * 6) * 0.5;
  });

  return (
    <group position={[x, y, z]} rotation={[0, -0.6, 0]}>
      <Solid x={x} z={z} r={0.4} />
      {/* 胴体 */}
      <mesh castShadow position={[0, 0.42, 0]} scale={[0.42, 0.4, 0.85]}>
        <sphereGeometry args={[0.55, 8, 6]} />
        <meshStandardMaterial color="#8a6a44" flatShading />
      </mesh>
      {/* 脚 */}
      {[
        [-0.14, 0.28],
        [0.14, 0.28],
        [-0.14, -0.28],
        [0.14, -0.28],
      ].map(([lx, lz], i) => (
        <mesh key={i} castShadow position={[lx, 0.14, lz]}>
          <cylinderGeometry args={[0.05, 0.045, 0.3, 5]} />
          <meshStandardMaterial color="#7a5a38" flatShading />
        </mesh>
      ))}
      {/* 頭 */}
      <mesh castShadow position={[0, 0.66, 0.48]}>
        <boxGeometry args={[0.28, 0.24, 0.3]} />
        <meshStandardMaterial color="#8a6a44" flatShading />
      </mesh>
      {/* 鼻先 */}
      <mesh castShadow position={[0, 0.6, 0.68]}>
        <boxGeometry args={[0.16, 0.14, 0.18]} />
        <meshStandardMaterial color="#5a4228" flatShading />
      </mesh>
      {/* 耳 */}
      {[-0.1, 0.1].map((ex) => (
        <mesh key={ex} castShadow position={[ex, 0.82, 0.44]} rotation={[0.2, 0, ex * 3]}>
          <coneGeometry args={[0.06, 0.16, 4]} />
          <meshStandardMaterial color="#6b4c30" flatShading />
        </mesh>
      ))}
      {/* 尾 */}
      <mesh ref={tail} castShadow position={[0, 0.55, -0.5]} rotation={[-0.8, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.35, 5]} />
        <meshStandardMaterial color="#7a5a38" flatShading />
      </mesh>
    </group>
  );
}

// オークランドの丘の信号マスト。沖の船へ「ここに人がいる」と伝える旗。
function SignalMast() {
  const flag = useRef<THREE.Mesh>(null!);
  const [x, z] = SIGNAL_MAST;
  const y = islandHeight(x, z);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flag.current.rotation.y = Math.sin(t * 1.8) * 0.3;
  });

  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.5} />
      <mesh castShadow position={[0, 3, 0]}>
        <cylinderGeometry args={[0.07, 0.12, 6, 6]} />
        <meshStandardMaterial color="#6b4c30" flatShading />
      </mesh>
      <mesh ref={flag} castShadow position={[0.85, 5.4, 0]}>
        <planeGeometry args={[1.6, 1.0]} />
        <meshStandardMaterial color="#b9553a" side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* 支えの石 */}
      {[...Array(4)].map((_, i) => {
        const a = (i / 4) * Math.PI * 2 + 0.4;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.4, 0.12, Math.sin(a) * 0.4]}>
            <icosahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial color={ROCK} flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

// サーヴィスのナンドゥ（南米のダチョウ）。首を上下させながらたたずむ。
function Rhea() {
  const neck = useRef<THREE.Group>(null!);
  const [x, z] = RHEA;
  const y = islandHeight(x, z);

  useFrame(({ clock }) => {
    neck.current.rotation.x = Math.sin(clock.elapsedTime * 0.8) * 0.25 + 0.1;
  });

  return (
    <group position={[x, y, z]} rotation={[0, 1.1, 0]}>
      <Solid x={x} z={z} r={0.8} />
      {/* 胴体 */}
      <mesh castShadow position={[0, 1.05, 0]} scale={[0.75, 0.62, 1.05]}>
        <sphereGeometry args={[0.75, 8, 6]} />
        <meshStandardMaterial color="#8a8072" flatShading />
      </mesh>
      {/* 脚 */}
      {[-0.22, 0.22].map((sx) => (
        <mesh key={sx} castShadow position={[sx, 0.42, 0]}>
          <cylinderGeometry args={[0.05, 0.04, 0.85, 5]} />
          <meshStandardMaterial color="#b0a080" flatShading />
        </mesh>
      ))}
      {/* 首と頭 */}
      <group ref={neck} position={[0, 1.35, 0.6]}>
        <mesh castShadow position={[0, 0.45, 0.1]} rotation={[0.25, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.1, 1.0, 5]} />
          <meshStandardMaterial color="#9a9080" flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.95, 0.22]}>
          <sphereGeometry args={[0.16, 7, 5]} />
          <meshStandardMaterial color="#8a8072" flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.93, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.05, 0.22, 5]} />
          <meshStandardMaterial color="#c8b060" flatShading />
        </mesh>
      </group>
      {/* 尾羽 */}
      <mesh castShadow position={[0, 1.15, -0.75]} rotation={[0.7, 0, 0]}>
        <coneGeometry args={[0.3, 0.6, 6]} />
        <meshStandardMaterial color="#736a5c" flatShading />
      </mesh>
      {/* 囲いの杭 */}
      {[...Array(6)].map((_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * 2.2, 0.4, Math.sin(a) * 2.2]}>
            <cylinderGeometry args={[0.05, 0.06, 0.8, 5]} />
            <meshStandardMaterial color="#6b4c30" flatShading />
          </mesh>
        );
      })}
    </group>
  );
}

// モコの台所。焚き火脇の焼き串と調理台。
function Kitchen() {
  const [x, z] = KITCHEN;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.7} />
      {/* 焼き串（二本の叉木＋横棒） */}
      {[-0.5, 0.5].map((sx) => (
        <mesh key={sx} castShadow position={[sx, 0.4, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.8, 5]} />
          <meshStandardMaterial color="#6b4c30" flatShading />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.74, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 1.2, 5]} />
        <meshStandardMaterial color="#8a6844" flatShading />
      </mesh>
      {/* 串刺しの鳥 */}
      <mesh castShadow position={[0, 0.74, 0]} scale={[1.4, 0.8, 0.9]}>
        <sphereGeometry args={[0.16, 7, 5]} />
        <meshStandardMaterial color="#a8703c" flatShading />
      </mesh>
      {/* 調理台の石 */}
      <mesh castShadow position={[0.9, 0.18, 0.5]} scale={[1, 0.4, 0.8]}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={ROCK} flatShading />
      </mesh>
    </group>
  );
}

// 冬支度の薪の山。積むほど高くなる。
function Woodpile({ grown }: { grown: boolean }) {
  const [x, z] = WOODPILE;
  const y = islandHeight(x, z);
  const layers = grown ? 4 : 2;
  return (
    <group position={[x, y, z]}>
      <Solid x={x} z={z} r={0.8} />
      {[...Array(layers)].map((_, row) =>
        [...Array(4 - Math.floor(row / 2))].map((_, i) => (
          <mesh
            key={`${row}-${i}`}
            castShadow
            position={[(i - 1.5 + (row % 2) * 0.5) * 0.34, 0.16 + row * 0.28, 0]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.13, 0.15, 1.5, 5]} />
            <meshStandardMaterial color="#7a5a38" flatShading />
          </mesh>
        )),
      )}
    </group>
  );
}

// グアナコの囲い。柵と、首の長い獣たち。
function GuanacoCorral() {
  const [x, z] = CORRAL;
  const y = islandHeight(x, z);
  return (
    <group position={[x, y, z]}>
      {/* 囲いの中の獣をすり抜けない */}
      <Solid x={x + 0.8} z={z - 0.5} r={0.9} />
      <Solid x={x - 1.1} z={z + 0.9} r={0.9} />
      {/* 柵 */}
      {[...Array(10)].map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={i} castShadow position={[Math.cos(a) * 3.2, 0.5, Math.sin(a) * 3.2]}>
            <cylinderGeometry args={[0.06, 0.07, 1.0, 5]} />
            <meshStandardMaterial color="#6b4c30" flatShading />
          </mesh>
        );
      })}
      {[
        [0.8, -0.5, 0.6, 1],
        [-1.1, 0.9, 2.4, 0.85],
      ].map(([gx, gz, rot, sc], i) => (
        <group key={i} position={[gx, 0, gz]} rotation={[0, rot, 0]} scale={sc}>
          {/* 胴体 */}
          <mesh castShadow position={[0, 0.85, 0]} scale={[0.55, 0.5, 0.95]}>
            <sphereGeometry args={[0.7, 8, 6]} />
            <meshStandardMaterial color="#b08d5e" flatShading />
          </mesh>
          {/* 脚 */}
          {[
            [-0.18, 0.35],
            [0.18, 0.35],
            [-0.18, -0.35],
            [0.18, -0.35],
          ].map(([lx, lz], j) => (
            <mesh key={j} castShadow position={[lx, 0.35, lz]}>
              <cylinderGeometry args={[0.05, 0.04, 0.7, 5]} />
              <meshStandardMaterial color="#9a7a50" flatShading />
            </mesh>
          ))}
          {/* 首と頭 */}
          <mesh castShadow position={[0, 1.35, 0.5]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.11, 0.8, 5]} />
            <meshStandardMaterial color="#b08d5e" flatShading />
          </mesh>
          <mesh castShadow position={[0, 1.72, 0.68]} scale={[0.8, 1, 1.3]}>
            <sphereGeometry args={[0.14, 7, 5]} />
            <meshStandardMaterial color="#a8845a" flatShading />
          </mesh>
          {/* 耳 */}
          {[-0.07, 0.07].map((ex) => (
            <mesh key={ex} castShadow position={[ex, 1.86, 0.62]}>
              <coneGeometry args={[0.04, 0.14, 4]} />
              <meshStandardMaterial color="#9a7a50" flatShading />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
