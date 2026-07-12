import { useEffect } from 'react';
import { useGame } from '../store/gameStore';
import type { EventDef, EventStep } from '../types';

// Layer 1: 物語イベントの発火と逐次実行。
// trigger（開始/フラグ/時刻/クエスト完了）を監視し、steps（ナレーション/会話/効果/就寝）を順に流す。
// 「日々の生活に物語が差し込まれる」仕組みの心臓部。

type GameSnapshot = ReturnType<typeof useGame.getState>;

function waitUntil(pred: (s: GameSnapshot) => boolean): Promise<void> {
  return new Promise((resolve) => {
    if (pred(useGame.getState())) {
      resolve();
      return;
    }
    const unsub = useGame.subscribe((s) => {
      if (pred(s)) {
        unsub();
        resolve();
      }
    });
  });
}

async function runStep(step: EventStep): Promise<void> {
  const s = useGame.getState();
  switch (step.type) {
    case 'narration':
      s.startNarration(step.lines);
      await waitUntil((g) => g.narration === null);
      break;
    case 'dialogue':
      s.startDialogue(step.id);
      await waitUntil((g) => g.dialogue === null);
      break;
    case 'effects':
      s.applyEffects(step.effects);
      break;
    case 'sleepUntilMorning': {
      const { time } = useGame.getState();
      useGame.setState({ time: { day: time.day + 1, hour: 6, minute: 0 } });
      break;
    }
    case 'skipDays': {
      const { time } = useGame.getState();
      useGame.setState({ time: { day: time.day + step.days, hour: 7, minute: 0 } });
      break;
    }
  }
}

// epoch: 作品セッションの世代番号。ホーム⇄ゲームの往復や作品切替で EventSystem が
// マウントし直されるたびに進める。宙づりの drain（前作の会話待ち等）は、待ちが解けた
// 瞬間に世代不一致を検知して静かに死ぬ。これが無いと、前作のイベント列が次の作品の
// 上で続きを実行してしまう（例: 途中でホームへ戻り別作品を始めると前作の会話が現れる）。
let epoch = 0;
let queue: EventDef[] = [];
let running = false;

async function drain(myEpoch: number): Promise<void> {
  running = true;
  while (queue.length > 0 && myEpoch === epoch) {
    const ev = queue.shift()!;
    for (const step of ev.steps) {
      if (myEpoch !== epoch) break;
      await runStep(step);
    }
  }
  if (myEpoch === epoch) running = false;
}

function fire(ev: EventDef): void {
  const s = useGame.getState();
  if (s.firedEvents[ev.id]) return;
  s.markEventFired(ev.id);
  queue.push(ev);
  if (!running) void drain(epoch);
}

function checkTriggers(s: GameSnapshot): void {
  if (!s.pack) return;
  for (const ev of s.pack.events) {
    if (s.firedEvents[ev.id]) continue;
    const t = ev.trigger;
    if (t.type === 'flag' && s.flags[t.flag]) fire(ev);
    else if (t.type === 'time') {
      // 指定日の指定時刻を過ぎたら発火（日をまたいで過ぎていても発火）
      const met =
        t.day === undefined
          ? s.time.hour >= t.hour
          : s.time.day > t.day || (s.time.day === t.day && s.time.hour >= t.hour);
      if (met) fire(ev);
    } else if (
      t.type === 'questComplete' &&
      s.quests.some((q) => q.id === t.quest && q.status === 'done')
    ) {
      fire(ev);
    }
  }
}

export function EventSystem() {
  useEffect(() => {
    // 新しい作品セッションの開始。前作の残りイベントを捨て、宙づりの drain を無効化する。
    epoch++;
    queue = [];
    running = false;
    const s = useGame.getState();
    if (!s.pack) return;
    for (const ev of s.pack.events) {
      if (ev.trigger.type === 'gameStart') fire(ev);
    }
    checkTriggers(s);
    const unsub = useGame.subscribe((state, prev) => {
      if (
        state.flags !== prev.flags ||
        state.time !== prev.time ||
        state.quests !== prev.quests
      ) {
        checkTriggers(state);
      }
    });
    return unsub;
  }, []);
  return null;
}
