import { useWeather } from '../../hooks';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';
import { getTimeFromTimestamp } from '../../utils/helpers';
import { WeatherIcon } from './WeatherIcon';

const HourlyForecast = () => {
  const { hourlyData, unit, weatherData } = useWeather();

  if (!hourlyData || !weatherData) return null;

  const timezone = weatherData.timezone || 0;

  return (
    <motion.div
      className="hourly-forecast"
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <h3 className="text-xl font-semibold mb-2">Next 24 Hours</h3>
      <div className="hourly-scroll flex gap-4 overflow-x-auto p-2">
        {hourlyData.map((hour, index) => (
          <div
            key={index}
            className="hourly-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 min-w-[80px] text-center"
          >
            <p className="text-sm font-medium">{getTimeFromTimestamp(hour.dt, timezone)}</p>
            <WeatherIcon code={hour.weather[0].icon} size={40} />
            <p className="text-base font-bold mt-1">
              {Math.round(hour.main.temp)}°{unit === 'metric' ? 'C' : 'F'}
            </p>
            <p className="text-xs text-gray-500">{(hour.pop * 100).toFixed(0)}% rain</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default HourlyForecast;