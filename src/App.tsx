import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { StartScreen } from './components/StartScreen';
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
    return <div className="h-screen w-full bg-black" />;
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
          className="h-screen w-full bg-black overflow-hidden"
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
          className="h-screen w-full bg-black text-white font-sans flex flex-col overflow-hidden relative"
        >
          <ChatHeader />

          <main className="flex-1 overflow-y-auto max-w-full w-full mx-auto flex flex-col scroll-smooth relative">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key="start-screen-wrapper"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                  transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
                  className="absolute inset-0 flex flex-col"
                >
                  <StartScreen 
                    userName={user.user_metadata?.full_name || user.email} 
                    onSelectSuggestion={(text) => handleSend(text)} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="chat-messages-wrapper"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-6 pb-40 max-w-4xl w-full mx-auto flex flex-col"
                >
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={msg.id}
                      role={msg.role}
                      content={msg.content}
                      isGenerating={isTyping && index === messages.length - 1 && msg.role === 'ai'}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                </motion.div>
              )}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
