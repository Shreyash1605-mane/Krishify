import React, { useState } from 'react';
import type { Page, UserRole, User } from '../types';

interface RegistrationPageProps {
  onRegister: (user: Omit<User, 'id' | 'uid'>, pass: string) => void;
  onNavigate: (page: Page) => void;
}

const RegistrationPage: React.FC<RegistrationPageProps> = ({ onRegister, onNavigate }) => {
  const [role, setRole] = useState<UserRole>('farmer');
  
  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');

  // Farmer specific
  const [farmDetails, setFarmDetails] = useState('');
  const [cropsGrown, setCropsGrown] = useState('');

  const isFarmer = role === 'farmer';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const commonDetails = { name, email, contact, address, role, location: { city } };
    let newUser: Omit<User, 'id' | 'uid'>;

    if (isFarmer) {
      if (!farmDetails) {
        alert('Please fill all farmer-specific fields');
        return;
      }
      newUser = { ...commonDetails, farmDetails, cropsGrown: cropsGrown.split(',').map(c => c.trim()) };
    } else {
      newUser = { ...commonDetails };
    }

    onRegister(newUser, password);
  };
  
  const renderFarmerFields = () => (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Crops Grown</label>
        <input type="text" value={cropsGrown} onChange={e => setCropsGrown(e.target.value)} className="input-field" placeholder="e.g., Tomatoes, Carrots, Wheat" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Farm Details</label>
        <textarea value={farmDetails} onChange={e => setFarmDetails(e.target.value)} className="input-field" placeholder="e.g., 5-acre organic farm specializing in vegetables" required />
      </div>
    </>
  );

  return (
    <div className="relative flex items-center justify-center min-h-screen w-full overflow-hidden py-12 px-4">
      <div className="absolute inset-0">
        <img src="/Login Page 1.jpg" alt="background" className="w-full h-full object-cover filter blur-sm brightness-75" />
        <img src="/Login Page 1.jpg" alt="background-fallback" className="w-full h-full object-cover filter blur-sm brightness-75 absolute inset-0" />
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>
      <div className="relative p-8 bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-xl max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h1>
        <div className="flex justify-center border-b-2 border-gray-200 mb-6">
            <button onClick={() => setRole('farmer')} className={`px-4 py-2 text-sm font-semibold ${isFarmer ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}>Farmer</button>
            <button onClick={() => setRole('buyer')} className={`px-4 py-2 text-sm font-semibold ${!isFarmer ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}>Buyer</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field" placeholder="This will be your login email" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="tel" value={contact} onChange={e => setContact(e.target.value)} className="input-field" placeholder={isFarmer ? '' : 'This will be your Login ID'} required />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="input-field" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">City / Town</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} className="input-field" placeholder="For filtering local rentals" required />
            </div>
            
            {isFarmer ? renderFarmerFields() : null}

            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field" required />
            </div>

            <button type="submit" className={`w-full py-3 px-4 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-transform transform hover:scale-105 ${isFarmer ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400'}`}>
                Register
            </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} className="font-medium text-green-600 hover:text-green-500">
                Login here
            </button>
        </p>
      </div>
      <style>{`.input-field { display: block; width: 100%; margin-top: 4px; padding: 8px 12px; border: 1px solid #D1D5DB; border-radius: 6px; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); } .input-field:focus { outline: none; box-shadow: 0 0 0 2px #34D399; border-color: #10B981; }`}</style>
    </div>
  );
};

export default RegistrationPage;