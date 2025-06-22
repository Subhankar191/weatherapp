import React from 'react';

export const WeatherIcon = ({ code, size = 64 }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${code}@2x.png`;
  return (
    <img
      src={iconUrl}
      alt="Weather Icon"
      width={size}
      height={size}
      style={{ objectFit: 'contain' }}
    />
  );
};
