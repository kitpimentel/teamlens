import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { 
  BarChart as BarChartIcon,
  ArrowDownToLine,
  FileText,
  AlertTriangle,
  Activity,
  Users,
  Building2,
  Laptop,
  Calendar,
  RefreshCw,
  Plus,
  Clock
} from 'lucide-react'
import { AreaChart } from '@/components/admin/charts/AreaChart'
import { BarChartComponent } from '@/components/admin/charts/BarChart'
import { DoughnutChart } from '@/components/admin/charts/DoughnutChart'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

/**
 * SuperAdminReports component displays platform-wide reports and analytics
 * for the Super Admin role.
 */
const SuperAdminReports: React.FC = () => {
  const [timeframe, setTimeframe] = useState('30d')
  const [reportType, setReportType] = useState('all')
  
  // Mock user metrics data
  const userMetricsData = [
    { name: 'Jan', activeUsers: 2450, newUsers: 320 },
    { name: 'Feb', activeUsers: 2680, newUsers: 350 },
    { name: 'Mar', activeUsers: 2850, newUsers: 275 },
    { name: 'Apr', activeUsers: 3120, newUsers: 390 },
    { name: 'May', activeUsers: 3370, newUsers: 410 },
    { name: 'Jun', activeUsers: 3650, newUsers: 425 },
    { name: 'Jul', activeUsers: 3920, newUsers: 455 },
    { name: 'Aug', activeUsers: 4180, newUsers: 398 },
    { name: 'Sep', activeUsers: 4320, newUsers: 370 },
    { name: 'Oct', activeUsers: 4450, newUsers: 325 }
  ]
  
  // Mock organization metrics data
  const orgMetricsData = [
    { name: 'Jan', total: 32, active: 30, trial: 2 },
    { name: 'Feb', total: 35, active: 32, trial: 3 },
    { name: 'Mar', total: 37, active: 34, trial: 3 },
    { name: 'Apr', total: 39, active: 36, trial: 3 },
    { name: 'May', total: 41, active: 38, trial: 3 },
    { name: 'Jun', total: 42, active: 39, trial: 3 },
    { name: 'Jul', total: 44, active: 40, trial: 4 },
    { name: 'Aug', total: 45, active: 42, trial: 3 },
    { name: 'Sep', total: 46, active: 43, trial: 3 },
    { name: 'Oct', total: 47, active: 44, trial: 3 }
  ]
  
  // Mock integration usage data
  const integrationUsageData = [
    { name: 'JIRA', value: 32 },
    { name: 'ClickUp', value: 24 },
    { name: 'Asana', value: 18 },
    { name: 'Monday', value: 15 },
    { name: 'Teams', value: 7 },
    { name: 'Zoom', value: 4 }
  ]
  
  // Mock platform performance data
  const performanceData = [
    { name: 'Mon', apiResponseTime: 145, pageLoadTime: 780 },
    { name: 'Tue', apiResponseTime: 152, pageLoadTime: 795 },
    { name: 'Wed', apiResponseTime: 137, pageLoadTime: 760 },
    { name: 'Thu', apiResponseTime: 168, pageLoadTime: 820 },
    { name: 'Fri', apiResponseTime: 155, pageLoadTime: 805 },
    { name: 'Sat', apiResponseTime: 125, pageLoadTime: 720 },
    { name: 'Sun', apiResponseTime: 118, pageLoadTime: 685 }
  ]
  
  // Mock browser usage data
  const browserUsageData = [
    { name: 'Chrome', value: 62 },
    { name: 'Firefox', value: 15 },
    { name: 'Safari', value: 12 },
    { name: 'Edge', value: 9 },
    { name: 'Other', value: 2 }
  ]
  
  // Mock device data
  const deviceData = [
    { name: 'Desktop', value: 68 },
    { name: 'Mobile', value: 24 },
    { name: 'Tablet', value: 8 }
  ]
  
  // Mock system events data
  const systemEventsData = [
    {
      id: 1,
      type: 'error',
      message: 'API Rate Limit Exceeded - Monday.com integration',
      timestamp: '2023-10-25 14:32:45',
      count: 17,
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      message: 'Database query performance degradation',
      timestamp: '2023-10-25 10:15:22',
      count: 8,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      message: 'Platform update scheduled for 2023-10-30',
      timestamp: '2023-10-24 16:45:12',
      count: 1,
      priority: 'low'
    },
    {
      id: 4,
      type: 'error',
      message: 'Authentication service temporary outage',
      timestamp: '2023-10-24 09:22:37',
      count: 12,
      priority: 'high'
    },
    {
      id: 5,
      type: 'warning',
      message: 'High CPU usage detected on application server',
      timestamp: '2023-10-23 22:18:05',
      count: 3,
      priority: 'medium'
    }
  ]
  
  // Mock scheduled reports data
  const scheduledReportsData = [
    {
      id: 1,
      name: 'Monthly Platform Performance Report',
      recipients: 'admin@teamlens.com',
      frequency: 'Monthly',
      lastSent: '2023-10-01',
      nextScheduled: '2023-11-01'
    },
    {
      id: 2,
      name: 'Weekly User Activity Report',
      recipients: 'admin@teamlens.com, managers@teamlens.com',
      frequency: 'Weekly',
      lastSent: '2023-10-23',
      nextScheduled: '2023-10-30'
    },
    {
      id: 3,
      name: 'Daily Integration Health Check',
      recipients: 'techalerts@teamlens.com',
      frequency: 'Daily',
      lastSent: '2023-10-25',
      nextScheduled: '2023-10-26'
    },
    {
      id: 4,
      name: 'Quarterly Business Review',
      recipients: 'executive@teamlens.com',
      frequency: 'Quarterly',
      lastSent: '2023-10-01',
      nextScheduled: '2024-01-01'
    }
  ]
  
  // Mock generated reports data
  const generatedReportsData = [
    {
      id: 1,
      name: 'October 2023 Platform Performance',
      type: 'performance',
      generated: '2023-10-25 00:01:23',
      size: '1.2 MB',
      format: 'PDF'
    },
    {
      id: 2,
      name: 'User Growth Analysis Q3 2023',
      type: 'user',
      generated: '2023-10-15 08:45:12',
      size: '3.5 MB',
      format: 'PDF'
    },
    {
      id: 3,
      name: 'Weekly System Health - Oct 16-22',
      type: 'system',
      generated: '2023-10-23 00:15:00',
      size: '875 KB',
      format: 'PDF'
    },
    {
      id: 4,
      name: 'Integration Usage Report - September',
      type: 'integration',
      generated: '2023-10-02 03:10:45',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      id: 5,
      name: 'API Performance Analysis - Q3',
      type: 'performance',
      generated: '2023-10-05 12:30:22',
      size: '2.3 MB',
      format: 'PDF'
    }
  ]
  
  // Function to get card color based on report type
  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
      case 'user':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20'
      case 'system':
        return 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
      case 'integration':
        return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20'
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-800/30'
    }
  }
  
  // Function to get icon based on report type
  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <Activity className="h-4 w-4" />
      case 'user':
        return <Users className="h-4 w-4" />
      case 'system':
        return <Laptop className="h-4 w-4" />
      case 'integration':
        return <RefreshCw className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }
  
  // Function to get alert type color and icon
  const getAlertTypeDetails = (type: string) => {
    switch (type) {
      case 'error':
        return {
          color: 'text-red-500 bg-red-50 dark:bg-red-900/20',
          icon: <AlertTriangle className="h-4 w-4" />
        }
      case 'warning':
        return {
          color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
          icon: <AlertTriangle className="h-4 w-4" />
        }
      case 'info':
        return {
          color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
          icon: <Activity className="h-4 w-4" />
        }
      default:
        return {
          color: 'text-gray-500 bg-gray-50 dark:bg-gray-800/30',
          icon: <Activity className="h-4 w-4" />
        }
    }
  }
  
  // Function to handle report download
  const handleReportDownload = (_reportId: number) => {
    // This would call an API to download the report
    // For now, just show a toast
    toast.success(`Report download initiated`)
  }
  
  // Function to handle report generation
  const handleGenerateReport = (reportType: string) => {
    // This would call an API to generate a report
    // For now, just show a toast
    toast.success(`${reportType} report generation started`)
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Platform-wide reports and analytics dashboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BarChartIcon className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="system-events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <AlertTriangle className="mr-2 h-4 w-4" />
            System Events
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Calendar className="mr-2 h-4 w-4" />
            Scheduled Reports
          </TabsTrigger>
          <TabsTrigger value="generated" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <FileText className="mr-2 h-4 w-4" />
            Generated Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">User Metrics</CardTitle>
                <CardDescription>Active users and new user growth</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <AreaChart data={userMetricsData} xKey="name" yKey="activeUsers" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Organization Growth</CardTitle>
                <CardDescription>Total, active, and trial organizations</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <BarChartComponent 
                  data={orgMetricsData} 
                  categories={['active', 'trial']} 
                  index="name" 
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Integration Usage</CardTitle>
                <CardDescription>By percentage of activities</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <DoughnutChart data={integrationUsageData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Browser Usage</CardTitle>
                <CardDescription>User browser distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <DoughnutChart data={browserUsageData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Device Distribution</CardTitle>
                <CardDescription>User device types</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px]">
                <DoughnutChart data={deviceData} />
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Platform Performance</CardTitle>
              <CardDescription>API response time (ms) and page load time (ms)</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <BarChartComponent 
                data={performanceData} 
                categories={['apiResponseTime', 'pageLoadTime']} 
                index="name" 
              />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Generate Custom Report</CardTitle>
                <CardDescription>Create a new report with custom filters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Metrics</SelectItem>
                      <SelectItem value="users">User Metrics</SelectItem>
                      <SelectItem value="performance">Performance Metrics</SelectItem>
                      <SelectItem value="integrations">Integration Usage</SelectItem>
                      <SelectItem value="organizations">Organization Metrics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <RadioGroup defaultValue="30d" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="7d" id="r1" />
                      <Label htmlFor="r1">Last 7 days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="30d" id="r2" />
                      <Label htmlFor="r2">Last 30 days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="90d" id="r3" />
                      <Label htmlFor="r3">Last 90 days</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1y" id="r4" />
                      <Label htmlFor="r4">Last year</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Format</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pdf" defaultChecked />
                    <Label htmlFor="pdf">PDF</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="csv" />
                    <Label htmlFor="csv">CSV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="json" />
                    <Label htmlFor="json">JSON</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleGenerateReport('Custom')}>
                  Generate Report
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">Quick Reports</CardTitle>
                <CardDescription>Generate predefined reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between" 
                    onClick={() => handleGenerateReport('Platform Performance')}
                  >
                    <div className="flex items-center">
                      <Activity className="mr-2 h-4 w-4" />
                      Platform Performance Report
                    </div>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    API response times, page loads, and system performance metrics
                  </p>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between" 
                    onClick={() => handleGenerateReport('User Analytics')}
                  >
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      User Analytics Report
                    </div>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Active users, engagement, and role distribution
                  </p>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between" 
                    onClick={() => handleGenerateReport('Organization Growth')}
                  >
                    <div className="flex items-center">
                      <Building2 className="mr-2 h-4 w-4" />
                      Organization Growth Report
                    </div>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Organization trends, user counts, and subscription data
                  </p>
                </div>
                
                <div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-between" 
                    onClick={() => handleGenerateReport('Integration Health')}
                  >
                    <div className="flex items-center">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Integration Health Report
                    </div>
                    <FileText className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Integration usage, errors, and API call statistics
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* System Events Tab */}
        <TabsContent value="system-events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
              <CardDescription>
                Recent system events, errors, and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead className="min-w-[300px]">Message</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemEventsData.map((event) => {
                      const alertDetails = getAlertTypeDetails(event.type)
                      
                      return (
                        <TableRow key={event.id}>
                          <TableCell>
                            <Badge variant="outline" className={alertDetails.color}>
                              <span className="flex items-center">
                                {alertDetails.icon}
                                <span className="ml-1">
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {event.message}
                          </TableCell>
                          <TableCell>
                            {event.count}
                          </TableCell>
                          <TableCell>
                            <Badge className={
                              event.priority === 'high' 
                                ? 'bg-red-500' 
                                : event.priority === 'medium'
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                            }>
                              {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{event.timestamp}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>
                  Current system status and health metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>API Service</Label>
                    <span className="text-sm text-emerald-500 font-medium">Healthy</span>
                  </div>
                  <Progress value={96} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    96% uptime in the last 24 hours
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Database</Label>
                    <span className="text-sm text-emerald-500 font-medium">Healthy</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    99.9% uptime in the last 24 hours
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Authentication Service</Label>
                    <span className="text-sm text-emerald-500 font-medium">Healthy</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    100% uptime in the last 24 hours
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Integration Service</Label>
                    <span className="text-sm text-amber-500 font-medium">Partial Outage</span>
                  </div>
                  <Progress value={76} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    76% uptime in the last 24 hours - Monday.com API issues
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Error Distribution</CardTitle>
                <CardDescription>
                  Most common errors in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <DoughnutChart data={[
                  { name: 'API Rate Limiting', value: 38 },
                  { name: 'Authentication Errors', value: 22 },
                  { name: 'Database Timeouts', value: 18 },
                  { name: 'Integration Errors', value: 15 },
                  { name: 'Other', value: 7 }
                ]} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Scheduled Reports Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Configure and manage automated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Report Name</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Last Sent</TableHead>
                      <TableHead>Next Scheduled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReportsData.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          {report.name}
                        </TableCell>
                        <TableCell>
                          {report.recipients}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {report.frequency}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.lastSent}
                        </TableCell>
                        <TableCell>
                          {report.nextScheduled}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm">
                            Send Now
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Scheduled Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Generated Reports Tab */}
        <TabsContent value="generated" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[250px]">Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedReportsData.map((report) => {
                      const typeColor = getReportTypeColor(report.type)
                      const typeIcon = getReportTypeIcon(report.type)
                      
                      return (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={typeColor}>
                              <span className="flex items-center">
                                {typeIcon}
                                <span className="ml-1">
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                </span>
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{report.generated}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {report.size}
                          </TableCell>
                          <TableCell>
                            <Badge>{report.format}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleReportDownload(report.id)}
                            >
                              <ArrowDownToLine className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SuperAdminReports