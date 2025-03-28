import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import {
  Search,
  Plus,
  Check,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Clock,
  BarChart,
  CheckCircle,
  AlertCircle,
  XCircle,
  Tag,
  Users,
  Filter,
  SlidersHorizontal,
  ClipboardList,
  LayoutGrid,
  User,
  ChevronDown,
  ListFilter,
  MoreHorizontal,
  Link2,
  Edit,
  Trash2,
  MessageSquare,
  Paperclip,
  CheckCircle2
} from 'lucide-react';

// Types for our data models
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed' | 'canceled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project: Project;
  assignee: TeamMember | null;
  dueDate: string | null;
  createdDate: string;
  completedDate: string | null;
  tags: string[];
  comments: number;
  attachments: number;
  source: 'jira' | 'asana' | 'clickup' | 'monday' | 'internal';
  dependencies: string[];
  subtasks: {
    total: number;
    completed: number;
  };
  estimatedTime: number | null; // in hours
  actualTime: number | null; // in hours
}

interface Project {
  id: string;
  name: string;
  client: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

// Mock data
const mockProjects: Project[] = [
  { id: '1', name: 'E-commerce Website Redesign', client: 'GlobalShop Inc.' },
  { id: '2', name: 'Mobile App Development', client: 'TechStartup Ltd.' },
  { id: '3', name: 'Marketing Campaign Analytics', client: 'AdGenius Co.' },
  { id: '4', name: 'Customer Portal Enhancement', client: 'ServiceHub Ltd.' },
  { id: '5', name: 'Internal Tool Development', client: 'Internal' }
];

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', role: 'Project Manager' },
  { id: '2', name: 'Jamie Lee', role: 'UX Designer' },
  { id: '3', name: 'Casey Jones', role: 'Frontend Developer' },
  { id: '4', name: 'Morgan Taylor', role: 'Project Manager' },
  { id: '5', name: 'Sam Reynolds', role: 'Mobile Developer' },
  { id: '6', name: 'Riley Smith', role: 'Backend Developer' },
  { id: '7', name: 'Taylor Rodriguez', role: 'Data Analyst' },
  { id: '8', name: 'Jordan Lee', role: 'Marketing Specialist' }
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design homepage wireframes',
    description: 'Create wireframes for the new e-commerce homepage based on the brand guidelines',
    status: 'completed',
    priority: 'high',
    project: mockProjects[0],
    assignee: mockTeamMembers[1],
    dueDate: '2025-04-05',
    createdDate: '2025-03-20',
    completedDate: '2025-04-02',
    tags: ['design', 'wireframes', 'homepage'],
    comments: 5,
    attachments: 2,
    source: 'internal',
    dependencies: [],
    subtasks: { total: 4, completed: 4 },
    estimatedTime: 12,
    actualTime: 14
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Implement user login, registration, and password reset features for the mobile app',
    status: 'in-progress',
    priority: 'high',
    project: mockProjects[1],
    assignee: mockTeamMembers[5],
    dueDate: '2025-04-10',
    createdDate: '2025-03-25',
    completedDate: null,
    tags: ['development', 'authentication', 'security'],
    comments: 3,
    attachments: 1,
    source: 'jira',
    dependencies: ['3'],
    subtasks: { total: 5, completed: 2 },
    estimatedTime: 24,
    actualTime: 10
  },
  {
    id: '3',
    title: 'Set up API endpoints',
    description: 'Create RESTful API endpoints for the mobile app',
    status: 'completed',
    priority: 'high',
    project: mockProjects[1],
    assignee: mockTeamMembers[5],
    dueDate: '2025-04-01',
    createdDate: '2025-03-20',
    completedDate: '2025-03-30',
    tags: ['development', 'api', 'backend'],
    comments: 2,
    attachments: 0,
    source: 'jira',
    dependencies: [],
    subtasks: { total: 3, completed: 3 },
    estimatedTime: 16,
    actualTime: 14
  },
  {
    id: '4',
    title: 'Analyze marketing campaign data',
    description: 'Analyze the performance data from the Q1 marketing campaign and prepare a report',
    status: 'blocked',
    priority: 'medium',
    project: mockProjects[2],
    assignee: mockTeamMembers[6],
    dueDate: '2025-04-08',
    createdDate: '2025-03-28',
    completedDate: null,
    tags: ['analytics', 'marketing', 'report'],
    comments: 1,
    attachments: 3,
    source: 'asana',
    dependencies: ['5'],
    subtasks: { total: 2, completed: 0 },
    estimatedTime: 8,
    actualTime: 2
  },
  {
    id: '5',
    title: 'Collect campaign metrics',
    description: 'Gather all metrics and KPIs from the Q1 marketing campaign',
    status: 'in-progress',
    priority: 'high',
    project: mockProjects[2],
    assignee: mockTeamMembers[7],
    dueDate: '2025-04-07',
    createdDate: '2025-03-26',
    completedDate: null,
    tags: ['data collection', 'marketing', 'metrics'],
    comments: 0,
    attachments: 1,
    source: 'asana',
    dependencies: [],
    subtasks: { total: 3, completed: 1 },
    estimatedTime: 6,
    actualTime: 4
  },
  {
    id: '6',
    title: 'Optimize loading performance',
    description: 'Improve the loading speed of the customer portal dashboard',
    status: 'not-started',
    priority: 'medium',
    project: mockProjects[3],
    assignee: mockTeamMembers[2],
    dueDate: '2025-04-15',
    createdDate: '2025-03-30',
    completedDate: null,
    tags: ['performance', 'optimization', 'frontend'],
    comments: 0,
    attachments: 0,
    source: 'clickup',
    dependencies: [],
    subtasks: { total: 0, completed: 0 },
    estimatedTime: 8,
    actualTime: null
  },
  {
    id: '7',
    title: 'Design internal dashboard UI',
    description: 'Create UI designs for the internal productivity dashboard',
    status: 'not-started',
    priority: 'low',
    project: mockProjects[4],
    assignee: mockTeamMembers[1],
    dueDate: '2025-05-01',
    createdDate: '2025-03-29',
    completedDate: null,
    tags: ['design', 'ui', 'dashboard'],
    comments: 1,
    attachments: 0,
    source: 'monday',
    dependencies: [],
    subtasks: { total: 0, completed: 0 },
    estimatedTime: 10,
    actualTime: null
  },
  {
    id: '8',
    title: 'Fix checkout page bug',
    description: 'Resolve the bug causing payment processing errors on the checkout page',
    status: 'in-progress',
    priority: 'urgent',
    project: mockProjects[0],
    assignee: mockTeamMembers[2],
    dueDate: '2025-04-03',
    createdDate: '2025-04-01',
    completedDate: null,
    tags: ['bug', 'checkout', 'payment'],
    comments: 4,
    attachments: 1,
    source: 'internal',
    dependencies: [],
    subtasks: { total: 2, completed: 1 },
    estimatedTime: 4,
    actualTime: 3
  }
];

/**
 * Task Management Component
 * 
 * Provides functionality to view, create, filter, and manage tasks
 * with integrations to third-party task management tools.
 */
const TaskManagement: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [projectFilter, setProjectFilter] = useState<string[]>([]);
  const [assigneeFilter, setAssigneeFilter] = useState<string[]>([]);
  const [dueDateFilter, setDueDateFilter] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string[]>([]);

  // Status column groupings for Kanban view
  const statusColumns = [
    { key: 'not-started', label: 'Not Started', color: 'bg-gray-50' },
    { key: 'in-progress', label: 'In Progress', color: 'bg-blue-50' },
    { key: 'blocked', label: 'Blocked', color: 'bg-amber-50' },
    { key: 'completed', label: 'Completed', color: 'bg-green-50' }
  ];

  // Filter tasks based on all the filters
  const filteredTasks = mockTasks.filter(task => {
    // Search filter
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.assignee && task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Status filter
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status);
    
    // Priority filter
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority);
    
    // Project filter
    const matchesProject = projectFilter.length === 0 || projectFilter.includes(task.project.id);
    
    // Assignee filter
    const matchesAssignee = assigneeFilter.length === 0 || 
      (task.assignee && assigneeFilter.includes(task.assignee.id));
    
    // Due date filter
    const dueDate = task.dueDate ? new Date(task.dueDate) : null;
    const matchesDueDate = 
      !dueDateFilter.from || !dueDateFilter.to || !dueDate ||
      (dueDate >= dueDateFilter.from && dueDate <= dueDateFilter.to);
    
    // Source filter
    const matchesSource = sourceFilter.length === 0 || sourceFilter.includes(task.source);
    
    return matchesSearch && matchesStatus && matchesPriority && 
           matchesProject && matchesAssignee && matchesDueDate && matchesSource;
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
   * Handle task creation
   */
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to create a task
    setIsCreateTaskOpen(false);
    showSuccess('Task created successfully');
  };

  /**
   * Open task details
   */
  const handleOpenTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  /**
   * Get days until due or days overdue
   */
  const getDaysUntilDue = (dueDate: string | null) => {
    if (!dueDate) return null;
    
    const due = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  /**
   * Get status badge with its appropriate color
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'not-started':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Not Started</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'blocked':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Blocked</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Canceled</Badge>;
      default:
        return null;
    }
  };

  /**
   * Get priority badge with its appropriate color
   */
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
      default:
        return null;
    }
  };

  /**
   * Get source badge with its appropriate icon
   */
  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'jira':
        return <Badge variant="outline" className="bg-blue-50 text-blue-800 gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span> JIRA
        </Badge>;
      case 'asana':
        return <Badge variant="outline" className="bg-red-50 text-red-800 gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span> Asana
        </Badge>;
      case 'clickup':
        return <Badge variant="outline" className="bg-green-50 text-green-800 gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span> ClickUp
        </Badge>;
      case 'monday':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Monday
        </Badge>;
      case 'internal':
        return <Badge variant="outline" className="bg-purple-50 text-purple-800 gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span> Internal
        </Badge>;
      default:
        return null;
    }
  };

  /**
   * Reset all filters
   */
  const resetFilters = () => {
    setStatusFilter([]);
    setPriorityFilter([]);
    setProjectFilter([]);
    setAssigneeFilter([]);
    setDueDateFilter({ from: undefined, to: undefined });
    setSourceFilter([]);
  };

  /**
   * Update status filter array
   */
  const toggleStatusFilter = (status: string) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  /**
   * Update priority filter array
   */
  const togglePriorityFilter = (priority: string) => {
    setPriorityFilter(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority) 
        : [...prev, priority]
    );
  };

  /**
   * Update project filter array
   */
  const toggleProjectFilter = (projectId: string) => {
    setProjectFilter(prev => 
      prev.includes(projectId) 
        ? prev.filter(p => p !== projectId) 
        : [...prev, projectId]
    );
  };

  /**
   * Update assignee filter array
   */
  const toggleAssigneeFilter = (assigneeId: string) => {
    setAssigneeFilter(prev => 
      prev.includes(assigneeId) 
        ? prev.filter(a => a !== assigneeId) 
        : [...prev, assigneeId]
    );
  };

  /**
   * Update source filter array
   */
  const toggleSourceFilter = (source: string) => {
    setSourceFilter(prev => 
      prev.includes(source) 
        ? prev.filter(s => s !== source) 
        : [...prev, source]
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <p className="text-muted-foreground mt-2">
          Create, assign, and track tasks across all your projects and integrated platforms
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
              placeholder="Search tasks..."
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
                {(statusFilter.length > 0 || priorityFilter.length > 0 || 
                  projectFilter.length > 0 || assigneeFilter.length > 0 || 
                  dueDateFilter.from || sourceFilter.length > 0) && (
                  <Badge className="ml-1 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {[
                      statusFilter.length > 0 ? 1 : 0,
                      priorityFilter.length > 0 ? 1 : 0,
                      projectFilter.length > 0 ? 1 : 0,
                      assigneeFilter.length > 0 ? 1 : 0,
                      dueDateFilter.from ? 1 : 0,
                      sourceFilter.length > 0 ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filter Tasks</h4>
                  <Button variant="ghost" size="sm" onClick={resetFilters}>Reset</Button>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status</div>
                  <div className="flex flex-wrap gap-2">
                    {['not-started', 'in-progress', 'blocked', 'completed', 'canceled'].map(status => (
                      <Badge 
                        key={status}
                        variant={statusFilter.includes(status) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleStatusFilter(status)}
                      >
                        {status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Priority</div>
                  <div className="flex flex-wrap gap-2">
                    {['urgent', 'high', 'medium', 'low'].map(priority => (
                      <Badge 
                        key={priority}
                        variant={priorityFilter.includes(priority) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => togglePriorityFilter(priority)}
                      >
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Project</div>
                  <Select 
                    value={projectFilter.length === 1 ? projectFilter[0] : ""} 
                    onValueChange={(value) => {
                      if (value) toggleProjectFilter(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={projectFilter.length > 1 
                        ? `${projectFilter.length} projects selected` 
                        : projectFilter.length === 1 
                          ? mockProjects.find(p => p.id === projectFilter[0])?.name
                          : "All projects"} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          <div className="flex items-center">
                            <Checkbox 
                              checked={projectFilter.includes(project.id)} 
                              className="mr-2"
                            />
                            {project.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Assignee</div>
                  <Select 
                    value={assigneeFilter.length === 1 ? assigneeFilter[0] : ""} 
                    onValueChange={(value) => {
                      if (value) toggleAssigneeFilter(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={assigneeFilter.length > 1 
                        ? `${assigneeFilter.length} assignees selected` 
                        : assigneeFilter.length === 1 
                          ? mockTeamMembers.find(m => m.id === assigneeFilter[0])?.name
                          : "All assignees"} 
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeamMembers.map(member => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center">
                            <Checkbox 
                              checked={assigneeFilter.includes(member.id)} 
                              className="mr-2"
                            />
                            {member.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Due Date</div>
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDateFilter.from ? (
                          dueDateFilter.to ? (
                            <>
                              {formatDate(dueDateFilter.from.toISOString())} -{" "}
                              {formatDate(dueDateFilter.to.toISOString())}
                            </>
                          ) : (
                            formatDate(dueDateFilter.from.toISOString())
                          )
                        ) : (
                          <span>Select date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dueDateFilter.from}
                        selected={dueDateFilter}
                        onSelect={(range) => {
                          setDueDateFilter(range || { from: undefined, to: undefined });
                          if (range?.from && range?.to) {
                            setIsDatePickerOpen(false);
                          }
                        }}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Source</div>
                  <div className="flex flex-wrap gap-2">
                    {['jira', 'asana', 'clickup', 'monday', 'internal'].map(source => (
                      <Badge 
                        key={source}
                        variant={sourceFilter.includes(source) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleSourceFilter(source)}
                      >
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {filteredTasks.length} tasks found
                  </div>
                  <Button size="sm" onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select defaultValue="all">
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tasks</SelectItem>
              <SelectItem value="my-tasks">My Tasks</SelectItem>
              <SelectItem value="overdue">Overdue Tasks</SelectItem>
              <SelectItem value="upcoming">Due This Week</SelectItem>
              <SelectItem value="completed">Recently Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Add task details, set due dates, and assign team members
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask}>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="task-title">Task Title</Label>
                  <Input
                    id="task-title"
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-description">Description</Label>
                  <Textarea
                    id="task-description"
                    placeholder="Describe the task in detail"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-project">Project</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="task-project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select a project</SelectItem>
                        {mockProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-assignee">Assignee</Label>
                    <Select>
                      <SelectTrigger id="task-assignee">
                        <SelectValue placeholder="Assign to" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {mockTeamMembers.map(member => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-priority">Priority</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="task-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-status">Status</Label>
                    <Select defaultValue="not-started">
                      <SelectTrigger id="task-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-due-date">Due Date</Label>
                    <Input
                      id="task-due-date"
                      type="date"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="task-estimated-time">Estimated Time (hours)</Label>
                    <Input
                      id="task-estimated-time"
                      type="number"
                      min="0"
                      step="0.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="task-tags">Tags</Label>
                    <Input
                      id="task-tags"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-dependencies">Dependencies</Label>
                  <Select>
                    <SelectTrigger id="task-dependencies">
                      <SelectValue placeholder="Select dependent tasks" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTasks.map(task => (
                        <SelectItem key={task.id} value={task.id}>
                          {task.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    This task will be blocked until the selected tasks are completed
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch id="task-subtasks" />
                    <Label htmlFor="task-subtasks">Add subtasks</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="task-notifications" defaultChecked />
                    <Label htmlFor="task-notifications">Send notifications</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
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
              <LayoutGrid className="h-4 w-4" />
              Kanban
            </TabsTrigger>
          </TabsList>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredTasks.length} of {mockTasks.length} tasks
          </div>
        </div>
        
        {/* List View */}
        <TabsContent value="list">
          {filteredTasks.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">
                          <div className="flex items-center gap-1">
                            Task
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Priority</th>
                        <th className="text-left py-3 px-4 font-medium">Project</th>
                        <th className="text-left py-3 px-4 font-medium">Assignee</th>
                        <th className="text-left py-3 px-4 font-medium">Due Date</th>
                        <th className="text-left py-3 px-4 font-medium">Source</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredTasks.map(task => (
                        <tr key={task.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => handleOpenTaskDetails(task)}>
                          <td className="py-3 px-4">
                            <div className="max-w-xs">
                              <div className="font-medium truncate">{task.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{task.description}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {getStatusBadge(task.status)}
                          </td>
                          <td className="py-3 px-4">
                            {getPriorityBadge(task.priority)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="max-w-[150px] truncate">{task.project.name}</div>
                          </td>
                          <td className="py-3 px-4">
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="truncate max-w-[100px]">{task.assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {task.dueDate ? (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  {formatDate(task.dueDate)}
                                  {getDaysUntilDue(task.dueDate) !== null && (
                                    <div className={`text-xs ${
                                      getDaysUntilDue(task.dueDate)! < 0 
                                        ? 'text-red-500' 
                                        : getDaysUntilDue(task.dueDate)! <= 2 
                                          ? 'text-amber-500' 
                                          : 'text-muted-foreground'
                                    }`}>
                                      {getDaysUntilDue(task.dueDate)! < 0 
                                        ? `${Math.abs(getDaysUntilDue(task.dueDate)!)} days overdue` 
                                        : getDaysUntilDue(task.dueDate) === 0 
                                          ? 'Due today' 
                                          : `${getDaysUntilDue(task.dueDate)} days left`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Not set</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {getSourceBadge(task.source)}
                          </td>
                          <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenTaskDetails(task);
                                  }}
                                >
                                  <ArrowUpRight className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark Complete
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Link2 className="h-4 w-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
              <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No tasks found</h3>
              <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or create a new task</p>
              <Button onClick={() => setIsCreateTaskOpen(true)}>Create New Task</Button>
            </div>
          )}
        </TabsContent>
        
        {/* Kanban View */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statusColumns.map(column => (
              <div key={column.key} className="space-y-4">
                <div className={`flex items-center justify-between p-2 ${column.color} rounded-md`}>
                  <div className="flex items-center gap-2">
                    {column.key === 'not-started' && <Clock className="h-4 w-4 text-gray-500" />}
                    {column.key === 'in-progress' && <ArrowUpRight className="h-4 w-4 text-blue-500" />}
                    {column.key === 'blocked' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                    {column.key === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    <h3 className="font-medium">{column.label}</h3>
                  </div>
                  <Badge variant="outline" className="bg-white">
                    {filteredTasks.filter(t => t.status === column.key).length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {filteredTasks
                    .filter(task => task.status === column.key)
                    .map(task => (
                      <Card key={task.id} className="cursor-pointer" onClick={() => handleOpenTaskDetails(task)}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="font-medium">{task.title}</div>
                            {getPriorityBadge(task.priority)}
                          </div>
                          
                          <div className="text-sm text-muted-foreground line-clamp-2">{task.description}</div>
                          
                          <div className="flex justify-between items-center">
                            <Badge variant="outline">{task.project.name}</Badge>
                            {getSourceBadge(task.source)}
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t">
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{task.assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Unassigned</span>
                            )}
                            
                            {task.dueDate && (
                              <div className={`flex items-center gap-1 text-xs ${
                                getDaysUntilDue(task.dueDate)! < 0 
                                  ? 'text-red-500' 
                                  : getDaysUntilDue(task.dueDate)! <= 2 
                                    ? 'text-amber-500' 
                                    : 'text-muted-foreground'
                              }`}>
                                <CalendarIcon className="h-3 w-3" />
                                {formatDate(task.dueDate)}
                              </div>
                            )}
                          </div>
                          
                          {(task.comments > 0 || task.attachments > 0) && (
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {task.comments > 0 && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {task.comments}
                                </div>
                              )}
                              {task.attachments > 0 && (
                                <div className="flex items-center gap-1">
                                  <Paperclip className="h-3 w-3" />
                                  {task.attachments}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  
                  {filteredTasks.filter(t => t.status === column.key).length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm border border-dashed rounded-lg">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Task Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedTask.title}
                    {getPriorityBadge(selectedTask.priority)}
                  </div>
                  <div className="flex items-center gap-2">
                    {getSourceBadge(selectedTask.source)}
                    <Badge variant="outline">Task #{selectedTask.id}</Badge>
                  </div>
                </DialogTitle>
                <DialogDescription className="flex justify-between items-center">
                  <div>
                    In <span className="font-medium">{selectedTask.project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Created on {formatDate(selectedTask.createdDate)}</span>
                    {selectedTask.completedDate && (
                      <span className="text-green-600">Completed on {formatDate(selectedTask.completedDate)}</span>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <div className="bg-muted/50 p-4 rounded-md text-sm">
                      {selectedTask.description}
                    </div>
                  </div>
                  
                  {selectedTask.subtasks.total > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Subtasks ({selectedTask.subtasks.completed}/{selectedTask.subtasks.total})</h3>
                      <div className="space-y-2">
                        {Array.from({ length: selectedTask.subtasks.total }).map((_, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                            <Checkbox checked={index < selectedTask.subtasks.completed} />
                            <span className={index < selectedTask.subtasks.completed ? 'line-through text-muted-foreground' : ''}>
                              Subtask {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedTask.dependencies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Dependencies</h3>
                      <div className="space-y-2">
                        {selectedTask.dependencies.map(depId => {
                          const dependency = mockTasks.find(t => t.id === depId);
                          return dependency ? (
                            <div key={depId} className="flex justify-between items-center p-2 bg-muted/50 rounded-md">
                              <div className="flex items-center gap-2">
                                {dependency.status === 'completed' ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-amber-500" />
                                )}
                                <span>{dependency.title}</span>
                              </div>
                              {getStatusBadge(dependency.status)}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                  
                  {selectedTask.comments > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">Comments ({selectedTask.comments})</h3>
                      <div className="space-y-4">
                        {Array.from({ length: selectedTask.comments }).map((_, index) => (
                          <div key={index} className="p-4 bg-muted/50 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {index === 0 && selectedTask.assignee 
                                    ? selectedTask.assignee.name.charAt(0)
                                    : mockTeamMembers[index % mockTeamMembers.length].name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">
                                  {index === 0 && selectedTask.assignee 
                                    ? selectedTask.assignee.name
                                    : mockTeamMembers[index % mockTeamMembers.length].name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(new Date(new Date(selectedTask.createdDate).getTime() + index * 86400000).toISOString())}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm">
                              Example comment {index + 1} for this task.
                            </div>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 mt-4">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">U</AvatarFallback>
                          </Avatar>
                          <Input placeholder="Add a comment..." />
                          <Button size="sm">Post</Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Select defaultValue={selectedTask.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="not-started">Not Started</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Assignee</span>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedTask.assignee ? (
                            <>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{selectedTask.assignee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{selectedTask.assignee.name}</span>
                            </>
                          ) : (
                            <span className="text-sm text-muted-foreground">Unassigned</span>
                          )}
                          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Due Date</span>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedTask.dueDate ? (
                            <div className={`text-sm ${
                              getDaysUntilDue(selectedTask.dueDate)! < 0 
                                ? 'text-red-500' 
                                : getDaysUntilDue(selectedTask.dueDate)! <= 2 
                                  ? 'text-amber-500' 
                                  : ''
                            }`}>
                              {formatDate(selectedTask.dueDate)}
                              {getDaysUntilDue(selectedTask.dueDate)! < 0 && ' (Overdue)'}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not set</span>
                          )}
                          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">Time Tracking</span>
                        <div className="flex items-center gap-2 mt-1">
                          {selectedTask.estimatedTime ? (
                            <div className="text-sm">
                              {selectedTask.actualTime !== null 
                                ? `${selectedTask.actualTime}h / ${selectedTask.estimatedTime}h`
                                : `Estimated: ${selectedTask.estimatedTime}h`}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">Not estimated</span>
                          )}
                          <Button variant="ghost" size="icon" className="ml-auto h-6 w-6">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                        <Button variant="ghost" size="sm" className="h-6 gap-1">
                          <Plus className="h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedTask.attachments > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Attachments ({selectedTask.attachments})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {Array.from({ length: selectedTask.attachments }).map((_, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                              <div className="flex items-center gap-2">
                                <Paperclip className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">attachment-{index + 1}.{index % 2 === 0 ? 'pdf' : 'png'}</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex justify-between gap-2 border-t pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsDetailsOpen(false)}>
                    Close
                  </Button>
                  <Button variant="outline" size="sm">
                    <Link2 className="h-4 w-4 mr-1" />
                    Copy Link
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  {selectedTask.status !== 'completed' ? (
                    <Button size="sm" className="gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Mark Complete
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="gap-1">
                      <XCircle className="h-4 w-4" />
                      Reopen
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskManagement;