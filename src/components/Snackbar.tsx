import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { pageVariants, mdEasing, mdDuration } from '../motion/transitions';

interface SnackbarProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, isOpen, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95, x: '-50%' }}
          animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
          exit={{ opacity: 0, scale: 0.95, x: '-50%' }}
          transition={{ 
            duration: mdDuration.medium1, 
            ease: mdEasing.standard 
          }}
          className="fixed bottom-10 left-1/2 z-[100] w-full max-w-max px-4"
        >
          <div className="bg-[#fdfeff] text-[#1f1f1f] px-6 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#e0e0e0] flex items-center justify-between gap-6 min-w-[340px] md:min-w-[400px]">
            <span className="text-[14px] font-normal leading-relaxed tracking-wide">
              {message}
            </span>
            <button
              onClick={onClose}
              className="text-[#0b57d0] hover:bg-[#0b57d00a] px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors duration-200"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Snackbar;
