// src/pages/organization/Reports.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Search,
  FileText,
  Download,
  Share2,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Clock,
  Users,
  Mail,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  CheckCircle2,
  ArrowUpRight,
  RefreshCw,
  Repeat,
  AlertCircle,
  FileSpreadsheet,
  FilePdf,
  Link,
  Copy,
  MoreVertical
} from 'lucide-react';

// Types for our data models
interface Report {
  id: string;
  title: string;
  description: string;
  type: 'project' | 'team' | 'client' | 'financial';
  format: 'dashboard' | 'pdf' | 'spreadsheet';
  schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'manual';
  lastGenerated: string;
  nextGeneration: string;
  recipients: string[];
  createdBy: string;
  status: 'active' | 'paused';
  categories: string[];
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'team' | 'client' | 'financial';
  previewImage: string;
  popularTags: string[];
}

interface ReportHistory {
  id: string;
  reportId: string;
  date: string;
  size: string;
  format: 'pdf' | 'spreadsheet';
  views: number;
  status: 'completed' | 'error' | 'generating';
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Weekly Project Status Report',
    description: 'Summary of all active projects with task status and team performance metrics',
    type: 'project',
    format: 'dashboard',
    schedule: 'weekly',
    lastGenerated: '2025-03-28T09:30:00Z',
    nextGeneration: '2025-04-04T09:30:00Z',
    recipients: ['team@example.com', 'admin@example.com'],
    createdBy: 'Alex Johnson',
    status: 'active',
    categories: ['project status', 'task tracking', 'team performance']
  },
  {
    id: '2',
    title: 'Monthly Team Capacity Report',
    description: 'Detailed analysis of team workload, capacity, and resource allocation',
    type: 'team',
    format: 'pdf',
    schedule: 'monthly',
    lastGenerated: '2025-03-15T14:45:00Z',
    nextGeneration: '2025-04-15T14:45:00Z',
    recipients: ['hr@example.com', 'management@example.com'],
    createdBy: 'Taylor Rodriguez',
    status: 'active',
    categories: ['resource allocation', 'team capacity', 'workload distribution']
  },
  {
    id: '3',
    title: 'Client Delivery Summary',
    description: 'Overview of deliverables and milestones for client projects',
    type: 'client',
    format: 'spreadsheet',
    schedule: 'weekly',
    lastGenerated: '2025-03-27T11:15:00Z',
    nextGeneration: '2025-04-03T11:15:00Z',
    recipients: ['clients@example.com', 'account-managers@example.com'],
    createdBy: 'Jordan Lee',
    status: 'paused',
    categories: ['client deliverables', 'milestones', 'account management']
  },
  {
    id: '4',
    title: 'Quarterly Financial Performance',
    description: 'Financial metrics including project budgets, actuals, and forecasts',
    type: 'financial',
    format: 'dashboard',
    schedule: 'quarterly',
    lastGenerated: '2025-03-31T16:00:00Z',
    nextGeneration: '2025-06-30T16:00:00Z',
    recipients: ['finance@example.com', 'executives@example.com'],
    createdBy: 'Casey Morgan',
    status: 'active',
    categories: ['financial performance', 'budget tracking', 'forecasting']
  }
];

const mockTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Project Performance Dashboard',
    description: 'Comprehensive view of project health, task completion, and timeline adherence',
    type: 'project',
    previewImage: '/images/templates/project-dashboard.jpg',
    popularTags: ['charts', 'KPIs', 'timeline']
  },
  {
    id: '2',
    name: 'Team Workload Analysis',
    description: 'Visualize team capacity, allocation, and workload distribution',
    type: 'team',
    previewImage: '/images/templates/team-workload.jpg',
    popularTags: ['capacity', 'resource management', 'allocation']
  },
  {
    id: '3',
    name: 'Client Status Report',
    description: 'Client-friendly summary of project progress, milestones, and deliverables',
    type: 'client',
    previewImage: '/images/templates/client-status.jpg',
    popularTags: ['milestones', 'deliverables', 'timeline']
  },
  {
    id: '4',
    name: 'Financial Summary',
    description: 'Budget vs. actual tracking with forecasting and variance analysis',
    type: 'financial',
    previewImage: '/images/templates/financial-summary.jpg',
    popularTags: ['budget', 'forecast', 'variance']
  },
  {
    id: '5',
    name: 'Sprint Performance Report',
    description: 'Track sprint velocity, completion rate, and issue resolution metrics',
    type: 'project',
    previewImage: '/images/templates/sprint-performance.jpg',
    popularTags: ['agile', 'sprints', 'velocity']
  },
  {
    id: '6',
    name: 'Resource Utilization Report',
    description: 'Analysis of resource utilization across teams and projects',
    type: 'team',
    previewImage: '/images/templates/resource-utilization.jpg',
    popularTags: ['utilization', 'efficiency', 'allocation']
  }
];

const mockReportHistory: ReportHistory[] = [
  {
    id: '1',
    reportId: '1',
    date: '2025-03-28T09:30:00Z',
    size: '2.4 MB',
    format: 'pdf',
    views: 12,
    status: 'completed'
  },
  {
    id: '2',
    reportId: '1',
    date: '2025-03-21T09:30:00Z',
    size: '2.3 MB',
    format: 'pdf',
    views: 8,
    status: 'completed'
  },
  {
    id: '3',
    reportId: '2',
    date: '2025-03-15T14:45:00Z',
    size: '4.1 MB',
    format: 'pdf',
    views: 15,
    status: 'completed'
  },
  {
    id: '4',
    reportId: '3',
    date: '2025-03-27T11:15:00Z',
    size: '1.8 MB',
    format: 'spreadsheet',
    views: 6,
    status: 'completed'
  },
  {
    id: '5',
    reportId: '4',
    date: '2025-03-31T16:00:00Z',
    size: '3.2 MB',
    format: 'pdf',
    views: 24,
    status: 'completed'
  },
  {
    id: '6',
    reportId: '1',
    date: '2025-04-04T09:30:00Z',
    size: '- MB',
    format: 'pdf',
    views: 0,
    status: 'generating'
  }
];

// Metrics for demonstration
const projectMetricsData = [
  { name: 'Jan', completed: 24, planned: 30 },
  { name: 'Feb', completed: 28, planned: 25 },
  { name: 'Mar', completed: 26, planned: 28 },
  { name: 'Apr', completed: 32, planned: 30 },
  { name: 'May', completed: 29, planned: 32 },
  { name: 'Jun', completed: 35, planned: 34 }
];

const teamCapacityData = [
  { name: 'Team A', capacity: 100, utilized: 85 },
  { name: 'Team B', capacity: 100, utilized: 92 },
  { name: 'Team C', capacity: 100, utilized: 78 },
  { name: 'Team D', capacity: 100, utilized: 104 }
];

const taskStatusData = [
  { name: 'Completed', value: 145 },
  { name: 'In Progress', value: 87 },
  { name: 'Not Started', value: 43 },
  { name: 'Blocked', value: 18 }
];

const COLORS = ['#4ade80', '#60a5fa', '#e4e4e7', '#f97316'];

/**
 * Automated Reporting Component
 * 
 * Provides tools to create, manage, and distribute automated reports
 * with scheduling capabilities, template selection, and delivery options.
 */
const AutomatedReporting: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('reports');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateReportOpen, setIsCreateReportOpen] = useState(false);
  const [isPreviewReportOpen, setIsPreviewReportOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter reports based on search query and type filter
  const filteredReports = mockReports.filter(report => 
    (report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterType === null || report.type === filterType)
  );

  // Filter templates based on search query and type filter
  const filteredTemplates = mockTemplates.filter(template => 
    (template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (filterType === null || template.type === filterType)
  );

  /**
   * Show success alert with given message
   */
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not scheduled';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  /**
   * Get color for report type badge
   */
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'project':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'team':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'client':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'financial':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  /**
   * Get icon for report format
   */
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'dashboard':
        return <BarChart3 className="h-4 w-4" />;
      case 'pdf':
        return <FilePdf className="h-4 w-4" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  /**
   * Get schedule label
   */
  const getScheduleLabel = (schedule: string) => {
    switch (schedule) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'manual':
        return 'Manual';
      default:
        return 'Custom';
    }
  };

  /**
   * Handle report creation
   */
  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to create a report
    setIsCreateReportOpen(false);
    showSuccess('Report created successfully');
  };

  /**
   * Handle report generation
   */
  const handleGenerateReport = (report: Report) => {
    // In a real implementation, this would call an API to generate a report
    showSuccess(`Generating ${report.title}. You will be notified when it's ready.`);
  };

  /**
   * Handle report preview
   */
  const handlePreviewReport = (report: Report) => {
    setSelectedReport(report);
    setIsPreviewReportOpen(true);
  };

  /**
   * Generate a shareable link
   */
  const handleShareReport = (report: Report) => {
    // In a real implementation, this would generate a secure shareable link
    const link = `https://teamlens.example.com/shared-reports/${report.id}`;
    navigator.clipboard.writeText(link);
    showSuccess('Shareable link copied to clipboard');
  };

  /**
   * Handle report download
   */
  const handleDownloadReport = (reportHistory: ReportHistory) => {
    // In a real implementation, this would trigger a download of the report
    showSuccess('Report download started');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Automated Reporting</h1>
        <p className="text-muted-foreground mt-2">
          Create, schedule, and manage automated reports for projects, teams, and clients
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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={filterType || ''} onValueChange={(value) => setFilterType(value || null)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isCreateReportOpen} onOpenChange={setIsCreateReportOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1 ml-auto">
                <Plus className="h-4 w-4" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Configure your automated report settings, schedule, and delivery options
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateReport}>
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="report-title">Report Title</Label>
                      <Input
                        id="report-title"
                        placeholder="e.g. Weekly Project Status Report"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-type">Report Type</Label>
                      <Select defaultValue="project">
                        <SelectTrigger id="report-type">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="team">Team</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Input
                      id="report-description"
                      placeholder="Brief description of the report purpose"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Report Format</Label>
                      <RadioGroup defaultValue="dashboard" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="dashboard" id="format-dashboard" />
                          <Label htmlFor="format-dashboard" className="cursor-pointer">Dashboard</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pdf" id="format-pdf" />
                          <Label htmlFor="format-pdf" className="cursor-pointer">PDF</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="spreadsheet" id="format-spreadsheet" />
                          <Label htmlFor="format-spreadsheet" className="cursor-pointer">Spreadsheet</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="report-schedule">Schedule</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger id="report-schedule">
                          <SelectValue placeholder="Select schedule" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="manual">Manual (On-demand)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Report Contents</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="metrics" defaultChecked />
                        <label
                          htmlFor="metrics"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Key Metrics & KPIs
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="tasks" defaultChecked />
                        <label
                          htmlFor="tasks"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Task Status
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="timeline" defaultChecked />
                        <label
                          htmlFor="timeline"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Timeline & Milestones
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="risks" />
                        <label
                          htmlFor="risks"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Risks & Issues
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="budget" />
                        <label
                          htmlFor="budget"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Budget vs. Actual
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Delivery Options</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-delivery" className="cursor-pointer">Email Delivery</Label>
                          <Switch id="email-delivery" defaultChecked />
                        </div>
                        
                        <Input
                          placeholder="recipient@example.com, another@example.com"
                        />
                        <div className="text-xs text-muted-foreground">
                          Separate multiple email addresses with commas
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="dashboard-publish" className="cursor-pointer">Publish to Dashboard</Label>
                          <Switch id="dashboard-publish" defaultChecked />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="client-access" className="cursor-pointer">Client Access</Label>
                          <Switch id="client-access" />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notify-team" className="cursor-pointer">Notify Team Members</Label>
                          <Switch id="notify-team" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateReportOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Report</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            My Reports
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Report History
          </TabsTrigger>
        </TabsList>
        
        {/* My Reports Tab */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map(report => (
              <Card key={report.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {report.title}
                          {report.status === 'paused' && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">Paused</Badge>
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getReportTypeColor(report.type)}>
                          {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getFormatIcon(report.format)}
                          {report.format.charAt(0).toUpperCase() + report.format.slice(1)}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Repeat className="h-3 w-3" />
                          {getScheduleLabel(report.schedule)}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Last Generated</p>
                        <p className="font-medium">{formatDate(report.lastGenerated)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Next Generation</p>
                        <p className="font-medium">{formatDate(report.nextGeneration)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recipients</p>
                        <p className="font-medium">{report.recipients.length} recipients</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      {report.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col justify-around p-4 bg-muted/50 shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handlePreviewReport(report)}
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleGenerateReport(report)}
                    >
                      Generate Now
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleShareReport(report)}
                    >
                      Share
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {filteredReports.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No reports found</h3>
              <p className="text-muted-foreground text-sm mb-4">Try adjusting your search or filter criteria</p>
              <Button onClick={() => setIsCreateReportOpen(true)}>Create Your First Report</Button>
            </div>
          )}
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <Card key={template.id} className="overflow-hidden flex flex-col">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  {/* In a real app, this would be the template preview image */}
                  <div className="flex flex-col items-center justify-center p-4">
                    {template.type === 'project' && <BarChart3 className="h-16 w-16 text-blue-500" />}
                    {template.type === 'team' && <Users className="h-16 w-16 text-purple-500" />}
                    {template.type === 'client' && <PieChartIcon className="h-16 w-16 text-green-500" />}
                    {template.type === 'financial' && <LineChartIcon className="h-16 w-16 text-amber-500" />}
                    <span className="text-xs text-muted-foreground mt-2">Preview Image</span>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={getReportTypeColor(template.type)}>
                      {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-grow">
                  <div className="flex flex-wrap gap-2">
                    {template.popularTags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="border-t bg-muted/10 pt-4">
                  <Button className="w-full" onClick={() => {
                    setIsCreateReportOpen(true);
                    // In a real app, this would pre-populate the create form with template data
                  }}>
                    Use Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No templates found</h3>
              <p className="text-muted-foreground text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
        
        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Report Generation History</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Report Name</th>
                      <th className="text-left py-3 px-4 font-medium">Date</th>
                      <th className="text-left py-3 px-4 font-medium">Format</th>
                      <th className="text-left py-3 px-4 font-medium">Size</th>
                      <th className="text-left py-3 px-4 font-medium">Views</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {mockReportHistory.map(history => {
                      const report = mockReports.find(r => r.id === history.reportId);
                      
                      return (
                        <tr key={history.id} className="hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="font-medium">{report?.title}</div>
                            <div className="text-xs text-muted-foreground">{report?.type}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {formatDate(history.date)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              {getFormatIcon(history.format)}
                              <span>{history.format.charAt(0).toUpperCase() + history.format.slice(1)}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {history.size}
                          </td>
                          <td className="py-3 px-4">
                            {history.views}
                          </td>
                          <td className="py-3 px-4">
                            {history.status === 'completed' && (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Completed
                              </Badge>
                            )}
                            {history.status === 'generating' && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                Generating
                              </Badge>
                            )}
                            {history.status === 'error' && (
                              <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                Error
                              </Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {history.status === 'completed' ? (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDownloadReport(history)}
                                  className="flex items-center gap-1"
                                >
                                  <Download className="h-3 w-3" />
                                  Download
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {/* View report */}}
                                  className="flex items-center gap-1"
                                >
                                  View
                                </Button>
                              </div>
                            ) : history.status === 'generating' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                disabled
                              >
                                Processing...
                              </Button>
                            ) : (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500"
                              >
                                Retry
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {mockReportHistory.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No report history</h3>
                  <p className="text-muted-foreground text-sm">
                    Your report generation history will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Preview Dialog */}
      <Dialog open={isPreviewReportOpen} onOpenChange={setIsPreviewReportOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              {selectedReport?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{selectedReport.title}</h2>
                <div className="text-sm text-muted-foreground">
                  Generated: {formatDate(selectedReport.lastGenerated)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tasks Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">68%</div>
                    <p className="text-xs text-muted-foreground">
                      +4% from last period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">On-Time Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">92%</div>
                    <p className="text-xs text-muted-foreground">
                      +2% from last period
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Team Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">
                      -3% from last period
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Project Completion Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={projectMetricsData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" name="Completed Tasks" fill="#4f46e5" />
                        <Bar dataKey="planned" name="Planned Tasks" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Team Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={teamCapacityData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" domain={[0, 120]} />
                          <YAxis type="category" dataKey="name" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="utilized" name="Capacity Utilized (%)" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Task Status Distribution</CardTitle>
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
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {taskStatusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Key Risks & Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2 font-medium">Description</th>
                        <th className="pb-2 font-medium">Impact</th>
                        <th className="pb-2 font-medium">Status</th>
                        <th className="pb-2 font-medium">Owner</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3">Resource availability for Project X</td>
                        <td className="py-3">
                          <Badge className="bg-amber-100 text-amber-800">Medium</Badge>
                        </td>
                        <td className="py-3">In Progress</td>
                        <td className="py-3">Alex Johnson</td>
                      </tr>
                      <tr>
                        <td className="py-3">Integration issue with third-party API</td>
                        <td className="py-3">
                          <Badge className="bg-red-100 text-red-800">High</Badge>
                        </td>
                        <td className="py-3">Open</td>
                        <td className="py-3">Sam Williams</td>
                      </tr>
                      <tr>
                        <td className="py-3">Potential delay in client feedback</td>
                        <td className="py-3">
                          <Badge className="bg-blue-100 text-blue-800">Low</Badge>
                        </td>
                        <td className="py-3">Monitoring</td>
                        <td className="py-3">Jordan Lee</td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => handleShareReport(selectedReport!)}
              className="flex items-center gap-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="outline"
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={() => setIsPreviewReportOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AutomatedReporting;