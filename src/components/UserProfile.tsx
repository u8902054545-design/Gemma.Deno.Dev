import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';

const ProfileDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const userAvatar = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0];
  const userEmail = user.email;

  const handleRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(button.clientWidth, button.clientHeight);
    const circle = document.createElement("span");

    circle.style.width = circle.style.height = `${size}px`;
    circle.style.left = `${event.clientX - rect.left}px`;
    circle.style.top = `${event.clientY - rect.top}px`;
    circle.style.position = 'absolute';
    circle.style.zIndex = '10';
    circle.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
    circle.classList.add("md3-ripple", "animate-ripple");

    const oldRipple = button.getElementsByClassName("md3-ripple")[0];
    if (oldRipple) oldRipple.remove();
    button.appendChild(circle);

    setTimeout(() => {
      signOut();
      onClose();
    }, 450);
  };

  const drawerView = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 250 }}
          style={{ zIndex: 99999 }}
          className="fixed inset-0 bg-black google-mesh-gradient flex flex-col font-sans overflow-hidden"
        >
          <header className="w-full p-4 flex items-center justify-between border-b border-white/10 bg-black">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 active:scale-90 flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>
            <span className="text-gray-400 text-sm font-medium truncate max-w-[200px]">
              {userEmail}
            </span>
            <div className="w-10" />
          </header>

          <main className="flex-1 flex flex-col items-center justify-start pt-16 px-6 overflow-y-auto">
            <div className="relative mb-8">
               <div className="absolute -inset-2 animate-gradient rounded-full blur-2xl opacity-20"></div>
               <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--md-sys-color-outline)] shadow-2xl bg-[#111] flex items-center justify-center">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                     <div className="w-full h-full animate-gradient flex items-center justify-center text-white text-4xl font-bold uppercase">
                       {userName?.charAt(0)}
                     </div>
                  )}
               </div>
            </div>

            <h2 className="text-2xl font-semibold text-white mb-1 text-center">
              Hi, {userName}!
            </h2>
            <p className="text-gray-500 text-sm mb-12">
              Google Account
            </p>

            <div className="w-full max-w-[320px]">
              <button
                onClick={handleRipple}
                className="ripple-container w-full flex items-center justify-center gap-3 px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-[var(--md-sys-color-outline)] rounded-2xl font-medium transition-all outline-none"
              >
                <span className="material-symbols-outlined text-[18px] text-gray-400">logout</span>
                <span>Sign out</span>
              </button>
            </div>
          </main>

          <footer className="p-10 text-center bg-black border-t border-white/5">
            <p className="text-[10px] text-gray-700 uppercase tracking-[0.5em] font-black italic">
              Gemma Open Access
            </p>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(drawerView, document.body);
};

export const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const userAvatar = user.user_metadata?.avatar_url;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full overflow-hidden border border-[#1a1a1a] hover:border-[#333] transition-all active:scale-95 shadow-lg relative flex items-center justify-center bg-black"
      >
        {userAvatar ? (
          <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <span className="material-symbols-outlined text-[20px] text-gray-400">person</span>
        )}
      </button>

      <ProfileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
