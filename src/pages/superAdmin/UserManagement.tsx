import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Lock, 
  Mail, 
  UserPlus
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"

/**
 * Validation schema for the add user form
 */
const addUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  role: z.string().min(1, "Please select a role"),
  organization: z.string().optional(),
})

/**
 * UserManagement page for Super Admins
 */
function UserManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()
  
  // Simulation of user data fetching
  const [userData, setUserData] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data
      const mockUsers = [
        { 
          id: "1", 
          name: "John Doe", 
          email: "john@example.com", 
          role: "superAdmin", 
          status: "active", 
          organization: "System", 
          lastLogin: "2023-06-15T10:30:00Z" 
        },
        { 
          id: "2", 
          name: "Jane Smith", 
          email: "jane@acmecorp.com", 
          role: "orgAdmin", 
          status: "active", 
          organization: "Acme Corp", 
          lastLogin: "2023-06-14T14:20:00Z" 
        },
        { 
          id: "3", 
          name: "Robert Johnson", 
          email: "robert@globex.com", 
          role: "orgAdmin", 
          status: "active", 
          organization: "Globex Industries", 
          lastLogin: "2023-06-13T09:45:00Z" 
        },
        { 
          id: "4", 
          name: "Sarah Williams", 
          email: "sarah@acmecorp.com", 
          role: "teamMember", 
          status: "active", 
          organization: "Acme Corp", 
          lastLogin: "2023-06-12T16:10:00Z" 
        },
        { 
          id: "5", 
          name: "Michael Brown", 
          email: "michael@umbrella.com", 
          role: "orgAdmin", 
          status: "inactive", 
          organization: "Umbrella Corp", 
          lastLogin: "2023-06-10T11:25:00Z" 
        },
        { 
          id: "6", 
          name: "Emily Davis", 
          email: "emily@globex.com", 
          role: "teamMember", 
          status: "active", 
          organization: "Globex Industries", 
          lastLogin: "2023-06-14T08:50:00Z" 
        },
        { 
          id: "7", 
          name: "David Wilson", 
          email: "david@umbrella.com", 
          role: "teamMember", 
          status: "active", 
          organization: "Umbrella Corp", 
          lastLogin: "2023-06-11T13:40:00Z" 
        },
        { 
          id: "8", 
          name: "Lisa Martinez", 
          email: "lisa@wayne.com", 
          role: "client", 
          status: "active", 
          organization: "Wayne Enterprises", 
          lastLogin: "2023-06-09T15:30:00Z" 
        },
      ]
      
      setUserData(mockUsers)
      setIsLoading(false)
    }
    
    fetchData()
  }, [])
  
  // Form for adding a new user
  const form = useForm<z.infer<typeof addUserSchema>>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      organization: "",
    },
  })
  
  /**
   * Handle form submission for adding a new user
   */
  const onSubmit = async (values: z.infer<typeof addUserSchema>) => {
    // In a real app, this would send the data to the server
    console.log("Adding user:", values)
    
    // Show success toast
    toast({
      title: "User invited",
      description: `Invitation sent to ${values.email}`,
    })
    
    // Reset form and close dialog
    form.reset()
    setOpenDialog(false)
  }
  
  /**
   * Table columns configuration
   */
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        
        return (
          <span className="capitalize">{role}</span>
        )
      },
    },
    {
      accessorKey: "organization",
      header: "Organization",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        
        return (
          <div className="flex items-center">
            <span
              className={`mr-2 h-2 w-2 rounded-full ${
                status === "active" ? "bg-green-500" : "bg-gray-400"
              }`}
            />
            <span className="capitalize">{status}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        const lastLogin = row.getValue("lastLogin") as string
        
        return (
          <span>
            {new Date(lastLogin).toLocaleDateString()}
          </span>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => console.log("Edit user", user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit user
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Reset password", user)}>
                <Lock className="mr-2 h-4 w-4" />
                Reset password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Resend invitation", user)}>
                <Mail className="mr-2 h-4 w-4" />
                Resend invitation
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => console.log("Delete user", user)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete user
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
  // Filter users based on search term
  const filteredUsers = searchTerm
    ? userData.filter((user: any) => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : userData
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new user to the platform.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="john.doe@example.com" 
                          type="email" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        An invitation will be sent to this email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="superAdmin">Super Admin</SelectItem>
                          <SelectItem value="orgAdmin">Organization Admin</SelectItem>
                          <SelectItem value="teamMember">Team Member</SelectItem>
                          <SelectItem value="client">Client</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an organization" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                          <SelectItem value="Globex Industries">Globex Industries</SelectItem>
                          <SelectItem value="Wayne Enterprises">Wayne Enterprises</SelectItem>
                          <SelectItem value="Umbrella Corp">Umbrella Corp</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Required for Organization Admin, Team Member, and Client roles.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Send Invitation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Manage all users across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="superAdmin">Super Admin</SelectItem>
                  <SelectItem value="orgAdmin">Organization Admin</SelectItem>
                  <SelectItem value="teamMember">Team Member</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Users</TabsTrigger>
                <TabsTrigger value="superAdmin">Super Admins</TabsTrigger>
                <TabsTrigger value="orgAdmin">Org Admins</TabsTrigger>
                <TabsTrigger value="teamMember">Team Members</TabsTrigger>
                <TabsTrigger value="client">Clients</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredUsers}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="superAdmin" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredUsers.filter((user: any) => user.role === "superAdmin")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="orgAdmin" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredUsers.filter((user: any) => user.role === "orgAdmin")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="teamMember" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredUsers.filter((user: any) => user.role === "teamMember")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="client" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredUsers.filter((user: any) => user.role === "client")}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default UserManagement