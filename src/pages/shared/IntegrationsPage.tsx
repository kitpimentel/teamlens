import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  Puzzle,
  Plus,
  Search,
  ExternalLink,
  RefreshCw,
  Check,
  X,
  Settings,
  AlertTriangle,
  Info,
  Trash2,
  ChevronRight,
  Filter
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Define types for integrations
interface Integration {
  id: string
  name: string
  provider: string
  description: string
  icon: string
  status: 'connected' | 'disconnected' | 'error'
  lastSynced?: string
  connectedAt?: string
  category: 'project' | 'communication' | 'calendar' | 'document' | 'other'
  features: string[]
  projects?: string[]
  settings?: {
    autoSync: boolean
    syncInterval: 'realtime' | '5min' | '15min' | '30min' | '1hour' | '1day'
    defaultProject?: string
  }
}

interface AvailableIntegration {
  id: string
  name: string
  provider: string
  description: string
  icon: string
  category: 'project' | 'communication' | 'calendar' | 'document' | 'other'
  features: string[]
  popularityScore: number // 1-100
  isNew?: boolean
}

interface Project {
  id: string
  name: string
}

/**
 * Integrations Page Component
 * 
 * Allows users to view, connect, and manage external tool integrations.
 */
const IntegrationsPage = () => {
  const { user } = useAuth()
  
  const [activeIntegrations, setActiveIntegrations] = useState<Integration[]>([])
  const [availableIntegrations, setAvailableIntegrations] = useState<AvailableIntegration[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false)
  const [isIntegrationDialogOpen, setIsIntegrationDialogOpen] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchIntegrationsData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for active integrations
        const mockActiveIntegrations: Integration[] = [
          {
            id: 'int-1',
            name: 'JIRA',
            provider: 'Atlassian',
            description: 'Track and manage issues, bugs, and agile development.',
            icon: '/jira-icon.svg',
            status: 'connected',
            lastSynced: '2025-03-30T14:30:00Z',
            connectedAt: '2025-02-15T10:25:00Z',
            category: 'project',
            features: ['Issue Tracking', 'Sprint Planning', 'Agile Boards'],
            projects: ['proj-1', 'proj-2'],
            settings: {
              autoSync: true,
              syncInterval: '15min',
              defaultProject: 'proj-1'
            }
          },
          {
            id: 'int-2',
            name: 'Zoom',
            provider: 'Zoom',
            description: 'Video conferencing, online meetings, and screen sharing.',
            icon: '/zoom-icon.svg',
            status: 'connected',
            lastSynced: '2025-03-30T09:15:00Z',
            connectedAt: '2025-02-20T14:30:00Z',
            category: 'communication',
            features: ['Meetings', 'Recordings', 'Calendar Integration'],
            settings: {
              autoSync: true,
              syncInterval: 'realtime'
            }
          },
          {
            id: 'int-3',
            name: 'Google Calendar',
            provider: 'Google',
            description: 'Schedule and manage meetings and events.',
            icon: '/google-calendar-icon.svg',
            status: 'error',
            lastSynced: '2025-03-28T16:45:00Z',
            connectedAt: '2025-02-10T11:20:00Z',
            category: 'calendar',
            features: ['Event Scheduling', 'Meeting Reminders', 'Availability Checking'],
            settings: {
              autoSync: true,
              syncInterval: '5min'
            }
          },
          {
            id: 'int-4',
            name: 'Microsoft Teams',
            provider: 'Microsoft',
            description: 'Chat, meet, call, and collaborate all in one place.',
            icon: '/ms-teams-icon.svg',
            status: 'disconnected',
            connectedAt: '2025-01-05T09:30:00Z',
            category: 'communication',
            features: ['Chat', 'Meetings', 'File Sharing'],
            settings: {
              autoSync: false,
              syncInterval: '30min'
            }
          }
        ]
        
        // Mock data for available integrations
        const mockAvailableIntegrations: AvailableIntegration[] = [
          {
            id: 'avail-1',
            name: 'ClickUp',
            provider: 'ClickUp',
            description: 'All-in-one productivity platform for tasks, docs, goals, and chat.',
            icon: '/clickup-icon.svg',
            category: 'project',
            features: ['Task Management', 'Time Tracking', 'Custom Fields'],
            popularityScore: 92
          },
          {
            id: 'avail-2',
            name: 'Asana',
            provider: 'Asana',
            description: 'Work management platform for teams to stay focused on goals.',
            icon: '/asana-icon.svg',
            category: 'project',
            features: ['Task Management', 'Timeline', 'Portfolios'],
            popularityScore: 88
          },
          {
            id: 'avail-3',
            name: 'Monday.com',
            provider: 'Monday.com',
            description: 'Visual work management platform for teams of all sizes.',
            icon: '/monday-icon.svg',
            category: 'project',
            features: ['Boards', 'Dashboards', 'Automations'],
            popularityScore: 85
          },
          {
            id: 'avail-4',
            name: 'Google Meet',
            provider: 'Google',
            description: 'Secure video meetings for your business.',
            icon: '/google-meet-icon.svg',
            category: 'communication',
            features: ['Video Conferencing', 'Screen Sharing', 'Calendar Integration'],
            popularityScore: 90
          },
          {
            id: 'avail-5',
            name: 'Google Drive',
            provider: 'Google',
            description: 'Secure cloud storage and file sharing for teams.',
            icon: '/google-drive-icon.svg',
            category: 'document',
            features: ['File Storage', 'Document Collaboration', 'Version History'],
            popularityScore: 95
          },
          {
            id: 'avail-6',
            name: 'Figma',
            provider: 'Figma',
            description: 'Collaborative design and prototyping tool.',
            icon: '/figma-icon.svg',
            category: 'document',
            features: ['Design Files', 'Prototypes', 'Comments'],
            popularityScore: 78,
            isNew: true
          },
          {
            id: 'avail-7',
            name: 'Slack',
            provider: 'Slack',
            description: 'Business communication platform for teams.',
            icon: '/slack-icon.svg',
            category: 'communication',
            features: ['Channels', 'Direct Messages', 'App Integrations'],
            popularityScore: 96
          },
          {
            id: 'avail-8',
            name: 'Outlook Calendar',
            provider: 'Microsoft',
            description: 'Plan schedules and set up meetings with Outlook Calendar.',
            icon: '/outlook-calendar-icon.svg',
            category: 'calendar',
            features: ['Event Scheduling', 'Meeting Organization', 'Reminders'],
            popularityScore: 82
          }
        ]
        
        // Mock projects
        const mockProjects: Project[] = [
          { id: 'proj-1', name: 'Website Redesign' },
          { id: 'proj-2', name: 'Mobile App Development' },
          { id: 'proj-3', name: 'Content Creation' }
        ]
        
        setActiveIntegrations(mockActiveIntegrations)
        setAvailableIntegrations(mockAvailableIntegrations)
        setProjects(mockProjects)
      } catch (error) {
        console.error('Error fetching integrations data:', error)
        // Handle error appropriately
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchIntegrationsData()
  }, [])
  
  // Filter active integrations based on search query, category, and status
  const filteredActiveIntegrations = activeIntegrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      integration.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || integration.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })
  
  // Filter available integrations based on search query and category
  const filteredAvailableIntegrations = availableIntegrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      integration.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || integration.category === categoryFilter
    
    // Check if already connected
    const isAlreadyConnected = activeIntegrations.some(
      activeInt => activeInt.name === integration.name && activeInt.status === 'connected'
    )
    
    return matchesSearch && matchesCategory && !isAlreadyConnected
  })
  
  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffMins < 1) {
      return 'Just now'
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    } else {
      // Format as date for older timestamps
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return date.toLocaleDateString(undefined, options)
    }
  }
  
  // Get default icon for a category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'project':
        return '📊'
      case 'communication':
        return '💬'
      case 'calendar':
        return '📅'
      case 'document':
        return '📄'
      default:
        return '🔧'
    }
  }
  
  // Handle toggling integration status
  const handleToggleStatus = (id: string) => {
    setActiveIntegrations(prevIntegrations => 
      prevIntegrations.map(integration => 
        integration.id === id ? {
          ...integration,
          status: integration.status === 'connected' ? 'disconnected' : 'connected',
          lastSynced: integration.status === 'disconnected' ? new Date().toISOString() : integration.lastSynced
        } : integration
      )
    )
  }
  
  // Handle opening configuration dialog
  const handleConfigureIntegration = (integration: Integration) => {
    setSelectedIntegration(integration)
    setIsConfiguring(true)
  }
  
  // Handle saving integration configuration
  const handleSaveConfiguration = () => {
    if (!selectedIntegration) return
    
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      // Update integration in state
      setActiveIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => 
          integration.id === selectedIntegration.id ? selectedIntegration : integration
        )
      )
      
      setIsSubmitting(false)
      setIsConfiguring(false)
      
      // Show success message
      alert('Integration configuration saved successfully')
    }, 1000)
  }
  
  // Handle integration removal
  const handleRemoveIntegration = (id: string) => {
    setActiveIntegrations(prevIntegrations => 
      prevIntegrations.filter(integration => integration.id !== id)
    )
  }
  
  // Handle adding a new integration
  const handleAddIntegration = (availableIntegration: AvailableIntegration) => {
    setIsIntegrationDialogOpen(false)
    
    // Simulate API call for connecting to integration
    setTimeout(() => {
      const newIntegration: Integration = {
        id: `int-${Date.now()}`,
        name: availableIntegration.name,
        provider: availableIntegration.provider,
        description: availableIntegration.description,
        icon: availableIntegration.icon,
        status: 'connected',
        lastSynced: new Date().toISOString(),
        connectedAt: new Date().toISOString(),
        category: availableIntegration.category,
        features: availableIntegration.features,
        settings: {
          autoSync: true,
          syncInterval: '15min'
        }
      }
      
      setActiveIntegrations(prev => [newIntegration, ...prev])
      
      // Show success message
      alert(`${availableIntegration.name} connected successfully`)
    }, 2000)
  }
  
  // Change settings for selected integration
  const updateSelectedIntegrationSetting = (key: string, value: any) => {
    if (!selectedIntegration) return
    
    setSelectedIntegration({
      ...selectedIntegration,
      settings: {
        ...selectedIntegration.settings,
        [key]: value
      }
    })
  }
  
  // Handle project selection for integration
  const toggleProjectForIntegration = (projectId: string) => {
    if (!selectedIntegration) return
    
    const currentProjects = selectedIntegration.projects || []
    const updatedProjects = currentProjects.includes(projectId)
      ? currentProjects.filter(id => id !== projectId)
      : [...currentProjects, projectId]
    
    setSelectedIntegration({
      ...selectedIntegration,
      projects: updatedProjects
    })
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
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect and manage your external tools and services
          </p>
        </div>
        <Button onClick={() => setIsIntegrationDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </div>
      
      {/* Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-5 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="sm:col-span-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="project">Project Management</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="disconnected">Disconnected</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-1">
              <Button variant="outline" size="icon" className="w-full h-10" onClick={() => {
                setSearchQuery('')
                setCategoryFilter('all')
                setStatusFilter('all')
              }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="connected" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="connected">
            Connected
            <Badge variant="secondary" className="ml-2">{activeIntegrations.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="available">
            Available Integrations
          </TabsTrigger>
        </TabsList>
        
        {/* Connected Integrations Tab */}
        <TabsContent value="connected">
          {filteredActiveIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActiveIntegrations.map(integration => (
                <Card key={integration.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-xl">
                          {integration.icon ? (
                            <img src={integration.icon} alt={integration.name} className="w-6 h-6" />
                          ) : (
                            getCategoryIcon(integration.category)
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.provider}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                <Badge 
                                  variant={
                                    integration.status === 'connected' ? 'default' : 
                                    integration.status === 'error' ? 'destructive' : 
                                    'secondary'
                                  }
                                >
                                  {integration.status === 'connected' ? (
                                    <Check className="h-3 w-3 mr-1" />
                                  ) : integration.status === 'error' ? (
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <X className="h-3 w-3 mr-1" />
                                  )}
                                  {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {integration.status === 'connected' ? (
                                <p>Last synced: {formatDate(integration.lastSynced)}</p>
                              ) : integration.status === 'error' ? (
                                <p>There was an error with this integration</p>
                              ) : (
                                <p>This integration is currently disconnected</p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      {integration.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {integration.features.map((feature, index) => (
                        <Badge key={index} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Connected: {formatDate(integration.connectedAt)}</p>
                      {integration.status === 'connected' && (
                        <p>Sync Interval: {integration.settings?.syncInterval || '15min'}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <div className="flex items-center">
                      <Switch
                        checked={integration.status === 'connected'}
                        onCheckedChange={() => handleToggleStatus(integration.id)}
                        id={`toggle-${integration.id}`}
                      />
                      <Label htmlFor={`toggle-${integration.id}`} className="ml-2 text-sm">
                        {integration.status === 'connected' ? 'Enabled' : 'Disabled'}
                      </Label>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleConfigureIntegration(integration)}
                      >
                        <Settings className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Integration</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to remove the {integration.name} integration? This will disconnect all associated services and data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleRemoveIntegration(integration.id)}
                            >
                              Remove Integration
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto rounded-full bg-accent w-16 h-16 flex items-center justify-center mb-4">
                <Puzzle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">No integrations found</h3>
              <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ?
                  'Try adjusting your search or filters' :
                  'Get started by connecting your first integration'}
              </p>
              {!filteredActiveIntegrations.length && (
                <Button className="mt-4" onClick={() => setIsIntegrationDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        {/* Available Integrations Tab */}
        <TabsContent value="available">
          {filteredAvailableIntegrations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAvailableIntegrations
                .sort((a, b) => b.popularityScore - a.popularityScore)
                .map(integration => (
                  <Card key={integration.id} className="relative overflow-hidden">
                    {integration.isNew && (
                      <div className="absolute top-0 right-0">
                        <Badge className="rounded-tl-none rounded-br-none">New</Badge>
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-xl">
                          {integration.icon ? (
                            <img src={integration.icon} alt={integration.name} className="w-6 h-6" />
                          ) : (
                            getCategoryIcon(integration.category)
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          <CardDescription>{integration.provider}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        {integration.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="outline">{feature}</Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Badge variant="secondary" className="mr-2">
                          {integration.category.charAt(0).toUpperCase() + integration.category.slice(1)}
                        </Badge>
                        <div className="flex items-center">
                          <span className="mr-1">Popularity:</span>
                          <div className="h-2 w-20 bg-accent rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${integration.popularityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-xs"
                        asChild
                      >
                        <a 
                          href={`https://example.com/integrations/${integration.name.toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Learn More
                        </a>
                      </Button>
                      <Button 
                        size="sm"
                        className="text-xs"
                        onClick={() => handleAddIntegration(integration)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Connect
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto rounded-full bg-accent w-16 h-16 flex items-center justify-center mb-4">
                <Puzzle className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-lg">No available integrations found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Configure Integration Dialog */}
      <Dialog open={isConfiguring} onOpenChange={setIsConfiguring}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Configure Integration</DialogTitle>
            <DialogDescription>
              Customize settings for {selectedIntegration?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedIntegration && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-xl">
                  {selectedIntegration.icon ? (
                    <img src={selectedIntegration.icon} alt={selectedIntegration.name} className="w-6 h-6" />
                  ) : (
                    getCategoryIcon(selectedIntegration.category)
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedIntegration.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedIntegration.provider}
                  </p>
                </div>
                <Badge 
                  variant={
                    selectedIntegration.status === 'connected' ? 'default' : 
                    selectedIntegration.status === 'error' ? 'destructive' : 
                    'secondary'
                  }
                  className="ml-auto"
                >
                  {selectedIntegration.status === 'connected' ? 'Connected' : 
                   selectedIntegration.status === 'error' ? 'Error' : 'Disconnected'}
                </Badge>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sync Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync" className="font-normal">Automatic Sync</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable automatic synchronization
                    </p>
                  </div>
                  <Switch
                    id="auto-sync"
                    checked={selectedIntegration.settings?.autoSync ?? true}
                    onCheckedChange={(checked) => 
                      updateSelectedIntegrationSetting('autoSync', checked)
                    }
                  />
                </div>
                
                <div>
                  <Label htmlFor="sync-interval">Sync Interval</Label>
                  <Select 
                    id="sync-interval"
                    value={selectedIntegration.settings?.syncInterval || '15min'}
                    onValueChange={(value) => 
                      updateSelectedIntegrationSetting('syncInterval', value)
                    }
                    disabled={!selectedIntegration.settings?.autoSync}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Interval" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="30min">Every 30 minutes</SelectItem>
                      <SelectItem value="1hour">Every hour</SelectItem>
                      <SelectItem value="1day">Once daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedIntegration.category === 'project' && (
                  <div>
                    <Label htmlFor="default-project">Default Project</Label>
                    <Select 
                      id="default-project"
                      value={selectedIntegration.settings?.defaultProject || ''}
                      onValueChange={(value) => 
                        updateSelectedIntegrationSetting('defaultProject', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Default Project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Default</SelectItem>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              
              {/* Project Access Settings */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Project Access</h3>
                <p className="text-xs text-muted-foreground">
                  Select which projects can use this integration
                </p>
                
                {projects.map(project => (
                  <div key={project.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`project-${project.id}`}
                      className="checkbox checkbox-primary"
                      checked={selectedIntegration.projects?.includes(project.id) ?? false}
                      onChange={() => toggleProjectForIntegration(project.id)}
                    />
                    <Label htmlFor={`project-${project.id}`} className="font-normal">
                      {project.name}
                    </Label>
                  </div>
                ))}
              </div>
              
              <Separator />
              
              {/* Integration-specific settings, would vary based on the integration type */}
              {selectedIntegration.name === 'JIRA' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">JIRA-Specific Settings</h3>
                  
                  <div>
                    <Label htmlFor="jira-project-key">JIRA Project Key</Label>
                    <Input id="jira-project-key" defaultValue="PROJ" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="jira-two-way-sync" className="font-normal">Two-Way Sync</Label>
                      <p className="text-xs text-muted-foreground">
                        Changes in JIRA will also update Team Lens
                      </p>
                    </div>
                    <Switch id="jira-two-way-sync" defaultChecked />
                  </div>
                </div>
              )}
              
              {selectedIntegration.name === 'Zoom' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Zoom-Specific Settings</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="zoom-auto-record" className="font-normal">Auto-Record Meetings</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically record all Zoom meetings
                      </p>
                    </div>
                    <Switch id="zoom-auto-record" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="zoom-transcription" className="font-normal">Meeting Transcription</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable automatic transcription for meetings
                      </p>
                    </div>
                    <Switch id="zoom-transcription" defaultChecked />
                  </div>
                </div>
              )}
              
              {/* Generic section for other integrations */}
              {selectedIntegration.name !== 'JIRA' && selectedIntegration.name !== 'Zoom' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">{selectedIntegration.name}-Specific Settings</h3>
                  <p className="text-xs text-muted-foreground">
                    Configure additional settings for {selectedIntegration.name}
                  </p>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <a 
                      href={`https://example.com/integrations/${selectedIntegration.name.toLowerCase()}/settings`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Advanced Configuration
                    </a>
                  </Button>
                </div>
              )}
              
              {/* Integration Health */}
              <div className="rounded-md bg-accent p-4 flex items-start gap-3">
                <div className={`mt-0.5 ${
                  selectedIntegration.status === 'connected' ? 'text-green-500' : 
                  selectedIntegration.status === 'error' ? 'text-red-500' : 
                  'text-amber-500'
                }`}>
                  {selectedIntegration.status === 'connected' ? (
                    <Check className="h-5 w-5" />
                  ) : selectedIntegration.status === 'error' ? (
                    <AlertTriangle className="h-5 w-5" />
                  ) : (
                    <Info className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">Integration Health</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedIntegration.status === 'connected' ? (
                      `Connected and syncing. Last synced ${formatDate(selectedIntegration.lastSynced)}.`
                    ) : selectedIntegration.status === 'error' ? (
                      'Integration is experiencing errors. Please check your connection settings.'
                    ) : (
                      'Integration is currently disconnected. Enable to start syncing.'
                    )}
                  </p>
                  {selectedIntegration.status === 'error' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="mt-2"
                      onClick={() => {
                        // Simulate refreshing the connection
                        setTimeout(() => {
                          setSelectedIntegration({
                            ...selectedIntegration,
                            status: 'connected',
                            lastSynced: new Date().toISOString()
                          })
                        }, 1500)
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Connection
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfiguring(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveConfiguration} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Integration Dialog */}
      <Dialog open={isIntegrationDialogOpen} onOpenChange={setIsIntegrationDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add Integration</DialogTitle>
            <DialogDescription>
              Browse and connect with available integrations for your workspace
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search integrations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="project">Project Management</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-1">
              {filteredAvailableIntegrations
                .sort((a, b) => b.popularityScore - a.popularityScore)
                .map(integration => (
                  <div 
                    key={integration.id} 
                    className="flex items-start gap-3 p-3 border rounded-md hover:bg-accent transition-colors cursor-pointer"
                    onClick={() => handleAddIntegration(integration)}
                  >
                    <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center text-xl flex-shrink-0">
                      {integration.icon ? (
                        <img src={integration.icon} alt={integration.name} className="w-6 h-6" />
                      ) : (
                        getCategoryIcon(integration.category)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{integration.name}</h3>
                        {integration.isNew && (
                          <Badge>New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {integration.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {integration.category}
                        </Badge>
                        <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            
            {filteredAvailableIntegrations.length === 0 && (
              <div className="text-center py-8">
                <div className="mx-auto rounded-full bg-accent w-12 h-12 flex items-center justify-center mb-3">
                  <Puzzle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">No integrations found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search or category filters
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsIntegrationDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" asChild>
              <a 
                href="https://example.com/integrations/request"
                target="_blank"
                rel="noopener noreferrer"
              >
                Request Integration
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IntegrationsPage