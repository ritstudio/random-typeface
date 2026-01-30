'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTextStore } from '@/store/textStore';
import { CharacterSpan } from './CharacterSpan';

interface TextCanvasProps {
  onFontClick?: (fontFamily: string) => void;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({ onFontClick }) => {
  const { 
    inputText, 
    characters, 
    fontSize, 
    textAlign, 
    textColor, 
    setInputText, 
    generateFonts, 
    regenerateFonts, 
    setFontSize,
    setTextAlign,
    setTextColor
  } = useTextStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
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
      <div className="flex-1 flex items-center justify-center px-12 py-8 overflow-auto">
        {hasResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-7xl"
          >
            <div 
              className="font-bold leading-tight break-words whitespace-pre-wrap"
              style={{ 
                fontSize: `${fontSize}px`,
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
            <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Font Size */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400">
                    Font Size
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
                  <div className="flex-1 grid grid-cols-5 gap-1.5">
                    {['#FFFFFF', '#D0FF00', '#FF2D55', '#007AFF', '#34C759'].map((color) => (
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
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Describe your typography..."
              className="flex-1 bg-transparent border-0 outline-none resize-none text-white placeholder-gray-600 text-base py-2 px-3 min-h-[60px] max-h-[120px]"
              rows={2}
            />
            
            <div className="flex items-center gap-2">
              {hasResult && (
                <>
                  <button
                    onClick={regenerateFonts}
                    className="px-6 h-12 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Random
                  </button>
                  
                  <button
                    onClick={async () => {
                      const html2canvas = (await import('html2canvas')).default;
                      const element = document.querySelector('.font-bold.leading-tight') as HTMLElement;
                      if (element) {
                        const canvas = await html2canvas(element, {
                          backgroundColor: '#000000',
                          scale: 2,
                        });
                        const link = document.createElement('a');
                        link.download = 'random-typeface.png';
                        link.href = canvas.toDataURL();
                        link.click();
                      }
                    }}
                    className="px-6 h-12 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    Export
                  </button>
                </>
              )}
              
              <button
                onClick={generateFonts}
                disabled={!canGenerate}
                className="px-8 h-12 bg-[#D0FF00] hover:bg-[#B8E600] disabled:bg-gray-800 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 disabled:text-gray-600 shadow-lg hover:shadow-xl"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
