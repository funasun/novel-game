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
  teleport?: [number, number]; // XZへ瞬間移動（章移動・夢の場面転換など）
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
  waypoint?: [number, number]; // XZ。目標地点の光の柱と方位ガイドを出す（無ければ誘導なし）
  side?: boolean; // よりみち（サイドクエスト）。HUD・光の柱は非sideの先頭を優先する
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
  cooldownHours?: number; // 使用後この時間（ゲーム内）休眠して復活する採集資源
}

// クラフト/建設レシピ。effects でフラグを立てれば「建設」（Sceneがフラグで建物を描く）、
// params を動かせば「料理」になる。エンジンはその意味を知らない。
export interface RecipeDef {
  id: string;
  label: string;
  description?: string;
  inputs: Record<string, number>; // itemId → 必要数
  effects: Effects; // 完成時の効果
  requiresFlag?: string; // このフラグが立つまでレシピ非表示
  hideFlag?: string; // このフラグが立ったら「済」表示（建設系は自らが立てるフラグを指す）
}

// 地図に載る場所。近づくと「発見」され、手帳の地図タブに点灯する。
// 発見のたびエンジンが counter `landmarks_found` を1加算する（探索クエストの目標に使える）。
export interface LandmarkDef {
  id: string;
  label: string;
  position: [number, number]; // XZ
  radius?: number; // 発見半径（既定 10）
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
  recipes?: RecipeDef[]; // クラフト/建設（あれば手帳に「つくる」タブが出る）
  landmarks?: LandmarkDef[]; // 発見できる場所（あれば手帳に「地図」タブが出る）
  mapBounds?: [number, number, number, number]; // 地図タブの描画範囲 [minX, minZ, maxX, maxZ]
  startTime: { day: number; hour: number };
  spawn: [number, number]; // XZ
  Scene: ComponentType; // 3D舞台（地形・海・小物・NPC）

  // ホーム画面（作品選択）用の表示メタデータ
  author?: string; // 原作者
  blurb?: string; // 一行の紹介文（惹句）
  accent?: string; // カードのアクセント色（hex）
  Overlay?: ComponentType; // 作品専用の情景オーバーレイ（島の世界の上に重ねるシネマティック等）
}

// ホーム画面に「準備中」として並べる、まだ実装していない作品の枠
export interface ComingSoonEntry {
  id: string;
  title: string;
  author: string;
  blurb: string;
  accent?: string;
}
