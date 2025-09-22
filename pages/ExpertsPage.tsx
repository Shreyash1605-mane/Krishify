import React, { useState } from 'react';
import { EXPERTS } from '../constants';
import type { Expert } from '../types';
import ExpertCard from '../components/ExpertCard';

const BookingModal: React.FC<{ expert: Expert, onClose: () => void }> = ({ expert, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800">Booking Confirmed!</h2>
        <p className="my-4 text-gray-600">Your consultation with <span className="font-semibold">{expert.name}</span> has been successfully booked. They will contact you shortly.</p>
        <button onClick={onClose} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
          OK
        </button>
      </div>
    </div>
);

const ExpertsPage: React.FC = () => {
    const [bookingExpert, setBookingExpert] = useState<Expert | null>(null);

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
                </div>
            </main>
            {bookingExpert && <BookingModal expert={bookingExpert} onClose={() => setBookingExpert(null)} />}
        </>
    );
};

export default ExpertsPage;