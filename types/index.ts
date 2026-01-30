export type FontCategory = 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';

export interface Font {
  family: string;
  category: FontCategory;
  weight: number;
  url: string;
}

export interface Character {
  char: string;
  fontFamily: string;
  index: number;
}

export interface TextState {
  content: string;
  characters: Character[];
  fonts: Font[];
  regenerateFonts: () => void;
  updateContent: (text: string) => void;
}
