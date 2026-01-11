import React, { useMemo, useState, memo, useCallback } from 'react';
import { useStore } from '../store';
import { SECTIONS } from '../types';

// Memoized navigation button
const NavButton = memo(({ section, isActive, onClick }: { 
  section: typeof SECTIONS[0]; 
  isActive: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-2 text-right transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
  >
    <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: isActive ? section.color : 'white' }}>
      {section.subtitle.split(' ')[0]}
    </span>
    <div className="w-1 rounded transition-all duration-400" style={{ height: isActive ? '24px' : '12px', backgroundColor: isActive ? section.color : 'rgba(255,255,255,0.4)' }} />
  </button>
));

export const Interface: React.FC = () => {
  const depth = useStore((state) => state.depth);
  const velocity = useStore((state) => state.velocity);
  const jumpToSection = useStore((state) => state.jumpToSection);
  const showTexts = useStore((state) => state.showTexts);
  const toggleTexts = useStore((state) => state.toggleTexts);
  const [showInfo, setShowInfo] = useState(false);

  const currentDepthDisplay = Math.abs(Math.round(depth * 10)) + "m";
  
  const activeSection = useMemo(() => {
    return SECTIONS.reduce((prev, curr) => (Math.abs(curr.depth - depth) < Math.abs(prev.depth - depth) ? curr : prev));
  }, [depth]);

  const progress = Math.min(100, Math.max(0, (Math.abs(depth) / 150) * 100));
  
  const handleJump = useCallback((id: string) => {
    jumpToSection(id as any);
  }, [jumpToSection]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 text-white" style={{ fontFamily: 'Cinzel, serif' }}>
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-widest" style={{ textShadow: '0 0 25px rgba(255,68,0,0.7)' }}>無限城</h1>
          <p className="text-xs uppercase tracking-[0.3em] opacity-60 mt-1">INFINITY CASTLE</p>
        </div>
        <div className="text-right flex flex-col items-end gap-1">
          <p className="text-xs uppercase tracking-[0.2em] opacity-60">Demon Slayer • 鬼滅の刃</p>
          <div className="flex gap-2 mt-1">
            <button 
              onClick={() => toggleTexts()}
              className="pointer-events-auto text-xs border border-white/50 px-3 py-1 hover:bg-white/10 transition-colors rounded"
              title={showTexts ? 'Hide section texts' : 'Show section texts'}
            >
              {showTexts ? '👁 HIDE' : '👁 SHOW'}
            </button>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="pointer-events-auto text-xs border border-white/50 px-3 py-1 hover:bg-white/10 transition-colors rounded"
            >
              {showInfo ? 'CLOSE' : 'INFO'}
            </button>
          </div>
        </div>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-6 w-64 bg-black/95 border border-orange-500/50 rounded-lg p-4 pointer-events-auto">
          <h3 className="text-base font-bold text-orange-400 mb-2">How to Navigate</h3>
          <ul className="text-xs text-gray-300 space-y-1 mb-3">
            <li>• Scroll to descend/ascend</li>
            <li>• Click section names to teleport</li>
            <li>• Sections auto-lock when near</li>
          </ul>
          <h4 className="text-sm font-bold text-white mb-1">Sections:</h4>
          <div className="space-y-1">
            {SECTIONS.map(s => (
              <div key={s.id} className="flex justify-between text-xs">
                <span style={{ color: s.color }}>{s.subtitle}</span>
                <span className="text-gray-500">{Math.abs(s.depth * 10)}m</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-auto">
        {SECTIONS.map((s) => (
          <NavButton
            key={s.id}
            section={s}
            isActive={activeSection.id === s.id}
            onClick={() => handleJump(s.id)}
          />
        ))}
      </div>

      {/* Depth Meter */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="w-1 h-40 bg-white/20 rounded-full overflow-hidden relative">
          <div className="absolute bottom-0 w-full bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-200 rounded-full" style={{ height: `${progress}%` }} />
          {SECTIONS.map((s) => (
            <div key={s.id} className="absolute left-0 w-full h-[2px]" style={{ bottom: `${(Math.abs(s.depth) / 150) * 100}%`, backgroundColor: activeSection.id === s.id ? s.color : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>
        <span className="text-lg font-mono font-bold mt-2" style={{ textShadow: '0 0 15px rgba(255,68,0,0.6)' }}>{currentDepthDisplay}</span>
      </div>

      {/* Current Section */}
      <div className="w-full flex flex-col items-center gap-2">
        <div className="text-center">
          <p className="text-2xl font-bold" style={{ color: activeSection.color, textShadow: `0 0 30px ${activeSection.color}70` }}>{activeSection.title}</p>
          <p className="text-sm uppercase tracking-[0.3em] opacity-60 mt-1">{activeSection.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 transition-all duration-100 rounded-full" style={{ width: `${Math.min(100, Math.abs(velocity) * 60)}%` }} />
          </div>
          <span className="text-[10px] uppercase tracking-wider opacity-50">{Math.abs(velocity) < 0.1 ? 'ANCHORED' : velocity < 0 ? 'DESCENDING' : 'ASCENDING'}</span>
        </div>
      </div>
    </div>
  );
};
