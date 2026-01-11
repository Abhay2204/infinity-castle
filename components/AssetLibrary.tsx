import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../types';

// Simplified materials - cached
export const useMaterials = () => {
  const woodMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a1810', roughness: 0.85 }), []);
  const darkWoodMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a0f0a', roughness: 0.9 }), []);
  const paperMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fff8e7', roughness: 0.95, side: THREE.DoubleSide }), []);
  const bloodMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8b0000', roughness: 0.5 }), []);
  const demonMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a0a1a', roughness: 0.4, metalness: 0.5 }), []);
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.3, metalness: 0.8 }), []);
  const fireMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ff4400', transparent: true, opacity: 0.8 }), []);

  return { woodMaterial, darkWoodMaterial, paperMaterial, bloodMaterial, demonMaterial, goldMaterial, fireMaterial };
};

// Simple lantern - minimal geometry
export const Lantern: React.FC<{ position: [number, number, number]; color?: string; intensity?: number }> = ({ 
  position, color = '#ffaa00', intensity = 15 
}) => {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <pointLight color={color} intensity={intensity} distance={8} decay={2} />
    </group>
  );
};

// Simple demon eye
export const DemonEye: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const eyeRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={eyeRef} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshStandardMaterial color="#200000" />
      </mesh>
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      <pointLight color="#ff0000" intensity={3} distance={3} decay={2} />
    </group>
  );
};

// Simple floating platform
export const FloatingPlatform: React.FC<{ position: [number, number, number]; size?: [number, number, number] }> = ({ 
  position, size = [4, 0.3, 4] 
}) => {
  const { woodMaterial } = useMaterials();
  return (
    <mesh position={position} material={woodMaterial}>
      <boxGeometry args={size} />
    </mesh>
  );
};
