import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Settings, Plus, ChevronDown } from "lucide-react";
import Logo from '@/assets/Logo';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ 
  username = "User", 
  welcomeMessage = "Welcome back", 
  avatar = "https://github.com/shadcn.png",
  avatarFallback = "U",
  onNewProject = () => {},
  onNotifications = () => {},
  onSettings = () => {},
  rightActions = null
}) {
  return (
    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
      {/* Welcome message - truncated on small screens */}
      <h1 className="text-xl md:text-2xl font-bold truncate ml-12 lg:ml-0">
        <span className="hidden sm:inline">{welcomeMessage}, </span>
        <span>{username}!</span>
      </h1>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        {rightActions || (
          <>
            {/* Normal buttons on medium+ screens */}
            <Button 
              variant="default" 
              className="bg-teal-500 hover:bg-teal-600 hidden md:flex"
              onClick={onNewProject}
            >
              <Plus className="w-4 h-4 mr-2" /> New project
            </Button>
            
            {/* Plus button only on small screens */}
            <Button 
              variant="default" 
              size="icon"
              className="bg-teal-500 hover:bg-teal-600 md:hidden"
              onClick={onNewProject}
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            {/* Hide less important buttons on small screens */}
            <Button variant="ghost" size="icon" onClick={onNotifications} className="hidden sm:flex">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onSettings} className="hidden sm:flex">
              <Settings className="w-5 h-5" />
            </Button>
            
            {/* Dropdown menu for small screens */}
            <DropdownMenu className="sm:hidden">
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onNotifications}>
                  <Bell className="w-4 h-4 mr-2" /> Notifications
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSettings}>
                  <Settings className="w-4 h-4 mr-2" /> Settings
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
  );
}