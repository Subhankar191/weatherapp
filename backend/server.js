// const express = require('express');
// const axios = require('axios');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = 5000;
// const apiKey = process.env.OPENWEATHER_API_KEY;

// if (!apiKey) {
//   console.error("❌ OPENWEATHER_API_KEY is not set in .env");
//   process.exit(1);
// }

// app.use(cors());

// // Helper to resolve city name to lat/lon
// async function resolveLocation(params) {
//   if (params.q) {
//     const geoURL = `https://api.openweathermap.org/geo/1.0/direct?q=${params.q}&limit=1&appid=${apiKey}`;
//     const geoRes = await axios.get(geoURL);
//     if (geoRes.data.length > 0) {
//       const { lat, lon } = geoRes.data[0];
//       return { lat, lon };
//     } else {
//       throw new Error('Invalid location');
//     }
//   }

//   if (!params.lat || !params.lon) {
//     throw new Error('Latitude and Longitude must be provided');
//   }

//   return { lat: params.lat, lon: params.lon };
// }

// // Current weather
// app.get('/api/current', async (req, res) => {
//   try {
//     const { lat, lon } = await resolveLocation(req.query);
//     const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${req.query.units || 'metric'}&appid=${apiKey}`;
//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (err) {
//     console.error('Current weather error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch current weather data' });
//   }
// });

// // 5-day / 3-hour forecast
// app.get('/api/forecast', async (req, res) => {
//   try {
//     const { lat, lon } = await resolveLocation(req.query);
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${req.query.units || 'metric'}&appid=${apiKey}`;
//     const response = await axios.get(url);
//     res.json(response.data);
//   } catch (err) {
//     console.error('Forecast error:', err.message);
//     res.status(500).json({ error: 'Failed to fetch forecast data' });
//   }
// });

// // Hourly (next 24 hours from now)
// app.get('/api/hourly', async (req, res) => {
//   try {
//     const { lat, lon } = await resolveLocation(req.query);
//     const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${req.query.units || 'metric'}&appid=${apiKey}`;
//     const response = await axios.get(url);

//     const now = Math.floor(Date.now() / 1000);         // current timestamp in seconds
//     const next24h = now + 24 * 60 * 60;                // timestamp for 24 hours from now

//     // Filter data points within the next 24 hours
//     const filtered = response.data.list.filter(item => item.dt >= now && item.dt <= next24h);
//     res.json({ list: filtered });
//   } catch (error) {
//     console.error('Hourly forecast error:', error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to fetch hourly forecast data' });
//   }
// });

// // Air Quality
// app.get('/api/air', async (req, res) => {
//   try {
//     const { lat, lon } = await resolveLocation(req.query);
//     const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//     const response = await axios.get(url);
//     res.json(response.data.list[0]);
//   } catch (err) {
//     console.error('Air quality error:', err.response?.data || err.message);
//     res.status(500).json({ error: 'Failed to fetch air quality data' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ✅ CRITICAL FOR RAILWAY: Use dynamic port
const PORT = process.env.PORT || 5000;
const apiKey = process.env.OPENWEATHER_API_KEY;

if (!apiKey) {
  console.error("❌ OPENWEATHER_API_KEY is not set in environment variables");
  console.error("   Make sure to add it in Railway Variables tab");
  // Don't exit in production, just log error
  if (process.env.NODE_ENV === 'development') {
    process.exit(1);
  }
}

// ✅ Configure CORS for production
const allowedOrigins = [
  'https://weather-forecast-app-production.up.railway.app', // Your frontend URL
  'http://localhost:3000' // Local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'CORS policy: Origin not allowed';
      console.log('Blocked origin:', origin);
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

// Optional: Add security middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check endpoint (important for Railway)
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Weather API Backend'
  });
});

// ✅ Root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Weather API is running',
    endpoints: [
      '/api/current - Current weather',
      '/api/forecast - 5-day forecast',
      '/api/hourly - 24-hour forecast',
      '/api/air - Air quality',
      '/api/health - Health check'
    ]
  });
});

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

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 API Key: ${apiKey ? 'Set' : 'Not set!'}`);
});