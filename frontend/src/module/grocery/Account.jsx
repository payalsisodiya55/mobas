import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { useAuth } from './hooks/useAuth';
import { getProfile } from './services/api/profileService';

export default function Account() {
  const navigate = useNavigate();
  const { user, logout: authLogout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showGstModal, setShowGstModal] = useState(false);
  const [gstNumber, setGstNumber] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        if (response.success) {
          setProfile(response.data);
        }
      } catch (err) {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  if (loading) return <div className="p-10 text-center">Loading profile...</div>;

  const displayName = profile?.name || user?.name || 'User';

  return (
    <div className="pb-24 md:pb-8 bg-white min-h-screen">
      <div className="bg-gradient-to-b from-green-200 via-green-100 to-white pb-6 md:pb-8 pt-12 md:pt-16">
        <div className="px-4 md:px-6 lg:px-8">
          <button onClick={() => navigate(-1)} className="mb-4 text-neutral-900">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-neutral-200 flex items-center justify-center mb-3 md:mb-4 border-2 border-white shadow-sm font-bold text-2xl text-neutral-500">
              {displayName.charAt(0)}
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-2">{displayName}</h1>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 mt-6 max-w-md mx-auto space-y-4">
          <button onClick={() => navigate('/grocery/orders')} className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-neutral-50 transition-colors">
            <span className="font-bold">My Orders</span>
            <span>›</span>
          </button>
          <button onClick={() => navigate('/grocery/categories')} className="w-full flex items-center justify-between p-4 bg-white border rounded-xl hover:bg-neutral-50 transition-colors">
            <span className="font-bold">Browse Categories</span>
            <span>›</span>
          </button>
          <button onClick={handleLogout} className="w-full p-4 bg-red-50 text-red-600 font-bold rounded-xl text-center">
            Logout
          </button>
      </div>
    </div>
  );
}
