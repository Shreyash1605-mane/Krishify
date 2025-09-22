
import React, { useState } from 'react';
import { predictCropPrice } from '../../services/geminiService';
import Spinner from '../Spinner';

interface PricePredictionWidgetProps {
  crops: string[];
}

interface Prediction {
    prediction: string;
    trend: 'UP' | 'DOWN' | 'STABLE';
    confidence: 'High' | 'Medium' | 'Low';
    error?: string;
}

const TrendIcon: React.FC<{ trend: Prediction['trend'] }> = ({ trend }) => {
    if (trend === 'UP') return <span className="text-green-500">▲</span>;
    if (trend === 'DOWN') return <span className="text-red-500">▼</span>;
    return <span className="text-gray-500">▬</span>;
};

const PricePredictionWidget: React.FC<PricePredictionWidgetProps> = ({ crops }) => {
  const [selectedCrop, setSelectedCrop] = useState(crops[0] || '');
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredict = async () => {
    if (!selectedCrop) return;
    setIsLoading(true);
    setPrediction(null);
    try {
        const result = await predictCropPrice(selectedCrop);
        const parsedResult: Prediction = JSON.parse(result);
        setPrediction(parsedResult);
    } catch(e) {
        setPrediction({ error: 'Failed to parse prediction data.', prediction: '', trend: 'STABLE', confidence: 'Low' });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-2">AI Price Prediction</h3>
      {crops.length > 0 ? (
        <>
            <div className="flex items-center space-x-2">
                <select 
                    value={selectedCrop} 
                    onChange={e => setSelectedCrop(e.target.value)}
                    className="flex-grow p-2 border border-gray-300 rounded-md text-sm"
                >
                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button 
                    onClick={handlePredict}
                    disabled={isLoading || !selectedCrop}
                    className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isLoading ? <Spinner /> : 'Predict'}
                </button>
            </div>
            {prediction && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
                    {prediction.error ? (
                         <p className="text-sm text-red-600">{prediction.error}</p>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold">Forecast</span>
                                <div className="flex items-center space-x-2 text-xs">
                                    <span>Trend: <TrendIcon trend={prediction.trend} /></span>
                                    <span className="text-gray-400">|</span>
                                    <span>Confidence: {prediction.confidence}</span>
                                </div>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{prediction.prediction}</p>
                        </>
                    )}
                </div>
            )}
        </>
      ) : (
          <p className="text-sm text-gray-500">Add crops to your profile to use this feature.</p>
      )}
    </div>
  );
};

export default PricePredictionWidget;