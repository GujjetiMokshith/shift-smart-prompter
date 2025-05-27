import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';
import { Toaster } from 'sonner';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || user.id !== '9333c569-7470-4e13-a264-77390556f659') {
        navigate('/');
        return;
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
      <Header />
      <main className="flex-1">
        <AdminPanel />
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Admin;