import { useWeather } from '../../hooks';
import { WeatherCard } from './WeatherCard';
import { motion } from 'framer-motion';
import { slideUp, staggerChildren } from '../../utils/animations';

const DailyForecast = () => {
  const { forecastData, unit } = useWeather();

  if (!forecastData) return null;

  // Group by date string (YYYY-MM-DD)
  const dailyMap = new Map();
  forecastData.list.forEach((item) => {
    const date = item.dt_txt.split(' ')[0]; // e.g., '2025-06-20'
    if (!dailyMap.has(date)) {
      dailyMap.set(date, item); // keep only first entry of the day
    }
  });

  const dailyForecasts = Array.from(dailyMap.values()).slice(0, 5); // limit to 5 days

  return (
    <motion.div 
      className="daily-forecast"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <h3>5-Day Forecast</h3>
      <div className="forecast-cards">
        {dailyForecasts.map((day, index) => (
          <WeatherCard 
            key={index} 
            data={day} 
            unit={unit}
            variants={slideUp}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default DailyForecast;
