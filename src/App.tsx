import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import Snackbar from './components/Snackbar';
import Login from './components/Login';
import { pageVariants } from './motion/transitions';

export default function App() {
  const { user, loading, signInWithGoogle } = useAuth();

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
    snackbarMessage,
    isSnackbarOpen,
    setIsSnackbarOpen
  } = useChat();

  if (loading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div
          key="login-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen bg-black"
        >
          <Login onLoginSuccess={signInWithGoogle} />
        </motion.div>
      ) : (
        <motion.div
          key="chat-screen"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="min-h-screen bg-black text-white font-sans flex flex-col"
        >
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

          <Snackbar
            message={snackbarMessage}
            isOpen={isSnackbarOpen}
            onClose={() => setIsSnackbarOpen(false)}
          />

          <div className="h-[140px] w-full flex-shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
