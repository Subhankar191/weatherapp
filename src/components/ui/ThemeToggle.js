import { motion } from 'framer-motion';
import { useTheme } from '../../contexts';
import { FaSun, FaMoon } from 'react-icons/fa';
import { whileHover, whileTap } from '../../utils/animations';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileHover={whileHover}
      whileTap={whileTap}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FaMoon size={20} />
      ) : (
        <FaSun size={20} />
      )}
    </motion.button>
  );
};

export default ThemeToggle;