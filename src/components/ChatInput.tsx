import React, { memo, useEffect, useRef, useState } from 'react';
import { ModelSelector, MODEL_DATA } from './ModelSelector';

type ChatInputProps = {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
  stopRequest: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  isTyping: boolean;
  models: string[];
};

const ChatInputComponent: React.FC<ChatInputProps> = ({
  input, setInput, handleSend, stopRequest, selectedModel, setSelectedModel,
  isDropdownOpen, setIsDropdownOpen, isTyping, models,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const value = target.value;
      setInput(value.substring(0, start) + "\n" + value.substring(end));
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
      }, 0);
    }
  };

  const toggleListening = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        const newInput = input + (input ? " " : "") + transcript;
        setInput(newInput);
        setTimeout(() => handleSend(), 150);
      }
    };
    recognition.start();
  };

  return (
    <footer className="w-full max-w-4xl mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 z-50">
      <div className="pt-[1px] px-[1px] rounded-t-[32px] bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853]">
        <div className="bg-black rounded-t-[31px] flex flex-col p-2 pb-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message Gemma..."
            className="w-full bg-transparent border-none outline-none resize-none max-h-60 min-h-[44px] px-4 py-3 text-[#e2e2e2] placeholder-[#444]"
            rows={1}
          />
          <div className="flex items-center justify-end px-2 gap-3">
            <ModelSelector
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              models={models}
            />
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleListening}
                className={`p-2 rounded-full transition-colors active:scale-90 flex items-center justify-center ${isListening ? "bg-[#EA4335]/20" : "hover:bg-[#1a1a1a]"}`}
              >
                <span className={`material-symbols-outlined text-[24px] ${isListening ? "text-[#EA4335]" : "text-[#808080]"}`}>
                  {isListening ? "mic" : "mic_none"}
                </span>
              </button>
              
              {isTyping ? (
                <button
                  onClick={stopRequest}
                  className="p-2 rounded-full hover:bg-[#1a1a1a] transition-transform active:scale-90 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[24px] text-[#EA4335]">
                    stop_circle
                  </span>
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 rounded-full hover:bg-[#1a1a1a] disabled:opacity-10 transition-transform active:scale-90 flex items-center justify-center"
                >
                  <span className={`material-symbols-outlined text-[24px] ${input.trim() ? "text-[#8ab4f8]" : "text-[#808080]"}`}>
                    send
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const ChatInput = memo(ChatInputComponent);
