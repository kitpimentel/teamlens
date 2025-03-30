/**
 * Types for the Team Lens Chat System
 */

// User status options
export type UserStatus = "online" | "offline" | "away" | "busy";

// User roles from the application
export type UserRole = "superAdmin" | "orgAdmin" | "teamMember" | "client";

/**
 * Chat User type definition
 */
export interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  email?: string;
  role?: string;
  status?: UserStatus;
  lastSeen?: string;
}

/**
 * Chat Message type definition
 */
export interface ChatMessage {
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
 * Chat Channel type definition with optional lastMessage property
 */
export interface ChatChannel {
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
 * Channel list item properties
 */
export interface ChannelListItemProps {
  channel: ChatChannel;
  isActive: boolean;
  onClick: () => void;
  currentUserId: string;
}

/**
 * Chat sidebar properties
 */
export interface ChatSidebarProps {
  channels: ChatChannel[];
  activeChannelId: string | null;
  onChannelSelect: (channelId: string) => void;
  currentUserId: string;
  onCreateChannel: () => void;
  onSearchUsers: () => void;
}

/**
 * Chat message component properties
 */
export interface ChatMessageProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showSender: boolean;
  timeFormat?: "relative" | "absolute";
}

/**
 * Chat header component properties
 */
export interface ChatHeaderProps {
  channel: ChatChannel;
  currentUserId: string;
}

/**
 * Chat input component properties
 */
export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onAttachFile: () => void;
}

/**
 * Chat content component properties
 */
export interface ChatContentProps {
  channel: ChatChannel;
  currentUserId: string;
  onSendMessage: (channelId: string, message: string) => void;
}