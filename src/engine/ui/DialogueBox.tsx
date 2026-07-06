import { useEffect } from 'react';
import { useGame } from '../store/gameStore';

// Layer 1: 会話UI。クリック/Spaceで送り、最終行で選択肢を出す。

export function DialogueBox() {
  const dialogue = useGame((s) => s.dialogue);
  const pack = useGame((s) => s.pack);
  const advance = useGame((s) => s.advanceDialogue);
  const choose = useGame((s) => s.chooseDialogue);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        advance();
      }
    };
    if (dialogue) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialogue, advance]);

  if (!dialogue || !pack) return null;
  const def = pack.dialogues[dialogue.id];
  if (!def) return null;
  const speaker = pack.characters[def.speaker]?.name ?? def.speaker;
  const isLast = dialogue.line >= def.lines.length - 1;
  const showChoices = isLast && !!def.choices;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: 40,
        transform: 'translateX(-50%)',
        width: 'min(680px, 88vw)',
        pointerEvents: 'auto',
        cursor: showChoices ? 'default' : 'pointer',
      }}
      onClick={() => !showChoices && advance()}
    >
      <div
        style={{
          background: 'rgba(12, 22, 34, 0.88)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 10,
          padding: '14px 20px 16px',
          color: '#f2ede2',
          boxShadow: '0 8px 30px rgba(0,0,0,0.35)',
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 6, letterSpacing: 1 }}>
          {speaker}
        </div>
        <div style={{ fontSize: 16, lineHeight: 1.8, minHeight: 30 }}>
          {def.lines[dialogue.line]}
          {!showChoices && (
            <span style={{ opacity: 0.5, fontSize: 12, marginLeft: 8 }}>▼</span>
          )}
        </div>
        {showChoices && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {def.choices!.map((c, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  choose(i);
                }}
                style={{
                  textAlign: 'left',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  borderRadius: 8,
                  color: '#f2ede2',
                  padding: '10px 14px',
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                {c.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
