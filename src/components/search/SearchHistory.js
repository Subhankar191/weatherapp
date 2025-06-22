import { useWeather } from '../../hooks';
import { motion } from 'framer-motion';
import { slideUp, staggerChildren } from '../../utils/animations';
import { FiClock } from 'react-icons/fi';

const SearchHistory = () => {
  const { searchHistory, fetchWeather } = useWeather();

  if (searchHistory.length === 0) return null;

  return (
    <motion.div 
      className="search-history"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <h4>Recent Searches</h4>
      <div className="history-list">
        {searchHistory.map((item, index) => (
          <motion.div
            key={index}
            className="history-item"
            variants={slideUp}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fetchWeather(`${item.name},${item.country}`)}
          >
            <FiClock />
            <span>{item.name}, {item.country}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchHistory;