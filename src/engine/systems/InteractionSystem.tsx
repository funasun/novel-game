import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { playerPosition } from '../playerState';
import { useGame, isUiLocked } from '../store/gameStore';
import type { InteractableDef } from '../types';

// Layer 1: 近接インタラクト。プレイヤーの近くにある対象を検出し、Eキーで実行する。
// 対象の定義（場所・効果）はすべてコンテンツ側データ。

export function interactableActive(
  def: InteractableDef,
  flags: Record<string, boolean>,
  used: Record<string, boolean>,
): boolean {
  if (def.once && used[def.id]) return false;
  if (def.requiresFlag && !flags[def.requiresFlag]) return false;
  if (def.hideFlag && flags[def.hideFlag]) return false;
  return true;
}

export function InteractionSystem() {
  useFrame(() => {
    const s = useGame.getState();
    if (!s.pack) return;
    if (isUiLocked(s)) {
      s.setNearby(null);
      return;
    }
    let best: string | null = null;
    let bestDist = Infinity;
    for (const def of s.pack.interactables) {
      if (!interactableActive(def, s.flags, s.usedInteractables)) continue;
      const dx = def.position[0] - playerPosition.x;
      const dz = def.position[1] - playerPosition.z;
      const dist = Math.hypot(dx, dz);
      if (dist < (def.radius ?? 2.4) && dist < bestDist) {
        best = def.id;
        bestDist = dist;
      }
    }
    s.setNearby(best);
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyE') return;
      const s = useGame.getState();
      if (!s.pack || !s.nearby || isUiLocked(s)) return;
      const def = s.pack.interactables.find((d) => d.id === s.nearby);
      if (!def) return;
      if (def.once) {
        useGame.setState({
          usedInteractables: { ...s.usedInteractables, [def.id]: true },
          nearby: null,
        });
      }
      s.applyEffects(def.effects);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
