import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store';
import '../types';

// BIGGER Japanese room - closer to center
const JapaneseRoom: React.FC<{ position: [number, number, number]; rotation?: number; scale?: number }> = ({ 
  position, rotation = 0, scale = 1 
}) => {
  const woodColor = '#2a1508';
  const frameColor = '#1a0a04';
  const paperColor = '#fff8e0';
  
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={scale}>
      {/* Floor */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[16, 0.5, 12]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} />
      </mesh>
      
      {/* Ceiling */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[16, 0.4, 12]} />
        <meshStandardMaterial color={frameColor} roughness={0.85} />
      </mesh>
      
      {/* Corner pillars */}
      {[[-7, -5], [-7, 5], [7, -5], [7, 5]].map(([x, z], i) => (
        <mesh key={i} position={[x, 4, z]}>
          <boxGeometry args={[0.6, 8, 0.6]} />
          <meshStandardMaterial color={frameColor} roughness={0.8} />
        </mesh>
      ))}
      
      {/* Shoji back wall */}
      <group position={[0, 4, -5.5]}>
        <mesh>
          <boxGeometry args={[14, 7, 0.2]} />
          <meshStandardMaterial color={paperColor} roughness={0.95} transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        {/* Grid */}
        {[-5, -2.5, 0, 2.5, 5].map((x, i) => (
          <mesh key={`v${i}`} position={[x, 0, 0.11]}>
            <boxGeometry args={[0.1, 7, 0.03]} />
            <meshStandardMaterial color={frameColor} />
          </mesh>
        ))}
        {[-2.5, 0, 2.5].map((y, i) => (
          <mesh key={`h${i}`} position={[0, y, 0.11]}>
            <boxGeometry args={[14, 0.1, 0.03]} />
            <meshStandardMaterial color={frameColor} />
          </mesh>
        ))}
      </group>
      
      {/* Side walls */}
      <mesh position={[-7.8, 4, 0]}>
        <boxGeometry args={[0.2, 7, 10]} />
        <meshStandardMaterial color={paperColor} roughness={0.95} transparent opacity={0.8} />
      </mesh>
      <mesh position={[7.8, 4, 0]}>
        <boxGeometry args={[0.2, 7, 10]} />
        <meshStandardMaterial color={paperColor} roughness={0.95} transparent opacity={0.8} />
      </mesh>
      
      {/* Lantern inside - removed point light, using emissive instead */}
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[0.5, 1, 0.5]} />
        <meshStandardMaterial color="#ff6622" emissive="#ff6622" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

// Wooden bridge - BIGGER
const WoodenBridge: React.FC<{ position: [number, number, number]; rotation?: number; length?: number }> = ({ 
  position, rotation = 0, length = 20 
}) => {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh>
        <boxGeometry args={[4, 0.4, length]} />
        <meshStandardMaterial color="#2a1508" roughness={0.9} />
      </mesh>
      {/* Railings */}
      <mesh position={[-1.8, 1.2, 0]}>
        <boxGeometry args={[0.2, 2, length]} />
        <meshStandardMaterial color="#1a0a04" roughness={0.85} />
      </mesh>
      <mesh position={[1.8, 1.2, 0]}>
        <boxGeometry args={[0.2, 2, length]} />
        <meshStandardMaterial color="#1a0a04" roughness={0.85} />
      </mesh>
    </group>
  );
};

// Giant pillar
const GiantPillar: React.FC<{ position: [number, number, number]; height?: number }> = ({ position, height = 60 }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[3, height, 3]} />
      <meshStandardMaterial color="#1a0a04" roughness={0.85} />
    </mesh>
  );
};

// Main environment - CLOSER and BIGGER
export const FloatingIslands: React.FC = () => {
  const isMobile = useStore((state) => state.isMobile);
  
  const rooms = useMemo(() => {
    const r: { pos: [number, number, number]; rot: number; scale: number }[] = [];
    
    // Reduced room count - even less on mobile
    const depthStep = isMobile ? 75 : 50;
    const roomCount = isMobile ? 2 : 3;
    
    for (let depth = -12; depth > -160; depth -= depthStep) {
      for (let i = 0; i < roomCount; i++) {
        const angle = (i / roomCount) * Math.PI * 2 + (depth * 0.04);
        const radius = 40 + (i % 2) * 12;
        r.push({
          pos: [Math.cos(angle) * radius, depth + (Math.random() - 0.5) * 3, Math.sin(angle) * radius],
          rot: angle + Math.PI,
          scale: 0.8 + Math.random() * 0.2
        });
      }
    }
    return r;
  }, [isMobile]);

  const bridges = useMemo(() => {
    const b: { pos: [number, number, number]; rot: number; len: number }[] = [];
    
    // Reduced bridge count - skip on mobile
    if (isMobile) return b;
    
    for (let depth = -12; depth > -150; depth -= 50) {
      const count = 2;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + (depth * 0.06);
        const radius = 35 + Math.random() * 8;
        b.push({
          pos: [Math.cos(angle) * radius, depth, Math.sin(angle) * radius],
          rot: angle + Math.PI / 2,
          len: 8 + Math.random() * 5
        });
      }
    }
    return b;
  }, [isMobile]);

  const pillars = useMemo(() => {
    const p: { pos: [number, number, number]; height: number }[] = [];
    
    // Reduced pillar count - less on mobile
    const pillarCount = isMobile ? 4 : 8;
    
    for (let i = 0; i < pillarCount; i++) {
      const angle = (i / pillarCount) * Math.PI * 2;
      const radius = 50 + (i % 2) * 12;
      p.push({
        pos: [Math.cos(angle) * radius, -50, Math.sin(angle) * radius],
        height: 100 + Math.random() * 40
      });
    }
    return p;
  }, [isMobile]);

  return (
    <group>
      {rooms.map((room, i) => (
        <JapaneseRoom key={`room-${i}`} position={room.pos} rotation={room.rot} scale={room.scale} />
      ))}
      
      {bridges.map((bridge, i) => (
        <WoodenBridge key={`bridge-${i}`} position={bridge.pos} rotation={bridge.rot} length={bridge.len} />
      ))}
      
      {pillars.map((pillar, i) => (
        <GiantPillar key={`pillar-${i}`} position={pillar.pos} height={pillar.height} />
      ))}
    </group>
  );
};

// Particles - optimized with frame skipping
export const Particles: React.FC = () => {
  const isMobile = useStore((state) => state.isMobile);
  const count = isMobile ? 10 : 20; // Even less on mobile
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const frameCount = useRef(0);
  
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 160,
      z: (Math.random() - 0.5) * 80,
      speed: 0.1 + Math.random() * 0.2,
      size: 0.1 + Math.random() * 0.15
    }));
  }, [count]);

  useFrame((state) => {
    // Skip more frames on mobile
    frameCount.current++;
    const skipFrames = isMobile ? 3 : 2;
    if (frameCount.current % skipFrames !== 0) return;
    
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();
    const cameraY = state.camera.position.y;

    particles.forEach((p, i) => {
      let y = p.y + time * p.speed + cameraY;
      const dist = y - cameraY;
      if (dist > 80) y -= 160;
      if (dist < -80) y += 160;

      dummy.position.set(p.x, y, p.z);
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ff6633" transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Glowing core - simplified
export const InfinityCore: React.FC = () => {
  return (
    <group position={[0, -80, 0]}>
      <mesh>
        <sphereGeometry args={[6, 8, 8]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.4} />
      </mesh>
      <pointLight color="#ff4400" intensity={100} distance={120} decay={2} />
    </group>
  );
};
