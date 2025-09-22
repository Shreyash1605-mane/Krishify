import React, { useState } from 'react';

const ControlSystemWidget: React.FC = () => {
  const [irrigation, setIrrigation] = useState(false);
  const [lighting, setLighting] = useState(true);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-2">Control Systems</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-800">Irrigation</span>
          <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" checked={irrigation} onChange={() => setIrrigation(!irrigation)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-800">Greenhouse Lighting</span>
           <label className="inline-flex relative items-center cursor-pointer">
            <input type="checkbox" checked={lighting} onChange={() => setLighting(!lighting)} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ControlSystemWidget;
