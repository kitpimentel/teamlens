import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Plus, 
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  FileCode,
  Settings2,
  FileText,
  Filter
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

/**
 * Integration type definitions
 */
type IntegrationType = 'project-management' | 'meeting' | 'authentication' | 'other'
type IntegrationStatus = 'active' | 'inactive' | 'maintenance' | 'deprecated'
type IntegrationAction = 'edit' | 'delete' | 'update' | 'reset'

/**
 * Integration interface for the mock data
 */
interface Integration {
  id: string
  name: string
  type: IntegrationType
  description: string
  status: IntegrationStatus
  version: string
  lastUpdated: string
  apiCallsLast30Days: number
  organizations: number
  rateLimitPerMin: number
  logoUrl?: string
  documentationUrl?: string
  connections?: number
}

/**
 * Form data for new integration
 */
interface NewIntegrationData {
  name: string
  type: IntegrationType
  description: string
  apiKey: string
  apiSecret: string
  webhookUrl: string
  rateLimitPerMin: number
}

/**
 * IntegrationsManagement component for Super Admin
 * Manages all platform integrations with third-party tools
 */
const IntegrationsManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [currentIntegration, setCurrentIntegration] = useState<Integration | null>(null)
  const [newIntegration, setNewIntegration] = useState<NewIntegrationData>({
    name: '',
    type: 'project-management',
    description: '',
    apiKey: '',
    apiSecret: '',
    webhookUrl: '',
    rateLimitPerMin: 60,
  })
  
  // Mock integrations data for demo
  const mockIntegrations: Integration[] = [
    {
      id: 'jira',
      name: 'JIRA',
      type: 'project-management',
      description: 'Atlassian JIRA integration for project tracking and issue management',
      status: 'active',
      version: '3.2.1',
      lastUpdated: '2023-06-15',
      apiCallsLast30Days: 125487,
      organizations: 36,
      rateLimitPerMin: 120,
      logoUrl: 'https://ui-avatars.com/api/?name=JIRA&background=0052CC&color=fff',
      documentationUrl: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/',
      connections: 87
    },
    {
      id: 'clickup',
      name: 'ClickUp',
      type: 'project-management',
      description: 'ClickUp integration for task management and project collaboration',
      status: 'active',
      version: '2.5.0',
      lastUpdated: '2023-05-22',
      apiCallsLast30Days: 98765,
      organizations: 28,
      rateLimitPerMin: 100,
      logoUrl: 'https://ui-avatars.com/api/?name=ClickUp&background=7B68EE&color=fff',
      documentationUrl: 'https://clickup.com/api',
      connections: 65
    },
    {
      id: 'asana',
      name: 'Asana',
      type: 'project-management',
      description: 'Asana integration for task tracking and team collaboration',
      status: 'active',
      version: '1.8.3',
      lastUpdated: '2023-04-30',
      apiCallsLast30Days: 78542,
      organizations: 22,
      rateLimitPerMin: 80,
      logoUrl: 'https://ui-avatars.com/api/?name=Asana&background=FC636B&color=fff',
      documentationUrl: 'https://developers.asana.com/docs',
      connections: 49
    },
    {
      id: 'monday',
      name: 'Monday.com',
      type: 'project-management',
      description: 'Monday.com integration for workflow management',
      status: 'maintenance',
      version: '2.1.0',
      lastUpdated: '2023-03-18',
      apiCallsLast30Days: 54321,
      organizations: 18,
      rateLimitPerMin: 90,
      logoUrl: 'https://ui-avatars.com/api/?name=Monday&background=ff3d57&color=fff',
      documentationUrl: 'https://developer.monday.com/api-reference/docs',
      connections: 31
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      type: 'meeting',
      description: 'Microsoft Teams integration for meetings and collaboration',
      status: 'active',
      version: '1.4.2',
      lastUpdated: '2023-06-01',
      apiCallsLast30Days: 35987,
      organizations: 25,
      rateLimitPerMin: 60,
      logoUrl: 'https://ui-avatars.com/api/?name=MS+Teams&background=6264A7&color=fff',
      documentationUrl: 'https://learn.microsoft.com/en-us/graph/teams-concept-overview',
      connections: 52
    },
    {
      id: 'zoom',
      name: 'Zoom',
      type: 'meeting',
      description: 'Zoom integration for video conferencing and meetings',
      status: 'active',
      version: '2.0.1',
      lastUpdated: '2023-05-15',
      apiCallsLast30Days: 42158,
      organizations: 31,
      rateLimitPerMin: 100,
      logoUrl: 'https://ui-avatars.com/api/?name=Zoom&background=2D8CFF&color=fff',
      documentationUrl: 'https://marketplace.zoom.us/docs/api-reference/introduction',
      connections: 68
    },
    {
      id: 'gmeet',
      name: 'Google Meet',
      type: 'meeting',
      description: 'Google Meet integration for video conferencing',
      status: 'active',
      version: '1.1.0',
      lastUpdated: '2023-04-10',
      apiCallsLast30Days: 28754,
      organizations: 20,
      rateLimitPerMin: 60,
      logoUrl: 'https://ui-avatars.com/api/?name=Google+Meet&background=00897B&color=fff',
      documentationUrl: 'https://developers.google.com/meet',
      connections: 43
    },
    {
      id: 'oauth',
      name: 'OAuth 2.0',
      type: 'authentication',
      description: 'OAuth 2.0 integration for authentication services',
      status: 'active',
      version: '2.2.0',
      lastUpdated: '2023-06-10',
      apiCallsLast30Days: 156421,
      organizations: 47,
      rateLimitPerMin: 200,
      logoUrl: 'https://ui-avatars.com/api/?name=OAuth&background=1abc9c&color=fff',
      documentationUrl: 'https://oauth.net/2/',
      connections: 47
    },
    {
      id: 'saml',
      name: 'SAML',
      type: 'authentication',
      description: 'SAML integration for single sign-on',
      status: 'active',
      version: '1.5.0',
      lastUpdated: '2023-05-05',
      apiCallsLast30Days: 89632,
      organizations: 15,
      rateLimitPerMin: 150,
      logoUrl: 'https://ui-avatars.com/api/?name=SAML&background=9b59b6&color=fff',
      documentationUrl: 'https://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf',
      connections: 15
    },
    {
      id: 'sharepoint',
      name: 'SharePoint',
      type: 'other',
      description: 'SharePoint integration for document management',
      status: 'deprecated',
      version: '1.0.0',
      lastUpdated: '2022-12-01',
      apiCallsLast30Days: 1254,
      organizations: 5,
      rateLimitPerMin: 30,
      logoUrl: 'https://ui-avatars.com/api/?name=SharePoint&background=0078D4&color=fff',
      documentationUrl: 'https://learn.microsoft.com/en-us/sharepoint/dev/',
      connections: 7
    }
  ]
  
  // Filter integrations based on search query and filters
  const filteredIntegrations = mockIntegrations.filter(integration => {
    const matchesSearch = 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      integration.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === 'all' || integration.type === selectedType
    const matchesStatus = selectedStatus === 'all' || integration.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })
  
  // Get badge color based on status
  const getStatusBadgeColor = (status: IntegrationStatus): string => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
      case 'maintenance':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
      case 'deprecated':
        return 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }
  
  // Get badge color based on integration type
  const getTypeBadgeColor = (type: IntegrationType): string => {
    switch (type) {
      case 'project-management':
        return 'bg-indigo-500'
      case 'meeting':
        return 'bg-cyan-500'
      case 'authentication':
        return 'bg-purple-500'
      case 'other':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  // Handle integration actions
  const handleIntegrationAction = (action: IntegrationAction, integration: Integration) => {
    switch (action) {
      case 'edit':
        setCurrentIntegration(integration)
        setIsEditModalOpen(true)
        break
      case 'delete':
        toast.info(`Delete integration ${integration.id} (This would show a confirmation dialog)`)
        break
      case 'update':
        toast.success(`Integration ${integration.name} updated successfully`)
        break
      case 'reset':
        toast.success(`Integration ${integration.name} credentials reset`)
        break
      default:
        break
    }
  }
  
  // Handle adding a new integration
  const handleAddIntegration = () => {
    // Validation
    if (!newIntegration.name || !newIntegration.description || !newIntegration.apiKey) {
      toast.error('Please fill in all required fields')
      return
    }
    
    // In a real app, this would call an API
    // For now, just show success message
    toast.success(`Integration ${newIntegration.name} added successfully`)
    setIsAddModalOpen(false)
    
    // Reset form
    setNewIntegration({
      name: '',
      type: 'project-management',
      description: '',
      apiKey: '',
      apiSecret: '',
      webhookUrl: '',
      rateLimitPerMin: 60,
    })
  }
  
  // Handle saving edited integration settings
  const handleSaveIntegrationSettings = () => {
    if (!currentIntegration) return
    
    // In a real app, this would call an API
    // For now, just show success message
    toast.success(`Integration ${currentIntegration.name} updated successfully`)
    setIsEditModalOpen(false)
    setCurrentIntegration(null)
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integration Management</h1>
          <p className="text-muted-foreground">
            Manage platform integrations with third-party tools.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Integration
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Integration</DialogTitle>
                <DialogDescription>
                  Configure a new third-party integration for the platform.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newIntegration.name}
                    onChange={(e) => setNewIntegration({...newIntegration, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type *
                  </Label>
                  <Select 
                    value={newIntegration.type} 
                    onValueChange={(value: IntegrationType) => setNewIntegration({...newIntegration, type: value})}
                  >
                    <SelectTrigger id="type" className="col-span-3">
                      <SelectValue placeholder="Select integration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-management">Project Management</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="authentication">Authentication</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newIntegration.description}
                    onChange={(e) => setNewIntegration({...newIntegration, description: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiKey" className="text-right">
                    API Key *
                  </Label>
                  <Input
                    id="apiKey"
                    value={newIntegration.apiKey}
                    onChange={(e) => setNewIntegration({...newIntegration, apiKey: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="apiSecret" className="text-right">
                    API Secret
                  </Label>
                  <Input
                    id="apiSecret"
                    type="password"
                    value={newIntegration.apiSecret}
                    onChange={(e) => setNewIntegration({...newIntegration, apiSecret: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="webhookUrl" className="text-right">
                    Webhook URL
                  </Label>
                  <Input
                    id="webhookUrl"
                    value={newIntegration.webhookUrl}
                    onChange={(e) => setNewIntegration({...newIntegration, webhookUrl: e.target.value})}
                    className="col-span-3"
                    placeholder="https://"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="rateLimitPerMin" className="text-right">
                    Rate Limit
                  </Label>
                  <Input
                    id="rateLimitPerMin"
                    type="number"
                    value={newIntegration.rateLimitPerMin}
                    onChange={(e) => setNewIntegration({...newIntegration, rateLimitPerMin: parseInt(e.target.value)})}
                    className="col-span-3"
                  />
                  <div className="col-start-2 col-span-3 -mt-3">
                    <p className="text-xs text-muted-foreground">
                      Maximum API calls per minute
                    </p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddIntegration}
                >
                  Add Integration
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Integrations</CardTitle>
          <CardDescription>
            Manage third-party integrations for the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-integrations" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <TabsList>
                <TabsTrigger value="all-integrations">All Integrations</TabsTrigger>
                <TabsTrigger value="project-management">Project Management</TabsTrigger>
                <TabsTrigger value="meeting">Meeting</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search integrations..."
                    className="pl-8 w-full sm:w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="sm:ml-2">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter Integrations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label htmlFor="type-filter">Type</Label>
                      <Select 
                        value={selectedType} 
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger id="type-filter" className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="project-management">Project Management</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                          <SelectItem value="authentication">Authentication</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label htmlFor="status-filter">Status</Label>
                      <Select 
                        value={selectedStatus} 
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger id="status-filter" className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="deprecated">Deprecated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* All Integrations Tab */}
            <TabsContent value="all-integrations" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Organizations</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIntegrations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No integrations found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredIntegrations.map((integration) => (
                        <TableRow key={integration.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {integration.logoUrl ? (
                                  <img 
                                    src={integration.logoUrl} 
                                    alt={integration.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileCode className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{integration.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {integration.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(integration.type)}>
                              {integration.type === 'project-management' 
                                ? 'Project Mgmt'
                                : integration.type.charAt(0).toUpperCase() + integration.type.slice(1)
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(integration.status)}>
                              {integration.status === 'active' ? (
                                <CheckCircle className="mr-1 h-3 w-3 inline" />
                              ) : integration.status === 'maintenance' || integration.status === 'deprecated' ? (
                                <AlertCircle className="mr-1 h-3 w-3 inline" />
                              ) : null}
                              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">{integration.version}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.apiCallsLast30Days.toLocaleString()} calls
                            </div>
                            <Progress 
                              value={Math.min((integration.apiCallsLast30Days / 200000) * 100, 100)} 
                              className="h-2 mt-1" 
                            />
                            <div className="text-xs text-muted-foreground mt-1">
                              {integration.rateLimitPerMin} req/min limit
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.organizations} orgs
                            </div>
                            {integration.connections && (
                              <div className="text-xs text-muted-foreground">
                                {integration.connections} connections
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm flex items-center">
                              <Clock className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                              {integration.lastUpdated}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('edit', integration)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Configuration
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('update', integration)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Update Version
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('reset', integration)}
                                >
                                  <Settings2 className="mr-2 h-4 w-4" />
                                  Reset Credentials
                                </DropdownMenuItem>
                                {integration.documentationUrl && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(integration.documentationUrl, '_blank')}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Documentation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('delete', integration)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Project Management Tab */}
            <TabsContent value="project-management" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Organizations</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIntegrations
                      .filter(integration => integration.type === 'project-management')
                      .map((integration) => (
                        <TableRow key={integration.id}>
                          {/* Same row structure as the all-integrations tab */}
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {integration.logoUrl ? (
                                  <img 
                                    src={integration.logoUrl} 
                                    alt={integration.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileCode className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{integration.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {integration.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(integration.type)}>
                              Project Mgmt
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(integration.status)}>
                              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">{integration.version}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.apiCallsLast30Days.toLocaleString()} calls
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                              <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ 
                                  width: `${Math.min((integration.apiCallsLast30Days / 200000) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {integration.rateLimitPerMin} req/min limit
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.organizations} orgs
                            </div>
                            {integration.connections && (
                              <div className="text-xs text-muted-foreground">
                                {integration.connections} connections
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{integration.lastUpdated}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('edit', integration)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Configuration
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('update', integration)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Update Version
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('reset', integration)}
                                >
                                  <Settings2 className="mr-2 h-4 w-4" />
                                  Reset Credentials
                                </DropdownMenuItem>
                                {integration.documentationUrl && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(integration.documentationUrl, '_blank')}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Documentation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('delete', integration)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Meeting Tab */}
            <TabsContent value="meeting" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Organizations</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIntegrations
                      .filter(integration => integration.type === 'meeting')
                      .map((integration) => (
                        <TableRow key={integration.id}>
                          {/* Same row structure */}
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {integration.logoUrl ? (
                                  <img 
                                    src={integration.logoUrl} 
                                    alt={integration.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileCode className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{integration.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {integration.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(integration.type)}>
                              Meeting
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(integration.status)}>
                              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">{integration.version}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.apiCallsLast30Days.toLocaleString()} calls
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                              <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ 
                                  width: `${Math.min((integration.apiCallsLast30Days / 200000) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {integration.rateLimitPerMin} req/min limit
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.organizations} orgs
                            </div>
                            {integration.connections && (
                              <div className="text-xs text-muted-foreground">
                                {integration.connections} connections
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{integration.lastUpdated}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('edit', integration)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Configuration
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('update', integration)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Update Version
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('reset', integration)}
                                >
                                  <Settings2 className="mr-2 h-4 w-4" />
                                  Reset Credentials
                                </DropdownMenuItem>
                                {integration.documentationUrl && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(integration.documentationUrl, '_blank')}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Documentation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('delete', integration)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            {/* Authentication Tab */}
            <TabsContent value="authentication" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Integration</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Organizations</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIntegrations
                      .filter(integration => integration.type === 'authentication')
                      .map((integration) => (
                        <TableRow key={integration.id}>
                          {/* Same row structure */}
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                {integration.logoUrl ? (
                                  <img 
                                    src={integration.logoUrl} 
                                    alt={integration.name} 
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <FileCode className="h-4 w-4 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{integration.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {integration.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getTypeBadgeColor(integration.type)}>
                              Authentication
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(integration.status)}>
                              {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-mono text-sm">{integration.version}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.apiCallsLast30Days.toLocaleString()} calls
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full mt-1">
                              <div 
                                className="h-full bg-indigo-500 rounded-full" 
                                style={{ 
                                  width: `${Math.min((integration.apiCallsLast30Days / 200000) * 100, 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {integration.rateLimitPerMin} req/min limit
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {integration.organizations} orgs
                            </div>
                            {integration.connections && (
                              <div className="text-xs text-muted-foreground">
                                {integration.connections} connections
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{integration.lastUpdated}</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('edit', integration)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Configuration
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('update', integration)}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Update Version
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('reset', integration)}
                                >
                                  <Settings2 className="mr-2 h-4 w-4" />
                                  Reset Credentials
                                </DropdownMenuItem>
                                {integration.documentationUrl && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(integration.documentationUrl, '_blank')}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    Documentation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleIntegrationAction('delete', integration)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Total integrations: {filteredIntegrations.length} of {mockIntegrations.length}
          </p>
          <Button variant="outline" size="sm" onClick={() => window.open('https://docs.teamlens.com/integrations', '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Integration Documentation
          </Button>
        </CardFooter>
      </Card>
      
      {/* Edit Integration Settings Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentIntegration?.name} Integration Settings
            </DialogTitle>
            <DialogDescription>
              Configure settings for this integration.
            </DialogDescription>
          </DialogHeader>
          {currentIntegration && (
            <div className="py-4">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {currentIntegration.logoUrl ? (
                    <img 
                      src={currentIntegration.logoUrl} 
                      alt={currentIntegration.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FileCode className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{currentIntegration.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentIntegration.description}
                  </p>
                </div>
              </div>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="general">
                  <AccordionTrigger>General Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-status">Status</Label>
                        <Select defaultValue={currentIntegration.status}>
                          <SelectTrigger id="edit-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="deprecated">Deprecated</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-version">Version</Label>
                        <Input 
                          id="edit-version" 
                          defaultValue={currentIntegration.version} 
                          className="font-mono"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-rate-limit">Rate Limit (requests per minute)</Label>
                        <Input 
                          id="edit-rate-limit" 
                          type="number" 
                          defaultValue={currentIntegration.rateLimitPerMin} 
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="authentication">
                  <AccordionTrigger>Authentication</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-api-key">API Key</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="edit-api-key" 
                            type="password" 
                            defaultValue="*****************" 
                            className="font-mono"
                          />
                          <Button variant="outline" size="sm">
                            Reveal
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-api-secret">API Secret</Label>
                        <div className="flex space-x-2">
                          <Input 
                            id="edit-api-secret" 
                            type="password" 
                            defaultValue="*****************" 
                            className="font-mono"
                          />
                          <Button variant="outline" size="sm">
                            Reveal
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button variant="outline">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Regenerate Credentials
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="webhooks">
                  <AccordionTrigger>Webhooks</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="edit-webhook-url">Webhook URL</Label>
                        <Input 
                          id="edit-webhook-url" 
                          defaultValue="https://api.teamlens.com/webhooks/integrations/jira" 
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="edit-webhook-active">Active</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable webhook for this integration
                          </p>
                        </div>
                        <Switch
                          id="edit-webhook-active"
                          defaultChecked={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="edit-webhook-verify">Verify Signature</Label>
                          <p className="text-sm text-muted-foreground">
                            Verify webhook request signatures
                          </p>
                        </div>
                        <Switch
                          id="edit-webhook-verify"
                          defaultChecked={true}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="permissions">
                  <AccordionTrigger>Permissions</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="perm-read">Read Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Can read data from the integration
                          </p>
                        </div>
                        <Switch
                          id="perm-read"
                          defaultChecked={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="perm-write">Write Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Can create and update data
                          </p>
                        </div>
                        <Switch
                          id="perm-write"
                          defaultChecked={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="perm-delete">Delete Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Can delete data through the integration
                          </p>
                        </div>
                        <Switch
                          id="perm-delete"
                          defaultChecked={false}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="perm-admin">Admin Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Can manage integration settings
                          </p>
                        </div>
                        <Switch
                          id="perm-admin"
                          defaultChecked={false}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="monitoring">
                  <AccordionTrigger>Monitoring</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="monitor-active">Active Monitoring</Label>
                          <p className="text-sm text-muted-foreground">
                            Actively monitor integration health
                          </p>
                        </div>
                        <Switch
                          id="monitor-active"
                          defaultChecked={true}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="monitor-alerts">Send Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Send alerts for integration issues
                          </p>
                        </div>
                        <Switch
                          id="monitor-alerts"
                          defaultChecked={true}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alert-email">Alert Email</Label>
                        <Input 
                          id="alert-email" 
                          type="email" 
                          defaultValue="alerts@teamlens.com" 
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveIntegrationSettings}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default IntegrationsManagement