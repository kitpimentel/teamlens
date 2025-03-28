import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Building, 
  Users, 
  Settings, 
  PlusCircle
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Validation schema for adding a new organization
 */
const addOrgSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  domain: z.string().min(2, "Domain must be at least 2 characters"),
  type: z.string().min(1, "Please select a type"),
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  contactEmail: z.string().email("Please enter a valid email address"),
})

/**
 * Organization Management page for Super Admins
 */
function OrganizationManagement() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [openDialog, setOpenDialog] = useState(false)
  const { toast } = useToast()
  
  // Simulation of organization data fetching
  const [orgData, setOrgData] = useState([])
  
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock data
      const mockOrgs = [
        { 
          id: "1", 
          name: "Acme Corp", 
          type: "Enterprise",
          domain: "acmecorp.com",
          logo: "",
          usersCount: 45, 
          projects: 12, 
          status: "active", 
          createdAt: "2022-08-15",
          adminName: "Jane Smith",
          adminEmail: "jane@acmecorp.com"
        },
        { 
          id: "2", 
          name: "Globex Industries", 
          type: "Mid-Market",
          domain: "globex.com",
          logo: "",
          usersCount: 32, 
          projects: 8, 
          status: "active", 
          createdAt: "2022-09-22",
          adminName: "Robert Johnson",
          adminEmail: "robert@globex.com"
        },
        { 
          id: "3", 
          name: "Wayne Enterprises", 
          type: "Enterprise",
          domain: "wayne.com",
          logo: "",
          usersCount: 78, 
          projects: 24, 
          status: "active", 
          createdAt: "2022-05-10",
          adminName: "Bruce Wayne",
          adminEmail: "bruce@wayne.com"
        },
        { 
          id: "4", 
          name: "Stark Industries", 
          type: "Enterprise",
          domain: "stark.com",
          logo: "",
          usersCount: 53, 
          projects: 16, 
          status: "active", 
          createdAt: "2022-07-28",
          adminName: "Tony Stark",
          adminEmail: "tony@stark.com"
        },
        { 
          id: "5", 
          name: "Umbrella Corp", 
          type: "Mid-Market",
          domain: "umbrella.com",
          logo: "",
          usersCount: 28, 
          projects: 6, 
          status: "inactive", 
          createdAt: "2023-01-15",
          adminName: "Michael Brown",
          adminEmail: "michael@umbrella.com"
        },
        { 
          id: "6", 
          name: "Cyberdyne Systems", 
          type: "Startup",
          domain: "cyberdyne.com",
          logo: "",
          usersCount: 14, 
          projects: 3, 
          status: "active", 
          createdAt: "2023-03-08",
          adminName: "Miles Dyson",
          adminEmail: "miles@cyberdyne.com"
        },
        { 
          id: "7", 
          name: "Oscorp Industries", 
          type: "Mid-Market",
          domain: "oscorp.com",
          logo: "",
          usersCount: 22, 
          projects: 9, 
          status: "active", 
          createdAt: "2022-11-19",
          adminName: "Norman Osborn",
          adminEmail: "norman@oscorp.com"
        },
        { 
          id: "8", 
          name: "Initech", 
          type: "Small Business",
          domain: "initech.com",
          logo: "",
          usersCount: 12, 
          projects: 4, 
          status: "active", 
          createdAt: "2023-02-25",
          adminName: "Bill Lumbergh",
          adminEmail: "bill@initech.com"
        },
      ]
      
      setOrgData(mockOrgs)
      setIsLoading(false)
    }
    
    fetchData()
  }, [])
  
  // Form for adding a new organization
  const form = useForm<z.infer<typeof addOrgSchema>>({
    resolver: zodResolver(addOrgSchema),
    defaultValues: {
      name: "",
      domain: "",
      type: "",
      contactName: "",
      contactEmail: "",
    },
  })
  
  /**
   * Handle form submission for adding a new organization
   */
  const onSubmit = async (values: z.infer<typeof addOrgSchema>) => {
    // In a real app, this would send the data to the server
    console.log("Adding organization:", values)
    
    // Show success toast
    toast({
      title: "Organization created",
      description: `${values.name} has been added successfully`,
    })
    
    // Reset form and close dialog
    form.reset()
    setOpenDialog(false)
  }
  
  /**
   * Get organization initials for avatar fallback
   */
  const getOrgInitials = (name: string) => {
    const words = name.split(' ')
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
  }
  
  /**
   * Table columns configuration
   */
  const columns = [
    {
      accessorKey: "name",
      header: "Organization",
      cell: ({ row }) => {
        const org = row.original as any
        
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={org.logo} alt={org.name} />
              <AvatarFallback>{getOrgInitials(org.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{org.name}</p>
              <p className="text-sm text-muted-foreground">{org.domain}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "usersCount",
      header: "Users",
    },
    {
      accessorKey: "projects",
      header: "Projects",
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
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue("createdAt") as string
        
        return (
          <span>
            {new Date(date).toLocaleDateString()}
          </span>
        )
      },
    },
    {
      accessorKey: "adminName",
      header: "Admin",
      cell: ({ row }) => {
        const org = row.original as any
        
        return (
          <div>
            <p>{org.adminName}</p>
            <p className="text-sm text-muted-foreground">{org.adminEmail}</p>
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const org = row.original
        
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
              <DropdownMenuItem onClick={() => console.log("View organization", org)}>
                <Building className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Manage users", org)}>
                <Users className="mr-2 h-4 w-4" />
                Manage users
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Edit settings", org)}>
                <Settings className="mr-2 h-4 w-4" />
                Edit settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => console.log("Delete organization", org)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete organization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
  
  // Filter organizations based on search term
  const filteredOrgs = searchTerm
    ? orgData.filter((org: any) => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.adminEmail.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : orgData
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Organization Management</h2>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Organization</DialogTitle>
              <DialogDescription>
                Create a new organization in the platform.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Domain</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="acmecorp.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Primary domain for this organization
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Organization Type</FormLabel>
                        <FormControl>
                          <select 
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...field}
                          >
                            <option value="">Select a type</option>
                            <option value="Enterprise">Enterprise</option>
                            <option value="Mid-Market">Mid-Market</option>
                            <option value="Small Business">Small Business</option>
                            <option value="Startup">Startup</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Primary Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="john@acmecorp.com" 
                              type="email" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Organization</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
          <CardDescription>
            Manage all organizations across the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="h-10 rounded-md border border-input px-3 py-2 bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-[180px]"
                defaultValue="all"
              >
                <option value="all">All Types</option>
                <option value="Enterprise">Enterprise</option>
                <option value="Mid-Market">Mid-Market</option>
                <option value="Small Business">Small Business</option>
                <option value="Startup">Startup</option>
              </select>
              <select
                className="h-10 rounded-md border border-input px-3 py-2 bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full sm:w-[180px]"
                defaultValue="all"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All Organizations</TabsTrigger>
                <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
                <TabsTrigger value="mid-market">Mid-Market</TabsTrigger>
                <TabsTrigger value="small">Small Business</TabsTrigger>
                <TabsTrigger value="startup">Startup</TabsTrigger>
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
                    data={filteredOrgs}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="enterprise" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredOrgs.filter((org: any) => org.type === "Enterprise")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="mid-market" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredOrgs.filter((org: any) => org.type === "Mid-Market")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="small" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredOrgs.filter((org: any) => org.type === "Small Business")}
                  />
                )}
              </TabsContent>
              
              <TabsContent value="startup" className="p-0 mt-4">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={filteredOrgs.filter((org: any) => org.type === "Startup")}
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

export default OrganizationManagement