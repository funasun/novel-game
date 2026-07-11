import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { getGround } from './ground';
import { obstructed } from './obstacles';
import { playerPosition } from './playerState';
import { touchMove } from './touchInput';
import { consumeWarp } from './warp';
import { Character, Limbs } from './Character';
import { useGame, isUiLocked } from './store/gameStore';

// Layer 1: 操作可能アバター。WASD/矢印キー移動、ドラッグでカメラ回転、地形に接地。
// Shift（またはジョイスティックの倒し込み）でダッシュ。会話・ナレーション中は移動をロックする。

const MOVE_SPEED = 6;
const DASH_MULT = 1.55;
const CAMERA_DISTANCE = 9;

export function Player() {
  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const limbs: Limbs = { legL, legR, armL, armR };

  const keys = useRef<Record<string, boolean>>({});
  const cam = useRef({ yaw: Math.PI * 0.15, pitch: 0.42 });
  const walkT = useRef(0);
  const initialized = useRef(false);
  const gl = useThree((s) => s.gl);

  const savedPlayer = useGame((s) => s.savedPlayer);
  const pack = useGame((s) => s.pack)!;
  const spawn = savedPlayer ?? [pack.spawn[0], 0, pack.spawn[1]];

  // 初回フレーム前にオートセーブが走っても正しい位置が記録されるよう即時同期
  useEffect(() => {
    playerPosition.set(spawn[0], spawn[1], spawn[2]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => (keys.current[e.code] = true);
    const up = (e: KeyboardEvent) => (keys.current[e.code] = false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    // カメラ回転はポインタ移動量で行う。touch では e.movementX/Y が 0 になる端末が多いため、
    // 直前座標との差分を自前で取る（マウス・タッチ両対応）。指のドラッグでスクロールが
    // 走らないよう canvas は touch-action:none にする。
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const el = gl.domElement;
    el.style.touchAction = 'none';
    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      cam.current.yaw -= dx * 0.005;
      cam.current.pitch = THREE.MathUtils.clamp(cam.current.pitch + dy * 0.004, 0.12, 1.1);
    };
    const onUp = () => (dragging = false);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
    };
  }, [gl]);

  useFrame(({ camera }, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const locked = isUiLocked(useGame.getState());
    const k = keys.current;
    // キーボード（WASD/矢印）とタッチ（バーチャルジョイスティック）を合成。どちらでも動く。
    const kx = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);
    const kz = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    const inX = locked ? 0 : THREE.MathUtils.clamp(kx + touchMove.x, -1, 1);
    const inZ = locked ? 0 : THREE.MathUtils.clamp(kz + touchMove.y, -1, 1);
    const moving = inX !== 0 || inZ !== 0;

    const { yaw, pitch } = cam.current;
    const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(-fwd.z, 0, fwd.x);
    const move = new THREE.Vector3()
      .addScaledVector(fwd, inZ)
      .addScaledVector(right, inX);

    const ground = getGround();
    const p = root.current.position;

    // テレポート要求（Effects.teleport）を消費。カメラは次フレームで即座に切り替える。
    const warp = consumeWarp();
    if (warp) {
      p.x = warp[0];
      p.z = warp[1];
      initialized.current = false;
    }

    // ダッシュ：Shift または ジョイスティックを目一杯倒す（広い世界の移動をだるくしない）
    const dashing =
      moving && (k.ShiftLeft || k.ShiftRight || Math.hypot(touchMove.x, touchMove.y) > 0.92);
    if (moving) {
      move.normalize().multiplyScalar(MOVE_SPEED * (dashing ? DASH_MULT : 1) * delta);
      // 通れる先か？＝地形が歩行可 かつ 人・物にめり込まない。
      const free = (x: number, z: number) => ground.isWalkable(x, z) && !obstructed(x, z);
      const step = (dx: number, dz: number) => {
        if (free(p.x + dx, p.z + dz)) {
          p.x += dx;
          p.z += dz;
          return true;
        }
        return false;
      };
      // まず全方向、ダメなら壁ずり（片軸ずつ）。障害物に沿って滑れて引っかからない。
      if (!step(move.x, move.z) && !step(move.x, 0)) step(0, move.z);
      const targetAngle = Math.atan2(move.x, move.z);
      let diff = targetAngle - body.current.rotation.y;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      body.current.rotation.y += diff * Math.min(1, delta * 12);
      walkT.current += delta * (dashing ? 12.5 : 9);
    }
    p.y = Math.max(ground.heightAt(p.x, p.z), -0.35);
    playerPosition.copy(p);

    // 歩行アニメーション（手足の振り）
    const swing = moving ? Math.sin(walkT.current) * 0.6 : 0;
    const ease = Math.min(1, delta * 10);
    if (legL.current && legR.current && armL.current && armR.current) {
      legL.current.rotation.x += (swing - legL.current.rotation.x) * ease;
      legR.current.rotation.x += (-swing - legR.current.rotation.x) * ease;
      armL.current.rotation.x += (-swing * 0.8 - armL.current.rotation.x) * ease;
      armR.current.rotation.x += (swing * 0.8 - armR.current.rotation.x) * ease;
    }
    body.current.position.y = moving ? Math.abs(Math.sin(walkT.current)) * 0.06 : 0;

    // 三人称カメラ（背後追従・地形にめり込まない）
    const cosP = Math.cos(pitch);
    const desired = new THREE.Vector3(
      p.x + Math.sin(yaw) * cosP * CAMERA_DISTANCE,
      p.y + Math.sin(pitch) * CAMERA_DISTANCE + 1.4,
      p.z + Math.cos(yaw) * cosP * CAMERA_DISTANCE,
    );
    desired.y = Math.max(desired.y, ground.heightAt(desired.x, desired.z) + 1.3);
    if (!initialized.current) {
      initialized.current = true;
      camera.position.copy(desired);
    } else {
      camera.position.lerp(desired, 1 - Math.exp(-7 * delta));
    }
    camera.lookAt(p.x, p.y + 1.6, p.z);
  });

  return (
    <group ref={root} position={[spawn[0], spawn[1], spawn[2]]}>
      <group ref={body}>
        <Character limbs={limbs} />
      </group>
    </group>
  );
}
