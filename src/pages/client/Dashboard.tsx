import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MessageSquare,
  Calendar as CalendarIcon,
  ChevronRight,
  ArrowUpRight,
  Download,
  Eye
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
  daysRemaining: number;
  lastUpdate: string;
  description: string;
}

interface Milestone {
  id: string;
  projectId: string;
  name: string;
  date: string;
  status: 'completed' | 'upcoming' | 'delayed';
  description: string;
}

interface Report {
  id: string;
  title: string;
  projectId: string;
  date: string;
  type: 'weekly' | 'monthly' | 'milestone';
  viewed: boolean;
}

interface Task {
  id: string;
  name: string;
  projectId: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'blocked' | 'not-started';
  assignee: string;
}

interface Meeting {
  id: string;
  title: string;
  projectId: string;
  date: string;
  time: string;
  duration: number;
  link: string;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    status: 'on-track',
    progress: 68,
    tasks: { total: 45, completed: 30, overdue: 2 },
    daysRemaining: 14,
    lastUpdate: '2025-03-28T15:30:00Z',
    description: 'Complete overhaul of company website with new branding and improved UX.'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    status: 'at-risk',
    progress: 42,
    tasks: { total: 78, completed: 32, overdue: 8 },
    daysRemaining: 45,
    lastUpdate: '2025-03-29T09:15:00Z',
    description: 'Native mobile application for iOS and Android platforms.'
  },
  {
    id: '3',
    name: 'Marketing Campaign',
    status: 'delayed',
    progress: 35,
    tasks: { total: 28, completed: 9, overdue: 7 },
    daysRemaining: 5,
    lastUpdate: '2025-03-27T11:45:00Z',
    description: 'Q2 marketing campaign for new product launch.'
  }
];

const mockMilestones: Milestone[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Design Approval',
    date: '2025-04-05',
    status: 'upcoming',
    description: 'Final design approval for all website pages'
  },
  {
    id: '2',
    projectId: '1',
    name: 'Content Migration',
    date: '2025-04-15',
    status: 'upcoming',
    description: 'Transfer of all content to new website structure'
  },
  {
    id: '3',
    projectId: '2',
    name: 'Alpha Release',
    date: '2025-04-20',
    status: 'upcoming',
    description: 'Internal testing of initial app version'
  },
  {
    id: '4',
    projectId: '3',
    name: 'Campaign Kickoff',
    date: '2025-04-01',
    status: 'delayed',
    description: 'Official launch of marketing campaign'
  }
];

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Website Redesign - Weekly Progress Report',
    projectId: '1',
    date: '2025-03-28',
    type: 'weekly',
    viewed: true
  },
  {
    id: '2',
    title: 'Mobile App Development - Monthly Summary',
    projectId: '2',
    date: '2025-03-25',
    type: 'monthly',
    viewed: false
  },
  {
    id: '3',
    title: 'Marketing Campaign - Performance Analysis',
    projectId: '3',
    date: '2025-03-26',
    type: 'weekly',
    viewed: false
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Finalize homepage design',
    projectId: '1',
    dueDate: '2025-04-02',
    status: 'in-progress',
    assignee: 'Alex Johnson'
  },
  {
    id: '2',
    name: 'Content review and approval',
    projectId: '1',
    dueDate: '2025-04-05',
    status: 'not-started',
    assignee: 'Taylor Smith'
  },
  {
    id: '3',
    name: 'User authentication implementation',
    projectId: '2',
    dueDate: '2025-04-10',
    status: 'blocked',
    assignee: 'Jordan Lee'
  },
  {
    id: '4',
    name: 'Develop social media assets',
    projectId: '3',
    dueDate: '2025-04-01',
    status: 'in-progress',
    assignee: 'Casey Morgan'
  }
];

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Website Design Review',
    projectId: '1',
    date: '2025-04-01',
    time: '10:00',
    duration: 60,
    link: 'https://zoom.us/j/123456789'
  },
  {
    id: '2',
    title: 'App Development Sprint Planning',
    projectId: '2',
    date: '2025-04-03',
    time: '14:30',
    duration: 90,
    link: 'https://teams.microsoft.com/l/meetup-join/123456789'
  },
  {
    id: '3',
    title: 'Marketing Campaign Status Update',
    projectId: '3',
    date: '2025-03-31',
    time: '11:00',
    duration: 45,
    link: 'https://meet.google.com/abc-defg-hij'
  }
];

const taskStatusData = [
  { name: 'Completed', value: 75 },
  { name: 'In Progress', value: 38 },
  { name: 'Not Started', value: 25 },
  { name: 'Blocked', value: 12 }
];

const COLORS = ['#4ade80', '#60a5fa', '#e4e4e7', '#f97316'];

/**
 * Client Dashboard Component
 * 
 * Provides a read-only view of project status, upcoming milestones,
 * reports, and scheduled meetings for clients.
 */
const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Simulating data fetch on component mount
  useEffect(() => {
    // In a real implementation, this would fetch data from APIs
    // For example:
    // const fetchClientData = async () => {
    //   try {
    //     const projectsResponse = await api.getClientProjects();
    //     const milestonesResponse = await api.getUpcomingMilestones();
    //     // Handle responses and update state
    //   } catch (error) {
    //     console.error('Error fetching client data:', error);
    //   }
    // };
    // 
    // fetchClientData();
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
        return null;
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
        return '';
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
   * Helper function to get milestone status badge
   */
  const getMilestoneStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>;
      case 'delayed':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Delayed</Badge>;
      default:
        return null;
    }
  };

  /**
   * Helper function to get task status badge
   */
  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      case 'not-started':
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Not Started</Badge>;
      case 'blocked':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Blocked</Badge>;
      default:
        return null;
    }
  };

  /**
   * Helper function to format time
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  /**
   * Helper function to check if a date is today
   */
  const isToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  /**
   * Helper function to check if a date is in the future
   */
  const isFuture = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
  };

  /**
   * Helper function to get days until a date
   */
  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Get upcoming meetings (today or future)
   */
  const getUpcomingMeetings = () => {
    return mockMeetings.filter(meeting => isToday(meeting.date) || isFuture(meeting.date))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  /**
   * Get upcoming milestones sorted by date
   */
  const getUpcomingMilestones = () => {
    return mockMilestones
      .filter(milestone => milestone.status !== 'completed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Client Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          View your project progress, reports, and upcoming meetings
        </p>
      </header>

      {/* Tabs for different sections */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports & Insights</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-6">
          {/* Project Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map(project => (
              <Card key={project.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <div className="flex items-center">
                      {getStatusIcon(project.status)}
                      <span className={`text-xs ml-1 ${getStatusTextClass(project.status)}`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress 
                        value={project.progress} 
                        max={100} 
                        className="h-2"
                        indicatorClassName={getProgressColor(project.progress)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Tasks</p>
                        <p className="font-medium">{project.tasks.completed}/{project.tasks.total} completed</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Days Remaining</p>
                        <p className={`font-medium ${project.daysRemaining < 7 ? 'text-red-500' : ''}`}>
                          {project.daysRemaining}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-muted/30 border-t">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Last updated: {formatDate(project.lastUpdate)}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/client/projects/${project.id}`)}
                    >
                      View Details
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Task and Milestone Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Status</CardTitle>
                <CardDescription>Overview of all tasks across projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Upcoming Milestones</CardTitle>
                  <CardDescription>Key project milestones and deadlines</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/client/milestones')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getUpcomingMilestones().slice(0, 3).map(milestone => (
                    <div key={milestone.id} className="border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{milestone.name}</h4>
                        {getMilestoneStatusBadge(milestone.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{milestone.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(milestone.date)}</span>
                        <span className="mx-2">•</span>
                        <span>
                          {milestone.status === 'delayed' 
                            ? 'Delayed' 
                            : `${getDaysUntil(milestone.date)} days left`}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  {getUpcomingMilestones().length === 0 && (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No upcoming milestones</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Key Tasks</CardTitle>
                <CardDescription>Important tasks that need attention</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/client/tasks')}
              >
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {mockTasks.map(task => (
                  <div key={task.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{task.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {mockProjects.find(p => p.id === task.projectId)?.name}
                        </p>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                      <div className="text-muted-foreground">
                        Assignee: {task.assignee}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Reports Tab Content */}
        <TabsContent value="reports" className="space-y-6">
          {/* Latest Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Latest Reports</CardTitle>
              <CardDescription>Access detailed project reports and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {mockReports.map(report => (
                  <div key={report.id} className="py-4 first:pt-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="bg-muted rounded-md p-2">
                          <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center">
                            {report.title}
                            {!report.viewed && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800">New</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(report.date)} • {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => navigate(`/client/reports/${report.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {mockReports.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No reports available</h3>
                    <p className="text-muted-foreground">Reports will appear here as they are generated</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30">
              <div className="w-full flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Showing {mockReports.length} latest reports
                </span>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/client/reports')}
                >
                  View All Reports
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Project Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Progress Over Time</CardTitle>
                <CardDescription>Weekly completion rates across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { week: 'Week 1', website: 10, app: 5, marketing: 8 },
                        { week: 'Week 2', website: 25, app: 15, marketing: 12 },
                        { week: 'Week 3', website: 40, app: 25, marketing: 18 },
                        { week: 'Week 4', website: 55, app: 32, marketing: 22 },
                        { week: 'Week 5', website: 68, app: 42, marketing: 35 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="website" stroke="#3b82f6" name="Website Redesign" />
                      <Line type="monotone" dataKey="app" stroke="#8b5cf6" name="Mobile App" />
                      <Line type="monotone" dataKey="marketing" stroke="#ec4899" name="Marketing Campaign" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Task Completion By Week</CardTitle>
                <CardDescription>Number of tasks completed each week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { week: 'Week 1', completed: 5, planned: 8 },
                        { week: 'Week 2', completed: 12, planned: 15 },
                        { week: 'Week 3', completed: 18, planned: 20 },
                        { week: 'Week 4', completed: 24, planned: 22 },
                        { week: 'Week 5', completed: 20, planned: 25 }
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis label={{ value: 'Tasks', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                      <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Schedule Tab Content */}
        <TabsContent value="schedule" className="space-y-6">
          {/* Upcoming Meetings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Upcoming Meetings</CardTitle>
                <CardDescription>Scheduled meetings with the project team</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/client/schedule')}
              >
                Full Schedule
              </Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {getUpcomingMeetings().map(meeting => (
                  <div key={meeting.id} className="py-4 first:pt-0">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-50 text-blue-700 rounded-md p-2 text-center min-w-14">
                        <div className="text-xs font-medium">
                          {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-xl font-bold">
                          {new Date(meeting.date).getDate()}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{meeting.title}</h4>
                        <p className="text-sm text-muted-foreground mb-1">
                          {mockProjects.find(p => p.id === meeting.projectId)?.name}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{formatTime(meeting.time)}</span>
                          </div>
                          <div>
                            <span>{meeting.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1 shrink-0"
                        onClick={() => window.open(meeting.link, '_blank')}
                      >
                        Join
                        <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}

                {getUpcomingMeetings().length === 0 && (
                  <div className="text-center py-8">
                    <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <h3 className="text-lg font-medium">No upcoming meetings</h3>
                    <p className="text-muted-foreground">Any scheduled meetings will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Project Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Key dates and milestones for all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {mockProjects.map(project => (
                  <div key={project.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{project.name}</h3>
                      <span className={`text-xs ${getStatusTextClass(project.status)}`}>
                        {project.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="space-y-3 ml-2 pl-4 border-l-2 border-muted">
                      {mockMilestones
                        .filter(m => m.projectId === project.id)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(milestone => (
                          <div key={milestone.id} className="relative">
                            <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-blue-500"></div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted/40 rounded-md p-3">
                              <div>
                                <div className="font-medium">{milestone.name}</div>
                                <div className="text-sm text-muted-foreground">{milestone.description}</div>
                              </div>
                              <div className="mt-2 sm:mt-0 sm:ml-4 flex items-center gap-2">
                                <div className="text-sm">
                                  {formatDate(milestone.date)}
                                </div>
                                {getMilestoneStatusBadge(milestone.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Feedback and Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback & Requests</CardTitle>
              <CardDescription>Submit feedback or request changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Need to provide feedback or request changes? Use our dedicated communication channels:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex items-center justify-center gap-2"
                    onClick={() => navigate('/client/chat')}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Team Chat</div>
                      <div className="text-xs text-muted-foreground">
                        Communicate directly with your project team
                      </div>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto py-4 flex items-center justify-center gap-2"
                    onClick={() => navigate('/client/feedback')}
                  >
                    <FileText className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Submit Feedback</div>
                      <div className="text-xs text-muted-foreground">
                        Provide structured feedback on deliverables
                      </div>
                    </div>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDashboard;