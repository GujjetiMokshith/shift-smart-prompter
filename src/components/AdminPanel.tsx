
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminDashboard from './AdminDashboard';
import { toast } from 'sonner';

const AdminPanel = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Check if user is the specific admin
      const isSpecificAdmin = user.id === '9333c569-7470-4e13-a264-77390556f659';
      
      if (isSpecificAdmin) {
        // Ensure admin role is set in database
        await supabase.rpc('ensure_admin_role');
      }

      // Double-check admin status from database
      const { data: adminCheck, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
      }

      const hasAdminAccess = isSpecificAdmin || adminCheck;
      setIsAdmin(hasAdminAccess);
      
      if (!hasAdminAccess) {
        toast.error('Access denied. Admin privileges required.');
      }
      
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast.error('Failed to verify admin access');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner mb-4" />
          <p className="text-white/70">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Access Denied</h2>
          <p className="text-white/70">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminPanel;
