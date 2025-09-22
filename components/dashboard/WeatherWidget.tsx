
import React from 'react';
import SunIcon from '../icons/SunIcon';
import CloudIcon from '../icons/CloudIcon';
import RainIcon from '../icons/RainIcon';
import type { User } from '../../types';

interface WeatherWidgetProps {
    location?: User['location'];
}

const getMockWeather = (city: string) => {
    const hash = city.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const temp = 15 + (hash % 15); // Temp between 15C and 30C
    const conditionIndex = hash % 3;
    const conditions = ['Sunny', 'Cloudy', 'Rainy'];
    const humidity = 50 + (hash % 25);
    return {
        temp: `${temp}°C`,
        condition: conditions[conditionIndex],
        humidity: `${humidity}%`,
    }
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ location }) => {
  const weather = getMockWeather(location?.city || 'Default');

  const renderIcon = () => {
    switch (weather.condition) {
      case 'Sunny': return <SunIcon />;
      case 'Cloudy': return <CloudIcon />;
      case 'Rainy': return <RainIcon />;
      default: return <SunIcon />;
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-2">Weather in {location?.city}</h3>
      <div className="flex items-center space-x-4">
        <div className="text-yellow-500">{renderIcon()}</div>
        <div>
          <p className="text-3xl font-bold text-gray-800">{weather.temp}</p>
          <p className="text-sm text-gray-500">{weather.condition}</p>
          <p className="text-sm text-gray-500">Humidity: {weather.humidity}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;