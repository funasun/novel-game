import { ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { DayNightRig } from './DayNightRig';
import { TimeSystem } from './systems/TimeSystem';
import { InteractionSystem } from './systems/InteractionSystem';
import { DiscoverySystem } from './systems/DiscoverySystem';
import { Waypoint } from './Waypoint';

// Layer 1: 3Dシーンの器。昼夜ライティング・時間進行・インタラクト検出・ポストプロセスを内蔵。
// 作品固有の地形やオブジェクトは children として受け取る（Worldは作品を知らない）。

export function World({ children }: { children: ReactNode }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ fov: 50, near: 0.5, far: 1400, position: [0, 25, 40] }}
      resize={{ offsetSize: true }}
      style={{ position: 'absolute', inset: 0 }}
      onCreated={(state) => {
        // 開発時のみ：E2E/デバッグ用に three の scene/camera を公開
        if (import.meta.env.DEV) {
          (window as unknown as Record<string, unknown>).__three = state;
        }
      }}
    >
      <color attach="background" args={['#aee2f5']} />
      <fog attach="fog" args={['#c3e4ee', 140, 800]} />
      <DayNightRig />
      <TimeSystem />
      <InteractionSystem />
      <DiscoverySystem />
      {children}
      <Waypoint />
      <EffectComposer>
        <Bloom intensity={0.35} luminanceThreshold={0.8} mipmapBlur />
        <Vignette eskil={false} offset={0.25} darkness={0.5} />
      </EffectComposer>
    </Canvas>
  );
}
