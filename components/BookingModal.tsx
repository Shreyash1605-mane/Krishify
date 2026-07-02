import React, { useState } from 'react';
import type { Expert } from '../types';

type BookingStep = 'method' | 'callType' | 'success';

interface BookingModalProps {
  expert: Expert;
  onClose: () => void;
  onSelectChat: () => void;
  onSelectCall: (callType: 'video' | 'voice') => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ expert, onClose, onSelectChat, onSelectCall }) => {
  const [step, setStep] = useState<BookingStep>('method');

  const handleCallClick = () => {
    setStep('callType');
  };

  const handleChatClick = () => {
    onSelectChat();
    setStep('success');
  };

  const handleVideoCall = () => {
    onSelectCall('video');
    setStep('success');
  };

  const handleVoiceCall = () => {
    onSelectCall('voice');
    setStep('success');
  };

  const handleCloseSuccess = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {step === 'method' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect with {expert.name}</h2>
            <p className="text-gray-600 mb-6">How would you like to connect?</p>
            
            <div className="space-y-3">
              <button
                onClick={handleCallClick}
                className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
              >
                📞 Book a Call
              </button>
              <button
                onClick={handleChatClick}
                className="w-full py-3 px-4 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
              >
                💬 Send a Message
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 py-2 px-4 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        )}

        {step === 'callType' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose Call Type</h2>
            <p className="text-gray-600 mb-6">What type of call would you prefer?</p>
            
            <div className="space-y-3">
              <button
                onClick={handleVideoCall}
                className="w-full py-3 px-4 bg-purple-500 text-white font-semibold rounded-lg shadow-md hover:bg-purple-600 transition flex items-center justify-center gap-2"
              >
                📹 Video Call
              </button>
              <button
                onClick={handleVoiceCall}
                className="w-full py-3 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                🎙️ Voice Call
              </button>
            </div>

            <button
              onClick={() => setStep('method')}
              className="w-full mt-4 py-2 px-4 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Back
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">✓ Connected!</h2>
            <p className="text-gray-600 mb-6">
              Your consultation with <span className="font-semibold">{expert.name}</span> has been set up. 
              Opening the {step === 'callType' ? 'call' : 'chat'} section now...
            </p>
            <button
              onClick={handleCloseSuccess}
              className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
