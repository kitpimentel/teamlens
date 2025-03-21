// src/components/dashboard/SettingsDialog.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Settings,
  Moon,
  Sun,
  Bell,
  User,
  LogOut,
  Monitor,
  Languages,
  HelpCircle,
  ChevronRight,
  Palette,
  Globe,
  Volume2,
  VolumeX,
  AlertTriangle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/authService";

export default function SettingsDialog({
  username = "User",
  email = "user@example.com",
  avatar = "https://github.com/shadcn.png",
  avatarFallback = "U",
  onProfileClick = () => {},
  onLogout = () => {},
  onOpenFullSettings = () => {},
  onThemeChange = () => {},
  onLanguageChange = () => {},
  onHelpClick = () => {},
  isOpen = false,
  setIsOpen = () => {}
}) {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [activeSection, setActiveSection] = useState(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Reset active section when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveSection(null);
        setShowLogoutConfirm(false);
      }, 300);
    }
  }, [isOpen]);
  
  // Handle theme toggle with animation
  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    onThemeChange?.(newTheme);
    
    // Simulate theme change with a flash effect
    document.body.style.transition = "background-color 0.3s ease";
    document.body.style.backgroundColor = newTheme === "dark" ? "#1a1a1a" : "#f9f9f9";
    setTimeout(() => {
      document.body.style.backgroundColor = "";
    }, 300);
  };
  
  // Handle notifications toggle
  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (soundsEnabled && !notificationsEnabled === false) {
      setSoundsEnabled(false);
    }
  };
  
  // Handle sounds toggle
  const handleSoundsToggle = () => {
    setSoundsEnabled(!soundsEnabled);
  };
  
  // Handle zoom level change
  const handleZoomChange = (value) => {
    setZoomLevel(value);
  };
  
  // Format zoom level for display
  const formatZoomLevel = (value) => {
    if (value < 90) return "Small";
    if (value < 110) return "Normal";
    if (value < 130) return "Large";
    return "Extra Large";
  };
  
  // Handle section click
  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Handle logout confirmation
  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  // Handle actual logout
  const handleConfirmLogout = async () => {
    try {
      // Call the logout function and pass the navigate function
      await logout(navigate);
      
      // Execute the onLogout callback if provided
      onLogout();
      
      // Close the dialog
      setIsOpen(false);
      
      // Navigate to landing page
      navigate('/landing');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, we should still redirect to landing
      navigate('/landing');
    }
  };

  // Section animation variants
  const sectionVariants = {
    collapsed: { height: 0, opacity: 0, marginTop: 0, marginBottom: 0 },
    expanded: { height: "auto", opacity: 1, marginTop: 8, marginBottom: 8 }
  };
  
  // Render logout confirmation dialog if showLogoutConfirm is true
  if (showLogoutConfirm) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px] p-6 rounded-xl">
          <DialogHeader>
            <div className="flex items-center justify-center mb-2 text-amber-500">
              <AlertTriangle className="h-10 w-10" />
            </div>
            <DialogTitle className="text-center text-xl">Log Out</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Are you sure you want to log out of your account?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setShowLogoutConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleConfirmLogout}>
              Log Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0 max-h-[85vh] overflow-hidden flex flex-col rounded-xl shadow-xl">
        <DialogHeader className="p-4 border-b bg-gray-50">
          <DialogTitle className="flex items-center text-lg">
            <Settings className="w-4 h-4 mr-2 text-gray-500" />
            Settings
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-4 flex items-center bg-gradient-to-r from-teal-50 to-blue-50 border-b">
            <Avatar className="h-12 w-12 mr-4 ring-2 ring-white">
              <AvatarImage src={avatar} />
              <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium">{username}</h4>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-8 px-3 flex items-center"
              onClick={() => {
                onProfileClick();
                setIsOpen(false);
              }}
            >
              Edit Profile
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Display Settings Section */}
            <div className="rounded-lg border overflow-hidden">
              <button 
                className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${activeSection === 'display' ? 'bg-gray-50' : ''}`}
                onClick={() => handleSectionClick('display')}
              >
                <div className="flex items-center">
                  <Palette className="h-4 w-4 text-teal-500 mr-3" />
                  <h5 className="font-medium">Display & Appearance</h5>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeSection === 'display' ? 'rotate-90' : ''}`} />
              </button>
              
              <motion.div
                variants={sectionVariants}
                initial="collapsed"
                animate={activeSection === 'display' ? 'expanded' : 'collapsed'}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50 border-t"
              >
                <div className="p-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {theme === "light" ? (
                        <Sun className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Moon className="h-4 w-4 text-indigo-400" />
                      )}
                      <div>
                        <Label htmlFor="theme-mode" className="text-sm">
                          {theme === "light" ? "Light mode" : "Dark mode"}
                        </Label>
                        <p className="text-xs text-gray-500">
                          {theme === "light" ? "Use a light color theme" : "Use a dark color theme"}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="theme-mode" 
                      checked={theme === "dark"}
                      onCheckedChange={handleThemeToggle}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4 text-blue-500" />
                        <div>
                          <Label htmlFor="zoom-level" className="text-sm">Zoom level</Label>
                          <p className="text-xs text-gray-500">Adjust the app's display size</p>
                        </div>
                      </div>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full font-medium">
                        {formatZoomLevel(zoomLevel)} ({zoomLevel}%)
                      </span>
                    </div>
                    <Slider 
                      id="zoom-level"
                      min={75} 
                      max={150} 
                      step={5}
                      value={zoomLevel}
                      onValueChange={handleZoomChange}
                      className="w-full" 
                    />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Notifications Section */}
            <div className="rounded-lg border overflow-hidden">
              <button 
                className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${activeSection === 'notifications' ? 'bg-gray-50' : ''}`}
                onClick={() => handleSectionClick('notifications')}
              >
                <div className="flex items-center">
                  <Bell className="h-4 w-4 text-purple-500 mr-3" />
                  <h5 className="font-medium">Notifications & Sounds</h5>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeSection === 'notifications' ? 'rotate-90' : ''}`} />
              </button>
              
              <motion.div
                variants={sectionVariants}
                initial="collapsed"
                animate={activeSection === 'notifications' ? 'expanded' : 'collapsed'}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50 border-t"
              >
                <div className="p-3 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className={`h-4 w-4 ${notificationsEnabled ? 'text-purple-500' : 'text-gray-400'}`} />
                      <div>
                        <Label htmlFor="notifications" className="text-sm">
                          Enable notifications
                        </Label>
                        <p className="text-xs text-gray-500">
                          Receive alerts for important updates
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="notifications" 
                      checked={notificationsEnabled}
                      onCheckedChange={handleNotificationsToggle}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pl-6 opacity-90">
                    <div className="flex items-center space-x-2">
                      {soundsEnabled ? (
                        <Volume2 className={`h-4 w-4 ${notificationsEnabled ? 'text-purple-500' : 'text-gray-400'}`} />
                      ) : (
                        <VolumeX className="h-4 w-4 text-gray-400" />
                      )}
                      <div>
                        <Label htmlFor="sounds" className="text-sm">
                          Enable sounds
                        </Label>
                        <p className="text-xs text-gray-500">
                          Play sounds for notifications
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="sounds" 
                      checked={soundsEnabled}
                      onCheckedChange={handleSoundsToggle}
                      disabled={!notificationsEnabled}
                    />
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Language Section */}
            <div className="rounded-lg border overflow-hidden">
              <button 
                className={`w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors ${activeSection === 'language' ? 'bg-gray-50' : ''}`}
                onClick={() => handleSectionClick('language')}
              >
                <div className="flex items-center">
                  <Globe className="h-4 w-4 text-green-500 mr-3" />
                  <h5 className="font-medium">Language & Region</h5>
                </div>
                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${activeSection === 'language' ? 'rotate-90' : ''}`} />
              </button>
              
              <motion.div
                variants={sectionVariants}
                initial="collapsed"
                animate={activeSection === 'language' ? 'expanded' : 'collapsed'}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-gray-50 border-t"
              >
                <div className="p-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-between text-sm"
                    onClick={() => {
                      onLanguageChange();
                      setIsOpen(false);
                    }}
                  >
                    <span>Change language</span>
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="p-3">
            <div className="grid grid-cols-1 gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm h-9"
                onClick={() => {
                  onHelpClick();
                  setIsOpen(false);
                }}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-blue-500" />
                Help & Support
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-sm h-9 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogoutClick}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </ScrollArea>
        
        <div className="p-3 border-t bg-gray-50">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs bg-white"
            onClick={() => {
              onOpenFullSettings();
              setIsOpen(false);
            }}
          >
            Advanced Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}