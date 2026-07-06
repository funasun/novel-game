import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useGame } from '../store/gameStore';

// Layer 1: 教育の核「答え合わせ」。体験の直後に、さりげなく短い挿話を出す。
// 全画面講義にはしない。手帳（ジャーナル）に静かに蓄積される。

export function LearningToast() {
  const toastId = useGame((s) => s.learningToast);
  const pack = useGame((s) => s.pack);
  const dismiss = useGame((s) => s.dismissLearning);

  useEffect(() => {
    if (!toastId) return;
    const timer = setTimeout(dismiss, 14000);
    return () => clearTimeout(timer);
  }, [toastId, dismiss]);

  if (!toastId || !pack) return null;
  const def = pack.learnings[toastId];
  if (!def) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: 'absolute',
        left: 24,
        bottom: 110,
        width: 'min(340px, 75vw)',
        background: 'rgba(38, 32, 22, 0.92)',
        border: '1px solid rgba(214, 190, 140, 0.45)',
        borderRadius: 8,
        padding: '12px 16px',
        color: '#efe6cf',
        pointerEvents: 'auto',
        cursor: 'pointer',
        boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
      }}
    >
      <div style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1, marginBottom: 4 }}>
        ✎ 手帳に記した
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 6 }}>{def.title}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.75, opacity: 0.9 }}>{def.body}</div>
    </div>
  );
}

export function Journal() {
  const open = useGame((s) => s.journalOpen);
  const setOpen = useGame((s) => s.setJournalOpen);
  const journal = useGame((s) => s.journal);
  const pack = useGame((s) => s.pack);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyJ') setOpen(!useGame.getState().journalOpen);
      if (e.code === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  if (!open || !pack) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(4, 8, 14, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        zIndex: 30,
      }}
      onClick={() => setOpen(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(560px, 90vw)',
          maxHeight: '76vh',
          overflowY: 'auto',
          background: '#2b2518',
          border: '1px solid rgba(214, 190, 140, 0.5)',
          borderRadius: 10,
          padding: '22px 26px',
          color: '#efe6cf',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2, marginBottom: 4 }}>
          手帳
        </div>

        <Objectives />
        <Inventory />

        <SectionHeader>学んだこと</SectionHeader>
        {journal.length === 0 && (
          <div style={{ fontSize: 13, opacity: 0.6 }}>まだ何も記されていない。</div>
        )}
        {journal.map((id) => {
          const def = pack.learnings[id];
          if (!def) return null;
          return (
            <div
              key={id}
              style={{ borderTop: '1px solid rgba(214,190,140,0.2)', padding: '12px 0' }}
            >
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{def.title}</div>
              <div style={{ fontSize: 12.5, lineHeight: 1.75, opacity: 0.88 }}>{def.body}</div>
              <div style={{ fontSize: 10.5, opacity: 0.5, marginTop: 5 }}>
                {def.tags.map((t) => `#${t}`).join('  ')}
              </div>
            </div>
          );
        })}
        <CharacterRoster />
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 12, textAlign: 'center' }}>
          J または Esc で閉じる
        </div>
      </div>
    </div>
  );
}

// 手帳の見出し（各セクション共通）。
function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: 2,
        marginTop: 22,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

// いまの目標（進行中クエスト）と、たどってきた道（達成済み）。「途中で何をすべきか」を手帳で確認できる。
function Objectives() {
  const quests = useGame((s) => s.quests);
  const pack = useGame((s) => s.pack);
  if (!pack || quests.length === 0) return null;
  const active = quests.filter((q) => q.status === 'active');
  const done = quests.filter((q) => q.status === 'done');
  return (
    <>
      <SectionHeader>いまの目標</SectionHeader>
      {active.length === 0 && (
        <div style={{ fontSize: 12.5, opacity: 0.6, padding: '4px 0' }}>
          いまは、心のむくままに。
        </div>
      )}
      {active.map((q) => {
        const def = pack.quests[q.id];
        if (!def) return null;
        return (
          <div key={q.id} style={{ padding: '7px 0' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700 }}>
              <span style={{ color: '#f0dca0', marginRight: 8 }}>◇</span>
              {def.title}
            </div>
            <div style={{ fontSize: 12, opacity: 0.82, marginTop: 3, marginLeft: 22 }}>
              {def.description}
            </div>
          </div>
        );
      })}
      {done.length > 0 && (
        <div style={{ marginTop: 6, paddingTop: 8, borderTop: '1px solid rgba(214,190,140,0.2)' }}>
          {done.map((q) => {
            const def = pack.quests[q.id];
            if (!def) return null;
            return (
              <div
                key={q.id}
                style={{ fontSize: 12, opacity: 0.5, padding: '3px 0', marginLeft: 2 }}
              >
                <span style={{ color: '#8fd17a', marginRight: 8 }}>✓</span>
                {def.title}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

// 持ちもの（所持品）。HUD右下は一時表示なので、腰を据えて確認できる場所を手帳に置く。
function Inventory() {
  const inventory = useGame((s) => s.inventory);
  const pack = useGame((s) => s.pack);
  if (!pack) return null;
  const items = Object.entries(inventory).filter(([, n]) => n > 0);
  return (
    <>
      <SectionHeader>持ちもの</SectionHeader>
      {items.length === 0 ? (
        <div style={{ fontSize: 12.5, opacity: 0.6, padding: '4px 0' }}>まだ何も持っていない。</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
          {items.map(([id, n]) => (
            <span
              key={id}
              style={{
                background: 'rgba(214,190,140,0.14)',
                border: '1px solid rgba(214,190,140,0.35)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 12.5,
              }}
            >
              {pack.items[id]?.label ?? id}
              <b style={{ color: '#f0dca0', marginLeft: 6 }}>× {n}</b>
            </span>
          ))}
        </div>
      )}
    </>
  );
}

// 人物紹介（note を持つキャラクターの一覧）。データは全てコンテンツ側。
function CharacterRoster() {
  const pack = useGame((s) => s.pack);
  if (!pack) return null;
  const cast = Object.entries(pack.characters).filter(([, c]) => c.note);
  if (cast.length === 0) return null;
  return (
    <>
      <SectionHeader>なかま</SectionHeader>
      {cast.map(([id, c]) => (
        <div
          key={id}
          style={{ borderTop: '1px solid rgba(214,190,140,0.2)', padding: '9px 0' }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, marginRight: 10 }}>{c.name}</span>
          <span style={{ fontSize: 12, lineHeight: 1.7, opacity: 0.85 }}>{c.note}</span>
        </div>
      ))}
    </>
  );
}
