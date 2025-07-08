export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: FileNode[];
}

export interface RepositoryInfo {
  name: string;
  owner: string;
  url: string;
  description?: string;
  primaryLanguage?: string;
  fileTree: FileNode[];
  starCount?: number;
  forkCount?: number;
  lastUpdated?: Date;
}

export interface ChatSettings {
  filesToIndex: number;
  showMetadata: boolean;
}

export interface ChatSession {
  id: string;
  repositoryUrl: string;
  repositoryName: string;
  lastUpdated: Date;
  messages: Message[];
}