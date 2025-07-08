import React from 'react';
import { Input } from '@/components/ui/input';

interface RepoInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RepoInput: React.FC<RepoInputProps> = ({ value, onChange, placeholder }) => {
  return (
    <div className="space-y-2">
      <label htmlFor="repo-url" className="text-sm font-medium">
        GitHub Repository URL
      </label>
      <div className="relative">
        <Input
          id="repo-url"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "https://github.com/username/repository"}
          className="pr-10"
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Example: https://github.com/facebook/react
      </p>
    </div>
  );
};

export default RepoInput;