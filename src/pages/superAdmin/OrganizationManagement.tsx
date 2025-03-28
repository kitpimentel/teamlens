import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
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
  Building2,
  Users,
  Activity,
  Download,
  Filter,
  ExternalLink,
  Briefcase
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { KpiCard } from '@/components/admin/KpiCard'

/**
 * Organization interface for the mock data
 */
interface Organization {
  id: string
  name: string
  description: string
  industry: string
  website?: string
  status: 'active' | 'inactive' | 'trial'
  createdAt: string
  memberCount: number
  clientCount: number
  projectCount: number
  subscription: 'free' | 'starter' | 'business' | 'enterprise'
  logo?: string
  adminEmail?: string
  adminName?: string
}

/**
 * OrganizationManagement component for Super Admin
 * Allows management of all organizations on the platform
 */
const OrganizationManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedSubscription, setSelectedSubscription] = useState<string>('all')
  const [isAddOrgOpen, setIsAddOrgOpen] = useState(false)
  const [newOrgData, setNewOrgData] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    adminName: '',
    adminEmail: '',
  })

  // Mock organizations data for demo
  const mockOrganizations: Organization[] = [
    {
      id: 'org-1',
      name: 'Acme Corp',
      description: 'Leading provider of everything',
      industry: 'Technology',
      website: 'https://acmecorp.com',
      status: 'active',
      createdAt: '2023-01-15',
      memberCount: 24,
      clientCount: 5,
      projectCount: 8,
      subscription: 'business',
      logo: 'https://ui-avatars.com/api/?name=Acme+Corp&background=6366f1&color=fff',
      adminName: 'Emma Johnson',
      adminEmail: 'emma@acmecorp.com'
    },
    {
      id: 'org-2',
      name: 'Globex Inc',
      description: 'Global export services',
      industry: 'Manufacturing',
      website: 'https://globexinc.com',
      status: 'active',
      createdAt: '2023-03-22',
      memberCount: 18,
      clientCount: 3,
      projectCount: 5,
      subscription: 'enterprise',
      logo: 'https://ui-avatars.com/api/?name=Globex+Inc&background=f43f5e&color=fff',
      adminName: 'Michael Chen',
      adminEmail: 'michael@globexinc.com'
    },
    {
      id: 'org-3',
      name: 'Stark Industries',
      description: 'Innovative technologies and solutions',
      industry: 'Technology',
      website: 'https://starkindustries.com',
      status: 'trial',
      createdAt: '2023-05-10',
      memberCount: 8,
      clientCount: 1,
      projectCount: 2,
      subscription: 'starter',
      logo: 'https://ui-avatars.com/api/?name=Stark+Industries&background=10b981&color=fff',
      adminName: 'Tony Stark',
      adminEmail: 'tony@starkindustries.com'
    },
    {
      id: 'org-4',
      name: 'Wayne Enterprises',
      description: 'Conglomerate with diverse business interests',
      industry: 'Conglomerate',
      website: 'https://wayne-enterprises.com',
      status: 'active',
      createdAt: '2023-02-18',
      memberCount: 35,
      clientCount: 7,
      projectCount: 12,
      subscription: 'enterprise',
      logo: 'https://ui-avatars.com/api/?name=Wayne+Enterprises&background=8b5cf6&color=fff',
      adminName: 'Bruce Wayne',
      adminEmail: 'bruce@wayne-enterprises.com'
    },
    {
      id: 'org-5',
      name: 'Umbrella Corporation',
      description: 'Pharmaceutical research and development',
      industry: 'Healthcare',
      website: 'https://umbrella-corp.com',
      status: 'inactive',
      createdAt: '2023-04-05',
      memberCount: 0,
      clientCount: 0,
      projectCount: 0,
      subscription: 'free',
      logo: 'https://ui-avatars.com/api/?name=Umbrella+Corp&background=ec4899&color=fff'
    },
    {
      id: 'org-6',
      name: 'LexCorp',
      description: 'Technology and research company',
      industry: 'Technology',
      website: 'https://lexcorp.com',
      status: 'active',
      createdAt: '2023-06-20',
      memberCount: 16,
      clientCount: 4,
      projectCount: 6,
      subscription: 'business',
      logo: 'https://ui-avatars.com/api/?name=LexCorp&background=fb923c&color=fff',
      adminName: 'Lex Luthor',
      adminEmail: 'lex@lexcorp.com'
    },
    {
      id: 'org-7',
      name: 'Daily Planet',
      description: 'News and media organization',
      industry: 'Media',
      website: 'https://dailyplanet.com',
      status: 'trial',
      createdAt: '2023-07-14',
      memberCount: 5,
      clientCount: 0,
      projectCount: 1,
      subscription: 'starter',
      logo: 'https://ui-avatars.com/api/?name=Daily+Planet&background=06b6d4&color=fff',
      adminName: 'Perry White',
      adminEmail: 'perry@dailyplanet.com'
    }
  ]
  
  // Filter organizations based on search query and filters
  const filteredOrganizations = mockOrganizations.filter(org => {
    const matchesSearch = 
      org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      org.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (org.adminName && org.adminName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (org.adminEmail && org.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesIndustry = selectedIndustry === 'all' || org.industry === selectedIndustry
    const matchesStatus = selectedStatus === 'all' || org.status === selectedStatus
    const matchesSubscription = selectedSubscription === 'all' || org.subscription === selectedSubscription
    
    return matchesSearch && matchesIndustry && matchesStatus && matchesSubscription
  })
  
  // KPI data for organization metrics
  const kpiData = [
    { 
      title: 'Total Organizations',
      value: mockOrganizations.length.toString(),
      change: '+2',
      trend: 'up',
      description: 'Past 30 days',
      icon: <Building2 className="h-4 w-4" />
    },
    { 
      title: 'Active Users',
      value: '512',
      change: '+48',
      trend: 'up',
      description: 'Across all organizations',
      icon: <Users className="h-4 w-4" />
    },
    { 
      title: 'Active Projects',
      value: '64',
      change: '+7',
      trend: 'up',
      description: 'Currently in progress',
      icon: <Briefcase className="h-4 w-4" />
    },
    { 
      title: 'Platform Utilization',
      value: '86%',
      change: '+3.2%',
      trend: 'up',
      description: 'Average across orgs',
      icon: <Activity className="h-4 w-4" />
    }
  ]
  
  // Industry options for dropdown
  const industries = [
    'Technology',
    'Manufacturing',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Media',
    'Conglomerate',
    'Consulting',
    'Non-profit'
  ]
  
  // Handle adding a new organization
  const handleAddOrganization = () => {
    // Validation
    if (!newOrgData.name || !newOrgData.description || !newOrgData.industry) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (newOrgData.adminEmail && !newOrgData.adminName) {
      toast.error('Admin name is required if admin email is provided')
      return
    }
    
    // In a real app, this would call an API
    // For now, just show success message
    toast.success(`Organization ${newOrgData.name} created successfully`)
    setIsAddOrgOpen(false)
    
    // Reset form
    setNewOrgData({
      name: '',
      description: '',
      industry: '',
      website: '',
      adminName: '',
      adminEmail: '',
    })
  }
  
  // Get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
      case 'trial':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }
  
  // Get badge color based on subscription
  const getSubscriptionBadgeColor = (subscription: string) => {
    switch (subscription) {
      case 'free':
        return 'bg-gray-500'
      case 'starter':
        return 'bg-blue-500'
      case 'business':
        return 'bg-indigo-500'
      case 'enterprise':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  // Mock function to handle organization actions
  const handleOrgAction = (action: string, orgId: string) => {
    switch (action) {
      case 'edit':
        toast.info(`Edit organization ${orgId} (This would open the edit form)`)
        break
      case 'delete':
        toast.info(`Delete organization ${orgId} (This would show a confirmation dialog)`)
        break
      case 'users':
        toast.info(`View users for organization ${orgId}`)
        break
      case 'projects':
        toast.info(`View projects for organization ${orgId}`)
        break
      default:
        break
    }
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Management</h1>
          <p className="text-muted-foreground">
            Manage all organizations on the platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddOrgOpen} onOpenChange={setIsAddOrgOpen}>
            <DialogTrigger asChild>
              <Button>
                <Building2 className="mr-2 h-4 w-4" />
                Add Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Organization</DialogTitle>
                <DialogDescription>
                  Create a new organization on the platform. You can optionally add an admin at the same time.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newOrgData.name}
                    onChange={(e) => setNewOrgData({...newOrgData, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newOrgData.description}
                    onChange={(e) => setNewOrgData({...newOrgData, description: e.target.value})}
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="industry" className="text-right">
                    Industry *
                  </Label>
                  <Select 
                    value={newOrgData.industry} 
                    onValueChange={(value) => setNewOrgData({...newOrgData, industry: value})}
                  >
                    <SelectTrigger id="industry" className="col-span-3">
                      <SelectValue placeholder="Select an industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="website" className="text-right">
                    Website
                  </Label>
                  <Input
                    id="website"
                    value={newOrgData.website}
                    onChange={(e) => setNewOrgData({...newOrgData, website: e.target.value})}
                    className="col-span-3"
                    placeholder="https://"
                  />
                </div>
                
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Organization Admin (Optional)
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adminName" className="text-right">
                    Admin Name
                  </Label>
                  <Input
                    id="adminName"
                    value={newOrgData.adminName}
                    onChange={(e) => setNewOrgData({...newOrgData, adminName: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="adminEmail" className="text-right">
                    Admin Email
                  </Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={newOrgData.adminEmail}
                    onChange={(e) => setNewOrgData({...newOrgData, adminEmail: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddOrgOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrganization}
                >
                  Create Organization
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => (
          <KpiCard 
            key={index}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend as 'up' | 'down' | 'neutral'}
            description={kpi.description}
            icon={kpi.icon}
          />
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Manage all organizations on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-orgs" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <TabsList>
                <TabsTrigger value="all-orgs">All Organizations</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="trial">Trial</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search organizations..."
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
                    <DropdownMenuLabel>Filter Organizations</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label htmlFor="industry-filter">Industry</Label>
                      <Select 
                        value={selectedIndustry} 
                        onValueChange={setSelectedIndustry}
                      >
                        <SelectTrigger id="industry-filter" className="mt-1">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Industries</SelectItem>
                          {industries.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
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
                          <SelectItem value="trial">Trial</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label htmlFor="subscription-filter">Subscription</Label>
                      <Select 
                        value={selectedSubscription} 
                        onValueChange={setSelectedSubscription}
                      >
                        <SelectTrigger id="subscription-filter" className="mt-1">
                          <SelectValue placeholder="Select subscription" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Plans</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="starter">Starter</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="outline" className="sm:ml-2">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <TabsContent value="all-orgs" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Organization</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No organizations found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrganizations.map((org) => (
                        <TableRow key={org.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {org.logo ? (
                                  <AvatarImage src={org.logo} alt={org.name} />
                                ) : null}
                                <AvatarFallback>
                                  {org.name.charAt(0)}{org.name.split(' ')[1]?.charAt(0) || ''}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{org.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {org.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {org.adminName ? (
                              <div>
                                <div className="font-medium">{org.adminName}</div>
                                <div className="text-xs text-muted-foreground">{org.adminEmail}</div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not assigned</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(org.status)}>
                              {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSubscriptionBadgeColor(org.subscription)}>
                              {org.subscription.charAt(0).toUpperCase() + org.subscription.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {org.clientCount} client{org.clientCount !== 1 ? 's' : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{org.createdAt}</div>
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
                                <DropdownMenuItem onClick={() => handleOrgAction('edit', org.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('users', org.id)}>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Users
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('projects', org.id)}>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  View Projects
                                </DropdownMenuItem>
                                {org.website && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(org.website, '_blank')}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Website
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleOrgAction('delete', org.id)}
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
            
            {/* Other tabs would filter by status - the implementation would be similar */}
            <TabsContent value="active" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  {/* Similar table structure with filtered organizations */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Organization</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations
                      .filter(org => org.status === 'active')
                      .map((org) => (
                        <TableRow key={org.id}>
                          {/* Same row structure as the all-orgs tab */}
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {org.logo ? (
                                  <AvatarImage src={org.logo} alt={org.name} />
                                ) : null}
                                <AvatarFallback>
                                  {org.name.charAt(0)}{org.name.split(' ')[1]?.charAt(0) || ''}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{org.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {org.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {org.adminName ? (
                              <div>
                                <div className="font-medium">{org.adminName}</div>
                                <div className="text-xs text-muted-foreground">{org.adminEmail}</div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not assigned</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(org.status)}>
                              {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSubscriptionBadgeColor(org.subscription)}>
                              {org.subscription.charAt(0).toUpperCase() + org.subscription.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {org.clientCount} client{org.clientCount !== 1 ? 's' : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{org.createdAt}</div>
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
                                <DropdownMenuItem onClick={() => handleOrgAction('edit', org.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('users', org.id)}>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Users
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('projects', org.id)}>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  View Projects
                                </DropdownMenuItem>
                                {org.website && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(org.website, '_blank')}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Website
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleOrgAction('delete', org.id)}
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
            
            {/* Trial tab */}
            <TabsContent value="trial" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Organization</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations
                      .filter(org => org.status === 'trial')
                      .map((org) => (
                        <TableRow key={org.id}>
                          {/* Same row structure */}
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {org.logo ? (
                                  <AvatarImage src={org.logo} alt={org.name} />
                                ) : null}
                                <AvatarFallback>
                                  {org.name.charAt(0)}{org.name.split(' ')[1]?.charAt(0) || ''}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{org.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {org.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* Same structure for admin info */}
                            {org.adminName ? (
                              <div>
                                <div className="font-medium">{org.adminName}</div>
                                <div className="text-xs text-muted-foreground">{org.adminEmail}</div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not assigned</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(org.status)}>
                              {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSubscriptionBadgeColor(org.subscription)}>
                              {org.subscription.charAt(0).toUpperCase() + org.subscription.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {org.clientCount} client{org.clientCount !== 1 ? 's' : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{org.createdAt}</div>
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
                                <DropdownMenuItem onClick={() => handleOrgAction('edit', org.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('users', org.id)}>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Users
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('projects', org.id)}>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  View Projects
                                </DropdownMenuItem>
                                {org.website && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(org.website, '_blank')}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Website
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleOrgAction('delete', org.id)}
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
            
            {/* Inactive tab */}
            <TabsContent value="inactive" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[200px]">Organization</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Subscription</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrganizations
                      .filter(org => org.status === 'inactive')
                      .map((org) => (
                        <TableRow key={org.id}>
                          {/* Same row structure */}
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {org.logo ? (
                                  <AvatarImage src={org.logo} alt={org.name} />
                                ) : null}
                                <AvatarFallback>
                                  {org.name.charAt(0)}{org.name.split(' ')[1]?.charAt(0) || ''}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{org.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {org.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {/* Same structure for admin info */}
                            {org.adminName ? (
                              <div>
                                <div className="font-medium">{org.adminName}</div>
                                <div className="text-xs text-muted-foreground">{org.adminEmail}</div>
                              </div>
                            ) : (
                              <div className="text-sm text-muted-foreground">Not assigned</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(org.status)}>
                              {org.status.charAt(0).toUpperCase() + org.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getSubscriptionBadgeColor(org.subscription)}>
                              {org.subscription.charAt(0).toUpperCase() + org.subscription.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {org.memberCount} member{org.memberCount !== 1 ? 's' : ''}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {org.clientCount} client{org.clientCount !== 1 ? 's' : ''}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{org.createdAt}</div>
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
                                <DropdownMenuItem onClick={() => handleOrgAction('edit', org.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('users', org.id)}>
                                  <Users className="mr-2 h-4 w-4" />
                                  View Users
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOrgAction('projects', org.id)}>
                                  <Briefcase className="mr-2 h-4 w-4" />
                                  View Projects
                                </DropdownMenuItem>
                                {org.website && (
                                  <DropdownMenuItem
                                    onClick={() => window.open(org.website, '_blank')}
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Visit Website
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleOrgAction('delete', org.id)}
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
      </Card>
    </div>
  )
}

export default OrganizationManagement