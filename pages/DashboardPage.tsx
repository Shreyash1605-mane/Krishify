
import React from 'react';
import type { User, Product } from '../types';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import RemindersWidget from '../components/dashboard/RemindersWidget';
import CropStatusWidget from '../components/dashboard/CropStatusWidget';
import ControlSystemWidget from '../components/dashboard/ControlSystemWidget';
import MarketAnalysisWidget from '../components/dashboard/MarketAnalysisWidget';
import PricePredictionWidget from '../components/dashboard/PricePredictionWidget';

interface DashboardPageProps {
  user: User;
  products: Product[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, products }) => {
  if (user.role !== 'farmer') {
    return <div className="p-8 w-full text-center">Access Denied. This page is for farmers only.</div>;
  }

  return (
    <main className="flex-grow p-4 md:p-6 bg-gray-50 w-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Farmer's Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-4">
            <MarketAnalysisWidget crops={user.cropsGrown || []} />
          </div>
          <WeatherWidget location={user.location} />
          <RemindersWidget />
          <div className="md:col-span-2">
            <PricePredictionWidget crops={user.cropsGrown || []} />
          </div>
          <CropStatusWidget products={products}/>
          <ControlSystemWidget />
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;