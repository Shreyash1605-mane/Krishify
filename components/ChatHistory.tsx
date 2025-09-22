
import React from 'react';
import type { ChatSession, LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../types';

interface ChatHistoryProps {
  sessions: ChatSession[];
  activeSession: ChatSession;
  onSelectSession: (sessionId: string) => void;
  onCreateNew: () => void;
  onLanguageChange: (language: LanguageCode) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ sessions, activeSession, onSelectSession, onCreateNew, onLanguageChange }) => {
  return (
    <aside className="w-full md:w-64 bg-gray-200 p-4 shrink-0 border-r border-gray-300 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Chat History</h2>
      
      <div className="mb-4">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-600 mb-1">
          Language
        </label>
        <select
          id="language-select"
          value={activeSession.language}
          onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
          className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
          aria-label="Select chat language"
        >
          {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-semibold text-gray-700">Sessions</h3>
        <button onClick={onCreateNew} className="text-sm bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600" aria-label="Create new chat session">
          ＋
        </button>
      </div>
      
      <ul className="flex-grow space-y-1 overflow-y-auto">
        {sessions.map(session => (
          <li key={session.id}>
            <button
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left p-2 rounded truncate text-sm ${
                session.id === activeSession.id ? 'bg-blue-500 text-white' : 'hover:bg-gray-300'
              }`}
            >
              {session.title}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ChatHistory;