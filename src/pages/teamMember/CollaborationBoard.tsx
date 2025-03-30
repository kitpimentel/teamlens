import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "@/context/ThemeContext"
import PageHeader from "@/components/common/PageHeader"
import EmptyState from "@/components/common/EmptyState"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  Plus,
  Edit3,
  Paperclip,
  Send,
  Loader2,
  Trash2,
  Palette,
} from "lucide-react"

/**
 * Note type definition
 */
interface Note {
  id: string
  content: string
  color: string
  author: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
  position: {
    x: number
    y: number
  }
}

/**
 * Whiteboard Session type definition
 */
interface WhiteboardSession {
  id: string
  name: string
  project: string
  projectId: string
  createdBy: string
  createdAt: string
  lastActive: string
  participants: {
    id: string
    name: string
    avatar: string
  }[]
  notes: Note[]
}

/**
 * Chat Message type definition
 */
interface ChatMessage {
  id: string
  text: string
  sender: {
    id: string
    name: string
    avatar: string
  }
  timestamp: string
  attachments?: {
    id: string
    name: string
    type: string
    url: string
  }[]
}

/**
 * Mock Whiteboard Sessions data
 */
const mockWhiteboardSessions: WhiteboardSession[] = [
  {
    id: "wb-1",
    name: "E-commerce App Design",
    project: "E-commerce App",
    projectId: "proj-1",
    createdBy: "John Smith",
    createdAt: "2025-03-15T10:30:00Z",
    lastActive: "2025-03-29T16:45:00Z",
    participants: [
      {
        id: "user-123",
        name: "John Smith",
        avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
      },
      {
        id: "user-456",
        name: "Sarah Johnson",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
      },
      {
        id: "user-789",
        name: "Mike Williams",
        avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
      },
    ],
    notes: [
      {
        id: "note-1",
        content: "Need to implement JWT authentication with refresh tokens for security.",
        color: "#ffcc80",
        author: {
          id: "user-123",
          name: "John Smith",
          avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
        },
        createdAt: "2025-03-28T13:15:00Z",
        position: {
          x: 100,
          y: 150,
        },
      },
      {
        id: "note-2",
        content: "Mobile responsive design for product listing page is a priority.",
        color: "#80deea",
        author: {
          id: "user-456",
          name: "Sarah Johnson",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
        },
        createdAt: "2025-03-28T14:30:00Z",
        position: {
          x: 300,
          y: 200,
        },
      },
      {
        id: "note-3",
        content: "Consider implementing product search with ElasticSearch for better performance.",
        color: "#ce93d8",
        author: {
          id: "user-789",
          name: "Mike Williams",
          avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
        },
        createdAt: "2025-03-29T09:45:00Z",
        position: {
          x: 500,
          y: 120,
        },
      },
    ],
  },
  {
    id: "wb-2",
    name: "CRM Dashboard Planning",
    project: "CRM System",
    projectId: "proj-2",
    createdBy: "Sarah Johnson",
    createdAt: "2025-03-20T11:00:00Z",
    lastActive: "2025-03-28T15:30:00Z",
    participants: [
      {
        id: "user-456",
        name: "Sarah Johnson",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
      },
      {
        id: "user-789",
        name: "Mike Williams",
        avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
      },
    ],
    notes: [
      {
        id: "note-4",
        content: "Dashboard needs to show key metrics: customer acquisition, retention rate, and support tickets.",
        color: "#a5d6a7",
        author: {
          id: "user-456",
          name: "Sarah Johnson",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
        },
        createdAt: "2025-03-27T10:15:00Z",
        position: {
          x: 200,
          y: 180,
        },
      },
      {
        id: "note-5",
        content: "Consider using a graph database for customer relationship visualization.",
        color: "#90caf9",
        author: {
          id: "user-789",
          name: "Mike Williams",
          avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
        },
        createdAt: "2025-03-28T11:30:00Z",
        position: {
          x: 450,
          y: 250,
        },
      },
    ],
  },
]

/**
 * Mock chat messages for the session
 */
const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    text: "Hey team, I've started working on the authentication flow. Let me know if you have any questions.",
    sender: {
      id: "user-789",
      name: "Mike Williams",
      avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
    },
    timestamp: "2025-03-29T13:30:00Z",
  },
  {
    id: "msg-2",
    text: "Great! Will you be implementing refresh tokens as well?",
    sender: {
      id: "user-123",
      name: "John Smith",
      avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
    },
    timestamp: "2025-03-29T13:35:00Z",
  },
  {
    id: "msg-3",
    text: "Yes, I'm planning to use JWT with refresh tokens. I've put a note on the board about it.",
    sender: {
      id: "user-789",
      name: "Mike Williams",
      avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
    },
    timestamp: "2025-03-29T13:40:00Z",
  },
  {
    id: "msg-4",
    text: "I've attached the design specs for the login screen. Let me know what you think.",
    sender: {
      id: "user-456",
      name: "Sarah Johnson",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
    },
    timestamp: "2025-03-29T14:15:00Z",
    attachments: [
      {
        id: "attach-1",
        name: "login-screen-design.fig",
        type: "application/octet-stream",
        url: "#",
      },
    ],
  },
  {
    id: "msg-5",
    text: "The designs look great. I'll start implementing them tomorrow.",
    sender: {
      id: "user-789",
      name: "Mike Williams",
      avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
    },
    timestamp: "2025-03-29T14:30:00Z",
  },
]

/**
 * Note colors for the sticky notes
 */
const noteColors = [
  "#ffcc80", // Orange
  "#80deea", // Cyan
  "#ce93d8", // Purple
  "#a5d6a7", // Green
  "#90caf9", // Blue
  "#ef9a9a", // Red
  "#fff59d", // Yellow
]

/**
 * Format date to relative time (e.g., "2 days ago")
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`
  }
  
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`
  }
  
  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`
}

/**
 * Note component for displaying a sticky note on the whiteboard
 */
interface NoteProps {
  note: Note
  onDelete: (id: string) => void
  onUpdate: (id: string, content: string) => void
  onMove: (id: string, position: { x: number; y: number }) => void
}

const StickyNote: React.FC<NoteProps> = ({ note, onDelete, onUpdate, onMove }) => {
  const [editing, setEditing] = useState(false)
  const [content, setContent] = useState(note.content)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(note.position)
  const noteRef = useRef<HTMLDivElement>(null)

  // Handle drag start
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editing) return
    
    setIsDragging(true)
    
    // Store the initial mouse position and note position
    const initialMouseX = e.clientX
    const initialMouseY = e.clientY
    const initialNoteX = position.x
    const initialNoteY = position.y
    
    // Function to handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      // Calculate the new position
      const newX = initialNoteX + (e.clientX - initialMouseX)
      const newY = initialNoteY + (e.clientY - initialMouseY)
      
      // Update the note position
      setPosition({ x: newX, y: newY })
    }
    
    // Function to handle mouse up
    const handleMouseUp = () => {
      setIsDragging(false)
      // Notify parent component of the new position
      onMove(note.id, position)
      
      // Remove event listeners
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
    
    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  // Handle updating the note content
  const handleUpdate = () => {
    if (content.trim() === '') {
      onDelete(note.id)
    } else {
      onUpdate(note.id, content)
    }
    setEditing(false)
  }

  // Handle enter key to save note
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleUpdate()
    }
  }

  return (
    <div
      ref={noteRef}
      className="absolute shadow-md rounded-md w-60 cursor-move"
      style={{
        backgroundColor: note.color,
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: editing ? 100 : 10,
      }}
      onMouseDown={handleDragStart}
    >
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
              <img
                src={note.author.avatar}
                alt={note.author.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium">{note.author.name}</span>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                setEditing(true)
              }}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {editing ? (
          <div onClick={(e) => e.stopPropagation()}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 text-sm rounded-md border border-gray-300 resize-none min-h-24 bg-white"
              autoFocus
            />
            <div className="flex justify-end mt-2">
              <Button 
                size="sm" 
                variant="default" 
                onClick={handleUpdate}
                className="text-xs px-3 py-1 h-7"
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm whitespace-pre-wrap break-words">{note.content}</p>
        )}
        
        <div className="mt-2 text-xs text-gray-600">
          {formatRelativeTime(note.createdAt)}
        </div>
      </div>
    </div>
  )
}

/**
 * Whiteboard component for displaying the collaborative workspace
 */
interface WhiteboardProps {
  session: WhiteboardSession
  onAddNote: (note: Omit<Note, 'id' | 'createdAt'>) => void
  onUpdateNote: (id: string, content: string) => void
  onDeleteNote: (id: string) => void
  onMoveNote: (id: string, position: { x: number; y: number }) => void
}

const Whiteboard: React.FC<WhiteboardProps> = ({
  session,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onMoveNote,
}) => {
  const [selectedColor, setSelectedColor] = useState(noteColors[0])
  const whiteboardRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  // Handle creating a new note
  const handleAddNote = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!whiteboardRef.current) return
    
    // Only add a note if clicking directly on the whiteboard (not on a note)
    if ((e.target as HTMLElement).closest('.sticky-note')) return
    
    // Get the click position relative to the whiteboard
    const rect = whiteboardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Create a new note
    onAddNote({
      content: '',
      color: selectedColor,
      author: {
        id: 'current-user',
        name: 'You',
        avatar: 'https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff',
      },
      position: { x, y },
    })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-card border-b p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="font-medium">{session.name}</h3>
          <span className="text-sm text-muted-foreground">
            Last active {formatRelativeTime(session.lastActive)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="mr-2">
            <Palette className="h-4 w-4 text-muted-foreground mr-1 inline-block" />
            <span className="text-sm">Note color:</span>
          </div>
          <div className="flex space-x-1">
            {noteColors.map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full ${
                  selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div
        ref={whiteboardRef}
        className="flex-grow relative overflow-auto"
        style={{
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
          backgroundImage: `radial-gradient(${
            theme === 'dark' ? '#333333' : '#e0e0e0'
          } 1px, transparent 0)`,
          backgroundSize: '20px 20px',
          height: 'calc(100vh - 300px)',
        }}
        onClick={handleAddNote}
      >
        {session.notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onDelete={onDeleteNote}
            onUpdate={onUpdateNote}
            onMove={onMoveNote}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Chat component for team communication alongside the whiteboard
 */
interface ChatProps {
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
}

const Chat: React.FC<ChatProps> = ({ messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    
    try {
      setSending(true)
      await onSendMessage(newMessage)
      setNewMessage('')
    } finally {
      setSending(false)
    }
  }

  // Handle enter key to send message
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full border-l">
      <div className="bg-card border-b p-3">
        <h3 className="font-medium">Team Chat</h3>
      </div>
      
      <div className="flex-grow overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="flex items-start space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img
                src={message.sender.avatar}
                alt={message.sender.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-baseline">
                <span className="font-medium text-sm">{message.sender.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {formatRelativeTime(message.timestamp)}
                </span>
              </div>
              <p className="text-sm mt-1 whitespace-pre-wrap">{message.text}</p>
              
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2">
                  {message.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center p-2 bg-muted rounded-md text-xs">
                      <Paperclip className="h-3 w-3 mr-2 text-muted-foreground" />
                      <span className="font-medium">{attachment.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t">
        <div className="flex items-center space-x-2">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full p-2 text-sm rounded-md border resize-none min-h-10 max-h-32"
          />
          <div className="flex flex-shrink-0 space-x-1">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sending}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CollaborationBoard component for team collaboration and whiteboarding
 */
const CollaborationBoard = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<WhiteboardSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<WhiteboardSession | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"whiteboard" | "chat" | "split">("split");

  // Fetch sessions on component mount
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/collaboration/sessions');
        // const data = await response.json();
        
        setSessions(mockWhiteboardSessions);
        
        // Set the first session as active by default
        if (mockWhiteboardSessions.length > 0) {
          setActiveSessionId(mockWhiteboardSessions[0].id);
          setActiveSession(mockWhiteboardSessions[0]);
        }
      } catch (error) {
        console.error("Failed to fetch collaboration sessions:", error);
        toast.error("Failed to load collaboration sessions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  // Fetch chat messages when active session changes
  useEffect(() => {
    if (!activeSessionId) return;
    
    const fetchChatMessages = async () => {
      try {
        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // In a real app, this would be an API call
        // const response = await fetch(`/api/collaboration/sessions/${activeSessionId}/messages`);
        // const data = await response.json();
        
        setChatMessages(mockChatMessages);
      } catch (error) {
        console.error("Failed to fetch chat messages:", error);
        toast.error("Failed to load chat messages. Please try again.");
      }
    };

    fetchChatMessages();
  }, [activeSessionId]);

  // Change active session
  const handleSessionChange = (sessionId: string) => {
    setActiveSessionId(sessionId);
    const session = sessions.find((s) => s.id === sessionId) || null;
    setActiveSession(session);
  };

  // Add a new note to the whiteboard
  const handleAddNote = (note: Omit<Note, 'id' | 'createdAt'>) => {
    if (!activeSession) return;
    
    const newNote: Note = {
      ...note,
      id: `note-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    
    const updatedSession = {
      ...activeSession,
      notes: [...activeSession.notes, newNote],
      lastActive: new Date().toISOString(),
    };
    
    // Update active session
    setActiveSession(updatedSession);
    
    // Update sessions list
    setSessions(
      sessions.map((session) =>
        session.id === activeSession.id ? updatedSession : session
      )
    );
    
    toast.success("Note added");
  };

  // Update a note's content
  const handleUpdateNote = (id: string, content: string) => {
    if (!activeSession) return;
    
    const updatedNotes = activeSession.notes.map((note) =>
      note.id === id ? { ...note, content } : note
    );
    
    const updatedSession = {
      ...activeSession,
      notes: updatedNotes,
      lastActive: new Date().toISOString(),
    };
    
    // Update active session
    setActiveSession(updatedSession);
    
    // Update sessions list
    setSessions(
      sessions.map((session) =>
        session.id === activeSession.id ? updatedSession : session
      )
    );
    
    toast.success("Note updated");
  };

  // Delete a note
  const handleDeleteNote = (id: string) => {
    if (!activeSession) return;
    
    const updatedNotes = activeSession.notes.filter((note) => note.id !== id);
    
    const updatedSession = {
      ...activeSession,
      notes: updatedNotes,
      lastActive: new Date().toISOString(),
    };
    
    // Update active session
    setActiveSession(updatedSession);
    
    // Update sessions list
    setSessions(
      sessions.map((session) =>
        session.id === activeSession.id ? updatedSession : session
      )
    );
    
    toast.success("Note deleted");
  };

  // Move a note
  const handleMoveNote = (id: string, position: { x: number; y: number }) => {
    if (!activeSession) return;
    
    const updatedNotes = activeSession.notes.map((note) =>
      note.id === id ? { ...note, position } : note
    );
    
    const updatedSession = {
      ...activeSession,
      notes: updatedNotes,
      lastActive: new Date().toISOString(),
    };
    
    // Update active session
    setActiveSession(updatedSession);
    
    // Update sessions list
    setSessions(
      sessions.map((session) =>
        session.id === activeSession.id ? updatedSession : session
      )
    );
  };

  // Send a chat message
  const handleSendMessage = async (text: string) => {
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Create a new message using actual user information
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      text,
      sender: {
        id: user?.id || 'current-user',
        name: user?.name || 'You',
        avatar: user?.avatar || 'https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff',
      },
      timestamp: new Date().toISOString(),
    };
    
    // Update chat messages
    setChatMessages([...chatMessages, newMessage]);
    
    // Update session last active time
    if (activeSession) {
      const updatedSession = {
        ...activeSession,
        lastActive: new Date().toISOString(),
      };
      
      // Update active session
      setActiveSession(updatedSession);
      
      // Update sessions list
      setSessions(
        sessions.map((session) =>
          session.id === activeSession.id ? updatedSession : session
        )
      );
    }
  };

  // Create a new whiteboard session
  const handleCreateSession = async () => {
    // Use the user information for the new session creator
    const creatorName = user?.name || "Anonymous";
    
    toast.success(`New collaboration session will be created by ${creatorName}. This feature is not implemented in the mock version.`);
  };

  return (
    <div className="container px-4 py-6 mx-auto max-w-7xl">
      <PageHeader
        title="Collaboration Board"
        description={`Work together with your team using interactive whiteboards and real-time chat. ${user?.name ? `Welcome, ${user.name}!` : ''}`}
        actions={
          <Button onClick={handleCreateSession}>
            <Plus className="w-4 h-4 mr-2" />
            New Whiteboard
          </Button>
        }
      />
      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
            <span className="text-sm text-muted-foreground">Loading collaboration boards...</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && sessions.length === 0 && (
        <EmptyState
          title="No collaboration sessions found"
          description="Create a new whiteboard to start collaborating with your team."
          icon={<Users className="w-12 h-12 text-muted-foreground" />}
          action={
            <Button onClick={handleCreateSession}>
              <Plus className="w-4 h-4 mr-2" />
              New Whiteboard
            </Button>
          }
        />
      )}

      {/* Session selection and content */}
      {!loading && sessions.length > 0 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-grow">
                  <Select
                    value={activeSessionId || ""}
                    onValueChange={handleSessionChange}
                  >
                    <SelectTrigger className="w-full md:w-80">
                      <SelectValue placeholder="Select a whiteboard" />
                    </SelectTrigger>
                    <SelectContent>
                      {sessions.map((session) => (
                        <SelectItem key={session.id} value={session.id}>
                          <div className="flex items-center">
                            <span>{session.name}</span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              ({session.project})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2 hidden md:inline-block">
                    View mode:
                  </span>
                  <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full md:w-auto">
                    <TabsList className="grid w-full grid-cols-3 md:w-auto">
                      <TabsTrigger value="whiteboard">Whiteboard</TabsTrigger>
                      <TabsTrigger value="chat">Chat</TabsTrigger>
                      <TabsTrigger value="split">Split</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {activeSession && (
            <Card className="overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                {/* Whiteboard */}
                {(view === "whiteboard" || view === "split") && (
                  <div className={view === "whiteboard" ? "col-span-2" : "col-span-2 lg:col-span-1"}>
                    <Whiteboard
                      session={activeSession}
                      onAddNote={handleAddNote}
                      onUpdateNote={handleUpdateNote}
                      onDeleteNote={handleDeleteNote}
                      onMoveNote={handleMoveNote}
                    />
                  </div>
                )}
                
                {/* Chat */}
                {(view === "chat" || view === "split") && (
                  <div className={view === "chat" ? "col-span-2" : "col-span-2 lg:col-span-1"}>
                    <Chat
                      messages={chatMessages}
                      onSendMessage={handleSendMessage}
                    />
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Participants */}
          {activeSession && (
            <Card>
              <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                  Team members currently collaborating in this session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {activeSession.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex flex-col items-center"
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                        <img
                          src={participant.avatar}
                          alt={participant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-center">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default CollaborationBoard