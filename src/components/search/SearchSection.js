import SearchBar from './SearchBar';
import RecentSearches from './RecentSearches';
import { useWeather } from '../../hooks'; 

const SearchSection = () => {
  const { fetchWeather } = useWeather();

  const handleSearch = (query) => {
    fetchWeather(query); 
  };

  return (
    <div className="search-section">
      <SearchBar onSearch={handleSearch} />
      <RecentSearches />
    </div>
  );
};

export default SearchSection;
