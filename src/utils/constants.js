export const WEATHER_CODES = {
  200: { icon: '11d', label: 'Thunderstorm with light rain' },
  201: { icon: '11d', label: 'Thunderstorm with rain' },
  // ... add all weather codes from OpenWeatherMap
  800: { icon: '01d', label: 'Clear sky' },
  801: { icon: '02d', label: 'Few clouds' },
  // ... continue with all codes
};

export const AIR_QUALITY = {
  1: { level: 'Good', color: '#009966' },
  2: { level: 'Fair', color: '#ffde33' },
  3: { level: 'Moderate', color: '#ff9933' },
  4: { level: 'Poor', color: '#cc0033' },
  5: { level: 'Very Poor', color: '#660099' },
};

export const WIND_SPEED_UNITS = {
  metric: 'm/s',
  imperial: 'mph',
};

export const TEMP_UNITS = {
  metric: '°C',
  imperial: '°F',
};