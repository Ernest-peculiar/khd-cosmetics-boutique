
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export const useAdmin = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    // Simple check for admin email
    if (user.email === 'adminadmin123@gmail.com') {
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    // For other users, you can add more complex admin checking logic here
    setIsAdmin(false);
    setLoading(false);
  };

  return { isAdmin, loading };
};
