import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'motion/react';
import { GemmaIcon } from '../GemmaIcon';

// Описываем тип сообщения, который принимает компонент
type ChatMessageProps = {
  role: 'user' | 'ai';
  content: string;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 max-w-[85%] ${role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${role === 'user' ? 'bg-[#0000FF]' : 'bg-[#1a1a1a] border border-[#333]'}`}>
        {role === 'user' ? (
          <User size={20} />
        ) : (
          <GemmaIcon className="w-full h-full" />
        )}
      </div>

      <div className={`px-6 py-4 rounded-3xl leading-relaxed ${role === 'user' ? 'bg-[#0000FF] text-white rounded-tr-sm' : 'bg-[#1a1a1a] text-gray-100 border border-[#333] rounded-tl-sm'}`}>
        {content}
      </div>
    </motion.div>
  );
};
