import React from 'react';
import { motion } from 'motion/react';

export const GemmaSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 w-full max-w-[400px] mt-1 mb-4">
      <motion.div
        initial={{ opacity: 0.4 }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="h-3.5 w-[85%] rounded-full animate-gradient shadow-sm"
        style={{ backgroundSize: '200% 200%', opacity: 0.6 }}
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="h-3.5 w-[60%] rounded-full animate-gradient shadow-sm"
        style={{ backgroundSize: '200% 200%', opacity: 0.5 }}
      />
      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        className="h-3.5 w-[75%] rounded-full animate-gradient shadow-sm"
        style={{ backgroundSize: '200% 200%', opacity: 0.4 }}
      />
    </div>
  );
};
