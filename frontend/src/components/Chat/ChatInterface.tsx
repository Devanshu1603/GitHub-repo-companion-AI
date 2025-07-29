import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import { Message } from '../../types';

interface ChatInterfaceProps {
  messages: Message[];
  sendMessage: (content: string) => void;
  isWaiting: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  messages,
  sendMessage,
  isWaiting 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 mt-20">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
              <p className="max-w-md">
                Ask questions about the repository's code, structure, functionality, or anything else you'd like to know.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <InputBox onSend={sendMessage} disabled={isWaiting} />
      </div>
    </div>
  );
};

export default ChatInterface;