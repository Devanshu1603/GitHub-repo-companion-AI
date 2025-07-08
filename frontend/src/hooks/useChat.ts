// src/hooks/useChat.ts
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatSession } from '../types';
import { sendChatMessage } from '../services/api';

/**
 * Custom hook for managing chat interactions
 */
export const useChat = () => {
  // Get current repository from session storage
  const currentRepoUrl = sessionStorage.getItem('currentRepo') || '';
  
  // State for all chat sessions
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      return parsedSessions.map((session: Record<string, unknown>) => ({
        ...session,
        lastUpdated: new Date(session.lastUpdated),
        messages: session.messages.map((message: Record<string, unknown>) => ({
          ...message,
          timestamp: new Date(message.timestamp)
        }))
      }));
    }
    return [];
  });
  
  // Get current session based on repo URL
  const currentSession = chatSessions.find(session => session.repositoryUrl === currentRepoUrl);
  
  // Messages from current session or empty array
  const [messages, setMessages] = useState<Message[]>(
    currentSession?.messages || []
  );
  
  const [isWaiting, setIsWaiting] = useState(false);
  
  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);
  
  // Update current session messages when repository changes
  useEffect(() => {
    if (currentRepoUrl) {
      const session = chatSessions.find(s => s.repositoryUrl === currentRepoUrl);
      if (session) {
        setMessages(session.messages);
      } else {
        setMessages([]);
      }
    }
  }, [currentRepoUrl, chatSessions]);
  
  // Update chat sessions when messages change
  useEffect(() => {
    if (currentRepoUrl && messages.length > 0) {
      const repoName = sessionStorage.getItem('repoName') || 'Repository';
      setChatSessions(prevSessions => {
        const existingSessionIndex = prevSessions.findIndex(s => s.repositoryUrl === currentRepoUrl);
        
        if (existingSessionIndex >= 0) {
          // Update existing session
          const updatedSessions = [...prevSessions];
          updatedSessions[existingSessionIndex] = {
            ...updatedSessions[existingSessionIndex],
            messages,
            lastUpdated: new Date()
          };
          return updatedSessions;
        } else {
          // Create a new session
          return [
            ...prevSessions,
            {
              id: uuidv4(),
              repositoryUrl: currentRepoUrl,
              repositoryName: repoName,
              messages,
              lastUpdated: new Date()
            }
          ];
        }
      });
    }
  }, [messages, currentRepoUrl]);
  
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    // Add user message to state
    setMessages(prev => [...prev, userMessage]);
    setIsWaiting(true);
    
    try {
      // Get repository URL from sessionStorage
      const repoUrl = sessionStorage.getItem('currentRepo');
      
      if (!repoUrl) {
        throw new Error('No repository URL found');
      }
      
      // Send the message to the API
      const response = await sendChatMessage(repoUrl, content);
      
      // Add assistant's response to state
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsWaiting(false);
    }
  }, []);
  
  const clearChat = useCallback(() => {
    setMessages([]);
    
    // Remove only the current repository's chat session
    if (currentRepoUrl) {
      setChatSessions(prev => prev.filter(session => session.repositoryUrl !== currentRepoUrl));
    }
  }, [currentRepoUrl]);
  
  // Function to switch between chat sessions
  const switchChatSession = useCallback((repositoryUrl: string) => {
    sessionStorage.setItem('currentRepo', repositoryUrl);
    const session = chatSessions.find(s => s.repositoryUrl === repositoryUrl);
    if (session) {
      setMessages(session.messages);
      sessionStorage.setItem('repoName', session.repositoryName);
    }
  }, [chatSessions]);
  
  return {
    messages,
    sendMessage,
    clearChat,
    isWaiting,
    chatSessions,
    switchChatSession
  };
};

// Polyfill for uuidv4
// In a real application, you would install the uuid package
// Here we're providing a simple implementation for the demo
// @ts-expect-error uuid is imported at runtime
if (typeof uuidv4 !== 'function') {
  // @ts-expect-error local implementation
  const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}