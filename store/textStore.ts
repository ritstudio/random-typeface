import { create } from 'zustand';
import { Character } from '@/types';
import { CURATED_FONTS } from '@/lib/fonts';
import { getRandomElementAvoidingRecent, splitTextWithSpaces, isAlphabet, isDigit } from '@/lib/utils';

interface TextStore {
  inputText: string;
  content: string;
  characters: Character[];
  recentFontIndices: number[];
  fontSize: number;
  letterSpacing: number;
  textAlign: 'left' | 'center' | 'right';
  textColor: string;
  isFirstEdit: boolean;
  setInputText: (text: string) => void;
  generateFonts: () => void;
  regenerateFonts: () => void;
  setFontSize: (size: number) => void;
  setLetterSpacing: (spacing: number) => void;
  setTextAlign: (align: 'left' | 'center' | 'right') => void;
  setTextColor: (color: string) => void;
}

const assignRandomFont = (char: string, recentIndices: number[]): { fontFamily: string; index: number } => {
  // 공백이나 줄바꿈은 기본 폰트 사용
  if (char === ' ' || char === '\n') {
    return { fontFamily: 'system-ui', index: -1 };
  }

  // 알파벳이나 숫자가 아닌 특수문자는 가독성 높은 Sans-serif 사용
  if (!isAlphabet(char) && !isDigit(char)) {
    const sansSerifFonts = CURATED_FONTS.filter(f => f.category === 'sans-serif');
    const { element, index } = getRandomElementAvoidingRecent(sansSerifFonts, recentIndices, 2);
    return { fontFamily: element.family, index };
  }

  // 일반 문자는 전체 폰트 풀에서 선택 (직전 2개 제외)
  const { element, index } = getRandomElementAvoidingRecent(CURATED_FONTS, recentIndices, 2);
  return { fontFamily: element.family, index };
};

export const useTextStore = create<TextStore>((set, get) => ({
  inputText: 'Random Typeface',
  content: 'Random Typeface',
  characters: [],
  recentFontIndices: [],
  fontSize: 130,
  letterSpacing: 0,
  textAlign: 'center',
  textColor: '#FFFFFF',
  isFirstEdit: true,

  setInputText: (text: string) => {
    set({ inputText: text, isFirstEdit: false });
  },

  generateFonts: () => {
    const { inputText } = get();
    if (!inputText || inputText.trim() === '') return;

    const chars = splitTextWithSpaces(inputText);
    const newRecentIndices: number[] = [];

    const newCharacters: Character[] = chars.map((char, index) => {
      const { fontFamily, index: fontIndex } = assignRandomFont(char, newRecentIndices);
      
      if (fontIndex !== -1) {
        newRecentIndices.push(fontIndex);
        // 최근 10개만 유지
        if (newRecentIndices.length > 10) {
          newRecentIndices.shift();
        }
      }

      return {
        char,
        fontFamily,
        index,
      };
    });

    set({
      content: inputText,
      characters: newCharacters,
      recentFontIndices: newRecentIndices,
    });
  },

  regenerateFonts: () => {
    const { content } = get();
    const chars = splitTextWithSpaces(content);
    const newRecentIndices: number[] = [];

    const newCharacters: Character[] = chars.map((char, index) => {
      const { fontFamily, index: fontIndex } = assignRandomFont(char, newRecentIndices);
      
      if (fontIndex !== -1) {
        newRecentIndices.push(fontIndex);
        if (newRecentIndices.length > 10) {
          newRecentIndices.shift();
        }
      }

      return {
        char,
        fontFamily,
        index,
      };
    });

    set({
      characters: newCharacters,
      recentFontIndices: newRecentIndices,
    });
  },

  setFontSize: (size: number) => {
    set({ fontSize: size });
  },

  setLetterSpacing: (spacing: number) => {
    set({ letterSpacing: spacing });
  },

  setTextAlign: (align: 'left' | 'center' | 'right') => {
    set({ textAlign: align });
  },

  setTextColor: (color: string) => {
    set({ textColor: color });
  },
}));
