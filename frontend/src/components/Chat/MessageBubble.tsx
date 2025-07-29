import React from 'react';
import { formatTimestamp } from '../../utils/formatting';
import { Message } from '../../types';
import { Clipboard, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);
  const isUser = message.role === 'user';

  // Copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format content with code block and rich text (bold + bullets)
  const formatContent = (content: string) => {
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        const textBeforeCode = content.substring(lastIndex, match.index);
        parts.push(...parseTextContent(textBeforeCode));
      }

      const language = match[1] || 'text';
      const code = match[2];

      parts.push(
        <div key={`code-${match.index}`} className="my-2 bg-gray-800 rounded-md overflow-hidden">
          <div className="flex justify-between items-center px-4 py-2 bg-gray-900 text-gray-200">
            <span className="text-xs font-mono">{language}</span>
            <button
              onClick={() => copyToClipboard(code)}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy code"
            >
              {copied ? <CheckCheck size={16} /> : <Clipboard size={16} />}
            </button>
          </div>
          <pre className="p-4 text-gray-100 overflow-x-auto text-sm">
            <code>{code}</code>
          </pre>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const remainingText = content.substring(lastIndex);
      parts.push(...parseTextContent(remainingText));
    }

    return parts.length > 0 ? parts : <p className="whitespace-pre-wrap">{content}</p>;
  };

  // Helper to parse and render bullet points and bold text
  const parseTextContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];

    lines.forEach((line, index) => {
      // Bullet point line
      if (/^\*\s+/.test(line)) {
        const cleanedLine = line.replace(/^\*\s+/, '');
        const formatted = cleanedLine.replace(/\*\*(.+?)\*\*/g, (_, boldText) => `<b>${boldText}</b>`);

        elements.push(
          <div key={`bullet-${index}`} className="flex items-start space-x-2">
            <span className="mt-1">* </span>
            <span
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: formatted }}
            />
          </div>
        );
      } else {
        // Regular paragraph
        const formatted = line.replace(/\*\*(.+?)\*\*/g, (_, boldText) => `<b>${boldText}</b>`);
        elements.push(
          <p key={`line-${index}`} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatted }} />
        );
      }
    });

    return elements;
  };

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div
        className={`max-w-3xl px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        <div className="text-sm font-medium mb-1">
          {isUser ? 'You' : 'AI Assistant'}
            <span className="text-xs ml-2">
            {formatTimestamp(message.timestamp)}
            </span>
        </div>
        <div className={`prose ${isUser ? 'prose-invert' : ''} max-w-none`}>
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
