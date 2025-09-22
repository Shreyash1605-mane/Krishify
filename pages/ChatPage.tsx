
import React, { useState } from 'react';
import ChatWindow from '../components/ChatWindow';
import ChatHistory from '../components/ChatHistory';
import { useChatManager } from '../hooks/useChatManager';
import type { ChatSession, LanguageCode } from '../types';

const ChatPage: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'session1', title: 'General Inquiry', messages: [], language: 'en' }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session1');
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  const activeSession = sessions.find(s => s.id === activeSessionId)!;
  
  const setActiveSession = (updatedSession: ChatSession) => {
    setSessions(prev => 
      prev.map(s => (s.id === activeSessionId ? updatedSession : s))
    );
  };
  
  const { isLoading, postMessage } = useChatManager(activeSession, setActiveSession);

  const createNewSession = () => {
    const newSessionId = `session${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      language: 'en', // Default language for new chats
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSessionId);
  }

  const handleLanguageChange = (lang: LanguageCode) => {
    setSessions(prevSessions =>
      prevSessions.map(s =>
        s.id === activeSessionId ? { ...s, language: lang } : s
      )
    );
  };

  return (
    <div className="flex flex-col md:flex-row w-full h-full bg-gray-100">
      <div className="md:hidden p-2 bg-gray-200 border-b">
        <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="text-sm font-medium text-gray-700">
          {isHistoryVisible ? 'Hide' : 'Show'} Chat History
        </button>
      </div>

      {/* Mobile History */}
      {isHistoryVisible && (
         <div className="md:hidden">
            <ChatHistory 
                sessions={sessions} 
                activeSession={activeSession}
                onSelectSession={(id) => { setActiveSessionId(id); setIsHistoryVisible(false); }}
                onCreateNew={() => { createNewSession(); setIsHistoryVisible(false); }}
                onLanguageChange={handleLanguageChange}
            />
         </div>
      )}

      {/* Desktop History */}
      <div className="hidden md:flex">
        <ChatHistory 
          sessions={sessions} 
          activeSession={activeSession}
          onSelectSession={setActiveSessionId}
          onCreateNew={createNewSession}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <ChatWindow 
        session={activeSession} 
        isLoading={isLoading}
        onSendMessage={postMessage}
      />
    </div>
  );
};

export default ChatPage;