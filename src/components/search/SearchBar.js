import { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { fadeIn } from '../../utils/animations';
import { useWeather } from '../../hooks';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const { updateSearchHistory } = useWeather();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      updateSearchHistory({ name: query.split(',')[0], country: '' });
      setQuery('');
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="search-bar"
      initial={fadeIn.hidden}
      animate={fadeIn.visible}
    >
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          aria-label="Search for a city"
        />
        {query && (
          <button 
            type="button" 
            className="clear-btn"
            onClick={() => setQuery('')}
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}
      </div>
      <button 
        type="submit" 
        disabled={loading || !query.trim()}
        className="search-btn"
      >
        {loading ? 'Searching...' : <FiSearch />}
      </button>
    </motion.form>
  );
};

export default SearchBar;