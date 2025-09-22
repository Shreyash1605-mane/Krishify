import React, { useState } from 'react';

interface TwoFactorAuthModalProps {
  onVerify: (code: string) => void;
  onClose: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ onVerify, onClose }) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(code);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Verification Required</h2>
        <p className="text-center text-gray-600 mb-6">A verification code has been sent to your device. Please enter it below. (Hint: it's 123456)</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-3 text-center text-lg border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="_ _ _ _ _ _"
            maxLength={6}
            required
          />
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoFactorAuthModal;