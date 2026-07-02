import React from 'react';
import type { Loan } from '../types';

const LoanCard: React.FC<{ loan: Loan }> = ({ loan }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col">
      <h3 className="text-lg font-bold text-blue-800">{loan.name}</h3>
      <p className="text-sm text-gray-600 mt-2 flex-grow">Provider: <strong>{loan.provider}</strong></p>
      <p className="text-sm text-gray-600">Interest: {loan.interestRate} • Max: {loan.maxAmount}</p>
      <div className="mt-4 flex items-center gap-3">
        <a
          href={loan.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          Learn More &rarr;
        </a>
        <a
          href={loan.link}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 inline-block px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700"
        >
          Apply Now
        </a>
      </div>
    </div>
  );
};

export default LoanCard;
