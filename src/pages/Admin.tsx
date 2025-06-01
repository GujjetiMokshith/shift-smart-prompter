
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import AdminPanel from '@/components/AdminPanel';
import { Toaster } from 'sonner';

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }

      // Check if user is the specific admin user
      const isSpecificAdmin = user.id === '9333c569-7470-4e13-a264-77390556f659';
      
      if (isSpecificAdmin) {
        // Ensure admin role is set
        await supabase.rpc('ensure_admin_role');
        setHasAccess(true);
      } else {
        // Check database for admin role
        const { data: adminStatus, error } = await supabase.rpc('is_admin');
        
        if (error) {
          console.error('Error checking admin status:', error);
          navigate('/');
          return;
        }
        
        if (!adminStatus) {
          navigate('/');
          return;
        }
        
        setHasAccess(true);
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mb-4" />
            <p className="text-white/70">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col bg-[#050A14] text-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
            <p className="text-white/70">You don't have permission to access this area.</p>
          </div>
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
