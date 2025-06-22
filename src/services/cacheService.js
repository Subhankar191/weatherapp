export const getCachedData = (key) => {
  const cachedData = localStorage.getItem(key);
  if (!cachedData) return null;
  
  const { data, timestamp } = JSON.parse(cachedData);
  const now = new Date().getTime();
  
  // Check if cache is older than 30 minutes
  if (now - timestamp > 30 * 60 * 1000) {
    localStorage.removeItem(key);
    return null;
  }
  
  return data;
};

export const setCachedData = (key, data) => {
  const timestamp = new Date().getTime();
  localStorage.setItem(key, JSON.stringify({ data, timestamp }));
};