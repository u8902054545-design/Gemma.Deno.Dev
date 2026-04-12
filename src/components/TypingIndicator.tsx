import React from 'react';
import { motion } from 'motion/react';
import { GemmaIcon } from './GemmaIcon';

export const TypingIndicator: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-start mb-8"
    >
      <div className="relative flex items-center justify-center w-12 h-12">
        <div className="google-spinner" />

        <div className="z-10 flex items-center justify-center">
          <GemmaIcon className="w-9 h-9" />
        </div>
      </div>

      <div className="h-6 w-full" />
    </motion.div>
  );
};
