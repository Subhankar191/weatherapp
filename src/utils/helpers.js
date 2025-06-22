export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const convertTemp = (temp, unit) => {
  return unit === 'metric' ? temp : (temp * 9/5) + 32;
};

export const getWindDirection = (degrees) => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round((degrees % 360) / 45) % 8;
  return directions[index];
};

export const getTimeFromTimestamp = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  if (isNaN(date.getTime())) return 'Invalid';
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getDayFromTimestamp = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  if (isNaN(date.getTime())) return 'Invalid';
  return date.toLocaleDateString([], {
    weekday: 'short',
  });
};