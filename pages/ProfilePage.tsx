import React, { useState } from 'react';
import type { User } from '../types';
import CameraModal from '../components/CameraModal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  if (user.role !== 'farmer') return null;

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const saveProfileImage = async (imageUrl: string) => {
    try {
      setUploading(true);
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { profileImage: imageUrl });
      // Optionally update local UI - in this app the global auth listener will refresh user
      setLocalPreview(imageUrl);
    } catch (err: any) {
      alert('Failed to save profile image: ' + (err.message || err));
    } finally {
      setUploading(false);
    }
  };

  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      saveProfileImage(result);
    };
    reader.readAsDataURL(file);
  };

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
        <div className="bg-white shadow-md rounded-lg overflow-hidden px-4 py-6">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <img
                src={localPreview || user.profileImage || '/background.jpeg'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="absolute bottom-0 right-0">
                <label className="bg-white p-1 rounded-full shadow cursor-pointer">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0] || null)} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12h3m0 0v3m0-3h-3m3 0V9m-9 6H6m0 0v-3m0 3h3m-3 0V9" /></svg>
                </label>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => setIsCameraOpen(true)} className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Take Photo</button>
                <button onClick={() => {
                  const url = prompt('Paste image URL:');
                  if (url) saveProfileImage(url);
                }} className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200">Use Image URL</button>
                {uploading && <span className="text-sm text-gray-500">Saving...</span>}
              </div>
            </div>
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

      {isCameraOpen && (
        <CameraModal onCapture={(data) => { saveProfileImage(data); setIsCameraOpen(false); }} onClose={() => setIsCameraOpen(false)} />
      )}
    </main>
  );
};

export default ProfilePage;
