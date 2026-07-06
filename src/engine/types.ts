import type { ComponentType } from 'react';

// Layer 1: エンジンが理解するデータ語彙。作品(Layer 3)はこの型でコンテンツを記述する。

export interface Effects {
  params?: Record<string, number>; // パラメータ増減
  items?: Record<string, number>; // 所持品増減
  flags?: string[]; // 立てるフラグ
  counters?: Record<string, number>; // カウンタ増減
  minutes?: number; // 消費する時間（分）
  questAdd?: string[];
  learning?: string[]; // 表示する「学び」
  dialogue?: string; // 会話を開始（インタラクト/イベント用）
  next?: string; // 会話チェーン内の遷移
}

export interface DialogueChoice {
  text: string;
  effects?: Effects;
}

export interface DialogueDef {
  id: string;
  speaker: string; // characters のキー
  lines: string[];
  choices?: DialogueChoice[];
  effects?: Effects; // choices が無い場合、末尾で適用
}

export type QuestGoal =
  | { type: 'item'; item: string; count: number }
  | { type: 'counter'; counter: string; count: number }
  | { type: 'flag'; flag: string };

export interface QuestDef {
  id: string;
  title: string;
  description: string;
  goal?: QuestGoal; // 無ければイベント側で明示的に完了させる
}

export type EventTrigger =
  | { type: 'gameStart' }
  | { type: 'flag'; flag: string }
  | { type: 'time'; day?: number; hour: number }
  | { type: 'questComplete'; quest: string };

export type EventStep =
  | { type: 'narration'; lines: string[] }
  | { type: 'dialogue'; id: string }
  | { type: 'effects'; effects: Effects }
  | { type: 'sleepUntilMorning' }
  | { type: 'skipDays'; days: number }; // 月単位の時間経過（代謝なしの日数ジャンプ）

export interface EventDef {
  id: string;
  trigger: EventTrigger;
  steps: EventStep[];
}

export interface LearningDef {
  id: string;
  title: string;
  body: string;
  tags: string[];
}

export interface InteractableDef {
  id: string;
  position: [number, number]; // XZ。Yはコンテンツ側が接地して描画する
  prompt: string;
  radius?: number; // 反応距離（既定 2.4）
  effects: Effects;
  once?: boolean; // 一度きり（使用後に消える）
  requiresFlag?: string; // このフラグが立つまで存在しない
  hideFlag?: string; // このフラグが立ったら消える
}

export interface ParameterDef {
  label: string;
  min: number;
  max: number;
  initial: number;
  display?: boolean; // HUDに表示するか
}

export interface CharacterDef {
  name: string;
  note?: string; // 手帳の人物紹介（あれば「なかま」欄に載る）
}

export interface ContentPack {
  id: string;
  title: string;
  parameters: Record<string, ParameterDef>;
  items: Record<string, { label: string }>;
  characters: Record<string, CharacterDef>;
  dialogues: Record<string, DialogueDef>;
  quests: Record<string, QuestDef>;
  events: EventDef[];
  learnings: Record<string, LearningDef>;
  interactables: InteractableDef[];
  startTime: { day: number; hour: number };
  spawn: [number, number]; // XZ
  Scene: ComponentType; // 3D舞台（地形・海・小物・NPC）
}
