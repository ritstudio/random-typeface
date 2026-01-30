'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTextStore } from '@/store/textStore';
import { CharacterSpan } from './CharacterSpan';

interface TextCanvasProps {
  onFontClick?: (fontFamily: string) => void;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({ onFontClick }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const { 
    inputText, 
    characters, 
    fontSize,
    letterSpacing,
    textAlign, 
    textColor, 
    setInputText, 
    generateFonts, 
    regenerateFonts, 
    setFontSize,
    setLetterSpacing,
    setTextAlign,
    setTextColor,
    isFirstEdit
  } = useTextStore();

  const handleExportPNG = async () => {
    if (!outputRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      
      // 텍스트 컨텐츠의 실제 크기 측정
      const textElement = outputRef.current.querySelector('div') as HTMLElement;
      if (!textElement) return;
      
      const textRect = textElement.getBoundingClientRect();
      const padding = 120; // 상하좌우 동일한 여백
      
      // 캔버스 크기 계산 (텍스트 + 여백)
      const canvasWidth = textRect.width + (padding * 2);
      const canvasHeight = textRect.height + (padding * 2);
      
      // 임시 래퍼 생성
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.width = `${canvasWidth}px`;
      wrapper.style.height = `${canvasHeight}px`;
      wrapper.style.backgroundColor = '#000000';
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'center';
      wrapper.style.padding = `${padding}px`;
      wrapper.style.boxSizing = 'border-box';
      
      // 텍스트 복제
      const clonedText = textElement.cloneNode(true) as HTMLElement;
      wrapper.appendChild(clonedText);
      document.body.appendChild(wrapper);
      
      // 캔버스 생성
      const canvas = await html2canvas(wrapper, {
        backgroundColor: '#000000',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        width: canvasWidth,
        height: canvasHeight,
      });
      
      // 임시 래퍼 제거
      document.body.removeChild(wrapper);
      
      // 다운로드
      const link = document.createElement('a');
      link.download = `random-typeface-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    if (isFirstEdit && textareaRef.current) {
      textareaRef.current.select();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateFonts();
    }
  };

  const hasResult = characters.length > 0;
  const canGenerate = inputText.trim().length > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Output Display Area */}
      <div className="flex-1 flex items-start justify-center px-12 pt-[150px] pb-8 overflow-auto">
        {hasResult && (
          <motion.div
            ref={outputRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl flex items-center justify-center p-16"
            style={{ minHeight: '400px' }}
          >
            <div 
              className="font-bold leading-tight break-words whitespace-pre-wrap w-full"
              style={{ 
                fontSize: `${fontSize}px`,
                letterSpacing: `${letterSpacing}px`,
                textAlign: textAlign,
                color: textColor
              }}
            >
              {characters.map((char, idx) => (
                <CharacterSpan
                  key={`${idx}-${char.fontFamily}`}
                  char={char.char}
                  fontFamily={char.fontFamily}
                  index={idx}
                  onFontClick={() => onFontClick?.(char.fontFamily)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Fixed Bottom Input Bar - Above Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed bottom-16 left-0 right-0 px-8 z-20"
      >
        <div className="max-w-6xl mx-auto">
          {/* Controls - Only show when result exists */}
          {hasResult && (
            <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Text Size */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400">
                    Text Size
                  </label>
                  <span className="text-xs text-gray-500">
                    {fontSize}px
                  </span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="200"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #D0FF00 0%, #D0FF00 ${((fontSize - 16) / (200 - 16)) * 100}%, #2a2a2a ${((fontSize - 16) / (200 - 16)) * 100}%, #2a2a2a 100%)`
                  }}
                />
              </div>

              {/* Letter Spacing */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400">
                    Letter Spacing
                  </label>
                  <span className="text-xs text-gray-500">
                    {letterSpacing}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="50"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #D0FF00 0%, #D0FF00 ${((letterSpacing + 10) / (50 + 10)) * 100}%, #2a2a2a ${((letterSpacing + 10) / (50 + 10)) * 100}%, #2a2a2a 100%)`
                  }}
                />
              </div>

              {/* Text Align */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <label className="text-xs font-medium text-gray-400 block mb-2">
                  Text Align
                </label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => setTextAlign(align as any)}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        textAlign === align
                          ? 'bg-[#D0FF00] text-black'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {align.charAt(0).toUpperCase() + align.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <label className="text-xs font-medium text-gray-400 block mb-2">
                  Text Color
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-14 h-10 rounded-lg cursor-pointer bg-gray-800 border border-gray-700"
                  />
                  <div className="flex-1 grid grid-cols-4 gap-1.5">
                    {['#FFFFFF', '#D0FF00', '#FF2D55', '#007AFF'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setTextColor(color)}
                        className={`h-10 rounded-lg transition-all duration-200 ${
                          textColor === color ? 'ring-2 ring-[#D0FF00] scale-105' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div className="bg-[#1a1a1a] rounded-2xl p-3 flex items-center gap-3">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onFocus={handleFocus}
              placeholder="Describe your typography..."
              className="flex-1 bg-transparent border-0 outline-none resize-none text-white placeholder-gray-600 text-base py-2 px-3 min-h-[60px] max-h-[120px]"
              rows={2}
            />
            
            <div className="flex items-center gap-2">
              {hasResult && (
                <button
                  onClick={regenerateFonts}
                  className="px-6 h-12 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200"
                >
                  Random
                </button>
              )}
              
              <button
                onClick={generateFonts}
                disabled={!canGenerate}
                className="px-8 h-12 bg-[#D0FF00] hover:bg-[#B8E600] disabled:bg-gray-800 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 disabled:text-gray-600 shadow-lg hover:shadow-xl"
              >
                Generate
              </button>

              {hasResult && (
                <button
                  onClick={handleExportPNG}
                  className="px-6 h-12 bg-white hover:bg-gray-100 text-black font-medium rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export PNG
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
