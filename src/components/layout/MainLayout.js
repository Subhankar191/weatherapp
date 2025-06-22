import Header from './Header';
import Footer from './Footer';
import { AnimatedBackground } from '../ui';
import { useWeather } from '../../hooks';

const MainLayout = ({ children }) => {
  const { weatherData } = useWeather();

  return (
    <div className="app-container">
      <Header />
      <AnimatedBackground weather={weatherData?.weather[0].main} />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;