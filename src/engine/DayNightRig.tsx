import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from './store/gameStore';

// Layer 1: 昼夜サイクルのライティング。時刻から太陽位置・光量・空気の色を導出する。
// 6:00 日の出 / 18:00 日の入り。

const DAY_FOG = new THREE.Color('#c3e4ee');
const NIGHT_FOG = new THREE.Color('#16283c');
const DAY_BG = new THREE.Color('#aee2f5');
const NIGHT_BG = new THREE.Color('#101f33');
const SUN_HIGH = new THREE.Color('#fff1da');
const SUN_LOW = new THREE.Color('#ff9a5a');
const MOON = new THREE.Color('#8fa8ff');

export function DayNightRig() {
  const time = useGame((s) => s.time);
  const scene = useThree((s) => s.scene);

  const t = time.hour + time.minute / 60;
  const theta = ((t - 6) / 12) * Math.PI;
  const sunY = Math.sin(theta);
  // +0.18 のオフセットで 6:00/18:00 ちょうどでも真っ暗にならない（薄明を表現）
  const dayness = THREE.MathUtils.clamp((sunY + 0.18) * 1.5, 0, 1);
  const isNight = sunY < 0.02;

  const sunPos = useMemo<[number, number, number]>(
    () => [Math.cos(theta) * 150, Math.max(sunY, -0.4) * 150, 60],
    [theta, sunY],
  );

  // フォグと背景は既存オブジェクトを直接更新（World が生成済み）
  if (scene.fog) scene.fog.color.copy(NIGHT_FOG.clone().lerp(DAY_FOG, dayness));
  if (scene.background instanceof THREE.Color) {
    scene.background.copy(NIGHT_BG.clone().lerp(DAY_BG, dayness));
  }

  const sunColor = useMemo(() => {
    if (isNight) return `#${MOON.getHexString()}`;
    const c = SUN_LOW.clone().lerp(SUN_HIGH, Math.pow(dayness, 0.7));
    return `#${c.getHexString()}`;
  }, [isNight, dayness]);

  const lightPos: [number, number, number] = isNight ? [-80, 100, -60] : sunPos;
  const intensity = isNight ? 0.35 : 0.35 + 1.35 * Math.pow(dayness, 0.7);

  return (
    <>
      <Sky
        distance={4000}
        sunPosition={sunPos}
        turbidity={5}
        rayleigh={isNight ? 0.3 : 1.1}
        mieCoefficient={0.004}
        mieDirectionalG={0.85}
      />
      {isNight && <Stars radius={600} depth={60} count={2500} factor={5} fade speed={0.6} />}
      <hemisphereLight args={['#cfeaff', '#93a06e', 0.28 + 0.45 * dayness]} />
      <directionalLight
        castShadow
        position={lightPos}
        intensity={intensity}
        color={sunColor}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-130}
        shadow-camera-right={130}
        shadow-camera-top={130}
        shadow-camera-bottom={-130}
        shadow-camera-near={10}
        shadow-camera-far={400}
        shadow-bias={-0.0004}
      />
    </>
  );
}
