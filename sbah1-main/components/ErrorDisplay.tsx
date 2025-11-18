import React from 'react';

interface ErrorDisplayProps {
  message: React.ReactNode;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
      <div className="flex">
        <div className="py-1">
          <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 11-2 0V9zm2-2a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
        </div>
        <div>
          <p className="font-bold">حدث خطأ</p>
          <div className="text-sm">{message}</div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 bg-red-500 text-white font-bold py-1 px-3 rounded text-xs hover:bg-red-700"
            >
              إعادة المحاولة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;