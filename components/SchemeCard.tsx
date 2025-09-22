import React from 'react';
import type { Scheme } from '../types';

interface SchemeCardProps {
  scheme: Scheme;
}

const SchemeCard: React.FC<SchemeCardProps> = ({ scheme }) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-bold text-green-800">{scheme.title}</h3>
      <p className="text-sm text-gray-600 mt-2 flex-grow">{scheme.description}</p>
      <a 
        href={scheme.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-sm font-semibold text-green-700 hover:text-green-900 self-start"
      >
        Learn More &rarr;
      </a>
    </div>
  );
};

export default SchemeCard;
