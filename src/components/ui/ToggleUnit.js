import { motion } from 'framer-motion';
import { useWeather } from '../../hooks';
import { whileHover, whileTap } from '../../utils/animations';

const ToggleUnit = () => {
  const { unit, toggleUnit } = useWeather();

  return (
    <motion.button
      className="unit-toggle"
      onClick={toggleUnit}
      whileHover={whileHover}
      whileTap={whileTap}
      aria-label={`Switch to ${unit === 'metric' ? 'imperial' : 'metric'} units`}
    >
      {unit === 'metric' ? '°C' : '°F'}
    </motion.button>
  );
};

export default ToggleUnit;