import React from 'react';

interface FirebaseConfigErrorModalProps {
  onClose: () => void;
}

const FirebaseConfigErrorModal: React.FC<FirebaseConfigErrorModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h2>
        <p className="text-gray-700 mb-4">
          Registration failed because the <strong>Email/Password sign-in method</strong> is not enabled in your Firebase project.
        </p>
        <p className="text-gray-600 mb-6">
          This is a required one-time setup step in the Firebase console.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to fix:</h3>
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Go to the Firebase Console.</li>
            <li>Select your project (<span className="font-mono bg-gray-200 px-1 rounded">krishify-2217f</span>).</li>
            <li>Navigate to <span className="font-semibold">Authentication</span> &rarr; <span className="font-semibold">Sign-in method</span> tab.</li>
            <li>Click on <strong>Email/Password</strong> from the list of providers and enable it.</li>
          </ol>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
          >
            Go to Firebase Console
          </a>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirebaseConfigErrorModal;
