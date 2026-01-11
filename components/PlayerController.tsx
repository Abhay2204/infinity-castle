import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useStore } from '../store';
import { SECTIONS, MAX_DEPTH } from '../types';

const FRICTION = 0.9;
const MAX_SPEED = 1.2;
const ANCHOR_DISTANCE = 4;
const ANCHOR_STRENGTH = 0.1;

export const PlayerController: React.FC = () => {
  const { camera } = useThree();
  const { 
    velocity, setVelocity, setDepth, 
    isAnchored, setAnchored, 
    targetSection, jumpToSection, setCurrentSection 
  } = useStore();
  
  const velocityRef = useRef(velocity);
  const isAnchoredRef = useRef(isAnchored);
  
  useEffect(() => { velocityRef.current = velocity; }, [velocity]);
  useEffect(() => { isAnchoredRef.current = isAnchored; }, [isAnchored]);

  // Scroll handler - only on user scroll
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isAnchoredRef.current && Math.abs(e.deltaY) > 10) {
        setAnchored(false);
      }

      // Smaller scroll multiplier
      const force = e.deltaY * 0.0004;
      velocityRef.current = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, velocityRef.current - force));
      setVelocity(velocityRef.current);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [setVelocity, setAnchored]);

  // Teleport handler
  useEffect(() => {
    if (targetSection) {
      setAnchored(false);
      const section = SECTIONS.find(s => s.id === targetSection);
      if (section) {
        velocityRef.current = (section.depth - camera.position.y) * 0.1;
      }
    }
  }, [targetSection, camera, setAnchored]);

  useFrame((_, delta) => {
    // Clamp delta to prevent huge jumps
    const dt = Math.min(delta, 0.1);
    
    // Teleport mode
    if (targetSection) {
      const section = SECTIONS.find(s => s.id === targetSection);
      if (section) {
        const dist = section.depth - camera.position.y;
        if (Math.abs(dist) < 0.3) {
          camera.position.y = section.depth;
          velocityRef.current = 0;
          setVelocity(0);
          setAnchored(true);
          setCurrentSection(section.id);
          jumpToSection(null as any);
        } else {
          camera.position.y += dist * 4 * dt;
        }
        setDepth(camera.position.y);
        return;
      }
    }

    // Normal physics
    if (!isAnchoredRef.current) {
      camera.position.y += velocityRef.current;
      velocityRef.current *= FRICTION;

      // Stop tiny movements
      if (Math.abs(velocityRef.current) < 0.002) {
        velocityRef.current = 0;
      }
      
      // Boundaries
      if (camera.position.y < MAX_DEPTH) {
        camera.position.y = MAX_DEPTH;
        velocityRef.current = 0;
      }
      if (camera.position.y > 10) {
        camera.position.y = 10;
        velocityRef.current = 0;
      }

      // Anchor to nearest section when slow
      let nearestDist = Infinity;
      let nearestSection = null;

      for (const section of SECTIONS) {
        const d = Math.abs(camera.position.y - section.depth);
        if (d < nearestDist) {
          nearestDist = d;
          nearestSection = section;
        }
      }

      if (nearestSection && nearestDist < ANCHOR_DISTANCE && Math.abs(velocityRef.current) < 0.3) {
        const pull = (nearestSection.depth - camera.position.y) * ANCHOR_STRENGTH;
        camera.position.y += pull * dt * 8;
        
        if (nearestDist < 0.1 && Math.abs(velocityRef.current) < 0.01) {
          setAnchored(true);
          setCurrentSection(nearestSection.id);
          velocityRef.current = 0;
        }
      }
      
      setVelocity(velocityRef.current);
      setDepth(camera.position.y);
    }
  });

  return null;
};
