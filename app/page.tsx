'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TextCanvas } from '@/components/features/TextCanvas';
import { AboutTypeface } from '@/components/features/AboutTypeface';
import { Button } from '@/components/ui/Button';
import { useTextStore } from '@/store/textStore';
import { loadFonts } from '@/lib/fontLoader';
import { PRELOAD_FONTS } from '@/lib/fonts';

export default function Home() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>('');
  const { generateFonts } = useTextStore();

  useEffect(() => {
    // 초기 인기 10개 폰트 프리로드
    loadFonts(PRELOAD_FONTS).catch(err => {
      console.error('Failed to preload fonts:', err);
    });
    
    // 초기 샘플 텍스트 자동 생성
    generateFonts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <TextCanvas onFontClick={(fontFamily) => {
          setSelectedFont(fontFamily);
          setIsAboutOpen(true);
        }} />
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full px-6 py-4 text-center text-xs text-gray-600"
      >
        <p>
          Random Typeface • 100 Curated Google Fonts • Created by{' '}
          <a 
            href="https://ritstudio.kr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-[#D0FF00] transition-colors duration-200"
          >
            RIT STUDIO
          </a>
        </p>
      </motion.footer>

      {/* Floating About Button - Yellow Style */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="fixed bottom-8 right-8 z-30"
      >
        <button
          onClick={() => setIsAboutOpen(true)}
          className="w-14 h-14 bg-[#D0FF00] hover:bg-[#B8E600] text-black rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center font-bold"
          aria-label="About Typeface"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </motion.div>

      {/* About Typeface Modal */}
      <AboutTypeface 
        isOpen={isAboutOpen} 
        onClose={() => {
          setIsAboutOpen(false);
          setSelectedFont('');
        }}
        selectedFont={selectedFont}
      />
    </div>
  );
}
