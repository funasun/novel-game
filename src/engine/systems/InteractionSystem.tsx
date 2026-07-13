import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { playerPosition } from '../playerState';
import { useGame, isUiLocked, totalMinutes } from '../store/gameStore';
import { paramCondMet, type InteractableDef } from '../types';

// Layer 1: 近接インタラクト。プレイヤーの近くにある対象を検出し、Eキーで実行する。
// 対象の定義（場所・効果）はすべてコンテンツ側データ。

export function interactableActive(
  def: InteractableDef,
  flags: Record<string, boolean>,
  used: Record<string, boolean>,
  usedAt?: Record<string, number>,
  nowMinutes?: number,
  inventory?: Record<string, number>,
  params?: Record<string, number>,
): boolean {
  if (def.once && used[def.id]) return false;
  if (def.requiresFlag && !flags[def.requiresFlag]) return false;
  if (def.hideFlag && flags[def.hideFlag]) return false;
  // 採集資源のクールダウン：使ってからゲーム内で所定時間たつまで休眠
  if (def.cooldownHours && usedAt && nowMinutes !== undefined) {
    const at = usedAt[def.id];
    if (at !== undefined && nowMinutes - at < def.cooldownHours * 60) return false;
  }
  // 供える・渡す・払う：持ち物や心の状態（残高）が満ちているときだけ現れる
  if (def.requiresItems) {
    for (const [item, n] of Object.entries(def.requiresItems)) {
      if (((inventory ?? {})[item] ?? 0) < n) return false;
    }
  }
  if (def.requiresParam && !paramCondMet(def.requiresParam, params ?? {})) return false;
  return true;
}

// 近接対象を実行する。Eキーとタッチの「調べる」ボタンが同じ経路を通る。
export function triggerInteract(): void {
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
  if (def.cooldownHours) {
    useGame.setState({
      usedAt: { ...s.usedAt, [def.id]: totalMinutes(s.time) },
      nearby: null,
    });
  }
  s.applyEffects(def.effects);
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
    const now = totalMinutes(s.time);
    for (const def of s.pack.interactables) {
      if (!interactableActive(def, s.flags, s.usedInteractables, s.usedAt, now, s.inventory, s.params))
        continue;
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
      triggerInteract();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return null;
}
