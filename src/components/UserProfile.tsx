import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogOut, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const userAvatar = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];
  const userEmail = user.email;

  const toggleProfile = () => setIsOpen(!isOpen);

  return (
    <>
      <button 
        onClick={toggleProfile}
        className="w-10 h-10 rounded-full overflow-hidden border border-[#333] hover:border-gray-500 transition-all active:scale-95"
      >
        {userAvatar ? (
          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-medium">
            {userName?.charAt(0).toUpperCase()}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col"
          >
            <div className="p-6 flex justify-between items-center">
              <span className="text-gray-500 text-sm font-medium">{userEmail}</span>
              <button 
                onClick={toggleProfile}
                className="p-2 hover:bg-[#1a1a1a] rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center px-6">
              <div className="flex flex-col items-center max-w-sm w-full">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 ring-4 ring-[#1a1a1a]">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
                      {userName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-semibold text-white mb-2">
                  Hi, {userName}!
                </h2>
                <p className="text-gray-400 mb-12 text-center">
                  Manage your account and settings
                </p>

                <div className="w-full space-y-4">
                  <button
                    onClick={() => {
                      signOut();
                      toggleProfile();
                    }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-gray-200 text-black rounded-2xl font-semibold transition-all active:scale-[0.98]"
                  >
                    <LogOut size={20} />
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 text-center">
              <p className="text-xs text-gray-600 uppercase tracking-widest font-medium">
                Gemma Open Access
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
