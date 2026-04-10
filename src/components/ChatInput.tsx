import React from 'react';
import { Send } from 'lucide-react';
// Импортируем наш селектор
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
  input,
  setInput,
  handleSend,
  handleKeyDown,
  selectedModel,
  setSelectedModel,
  isDropdownOpen,
  setIsDropdownOpen,
  isTyping,
  models,
}) => {
  return (
    <footer className="w-full max-w-4xl mx-auto fixed bottom-0 left-1/2 -translate-x-1/2">
      <div className="pt-[1px] px-[1px] rounded-t-[32px] animate-gradient input-glow">
        <div className="bg-black rounded-t-[31px] flex flex-col p-3 pb-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Gemma..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-48 min-h-[44px] px-4 py-3 text-white placeholder-gray-500"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3 bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] disabled:opacity-50 rounded-full transition-colors mb-1"
            >
              <Send
                size={20}
                className={input.trim() && !isTyping ? "text-[#00FFFF]" : "text-gray-600"}
              />
            </button>
          </div>

          {/* Вместо огромного куска кода просто вызываем ModelSelector */}
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
