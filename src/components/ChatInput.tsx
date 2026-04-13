import React from 'react';
import { ModelSelector } from './ModelSelector';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  isTyping: boolean;
  models: string[];
};

export const ChatInput: React.FC<ChatInputProps> = ({
  input, setInput, handleSend, handleKeyDown, selectedModel, setSelectedModel,
  isDropdownOpen, setIsDropdownOpen, isTyping, models,
}) => {
  return (
    <footer className="w-full max-w-4xl mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
      <div className="pt-[1px] px-[1px] rounded-t-[32px] animate-gradient input-glow">
        <div className="bg-black rounded-t-[31px] flex flex-col p-3 pb-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemma..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-48 min-h-[44px] px-4 py-3 text-[var(--md-sys-color-on-background)] placeholder-[var(--md-sys-color-on-surface-variant)]/50"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 disabled:opacity-30 transition-all mb-1 active:scale-90 flex items-center justify-center"
            >
              <span className={`material-symbols-outlined text-[20px] ${input.trim() && !isTyping ? "text-[var(--google-blue)]" : "text-[var(--md-sys-color-on-surface-variant)]"}`}>
                send
              </span>
            </button>
          </div>
          <ModelSelector
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            models={models}
          />
        </div>
      </div>
    </footer>
  );
};
