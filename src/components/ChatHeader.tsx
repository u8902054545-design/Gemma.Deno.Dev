import React from 'react';
import { GemmaIcon } from './GemmaIcon';

export const ChatHeader: React.FC = () => {
  return (
    <header className="p-6 flex justify-between items-center border-b border-[#1a1a1a]">
      <div className="flex items-center gap-3">
        <GemmaIcon className="w-8 h-8" />
        <h1 className="text-2xl font-bold animate-gradient text-gradient">
          Gemma Open Access
        </h1>
      </div>
    </header>
  );
};
