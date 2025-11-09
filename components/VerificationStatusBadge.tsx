import React from 'react';

interface VerificationStatusBadgeProps {
  isVerified: boolean;
}

const VerificationStatusBadge: React.FC<VerificationStatusBadgeProps> = ({ isVerified }) => {
  const text = isVerified ? 'موثق' : 'غير موثق';
  const icon = isVerified ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 18.5a11.954 11.954 0 007.834-13.501-1.25 1.25 0 00-1.25-1.25H3.416a1.25 1.25 0 00-1.25 1.25zM10 16.5a9.954 9.954 0 01-7.834-13.501-1.25 1.25 0 011.25-1.25h13.168a1.25 1.25 0 011.25 1.25A9.954 9.954 0 0110 16.5zm-2-8.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM10 7a.75.75 0 00-1.5 0v2a.75.75 0 001.5 0V7zm3-1.5a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0v-6.5z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 ml-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="flex items-center">
      {icon}
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
};

export default VerificationStatusBadge;