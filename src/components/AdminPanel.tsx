import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Users, Activity, Settings, Search } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
}

interface UserStats {
  total_users: number;
  active_users_today: number;
  total_prompts: number;
  average_session_duration: string;
}

const AdminPanel = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    active_users_today: 0,
    total_prompts: 0,
    average_session_duration: '0m'
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    checkAdminAccess();
    loadDashboardData();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== '9333c569-7470-4e13-a264-77390556f659') {
      window.location.href = '/';
      return;
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load users
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Get statistics
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_dashboard_stats');

      if (statsError) throw statsError;

      setUsers(users || []);
      setStats(statsData || {
        total_users: users?.length || 0,
        active_users_today: 0,
        total_prompts: 0,
        average_session_duration: '0m'
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gradient-blue">Admin Dashboard</h1>
        <Button
          onClick={loadDashboardData}
          variant="outline"
          className="hover-glow"
        >
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_users}</div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Active Today
            </CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.active_users_today}
            </div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Prompts
            </CardTitle>
            <Settings className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.total_prompts}
            </div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Avg. Session
            </CardTitle>
            <Activity className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.average_session_duration}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-white/40" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm bg-[#060B16] border-white/10"
            />
          </div>

          <div className="rounded-md border border-white/10">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5">
                  <TableHead className="text-white/70">Email</TableHead>
                  <TableHead className="text-white/70">Joined</TableHead>
                  <TableHead className="text-white/70">Last Active</TableHead>
                  <TableHead className="text-white/70">Plan</TableHead>
                  <TableHead className="text-white/70">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleDateString()
                        : 'Never'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      Free
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:text-blue-400 hover:bg-blue-400/10"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bolt-card">
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Detailed analytics and usage statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              Analytics content coming soon...
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bolt-card">
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Manage system-wide settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              Settings content coming soon...
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;