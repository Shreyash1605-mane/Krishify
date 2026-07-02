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
      <div className="mt-4 flex items-center gap-3">
        <a 
          href={scheme.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-green-700 hover:text-green-900"
        >
          Learn More &rarr;
        </a>
        <a
          href={scheme.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-block px-3 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700"
          aria-label={`Apply now for ${scheme.title}`}
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default SchemeCard;
