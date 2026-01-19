import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

// const API_BASE = 'http://localhost:5000/api'; // Your backend proxy URL

const API_BASE = '/api';

const http = setupCache(axios.create({
  baseURL: API_BASE,
  timeout: 10000,
}));

const getCacheKey = (type, params) => {
  const locationKey = params.q ? params.q : `${params.lat},${params.lon}`;
  return `${type}-${locationKey}-${params.units}`;
};

// Current weather
export const fetchCurrentWeather = async (location, units = 'metric') => {
  const params = {
    units,
  };

  if (typeof location === 'string') {
    params.q = location;
  } else {
    params.lat = location.lat;
    params.lon = location.lon;
  }

  const response = await http.get('/current', {
    params,
    cache: {
      ttl: 15 * 60 * 1000,
      key: getCacheKey('weather', params),
    },
  });

  return response.data;
};

// Forecast (e.g. next 24 hours or 8 intervals)
export const fetchForecast = async (location, units = 'metric') => {
  const params = {
    units,
    cnt: 8,
  };

  if (typeof location === 'string') {
    params.q = location;
  } else {
    params.lat = location.lat;
    params.lon = location.lon;
  }

  const response = await http.get('/forecast', {
    params,
    cache: {
      ttl: 30 * 60 * 1000,
      key: getCacheKey('forecast', params),
    },
  });

  return response.data;
};

// 3-hour interval forecast (replacing unsupported hourly)
export const fetchHourlyForecast = async (location, units = 'metric') => {
  const params = {
    units,
  };

  if (typeof location === 'string') {
    params.q = location;
  } else {
    params.lat = location.lat;
    params.lon = location.lon;
  }

  const response = await http.get('/hourly', {
    params,
    cache: {
      ttl: 15 * 60 * 1000,
      key: getCacheKey('hourly', params),
    },
  });

  // Return the next 8 intervals (24 hours worth of data at 3-hour intervals)
  return response.data.list.slice(0, 8);
};

// Air quality
export const fetchAirQuality = async (location) => {
  const params = {};

  if (typeof location === 'string') {
    params.q = location;
  } else {
    params.lat = location.lat;
    params.lon = location.lon;
  }

  const response = await http.get('/air', {
    params,
    cache: {
      ttl: 60 * 60 * 1000,
      key: getCacheKey('air', params),
    },
  });

  return response.data;
};
