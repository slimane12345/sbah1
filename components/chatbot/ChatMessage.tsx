import React from 'react';
import type { ChatMessage } from '../../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageBubble: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  const bubbleClasses = isBot
    ? 'bg-gray-200 text-gray-800 self-start'
    : 'bg-blue-600 text-white self-end';

  const containerClasses = isBot ? 'flex justify-start' : 'flex justify-end';

  return (
    <div className={containerClasses}>
      <div className={`max-w-md lg:max-w-lg p-3 rounded-2xl ${bubbleClasses}`}>
        <p className="text-sm">{message.text}</p>
        <p className={`text-xs mt-1 ${isBot ? 'text-gray-500' : 'text-blue-200'} text-left`}>
          {message.timestamp}
        </p>
      </div>
    </div>
  );
};

export default ChatMessageBubble;
