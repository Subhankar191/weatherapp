import { useWeather } from '../../hooks';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';
import {
  WiSunrise,
  WiSunset,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiSmoke,
  WiDayHaze
} from 'react-icons/wi';
import { getWindDirection } from '../../utils/helpers';

const WeatherDetails = () => {
  const { weatherData, airQuality, unit } = useWeather(); // ✅ include airQuality
  console.log('Air Quality:', airQuality); // 🔍 Debug here
  if (!weatherData) return null;

  const aqiLevel = (aqi) => {
    switch (aqi) {
      case 1: return 'Good';
      case 2: return 'Fair';
      case 3: return 'Moderate';
      case 4: return 'Poor';
      case 5: return 'Very Poor';
      default: return 'Unknown';
    }
  };

  return (
    <motion.div
      className="weather-details"
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <h3>Weather Details</h3>
      <div className="details-grid">
        <div className="detail-item">
          <WiSunrise size={24} />
          <span>Sunrise: {new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString()}</span>
        </div>
        <div className="detail-item">
          <WiSunset size={24} />
          <span>Sunset: {new Date(weatherData.sys.sunset * 1000).toLocaleTimeString()}</span>
        </div>
        <div className="detail-item">
          <WiHumidity size={24} />
          <span>Humidity: {weatherData.main.humidity}%</span>
        </div>
        <div className="detail-item">
          <WiStrongWind size={24} />
          <span>
            Wind: {weatherData.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'} {getWindDirection(weatherData.wind.deg)}
          </span>
        </div>
        <div className="detail-item">
          <WiBarometer size={24} />
          <span>Pressure: {weatherData.main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <WiDayHaze size={24}/>
          <span>Visibility: {(weatherData.visibility / 1000).toFixed(1)} km</span>
        </div>

        {/* ✅ Air Quality section */}
        {airQuality && airQuality.main && (
          <>
            <div className="detail-item">
              <WiSmoke size={24} />
              <span>
                AQI: {airQuality.main.aqi} ({aqiLevel(airQuality.main.aqi)})
              </span>
            </div>
            {/* <div className="detail-item">
              <span>PM2.5: {airQuality.components.pm2_5} µg/m³</span>
            </div>
            <div className="detail-item">
              <span>PM10: {airQuality.components.pm10} µg/m³</span>
            </div>
            <div className="detail-item">
              <span>CO: {airQuality.components.co} µg/m³</span>
            </div>
            <div className="detail-item">
              <span>NO₂: {airQuality.components.no2} µg/m³</span>
            </div>
            <div className="detail-item">
              <span>O₃: {airQuality.components.o3} µg/m³</span>
            </div>
            <div className="detail-item">
              <span>SO₂: {airQuality.components.so2} µg/m³</span>
            </div> */}
          </>
        )}

      </div>
    </motion.div>
  );
};

export default WeatherDetails;