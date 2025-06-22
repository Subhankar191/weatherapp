import L from 'leaflet';

export const createWeatherIcon = (iconCode) => {
  return L.icon({
    iconUrl: `https://openweathermap.org/img/wn/${iconCode}@2x.png`,
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
  });
};

export const createMarkerLayer = (locations) => {
  return locations.map(location => {
    const marker = L.marker([location.lat, location.lon], {
      icon: createWeatherIcon(location.icon),
    });
    marker.bindPopup(`
      <div>
        <h4>${location.name}</h4>
        <p>${location.temp}°</p>
        <p>${location.description}</p>
      </div>
    `);
    return marker;
  });
};