import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GemmaIcon } from './GemmaIcon';

type ChatMessageProps = {
  role: 'user' | 'ai';
  content: string;
  isGenerating?: boolean;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content, isGenerating }) => {
  const isAI = role === 'ai';
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(false);

  const thoughtMatch = content.match(/\*([\s\S]*?)\*/);
  const thought = thoughtMatch ? thoughtMatch[1].trim() : null;
  const mainContent = thoughtMatch ? content.replace(thoughtMatch[0], '').trim() : content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col gap-2 mb-8 ${isAI ? 'items-start' : 'items-end'}`}
    >
      <div className={`flex items-center gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="relative flex items-center justify-center w-12 h-12">
          {isAI && isGenerating && <div className="google-spinner" />}
          <div className={`z-10 flex items-center justify-center ${!isAI ? 'bg-[var(--google-blue)] w-9 h-9 rounded-full' : ''}`}>
            {isAI ? (
              <GemmaIcon className="w-9 h-9" />
            ) : (
              <span className="material-symbols-outlined text-white text-[20px]">person</span>
            )}
          </div>
        </div>

        {isAI && thought && (
          <button
            onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--md-sys-color-surface-container-high)] hover:bg-[#333] border border-[var(--md-sys-color-outline)]/30 transition-colors text-xs text-[var(--md-sys-color-on-surface-variant)]"
          >
            <span>Показать мысль</span>
            <span className="material-symbols-outlined text-[14px]">
              {isThoughtExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        <AnimatePresence>
          {isAI && thought && isThoughtExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-sm text-[var(--md-sys-color-on-surface-variant)] italic border-l-2 border-[var(--md-sys-color-outline)] pl-4 py-1 my-2">
                {thought}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`max-w-[90%] text-[16px] leading-relaxed ${
            isAI
              ? 'text-[var(--md-sys-color-on-background)] px-1'
              : 'bg-[var(--google-blue)] text-white px-4 py-2 rounded-2xl self-end shadow-lg shadow-blue-900/10'
          }`}
        >
          {mainContent}
        </div>
      </div>
    </motion.div>
  );
};
