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
      {/* Контейнер аватарки со спиннером */}
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Тот самый спиннер из index.css */}
        <div className="google-spinner" />
        
        <div className="z-10 flex items-center justify-center">
          <GemmaIcon className="w-7 h-7" />
        </div>
      </div>

      {/* Небольшой отступ снизу, чтобы сохранить геометрию чата */}
      <div className="h-6 w-full" />
    </motion.div>
  );
};
