import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox" 
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
  DialogClose,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

import { 
  Search, 
  Plus, 
  Calendar, 
  Video, 
  XCircle, 
  Link, 
  Settings, 
  Clock, 
  FileText, 
  FileVideo, 
  CheckCircle, 
  PlusCircle,
  ArrowUpRight,
  ArrowRight,
  Copy,
  ListChecks,
  DownloadCloud,
  PlaySquare
} from "lucide-react"
import { toast } from "sonner"

/**
 * Interface for Meeting Type
 */
interface Meeting {
  id: string
  title: string
  description?: string
  platform: "zoom" | "teams" | "google_meet" | "other"
  projectId?: string
  projectName?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  startTime: string
  endTime: string
  meetingLink: string
  organizer: string
  organizerId: string
  organizerAvatar?: string
  participants: {
    id: string
    name: string
    email: string
    avatar?: string
    attendance?: "present" | "absent" | "late"
  }[]
  recording?: {
    url: string
    duration: string
    uploadDate: string
    format: string
    size: string
    transcriptionAvailable: boolean
  }
  transcription?: {
    id: string
    status: "processing" | "completed" | "failed"
    text?: string
    insights?: {
      actionItems: string[]
      keyTopics: string[]
      decisions: string[]
    }
  }
  createdAt: string
  updatedAt?: string
  categories?: string[]
  isRecurring?: boolean
  recurrencePattern?: string
  tags?: string[]
}

/**
 * Interface for Meeting Integration
 */
interface Integration {
  id: string
  platform: "zoom" | "teams" | "google_meet"
  name: string
  status: "connected" | "disconnected" | "error"
  connectedAt: string
  lastSyncAt?: string
  accountEmail: string
  settings: {
    autoRecording: boolean
    autoTranscription: boolean
    autoTaskExtraction: boolean
    autoSummary: boolean
    defaultParticipants?: string[]
  }
}

/**
 * Meeting Integration component
 * Manages integrations with meeting platforms and records of meetings
 */
const MeetingIntegration = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<string>("upcoming")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterPlatform, setFilterPlatform] = useState<string | null>(null)
  const [filterProject, setFilterProject] = useState<string | null>(null)
  const [meetingDetailsDialogOpen, setMeetingDetailsDialogOpen] = useState<boolean>(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [integrationSettingsDialogOpen, setIntegrationSettingsDialogOpen] = useState<boolean>(false)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)

  // Mock projects data
  const projects = [
    { id: "proj-1", name: "Team Lens Dashboard", color: "bg-blue-500" },
    { id: "proj-2", name: "E-commerce Mobile App", color: "bg-green-500" },
    { id: "proj-3", name: "Marketing Website Redesign", color: "bg-yellow-500" },
    { id: "proj-4", name: "API Integration", color: "bg-purple-500" },
    { id: "proj-5", name: "CRM Implementation", color: "bg-red-500" }
  ]

  // Mock team members data
  const teamMembers = [
    {
      id: "tm-1",
      name: "Sarah Chen",
      email: "sarah.chen@example.com",
      role: "Lead Developer",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff"
    },
    {
      id: "tm-2",
      name: "Jason Patel",
      email: "jason.patel@example.com",
      role: "UX Designer",
      avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff"
    },
    {
      id: "tm-3",
      name: "Michelle Wang",
      email: "michelle.wang@example.com",
      role: "Project Manager",
      avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff"
    },
    {
      id: "tm-4",
      name: "David Kim",
      email: "david.kim@example.com",
      role: "QA Engineer",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff"
    },
    {
      id: "tm-5",
      name: "Emily Johnson",
      email: "emily.johnson@example.com",
      role: "Frontend Developer",
      avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff"
    }
  ]

  // Mock integrations data
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "int-1",
      platform: "zoom",
      name: "Zoom",
      status: "connected",
      connectedAt: "2025-02-15T10:30:00Z",
      lastSyncAt: "2025-03-29T08:45:00Z",
      accountEmail: "michelle.wang@example.com",
      settings: {
        autoRecording: true,
        autoTranscription: true,
        autoTaskExtraction: true,
        autoSummary: true
      }
    },
    {
      id: "int-2",
      platform: "teams",
      name: "Microsoft Teams",
      status: "connected",
      connectedAt: "2025-01-20T14:15:00Z",
      lastSyncAt: "2025-03-28T16:30:00Z",
      accountEmail: "michelle.wang@example.com",
      settings: {
        autoRecording: true,
        autoTranscription: false,
        autoTaskExtraction: true,
        autoSummary: false
      }
    },
    {
      id: "int-3",
      platform: "google_meet",
      name: "Google Meet",
      status: "disconnected",
      connectedAt: "2025-01-10T09:00:00Z",
      accountEmail: "michelle.wang@example.com",
      settings: {
        autoRecording: false,
        autoTranscription: false,
        autoTaskExtraction: false,
        autoSummary: false
      }
    }
  ])

  // Mock meetings data
  const [meetings, _setMeetings] = useState<Meeting[]>([
    {
      id: "meet-1",
      title: "Weekly Sprint Planning",
      description: "Plan tasks and objectives for the next sprint",
      platform: "zoom",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      status: "scheduled",
      startTime: "2025-04-01T10:00:00Z",
      endTime: "2025-04-01T11:00:00Z",
      meetingLink: "https://zoom.us/j/123456789",
      organizer: "Michelle Wang",
      organizerId: "tm-3",
      organizerAvatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
      participants: [
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff"
        },
        {
          id: "tm-2",
          name: "Jason Patel",
          email: "jason.patel@example.com",
          avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff"
        },
        {
          id: "tm-5",
          name: "Emily Johnson",
          email: "emily.johnson@example.com",
          avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff"
        }
      ],
      createdAt: "2025-03-25T15:30:00Z",
      isRecurring: true,
      recurrencePattern: "Weekly on Tuesday",
      categories: ["Planning", "Development"],
      tags: ["sprint", "planning", "team_lens"]
    },
    {
      id: "meet-2",
      title: "UI/UX Review",
      description: "Review latest design iterations and provide feedback",
      platform: "teams",
      projectId: "proj-3",
      projectName: "Marketing Website Redesign",
      status: "scheduled",
      startTime: "2025-04-02T14:00:00Z",
      endTime: "2025-04-02T15:00:00Z",
      meetingLink: "https://teams.microsoft.com/l/meetup-join/123456789",
      organizer: "Jason Patel",
      organizerId: "tm-2",
      organizerAvatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
      participants: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff"
        },
        {
          id: "tm-5",
          name: "Emily Johnson",
          email: "emily.johnson@example.com",
          avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff"
        }
      ],
      createdAt: "2025-03-26T09:15:00Z",
      categories: ["Design", "Review"],
      tags: ["ui", "ux", "design_review"]
    },
    {
      id: "meet-3",
      title: "API Integration Planning",
      description: "Discuss approach for integrating payment processing APIs",
      platform: "zoom",
      projectId: "proj-4",
      projectName: "API Integration",
      status: "completed",
      startTime: "2025-03-28T11:00:00Z",
      endTime: "2025-03-28T12:00:00Z",
      meetingLink: "https://zoom.us/j/987654321",
      organizer: "Sarah Chen",
      organizerId: "tm-1",
      organizerAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      participants: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
          attendance: "present"
        },
        {
          id: "tm-4",
          name: "David Kim",
          email: "david.kim@example.com",
          avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff",
          attendance: "late"
        }
      ],
      recording: {
        url: "https://zoom.us/rec/123456789",
        duration: "58:32",
        uploadDate: "2025-03-28T12:05:00Z",
        format: "MP4",
        size: "256 MB",
        transcriptionAvailable: true
      },
      transcription: {
        id: "trans-1",
        status: "completed",
        text: "This is a sample transcription of the meeting discussion...",
        insights: {
          actionItems: [
            "Sarah will create API documentation by April 5",
            "David to set up test environment by April 2",
            "Michelle to schedule follow-up meeting next week"
          ],
          keyTopics: [
            "Authentication strategy",
            "Error handling",
            "Rate limiting",
            "Webhook configuration"
          ],
          decisions: [
            "Use OAuth 2.0 for authentication",
            "Implement automatic retry logic for failed requests",
            "Set up webhook notifications for payment events"
          ]
        }
      },
      createdAt: "2025-03-25T16:45:00Z",
      updatedAt: "2025-03-28T12:10:00Z",
      categories: ["Development", "Planning"],
      tags: ["api", "payment", "integration"]
    },
    {
      id: "meet-4",
      title: "Client Demo - E-commerce App",
      description: "Demo of the latest features to the client stakeholders",
      platform: "zoom",
      projectId: "proj-2",
      projectName: "E-commerce Mobile App",
      status: "completed",
      startTime: "2025-03-27T15:00:00Z",
      endTime: "2025-03-27T16:00:00Z",
      meetingLink: "https://zoom.us/j/123123123",
      organizer: "Michelle Wang",
      organizerId: "tm-3",
      organizerAvatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
      participants: [
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
          attendance: "present"
        },
        {
          id: "tm-2",
          name: "Jason Patel",
          email: "jason.patel@example.com",
          avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff",
          attendance: "present"
        },
        {
          id: "tm-5",
          name: "Emily Johnson",
          email: "emily.johnson@example.com",
          avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff",
          attendance: "present"
        },
        {
          id: "client-1",
          name: "Alex Rodriguez",
          email: "alex.rodriguez@client.com",
          avatar: "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=ec4899&color=fff",
          attendance: "present"
        }
      ],
      recording: {
        url: "https://zoom.us/rec/987987987",
        duration: "1:03:45",
        uploadDate: "2025-03-27T16:05:00Z",
        format: "MP4",
        size: "312 MB",
        transcriptionAvailable: true
      },
      transcription: {
        id: "trans-2",
        status: "completed",
        text: "This is a sample transcription of the client demo meeting...",
        insights: {
          actionItems: [
            "Emily to fix UI bug on checkout page by April 3",
            "Jason to update product detail page design based on feedback",
            "Sarah to implement wishlist feature by next sprint"
          ],
          keyTopics: [
            "Shopping cart workflow",
            "Payment integration",
            "User account features",
            "Product search functionality"
          ],
          decisions: [
            "Add wishlist feature to next sprint",
            "Prioritize mobile payment integration",
            "Revise checkout UI based on client feedback"
          ]
        }
      },
      createdAt: "2025-03-24T11:30:00Z",
      updatedAt: "2025-03-27T16:15:00Z",
      categories: ["Demo", "Client"],
      tags: ["client", "demo", "e-commerce"]
    },
    {
      id: "meet-5",
      title: "Backend Architecture Discussion",
      description: "Review and finalize backend architecture for the CRM Implementation",
      platform: "teams",
      projectId: "proj-5",
      projectName: "CRM Implementation",
      status: "in_progress",
      startTime: "2025-03-29T10:00:00Z",
      endTime: "2025-03-29T11:30:00Z",
      meetingLink: "https://teams.microsoft.com/l/meetup-join/234567890",
      organizer: "Sarah Chen",
      organizerId: "tm-1",
      organizerAvatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff",
      participants: [
        {
          id: "tm-3",
          name: "Michelle Wang",
          email: "michelle.wang@example.com",
          avatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff"
        },
        {
          id: "tm-4",
          name: "David Kim",
          email: "david.kim@example.com",
          avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff"
        }
      ],
      createdAt: "2025-03-25T13:45:00Z",
      categories: ["Development", "Architecture"],
      tags: ["backend", "architecture", "crm"]
    },
    {
      id: "meet-6",
      title: "Sprint Retrospective",
      description: "Review the previous sprint, discuss what went well and what could be improved",
      platform: "zoom",
      projectId: "proj-1",
      projectName: "Team Lens Dashboard",
      status: "scheduled",
      startTime: "2025-04-02T15:00:00Z",
      endTime: "2025-04-02T16:00:00Z",
      meetingLink: "https://zoom.us/j/456789123",
      organizer: "Michelle Wang",
      organizerId: "tm-3",
      organizerAvatar: "https://ui-avatars.com/api/?name=Michelle+Wang&background=f43f5e&color=fff",
      participants: [
        {
          id: "tm-1",
          name: "Sarah Chen",
          email: "sarah.chen@example.com",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Chen&background=10b981&color=fff"
        },
        {
          id: "tm-2",
          name: "Jason Patel",
          email: "jason.patel@example.com",
          avatar: "https://ui-avatars.com/api/?name=Jason+Patel&background=6366f1&color=fff"
        },
        {
          id: "tm-4",
          name: "David Kim",
          email: "david.kim@example.com",
          avatar: "https://ui-avatars.com/api/?name=David+Kim&background=fb923c&color=fff"
        },
        {
          id: "tm-5",
          name: "Emily Johnson",
          email: "emily.johnson@example.com",
          avatar: "https://ui-avatars.com/api/?name=Emily+Johnson&background=8b5cf6&color=fff"
        }
      ],
      createdAt: "2025-03-26T14:20:00Z",
      isRecurring: true,
      recurrencePattern: "Every 2 weeks on Wednesday",
      categories: ["Retrospective", "Team"],
      tags: ["retrospective", "agile", "team_lens"]
    }
  ])

  // Filter meetings based on search term and filters
  const filteredMeetings = meetings.filter(meeting => {
    // Filter by search term
    const matchesSearch = searchTerm === "" || 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (meeting.description && meeting.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      meeting.projectName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by platform
    const matchesPlatform = filterPlatform === null || meeting.platform === filterPlatform
    
    // Filter by project
    const matchesProject = filterProject === null || meeting.projectId === filterProject
    
    return matchesSearch && matchesPlatform && matchesProject
  })

  // Group meetings by status
  const upcomingMeetings = filteredMeetings.filter(m => m.status === "scheduled")
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
  
  const completedMeetings = filteredMeetings.filter(m => m.status === "completed")
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
  
  const inProgressMeetings = filteredMeetings.filter(m => m.status === "in_progress")

  /**
   * Handle updating integration settings
   */
  const handleUpdateIntegrationSettings = () => {
    if (!selectedIntegration) return
    
    // Update integration settings
    const updatedIntegrations = integrations.map(integration => {
      if (integration.id === selectedIntegration.id) {
        return {
          ...selectedIntegration,
          lastSyncAt: new Date().toISOString()
        }
      }
      return integration
    })
    
    setIntegrations(updatedIntegrations)
    setIntegrationSettingsDialogOpen(false)
    
    toast.success(`${selectedIntegration.name} settings updated`)
  }

  /**
   * Handle connecting/disconnecting an integration
   */
  const handleToggleIntegrationStatus = (integrationId: string) => {
    // Update integration status
    const updatedIntegrations = integrations.map(integration => {
      if (integration.id === integrationId) {
        // Explicitly define the status as literal types
        const newStatus = integration.status === "connected" 
          ? "disconnected" as const 
          : "connected" as const;
        
        // Create a properly typed integration object
        const updatedIntegration: Integration = {
          ...integration,
          status: newStatus,
          lastSyncAt: newStatus === "connected" ? new Date().toISOString() : integration.lastSyncAt
        };
        
        return updatedIntegration;
      }
      return integration;
    });
    
    setIntegrations(updatedIntegrations);
    
    const integration = integrations.find(i => i.id === integrationId);
    if (integration) {
      if (integration.status === "connected") {
        toast.success(`${integration.name} disconnected`);
      } else {
        toast.success(`${integration.name} connected`);
      }
    }
  }

  /**
   * Format date for display
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  /**
   * Format time for display
   */
  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    })
  }

  /**
   * Format datetime for display
   */
  const formatDateTime = (dateString: string): string => {
    return `${formatDate(dateString)} at ${formatTime(dateString)}`
  }

  /**
   * Get platform icon
   */
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "zoom":
        return <Video className="h-4 w-4 text-blue-500" />
      case "teams":
        return <Video className="h-4 w-4 text-purple-500" />
      case "google_meet":
        return <Video className="h-4 w-4 text-green-500" />
      default:
        return <Video className="h-4 w-4" />
    }
  }

  /**
   * Get platform badge
   */
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case "zoom":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-none">Zoom</Badge>
      case "teams":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-none">Microsoft Teams</Badge>
      case "google_meet":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-none">Google Meet</Badge>
      default:
        return <Badge>Other</Badge>
    }
  }

  /**
   * Get status badge
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-none">Scheduled</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-none">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-none">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-none">Cancelled</Badge>
      case "connected":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-none">Connected</Badge>
      case "disconnected":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border-none">Disconnected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-none">Error</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  /**
   * Get project color dot
   */
  const getProjectDot = (projectId?: string) => {
    if (!projectId) return null
    const project = projects.find(p => p.id === projectId)
    if (!project) return null
    return <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
  }

  /**
   * Render upcoming meeting card
   */
  const renderUpcomingMeetingCard = (meeting: Meeting) => {
    const isStartingSoon = new Date(meeting.startTime).getTime() - new Date().getTime() < 1000 * 60 * 30 // 30 minutes
    
    return (
      <div key={meeting.id} className="border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
        setSelectedMeeting(meeting)
        setMeetingDetailsDialogOpen(true)
      }}>
        <div className="flex items-center justify-between mb-3">
          {getPlatformBadge(meeting.platform)}
          
          {isStartingSoon && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-none">
              Starting Soon
            </Badge>
          )}
        </div>
        
        <h3 className="font-medium text-lg mb-1">{meeting.title}</h3>
        
        {meeting.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{meeting.description}</p>
        )}
        
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(meeting.startTime)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
          </div>
          
          {meeting.projectId && meeting.projectName && (
            <div className="flex items-center gap-2 text-sm">
              {getProjectDot(meeting.projectId)}
              <span>{meeting.projectName}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {meeting.participants.slice(0, 3).map(participant => (
              <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={participant.avatar} alt={participant.name} />
                <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            ))}
            {meeting.participants.length > 3 && (
              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
                +{meeting.participants.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={(e) => {
              e.stopPropagation()
              window.open(meeting.meetingLink, "_blank")
            }}>
              <Link className="h-3 w-3 mr-1" />
              Join
            </Button>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Render completed meeting card
   */
  const renderCompletedMeetingCard = (meeting: Meeting) => {
    return (
      <div key={meeting.id} className="border rounded-lg p-4 bg-card hover:border-primary/50 transition-colors cursor-pointer" onClick={() => {
        setSelectedMeeting(meeting)
        setMeetingDetailsDialogOpen(true)
      }}>
        <div className="flex items-center justify-between mb-3">
          {getPlatformBadge(meeting.platform)}
          {getStatusBadge(meeting.status)}
        </div>
        
        <h3 className="font-medium text-lg mb-1">{meeting.title}</h3>
        
        {meeting.description && (
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{meeting.description}</p>
        )}
        
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(meeting.startTime)}</span>
          </div>
          
          {meeting.projectId && meeting.projectName && (
            <div className="flex items-center gap-2 text-sm">
              {getProjectDot(meeting.projectId)}
              <span>{meeting.projectName}</span>
            </div>
          )}
        </div>
        
        {meeting.recording && (
          <div className="border rounded-md p-2 mb-3 bg-muted/20">
            <div className="flex items-center gap-2 text-sm">
              <FileVideo className="h-4 w-4 text-muted-foreground" />
              <span>Recording available ({meeting.recording.duration})</span>
            </div>
            
            {meeting.transcription && meeting.transcription.status === "completed" && (
              <div className="flex items-center gap-2 text-sm mt-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Transcription available</span>
              </div>
            )}
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          {meeting.transcription?.insights?.actionItems && meeting.transcription.insights.actionItems.length > 0 && (
            <div className="flex items-start gap-1">
              <ListChecks className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="text-sm">
                <span className="font-medium">{meeting.transcription.insights.actionItems.length} action items</span> extracted
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {meeting.participants.filter(p => p.attendance === "present").slice(0, 3).map(participant => (
                <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={participant.avatar} alt={participant.name} />
                  <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              ))}
              {meeting.participants.filter(p => p.attendance === "present").length > 3 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
                  +{meeting.participants.filter(p => p.attendance === "present").length - 3}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={(e) => {
                e.stopPropagation()
                setSelectedMeeting(meeting)
                setMeetingDetailsDialogOpen(true)
              }}>
                <FileVideo className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meeting Integration</h1>
          <p className="text-muted-foreground">
            Manage your meeting integrations, recordings, and insights
          </p>
        </div>

        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Schedule Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Schedule a Meeting</DialogTitle>
                <DialogDescription>
                  Create a new meeting and invite participants
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="meeting-title">Meeting Title*</Label>
                  <Input id="meeting-title" placeholder="Enter meeting title" />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="meeting-description">Description</Label>
                  <Textarea id="meeting-description" placeholder="Enter meeting description" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="meeting-platform">Platform*</Label>
                    <Select defaultValue="zoom">
                      <SelectTrigger id="meeting-platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="google_meet">Google Meet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="meeting-project">Project</Label>
                    <Select>
                      <SelectTrigger id="meeting-project">
                        <SelectValue placeholder="Select project (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                              <span>{project.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="meeting-date">Date*</Label>
                    <Input id="meeting-date" type="date" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                      <Label htmlFor="meeting-start">Start Time*</Label>
                      <Input id="meeting-start" type="time" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="meeting-end">End Time*</Label>
                      <Input id="meeting-end" type="time" />
                    </div>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="meeting-participants">Participants</Label>
                  <div className="border rounded-md p-3 max-h-[150px] overflow-y-auto">
                    {teamMembers.map(member => (
                      <div key={member.id} className="flex items-center mb-2">
                        <Checkbox id={`participant-${member.id}`} className="mr-2" />
                        <Label htmlFor={`participant-${member.id}`} className="flex items-center gap-2 text-sm">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-xs text-muted-foreground">{member.email}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Checkbox id="recurring-meeting" />
                  <Label htmlFor="recurring-meeting">Recurring meeting</Label>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => toast.success("Meeting scheduled successfully")}>Schedule Meeting</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Integrations Section */}
      <Card>
        <CardHeader>
          <CardTitle>Meeting Integrations</CardTitle>
          <CardDescription>
            Connect with your video conferencing platforms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {integrations.map(integration => (
              <div key={integration.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(integration.platform)}
                    <h3 className="font-medium">{integration.name}</h3>
                  </div>
                  {getStatusBadge(integration.status)}
                </div>
                
                <div className="text-sm mb-4">
                  <div className="text-muted-foreground">Connected account</div>
                  <div>{integration.accountEmail}</div>
                </div>
                
                {integration.status === "connected" && (
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Last synced: {integration.lastSyncAt ? formatDateTime(integration.lastSyncAt) : "Never"}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedIntegration(integration)
                      setIntegrationSettingsDialogOpen(true)
                    }}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Settings
                  </Button>
                  
                  <Button
                    variant={integration.status === "connected" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleIntegrationStatus(integration.id)}
                  >
                    {integration.status === "connected" ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
            
            {/* Add New Integration Card */}
            <div className="border rounded-lg p-4 border-dashed flex flex-col items-center justify-center text-center">
              <Video className="h-10 w-10 text-muted-foreground mb-2" />
              <h3 className="font-medium mb-1">Add New Integration</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Connect with another meeting platform
              </p>
              <Button variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-1" />
                Add Integration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meetings Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meetings..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filterPlatform || ""} onValueChange={(value) => setFilterPlatform(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Platforms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Platforms</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
                <SelectItem value="google_meet">Google Meet</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filterProject || ""} onValueChange={(value) => setFilterProject(value || null)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                      <span>{project.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingMeetings.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedMeetings.length})</TabsTrigger>
          {inProgressMeetings.length > 0 && (
            <TabsTrigger value="in_progress">In Progress ({inProgressMeetings.length})</TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          {upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Calendar className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No upcoming meetings</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Schedule a new meeting to get started
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingMeetings.map(meeting => renderUpcomingMeetingCard(meeting))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in_progress" className="mt-6">
          {inProgressMeetings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Video className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No meetings in progress</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressMeetings.map(meeting => (
                <div key={meeting.id} className="border rounded-lg p-4 bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900">
                  <div className="flex items-center justify-between mb-3">
                    {getPlatformBadge(meeting.platform)}
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-none">In Progress</Badge>
                  </div>
                  
                  <h3 className="font-medium text-lg mb-1">{meeting.title}</h3>
                  
                  {meeting.description && (
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{meeting.description}</p>
                  )}
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(meeting.startTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                    </div>
                    
                    {meeting.projectId && meeting.projectName && (
                      <div className="flex items-center gap-2 text-sm">
                        {getProjectDot(meeting.projectId)}
                        <span>{meeting.projectName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {meeting.participants.slice(0, 3).map(participant => (
                        <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                      ))}
                      {meeting.participants.length > 3 && (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
                          +{meeting.participants.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(meeting.meetingLink, "_blank")}>
                        <Link className="h-3 w-3 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {completedMeetings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <FileVideo className="h-10 w-10 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No completed meetings</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedMeetings.map(meeting => renderCompletedMeetingCard(meeting))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Integration Settings Dialog */}
      <Dialog open={integrationSettingsDialogOpen} onOpenChange={setIntegrationSettingsDialogOpen}>
        {selectedIntegration && (
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedIntegration.name} Settings</DialogTitle>
              <DialogDescription>
                Configure settings for your {selectedIntegration.name} integration
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="auto-recording">Auto Recording</Label>
                  <p className="text-xs text-muted-foreground">Automatically record all meetings</p>
                </div>
                <Switch
                  id="auto-recording"
                  checked={selectedIntegration.settings.autoRecording}
                  onCheckedChange={(checked) => {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      settings: {
                        ...selectedIntegration.settings,
                        autoRecording: checked
                      }
                    })
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="auto-transcription">Auto Transcription</Label>
                  <p className="text-xs text-muted-foreground">Automatically transcribe all recordings</p>
                </div>
                <Switch
                  id="auto-transcription"
                  checked={selectedIntegration.settings.autoTranscription}
                  onCheckedChange={(checked) => {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      settings: {
                        ...selectedIntegration.settings,
                        autoTranscription: checked
                      }
                    })
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="auto-task-extraction">Auto Task Extraction</Label>
                  <p className="text-xs text-muted-foreground">Extract action items from transcriptions</p>
                </div>
                <Switch
                  id="auto-task-extraction"
                  checked={selectedIntegration.settings.autoTaskExtraction}
                  onCheckedChange={(checked) => {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      settings: {
                        ...selectedIntegration.settings,
                        autoTaskExtraction: checked
                      }
                    })
                  }}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="auto-summary">Auto Summary</Label>
                  <p className="text-xs text-muted-foreground">Generate meeting summaries automatically</p>
                </div>
                <Switch
                  id="auto-summary"
                  checked={selectedIntegration.settings.autoSummary}
                  onCheckedChange={(checked) => {
                    setSelectedIntegration({
                      ...selectedIntegration,
                      settings: {
                        ...selectedIntegration.settings,
                        autoSummary: checked
                      }
                    })
                  }}
                />
              </div>
              
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // This would trigger the platform's OAuth flow in a real app
                    toast.success(`Reconnecting ${selectedIntegration.name} account...`)
                  }}
                >
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Change Connected Account
                </Button>
              </div>
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleUpdateIntegrationSettings}>Save Settings</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Meeting Details Dialog */}
      <Dialog open={meetingDetailsDialogOpen} onOpenChange={setMeetingDetailsDialogOpen}>
        {selectedMeeting && (
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <div className="flex items-center gap-2">
                {getPlatformBadge(selectedMeeting.platform)}
                {getStatusBadge(selectedMeeting.status)}
              </div>
              <DialogTitle className="text-xl mt-2">{selectedMeeting.title}</DialogTitle>
              {selectedMeeting.description && (
                <DialogDescription className="text-sm mt-1">
                  {selectedMeeting.description}
                </DialogDescription>
              )}
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                {selectedMeeting.status === "completed" && selectedMeeting.recording && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Recording</h3>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FileVideo className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">Meeting Recording</span>
                        </div>
                        <Badge>{selectedMeeting.recording.duration}</Badge>
                      </div>
                      
                      <div className="rounded-md bg-black aspect-video relative mb-3">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <PlaySquare className="h-12 w-12 text-white opacity-80" />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>Uploaded: {formatDateTime(selectedMeeting.recording.uploadDate)}</span>
                        <span>{selectedMeeting.recording.size}</span>
                      </div>
                      
                      <div className="flex justify-end mt-3">
                        <Button variant="outline" size="sm" className="mr-2" onClick={() => toast.success("Link copied to clipboard")}>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy Link
                        </Button>
                        <Button size="sm">
                          <DownloadCloud className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedMeeting.status === "completed" && selectedMeeting.transcription && selectedMeeting.transcription.status === "completed" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Transcription & Insights</h3>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Full Transcript
                      </Button>
                    </div>
                    
                    {selectedMeeting.transcription.insights && (
                      <div className="space-y-6">
                        {selectedMeeting.transcription.insights.actionItems.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium flex items-center gap-2">
                              <ListChecks className="h-4 w-4 text-muted-foreground" />
                              Action Items
                            </h4>
                            <div className="border rounded-md p-3 bg-muted/20">
                              <ul className="space-y-2">
                                {selectedMeeting.transcription.insights.actionItems.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <Checkbox id={`action-${idx}`} className="mt-1" />
                                    <Label htmlFor={`action-${idx}`} className="text-sm">{item}</Label>
                                  </li>
                                ))}
                              </ul>
                              <div className="flex justify-end mt-3">
                                <Button variant="outline" size="sm">
                                  Create Tasks
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {selectedMeeting.transcription.insights.keyTopics.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Key Topics</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedMeeting.transcription.insights.keyTopics.map((topic, idx) => (
                                <Badge key={idx} variant="secondary">{topic}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedMeeting.transcription.insights.decisions.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-sm font-medium">Decisions Made</h4>
                            <ul className="space-y-1">
                              {selectedMeeting.transcription.insights.decisions.map((decision, idx) => (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                  {decision}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Meeting Details</h3>
                  
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(selectedMeeting.startTime)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formatTime(selectedMeeting.startTime)} - {formatTime(selectedMeeting.endTime)}</span>
                    </div>
                    
                    {selectedMeeting.projectId && selectedMeeting.projectName && (
                      <div className="flex items-center gap-2">
                        {getProjectDot(selectedMeeting.projectId)}
                        <span>{selectedMeeting.projectName}</span>
                      </div>
                    )}
                    
                    {selectedMeeting.isRecurring && selectedMeeting.recurrencePattern && (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedMeeting.recurrencePattern}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedMeeting.status === "scheduled" && (
                    <Button className="w-full" onClick={() => window.open(selectedMeeting.meetingLink, "_blank")}>
                      <Video className="h-4 w-4 mr-2" />
                      Join Meeting
                    </Button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Participants ({selectedMeeting.participants.length})</h3>
                  
                  <div className="border rounded-md p-3 max-h-[300px] overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={selectedMeeting.organizerAvatar} alt={selectedMeeting.organizer} />
                          <AvatarFallback>{selectedMeeting.organizer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{selectedMeeting.organizer}</div>
                          <div className="text-xs text-muted-foreground">Organizer</div>
                        </div>
                      </div>
                      
                      {selectedMeeting.participants.map(participant => (
                        <div key={participant.id} className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm">{participant.name}</div>
                            <div className="text-xs text-muted-foreground">{participant.email}</div>
                          </div>
                          
                          {participant.attendance && (
                            <Badge
                              variant="outline"
                              className={
                                participant.attendance === "present" 
                                  ? "ml-auto bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-none"
                                  : participant.attendance === "late"
                                  ? "ml-auto bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 border-none"
                                  : "ml-auto bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 border-none"
                              }
                            >
                              {participant.attendance}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {selectedMeeting.status === "scheduled" && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Options</h3>
                    
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="justify-start">
                        <Calendar className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Invitation
                      </Button>
                      <Button variant="outline" className="justify-start text-red-500 hover:text-red-500">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Meeting
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setMeetingDetailsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

export default MeetingIntegration