import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { format, isBefore, isPast, isSameDay, parse, startOfToday } from "date-fns"
import { 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  MoreHorizontal, 
  Video, 
  Users, 
  CalendarDays, 
  XCircle, 
  Check, 
  CheckCheck, 
  Clock, 
  Video as VideoIcon,
  Settings,
  ExternalLink, 
  File, 
  ListChecks, 
  Tag, 
  User,
  UserPlus, 
  Download, 
  Copy, 
  PlayCircle,
  PauseCircle,
  Mic,
  Play,
  ChevronRight,
  ChevronLeft
} from "lucide-react"

/**
 * Schema for scheduling a meeting
 */
const scheduleMeetingSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  platform: z.string().min(1, "Please select a meeting platform"),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Please select a start time"),
  endTime: z.string().min(1, "Please select an end time"),
  participants: z.array(z.string()).min(1, "Please select at least one participant"),
  project: z.string().optional(),
  description: z.string().optional(),
})

/**
 * MeetingIntegration page for Org Admins
 */
function MeetingIntegration() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false)
  const [openRecordingDialog, setOpenRecordingDialog] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<any>(null)
  const [activeRecording, setActiveRecording] = useState<any>(null)
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [meetings, setMeetings] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [recordings, setRecordings] = useState<any[]>([])
  const [transcripts, setTranscripts] = useState<any[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0)
  const { toast } = useToast()
  
  // Form for scheduling a meeting
  const form = useForm<z.infer<typeof scheduleMeetingSchema>>({
    resolver: zodResolver(scheduleMeetingSchema),
    defaultValues: {
      title: "",
      platform: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "10:00",
      participants: [],
      project: "",
      description: ""
    },
  })
  
  // Fetch meetings, team members, and projects data
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock team members data
      const mockTeamMembers = [
        {
          id: "user-1",
          name: "John Doe",
          avatar: "",
          role: "UI/UX Designer",
          email: "john@example.com"
        },
        {
          id: "user-2",
          name: "Jane Smith",
          avatar: "",
          role: "Project Manager",
          email: "jane@example.com"
        },
        {
          id: "user-3",
          name: "Robert Johnson",
          avatar: "",
          role: "Frontend Developer",
          email: "robert@example.com"
        },
        {
          id: "user-4",
          name: "Emily Davis",
          avatar: "",
          role: "Backend Developer",
          email: "emily@example.com"
        },
        {
          id: "user-5",
          name: "Michael Brown",
          avatar: "",
          role: "QA Engineer",
          email: "michael@example.com"
        },
        {
          id: "user-6",
          name: "Karen Thompson",
          avatar: "",
          role: "Account Manager",
          email: "karen@example.com",
          isClient: true
        }
      ]
      
      // Mock projects data
      const mockProjects = [
        {
          id: "proj-1",
          name: "Website Redesign"
        },
        {
          id: "proj-2",
          name: "Mobile App Development"
        },
        {
          id: "proj-3",
          name: "E-commerce Platform"
        }
      ]
      
      // Mock meetings data
      const mockMeetings = [
        {
          id: "meet-1",
          title: "Website Redesign Kickoff",
          platform: "zoom",
          date: "2023-07-01",
          startTime: "09:00",
          endTime: "10:30",
          status: "completed",
          project: {
            id: "proj-1",
            name: "Website Redesign"
          },
          host: {
            id: "user-2",
            name: "Jane Smith",
            avatar: ""
          },
          participants: [
            {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            {
              id: "user-2",
              name: "Jane Smith",
              avatar: ""
            },
            {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            {
              id: "user-4",
              name: "Emily Davis",
              avatar: ""
            }
          ],
          hasRecording: true,
          hasTranscript: true,
          hasSummary: true,
          hasActionItems: true,
          joinUrl: "https://zoom.us/j/123456789",
          description: "Initial meeting to discuss website redesign goals and timeline."
        },
        {
          id: "meet-2",
          title: "Design Review",
          platform: "teams",
          date: "2023-07-03",
          startTime: "14:00",
          endTime: "15:00",
          status: "completed",
          project: {
            id: "proj-1",
            name: "Website Redesign"
          },
          host: {
            id: "user-1",
            name: "John Doe",
            avatar: ""
          },
          participants: [
            {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            {
              id: "user-2",
              name: "Jane Smith",
              avatar: ""
            },
            {
              id: "user-6",
              name: "Karen Thompson",
              avatar: "",
              isClient: true
            }
          ],
          hasRecording: true,
          hasTranscript: true,
          hasSummary: true,
          hasActionItems: true,
          joinUrl: "https://teams.microsoft.com/l/meetup-join/123456789",
          description: "Review design mockups with client."
        },
        {
          id: "meet-3",
          title: "Weekly Team Sync",
          platform: "zoom",
          date: format(new Date(), 'yyyy-MM-dd'),
          startTime: "10:00",
          endTime: "11:00",
          status: "upcoming",
          project: null,
          host: {
            id: "user-2",
            name: "Jane Smith",
            avatar: ""
          },
          participants: [
            {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            {
              id: "user-2",
              name: "Jane Smith",
              avatar: ""
            },
            {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            {
              id: "user-4",
              name: "Emily Davis",
              avatar: ""
            },
            {
              id: "user-5",
              name: "Michael Brown",
              avatar: ""
            }
          ],
          hasRecording: false,
          hasTranscript: false,
          hasSummary: false,
          hasActionItems: false,
          joinUrl: "https://zoom.us/j/987654321",
          description: "Regular team sync meeting to discuss progress and blockers."
        },
        {
          id: "meet-4",
          title: "Mobile App Planning",
          platform: "google",
          date: "2023-07-10",
          startTime: "13:00",
          endTime: "14:30",
          status: "upcoming",
          project: {
            id: "proj-2",
            name: "Mobile App Development"
          },
          host: {
            id: "user-2",
            name: "Jane Smith",
            avatar: ""
          },
          participants: [
            {
              id: "user-1",
              name: "John Doe",
              avatar: ""
            },
            {
              id: "user-2",
              name: "Jane Smith",
              avatar: ""
            },
            {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            {
              id: "user-5",
              name: "Michael Brown",
              avatar: ""
            }
          ],
          hasRecording: false,
          hasTranscript: false,
          hasSummary: false,
          hasActionItems: false,
          joinUrl: "https://meet.google.com/abc-defg-hij",
          description: "Planning session for mobile app development."
        },
        {
          id: "meet-5",
          title: "E-commerce Integration Discussion",
          platform: "zoom",
          date: "2023-07-15",
          startTime: "11:00",
          endTime: "12:00",
          status: "upcoming",
          project: {
            id: "proj-3",
            name: "E-commerce Platform"
          },
          host: {
            id: "user-4",
            name: "Emily Davis",
            avatar: ""
          },
          participants: [
            {
              id: "user-2",
              name: "Jane Smith",
              avatar: ""
            },
            {
              id: "user-3",
              name: "Robert Johnson",
              avatar: ""
            },
            {
              id: "user-4",
              name: "Emily Davis",
              avatar: ""
            }
          ],
          hasRecording: false,
          hasTranscript: false,
          hasSummary: false,
          hasActionItems: false,
          joinUrl: "https://zoom.us/j/456789123",
          description: "Discussion about integrating payment gateways."
        }
      ]
      
      // Mock recordings data
      const mockRecordings = [
        {
          id: "rec-1",
          meetingId: "meet-1",
          title: "Website Redesign Kickoff",
          date: "2023-07-01",
          duration: "01:30:00",
          fileSize: "123.5 MB",
          url: "#"
        },
        {
          id: "rec-2",
          meetingId: "meet-2",
          title: "Design Review",
          date: "2023-07-03",
          duration: "01:00:00",
          fileSize: "98.2 MB",
          url: "#"
        }
      ]
      
      // Mock transcripts data
      const mockTranscripts = [
        {
          id: "trans-1",
          meetingId: "meet-1",
          title: "Website Redesign Kickoff",
          date: "2023-07-01",
          content: [
            {
              speaker: "Jane Smith",
              timestamp: "00:00:15",
              text: "Welcome everyone to our website redesign kickoff meeting. Today we'll discuss the project goals, timeline, and assign initial tasks."
            },
            {
              speaker: "John Doe",
              timestamp: "00:01:02",
              text: "I've prepared some initial design concepts based on our discussions. I can share my screen to go through them."
            },
            {
              speaker: "Robert Johnson",
              timestamp: "00:01:45",
              text: "That sounds great. I'd also like to discuss the technical requirements and any potential challenges."
            },
            {
              speaker: "Jane Smith",
              timestamp: "00:02:30",
              text: "Perfect. Let's start with John's design concepts, then move on to the technical discussion. After that, we can talk about project timeline and next steps."
            },
            {
              speaker: "Emily Davis",
              timestamp: "00:03:10",
              text: "I have some concerns about the database architecture that we should address early on."
            }
          ],
          actionItems: [
            {
              text: "John to finalize wireframes by next Friday",
              assignee: "John Doe",
              dueDate: "2023-07-08"
            },
            {
              text: "Robert to prepare technical specification document",
              assignee: "Robert Johnson",
              dueDate: "2023-07-10"
            },
            {
              text: "Emily to research database solutions",
              assignee: "Emily Davis",
              dueDate: "2023-07-07"
            },
            {
              text: "Jane to schedule follow-up meeting with client",
              assignee: "Jane Smith",
              dueDate: "2023-07-05"
            }
          ],
          summary: "In this kickoff meeting for the website redesign project, the team discussed initial design concepts presented by John, technical requirements and potential challenges raised by Robert, and database architecture concerns from Emily. Jane outlined the project timeline and next steps. The team agreed on several action items including finalizing wireframes, preparing technical specifications, researching database solutions, and scheduling a follow-up client meeting."
        },
        {
          id: "trans-2",
          meetingId: "meet-2",
          title: "Design Review",
          date: "2023-07-03",
          content: [
            {
              speaker: "John Doe",
              timestamp: "00:00:10",
              text: "Thanks everyone for joining this design review. I'll walk through the latest mockups and get your feedback."
            },
            {
              speaker: "Karen Thompson",
              timestamp: "00:01:30",
              text: "Looking forward to seeing the progress. Our marketing team has some specific requirements we'd like to make sure are incorporated."
            },
            {
              speaker: "Jane Smith",
              timestamp: "00:02:15",
              text: "We've made sure to integrate all the feedback from our last meeting. John, go ahead and share your screen."
            },
            {
              speaker: "John Doe",
              timestamp: "00:02:45",
              text: "Here's the homepage design. As you can see, we've updated the hero section and revised the navigation structure."
            },
            {
              speaker: "Karen Thompson",
              timestamp: "00:04:20",
              text: "I like the direction, but can we make the call-to-action buttons more prominent? They seem to blend in too much with the background."
            }
          ],
          actionItems: [
            {
              text: "Revise CTA button styling to make them more prominent",
              assignee: "John Doe",
              dueDate: "2023-07-05"
            },
            {
              text: "Add more content sections to homepage as discussed",
              assignee: "John Doe",
              dueDate: "2023-07-06"
            },
            {
              text: "Share updated designs with Karen for review",
              assignee: "Jane Smith",
              dueDate: "2023-07-07"
            }
          ],
          summary: "In this design review meeting, John presented the latest mockups for the website redesign, focusing on the updated homepage with revised hero section and navigation structure. Karen from the client side provided feedback, particularly about making CTA buttons more prominent. The team discussed several design elements and agreed on specific revisions. Action items include revising button styling, adding content sections, and sharing updated designs with the client."
        }
      ]
      
      setTeamMembers(mockTeamMembers)
      setProjects(mockProjects)
      setMeetings(mockMeetings)
      setRecordings(mockRecordings)
      setTranscripts(mockTranscripts)
      setIsLoading(false)
    }
    
    fetchData()
  }, [])
  
  /**
   * Handle form submission for scheduling a meeting
   */
  const onSubmit = async (values: z.infer<typeof scheduleMeetingSchema>) => {
    // In a real app, this would send the data to the server
    console.log("Scheduling meeting:", values)
    
    // Show success toast
    toast({
      title: "Meeting scheduled",
      description: "The meeting has been scheduled successfully.",
    })
    
    // Reset form and close dialog
    form.reset()
    setOpenScheduleDialog(false)
  }
  
  /**
   * Get platform icon
   */
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return <Video className="h-4 w-4 text-blue-500" />
      case 'teams':
        return <Video className="h-4 w-4 text-purple-500" />
      case 'google':
        return <Video className="h-4 w-4 text-green-500" />
      default:
        return <Video className="h-4 w-4" />
    }
  }
  
  /**
   * Get platform label
   */
  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return 'Zoom'
      case 'teams':
        return 'Microsoft Teams'
      case 'google':
        return 'Google Meet'
      default:
        return platform
    }
  }
  
  /**
   * Get status badge
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Upcoming</Badge>
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case 'cancelled':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Cancelled</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }
  
  /**
   * Get initials from name for avatar fallback
   */
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
  
  /**
   * Format time from 24h to 12h
   */
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  
  /**
   * Get meeting time range
   */
  const getMeetingTimeRange = (startTime: string, endTime: string) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`
  }
  
  /**
   * Format date to display format
   */
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy')
  }
  
  /**
   * Check if a meeting is in progress
   */
  const isMeetingInProgress = (meeting: any) => {
    const today = new Date()
    const meetingDate = new Date(meeting.date)
    
    if (!isSameDay(today, meetingDate)) return false
    
    const now = today.getHours() * 60 + today.getMinutes()
    const start = parseInt(meeting.startTime.split(':')[0]) * 60 + parseInt(meeting.startTime.split(':')[1])
    const end = parseInt(meeting.endTime.split(':')[0]) * 60 + parseInt(meeting.endTime.split(':')[1])
    
    return now >= start && now <= end
  }
  
  /**
   * Filter meetings based on search term and tab
   */
  const getFilteredMeetings = () => {
    const filtered = meetings.filter(meeting => {
      // Filter by search term
      const searchMatch = !searchTerm || 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (meeting.project?.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        meeting.participants.some((participant: any) => 
          participant.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      
      // Filter by tab
      let tabMatch = true
      if (activeTab === 'upcoming') {
        tabMatch = meeting.status === 'upcoming'
      } else if (activeTab === 'past') {
        tabMatch = meeting.status === 'completed'
      } else if (activeTab === 'recordings') {
        tabMatch = meeting.hasRecording
      }
      
      return searchMatch && tabMatch
    })
    
    // Sort meetings by date and time
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      
      if (dateA.getTime() !== dateB.getTime()) {
        return activeTab === 'past' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
      }
      
      const timeA = a.startTime.split(':').map(Number)
      const timeB = b.startTime.split(':').map(Number)
      
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0]
      }
      
      return timeA[1] - timeB[1]
    })
  }
  
  /**
   * Get meeting recording by meeting ID
   */
  const getMeetingRecording = (meetingId: string) => {
    return recordings.find(recording => recording.meetingId === meetingId)
  }
  
  /**
   * Get meeting transcript by meeting ID
   */
  const getMeetingTranscript = (meetingId: string) => {
    return transcripts.find(transcript => transcript.meetingId === meetingId)
  }
  
  /**
   * Handle view recording click
   */
  const handleViewRecording = (meeting: any) => {
    setSelectedMeeting(meeting)
    setActiveRecording(getMeetingRecording(meeting.id))
    setOpenRecordingDialog(true)
  }
  
  /**
   * Toggle playback state for recording
   */
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }
  
  /**
   * Filtered meetings based on current tab and search term
   */
  const filteredMeetings = getFilteredMeetings()
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Meeting Integration</h2>
          <p className="text-muted-foreground">
            Manage, record, and get insights from your meetings
          </p>
        </div>
        <Dialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter meeting title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Platform</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="zoom">Zoom</SelectItem>
                            <SelectItem value="teams">Microsoft Teams</SelectItem>
                            <SelectItem value="google">Google Meet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="project"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {projects.map(project => (
                              <SelectItem key={project.id} value={project.id}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < startOfToday()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="participants"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Participants</FormLabel>
                        <FormDescription>
                          Select team members to invite to this meeting
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                        {teamMembers.map((member) => (
                          <FormField
                            key={member.id}
                            control={form.control}
                            name="participants"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={member.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-muted rounded-md"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(member.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, member.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== member.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarImage src={member.avatar} alt={member.name} />
                                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="text-sm cursor-pointer">
                                        {member.name}
                                        {member.isClient && (
                                          <Badge variant="outline" className="ml-2 text-xs">
                                            Client
                                          </Badge>
                                        )}
                                      </FormLabel>
                                      <p className="text-xs text-muted-foreground">
                                        {member.role}
                                      </p>
                                    </div>
                                  </div>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter meeting description or agenda"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenScheduleDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Schedule Meeting</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <CardTitle>Your Meetings</CardTitle>
                <CardDescription>
                  Upcoming and past meetings
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search meetings..."
                  className="pl-8 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Meetings</TabsTrigger>
                <TabsTrigger value="recordings">Recordings</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : filteredMeetings.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  {activeTab === 'upcoming' ? (
                    <CalendarDays className="h-6 w-6 text-muted-foreground" />
                  ) : activeTab === 'past' ? (
                    <CheckCheck className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Video className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-1">No meetings found</h3>
                <p className="text-muted-foreground">
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming meetings scheduled."
                    : activeTab === 'past'
                    ? "No past meetings to display."
                    : "No meeting recordings available."}
                </p>
                {activeTab === 'upcoming' && (
                  <Button className="mt-4" onClick={() => setOpenScheduleDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Schedule Meeting
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => (
                  <Card key={meeting.id} className="overflow-hidden">
                    <div className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-muted">
                            {getPlatformIcon(meeting.platform)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{meeting.title}</h3>
                              {getStatusBadge(meeting.status)}
                              {isMeetingInProgress(meeting) && (
                                <Badge className="bg-red-500 hover:bg-red-600">In Progress</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(meeting.date)} • {getMeetingTimeRange(meeting.startTime, meeting.endTime)}
                            </p>
                            {meeting.project && (
                              <div className="flex items-center gap-1 mt-1">
                                <Tag className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs">{meeting.project.name}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 ml-auto">
                          {meeting.status === 'upcoming' ? (
                            <Button size="sm">
                              <Video className="mr-2 h-4 w-4" />
                              Join Meeting
                            </Button>
                          ) : (
                            meeting.hasRecording && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewRecording(meeting)}
                              >
                                <PlayCircle className="mr-2 h-4 w-4" />
                                View Recording
                              </Button>
                            )
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {meeting.status === 'upcoming' ? (
                                <>
                                  <DropdownMenuItem>
                                    <CalendarDays className="mr-2 h-4 w-4" />
                                    Add to Calendar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Copy Invite
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <User className="mr-2 h-4 w-4" />
                                    View Participants
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Invite More People
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel Meeting
                                  </DropdownMenuItem>
                                </>
                              ) : (
                                <>
                                  {meeting.hasTranscript && (
                                    <DropdownMenuItem>
                                      <File className="mr-2 h-4 w-4" />
                                      View Transcript
                                    </DropdownMenuItem>
                                  )}
                                  {meeting.hasActionItems && (
                                    <DropdownMenuItem>
                                      <ListChecks className="mr-2 h-4 w-4" />
                                      View Action Items
                                    </DropdownMenuItem>
                                  )}
                                  {meeting.hasSummary && (
                                    <DropdownMenuItem>
                                      <File className="mr-2 h-4 w-4" />
                                      View Summary
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Recording
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex items-center mt-4">
                        <p className="text-xs text-muted-foreground mr-2">Participants:</p>
                        <div className="flex -space-x-2">
                          {meeting.participants.slice(0, 4).map((participant: any) => (
                            <Avatar key={participant.id} className="h-6 w-6 border-2 border-background">
                              <AvatarImage src={participant.avatar} alt={participant.name} />
                              <AvatarFallback className="text-xs">{getInitials(participant.name)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.participants.length > 4 && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                              +{meeting.participants.length - 4}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground ml-auto">
                          Host: {meeting.host.name}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meeting Calendar</CardTitle>
            <CardDescription>
              {format(currentMonth, 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const previousMonth = new Date(currentMonth)
                    previousMonth.setMonth(previousMonth.getMonth() - 1)
                    setCurrentMonth(previousMonth)
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="font-medium">
                  {format(currentMonth, 'MMMM yyyy')}
                </h4>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    const nextMonth = new Date(currentMonth)
                    nextMonth.setMonth(nextMonth.getMonth() + 1)
                    setCurrentMonth(nextMonth)
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                <div className="flex flex-col gap-2">
                  {meetings
                    .filter(meeting => {
                      const meetingDate = new Date(meeting.date)
                      return meetingDate.getMonth() === currentMonth.getMonth() && 
                             meetingDate.getFullYear() === currentMonth.getFullYear()
                    })
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(meeting => {
                      const isPast = isBefore(new Date(meeting.date), new Date()) &&
                                     meeting.status === 'completed'
                      return (
                        <div 
                          key={meeting.id}
                          className={`p-2 rounded-md border ${isPast ? 'opacity-70' : ''}`}
                        >
                          <div className="flex items-center gap-2">
                            <div 
                              className={`w-1 self-stretch rounded-full ${
                                meeting.platform === 'zoom' ? 'bg-blue-500' :
                                meeting.platform === 'teams' ? 'bg-purple-500' :
                                'bg-green-500'
                              }`}
                            ></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium line-clamp-1">{meeting.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(meeting.date), 'MMM d')} • {formatTime(meeting.startTime)}
                              </p>
                            </div>
                            {getPlatformIcon(meeting.platform)}
                          </div>
                        </div>
                      )
                    })
                  }
                  
                  {meetings.filter(meeting => {
                    const meetingDate = new Date(meeting.date)
                    return meetingDate.getMonth() === currentMonth.getMonth() && 
                           meetingDate.getFullYear() === currentMonth.getFullYear()
                  }).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No meetings scheduled for this month
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4 flex flex-col items-stretch gap-2">
            <Button variant="outline" onClick={() => setOpenScheduleDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule New Meeting
            </Button>
            <Button variant="ghost">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Full Calendar
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Connected Platforms */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Platforms</CardTitle>
          <CardDescription>
            Manage your meeting platform integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="bg-blue-500 text-white p-2 rounded-md">
                  <Video className="h-5 w-5" />
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </CardHeader>
              <CardContent className="py-2">
                <h3 className="font-medium">Zoom</h3>
                <p className="text-sm text-muted-foreground">
                  Connected as teamlens@example.com
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Disconnect
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs ml-auto">
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="bg-purple-500 text-white p-2 rounded-md">
                  <Video className="h-5 w-5" />
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">Connected</Badge>
              </CardHeader>
              <CardContent className="py-2">
                <h3 className="font-medium">Microsoft Teams</h3>
                <p className="text-sm text-muted-foreground">
                  Connected as teamlens@example.com
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    Disconnect
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs ml-auto">
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden">
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <div className="bg-green-500 text-white p-2 rounded-md">
                  <Video className="h-5 w-5" />
                </div>
                <Badge variant="outline">Not Connected</Badge>
              </CardHeader>
              <CardContent className="py-2">
                <h3 className="font-medium">Google Meet</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your Google account
                </p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs ml-auto">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Recording dialog */}
      <Dialog open={openRecordingDialog} onOpenChange={setOpenRecordingDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Meeting Recording</DialogTitle>
            <DialogDescription>
              {selectedMeeting?.title} - {selectedMeeting?.date && formatDate(selectedMeeting.date)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Video player placeholder */}
            <div className="relative bg-black aspect-video rounded-md overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoIcon className="h-12 w-12 text-white opacity-50" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={togglePlayback}
                    >
                      {isPlaying ? 
                        <PauseCircle className="h-5 w-5" /> : 
                        <PlayCircle className="h-5 w-5" />
                      }
                    </Button>
                    <div className="text-sm">00:00 / {activeRecording?.duration}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="transcript">
              <TabsList>
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="actions">Action Items</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transcript" className="space-y-4">
                {getMeetingTranscript(selectedMeeting?.id)?.content.map((item, index) => (
                  <div key={index} className="flex gap-3 p-2 hover:bg-muted rounded-md">
                    <div className="text-sm text-muted-foreground w-12">
                      {item.timestamp}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.speaker}</p>
                      <p className="text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="summary">
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Meeting Summary</h3>
                  <p className="text-sm">
                    {getMeetingTranscript(selectedMeeting?.id)?.summary}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-3">
                {getMeetingTranscript(selectedMeeting?.id)?.actionItems.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-md">
                    <Checkbox id={`action-${index}`} />
                    <div className="flex-1">
                      <label htmlFor={`action-${index}`} className="font-medium text-sm cursor-pointer">
                        {item.text}
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Assignee: {item.assignee}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Due: {format(new Date(item.dueDate), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
          
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button>
                <ListChecks className="mr-2 h-4 w-4" />
                Create Tasks
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MeetingIntegration