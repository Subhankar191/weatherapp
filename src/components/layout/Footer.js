import { useTheme } from '../../contexts';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <motion.footer
      className={`app-footer ${theme}`}
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <p>© {new Date().getFullYear()} WeatherSphere - Powered by OpenWeatherMap</p>
      <p className="disclaimer">
        Weather data may be delayed by up to 15 minutes. Use for planning purposes only.
      </p>
    </motion.footer>
  );
};

export default Footer;