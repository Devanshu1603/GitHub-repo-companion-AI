import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="text-center space-y-6">
        <div className="text-7xl font-bold text-gray-300">404</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Page Not Found
        </h1>
        <p className="text-gray-500 max-w-md">
          The page you're looking for doesn't seem to exist. You might have
          mistyped the address or the page may have been moved.
        </p>
        <div className="pt-4">
          <Button asChild>
            <Link to="/" className="flex items-center">
              <HomeIcon size={18} className="mr-2" /> Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;