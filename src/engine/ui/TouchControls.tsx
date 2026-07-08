import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { useGame, isUiLocked } from '../store/gameStore';
import { touchMove, clearTouchMove } from '../touchInput';
import { triggerInteract } from '../systems/InteractionSystem';
import { isTouchDevice } from '../fullscreen';

// Layer 1: モバイル操作。画面の左半分＝移動（触れた位置に出るバーチャルジョイスティック）、
// 右半分＝カメラ回転（Canvas がドラッグを拾う）。近接時は右下に「調べる」ボタン。
// キーボード/マウスと共存し、タッチ端末でのみ表示。移動入力は touchInput 経由で Player へ橋渡し。

const RANGE = 46; // ノブの可動半径（中心からの最大距離）
const KNOB = 56; // ノブ直径
const DEAD = 0.16; // デッドゾーン（この割合未満は静止扱い＝微振動で歩き出さない）

interface Joy {
  ox: number; // 基準（触れ始め）の画面座標
  oy: number;
  kx: number; // ノブの中心からのオフセット
  ky: number;
}

export function TouchControls() {
  const nearby = useGame((s) => s.nearby);
  const uiLocked = useGame(isUiLocked);
  const [isTouch] = useState(() => isTouchDevice());

  const activePointer = useRef<number | null>(null);
  const [joy, setJoy] = useState<Joy | null>(null);

  // 会話・ナレーションに入ったら移動入力を必ず解除（ロック中に触れっぱなしでも暴走しない）。
  useEffect(() => {
    if (!uiLocked) return;
    activePointer.current = null;
    clearTouchMove();
    setJoy(null);
  }, [uiLocked]);

  // アンマウント時にも入力を解除。
  useEffect(() => () => clearTouchMove(), []);

  if (!isTouch) return null;

  const onDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (uiLocked) return;
    activePointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    clearTouchMove();
    setJoy({ ox: e.clientX, oy: e.clientY, kx: 0, ky: 0 });
  };

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    setJoy((j) => {
      if (!j) return j;
      let dx = e.clientX - j.ox;
      let dy = e.clientY - j.oy;
      const dist = Math.hypot(dx, dy);
      if (dist > RANGE) {
        dx = (dx / dist) * RANGE;
        dy = (dy / dist) * RANGE;
      }
      const nx = dx / RANGE;
      const ny = dy / RANGE;
      if (Math.hypot(nx, ny) < DEAD) {
        clearTouchMove();
      } else {
        touchMove.x = nx;
        touchMove.y = -ny; // 画面の下方向(+)は後退、上方向(−)は前進
        touchMove.active = true;
      }
      return { ...j, kx: dx, ky: dy };
    });
  };

  const onUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== e.pointerId) return;
    activePointer.current = null;
    clearTouchMove();
    setJoy(null);
  };

  return (
    <>
      {/* 左半分：移動ゾーン（触れた位置にジョイスティックが出現）。会話中は隠す。 */}
      {!uiLocked && (
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '50%',
            zIndex: 6,
            pointerEvents: 'auto',
            touchAction: 'none',
          }}
        >
          {joy && (
            <>
              {/* ベース（可動域） */}
              <div
                style={{
                  position: 'fixed',
                  left: joy.ox,
                  top: joy.oy,
                  width: RANGE * 2,
                  height: RANGE * 2,
                  marginLeft: -RANGE,
                  marginTop: -RANGE,
                  borderRadius: '50%',
                  background: 'rgba(12,22,34,0.30)',
                  border: '1px solid rgba(255,255,255,0.30)',
                  pointerEvents: 'none',
                }}
              />
              {/* ノブ */}
              <div
                style={{
                  position: 'fixed',
                  left: joy.ox + joy.kx,
                  top: joy.oy + joy.ky,
                  width: KNOB,
                  height: KNOB,
                  marginLeft: -KNOB / 2,
                  marginTop: -KNOB / 2,
                  borderRadius: '50%',
                  background: 'rgba(232,213,155,0.88)',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.45)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}
        </div>
      )}

      {/* 右下：調べる（Eキー相当）。近接時のみ。所持品(右下)より上に浮かせる。 */}
      {nearby && !uiLocked && (
        <button
          onClick={() => triggerInteract()}
          style={{
            position: 'absolute',
            right: 'calc(28px + env(safe-area-inset-right))',
            bottom: 'calc(104px + env(safe-area-inset-bottom))',
            zIndex: 7,
            width: 84,
            height: 84,
            borderRadius: '50%',
            background: 'rgba(232,213,155,0.94)',
            color: '#20303f',
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: 1,
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            pointerEvents: 'auto',
            touchAction: 'manipulation',
          }}
        >
          調べる
        </button>
      )}
    </>
  );
}
