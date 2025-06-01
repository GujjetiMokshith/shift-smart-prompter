
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
import { 
  Users, 
  Activity, 
  Settings, 
  Search,
  BarChart3,
  Clock,
  Zap,
  Shield
} from 'lucide-react';

interface DashboardStats {
  total_users: number;
  active_users_today: number;
  total_sessions: number;
  total_prompts: number;
  average_session_duration: string;
  onboarding_completion_rate: number;
}

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  plan_type: string;
  prompts_used: number;
  created_at: string;
  last_sign_in_at?: string;
  role?: string;
  onboarding_completed?: boolean;
}

interface OnboardingResponse {
  id: string;
  user_id: string;
  responses: any;
  completed_at: string;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    active_users_today: 0,
    total_sessions: 0,
    total_prompts: 0,
    average_session_duration: '0m',
    onboarding_completion_rate: 0
  });
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [onboardingData, setOnboardingData] = useState<OnboardingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load users with roles
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles(role)
        `)
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Load onboarding responses
      const { data: onboardingData, error: onboardingError } = await supabase
        .from('onboarding_responses')
        .select(`
          *,
          profiles(email)
        `);

      if (onboardingError) throw onboardingError;

      // Load session statistics
      const { data: sessionStats, error: sessionError } = await supabase
        .from('user_sessions')
        .select('duration_seconds, created_at');

      if (sessionError) throw sessionError;

      // Load prompt statistics
      const { data: promptStats, error: promptError } = await supabase
        .from('enhanced_prompts')
        .select('created_at');

      if (promptError) throw promptError;

      // Calculate statistics
      const totalUsers = usersData?.length || 0;
      const today = new Date().toISOString().split('T')[0];
      const activeToday = sessionStats?.filter(s => 
        s.created_at.startsWith(today)
      ).length || 0;

      const avgDuration = sessionStats?.length 
        ? Math.round(sessionStats.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessionStats.length / 60)
        : 0;

      const onboardingCompletionRate = totalUsers > 0 
        ? Math.round((onboardingData?.length || 0) / totalUsers * 100)
        : 0;

      setStats({
        total_users: totalUsers,
        active_users_today: activeToday,
        total_sessions: sessionStats?.length || 0,
        total_prompts: promptStats?.length || 0,
        average_session_duration: `${avgDuration}m`,
        onboarding_completion_rate: onboardingCompletionRate
      });

      // Process users data
      const processedUsers = usersData?.map(user => ({
        ...user,
        role: user.user_roles?.[0]?.role || 'user',
        onboarding_completed: onboardingData?.some(o => o.user_id === user.id)
      })) || [];

      setUsers(processedUsers);

      // Process onboarding data
      const processedOnboarding = onboardingData?.map(item => ({
        ...item,
        email: item.profiles?.email || 'Unknown'
      })) || [];

      setOnboardingData(processedOnboarding);

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
      <div className="flex items-center justify-center h-full">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-blue">Admin Dashboard</h1>
          <p className="text-white/70">Comprehensive system overview and management</p>
        </div>
        <Button
          onClick={loadDashboardData}
          variant="outline"
          className="hover-glow"
        >
          Refresh Data
        </Button>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
            <div className="text-2xl font-bold text-white">{stats.active_users_today}</div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Sessions
            </CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_sessions}</div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Prompts
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total_prompts}</div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Avg. Session
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.average_session_duration}</div>
          </CardContent>
        </Card>

        <Card className="bolt-card hover-border-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Onboarding %
            </CardTitle>
            <Shield className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.onboarding_completion_rate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
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
                  <TableHead className="text-white/70">Name</TableHead>
                  <TableHead className="text-white/70">Role</TableHead>
                  <TableHead className="text-white/70">Plan</TableHead>
                  <TableHead className="text-white/70">Prompts Used</TableHead>
                  <TableHead className="text-white/70">Onboarded</TableHead>
                  <TableHead className="text-white/70">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-white/5">
                    <TableCell className="font-medium text-white">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {user.full_name || 'Not set'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-red-900/30 text-red-400' : 'bg-gray-700/30 text-gray-400'
                      }`}>
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {user.plan_type || 'Free'}
                    </TableCell>
                    <TableCell className="text-white/70">
                      {user.prompts_used || 0}
                    </TableCell>
                    <TableCell className="text-white/70">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.onboarding_completed ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        {user.onboarding_completed ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell className="text-white/70">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <Card className="bolt-card">
            <CardHeader>
              <CardTitle>Onboarding Insights</CardTitle>
              <CardDescription>
                User onboarding responses and completion analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {onboardingData.map((response) => (
                  <Card key={response.id} className="bg-[#060B16] border-white/10">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm">{response.email}</CardTitle>
                        <span className="text-xs text-white/50">
                          {new Date(response.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-white/70">Experience: </span>
                          <span className="text-white">{response.responses.experience_level || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-white/70">Use Case: </span>
                          <span className="text-white">{response.responses.primary_use_case || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-white/70">Preferred Models: </span>
                          <span className="text-white">
                            {response.responses.preferred_models?.join(', ') || 'None selected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/70">Company Size: </span>
                          <span className="text-white">{response.responses.company_size || 'Not specified'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
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
              <div className="text-white/70">
                Advanced analytics features coming soon...
                <br />
                Current data: {stats.total_sessions} sessions, {stats.total_prompts} prompts enhanced
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="bolt-card">
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>
                System-wide settings and maintenance tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-white/70">
                  System management features:
                </div>
                <ul className="list-disc list-inside text-white/60 space-y-2">
                  <li>Database health monitoring</li>
                  <li>User session management</li>
                  <li>Performance optimization</li>
                  <li>Security audit logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
