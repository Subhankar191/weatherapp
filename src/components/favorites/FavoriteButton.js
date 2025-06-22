import { useWeather } from '../../hooks';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { whileHover, whileTap } from '../../utils/animations';

const FavoriteButton = ({ location }) => {
  const { favorites, toggleFavorite } = useWeather();
  
  const isFavorite = favorites.some(
    fav => fav.name === location.name && fav.country === location.country
  );

  return (
    <motion.button
      className="favorite-btn"
      onClick={() => toggleFavorite(location)}
      whileHover={whileHover}
      whileTap={whileTap}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart color="#e74c3c" />
      ) : (
        <FaRegHeart />
      )}
    </motion.button>
  );
};

export default FavoriteButton;