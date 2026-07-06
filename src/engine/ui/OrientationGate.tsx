import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

// Layer 1: 画面の向きを制御するゲート。
// このゲームは横画面（ランドスケープ）前提。縦画面でアクセスした場合は
// 「横画面推奨」を案内し、5秒後に自動で横向きへ切り替える。
// iOS Safari は screen.orientation.lock を持たないため、CSS 回転で確実に横画面化する。

const COUNTDOWN_SEC = 5;

function usePortrait(): boolean {
  const [portrait, setPortrait] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(orientation: portrait)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(orientation: portrait)');
    const update = () => setPortrait(mq.matches);
    update();
    mq.addEventListener('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      mq.removeEventListener('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);
  return portrait;
}

export function OrientationGate({ children }: { children: ReactNode }) {
  const portrait = usePortrait();
  const [forced, setForced] = useState(false);
  const [count, setCount] = useState(COUNTDOWN_SEC);
  const timerRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!portrait) {
      // 実際に横向きになった → 案内も強制回転もリセット
      setForced(false);
      setCount(COUNTDOWN_SEC);
      window.clearInterval(timerRef.current);
      return;
    }

    // Android/Chrome の PWA では OS 側でロックできる。iOS では例外→無視。
    const orientation = screen.orientation as (ScreenOrientation & {
      lock?: (o: string) => Promise<void>;
    }) | undefined;
    orientation?.lock?.('landscape').catch(() => {});

    setForced(false);
    setCount(COUNTDOWN_SEC);
    window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          window.clearInterval(timerRef.current);
          setForced(true);
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerRef.current);
  }, [portrait]);

  const rotate = portrait && forced;

  // 強制回転時：ビューポートを 90° 回して、縦画面上に横画面のレイアウトを敷く。
  // vw/vh はビューポート基準のままなので、幅=100vh・高さ=100vw で論理的に横長になる。
  const wrapperStyle: CSSProperties = rotate
    ? {
        position: 'absolute',
        top: 0,
        left: '100vw',
        width: '100vh',
        height: '100vw',
        transformOrigin: 'top left',
        transform: 'rotate(90deg)',
        overflow: 'hidden',
      }
    : { position: 'absolute', inset: 0 };

  return (
    <>
      <div style={wrapperStyle}>{children}</div>
      {portrait && !forced && (
        <RotatePrompt count={count} onNow={() => setForced(true)} />
      )}
    </>
  );
}

function RotatePrompt({ count, onNow }: { count: number; onNow: () => void }) {
  return (
    <div
      onClick={onNow}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: '#0b1d2a',
        color: '#f2ede2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 26,
        padding: 32,
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: "'Hiragino Kaku Gothic ProN', 'Yu Gothic', sans-serif",
      }}
    >
      <style>{`@keyframes ng-rotate-hint {
        0%, 40% { transform: rotate(0deg); }
        70%, 100% { transform: rotate(90deg); }
      }`}</style>
      <div
        style={{
          width: 66,
          height: 108,
          borderRadius: 12,
          border: '3px solid #e8d59b',
          animation: 'ng-rotate-hint 1.8s ease-in-out infinite',
          position: 'relative',
          flex: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 7,
            width: 18,
            height: 3,
            borderRadius: 2,
            background: '#e8d59b',
            transform: 'translateX(-50%)',
          }}
        />
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: 2 }}>
        横画面でのプレイを推奨します
      </div>
      <div style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.7 }}>
        端末を横向きにしてください。
        <br />
        あと <b style={{ color: '#e8d59b', fontSize: 18 }}>{count}</b> 秒で自動的に横画面へ切り替えます。
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          border: '1px solid rgba(255,255,255,0.4)',
          borderRadius: 8,
          padding: '9px 20px',
          opacity: 0.9,
        }}
      >
        今すぐ横画面にする
      </div>
    </div>
  );
}
