import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGame } from '../../../engine/store/gameStore';
import { GhostApparition } from './GhostApparition';

// Layer 3: ハムレットの情景オーバーレイ。
// 冒頭は「亡霊の胸壁」を城の世界(World)の上に重ねる。
// oath フラグ（ハムレットが復讐を誓った瞬間）が立つとフェードアウトし、
// 下のエルシノア城（中庭）が現れる＝亡霊が去り、物語が始まる演出。

export function HamletOverlay() {
  const oath = useGame((s) => !!s.flags.oath);
  const [mounted, setMounted] = useState(!oath);
  const [visible, setVisible] = useState(!oath);

  useEffect(() => {
    if (oath) {
      setVisible(false);
      const t = window.setTimeout(() => setMounted(false), 1600);
      return () => window.clearTimeout(t);
    }
    setMounted(true);
    setVisible(true);
  }, [oath]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.5s ease',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 48, near: 0.5, far: 200, position: [0, 3.1, 13] }}
        resize={{ offsetSize: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <GhostApparition />
      </Canvas>
    </div>
  );
}
