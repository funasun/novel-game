import { useEffect } from 'react';
import { useGame } from '../store/gameStore';

// Layer 1: 「〜を見つけた」バナー。発見の高揚を一瞬だけ画面に。数秒で消える。

export function DiscoveryToast() {
  const id = useGame((s) => s.discoveryToast);
  const pack = useGame((s) => s.pack);
  const dismiss = useGame((s) => s.dismissDiscovery);

  useEffect(() => {
    if (!id) return;
    const timer = setTimeout(dismiss, 4200);
    return () => clearTimeout(timer);
  }, [id, dismiss]);

  if (!id || !pack?.landmarks) return null;
  const lm = pack.landmarks.find((l) => l.id === id);
  if (!lm) return null;

  return (
    <div
      key={id}
      style={{
        position: 'absolute',
        top: 'calc(16% + env(safe-area-inset-top))',
        left: 0,
        right: 0,
        textAlign: 'center',
        pointerEvents: 'none',
        zIndex: 12,
        animation: 'discovery-in 0.5s ease-out',
      }}
    >
      <style>{`@keyframes discovery-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
      <span
        style={{
          background: 'rgba(12, 22, 34, 0.72)',
          border: '1px solid rgba(232, 213, 155, 0.55)',
          borderRadius: 10,
          padding: '10px 26px',
          color: '#f4e9c8',
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: 2,
          textShadow: '0 1px 4px rgba(0,0,0,0.5)',
          boxShadow: '0 4px 18px rgba(0,0,0,0.35)',
        }}
      >
        <span style={{ color: '#f0dca0', marginRight: 10 }}>◈</span>
        {lm.label}
        <span style={{ fontSize: 12.5, fontWeight: 400, opacity: 0.8, marginLeft: 10 }}>
          を見つけた
        </span>
      </span>
    </div>
  );
}
