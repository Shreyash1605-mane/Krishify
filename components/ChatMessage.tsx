import React from 'react';
import type { ChatMessage as Message } from '../types';
import ThumbsUpIcon from './icons/ThumbsUpIcon';
import ThumbsDownIcon from './icons/ThumbsDownIcon';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`p-3 rounded-lg max-w-lg shadow-sm ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
      {!isUser && (
        <div className="flex items-center ml-2 mt-1 space-x-1 text-gray-400">
          <button className="p-1 rounded-full hover:bg-gray-200 hover:text-gray-600"><ThumbsUpIcon /></button>
          <button className="p-1 rounded-full hover:bg-gray-200 hover:text-gray-600"><ThumbsDownIcon /></button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
