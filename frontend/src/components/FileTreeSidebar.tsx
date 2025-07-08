import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { File, Folder, X, ChevronRight, ChevronDown, Info, PlusCircle, History, ExternalLink } from 'lucide-react';
import { RepositoryInfo, FileNode, ChatSession } from '../types';
import FilePreviewer from './FilePreviewer';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useChat } from '../hooks/useChat';

interface FileTreeSidebarProps {
  repoInfo: RepositoryInfo;
  onClose: () => void;
  showMetadata: boolean;
}

interface FileTreeProps {
  files: FileNode[];
  level?: number;
  onFileSelect: (path: string, name: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({ files, level = 0, onFileSelect }) => {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  const toggleFolder = (path: string) => {
    setExpanded((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleClick = (file: FileNode) => {
    if (file.type === 'directory') {
      toggleFolder(file.path);
    } else {
      onFileSelect(file.path, file.name);
    }
  };

  return (
    <div className="mt-1 ml-2">
      {files.map((file) => (
        <div key={file.path} className="my-1">
          <div
            className={`flex items-center text-sm rounded hover:bg-gray-100 py-1 px-2 cursor-pointer ${
              level === 0 ? 'font-medium' : ''
            }`}
            onClick={() => handleClick(file)}
          >
            {file.type === 'directory' ? (
              <>
                {expanded[file.path] ? (
                  <ChevronDown size={16} className="shrink-0 mr-1 text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="shrink-0 mr-1 text-gray-500" />
                )}
                <Folder
                  size={16}
                  className="shrink-0 mr-2 text-blue-500"
                />
              </>
            ) : (
              <>
                <div className="w-4 mr-1"></div>
                <File
                  size={16}
                  className="shrink-0 mr-2 text-gray-500"
                />
              </>
            )}
            <span className="truncate">{file.name}</span>
          </div>
          {file.type === 'directory' && expanded[file.path] && file.children && (
            <FileTree 
              files={file.children} 
              level={level + 1} 
              onFileSelect={onFileSelect} 
            />
          )}
        </div>
      ))}
    </div>
  );
};

const FileTreeSidebar: React.FC<FileTreeSidebarProps> = ({ 
  repoInfo, 
  onClose,
  showMetadata
}) => {
  const [selectedFile, setSelectedFile] = useState<{ path: string; name: string } | null>(null);
  const [activeView, setActiveView] = useState<'files' | 'history'>('files');
  const navigate = useNavigate();
  const { chatSessions, switchChatSession } = useChat();
  
  const handleFileSelect = (path: string, name: string) => {
    setSelectedFile({ path, name });
  };

  const closeFilePreviewer = () => {
    setSelectedFile(null);
  };
  
  const handleNewChat = () => {
    // Navigate to home page to start a new chat
    navigate('/');
  };
  
  const handleSwitchRepo = (repoUrl: string) => {
    // Switch to the selected repository chat session
    switchChatSession(repoUrl);
    // Close the sidebar on mobile
    onClose();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium truncate">{repoInfo.name}</h3>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
          <X size={18} />
        </Button>
      </div>
      
      {/* Action buttons */}
      <div className="p-2 border-b border-gray-200 flex space-x-1">
        <Button 
          variant={activeView === 'files' ? 'default' : 'outline'} 
          size="sm" 
          className="flex-1 text-xs" 
          onClick={() => setActiveView('files')}
        >
          <Folder size={14} className="mr-1" /> Files
        </Button>
        <Button 
          variant={activeView === 'history' ? 'default' : 'outline'} 
          size="sm" 
          className="flex-1 text-xs" 
          onClick={() => setActiveView('history')}
        >
          <History size={14} className="mr-1" /> History
        </Button>
      </div>
      
      {/* New chat button */}
      <div className="p-2 border-b border-gray-200">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs justify-start" 
          onClick={handleNewChat}
        >
          <PlusCircle size={14} className="mr-2" /> New Chat
        </Button>
      </div>
      
      {selectedFile ? (
        <FilePreviewer 
          filePath={selectedFile.path}
          fileName={selectedFile.name}
          onClose={closeFilePreviewer}
        />
      ) : (
        <ScrollArea className="flex-1">
          {activeView === 'files' ? (
            <div className="p-4">
              {showMetadata && (
                <div className="mb-6 space-y-2 text-sm">
                  <div className="flex items-start space-x-2">
                    <Info size={16} className="shrink-0 mt-1 text-gray-500" />
                    <div>
                      <h4 className="font-medium">Repository Info</h4>
                      <p className="text-gray-500 text-xs mt-1">
                        Owner: <span className="font-medium">{repoInfo.owner}</span>
                      </p>
                      {repoInfo.description && (
                        <p className="text-gray-500 text-xs mt-1">
                          {repoInfo.description}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        Language: <span className="font-medium">{repoInfo.primaryLanguage || 'Unknown'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-sm mb-2">File Structure</h4>
                {repoInfo.fileTree.length > 0 ? (
                  <FileTree 
                    files={repoInfo.fileTree}
                    onFileSelect={handleFileSelect}
                  />
                ) : (
                  <p className="text-gray-500 text-sm">No files available</p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <h4 className="font-medium text-sm mb-3">Chat History</h4>
              
              {chatSessions.length > 0 ? (
                <div className="space-y-3">
                  {chatSessions
                    .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
                    .map(session => (
                      <div 
                        key={session.id}
                        className="bg-gray-50 hover:bg-gray-100 p-3 rounded-md cursor-pointer transition-colors"
                        onClick={() => handleSwitchRepo(session.repositoryUrl)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm truncate">{session.repositoryName}</div>
                          {session.repositoryUrl === sessionStorage.getItem('currentRepo') && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Current</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <ExternalLink size={12} className="mr-1" />  
                          <span className="truncate">{session.repositoryUrl}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Last active: {formatDistanceToNow(session.lastUpdated, { addSuffix: true })}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No chat history found</p>
              )}
            </div>
          )}
        </ScrollArea>
      )}
    </div>
  );
};

export default FileTreeSidebar;