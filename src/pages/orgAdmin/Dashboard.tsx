import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  MessageSquare
} from 'lucide-react';

// Types for our data models
interface Project {
  id: string;
  name: string;
  status: 'on-track' | 'at-risk' | 'delayed';
  progress: number;
  tasks: {
    total: number;
    completed: number;
    overdue: number;
  };
  team: string[];
  deadline: string;
  client: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  capacity: number;
  assigned: number;
}

interface TaskSummary {
  status: string;
  count: number;
}

interface RecentActivity {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  avatar: string;
}

// Mock data for demonstration
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform Redesign',
    status: 'on-track',
    progress: 68,
    tasks: { total: 45, completed: 30, overdue: 2 },
    team: ['team1', 'team2'],
    deadline: '2025-04-30',
    client: 'GlobalShop Inc.'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'at-risk',
    progress: 42,
    tasks: { total: 78, completed: 32, overdue: 8 },
    team: ['team3'],
    deadline: '2025-05-15',
    client: 'TechStartup Ltd.'
  },
  {
    id: '3',
    name: 'Marketing Campaign Analytics',
    status: 'delayed',
    progress: 35,
    tasks: { total: 28, completed: 9, overdue: 7 },
    team: ['team1', 'team4'],
    deadline: '2025-04-10',
    client: 'AdGenius Co.'
  },
  {
    id: '4',
    name: 'Customer Portal Enhancement',
    status: 'on-track',
    progress: 85,
    tasks: { total: 34, completed: 29, overdue: 0 },
    team: ['team2'],
    deadline: '2025-06-01',
    client: 'ServiceHub Ltd.'
  }
];

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Smith', role: 'Frontend Developer', avatar: '/avatars/alex.jpg', capacity: 100, assigned: 85 },
  { id: '2', name: 'Jamie Lee', role: 'UX Designer', avatar: '/avatars/jamie.jpg', capacity: 100, assigned: 110 },
  { id: '3', name: 'Morgan Taylor', role: 'Project Manager', avatar: '/avatars/morgan.jpg', capacity: 100, assigned: 75 },
  { id: '4', name: 'Casey Johnson', role: 'Backend Developer', avatar: '/avatars/casey.jpg', capacity: 100, assigned: 95 },
];

const mockTaskData: TaskSummary[] = [
  { status: 'Completed', count: 143 },
  { status: 'In Progress', count: 87 },
  { status: 'Backlog', count: 62 },
  { status: 'Overdue', count: 17 },
];

const mockTrendData = [
  { month: 'Jan', completed: 41, planned: 45 },
  { month: 'Feb', completed: 52, planned: 50 },
  { month: 'Mar', completed: 48, planned: 55 },
  { month: 'Apr', completed: 61, planned: 60 },
  { month: 'May', completed: 55, planned: 62 },
  { month: 'Jun', completed: 67, planned: 65 },
];

const mockRecentActivity: RecentActivity[] = [
  { id: '1', user: 'Morgan Taylor', action: 'completed task', target: 'Design Homepage Wireframes', timestamp: '10 minutes ago', avatar: '/avatars/morgan.jpg' },
  { id: '2', user: 'Alex Smith', action: 'commented on', target: 'API Integration Issue #34', timestamp: '45 minutes ago', avatar: '/avatars/alex.jpg' },
  { id: '3', user: 'Jamie Lee', action: 'updated', target: 'User Journey Documentation', timestamp: '2 hours ago', avatar: '/avatars/jamie.jpg' },
  { id: '4', user: 'Casey Johnson', action: 'resolved', target: 'Backend Authentication Bug', timestamp: '4 hours ago', avatar: '/avatars/casey.jpg' },
];

/**
 * Organization Admin Dashboard Component
 * 
 * Provides a comprehensive overview of organization projects, team capacity,
 * tasks, and recent activities with real-time metrics and interactive charts.
 */
const OrgDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Simulating data fetch on component mount
  useEffect(() => {
    // In a real implementation, this would fetch data from APIs
    // For example:
    // const fetchDashboardData = async () => {
    //   try {
    //     const projectsResponse = await api.getProjects();
    //     const teamResponse = await api.getTeamCapacity();
    //     // Handle responses and update state
    //   } catch (error) {
    //     console.error('Error fetching dashboard data:', error);
    //   }
    // };
    // 
    // fetchDashboardData();
  }, []);

  /**
   * Helper function to get status icon based on project status
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'at-risk':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'delayed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-blue-500" />;
    }
  };

  /**
   * Helper function to get status text color based on project status
   */
  const getStatusTextClass = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-500';
      case 'at-risk':
        return 'text-amber-500';
      case 'delayed':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  /**
   * Helper function to get progress bar color based on value
   */
  const getProgressColor = (value: number) => {
    if (value >= 75) return 'bg-green-500';
    if (value >= 50) return 'bg-blue-500';
    if (value >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  /**
   * Helper function to format dates for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  /**
   * Helper function to calculate days remaining
   */
  const getDaysRemaining = (dateString: string) => {
    const deadline = new Date(dateString).getTime();
    const today = new Date().getTime();
    const diff = deadline - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  /**
   * Calculate total tasks and completion rate
   */
  const calculateTaskMetrics = () => {
    const total = mockTaskData.reduce((sum, item) => sum + item.count, 0);
    const completed = mockTaskData.find(item => item.status === 'Completed')?.count || 0;
    const completionRate = Math.round((completed / total) * 100);
    return { total, completed, completionRate };
  };

  const taskMetrics = calculateTaskMetrics();

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Organization Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of all projects, team capacity, and performance metrics
        </p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Active Projects
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {mockProjects.filter(p => p.status === 'on-track').length} on track
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Upcoming Deadlines
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.filter(p => getDaysRemaining(p.deadline) <= 14).length}
            </div>
            <p className="text-xs text-muted-foreground">Within next 14 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Overdue Tasks
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjects.reduce((sum, p) => sum + p.tasks.overdue, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Team Capacity
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockTeamMembers.reduce((sum, member) => sum + member.assigned, 0) / 
              (mockTeamMembers.length * 100) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average utilization
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts section */}
      {mockProjects.some(p => p.status === 'at-risk' || p.status === 'delayed') && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Alerts</h2>
          <div className="space-y-3">
            {mockProjects
              .filter(p => p.status === 'at-risk' || p.status === 'delayed')
              .map(project => (
                <Alert key={project.id} variant={project.status === 'delayed' ? 'destructive' : 'default'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {project.status === 'delayed' ? 'Project Delayed' : 'Project At Risk'}
                  </AlertTitle>
                  <AlertDescription>
                    {project.name} - {project.client} - 
                    {project.status === 'delayed' 
                      ? ' Missed deadline, requires immediate attention.' 
                      : ' May miss deadline, review required.'}
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </div>
      )}

      {/* Main content tabs */}
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Completion Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Task Status</CardTitle>
                <CardDescription>Distribution of tasks by current status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockTaskData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Completion Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Completion Trend</CardTitle>
                <CardDescription>Completed vs. Planned tasks over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={mockTrendData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="completed" stroke="#3b82f6" />
                      <Line type="monotone" dataKey="planned" stroke="#6b7280" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Team Capacity Section */}
          <Card>
            <CardHeader>
              <CardTitle>Team Capacity</CardTitle>
              <CardDescription>Current workload distribution across team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTeamMembers.map(member => (
                  <div key={member.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                          {member.name.charAt(0)}
                        </div>
                        <span>{member.name}</span>
                        <span className="text-muted-foreground">({member.role})</span>
                      </div>
                      <span className={member.assigned > 100 ? "text-red-500 font-medium" : ""}>{member.assigned}%</span>
                    </div>
                    <Progress 
                      value={member.assigned} 
                      max={100} 
                      className={`h-2 ${member.assigned > 100 ? 'bg-red-200' : 'bg-slate-200'}`}
                      indicatorClassName={member.assigned > 100 ? 'bg-red-500' : (
                        member.assigned > 85 ? 'bg-amber-500' : 'bg-green-500'
                      )}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => navigate('/organization/capacity')}
                  className="flex items-center gap-1"
                >
                  Manage Team Capacity
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                      {activity.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        {activity.action}{' '}
                        <span className="font-medium">{activity.target}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="ghost" size="sm">
                  View All Activity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Projects Tab Content */}
        <TabsContent value="projects" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">All Projects</h3>
            <Button onClick={() => navigate('/organization/projects/new')}>
              New Project
            </Button>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {mockProjects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <div className="flex items-center">
                          {getStatusIcon(project.status)}
                          <span className={`text-xs ml-1 ${getStatusTextClass(project.status)}`}>
                            {project.status.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(project.deadline)}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <div className="w-full">
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          max={100} 
                          className="h-2 bg-slate-200"
                          indicatorClassName={getProgressColor(project.progress)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Client</p>
                        <p className="font-medium">{project.client}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="font-medium">
                          {project.tasks.completed}/{project.tasks.total} completed
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Left</p>
                        <p className={`font-medium ${getDaysRemaining(project.deadline) < 7 ? 'text-red-500' : ''}`}>
                          {getDaysRemaining(project.deadline)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-around p-4 bg-muted/50 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/organization/projects/${project.id}`)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/organization/projects/${project.id}/tasks`)}
                    >
                      Tasks
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/organization/projects/${project.id}/reports`)}
                    >
                      Reports
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/organization/projects/${project.id}/chat`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-4">
            <Button variant="outline">View All Projects</Button>
          </div>
        </TabsContent>
        
        {/* Teams Tab Content */}
        <TabsContent value="teams" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Team Management</h3>
            <Button onClick={() => navigate('/organization/teams/invite')}>
              Invite Team Member
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Team Utilization</CardTitle>
              <CardDescription>
                Current workload and capacity across all teams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Summary stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Total Members</h4>
                    <p className="text-2xl font-bold">{mockTeamMembers.length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Avg Utilization</h4>
                    <p className="text-2xl font-bold">{Math.round(mockTeamMembers.reduce((sum, m) => sum + m.assigned, 0) / mockTeamMembers.length)}%</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Overallocated</h4>
                    <p className="text-2xl font-bold">{mockTeamMembers.filter(m => m.assigned > 100).length}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <h4 className="text-sm font-medium text-muted-foreground">Available</h4>
                    <p className="text-2xl font-bold">{mockTeamMembers.filter(m => m.assigned < 70).length}</p>
                  </div>
                </div>
                
                {/* Team members listing */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Team Member</th>
                        <th className="text-left py-3 px-4 font-medium">Role</th>
                        <th className="text-left py-3 px-4 font-medium">Assigned</th>
                        <th className="text-left py-3 px-4 font-medium">Availability</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {mockTeamMembers.map(member => (
                        <tr key={member.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                {member.name.charAt(0)}
                              </div>
                              <span className="font-medium">{member.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{member.role}</td>
                          <td className="py-3 px-4">{member.assigned}%</td>
                          <td className="py-3 px-4">
                            <div className="w-full max-w-[100px]">
                              <Progress 
                                value={100 - member.assigned} 
                                max={100} 
                                className="h-2 bg-slate-200"
                                indicatorClassName={member.assigned > 100 
                                  ? 'bg-red-500' 
                                  : (member.assigned > 85 ? 'bg-amber-500' : 'bg-green-500')
                                }
                              />
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">View</Button>
                            <Button variant="ghost" size="sm">Reassign</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrgDashboard;