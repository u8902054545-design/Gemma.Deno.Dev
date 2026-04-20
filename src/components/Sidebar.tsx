import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { drawerVariants } from '../motion/drawer';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: any[];
  currentChatId: string;
  onChatSelect: (id: string) => void;
  onNewChat: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose,
  chats, 
  currentChatId, 
  onChatSelect, 
  onNewChat 
}) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[55] cursor-pointer"
          />
        )}
      </AnimatePresence>

      <motion.aside
        variants={drawerVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        className="fixed top-0 left-0 h-screen w-[300px] bg-[#1c1b1f] border-r border-white/5 flex flex-col z-[60] shadow-2xl"
      >
        <div className="p-4 flex flex-col gap-4 mt-2">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#938f99] text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search for chats"
              className="w-full bg-[#2b2930] text-[#e6e1e5] pl-10 pr-4 py-3 rounded-full text-sm outline-none focus:ring-1 focus:ring-[var(--md-sys-color-primary)]"
            />
          </div>

          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="flex items-center gap-3 px-4 py-3 bg-[#2b2930] hover:bg-[#36343b] text-[var(--md-sys-color-primary)] rounded-2xl transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[22px]">edit_square</span>
            <span className="font-medium text-sm">New chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 mt-2">
          <div className="px-4 py-2">
            <h2 className="text-[12px] font-medium text-[#938f99] uppercase tracking-wider">Chats</h2>
          </div>
          <div className="flex flex-col gap-1">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => { onChatSelect(chat.id); onClose(); }}
                className={`flex items-center px-4 py-3 rounded-full text-sm text-left truncate ${
                  currentChatId === chat.id 
                  ? 'bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]' 
                  : 'text-[#e6e1e5] hover:bg-white/5'
                }`}
              >
                {chat.title || 'Untitled Chat'}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
