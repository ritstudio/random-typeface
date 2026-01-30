/**
 * 랜덤 인덱스를 생성합니다.
 * @param max - 최대값 (exclusive)
 */
export const getRandomIndex = (max: number): number => {
  return Math.floor(Math.random() * max);
};

/**
 * 배열에서 랜덤 요소를 선택합니다.
 * @param array - 배열
 * @param excludeIndices - 제외할 인덱스 배열
 */
export const getRandomElement = <T>(array: T[], excludeIndices: number[] = []): T => {
  let index: number;
  do {
    index = getRandomIndex(array.length);
  } while (excludeIndices.includes(index) && excludeIndices.length < array.length);
  
  return array[index];
};

/**
 * 직전 N개 요소와 다른 랜덤 요소를 선택합니다.
 * @param array - 배열
 * @param recentIndices - 최근 사용된 인덱스 배열
 * @param avoidCount - 피할 최근 요소 개수
 */
export const getRandomElementAvoidingRecent = <T>(
  array: T[], 
  recentIndices: number[], 
  avoidCount: number = 2
): { element: T; index: number } => {
  const indicesToAvoid = recentIndices.slice(-avoidCount);
  let index: number;
  let attempts = 0;
  const maxAttempts = array.length * 2;

  do {
    index = getRandomIndex(array.length);
    attempts++;
  } while (indicesToAvoid.includes(index) && attempts < maxAttempts);

  return { element: array[index], index };
};

/**
 * 클래스 이름을 조건부로 결합합니다.
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 텍스트에서 공백과 줄바꿈을 유지하면서 문자를 추출합니다.
 */
export const splitTextWithSpaces = (text: string): string[] => {
  return text.split('');
};

/**
 * 문자가 알파벳인지 확인합니다.
 */
export const isAlphabet = (char: string): boolean => {
  return /[a-zA-Z]/.test(char);
};

/**
 * 문자가 숫자인지 확인합니다.
 */
export const isDigit = (char: string): boolean => {
  return /[0-9]/.test(char);
};

/**
 * 문자가 특수문자인지 확인합니다.
 */
export const isSpecialChar = (char: string): boolean => {
  return !isAlphabet(char) && !isDigit(char) && char.trim() !== '';
};
