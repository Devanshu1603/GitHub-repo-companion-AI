import React, { useState, KeyboardEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizontal } from 'lucide-react';

interface InputBoxProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

const InputBox: React.FC<InputBoxProps> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative">
      <Textarea
        placeholder="Ask about the repository..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pr-12 resize-none overflow-hidden"
        rows={2}
        disabled={disabled}
      />
      <Button
        size="icon"
        className="absolute right-2 bottom-2 h-8 w-8"
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      >
        <SendHorizontal size={18} />
      </Button>
    </div>
  );
};

export default InputBox;