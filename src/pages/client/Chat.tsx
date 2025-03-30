import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import {
  PlusCircle,
  Search,
  Phone,
  Video,
  Info,
  MessageSquare,
  Paperclip,
  Send,
  Image as ImageIcon,
  FileText,
  UserPlus,
  Clock,
  Check,
  CheckCheck,
  Users,
  X,
  Menu
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Define types for chat data
interface ChatUser {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  online: boolean
  lastSeen?: string
}

interface ChatGroup {
  id: string
  name: string
  projectId?: string
  projectName?: string
  members: ChatUser[]
  unreadCount?: number
  lastMessage?: Message
  type: 'direct' | 'group' | 'project'
}

interface Message {
  id: string
  groupId: string
  senderId: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  size: number
  type: 'image' | 'document' | 'other'
  url: string
  thumbnailUrl?: string
}

/**
 * Client Chat Page Component
 * 
 * Provides a real-time chat interface for clients to communicate with their
 * assigned team members and project managers.
 */
const ClientChat = () => {
  const { user } = useAuth()
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([])
  const [activeGroupId, setActiveGroupId] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isNewChatOpen, setIsNewChatOpen] = useState<boolean>(false)
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // This would be replaced with actual API calls when backend is ready
    const fetchChatData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data for chat users
        const mockUsers: ChatUser[] = [
          {
            id: 'user-1',
            name: 'Alex Johnson',
            email: 'alex@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            role: 'Project Manager',
            online: true
          },
          {
            id: 'user-2',
            name: 'Jamie Lee',
            email: 'jamie@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Jamie+Lee&background=f43f5e&color=fff',
            role: 'UX Designer',
            online: false,
            lastSeen: '2025-03-30T10:30:00Z'
          },
          {
            id: 'user-3',
            name: 'Sam Taylor',
            email: 'sam@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Sam+Taylor&background=10b981&color=fff',
            role: 'Lead Developer',
            online: true
          },
          {
            id: 'user-4',
            name: 'Morgan Smith',
            email: 'morgan@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Morgan+Smith&background=fb923c&color=fff',
            role: 'Content Strategist',
            online: false,
            lastSeen: '2025-03-29T15:45:00Z'
          },
        ]
        
        // Mock data for chat groups
        const mockGroups: ChatGroup[] = [
          {
            id: 'group-1',
            name: 'Website Redesign Team',
            projectId: 'proj-1',
            projectName: 'Website Redesign',
            members: [mockUsers[0], mockUsers[1], mockUsers[2]],
            unreadCount: 2,
            type: 'project'
          },
          {
            id: 'group-2',
            name: 'Mobile App Team',
            projectId: 'proj-2',
            projectName: 'Mobile App Development',
            members: [mockUsers[0], mockUsers[2]],
            unreadCount: 0,
            type: 'project'
          },
          {
            id: 'group-3',
            name: 'Content Creation Team',
            projectId: 'proj-3',
            projectName: 'Content Creation',
            members: [mockUsers[0], mockUsers[3]],
            unreadCount: 0,
            type: 'project'
          },
          {
            id: 'dm-1',
            name: 'Alex Johnson',
            members: [mockUsers[0]],
            unreadCount: 1,
            type: 'direct'
          },
          {
            id: 'dm-2',
            name: 'Sam Taylor',
            members: [mockUsers[2]],
            unreadCount: 0,
            type: 'direct'
          },
        ]
        
        // Mock data for messages in the first group
        const mockMessages: Message[] = [
          {
            id: 'msg-1',
            groupId: 'group-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'Good morning! Just wanted to update everyone on the website redesign progress. We\'re on track to complete the beta launch by April 1st.',
            timestamp: '2025-03-30T09:30:00Z',
            status: 'read'
          },
          {
            id: 'msg-2',
            groupId: 'group-1',
            senderId: 'user-2',
            senderName: 'Jamie Lee',
            senderAvatar: 'https://ui-avatars.com/api/?name=Jamie+Lee&background=f43f5e&color=fff',
            content: 'That\'s great news! I\'ve completed all the UI components for the homepage and product pages.',
            timestamp: '2025-03-30T09:35:00Z',
            status: 'read'
          },
          {
            id: 'msg-3',
            groupId: 'group-1',
            senderId: 'user-3',
            senderName: 'Sam Taylor',
            senderAvatar: 'https://ui-avatars.com/api/?name=Sam+Taylor&background=10b981&color=fff',
            content: 'Frontend implementation is about 85% complete. I\'ll have the navigation component finished by end of day.',
            timestamp: '2025-03-30T09:40:00Z',
            status: 'read'
          },
          {
            id: 'msg-4',
            groupId: 'group-1',
            senderId: 'client',
            senderName: user?.name || 'Client User',
            senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff',
            content: 'This sounds promising! Will I be able to review the beta version before the official launch?',
            timestamp: '2025-03-30T09:45:00Z',
            status: 'read'
          },
          {
            id: 'msg-5',
            groupId: 'group-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'Absolutely! We\'ll provide you with access to the beta environment by March 28th, giving you a few days to review before the official beta launch.',
            timestamp: '2025-03-30T09:50:00Z',
            status: 'read'
          },
          {
            id: 'msg-6',
            groupId: 'group-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'Here\'s the latest mockup for the homepage:',
            timestamp: '2025-03-30T09:55:00Z',
            status: 'read',
            attachments: [
              {
                id: 'attachment-1',
                name: 'homepage-mockup.png',
                size: 1200000,
                type: 'image',
                url: '/api/placeholder/800/600',
                thumbnailUrl: '/api/placeholder/200/150'
              }
            ]
          },
          {
            id: 'msg-7',
            groupId: 'group-1',
            senderId: 'client',
            senderName: user?.name || 'Client User',
            senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff',
            content: 'This looks great! I like the new navigation layout. Can we adjust the hero section to better highlight our new product line?',
            timestamp: '2025-03-30T10:05:00Z',
            status: 'read'
          },
          {
            id: 'msg-8',
            groupId: 'group-1',
            senderId: 'user-2',
            senderName: 'Jamie Lee',
            senderAvatar: 'https://ui-avatars.com/api/?name=Jamie+Lee&background=f43f5e&color=fff',
            content: 'I can definitely work on that. I\'ll create a few alternatives for the hero section and share them with you by tomorrow.',
            timestamp: '2025-03-30T10:10:00Z',
            status: 'delivered'
          },
        ]
        
        // Mock data for direct message with Alex
        const mockDmMessages: Message[] = [
          {
            id: 'dm-msg-1',
            groupId: 'dm-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'Hi there! Is there anything specific you\'d like to discuss about the Website Redesign project?',
            timestamp: '2025-03-29T15:30:00Z',
            status: 'read'
          },
          {
            id: 'dm-msg-2',
            groupId: 'dm-1',
            senderId: 'client',
            senderName: user?.name || 'Client User',
            senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff',
            content: 'Hi Alex! Yes, I was wondering if we could schedule a call to discuss the timeline for the e-commerce functionality integration.',
            timestamp: '2025-03-29T15:35:00Z',
            status: 'read'
          },
          {
            id: 'dm-msg-3',
            groupId: 'dm-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'Of course! How does tomorrow at 2 PM sound? I can set up a Zoom call and send you the details.',
            timestamp: '2025-03-29T15:40:00Z',
            status: 'read'
          },
          {
            id: 'dm-msg-4',
            groupId: 'dm-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'I\'ve also attached our preliminary plan for the e-commerce integration:',
            timestamp: '2025-03-29T15:45:00Z',
            status: 'read',
            attachments: [
              {
                id: 'attachment-2',
                name: 'ecommerce-integration-plan.pdf',
                size: 2500000,
                type: 'document',
                url: '#',
              }
            ]
          },
          {
            id: 'dm-msg-5',
            groupId: 'dm-1',
            senderId: 'client',
            senderName: user?.name || 'Client User',
            senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff',
            content: 'Tomorrow at 2 PM works perfectly. Thank you for sending the plan, I\'ll review it before our call.',
            timestamp: '2025-03-29T16:00:00Z',
            status: 'read'
          },
          {
            id: 'dm-msg-6',
            groupId: 'dm-1',
            senderId: 'user-1',
            senderName: 'Alex Johnson',
            senderAvatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=6366f1&color=fff',
            content: 'Great! I\'ve sent the calendar invite. Looking forward to our discussion tomorrow.',
            timestamp: '2025-03-29T16:05:00Z',
            status: 'delivered'
          }
        ]
        
        // Add last messages to the groups
        const updatedGroups = mockGroups.map(group => {
          if (group.id === 'group-1') {
            return {
              ...group,
              lastMessage: mockMessages[mockMessages.length - 1]
            }
          } else if (group.id === 'dm-1') {
            return {
              ...group,
              lastMessage: mockDmMessages[mockDmMessages.length - 1]
            }
          }
          return group
        })
        
        setChatGroups(updatedGroups)
        setActiveGroupId('group-1') // Set the first group as active by default
        setMessages(mockMessages)
        
        // Initialize all messages for each group
        const allMessages: { [key: string]: Message[] } = {
          'group-1': mockMessages,
          'dm-1': mockDmMessages,
          // Empty arrays for other groups
          'group-2': [],
          'group-3': [],
          'dm-2': []
        }
        
        // Store in a ref to avoid re-renders
        // In a real app, this would be handled by a proper state management solution
        window.chatMessages = allMessages
      } catch (error) {
        console.error('Error fetching chat data:', error)
        // Handle error appropriately
      } finally {
        setIsLoading(false)
      }
    }
    
    // Mock messages storage for demo
    if (!window.chatMessages) {
      window.chatMessages = {}
    }
    
    fetchChatData()
  }, [user])
  
  // Effect to scroll to bottom when messages change or active group changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, activeGroupId])
  
  // Switch to a different chat group
  const handleSwitchGroup = (groupId: string) => {
    if (groupId === activeGroupId) return
    
    setActiveGroupId(groupId)
    
    // Load messages for the selected group
    const groupMessages = window.chatMessages?.[groupId] || []
    setMessages(groupMessages)
    
    // Mark as read
    setChatGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId ? { ...group, unreadCount: 0 } : group
      )
    )
    
    // Close sidebar on mobile
    setIsSidebarOpen(false)
  }
  
  // Send a new message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const newMessageObj: Message = {
      id: `msg-${Date.now()}`,
      groupId: activeGroupId,
      senderId: 'client',
      senderName: user?.name || 'Client User',
      senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff',
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    }
    
    // Add to current messages
    setMessages(prevMessages => [...prevMessages, newMessageObj])
    
    // Add to stored messages
    if (window.chatMessages) {
      const groupMessages = window.chatMessages[activeGroupId] || []
      window.chatMessages[activeGroupId] = [...groupMessages, newMessageObj]
    }
    
    // Update last message in chat groups
    setChatGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === activeGroupId ? { ...group, lastMessage: newMessageObj } : group
      )
    )
    
    // Clear input
    setNewMessage('')
    
    // Simulate message delivery status updates
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessageObj.id ? { ...msg, status: 'delivered' } : msg
        )
      )
      
      if (window.chatMessages) {
        window.chatMessages[activeGroupId] = window.chatMessages[activeGroupId].map(
          (msg: Message) => msg.id === newMessageObj.id ? { ...msg, status: 'delivered' } : msg
        )
      }
    }, 1000)
    
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === newMessageObj.id ? { ...msg, status: 'read' } : msg
        )
      )
      
      if (window.chatMessages) {
        window.chatMessages[activeGroupId] = window.chatMessages[activeGroupId].map(
          (msg: Message) => msg.id === newMessageObj.id ? { ...msg, status: 'read' } : msg
        )
      }
      
      // Simulate reply for demo purposes
      if (Math.random() > 0.5) {
        simulateReply()
      }
    }, 2000)
  }
  
  // Simulate a reply from the other person
  const simulateReply = () => {
    const activeGroup = chatGroups.find(group => group.id === activeGroupId)
    if (!activeGroup || !activeGroup.members.length) return
    
    const sender = activeGroup.members[0]
    
    const replies = [
      "Thanks for your message! I'll look into this right away.",
      "Good point! I'll make those changes and get back to you.",
      "I appreciate your feedback. Let me discuss this with the team.",
      "Yes, that sounds like a good approach. Let's proceed with that.",
      "I'll check the timeline and get back to you with more details soon."
    ]
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)]
    
    const replyMessage: Message = {
      id: `msg-${Date.now()}`,
      groupId: activeGroupId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      content: randomReply,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }
    
    // Add after a random delay
    setTimeout(() => {
      // Add to current messages
      setMessages(prevMessages => [...prevMessages, replyMessage])
      
      // Add to stored messages
      if (window.chatMessages) {
        const groupMessages = window.chatMessages[activeGroupId] || []
        window.chatMessages[activeGroupId] = [...groupMessages, replyMessage]
      }
      
      // Update last message in chat groups
      setChatGroups(prevGroups => 
        prevGroups.map(group => 
          group.id === activeGroupId ? { ...group, lastMessage: replyMessage } : group
        )
      )
    }, 3000 + Math.random() * 5000)
  }
  
  // Filter chat groups based on search query
  const filteredGroups = chatGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.projectName && group.projectName.toLowerCase().includes(searchQuery.toLowerCase()))
  )
  
  // Get the active group
  const activeGroup = chatGroups.find(group => group.id === activeGroupId)
  
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      // Today - show time only
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday'
    } else if (diffDays < 7) {
      // Show day of week
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      // Show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }
  
  // Format message time
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Format date for message groups
  const formatMessageDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear()
    
    const isYesterday = date.getDate() === now.getDate() - 1 && 
                        date.getMonth() === now.getMonth() && 
                        date.getFullYear() === now.getFullYear()
    
    if (isToday) {
      return 'Today'
    } else if (isYesterday) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
    }
  }
  
  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {}
    
    messages.forEach(message => {
      const date = new Date(message.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(message)
    })
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      timestamp: new Date(date).toISOString(),
      messages
    }))
  }
  
  // Get message status icon
  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }
  
  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    // In a real app, you would upload the file to a server
    // For now, just simulate it
    
    const file = files[0]
    const isImage = file.type.startsWith('image/')
    
    const attachment: Attachment = {
      id: `attachment-${Date.now()}`,
      name: file.name,
      size: file.size,
      type: isImage ? 'image' : file.type.includes('pdf') || file.type.includes('doc') ? 'document' : 'other',
      url: '#', // Would be a real URL in production
      thumbnailUrl: isImage ? '#' : undefined
    }
    
    const fileMessage: Message = {
      id: `msg-${Date.now()}`,
      groupId: activeGroupId,
      senderId: 'client',
      senderName: user?.name || 'Client User',
      senderAvatar: user?.avatar || 'https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff',
      content: `Sent ${isImage ? 'an image' : 'a file'}: ${file.name}`,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: [attachment]
    }
    
    // Add to current messages
    setMessages(prevMessages => [...prevMessages, fileMessage])
    
    // Add to stored messages
    if (window.chatMessages) {
      const groupMessages = window.chatMessages[activeGroupId] || []
      window.chatMessages[activeGroupId] = [...groupMessages, fileMessage]
    }
    
    // Update last message in chat groups
    setChatGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === activeGroupId ? { ...group, lastMessage: fileMessage } : group
      )
    )
    
    // Reset file input
    event.target.value = ''
    
    // Simulate status updates
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === fileMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      )
    }, 1000)
    
    setTimeout(() => {
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === fileMessage.id ? { ...msg, status: 'read' } : msg
        )
      )
    }, 2000)
  }
  
  // Get attachment icon
  const getAttachmentIcon = (type: Attachment['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      default:
        return <Paperclip className="h-4 w-4" />
    }
  }
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    const kb = bytes / 1024
    if (kb < 1024) return kb.toFixed(1) + ' KB'
    const mb = kb / 1024
    return mb.toFixed(1) + ' MB'
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6 h-[calc(100vh-4rem)] md:h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex flex-col h-full overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b">
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium">Team Chat</h1>
          <div className="w-9"></div> {/* Empty space for balance */}
        </div>
      
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Sidebar (hidden on mobile) */}
          <div className={`
            ${isSidebarOpen ? 'fixed inset-0 z-50 bg-background/80' : 'hidden md:flex'}
            md:relative md:w-80 md:flex-col md:inset-auto md:z-auto md:bg-transparent
          `}>
            {/* Use Sheet component for mobile sidebar */}
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetContent side="left" className="p-0 w-[300px]">
                <SheetHeader className="p-4 border-b text-left">
                  <SheetTitle>Team Chat</SheetTitle>
                  <SheetDescription>
                    Chat with your project teams
                  </SheetDescription>
                </SheetHeader>
                {renderChatSidebar()}
              </SheetContent>
            </Sheet>
            
            {/* Desktop sidebar */}
            <div className="hidden md:flex md:flex-col md:h-full md:border-r">
              {renderChatSidebar()}
            </div>
          </div>
          
          {/* Chat Main Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {activeGroup ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center">
                    {activeGroup.type === 'direct' ? (
                      <Avatar className="h-9 w-9 mr-3">
                        <AvatarImage src={activeGroup.members[0]?.avatar} alt={activeGroup.name} />
                        <AvatarFallback>{activeGroup.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    
                    <div>
                      <h2 className="font-medium">{activeGroup.name}</h2>
                      <p className="text-xs text-muted-foreground">
                        {activeGroup.type === 'direct' ? (
                          activeGroup.members[0]?.online ? 
                            'Online' : 
                            'Offline'
                        ) : (
                          activeGroup.type === 'project' ? 
                            `${activeGroup.projectName} • ${activeGroup.members.length} members` : 
                            `${activeGroup.members.length} members`
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Phone className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Call</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Video className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Video Call</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setIsInfoOpen(true)}>
                            <Info className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Info</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No messages yet</h3>
                      <p className="text-muted-foreground mt-1 max-w-md">
                        Start the conversation by sending a message to {
                          activeGroup.type === 'direct' ? 
                            activeGroup.name : 
                            `the ${activeGroup.name}`
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {groupMessagesByDate().map(group => (
                        <div key={group.date} className="space-y-4">
                          <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                              <span className="w-full border-t" />
                            </div>
                            <span className="relative bg-background px-2 text-xs text-muted-foreground">
                              {formatMessageDate(group.timestamp)}
                            </span>
                          </div>
                          
                          {group.messages.map((message, index) => (
                            <div key={message.id} className={`flex ${message.senderId === 'client' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`flex ${message.senderId === 'client' ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] sm:max-w-[70%] gap-2`}>
                                {/* Only show avatar if it's not from the same sender as the previous message */}
                                {(index === 0 || group.messages[index - 1].senderId !== message.senderId) && (
                                  <Avatar className="h-8 w-8 mt-1">
                                    <AvatarImage src={message.senderAvatar} alt={message.senderName} />
                                    <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                )}
                                
                                <div className={`flex flex-col ${message.senderId === 'client' ? 'items-end' : 'items-start'}`}>
                                  {/* Only show name if it's not from the same sender as the previous message */}
                                  {(index === 0 || group.messages[index - 1].senderId !== message.senderId) && (
                                    <span className="text-xs text-muted-foreground mb-1">
                                      {message.senderName}
                                    </span>
                                  )}
                                  
                                  <div className={`rounded-lg px-3 py-2 ${
                                    message.senderId === 'client' ? 
                                      'bg-primary text-primary-foreground' : 
                                      'bg-accent'
                                  }`}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  </div>
                                  
                                  {message.attachments && message.attachments.length > 0 && (
                                    <div className="mt-1">
                                      {message.attachments.map(attachment => (
                                        <div key={attachment.id} className="mt-2">
                                          {attachment.type === 'image' ? (
                                            <div className="rounded-lg overflow-hidden">
                                              <img 
                                                src={attachment.url} 
                                                alt={attachment.name} 
                                                className="max-w-xs rounded-lg"
                                              />
                                            </div>
                                          ) : (
                                            <div className={`flex items-center rounded-lg p-2 ${
                                              message.senderId === 'client' ? 
                                                'bg-primary/80 text-primary-foreground' : 
                                                'bg-accent/80'
                                            }`}>
                                              {getAttachmentIcon(attachment.type)}
                                              <div className="ml-2 flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{attachment.name}</p>
                                                <p className="text-xs opacity-70">{formatFileSize(attachment.size)}</p>
                                              </div>
                                              <Button variant={message.senderId === 'client' ? 'secondary' : 'default'} size="sm" className="ml-2">
                                                Download
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center mt-1 text-xs text-muted-foreground">
                                    <span>{formatMessageTime(message.timestamp)}</span>
                                    {message.senderId === 'client' && (
                                      <span className="ml-1">
                                        {getMessageStatusIcon(message.status)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder={`Message ${activeGroup.type === 'direct' ? activeGroup.name : activeGroup.name}`}
                        className="min-h-10 resize-none"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full" type="button">
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <Paperclip className="h-5 w-5" />
                                <input 
                                  id="file-upload" 
                                  type="file" 
                                  className="hidden" 
                                  onChange={handleFileUpload}
                                />
                              </label>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Attach File</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Button 
                        size="icon" 
                        className="rounded-full" 
                        onClick={handleSendMessage} 
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Conversation Info Sidebar */}
                <Sheet open={isInfoOpen} onOpenChange={setIsInfoOpen}>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Conversation Info</SheetTitle>
                    </SheetHeader>
                    
                    <div className="py-6">
                      <h3 className="text-sm font-medium mb-2">Members</h3>
                      <div className="space-y-3">
                        {/* Current user */}
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user?.avatar || "https://ui-avatars.com/api/?name=Client+User&background=fb923c&color=fff"} />
                            <AvatarFallback>CU</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user?.name || "Client User"}</p>
                            <p className="text-xs text-muted-foreground">You</p>
                          </div>
                          <Badge variant="outline" className="ml-auto">Client</Badge>
                        </div>
                        
                        {/* Group members */}
                        {activeGroup.members.map(member => (
                          <div key={member.id} className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.name}</p>
                              <p className="text-xs text-muted-foreground">{member.role}</p>
                            </div>
                            <div className="ml-auto flex items-center">
                              {member.online ? (
                                <Badge variant="outline" className="border-emerald-500 text-emerald-500">Online</Badge>
                              ) : (
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>
                                    {member.lastSeen ? formatTimestamp(member.lastSeen) : 'Offline'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {activeGroup.projectId && (
                        <div className="mt-6">
                          <h3 className="text-sm font-medium mb-2">Project</h3>
                          <div className="p-3 rounded-md bg-accent/50">
                            <p className="font-medium">{activeGroup.projectName}</p>
                            <Button variant="link" className="p-0 h-auto text-sm" asChild>
                              <a href={`/client/timeline?project=${activeGroup.projectId}`}>
                                View Project Timeline
                              </a>
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">Options</h3>
                        <div className="space-y-2">
                          <Button variant="outline" className="w-full justify-start" asChild>
                            <a href={`/client/reports`}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Project Reports
                            </a>
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Search className="h-4 w-4 mr-2" />
                            Search in Conversation
                          </Button>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Select a conversation</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  Choose a team member or project group from the sidebar to start chatting
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
      
      {/* New Chat Dialog */}
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Conversation</DialogTitle>
            <DialogDescription>
              Start a new conversation with a team member or create a group chat.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="search-contacts">Search Contacts</Label>
              <Input
                id="search-contacts"
                placeholder="Type a name..."
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Suggested Contacts</h4>
              <div className="space-y-2">
                {chatGroups
                  .filter(group => group.type === 'direct')
                  .map(group => (
                    <div 
                      key={group.id} 
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => {
                        handleSwitchGroup(group.id)
                        setIsNewChatOpen(false)
                      }}
                    >
                      <Avatar>
                        <AvatarImage src={group.members[0]?.avatar} />
                        <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.members[0]?.role}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewChatOpen(false)}>
              Cancel
            </Button>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Create Group Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
  
  function renderChatSidebar() {
    return (
      <>
        <div className="p-4 border-b flex items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="icon" variant="ghost" onClick={() => setIsNewChatOpen(true)}>
            <PlusCircle className="h-5 w-5" />
          </Button>
          
          {/* Mobile close button */}
          <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {filteredGroups.length > 0 ? (
            <div className="space-y-1 p-2">
              {/* Project Chats Section */}
              {filteredGroups.filter(group => group.type === 'project').length > 0 && (
                <div className="mb-2">
                  <h3 className="px-2 text-xs font-medium text-muted-foreground mb-1">
                    Project Chats
                  </h3>
                  {filteredGroups
                    .filter(group => group.type === 'project')
                    .map(group => (
                      <div
                        key={group.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                          activeGroupId === group.id ? 'bg-accent' : 'hover:bg-accent/50'
                        }`}
                        onClick={() => handleSwitchGroup(group.id)}
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{group.name}</p>
                            {group.lastMessage && (
                              <p className="text-xs text-muted-foreground">
                                {formatTimestamp(group.lastMessage.timestamp)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate">
                              {group.lastMessage ? 
                                `${group.lastMessage.senderName}: ${group.lastMessage.content}` : 
                                `${group.members.length} members`
                              }
                            </p>
                            {group.unreadCount && group.unreadCount > 0 && (
                              <Badge className="ml-1">{group.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              
              {/* Direct Messages Section */}
              {filteredGroups.filter(group => group.type === 'direct').length > 0 && (
                <div>
                  <h3 className="px-2 text-xs font-medium text-muted-foreground mb-1">
                    Direct Messages
                  </h3>
                  {filteredGroups
                    .filter(group => group.type === 'direct')
                    .map(group => (
                      <div
                        key={group.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer ${
                          activeGroupId === group.id ? 'bg-accent' : 'hover:bg-accent/50'
                        }`}
                        onClick={() => handleSwitchGroup(group.id)}
                      >
                        <div className="relative flex-shrink-0">
                          <Avatar>
                            <AvatarImage src={group.members[0]?.avatar} />
                            <AvatarFallback>{group.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {group.members[0]?.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background"></span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium truncate">{group.name}</p>
                            {group.lastMessage && (
                              <p className="text-xs text-muted-foreground">
                                {formatTimestamp(group.lastMessage.timestamp)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate">
                              {group.lastMessage ? 
                                group.lastMessage.content : 
                                group.members[0]?.online ? 'Online' : 'Offline'
                              }
                            </p>
                            {group.unreadCount && group.unreadCount > 0 && (
                              <Badge className="ml-1">{group.unreadCount}</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </>
    )
  }
}

// Add to window object for demo purposes
declare global {
  interface Window {
    chatMessages: {
      [key: string]: Message[]
    }
  }
}

export default ClientChat