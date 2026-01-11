import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, Preload } from '@react-three/drei';
import { PlayerController } from './PlayerController';
import { SectionManager } from './Sections';
import { FloatingIslands, Particles, InfinityCore } from './FloatingIslands';
import { useStore } from '../store';
import '../types';

export const Experience: React.FC = () => {
  const isMobile = useStore((state) => state.isMobile);
  
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 65, near: 0.1, far: 400 }}
      dpr={isMobile ? [0.5, 1] : [1, 2]} // Higher max DPR for desktop
      gl={{ 
        antialias: !isMobile, // Enable antialiasing on desktop for smoother edges
        powerPreference: 'high-performance', // Always prefer GPU
        stencil: false,
        depth: true,
        alpha: false,
        preserveDrawingBuffer: false, // Better performance
        failIfMajorPerformanceCaveat: false, // Don't fail on software rendering
        precision: isMobile ? 'mediump' : 'highp', // Lower precision on mobile
      }}
      performance={{ min: 0.5 }}
      flat
      frameloop="always" // Continuous rendering for smooth animations
    >
      {/* Adaptive performance helpers */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
      
      {/* Dark warm background */}
      <color attach="background" args={['#080402']} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#0a0503', 40, 150]} />

      <Suspense fallback={null}>
        {/* Warm ambient light */}
        <ambientLight intensity={0.25} color="#ffaa77" />
        
        {/* Main directional - warm orange from above */}
        <directionalLight position={[10, 20, 10]} intensity={0.5} color="#ff9966" />
        
        {/* Orange glow from below - consolidated */}
        <pointLight position={[0, -50, 0]} intensity={80} color="#ff5500" distance={120} decay={2} />
        
        {/* Player Controller */}
        <PlayerController />
        
        {/* Scene */}
        <FloatingIslands />
        <SectionManager />
        <Particles />
        <InfinityCore />
        
        {/* Preload all assets for smoother experience */}
        <Preload all />
      </Suspense>
    </Canvas>
  );
};
