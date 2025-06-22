import { useNavigate } from 'react-router-dom';
import { useWeather } from '../hooks';
import { MainLayout } from '../components/layout';
import { FavoriteCities } from '../components/favorites';
import { LoadingSpinner } from '../components/ui';

const FavoritesPage = () => {
  const { fetchWeather, loading } = useWeather();
  const navigate = useNavigate();

  const handleSelectFavorite = (city) => {
    fetchWeather(`${city.name},${city.country}`);
    navigate('/');
  };

  return (
    <MainLayout>
      <h2>Favorite Locations</h2>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <FavoriteCities onSelect={handleSelectFavorite} />
      )}
    </MainLayout>
  );
};

export default FavoritesPage;