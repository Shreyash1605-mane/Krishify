
import React, { useState } from 'react';
import type { User, Product } from '../types';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import RemindersWidget from '../components/dashboard/RemindersWidget';
import CropStatusWidget from '../components/dashboard/CropStatusWidget';
import ControlSystemWidget from '../components/dashboard/ControlSystemWidget';
import MarketAnalysisWidget from '../components/dashboard/MarketAnalysisWidget';
import PricePredictionWidget from '../components/dashboard/PricePredictionWidget';
import WidgetCard from '../components/dashboard/WidgetCard';
import KrishifyLogoIcon from '../components/icons/FarmLogoIcon';
import SunIcon from '../components/icons/SunIcon';

interface DashboardPageProps {
  user: User;
  products: Product[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ user, products }) => {
  const [expandedWidget, setExpandedWidget] = useState<React.ReactNode | null>(null);

  const openExpanded = (node: React.ReactNode) => setExpandedWidget(node);
  const closeExpanded = () => setExpandedWidget(null);
  if (user.role !== 'farmer') {
    return <div className="p-8 w-full text-center">Access Denied. This page is for farmers only.</div>;
  }

  return (
    <main className="relative flex-grow p-4 md:p-6 w-full overflow-y-auto">
      {/* Background image for dashboard (blurred) */}
      <div className="absolute inset-0 -z-10">
        <img src="/Dashboard.jpg" alt="dashboard-bg" className="w-full h-full object-cover filter blur-sm brightness-75" />
        <img src="/Dashboard.jpg" alt="dashboard-bg-fallback" className="w-full h-full object-cover filter blur-sm brightness-75 absolute inset-0" />
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      </div>
  <div className="max-w-7xl mx-auto bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Farmer's Dashboard</h1>

        {/* KPI row - compact tiles to utilize space */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 text-sm transition-shadow hover:ring-2 hover:ring-green-100">
            <div className="text-xs text-gray-500">My Listings</div>
            <div className="text-lg font-semibold text-gray-800">{products.filter(p => p.farmer === user.uid).length}</div>
          </div>
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 text-sm transition-shadow hover:ring-2 hover:ring-green-100">
            <div className="text-xs text-gray-500">Total Stock</div>
            <div className="text-lg font-semibold text-gray-800">{products.filter(p => p.farmer === user.uid).reduce((s, p) => s + (p.stock || 0), 0)}</div>
          </div>
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-200 text-sm transition-shadow hover:ring-2 hover:ring-green-100">
            <div className="text-xs text-gray-500">Estimated Inventory Value</div>
            <div className="text-lg font-semibold text-gray-800">₹{products.filter(p => p.farmer === user.uid).reduce((s, p) => s + ((p.price || 0) * (p.stock || 0)), 0)}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8">
            <WidgetCard title="Market Analysis" onExpand={() => openExpanded(<MarketAnalysisWidget crops={user.cropsGrown || []} />)}>
              <MarketAnalysisWidget crops={user.cropsGrown || []} />
            </WidgetCard>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <WidgetCard title="Price Predictions" onExpand={() => openExpanded(<PricePredictionWidget crops={user.cropsGrown || []} />)}>
                <PricePredictionWidget crops={user.cropsGrown || []} />
              </WidgetCard>
              <WidgetCard title="Reminders" onExpand={() => openExpanded(<RemindersWidget />)}>
                <RemindersWidget />
              </WidgetCard>
            </div>

            {/* Moved control & mini-widgets under Price Predictions */}
            <div className="mt-4 grid grid-cols-1 gap-4">
              <WidgetCard title="Control System" icon={<KrishifyLogoIcon />} onExpand={() => openExpanded(<ControlSystemWidget />)}>
                <ControlSystemWidget />
              </WidgetCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <WidgetCard title="Soil Moisture" icon={<SunIcon />} onRefresh={() => console.log('refresh soil moisture')} onExpand={() => openExpanded(
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Soil Moisture - Detailed</h2>
                    <p>Field A: 78%</p>
                    <p>Field B: 62%</p>
                    <p>Recommendations: Irrigate Field B within 48 hours.</p>
                  </div>
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Field A</div>
                      <div className="text-lg font-semibold text-green-700">78%</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Details</button>
                    </div>
                  </div>
                </WidgetCard>

                <WidgetCard title="Irrigation" icon={<KrishifyLogoIcon />} onRefresh={() => console.log('refresh irrigation')} onExpand={() => openExpanded(
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Irrigation Control</h2>
                    <p>Current Status: Off</p>
                    <div className="mt-3">
                      <button className="px-4 py-2 bg-green-600 text-white rounded">Turn On</button>
                      <button className="ml-2 px-4 py-2 bg-red-500 text-white rounded">Schedule</button>
                    </div>
                  </div>
                )}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Status</div>
                      <div className="text-lg font-semibold text-gray-800">Off</div>
                    </div>
                    <div>
                      <button className="px-3 py-1 bg-green-600 text-white rounded text-sm">Turn On</button>
                    </div>
                  </div>
                </WidgetCard>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-6">
            <WidgetCard title="Weather" onExpand={() => openExpanded(<WeatherWidget location={user.location} />)}>
              <WeatherWidget location={user.location} />
            </WidgetCard>

            <WidgetCard title="Crop Status" onExpand={() => openExpanded(<CropStatusWidget products={products} />)}>
              <CropStatusWidget products={products} />
            </WidgetCard>
          </aside>
        </div>
      </div>
      {/* Expanded widget modal */}
      {expandedWidget && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40" onClick={closeExpanded}>
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4 p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end">
              <button onClick={closeExpanded} className="text-gray-600 hover:text-gray-900">Close</button>
            </div>
            <div className="mt-2">{expandedWidget}</div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DashboardPage;