import { useWeather } from '../../hooks';
import { motion } from 'framer-motion';
import { slideUp, staggerChildren, whileHover, whileTap } from '../../utils/animations';
import { FiClock } from 'react-icons/fi';
import { FaTrash, FaTrashAlt } from 'react-icons/fa';

const RecentSearches = () => {
  const { 
    searchHistory, 
    fetchWeather, 
    updateSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory
  } = useWeather();

  const handleSearch = (city) => {
    fetchWeather(`${city.name},${city.country}`);
    updateSearchHistory(city);
  };

  const removeSearch = (index, e) => {
    e.stopPropagation();
    const city = searchHistory[index];
    console.log('--- removeFromSearchHistory initiated from RecentSearches ---');
    console.log('City object being sent for removal:', city);
    console.log('Current searchHistory array:', searchHistory);
    removeFromSearchHistory(city);
};

  // ✅ Define this missing function
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all recent searches?')) {
      clearSearchHistory();
    }
  };

  if (searchHistory.length === 0) return null;

  return (
    <motion.div 
      className="recent-searches"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <div className="recent-searches-header flex justify-between items-center mb-2">
        <h4>Recent Searches</h4>
        <motion.button
          className="text-sm flex items-center gap-1 bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded-md"
          onClick={handleClearAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTrashAlt />
          Clear All
        </motion.button>
      </div>

      <motion.ul className="searches-list" variants={staggerChildren}>
        {searchHistory.map((item, index) => (
          <motion.li
            key={`${item.name}-${index}`}
            className="search-item"
            variants={slideUp}
            whileHover={whileHover}
            whileTap={whileTap}
            onClick={() => handleSearch(item)}
          >
            <div className="search-info">
              <FiClock className="clock-icon" />
              <span>{item.name}, {item.country}</span>
            </div>
            <motion.button 
              className="remove-btn"
              onClick={(e) => removeSearch(index, e)}
              aria-label={`Remove ${item.name} from history`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTrash size={12} />
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default RecentSearches;
