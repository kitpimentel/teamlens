import { useState, useEffect } from 'react'
import { 
  ArrowDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  FilterIcon,
  SearchIcon,
  CalendarIcon,
  BarChart2Icon,
  LineChartIcon,
  PieChartIcon
} from 'lucide-react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// Define types for the report data
interface ReportSummary {
  id: string
  title: string
  description: string
  projectId: string
  projectName: string
  createdAt: string
  type: 'performance' | 'timeline' | 'budget' | 'risk' | 'quality'
  status: 'scheduled' | 'generated' | 'viewed'
}

interface ProjectMetric {
  name: string
  value: number
  change: number
  changeType: 'positive' | 'negative' | 'neutral'
}

interface ProjectPerformance {
  projectId: string
  projectName: string
  metrics: {
    timelineStatus: 'ahead' | 'on-track' | 'behind' | 'critical'
    progress: number
    budgetStatus: 'under' | 'on-target' | 'over'
    riskLevel: 'low' | 'medium' | 'high'
    openIssues: number
    completedTasks: number
    totalTasks: number
  }
  startDate: string
  endDate: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

/**
 * Reports & Insights Page Component
 * 
 * Provides access to project reports, analytics, and performance metrics.
 * Clients can view and download various report types and track project performance.
 */
const ReportsInsights = () => {
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [metrics, setMetrics] = useState<ProjectMetric[]>([])
  const [performance, setPerformance] = useState<ProjectPerformance[]>([])
  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [selectedReportType, setSelectedReportType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateRange, setDateRange] = useState<string>('30days')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])

  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchReportData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Mock data for reports
        const mockReports: ReportSummary[] = [
          {
            id: 'report-1',
            title: 'Website Redesign - March Performance Report',
            description: 'Monthly performance analysis including milestone completion, task status, and team velocity.',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            createdAt: '2025-03-30T09:00:00Z',
            type: 'performance',
            status: 'generated'
          },
          {
            id: 'report-2',
            title: 'Mobile App Development - Timeline Analysis',
            description: 'Current project timeline review with milestone projection and delay risk assessment.',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            createdAt: '2025-03-28T14:30:00Z',
            type: 'timeline',
            status: 'viewed'
          },
          {
            id: 'report-3',
            title: 'Content Creation - Budget Report',
            description: 'Budget allocation and usage tracking, including cost breakdown by category.',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            createdAt: '2025-03-25T11:15:00Z',
            type: 'budget',
            status: 'viewed'
          },
          {
            id: 'report-4',
            title: 'Website Redesign - Risk Assessment',
            description: 'Identification and analysis of potential risks affecting project delivery.',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            createdAt: '2025-03-21T10:45:00Z',
            type: 'risk',
            status: 'viewed'
          },
          {
            id: 'report-5',
            title: 'Mobile App Development - April Performance Report',
            description: 'Scheduled performance report for next month.',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            createdAt: '2025-04-05T09:00:00Z',
            type: 'performance',
            status: 'scheduled'
          },
          {
            id: 'report-6',
            title: 'Content Creation - Quality Assessment',
            description: 'Quality metrics and standards compliance review for deliverables.',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            createdAt: '2025-03-18T16:20:00Z',
            type: 'quality',
            status: 'viewed'
          },
        ]
        
        // Mock data for overall metrics
        const mockMetrics: ProjectMetric[] = [
          {
            name: 'On-Time Delivery',
            value: 78,
            change: 5,
            changeType: 'positive'
          },
          {
            name: 'Budget Adherence',
            value: 92,
            change: 2,
            changeType: 'positive'
          },
          {
            name: 'Team Velocity',
            value: 84,
            change: -3,
            changeType: 'negative'
          },
          {
            name: 'Quality Score',
            value: 95,
            change: 1,
            changeType: 'positive'
          },
        ]
        
        // Mock data for project performance
        const mockPerformance: ProjectPerformance[] = [
          {
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            metrics: {
              timelineStatus: 'on-track',
              progress: 68,
              budgetStatus: 'on-target',
              riskLevel: 'low',
              openIssues: 4,
              completedTasks: 17,
              totalTasks: 25
            },
            startDate: '2025-01-15',
            endDate: '2025-04-30'
          },
          {
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            metrics: {
              timelineStatus: 'behind',
              progress: 35,
              budgetStatus: 'over',
              riskLevel: 'high',
              openIssues: 7,
              completedTasks: 7,
              totalTasks: 20
            },
            startDate: '2025-02-01',
            endDate: '2025-05-15'
          },
          {
            projectId: 'proj-3',
            projectName: 'Content Creation',
            metrics: {
              timelineStatus: 'critical',
              progress: 22,
              budgetStatus: 'on-target',
              riskLevel: 'medium',
              openIssues: 5,
              completedTasks: 4,
              totalTasks: 18
            },
            startDate: '2025-02-15',
            endDate: '2025-04-10'
          },
        ]
        
        // Mock data for team members
        const mockTeamMembers: TeamMember[] = [
          {
            id: 'member-1',
            name: 'Alex Johnson',
            role: 'Project Manager',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff'
          },
          {
            id: 'member-2',
            name: 'Sam Taylor',
            role: 'Lead Developer',
            avatar: 'https://ui-avatars.com/api/?name=Sam+Taylor&background=10b981&color=fff'
          },
          {
            id: 'member-3',
            name: 'Jamie Lee',
            role: 'UX Designer',
            avatar: 'https://ui-avatars.com/api/?name=Jamie+Lee&background=f43f5e&color=fff'
          },
          {
            id: 'member-4',
            name: 'Morgan Smith',
            role: 'Content Strategist',
            avatar: 'https://ui-avatars.com/api/?name=Morgan+Smith&background=fb923c&color=fff'
          },
        ]
        
        setReports(mockReports)
        setMetrics(mockMetrics)
        setPerformance(mockPerformance)
        setTeamMembers(mockTeamMembers)
      } catch (error) {
        console.error('Error fetching report data:', error)
        // Handle error appropriately (would show a toast notification)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchReportData()
  }, [])
  
  // Helper function to filter reports based on selected options
  const filteredReports = reports.filter(report => {
    const matchesProject = selectedProject === 'all' || report.projectId === selectedProject
    const matchesType = selectedReportType === 'all' || report.type === selectedReportType
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesProject && matchesType && matchesSearch
  })
  
  // Helper function to get timeline status color
  const getTimelineStatusColor = (status: ProjectPerformance['metrics']['timelineStatus']) => {
    switch (status) {
      case 'ahead':
        return 'text-emerald-500'
      case 'on-track':
        return 'text-blue-500'
      case 'behind':
        return 'text-amber-500'
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-slate-500'
    }
  }
  
  // Helper function to get budget status color
  const getBudgetStatusColor = (status: ProjectPerformance['metrics']['budgetStatus']) => {
    switch (status) {
      case 'under':
        return 'text-emerald-500'
      case 'on-target':
        return 'text-blue-500'
      case 'over':
        return 'text-red-500'
      default:
        return 'text-slate-500'
    }
  }
  
  // Helper function to get risk level color
  const getRiskLevelColor = (level: ProjectPerformance['metrics']['riskLevel']) => {
    switch (level) {
      case 'low':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'medium':
        return 'bg-amber-500 hover:bg-amber-600'
      case 'high':
        return 'bg-red-500 hover:bg-red-600'
      default:
        return 'bg-slate-500 hover:bg-slate-600'
    }
  }
  
  // Helper function to get report type badge color
  const getReportTypeBadge = (type: ReportSummary['type']) => {
    switch (type) {
      case 'performance':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Performance</Badge>
      case 'timeline':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Timeline</Badge>
      case 'budget':
        return <Badge variant="outline" className="border-green-500 text-green-500">Budget</Badge>
      case 'risk':
        return <Badge variant="outline" className="border-red-500 text-red-500">Risk</Badge>
      case 'quality':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Quality</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  // Helper function to get report status badge
  const getReportStatusBadge = (status: ReportSummary['status']) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>
      case 'generated':
        return <Badge variant="default">New</Badge>
      case 'viewed':
        return <Badge variant="outline">Viewed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Insights</h1>
          <p className="text-muted-foreground">
            View detailed reports and performance metrics for your projects
          </p>
        </div>
      </div>
      
      {/* Metrics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                  <h3 className="text-2xl font-bold mt-1">{metric.value}%</h3>
                </div>
                <div className={`flex items-center ${
                  metric.changeType === 'positive'
                    ? 'text-emerald-500'
                    : metric.changeType === 'negative'
                    ? 'text-red-500'
                    : 'text-slate-500'
                }`}>
                  {metric.changeType === 'positive' ? (
                    <ArrowUpIcon className="h-4 w-4 mr-1" />
                  ) : metric.changeType === 'negative' ? (
                    <ArrowDownIcon className="h-4 w-4 mr-1" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Report Filters & Project Performance Tabs */}
      <Tabs defaultValue="reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reports">Available Reports</TabsTrigger>
          <TabsTrigger value="performance">Project Performance</TabsTrigger>
          <TabsTrigger value="team">Team Insights</TabsTrigger>
        </TabsList>
        
        {/* Available Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilterIcon className="mr-2 h-5 w-5" />
                Filter Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project-filter">Project</Label>
                  <Select 
                    value={selectedProject} 
                    onValueChange={setSelectedProject}
                  >
                    <SelectTrigger id="project-filter">
                      <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {performance.map(project => (
                        <SelectItem key={project.projectId} value={project.projectId}>
                          {project.projectName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type-filter">Report Type</Label>
                  <Select 
                    value={selectedReportType} 
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="timeline">Timeline</SelectItem>
                      <SelectItem value="budget">Budget</SelectItem>
                      <SelectItem value="risk">Risk</SelectItem>
                      <SelectItem value="quality">Quality</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="search-reports">Search Reports</Label>
                  <div className="relative">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-reports"
                      placeholder="Search by title or description..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Reports List */}
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>
                {filteredReports.length} reports found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReports.length > 0 ? (
                <div className="space-y-4">
                  {filteredReports.map(report => (
                    <div key={report.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="font-medium text-lg">{report.title}</div>
                        <div className="flex items-center gap-2">
                          {getReportTypeBadge(report.type)}
                          {getReportStatusBadge(report.status)}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3">
                        {report.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <span className="sr-only">View</span>
                            View Details
                          </Button>
                          
                          <Button size="sm" disabled={report.status === 'scheduled'}>
                            <DownloadIcon className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No reports found matching your filters</p>
                </div>
              )}
            </CardContent>
            {filteredReports.length > 5 && (
              <CardFooter className="flex justify-center">
                <Button variant="outline">Load More Reports</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        {/* Project Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Performance Metrics</CardTitle>
              <CardDescription>
                View detailed performance data for all active projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 Days</SelectItem>
                      <SelectItem value="30days">Last 30 Days</SelectItem>
                      <SelectItem value="90days">Last 90 Days</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center ml-auto gap-2">
                    <Button variant="outline" size="sm">
                      <BarChart2Icon className="h-4 w-4 mr-1" />
                      Bar
                    </Button>
                    <Button variant="outline" size="sm">
                      <LineChartIcon className="h-4 w-4 mr-1" />
                      Line
                    </Button>
                    <Button variant="outline" size="sm">
                      <PieChartIcon className="h-4 w-4 mr-1" />
                      Pie
                    </Button>
                  </div>
                </div>
                
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Open Issues</TableHead>
                      <TableHead className="text-right">Tasks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performance.map((project) => (
                      <TableRow key={project.projectId}>
                        <TableCell className="font-medium">
                          {project.projectName}
                        </TableCell>
                        <TableCell className={getTimelineStatusColor(project.metrics.timelineStatus)}>
                          {project.metrics.timelineStatus.charAt(0).toUpperCase() + project.metrics.timelineStatus.slice(1)}
                        </TableCell>
                        <TableCell>
                          <div className="w-24 flex flex-col gap-1">
                            <Progress value={project.metrics.progress} className="h-2" />
                            <span className="text-xs text-muted-foreground">{project.metrics.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className={getBudgetStatusColor(project.metrics.budgetStatus)}>
                          {project.metrics.budgetStatus.charAt(0).toUpperCase() + project.metrics.budgetStatus.slice(1)}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRiskLevelColor(project.metrics.riskLevel)}>
                            {project.metrics.riskLevel.charAt(0).toUpperCase() + project.metrics.riskLevel.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {project.metrics.openIssues}
                        </TableCell>
                        <TableCell className="text-right">
                          {project.metrics.completedTasks}/{project.metrics.totalTasks}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Project Details Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {performance.map((project) => (
              <AccordionItem key={project.projectId} value={project.projectId}>
                <AccordionTrigger className="px-4">
                  {project.projectName} Details
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Timeline</h4>
                            <p className="text-sm">
                              <span className="font-medium">Start Date:</span> {new Date(project.startDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">End Date:</span> {new Date(project.endDate).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Status Summary</h4>
                            <p className="text-sm flex items-center gap-2">
                              <span className="font-medium">Timeline:</span> 
                              <span className={getTimelineStatusColor(project.metrics.timelineStatus)}>
                                {project.metrics.timelineStatus.charAt(0).toUpperCase() + project.metrics.timelineStatus.slice(1)}
                              </span>
                            </p>
                            <p className="text-sm flex items-center gap-2">
                              <span className="font-medium">Budget:</span> 
                              <span className={getBudgetStatusColor(project.metrics.budgetStatus)}>
                                {project.metrics.budgetStatus.charAt(0).toUpperCase() + project.metrics.budgetStatus.slice(1)}
                              </span>
                            </p>
                            <p className="text-sm flex items-center gap-2">
                              <span className="font-medium">Risk:</span> 
                              <Badge className={getRiskLevelColor(project.metrics.riskLevel)}>
                                {project.metrics.riskLevel.charAt(0).toUpperCase() + project.metrics.riskLevel.slice(1)}
                              </Badge>
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Progress</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Overall Completion</span>
                                <span>{project.metrics.progress}%</span>
                              </div>
                              <Progress value={project.metrics.progress} className="h-2" />
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">Task Status</h4>
                            <p className="text-sm">
                              <span className="font-medium">Completed Tasks:</span> {project.metrics.completedTasks} of {project.metrics.totalTasks}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Open Issues:</span> {project.metrics.openIssues}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button variant="outline" className="mr-2">View Timeline</Button>
                        <Button>Detailed Report</Button>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
        
        {/* Team Insights Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Key team members working on your projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="pt-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full mb-3 overflow-hidden">
                        <img 
                          src={member.avatar} 
                          alt={member.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                      <Button variant="outline" size="sm" className="mt-4">
                        Contact
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ReportsInsights