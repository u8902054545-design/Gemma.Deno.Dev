import React, { memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GemmaSkeleton } from '../GemmaSkeleton';
import { mdEasing, mdDuration } from '../../motion/transitions';
import { ChatMessageProps } from './types';
import { useMessageLogic } from './useMessageLogic';
import { ChatMessageHeader } from './ChatMessageHeader';
import { CodeBlock } from './CodeBlock';

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ role, content, isGenerating }) => {
  const isAI = role === 'ai';
  const isStopped = content.includes('_STOPPED_');
  const cleanContent = content.replace('_STOPPED_', '');

  const {
    isThoughtExpanded,
    setIsThoughtExpanded,
    copiedText,
    handleCopy,
    thought,
    mainContent
  } = useMessageLogic(cleanContent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: mdDuration.short4, ease: mdEasing.decelerate }}
      className={`flex flex-col mb-8 ${isAI ? 'items-start w-full' : 'items-end'}`}
    >
      {isAI && (
        <ChatMessageHeader
          hasThought={!!thought}
          isExpanded={isThoughtExpanded}
          onToggleThought={() => setIsThoughtExpanded(!isThoughtExpanded)}
        />
      )}

      <div className={`w-full flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
        <AnimatePresence>
          {isAI && thought && isThoughtExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden w-full"
            >
              <div className="text-sm text-[var(--md-sys-color-on-surface-variant)] italic border-l-2 border-[var(--md-sys-color-outline)] pl-4 py-1 mb-4">
                {thought}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`max-w-full text-[16px] leading-relaxed markdown-content ${
            isAI ? 'text-[var(--md-sys-color-on-background)] w-full' : 'bg-[var(--google-blue)] text-white px-4 py-2 rounded-2xl shadow-lg shadow-blue-900/10 inline-block'
          }`}
        >
          {isAI && isGenerating && !mainContent ? (
            <div className="min-h-[40px] flex items-center">
              <GemmaSkeleton />
            </div>
          ) : (
            <div className="min-h-[1.5em]">
              {isAI ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    pre: ({ children }) => <>{children}</>,
                    code({ inline, className, children }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeString = String(children).replace(/\n$/, '');
                      return !inline && match ? (
                        <CodeBlock
                          language={match[1]}
                          value={codeString}
                          isCopied={copiedText === codeString}
                          onCopy={handleCopy}
                        />
                      ) : (
                        <code className="bg-[var(--md-sys-color-surface-container-high)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--google-blue)]">
                          {children}
                        </code>
                      );
                    },
                    p: ({ children }) => <p className="mb-4 last:mb-0 break-words">{children}</p>,
                  }}
                >
                  {mainContent}
                </ReactMarkdown>
              ) : (
                <div className="whitespace-pre-wrap break-words">
                  {mainContent}
                </div>
              )}

              {isStopped && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)] w-fit"
                >
                  <span className="material-symbols-outlined text-[18px] text-[var(--md-sys-color-primary)]">
                    info
                  </span>
                  <span className="text-sm font-medium text-[var(--md-sys-color-on-surface-variant)]">
                    Generation stopped by user
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ChatMessage = memo(ChatMessageComponent);
