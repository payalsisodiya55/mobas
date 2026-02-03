import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getTheme } from '../utils/themes';

export function useTheme() {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    // Determine category from URL if needed
    if (location.pathname === '/grocery') {
        setActiveCategory('all');
    }
  }, [location.pathname]);

  const theme = getTheme(activeCategory);

  return {
    activeCategory,
    setActiveCategory,
    theme
  };
}
