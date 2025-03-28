import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Trash2,
  MoreHorizontal,
  Calendar,
  Clock,
  BarChart,
  User,
  Users,
  UserPlus,
  CheckCircle2,
  ClipboardList,
  Link as LinkIcon,
  MessageSquare,
  Filter,
  SlidersHorizontal,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

// Types for our data models
interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: 'on-track' | 'at-risk' | 'delayed' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
    notStarted: number;
    overdue: number;
  };
  team: TeamMember[];
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  lastUpdate: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website Redesign',
    description: 'Redesign the client\'s e-commerce website with new branding, improved UX, and modern technologies.',
    client: 'GlobalShop Inc.',
    status: 'on-track',
    progress: 68,
    startDate: '2025-01-15',
    endDate: '2025-04-30',
    tasks: {
      total: 45,
      completed: 30,
      inProgress: 10,
      notStarted: 5,
      overdue: 2
    },
    team: [
      { id: '1', name: 'Alex Johnson', role: 'Project Manager' },
      { id: '2', name: 'Jamie Lee', role: 'UX Designer' },
      { id: '3', name: 'Casey Jones', role: 'Frontend Developer' }
    ],
    tags: ['web design', 'e-commerce', 'redesign'],
    priority: 'high',
    lastUpdate: '2025-03-28T15:30:00Z'
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Develop a new mobile application for iOS and Android platforms with real-time analytics capabilities.',
    client: 'TechStartup Ltd.',
    status: 'at-risk',
    progress: 42,
    startDate: '2025-02-10',
    endDate: '2025-05-15',
    tasks: {
      total: 78,
      completed: 32,
      inProgress: 18,
      notStarted: 28,
      overdue: 8
    },
    team: [
      { id: '4', name: 'Morgan Taylor', role: 'Project Manager' },
      { id: '5', name: 'Sam Reynolds', role: 'Mobile Developer' },
      { id: '6', name: 'Riley Smith', role: 'Backend Developer' }
    ],
    tags: ['mobile app', 'ios', 'android', 'development'],
    priority: 'high',
    lastUpdate: '2025-03-29T09:15:00Z'
  },
  {
    id: '3',
    name: 'Marketing Campaign Analytics',
    description: 'Implement analytics tracking and reporting for the upcoming marketing campaign.',
    client: 'AdGenius Co.',
    status: 'delayed',
    progress: 35,
    startDate: '2025-03-01',
    endDate: '2025-04-10',
    tasks: {
      total: 28,
      completed: 9,
      inProgress: 12,
      notStarted: 7,
      overdue: 7
    },
    team: [
      { id: '7', name: 'Taylor Rodriguez', role: 'Data Analyst' },
      { id: '8', name: 'Jordan Lee', role: 'Marketing Specialist' }
    ],
    tags: ['analytics', 'marketing', 'reporting'],
    priority: 'medium',
    lastUpdate: '2025-03-27T11:45:00Z'
  },
  {
    id: '4',
    name: 'Customer Portal Enhancement',
    description: 'Enhance the existing customer portal with new features, performance improvements, and accessibility updates.',
    client: 'ServiceHub Ltd.',
    status: 'on-track',
    progress: 85,
    startDate: '2025-02-20',
    endDate: '2025-06-01',
    tasks: {
      total: 34,
      completed: 29,
      inProgress: 5,
      notStarted: 0,
      overdue: 0
    },
    team: [
      { id: '9', name: 'Robin Williams', role: 'Project Manager' },
      { id: '10', name: 'Alex Martin', role: 'Full-stack Developer' }
    ],
    tags: ['portal', 'enhancement', 'accessibility'],
    priority: 'medium',
    lastUpdate: '2025-03-28T10:00:00Z'
  },
  {
    id: '5',
    name: 'Internal Tool Development',
    description: 'Develop internal tools for improving team productivity and workflow management.',
    client: 'Internal',
    status: 'on-hold',
    progress: 20,
    startDate: '2025-03-15',
    endDate: '2025-07-30',
    tasks: {
      total: 52,
      completed: 10,
      inProgress: 0,
      notStarted: 42,
      overdue: 0
    },
    team: [
      { id: '11', name: 'Jordan Patel', role: 'Backend Developer' },
      { id: '12', name: 'Casey Morgan', role: 'Frontend Developer' }
    ],
    tags: ['internal', 'tools', 'productivity'],
    priority: 'low',
    lastUpdate: '2025-03-15T16:45:00Z'
  }
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'GlobalShop Inc.',
    email: 'john.doe@globalshop.com',
    phone: '+1 (555) 123-4567'
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'TechStartup Ltd.',
    email: 'jane.smith@techstartup.com',
    phone: '+1 (555) 987-6543'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    company: 'AdGenius Co.',
    email: 'michael.johnson@adgenius.com',
    phone: '+1 (555) 456-7890'
  },
  {
    id: '4',
    name: 'Sarah Williams',
    company: 'ServiceHub Ltd.',
    email: 'sarah.williams@servicehub.com',
    phone: '+1 (555) 789-0123'
  },
  {
    id: '5',
    name: 'Internal',
    company: 'Our Company',
    email: 'internal@ourcompany.com',
    phone: '+1 (555) 321-0987'
  }
];

const teamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', role: 'Project Manager' },
  { id: '2', name: 'Jamie Lee', role: 'UX Designer' },
  { id: '3', name: 'Casey Jones', role: 'Frontend Developer' },
  { id: '4', name: 'Morgan Taylor', role: 'Project Manager' },
  { id: '5', name: 'Sam Reynolds', role: 'Mobile Developer' },
  { id: '6', name: 'Riley Smith', role: 'Backend Developer' },
  { id: '7', name: 'Taylor Rodriguez', role: 'Data Analyst' },
  { id: '8', name: 'Jordan Lee', role: 'Marketing Specialist' },
  { id: '9', name: 'Robin Williams', role: 'Project Manager' },
  { id: '10', name: 'Alex Martin', role: 'Full-stack Developer' },
  { id: '11', name: 'Jordan Patel', role: 'Backend Developer' },
  { id: '12', name: 'Casey Morgan', role: 'Frontend Developer' }
];

/**
 * Project Management Component
 * 
 * Allows organization admins to view, create, and manage projects,
 * assign team members, track progress, and oversee multiple projects simultaneously.
 */
const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter projects based on search query, status, priority, and date range
  const filteredProjects = mockProjects.filter(project => {
    // Search filter
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = !selectedStatus || project.status === selectedStatus;
    
    // Priority filter
    const matchesPriority = !selectedPriority || project.priority === selectedPriority;
    
    // Date range filter
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const matchesDateRange = 
      !dateRange.from || !dateRange.to || 
      (startDate <= dateRange.to && endDate >= dateRange.from);
    
    return matchesSearch && matchesStatus && matchesPriority && matchesDateRange;
  });

  /**
   * Show success alert with given message
   */
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  /**
   * Handle project creation
   */
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to create a project
    setIsCreateProjectOpen(false);
    showSuccess('Project created successfully');
  };

  /**
   * Format date for display
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
   * Helper function to get status icon based on project status
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-track':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'at-risk':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'delayed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'on-hold':
        return <Clock className="w-4 h-4 text-gray-500" />;
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
      case 'completed':
        return 'text-blue-500';
      case 'on-hold':
        return 'text-gray-500';
      default:
        return '';
    }
  };

  /**
   * Helper function to get progress bar color based on value and status
   */
  const getProgressColor = (value: number, status: string) => {
    if (status === 'delayed') return 'bg-red-500';
    if (status === 'at-risk') return 'bg-amber-500';
    if (status === 'on-hold') return 'bg-gray-500';
    if (status === 'completed') return 'bg-blue-500';
    
    if (value >= 75) return 'bg-green-500';
    if (value >= 50) return 'bg-blue-500';
    if (value >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  /**
   * Get days remaining until end date
   */
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  /**
   * Get priority badge style
   */
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Low</Badge>;
      default:
        return null;
    }
  };

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedStatus(null);
    setSelectedPriority(null);
    setDateRange({ from: undefined, to: undefined });
  };

  /**
   * Get the client name from project's client ID
   */
  const getClientName = (clientName: string) => {
    const client = mockClients.find(c => c.company === clientName);
    return client ? client.company : clientName;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, manage, and track all your organization's projects
        </p>
      </header>

      {/* Success Alert */}
      {showSuccessAlert && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="flex gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
                {(selectedStatus || selectedPriority || dateRange.from) && (
                  <Badge className="ml-1 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {[
                      selectedStatus ? 1 : 0,
                      selectedPriority ? 1 : 0,
                      dateRange.from ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-medium">Filter Projects</h4>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <Select value={selectedStatus || ''} onValueChange={(value) => setSelectedStatus(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="on-track">On Track</SelectItem>
                      <SelectItem value="at-risk">At Risk</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on-hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Priority</div>
                  <Select value={selectedPriority || ''} onValueChange={(value) => setSelectedPriority(value || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All priorities</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Date Range</div>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                          dateRange.to ? (
                            <>
                              {formatDate(dateRange.from.toISOString())} -{" "}
                              {formatDate(dateRange.to.toISOString())}
                            </>
                          ) : (
                            formatDate(dateRange.from.toISOString())
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range || { from: undefined, to: undefined });
                          if (range?.from && range?.to) {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="my-projects">My Projects</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="internal">Internal</SelectItem>
              <SelectItem value="external">Client Projects</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up your project details, timeline, and assign team members
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProject}>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-name">Project Name</Label>
                    <Input
                      id="project-name"
                      placeholder="Enter project name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-client">Client</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="project-client">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select a client</SelectItem>
                        {mockClients.map(client => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="Brief description of the project"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-start-date">Start Date</Label>
                    <Input
                      id="project-start-date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-end-date">End Date</Label>
                    <Input
                      id="project-end-date"
                      type="date"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="project-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Team Members</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {teamMembers.slice(0, 3).map(member => (
                        <div key={member.id} className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-full text-sm">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="h-7 rounded-full">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search team members..."
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="max-h-40 overflow-y-auto mt-2">
                      {teamMembers.map(member => (
                        <div key={member.id} className="flex items-center space-x-2 py-2">
                          <Checkbox id={`member-${member.id}`} />
                          <label
                            htmlFor={`member-${member.id}`}
                            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{member.name}</div>
                              <div className="text-xs text-muted-foreground">{member.role}</div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="Enter tags separated by commas (e.g., web, design, marketing)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateProjectOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* View options */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <ClipboardList className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Kanban
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {mockProjects.length} projects
          </div>
        </div>
        
        {/* List View */}
        <TabsContent value="list">
          <div className="space-y-4">
            {filteredProjects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {project.name}
                          {getPriorityBadge(project.priority)}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium">
                        {getStatusIcon(project.status)}
                        <span className={`${getStatusTextClass(project.status)}`}>
                          {project.status.replace(/-/g, ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6 mt-4">
                      <div className="flex-grow">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          max={100} 
                          className="h-2"
                          indicatorClassName={getProgressColor(project.progress, project.status)}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Client</p>
                          <p className="font-medium">{getClientName(project.client)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Tasks</p>
                          <p className="font-medium">
                            {project.tasks.completed}/{project.tasks.total} completed
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Timeline</p>
                          <p className="font-medium">
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Days Left</p>
                          <p className={`font-medium ${getDaysRemaining(project.endDate) < 7 ? 'text-red-500' : ''}`}>
                            {getDaysRemaining(project.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex -space-x-2">
                        {project.team.map((member, index) => (
                          <Avatar key={index} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="bg-muted">{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        ))}
                        {project.team.length > 3 && (
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs font-medium border-2 border-background">
                            +{project.team.length - 3}
                          </div>
                        )}
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
                      Overview
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
                      onClick={() => navigate(`/organization/projects/${project.id}/team`)}
                    >
                      Team
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => navigate(`/organization/projects/${project.id}/chat`)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/organization/projects/${project.id}/edit`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => navigate(`/organization/projects/${project.id}/reports`)}
                        >
                          <BarChart className="h-4 w-4 mr-2" />
                          View Reports
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <LinkIcon className="h-4 w-4 mr-2" />
                          Copy Project Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Archive Project
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No projects found</h3>
              <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or create a new project</p>
              <Button onClick={() => setIsCreateProjectOpen(true)}>Create New Project</Button>
            </div>
          )}
        </TabsContent>
        
        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* On Track Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <h3 className="font-medium">On Track</h3>
                </div>
                <Badge variant="outline" className="bg-white">
                  {filteredProjects.filter(p => p.status === 'on-track').length}
                </Badge>
              </div>
              
              {filteredProjects
                .filter(project => project.status === 'on-track')
                .map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          max={100} 
                          className="h-2"
                          indicatorClassName={getProgressColor(project.progress, project.status)}
                        />
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-muted-foreground">Due in {getDaysRemaining(project.endDate)} days</p>
                        <p className="font-medium">{getClientName(project.client)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="bg-muted text-xs">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8"
                          onClick={() => navigate(`/organization/projects/${project.id}`)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            {/* At Risk Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-amber-50 rounded-md">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <h3 className="font-medium">At Risk</h3>
                </div>
                <Badge variant="outline" className="bg-white">
                  {filteredProjects.filter(p => p.status === 'at-risk').length}
                </Badge>
              </div>
              
              {filteredProjects
                .filter(project => project.status === 'at-risk')
                .map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          max={100} 
                          className="h-2"
                          indicatorClassName={getProgressColor(project.progress, project.status)}
                        />
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-muted-foreground">Due in {getDaysRemaining(project.endDate)} days</p>
                        <p className="font-medium">{getClientName(project.client)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="bg-muted text-xs">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8"
                          onClick={() => navigate(`/organization/projects/${project.id}`)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            {/* Delayed Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-red-50 rounded-md">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <h3 className="font-medium">Delayed</h3>
                </div>
                <Badge variant="outline" className="bg-white">
                  {filteredProjects.filter(p => p.status === 'delayed').length}
                </Badge>
              </div>
              
              {filteredProjects
                .filter(project => project.status === 'delayed')
                .map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          max={100} 
                          className="h-2"
                          indicatorClassName={getProgressColor(project.progress, project.status)}
                        />
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-muted-foreground">Due in {getDaysRemaining(project.endDate)} days</p>
                        <p className="font-medium">{getClientName(project.client)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="bg-muted text-xs">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8"
                          onClick={() => navigate(`/organization/projects/${project.id}`)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            
            {/* Other Statuses Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">Other</h3>
                </div>
                <Badge variant="outline" className="bg-white">
                  {filteredProjects.filter(p => !['on-track', 'at-risk', 'delayed'].includes(p.status)).length}
                </Badge>
              </div>
              
              {filteredProjects
                .filter(project => !['on-track', 'at-risk', 'delayed'].includes(project.status))
                .map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{project.name}</CardTitle>
                        <Badge variant="outline">
                          {project.status.replace(/-/g, ' ')}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress 
                          value={project.progress} 
                          max={100} 
                          className="h-2"
                          indicatorClassName={getProgressColor(project.progress, project.status)}
                        />
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-muted-foreground">Due in {getDaysRemaining(project.endDate)} days</p>
                        <p className="font-medium">{getClientName(project.client)}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, index) => (
                            <Avatar key={index} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="bg-muted text-xs">{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8"
                          onClick={() => navigate(`/organization/projects/${project.id}`)}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
        
        {/* Calendar View (Placeholder) */}
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>View projects on a calendar timeline</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg space-y-4">
                <CalendarIcon className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">Calendar View Coming Soon</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  This feature is currently under development. Soon you'll be able to visualize all your projects on an interactive calendar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// For Textarea component
const Label = ({ htmlFor, children, className = "" }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

const Textarea = ({ id, placeholder, rows = 3 }) => (
  <textarea
    id={id}
    placeholder={placeholder}
    rows={rows}
    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
  />
);

export default ProjectManagement;