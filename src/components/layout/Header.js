import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts';
import { useWeather } from '../../hooks'; // ✅ For unit toggle
import { ThemeToggle } from '../ui';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const Header = () => {
  const { theme } = useTheme();
  const { unit, toggleUnit } = useWeather(); // ✅ Get unit and toggle function

  return (
    <motion.header 
      className={`app-header ${theme}`}
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>WeatherSphere</h1>
        </Link>
        
        <nav className="nav-links flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/settings">Settings</Link>

          {/* 🌡️ Unit Toggle Button */}
          <button 
            onClick={toggleUnit}
            className="px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Toggle Unit"
          >
            {unit === 'metric' ? '°F / mph' : '°C / m/s'}
          </button>

          {/* 🌓 Theme Toggle */}
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
