'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTextStore } from '@/store/textStore';
import { CharacterSpan } from './CharacterSpan';

interface TextCanvasProps {
  onFontClick?: (fontFamily: string) => void;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({ onFontClick }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
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

              {/* Text Spacing */}
              <div className="bg-[#1a1a1a] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium text-gray-400">
                    Text Spacing
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
              <motion.button
                onClick={async () => {
                  setIsGenerating(true);
                  generateFonts();
                  await new Promise(resolve => setTimeout(resolve, 600));
                  setIsGenerating(false);
                }}
                disabled={!canGenerate || isGenerating}
                whileTap={{ scale: 0.95 }}
                className="px-8 h-12 bg-[#D0FF00] hover:bg-[#B8E600] disabled:bg-gray-800 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all duration-200 disabled:text-gray-600 shadow-lg hover:shadow-xl flex items-center gap-2 relative overflow-hidden"
              >
                {isGenerating ? (
                  <>
                    <motion.svg
                      className="w-5 h-5"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </motion.svg>
                    <span>Generating...</span>
                  </>
                ) : (
                  <span>Random Generate</span>
                )}
              </motion.button>
              
              {hasResult && (
                <motion.button
                  onClick={async () => {
                    setIsExporting(true);
                    setExportSuccess(false);
                    
                    const html2canvas = (await import('html2canvas')).default;
                    const element = document.querySelector('.font-bold.leading-tight') as HTMLElement;
                    if (element) {
                      // 임시 컨테이너 생성
                      const wrapper = document.createElement('div');
                      wrapper.style.position = 'fixed';
                      wrapper.style.left = '-9999px';
                      wrapper.style.top = '0';
                      wrapper.style.width = '1920px';
                      wrapper.style.height = '1080px';
                      wrapper.style.backgroundColor = '#000000';
                      wrapper.style.display = 'flex';
                      wrapper.style.alignItems = 'center';
                      wrapper.style.justifyContent = 'center';
                      wrapper.style.padding = '120px';
                      
                      // 텍스트 복제
                      const clone = element.cloneNode(true) as HTMLElement;
                      clone.style.textAlign = 'center';
                      clone.style.width = 'auto';
                      clone.style.maxWidth = '100%';
                      
                      wrapper.appendChild(clone);
                      document.body.appendChild(wrapper);
                      
                      // 캡처
                      const canvas = await html2canvas(wrapper, {
                        backgroundColor: '#000000',
                        scale: 2,
                        width: 1920,
                        height: 1080,
                      });
                      
                      // 정리
                      document.body.removeChild(wrapper);
                      
                      const link = document.createElement('a');
                      link.download = 'random-typeface.png';
                      link.href = canvas.toDataURL();
                      link.click();
                      
                      setExportSuccess(true);
                      setTimeout(() => {
                        setIsExporting(false);
                        setExportSuccess(false);
                      }, 2000);
                    }
                  }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isExporting}
                  className="px-6 h-12 bg-white hover:bg-gray-100 disabled:bg-gray-300 text-black font-medium rounded-xl transition-all duration-200 flex items-center gap-2 relative overflow-hidden"
                >
                  {isExporting && !exportSuccess && (
                    <motion.svg
                      className="w-4 h-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </motion.svg>
                  )}
                  {exportSuccess ? (
                    <>
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                      <span>Exported!</span>
                    </>
                  ) : (
                    <>
                      <span>Export</span>
                      {!isExporting && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      )}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
