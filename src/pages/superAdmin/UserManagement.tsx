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
  UserPlus, 
  ShieldAlert,
  Mail,
  Download,
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

/**
 * Mock user data interfaces
 */
interface User {
  id: string
  name: string
  email: string
  role: 'superAdmin' | 'orgAdmin' | 'teamMember' | 'client'
  organizationId?: string
  organizationName?: string
  status: 'active' | 'pending' | 'inactive'
  lastLogin?: string
  avatar?: string
}

/**
 * UserManagement component for Super Admin role
 * Allows management of all users across the platform
 */
const UserManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<string>('all')
  const [selectedRole, setSelectedRole] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  type UserRole = 'superAdmin' | 'orgAdmin' | 'teamMember' | 'client'
  
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    role: 'teamMember' as UserRole,
    organizationId: '',
  })
  
  // Mock organizations for demo
  const organizations = [
    { id: 'org-1', name: 'Acme Corp' },
    { id: 'org-2', name: 'Globex Inc' },
    { id: 'org-3', name: 'Stark Industries' },
    { id: 'org-4', name: 'Wayne Enterprises' },
    { id: 'org-5', name: 'Umbrella Corporation' },
  ]
  
  // Mock users data for demo
  const mockUsers: User[] = [
    {
      id: 'sa-1',
      name: 'John Smith',
      email: 'admin@teamlens.com',
      role: 'superAdmin',
      status: 'active',
      lastLogin: '2 hours ago',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=6366f1&color=fff'
    },
    {
      id: 'oa-1',
      name: 'Emma Johnson',
      email: 'emma@acmecorp.com',
      role: 'orgAdmin',
      organizationId: 'org-1',
      organizationName: 'Acme Corp',
      status: 'active',
      lastLogin: '1 day ago',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Johnson&background=f43f5e&color=fff'
    },
    {
      id: 'oa-2',
      name: 'Michael Chen',
      email: 'michael@globexinc.com',
      role: 'orgAdmin',
      organizationId: 'org-2',
      organizationName: 'Globex Inc',
      status: 'active',
      lastLogin: '5 days ago',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=f43f5e&color=fff'
    },
    {
      id: 'tm-1',
      name: 'Sarah Williams',
      email: 'sarah@acmecorp.com',
      role: 'teamMember',
      organizationId: 'org-1',
      organizationName: 'Acme Corp',
      status: 'active',
      lastLogin: '3 hours ago',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Williams&background=10b981&color=fff'
    },
    {
      id: 'tm-2',
      name: 'David Rodriguez',
      email: 'david@globexinc.com',
      role: 'teamMember',
      organizationId: 'org-2',
      organizationName: 'Globex Inc',
      status: 'active',
      lastLogin: '2 days ago',
      avatar: 'https://ui-avatars.com/api/?name=David+Rodriguez&background=10b981&color=fff'
    },
    {
      id: 'tm-3',
      name: 'Lisa Taylor',
      email: 'lisa@acmecorp.com',
      role: 'teamMember',
      organizationId: 'org-1',
      organizationName: 'Acme Corp',
      status: 'inactive',
      lastLogin: '30 days ago',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Taylor&background=10b981&color=fff'
    },
    {
      id: 'cl-1',
      name: 'James Miller',
      email: 'james@client.com',
      role: 'client',
      organizationId: 'org-3',
      organizationName: 'Stark Industries',
      status: 'active',
      lastLogin: '1 hour ago',
      avatar: 'https://ui-avatars.com/api/?name=James+Miller&background=fb923c&color=fff'
    },
    {
      id: 'cl-2',
      name: 'Robert Davis',
      email: 'robert@wayne.com',
      role: 'client',
      organizationId: 'org-4',
      organizationName: 'Wayne Enterprises',
      status: 'pending',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Davis&background=fb923c&color=fff'
    },
  ]
  
  // Filter users based on search query and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.organizationName && user.organizationName.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesOrg = selectedOrg === 'all' || user.organizationId === selectedOrg
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus
    
    return matchesSearch && matchesOrg && matchesRole && matchesStatus
  })
  
  // Handle adding a new user
  const handleAddUser = () => {
    // Validation
    if (!newUserData.name || !newUserData.email) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (newUserData.role !== 'superAdmin' && !newUserData.organizationId) {
      toast.error('Please select an organization')
      return
    }
    
    // In a real app, this would call an API
    // For now, just show success message
    toast.success(`Invitation sent to ${newUserData.email}`)
    setIsAddUserOpen(false)
    
    // Reset form
    setNewUserData({
      name: '',
      email: '',
      role: 'teamMember' as UserRole,
      organizationId: '',
    })
  }
  
  // Get badge color based on role
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'superAdmin':
        return 'bg-indigo-500 hover:bg-indigo-600'
      case 'orgAdmin':
        return 'bg-rose-500 hover:bg-rose-600'
      case 'teamMember':
        return 'bg-emerald-500 hover:bg-emerald-600'
      case 'client':
        return 'bg-amber-500 hover:bg-amber-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }
  
  // Get badge color based on status
  const getStatusBadgeColor = (status: 'active' | 'pending' | 'inactive') => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
    }
  }
  
  // Mock function to handle user actions
  const handleUserAction = (action: 'edit' | 'delete' | 'resend' | 'promote', userId: string) => {
    switch (action) {
      case 'edit':
        toast.info(`Edit user ${userId} (This would open the edit form)`)
        break
      case 'delete':
        toast.info(`Delete user ${userId} (This would show a confirmation dialog)`)
        break
      case 'resend':
        toast.success(`Invitation resent to user ${userId}`)
        break
      case 'promote':
        toast.success(`User ${userId} promoted to admin`)
        break
      default:
        break
    }
  }
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users across organizations in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the platform. They will receive an invitation email.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUserData.name}
                    onChange={(e) => setNewUserData({...newUserData, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select 
                    value={newUserData.role} 
                    onValueChange={(value: UserRole) => setNewUserData({...newUserData, role: value})}
                  >
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="superAdmin">Super Admin</SelectItem>
                      <SelectItem value="orgAdmin">Organization Admin</SelectItem>
                      <SelectItem value="teamMember">Team Member</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {newUserData.role !== 'superAdmin' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="organization" className="text-right">
                      Organization
                    </Label>
                    <Select 
                      value={newUserData.organizationId} 
                      onValueChange={(value) => setNewUserData({...newUserData, organizationId: value})}
                    >
                      <SelectTrigger id="organization" className="col-span-3">
                        <SelectValue placeholder="Select an organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map(org => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddUserOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddUser}
                >
                  Send Invitation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all users across organizations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all-users" className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between">
              <TabsList>
                <TabsTrigger value="all-users">All Users</TabsTrigger>
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="team-members">Team Members</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
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
                    <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label htmlFor="org-filter">Organization</Label>
                      <Select 
                        value={selectedOrg} 
                        onValueChange={setSelectedOrg}
                      >
                        <SelectTrigger id="org-filter" className="mt-1">
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Organizations</SelectItem>
                          {organizations.map(org => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <Label htmlFor="role-filter">Role</Label>
                      <Select 
                        value={selectedRole} 
                        onValueChange={setSelectedRole}
                      >
                        <SelectTrigger id="role-filter" className="mt-1">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="superAdmin">Super Admin</SelectItem>
                          <SelectItem value="orgAdmin">Org Admin</SelectItem>
                          <SelectItem value="teamMember">Team Member</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
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
          
            <TabsContent value="all-users" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No users found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                ) : null}
                                <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.organizationName || (user.role === 'superAdmin' ? 'Platform Admin' : 'N/A')}
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role === 'superAdmin' 
                                ? 'Super Admin' 
                                : user.role === 'orgAdmin'
                                  ? 'Org Admin'
                                  : user.role === 'teamMember'
                                    ? 'Team Member'
                                    : 'Client'
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin || 'Never'}
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
                                <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {user.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleUserAction('resend', user.id)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Invitation
                                  </DropdownMenuItem>
                                )}
                                {user.role !== 'superAdmin' && user.role !== 'orgAdmin' && (
                                  <DropdownMenuItem onClick={() => handleUserAction('promote', user.id)}>
                                    <ShieldAlert className="mr-2 h-4 w-4" />
                                    Promote to Admin
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction('delete', user.id)}>
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
            
            {/* Other tabs would filter by role - the implementation would be similar */}
            <TabsContent value="admins" className="pt-4">
              <div className="rounded-md border">
                <Table>
                  {/* Similar table structure with filtered users */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter(user => user.role === 'superAdmin' || user.role === 'orgAdmin')
                      .map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                ) : null}
                                <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.organizationName || (user.role === 'superAdmin' ? 'Platform Admin' : 'N/A')}
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role === 'superAdmin' 
                                ? 'Super Admin' 
                                : 'Org Admin'
                              }
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin || 'Never'}
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
                                <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {user.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleUserAction('resend', user.id)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Invitation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction('delete', user.id)}>
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
            
            {/* Team Members Tab */}
            <TabsContent value="team-members" className="pt-4">
              {/* Similar implementation as the admins tab but filtering for team members */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter(user => user.role === 'teamMember')
                      .map((user) => (
                        <TableRow key={user.id}>
                          {/* Row content similar to admins tab */}
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                ) : null}
                                <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.organizationName || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              Team Member
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin || 'Never'}
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
                                <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {user.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleUserAction('resend', user.id)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Invitation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleUserAction('promote', user.id)}>
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                  Promote to Admin
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction('delete', user.id)}>
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
            
            {/* Clients Tab */}
            <TabsContent value="clients" className="pt-4">
              {/* Similar implementation but filtering for clients */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox />
                      </TableHead>
                      <TableHead className="min-w-[150px]">User</TableHead>
                      <TableHead>Organization</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers
                      .filter(user => user.role === 'client')
                      .map((user) => (
                        <TableRow key={user.id}>
                          {/* Row content similar to other tabs */}
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-8 w-8">
                                {user.avatar ? (
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                ) : null}
                                <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.organizationName || 'N/A'}
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              Client
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.lastLogin || 'Never'}
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
                                <DropdownMenuItem onClick={() => handleUserAction('edit', user.id)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                {user.status === 'pending' && (
                                  <DropdownMenuItem onClick={() => handleUserAction('resend', user.id)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Resend Invitation
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUserAction('delete', user.id)}>
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

export default UserManagement