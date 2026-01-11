import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import '../types';

// Simplified materials - cached and GPU optimized
export const useMaterials = () => {
  // Use MeshLambertMaterial for better GPU performance (simpler shading)
  const woodMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: '#2a1810' }), []);
  const darkWoodMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: '#1a0f0a' }), []);
  const paperMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: '#fff8e7', side: THREE.DoubleSide }), []);
  const bloodMaterial = useMemo(() => new THREE.MeshLambertMaterial({ color: '#8b0000' }), []);
  const demonMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1a0a1a', roughness: 0.4, metalness: 0.5 }), []);
  const goldMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: '#d4af37', roughness: 0.3, metalness: 0.8 }), []);
  const fireMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#ff4400', transparent: true, opacity: 0.8 }), []);

  return { woodMaterial, darkWoodMaterial, paperMaterial, bloodMaterial, demonMaterial, goldMaterial, fireMaterial };
};

// Simple lantern - using emissive instead of point light for distant lanterns
export const Lantern: React.FC<{ position: [number, number, number]; color?: string; intensity?: number }> = ({ 
  position, color = '#ffaa00', intensity = 15 
}) => {
  // Only add point light for high intensity lanterns (important ones)
  const usePointLight = intensity > 20;
  
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.25, 0.5, 0.25]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={usePointLight ? 1 : 2} />
      </mesh>
      {usePointLight && <pointLight color={color} intensity={intensity} distance={8} decay={2} />}
    </group>
  );
};

// Simple demon eye - with frame skipping
export const DemonEye: React.FC<{ position: [number, number, number]; scale?: number }> = ({ position, scale = 1 }) => {
  const eyeRef = useRef<THREE.Group>(null);
  const frameCount = useRef(0);
  
  useFrame(({ clock }) => {
    frameCount.current++;
    if (frameCount.current % 3 !== 0) return; // Skip 2 out of 3 frames
    
    if (eyeRef.current) {
      eyeRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={eyeRef} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial color="#200000" />
      </mesh>
      <mesh position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={2} />
      </mesh>
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
