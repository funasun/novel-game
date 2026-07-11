import { useFrame } from '@react-three/fiber';
import { playerPosition } from '../playerState';
import { useGame, isUiLocked } from '../store/gameStore';

// Layer 1: 場所の発見。pack.landmarks に近づくと visitLandmark が呼ばれ、
// トースト表示＋手帳の地図タブに点灯する。場所の意味はコンテンツ側のみが知る。

export function DiscoverySystem() {
  useFrame(() => {
    const s = useGame.getState();
    const landmarks = s.pack?.landmarks;
    if (!landmarks || isUiLocked(s)) return;
    for (const lm of landmarks) {
      if (s.visitedLandmarks[lm.id]) continue;
      const dx = lm.position[0] - playerPosition.x;
      const dz = lm.position[1] - playerPosition.z;
      if (Math.hypot(dx, dz) < (lm.radius ?? 10)) {
        s.visitLandmark(lm.id);
        break; // 1フレーム1件（トーストが折り重ならないように）
      }
    }
  });
  return null;
}
