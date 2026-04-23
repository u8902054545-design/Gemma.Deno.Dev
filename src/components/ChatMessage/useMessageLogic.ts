import { useState, useMemo, useCallback } from 'react';

export const useMessageLogic = (content: string) => {
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const { thought, mainContent } = useMemo(() => {
    const thoughtMatch = content.match(/^\*([\s\S]*?)\*/);
    if (thoughtMatch) {
      const extractedThought = thoughtMatch[1].trim();
      const extractedContent = content.slice(thoughtMatch[0].length).trim();
      return {
        thought: extractedThought,
        mainContent: extractedContent
      };
    }
    return { thought: null, mainContent: content.trim() };
  }, [content]);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedText(code);
    setTimeout(() => setCopiedText(null), 2000);
  }, []);

  return {
    isThoughtExpanded,
    setIsThoughtExpanded,
    copiedText,
    handleCopy,
    thought,
    mainContent
  };
};
