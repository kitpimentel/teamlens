import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { format, isToday, isYesterday } from "date-fns"
import { 
  Search, 
  Users, 
  UserPlus,
  Settings, 
  Plus, 
  PlusCircle,
  Send, 
  MoreHorizontal, 
  Paperclip, 
  Smile, 
  Image,
  File,
  Mic,
  Video,
  LucideIcon,
  Pin,
  Star,
  Bell,
  BellOff,
  Phone,
  Hash,
  Lock,
  Globe,
  Info,
  Reply,
  Trash2,
  Edit,
  CheckCircle,
  Mail,
  AtSign,
} from "lucide-react"

/**
 * Chat page for Team Members
 */
function Chat() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [message, setMessage] = useState("")
  const [contacts, setContacts] = useState<any[]>([])
  const [groups, setGroups] = useState<any[]>([])
  const [openNewChatDialog, setOpenNewChatDialog] = useState(false)
  const [openNewGroupDialog, setOpenNewGroupDialog] = useState(false)
  const [chatMessages, setChatMessages] = useState<Record<string, any[]>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  
  // Fetch chat data
  useEffect(() => {
    const fetchChatData = async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock contacts data
      const mockContacts = [
        {
          id: "contact-1",
          name: "Jane Smith",
          avatar: "",
          role: "Project Manager",
          organization: "Internal",
          status: "online",
          lastActive: new Date().toISOString(),
          unreadCount: 2,
          lastMessage: "Can we discuss the project timeline?",
          lastMessageTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
          isFavorite: true,
        },
        {
          id: "contact-2",
          name: "Robert Johnson",
          avatar: "",
          role: "Frontend Developer",
          organization: "Internal",
          status: "online",
          lastActive: new Date().toISOString(),
          unreadCount: 0,
          lastMessage: "I've pushed the latest changes to the repo",
          lastMessageTime: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
          isFavorite: false,
        },
        {
          id: "contact-3",
          name: "Emily Davis",
          avatar: "",
          role: "Backend Developer",
          organization: "Internal",
          status: "away",
          lastActive: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
          unreadCount: 0,
          lastMessage: "The API integration is almost complete",
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
          isFavorite: false,
        },
        {
          id: "contact-4",
          name: "Michael Brown",
          avatar: "",
          role: "QA Engineer",
          organization: "Internal",
          status: "offline",
          lastActive: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
          unreadCount: 0,
          lastMessage: "Found a few bugs in the latest build",
          lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
          isFavorite: false,
        },
        {
          id: "contact-5",
          name: "Sarah Wilson",
          avatar: "",
          role: "Content Strategist",
          organization: "Internal",
          status: "online",
          lastActive: new Date().toISOString(),
          unreadCount: 3,
          lastMessage: "I need help with the content for the homepage",
          lastMessageTime: new Date(Date.now() - 50 * 60000).toISOString(), // 50 minutes ago
          isFavorite: true,
        },
        {
          id: "contact-6",
          name: "David Miller",
          avatar: "",
          role: "DevOps Engineer",
          organization: "Internal",
          status: "offline",
          lastActive: new Date(Date.now() - 12 * 60 * 60000).toISOString(), // 12 hours ago
          unreadCount: 0,
          lastMessage: "The deployment pipeline is set up",
          lastMessageTime: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), // 2 days ago
          isFavorite: false,
        },
        {
          id: "contact-7",
          name: "Karen Thompson",
          avatar: "",
          role: "Account Manager",
          organization: "Acme Corporation",
          status: "online",
          lastActive: new Date().toISOString(),
          unreadCount: 0,
          lastMessage: "The client is happy with the progress",
          lastMessageTime: new Date(Date.now() - 4 * 60 * 60000).toISOString(), // 4 hours ago
          isFavorite: true,
          isClient: true,
        },
      ]
      
      // Mock groups data
      const mockGroups = [
        {
          id: "group-1",
          name: "Website Redesign Team",
          avatar: "",
          members: [
            { id: "user-1", name: "John Doe" },
            { id: "contact-1", name: "Jane Smith" },
            { id: "contact-2", name: "Robert Johnson" },
            { id: "contact-3", name: "Emily Davis" },
          ],
          unreadCount: 5,
          lastMessage: "John: I've updated the design files",
          lastMessageTime: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
          isPublic: true,
        },
        {
          id: "group-2",
          name: "Mobile App Development",
          avatar: "",
          members: [
            { id: "user-1", name: "John Doe" },
            { id: "contact-1", name: "Jane Smith" },
            { id: "contact-2", name: "Robert Johnson" },
            { id: "contact-4", name: "Michael Brown" },
          ],
          unreadCount: 0,
          lastMessage: "Jane: Let's schedule a meeting to discuss the roadmap",
          lastMessageTime: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
          isPublic: false,
        },
        {
          id: "group-3",
          name: "Project Management",
          avatar: "",
          members: [
            { id: "user-1", name: "John Doe" },
            { id: "contact-1", name: "Jane Smith" },
            { id: "contact-5", name: "Sarah Wilson" },
            { id: "contact-7", name: "Karen Thompson" },
          ],
          unreadCount: 0,
          lastMessage: "Karen: We need to discuss the upcoming deadline",
          lastMessageTime: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString(), // 1 day ago
          isPublic: false,
        },
      ]
      
      // Mock messages for each contact and group
      const mockMessages: Record<string, any[]> = {
        "contact-1": [
          {
            id: "msg-1-1",
            sender: { id: "contact-1", name: "Jane Smith", avatar: "" },
            text: "Hey, can we discuss the project timeline?",
            timestamp: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
            isRead: true,
          },
          {
            id: "msg-1-2",
            sender: { id: "user-1", name: "John Doe", avatar: "" },
            text: "Sure, what aspects do you want to go over?",
            timestamp: new Date(Date.now() - 18 * 60000).toISOString(), // 18 minutes ago
            isRead: true,
          },
          {
            id: "msg-1-3",
            sender: { id: "contact-1", name: "Jane Smith", avatar: "" },
            text: "I'm concerned about the design phase. It seems like we're falling behind.",
            timestamp: new Date(Date.now() - 16 * 60000).toISOString(), // 16 minutes ago
            isRead: true,
          },
          {
            id: "msg-1-4",
            sender: { id: "contact-1", name: "Jane Smith", avatar: "" },
            text: "Do you think we need to adjust the deadlines?",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
            isRead: false,
          },
        ],
        "contact-2": [
          {
            id: "msg-2-1",
            sender: { id: "contact-2", name: "Robert Johnson", avatar: "" },
            text: "I've pushed the latest changes to the repo",
            timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
            isRead: true,
          },
          {
            id: "msg-2-2",
            sender: { id: "user-1", name: "John Doe", avatar: "" },
            text: "Great! I'll take a look at it right away.",
            timestamp: new Date(Date.now() - 44 * 60000).toISOString(), // 44 minutes ago
            isRead: true,
          },
        ],
        "contact-3": [
          {
            id: "msg-3-1",
            sender: { id: "contact-3", name: "Emily Davis", avatar: "" },
            text: "The API integration is almost complete",
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
            isRead: true,
          },
          {
            id: "msg-3-2",
            sender: { id: "user-1", name: "John Doe", avatar: "" },
            text: "That's awesome progress! Let me know when it's ready for testing.",
            timestamp: new Date(Date.now() - 1.9 * 60 * 60000).toISOString(), // 1.9 hours ago
            isRead: true,
          },
        ],
        "contact-5": [
          {
            id: "msg-5-1",
            sender: { id: "contact-5", name: "Sarah Wilson", avatar: "" },
            text: "I need help with the content for the homepage",
            timestamp: new Date(Date.now() - 55 * 60000).toISOString(), // 55 minutes ago
            isRead: true,
          },
          {
            id: "msg-5-2",
            sender: { id: "user-1", name: "John Doe", avatar: "" },
            text: "What kind of help do you need?",
            timestamp: new Date(Date.now() - 53 * 60000).toISOString(), // 53 minutes ago
            isRead: true,
          },
          {
            id: "msg-5-3",
            sender: { id: "contact-5", name: "Sarah Wilson", avatar: "" },
            text: "I'm not sure about the tone and messaging. Can we brainstorm together?",
            timestamp: new Date(Date.now() - 52 * 60000).toISOString(), // 52 minutes ago
            isRead: true,
          },
          {
            id: "msg-5-4",
            sender: { id: "contact-5", name: "Sarah Wilson", avatar: "" },
            text: "I've attached the current draft",
            timestamp: new Date(Date.now() - 51 * 60000).toISOString(), // 51 minutes ago
            isRead: true,
            attachments: [
              {
                id: "attach-1",
                name: "homepage-content-draft.docx",
                type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                size: "235 KB",
                url: "#",
              },
            ],
          },
          {
            id: "msg-5-5",
            sender: { id: "contact-5", name: "Sarah Wilson", avatar: "" },
            text: "Can you review it by EOD?",
            timestamp: new Date(Date.now() - 50 * 60000).toISOString(), // 50 minutes ago
            isRead: false,
          },
        ],
        "group-1": [
          {
            id: "grp-msg-1-1",
            sender: { id: "contact-1", name: "Jane Smith", avatar: "" },
            text: "Let's discuss the navigation layout",
            timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
            isRead: true,
          },
          {
            id: "grp-msg-1-2",
            sender: { id: "contact-2", name: "Robert Johnson", avatar: "" },
            text: "I think we should go with a horizontal navigation for desktop and a hamburger menu for mobile",
            timestamp: new Date(Date.now() - 1.9 * 60 * 60000).toISOString(), // 1.9 hours ago
            isRead: true,
          },
          {
            id: "grp-msg-1-3",
            sender: { id: "contact-3", name: "Emily Davis", avatar: "" },
            text: "That makes sense. We should also consider how to handle dropdown menus.",
            timestamp: new Date(Date.now() - 1.8 * 60 * 60000).toISOString(), // 1.8 hours ago
            isRead: true,
          },
          {
            id: "grp-msg-1-4",
            sender: { id: "user-1", name: "John Doe", avatar: "" },
            text: "I've created some mockups for both options",
            timestamp: new Date(Date.now() - 1.7 * 60 * 60000).toISOString(), // 1.7 hours ago
            isRead: true,
            attachments: [
              {
                id: "attach-grp-1",
                name: "navigation-mockups.png",
                type: "image/png",
                size: "1.2 MB",
                url: "#",
              },
            ],
          },
          {
            id: "grp-msg-1-5",
            sender: { id: "user-1", name: "John Doe", avatar: "" },
            text: "I've updated the design files",
            timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
            isRead: false,
          },
        ],
      }
      
      setContacts(mockContacts)
      setGroups(mockGroups)
      setChatMessages(mockMessages)
      
      // Set default active chat to the first contact
      if (mockContacts.length > 0) {
        setActiveChat(mockContacts[0].id)
      }
      
      setIsLoading(false)
    }
    
    fetchChatData()
  }, [])
  
  // Scroll to bottom when messages change or active chat changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages, activeChat])
  
  /**
   * Get initials from name for avatar fallback
   */
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length === 1) return names[0].charAt(0).toUpperCase()
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }
  
  /**
   * Format timestamp for display in message list
   */
  const formatMessageTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    
    if (isToday(date)) {
      return format(date, 'h:mm a')
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'MMM d')
    }
  }
  
  /**
   * Format timestamp for display in message bubble
   */
  const formatChatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return format(date, 'h:mm a')
  }
  
  /**
   * Group messages by date
   */
  const groupMessagesByDate = (messages: any[]) => {
    if (!messages) return []
    
    const grouped: Record<string, any[]> = {}
    
    messages.forEach(message => {
      const date = new Date(message.timestamp)
      const dateKey = format(date, 'yyyy-MM-dd')
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      
      grouped[dateKey].push(message)
    })
    
    // Convert to array and sort by date
    return Object.entries(grouped)
      .map(([date, messages]) => ({
        date,
        displayDate: formatDateHeading(date),
        messages,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }
  
  /**
   * Format date heading for message groups
   */
  const formatDateHeading = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    
    if (isToday(date)) {
      return 'Today'
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'EEEE, MMMM d, yyyy')
    }
  }
  
  /**
   * Handle message send
   */
  const handleSendMessage = () => {
    if (!message.trim() || !activeChat) return
    
    // Create new message
    const newMessage = {
      id: `new-msg-${Date.now()}`,
      sender: { id: "user-1", name: "John Doe", avatar: "" },
      text: message,
      timestamp: new Date().toISOString(),
      isRead: true,
    }
    
    // Update chat messages
    setChatMessages(prev => {
      const updated = { ...prev }
      if (!updated[activeChat]) {
        updated[activeChat] = []
      }
      updated[activeChat] = [...updated[activeChat], newMessage]
      return updated
    })
    
    // Update last message in contacts or groups
    const isGroup = activeChat.startsWith('group-')
    
    if (isGroup) {
      setGroups(prev => prev.map(group => 
        group.id === activeChat 
          ? { 
              ...group, 
              lastMessage: `You: ${message}`, 
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0 
            } 
          : group
      ))
    } else {
      setContacts(prev => prev.map(contact => 
        contact.id === activeChat 
          ? { 
              ...contact, 
              lastMessage: message, 
              lastMessageTime: new Date().toISOString(),
              unreadCount: 0 
            } 
          : contact
      ))
    }
    
    // Clear message input
    setMessage("")
    
    // Show success toast
    toast({
      description: "Message sent",
      duration: 1000,
    })
  }
  
  /**
   * Handle opening a chat
   */
  const handleOpenChat = (chatId: string) => {
    setActiveChat(chatId)
    
    // Mark as read
    const isGroup = chatId.startsWith('group-')
    
    if (isGroup) {
      setGroups(prev => prev.map(group => 
        group.id === chatId 
          ? { ...group, unreadCount: 0 } 
          : group
      ))
    } else {
      setContacts(prev => prev.map(contact => 
        contact.id === chatId 
          ? { ...contact, unreadCount: 0 } 
          : contact
      ))
    }
  }
  
  /**
   * Get active chat data
   */
  const getActiveChatData = () => {
    if (!activeChat) return null
    
    const isGroup = activeChat.startsWith('group-')
    return isGroup 
      ? groups.find(group => group.id === activeChat) 
      : contacts.find(contact => contact.id === activeChat)
  }
  
  /**
   * Filter contacts and groups based on search term
   */
  const filteredContacts = searchTerm 
    ? contacts.filter(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    : contacts
  
  const filteredGroups = searchTerm 
    ? groups.filter(group => group.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    : groups
  
  /**
   * Get status indicator classes
   */
  const getStatusIndicatorClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'busy':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  /**
   * Render message file attachment
   */
  const renderFileAttachment = (attachment: any) => {
    const isImage = attachment.type.startsWith('image/')
    
    if (isImage) {
      return (
        <div className="mt-2 mb-1 rounded-md border overflow-hidden max-w-[240px]">
          <div className="relative">
            <div className="h-32 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <Image className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Button variant="secondary" size="sm">
                View Image
              </Button>
            </div>
          </div>
          <div className="p-2 bg-muted text-xs flex justify-between items-center">
            <div className="truncate">{attachment.name}</div>
            <span>{attachment.size}</span>
          </div>
        </div>
      )
    }
    
    return (
      <div className="mt-2 mb-1 rounded-md border overflow-hidden max-w-[240px]">
        <div className="p-3 flex items-center gap-3">
          <div className="p-2 bg-muted rounded-md">
            <File className="h-5 w-5" />
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium truncate">{attachment.name}</div>
            <div className="text-xs text-muted-foreground">{attachment.size}</div>
          </div>
        </div>
        <div className="p-2 bg-muted flex justify-end">
          <Button variant="secondary" size="sm" className="h-7 text-xs px-2">
            Download
          </Button>
        </div>
      </div>
    )
  }
  
  // Get active chat data
  const activeChatData = getActiveChatData()
  
  return (
    <div className="h-[calc(100vh-9rem)] flex flex-col">
      <div className="mb-4">
        <h2 className="text-3xl font-bold tracking-tight">Team Chat</h2>
        <p className="text-muted-foreground">
          Communicate with your team and clients in real-time
        </p>
      </div>
      
      <Card className="flex flex-col flex-1 min-h-0">
        <div className="flex flex-1 min-h-0">
          {/* Sidebar */}
          <div className="w-80 border-r flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Messages</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setOpenNewChatDialog(true)}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      New Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenNewGroupDialog(true)}>
                      <Users className="h-4 w-4 mr-2" />
                      New Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="recent" className="flex-1 flex flex-col min-h-0">
              <div className="border-b px-4">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent border-b-0">
                  <TabsTrigger 
                    value="recent" 
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent"
                  >
                    Recent
                  </TabsTrigger>
                  <TabsTrigger 
                    value="direct" 
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent"
                  >
                    Direct
                  </TabsTrigger>
                  <TabsTrigger 
                    value="groups" 
                    className="px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none data-[state=active]:bg-transparent"
                  >
                    Groups
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <ScrollArea className="flex-1">
                <TabsContent value="recent" className="m-0 p-0 h-full">
                  <div className="p-2 space-y-1">
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <div key={index} className="p-2 flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {/* Pinned/favorited contacts first */}
                        {contacts.filter(c => c.isFavorite).map(contact => (
                          <button
                            key={contact.id}
                            className={cn(
                              "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                              activeChat === contact.id && "bg-muted"
                            )}
                            onClick={() => handleOpenChat(contact.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={contact.avatar} alt={contact.name} />
                                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                  getStatusIndicatorClass(contact.status)
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {contact.name}
                                    {contact.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                                    {contact.isClient && <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">Client</Badge>}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMessageTimestamp(contact.lastMessageTime)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-muted-foreground truncate">
                                    {contact.lastMessage}
                                  </div>
                                  {contact.unreadCount > 0 && (
                                    <div className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                      {contact.unreadCount}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Pinned/favorited groups */}
                        {groups.filter(g => g.unreadCount > 0).map(group => (
                          <button
                            key={group.id}
                            className={cn(
                              "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                              activeChat === group.id && "bg-muted"
                            )}
                            onClick={() => handleOpenChat(group.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={group.avatar} alt={group.name} />
                                  <AvatarFallback>
                                    {group.isPublic ? <Hash className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {group.name}
                                    {group.isPublic ? 
                                      <Globe className="h-3 w-3 text-muted-foreground" /> : 
                                      <Lock className="h-3 w-3 text-muted-foreground" />
                                    }
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMessageTimestamp(group.lastMessageTime)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-muted-foreground truncate">
                                    {group.lastMessage}
                                  </div>
                                  {group.unreadCount > 0 && (
                                    <div className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                      {group.unreadCount}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Other contacts with unread messages */}
                        {contacts.filter(c => !c.isFavorite && c.unreadCount > 0).map(contact => (
                          <button
                            key={contact.id}
                            className={cn(
                              "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                              activeChat === contact.id && "bg-muted"
                            )}
                            onClick={() => handleOpenChat(contact.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={contact.avatar} alt={contact.name} />
                                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                  getStatusIndicatorClass(contact.status)
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {contact.name}
                                    {contact.isClient && <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">Client</Badge>}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMessageTimestamp(contact.lastMessageTime)}
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="text-sm text-muted-foreground truncate">
                                    {contact.lastMessage}
                                  </div>
                                  {contact.unreadCount > 0 && (
                                    <div className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                      {contact.unreadCount}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Recent communications */}
                        {contacts.filter(c => !c.isFavorite && c.unreadCount === 0).map(contact => (
                          <button
                            key={contact.id}
                            className={cn(
                              "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                              activeChat === contact.id && "bg-muted"
                            )}
                            onClick={() => handleOpenChat(contact.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={contact.avatar} alt={contact.name} />
                                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                  getStatusIndicatorClass(contact.status)
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {contact.name}
                                    {contact.isClient && <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">Client</Badge>}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMessageTimestamp(contact.lastMessageTime)}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {contact.lastMessage}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        {/* Groups without unread messages */}
                        {groups.filter(g => g.unreadCount === 0).map(group => (
                          <button
                            key={group.id}
                            className={cn(
                              "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                              activeChat === group.id && "bg-muted"
                            )}
                            onClick={() => handleOpenChat(group.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={group.avatar} alt={group.name} />
                                  <AvatarFallback>
                                    {group.isPublic ? <Hash className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {group.name}
                                    {group.isPublic ? 
                                      <Globe className="h-3 w-3 text-muted-foreground" /> : 
                                      <Lock className="h-3 w-3 text-muted-foreground" />
                                    }
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatMessageTimestamp(group.lastMessageTime)}
                                  </div>
                                </div>
                                <div className="text-sm text-muted-foreground truncate">
                                  {group.lastMessage}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="direct" className="m-0 p-0 h-full">
                  <div className="p-2 space-y-1">
                    {isLoading ? (
                      Array(5).fill(0).map((_, index) => (
                        <div key={index} className="p-2 flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-24 mb-1" />
                            <Skeleton className="h-3 w-40" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        {filteredContacts.map(contact => (
                          <button
                            key={contact.id}
                            className={cn(
                              "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                              activeChat === contact.id && "bg-muted"
                            )}
                            onClick={() => handleOpenChat(contact.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={contact.avatar} alt={contact.name} />
                                  <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                                  getStatusIndicatorClass(contact.status)
                                )} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium truncate flex items-center gap-1">
                                    {contact.name}
                                    {contact.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                                    {contact.isClient && <Badge variant="outline" className="ml-1 text-[10px] h-4 px-1">Client</Badge>}
                                  </div>
                                  {contact.unreadCount > 0 && (
                                    <div className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                      {contact.unreadCount}
                                    </div>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {contact.role} • {contact.organization}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="groups" className="m-0 p-0 h-full">
                  <div className="p-2 space-y-1">
                    {isLoading ? (
                      Array(3).fill(0).map((_, index) => (
                        <div key={index} className="p-2 flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      ))
                    ) : filteredGroups.length === 0 ? (
                      <div className="p-6 text-center text-muted-foreground">
                        {searchTerm ? "No groups match your search" : "No groups yet"}
                      </div>
                    ) : (
                      filteredGroups.map(group => (
                        <button
                          key={group.id}
                          className={cn(
                            "w-full text-left px-2 py-3 rounded-md hover:bg-muted transition-colors",
                            activeChat === group.id && "bg-muted"
                          )}
                          onClick={() => handleOpenChat(group.id)}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={group.avatar} alt={group.name} />
                              <AvatarFallback>
                                {group.isPublic ? <Hash className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="font-medium truncate flex items-center gap-1">
                                  {group.name}
                                  {group.isPublic ? 
                                    <Globe className="h-3 w-3 text-muted-foreground" /> : 
                                    <Lock className="h-3 w-3 text-muted-foreground" />
                                  }
                                </div>
                                {group.unreadCount > 0 && (
                                  <div className="ml-2 bg-primary text-primary-foreground text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                    {group.unreadCount}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {group.members.length} members
                              </div>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
          
          {/* Chat area */}
          <div className="flex-1 flex flex-col min-h-0">
            {!activeChatData ? (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activeChatData.avatar} alt={activeChatData.name} />
                      <AvatarFallback>
                        {activeChat?.startsWith('group') 
                          ? (activeChatData.isPublic ? <Hash className="h-4 w-4" /> : <Lock className="h-4 w-4" />)
                          : getInitials(activeChatData.name)
                        }
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium leading-none flex items-center gap-1">
                        {activeChatData.name}
                        {!activeChat?.startsWith('group') && activeChatData.status && (
                          <span className={cn(
                            "inline-block h-2 w-2 rounded-full ml-1",
                            getStatusIndicatorClass(activeChatData.status)
                          )} />
                        )}
                        {activeChatData.isClient && <Badge variant="outline" className="ml-1 text-xs h-5 px-1">Client</Badge>}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {activeChat?.startsWith('group')
                          ? `${activeChatData.members.length} members`
                          : activeChatData.status === 'online' 
                            ? 'Online' 
                            : activeChatData.status === 'away' 
                            ? 'Away'
                            : 'Offline'
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pin className="mr-2 h-4 w-4" />
                          Pin Conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Mute Notifications
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Chat Settings
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {/* Chat messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-6">
                    {isLoading ? (
                      <div className="space-y-4">
                        {Array(5).fill(0).map((_, i) => (
                          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                            <div className="flex gap-3 max-w-[80%]">
                              {i % 2 === 0 && <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />}
                              <div>
                                <Skeleton className={`h-20 ${i % 2 === 0 ? 'w-64' : 'w-48'} rounded-lg`} />
                                <Skeleton className="h-3 w-16 mt-1" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : !chatMessages[activeChat] || chatMessages[activeChat].length === 0 ? (
                      <div className="text-center py-10 text-muted-foreground">
                        No messages yet. Send a message to start the conversation.
                      </div>
                    ) : (
                      groupMessagesByDate(chatMessages[activeChat]).map(group => (
                        <div key={group.date} className="space-y-3">
                          <div className="relative flex items-center justify-center">
                            <Separator className="absolute w-full" />
                            <span className="relative bg-background px-2 text-xs text-muted-foreground">
                              {group.displayDate}
                            </span>
                          </div>
                          
                          {group.messages.map(message => {
                            const isCurrentUser = message.sender.id === "user-1"
                            
                            return (
                              <div 
                                key={message.id} 
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className="flex gap-3 max-w-[80%]">
                                  {!isCurrentUser && (
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                                      <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                                    </Avatar>
                                  )}
                                  
                                  <div>
                                    {!isCurrentUser && activeChat?.startsWith('group') && (
                                      <p className="text-xs font-medium mb-1">{message.sender.name}</p>
                                    )}
                                    
                                    <div 
                                      className={cn(
                                        "p-3 rounded-lg text-sm",
                                        isCurrentUser 
                                          ? "bg-primary text-primary-foreground" 
                                          : "bg-muted"
                                      )}
                                    >
                                      {message.text}
                                      
                                      {message.attachments && message.attachments.map(attachment => (
                                        <div key={attachment.id}>
                                          {renderFileAttachment(attachment)}
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="flex items-center mt-1 text-xs">
                                      <span className={isCurrentUser ? "text-muted-foreground" : "text-muted-foreground"}>
                                        {formatChatTimestamp(message.timestamp)}
                                      </span>
                                      
                                      {isCurrentUser && message.isRead && (
                                        <CheckCircle className="h-3 w-3 ml-1 text-primary" />
                                      )}
                                      
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 ml-1 opacity-0 group-hover:opacity-100"
                                          >
                                            <MoreHorizontal className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                                          <DropdownMenuItem>
                                            <Reply className="mr-2 h-4 w-4" />
                                            Reply
                                          </DropdownMenuItem>
                                          {isCurrentUser && (
                                            <DropdownMenuItem>
                                              <Edit className="mr-2 h-4 w-4" />
                                              Edit
                                            </DropdownMenuItem>
                                          )}
                                          <DropdownMenuItem>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Chat input */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem>
                          <Image className="mr-2 h-4 w-4" />
                          Upload Image
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <File className="mr-2 h-4 w-4" />
                          Upload File
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <AtSign className="mr-2 h-4 w-4" />
                          Mention
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
      
      {/* New chat dialog */}
      <Dialog open={openNewChatDialog} onOpenChange={setOpenNewChatDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Chat</DialogTitle>
            <DialogDescription>
              Start a new conversation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members or clients..."
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Suggested</h4>
              {contacts.slice(0, 5).map(contact => (
                <button
                  key={contact.id}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => {
                    handleOpenChat(contact.id)
                    setOpenNewChatDialog(false)
                  }}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewChatDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* New group dialog */}
      <Dialog open={openNewGroupDialog} onOpenChange={setOpenNewGroupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Group</DialogTitle>
            <DialogDescription>
              Create a new group conversation
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="groupName">Group Name</Label>
              <Input id="groupName" placeholder="Enter group name" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Add Members</Label>
                <span className="text-xs text-muted-foreground">0 selected</span>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search team members..."
                  className="pl-8"
                />
              </div>
              <div className="space-y-2 border rounded-md p-2 h-48 overflow-y-auto">
                {contacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                  >
                    <Checkbox id={`contact-${contact.id}`} />
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                      <Label htmlFor={`contact-${contact.id}`} className="flex-1 cursor-pointer">
                        {contact.name}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="groupType">Group Type</Label>
              <Select defaultValue="private">
                <SelectTrigger>
                  <SelectValue placeholder="Select a type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">Private Group</SelectItem>
                  <SelectItem value="public">Public Group</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Private groups are only visible to invited members
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenNewGroupDialog(false)}>
              Cancel
            </Button>
            <Button>
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Chat