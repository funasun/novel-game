import { useGame } from '../store/gameStore';

// Layer 1: ナレーションUI。画面を落として一文ずつ見せる。物語の「地の文」。

export function NarrationOverlay() {
  const narration = useGame((s) => s.narration);
  const advance = useGame((s) => s.advanceNarration);

  if (!narration) return null;

  return (
    <div
      onClick={advance}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(4, 8, 14, 0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        cursor: 'pointer',
        zIndex: 20,
      }}
    >
      <div
        style={{
          maxWidth: 640,
          padding: '0 32px',
          color: '#e8e2d4',
          fontSize: 19,
          lineHeight: 2.2,
          textAlign: 'center',
          letterSpacing: 1.5,
          textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        }}
      >
        {narration.lines[narration.index]}
        <div style={{ fontSize: 12, opacity: 0.45, marginTop: 28 }}>クリックで進む</div>
      </div>
    </div>
  );
}
