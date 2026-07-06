import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useGame, isUiLocked } from '../store/gameStore';
import { timePhase } from '../systems/TimeSystem';
import { resetGame } from '../systems/SaveSystem';
import { guidance } from '../guidance';

// Layer 1: HUD。認知負荷最小 — 日付/時刻、進行中の目標、生活パラメータ、所持品、
// インタラクトのプロンプトのみ。世界そのものに語らせる。

const overlay: CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  color: '#fff',
  textShadow: '0 1px 4px rgba(0,0,0,0.45)',
  zIndex: 10,
};

export function HUD({ onHome, onRestart }: { onHome?: () => void; onRestart?: () => void } = {}) {
  const pack = useGame((s) => s.pack);
  const time = useGame((s) => s.time);
  const params = useGame((s) => s.params);
  const inventory = useGame((s) => s.inventory);
  const quests = useGame((s) => s.quests);
  const nearby = useGame((s) => s.nearby);
  const setJournalOpen = useGame((s) => s.setJournalOpen);
  const uiLocked = useGame(isUiLocked);

  if (!pack) return null;

  const activeQuest = quests.find((q) => q.status === 'active');
  const questDef = activeQuest ? pack.quests[activeQuest.id] : null;
  const nearbyDef = nearby ? pack.interactables.find((d) => d.id === nearby) : null;
  const items = Object.entries(inventory).filter(([, n]) => n > 0);

  // 目標が切り替わったら、右上のパネルを一瞬光らせて「新しい目標」に気づかせる。
  const [questFlash, setQuestFlash] = useState(false);
  const prevQuestId = useRef<string | undefined>(undefined);
  useEffect(() => {
    const id = questDef?.id;
    if (!id || id === prevQuestId.current) return;
    prevQuestId.current = id;
    setQuestFlash(true);
    const timer = setTimeout(() => setQuestFlash(false), 2800);
    return () => clearTimeout(timer);
  }, [questDef?.id]);

  return (
    <div style={overlay}>
      {/* 左上: タイトル・日付・時刻 */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(18px + env(safe-area-inset-top))',
          left: 'calc(24px + env(safe-area-inset-left))',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: 2, opacity: 0.9 }}>
          {pack.title}
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
          第{time.day}日 {timePhase(time.hour)}{' '}
          {String(time.hour).padStart(2, '0')}:{String(time.minute).padStart(2, '0')}
        </div>
      </div>

      {/* 右上: 目標・手帳・リセット */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(18px + env(safe-area-inset-top))',
          right: 'calc(24px + env(safe-area-inset-right))',
          textAlign: 'right',
        }}
      >
        {questDef && (
          <div
            style={{
              background: 'rgba(12,22,34,0.55)',
              borderRadius: 8,
              padding: '8px 14px',
              marginBottom: 8,
              maxWidth: 280,
              boxShadow: questFlash
                ? '0 0 0 2px rgba(232,213,155,0.9), 0 0 20px rgba(232,213,155,0.55)'
                : '0 0 0 0 rgba(232,213,155,0)',
              transition: 'box-shadow 0.5s',
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1 }}>
              {questFlash ? '新しい目標' : '目標'}
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 2 }}>{questDef.title}</div>
            <div style={{ fontSize: 11.5, opacity: 0.8, marginTop: 2 }}>
              {questDef.description}
            </div>
            <QuestGuide />
          </div>
        )}
        <div style={{ pointerEvents: 'auto', display: 'inline-flex', gap: 8 }}>
          <HudButton onClick={() => setJournalOpen(true)}>手帳 (J)</HudButton>
          {onHome && <HudButton onClick={onHome}>ホーム</HudButton>}
          <HudButton
            onClick={() => {
              if (confirm('最初からやり直しますか？（セーブデータを消します）')) {
                if (onRestart) onRestart();
                else void resetGame(pack.id);
              }
            }}
          >
            最初から
          </HudButton>
        </div>
      </div>

      {/* 左下: 生活パラメータ（会話・ナレーション中は隠して重なりを防ぐ） */}
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(18px + env(safe-area-inset-bottom))',
          left: 'calc(24px + env(safe-area-inset-left))',
          width: 180,
          opacity: uiLocked ? 0 : 1,
          transition: 'opacity 0.3s',
        }}
      >
        {Object.entries(pack.parameters)
          .filter(([, def]) => def.display !== false)
          .map(([key, def]) => (
            <ParameterBar
              key={key}
              label={def.label}
              value={params[key] ?? def.initial}
              max={def.max}
            />
          ))}
      </div>

      {/* 右下: 所持品 */}
      {items.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(18px + env(safe-area-inset-bottom))',
            right: 'calc(24px + env(safe-area-inset-right))',
            textAlign: 'right',
            opacity: uiLocked ? 0 : 1,
            transition: 'opacity 0.3s',
          }}
        >
          {items.map(([id, n]) => (
            <span
              key={id}
              style={{
                display: 'inline-block',
                background: 'rgba(12,22,34,0.55)',
                borderRadius: 6,
                padding: '5px 10px',
                marginLeft: 6,
                fontSize: 12.5,
              }}
            >
              {pack.items[id]?.label ?? id} × {n}
            </span>
          ))}
        </div>
      )}

      {/* 中央下: インタラクトのプロンプト */}
      {nearbyDef && (
        <div
          style={{
            position: 'absolute',
            bottom: 'calc(90px + env(safe-area-inset-bottom))',
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              background: 'rgba(12,22,34,0.72)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8,
              padding: '8px 18px',
              fontSize: 14,
            }}
          >
            <b
              style={{
                background: '#e8d59b',
                color: '#222',
                borderRadius: 4,
                padding: '1px 7px',
                marginRight: 9,
                fontSize: 12,
              }}
            >
              E
            </b>
            {nearbyDef.prompt}
          </span>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 'calc(4px + env(safe-area-inset-bottom))',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 10.5,
          opacity: 0.45,
        }}
      >
        WASD：移動　ドラッグ：カメラ　E：調べる　J：手帳
      </div>
    </div>
  );
}

// 目標地点への方向矢印と距離。3D世界（Waypoint）が毎フレーム書き込む guidance を rAF で読む。
// 「▲」は上向き＝正面。カメラの向きに対して目標がどちらかを、矢印を回して示す。
function QuestGuide() {
  const [g, setG] = useState({ active: false, distance: 0, relAngle: 0 });
  const last = useRef({ active: false, d: -1, a: 0 });

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const d = Math.round(guidance.distance);
      const a = guidance.relAngle;
      // 表示が変わるときだけ再描画（毎フレームの再レンダを避ける）。
      if (
        guidance.active !== last.current.active ||
        d !== last.current.d ||
        Math.abs(a - last.current.a) > 0.03
      ) {
        last.current = { active: guidance.active, d, a };
        setG({ active: guidance.active, distance: guidance.distance, relAngle: a });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!g.active) return null;
  const arrived = g.distance <= 3;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 8,
        paddingTop: 7,
        borderTop: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <span style={{ fontSize: 11.5, opacity: 0.85 }}>
        {arrived ? 'このあたりだ' : `目標地点まで 約${Math.round(g.distance)}m`}
      </span>
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'rgba(232,213,155,0.18)',
          border: '1px solid rgba(232,213,155,0.5)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            fontSize: 14,
            lineHeight: 1,
            color: '#f0dca0',
            transform: arrived ? 'none' : `rotate(${g.relAngle}rad)`,
          }}
        >
          {arrived ? '◎' : '▲'}
        </span>
      </span>
    </div>
  );
}

function ParameterBar({ label, value, max }: { label: string; value: number; max: number }) {
  const ratio = Math.max(0, Math.min(1, value / max));
  const low = ratio < 0.25;
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ fontSize: 10.5, opacity: 0.85, marginBottom: 2 }}>
        {label} {Math.round(value)}
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: 'rgba(0,0,0,0.4)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${ratio * 100}%`,
            height: '100%',
            borderRadius: 3,
            background: low ? '#e06c50' : '#8fd17a',
            transition: 'width 0.4s',
          }}
        />
      </div>
    </div>
  );
}

function HudButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'rgba(12,22,34,0.55)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 6,
        color: '#fff',
        fontSize: 11.5,
        padding: '5px 10px',
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
