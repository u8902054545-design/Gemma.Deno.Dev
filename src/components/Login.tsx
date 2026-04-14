import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GemmaIcon } from './GemmaIcon';
import { GoogleIcon } from './GoogleIcon';
import Snackbar from './Snackbar';
import { pageVariants, mdEasing, mdDuration } from '../motion/transitions';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSnack, setShowSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await onLoginSuccess();
    } catch (error: any) {
      console.error(error);
      setSnackMessage(error.message || "Ошибка входа");
      setShowSnack(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black google-mesh-gradient font-sans text-white p-4">
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-full max-w-[400px] bg-[var(--md-sys-color-surface)] rounded-[32px] p-8 flex flex-col items-center border border-[var(--md-sys-color-outline)]/20 input-glow z-10"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gradient text-center">
          Gemma Open Access
        </h1>
        <p className="text-[var(--md-sys-color-on-surface-variant)] text-sm mb-10 text-center font-medium">
          Sign in to access your premium workspace
        </p>

        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            delay: 0.2, 
            duration: mdDuration.medium4, 
            ease: mdEasing.emphasized 
          }}
          className="w-32 h-32 mb-12 flex items-center justify-center bg-white/5 rounded-[32px] border border-white/10 shadow-inner"
        >
          <GemmaIcon className="w-20 h-20" />
        </motion.div>

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className="w-full relative flex items-center justify-center gap-3 bg-white text-black rounded-full py-4 px-6 text-[15px] font-semibold transition-all duration-200 hover:bg-gray-100 active:scale-[0.98] disabled:opacity-80"
        >
          {isLoading ? (
            <div className="relative flex items-center justify-center w-6 h-6">
              <div className="google-spinner"></div>
            </div>
          ) : (
            <>
              <GoogleIcon className="text-[22px]" />
              <span>Continue with Google</span>
            </>
          )}
        </button>

        <p className="text-[var(--md-sys-color-on-surface-variant)]/50 text-[10px] mt-6 text-center max-w-[280px] uppercase tracking-wider">
          Material 3 Design System
        </p>
      </motion.div>

      <Snackbar
        message={snackMessage}
        isOpen={showSnack}
        onClose={() => setShowSnack(false)}
      />
    </div>
  );
}
