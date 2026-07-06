import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGame } from './store/gameStore';
import { getGround } from './ground';
import { playerPosition } from './playerState';
import { guidance } from './guidance';

// Layer 1: 目標地点への「光の柱」ガイド。進行中クエストの waypoint(コンテンツ側の座標)に、
// 明滅する光柱・浮遊する目印・地面の光輪を立てて「次はどこへ行くか」を世界の中で示す。
// 併せて、カメラ基準の方位を guidance へ書き出し、HUDの方向矢印に橋渡しする。
// エンジンは物語を知らない——waypoint が無いクエストでは何も出さない。

const BEAM_COLOR = '#ffd579';
const NEAR_FADE = 7; // この距離以内で薄れ始める
const NEAR_HIDE = 2.6; // この距離以内で消える（到着とみなす）

const _dir = new THREE.Vector3();

export function Waypoint() {
  const quests = useGame((s) => s.quests);
  const pack = useGame((s) => s.pack);

  // 進行中クエストの目標座標。無ければ誘導なし。
  const target = useMemo(() => {
    if (!pack) return null;
    const active = quests.find((q) => q.status === 'active');
    const wp = active ? pack.quests[active.id]?.waypoint : undefined;
    if (!wp) return null;
    return new THREE.Vector3(wp[0], getGround().heightAt(wp[0], wp[1]), wp[1]);
  }, [quests, pack]);

  const group = useRef<THREE.Group>(null!);
  const beam = useRef<THREE.Mesh>(null!);
  const markerGroup = useRef<THREE.Group>(null!);
  const marker = useRef<THREE.Mesh>(null!);
  const ring = useRef<THREE.Mesh>(null!);

  useFrame(({ clock, camera }) => {
    if (!target) {
      guidance.active = false;
      return;
    }
    const t = clock.elapsedTime;
    const dist = Math.hypot(target.x - playerPosition.x, target.z - playerPosition.z);

    // HUDの方向矢印用：カメラの向きと目標方位の差（画面基準の回転角）。
    const camDir = camera.getWorldDirection(_dir);
    let rel =
      Math.atan2(camDir.x, camDir.z) -
      Math.atan2(target.x - playerPosition.x, target.z - playerPosition.z);
    rel = Math.atan2(Math.sin(rel), Math.cos(rel));
    guidance.active = true;
    guidance.distance = dist;
    guidance.relAngle = rel;

    // 近づくほど薄く、到着で消す（目印が視界と調べる操作を邪魔しないように）。
    const fade =
      dist <= NEAR_HIDE
        ? 0
        : dist >= NEAR_FADE
          ? 1
          : (dist - NEAR_HIDE) / (NEAR_FADE - NEAR_HIDE);
    group.current.visible = fade > 0.02;
    if (!group.current.visible) return;

    const pulse = 0.8 + Math.sin(t * 2.2) * 0.2;
    (beam.current.material as THREE.MeshBasicMaterial).opacity = 0.26 * fade * pulse;
    (marker.current.material as THREE.MeshBasicMaterial).opacity = 0.95 * fade;
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * fade * pulse;

    markerGroup.current.rotation.y = t * 1.1;
    markerGroup.current.position.y = 3.4 + Math.sin(t * 1.6) * 0.28;
    markerGroup.current.scale.setScalar(0.9 + Math.sin(t * 2.2) * 0.08);
  });

  if (!target) return null;

  return (
    <group ref={group} position={[target.x, target.y, target.z]}>
      {/* 光の柱（樹冠より高く突き抜ける） */}
      <mesh ref={beam} position={[0, 7, 0]}>
        <cylinderGeometry args={[0.5, 0.95, 14, 14, 1, true]} />
        <meshBasicMaterial
          color={BEAM_COLOR}
          transparent
          opacity={0.26}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* 浮遊する目印（ひし形） */}
      <group ref={markerGroup} position={[0, 3.4, 0]}>
        <mesh ref={marker}>
          <octahedronGeometry args={[0.5, 0]} />
          <meshBasicMaterial color={BEAM_COLOR} transparent opacity={0.95} toneMapped={false} />
        </mesh>
      </group>

      {/* 地面の光輪 */}
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.14, 0]}>
        <ringGeometry args={[0.75, 1.05, 28]} />
        <meshBasicMaterial
          color={BEAM_COLOR}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
