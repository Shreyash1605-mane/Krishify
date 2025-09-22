import React from 'react';

interface MarketAnalysisWidgetProps {
  crops: string[];
}

const TrendLine: React.FC<{ data: number[] }> = ({ data }) => (
    <svg className="w-full h-12" viewBox="0 0 100 20" preserveAspectRatio="none">
        <path 
            d={`M 0 ${20 - data[0]} L 25 ${20 - data[1]} L 50 ${20 - data[2]} L 75 ${20 - data[3]} L 100 ${20 - data[4]}`}
            fill="none" 
            stroke={data[4] > data[0] ? '#10B981' : '#EF4444'} 
            strokeWidth="1" 
        />
    </svg>
);

const MarketAnalysisWidget: React.FC<MarketAnalysisWidgetProps> = ({ crops }) => {

  // Mock trend data generator
  const getTrendData = (cropName: string) => {
    const hash = cropName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const base = (hash % 10) + 5;
    return [
        base + (hash % 3) - 1,
        base + ((hash*2) % 4) - 2,
        base + ((hash*3) % 3) - 1,
        base + ((hash*4) % 5) - 2,
        base + ((hash*5) % 6) - 3,
    ].map(n => Math.max(1, Math.min(19, n)));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-2">Market Analysis (Last 3 Months)</h3>
      <div className="space-y-3">
        {crops.length > 0 ? crops.map(crop => (
            <div key={crop} className="flex items-center justify-between">
                <span className="font-medium text-gray-800 text-sm">{crop}</span>
                <div className="w-1/2">
                    <TrendLine data={getTrendData(crop)} />
                </div>
                <span className={`text-sm font-semibold ${getTrendData(crop)[4] > getTrendData(crop)[0] ? 'text-green-600' : 'text-red-600'}`}>
                    {getTrendData(crop)[4] > getTrendData(crop)[0] ? '▲' : '▼'}
                </span>
            </div>
        )) : <p className="text-sm text-gray-500">Add crops you grow in your profile to see analysis.</p>}
      </div>
    </div>
  );
};

export default MarketAnalysisWidget;