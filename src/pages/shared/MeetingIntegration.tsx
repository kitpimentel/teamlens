// src/pages/shared/MeetingIntegration.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import {
  Search,
  Plus,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Clock,
  Video,
  VideoOff,
  Mic,
  MicOff,
  MoreVertical,
  Play,
  Paperclip,
  Download,
  Trash2,
  ExternalLink,
  Edit,
  Users,
  CheckCircle2,
  Link2,
  MessageSquare,
  ClipboardList,
  X,
  Info,
  RefreshCw,
  Check
} from 'lucide-react';

// Types for our data models
interface Meeting {
  id: string;
  title: string;
  project: Project;
  date: string;
  startTime: string;
  duration: number; // in minutes
  platform: 'zoom' | 'teams' | 'google-meet';
  link: string;
  organizer: TeamMember;
  attendees: TeamMember[];
  description: string;
  status: 'scheduled' | 'completed' | 'canceled';
  recording?: Recording;
  hasTranscript: boolean;
  hasActionItems: boolean;
  notes?: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

interface Recording {
  url: string;
  date: string;
  duration: number; // in minutes
  fileSize: string;
  processingStatus: 'processing' | 'completed' | 'failed';
}

interface ActionItem {
  id: string;
  meetingId: string;
  description: string;
  assignee: TeamMember;
  dueDate: string | null;
  status: 'open' | 'completed';
  source: 'manual' | 'auto-detected';
}

interface TranscriptSegment {
  id: string;
  meetingId: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  speaker: string;
  text: string;
}

// Mock data
const mockProjects: Project[] = [
  { id: '1', name: 'E-commerce Website Redesign', client: 'GlobalShop Inc.' },
  { id: '2', name: 'Mobile App Development', client: 'TechStartup Ltd.' },
  { id: '3', name: 'Marketing Campaign Analytics', client: 'AdGenius Co.' },
  { id: '4', name: 'Customer Portal Enhancement', client: 'ServiceHub Ltd.' },
  { id: '5', name: 'Internal Tool Development', client: 'Internal' }
];

const mockTeamMembers: TeamMember[] = [
  { id: '1', name: 'Alex Johnson', role: 'Project Manager', email: 'alex.j@example.com' },
  { id: '2', name: 'Jamie Lee', role: 'UX Designer', email: 'jamie.l@example.com' },
  { id: '3', name: 'Casey Jones', role: 'Frontend Developer', email: 'casey.j@example.com' },
  { id: '4', name: 'Morgan Taylor', role: 'Project Manager', email: 'morgan.t@example.com' },
  { id: '5', name: 'Sam Reynolds', role: 'Mobile Developer', email: 'sam.r@example.com' },
  { id: '6', name: 'Riley Smith', role: 'Backend Developer', email: 'riley.s@example.com' },
  { id: '7', name: 'Taylor Rodriguez', role: 'Data Analyst', email: 'taylor.r@example.com' },
  { id: '8', name: 'Jordan Lee', role: 'Marketing Specialist', email: 'jordan.l@example.com' }
];

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Website Redesign Kickoff',
    project: mockProjects[0],
    date: '2025-04-05',
    startTime: '10:00',
    duration: 60,
    platform: 'zoom',
    link: 'https://zoom.us/j/123456789',
    organizer: mockTeamMembers[0],
    attendees: [mockTeamMembers[0], mockTeamMembers[1], mockTeamMembers[2]],
    description: 'Initial kickoff meeting for the website redesign project. We will discuss project scope, timeline, and initial requirements.',
    status: 'scheduled',
    hasTranscript: false,
    hasActionItems: false
  },
  {
    id: '2',
    title: 'Mobile App Sprint Planning',
    project: mockProjects[1],
    date: '2025-04-02',
    startTime: '14:30',
    duration: 90,
    platform: 'teams',
    link: 'https://teams.microsoft.com/l/meetup-join/123456789',
    organizer: mockTeamMembers[3],
    attendees: [mockTeamMembers[3], mockTeamMembers[4], mockTeamMembers[5]],
    description: 'Sprint planning meeting for the mobile app development project. We will define tasks and assign them to team members.',
    status: 'completed',
    recording: {
      url: '/recordings/meeting-2.mp4',
      date: '2025-04-02',
      duration: 85,
      fileSize: '234 MB',
      processingStatus: 'completed'
    },
    hasTranscript: true,
    hasActionItems: true,
    notes: 'Discussed sprint goals and task assignments. Identified potential risks related to API integration.'
  },
  {
    id: '3',
    title: 'Marketing Campaign Status Update',
    project: mockProjects[2],
    date: '2025-04-01',
    startTime: '11:00',
    duration: 45,
    platform: 'google-meet',
    link: 'https://meet.google.com/abc-defg-hij',
    organizer: mockTeamMembers[7],
    attendees: [mockTeamMembers[0], mockTeamMembers[6], mockTeamMembers[7]],
    description: 'Regular status update for the marketing campaign. Review current metrics and discuss next steps.',
    status: 'completed',
    recording: {
      url: '/recordings/meeting-3.mp4',
      date: '2025-04-01',
      duration: 42,
      fileSize: '156 MB',
      processingStatus: 'completed'
    },
    hasTranscript: true,
    hasActionItems: true,
    notes: 'Reviewed campaign performance metrics. Decided to adjust targeting parameters based on initial results.'
  },
  {
    id: '4',
    title: 'Customer Portal UX Review',
    project: mockProjects[3],
    date: '2025-04-08',
    startTime: '13:15',
    duration: 60,
    platform: 'zoom',
    link: 'https://zoom.us/j/987654321',
    organizer: mockTeamMembers[1],
    attendees: [mockTeamMembers[1], mockTeamMembers[2], mockTeamMembers[5]],
    description: 'Review and feedback session for the customer portal UX design. Focus on navigation and user flows.',
    status: 'scheduled',
    hasTranscript: false,
    hasActionItems: false
  },
  {
    id: '5',
    title: 'Internal Tools Architecture Discussion',
    project: mockProjects[4],
    date: '2025-03-28',
    startTime: '09:00',
    duration: 120,
    platform: 'teams',
    link: 'https://teams.microsoft.com/l/meetup-join/987654321',
    organizer: mockTeamMembers[5],
    attendees: [mockTeamMembers[3], mockTeamMembers[5], mockTeamMembers[2]],
    description: 'Technical discussion about the architecture of new internal tools. Focus on component structure and data flow.',
    status: 'completed',
    recording: {
      url: '/recordings/meeting-5.mp4',
      date: '2025-03-28',
      duration: 118,
      fileSize: '345 MB',
      processingStatus: 'completed'
    },
    hasTranscript: true,
    hasActionItems: true,
    notes: 'Decided on the overall architecture approach. Will use microservices design with a central authentication system.'
  }
];

const mockActionItems: ActionItem[] = [
  {
    id: '1',
    meetingId: '2',
    description: 'Set up the development environment for the mobile app project',
    assignee: mockTeamMembers[5],
    dueDate: '2025-04-05',
    status: 'completed',
    source: 'manual'
  },
  {
    id: '2',
    meetingId: '2',
    description: 'Create initial wireframes for the user onboarding flow',
    assignee: mockTeamMembers[4],
    dueDate: '2025-04-07',
    status: 'open',
    source: 'auto-detected'
  },
  {
    id: '3',
    meetingId: '2',
    description: 'Research authentication solutions and present options',
    assignee: mockTeamMembers[3],
    dueDate: '2025-04-09',
    status: 'open',
    source: 'manual'
  },
  {
    id: '4',
    meetingId: '3',
    description: 'Prepare updated campaign performance report for client',
    assignee: mockTeamMembers[7],
    dueDate: '2025-04-03',
    status: 'completed',
    source: 'auto-detected'
  },
  {
    id: '5',
    meetingId: '3',
    description: 'Adjust targeting parameters in marketing platform',
    assignee: mockTeamMembers[6],
    dueDate: '2025-04-02',
    status: 'open',
    source: 'manual'
  },
  {
    id: '6',
    meetingId: '5',
    description: 'Create architecture diagram for the new system',
    assignee: mockTeamMembers[5],
    dueDate: '2025-04-04',
    status: 'open',
    source: 'auto-detected'
  },
  {
    id: '7',
    meetingId: '5',
    description: 'Research authentication providers and prepare comparison',
    assignee: mockTeamMembers[2],
    dueDate: '2025-04-05',
    status: 'open',
    source: 'manual'
  }
];

const mockTranscriptSegments: TranscriptSegment[] = [
  {
    id: '1',
    meetingId: '2',
    startTime: 0,
    endTime: 15,
    speaker: 'Morgan Taylor',
    text: 'Good afternoon everyone. Welcome to our sprint planning meeting for the mobile app development project.'
  },
  {
    id: '2',
    meetingId: '2',
    startTime: 16,
    endTime: 32,
    speaker: 'Morgan Taylor',
    text: 'Today we need to define our tasks for the upcoming sprint and assign them to team members.'
  },
  {
    id: '3',
    meetingId: '2',
    startTime: 33,
    endTime: 48,
    speaker: 'Sam Reynolds',
    text: 'I\'ve already started working on the initial setup of the development environment. I think it would be good to have everyone set up by the end of the week.'
  },
  {
    id: '4',
    meetingId: '2',
    startTime: 49,
    endTime: 65,
    speaker: 'Riley Smith',
    text: 'Makes sense. I can help with that. We also need to start thinking about the authentication system. Should we use a third-party provider?'
  },
  {
    id: '5',
    meetingId: '2',
    startTime: 66,
    endTime: 85,
    speaker: 'Morgan Taylor',
    text: 'Good point. Riley, can you research some authentication solutions and present options at our next meeting?'
  },
  // Additional transcript segments for other meetings would be added here
];

/**
 * Meeting Integration Component
 * 
 * Provides functionality to schedule, manage, and review meetings
 * with integrations to Zoom, Microsoft Teams, and Google Meet.
 * Includes recording management, transcription, and action item extraction.
 */
const MeetingIntegration: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateMeetingOpen, setIsCreateMeetingOpen] = useState(false);
  const [isMeetingDetailsOpen, setIsMeetingDetailsOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(null);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Date picker state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  // New action item state
  const [isAddActionItemOpen, setIsAddActionItemOpen] = useState(false);
  const [newActionItemAssignee, setNewActionItemAssignee] = useState("");
  
  // New note state
  const [meetingNotes, setMeetingNotes] = useState("");
  
  // Filter meetings based on search query and tab
  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = 
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedTab === 'upcoming') {
      return matchesSearch && meeting.status === 'scheduled';
    } else if (selectedTab === 'past') {
      return matchesSearch && meeting.status === 'completed';
    } else {
      return matchesSearch;
    }
  });
  
  // Get action items for a specific meeting
  const getMeetingActionItems = (meetingId: string) => {
    return mockActionItems.filter(item => item.meetingId === meetingId);
  };
  
  // Get transcript segments for a specific meeting
  const getMeetingTranscript = (meetingId: string) => {
    return mockTranscriptSegments.filter(segment => segment.meetingId === meetingId);
  };

  /**
   * Show success alert with given message
   */
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 5000);
  };

  /**
   * Handle meeting creation
   */
  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to create a meeting
    setIsCreateMeetingOpen(false);
    showSuccess('Meeting created and invitations sent');
  };

  /**
   * Open meeting details
   */
  const handleOpenMeetingDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    if (meeting.notes) {
      setMeetingNotes(meeting.notes);
    } else {
      setMeetingNotes("");
    }
    setIsMeetingDetailsOpen(true);
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  /**
   * Format time for display
   */
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  /**
   * Format duration for display
   */
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`.trim();
  };

  /**
   * Get platform badge
   */
  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return <Badge className="bg-blue-100 text-blue-800">Zoom</Badge>;
      case 'teams':
        return <Badge className="bg-purple-100 text-purple-800">Teams</Badge>;
      case 'google-meet':
        return <Badge className="bg-green-100 text-green-800">Google Meet</Badge>;
      default:
        return null;
    }
  };

  /**
   * Get platform color
   */
  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'zoom':
        return 'text-blue-500';
      case 'teams':
        return 'text-purple-500';
      case 'google-meet':
        return 'text-green-500';
      default:
        return '';
    }
  };

  /**
   * Check if meeting is today
   */
  const isMeetingToday = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  /**
   * Check if meeting is in the future
   */
  const isMeetingFuture = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    return date > today;
  };

  /**
   * Get meeting time display
   */
  const getMeetingTimeDisplay = (meeting: Meeting) => {
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (
      meetingDate.getDate() === today.getDate() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getFullYear() === today.getFullYear()
    ) {
      return `Today at ${formatTime(meeting.startTime)}`;
    } else if (
      meetingDate.getDate() === tomorrow.getDate() &&
      meetingDate.getMonth() === tomorrow.getMonth() &&
      meetingDate.getFullYear() === tomorrow.getFullYear()
    ) {
      return `Tomorrow at ${formatTime(meeting.startTime)}`;
    } else {
      return `${formatDate(meeting.date)} at ${formatTime(meeting.startTime)}`;
    }
  };

  /**
   * Add a new action item
   */
  const handleAddActionItem = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would call an API to add an action item
    setIsAddActionItemOpen(false);
    showSuccess('Action item added successfully');
  };

  /**
   * Save meeting notes
   */
  const handleSaveNotes = () => {
    // In a real implementation, this would call an API to save notes
    showSuccess('Meeting notes saved successfully');
  };

  /**
   * Format timestamp for transcript
   */
  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  /**
   * Handle view transcript click
   */
  const handleViewTranscript = (meetingId: string) => {
    setSelectedTranscript(meetingId);
    setIsTranscriptOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Meeting Integration</h1>
        <p className="text-muted-foreground mt-2">
          Schedule, manage, and review meetings with automatic recording and transcription
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
        <div className="flex gap-3 flex-wrap">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search meetings..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select defaultValue={selectedTab}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming Meetings</SelectItem>
              <SelectItem value="past">Past Meetings</SelectItem>
              <SelectItem value="all">All Meetings</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog open={isCreateMeetingOpen} onOpenChange={setIsCreateMeetingOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Schedule a New Meeting</DialogTitle>
              <DialogDescription>
                Set up meeting details and invite team members
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateMeeting}>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="meeting-title">Meeting Title</Label>
                  <Input
                    id="meeting-title"
                    placeholder="Enter meeting title"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-project">Project</Label>
                    <Select defaultValue="">
                      <SelectTrigger id="meeting-project">
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Select a project</SelectItem>
                        {mockProjects.map(project => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-platform">Platform</Label>
                    <Select defaultValue="zoom">
                      <SelectTrigger id="meeting-platform">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zoom">Zoom</SelectItem>
                        <SelectItem value="teams">Microsoft Teams</SelectItem>
                        <SelectItem value="google-meet">Google Meet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date">Date</Label>
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          id="meeting-date"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? formatDate(selectedDate.toISOString()) : <span>Select date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setIsDatePickerOpen(false);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Start Time</Label>
                    <Input
                      id="meeting-time"
                      type="time"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-duration">Duration</Label>
                    <Select defaultValue="60">
                      <SelectTrigger id="meeting-duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="meeting-description">Description</Label>
                  <Textarea
                    id="meeting-description"
                    placeholder="What will be discussed in this meeting?"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Attendees</Label>
                  <div className="border rounded-md p-4 space-y-2">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {mockTeamMembers.slice(0, 3).map(member => (
                        <div key={member.id} className="flex items-center space-x-2 bg-muted/50 px-3 py-1 rounded-full text-sm">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                          <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full p-0">
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search team members or enter email addresses..."
                        className="pl-8"
                      />
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                      Pro tip: Separate multiple email addresses with commas
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <div className="text-sm font-medium mb-2">Suggested attendees</div>
                      <div className="space-y-2">
                        {mockTeamMembers.slice(3, 6).map(member => (
                          <div key={member.id} className="flex items-center justify-between py-1">
                            <div className="flex items-center gap-2">
                              <Checkbox id={`member-${member.id}`} />
                              <label
                                htmlFor={`member-${member.id}`}
                                className="flex items-center gap-2 text-sm font-medium"
                              >
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div>{member.name}</div>
                                  <div className="text-xs text-muted-foreground">{member.role}</div>
                                </div>
                              </label>
                            </div>
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="text-sm font-medium">Meeting Options</div>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="video-option" className="cursor-pointer">Turn on video for host</Label>
                      </div>
                      <Switch id="video-option" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <VideoOff className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="video-participants" className="cursor-pointer">Turn on video for participants</Label>
                      </div>
                      <Switch id="video-participants" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="recording-option" className="cursor-pointer">Automatically record meeting</Label>
                      </div>
                      <Switch id="recording-option" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="transcript-option" className="cursor-pointer">Generate transcript</Label>
                      </div>
                      <Switch id="transcript-option" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateMeetingOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Meeting</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main content tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-1">
            <CalendarIcon className="h-4 w-4" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Past Meetings
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-1">
            <Video className="h-4 w-4" />
            All Meetings
          </TabsTrigger>
        </TabsList>
        
        {/* Meetings List */}
        <TabsContent value={selectedTab}>
          <div className="space-y-4">
            {filteredMeetings.length > 0 ? (
              filteredMeetings.map(meeting => (
                <Card key={meeting.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-grow p-6">
                      <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {meeting.title}
                            {getPlatformBadge(meeting.platform)}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{meeting.description}</p>
                        </div>
                        {meeting.status === 'scheduled' && isMeetingToday(meeting.date) && (
                          <Button className="md:self-start">
                            <Video className="h-4 w-4 mr-2" />
                            Join Now
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-6 mt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Project</p>
                            <p className="font-medium">{meeting.project.name}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Time</p>
                            <p className="font-medium">
                              {getMeetingTimeDisplay(meeting)}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Duration</p>
                            <p className="font-medium">{formatDuration(meeting.duration)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Organizer</p>
                            <p className="font-medium">{meeting.organizer.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex -space-x-2 mb-2 md:mb-0">
                          {meeting.attendees.map((attendee, index) => (
                            <Avatar key={index} className="h-8 w-8 border-2 border-background">
                              <AvatarFallback className="bg-muted">{attendee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {meeting.attendees.length > 0 && (
                            <div className="flex items-center justify-center h-8 px-2 rounded-full bg-muted text-xs font-medium border-2 border-background">
                              {meeting.attendees.length} attendees
                            </div>
                          )}
                        </div>
                        
                        {meeting.status === 'completed' && (
                          <div className="flex flex-wrap gap-2">
                            {meeting.recording && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Play className="h-3 w-3" />
                                Recording
                              </Badge>
                            )}
                            {meeting.hasTranscript && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Transcript
                              </Badge>
                            )}
                            {meeting.hasActionItems && (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <ClipboardList className="h-3 w-3" />
                                Action Items
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col justify-around p-4 bg-muted/50 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleOpenMeetingDetails(meeting)}
                      >
                        View Details
                      </Button>
                      {meeting.status === 'scheduled' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`flex items-center gap-1 ${getPlatformColor(meeting.platform)}`}
                          onClick={() => window.open(meeting.link, '_blank')}
                        >
                          Open {meeting.platform === 'zoom' ? 'Zoom' : meeting.platform === 'teams' ? 'Teams' : 'Meet'}
                        </Button>
                      )}
                      {meeting.status === 'completed' && meeting.recording && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Recording
                        </Button>
                      )}
                      {meeting.status === 'completed' && meeting.hasTranscript && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => handleViewTranscript(meeting.id)}
                        >
                          View Transcript
                        </Button>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            navigator.clipboard.writeText(meeting.link);
                            showSuccess('Meeting link copied to clipboard');
                          }}>
                            <Link2 className="h-4 w-4 mr-2" />
                            Copy Meeting Link
                          </DropdownMenuItem>
                          {meeting.status === 'scheduled' && (
                            <>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                Add to Calendar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Meeting
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Users className="h-4 w-4 mr-2" />
                                Edit Attendees
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Cancel Meeting
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-muted/20 rounded-lg">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No meetings found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {selectedTab === 'upcoming' 
                    ? 'You have no upcoming meetings scheduled.'
                    : selectedTab === 'past' 
                      ? 'No past meetings found.'
                      : 'No meetings match your search criteria.'}
                </p>
                <Button onClick={() => setIsCreateMeetingOpen(true)}>Schedule a Meeting</Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Meeting Details Dialog */}
      <Dialog open={isMeetingDetailsOpen} onOpenChange={setIsMeetingDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedMeeting && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {selectedMeeting.title}
                    {getPlatformBadge(selectedMeeting.platform)}
                  </div>
                  <div>
                    <Badge variant="outline">Meeting ID: {selectedMeeting.id}</Badge>
                  </div>
                </DialogTitle>
                <DialogDescription className="flex justify-between items-center">
                  <div>
                    In <span className="font-medium">{selectedMeeting.project.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">
                      {formatDate(selectedMeeting.date)} at {formatTime(selectedMeeting.startTime)}
                    </span>
                    <span className="text-muted-foreground">
                      · {formatDuration(selectedMeeting.duration)}
                    </span>
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <div className="bg-muted/50 p-4 rounded-md text-sm">
                      {selectedMeeting.description}
                    </div>
                  </div>
                  
                  {selectedMeeting.status === 'completed' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Meeting Notes</h3>
                        <Button variant="outline" size="sm" onClick={handleSaveNotes}>Save Notes</Button>
                      </div>
                      <Textarea
                        value={meetingNotes}
                        onChange={(e) => setMeetingNotes(e.target.value)}
                        placeholder="Add meeting notes here..."
                        className="min-h-[150px]"
                      />
                    </div>
                  )}
                  
                  {selectedMeeting.status === 'completed' && selectedMeeting.hasActionItems && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium">Action Items</h3>
                        <Dialog open={isAddActionItemOpen} onOpenChange={setIsAddActionItemOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Item
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add Action Item</DialogTitle>
                              <DialogDescription>
                                Create a new action item from this meeting
                              </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddActionItem}>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="action-description">Description</Label>
                                  <Textarea
                                    id="action-description"
                                    placeholder="What needs to be done?"
                                    required
                                  />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="action-assignee">Assignee</Label>
                                    <Select
                                      value={newActionItemAssignee}
                                      onValueChange={setNewActionItemAssignee}
                                    >
                                      <SelectTrigger id="action-assignee">
                                        <SelectValue placeholder="Assign to" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {selectedMeeting.attendees.map(attendee => (
                                          <SelectItem key={attendee.id} value={attendee.id}>
                                            {attendee.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="action-due-date">Due Date</Label>
                                    <Input
                                      id="action-due-date"
                                      type="date"
                                    />
                                  </div>
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsAddActionItemOpen(false)}>
                                  Cancel
                                </Button>
                                <Button type="submit">Add Action Item</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="space-y-2">
                        {getMeetingActionItems(selectedMeeting.id).map(item => (
                          <div key={item.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-md">
                            <Checkbox checked={item.status === 'completed'} />
                            <div className="flex-grow">
                              <div className={`text-sm ${item.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                {item.description}
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  {item.assignee.name}
                                </div>
                                {item.dueDate && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    Due: {formatDate(item.dueDate)}
                                  </div>
                                )}
                                {item.source === 'auto-detected' && (
                                  <Badge variant="outline" className="text-xs">Auto-detected</Badge>
                                )}
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center justify-between">
                        Meeting Link
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => {
                            navigator.clipboard.writeText(selectedMeeting.link);
                            showSuccess('Meeting link copied to clipboard');
                          }}
                        >
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm">
                        <ExternalLink className={`h-4 w-4 ${getPlatformColor(selectedMeeting.platform)}`} />
                        <a 
                          href={selectedMeeting.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          {selectedMeeting.link}
                        </a>
                      </div>
                      {selectedMeeting.status === 'scheduled' && (
                        <Button 
                          className={`w-full mt-3 ${getPlatformColor(selectedMeeting.platform)}`}
                          onClick={() => window.open(selectedMeeting.link, '_blank')}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Attendees ({selectedMeeting.attendees.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[200px] overflow-y-auto">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 py-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-blue-100 text-blue-800">
                              {selectedMeeting.organizer.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{selectedMeeting.organizer.name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              {selectedMeeting.organizer.role}
                              <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4">
                                Organizer
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {selectedMeeting.attendees
                          .filter(a => a.id !== selectedMeeting.organizer.id)
                          .map(attendee => (
                            <div key={attendee.id} className="flex items-center gap-2 py-1">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-sm font-medium">{attendee.name}</div>
                                <div className="text-xs text-muted-foreground">{attendee.role}</div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </CardContent>
                  </Card>
                  
                  {selectedMeeting.status === 'completed' && selectedMeeting.recording && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Recording</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-3 rounded-md">
                            <div className="flex items-center gap-2 mb-2">
                              <Play className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Meeting Recording</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(selectedMeeting.recording.date)}</span>
                              <span>·</span>
                              <span>{formatDuration(selectedMeeting.recording.duration)}</span>
                              <span>·</span>
                              <span>{selectedMeeting.recording.fileSize}</span>
                            </div>
                            <div className="flex justify-between mt-3">
                              <Button variant="outline" size="sm" className="gap-1">
                                <Play className="h-3 w-3" />
                                Play
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            </div>
                          </div>
                          
                          {selectedMeeting.recording.processingStatus === 'processing' && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <RefreshCw className="h-3 w-3 animate-spin" />
                              <span>Processing recording and generating transcript...</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex justify-between gap-2 border-t pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsMeetingDetailsOpen(false)}>
                    Close
                  </Button>
                </div>
                <div className="flex gap-2">
                  {selectedMeeting.status === 'scheduled' && (
                    <>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className={`gap-1 ${getPlatformColor(selectedMeeting.platform)}`}>
                        <Calendar className="h-4 w-4" />
                        Add to Calendar
                      </Button>
                    </>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Transcript Dialog */}
      <Dialog open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Meeting Transcript</DialogTitle>
            <DialogDescription>
              {selectedTranscript && mockMeetings.find(m => m.id === selectedTranscript)?.title}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTranscript && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(mockMeetings.find(m => m.id === selectedTranscript)?.date || '')}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(mockMeetings.find(m => m.id === selectedTranscript)?.duration || 0)}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <div className="flex items-center justify-between p-3 bg-muted">
                  <div className="text-sm font-medium">Meeting Transcript</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">Text</Button>
                    <Button variant="ghost" size="sm">Speaker</Button>
                    <Button variant="ghost" size="sm">Timeline</Button>
                  </div>
                </div>
                
                <div className="p-4 space-y-6 max-h-[500px] overflow-y-auto">
                  {getMeetingTranscript(selectedTranscript).map(segment => (
                    <div key={segment.id} className="flex gap-3">
                      <div className="text-xs text-muted-foreground w-12 pt-1 flex-shrink-0">
                        {formatTimestamp(segment.startTime)}
                      </div>
                      <div>
                        <div className="text-sm font-medium mb-1">{segment.speaker}</div>
                        <div className="text-sm">{segment.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Transcript is machine-generated and may contain errors.</span>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTranscriptOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MeetingIntegration;