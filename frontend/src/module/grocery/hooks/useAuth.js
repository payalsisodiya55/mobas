import { useState, useEffect } from 'react';
import { isModuleAuthenticated, clearModuleAuth } from '@/lib/utils/auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => isModuleAuthenticated('user'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user_user');
    return saved ? JSON.parse(saved) : null;
  });

  const logout = () => {
    clearModuleAuth('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = () => {
      const auth = isModuleAuthenticated('user');
      setIsAuthenticated(auth);
      const saved = localStorage.getItem('user_user');
      setUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener('storage', checkAuth);
    window.addEventListener('userAuthChanged', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('userAuthChanged', checkAuth);
    };
  }, []);

  return {
    isAuthenticated,
    user,
    logout
  };
}
