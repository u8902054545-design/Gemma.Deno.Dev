import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GemmaIcon } from './GemmaIcon';
import { mdEasing, mdDuration } from '../motion/transitions';

type ModelSelectorProps = {
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  models: string[];
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  setSelectedModel,
  isDropdownOpen,
  setIsDropdownOpen,
  models,
}) => {
  return (
    <div className="relative mt-2 px-2">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-medium"
      >
        <GemmaIcon className="w-3.5 h-3.5" />
        {selectedModel}
        <ChevronDown size={12} />
      </button>

      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: mdDuration.medium1, ease: mdEasing.emphasized }}
            className="absolute bottom-full left-0 mb-4 w-56 bg-[#1a1a1a] border border-[#333] rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {models.map((model) => (
              <button
                key={model}
                onClick={() => {
                  setSelectedModel(model);
                  setIsDropdownOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-[#252525] flex items-center gap-3 transition-colors text-sm"
              >
                <GemmaIcon className="w-4 h-4 flex-shrink-0" />
                {model}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
