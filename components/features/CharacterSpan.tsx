'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';
import { loadSingleFont } from '@/lib/fontLoader';
import { CURATED_FONTS } from '@/lib/fonts';

interface CharacterSpanProps {
  char: string;
  fontFamily: string;
  index: number;
  onFontClick?: () => void;
}

export const CharacterSpan: React.FC<CharacterSpanProps> = ({ char, fontFamily, index, onFontClick }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // 폰트 동적 로딩
    if (fontFamily !== 'system-ui') {
      const font = CURATED_FONTS.find(f => f.family === fontFamily);
      if (font) {
        loadSingleFont(font).catch(err => {
          console.warn(`Failed to load font: ${fontFamily}`, err);
        });
      }
    }
  }, [fontFamily]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFontClick) {
      onFontClick();
    }
  };

  // 공백이나 줄바꿈은 그대로 렌더링
  if (char === ' ') {
    return <span className="inline-block" style={{ width: '0.5em' }}>&nbsp;</span>;
  }

  if (char === '\n') {
    return <br />;
  }

  return (
    <Tooltip content={fontFamily}>
      <motion.span
        ref={spanRef}
        onClick={handleClick}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          delay: index * 0.02,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          fontFamily: `"${fontFamily}", system-ui`,
          fontSize: 'inherit',
          lineHeight: 'inherit',
        }}
        className="inline-block cursor-pointer hover:scale-110 transition-transform duration-200"
      >
        {char}
      </motion.span>
    </Tooltip>
  );
};
