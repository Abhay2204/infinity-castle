import React, { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMaterials, Lantern, FloatingPlatform, DemonEye } from './AssetLibrary';
import { SECTIONS, UPPER_MOONS } from '../types';
import { useStore } from '../store';

// BIGGER scale for text panels
const PANEL_SCALE = 1.2;
const PANEL_Z = 8;

// Enhanced Torii Gate Component
const ToriiGate: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const { bloodMaterial, goldMaterial } = useMaterials();
  const glowRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Group>(null);
  
  // Animated glow effect
  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.intensity = 25 + Math.sin(clock.getElapsedTime() * 2) * 10;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main pillars with tapered design - lowered */}
      <mesh material={bloodMaterial} position={[-5.5, 1.5, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 8, 8]} />
      </mesh>
      <mesh material={bloodMaterial} position={[5.5, 1.5, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 8, 8]} />
      </mesh>
      
      {/* Pillar bases */}
      <mesh material={bloodMaterial} position={[-5.5, -2.8, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.6, 8]} />
      </mesh>
      <mesh material={bloodMaterial} position={[5.5, -2.8, 0]}>
        <cylinderGeometry args={[0.6, 0.7, 0.6, 8]} />
      </mesh>
      
      {/* Top beam (kasagi) - lowered */}
      <mesh material={bloodMaterial} position={[0, 5.8, 0]}>
        <boxGeometry args={[14, 0.6, 0.7]} />
      </mesh>
      {/* Curved ends */}
      <mesh material={bloodMaterial} position={[-7.2, 6, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[1.5, 0.5, 0.7]} />
      </mesh>
      <mesh material={bloodMaterial} position={[7.2, 6, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[1.5, 0.5, 0.7]} />
      </mesh>
      
      {/* Secondary beam (nuki) */}
      <mesh material={bloodMaterial} position={[0, 4.2, 0]}>
        <boxGeometry args={[12, 0.4, 0.5]} />
      </mesh>
      
      {/* Decorative tablet (gakuzuka) */}
      <mesh position={[0, 5, 0.5]}>
        <boxGeometry args={[2.5, 1.2, 0.15]} />
        <meshStandardMaterial color="#1a0505" roughness={0.3} />
      </mesh>
      {/* Gold frame around tablet */}
      <mesh material={goldMaterial} position={[0, 5, 0.55]}>
        <boxGeometry args={[2.8, 1.5, 0.08]} />
      </mesh>
      <mesh position={[0, 5, 0.6]}>
        <boxGeometry args={[2.3, 1, 0.1]} />
        <meshStandardMaterial color="#0a0000" />
      </mesh>
      
      {/* Gold ornamental caps on pillars */}
      <mesh material={goldMaterial} position={[-5.5, 5.6, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
      </mesh>
      <mesh material={goldMaterial} position={[5.5, 5.6, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
      </mesh>
      
      {/* Hanging shimenawa rope effect */}
      <mesh position={[0, 3.5, 0.4]}>
        <torusGeometry args={[4.5, 0.1, 8, 32, Math.PI]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
      </mesh>
      
      {/* Hanging paper strips (shide) */}
      {[-2.5, -1.2, 0, 1.2, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 2.8, 0.5]} rotation={[0.1, 0, Math.sin(i) * 0.1]}>
          <boxGeometry args={[0.25, 1, 0.02]} />
          <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      ))}
      
      {/* Glowing demon kanji on tablet */}
      <pointLight ref={glowRef} position={[0, 5, 1.5]} color="#ff2200" intensity={25} distance={8} />
      
      {/* Atmospheric red glow under gate */}
      <pointLight position={[0, 0, 0]} color="#ff3300" intensity={40} distance={12} />
      <pointLight position={[0, 3, 2]} color="#ff4400" intensity={20} distance={10} />
      
      {/* Floating ember particles around gate */}
      <group ref={particlesRef}>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 4 + Math.random() * 2;
          const height = 0 + Math.random() * 4;
          return (
            <mesh key={i} position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshBasicMaterial color={i % 2 === 0 ? "#ff4400" : "#ff6600"} />
            </mesh>
          );
        })}
      </group>
      
      {/* Ground glow effect */}
      <mesh position={[0, -2.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 8, 32]} />
        <meshBasicMaterial color="#ff2200" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Hero Section - BIGGER
const HeroSection: React.FC = () => {
  const { woodMaterial, goldMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  const flameRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (flameRef.current) {
      flameRef.current.children.forEach((child, i) => {
        child.scale.y = 1 + Math.sin(clock.getElapsedTime() * 3 + i) * 0.3;
      });
    }
  });
  
  return (
    <group position={[0, SECTIONS[0].depth, 0]}>
      {/* Larger platform */}
      <FloatingPlatform position={[0, -3, 0]} size={[22, 0.6, 18]} />
      
      {/* Enhanced Torii Gate */}
      <ToriiGate position={[0, 0, -6]} />
      
      {/* Flame braziers on either side of gate */}
      <group ref={flameRef}>
        {[[-7, -6], [7, -6]].map(([x, z], idx) => (
          <group key={idx} position={[x, -2, z]}>
            {/* Brazier stand */}
            <mesh material={goldMaterial} position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.4, 0.6, 0.5, 8]} />
            </mesh>
            {/* Animated flames */}
            <mesh position={[0, 1, 0]}>
              <coneGeometry args={[0.35, 1.2, 8]} />
              <meshBasicMaterial color="#ff4400" transparent opacity={0.9} />
            </mesh>
            <pointLight position={[0, 1, 0]} color="#ff4400" intensity={25} distance={8} />
          </group>
        ))}
      </group>
      
      {/* Lanterns - lowered */}
      <Lantern position={[-4, 0, -4]} color="#ff4400" intensity={30} />
      <Lantern position={[4, 0, -4]} color="#ff4400" intensity={30} />
      <Lantern position={[-8, 0, 0]} color="#ff6600" intensity={25} />
      <Lantern position={[8, 0, 0]} color="#ff6600" intensity={25} />
      
      {/* Demon eyes - lowered */}
      <DemonEye position={[-9, 2, -3]} scale={1.5} />
      <DemonEye position={[9, 2, -3]} scale={1.5} />
      
      {/* Side pillars - shorter */}
      <mesh material={woodMaterial} position={[-10, 0, 0]}><boxGeometry args={[0.7, 5, 0.7]} /></mesh>
      <mesh material={woodMaterial} position={[10, 0, 0]}><boxGeometry args={[0.7, 5, 0.7]} /></mesh>
      <mesh material={goldMaterial} position={[-10, 2.8, 0]}><sphereGeometry args={[0.4, 8, 8]} /></mesh>
      <mesh material={goldMaterial} position={[10, 2.8, 0]}><sphereGeometry args={[0.4, 8, 8]} /></mesh>
      
      {/* Stone path leading to gate */}
      {[0, 2, 4].map((z, i) => (
        <mesh key={i} material={woodMaterial} position={[0, -2.6, z - 2]}>
          <boxGeometry args={[2.5 - i * 0.3, 0.15, 1.2]} />
        </mesh>
      ))}
      
      {showTexts && (
        <Html position={[0, 1, PANEL_Z]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '500px' }}>
            <h1 className="text-7xl font-bold text-white mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 40px #ff4400, 0 0 80px #ff4400, 0 0 120px #ff2200' }}>無限城</h1>
            <h2 className="text-3xl text-orange-400 mb-6" style={{ textShadow: '0 0 20px #ff6600' }}>INFINITY CASTLE</h2>
            <p className="text-xl text-gray-200 leading-relaxed">The dimensional fortress of Muzan Kibutsuji. A realm where space and time bend to the will of demons.</p>
            <p className="text-lg text-orange-500 mt-8 animate-pulse">▼ SCROLL TO DESCEND ▼</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Muzan Section - BIGGER
const MuzanSection: React.FC = () => {
  const { demonMaterial, goldMaterial, bloodMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  const orbRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      orbRef.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 2) * 0.1);
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.y = clock.getElapsedTime() * 0.3;
      ringsRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });
  
  return (
    <group position={[0, SECTIONS[1].depth, 0]}>
      <FloatingPlatform position={[0, -5, 0]} size={[20, 0.6, 16]} />
      
      {/* Grand Demon Gate Structure */}
      <group position={[0, 0, -5]}>
        {/* Main gate pillars */}
        <mesh material={demonMaterial} position={[-4, -1, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 8, 8]} />
        </mesh>
        <mesh material={demonMaterial} position={[4, -1, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 8, 8]} />
        </mesh>
        
        {/* Pillar bases */}
        <mesh material={goldMaterial} position={[-4, -5.2, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.5, 8]} />
        </mesh>
        <mesh material={goldMaterial} position={[4, -5.2, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.5, 8]} />
        </mesh>
        
        {/* Top arch beam */}
        <mesh material={demonMaterial} position={[0, 3.2, 0]}>
          <boxGeometry args={[10, 0.8, 0.8]} />
        </mesh>
        
        {/* Curved arch top */}
        <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[4, 0.3, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#1a0a1a" roughness={0.4} metalness={0.5} />
        </mesh>
        
        {/* Gold ornaments on pillars */}
        <mesh material={goldMaterial} position={[-4, 3.2, 0]}>
          <sphereGeometry args={[0.4, 8, 8]} />
        </mesh>
        <mesh material={goldMaterial} position={[4, 3.2, 0]}>
          <sphereGeometry args={[0.4, 8, 8]} />
        </mesh>
        
        {/* Demon eye in center of arch */}
        <mesh ref={orbRef} position={[0, 4.5, 0.5]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#9900ff" />
        </mesh>
        <pointLight position={[0, 4.5, 1]} color="#9900ff" intensity={30} distance={10} />
        
        {/* Floating rings around the eye */}
        <group ref={ringsRef} position={[0, 4.5, 0.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1, 0.05, 8, 32]} />
            <meshBasicMaterial color="#cc66ff" />
          </mesh>
          <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
            <torusGeometry args={[1.3, 0.04, 8, 32]} />
            <meshBasicMaterial color="#9933ff" />
          </mesh>
        </group>
      </group>
      
      {/* Grand Throne */}
      <group position={[0, -2, -3]}>
        {/* Throne back - tall and imposing */}
        <mesh material={demonMaterial} position={[0, 1.5, -1]}>
          <boxGeometry args={[5, 6, 0.5]} />
        </mesh>
        {/* Throne back top decoration */}
        <mesh material={goldMaterial} position={[0, 4.8, -1]}>
          <boxGeometry args={[5.5, 0.4, 0.6]} />
        </mesh>
        {/* Throne seat */}
        <mesh material={goldMaterial} position={[0, -1.5, 0]}>
          <boxGeometry args={[4, 0.8, 2.5]} />
        </mesh>
        {/* Arm rests */}
        <mesh material={demonMaterial} position={[-2.2, 0, 0]}>
          <boxGeometry args={[0.5, 3, 2]} />
        </mesh>
        <mesh material={demonMaterial} position={[2.2, 0, 0]}>
          <boxGeometry args={[0.5, 3, 2]} />
        </mesh>
        {/* Arm rest tops */}
        <mesh material={goldMaterial} position={[-2.2, 1.6, 0]}>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
        <mesh material={goldMaterial} position={[2.2, 1.6, 0]}>
          <sphereGeometry args={[0.35, 8, 8]} />
        </mesh>
      </group>
      
      {/* Blood pillars with veins effect */}
      {[[-8, -2], [8, -2], [-6, 4], [6, 4]].map(([x, z], i) => (
        <group key={i} position={[x, -1, z]}>
          <mesh material={bloodMaterial}>
            <cylinderGeometry args={[0.35, 0.45, 8, 8]} />
          </mesh>
          <pointLight position={[0, 0, 0]} color="#ff0033" intensity={5} distance={4} />
        </group>
      ))}
      
      {/* Floating blood orbs */}
      {[[-3, 2, 2], [3, 2, 2], [-5, 0, 0], [5, 0, 0]].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshBasicMaterial color="#ff0044" transparent opacity={0.8} />
          </mesh>
          <pointLight color="#ff0044" intensity={8} distance={5} />
        </group>
      ))}
      
      {/* Purple mist lights */}
      <pointLight position={[0, -3, 0]} color="#9933ff" intensity={50} distance={15} />
      <pointLight position={[0, 2, 5]} color="#6600cc" intensity={30} distance={12} />
      
      <DemonEye position={[-7, 0, 3]} scale={1.5} />
      <DemonEye position={[7, 0, 3]} scale={1.5} />
      <Lantern position={[-5, -2, 5]} color="#9933ff" intensity={35} />
      <Lantern position={[5, -2, 5]} color="#9933ff" intensity={35} />
      
      {showTexts && (
        <Html position={[0, -1, PANEL_Z]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '480px' }}>
            <h2 className="text-6xl font-bold text-purple-400 mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 30px #9933ff, 0 0 60px #9933ff' }}>鬼舞辻無惨</h2>
            <h3 className="text-2xl text-white mb-5">MUZAN KIBUTSUJI - The Demon King</h3>
            <div className="bg-black/40 p-6 rounded-xl border-2 border-purple-500/60">
              <p className="text-lg text-gray-200 mb-5">The progenitor of all demons, over 1000 years old. His blood can transform humans into demons or destroy them.</p>
              <div className="grid grid-cols-2 gap-4 text-base">
                <div className="bg-purple-900/70 p-3 rounded-lg"><span className="text-purple-300">Age:</span> <span className="text-white font-bold">1000+ years</span></div>
                <div className="bg-purple-900/70 p-3 rounded-lg"><span className="text-purple-300">Goal:</span> <span className="text-white font-bold">Blue Spider Lily</span></div>
                <div className="bg-purple-900/70 p-3 rounded-lg"><span className="text-purple-300">Weakness:</span> <span className="text-white font-bold">Sunlight</span></div>
                <div className="bg-purple-900/70 p-3 rounded-lg"><span className="text-purple-300">Title:</span> <span className="text-white font-bold">Demon King</span></div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Upper Moons - BIGGER
const UpperMoonsSection: React.FC = () => {
  const { woodMaterial, bloodMaterial, goldMaterial, demonMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  const moonRef = useRef<THREE.Group>(null);
  const orbsRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
    if (orbsRef.current) {
      orbsRef.current.children.forEach((child, i) => {
        child.position.y = -2 + Math.sin(clock.getElapsedTime() * 0.8 + i * 1.2) * 0.5;
      });
    }
  });
  
  return (
    <group position={[0, SECTIONS[2].depth, 0]}>
      <FloatingPlatform position={[0, -5, 0]} size={[24, 0.6, 20]} />
      
      {/* Grand Moon Gate Structure */}
      <group position={[0, 0, -7]}>
        {/* Main arch pillars */}
        <mesh material={demonMaterial} position={[-6, -1, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 8, 8]} />
        </mesh>
        <mesh material={demonMaterial} position={[6, -1, 0]}>
          <cylinderGeometry args={[0.6, 0.7, 8, 8]} />
        </mesh>
        
        {/* Pillar bases with blood accents */}
        <mesh material={bloodMaterial} position={[-6, -5.3, 0]}>
          <cylinderGeometry args={[0.9, 1, 0.6, 8]} />
        </mesh>
        <mesh material={bloodMaterial} position={[6, -5.3, 0]}>
          <cylinderGeometry args={[0.9, 1, 0.6, 8]} />
        </mesh>
        
        {/* Crescent moon arch */}
        <mesh position={[0, 4, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[5.5, 0.4, 8, 32, Math.PI]} />
          <meshStandardMaterial color="#ff6633" emissive="#ff4400" emissiveIntensity={0.3} />
        </mesh>
        
        {/* Inner crescent */}
        <mesh position={[0, 4.5, 0.3]} rotation={[0, 0, 0]}>
          <torusGeometry args={[4.5, 0.2, 8, 32, Math.PI * 0.8]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={0.5} />
        </mesh>
        
        {/* Moon symbol at top */}
        <mesh position={[0, 5.5, 0.5]}>
          <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshBasicMaterial color="#ff6633" />
        </mesh>
        <pointLight position={[0, 5.5, 1]} color="#ff6633" intensity={40} distance={12} />
        
        {/* Kanji tablets on pillars */}
        <mesh material={goldMaterial} position={[-6, 1, 0.5]}>
          <boxGeometry args={[0.8, 1.5, 0.1]} />
        </mesh>
        <mesh material={goldMaterial} position={[6, 1, 0.5]}>
          <boxGeometry args={[0.8, 1.5, 0.1]} />
        </mesh>
      </group>
      
      {/* Six demon pedestals for Upper Moons - arranged in even circle */}
      <group ref={moonRef}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i / 6) * Math.PI * 2;
          const radius = 8;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const colors = ['#6633ff', '#33ccff', '#ff3366', '#9933ff', '#33ff99', '#ffcc00'];
          return (
            <group key={i} position={[x, -3, z]}>
              {/* Pedestal base */}
              <mesh material={demonMaterial}>
                <cylinderGeometry args={[1.2, 1.4, 0.5, 8]} />
              </mesh>
              {/* Pedestal column */}
              <mesh material={woodMaterial} position={[0, 1.2, 0]}>
                <cylinderGeometry args={[0.4, 0.5, 2, 8]} />
              </mesh>
              {/* Glowing orb on top */}
              <mesh position={[0, 2.5, 0]}>
                <sphereGeometry args={[0.4, 12, 12]} />
                <meshBasicMaterial color={colors[i]} />
              </mesh>
              <pointLight position={[0, 2.5, 0]} color={colors[i]} intensity={15} distance={6} />
              {/* Rank number ring */}
              <mesh position={[0, 0.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[1, 0.08, 8, 32]} />
                <meshBasicMaterial color={colors[i]} />
              </mesh>
            </group>
          );
        })}
      </group>
      
      {/* Floating demon eye orbs */}
      <group ref={orbsRef}>
        {[[-10, 3], [10, 3], [-8, -4], [8, -4]].map(([x, z], i) => (
          <group key={i} position={[x, -2, z]}>
            <mesh>
              <sphereGeometry args={[0.5, 12, 12]} />
              <meshStandardMaterial color="#200000" />
            </mesh>
            <mesh position={[0, 0, 0.4]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshBasicMaterial color="#ff0000" />
            </mesh>
            <pointLight color="#ff0000" intensity={8} distance={5} />
          </group>
        ))}
      </group>
      
      {/* Blood veins on floor */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} material={bloodMaterial} position={[Math.cos(angle) * 6, -4.6, Math.sin(angle) * 6]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.15, 0.1, 6]} />
          </mesh>
        );
      })}
      
      {/* Corner demon pillars */}
      {[[-10, -8], [10, -8], [-10, 6], [10, 6]].map(([x, z], i) => (
        <group key={i} position={[x, -2, z]}>
          <mesh material={woodMaterial}>
            <boxGeometry args={[0.8, 6, 0.8]} />
          </mesh>
          <mesh material={goldMaterial} position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.5, 8, 8]} />
          </mesh>
          <Lantern position={[0, 1, 1]} color={i < 2 ? "#6633ff" : "#ff6633"} intensity={20} />
        </group>
      ))}
      
      {/* Atmospheric lighting */}
      <pointLight position={[0, -2, 0]} color="#ff6633" intensity={40} distance={18} />
      <pointLight position={[0, 3, -5]} color="#ff4400" intensity={30} distance={15} />
      
      <DemonEye position={[-5, 2, -6]} scale={1.3} />
      <DemonEye position={[5, 2, -6]} scale={1.3} />
      
      {showTexts && (
        <Html position={[0, -1, PANEL_Z + 2]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '550px' }}>
            <h2 className="text-6xl font-bold text-orange-400 mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 30px #ff6633, 0 0 60px #ff6633' }}>上弦の鬼</h2>
            <h3 className="text-2xl text-white mb-5">THE UPPER MOONS</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              {UPPER_MOONS.slice(0, 6).map((demon, i) => (
                <div key={i} className="bg-black/40 p-4 rounded-lg border-2 border-orange-500/50">
                  <div className="text-orange-400 font-bold text-lg">{demon.rank}</div>
                  <div className="text-white text-base font-semibold">{demon.name}</div>
                  <div className="text-purple-300 text-sm mt-1">{demon.bloodDemonArt}</div>
                </div>
              ))}
            </div>
            <p className="text-base text-gray-300 mt-5">The six most powerful demons serving directly under Muzan Kibutsuji.</p>
          </div>
        </Html>
      )}
    </group>
  );
};

// Architecture - BIGGER
const ArchitectureSection: React.FC = () => {
  const { woodMaterial, darkWoodMaterial, goldMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  const portalRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (portalRef.current) {
      portalRef.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });
  
  return (
    <group position={[0, SECTIONS[3].depth, 0]}>
      <FloatingPlatform position={[0, -5, 0]} size={[22, 0.6, 18]} />
      
      {/* Grand Japanese Gate Structure */}
      <group position={[0, 0, -5]}>
        {/* Main pillars */}
        <mesh material={darkWoodMaterial} position={[-5, -1, 0]}>
          <boxGeometry args={[0.8, 8, 0.8]} />
        </mesh>
        <mesh material={darkWoodMaterial} position={[5, -1, 0]}>
          <boxGeometry args={[0.8, 8, 0.8]} />
        </mesh>
        
        {/* Pillar bases */}
        <mesh material={woodMaterial} position={[-5, -5.2, 0]}>
          <boxGeometry args={[1.2, 0.5, 1.2]} />
        </mesh>
        <mesh material={woodMaterial} position={[5, -5.2, 0]}>
          <boxGeometry args={[1.2, 0.5, 1.2]} />
        </mesh>
        
        {/* Top beam */}
        <mesh material={darkWoodMaterial} position={[0, 3.5, 0]}>
          <boxGeometry args={[12, 0.6, 0.8]} />
        </mesh>
        
        {/* Roof structure */}
        <mesh material={woodMaterial} position={[0, 4.5, 0]}>
          <boxGeometry args={[13, 0.4, 1.5]} />
        </mesh>
        <mesh material={woodMaterial} position={[-6.8, 4.3, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
        </mesh>
        <mesh material={woodMaterial} position={[6.8, 4.3, 0]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[1.5, 0.4, 1.5]} />
        </mesh>
        
        {/* Secondary beam */}
        <mesh material={darkWoodMaterial} position={[0, 2, 0]}>
          <boxGeometry args={[10, 0.4, 0.6]} />
        </mesh>
        
        {/* Portal ring in center */}
        <mesh ref={portalRef} position={[0, 0, 0.5]} rotation={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.12, 16, 64]} />
          <meshStandardMaterial color="#33ccff" emissive="#0099cc" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 0, 1]} color="#33ccff" intensity={40} distance={10} />
        
        {/* Inner portal glow */}
        <mesh position={[0, 0, 0.3]}>
          <circleGeometry args={[2.3, 32]} />
          <meshBasicMaterial color="#33ccff" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Gold ornaments */}
        <mesh material={goldMaterial} position={[-5, 3.5, 0.5]}>
          <sphereGeometry args={[0.3, 8, 8]} />
        </mesh>
        <mesh material={goldMaterial} position={[5, 3.5, 0.5]}>
          <sphereGeometry args={[0.3, 8, 8]} />
        </mesh>
        <mesh material={goldMaterial} position={[0, 4.8, 0.5]}>
          <sphereGeometry args={[0.4, 8, 8]} />
        </mesh>
      </group>
      
      {/* Floating staircase platforms */}
      {[
        [-7, -3, 2], [-5, -2.5, 4], [-3, -2, 6],
        [7, -3, 2], [5, -2.5, 4], [3, -2, 6],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh material={woodMaterial}>
            <boxGeometry args={[2.5, 0.3, 2.5]} />
          </mesh>
          <pointLight position={[0, 0.5, 0]} color="#33ccff" intensity={8} distance={4} />
        </group>
      ))}
      
      {/* Side corridor frames */}
      {[[-9, 0], [9, 0]].map(([x, z], i) => (
        <group key={i} position={[x, -2, z]} rotation={[0, i === 0 ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <mesh material={darkWoodMaterial} position={[-1.5, 0, 0]}>
            <boxGeometry args={[0.4, 5, 0.4]} />
          </mesh>
          <mesh material={darkWoodMaterial} position={[1.5, 0, 0]}>
            <boxGeometry args={[0.4, 5, 0.4]} />
          </mesh>
          <mesh material={darkWoodMaterial} position={[0, 2.6, 0]}>
            <boxGeometry args={[3.4, 0.4, 0.4]} />
          </mesh>
          <mesh position={[0, 0, 0.3]}>
            <planeGeometry args={[2.6, 4.8]} />
            <meshBasicMaterial color="#33ccff" transparent opacity={0.1} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      
      {/* Corner pillars with lanterns */}
      {[[-10, -7], [10, -7], [-10, 6], [10, 6]].map(([x, z], i) => (
        <group key={i} position={[x, -2, z]}>
          <mesh material={darkWoodMaterial}>
            <boxGeometry args={[0.6, 6, 0.6]} />
          </mesh>
          <mesh material={goldMaterial} position={[0, 3.2, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
          </mesh>
        </group>
      ))}
      
      <Lantern position={[-6, -1, 4]} color="#33ccff" intensity={25} />
      <Lantern position={[6, -1, 4]} color="#33ccff" intensity={25} />
      <Lantern position={[-3, 0, -4]} color="#33ccff" intensity={20} />
      <Lantern position={[3, 0, -4]} color="#33ccff" intensity={20} />
      
      <pointLight position={[0, -3, 0]} color="#33ccff" intensity={40} distance={18} />
      
      {showTexts && (
        <Html position={[0, -1, PANEL_Z]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '460px' }}>
            <h2 className="text-6xl font-bold text-cyan-400 mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 30px #33ccff, 0 0 60px #33ccff' }}>建築</h2>
            <h3 className="text-2xl text-white mb-5">IMPOSSIBLE ARCHITECTURE</h3>
            <div className="bg-black/40 p-6 rounded-xl border-2 border-cyan-500/60">
              <p className="text-lg text-gray-200 mb-5">A pocket dimension where physics don't apply. Rooms shift constantly, corridors loop infinitely, and gravity becomes meaningless.</p>
              <div className="grid grid-cols-2 gap-4 text-base">
                <div className="bg-cyan-900/60 p-3 rounded-lg text-cyan-200 font-semibold">Spatial Manipulation</div>
                <div className="bg-cyan-900/60 p-3 rounded-lg text-cyan-200 font-semibold">Infinite Expansion</div>
                <div className="bg-cyan-900/60 p-3 rounded-lg text-cyan-200 font-semibold">Gravity Defiance</div>
                <div className="bg-cyan-900/60 p-3 rounded-lg text-cyan-200 font-semibold">Nakime's Control</div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Battles - BIGGER
const BattlesSection: React.FC = () => {
  const { bloodMaterial, fireMaterial, woodMaterial, darkWoodMaterial, goldMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  
  return (
    <group position={[0, SECTIONS[4].depth, 0]}>
      <FloatingPlatform position={[0, -5, 0]} size={[24, 0.6, 20]} />
      
      {/* Destroyed Gate Structure */}
      <group position={[0, 0, -6]}>
        {/* Broken left pillar */}
        <mesh material={bloodMaterial} position={[-5, -1, 0]} rotation={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.5, 0.6, 7, 8]} />
        </mesh>
        {/* Broken right pillar - shorter, more damaged */}
        <mesh material={bloodMaterial} position={[5, -2, 0]} rotation={[0, 0, -0.2]}>
          <cylinderGeometry args={[0.5, 0.6, 5, 8]} />
        </mesh>
        
        {/* Fallen beam */}
        <mesh material={darkWoodMaterial} position={[2, -3.5, 1]} rotation={[0.1, 0.3, 0.4]}>
          <boxGeometry args={[8, 0.5, 0.6]} />
        </mesh>
        
        {/* Cracked arch remains */}
        <mesh position={[-3, 2, 0]} rotation={[0, 0, 0.2]}>
          <torusGeometry args={[2, 0.25, 8, 16, Math.PI * 0.4]} />
          <meshStandardMaterial color="#8b0000" roughness={0.6} />
        </mesh>
        
        {/* Fire on broken pillar */}
        <group position={[-5, 3, 0]}>
          <mesh material={fireMaterial}>
            <coneGeometry args={[0.5, 1.5, 8]} />
          </mesh>
          <pointLight color="#ff4400" intensity={25} distance={8} />
        </group>
      </group>
      
      {/* Scattered broken pillars around battlefield */}
      {[
        [-8, -3, -3, 0.2, 0.1],
        [8, -2.5, -2, -0.15, 0.2],
        [-9, -3, 4, 0.1, -0.15],
        [9, -3.5, 3, -0.2, 0.1],
        [-6, -3, 6, 0.25, 0],
        [6, -2.8, 5, -0.1, 0.2],
      ].map(([x, y, z, rotX, rotZ], i) => (
        <mesh key={i} material={bloodMaterial} position={[x, y, z]} rotation={[rotX, 0, rotZ]}>
          <cylinderGeometry args={[0.35, 0.45, 3 + Math.random() * 2, 8]} />
        </mesh>
      ))}
      
      {/* Static fire braziers */}
      {[[-7, -5], [7, -5], [-4, 6], [4, 6], [0, -7]].map(([x, z], i) => (
        <group key={i} position={[x, -3.5, z]}>
          <mesh material={fireMaterial}>
            <coneGeometry args={[0.6, 2, 8]} />
          </mesh>
          <mesh material={fireMaterial} position={[0.2, -0.3, 0.1]}>
            <coneGeometry args={[0.35, 1.3, 6]} />
          </mesh>
          <pointLight color="#ff4400" intensity={20} distance={8} />
        </group>
      ))}
      
      {/* Battle debris - broken wood pieces */}
      {[
        [-3, -4.5, 2, 0.5, 0.3],
        [4, -4.6, -1, -0.3, 0.6],
        [-5, -4.4, -4, 0.2, -0.4],
        [2, -4.5, 4, 0.4, 0.2],
      ].map(([x, y, z, rotX, rotY], i) => (
        <mesh key={i} material={woodMaterial} position={[x, y, z]} rotation={[rotX, rotY, 0]}>
          <boxGeometry args={[2, 0.2, 0.4]} />
        </mesh>
      ))}
      
      {/* Sword marks / cracks on ground */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 4, -4.65, Math.sin(angle) * 4]} rotation={[-Math.PI / 2, 0, angle]}>
            <boxGeometry args={[0.08, 3, 0.05]} />
            <meshBasicMaterial color="#330000" />
          </mesh>
        );
      })}
      
      {/* Central battle arena marker */}
      <mesh position={[0, -4.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.3, 32]} />
        <meshBasicMaterial color="#ff3333" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, -3, 0]} color="#ff3333" intensity={30} distance={10} />
      
      {/* Corner watch towers (damaged) */}
      {[[-10, -7], [10, -7]].map(([x, z], i) => (
        <group key={i} position={[x, -2, z]}>
          <mesh material={darkWoodMaterial}>
            <boxGeometry args={[1.2, 6, 1.2]} />
          </mesh>
          <mesh material={woodMaterial} position={[0, 3.5, 0]}>
            <boxGeometry args={[1.8, 0.4, 1.8]} />
          </mesh>
          <mesh material={goldMaterial} position={[0, 4, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
          </mesh>
          <Lantern position={[0, 2, 1]} color="#ff3333" intensity={20} />
        </group>
      ))}
      
      {/* Demon eyes watching the battle */}
      <DemonEye position={[-8, 1, -5]} scale={1.8} />
      <DemonEye position={[8, 1, -5]} scale={1.8} />
      <DemonEye position={[0, 3, -6]} scale={2} />
      
      {/* Red atmospheric lighting */}
      <pointLight position={[0, 2, 0]} color="#ff2200" intensity={40} distance={20} />
      <pointLight position={[-8, 0, 0]} color="#ff4400" intensity={20} distance={12} />
      <pointLight position={[8, 0, 0]} color="#ff4400" intensity={20} distance={12} />
      
      <Lantern position={[-5, -1, 5]} color="#ff3333" intensity={30} />
      <Lantern position={[5, -1, 5]} color="#ff3333" intensity={30} />
      
      {showTexts && (
        <Html position={[0, -1, PANEL_Z]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '500px' }}>
            <h2 className="text-6xl font-bold text-red-500 mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 30px #ff3333, 0 0 60px #ff3333' }}>最終決戦</h2>
            <h3 className="text-2xl text-white mb-5">THE FINAL BATTLE</h3>
            <div className="bg-black/40 p-6 rounded-xl border-2 border-red-500/60">
              <p className="text-lg text-gray-200 mb-5">The Demon Slayer Corps' ultimate assault on the Infinity Castle. Heroes fell, legends were born.</p>
              <div className="text-left text-lg space-y-2">
                <div><span className="text-yellow-400 font-bold">Tanjiro & Giyu</span> vs <span className="text-purple-400 font-bold">Akaza</span></div>
                <div><span className="text-yellow-400 font-bold">Shinobu</span> vs <span className="text-cyan-400 font-bold">Doma</span></div>
                <div><span className="text-yellow-400 font-bold">Sanemi & Gyomei</span> vs <span className="text-purple-400 font-bold">Kokushibo</span></div>
                <div><span className="text-yellow-400 font-bold">All Hashira</span> vs <span className="text-red-400 font-bold">Muzan Kibutsuji</span></div>
              </div>
              <p className="text-base text-red-400 mt-4 font-semibold">Multiple Hashira made the ultimate sacrifice.</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Nakime - Clean and stylish design
const NakimeSection: React.FC = () => {
  const { darkWoodMaterial, goldMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  
  return (
    <group position={[0, SECTIONS[5].depth, 0]}>
      {/* Main platform */}
      <FloatingPlatform position={[0, -5, 0]} size={[18, 0.5, 14]} />
      
      {/* Elegant circular stage */}
      <mesh material={darkWoodMaterial} position={[0, -4.6, -2]}>
        <cylinderGeometry args={[4, 4.5, 0.4, 32]} />
      </mesh>
      <mesh material={goldMaterial} position={[0, -4.35, -2]}>
        <torusGeometry args={[4.2, 0.06, 8, 48]} />
      </mesh>
      
      {/* Central Biwa - elegant and prominent */}
      <group position={[0, -3, -2]} rotation={[-0.25, 0, 0]}>
        {/* Body */}
        <mesh material={darkWoodMaterial}>
          <sphereGeometry args={[1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* Neck */}
        <mesh material={darkWoodMaterial} position={[0, 1.8, -0.3]}>
          <boxGeometry args={[0.2, 3, 0.12]} />
        </mesh>
        {/* Head */}
        <mesh material={darkWoodMaterial} position={[0, 3.5, -0.4]}>
          <boxGeometry args={[0.5, 0.7, 0.15]} />
        </mesh>
        {/* Strings - glowing purple */}
        {[-0.06, 0, 0.06].map((x, i) => (
          <mesh key={i} position={[x, 1, 0.5]}>
            <boxGeometry args={[0.012, 3.5, 0.012]} />
            <meshBasicMaterial color="#cc66ff" />
          </mesh>
        ))}
        {/* Bridge */}
        <mesh material={goldMaterial} position={[0, 0.2, 1.1]}>
          <boxGeometry args={[0.4, 0.08, 0.1]} />
        </mesh>
        {/* Biwa glow */}
        <pointLight position={[0, 0.5, 0.8]} color="#9933ff" intensity={40} distance={10} />
      </group>
      
      {/* Large portal ring behind - the signature element */}
      <group position={[0, 0, -6]}>
        {/* Main ring */}
        <mesh>
          <torusGeometry args={[5, 0.15, 16, 64]} />
          <meshStandardMaterial color="#9933ff" emissive="#6600cc" emissiveIntensity={0.5} />
        </mesh>
        {/* Inner ring */}
        <mesh>
          <torusGeometry args={[4, 0.08, 12, 48]} />
          <meshBasicMaterial color="#cc66ff" transparent opacity={0.8} />
        </mesh>
        {/* Portal glow center */}
        <mesh>
          <circleGeometry args={[3.8, 48]} />
          <meshBasicMaterial color="#9933ff" transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
        <pointLight color="#9933ff" intensity={30} distance={15} />
      </group>
      
      {/* Four elegant pillars */}
      {[
        [-6, -5], [6, -5], [-6, 4], [6, 4]
      ].map(([x, z], i) => (
        <group key={i} position={[x, -2, z]}>
          <mesh material={darkWoodMaterial}>
            <boxGeometry args={[0.5, 5, 0.5]} />
          </mesh>
          <mesh material={goldMaterial} position={[0, 2.7, 0]}>
            <sphereGeometry args={[0.3, 8, 8]} />
          </mesh>
        </group>
      ))}
      
      {/* Single central demon eye above */}
      <DemonEye position={[0, 3, -2]} scale={1.8} />
      
      {/* Two lanterns - symmetrical */}
      <Lantern position={[-4, -2, 2]} color="#cc66ff" intensity={30} />
      <Lantern position={[4, -2, 2]} color="#cc66ff" intensity={30} />
      
      {/* Clean atmospheric lighting */}
      <pointLight position={[0, -3, 0]} color="#9933ff" intensity={50} distance={18} />
      <pointLight position={[0, 2, -4]} color="#cc66ff" intensity={25} distance={12} />
      
      {showTexts && (
        <Html position={[0, -1, PANEL_Z]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '460px' }}>
            <h2 className="text-6xl font-bold text-purple-400 mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 30px #cc66ff, 0 0 60px #cc66ff' }}>鳴女</h2>
            <h3 className="text-2xl text-white mb-5">NAKIME - The Biwa Demon</h3>
            <div className="bg-black/40 p-6 rounded-xl border-2 border-purple-500/60">
              <p className="text-lg text-gray-200 mb-5">Upper Moon Four who controls the Infinity Castle with her biwa. Each strum of her instrument reshapes reality itself.</p>
              <div className="grid grid-cols-2 gap-4 text-base">
                <div className="bg-purple-900/60 p-3 rounded-lg"><span className="text-purple-300">Blood Art:</span> <span className="text-white font-bold">Castle Control</span></div>
                <div className="bg-purple-900/60 p-3 rounded-lg"><span className="text-purple-300">Instrument:</span> <span className="text-white font-bold">Biwa</span></div>
                <div className="bg-purple-900/60 p-3 rounded-lg"><span className="text-purple-300">Ability:</span> <span className="text-white font-bold">Portal Creation</span></div>
                <div className="bg-purple-900/60 p-3 rounded-lg"><span className="text-purple-300">Role:</span> <span className="text-white font-bold">Castle Architect</span></div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Lore - Clean ancient library/shrine design
const LoreSection: React.FC = () => {
  const { paperMaterial, darkWoodMaterial, goldMaterial, woodMaterial } = useMaterials();
  const showTexts = useStore((state) => state.showTexts);
  
  return (
    <group position={[0, SECTIONS[6].depth, 0]}>
      {/* Main platform */}
      <FloatingPlatform position={[0, -5, 0]} size={[20, 0.5, 16]} />
      
      {/* Central shrine pedestal */}
      <mesh material={darkWoodMaterial} position={[0, -4.5, -3]}>
        <boxGeometry args={[4, 0.6, 3]} />
      </mesh>
      <mesh material={goldMaterial} position={[0, -4.15, -3]}>
        <boxGeometry args={[4.2, 0.08, 3.2]} />
      </mesh>
      
      {/* Sacred scroll holder - center piece */}
      <group position={[0, -3, -3]}>
        {/* Vertical scroll stand */}
        <mesh material={darkWoodMaterial} position={[0, 0, 0]}>
          <boxGeometry args={[0.15, 3, 0.15]} />
        </mesh>
        {/* Top ornament */}
        <mesh material={goldMaterial} position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.2, 12, 12]} />
        </mesh>
        {/* Hanging scroll */}
        <mesh material={paperMaterial} position={[0, 0, 0.15]}>
          <planeGeometry args={[2, 2.5]} />
        </mesh>
        {/* Scroll top rod */}
        <mesh material={darkWoodMaterial} position={[0, 1.3, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
        </mesh>
        {/* Scroll bottom rod */}
        <mesh material={darkWoodMaterial} position={[0, -1.3, 0.15]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
        </mesh>
      </group>
      
      {/* Glowing sun symbol - representing Sun Breathing */}
      <group position={[0, 1, -5]}>
        <mesh>
          <circleGeometry args={[1.5, 32]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <torusGeometry args={[1.5, 0.08, 12, 48]} />
          <meshStandardMaterial color="#ffcc00" emissive="#ff9900" emissiveIntensity={0.5} />
        </mesh>
        {/* Sun rays */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0]} rotation={[0, 0, angle]}>
              <boxGeometry args={[0.08, 0.6, 0.02]} />
              <meshBasicMaterial color="#ffcc00" />
            </mesh>
          );
        })}
        <pointLight color="#ffcc00" intensity={35} distance={12} />
      </group>
      
      {/* Book/scroll shelves on sides */}
      {[[-7, 0], [7, 0]].map(([x, z], idx) => (
        <group key={idx} position={[x, -2, z]} rotation={[0, idx === 0 ? 0.3 : -0.3, 0]}>
          {/* Shelf frame */}
          <mesh material={darkWoodMaterial}>
            <boxGeometry args={[3, 4, 0.8]} />
          </mesh>
          {/* Shelf dividers */}
          {[-1, 0, 1].map((y, i) => (
            <mesh key={i} material={woodMaterial} position={[0, y, 0.1]}>
              <boxGeometry args={[2.6, 0.1, 0.6]} />
            </mesh>
          ))}
          {/* Books/scrolls on shelves */}
          {[-1.5, -0.5, 0.5, 1.5].map((y, i) => (
            <group key={i} position={[0, y, 0.3]}>
              {[-0.8, -0.4, 0, 0.4, 0.8].map((bx, j) => (
                <mesh key={j} material={j % 2 === 0 ? paperMaterial : darkWoodMaterial} position={[bx, 0, 0]}>
                  <boxGeometry args={[0.15, 0.7, 0.4]} />
                </mesh>
              ))}
            </group>
          ))}
          {/* Gold trim */}
          <mesh material={goldMaterial} position={[0, 2.1, 0]}>
            <boxGeometry args={[3.2, 0.1, 0.9]} />
          </mesh>
        </group>
      ))}
      
      {/* Four corner pillars */}
      {[
        [-8, -6], [8, -6], [-8, 5], [8, 5]
      ].map(([x, z], i) => (
        <group key={i} position={[x, -2, z]}>
          <mesh material={darkWoodMaterial}>
            <boxGeometry args={[0.6, 5, 0.6]} />
          </mesh>
          <mesh material={goldMaterial} position={[0, 2.7, 0]}>
            <sphereGeometry args={[0.35, 8, 8]} />
          </mesh>
        </group>
      ))}
      
      {/* Blue Spider Lily representation - glowing flower */}
      <group position={[0, -3.5, 2]}>
        <mesh material={darkWoodMaterial} position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.4, 8]} />
        </mesh>
        {/* Flower petals */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 0.2, 0.1, Math.sin(angle) * 0.2]} rotation={[0.5, angle, 0]}>
              <boxGeometry args={[0.08, 0.4, 0.02]} />
              <meshBasicMaterial color="#3399ff" />
            </mesh>
          );
        })}
        <pointLight position={[0, 0.2, 0]} color="#3399ff" intensity={15} distance={6} />
      </group>
      
      {/* Lanterns */}
      <Lantern position={[-5, -1, 4]} color="#ffcc33" intensity={30} />
      <Lantern position={[5, -1, 4]} color="#ffcc33" intensity={30} />
      <Lantern position={[-3, -2, -5]} color="#ffaa00" intensity={25} />
      <Lantern position={[3, -2, -5]} color="#ffaa00" intensity={25} />
      
      {/* Warm atmospheric lighting */}
      <pointLight position={[0, -3, 0]} color="#ffcc00" intensity={45} distance={18} />
      <pointLight position={[0, 3, -3]} color="#ffaa33" intensity={30} distance={15} />
      
      {showTexts && (
        <Html position={[0, -1, PANEL_Z]} center transform scale={PANEL_SCALE}>
          <div className="text-center select-none" style={{ width: '500px' }}>
            <h2 className="text-6xl font-bold text-yellow-400 mb-4" style={{ fontFamily: 'Cinzel', textShadow: '0 0 30px #ffcc33, 0 0 60px #ffcc33' }}>伝承</h2>
            <h3 className="text-2xl text-white mb-5">LORE & SECRETS</h3>
            <div className="bg-black/40 p-6 rounded-xl border-2 border-yellow-500/60 text-left">
              <div className="space-y-4 text-lg">
                <div><span className="text-yellow-400 font-bold">Blue Spider Lily:</span> <span className="text-gray-200">Muzan's 1000-year obsession. The flower that could let him conquer the sun.</span></div>
                <div><span className="text-yellow-400 font-bold">Sun Breathing:</span> <span className="text-gray-200">The original breathing style created by Yoriichi. The only technique Muzan truly fears.</span></div>
                <div><span className="text-yellow-400 font-bold">Demon Slayer Mark:</span> <span className="text-gray-200">Grants immense power but shortens lifespan to age 25.</span></div>
                <div><span className="text-yellow-400 font-bold">Twelve Kizuki:</span> <span className="text-gray-200">Muzan's elite demons, ranked by the strength of their Blood Demon Arts.</span></div>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export const SectionManager: React.FC = () => (
  <>
    <HeroSection />
    <MuzanSection />
    <UpperMoonsSection />
    <ArchitectureSection />
    <BattlesSection />
    <NakimeSection />
    <LoreSection />
  </>
);
