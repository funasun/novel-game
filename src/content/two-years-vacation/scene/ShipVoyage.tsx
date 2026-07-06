import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Layer 3: 冒頭の情景「嵐のスルギ号」。
// 漂着前、少年たちだけを乗せた帆船が嵐の海を流されていく——を全プロシージャルで描く。
// 島の世界(World)とは独立した専用シーン。Cinematic から呼ばれる。

export function ShipVoyage() {
  return (
    <>
      <color attach="background" args={['#0a141f']} />
      <fog attach="fog" args={['#0a141f', 24, 130]} />
      <CameraRig />
      <StormLights />
      <StormOcean />
      <Schooner />
      <Rain />
    </>
  );
}

// カメラは船を横手からとらえ、うねりに合わせてゆっくり揺れる。
function CameraRig() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    camera.position.set(2 + Math.sin(t * 0.28) * 0.7, 7.2 + Math.sin(t * 0.5) * 0.35, 25);
    camera.lookAt(0, 4.2, 0);
  });
  return null;
}

// 月明かりと稲光。flashRef を不定期に光らせて雷を表現。
function StormLights() {
  const flash = useRef<THREE.PointLight>(null!);
  const phase = useRef(2 + Math.random() * 3);
  const decay = useRef(0);

  useFrame((_, dt) => {
    phase.current -= dt;
    if (phase.current <= 0) {
      decay.current = 1; // 発光開始
      phase.current = 2.5 + Math.random() * 5; // 次の雷まで
    }
    if (decay.current > 0) decay.current = Math.max(0, decay.current - dt * 3.2);
    if (flash.current) {
      // 二段のフリッカーで稲光らしく
      const f = decay.current;
      flash.current.intensity = (f > 0.6 ? 1 : f) * 900 * f;
    }
  });

  return (
    <>
      <hemisphereLight args={['#4a5a72', '#0c1119', 0.75]} />
      <ambientLight intensity={0.42} color="#54617a" />
      {/* 月光（カメラ側から当てて船体と帆を見せる） */}
      <directionalLight position={[10, 20, 18]} intensity={0.85} color="#a9bcd8" />
      {/* 反対側からの淡い補助光（真っ黒つぶれ防止） */}
      <directionalLight position={[-16, 12, -6]} intensity={0.3} color="#3f5170" />
      {/* 稲光（上空から） */}
      <pointLight ref={flash} position={[6, 30, 12]} intensity={0} color="#e6ecff" distance={200} decay={0.4} />
    </>
  );
}

// 荒れた海。大きなうねりを頂点変位で。
function StormOcean() {
  const mesh = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(420, 420, 90, 90);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const base = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = mesh.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const z = base[i * 3 + 2];
      pos.setY(
        i,
        Math.sin(x * 0.06 + t * 1.4) * 0.9 +
          Math.sin(z * 0.08 + t * 1.0) * 0.7 +
          Math.sin((x + z) * 0.03 + t * 0.6) * 0.5,
      );
    }
    pos.needsUpdate = true;
    mesh.current.geometry.computeVertexNormals();
  });

  return (
    <group>
      <mesh ref={mesh} geometry={geometry} position={[0, 0.6, 0]}>
        <meshStandardMaterial color="#16323f" roughness={0.55} metalness={0.1} flatShading />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[420, 420]} />
        <meshStandardMaterial color="#0a1a22" roughness={1} />
      </mesh>
    </group>
  );
}

// 二本マストのスクーナー、スルギ号。うねりに合わせてローリング＆ピッチング。
function Schooner() {
  const ship = useRef<THREE.Group>(null!);
  const foreSail = useRef<THREE.Mesh>(null!);
  const mainSail = useRef<THREE.Mesh>(null!);
  const flag = useRef<THREE.Mesh>(null!);

  const hullGeo = useMemo(() => {
    // 側面シルエット（X=船首尾方向, Y=上下）を押し出して船体に。
    const s = new THREE.Shape();
    s.moveTo(-5.5, 0.9); // 船尾トランザム上
    s.lineTo(-5.6, 2.0);
    s.lineTo(4.6, 2.0);
    s.lineTo(6.4, 1.3); // 反り上がった船首
    s.lineTo(4.4, 0.15);
    s.lineTo(-4.4, 0.05); // キール
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 2.5,
      bevelEnabled: true,
      bevelThickness: 0.18,
      bevelSize: 0.18,
      bevelSegments: 1,
      steps: 1,
    });
    g.translate(0, 0, -1.25);
    g.computeVertexNormals();
    return g;
  }, []);

  const foreSailGeo = useMemo(() => triangleSail(-3.1, 4.1), []);
  const mainSailGeo = useMemo(() => triangleSail(-3.6, 5.0), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // うねり：ロール（Z）＋ピッチ（X）＋ヒーブ（Y）
    ship.current.rotation.z = Math.sin(t * 0.9) * 0.16;
    ship.current.rotation.x = Math.sin(t * 0.7 + 1.0) * 0.06;
    ship.current.position.y = 0.7 + Math.sin(t * 0.8) * 0.5;
    // 帆のはためき
    foreSail.current.rotation.y = Math.sin(t * 3.1) * 0.14;
    mainSail.current.rotation.y = Math.sin(t * 2.7 + 0.8) * 0.16;
    flag.current.rotation.y = Math.sin(t * 7) * 0.6;
  });

  return (
    <group ref={ship} position={[0, 0.7, 0]}>
      {/* 船体 */}
      <mesh geometry={hullGeo} castShadow>
        <meshStandardMaterial color="#5a3d28" roughness={0.85} flatShading />
      </mesh>
      {/* 喫水下の帯 */}
      <mesh position={[0.2, 0.25, 0]}>
        <boxGeometry args={[10.6, 0.4, 2.65]} />
        <meshStandardMaterial color="#3a2718" roughness={0.9} flatShading />
      </mesh>
      {/* 甲板 */}
      <mesh position={[0.3, 2.02, 0]}>
        <boxGeometry args={[10.6, 0.14, 2.1]} />
        <meshStandardMaterial color="#6f4d31" roughness={0.9} flatShading />
      </mesh>
      {/* 舷牆（ブルワーク） */}
      <mesh position={[0.3, 2.32, 1.05]}>
        <boxGeometry args={[10.4, 0.5, 0.12]} />
        <meshStandardMaterial color="#4f3721" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[0.3, 2.32, -1.05]}>
        <boxGeometry args={[10.4, 0.5, 0.12]} />
        <meshStandardMaterial color="#4f3721" roughness={0.9} flatShading />
      </mesh>
      {/* 船尾の船室 */}
      <mesh position={[-3.6, 2.6, 0]}>
        <boxGeometry args={[2.4, 0.95, 1.7]} />
        <meshStandardMaterial color="#6b4a30" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-3.6, 3.15, 0]}>
        <boxGeometry args={[2.5, 0.16, 1.8]} />
        <meshStandardMaterial color="#402a19" roughness={0.9} flatShading />
      </mesh>

      {/* 前マスト */}
      <Mast x={2.4} height={8.4} />
      {/* メインマスト（後方が高い＝スクーナー） */}
      <Mast x={-1.6} height={9.6} />

      {/* バウスプリット（船首の突き出し） */}
      <mesh position={[6.4, 2.5, 0]} rotation={[0, 0, 0.32]}>
        <cylinderGeometry args={[0.09, 0.11, 3.4, 6]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.9} flatShading />
      </mesh>

      {/* 帆（縦帆・三角）。storm でやや小さめ＝リーフした状態 */}
      <mesh ref={foreSail} geometry={foreSailGeo} position={[2.4, 2.15, 0.06]}>
        <meshStandardMaterial color="#d8d1bf" roughness={1} side={THREE.DoubleSide} flatShading />
      </mesh>
      <mesh ref={mainSail} geometry={mainSailGeo} position={[-1.6, 2.15, -0.06]}>
        <meshStandardMaterial color="#cfc8b5" roughness={1} side={THREE.DoubleSide} flatShading />
      </mesh>

      {/* マスト頂の吹き流し */}
      <mesh ref={flag} position={[-1.6, 11.4, 0]}>
        <planeGeometry args={[1.0, 0.5]} />
        <meshStandardMaterial color="#b23a2e" side={THREE.DoubleSide} flatShading />
      </mesh>
    </group>
  );
}

function Mast({ x, height }: { x: number; height: number }) {
  return (
    <group position={[x, 2.0, 0]} rotation={[0, 0, -0.02]}>
      <mesh position={[0, height / 2, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.16, height, 6]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.9} flatShading />
      </mesh>
      {/* ブーム（下桁）：水平に寝かせて後方へ */}
      <mesh position={[-1.4, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 3.2, 6]} />
        <meshStandardMaterial color="#3a2a1c" roughness={0.9} flatShading />
      </mesh>
    </group>
  );
}

// 三角帆のジオメトリ（マスト沿いの縦辺＝luff、下辺＝foot）。
function triangleSail(width: number, height: number): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  const v = new Float32Array([
    0, 0, 0, // タック（マスト下）
    0, height, 0, // ヘッド（マスト上）
    width, 0.2, 0, // クリュー（後方下）
  ]);
  g.setAttribute('position', new THREE.BufferAttribute(v, 3));
  g.computeVertexNormals();
  return g;
}

// 吹きつける雨。Points を落下＆風で斜めに流し、下端で上へ巻き戻す。
function Rain() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 650;
  const RANGE_X = 60;
  const RANGE_Y = 34;
  const RANGE_Z = 50;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * RANGE_X;
      arr[i * 3 + 1] = Math.random() * RANGE_Y;
      arr[i * 3 + 2] = (Math.random() - 0.3) * RANGE_Z;
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    const pos = ref.current.geometry.attributes.position;
    const a = pos.array as Float32Array;
    const dy = Math.min(dt, 0.05) * 42;
    for (let i = 0; i < COUNT; i++) {
      a[i * 3 + 1] -= dy;
      a[i * 3] -= dy * 0.35; // 風で斜めに
      if (a[i * 3 + 1] < 0) {
        a[i * 3 + 1] = RANGE_Y;
        a[i * 3] = (Math.random() - 0.5) * RANGE_X;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aebccc" size={0.16} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}
