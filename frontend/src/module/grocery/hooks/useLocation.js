import { useState, useEffect } from 'react';

// For now providing a simple hook that returns a default location
// In a real app, this would use Geolocation API or a Context
export function useLocation() {
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: 'Select Location'
  });

  return {
    location,
    setLocation,
    isLoading: false,
    error: null
  };
}
