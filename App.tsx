import React, { Suspense, useState, useEffect } from 'react';
import { Experience } from './components/Experience';
import { Interface } from './components/Interface';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#0a0403] overflow-hidden text-white">
      {/* Loading Screen - Static */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#0a0403] flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-bold tracking-widest" style={{ fontFamily: 'Cinzel, serif', color: '#ff4400', textShadow: '0 0 30px #ff4400' }}>
            無限城
          </h1>
          <p className="text-sm uppercase tracking-[0.4em] text-orange-400/70">INFINITY CASTLE</p>
          <p className="text-[10px] uppercase tracking-[0.3em] text-orange-600/50 mt-2">ENTERING DIMENSIONAL SPACE...</p>
        </div>
      )}
      
      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center w-full h-full gap-4 bg-[#0a0403]">
            <span className="text-4xl font-bold" style={{ color: '#ff4400', textShadow: '0 0 20px #ff4400' }}>Loading...</span>
          </div>
        }>
          <Experience />
        </Suspense>
      </div>
      
      {/* UI */}
      {!isLoading && <Interface />}
      
      {/* Vignette - darker edges with orange tint */}
      <div className="absolute inset-0 z-20 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(10,4,3,0.6) 70%, rgba(10,4,3,0.95) 100%)'
      }} />
      
      {/* Top/bottom gradients */}
      <div className="absolute top-0 left-0 right-0 h-40 z-15 pointer-events-none bg-gradient-to-b from-[#0a0403] via-[#0a0403]/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-15 pointer-events-none bg-gradient-to-t from-[#0a0403] via-[#0a0403]/50 to-transparent" />
      
      {/* Subtle orange glow overlay */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10" style={{
        background: 'radial-gradient(ellipse at center, #ff4400 0%, transparent 60%)'
      }} />
    </div>
  );
}

export default App;
