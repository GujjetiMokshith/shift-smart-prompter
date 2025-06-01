
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Database,
  Settings,
  Activity,
  BarChart3,
  Calendar,
  Coffee
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  prompts_used: number | null;
  created_at: string | null;
  updated_at: string | null;
}

interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  metadata: any;
  created_at: string;
  page_url: string | null;
}

interface SystemStats {
  totalUsers: number;
  totalPrompts: number;
  totalEvents: number;
  activeUsers: number;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalPrompts: 0,
    totalEvents: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load users data
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (usersError) throw usersError;

      // Load recent events
      const { data: eventsData, error: eventsError } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) throw eventsError;

      // Calculate stats
      const totalUsers = usersData?.length || 0;
      const totalPrompts = usersData?.reduce((sum, user) => sum + (user.prompts_used || 0), 0) || 0;
      const totalEvents = eventsData?.length || 0;
      
      // Active users in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = usersData?.filter(user => 
        user.updated_at && new Date(user.updated_at) > thirtyDaysAgo
      ).length || 0;

      setUsers(usersData || []);
      setEvents(eventsData || []);
      setStats({
        totalUsers,
        totalPrompts,
        totalEvents,
        activeUsers
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="loading-spinner mb-4" />
          <p className="text-white/70">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/70">Manage your PromptShift application</p>
        </div>
        <Button 
          onClick={loadDashboardData}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Activity className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#060B16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-white/60">Free service users</p>
          </CardContent>
        </Card>

        <Card className="bg-[#060B16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Prompts</CardTitle>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalPrompts}</div>
            <p className="text-xs text-white/60">Enhanced prompts</p>
          </CardContent>
        </Card>

        <Card className="bg-[#060B16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
            <p className="text-xs text-white/60">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-[#060B16] border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/80">Total Events</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalEvents}</div>
            <p className="text-xs text-white/60">Analytics events</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-[#060B16] border-white/10">
          <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="events" className="data-[state=active]:bg-blue-600">
            <Activity className="mr-2 h-4 w-4" />
            Events
          </TabsTrigger>
          <TabsTrigger value="support" className="data-[state=active]:bg-blue-600">
            <Coffee className="mr-2 h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-[#060B16] border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">User Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="search" className="text-white/70">Search:</Label>
                  <Input
                    id="search"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 bg-[#050A14] border-white/20"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/80">User</TableHead>
                    <TableHead className="text-white/80">Email</TableHead>
                    <TableHead className="text-white/80">Prompts Used</TableHead>
                    <TableHead className="text-white/80">Joined</TableHead>
                    <TableHead className="text-white/80">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-white/10">
                      <TableCell className="text-white">
                        {user.full_name || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {user.email || 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {user.prompts_used || 0}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-900/20 text-green-400">
                          Free User
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-[#060B16] border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/80">Event Type</TableHead>
                    <TableHead className="text-white/80">User ID</TableHead>
                    <TableHead className="text-white/80">Page</TableHead>
                    <TableHead className="text-white/80">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id} className="border-white/10">
                      <TableCell>
                        <Badge variant="outline" className="border-blue-500/20 text-blue-400">
                          {event.event_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/70 font-mono text-xs">
                        {event.user_id ? event.user_id.substring(0, 8) + '...' : 'Anonymous'}
                      </TableCell>
                      <TableCell className="text-white/70 text-xs">
                        {event.page_url ? new URL(event.page_url).pathname : 'N/A'}
                      </TableCell>
                      <TableCell className="text-white/70">
                        {new Date(event.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card className="bg-[#060B16] border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-500" />
                Community Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white/70">
                PromptShift is completely free to use. Our community supports the service through voluntary contributions.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-[#050A14] border-amber-500/20">
                  <CardContent className="p-4">
                    <h3 className="text-amber-400 font-semibold mb-2">Buy Me a Coffee</h3>
                    <p className="text-white/60 text-sm mb-3">
                      Support our development and server costs
                    </p>
                    <Button 
                      className="w-full bg-amber-600 hover:bg-amber-700"
                      onClick={() => window.open('https://buymeacoffee.com/promptshift', '_blank')}
                    >
                      <Coffee className="mr-2 h-4 w-4" />
                      Support Us
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-[#050A14] border-blue-500/20">
                  <CardContent className="p-4">
                    <h3 className="text-blue-400 font-semibold mb-2">Free Forever</h3>
                    <p className="text-white/60 text-sm mb-3">
                      No limits, no subscriptions, no hidden costs
                    </p>
                    <Badge variant="secondary" className="bg-green-900/20 text-green-400">
                      100% Free Service
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
