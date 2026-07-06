import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGame } from '../../../engine/store/gameStore';
import { ShipVoyage } from './ShipVoyage';

// Layer 3: 場面ごとの情景オーバーレイ。
// 物語のフラグに応じて、島の世界(World)の上に専用シーンを重ねる。
// 現状は冒頭の「嵐のスルギ号」。ashore フラグ（浜に乗り上げた瞬間）が立つと
// フェードアウトして、下の島（浜辺）が現れる＝漂着の演出。

export function Cinematic() {
  const ashore = useGame((s) => !!s.flags.ashore);
  const [mounted, setMounted] = useState(!ashore);
  const [visible, setVisible] = useState(!ashore);

  useEffect(() => {
    if (ashore) {
      // 乗り上げ → フェードアウトしてから撤収
      setVisible(false);
      const t = window.setTimeout(() => setMounted(false), 1500);
      return () => window.clearTimeout(t);
    }
    setMounted(true);
    setVisible(true);
  }, [ashore]);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: visible ? 1 : 0,
        transition: 'opacity 1.4s ease',
      }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 46, near: 0.5, far: 600, position: [2, 7.2, 25] }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ShipVoyage />
      </Canvas>
    </div>
  );
}
