import React from 'react';

interface QuickRepliesProps {
  replies: string[];
  onReplyClick: (reply: string) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ replies, onReplyClick }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-3 justify-end">
      {replies.map((reply, index) => (
        <button
          key={index}
          onClick={() => onReplyClick(reply)}
          className="px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
