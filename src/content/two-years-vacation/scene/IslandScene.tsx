import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { setGround } from '../../../engine/ground';
import { addObstacle } from '../../../engine/obstacles';
import {
  buildIslandGeometry,
  islandHeight,
  ISLAND_RADIUS,
} from '../../../shared-assets/procedural/terrain';
import {
  scatterOnIsland,
  applyInstances,
} from '../../../shared-assets/procedural/vegetation';
import { StageProps } from './StageProps';

// Layer 3: 十五少年漂流記の舞台「チェアマン島」。
// 地形・海・植生はすべてプロシージャル生成（ライセンス完全クリーン）。

export function IslandScene() {
  useEffect(() => {
    setGround({
      heightAt: islandHeight,
      isWalkable: (x, z) =>
        islandHeight(x, z) > -0.45 && Math.hypot(x, z) < ISLAND_RADIUS * 1.05,
    });
  }, []);

  return (
    <group>
      <Terrain />
      <Ocean />
      <Vegetation />
      <StageProps />
    </group>
  );
}

function Terrain() {
  const geometry = useMemo(() => buildIslandGeometry(150), []);
  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors flatShading roughness={0.95} />
    </mesh>
  );
}

function Ocean() {
  const mesh = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(1600, 1600, 110, 110);
    g.rotateX(-Math.PI / 2);
    return g;
  }, []);
  const basePositions = useMemo(
    () => Float32Array.from(geometry.attributes.position.array),
    [geometry],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const pos = mesh.current.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = basePositions[i * 3];
      const z = basePositions[i * 3 + 2];
      pos.setY(
        i,
        Math.sin(x * 0.045 + t * 1.1) * 0.22 +
          Math.sin(z * 0.05 + t * 0.7) * 0.18 +
          Math.sin((x + z) * 0.02 + t * 0.5) * 0.12,
      );
    }
    pos.needsUpdate = true;
  });

  return (
    <group>
      <mesh ref={mesh} geometry={geometry} position={[0, 0.05, 0]}>
        <meshStandardMaterial
          color="#2e86ad"
          transparent
          opacity={0.8}
          roughness={0.3}
          metalness={0.05}
          flatShading
        />
      </mesh>
      {/* 深海の底（遠景の抜け防止） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.8, 0]}>
        <planeGeometry args={[1600, 1600]} />
        <meshStandardMaterial color="#175d7e" roughness={1} />
      </mesh>
    </group>
  );
}

function Vegetation() {
  const trees = useMemo(
    () => scatterOnIsland(200, 1234, (h, slope) => h > 1.4 && h < 11 && slope < 0.75),
    [],
  );
  const rocks = useMemo(() => scatterOnIsland(70, 5678, (h) => h > 0.3 && h < 14), []);

  const group = useMemo(() => {
    const g = new THREE.Group();
    const color = new THREE.Color();

    // 広葉樹（草地に生える）
    const trunkGeo = new THREE.CylinderGeometry(0.13, 0.22, 1.5, 5);
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#7a5a3a', flatShading: true });
    const trunks = new THREE.InstancedMesh(trunkGeo, trunkMat, trees.length);
    trunks.castShadow = true;
    applyInstances(trunks, trees, (p, d) => {
      const s = 0.8 + p.rand * 0.7;
      d.position.set(p.x, p.h + 0.7 * s, p.z);
      d.rotation.y = p.rand * Math.PI * 2;
      d.scale.setScalar(s);
    });

    const canopyGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const canopyMat = new THREE.MeshStandardMaterial({ flatShading: true });
    const canopies = new THREE.InstancedMesh(canopyGeo, canopyMat, trees.length);
    canopies.castShadow = true;
    applyInstances(canopies, trees, (p, d, i) => {
      const s = 0.8 + p.rand * 0.7;
      d.position.set(p.x, p.h + 1.9 * s, p.z);
      d.rotation.set(p.rand * 3, p.rand * 6, p.rand * 2);
      d.scale.set(s * (0.9 + p.rand * 0.3), s, s * (0.9 + ((p.rand * 7) % 1) * 0.3));
      color.setHSL(0.3 + p.rand * 0.06, 0.42, 0.32 + ((p.rand * 13) % 1) * 0.1);
      canopies.setColorAt(i, color);
    });
    canopies.instanceColor!.needsUpdate = true;

    // 岩
    const rockGeo = new THREE.IcosahedronGeometry(0.7, 0);
    const rockMat = new THREE.MeshStandardMaterial({ flatShading: true });
    const rockMesh = new THREE.InstancedMesh(rockGeo, rockMat, rocks.length);
    rockMesh.castShadow = true;
    applyInstances(rockMesh, rocks, (p, d, i) => {
      const s = 0.5 + p.rand * 1.6;
      d.position.set(p.x, p.h + 0.15 * s, p.z);
      d.rotation.set(p.rand * 4, p.rand * 8, p.rand * 5);
      d.scale.set(s, s * (0.6 + p.rand * 0.5), s);
      color.setHSL(0.08, 0.06, 0.45 + ((p.rand * 11) % 1) * 0.15);
      rockMesh.setColorAt(i, color);
    });
    rockMesh.instanceColor!.needsUpdate = true;

    // 草むら
    const tufts = scatterOnIsland(
      450,
      9012,
      (h, slope) => h > 1.3 && h < 10 && slope < 0.6,
    );
    const tuftGeo = new THREE.ConeGeometry(0.28, 0.5, 4);
    const tuftMat = new THREE.MeshStandardMaterial({ flatShading: true });
    const tuftMesh = new THREE.InstancedMesh(tuftGeo, tuftMat, tufts.length);
    applyInstances(tuftMesh, tufts, (p, d, i) => {
      const s = 0.7 + p.rand * 0.8;
      d.position.set(p.x, p.h + 0.2 * s, p.z);
      d.rotation.y = p.rand * Math.PI;
      d.scale.setScalar(s);
      color.setHSL(0.27 + p.rand * 0.05, 0.45, 0.35);
      tuftMesh.setColorAt(i, color);
    });
    tuftMesh.instanceColor!.needsUpdate = true;

    g.add(trunks, canopies, rockMesh, tuftMesh);
    return g;
  }, [trees, rocks]);

  // 幹と岩はすり抜け不可（葉・草は対象外）。散らばる位置に当たり判定を張る。
  useEffect(() => {
    const undo: Array<() => void> = [];
    for (const p of trees) undo.push(addObstacle({ x: p.x, z: p.z, r: 0.5 }));
    for (const p of rocks) {
      const s = 0.5 + p.rand * 1.6; // Vegetation の岩スケールと一致
      undo.push(addObstacle({ x: p.x, z: p.z, r: 0.4 + s * 0.3 }));
    }
    return () => undo.forEach((f) => f());
  }, [trees, rocks]);

  return <primitive object={group} />;
}
