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

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ 
  role, 
  content, 
  isGenerating, 
  messageId, 
  feedback, 
  onFeedback 
}) => {
  const isAI = role === 'ai';
  const isStopped = content.includes('_STOPPED_');
  const cleanContent = content.replace('_STOPPED_', '');

  const {
    isThoughtExpanded,
    setIsThoughtExpanded,
    copiedText,
    handleCopy,
    thought,
    mainContent,
    localFeedback,
    handleFeedback
  } = useMessageLogic(cleanContent, messageId, feedback, onFeedback);

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
              <div className="text-sm text-[var(--md-sys-color-on-surface-variant)] italic border-l-2 border-[var(--md-sys-color-outline)] pl-4 py-1 mb-4 select-text">
                {thought}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`max-w-full text-[16px] leading-relaxed markdown-content select-text ${
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
                  className="mt-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--md-sys-color-surface-container-high)] border border-[var(--md-sys-color-outline-variant)] w-fit select-none"
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

        {isAI && !isGenerating && mainContent && (
          <div className="mt-4 flex flex-col gap-3 w-full select-none">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleFeedback('like')}
                className={`p-2 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors cursor-pointer ${
                  localFeedback === 'like' ? 'text-[var(--google-blue)]' : 'text-[var(--md-sys-color-on-surface-variant)]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${localFeedback === 'like' ? 'FILL' : ''}`} style={{ fontVariationSettings: localFeedback === 'like' ? "'FILL' 1" : "" }}>
                  thumb_up
                </span>
              </button>
              <button
                onClick={() => handleFeedback('dislike')}
                className={`p-2 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] transition-colors cursor-pointer ${
                  localFeedback === 'dislike' ? 'text-[var(--google-red)]' : 'text-[var(--md-sys-color-on-surface-variant)]'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${localFeedback === 'dislike' ? 'FILL' : ''}`} style={{ fontVariationSettings: localFeedback === 'dislike' ? "'FILL' 1" : "" }}>
                  thumb_down
                </span>
              </button>
              <button
                onClick={() => handleCopy(mainContent)}
                className="p-2 rounded-full hover:bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface-variant)] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {copiedText === mainContent ? 'check' : 'content_copy'}
                </span>
              </button>
            </div>

            <p className="text-[11px] text-[var(--md-sys-color-on-surface-variant)] opacity-70 leading-tight">
              Gemma is an AI and may make mistakes. Verify its responses.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ChatMessage = memo(ChatMessageComponent);
