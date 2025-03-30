import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PageHeader from "@/components/common/PageHeader";
import {
  Send,
  Search,
  Paperclip,
  Image as ImageIcon,
  Smile,
  MoreVertical,
  Users,
  PlusCircle,
  UserPlus,
  Phone,
  Video,
  Info,
  Loader2,
  CheckCircle,
  Circle,
  Pin,
  MessageSquare,
  ArrowDownToLine,
  X,
  Hash,
  BellOff,
} from "lucide-react";

/**
 * Custom Input component that supports prefix and suffix
 */
import { Input } from "@/components/ui/custom-input";

/**
 * Chat User type definition
 */
interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
  status?: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
}

/**
 * Chat Message type definition
 */
interface ChatMessage {
  id: string;
  content: string;
  sender: ChatUser;
  timestamp: string;
  read?: boolean;
  edited?: boolean;
  attachments?: {
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

/**
 * Chat Channel type definition with optional but consistently defined properties
 */
interface ChatChannel {
  id: string;
  name: string;
  type: "direct" | "group" | "project";
  members: ChatUser[];
  messages: ChatMessage[];
  unreadCount?: number;
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  project?: {
    id: string;
    name: string;
  };
  isPinned?: boolean;
}

/**
 * Mock users for chat
 */
const mockUsers: ChatUser[] = [
  {
    id: "user-123",
    name: "John Smith",
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=f43f5e&color=fff",
    email: "john@example.com",
    role: "Project Manager",
    status: "online",
  },
  {
    id: "user-456",
    name: "Sarah Johnson",
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10b981&color=fff",
    email: "sarah@example.com",
    role: "Backend Developer",
    status: "online",
  },
  {
    id: "user-789",
    name: "Mike Williams",
    avatar: "https://ui-avatars.com/api/?name=Mike+Williams&background=6366f1&color=fff",
    email: "mike@example.com",
    role: "Frontend Developer",
    status: "away",
    lastSeen: "2025-03-30T10:30:00Z",
  },
  {
    id: "user-101",
    name: "Alex Brown",
    avatar: "https://ui-avatars.com/api/?name=Alex+Brown&background=fbbf24&color=fff",
    email: "alex@example.com",
    role: "UI/UX Designer",
    status: "offline",
    lastSeen: "2025-03-29T16:45:00Z",
  },
  {
    id: "user-202",
    name: "Emily Davis",
    avatar: "https://ui-avatars.com/api/?name=Emily+Davis&background=ec4899&color=fff",
    email: "emily@example.com",
    role: "QA Engineer",
    status: "busy",
  },
  {
    id: "client-303",
    name: "Robert Chen",
    avatar: "https://ui-avatars.com/api/?name=Robert+Chen&background=0ea5e9&color=fff",
    email: "robert@clientcompany.com",
    role: "Client Representative",
    status: "offline",
    lastSeen: "2025-03-28T14:15:00Z",
  },
];

/**
 * Generate mock chat messages
 */
function generateMockMessages(users: ChatUser[], count: number): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const now = new Date();
  
  const messageContents = [
    "Hi team, just checking in on the progress for the authentication module.",
    "I've pushed the latest changes for the product listing page. Can someone review my PR?",
    "The client has requested a change to the checkout flow. We should discuss this in the next meeting.",
    "I've noticed a performance issue with the API. Working on optimizing it now.",
    "Just a reminder that we have a team meeting tomorrow at 10 AM.",
    "Has anyone seen the new design specs for the mobile layout?",
    "The database schema changes are complete and have been deployed to staging.",
    "I'll be working remotely tomorrow, but available on chat all day.",
    "Great work on fixing that critical bug everyone!",
    "We need to schedule a demo with the client for next week.",
  ];
  
  const attachmentTypes = [
    { name: "design_mockup.fig", type: "application/octet-stream", size: 2500000 },
    { name: "project_timeline.pdf", type: "application/pdf", size: 1200000 },
    { name: "screenshot.png", type: "image/png", size: 850000 },
    { name: "requirements.docx", type: "application/msword", size: 650000 },
    { name: "api_documentation.md", type: "text/markdown", size: 450000 },
  ];
  
  for (let i = 0; i < count; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const messageTime = new Date(now);
    messageTime.setMinutes(now.getMinutes() - i * 30);
    
    const hasAttachment = Math.random() < 0.2; // 20% chance to have attachment
    const attachments = hasAttachment
      ? [
          {
            id: `attachment-${i}`,
            ...attachmentTypes[Math.floor(Math.random() * attachmentTypes.length)],
            url: "#",
          },
        ]
      : undefined;
    
    const hasReactions = Math.random() < 0.3; // 30% chance to have reactions
    const reactions = hasReactions
      ? [
          {
            emoji: ["👍", "❤️", "😂", "👏", "🎉"][Math.floor(Math.random() * 5)],
            count: Math.floor(Math.random() * 3) + 1,
            users: [users[Math.floor(Math.random() * users.length)].id],
          },
        ]
      : undefined;
    
    messages.push({
      id: `msg-${i}`,
      content: messageContents[Math.floor(Math.random() * messageContents.length)],
      sender,
      timestamp: messageTime.toISOString(),
      read: messageTime.getTime() < now.getTime() - 60000,
      edited: Math.random() < 0.1, // 10% chance to be edited
      attachments,
      reactions,
    });
  }
  
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Mock chat channels with proper lastMessage handling
 */
function generateMockChannels(): ChatChannel[] {
  // Direct messages
  const directChannels = mockUsers.map((user, index) => {
    const messages = generateMockMessages([user, mockUsers[0]], Math.floor(Math.random() * 15) + 5);
    const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
    
    return {
      id: `channel-dm-${index}`,
      name: user.name,
      type: "direct" as const,
      members: [user, mockUsers[0]],
      messages,
      unreadCount: index === 2 ? 3 : index === 4 ? 1 : 0,
      lastMessage: lastMessage ? {
        content: lastMessage.content,
        timestamp: lastMessage.timestamp,
        sender: lastMessage.sender.id,
      } : undefined,
      isPinned: index === 1,
    };
  });
  
  // Group channels
  const groupChannels: ChatChannel[] = [
    {
      id: "channel-group-1",
      name: "Development Team",
      type: "group" as const,
      members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[4]],
      messages: generateMockMessages(mockUsers, 25),
      unreadCount: 5,
      isPinned: true,
    },
    {
      id: "channel-group-2",
      name: "Design Discussion",
      type: "group" as const,
      members: [mockUsers[0], mockUsers[2], mockUsers[3]],
      messages: generateMockMessages(mockUsers, 12),
      unreadCount: 0,
    },
  ];
  
  // Project channels
  const projectChannels: ChatChannel[] = [
    {
      id: "channel-project-1",
      name: "E-commerce App",
      type: "project" as const,
      members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3], mockUsers[4]],
      messages: generateMockMessages(mockUsers, 30),
      unreadCount: 7,
      project: {
        id: "proj-1",
        name: "E-commerce App",
      },
      isPinned: true,
    },
    {
      id: "channel-project-2",
      name: "CRM System",
      type: "project" as const,
      members: [mockUsers[0], mockUsers[1], mockUsers[4], mockUsers[5]],
      messages: generateMockMessages(mockUsers, 18),
      unreadCount: 0,
      project: {
        id: "proj-2",
        name: "CRM System",
      },
    },
  ];
  
  // Add last message to group channels that don't have one
  groupChannels.forEach(channel => {
    if (!channel.lastMessage && channel.messages.length > 0) {
      const lastMsg = channel.messages[channel.messages.length - 1];
      channel.lastMessage = {
        content: lastMsg.content,
        timestamp: lastMsg.timestamp,
        sender: lastMsg.sender.id,
      };
    }
  });
  
  // Add last message to project channels that don't have one
  projectChannels.forEach(channel => {
    if (!channel.lastMessage && channel.messages.length > 0) {
      const lastMsg = channel.messages[channel.messages.length - 1];
      channel.lastMessage = {
        content: lastMsg.content,
        timestamp: lastMsg.timestamp,
        sender: lastMsg.sender.id,
      };
    }
  });
  
  return [...directChannels, ...groupChannels, ...projectChannels];
}

/**
 * Get status icon and color for user status
 */
function getUserStatusIndicator(status?: string) {
  switch (status) {
    case "online":
      return { icon: <Circle className="fill-green-500 text-green-500" />, color: "bg-green-500" };
    case "away":
      return { icon: <Circle className="fill-yellow-500 text-yellow-500" />, color: "bg-yellow-500" };
    case "busy":
      return { icon: <Circle className="fill-red-500 text-red-500" />, color: "bg-red-500" };
    case "offline":
    default:
      return { icon: <Circle className="fill-gray-400 text-gray-400" />, color: "bg-gray-400" };
  }
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
const formatRelativeTime = (dateString: string, shortFormat: boolean = false): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  
  // If today, show time
  if (date.getTime() >= todayStart) {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  }
  
  // If yesterday, show "Yesterday"
  if (date.getTime() >= yesterdayStart.getTime()) {
    return shortFormat ? "Yesterday" : "Yesterday at " + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  }
  
  // If within a week, show day name
  if (diffInSeconds < 7 * 24 * 60 * 60) {
    return date.toLocaleDateString([], { weekday: 'short' });
  }
  
  // Otherwise, show date
  return date.toLocaleDateString([], { 
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

/**
 * Format file size to human readable format
 */
const formatFileSize = (sizeInBytes: number): string => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " B";
  } else if (sizeInBytes < 1024 * 1024) {
    return (sizeInBytes / 1024).toFixed(1) + " KB";
  } else {
    return (sizeInBytes / (1024 * 1024)).toFixed(1) + " MB";
  }
};

/**
 * ChannelListItem component for displaying a channel in the sidebar
 */
interface ChannelListItemProps {
  channel: ChatChannel;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

const ChannelListItem: React.FC<ChannelListItemProps> = ({
  channel,
  isActive,
  onClick,
  currentUserId,
}) => {
  // For direct channels, filter out the current user to show the other person
  const otherUser = channel.type === "direct"
    ? channel.members.find(member => member.id !== currentUserId)
    : undefined;
  
  // Get the status indicator for direct channels
  const statusIndicator = channel.type === "direct" && otherUser
    ? getUserStatusIndicator(otherUser.status)
    : undefined;
  
  // Get the last message sender name (if not the current user)
  const lastMessageSenderName = channel.lastMessage && channel.lastMessage.sender !== currentUserId
    ? channel.members.find(member => member.id === channel.lastMessage?.sender)?.name.split(" ")[0]
    : undefined;
  
  return (
    <div
      className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-primary/10 dark:bg-primary/20"
          : "hover:bg-muted"
      }`}
      onClick={onClick}
    >
      {/* Channel icon/avatar */}
      <div className="relative flex-shrink-0">
        {channel.type === "direct" && otherUser ? (
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : channel.type === "group" ? (
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
        ) : (
          <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Hash className="h-5 w-5 text-primary" />
          </div>
        )}
        
        {/* Status indicator for direct channels */}
        {channel.type === "direct" && statusIndicator && (
          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ${statusIndicator.color} border-2 border-background`} />
        )}
        
        {/* Pin indicator */}
        {channel.isPinned && (
          <div className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Pin className="h-2.5 w-2.5" />
          </div>
        )}
      </div>
      
      {/* Channel info */}
      <div className="ml-3 flex-grow min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">
            {channel.type === "direct" && otherUser ? otherUser.name : channel.name}
          </p>
          {channel.lastMessage && (
            <span className="text-xs text-muted-foreground">
              {formatRelativeTime(channel.lastMessage.timestamp, true)}
            </span>
          )}
        </div>
        {channel.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">
            {lastMessageSenderName ? `${lastMessageSenderName}: ` : ""}
            {channel.lastMessage.content}
          </p>
        )}
      </div>
      
      {/* Unread count */}
      {channel.unreadCount && channel.unreadCount > 0 && (
        <div className="ml-2 bg-primary text-primary-foreground rounded-full h-5 min-w-5 flex items-center justify-center text-xs px-1.5">
          {channel.unreadCount}
        </div>
      )}
    </div>
  );
};

/**
 * ChatSidebar component for displaying channels list
 */
interface ChatSidebarProps {
  channels: ChatChannel[];
  activeChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  currentUserId: string;
  onCreateChannel: () => void;
  onSearchUsers: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  channels,
  activeChannelId,
  onChannelSelect,
  currentUserId,
  onCreateChannel,
  onSearchUsers,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "direct" | "groups" | "projects">("all");
  
  // Filter channels based on search query and active tab
  const filteredChannels = channels.filter(channel => {
    // Filter by search query
    if (searchQuery) {
      if (channel.type === "direct") {
        const otherUser = channel.members.find(member => member.id !== currentUserId);
        return otherUser && otherUser.name.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      }
    }
    
    // Filter by tab
    if (activeTab === "all") return true;
    if (activeTab === "direct") return channel.type === "direct";
    if (activeTab === "groups") return channel.type === "group";
    if (activeTab === "projects") return channel.type === "project";
    
    return true;
  });
  
  // Sort channels: pinned first, then with unread messages, then alphabetically
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    // Pinned channels first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then channels with unread messages
    if ((a.unreadCount || 0) > 0 && (b.unreadCount || 0) === 0) return -1;
    if ((a.unreadCount || 0) === 0 && (b.unreadCount || 0) > 0) return 1;
    
    // Then sort by last message timestamp
    if (a.lastMessage && b.lastMessage) {
      return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
    }
    
    // Finally alphabetically
    const aName = a.type === "direct" 
      ? a.members.find(member => member.id !== currentUserId)?.name || ""
      : a.name;
    
    const bName = b.type === "direct"
      ? b.members.find(member => member.id !== currentUserId)?.name || ""
      : b.name;
    
    return aName.localeCompare(bName);
  });
  
  return (
    <div className="w-full h-full flex flex-col">
      {/* Search and actions */}
    <div className="p-3 border-b">
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefixIcon={<Search className="w-4 h-4 text-muted-foreground" />}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onCreateChannel}>
                <PlusCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New conversation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onSearchUsers}>
                <UserPlus className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Find users</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
      
      {/* Tabs */}
      <div className="px-2 pt-2">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="direct">Direct</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Channels list */}
      <ScrollArea className="flex-grow p-2">
        {sortedChannels.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No conversations found</p>
            <p className="text-xs mt-1">Try a different search or tab</p>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedChannels.map((channel) => (
              <ChannelListItem
                key={channel.id}
                channel={channel}
                isActive={channel.id === activeChannelId}
                onClick={() => onChannelSelect(channel.id)}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

/**
 * ChatMessage component for displaying a single message
 */
interface ChatMessageProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showSender: boolean;
  timeFormat?: "relative" | "absolute";
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({
  message,
  isCurrentUser,
  showSender,
  timeFormat = "relative",
}) => {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} mb-4`}>
      {/* Avatar (for other users) */}
      {!isCurrentUser && showSender && (
        <div className="mr-3 flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      )}
      
      {/* Message content */}
      <div className={`max-w-3/4 ${isCurrentUser ? "items-end" : "items-start"}`}>
        {/* Sender name */}
        {showSender && !isCurrentUser && (
          <div className="flex items-center mb-1">
            <span className="font-medium text-sm">{message.sender.name}</span>
            <span className="text-xs text-muted-foreground ml-2">
              {timeFormat === "relative"
                ? formatRelativeTime(message.timestamp)
                : new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`px-3 py-2 rounded-lg ${
            isCurrentUser
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        
        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`p-3 rounded-md flex items-center ${
                  isCurrentUser ? "bg-primary/80 text-primary-foreground" : "bg-muted"
                }`}
              >
                <Paperclip className="h-4 w-4 mr-2 flex-shrink-0" />
                <div className="min-w-0 flex-grow">
                  <p className="font-medium text-sm truncate">{attachment.name}</p>
                  <p className="text-xs opacity-80">{formatFileSize(attachment.size)}</p>
                </div>
                <Button
                  variant={isCurrentUser ? "secondary" : "outline"}
                  size="sm"
                  className="ml-2 flex-shrink-0"
                >
                  <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Download</span>
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex mt-1 gap-1">
            {message.reactions.map((reaction, index) => (
              <div
                key={index}
                className="flex items-center bg-muted rounded-full px-2 py-0.5 text-xs"
              >
                <span className="mr-1">{reaction.emoji}</span>
                <span>{reaction.count}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Message metadata */}
        {!showSender && (
          <div className="flex items-center mt-1">
            {message.edited && <span className="text-xs text-muted-foreground mr-2">Edited</span>}
            <span className="text-xs text-muted-foreground">
              {timeFormat === "relative"
                ? formatRelativeTime(message.timestamp)
                : new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </span>
            {isCurrentUser && message.read && (
              <span className="ml-2">
                <CheckCircle className="h-3 w-3 text-primary" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ChatHeader component for displaying the active channel header
 */
interface ChatHeaderProps {
  channel: ChatChannel;
  currentUserId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ channel, currentUserId }) => {
  // For direct channels, filter out the current user to show the other person
  const otherUser = channel.type === "direct"
    ? channel.members.find(member => member.id !== currentUserId)
    : undefined;
  
  // Get the status indicator for direct channels
  const statusIndicator = channel.type === "direct" && otherUser
    ? getUserStatusIndicator(otherUser.status)
    : undefined;
  
  return (
    <div className="flex items-center justify-between p-3 border-b">
      <div className="flex items-center">
        {/* Channel icon/avatar */}
        <div className="relative flex-shrink-0">
          {channel.type === "direct" && otherUser ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ) : channel.type === "group" ? (
            <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
          ) : (
            <div className="h-9 w-9 bg-primary/10 rounded-full flex items-center justify-center">
              <Hash className="h-4 w-4 text-primary" />
            </div>
          )}
          
          {/* Status indicator for direct channels */}
          {channel.type === "direct" && statusIndicator && (
            <div className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ${statusIndicator.color} border-2 border-background`} />
          )}
        </div>
        
        {/* Channel info */}
        <div className="ml-3">
          <h2 className="font-semibold">
            {channel.type === "direct" && otherUser ? otherUser.name : channel.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {channel.type === "direct" && otherUser ? (
              <>
                {otherUser.status === "online"
                  ? "Online"
                  : otherUser.status === "away"
                  ? "Away"
                  : otherUser.status === "busy"
                  ? "Do not disturb"
                  : otherUser.lastSeen
                  ? `Last seen ${formatRelativeTime(otherUser.lastSeen)}`
                  : "Offline"}
              </>
            ) : (
              <>
                {channel.members.length} members
                {channel.project && ` • Project: ${channel.project.name}`}
              </>
            )}
          </p>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1">
        {channel.type === "direct" && (
          <>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
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
                    <Video className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Video call</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </>
        )}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Info</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                {channel.isPinned ? <Pin className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{channel.isPinned ? "Unpin" : "Mute notifications"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuItem>Add members</DropdownMenuItem>
            <DropdownMenuItem>View files</DropdownMenuItem>
            {channel.type !== "direct" && <DropdownMenuItem>Rename</DropdownMenuItem>}
            <DropdownMenuItem>Clear history</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Leave conversation</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

/**
 * ChatInput component for sending messages
 */
interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAttachFile: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onAttachFile }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSendMessage = () => {
    if (!message.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate sending message
    setTimeout(() => {
      onSendMessage(message);
      setMessage("");
      setIsSubmitting(false);
    }, 300);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="p-3 border-t">
      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <div className="relative">
            <textarea
              className="w-full px-3 py-2 border rounded-md resize-none min-h-24 max-h-64"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSubmitting}
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAttachFile}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach file</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach image</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add emoji</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <Button onClick={handleSendMessage} disabled={!message.trim() || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

/**
 * ChatContent component for displaying messages
 */
interface ChatContentProps {
  channel: ChatChannel;
  currentUserId: string;
  onSendMessage: (channelId: string, message: string) => void;
}

const ChatContent: React.FC<ChatContentProps> = ({
  channel,
  currentUserId,
  onSendMessage,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [channel.messages]);
  
  // Group messages by date
  const groupedMessages = channel.messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);
  
  // Sort dates
  const sortedDates = Object.keys(groupedMessages).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  
  // Handle sending a message
  const handleSendMessage = (message: string) => {
    onSendMessage(channel.id, message);
  };
  
  // Handle attaching a file
  const handleAttachFile = () => {
    toast("File attachment feature", {
      description: "This feature is not implemented in this demo"
    });
  };
  
  // Handle scroll events to show/hide scroll to bottom button
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollToBottom(isScrolledUp);
  };
  
  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  return (
    <div className="flex flex-col h-full">
      <ChatHeader channel={channel} currentUserId={currentUserId} />
      
      <div 
        className="flex-grow overflow-y-auto p-4" 
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        {/* Messages by date */}
        {sortedDates.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4">
            <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
            <h3 className="text-lg font-medium">No messages yet</h3>
            <p className="text-sm mt-1 max-w-md">
              {channel.type === "direct"
                ? "Start a conversation by sending a message."
                : "Be the first to send a message in this channel."}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t"></div>
                  <span className="flex-shrink-0 mx-2 text-xs text-muted-foreground">
                    {new Date(date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <div className="flex-grow border-t"></div>
                </div>
                
                <div className="space-y-1">
                  {groupedMessages[date].map((message, index) => {
                    // Determine if we should show the sender info
                    // Show if it's the first message of the group or if the sender changed
                    const prevMessage = index > 0 ? groupedMessages[date][index - 1] : null;
                    const showSender = !prevMessage || prevMessage.sender.id !== message.sender.id;
                    
                    return (
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        isCurrentUser={message.sender.id === currentUserId}
                        showSender={showSender}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollToBottom && (
        <div className="absolute bottom-20 right-8">
          <Button 
            size="sm" 
            variant="secondary" 
            className="rounded-full p-2 h-10 w-10 shadow-md"
            onClick={scrollToBottom}
          >
            <ArrowDownToLine className="h-5 w-5" />
          </Button>
        </div>
      )}
      
      <ChatInput onSendMessage={handleSendMessage} onAttachFile={handleAttachFile} />
    </div>
  );
};

/**
 * EmptyState component for when no channel is selected
 */
const EmptyState: React.FC = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center p-4">
      <MessageSquare className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Your Messages</h2>
      <p className="text-muted-foreground max-w-md mb-6">
        Select a conversation from the sidebar or start a new one to begin messaging.
      </p>
      <div className="flex gap-3">
        <Button variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Find Users
        </Button>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
    </div>
  );
};

/**
 * TeamChat component for team member communication
 */
const TeamChat = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Fetch channels on component mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        setLoading(true);
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would be an API call
        // const response = await fetch('/api/chat/channels');
        // const data = await response.json();
        
        const mockChannels = generateMockChannels();
        setChannels(mockChannels);
        
        // Set the first channel as active by default
        if (mockChannels.length > 0) {
          setActiveChannelId(mockChannels[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch chat channels:", error);
        toast("Failed to load chat channels", {
          description: "Please try again or contact support if the problem persists.",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchChannels();
  }, []);
  
  // Get the active channel
  const activeChannel = channels.find(channel => channel.id === activeChannelId) || null;
  
  // Handle selecting a channel
  const handleChannelSelect = (channelId: string) => {
    setActiveChannelId(channelId);
    
    // Mark channel as read
    setChannels(channels.map(channel => 
      channel.id === channelId 
        ? { ...channel, unreadCount: 0 } 
        : channel
    ));
    
    // Close mobile menu when selecting a channel
    setShowMobileMenu(false);
  };
  
  // Handle creating a new channel
  const handleCreateChannel = () => {
    toast("Creating new conversation", {
      description: "This feature is not implemented in this demo"
    });
  };
  
  // Handle searching users
  const handleSearchUsers = () => {
    toast("Searching users", {
      description: "This feature is not implemented in this demo"
    });
  };
  
  // Handle sending a message
  const handleSendMessage = (channelId: string, content: string) => {
    // Find the channel
    const channel = channels.find(c => c.id === channelId);
    if (!channel) return;
    
    // Create a new message
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      sender: {
        id: user?.id || "current-user",
        name: user?.name || "You",
        avatar: user?.avatar || "https://ui-avatars.com/api/?name=Team+Member&background=10b981&color=fff",
        status: "online",
      },
      timestamp: new Date().toISOString(),
      read: true,
    };
    
    // Update the channel with the new message
    const updatedChannel = {
      ...channel,
      messages: [...channel.messages, newMessage],
      lastMessage: {
        content,
        timestamp: new Date().toISOString(),
        sender: user?.id || "current-user",
      },
    };
    
    // Update channels list
    setChannels(
      channels.map(c => (c.id === channelId ? updatedChannel : c))
    );
  };
  
  return (
    <div className="container mx-auto py-6 px-4 h-[calc(100vh-4rem)] max-w-7xl">
      <PageHeader
        title="Team Chat"
        description="Communicate with your team members and clients in real-time."
      />
      
      {/* Loading state */}
      {loading ? (
        <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      ) : (
        <Card className="mt-4 flex h-[calc(100vh-12rem)] overflow-hidden">
          {/* Mobile view toggle button */}
          <div className="md:hidden absolute top-20 left-6 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="flex items-center justify-center"
            >
              {showMobileMenu ? (
                <X className="h-4 w-4 mr-2" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              {showMobileMenu ? "Close" : "Conversations"}
            </Button>
          </div>
          
          {/* Sidebar (hidden on mobile unless toggled) */}
          <div
            className={`w-full md:w-80 border-r flex-shrink-0 ${
              showMobileMenu ? "block" : "hidden md:block"
            }`}
          >
            <ChatSidebar
              channels={channels}
              activeChannelId={activeChannelId}
              onChannelSelect={handleChannelSelect}
              currentUserId={user?.id || "current-user"}
              onCreateChannel={handleCreateChannel}
              onSearchUsers={handleSearchUsers}
            />
          </div>
          
          {/* Chat content (hidden on mobile when sidebar is shown) */}
          <div 
            className={`flex-grow relative ${
              showMobileMenu ? "hidden md:block" : "block"
            }`}
          >
            {activeChannel ? (
              <ChatContent
                channel={activeChannel}
                currentUserId={user?.id || "current-user"}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TeamChat;