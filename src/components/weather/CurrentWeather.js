import { useWeather } from '../../hooks';
import { WeatherIcon } from './WeatherIcon';
import { FavoriteButton } from '../favorites';
import { capitalize, getTimeFromTimestamp, getWindDirection } from '../../utils/helpers';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const CurrentWeather = () => {
  const { weatherData, location, unit, toggleFavorite } = useWeather();

  if (!weatherData) return null;

  const isDayTime = weatherData.weather[0].icon.includes('d');
  const sunrise = getTimeFromTimestamp(weatherData.sys.sunrise, weatherData.timezone);
  const sunset = getTimeFromTimestamp(weatherData.sys.sunset, weatherData.timezone);

  return (
    <motion.div 
      className="current-weather"
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <div className="weather-header">
        <h2>
          {location.name}, {location.country}
          <FavoriteButton location={location} />
        </h2>
        <p className="weather-description">
          {capitalize(weatherData.weather[0].description)}
        </p>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <WeatherIcon code={weatherData.weather[0].icon} size={80} />
          <span>{Math.round(weatherData.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</span>
        </div>
        
        <div className="weather-meta">
          <p>Feels like: {Math.round(weatherData.main.feels_like)}°{unit === 'metric' ? 'C' : 'F'}</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'} {getWindDirection(weatherData.wind.deg)}</p>
          <p>Pressure: {weatherData.main.pressure} hPa</p>
          <p>{isDayTime ? 'Sunset' : 'Sunrise'}: {isDayTime ? sunset : sunrise}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeather;