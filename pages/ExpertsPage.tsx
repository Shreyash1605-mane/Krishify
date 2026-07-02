import React, { useEffect, useRef, useState } from 'react';
import { EXPERTS } from '../constants';
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import type { Expert, ExpertInteractionLog, User } from '../types';
import ExpertCard from '../components/ExpertCard';
import BookingModal from '../components/BookingModal';

type ExpertThreadMessage = {
  id: string;
  sender: 'user' | 'expert';
  text: string;
  timestamp: number;
};

interface ExpertsPageProps {
  currentUser: User;
}

const ExpertsPage: React.FC<ExpertsPageProps> = ({ currentUser }) => {
    const [bookingExpert, setBookingExpert] = useState<Expert | null>(null);
    const [activeMessageExpert, setActiveMessageExpert] = useState<Expert | null>(null);
    const [messageDraft, setMessageDraft] = useState('');
    const [activeMessages, setActiveMessages] = useState<ExpertThreadMessage[]>([]);
    const [messageError, setMessageError] = useState<string | null>(null);
    const [messageSending, setMessageSending] = useState(false);
    const messageSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (activeMessageExpert) {
        messageSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, [activeMessageExpert]);

    useEffect(() => {
      if (!currentUser || !activeMessageExpert) {
        setActiveMessages([]);
        return;
      }

      const interactionsQuery = query(
        collection(db, 'expertInteractions'),
        where('userId', '==', currentUser.uid),
        where('expertId', '==', activeMessageExpert.id),
        where('interactionType', '==', 'message')
      );

      const unsubscribe = onSnapshot(
        interactionsQuery,
        (snapshot) => {
          const messages = snapshot.docs
            .map((docSnapshot) => {
              const data = docSnapshot.data() as ExpertInteractionLog;
              return {
                id: docSnapshot.id,
                sender: data.sender,
                text: data.message ?? data.details,
                timestamp: Date.parse(data.createdAt),
              };
            })
            .sort((left, right) => left.timestamp - right.timestamp);

          setActiveMessages(messages);
          setMessageError(null);
        },
        (error) => {
          console.error('Firestore expert message error:', { code: error.code, message: error.message });
          setMessageError('Could not load the expert message thread. Please check your Firebase setup.');
        }
      );

      return () => unsubscribe();
    }, [activeMessageExpert, currentUser]);

    const handleSelectChat = () => {
      if (!bookingExpert) return;
      setActiveMessageExpert(bookingExpert);
      setBookingExpert(null);
    };

    const handleSelectCall = async (callType: 'video' | 'voice') => {
      if (!bookingExpert) return;

      try {
        await addDoc(collection(db, 'expertInteractions'), {
          userId: currentUser.uid,
          userName: currentUser.name,
          expertId: bookingExpert.id,
          expertName: bookingExpert.name,
          sender: 'user',
          interactionType: 'call',
          callType,
          details: `User requested a ${callType} call with ${bookingExpert.name}`,
          status: 'queued',
          createdAt: new Date().toISOString(),
        });

        alert(`Initiating ${callType} call with ${bookingExpert.name}. The request has been saved.`);
        setBookingExpert(null);
      } catch (error) {
        console.error('Error saving expert call log:', error);
        alert('Could not save the call request right now. Please try again.');
      }
    };

    const handleSendMessage = async () => {
      if (!activeMessageExpert || !messageDraft.trim()) return;

      const messageText = messageDraft.trim();
      setMessageSending(true);

      try {
        const now = new Date().toISOString();
        await addDoc(collection(db, 'expertInteractions'), {
          userId: currentUser.uid,
          userName: currentUser.name,
          expertId: activeMessageExpert.id,
          expertName: activeMessageExpert.name,
          sender: 'user',
          interactionType: 'message',
          message: messageText,
          details: `Message sent to ${activeMessageExpert.name}`,
          status: 'sent',
          createdAt: now,
        });

        await addDoc(collection(db, 'expertInteractions'), {
          userId: currentUser.uid,
          userName: activeMessageExpert.name,
          expertId: activeMessageExpert.id,
          expertName: activeMessageExpert.name,
          sender: 'expert',
          interactionType: 'message',
          message: `Thanks for reaching out. ${activeMessageExpert.name} will review your message and respond here soon.`,
          details: `Auto-reply generated for message thread with ${activeMessageExpert.name}`,
          status: 'sent',
          createdAt: new Date(Date.parse(now) + 1).toISOString(),
        });

        setMessageDraft('');
        setMessageError(null);
      } catch (error) {
        console.error('Error saving expert message log:', error);
        setMessageError('Could not save the message right now. Please try again.');
      } finally {
        setMessageSending(false);
      }
    };

    return (
        <>
            <main className="flex-grow p-4 md:p-6 overflow-y-auto bg-gray-50 w-full">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Connect with an Expert</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {EXPERTS.map(expert => (
                            <ExpertCard 
                                key={expert.id}
                                expert={expert}
                                onBook={() => setBookingExpert(expert)}
                            />
                        ))}
                    </div>

                    {activeMessageExpert && (
                      <div ref={messageSectionRef} className="mt-10 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-green-50">
                          <h2 className="text-2xl font-bold text-gray-800">Message {activeMessageExpert.name} directly</h2>
                          <p className="text-sm text-gray-600 mt-1">This opens a dedicated expert message thread on this page, not the AI advisor chat.</p>
                        </div>

                        {messageError && (
                          <div className="mx-6 mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {messageError}
                          </div>
                        )}

                        <div className="p-6 space-y-4 max-h-[360px] overflow-y-auto bg-gray-50">
                          {activeMessages.length > 0 ? (
                            activeMessages.map(message => (
                              <div
                                key={message.id}
                                className={`max-w-2xl rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'ml-auto bg-green-600 text-white' : 'mr-auto bg-white border border-gray-200 text-gray-800'}`}
                              >
                                <p className="text-sm font-semibold mb-1">{message.sender === 'user' ? 'You' : activeMessageExpert.name}</p>
                                <p className="text-sm leading-6">{message.text}</p>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500">Start the conversation by sending a direct message to the expert.</div>
                          )}
                        </div>

                        <div className="p-6 border-t border-gray-200 bg-white">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Write a message to the expert</label>
                          <textarea
                            value={messageDraft}
                            onChange={(e) => setMessageDraft(e.target.value)}
                            rows={4}
                            disabled={messageSending}
                            className="w-full rounded-xl border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                            placeholder="Ask about crops, pricing, pest control, machinery, or anything else..."
                          />
                          <div className="mt-4 flex flex-col sm:flex-row gap-3">
                            <button
                              onClick={handleSendMessage}
                              disabled={messageSending}
                              className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                            >
                              {messageSending ? 'Sending...' : 'Send to Expert'}
                            </button>
                            <button
                              onClick={() => setActiveMessageExpert(null)}
                              disabled={messageSending}
                              className="px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition"
                            >
                              Close Message Section
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
            </main>
            {bookingExpert && (
              <BookingModal 
                expert={bookingExpert} 
                onClose={() => setBookingExpert(null)}
                onSelectChat={handleSelectChat}
                onSelectCall={handleSelectCall}
              />
            )}
        </>
    );
};

export default ExpertsPage;