import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Search, UserPlus, Mail, CheckCircle, XCircle, Filter, Download,  ShieldCheck, ShieldAlert, User } from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for team member data
 */
interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: "active" | "inactive" | "invited"
  avatar?: string
  joinDate: string
  lastActive: string
  permissions: string[]
}

/**
 * Organization Admin User Management component
 * Allows organization admins to manage users, roles, and permissions
 */
const OrgUserManagement = () => {
  // Using an underscore prefix to indicate the variable is intentionally not used yet
  const { user: _user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string | null>(null)
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null)

  // Mock team members data
  const initialTeamMembers: TeamMember[] = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "Lead Developer",
      department: "Development",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      joinDate: "2024-01-15",
      lastActive: "2025-03-28",
      permissions: ["view_projects", "edit_projects", "manage_tasks", "view_reports"]
    },
    {
      id: "2",
      name: "Jason Patel",
      email: "jason.patel@example.com",
      role: "UX Designer",
      department: "Design",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      joinDate: "2024-02-03",
      lastActive: "2025-03-27",
      permissions: ["view_projects", "edit_projects", "view_reports"]
    },
    {
      id: "3",
      name: "Michelle Wang",
      email: "michelle.wang@example.com",
      role: "Project Manager",
      department: "Management",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
      joinDate: "2023-11-10",
      lastActive: "2025-03-29",
      permissions: ["view_projects", "edit_projects", "manage_tasks", "view_reports", "manage_team", "manage_clients"]
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@example.com",
      role: "QA Engineer",
      department: "Quality Assurance",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff",
      joinDate: "2024-01-22",
      lastActive: "2025-03-25",
      permissions: ["view_projects", "manage_tasks", "view_reports"]
    },
    {
      id: "5",
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      role: "Frontend Developer",
      department: "Development",
      status: "active",
      avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
      joinDate: "2024-03-05",
      lastActive: "2025-03-28",
      permissions: ["view_projects", "edit_projects", "manage_tasks"]
    },
    {
      id: "6",
      name: "Alex Rodriguez",
      email: "alex.rodriguez@example.com",
      role: "DevOps Engineer",
      department: "Operations",
      status: "invited",
      avatar: "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=ec4899&color=fff",
      joinDate: "2025-03-25",
      lastActive: "",
      permissions: ["view_projects", "manage_tasks"]
    },
    {
      id: "7",
      name: "Jessica Lee",
      email: "jessica.lee@example.com",
      role: "Content Strategist",
      department: "Marketing",
      status: "inactive",
      avatar: "https://ui-avatars.com/api/?name=Jessica+Lee&background=14b8a6&color=fff",
      joinDate: "2023-09-15",
      lastActive: "2025-02-10",
      permissions: ["view_projects", "view_reports"]
    }
  ]

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)

  // Filter team members based on search and filters
  const filteredTeamMembers = teamMembers.filter(member => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by role
    const matchesRole = filterRole === null || member.role === filterRole
    
    // Filter by department
    const matchesDepartment = filterDepartment === null || member.department === filterDepartment
    
    return matchesSearch && matchesRole && matchesDepartment
  })

  // Get unique departments for filtering
  const departments = Array.from(new Set(teamMembers.map(member => member.department)))
  
  // Get unique roles for filtering
  const roles = Array.from(new Set(teamMembers.map(member => member.role)))

  // Handle resending invitation
  const handleResendInvite = (email: string) => {
    toast.success(`Invitation resent to ${email}`)
  }

  // Handle deactivating a user
  const handleDeactivateUser = (id: string, name: string) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, status: "inactive" as const } : member
    )
    setTeamMembers(updatedMembers)
    toast.success(`${name} has been deactivated`)
  }

  // Handle reactivating a user
  const handleReactivateUser = (id: string, name: string) => {
    const updatedMembers = teamMembers.map(member => 
      member.id === id ? { ...member, status: "active" as const } : member
    )
    setTeamMembers(updatedMembers)
    toast.success(`${name} has been reactivated`)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's team members and their permissions
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All Members ({teamMembers.filter(m => m.status === "active" || m.status === "invited").length})</TabsTrigger>
            <TabsTrigger value="active">Active ({teamMembers.filter(m => m.status === "active").length})</TabsTrigger>
            <TabsTrigger value="invited">Invited ({teamMembers.filter(m => m.status === "invited").length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({teamMembers.filter(m => m.status === "inactive").length})</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  DEPARTMENT
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className={!filterDepartment ? "bg-muted/50" : ""} 
                  onClick={() => setFilterDepartment(null)}
                >
                  All Departments
                </DropdownMenuItem>
                {departments.map(dept => (
                  <DropdownMenuItem 
                    key={dept} 
                    className={filterDepartment === dept ? "bg-muted/50" : ""}
                    onClick={() => setFilterDepartment(dept)}
                  >
                    {dept}
                  </DropdownMenuItem>
                ))}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  ROLE
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className={!filterRole ? "bg-muted/50" : ""} 
                  onClick={() => setFilterRole(null)}
                >
                  All Roles
                </DropdownMenuItem>
                {roles.map(role => (
                  <DropdownMenuItem 
                    key={role} 
                    className={filterRole === role ? "bg-muted/50" : ""}
                    onClick={() => setFilterRole(role)}
                  >
                    {role}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <UserTable 
            users={filteredTeamMembers}
            onResendInvite={handleResendInvite}
            onDeactivateUser={handleDeactivateUser}
            onReactivateUser={handleReactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="active" className="mt-0">
          <UserTable 
            users={filteredTeamMembers.filter(m => m.status === "active")}
            onResendInvite={handleResendInvite}
            onDeactivateUser={handleDeactivateUser}
            onReactivateUser={handleReactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="invited" className="mt-0">
          <UserTable 
            users={filteredTeamMembers.filter(m => m.status === "invited")}
            onResendInvite={handleResendInvite}
            onDeactivateUser={handleDeactivateUser}
            onReactivateUser={handleReactivateUser}
          />
        </TabsContent>
        
        <TabsContent value="inactive" className="mt-0">
          <UserTable 
            users={filteredTeamMembers.filter(m => m.status === "inactive")}
            onResendInvite={handleResendInvite}
            onDeactivateUser={handleDeactivateUser}
            onReactivateUser={handleReactivateUser}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

/**
 * User Table component props
 */
interface UserTableProps {
  users: TeamMember[]
  onResendInvite: (email: string) => void
  onDeactivateUser: (id: string, name: string) => void
  onReactivateUser: (id: string, name: string) => void
}

/**
 * User Table component
 * Displays a list of users with their details and actions
 */
const UserTable = ({ users, onResendInvite, onDeactivateUser, onReactivateUser }: UserTableProps) => {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <User className="h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No users found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Department</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Join Date</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Last Active</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((member) => (
              <tr key={member.id} className="border-t hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-muted-foreground">{member.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{member.role}</td>
                <td className="py-3 px-4 hidden md:table-cell">{member.department}</td>
                <td className="py-3 px-4 hidden lg:table-cell">{new Date(member.joinDate).toLocaleDateString()}</td>
                <td className="py-3 px-4 hidden lg:table-cell">
                  {member.lastActive ? new Date(member.lastActive).toLocaleDateString() : "Never"}
                </td>
                <td className="py-3 px-4">
                  <Badge variant={
                    member.status === "active" ? "default" :
                    member.status === "invited" ? "outline" : "secondary"
                  }>
                    {member.status === "active" && (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    )}
                    {member.status === "inactive" && (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {member.status === "invited" && (
                      <Mail className="h-3 w-3 mr-1" />
                    )}
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Edit Permissions
                      </DropdownMenuItem>
                      {member.status === "invited" && (
                        <DropdownMenuItem onClick={() => onResendInvite(member.email)}>
                          <Mail className="mr-2 h-4 w-4" />
                          Resend Invite
                        </DropdownMenuItem>
                      )}
                      {member.status === "active" && (
                        <DropdownMenuItem 
                          onClick={() => onDeactivateUser(member.id, member.name)}
                          className="text-destructive focus:text-destructive"
                        >
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Deactivate
                        </DropdownMenuItem>
                      )}
                      {member.status === "inactive" && (
                        <DropdownMenuItem onClick={() => onReactivateUser(member.id, member.name)}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Reactivate
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default OrgUserManagement