import { useCallback, useEffect, useState } from 'react';
import { useGame, isUiLocked } from '../store/gameStore';
import { isTouchDevice } from '../fullscreen';

// Layer 1: はじめての操作案内。開幕の演出が明けて操作可能になったら一度だけ出し、
// 最初の移動か「とじる」で消える。localStorage に記録して再訪時は出さない。
// 操作(WASD/E/J)はエンジン共通の仕組みなので、作品を問わずエンジン側で案内する。

const SEEN_KEY = 'ng_tutorial_v1';
const MOVE_KEYS = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export function ControlsTutorial() {
  const pack = useGame((s) => s.pack);
  const uiLocked = useGame(isUiLocked);
  const [touch] = useState(() => isTouchDevice());
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [ready, setReady] = useState(false);

  const close = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* localStorage 不可でも動作継続 */
    }
  }, []);

  // 開幕のナレーション/会話が明けて、少し間をおいてから出す（演出の合間の点滅を避ける）。
  useEffect(() => {
    if (dismissed || uiLocked) return;
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, [dismissed, uiLocked]);

  // 最初に歩き出したら（キーボードは移動キー、タッチは最初の操作で）、そっと閉じる。
  useEffect(() => {
    if (dismissed) return;
    const onKey = (e: KeyboardEvent) => {
      if (MOVE_KEYS.includes(e.code)) close();
    };
    window.addEventListener('keydown', onKey);
    // タッチ端末では移動はジョイスティック（キー入力が無い）ため、世界への最初のタッチで閉じる。
    const onPointer = () => close();
    if (touch) window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (touch) window.removeEventListener('pointerdown', onPointer);
    };
  }, [dismissed, close, touch]);

  if (!pack || dismissed || uiLocked || !ready) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '17%',
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 20,
      }}
    >
      <div
        style={{
          pointerEvents: 'auto',
          width: 'min(380px, 88vw)',
          background: 'rgba(20, 28, 40, 0.9)',
          border: '1px solid rgba(232,213,155,0.45)',
          borderRadius: 12,
          padding: '18px 22px',
          color: '#eef1f6',
          boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
            color: '#f0dca0',
            marginBottom: 12,
          }}
        >
          あそびかた
        </div>
        {touch ? (
          <>
            <Row keys="左半分">ドラッグで歩く</Row>
            <Row keys="右半分">ドラッグで見まわす</Row>
            <Row keys="調べる">近づくと出るボタンで調べる</Row>
            <Row keys="手帳">持ちもの・目標・学び</Row>
          </>
        ) : (
          <>
            <Row keys="WASD / 矢印">歩く</Row>
            <Row keys="ドラッグ">まわりを見まわす</Row>
            <Row keys="E">近づいて人や物を調べる</Row>
            <Row keys="J">手帳（持ちもの・目標・学び）</Row>
          </>
        )}
        <div style={{ fontSize: 12, lineHeight: 1.7, opacity: 0.82, marginTop: 10 }}>
          迷ったら、右上の<b style={{ color: '#f0dca0' }}>「目標」</b>と、
          遠くに立つ<b style={{ color: '#f0dca0' }}>光の柱</b>を目印に進もう。
        </div>
        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <button
            onClick={close}
            style={{
              background: 'rgba(232,213,155,0.16)',
              border: '1px solid rgba(232,213,155,0.5)',
              borderRadius: 8,
              color: '#f0dca0',
              fontSize: 12.5,
              padding: '7px 22px',
              cursor: 'pointer',
            }}
          >
            はじめる
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ keys, children }: { keys: string; children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '7px 0' }}>
      <span
        style={{
          minWidth: 84,
          textAlign: 'center',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.22)',
          borderRadius: 6,
          fontSize: 11.5,
          fontWeight: 700,
          padding: '4px 8px',
        }}
      >
        {keys}
      </span>
      <span style={{ fontSize: 13, opacity: 0.92 }}>{children}</span>
    </div>
  );
}
