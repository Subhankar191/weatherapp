import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useWeather } from '../../hooks';

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 10);
    }
  }, [center, map]);
  return null;
};

const WeatherMap = () => {
  const { location, weatherData } = useWeather();

  if (!location || !weatherData) return null;

  const weatherIcon = L.icon({
    iconUrl: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
  });

  return (
    <div className="weather-map-container">
      <h3>Location Map</h3>
      <MapContainer
        center={[location.lat, location.lon]}
        zoom={10}
        scrollWheelZoom={false}
        style={{ height: '300px', width: '100%', borderRadius: '8px' }}
      >
        <MapUpdater center={[location.lat, location.lon]} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.lat, location.lon]} icon={weatherIcon}>
          <Popup>
            <div>
              <h4>{weatherData.name}</h4>
              <p>{Math.round(weatherData.main.temp)}°</p>
              <p>{weatherData.weather[0].description}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
