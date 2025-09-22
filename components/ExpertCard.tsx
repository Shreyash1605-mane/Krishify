import React from 'react';
import type { Expert } from '../types';

interface ExpertCardProps {
    expert: Expert;
    onBook: () => void;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert, onBook }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img src={expert.imageUrl} alt={expert.name} className="w-full h-56 object-cover object-center" />
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-800">{expert.name}</h3>
                <div className="flex flex-wrap gap-2 my-2">
                    {expert.expertise.map(skill => (
                        <span key={skill} className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">{skill}</span>
                    ))}
                </div>
                <p className="text-gray-600 text-sm flex-grow">{expert.bio}</p>
                <button 
                    onClick={onBook}
                    className="mt-4 w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                >
                    Book a Call
                </button>
            </div>
        </div>
    );
};

export default ExpertCard;