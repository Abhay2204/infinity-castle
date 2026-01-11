import { create } from 'zustand';
import { SectionType } from './types';

// Detect if device is mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
};

interface AppState {
  depth: number;
  velocity: number;
  targetSection: SectionType | null;
  isAnchored: boolean;
  currentSection: SectionType;
  showTexts: boolean;
  isMobile: boolean;
  
  // Actions
  setDepth: (y: number) => void;
  setVelocity: (v: number) => void;
  setAnchored: (anchored: boolean) => void;
  jumpToSection: (sectionId: SectionType | null) => void;
  setCurrentSection: (section: SectionType) => void;
  toggleTexts: () => void;
}

export const useStore = create<AppState>((set) => ({
  depth: 0,
  velocity: 0,
  targetSection: null,
  isAnchored: false,
  currentSection: 'hero',
  showTexts: !isMobile(), // Disable texts by default on mobile
  isMobile: isMobile(),

  setDepth: (y) => set({ depth: y }),
  setVelocity: (v) => set({ velocity: v }),
  setAnchored: (anchored) => set({ isAnchored: anchored }),
  jumpToSection: (sectionId) => set({ targetSection: sectionId }),
  setCurrentSection: (section) => set({ currentSection: section }),
  toggleTexts: () => set((state) => ({ showTexts: !state.showTexts })),
}));
