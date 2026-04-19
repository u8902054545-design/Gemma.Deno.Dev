export type ChatMessageProps = {
  role: 'user' | 'ai';
  content: string;
  isGenerating?: boolean;
};
