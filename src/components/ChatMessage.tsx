import React, { useState, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GemmaIcon } from './GemmaIcon';
import { mdEasing, mdDuration } from '../motion/transitions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type ChatMessageProps = {
  role: 'user' | 'ai';
  content: string;
  isGenerating?: boolean;
};

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ role, content, isGenerating }) => {
  const isAI = role === 'ai';
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { thought, mainContent } = useMemo(() => {
    const thoughtMatch = content.match(/^\*([\s\S]*?)\*/);
    if (thoughtMatch) {
      return { 
        thought: thoughtMatch[1].trim(), 
        mainContent: content.replace(thoughtMatch[0], '').trim() 
      };
    }
    return { thought: null, mainContent: content.trim() };
  }, [content]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: mdDuration.short4, ease: mdEasing.decelerate }}
      className={`flex flex-col gap-2 mb-8 ${isAI ? 'items-start' : 'items-end'}`}
    >
      <div className={`flex items-center gap-3 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="relative flex items-center justify-center w-12 h-12">
          {isAI && isGenerating && <div className="google-spinner" />}
          <div className={`z-10 flex items-center justify-center ${!isAI ? 'bg-[var(--google-blue)] w-9 h-9 rounded-full' : ''}`}>
            {isAI ? (
              <GemmaIcon className="w-9 h-9" />
            ) : (
              <span className="material-symbols-outlined text-white text-[20px]">person</span>
            )}
          </div>
        </div>

        {isAI && thought && (
          <button
            onClick={() => setIsThoughtExpanded(!isThoughtExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--md-sys-color-surface-container-high)] hover:bg-[#333] border border-[var(--md-sys-color-outline)]/30 transition-colors text-xs text-[var(--md-sys-color-on-surface-variant)]"
          >
            <span>Показать мысль</span>
            <span className="material-symbols-outlined text-[14px]">
              {isThoughtExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        )}
      </div>

      <div className="w-full flex flex-col gap-2">
        <AnimatePresence>
          {isAI && thought && isThoughtExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: mdDuration.medium1, ease: mdEasing.standard }}
            >
              <div className="text-sm text-[var(--md-sys-color-on-surface-variant)] italic border-l-2 border-[var(--md-sys-color-outline)] pl-4 py-1 my-2">
                {thought}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          className={`max-w-[100%] text-[16px] leading-relaxed markdown-content ${
            isAI
              ? 'text-[var(--md-sys-color-on-background)] px-1'
              : 'bg-[var(--google-blue)] text-white px-4 py-2 rounded-2xl self-end shadow-lg shadow-blue-900/10'
          }`}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || '');
                const codeString = String(children).replace(/\n$/, '');
                return !inline && match ? (
                  <div className="code-container my-6">
                    <div className="code-header">
                      <span className="code-lang">{match[1]}</span>
                      <button 
                        onClick={() => handleCopy(codeString)}
                        className="copy-button"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copiedText === codeString ? 'done' : 'content_copy'}
                        </span>
                        <span>{copiedText === codeString ? 'Скопировано' : 'Копировать'}</span>
                      </button>
                    </div>
                    <div className="code-gradient-border">
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0 0 12px 12px',
                          background: '#0b0b0b',
                          padding: '16px',
                          fontSize: '14px'
                        }}
                        {...props}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                ) : (
                  <code className="bg-[var(--md-sys-color-surface-container-high)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--google-blue)]" {...props}>
                    {children}
                  </code>
                );
              },
              a: ({ children, href }) => (
                <a href={href} className="text-[var(--google-blue)] underline underline-offset-4" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            }}
          >
            {mainContent}
          </ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};

export const ChatMessage = memo(ChatMessageComponent);
