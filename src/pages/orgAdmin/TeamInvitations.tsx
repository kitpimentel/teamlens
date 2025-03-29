import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  UserPlus, 
  Mail, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Calendar,
  Link as LinkIcon
} from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for invitation data
 */
interface Invitation {
  id: string
  email: string
  role: string
  department: string
  status: "pending" | "accepted" | "expired"
  sentAt: string
  expiresAt: string
  acceptedAt?: string
}

/**
 * Team Invitations component
 * Allows organization admins to invite new team members and manage pending invitations
 */
const TeamInvitations = () => {
  // Using an underscore prefix to indicate the variable is intentionally not used yet
  const { user: _user } = useAuth()
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [bulkInviteDialogOpen, setBulkInviteDialogOpen] = useState(false)
  
  // Form state for single invite
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("")
  const [inviteDepartment, setInviteDepartment] = useState("")
  
  // Form state for bulk invite
  const [bulkEmails, setBulkEmails] = useState("")
  const [bulkRole, setBulkRole] = useState("")
  const [bulkDepartment, setBulkDepartment] = useState("")

  // Mock department data
  const departments = [
    "Development",
    "Design",
    "Marketing",
    "Quality Assurance",
    "Management",
    "Operations",
    "Customer Support"
  ]

  // Mock role data
  const roles = [
    "Developer",
    "Designer",
    "Project Manager",
    "QA Engineer",
    "DevOps Engineer",
    "Marketing Specialist",
    "Support Specialist"
  ]

  // Mock invitation data
  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: "inv-1",
      email: "alex.rodriguez@example.com",
      role: "DevOps Engineer",
      department: "Operations",
      status: "pending",
      sentAt: "2025-03-25T10:30:00Z",
      expiresAt: "2025-04-01T10:30:00Z"
    },
    {
      id: "inv-2",
      email: "priya.sharma@example.com",
      role: "UX Designer",
      department: "Design",
      status: "pending",
      sentAt: "2025-03-26T14:15:00Z",
      expiresAt: "2025-04-02T14:15:00Z"
    },
    {
      id: "inv-3",
      email: "marcus.johnson@example.com",
      role: "Frontend Developer",
      department: "Development",
      status: "accepted",
      sentAt: "2025-03-20T09:45:00Z",
      expiresAt: "2025-03-27T09:45:00Z",
      acceptedAt: "2025-03-22T11:30:00Z"
    },
    {
      id: "inv-4",
      email: "sofia.garcia@example.com",
      role: "QA Engineer",
      department: "Quality Assurance",
      status: "expired",
      sentAt: "2025-03-10T16:20:00Z",
      expiresAt: "2025-03-17T16:20:00Z"
    },
    {
      id: "inv-5",
      email: "james.wilson@example.com",
      role: "Project Manager",
      department: "Management",
      status: "accepted",
      sentAt: "2025-03-15T11:00:00Z",
      expiresAt: "2025-03-22T11:00:00Z",
      acceptedAt: "2025-03-16T14:20:00Z"
    }
  ])

  /**
   * Handle sending a single invite
   */
  const handleSendInvite = () => {
    // Validate form
    if (!inviteEmail || !inviteRole || !inviteDepartment) {
      toast.error("Please fill in all fields")
      return
    }

    // Create new invitation (in a real app, this would call an API)
    const now = new Date()
    const expiry = new Date(now)
    expiry.setDate(expiry.getDate() + 7) // 7-day validity period as per requirements

    const newInvitation: Invitation = {
      id: `inv-${invitations.length + 1}`,
      email: inviteEmail,
      role: inviteRole,
      department: inviteDepartment,
      status: "pending",
      sentAt: now.toISOString(),
      expiresAt: expiry.toISOString()
    }

    // Add to invitations list
    setInvitations([newInvitation, ...invitations])
    
    // Reset form and close dialog
    setInviteEmail("")
    setInviteRole("")
    setInviteDepartment("")
    setInviteDialogOpen(false)
    
    toast.success(`Invitation sent to ${inviteEmail}`)
  }

  /**
   * Handle sending bulk invites
   */
  const handleBulkInvite = () => {
    // Validate form
    if (!bulkEmails || !bulkRole || !bulkDepartment) {
      toast.error("Please fill in all fields")
      return
    }

    // Split emails by comma, newline, or semicolon and trim whitespace
    const emails = bulkEmails
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0)

    if (emails.length === 0) {
      toast.error("Please provide at least one valid email")
      return
    }

    // Create new invitations
    const now = new Date()
    const expiry = new Date(now)
    expiry.setDate(expiry.getDate() + 7) // 7-day validity period

    const newInvitations: Invitation[] = emails.map((email, index) => ({
      id: `inv-bulk-${Date.now()}-${index}`,
      email,
      role: bulkRole,
      department: bulkDepartment,
      status: "pending",
      sentAt: now.toISOString(),
      expiresAt: expiry.toISOString()
    }))

    // Add to invitations list
    setInvitations([...newInvitations, ...invitations])
    
    // Reset form and close dialog
    setBulkEmails("")
    setBulkRole("")
    setBulkDepartment("")
    setBulkInviteDialogOpen(false)
    
    toast.success(`${emails.length} invitations sent`)
  }

  /**
   * Handle resending an invitation
   */
  const handleResendInvite = (id: string, email: string) => {
    // Update the invitation with new dates
    const now = new Date()
    const expiry = new Date(now)
    expiry.setDate(expiry.getDate() + 7) // 7-day validity period

    const updatedInvitations = invitations.map(invitation => 
      invitation.id === id
        ? {
            ...invitation,
            status: "pending" as const,
            sentAt: now.toISOString(),
            expiresAt: expiry.toISOString()
          }
        : invitation
    )

    setInvitations(updatedInvitations)
    toast.success(`Invitation resent to ${email}`)
  }

  /**
   * Handle cancelling an invitation
   */
  const handleCancelInvite = (id: string, email: string) => {
    // Remove the invitation from the list
    const updatedInvitations = invitations.filter(invitation => invitation.id !== id)
    setInvitations(updatedInvitations)
    toast.success(`Invitation to ${email} cancelled`)
  }

  /**
   * Handle copying invitation link
   * In a real app, this would generate an actual invite link
   */
  const handleCopyInviteLink = (email: string) => {
    // Simulate copying a link
    const link = `https://team-lens.example.com/invite/${btoa(email)}`
    navigator.clipboard.writeText(link)
    toast.success(`Invitation link copied to clipboard`)
  }

  // Filter invitations by status
  const pendingInvitations = invitations.filter(invitation => invitation.status === "pending")
  const acceptedInvitations = invitations.filter(invitation => invitation.status === "accepted")
  const expiredInvitations = invitations.filter(invitation => invitation.status === "expired")

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Invitations</h1>
          <p className="text-muted-foreground">
            Invite new team members and manage pending invitations
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Dialog open={bulkInviteDialogOpen} onOpenChange={setBulkInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <UserPlus className="mr-2 h-4 w-4" />
                Bulk Invite
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Invite Multiple Team Members</DialogTitle>
                <DialogDescription>
                  Invite multiple users to join your organization. Invitations expire after 7 days.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bulk-emails">Email Addresses</Label>
                  <textarea
                    id="bulk-emails"
                    className="min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Enter email addresses (one per line, or separated by commas)"
                    value={bulkEmails}
                    onChange={(e) => setBulkEmails(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter multiple email addresses separated by commas, semicolons, or new lines
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="bulk-role">Role</Label>
                    <Select value={bulkRole} onValueChange={setBulkRole}>
                      <SelectTrigger id="bulk-role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bulk-department">Department</Label>
                    <Select value={bulkDepartment} onValueChange={setBulkDepartment}>
                      <SelectTrigger id="bulk-department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleBulkInvite}>Send Invitations</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to join your organization. Invitations expire after 7 days.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="team@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(role => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={inviteDepartment} onValueChange={setInviteDepartment}>
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSendInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-flex mb-6">
          <TabsTrigger value="pending">
            Pending ({pendingInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            Accepted ({acceptedInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="expired">
            Expired ({expiredInvitations.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations</CardTitle>
              <CardDescription>
                These invitations have been sent but not yet accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingInvitations.length === 0 ? (
                <div className="text-center py-10">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending invitations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingInvitations.map((invitation) => {
                    // Calculate days left until expiration
                    const expiryDate = new Date(invitation.expiresAt)
                    const now = new Date()
                    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                    
                    return (
                      <div key={invitation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border">
                        <div className="mb-3 sm:mb-0">
                          <div className="font-medium">{invitation.email}</div>
                          <div className="text-sm text-muted-foreground">
                            {invitation.role} • {invitation.department}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground mr-1" />
                            <span className="text-xs text-muted-foreground">
                              Expires in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyInviteLink(invitation.email)}
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            Copy Link
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvite(invitation.id, invitation.email)}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Resend
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleCancelInvite(invitation.id, invitation.email)}
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="accepted">
          <Card>
            <CardHeader>
              <CardTitle>Accepted Invitations</CardTitle>
              <CardDescription>
                These invitations have been accepted by the recipients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {acceptedInvitations.length === 0 ? (
                <div className="text-center py-10">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No accepted invitations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border">
                      <div>
                        <div className="font-medium">{invitation.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {invitation.role} • {invitation.department}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            Accepted on {new Date(invitation.acceptedAt || "").toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <Badge className="mt-2 sm:mt-0 w-fit" variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Accepted
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expired">
          <Card>
            <CardHeader>
              <CardTitle>Expired Invitations</CardTitle>
              <CardDescription>
                These invitations have expired without being accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expiredInvitations.length === 0 ? (
                <div className="text-center py-10">
                  <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No expired invitations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {expiredInvitations.map((invitation) => (
                    <div key={invitation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border">
                      <div>
                        <div className="font-medium">{invitation.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {invitation.role} • {invitation.department}
                        </div>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                          <span className="text-xs text-muted-foreground">
                            Expired on {new Date(invitation.expiresAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvite(invitation.id, invitation.email)}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Resend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleCancelInvite(invitation.id, invitation.email)}
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TeamInvitations