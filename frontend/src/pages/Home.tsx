import React, { useState } from 'react';
import RepoInput from '../components/RepoInput';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import { isValidGitHubUrl } from '../utils/validation';
import { analyzeRepository } from '../services/api';

const Home: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string>('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!isValidGitHubUrl(repoUrl)) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress('Cloning repository...');

    try {
      // Simulate progress updates
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev === 'Cloning repository...') return 'Processing files...';
          if (prev === 'Processing files...') return 'Embedding complete...';
          return prev;
        });
      }, 2000);

      // Call API to analyze the repository and get repository info
      const repoInfo = await analyzeRepository(repoUrl);
      
      clearInterval(progressTimer);
      setIsLoading(false);
      
      // Extract repo name from URL for display
      const repoName = repoUrl.split('/').pop() || 'Repository';
      
      // Store repo URL and name in session storage for the chat page
      sessionStorage.setItem('currentRepo', repoUrl);
      sessionStorage.setItem('repoName', repoName);
      
      // Navigate to chat page
      navigate('/chat');
    } catch (err) {
      setIsLoading(false);
      setError('Failed to analyze repository. Please try again.');
      console.error('Repository analysis failed:', err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            GitHub Repo Companion
          </h1>
          <p className="text-gray-500">
            Chat with your GitHub repository and get instant insights
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md space-y-4">
          <RepoInput 
            value={repoUrl}
            onChange={(value) => {
              setRepoUrl(value);
              setError(null);
            }}
            placeholder="Paste GitHub repository URL"
          />

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !repoUrl} 
            className="w-full"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Repository'}
          </Button>

          {isLoading && (
            <div className="mt-6 flex flex-col items-center space-y-4">
              <LoadingSpinner />
              <p className="text-sm text-gray-500">{progress}</p>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Enter any public GitHub repository URL to start chatting with the AI about it.
        </p>
      </div>
    </div>
  );
};

export default Home;