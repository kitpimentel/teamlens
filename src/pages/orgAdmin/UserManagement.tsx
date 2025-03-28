import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  UserPlus, 
  Users, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertTriangle,
  Trash,
  Edit,
  UserCog,
  ShieldAlert,
  Key
} from 'lucide-react';

// Types definition
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'inactive';
  permissions: string[];
  teams: string[];
  lastActive: string;
  avatar?: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: 'pending' | 'expired';
  teams: string[];
  sentAt: string;
  expiresAt: string;
}

// Mock data
const mockUsers: User[] = [
  { 
    id: '1', 
    name: 'Alex Johnson', 
    email: 'alex.johnson@example.com', 
    role: 'Project Manager', 
    status: 'active', 
    permissions: ['create_project', 'manage_team', 'view_reports'],
    teams: ['Development', 'Design'],
    lastActive: '2025-03-29T14:32:00Z'
  },
  { 
    id: '2', 
    name: 'Sam Williams', 
    email: 'sam.williams@example.com', 
    role: 'Developer', 
    status: 'active', 
    permissions: ['view_project', 'edit_tasks'],
    teams: ['Development'],
    lastActive: '2025-03-29T08:15:00Z'
  },
  { 
    id: '3', 
    name: 'Taylor Rodriguez', 
    email: 'taylor.rodriguez@example.com', 
    role: 'Designer', 
    status: 'active', 
    permissions: ['view_project', 'edit_tasks', 'upload_files'],
    teams: ['Design'],
    lastActive: '2025-03-28T16:45:00Z'
  },
  { 
    id: '4', 
    name: 'Jordan Lee', 
    email: 'jordan.lee@example.com', 
    role: 'Marketing Specialist', 
    status: 'invited', 
    permissions: ['view_project', 'view_reports'],
    teams: ['Marketing'],
    lastActive: ''
  },
  { 
    id: '5', 
    name: 'Casey Morgan', 
    email: 'casey.morgan@example.com', 
    role: 'Product Owner', 
    status: 'inactive', 
    permissions: ['create_project', 'manage_team', 'view_reports', 'admin_access'],
    teams: ['Product'],
    lastActive: '2025-03-15T10:22:00Z'
  },
];

const mockInvitations: Invitation[] = [
  {
    id: '1',
    email: 'jordan.lee@example.com',
    role: 'Marketing Specialist',
    status: 'pending',
    teams: ['Marketing'],
    sentAt: '2025-03-27T09:00:00Z',
    expiresAt: '2025-04-03T09:00:00Z'
  },
  {
    id: '2',
    email: 'riley.smith@example.com',
    role: 'Developer',
    status: 'pending',
    teams: ['Development'],
    sentAt: '2025-03-28T14:30:00Z',
    expiresAt: '2025-04-04T14:30:00Z'
  },
  {
    id: '3',
    email: 'quinn.davis@example.com',
    role: 'QA Engineer',
    status: 'expired',
    teams: ['QA'],
    sentAt: '2025-03-20T11:15:00Z',
    expiresAt: '2025-03-27T11:15:00Z'
  }
];

const mockTeams = [
  'Development',
  'Design',
  'Marketing',
  'Product',
  'QA',
  'DevOps'
];

const mockRoles = [
  'Project Manager',
  'Developer',
  'Designer',
  'Marketing Specialist',
  'Product Owner',
  'QA Engineer',
  'DevOps Engineer'
];

/**
 * Organization User Management Component
 * 
 * Allows organization admins to manage users, roles, permissions,
 * and team assignments, as well as handle invitations.
 */
const OrgUserManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter invitations based on search query
  const filteredInvitations = mockInvitations.filter(invitation => 
    invitation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invitation.role.toLowerCase().includes(searchQuery.toLowerCase())
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
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    
    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday, show "Yesterday"
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  /**
   * Get days remaining for invitation
   */
  const getDaysRemaining = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiryDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  /**
   * Get status badge for user
   */
  const getUserStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'invited':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Invited</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Inactive</Badge>;
      default:
        return null;
    }
  };

  /**
   * Get status badge for invitation
   */
  const getInvitationStatusBadge = (status: string, expiresAt: string) => {
    if (status === 'expired') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Expired</Badge>;
    }
    
    const daysRemaining = getDaysRemaining(expiresAt);
    
    if (daysRemaining <= 2) {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Expires Soon</Badge>;
    }
    
    return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending</Badge>;
  };

  /**
   * Handle user selection for editing
   */
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditUserOpen(true);
  };

  /**
   * Handle invitation resend
   */
  const handleResendInvitation = (invitation: Invitation) => {
    // In a real implementation, this would call an API to resend the invitation
    showSuccess(`Invitation resent to ${invitation.email}`);
  };

  /**
   * Handle invitation cancellation
   */
  const handleCancelInvitation = (invitation: Invitation) => {
    // In a real implementation, this would call an API to cancel the invitation
    showSuccess(`Invitation to ${invitation.email} has been cancelled`);
  };

  /**
   * Handle adding a new user/sending invitation
   */
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to add a user or send an invitation
    setIsAddUserOpen(false);
    showSuccess('Invitation sent successfully');
  };

  /**
   * Handle updating a user
   */
  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to update the user
    setIsEditUserOpen(false);
    showSuccess('User updated successfully');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users, permissions, and team assignments for your organization
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <UserPlus className="h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a User</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization. Invitations expire after 7 days.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddUser}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select defaultValue="Developer">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockRoles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Teams</Label>
                    <div className="border rounded-md p-4 space-y-2">
                      {mockTeams.map(team => (
                        <div key={team} className="flex items-center space-x-2">
                          <Checkbox id={`team-${team}`} />
                          <label
                            htmlFor={`team-${team}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {team}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Select defaultValue="bulk">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Bulk actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bulk">Bulk actions</SelectItem>
              <SelectItem value="invite-multiple">Invite Multiple</SelectItem>
              <SelectItem value="export">Export Users</SelectItem>
              <SelectItem value="deactivate-all">Deactivate All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-2">
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="invitations" className="flex items-center gap-1">
            <Mail className="h-4 w-4" />
            Invitations
          </TabsTrigger>
        </TabsList>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                Manage users, their roles, permissions and team assignments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">User</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Teams</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Last Active</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{user.name}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{user.role}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {user.teams.map(team => (
                              <Badge key={team} variant="secondary" className="text-xs">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getUserStatusBadge(user.status)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {user.status === 'invited' ? 'Not yet joined' : formatDate(user.lastActive)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCog className="h-4 w-4 mr-2" />
                                Manage Permissions
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Key className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                {user.status === 'active' ? 'Deactivate' : 'Delete'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No users found</h3>
                  <p className="text-muted-foreground text-sm">Try adjusting your search query</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {mockUsers.length} users
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Invitations Tab */}
        <TabsContent value="invitations">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                Track and manage invitation status. Invitations expire after 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium">Email</th>
                      <th className="text-left py-3 px-4 font-medium">Role</th>
                      <th className="text-left py-3 px-4 font-medium">Teams</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Sent</th>
                      <th className="text-left py-3 px-4 font-medium">Expires</th>
                      <th className="text-right py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredInvitations.map(invitation => (
                      <tr key={invitation.id} className="hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{invitation.email}</td>
                        <td className="py-3 px-4">{invitation.role}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {invitation.teams.map(team => (
                              <Badge key={team} variant="secondary" className="text-xs">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getInvitationStatusBadge(invitation.status, invitation.expiresAt)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatDate(invitation.sentAt)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {invitation.status === 'expired' ? (
                            <span className="text-red-500">Expired</span>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{getDaysRemaining(invitation.expiresAt)} days left</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {invitation.status === 'expired' ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleResendInvitation(invitation)}
                            >
                              Resend
                            </Button>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleResendInvitation(invitation)}
                              >
                                Resend
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleCancelInvitation(invitation)}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredInvitations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12">
                  <Mail className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No invitations found</h3>
                  <p className="text-muted-foreground text-sm">All invitations have been accepted or you haven't sent any</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredInvitations.length} of {mockInvitations.length} invitations
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details, role, and team assignments
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={handleUpdateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    defaultValue={selectedUser.name}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-email">Email address</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    defaultValue={selectedUser.email}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-role">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Teams</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    {mockTeams.map(team => (
                      <div key={team} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`edit-team-${team}`} 
                          defaultChecked={selectedUser.teams.includes(team)}
                        />
                        <label
                          htmlFor={`edit-team-${team}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {team}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Update User</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrgUserManagement;