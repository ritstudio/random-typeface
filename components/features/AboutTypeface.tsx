'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CURATED_FONTS } from '@/lib/fonts';
import { Button } from '@/components/ui/Button';

interface AboutTypefaceProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFont?: string;
}

export const AboutTypeface: React.FC<AboutTypefaceProps> = ({ isOpen, onClose, selectedFont }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedFontRef = useRef<HTMLAnchorElement>(null);

  const fontsByCategory = {
    'Sans-serif': CURATED_FONTS.filter(f => f.category === 'sans-serif'),
    'Serif': CURATED_FONTS.filter(f => f.category === 'serif'),
    'Display': CURATED_FONTS.filter(f => f.category === 'display'),
    'Handwriting': CURATED_FONTS.filter(f => f.category === 'handwriting'),
    'Monospace': CURATED_FONTS.filter(f => f.category === 'monospace'),
  };

  useEffect(() => {
    if (isOpen && selectedFont && selectedFontRef.current) {
      // 약간의 지연을 두어 모달 애니메이션이 완료된 후 스크롤
      setTimeout(() => {
        selectedFontRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }, [isOpen, selectedFont]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-[500px] bg-[#0a0a0a] rounded-l-[30px] z-50 overflow-hidden flex flex-col shadow-2xl border-l border-gray-900"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    About Typeface
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {CURATED_FONTS.length} curated fonts from Google Fonts
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center"
                  aria-label="Close"
                >
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 space-y-8">
              {Object.entries(fontsByCategory).map(([category, fonts]) => (
                <div key={category}>
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    {category}
                    <span className="text-sm font-normal text-gray-600">
                      ({fonts.length})
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {fonts.map((font) => {
                      const googleFontsUrl = `https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`;
                      const isSelected = selectedFont === font.family;
                      return (
                        <motion.a
                          key={font.family}
                          ref={isSelected ? selectedFontRef : null}
                          href={googleFontsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`block p-4 rounded-[18px] transition-all duration-200 group ${
                            isSelected 
                              ? 'bg-[#D0FF00] hover:bg-[#B8E600]' 
                              : 'bg-[#1a1a1a] hover:bg-[#252525]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <p
                              className={`text-base ${
                                isSelected ? 'text-black font-bold' : 'text-white'
                              }`}
                              style={{ fontFamily: `"${font.family}", system-ui` }}
                            >
                              {font.family}
                            </p>
                            <svg
                              className={`w-4 h-4 transition-colors ${
                                isSelected 
                                  ? 'text-black' 
                                  : 'text-gray-600 group-hover:text-[#D0FF00]'
                              }`}
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-900 bg-[#0a0a0a]">
              <p className="text-xs text-gray-600 text-center">
                All fonts are from Google Fonts under the SIL Open Font License
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
