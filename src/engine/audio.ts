// Layer 1: 効果音。外部音源を使わず WebAudio で合成する（ライセンス・容量ゼロ）。
// すべて短い合図音 — 入手・目標達成・学び・発見・作成。世界の静けさを壊さない音量で。
// AudioContext はユーザー操作後にしか鳴らせない端末があるため遅延生成し、
// ミュートは localStorage に永続する。

let ctx: AudioContext | null = null;
let muted = false;
try {
  muted = localStorage.getItem('novel-game/muted') === '1';
} catch {
  // プライベートモード等では既定（音あり）のまま
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(m: boolean): void {
  muted = m;
  try {
    localStorage.setItem('novel-game/muted', m ? '1' : '0');
  } catch {
    // 保存できなくても動作は続ける
  }
}

function ensure(): AudioContext | null {
  if (muted) return null;
  try {
    if (!ctx) ctx = new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface Note {
  f: number; // 周波数
  t: number; // 開始オフセット（秒）
  d: number; // 長さ（秒）
  type?: OscillatorType;
  g?: number; // 音量（小さめ既定）
  slide?: number; // 終了周波数（グライド）
}

function play(notes: Note[]): void {
  const c = ensure();
  if (!c) return;
  const now = c.currentTime;
  for (const n of notes) {
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = n.type ?? 'sine';
    osc.frequency.setValueAtTime(n.f, now + n.t);
    if (n.slide) osc.frequency.exponentialRampToValueAtTime(n.slide, now + n.t + n.d);
    const g = n.g ?? 0.1;
    gain.gain.setValueAtTime(0, now + n.t);
    gain.gain.linearRampToValueAtTime(g, now + n.t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + n.t + n.d);
    osc.connect(gain).connect(c.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.05);
  }
}

export const sfx = {
  // 所持品を得た：短い二音
  item: () =>
    play([
      { f: 660, t: 0, d: 0.09, type: 'triangle', g: 0.08 },
      { f: 880, t: 0.07, d: 0.13, type: 'triangle', g: 0.08 },
    ]),
  // 目標達成：小さなファンファーレ
  quest: () =>
    play([
      { f: 523, t: 0, d: 0.15, g: 0.1 },
      { f: 659, t: 0.11, d: 0.15, g: 0.1 },
      { f: 784, t: 0.22, d: 0.18, g: 0.1 },
      { f: 1047, t: 0.34, d: 0.45, g: 0.12 },
    ]),
  // 学びを手帳に記した：柔らかい鈴
  learn: () =>
    play([
      { f: 987, t: 0, d: 0.5, g: 0.05 },
      { f: 1318, t: 0.05, d: 0.6, g: 0.035 },
    ]),
  // 場所を発見：のぼる三音
  discover: () =>
    play([
      { f: 392, t: 0, d: 0.11, type: 'triangle', g: 0.09 },
      { f: 523, t: 0.09, d: 0.11, type: 'triangle', g: 0.09 },
      { f: 659, t: 0.18, d: 0.3, type: 'triangle', g: 0.11 },
    ]),
  // 作った/建てた：木槌ふた叩き＋完成音
  craft: () =>
    play([
      { f: 180, t: 0, d: 0.07, type: 'square', g: 0.045 },
      { f: 180, t: 0.12, d: 0.07, type: 'square', g: 0.045 },
      { f: 587, t: 0.26, d: 0.28, type: 'triangle', g: 0.09 },
    ]),
};
