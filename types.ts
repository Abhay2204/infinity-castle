import '@react-three/fiber';

export type SectionType = 'hero' | 'muzan' | 'uppermoons' | 'architecture' | 'battles' | 'nakime' | 'lore';

export interface SectionData {
  id: SectionType;
  depth: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
}

// Reduced distances between sections - much closer together now
export const SECTIONS: SectionData[] = [
  { id: 'hero', depth: 0, title: '無限城', subtitle: 'Infinity Castle', description: 'The dimensional fortress of Muzan Kibutsuji.', color: '#ff3366' },
  { id: 'muzan', depth: -25, title: '鬼舞辻無惨', subtitle: 'Muzan Kibutsuji', description: 'The Demon King who created all demons.', color: '#9933ff' },
  { id: 'uppermoons', depth: -50, title: '上弦の鬼', subtitle: 'Upper Moons', description: 'The six most powerful demons.', color: '#ff6633' },
  { id: 'architecture', depth: -75, title: '建築', subtitle: 'Architecture', description: 'Impossible geometry defying physics.', color: '#33ccff' },
  { id: 'battles', depth: -100, title: '最終決戦', subtitle: 'Final Battle', description: 'The ultimate assault on the castle.', color: '#ff3333' },
  { id: 'nakime', depth: -125, title: '鳴女', subtitle: 'Nakime', description: 'The Biwa Demon who controls the castle.', color: '#cc66ff' },
  { id: 'lore', depth: -150, title: '伝承', subtitle: 'Lore & Secrets', description: 'Hidden truths about the demon world.', color: '#ffcc33' },
];

export const MAX_DEPTH = -180;

export interface CharacterInfo {
  name: string;
  japaneseName: string;
  rank?: string;
  bloodDemonArt?: string;
  description: string;
}

export const UPPER_MOONS: CharacterInfo[] = [
  { name: 'Kokushibo', japaneseName: '黒死牟', rank: 'Upper Moon 1', bloodDemonArt: 'Moon Breathing', description: 'The strongest Upper Moon.' },
  { name: 'Doma', japaneseName: '童磨', rank: 'Upper Moon 2', bloodDemonArt: 'Cryokinesis', description: 'A charismatic cult leader.' },
  { name: 'Akaza', japaneseName: '猗窩座', rank: 'Upper Moon 3', bloodDemonArt: 'Destructive Death', description: 'A martial arts master.' },
  { name: 'Nakime', japaneseName: '鳴女', rank: 'Upper Moon 4', bloodDemonArt: 'Infinity Castle', description: 'Controls the castle.' },
  { name: 'Gyokko', japaneseName: '玉壺', rank: 'Upper Moon 5', bloodDemonArt: 'Porcelain Vases', description: 'An artist demon.' },
  { name: 'Kaigaku', japaneseName: '獪岳', rank: 'Upper Moon 6', bloodDemonArt: 'Thunder Breathing', description: 'A betrayer.' }
];
