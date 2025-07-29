import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInterface from '../components/Chat/ChatInterface';
import FileTreeSidebar from '../components/FileTreeSidebar';
import SettingsPanel from '../components/SettingsPanel';
import { Button } from '@/components/ui/button';
import { Settings, Menu, X } from 'lucide-react';
import { RepositoryInfo, ChatSettings } from '../types';
import { getRepositoryInfo } from '../services/api';
import { useChat } from '../hooks/useChat';

const Chat: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [repoInfo, setRepoInfo] = useState<RepositoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { messages, sendMessage, clearChat, isWaiting } = useChat();
  
  const [settings, setSettings] = useState<ChatSettings>({
    filesToIndex: 100,
    showMetadata: true
  });
  
  useEffect(() => {
    const repoUrl = sessionStorage.getItem('currentRepo');
    
    if (!repoUrl) {
      navigate('/');
      return;
    }
    
    const fetchRepoInfo = async () => {
      try {
        const info = await getRepositoryInfo(repoUrl);
        setRepoInfo(info);
      } catch (err) {
        console.error("Failed to fetch repository info:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRepoInfo();
  }, [navigate]);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleSettingsPanel = () => setIsSettingsPanelOpen(!isSettingsPanelOpen);
  
  const handleSettingsChange = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    setIsSettingsPanelOpen(false);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading repository information...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'w-70' : 'w-0'
        } bg-white border-r border-gray-200 hidden md:block`}
      >
        {isSidebarOpen && (
          <FileTreeSidebar 
            repoInfo={repoInfo!} 
            onClose={toggleSidebar} 
            showMetadata={settings.showMetadata}
          />
        )}
      </div>
      
      {/* Mobile sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50" onClick={toggleSidebar}></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg">
            <FileTreeSidebar 
              repoInfo={repoInfo!} 
              onClose={toggleSidebar} 
              showMetadata={settings.showMetadata}
            />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="fixed w-[80%] bg-white border-b border-gray-200 p-4 flex justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="mr-2"
            >
              <Menu size={20} />
            </Button>
            <h1 className="text-xl font-semibold truncate">
              GitGuide
            </h1>
          </div>
          
          <Button 
            variant="ghost"
            size="icon"
            onClick={toggleSettingsPanel}
          >
            <Settings size={20} />
          </Button>
        </div>
        
        {/* Chat interface */}
        <ChatInterface 
          messages={messages}
          sendMessage={sendMessage}
          isWaiting={isWaiting}
        />
      </div>
      
      {/* Settings panel */}
      {isSettingsPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50" onClick={toggleSettingsPanel}></div>
          <div className="relative w-full max-w-sm bg-white h-full">
            <SettingsPanel 
              settings={settings}
              onSave={handleSettingsChange}
              onClose={toggleSettingsPanel}
              onClearChat={clearChat}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;