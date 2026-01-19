// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;
const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error("❌ OPENWEATHER_API_KEY is not set in .env");
  process.exit(1);
}

app.use(cors());

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

    const now = Math.floor(Date.now() / 1000);         // current timestamp in seconds
    const next24h = now + 24 * 60 * 60;                // timestamp for 24 hours from now

    // Filter data points within the next 24 hours
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

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });

// Only listen if we are NOT in production (running locally)
if (process.env.NODE_ENV !== 'production') {
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export the app for Vercel
module.exports = app;
