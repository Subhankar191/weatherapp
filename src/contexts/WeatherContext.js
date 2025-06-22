import { createContext, useContext, useReducer, useCallback } from 'react';
import { 
  fetchCurrentWeather, 
  fetchForecast, 
  fetchHourlyForecast, 
  fetchAirQuality 
} from '../services/weatherService';

const WeatherContext = createContext();

const initialState = {
  weatherData: null,
  forecastData: null,
  hourlyData: null,
  airQuality: null, // ✅ Added
  loading: false,
  error: null,
  unit: 'metric',
  location: null,
  favorites: JSON.parse(localStorage.getItem('weatherFavorites')) || [],
  searchHistory: JSON.parse(localStorage.getItem('weatherSearchHistory')) || [],
};

function weatherReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      const newSearchHistory = [
        { name: action.payload.location.name, country: action.payload.location.country },
        ...state.searchHistory.filter(
          item => item.name !== action.payload.location.name
        ).slice(0, 4)
      ];
      localStorage.setItem('weatherSearchHistory', JSON.stringify(newSearchHistory));
      return {
        ...state,
        loading: false,
        weatherData: action.payload.weather,
        forecastData: action.payload.forecast,
        hourlyData: action.payload.hourly,
        airQuality: action.payload.airQuality, // ✅ Store AQ data
        location: action.payload.location,
        searchHistory: newSearchHistory,
      };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_UNIT':
      return { ...state, unit: action.payload };
    case 'TOGGLE_FAVORITE':
      console.log("Reducer received TOGGLE_FAVORITE:", action.payload); // ✅ add here

      const exists = state.favorites.some(
        fav =>
          fav.name?.toLowerCase() === action.payload.name?.toLowerCase() &&
          fav.country?.toLowerCase() === action.payload.country?.toLowerCase() 
      );
      const newFavorites = exists
        ? state.favorites.filter(
            fav => 
              !(fav.name?.toLowerCase() === action.payload.name?.toLowerCase() &&
                fav.country?.toLowerCase() === action.payload.country?.toLowerCase())
          )
        : [...state.favorites, action.payload];
      localStorage.setItem('weatherFavorites', JSON.stringify(newFavorites));
      return { ...state, favorites: newFavorites };
    case 'SET_SEARCH_HISTORY':
      return { ...state, searchHistory: action.payload };
    default:
      return state;
  }
}

export function WeatherProvider({ children }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  const fetchWeather = useCallback(async (location, unit = state.unit) => {
    if (!location) return;

    dispatch({ type: 'FETCH_START' });

    try {
      const [weather, forecast, hourly, airQuality] = await Promise.all([
        fetchCurrentWeather(location, unit),
        fetchForecast(location, unit),
        fetchHourlyForecast(location, unit),
        fetchAirQuality(location) // ✅ fetch AQ
      ]);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: {
          weather,
          forecast,
          hourly,
          airQuality,  //  added
          location: {
            name: weather.name,
            country: weather.sys.country,
            lat: weather.coord.lat,
            lon: weather.coord.lon,
          }
        }
      });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, [state.unit]);

  const toggleUnit = useCallback(() => {
    const newUnit = state.unit === 'metric' ? 'imperial' : 'metric';
    dispatch({ type: 'SET_UNIT', payload: newUnit });

    if (state.location) {
      fetchWeather(state.location, newUnit);
    }
  }, [state.unit, state.location, fetchWeather]);

  const toggleFavorite = useCallback((location) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: location });
  }, []);

  const updateSearchHistory = useCallback((newItem) => {
    const currentHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    const newHistory = [
      newItem,
      ...currentHistory.filter(
        item => !(item.name === newItem.name && item.country === newItem.country)
      )
    ].slice(0, 5);

    localStorage.setItem('weatherSearchHistory', JSON.stringify(newHistory));
    dispatch({ type: 'SET_SEARCH_HISTORY', payload: newHistory });
  }, []);

  const removeFromSearchHistory = useCallback((cityToRemove) => {
    const currentHistory = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];

    const filteredHistory = currentHistory.filter(item => {
      return !(
        item.name.toLowerCase() === cityToRemove.name.toLowerCase() &&
        item.country.toLowerCase() === cityToRemove.country.toLowerCase()
      );
    });

    localStorage.setItem('weatherSearchHistory', JSON.stringify(filteredHistory));
    dispatch({ type: 'SET_SEARCH_HISTORY', payload: filteredHistory });
  }, []);

  const clearSearchHistory = useCallback(() => {
    localStorage.removeItem('weatherSearchHistory');
    dispatch({ type: 'SET_SEARCH_HISTORY', payload: [] });
  }, []);

  return (
    <WeatherContext.Provider
      value={{
        ...state,
        fetchWeather,
        toggleUnit,
        toggleFavorite,
        updateSearchHistory,
        removeFromSearchHistory,
        clearSearchHistory,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}

export { WeatherContext };
