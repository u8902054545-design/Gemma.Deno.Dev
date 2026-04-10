import React from 'react';
import { motion } from 'motion/react';
import { GemmaIcon } from '../GemmaIcon';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex gap-4 max-w-[85%]"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#1a1a1a] border border-[#333]">
        <GemmaIcon className="w-full h-full" />
      </div>
      <div className="px-6 py-4 rounded-3xl bg-[#1a1a1a] border border-[#333] text-gray-100 rounded-tl-sm flex items-center gap-3">
        <div className="w-2 h-2 rounded-full animate-gradient"></div>
        <div className="w-2 h-2 rounded-full animate-gradient" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full animate-gradient" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </motion.div>
  );
};
