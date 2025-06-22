import { motion } from 'framer-motion';
import { FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import { slideUp, staggerChildren } from '../../utils/animations';
import { useWeather } from '../../hooks';

const FavoriteCities = ({ onSelect }) => {
  const { favorites, toggleFavorite } = useWeather();

  if (!favorites || favorites.length === 0) {
    return (
      <motion.div
        className="favorite-cities empty text-center text-gray-600 dark:text-gray-400 mt-4"
        initial={slideUp.hidden}
        animate={slideUp.visible}
      >
        <p>No favorite cities yet. Add some to see them here!</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="favorite-cities max-w-md mx-auto mt-6"
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
    >
      <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white text-center">
        Favorite Cities
      </h3>

      <div className="favorites-list space-y-3">
        {favorites.map((city, index) => (
          <motion.div
            key={`${city.name}-${city.country}-${index}`}
            className="favorite-item flex items-center justify-between bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-lg shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            variants={slideUp}
          >
            <div
              className="favorite-content flex items-center gap-2 cursor-pointer"
              onClick={() => onSelect(city)}
            >
              <FaMapMarkerAlt className="text-gray-500 dark:text-gray-300" />
              <span className="text-sm truncate">{city.name}, {city.country}</span>
            </div>

            <button
              className="remove-btn text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
              onClick={(e) => {
                e.stopPropagation(); 
                toggleFavorite({ name: city.name, country: city.country });
              }}
              aria-label={`Remove ${city.name}`}
            >
              <FaTimes size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FavoriteCities;
