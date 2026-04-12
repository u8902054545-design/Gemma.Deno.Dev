import React from 'react';
import { AnimatePresence } from 'motion/react';
import { useChat } from './hooks/useChat';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import Snackbar from './components/Snackbar';

export default function App() {
  const {
    messages,
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    isDropdownOpen,
    setIsDropdownOpen,
    isTyping,
    messagesEndRef,
    handleSend,
    handleKeyDown,
    models,
    // Новые поля из хука
    snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen
  } = useChat();

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <ChatHeader />

      <main className="flex-1 overflow-y-auto p-6 max-w-4xl w-full mx-auto flex flex-col">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              isGenerating={isTyping && index === messages.length - 1 && msg.role === 'ai'}
            />
          ))}

          {isTyping && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        handleKeyDown={handleKeyDown}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        isTyping={isTyping}
        models={models}
      />

      {/* Snackbar уведомление */}
      <Snackbar 
        message={snackbarMessage} 
        isOpen={isSnackbarOpen} 
        onClose={() => setIsSnackbarOpen(false)} 
      />

      <div className="h-[140px] w-full flex-shrink-0" />
    </div>
  );
}
