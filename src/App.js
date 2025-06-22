import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WeatherProvider, ThemeProvider } from './contexts';
import { HomePage, FavoritesPage, SettingsPage } from './pages';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Router>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;
