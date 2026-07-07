import { useEffect, useState } from 'react';
import { isIOS, isStandalone, fullscreenSupported } from '../fullscreen';

// Layer 1: iPhone の Safari は「要素の全画面API」を持たないため、ブラウザのままでは
// URLバーを消せない。真の全画面はホーム画面に追加した PWA でのみ得られる。
// そこで、対象端末（=全画面API非対応の iOS・非スタンドアロン）に限り、
// 追加方法を一度だけ静かに案内する。Android/デスクトップには出さない。

const SEEN_KEY = 'ng_ios_fs_hint_v1';

export function InstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY)) return;
    // 要素の全画面APIが使える端末（Android等）はボタンで全画面にできるので案内不要。
    if (!isIOS() || isStandalone() || fullscreenSupported()) return;
    const appear = window.setTimeout(() => setShow(true), 1400);
    const auto = window.setTimeout(() => close(), 15000);
    return () => {
      window.clearTimeout(appear);
      window.clearTimeout(auto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => {
    setShow(false);
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* プライベートブラウズ等で書けなくても致命ではない */
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(10px + env(safe-area-inset-top))',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        maxWidth: 'min(440px, 92vw)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(20,30,42,0.92)',
        border: '1px solid rgba(232,213,155,0.45)',
        borderRadius: 10,
        padding: '10px 12px 10px 14px',
        color: '#f2ede2',
        pointerEvents: 'auto',
        boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
        fontSize: 12.5,
        lineHeight: 1.6,
      }}
    >
      {/* iOS 共有ボタン（□に上矢印）を模した目印 */}
      <span
        style={{
          flex: 'none',
          width: 26,
          height: 26,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e8d59b',
        }}
        aria-hidden
      >
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path
            d="M9 1.5V12M9 1.5L5.5 5M9 1.5L12.5 5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 8H2.5V18.5H15.5V8H14"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span style={{ flex: 1 }}>
        全画面で遊ぶには、ブラウザの<b style={{ color: '#e8d59b' }}>共有</b>ボタン →
        <b style={{ color: '#e8d59b' }}>「ホーム画面に追加」</b>
        。アプリのように起動でき、URLバーが消えます。
      </span>
      <button
        onClick={close}
        style={{
          flex: 'none',
          alignSelf: 'flex-start',
          background: 'transparent',
          border: 'none',
          color: '#f2ede2',
          opacity: 0.7,
          fontSize: 18,
          lineHeight: 1,
          padding: 2,
          cursor: 'pointer',
        }}
        aria-label="閉じる"
      >
        ×
      </button>
    </div>
  );
}
