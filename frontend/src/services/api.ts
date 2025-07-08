// src/services/api.ts
/**
 * API service for communicating with the backend
 */

import { RepositoryInfo, Message, FileNode } from '../types';

const API_BASE_URL = 'http://localhost:8000';

/**
 * Submit a GitHub repository URL for analysis
 */
export const analyzeRepository = async (repoUrl: string): Promise<RepositoryInfo> => {
  try {
    const response = await fetch(`${API_BASE_URL}/upload-repo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ repo_url: repoUrl })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to analyze repository');
    }

    const data = await response.json();
    console.log(`Repository analysis completed: ${repoUrl}`);

    const urlParts = new URL(repoUrl).pathname.split('/').filter(Boolean);
    const owner = urlParts[0];
    const repoName = urlParts[1];

    // Recursive function to transform tree structure
    const transformFileTree = (node: Record<string, unknown>, currentPath = ''): FileNode[] => {
      if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return [];

      return node.children.map((child: Record<string, unknown>) => {
        const childPath = `${currentPath}${child.name}`;
        return {
          name: child.name,
          path: childPath, // relative path for internal tracking
          type: child.type === 'folder' ? 'directory' : 'file',
          children: child.type === 'folder' ? transformFileTree(child, `${childPath}/`) : undefined
        };
      });
    };

    const repoInfo: RepositoryInfo = {
      name: repoName,
      owner: owner,
      url: repoUrl,
      description: `Successfully processed ${data.message}`,
      primaryLanguage: 'Unknown',
      fileTree: transformFileTree(data.file_tree),
      lastUpdated: new Date()
    };

    sessionStorage.setItem('repoInfo', JSON.stringify(repoInfo));
    return repoInfo;
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to analyze repository');
  }
};

/**
 * Retrieve repo metadata (from session)
 */
export const getRepositoryInfo = async (repoUrl: string): Promise<RepositoryInfo> => {
  try {
    const storedRepoInfo = sessionStorage.getItem('repoInfo');
    if (storedRepoInfo) {
      const parsedInfo = JSON.parse(storedRepoInfo);
      return {
        ...parsedInfo,
        lastUpdated: parsedInfo.lastUpdated ? new Date(parsedInfo.lastUpdated) : new Date()
      };
    }
    return analyzeRepository(repoUrl);
  } catch (error) {
    console.error('Error fetching repository info:', error);
    throw new Error('Failed to fetch repository information');
  }
};

/**
 * Fetch file content (with corrected path)
 */
export const viewFile = async (filePath: string): Promise<string> => {
  try {
    const fullPath = `./temp/cloned_repo/${filePath}`;
    const response = await fetch(`${API_BASE_URL}/view-file?file_path=${encodeURIComponent(fullPath)}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch file content');
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching file content:', error);
    throw new Error('Failed to fetch file content');
  }
};

/**
 * Ask AI a question about the repository
 */
export const sendChatMessage = async (repoUrl: string, message: string): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({query: message })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get response from AI assistant');
    }

    const data = await response.json();
    return data.answer;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw new Error('Failed to get response from AI assistant');
  }
};

/**
 * Alias for file viewing
 */
export const getFileContent = viewFile;
