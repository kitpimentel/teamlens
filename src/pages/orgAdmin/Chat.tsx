import { useState, useEffect, useRef } from "react"
import { 
  Send, 
  Paperclip, 
  Search, 
  MoreVertical, 
  Phone, 
  Video, 
  X, 
  MessageSquare,
  Pin,
  Users,
  Info,
  Image as ImageIcon,
  FilePlus,
  PlusCircle,
  AtSign
} from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

/**
 * Types for chat functionality
 */
interface User {
  id: string
  name: string
  email: string
  role: 'superAdmin' | 'orgAdmin' | 'teamMember' | 'client'
  avatar?: string
  status?: 'online' | 'away' | 'offline'
  lastActive?: string
}

interface Chat {
  id: string
  type: 'direct' | 'group' | 'project'
  name?: string
  participants: User[]
  lastMessage?: Message
  unreadCount: number
  pinned?: boolean
  projectId?: string
}

interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: string
  attachments?: Attachment[]
  readBy: string[]
  reaction?: { emoji: string, users: string[] }[]
}

interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size: number
}

/**
 * OrgChat component for Organization Admin chat functionality
 */
const OrgChat = () => {
  // Auth context for current user
  const { user } = useAuth()
  
  // Refs
  const messageEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // State
  const [chatList, setChatList] = useState<Chat[]>([])
  const [activeChat, setActiveChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [typingIndicator, setTypingIndicator] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  
  // Schema for new message form
  const newMessageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
  })
  
  const messageForm = useForm<z.infer<typeof newMessageSchema>>({
    resolver: zodResolver(newMessageSchema),
    defaultValues: {
      message: "",
    },
  })
  
  // Schema for new chat form
  const newChatSchema = z.object({
    chatType: z.enum(["direct", "group", "project"]),
    participants: z.array(z.string()).min(1, "Select at least one participant"),
    name: z.string().optional(),
    projectId: z.string().optional(),
  })
  
  const newChatForm = useForm<z.infer<typeof newChatSchema>>({
    resolver: zodResolver(newChatSchema),
    defaultValues: {
      chatType: "direct",
      participants: [],
      name: "",
      projectId: "",
    },
  })

  // Mock data for users, chats, and messages
  const mockUsers: User[] = [
    {
      id: "u1",
      name: "John Doe",
      email: "john@example.com",
      role: "teamMember",
      avatar: "https://ui-avatars.com/api/?name=John+Doe&background=10b981&color=fff",
      status: "online"
    },
    {
      id: "u2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "teamMember",
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
      status: "online"
    },
    {
      id: "u3",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "teamMember",
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=10b981&color=fff",
      status: "away",
      lastActive: "2025-03-29T10:30:00Z"
    },
    {
      id: "u4",
      name: "Sarah Brown",
      email: "sarah@example.com",
      role: "teamMember",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Brown&background=10b981&color=fff",
      status: "offline",
      lastActive: "2025-03-28T15:45:00Z"
    },
    {
      id: "c1",
      name: "Client Company",
      email: "client@example.com",
      role: "client",
      avatar: "https://ui-avatars.com/api/?name=Client+Company&background=fb923c&color=fff",
      status: "online"
    }
  ]
  
  const mockChats: Chat[] = [
    {
      id: "chat1",
      type: "direct",
      participants: [mockUsers[0]],
      lastMessage: {
        id: "msg1",
        chatId: "chat1",
        senderId: "u1",
        content: "Hey, how's the website redesign coming along?",
        timestamp: "2025-03-29T11:30:00Z",
        readBy: ["u1"]
      },
      unreadCount: 1,
      pinned: true
    },
    {
      id: "chat2",
      type: "direct",
      participants: [mockUsers[1]],
      lastMessage: {
        id: "msg2",
        chatId: "chat2",
        senderId: "oa-1",
        content: "I've shared the updated requirements doc with you.",
        timestamp: "2025-03-29T10:15:00Z",
        readBy: ["oa-1", "u2"]
      },
      unreadCount: 0
    },
    {
      id: "chat3",
      type: "group",
      name: "Design Team",
      participants: [mockUsers[0], mockUsers[1], mockUsers[3]],
      lastMessage: {
        id: "msg3",
        chatId: "chat3",
        senderId: "u3",
        content: "Let's finalize the mockups by EOD.",
        timestamp: "2025-03-29T09:45:00Z",
        readBy: ["u3", "oa-1"]
      },
      unreadCount: 0
    },
    {
      id: "chat4",
      type: "project",
      name: "Website Redesign",
      participants: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[4]],
      projectId: "proj-1",
      lastMessage: {
        id: "msg4",
        chatId: "chat4",
        senderId: "c1",
        content: "The latest designs look great! Just a few minor tweaks needed.",
        timestamp: "2025-03-28T16:20:00Z",
        readBy: ["c1", "oa-1", "u1"]
      },
      unreadCount: 0
    }
  ]
  
  const mockMessages: { [key: string]: Message[] } = {
    "chat1": [
      {
        id: "chat1-msg1",
        chatId: "chat1",
        senderId: "oa-1",
        content: "Hi John, do you have the latest updates on the frontend development?",
        timestamp: "2025-03-29T11:15:00Z",
        readBy: ["oa-1", "u1"]
      },
      {
        id: "chat1-msg2",
        chatId: "chat1",
        senderId: "u1",
        content: "Hey, yes! I'm working on implementing the new design system. Should be done by tomorrow.",
        timestamp: "2025-03-29T11:20:00Z",
        readBy: ["oa-1", "u1"]
      },
      {
        id: "chat1-msg3",
        chatId: "chat1",
        senderId: "oa-1",
        content: "Great! Any blockers I should know about?",
        timestamp: "2025-03-29T11:22:00Z",
        readBy: ["oa-1", "u1"]
      },
      {
        id: "chat1-msg4",
        chatId: "chat1",
        senderId: "u1",
        content: "Nothing major. Just need to finalize how we handle responsive layouts for the dashboard.",
        timestamp: "2025-03-29T11:25:00Z",
        readBy: ["oa-1", "u1"]
      },
      {
        id: "chat1-msg5",
        chatId: "chat1",
        senderId: "u1",
        content: "Hey, how's the website redesign coming along?",
        timestamp: "2025-03-29T11:30:00Z",
        readBy: ["u1"]
      }
    ],
    "chat2": [
      {
        id: "chat2-msg1",
        chatId: "chat2",
        senderId: "u2",
        content: "Hi there! Do you have a moment to discuss the project timeline?",
        timestamp: "2025-03-29T10:00:00Z",
        readBy: ["oa-1", "u2"]
      },
      {
        id: "chat2-msg2",
        chatId: "chat2",
        senderId: "oa-1",
        content: "Sure, what's on your mind?",
        timestamp: "2025-03-29T10:05:00Z",
        readBy: ["oa-1", "u2"]
      },
      {
        id: "chat2-msg3",
        chatId: "chat2",
        senderId: "u2",
        content: "I think we might need to extend the deadline for the backend integration by a few days.",
        timestamp: "2025-03-29T10:10:00Z",
        readBy: ["oa-1", "u2"]
      },
      {
        id: "chat2-msg4",
        chatId: "chat2",
        senderId: "oa-1",
        content: "I've shared the updated requirements doc with you.",
        timestamp: "2025-03-29T10:15:00Z",
        readBy: ["oa-1", "u2"]
      }
    ],
    "chat3": [
      {
        id: "chat3-msg1",
        chatId: "chat3",
        senderId: "oa-1",
        content: "Hello design team! Let's sync up on the latest mockups.",
        timestamp: "2025-03-29T09:30:00Z",
        readBy: ["oa-1", "u1", "u2", "u4"]
      },
      {
        id: "chat3-msg2",
        chatId: "chat3",
        senderId: "u1",
        content: "I've completed the homepage redesign. Here's the link to the Figma file.",
        timestamp: "2025-03-29T09:35:00Z",
        readBy: ["oa-1", "u1", "u2", "u4"]
      },
      {
        id: "chat3-msg3",
        chatId: "chat3",
        senderId: "u4",
        content: "The user profile screens are almost done. Need feedback on the color palette.",
        timestamp: "2025-03-29T09:40:00Z",
        readBy: ["oa-1", "u1", "u4"]
      },
      {
        id: "chat3-msg4",
        chatId: "chat3",
        senderId: "u3",
        content: "Let's finalize the mockups by EOD.",
        timestamp: "2025-03-29T09:45:00Z",
        readBy: ["oa-1", "u3"]
      }
    ],
    "chat4": [
      {
        id: "chat4-msg1",
        chatId: "chat4",
        senderId: "oa-1",
        content: "Welcome to the Website Redesign project chat! We'll use this channel for all project-related discussions.",
        timestamp: "2025-03-28T14:00:00Z",
        readBy: ["oa-1", "u1", "u2", "u3", "c1"]
      },
      {
        id: "chat4-msg2",
        chatId: "chat4",
        senderId: "u1",
        content: "I've pushed the initial code structure to the repository. @Jane can you start on the component library?",
        timestamp: "2025-03-28T15:30:00Z",
        readBy: ["oa-1", "u1", "u2", "u3", "c1"]
      },
      {
        id: "chat4-msg3",
        chatId: "chat4",
        senderId: "u2",
        content: "Will do! I'll have the basic components ready by tomorrow.",
        timestamp: "2025-03-28T15:45:00Z",
        readBy: ["oa-1", "u1", "u2", "u3", "c1"]
      },
      {
        id: "chat4-msg4",
        chatId: "chat4",
        senderId: "oa-1",
        content: "Great progress, team! @Client Company Here are the latest design mockups for review.",
        timestamp: "2025-03-28T16:10:00Z",
        readBy: ["oa-1", "u1", "u2", "u3", "c1"]
      },
      {
        id: "chat4-msg5",
        chatId: "chat4",
        senderId: "c1",
        content: "The latest designs look great! Just a few minor tweaks needed.",
        timestamp: "2025-03-28T16:20:00Z",
        readBy: ["oa-1", "u1", "c1"]
      }
    ]
  }

  // Initialize chat data
  useEffect(() => {
    if (user) {
      setChatList(mockChats)
    }
  }, [user])
  
  // Set messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      setMessages(mockMessages[activeChat.id] || [])
      
      // Mark messages as read
      if (activeChat.unreadCount > 0) {
        setChatList(prev => 
          prev.map(chat => 
            chat.id === activeChat.id 
              ? { ...chat, unreadCount: 0 } 
              : chat
          )
        )
      }
      
      // Scroll to bottom of messages
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
      }, 100)
    }
  }, [activeChat])
  
  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * Handle sending a new message
   */
  const onSendMessage = (data: z.infer<typeof newMessageSchema>) => {
    if (!activeChat) return
    
    setIsLoading(true)
    
    // Create new message object
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.id,
      senderId: user?.id || "",
      content: data.message,
      timestamp: new Date().toISOString(),
      readBy: [user?.id || ""],
      attachments: selectedFiles.length > 0 
        ? selectedFiles.map(file => ({
            id: `attachment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            type: file.type,
            url: URL.createObjectURL(file),
            size: file.size
          }))
        : undefined
    }
    
    // Add message to current chat
    setMessages(prev => [...prev, newMessage])
    
    // Update last message in chat list
    setChatList(prev => 
      prev.map(chat => 
        chat.id === activeChat.id
          ? { ...chat, lastMessage: newMessage }
          : chat
      )
    )
    
    // Reset form and files
    messageForm.reset()
    setSelectedFiles([])
    setIsLoading(false)
    
    // Simulate typing response in direct chats
    if (activeChat.type === "direct") {
      const participant = activeChat.participants[0]
      setTypingIndicator(participant.name)
      
      setTimeout(() => {
        setTypingIndicator(null)
        
        // Add response after typing
        setTimeout(() => {
          const responseMessage: Message = {
            id: `msg-${Date.now()}-response`,
            chatId: activeChat.id,
            senderId: participant.id,
            content: getAutoResponse(data.message),
            timestamp: new Date().toISOString(),
            readBy: [participant.id]
          }
          
          setMessages(prev => [...prev, responseMessage])
          
          // Update last message in chat list
          setChatList(prev => 
            prev.map(chat => 
              chat.id === activeChat.id
                ? { 
                    ...chat, 
                    lastMessage: responseMessage,
                    unreadCount: chat.unreadCount + 1
                  }
                : chat
            )
          )
        }, 1000)
      }, 3000)
    }
  }

  /**
   * Generate an automatic response based on the message
   * Uses keywords in the message to provide more contextual responses
   */
  const getAutoResponse = (message: string): string => {
    // Common responses
    const defaultResponses = [
      "Got it, thanks for the update!",
      "I'll take a look at this right away.",
      "Sounds good to me.",
      "Thanks for letting me know.",
      "I'll get back to you on this soon."
    ]
    
    // Check for specific keywords to provide more contextual responses
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes("meeting") || lowerMessage.includes("call")) {
      return "Can we discuss this in our next meeting?"
    }
    
    if (lowerMessage.includes("progress") || lowerMessage.includes("update")) {
      return "Great progress! Keep it up."
    }
    
    if (lowerMessage.includes("question") || lowerMessage.includes("?")) {
      return "I have a few thoughts on this. Can we hop on a quick call?"
    }
    
    if (lowerMessage.includes("deadline") || lowerMessage.includes("timeline")) {
      return "I've made a note of the timeline. We'll need to adjust our sprint planning."
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "Let me check with the team and get back to you on how we can help."
    }
    
    // If no keywords match, return a random default response
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  /**
   * Handle file selection
   */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setSelectedFiles(prev => [...prev, ...filesArray])
    }
  }

  /**
   * Remove a selected file
   */
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  /**
   * Create a new chat
   */
  const createNewChat = (data: z.infer<typeof newChatSchema>) => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      // Get participants
      const chatParticipants = mockUsers.filter(user => 
        data.participants.includes(user.id)
      )
      
      // Create new chat
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        type: data.chatType,
        participants: chatParticipants,
        unreadCount: 0
      }
      
      // Add name for group and project chats
      if (data.chatType === "group" || data.chatType === "project") {
        newChat.name = data.name || `New ${data.chatType} chat`
      }
      
      // Add project ID for project chats
      if (data.chatType === "project" && data.projectId) {
        newChat.projectId = data.projectId
      }
      
      // Add to chat list
      setChatList(prev => [newChat, ...prev])
      
      // Select the new chat
      setActiveChat(newChat)
      
      // Reset form and close dialog
      newChatForm.reset()
      setShowNewChatDialog(false)
      setIsLoading(false)
      
      toast.success("New chat created successfully!")
    }, 1000)
  }

  /**
   * Pin/unpin a chat
   */
  const togglePinChat = (chatId: string) => {
    setChatList(prev => 
      prev.map(chat => 
        chat.id === chatId
          ? { ...chat, pinned: !chat.pinned }
          : chat
      )
    )
    
    const chat = chatList.find(c => c.id === chatId)
    if (chat) {
      toast.success(chat.pinned ? "Chat unpinned" : "Chat pinned")
    }
  }

  /**
   * Format timestamp to readable time
   */
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  /**
   * Format date for message grouping
   */
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  /**
   * Check if message is from the current user
   */
  const isCurrentUser = (senderId: string) => {
    return senderId === user?.id
  }

  /**
   * Get user info by ID
   */
  const getUserById = (userId: string) => {
    if (userId === user?.id) return user
    return mockUsers.find(u => u.id === userId) || {
      id: userId,
      name: "Unknown User",
      email: "",
      role: "teamMember" as const,
      avatar: `https://ui-avatars.com/api/?name=Unknown+User&background=gray&color=fff`
    }
  }

  /**
   * Group messages by date
   */
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = formatMessageDate(message.timestamp)
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return Object.entries(groups)
  }

  /**
   * Filter chat list by search query
   */
  const filteredChats = chatList.filter(chat => {
    if (!searchQuery) return true
    
    const searchLower = searchQuery.toLowerCase()
    
    // For direct chats, search participant name
    if (chat.type === "direct") {
      return chat.participants[0]?.name.toLowerCase().includes(searchLower)
    }
    
    // For group and project chats, search chat name
    return chat.name?.toLowerCase().includes(searchLower)
  })
  
  // Sort chats with pinned first, then by latest message
  const sortedChats = [...filteredChats].sort((a, b) => {
    // Pinned chats first
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    
    // Then sort by latest message
    const aTime = a.lastMessage?.timestamp || ""
    const bTime = b.lastMessage?.timestamp || ""
    return bTime.localeCompare(aTime)
  })

  // Track watchChanges handler for form
  useEffect(() => {
    const subscription = newChatForm.watch((value, { name }) => {
      if (name === "chatType") {
        // Reset projectId when chat type changes
        if (value.chatType !== "project") {
          newChatForm.setValue("projectId", "")
        }
        
        // Reset name when chat type changes to direct
        if (value.chatType === "direct") {
          newChatForm.setValue("name", "")
        }
      }
    })
    
    return () => subscription.unsubscribe()
  }, [newChatForm])

  return (
    <div className="flex h-[calc(100vh-7rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full max-w-xs border-r flex flex-col">
        {/* Search and new chat */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Messages</h2>
            <Dialog open={showNewChatDialog} onOpenChange={setShowNewChatDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New Chat</DialogTitle>
                  <DialogDescription>
                    Create a new conversation with team members or clients.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...newChatForm}>
                  <form onSubmit={newChatForm.handleSubmit(createNewChat)} className="space-y-4 mt-4">
                    <FormField
                      control={newChatForm.control}
                      name="chatType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chat Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select chat type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="direct">Direct Message</SelectItem>
                              <SelectItem value="group">Group Chat</SelectItem>
                              <SelectItem value="project">Project Channel</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {newChatForm.watch("chatType") !== "direct" && (
                      <FormField
                        control={newChatForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chat Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter chat name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    {newChatForm.watch("chatType") === "project" && (
                      <FormField
                        control={newChatForm.control}
                        name="projectId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="proj-1">Website Redesign</SelectItem>
                                <SelectItem value="proj-2">Mobile App Development</SelectItem>
                                <SelectItem value="proj-3">E-commerce Platform</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={newChatForm.control}
                      name="participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Participants</FormLabel>
                          <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                            {mockUsers.map(mockUser => (
                              <div key={mockUser.id} className="flex items-center space-x-2">
                                <input 
                                  type="checkbox"
                                  id={`user-${mockUser.id}`}
                                  value={mockUser.id}
                                  checked={field.value.includes(mockUser.id)}
                                  onChange={(e) => {
                                    const value = [...field.value]
                                    if (e.target.checked) {
                                      value.push(mockUser.id)
                                    } else {
                                      const index = value.indexOf(mockUser.id)
                                      if (index !== -1) {
                                        value.splice(index, 1)
                                      }
                                    }
                                    field.onChange(value)
                                  }}
                                  className="rounded text-primary focus:ring-primary"
                                />
                                <label 
                                  htmlFor={`user-${mockUser.id}`} 
                                  className="flex items-center cursor-pointer flex-1"
                                >
                                  <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={mockUser.avatar} />
                                    <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm">{mockUser.name}</div>
                                  <Badge 
                                    variant="outline" 
                                    className="ml-2 text-xs capitalize"
                                  >
                                    {mockUser.role}
                                  </Badge>
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setShowNewChatDialog(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Chat"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Chat tabs */}
        <Tabs defaultValue="all" className="flex-1 flex flex-col">
          <div className="border-b px-4">
            <TabsList className="w-full justify-start border-b-0">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="direct" className="flex-1">Direct</TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">Groups</TabsTrigger>
              <TabsTrigger value="projects" className="flex-1">Projects</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="flex-1">
            <TabsContent value="all" className="m-0 py-2">
              {sortedChats.length > 0 ? (
                sortedChats.map((chat) => (
                  <button
                    key={chat.id}
                    className={`w-full text-left p-3 flex items-start space-x-3 hover:bg-muted/50 transition-colors ${
                      activeChat?.id === chat.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setActiveChat(chat)}
                  >
                    {chat.type === "direct" ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.participants[0]?.avatar} />
                        <AvatarFallback>{chat.participants[0]?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : chat.type === "group" ? (
                      <div className="relative h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                    ) : (
                      <div className="relative h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="font-medium truncate pr-1">
                          {chat.type === "direct" 
                            ? chat.participants[0]?.name 
                            : chat.name}
                          {chat.pinned && (
                            <Pin className="inline-block h-3 w-3 ml-1 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {chat.lastMessage && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(chat.lastMessage.timestamp).toLocaleDateString([], {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage?.content || "No messages yet"}
                        </span>
                        {chat.unreadCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No chats found
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="direct" className="m-0 py-2">
              {sortedChats.filter(chat => chat.type === "direct").length > 0 ? (
                sortedChats
                  .filter(chat => chat.type === "direct")
                  .map((chat) => (
                    <button
                      key={chat.id}
                      className={`w-full text-left p-3 flex items-start space-x-3 hover:bg-muted/50 transition-colors ${
                        activeChat?.id === chat.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveChat(chat)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.participants[0]?.avatar} />
                        <AvatarFallback>{chat.participants[0]?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate pr-1">
                            {chat.participants[0]?.name}
                            {chat.pinned && (
                              <Pin className="inline-block h-3 w-3 ml-1 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            {chat.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(chat.lastMessage.timestamp).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage?.content || "No messages yet"}
                          </span>
                          {chat.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No direct messages found
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="groups" className="m-0 py-2">
              {sortedChats.filter(chat => chat.type === "group").length > 0 ? (
                sortedChats
                  .filter(chat => chat.type === "group")
                  .map((chat) => (
                    <button
                      key={chat.id}
                      className={`w-full text-left p-3 flex items-start space-x-3 hover:bg-muted/50 transition-colors ${
                        activeChat?.id === chat.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveChat(chat)}
                    >
                      <div className="relative h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate pr-1">
                            {chat.name}
                            {chat.pinned && (
                              <Pin className="inline-block h-3 w-3 ml-1 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            {chat.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(chat.lastMessage.timestamp).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage?.content || "No messages yet"}
                          </span>
                          {chat.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No group chats found
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="projects" className="m-0 py-2">
              {sortedChats.filter(chat => chat.type === "project").length > 0 ? (
                sortedChats
                  .filter(chat => chat.type === "project")
                  .map((chat) => (
                    <button
                      key={chat.id}
                      className={`w-full text-left p-3 flex items-start space-x-3 hover:bg-muted/50 transition-colors ${
                        activeChat?.id === chat.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setActiveChat(chat)}
                    >
                      <div className="relative h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="font-medium truncate pr-1">
                            {chat.name}
                            {chat.pinned && (
                              <Pin className="inline-block h-3 w-3 ml-1 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            {chat.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(chat.lastMessage.timestamp).toLocaleDateString([], {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage?.content || "No messages yet"}
                          </span>
                          {chat.unreadCount > 0 && (
                            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
              ) : (
                <div className="px-4 py-8 text-center text-muted-foreground">
                  No project channels found
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat header */}
            <div className="px-6 py-3 border-b flex items-center justify-between">
              <div className="flex items-center">
                {activeChat.type === "direct" ? (
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src={activeChat.participants[0]?.avatar} />
                    <AvatarFallback>{activeChat.participants[0]?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : activeChat.type === "group" ? (
                  <div className="relative h-9 w-9 bg-muted rounded-full flex items-center justify-center mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="relative h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-lg leading-tight">
                    {activeChat.type === "direct" 
                      ? activeChat.participants[0]?.name 
                      : activeChat.name}
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {activeChat.type === "direct" ? (
                      <span>
                        {activeChat.participants[0]?.status === "online" 
                          ? "Online" 
                          : activeChat.participants[0]?.status === "away" 
                            ? "Away" 
                            : "Offline"}
                      </span>
                    ) : (
                      <span>
                        {activeChat.participants.length} members
                        {activeChat.type === "project" && (
                          <span> • Project Channel</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chat options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => togglePinChat(activeChat.id)}>
                      {activeChat.pinned ? "Unpin chat" : "Pin chat"}
                    </DropdownMenuItem>
                    <DropdownMenuItem>Search in conversation</DropdownMenuItem>
                    <DropdownMenuItem>Share files</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      Leave conversation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Chat messages */}
            <ScrollArea className="flex-1 p-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Say hello and start chatting with {activeChat.type === "direct" 
                      ? activeChat.participants[0]?.name 
                      : "the group"}
                  </p>
                  <Button onClick={() => messageForm.setFocus("message")}>
                    Start Conversation
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {groupMessagesByDate(messages).map(([date, dateMessages]) => (
                    <div key={date} className="space-y-4">
                      <div className="relative flex items-center">
                        <Separator className="flex-1" />
                        <span className="px-2 text-xs text-muted-foreground bg-background">{date}</span>
                        <Separator className="flex-1" />
                      </div>
                      
                      {dateMessages.map((message, index) => {
                        const sender = getUserById(message.senderId)
                        const isOwn = isCurrentUser(message.senderId)
                        const showAvatar = index === 0 || 
                          dateMessages[index - 1]?.senderId !== message.senderId
                        
                        return (
                          <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                            <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} max-w-[80%] items-end gap-2`}>
                              {showAvatar ? (
                                <Avatar className="h-8 w-8 shrink-0">
                                  <AvatarImage src={sender.avatar} />
                                  <AvatarFallback>{sender.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                              ) : (
                                <div className="w-8" />
                              )}
                              
                              <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                                {showAvatar && (
                                  <span className="text-xs text-muted-foreground mb-1">
                                    {isOwn ? "You" : sender.name}
                                  </span>
                                )}
                                
                                <div 
                                  className={`rounded-lg px-3 py-2 text-sm ${
                                    isOwn 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-muted"
                                  }`}
                                >
                                  {/* Add @mention highlighting */}
                                  {message.content.split(/(@\w+)/).map((part, i) => {
                                    if (part.startsWith("@")) {
                                      return (
                                        <span key={i} className="font-semibold">
                                          {part}
                                        </span>
                                      )
                                    }
                                    return part
                                  })}
                                  
                                  {/* Attachments */}
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-2 space-y-2">
                                      {message.attachments.map((attachment) => (
                                        <div 
                                          key={attachment.id}
                                          className={`flex items-center p-2 rounded ${
                                            isOwn 
                                              ? "bg-primary-foreground/20" 
                                              : "bg-background"
                                          }`}
                                        >
                                          {attachment.type.startsWith("image/") ? (
                                            <ImageIcon className="h-4 w-4 mr-2 shrink-0" />
                                          ) : (
                                            <FilePlus className="h-4 w-4 mr-2 shrink-0" />
                                          )}
                                          <span className="text-xs truncate">{attachment.name}</span>
                                          <span className="text-xs text-muted-foreground ml-auto">
                                            {(attachment.size / 1024).toFixed(0)} KB
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <div className="mt-1 text-xs text-right">
                                    {formatMessageTime(message.timestamp)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {typingIndicator && (
                    <div className="flex items-end gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={activeChat.participants[0]?.avatar} 
                          alt={activeChat.participants[0]?.name} 
                        />
                        <AvatarFallback>{activeChat.participants[0]?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "200ms" }} />
                          <div className="h-2 w-2 rounded-full bg-foreground/50 animate-bounce" style={{ animationDelay: "400ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messageEndRef} />
                </div>
              )}
            </ScrollArea>
            
            {/* Selected files */}
            {selectedFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-border/50 bg-muted/30">
                <div className="text-sm font-medium mb-1">Selected files ({selectedFiles.length})</div>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1.5 bg-background rounded px-2 py-1 text-xs"
                    >
                      {file.type.startsWith("image/") ? (
                        <ImageIcon className="h-3 w-3" />
                      ) : (
                        <FilePlus className="h-3 w-3" />
                      )}
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeSelectedFile(index)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Chat input */}
            <div className="p-4 border-t">
              <Form {...messageForm}>
                <form 
                  onSubmit={messageForm.handleSubmit(onSendMessage)} 
                  className="flex items-end gap-2"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileSelect}
                      multiple
                    />
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  
                  <FormField
                    control={messageForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder={`Message ${
                                activeChat.type === "direct"
                                  ? activeChat.participants[0]?.name
                                  : activeChat.name
                              }...`}
                              className="min-h-10 py-6 pr-12"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground"
                              onClick={() => {
                                messageForm.setValue(
                                  "message", 
                                  messageForm.getValues("message") + " @"
                                )
                                messageForm.setFocus("message")
                              }}
                            >
                              <AtSign className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="shrink-0"
                    disabled={!messageForm.getValues("message") && selectedFiles.length === 0}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </Form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Select a conversation from the sidebar or start a new one to begin messaging.
            </p>
            <Button onClick={() => setShowNewChatDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrgChat