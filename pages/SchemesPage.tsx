
import React, { useState, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import { useChatManager } from '../hooks/useChatManager';
import type { ChatSession } from '../types';
import { startChat } from '../services/geminiService';
import { SCHEMES, LOANS } from '../constants';
import SchemeCard from '../components/SchemeCard';
import LoanCard from '../components/LoanCard';

const SCHEMES_SYSTEM_INSTRUCTION = `You are an expert financial advisor for farmers. Your primary role is to provide information on government schemes, bank loans, interest rates, and application processes. Be clear, concise, and helpful. Always provide links to official application forms when available. All responses must be in English.`;

const SchemesPage: React.FC = () => {
  const [session, setSession] = useState<ChatSession>({
    id: 'schemes-session',
    title: 'Financial & Scheme Advisor',
    messages: [
      {
        id: 'init1',
        sender: 'bot',
        text: "Hello! I can help you find information about government schemes, bank loans, and more. How can I assist you today?",
        timestamp: Date.now()
      }
    ],
    language: 'en'
  });

  useEffect(() => {
    startChat('en', SCHEMES_SYSTEM_INSTRUCTION);
  }, []);
  
  const { isLoading, postMessage } = useChatManager(session, setSession);

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      <div className="p-4 md:p-6 bg-white border-b">
         <h1 className="text-2xl font-bold text-gray-800">Popular Government Schemes</h1>
         <p className="text-sm text-gray-500 mt-1">Here are some popular schemes. Ask the AI advisor below for more details.</p>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {SCHEMES.map(scheme => (
                <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
         </div>
     <h2 className="text-xl font-semibold text-gray-800 mt-8">Available Loan Products</h2>
     <p className="text-sm text-gray-500 mt-1">Loans that may help with working capital and seasonal needs.</p>
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {LOANS.map(loan => (
        <LoanCard key={loan.id} loan={loan} />
      ))}
     </div>
      </div>
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <ChatWindow 
            session={session} 
            isLoading={isLoading}
            onSendMessage={postMessage}
          />
      </div>
    </div>
  );
};

export default SchemesPage;
