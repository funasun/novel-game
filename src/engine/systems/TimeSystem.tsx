import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGame, isUiLocked } from '../store/gameStore';

// Layer 1: 時間進行。実時間1秒 = ゲーム内2分（1日 = 実時間12分）。
// 会話・ナレーション・手帳を開いている間は止まる。行動による時間消費は effects.minutes 側。

const MINUTES_PER_SECOND = 2;

export function TimeSystem() {
  const acc = useRef(0);
  useFrame((_, delta) => {
    const s = useGame.getState();
    if (!s.pack || isUiLocked(s)) return;
    acc.current += Math.min(delta, 0.1) * MINUTES_PER_SECOND;
    if (acc.current >= 1) {
      const mins = Math.floor(acc.current);
      acc.current -= mins;
      s.advanceMinutes(mins);
    }
  });
  return null;
}

export function timePhase(hour: number): string {
  if (hour < 5) return '深夜';
  if (hour < 8) return '朝';
  if (hour < 11) return '午前';
  if (hour < 15) return '昼';
  if (hour < 18) return '夕方';
  if (hour < 21) return '夜';
  return '深夜';
}
