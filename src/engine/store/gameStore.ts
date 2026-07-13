import { create } from 'zustand';
import type { ContentPack, Effects } from '../types';
import { clearObstacles } from '../obstacles';
import { requestWarp } from '../warp';
import { sfx } from '../audio';

// Layer 1: ゲーム状態の一元管理。エンジンはパラメータやフラグの「意味」を知らない。

export interface QuestState {
  id: string;
  status: 'active' | 'done';
}

export interface SaveData {
  time: { day: number; hour: number; minute: number };
  params: Record<string, number>;
  inventory: Record<string, number>;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  quests: QuestState[];
  journal: string[];
  usedInteractables: Record<string, boolean>;
  firedEvents: Record<string, boolean>;
  player: [number, number, number];
  // 後から増えた項目（旧セーブには無いので optional。読込側は ?? {} で移行する）
  usedAt?: Record<string, number>; // 採集資源を最後に使ったゲーム内絶対分
  visitedLandmarks?: Record<string, boolean>; // 発見済みの場所
}

// ゲーム内絶対分（日をまたぐ経過比較用）。資源のクールダウン判定に使う。
export function totalMinutes(t: { day: number; hour: number; minute: number }): number {
  return (t.day * 24 + t.hour) * 60 + t.minute;
}

interface GameState {
  pack: ContentPack | null;
  time: { day: number; hour: number; minute: number };
  params: Record<string, number>;
  inventory: Record<string, number>;
  flags: Record<string, boolean>;
  counters: Record<string, number>;
  quests: QuestState[];
  journal: string[]; // 獲得済みの学びID（獲得順）
  usedInteractables: Record<string, boolean>;
  firedEvents: Record<string, boolean>;
  usedAt: Record<string, number>; // 採集資源を最後に使ったゲーム内絶対分（クールダウン用）
  visitedLandmarks: Record<string, boolean>; // 発見済みの場所

  // 揮発状態（保存しない）
  nearby: string | null;
  dialogue: { id: string; line: number } | null;
  narration: { lines: string[]; index: number } | null;
  learningToast: string | null;
  discoveryToast: string | null; // 直近に発見した場所ID
  journalOpen: boolean;
  savedPlayer: [number, number, number] | null;

  init: (pack: ContentPack, save?: SaveData) => void;
  advanceMinutes: (mins: number) => void;
  applyEffects: (effects?: Effects) => void;
  craft: (recipeId: string) => void;
  visitLandmark: (id: string) => void;
  setNearby: (id: string | null) => void;
  startDialogue: (id: string) => void;
  advanceDialogue: () => void;
  chooseDialogue: (index: number) => void;
  startNarration: (lines: string[]) => void;
  advanceNarration: () => void;
  dismissLearning: () => void;
  dismissDiscovery: () => void;
  setJournalOpen: (open: boolean) => void;
  markEventFired: (id: string) => void;
}

export function isUiLocked(s: Pick<GameState, 'dialogue' | 'narration' | 'journalOpen'>): boolean {
  return s.dialogue !== null || s.narration !== null || s.journalOpen;
}

function clampParam(pack: ContentPack, key: string, value: number): number {
  const def = pack.parameters[key];
  if (!def) return value;
  return Math.min(def.max, Math.max(def.min, value));
}

// 空腹と体力の生活ロジック（1分あたり）
function metabolize(params: Record<string, number>, pack: ContentPack, mins: number): Record<string, number> {
  const next = { ...params };
  if ('hunger' in next) {
    next.hunger = clampParam(pack, 'hunger', next.hunger - mins / 30);
    if ('stamina' in next) {
      if (next.hunger <= 0) {
        next.stamina = clampParam(pack, 'stamina', next.stamina - mins / 10);
      } else if (next.hunger > 30) {
        next.stamina = clampParam(pack, 'stamina', next.stamina + mins / 30);
      }
    }
  }
  return next;
}

export const useGame = create<GameState>((set, get) => ({
  pack: null,
  time: { day: 1, hour: 6, minute: 0 },
  params: {},
  inventory: {},
  flags: {},
  counters: {},
  quests: [],
  journal: [],
  usedInteractables: {},
  firedEvents: {},
  usedAt: {},
  visitedLandmarks: {},

  nearby: null,
  dialogue: null,
  narration: null,
  learningToast: null,
  discoveryToast: null,
  journalOpen: false,
  savedPlayer: null,

  init: (pack, save) => {
    // 前作・前回の当たり判定が残らないよう作り直しの起点でクリア
    // （Scene 再マウントでも Solid は片付くが、念のため明示リセット）。
    clearObstacles();
    const initialParams: Record<string, number> = {};
    for (const [key, def] of Object.entries(pack.parameters)) initialParams[key] = def.initial;
    // 毎回まっさらな初期状態を確立してから、セーブがあれば上書きする。
    // init はホーム⇄ゲームの往復や「最初から」で複数回呼ばれるため、
    // 前作・前回の flags/quests/inventory や会話中フラグが残らないよう全項目を明示リセットする。
    set({
      pack,
      time: save ? save.time : { day: pack.startTime.day, hour: pack.startTime.hour, minute: 0 },
      params: save ? { ...initialParams, ...save.params } : initialParams,
      inventory: save ? save.inventory : {},
      flags: save ? save.flags : {},
      counters: save ? save.counters : {},
      quests: save ? save.quests : [],
      journal: save ? save.journal : [],
      usedInteractables: save ? save.usedInteractables : {},
      firedEvents: save ? save.firedEvents : {},
      usedAt: save ? (save.usedAt ?? {}) : {},
      visitedLandmarks: save ? (save.visitedLandmarks ?? {}) : {},
      savedPlayer: save ? save.player : null,
      // 揮発状態は常にリセット
      nearby: null,
      dialogue: null,
      narration: null,
      learningToast: null,
      discoveryToast: null,
      journalOpen: false,
    });
  },

  advanceMinutes: (mins) => {
    const { time, params, pack } = get();
    if (!pack) return;
    let total = time.hour * 60 + time.minute + mins;
    let day = time.day;
    while (total >= 24 * 60) {
      total -= 24 * 60;
      day += 1;
    }
    set({
      time: { day, hour: Math.floor(total / 60), minute: Math.floor(total % 60) },
      params: metabolize(params, pack, mins),
    });
  },

  applyEffects: (effects) => {
    if (!effects) return;
    const s = get();
    const pack = s.pack;
    if (!pack) return;

    if (effects.params) {
      const params = { ...get().params };
      for (const [key, delta] of Object.entries(effects.params)) {
        params[key] = clampParam(pack, key, (params[key] ?? 0) + delta);
      }
      set({ params });
    }
    if (effects.items) {
      const inventory = { ...get().inventory };
      let gained = false;
      for (const [key, delta] of Object.entries(effects.items)) {
        inventory[key] = Math.max(0, (inventory[key] ?? 0) + delta);
        if (delta > 0) gained = true;
      }
      set({ inventory });
      if (gained) sfx.item();
    }
    if (effects.counters) {
      const counters = { ...get().counters };
      for (const [key, delta] of Object.entries(effects.counters)) {
        counters[key] = (counters[key] ?? 0) + delta;
      }
      set({ counters });
    }
    if (effects.flags) {
      const flags = { ...get().flags };
      for (const f of effects.flags) flags[f] = true;
      set({ flags });
    }
    if (effects.flagsOff) {
      const flags = { ...get().flags };
      for (const f of effects.flagsOff) delete flags[f];
      set({ flags });
    }
    if (effects.questAdd) {
      const quests = [...get().quests];
      for (const id of effects.questAdd) {
        if (!quests.some((q) => q.id === id)) quests.push({ id, status: 'active' });
      }
      set({ quests });
    }
    if (effects.learning) {
      const journal = [...get().journal];
      let toast: string | null = get().learningToast;
      let learned = false;
      for (const id of effects.learning) {
        if (!journal.includes(id)) {
          journal.push(id);
          toast = id;
          learned = true;
        }
      }
      set({ journal, learningToast: toast });
      if (learned) sfx.learn();
    }
    if (effects.minutes) get().advanceMinutes(effects.minutes);
    if (effects.teleport) requestWarp(effects.teleport[0], effects.teleport[1]);
    if (effects.dialogue) get().startDialogue(effects.dialogue);

    // クエスト達成チェック
    const after = get();
    const quests = after.quests.map((q) => {
      if (q.status !== 'active') return q;
      const goal = pack.quests[q.id]?.goal;
      if (!goal) return q;
      const met =
        (goal.type === 'item' && (after.inventory[goal.item] ?? 0) >= goal.count) ||
        (goal.type === 'counter' && (after.counters[goal.counter] ?? 0) >= goal.count) ||
        (goal.type === 'flag' && !!after.flags[goal.flag]);
      return met ? { ...q, status: 'done' as const } : q;
    });
    if (quests.some((q, i) => q !== after.quests[i])) {
      set({ quests });
      sfx.quest();
    }
  },

  // レシピを作る。素材が足りなければ何もしない（UI側でボタンを無効化して案内する）。
  craft: (recipeId) => {
    const s = get();
    const recipe = s.pack?.recipes?.find((r) => r.id === recipeId);
    if (!recipe) return;
    if (recipe.hideFlag && s.flags[recipe.hideFlag]) return; // 建設済みなど
    for (const [item, n] of Object.entries(recipe.inputs)) {
      if ((s.inventory[item] ?? 0) < n) return;
    }
    const inventory = { ...s.inventory };
    for (const [item, n] of Object.entries(recipe.inputs)) inventory[item] -= n;
    set({ inventory });
    sfx.craft();
    get().applyEffects(recipe.effects);
  },

  visitLandmark: (id) => {
    const s = get();
    if (s.visitedLandmarks[id]) return;
    set({ visitedLandmarks: { ...s.visitedLandmarks, [id]: true }, discoveryToast: id });
    sfx.discover();
    // 発見数はカウンタ landmarks_found に積む（クエスト目標に使える）。applyEffects 経由で達成判定も走る。
    get().applyEffects({ counters: { landmarks_found: 1 } });
  },

  setNearby: (id) => {
    if (get().nearby !== id) set({ nearby: id });
  },

  startDialogue: (id) => set({ dialogue: { id, line: 0 } }),

  advanceDialogue: () => {
    const { dialogue, pack, applyEffects } = get();
    if (!dialogue || !pack) return;
    const def = pack.dialogues[dialogue.id];
    if (dialogue.line < def.lines.length - 1) {
      set({ dialogue: { ...dialogue, line: dialogue.line + 1 } });
    } else if (!def.choices) {
      // 末尾：選択肢がなければ効果を適用して終了/遷移。
      // next への遷移では dialogue を null 経由させない（イベント実行系が「会話終了」と誤認するため）
      const effects = def.effects;
      const next = effects?.next;
      set({ dialogue: next ? { id: next, line: 0 } : null });
      if (effects) {
        const { next: _next, ...rest } = effects;
        applyEffects(rest);
      }
    }
    // 選択肢がある場合は最終行で停止し、chooseDialogue を待つ
  },

  chooseDialogue: (index) => {
    const { dialogue, pack, applyEffects } = get();
    if (!dialogue || !pack) return;
    const choice = pack.dialogues[dialogue.id].choices?.[index];
    const next = choice?.effects?.next;
    set({ dialogue: next ? { id: next, line: 0 } : null });
    if (choice?.effects) {
      const { next: _next, ...rest } = choice.effects;
      applyEffects(rest);
    }
  },

  startNarration: (lines) => set({ narration: { lines, index: 0 } }),

  advanceNarration: () => {
    const { narration } = get();
    if (!narration) return;
    if (narration.index < narration.lines.length - 1) {
      set({ narration: { ...narration, index: narration.index + 1 } });
    } else {
      set({ narration: null });
    }
  },

  dismissLearning: () => set({ learningToast: null }),
  dismissDiscovery: () => set({ discoveryToast: null }),
  setJournalOpen: (open) => set({ journalOpen: open }),
  markEventFired: (id) => set({ firedEvents: { ...get().firedEvents, [id]: true } }),
}));

// 開発時のみ：E2Eテスト用にストアを公開
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).__game = useGame;
}
