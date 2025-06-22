import { useEffect } from 'react';
import { useGeolocation } from '../hooks';
import { useWeather } from '../contexts';
import { MainLayout } from '../components/layout';
import { SearchSection } from '../components/search';
import { 
  CurrentWeather, 
  DailyForecast, 
  HourlyForecast,
  WeatherDetails,
  WeatherMap,
  WeatherChart
} from '../components/weather';
import { LoadingSpinner, AnimatedBackground } from '../components/ui';

const HomePage = () => {
  const { location: geoLocation, isLoading: geoLoading } = useGeolocation();
  const { 
    weatherData, 
    // forecastData, 
    // hourlyData, 
    loading, 
    error, 
    fetchWeather,
    // location 
  } = useWeather();

  useEffect(() => {
    if (geoLocation && !weatherData) {
      fetchWeather(geoLocation);
    }
  }, [geoLocation, fetchWeather, weatherData]);

  if (geoLoading || (loading && !weatherData)) {
    return (
      <MainLayout>
        <LoadingSpinner />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="error-message">{error}</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AnimatedBackground weather={weatherData?.weather[0].main} />
      <SearchSection/>
      {weatherData && (
        <>
          <CurrentWeather />
          <div className="weather-grid">
            <WeatherDetails />
            <DailyForecast />
            <HourlyForecast />
            <WeatherChart />
            <WeatherMap />
          </div>
        </>
      )}
    </MainLayout>
  );
};

export default HomePage;