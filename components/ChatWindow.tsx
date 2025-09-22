import React, { useRef, useEffect } from 'react';
import type { ChatSession } from '../types';
import ChatMessage from './ChatMessage';
import QueryInput from './QueryInput';
import Spinner from './Spinner';

interface ChatWindowProps {
  session: ChatSession;
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ session, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  return (
    <main className="flex-grow flex flex-col h-full bg-white">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {session.messages.map(msg => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && (
            <div className="flex items-start my-4 justify-start">
               <div className="p-3 rounded-lg bg-gray-200 text-gray-800">
                <Spinner />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          <QueryInput onSend={onSendMessage} disabled={isLoading} />
        </div>
      </div>
    </main>
  );
};

export default ChatWindow;
