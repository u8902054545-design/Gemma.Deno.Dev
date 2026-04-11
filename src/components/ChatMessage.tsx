import React, { useState } from 'react';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
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
        <div className="relative flex items-center justify-center w-10 h-10">
          {isAI && isGenerating && (
            <div className="google-spinner" />
          )}
          <div className={`z-10 flex items-center justify-center ${!isAI ? 'bg-blue-600 w-8 h-8 rounded-full' : ''}`}>
            {isAI ? (
              <GemmaIcon className="w-7 h-7" />
            ) : (
              <User size={18} className="text-white" />
            )}
          </div>
        </div>

        {isAI && thought && (
          <button
            onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs text-gray-400 cursor-pointer"
          >
            <span className="font-medium">Показать мысль</span>
            {isThoughtExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
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
              <div className="text-sm text-gray-500 italic border-l-2 border-gray-700 pl-4 py-1 my-2">
                {thought}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`max-w-[90%] text-[16px] leading-relaxed ${
            isAI
              ? 'text-gray-100 px-1'
              : 'bg-blue-600 text-white px-4 py-2 rounded-2xl self-end'
          }`}
        >
          {mainContent}
        </div>
      </div>
    </motion.div>
  );
};
