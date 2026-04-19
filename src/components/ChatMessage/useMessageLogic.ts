import { useState, useMemo } from 'react';

export const useMessageLogic = (content: string) => {
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

  return {
    isThoughtExpanded,
    setIsThoughtExpanded,
    copiedText,
    handleCopy,
    thought,
    mainContent
  };
};
