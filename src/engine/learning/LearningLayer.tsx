import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useGame } from '../store/gameStore';
import { playerPosition } from '../playerState';
import type { ContentPack } from '../types';

// Layer 1: 教育の核「答え合わせ」。体験の直後に、さりげなく短い挿話を出す。
// 全画面講義にはしない。手帳（ジャーナル）に静かに蓄積される。
// 手帳はタブ式 — 目標 / 地図 / つくる / 持ちもの / 学び / なかま。
// 地図・つくるタブは pack にデータがある作品でだけ現れる（エンジンは作品を知らない）。

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

type TabId = 'goal' | 'map' | 'craft' | 'items' | 'learn' | 'cast';

function availableTabs(pack: ContentPack): { id: TabId; label: string }[] {
  const tabs: { id: TabId; label: string }[] = [{ id: 'goal', label: '目標' }];
  if (pack.landmarks?.length && pack.mapBounds) tabs.push({ id: 'map', label: '地図' });
  if (pack.recipes?.length) tabs.push({ id: 'craft', label: 'つくる' });
  tabs.push({ id: 'items', label: '持ちもの' }, { id: 'learn', label: '学び' });
  if (Object.values(pack.characters).some((c) => c.note)) tabs.push({ id: 'cast', label: 'なかま' });
  return tabs;
}

export function Journal() {
  const open = useGame((s) => s.journalOpen);
  const setOpen = useGame((s) => s.setJournalOpen);
  const pack = useGame((s) => s.pack);
  const [tab, setTab] = useState<TabId>('goal');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyJ') setOpen(!useGame.getState().journalOpen);
      if (e.code === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setOpen]);

  if (!open || !pack) return null;
  const tabs = availableTabs(pack);
  const current = tabs.some((t) => t.id === tab) ? tab : 'goal';

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
          width: 'min(600px, 92vw)',
          height: 'min(430px, 80vh)',
          display: 'flex',
          flexDirection: 'column',
          background: '#2b2518',
          border: '1px solid rgba(214, 190, 140, 0.5)',
          borderRadius: 10,
          padding: '16px 22px 12px',
          color: '#efe6cf',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 2 }}>手帳</div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: current === t.id ? 'rgba(214,190,140,0.22)' : 'transparent',
                  border: '1px solid',
                  borderColor:
                    current === t.id ? 'rgba(214,190,140,0.55)' : 'rgba(214,190,140,0.18)',
                  borderRadius: 6,
                  color: current === t.id ? '#f4e9c8' : 'rgba(239,230,207,0.6)',
                  fontSize: 12,
                  fontWeight: current === t.id ? 700 : 400,
                  padding: '4px 11px',
                  cursor: 'pointer',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginTop: 10, paddingRight: 4 }}>
          {current === 'goal' && <Objectives />}
          {current === 'map' && <MapTab />}
          {current === 'craft' && <CraftTab />}
          {current === 'items' && <Inventory />}
          {current === 'learn' && <Learnings />}
          {current === 'cast' && <CharacterRoster />}
        </div>

        <div
          style={{ fontSize: 11, opacity: 0.5, marginTop: 8, textAlign: 'center', flexShrink: 0 }}
        >
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
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: 2,
        marginTop: 14,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}

// 進行度の文字列（アイテム/カウンタ型の目標は「2 / 5」のように出す）
function goalProgress(
  pack: ContentPack,
  questId: string,
  inventory: Record<string, number>,
  counters: Record<string, number>,
): string | null {
  const goal = pack.quests[questId]?.goal;
  if (!goal) return null;
  if (goal.type === 'item')
    return `${Math.min(inventory[goal.item] ?? 0, goal.count)} / ${goal.count}`;
  if (goal.type === 'counter')
    return `${Math.min(counters[goal.counter] ?? 0, goal.count)} / ${goal.count}`;
  return null;
}

// いまの目標（進行中クエスト）と、たどってきた道（達成済み）。よりみちは分けて載せる。
function Objectives() {
  const quests = useGame((s) => s.quests);
  const inventory = useGame((s) => s.inventory);
  const counters = useGame((s) => s.counters);
  const pack = useGame((s) => s.pack);
  if (!pack) return null;
  const activeMain = quests.filter((q) => q.status === 'active' && !pack.quests[q.id]?.side);
  const activeSide = quests.filter((q) => q.status === 'active' && pack.quests[q.id]?.side);
  const done = quests.filter((q) => q.status === 'done');

  const renderQuest = (q: { id: string }, mark: string, color: string) => {
    const def = pack.quests[q.id];
    if (!def) return null;
    const progress = goalProgress(pack, q.id, inventory, counters);
    return (
      <div key={q.id} style={{ padding: '7px 0' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700 }}>
          <span style={{ color, marginRight: 8 }}>{mark}</span>
          {def.title}
          {progress && (
            <span style={{ color: '#f0dca0', fontWeight: 400, fontSize: 12, marginLeft: 10 }}>
              {progress}
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, opacity: 0.82, marginTop: 3, marginLeft: 22 }}>
          {def.description}
        </div>
      </div>
    );
  };

  return (
    <>
      <SectionHeader>いまの目標</SectionHeader>
      {activeMain.length === 0 && (
        <div style={{ fontSize: 12.5, opacity: 0.6, padding: '4px 0' }}>
          いまは、心のむくままに。
        </div>
      )}
      {activeMain.map((q) => renderQuest(q, '◇', '#f0dca0'))}
      {activeSide.length > 0 && (
        <>
          <SectionHeader>よりみち</SectionHeader>
          {activeSide.map((q) => renderQuest(q, '✧', '#9fd0e8'))}
        </>
      )}
      {done.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(214,190,140,0.2)' }}>
          {done.map((q) => {
            const def = pack.quests[q.id];
            if (!def) return null;
            return (
              <div key={q.id} style={{ fontSize: 12, opacity: 0.5, padding: '3px 0' }}>
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

// 地図タブ。mapBounds を紙面に見立て、発見済みの場所を点灯する。未発見は「？」。
function MapTab() {
  const pack = useGame((s) => s.pack);
  const visited = useGame((s) => s.visitedLandmarks);
  const [pp, setPp] = useState<[number, number]>([playerPosition.x, playerPosition.z]);

  useEffect(() => {
    const iv = setInterval(() => setPp([playerPosition.x, playerPosition.z]), 700);
    return () => clearInterval(iv);
  }, []);

  if (!pack?.landmarks || !pack.mapBounds) return null;
  const [minX, minZ, maxX, maxZ] = pack.mapBounds;
  const spanX = maxX - minX;
  const spanZ = maxZ - minZ;
  const left = (x: number) => `${((x - minX) / spanX) * 100}%`;
  const top = (z: number) => `${((z - minZ) / spanZ) * 100}%`;
  const found = pack.landmarks.filter((l) => visited[l.id]).length;

  const dot: CSSProperties = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    lineHeight: 1.2,
  };

  return (
    <>
      <div style={{ fontSize: 11.5, opacity: 0.7, margin: '6px 0 8px' }}>
        見つけた場所　{found} / {pack.landmarks.length}
        <span style={{ marginLeft: 14, opacity: 0.8 }}>● いまここ</span>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: `${spanX} / ${spanZ}`,
          maxHeight: 300,
          margin: '0 auto',
          background:
            'radial-gradient(ellipse at 50% 45%, rgba(214,190,140,0.16), rgba(120,100,60,0.05) 68%, rgba(0,0,0,0.18))',
          border: '1px solid rgba(214,190,140,0.35)',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {pack.landmarks.map((lm) => {
          const seen = visited[lm.id];
          return (
            <div key={lm.id} style={{ ...dot, left: left(lm.position[0]), top: top(lm.position[1]) }}>
              {seen ? (
                <>
                  <div style={{ color: '#f0dca0', fontSize: 10, textShadow: '0 0 6px rgba(240,220,160,0.8)' }}>
                    ◆
                  </div>
                  <div
                    style={{
                      fontSize: 9.5,
                      color: '#efe6cf',
                      whiteSpace: 'nowrap',
                      textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                    }}
                  >
                    {lm.label}
                  </div>
                </>
              ) : (
                <div style={{ color: 'rgba(239,230,207,0.35)', fontSize: 11 }}>？</div>
              )}
            </div>
          );
        })}
        {/* 現在地 */}
        <div style={{ ...dot, left: left(pp[0]), top: top(pp[1]) }}>
          <div style={{ color: '#fff', fontSize: 9, textShadow: '0 0 7px rgba(255,255,255,0.95)' }}>
            ●
          </div>
        </div>
      </div>
    </>
  );
}

// つくるタブ。素材と引き換えに料理・道具・建物をつくる。建てたものは「✓」で残る。
function CraftTab() {
  const pack = useGame((s) => s.pack);
  const inventory = useGame((s) => s.inventory);
  const flags = useGame((s) => s.flags);
  const craft = useGame((s) => s.craft);
  if (!pack?.recipes) return null;
  const recipes = pack.recipes.filter((r) => !r.requiresFlag || flags[r.requiresFlag]);
  if (recipes.length === 0) {
    return <div style={{ fontSize: 12.5, opacity: 0.6, padding: '10px 0' }}>まだ何もつくれない。</div>;
  }
  return (
    <div style={{ paddingTop: 4 }}>
      {recipes.map((r) => {
        const built = !!(r.hideFlag && flags[r.hideFlag]);
        const canMake =
          !built && Object.entries(r.inputs).every(([item, n]) => (inventory[item] ?? 0) >= n);
        return (
          <div
            key={r.id}
            style={{
              borderTop: '1px solid rgba(214,190,140,0.2)',
              padding: '10px 0',
              opacity: built ? 0.55 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>
                  {built && <span style={{ color: '#8fd17a', marginRight: 7 }}>✓</span>}
                  {r.label}
                </div>
                {r.description && (
                  <div style={{ fontSize: 11.5, opacity: 0.8, marginTop: 2 }}>{r.description}</div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 5 }}>
                  {Object.entries(r.inputs).map(([item, n]) => {
                    const have = inventory[item] ?? 0;
                    const ok = have >= n;
                    return (
                      <span
                        key={item}
                        style={{
                          fontSize: 11,
                          padding: '2px 8px',
                          borderRadius: 6,
                          border: '1px solid',
                          borderColor: ok ? 'rgba(143,209,122,0.5)' : 'rgba(224,108,80,0.5)',
                          color: ok ? '#c9e8bd' : '#e8b0a0',
                          background: 'rgba(0,0,0,0.18)',
                        }}
                      >
                        {pack.items[item]?.label ?? item} {Math.min(have, n)}/{n}
                      </span>
                    );
                  })}
                </div>
              </div>
              {!built && (
                <button
                  onClick={() => craft(r.id)}
                  disabled={!canMake}
                  style={{
                    flexShrink: 0,
                    background: canMake ? 'rgba(214,190,140,0.25)' : 'rgba(255,255,255,0.05)',
                    border: '1px solid',
                    borderColor: canMake ? 'rgba(214,190,140,0.6)' : 'rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    color: canMake ? '#f4e9c8' : 'rgba(239,230,207,0.35)',
                    fontSize: 12.5,
                    fontWeight: 700,
                    padding: '8px 16px',
                    cursor: canMake ? 'pointer' : 'default',
                  }}
                >
                  つくる
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
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
      {items.length === 0 ? (
        <div style={{ fontSize: 12.5, opacity: 0.6, padding: '10px 0' }}>まだ何も持っていない。</div>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 10 }}>
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

// 学んだことの一覧。
function Learnings() {
  const journal = useGame((s) => s.journal);
  const pack = useGame((s) => s.pack);
  if (!pack) return null;
  return (
    <>
      {journal.length === 0 && (
        <div style={{ fontSize: 13, opacity: 0.6, padding: '10px 0' }}>まだ何も記されていない。</div>
      )}
      {journal.map((id) => {
        const def = pack.learnings[id];
        if (!def) return null;
        return (
          <div key={id} style={{ borderTop: '1px solid rgba(214,190,140,0.2)', padding: '12px 0' }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 5 }}>{def.title}</div>
            <div style={{ fontSize: 12.5, lineHeight: 1.75, opacity: 0.88 }}>{def.body}</div>
            <div style={{ fontSize: 10.5, opacity: 0.5, marginTop: 5 }}>
              {def.tags.map((t) => `#${t}`).join('  ')}
            </div>
          </div>
        );
      })}
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
      {cast.map(([id, c]) => (
        <div key={id} style={{ borderTop: '1px solid rgba(214,190,140,0.2)', padding: '9px 0' }}>
          <span style={{ fontSize: 13, fontWeight: 700, marginRight: 10 }}>{c.name}</span>
          <span style={{ fontSize: 12, lineHeight: 1.7, opacity: 0.85 }}>{c.note}</span>
        </div>
      ))}
    </>
  );
}
