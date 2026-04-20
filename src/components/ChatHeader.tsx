import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from './UserProfile';
import { mdEasing } from '../motion/transitions';

interface ChatHeaderProps {
  messages: any[];
  chatTitle: string;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ messages, chatTitle }) => {
  const isChatStarted = messages.length > 0;

  return (
    <header className="px-4 py-3 flex justify-between items-center sticky top-0 z-50 bg-black/50 backdrop-blur-md h-[64px]">
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface)]">
            menu
          </span>
        </button>

        <AnimatePresence mode="wait">
          {isChatStarted && chatTitle && (
            <motion.h1
              key={chatTitle}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4, ease: mdEasing.standard }}
              className="text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] truncate mr-4"
            >
              {chatTitle}
            </motion.h1>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-end min-w-[48px]">
        <AnimatePresence mode="wait" initial={false}>
          {!isChatStarted ? (
            <motion.div
              key="user-avatar"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: mdEasing.standard }}
            >
              <UserProfile />
            </motion.div>
          ) : (
            <motion.div
              key="chat-controls"
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
              transition={{ duration: 0.3, ease: mdEasing.standard }}
              className="flex items-center gap-1"
            >
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface-variant)] text-[22px]">
                  edit_square
                </span>
              </button>
              
              <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface-variant)] text-[22px]">
                  download
                </span>
              </button>

              <button className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--md-sys-color-on-surface-variant)] text-[22px]">
                  more_vert
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
