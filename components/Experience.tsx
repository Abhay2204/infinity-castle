import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PlayerController } from './PlayerController';
import { SectionManager } from './Sections';
import { FloatingIslands, Particles, InfinityCore } from './FloatingIslands';
import '../types';

export const Experience: React.FC = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 65, near: 0.1, far: 400 }}
      dpr={[1, 1.5]}
      gl={{ 
        antialias: false,
        powerPreference: 'high-performance',
        stencil: false
      }}
    >
      {/* Dark warm background */}
      <color attach="background" args={['#080402']} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0503', 40, 150]} />

      <Suspense fallback={null}>
        {/* Warm ambient light */}
        <ambientLight intensity={0.25} color="#ffaa77" />
        
        {/* Main directional - warm orange from above */}
        <directionalLight position={[10, 20, 10]} intensity={0.5} color="#ff9966" />
        
        {/* Orange glow from below */}
        <pointLight position={[0, -30, 0]} intensity={50} color="#ff5500" distance={80} decay={2} />
        <pointLight position={[0, -70, 0]} intensity={60} color="#ff4400" distance={100} decay={2} />
        
        {/* Side accent lights */}
        <pointLight position={[30, -50, 30]} intensity={25} color="#ff6633" distance={60} decay={2} />
        <pointLight position={[-30, -50, -30]} intensity={25} color="#ff6633" distance={60} decay={2} />
        
        {/* Player Controller */}
        <PlayerController />
        
        {/* Scene */}
        <FloatingIslands />
        <SectionManager />
        <Particles />
        <InfinityCore />
      </Suspense>
    </Canvas>
  );
};
