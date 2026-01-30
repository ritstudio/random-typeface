import { Font } from '@/types';

const loadedFonts = new Set<string>();

/**
 * Google Fonts를 동적으로 로드합니다.
 * @param fonts - 로드할 폰트 배열
 * @returns Promise<void>
 */
export const loadFonts = (fonts: Font[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 서버 사이드에서는 스킵
    if (typeof window === 'undefined') {
      resolve();
      return;
    }

    const fontsToLoad = fonts.filter(font => !loadedFonts.has(font.family));
    
    if (fontsToLoad.length === 0) {
      resolve();
      return;
    }

    const families = fontsToLoad.map(font => `${font.family}:${font.weight}`);

    // 동적으로 WebFont 로드
    import('webfontloader').then((WebFont) => {
      WebFont.default.load({
        google: {
          families,
        },
        active: () => {
          fontsToLoad.forEach(font => loadedFonts.add(font.family));
          resolve();
        },
        inactive: () => {
          reject(new Error('Failed to load fonts'));
        },
        timeout: 5000,
      });
    }).catch(reject);
  });
};

/**
 * 단일 폰트를 로드합니다.
 * @param font - 로드할 폰트
 */
export const loadSingleFont = async (font: Font): Promise<void> => {
  if (typeof window === 'undefined') {
    return;
  }
  
  if (loadedFonts.has(font.family)) {
    return;
  }

  return loadFonts([font]);
};

/**
 * 폰트가 로드되었는지 확인합니다.
 * @param fontFamily - 확인할 폰트 패밀리 이름
 */
export const isFontLoaded = (fontFamily: string): boolean => {
  return loadedFonts.has(fontFamily);
};

/**
 * CSS link 태그를 통해 폰트를 로드합니다 (대체 방법).
 * @param fontUrl - Google Fonts CSS URL
 */
export const loadFontByUrl = (fontUrl: string): void => {
  if (typeof window === 'undefined') {
    return;
  }
  
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (existingLink) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  document.head.appendChild(link);
};
