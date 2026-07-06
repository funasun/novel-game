import type { RefObject } from 'react';
import * as THREE from 'three';

// Layer 1: プロシージャル少年モデル。パレット差し替えでNPCにも使う。
// limbs を渡すと親がアニメーションを制御できる。

export interface CharacterPalette {
  skin: string;
  shirt: string;
  vest: string;
  pants: string;
  hair: string;
}

export const DEFAULT_PALETTE: CharacterPalette = {
  skin: '#f0c8a0',
  shirt: '#ddd3bd',
  vest: '#7a5236',
  pants: '#3d4a63',
  hair: '#5b402a',
};

export interface Limbs {
  legL: RefObject<THREE.Group | null>;
  legR: RefObject<THREE.Group | null>;
  armL: RefObject<THREE.Group | null>;
  armR: RefObject<THREE.Group | null>;
}

export function Character({
  palette = DEFAULT_PALETTE,
  limbs,
}: {
  palette?: CharacterPalette;
  limbs?: Limbs;
}) {
  return (
    <group>
      <group ref={limbs?.legL} position={[0.11, 0.55, 0]}>
        <mesh castShadow position={[0, -0.275, 0]}>
          <boxGeometry args={[0.17, 0.55, 0.17]} />
          <meshStandardMaterial color={palette.pants} flatShading />
        </mesh>
      </group>
      <group ref={limbs?.legR} position={[-0.11, 0.55, 0]}>
        <mesh castShadow position={[0, -0.275, 0]}>
          <boxGeometry args={[0.17, 0.55, 0.17]} />
          <meshStandardMaterial color={palette.pants} flatShading />
        </mesh>
      </group>
      <mesh castShadow position={[0, 0.82, 0]}>
        <boxGeometry args={[0.44, 0.54, 0.26]} />
        <meshStandardMaterial color={palette.shirt} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.86, 0]}>
        <boxGeometry args={[0.47, 0.4, 0.29]} />
        <meshStandardMaterial color={palette.vest} flatShading />
      </mesh>
      <group ref={limbs?.armL} position={[0.29, 1.04, 0]}>
        <mesh castShadow position={[0, -0.22, 0]}>
          <boxGeometry args={[0.13, 0.48, 0.13]} />
          <meshStandardMaterial color={palette.shirt} flatShading />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={palette.skin} flatShading />
        </mesh>
      </group>
      <group ref={limbs?.armR} position={[-0.29, 1.04, 0]}>
        <mesh castShadow position={[0, -0.22, 0]}>
          <boxGeometry args={[0.13, 0.48, 0.13]} />
          <meshStandardMaterial color={palette.shirt} flatShading />
        </mesh>
        <mesh position={[0, -0.42, 0]}>
          <boxGeometry args={[0.12, 0.1, 0.12]} />
          <meshStandardMaterial color={palette.skin} flatShading />
        </mesh>
      </group>
      <mesh castShadow position={[0, 1.32, 0]}>
        <boxGeometry args={[0.32, 0.32, 0.3]} />
        <meshStandardMaterial color={palette.skin} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.47, -0.02]}>
        <boxGeometry args={[0.35, 0.13, 0.33]} />
        <meshStandardMaterial color={palette.hair} flatShading />
      </mesh>
    </group>
  );
}
