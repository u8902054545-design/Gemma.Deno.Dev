import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';
import { useUserChats } from './hooks/useUserChats';
import { ChatHeader } from './components/ChatHeader';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { StartScreen } from './components/StartScreen';
import { Sidebar } from './components/Sidebar';
import Snackbar from './components/Snackbar';
import Login from './components/Login';
import { pageVariants, mdEasing } from './motion/transitions';
import { mainContentVariants } from './motion/drawer';

export default function App() {
  const { user, loading, signInWithGoogle } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { chats, refreshChats } = useUserChats(user?.id);

  const {
    messages,
    setMessages,
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
    setIsSnackbarOpen,
    chatId,
    setChatId,
    chatTitle,
    setChatTitle,
    loadChatMessages
  } = useChat();

  if (loading) {
    return <div className="h-screen w-full bg-black" />;
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

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
        <div className="h-screen w-full bg-black overflow-hidden relative">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
            chats={chats}
            currentChatId={chatId}
            onChatSelect={async (id) => {
              const selectedChat = chats.find(c => c.id === id);
              if (selectedChat) {
                setChatTitle(selectedChat.title);
              }
              await loadChatMessages(id);
              closeSidebar();
            }}
            onNewChat={() => {
              setMessages([]);
              setChatId(crypto.randomUUID());
              setChatTitle('');
              closeSidebar();
              refreshChats();
            }}
          />

          <motion.div
            variants={mainContentVariants}
            initial="closed"
            animate={isSidebarOpen ? "open" : "closed"}
            className="h-full w-full flex flex-col bg-black relative shadow-2xl"
          >
            <ChatHeader
              messages={messages}
              chatTitle={chatTitle}
              chatId={chatId}
              setMessages={setMessages}
              setChatId={setChatId}
              setChatTitle={setChatTitle}
              onMenuClick={toggleSidebar}
              isSidebarOpen={isSidebarOpen}
            />

            <main className="flex-1 overflow-y-auto w-full mx-auto flex flex-col scroll-smooth relative">
              <AnimatePresence mode="wait">
                {messages.length === 0 ? (
                  <motion.div
                    key="start-screen-anim"
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="absolute inset-0 flex flex-col"
                  >
                    <StartScreen
                      userName={user.user_metadata?.full_name || user.email}
                      onSelectSuggestion={(text) => handleSend(text)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="chat-content-anim"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
          </motion.div>

          <Snackbar
            message={snackbarMessage}
            isOpen={isSnackbarOpen}
            onClose={() => setIsSnackbarOpen(false)}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
