import React from 'react';

interface FirestoreErrorModalProps {
  message: string;
  onClose: () => void;
}

const FirestoreErrorModal: React.FC<FirestoreErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Database Connection Error</h2>
        <p className="text-gray-700 mb-4">
          {message}
        </p>
        <p className="text-gray-600 mb-6">
          This is often due to a one-time setup step that needs to be completed in the Firebase console.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to fix:</h3>
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Go to the Firebase Console and select your project.</li>
            <li>In the left menu, go to <span className="font-semibold">Build &rarr; Firestore Database</span>.</li>
            <li>Click <strong>Create database</strong> and follow the prompts (starting in test mode is recommended for development).</li>
            <li>If the database exists, check the <strong>Rules</strong> tab to ensure you have read/write permissions.</li>
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

export default FirestoreErrorModal;