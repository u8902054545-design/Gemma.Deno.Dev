import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type CodeBlockProps = {
  language: string;
  value: string;
  isCopied: boolean;
  onCopy: (code: string) => void;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, value, isCopied, onCopy }) => {
  return (
    <div className="code-container my-6">
      <div className="code-header">
        <span className="code-lang">{language}</span>
        <button onClick={() => onCopy(value)} className="copy-button">
          <span className="material-symbols-outlined text-[18px]">
            {isCopied ? 'done' : 'content_copy'}
          </span>
          <span>{isCopied ? 'Скопировано' : 'Копировать'}</span>
        </button>
      </div>
      <div className="code-gradient-border">
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0 0 12px 12px',
            background: '#0b0b0b',
            padding: '16px',
            fontSize: '14px'
          }}
        >
          {value}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
