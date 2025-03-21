// src/components/dashboard/Header.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Plus, ChevronDown, Settings, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NewProjectModal from "@/components/projects/NewProjectModal";
import NotificationsPopover from "@/components/dashboard/NotificationsPopover";
import SettingsDialog from "@/components/dashboard/SettingsDialog";

export default function Header({
  username = "User",
  welcomeMessage = "Welcome back",
  avatar = "https://github.com/shadcn.png",
  avatarFallback = "U",
  email = "user@example.com",
  onNewProject = () => {},
  onNotifications = () => {},
  onSettings = () => {},
  rightActions = null,
  currentPage = "",
  onCreateProject, // Function to handle creating a new project
  onLogout = () => {}
}) {
  const isDashboard = currentPage === "Dashboard";
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Sample notifications data for demonstration
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      message: "Your task 'Update homepage design' is due tomorrow", 
      type: "alert", 
      read: false, 
      date: new Date(Date.now() - 30 * 60000).toISOString() 
    },
    { 
      id: 2, 
      message: "Emily Chen mentioned you in a comment", 
      type: "mention", 
      read: false, 
      date: new Date(Date.now() - 2 * 60 * 60000).toISOString() 
    },
    { 
      id: 3, 
      message: "New comment on Project Alpha", 
      type: "info", 
      read: true, 
      date: new Date(Date.now() - 5 * 60 * 60000).toISOString() 
    },
    { 
      id: 4, 
      message: "Sprint planning meeting in 30 minutes", 
      type: "default", 
      read: true, 
      date: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString() 
    }
  ]);
  
  // Check if we're on a project-related page by looking for the word "Project" in the currentPage
  const isProjectPage = currentPage.includes("Project");
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Function to handle new project button click
  const handleNewProject = () => {
    setIsNewProjectModalOpen(true);
  };
  
  // Function to handle creating a new project from the modal
  const handleCreateProject = (newProject) => {
    // Close the modal
    setIsNewProjectModalOpen(false);
    
    // Call the parent's function if provided
    if (typeof onCreateProject === 'function') {
      onCreateProject(newProject);
    } else {
      // Fallback to the generic onNewProject if no specific handler
      onNewProject();
    }
  };
  
  // Handle mobile notifications click
  const handleMobileNotificationsClick = () => {
    setIsNotificationsOpen(true);
  };
  
  // Handle mobile settings click
  const handleMobileSettingsClick = () => {
    setIsSettingsOpen(true);
  };
  
  // Notification handlers
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  const handleDismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };
  
  const handleMarkRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  // Settings handlers
  const handleThemeChange = (theme) => {
    console.log("Theme changed to:", theme);
    // Implement theme change logic here
  };
  
  const handleProfileClick = () => {
    console.log("Profile clicked");
    // Implement profile page navigation here
  };
  
  const handleFullSettings = () => {
    console.log("Opening full settings");
    // Implement full settings page navigation here
  };
  
  return (
    <>
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        {/* Page title/Welcome message - only show welcome message and username on dashboard */}
        <h1 className="text-xl md:text-2xl font-bold truncate ml-12 lg:ml-0">
          {isDashboard ? (
            <>
              <span className="hidden sm:inline">{welcomeMessage}, </span>
              <span>{username}!</span>
            </>
          ) : (
            <span>{currentPage}</span>
          )}
        </h1>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          {rightActions || (
            <>
              {/* Only show New Project buttons when NOT on a project-related page */}
              {!isProjectPage && (
                <>
                  {/* Normal buttons on medium+ screens */}
                  <Button
                    variant="default"
                    className="bg-teal-500 hover:bg-teal-600 hidden md:flex"
                    onClick={handleNewProject}
                  >
                    <Plus className="w-4 h-4 mr-2" /> New project
                  </Button>
                  
                  {/* Plus button only on small screens */}
                  <Button
                    variant="default"
                    size="icon"
                    className="bg-teal-500 hover:bg-teal-600 md:hidden"
                    onClick={handleNewProject}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              {/* Notifications button - for both desktop and mobile */}
              <div className="hidden sm:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => setIsNotificationsOpen(true)}
                  aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-5 flex items-center justify-center bg-red-500 text-white text-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
              
              {/* Settings button - for desktop */}
              <div className="hidden sm:block">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                  aria-label="Settings"
                >
                  <Settings className="w-5 h-5" />
                </Button>
              </div>
              
              {/* Dropdown menu for small screens */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="sm:hidden">
                  <Button variant="ghost" size="icon">
                    <ChevronDown className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleMobileNotificationsClick}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <Bell className="w-4 h-4 mr-2" />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-red-100 text-red-800 rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMobileSettingsClick}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Avatar>
                <AvatarImage src={avatar} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
      
      {/* New Project Modal */}
      <NewProjectModal 
        isOpen={isNewProjectModalOpen} 
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
      
      {/* Notifications - now controlled directly from Header */}
      <NotificationsPopover 
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onDismissNotification={handleDismissNotification}
        onMarkRead={handleMarkRead}
        onViewAllNotifications={onNotifications}
        isOpen={isNotificationsOpen}
        setIsOpen={setIsNotificationsOpen}
      />
      
      {/* Settings - now controlled directly from Header */}
      <SettingsDialog 
        username={username}
        email={email}
        avatar={avatar}
        avatarFallback={avatarFallback}
        onProfileClick={handleProfileClick}
        onLogout={onLogout}
        onOpenFullSettings={handleFullSettings}
        onThemeChange={handleThemeChange}
        onLanguageChange={() => console.log("Language change clicked")}
        onHelpClick={() => console.log("Help clicked")}
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
      />
    </>
  );
}