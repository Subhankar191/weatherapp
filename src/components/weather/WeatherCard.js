import React from 'react';
import { WeatherIcon } from './WeatherIcon';
import { getDayFromTimestamp } from '../../utils/helpers';
import { useWeather } from '../../hooks';

export const WeatherCard = ({ data, unit = 'metric' }) => {
  const { weatherData } = useWeather();

  if (!data || !data.weather || !data.main || !weatherData) return null;

  const timezone = weatherData.timezone || 0;
  const day = getDayFromTimestamp(data.dt, timezone);
  const icon = data.weather[0].icon;
  const description = data.weather[0].description;
  const temp = data.main.temp;

  return (
    <div
      className="weather-card"
      style={{
        padding: '1rem',
        borderRadius: '12px',
        backgroundColor: '#cccccc',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        width: '120px',
      }}
    >
      <h4>{day}</h4>
      <WeatherIcon code={icon} size={80} />
      <p style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>
        {Math.round(temp)}°{unit === 'metric' ? 'C' : 'F'}
      </p>
      <p style={{ fontSize: '0.9rem', color: '#444444' }}>{description}</p>
    </div>
  );
};
