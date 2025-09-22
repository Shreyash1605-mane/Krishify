import React, { useState, useRef, useEffect } from 'react';
import SendIcon from './icons/SendIcon';
import PaperclipIcon from './icons/PaperclipIcon';
import MicIcon from './icons/MicIcon';

interface QueryInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSend, disabled }) => {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (query.trim()) {
      onSend(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  return (
    <div className="flex items-end p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-400">
      <button className="p-2 text-gray-500 hover:text-gray-700">
        <PaperclipIcon />
      </button>
      <textarea
        ref={textareaRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-grow p-2 resize-none border-none focus:outline-none focus:ring-0 max-h-40"
        rows={1}
        disabled={disabled}
      />
      <button className="p-2 text-gray-500 hover:text-gray-700">
        <MicIcon />
      </button>
      <button
        onClick={handleSend}
        disabled={disabled || !query.trim()}
        className="p-2 text-blue-500 rounded-full hover:bg-blue-100 disabled:text-gray-400 disabled:hover:bg-transparent"
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default QueryInput;
