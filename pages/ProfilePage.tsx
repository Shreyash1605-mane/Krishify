import React from 'react';
import type { User } from '../types';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  if (user.role !== 'farmer') return null;

  const DetailItem: React.FC<{ label: string; value?: string | string[] }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {Array.isArray(value) ? value.join(', ') : value}
      </dd>
    </div>
  );

  return (
    <main className="flex-grow p-4 md:p-6 bg-gray-50 w-full">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Farmer Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and farm information.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="sm:px-6"><DetailItem label="Farmer ID" value={user.id} /></div>
              <div className="sm:px-6"><DetailItem label="Full Name" value={user.name} /></div>
              <div className="sm:px-6"><DetailItem label="Contact Number" value={user.contact} /></div>
              <div className="sm:px-6"><DetailItem label="Address" value={user.address} /></div>
              <div className="sm:px-6"><DetailItem label="City / Town" value={user.location?.city} /></div>
              <div className="sm:px-6"><DetailItem label="Crops Grown" value={user.cropsGrown} /></div>
              <div className="sm:px-6"><DetailItem label="Farm Details" value={user.farmDetails} /></div>
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
