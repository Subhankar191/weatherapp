import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const api = setupCache(axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000, // 10 seconds
}));

export default api;
