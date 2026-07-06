import { useEffect, useState } from 'react';
import type { ContentPack, ComingSoonEntry } from '../types';
import { loadGame } from '../systems/SaveSystem';

// Layer 1: ホーム画面（作品の書架）。登録された作品パックを並べ、選んで遊ぶ。
// エンジンは中身を知らない——タイトル・作者・惹句・アクセント色はパック側のメタデータ。

interface Props {
  packs: ContentPack[];
  comingSoon: ComingSoonEntry[];
  onSelect: (pack: ContentPack, fresh: boolean) => void;
  busy?: boolean;
}

export function HomeScreen({ packs, comingSoon, onSelect, busy }: Props) {
  const [saves, setSaves] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    void Promise.all(
      packs.map((p) => loadGame(p.id).then((s) => [p.id, !!s] as const)),
    ).then((entries) => {
      if (alive) setSaves(Object.fromEntries(entries));
    });
    return () => {
      alive = false;
    };
  }, [packs]);

  return (
    <div style={screen}>
      <style>{css}</style>

      <div style={{ textAlign: 'center', marginBottom: 34 }}>
        <div style={kicker}>PUBLIC-DOMAIN CLASSICS · PLAYABLE</div>
        <h1 style={wordmark}>名作をあそぶ</h1>
        <div style={tagline}>世界文学を、暮らして味わう。</div>
      </div>

      <div style={shelf}>
        {packs.map((p) => (
          <StoryCard
            key={p.id}
            title={p.title}
            author={p.author}
            blurb={p.blurb}
            accent={p.accent ?? '#3a6ea5'}
            motif={p.id}
            hasSave={saves[p.id]}
            busy={busy}
            onContinue={() => onSelect(p, false)}
            onNew={() => {
              if (!saves[p.id] || confirm('最初からはじめますか？（いまのセーブは上書きされます）')) {
                onSelect(p, true);
              }
            }}
          />
        ))}
        {comingSoon.map((c) => (
          <StoryCard
            key={c.id}
            title={c.title}
            author={c.author}
            blurb={c.blurb}
            accent={c.accent ?? '#555'}
            motif={c.id}
            comingSoon
          />
        ))}
      </div>

      <div style={footNote}>データはこの端末に自動保存されます · いつでも作品を切り替えられます</div>
    </div>
  );
}

function StoryCard({
  title,
  author,
  blurb,
  accent,
  motif,
  hasSave,
  busy,
  comingSoon,
  onContinue,
  onNew,
}: {
  title: string;
  author?: string;
  blurb?: string;
  accent: string;
  motif: string;
  hasSave?: boolean;
  busy?: boolean;
  comingSoon?: boolean;
  onContinue?: () => void;
  onNew?: () => void;
}) {
  return (
    <div className={`card ${comingSoon ? 'soon' : ''}`}>
      <div
        style={{
          height: 108,
          background: `linear-gradient(135deg, ${accent} 0%, ${shade(accent, -34)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Motif id={motif} />
        {comingSoon && <div style={soonRibbon}>準備中</div>}
        {hasSave && !comingSoon && <div style={saveBadge}>つづきあり</div>}
      </div>

      <div style={{ padding: '16px 18px 18px' }}>
        {author && <div style={authorLine}>{author}</div>}
        <div style={cardTitle}>{title}</div>
        {blurb && <div style={cardBlurb}>{blurb}</div>}

        <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
          {comingSoon ? (
            <button className="btn" style={btnGhost} disabled>
              近日公開
            </button>
          ) : hasSave ? (
            <>
              <button className="btn btn-primary" disabled={busy} onClick={onContinue}>
                つづきから
              </button>
              <button className="btn" style={btnGhost} disabled={busy} onClick={onNew}>
                はじめから
              </button>
            </>
          ) : (
            <button className="btn btn-primary" disabled={busy} onClick={onNew}>
              はじめる
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 作品ごとの簡素なモチーフ（プロシージャルSVG）
function Motif({ id }: { id: string }) {
  const stroke = 'rgba(255,255,255,0.72)';
  if (id === 'two-years-vacation') {
    return (
      <svg width="150" height="90" viewBox="0 0 150 90" fill="none" style={motifStyle}>
        <path d="M75 14 L75 52" stroke={stroke} strokeWidth="2.4" />
        <path d="M75 20 L98 48 L75 48 Z" fill="rgba(255,255,255,0.5)" />
        <path d="M75 24 L54 50 L75 50 Z" fill="rgba(255,255,255,0.32)" />
        <path d="M52 52 L98 52 L92 62 L58 62 Z" fill="rgba(255,255,255,0.6)" />
        <path d="M12 72 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0" stroke={stroke} strokeWidth="2" />
        <path d="M6 82 q12 -8 24 0 t24 0 t24 0 t24 0 t24 0 t24 0" stroke="rgba(255,255,255,0.45)" strokeWidth="2" />
      </svg>
    );
  }
  if (id === 'hamlet') {
    // 王冠
    return (
      <svg width="140" height="90" viewBox="0 0 140 90" fill="none" style={motifStyle}>
        <path
          d="M40 60 L34 30 L54 46 L70 24 L86 46 L106 30 L100 60 Z"
          fill="rgba(255,255,255,0.5)"
          stroke={stroke}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M38 66 L102 66" stroke={stroke} strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="34" cy="28" r="3.4" fill="rgba(255,255,255,0.8)" />
        <circle cx="70" cy="22" r="3.6" fill="rgba(255,255,255,0.85)" />
        <circle cx="106" cy="28" r="3.4" fill="rgba(255,255,255,0.8)" />
      </svg>
    );
  }
  // 既定：開いた本
  return (
    <svg width="130" height="84" viewBox="0 0 130 84" fill="none" style={motifStyle}>
      <path d="M65 22 C50 12 28 12 16 18 L16 64 C28 58 50 58 65 66 Z" fill="rgba(255,255,255,0.42)" stroke={stroke} strokeWidth="2" />
      <path d="M65 22 C80 12 102 12 114 18 L114 64 C102 58 80 58 65 66 Z" fill="rgba(255,255,255,0.5)" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

// アクセント色を暗くする簡易ユーティリティ
function shade(hex: string, amt: number): string {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, '$1$1') : h, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp((n >> 16) + amt);
  const g = clamp(((n >> 8) & 0xff) + amt);
  const b = clamp((n & 0xff) + amt);
  return `rgb(${r},${g},${b})`;
}

const screen: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  overflowY: 'auto',
  background:
    'radial-gradient(ellipse at 50% 0%, #1b2b3f 0%, #0d1622 55%, #070d15 100%)',
  color: '#e9e4d6',
  fontFamily: '"Hiragino Mincho ProN", "Yu Mincho", serif',
};

const kicker: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: 4,
  opacity: 0.55,
  fontFamily: 'system-ui, sans-serif',
};
const wordmark: React.CSSProperties = {
  fontSize: 42,
  fontWeight: 700,
  letterSpacing: 6,
  margin: '10px 0 6px',
};
const tagline: React.CSSProperties = { fontSize: 14, opacity: 0.7, letterSpacing: 2 };

const shelf: React.CSSProperties = {
  display: 'flex',
  gap: 22,
  flexWrap: 'wrap',
  justifyContent: 'center',
  maxWidth: 760,
};

const footNote: React.CSSProperties = {
  marginTop: 30,
  fontSize: 11,
  opacity: 0.4,
  letterSpacing: 1,
  fontFamily: 'system-ui, sans-serif',
  textAlign: 'center',
};

const authorLine: React.CSSProperties = {
  fontSize: 11.5,
  letterSpacing: 1.5,
  opacity: 0.6,
  fontFamily: 'system-ui, sans-serif',
};
const cardTitle: React.CSSProperties = { fontSize: 23, fontWeight: 700, letterSpacing: 2, marginTop: 3 };
const cardBlurb: React.CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.8,
  opacity: 0.75,
  marginTop: 9,
  minHeight: 66,
};

const motifStyle: React.CSSProperties = { filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.35))' };

const soonRibbon: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  right: -30,
  transform: 'rotate(38deg)',
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  fontSize: 11,
  letterSpacing: 2,
  padding: '3px 34px',
  fontFamily: 'system-ui, sans-serif',
};
const saveBadge: React.CSSProperties = {
  position: 'absolute',
  top: 10,
  left: 10,
  background: 'rgba(0,0,0,0.4)',
  color: '#fff',
  fontSize: 10.5,
  letterSpacing: 1,
  padding: '3px 9px',
  borderRadius: 20,
  fontFamily: 'system-ui, sans-serif',
};
const btnGhost: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid rgba(255,255,255,0.28)',
  color: '#e9e4d6',
};

const css = `
.card {
  width: 300px;
  background: rgba(17, 27, 40, 0.72);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 34px rgba(0,0,0,0.42);
  animation: card-in 0.55s cubic-bezier(0.2,0.8,0.2,1) both;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}
.card:hover { transform: translateY(-4px); box-shadow: 0 18px 44px rgba(0,0,0,0.5); }
.card.soon { opacity: 0.62; }
.card.soon:hover { transform: none; }
@keyframes card-in { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
.btn {
  flex: 1;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: system-ui, sans-serif;
  border: 1px solid transparent;
  transition: filter 0.15s ease, opacity 0.15s ease;
}
.btn:hover:not(:disabled) { filter: brightness(1.12); }
.btn:disabled { cursor: default; opacity: 0.5; }
.btn-primary { background: #e8d59b; color: #23324a; font-weight: 700; }
`;
