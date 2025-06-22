import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';

const LoadingSpinner = () => {
  return (
    <motion.div 
      className="loading-spinner"
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <div className="spinner"></div>
      <p>Loading weather data...</p>
    </motion.div>
  );
};

export default LoadingSpinner;