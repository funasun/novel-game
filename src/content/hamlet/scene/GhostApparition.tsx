import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Layer 3: 冒頭の情景「亡き父王の亡霊」。
// エルシノアの胸壁、真夜中。甲冑をまとった亡王が霧の中に現れ、手招きする——を全プロシージャルで。
// 城の世界(World)とは独立した専用シーン。HamletOverlay から呼ばれる。

export function GhostApparition() {
  return (
    <>
      <color attach="background" args={['#070b12']} />
      <fog attach="fog" args={['#070b12', 12, 60]} />
      <CameraRig />
      <MidnightLights />
      <Starfield />
      <Moon />
      <Parapet />
      <Ghost />
      <Mist />
    </>
  );
}

// カメラは胸壁の上、亡霊を正面からとらえ、息をのむようにわずかに寄る。
function CameraRig() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    camera.position.set(
      Math.sin(t * 0.16) * 0.9,
      3.1 + Math.sin(t * 0.4) * 0.16,
      13 - Math.min(t * 0.25, 2.4), // 徐々に寄る
    );
    camera.lookAt(0, 3.0, 0);
  });
  return null;
}

// 月と星のわずかな光。亡霊の青白い燐光は Ghost 側の pointLight が担う。
function MidnightLights() {
  return (
    <>
      <hemisphereLight args={['#2a3550', '#05070c', 0.5]} />
      <ambientLight intensity={0.22} color="#3a4560" />
      {/* 月光（斜め後方から差し、甲冑の輪郭を光らせる） */}
      <directionalLight position={[-8, 16, -10]} intensity={0.55} color="#aebfe0" />
      {/* 手前からの淡い補助光（真っ黒つぶれ防止） */}
      <directionalLight position={[4, 8, 12]} intensity={0.18} color="#4b5a7a" />
    </>
  );
}

// 冷たい月。うっすらとハロをまとう。
function Moon() {
  return (
    <group position={[-9, 15, -26]}>
      <mesh>
        <circleGeometry args={[2.4, 40]} />
        <meshBasicMaterial color="#d7e0f2" />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <circleGeometry args={[3.6, 40]} />
        <meshBasicMaterial color="#8fa0c8" transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

function Starfield() {
  const positions = useMemo(() => {
    const COUNT = 260;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // 上空のドーム状にばらまく
      const r = 40 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.42;
      arr[i * 3] = Math.cos(theta) * Math.sin(phi) * r;
      arr[i * 3 + 1] = Math.cos(phi) * r * 0.7 + 6;
      arr[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r - 20;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c8d2ea" size={0.22} transparent opacity={0.75} sizeAttenuation />
    </points>
  );
}

// 手前の胸壁（クレネル＝銃眼つきの石垣）。亡霊はこの上の巡回路に立つ。
function Parapet() {
  const merlons = useMemo(() => {
    const xs: number[] = [];
    for (let x = -12; x <= 12; x += 2.4) xs.push(x);
    return xs;
  }, []);
  return (
    <group position={[0, 0, 5.4]}>
      {/* 石壁の本体 */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[30, 2.4, 1.4]} />
        <meshStandardMaterial color="#2b3038" roughness={1} flatShading />
      </mesh>
      {/* 天端の帯 */}
      <mesh position={[0, 1.7, 0]}>
        <boxGeometry args={[30, 0.3, 1.7]} />
        <meshStandardMaterial color="#353b45" roughness={1} flatShading />
      </mesh>
      {/* クレネル（銃眼の歯形） */}
      {merlons.map((x, i) => (
        <mesh key={i} position={[x, 2.15, 0]}>
          <boxGeometry args={[1.3, 0.7, 1.5]} />
          <meshStandardMaterial color="#31373f" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// 亡き父王の亡霊。甲冑、青白い燐光、半透明。宙にわずかに浮かび、ゆらめき、手招きする。
function Ghost() {
  const root = useRef<THREE.Group>(null!);
  const arm = useRef<THREE.Group>(null!);
  const glow = useRef<THREE.PointLight>(null!);
  const mats = useRef<THREE.MeshStandardMaterial[]>([]);
  const register = (m: THREE.MeshStandardMaterial | null) => {
    if (m && !mats.current.includes(m)) mats.current.push(m);
  };

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // 浮遊：ゆっくり上下し、左右にたゆたう
    root.current.position.y = 0.35 + Math.sin(t * 0.9) * 0.14;
    root.current.position.x = Math.sin(t * 0.5) * 0.12;
    root.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    // 手招き（前腕をゆっくり上下）
    arm.current.rotation.x = -1.1 + Math.sin(t * 1.6) * 0.5;
    // 燐光のまたたき
    const pulse = 0.62 + Math.sin(t * 2.2) * 0.16 + Math.sin(t * 5.7) * 0.05;
    for (const m of mats.current) {
      m.opacity = pulse;
      m.emissiveIntensity = 0.7 + Math.sin(t * 2.2) * 0.2;
    }
    if (glow.current) glow.current.intensity = 5 + Math.sin(t * 2.2) * 1.8;
  });

  // 甲冑の青白い燐光マテリアル（共通の見た目）
  const armor = (color: string, emissive = '#9fc4ff') => (
    <meshStandardMaterial
      ref={register}
      color={color}
      emissive={emissive}
      emissiveIntensity={0.7}
      transparent
      opacity={0.62}
      roughness={0.35}
      metalness={0.5}
      flatShading
      depthWrite={false}
    />
  );

  return (
    <group ref={root} position={[0, 0.35, 0]}>
      <pointLight ref={glow} position={[0, 2.2, 0.6]} intensity={5} color="#9fc4ff" distance={16} decay={1.4} />

      {/* 脚（グリーヴ） */}
      <mesh position={[0.28, 0.7, 0]}>
        <boxGeometry args={[0.34, 1.4, 0.36]} />
        {armor('#7f93b8')}
      </mesh>
      <mesh position={[-0.28, 0.7, 0]}>
        <boxGeometry args={[0.34, 1.4, 0.36]} />
        {armor('#7f93b8')}
      </mesh>

      {/* 胴（胸当て）——下すぼまり */}
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[0.98, 1.2, 0.62]} />
        {armor('#93a7cc')}
      </mesh>
      <mesh position={[0, 1.42, 0.02]}>
        <boxGeometry args={[0.7, 0.5, 0.5]} />
        {armor('#7f93b8')}
      </mesh>
      {/* 腰帯 */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.86, 0.22, 0.56]} />
        {armor('#6d80a4')}
      </mesh>

      {/* 肩当て（ポールドロン） */}
      <mesh position={[0.62, 2.5, 0]}>
        <boxGeometry args={[0.44, 0.34, 0.6]} />
        {armor('#a2b6da')}
      </mesh>
      <mesh position={[-0.62, 2.5, 0]}>
        <boxGeometry args={[0.44, 0.34, 0.6]} />
        {armor('#a2b6da')}
      </mesh>

      {/* 左腕（体側に垂れる） */}
      <mesh position={[-0.66, 1.95, 0]}>
        <boxGeometry args={[0.26, 1.0, 0.28]} />
        {armor('#8497bd')}
      </mesh>

      {/* 右腕（手招き）——肩を支点に前腕を上げる */}
      <group ref={arm} position={[0.66, 2.44, 0]}>
        <mesh position={[0, -0.4, 0.15]}>
          <boxGeometry args={[0.26, 0.9, 0.28]} />
          {armor('#8497bd')}
        </mesh>
        <mesh position={[0, -0.82, 0.34]}>
          <boxGeometry args={[0.2, 0.24, 0.2]} />
          {armor('#9fb0d2')}
        </mesh>
      </group>

      {/* 首・兜 */}
      <mesh position={[0, 2.78, 0]}>
        <boxGeometry args={[0.34, 0.2, 0.34]} />
        {armor('#7f93b8')}
      </mesh>
      <mesh position={[0, 3.08, 0]}>
        <boxGeometry args={[0.5, 0.56, 0.5]} />
        {armor('#9fb2d6')}
      </mesh>
      {/* 面頬（バイザー）の暗い横帯 */}
      <mesh position={[0, 3.06, 0.26]}>
        <boxGeometry args={[0.44, 0.12, 0.06]} />
        <meshStandardMaterial
          ref={register}
          color="#0b1220"
          emissive="#12203a"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
          roughness={0.6}
          flatShading
          depthWrite={false}
        />
      </mesh>
      {/* 王冠 */}
      <Crown register={register} />
    </group>
  );
}

function Crown({
  register,
}: {
  register: (m: THREE.MeshStandardMaterial | null) => void;
}) {
  const points = useMemo(() => [0, 1, 2, 3, 4].map((i) => (i - 2) * 0.16), []);
  return (
    <group position={[0, 3.42, 0]}>
      <mesh>
        <cylinderGeometry args={[0.3, 0.3, 0.16, 10]} />
        <meshStandardMaterial
          ref={register}
          color="#d9c07a"
          emissive="#caa94e"
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
          roughness={0.4}
          metalness={0.7}
          flatShading
          depthWrite={false}
        />
      </mesh>
      {points.map((x, i) => (
        <mesh key={i} position={[x, 0.16, 0]}>
          <coneGeometry args={[0.05, 0.18, 4]} />
          <meshStandardMaterial
            ref={register}
            color="#e6cf8c"
            emissive="#caa94e"
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
            roughness={0.4}
            metalness={0.7}
            flatShading
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// 地を這う夜霧。Points をゆっくり漂わせ、端で巻き戻す。
function Mist() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 240;
  const RANGE_X = 46;
  const RANGE_Z = 30;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * RANGE_X;
      arr[i * 3 + 1] = Math.random() * 2.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * RANGE_Z - 2;
    }
    return arr;
  }, []);

  useFrame((_, dt) => {
    const pos = ref.current.geometry.attributes.position;
    const a = pos.array as Float32Array;
    const dx = Math.min(dt, 0.05) * 1.4;
    for (let i = 0; i < COUNT; i++) {
      a[i * 3] += dx;
      if (a[i * 3] > RANGE_X / 2) a[i * 3] = -RANGE_X / 2;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7b88a0" size={1.7} transparent opacity={0.16} sizeAttenuation depthWrite={false} />
    </points>
  );
}
