import { useEffect, useState } from 'react';
import { useTheme } from '../../contexts';

const AnimatedBackground = ({ weather }) => {
  const { theme } = useTheme();
  const [backgroundClass, setBackgroundClass] = useState('default');

  useEffect(() => {
    if (!weather) return;

    const weatherMain = weather.toLowerCase();
    let newClass = 'default';

    if (weatherMain.includes('rain')) {
      newClass = 'rain';
    } else if (weatherMain.includes('snow')) {
      newClass = 'snow';
    } else if (weatherMain.includes('cloud')) {
      newClass = 'clouds';
    } else if (weatherMain.includes('clear')) {
      const hours = new Date().getHours();
      newClass = hours > 6 && hours < 20 ? 'clear-day' : 'clear-night';
    } else if (weatherMain.includes('thunderstorm')) {
      newClass = 'thunderstorm';
    } else if (weatherMain.includes('mist') || weatherMain.includes('fog')) {
      newClass = 'fog';
    }

    setBackgroundClass(newClass);
  }, [weather]);

  return (
    <div className={`animated-background ${backgroundClass} ${theme}`}>
      {backgroundClass === 'rain' && (
        <>
          {[...Array(50)].map((_, i) => (
            <div key={i} className="raindrop" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${0.5 + Math.random() * 0.5}s`,
              animationDelay: `${Math.random() * 0.5}s`,
            }} />
          ))}
        </>
      )}
      {backgroundClass === 'snow' && (
        <>
          {[...Array(30)].map((_, i) => (
            <div key={i} className="snowflake" style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.5 + Math.random() * 0.5,
              transform: `scale(${0.5 + Math.random()})`,
            }} />
          ))}
        </>
      )}
    </div>
  );
};

export default AnimatedBackground;