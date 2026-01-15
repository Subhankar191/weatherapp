const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error("❌ OPENWEATHER_API_KEY is not set in environment variables");
  // Don't exit in production, Render will show error in logs
}

// Configure CORS for production
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  'https://weather-app-frontend.onrender.com' // Update after deployment
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      console.log('Blocked origin:', origin);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Helper to resolve city name to lat/lon
async function resolveLocation(params) {
  if (params.q) {
    const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${params.q}&limit=1&appid=${apiKey}`;
    const geoRes = await axios.get(geoURL);
    if (geoRes.data.length > 0) {
      const { lat, lon } = geoRes.data[0];
      return { lat, lon };
    } else {
      throw new Error('Invalid location');
    }
  }

  if (!params.lat || !params.lon) {
    throw new Error('Latitude and Longitude must be provided');
  }

  return { lat: params.lat, lon: params.lon };
}

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Weather API Backend',
    status: 'running',
    endpoints: [
      '/api/current?q=London',
      '/api/forecast?q=London',
      '/api/hourly?q=London',
      '/api/air?q=London'
    ]
  });
});

// Current weather
app.get('/api/current', async (req, res) => {
  try {
    const { lat, lon } = await resolveLocation(req.query);
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${req.query.units || 'metric'}&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Current weather error:', err.message);
    res.status(500).json({ error: 'Failed to fetch current weather data' });
  }
});

// 5-day / 3-hour forecast
app.get('/api/forecast', async (req, res) => {
  try {
    const { lat, lon } = await resolveLocation(req.query);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${req.query.units || 'metric'}&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error('Forecast error:', err.message);
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

// Hourly (next 24 hours from now)
app.get('/api/hourly', async (req, res) => {
  try {
    const { lat, lon } = await resolveLocation(req.query);
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${req.query.units || 'metric'}&appid=${apiKey}`;
    const response = await axios.get(url);

    const now = Math.floor(Date.now() / 1000);
    const next24h = now + 24 * 60 * 60;

    const filtered = response.data.list.filter(item => item.dt >= now && item.dt <= next24h);
    res.json({ list: filtered });
  } catch (error) {
    console.error('Hourly forecast error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch hourly forecast data' });
  }
});

// Air Quality
app.get('/api/air', async (req, res) => {
  try {
    const { lat, lon } = await resolveLocation(req.query);
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await axios.get(url);
    res.json(response.data.list[0]);
  } catch (err) {
    console.error('Air quality error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch air quality data' });
  }
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ Weather backend running on port ${PORT}`);
  console.log(`🌐 OpenWeather API Key: ${apiKey ? 'Set' : 'Not Set'}`);
});