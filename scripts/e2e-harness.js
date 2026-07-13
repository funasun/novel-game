// E2E ハーネス（開発用）。preview_eval にこのファイルの中身を貼って注入する。
// ゲーム開始「前」（ホーム画面）に注入すること。注入後にゲームを開始し、
// スクリーンショットを1枚撮って保留中のネイティブ rAF を流すと、以後は
// Worker のタイマー（非表示ページでも絞られない）でゲームループが回り続ける。
//
// 使い方: __inject() → 作品カードをクリック → screenshot 1枚 →
//   await __ct() で冒頭イベント消化 → await __visit(x, z, id) を1評価1回ずつ。
(() => {
  if (window.__harness) return 'already';

  // ── worker-RAF shim ──
  const src = 'setInterval(() => postMessage(0), 33);';
  const url = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }));
  const w = new Worker(url);
  let cbs = [];
  let nextId = 1;
  window.requestAnimationFrame = (cb) => {
    cbs.push(cb);
    return nextId++;
  };
  window.cancelAnimationFrame = () => {};
  w.onmessage = () => {
    const t = performance.now();
    const list = cbs;
    cbs = [];
    for (const cb of list) {
      try {
        cb(t);
      } catch (e) {
        console.error('[harness rAF]', e);
      }
    }
  };
  window.confirm = () => true;

  // ── helpers ──
  window.__sleep = (ms) =>
    new Promise((r) => {
      const t0 = performance.now();
      const tick = () => (performance.now() - t0 >= ms ? r() : window.requestAnimationFrame(tick));
      window.requestAnimationFrame(tick);
    });

  window.__st = () => {
    const s = window.__game.getState();
    const p = window.__player;
    return {
      time: s.time,
      params: s.params,
      inv: s.inventory,
      flags: s.flags,
      counters: s.counters,
      quests: s.quests.map((q) => q.id + ':' + q.status),
      journal: s.journal,
      fired: Object.keys(s.firedEvents),
      nearby: s.nearby,
      dlg: s.dialogue && s.dialogue.id,
      nar: !!s.narration,
      pos: p ? [Math.round(p.x * 10) / 10, Math.round(p.z * 10) / 10] : null,
    };
  };

  // ナレーション/会話を最後まで送る。choicePick: 選択肢ボタンの部分一致テキスト。
  // 選択肢は実DOMのボタンをクリックする（requiresFlag非表示・requiresParam無効化のUI検証を兼ねる）。
  window.__ct = async (max = 40, choicePick) => {
    const seen = [];
    const g = window.__game;
    for (let i = 0; i < max; i++) {
      const s = g.getState();
      if (!s.narration && !s.dialogue) break;
      if (s.narration) {
        seen.push('N:' + s.narration.lines[s.narration.index]);
        s.advanceNarration();
      } else {
        const def = s.pack.dialogues[s.dialogue.id];
        const last = s.dialogue.line >= def.lines.length - 1;
        seen.push('D:' + s.dialogue.id + '#' + s.dialogue.line);
        if (last && def.choices) {
          await window.__sleep(120);
          const texts = def.choices.map((c) => c.text);
          const btns = [...document.querySelectorAll('button')].filter((b) =>
            texts.includes(b.textContent),
          );
          seen.push('BTNS:' + btns.map((b) => (b.disabled ? '×' : '○') + b.textContent).join('|'));
          let btn = choicePick ? btns.find((b) => b.textContent.includes(choicePick)) : null;
          if (!btn || btn.disabled) btn = btns.find((b) => !b.disabled);
          if (!btn) {
            seen.push('C:NO_BUTTON');
            break;
          }
          seen.push('C:' + btn.textContent);
          btn.click();
        } else {
          s.advanceDialogue();
        }
      }
      await window.__sleep(60);
    }
    return seen;
  };

  // テレポートして id のインタラクトを実行し、続くイベントを消化して状態を返す。
  window.__visit = async (x, z, id, opts = {}) => {
    const g = window.__game;
    let seen = await window.__ct(40, opts.pick); // 前のイベントの残りを片づける
    g.getState().applyEffects({ teleport: [x, z] });
    const p = window.__player;
    for (let i = 0; i < 100; i++) {
      await window.__sleep(50);
      if (p && Math.hypot(p.x - x, p.z - z) < 1.5) break;
    }
    let near = null;
    for (let i = 0; i < 50; i++) {
      const s = g.getState();
      if (s.narration || s.dialogue) seen = seen.concat(await window.__ct(40, opts.pick));
      near = g.getState().nearby;
      if (near === id) break;
      await window.__sleep(60);
    }
    const arrived = near === id;
    if (arrived && !opts.noInteract) {
      for (let k = 0; k < 6; k++) {
        window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE', bubbles: true }));
        await window.__sleep(90);
        const s = g.getState();
        if (s.dialogue || s.narration) break;
        if (s.nearby !== id) break; // once消費 or トグルで別対象に切替わった
      }
      seen = seen.concat(await window.__ct(60, opts.pick));
    }
    return { visited: arrived, nearby: near, seen, st: window.__st() };
  };

  window.__harness = true;
  return 'injected';
})();
