import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X, FileText, Download } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { getFileContent } from '../services/api';
import { Skeleton } from './ui/skeleton';

interface FilePreviewerProps {
  filePath: string;
  fileName: string;
  onClose: () => void;
}

const FilePreviewer: React.FC<FilePreviewerProps> = ({
  filePath,
  fileName,
  onClose,
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fileContent = await getFileContent(filePath);
        setContent(fileContent);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load file content');
        console.error('Error fetching file content:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [filePath]);

  const getLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    const extensionMap: Record<string, string> = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      rb: 'ruby',
      java: 'java',
      go: 'go',
      php: 'php',
      cs: 'csharp',
      cpp: 'cpp',
      c: 'c',
      h: 'c',
      hpp: 'cpp',
      rs: 'rust',
      swift: 'swift',
      kt: 'kotlin',
      sh: 'bash',
      md: 'markdown',
      json: 'json',
      yaml: 'yaml',
      yml: 'yaml',
      toml: 'toml',
      css: 'css',
      scss: 'scss',
      less: 'less',
      html: 'html',
      xml: 'xml',
      sql: 'sql',
      graphql: 'graphql',
      dart: 'dart',
    };

    return extensionMap[extension] || 'text';
  };

  // Check if the file is likely a binary file (images, executables, etc.)
  const isBinaryFile = (fileName: string): boolean => {
    const binaryExtensions = [
      'png', 'jpg', 'jpeg', 'gif', 'bmp', 'ico', 'webp', 'svg',
      'exe', 'dll', 'so', 'dylib',
      'zip', 'tar', 'gz', 'rar', '7z',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
      'mp3', 'mp4', 'wav', 'avi', 'mov',
      'bin', 'dat', 'o', 'class'
    ];
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    return binaryExtensions.includes(extension);
  };

  return (
    <Card className="flex flex-col h-full border-0 rounded-none shadow-none">
      <CardHeader className="py-2 px-4 border-b flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText size={16} />
          <CardTitle className="text-sm font-medium truncate max-w-[200px]">
            {fileName}
          </CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={16} />
        </Button>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
            <Skeleton className="h-4 w-[90%]" />
          </div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : isBinaryFile(fileName) ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText size={48} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">
              Binary file content cannot be displayed in the browser
            </p>
            {/* In a real app, you might add a download button here */}
          </div>
        ) : (
          <ScrollArea className="h-full max-h-[calc(100vh-150px)]">
            <SyntaxHighlighter
              language={getLanguage(fileName)}
              style={vscDarkPlus}
              customStyle={{ margin: 0, borderRadius: 0 }}
              showLineNumbers={true}
            >
              {content}
            </SyntaxHighlighter>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default FilePreviewer;