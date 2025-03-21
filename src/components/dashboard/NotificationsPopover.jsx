// src/components/dashboard/NotificationsPopover.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bell, X, Check, AlertCircle, Info, Clock, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationsPopover({ 
  notifications = [],
  onMarkAllRead = () => {},
  onDismissNotification = () => {},
  onMarkRead = () => {},
  onViewAllNotifications = () => {},
  isOpen = false,
  setIsOpen = () => {}
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [animatingItems, setAnimatingItems] = useState([]);

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.read;
    if (activeTab === "mentions") return notification.type === "mention";
    return true;
  });
  
  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Reset animation state when tab changes
  useEffect(() => {
    setAnimatingItems([]);
  }, [activeTab]);
  
  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "mention":
        return <User className="w-4 h-4 text-blue-500" />;
      case "info":
        return <Info className="w-4 h-4 text-teal-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Format relative time
  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    
    // Convert to minutes
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    
    // Convert to hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    // Convert to days
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    
    // Just return the date
    return new Date(date).toLocaleDateString();
  };

  // Handle marking an item as read with animation
  const handleMarkItemRead = (id) => {
    setAnimatingItems(prev => [...prev, id]);
    
    // Wait for animation to complete
    setTimeout(() => {
      onMarkRead(id);
      setAnimatingItems(prev => prev.filter(itemId => itemId !== id));
    }, 300);
  };

  // Handle dismissal with animation
  const handleDismiss = (e, id) => {
    e.stopPropagation();
    setAnimatingItems(prev => [...prev, id]);
    
    // Wait for animation to complete
    setTimeout(() => {
      onDismissNotification(id);
      setAnimatingItems(prev => prev.filter(itemId => itemId !== id));
    }, 300);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[450px] p-0 max-h-[85vh] overflow-hidden flex flex-col border-0 rounded-xl shadow-xl">
        <DialogHeader className="px-4 py-3 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center text-lg">
              <Bell className="w-4 h-4 mr-2 text-gray-500" />
              Notifications
            </DialogTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 px-2 text-teal-600 hover:text-teal-700 hover:bg-teal-50 flex items-center"
                onClick={() => {
                  onMarkAllRead();
                }}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-3 pt-2 bg-white sticky top-0 z-10">
            <TabsList className="grid grid-cols-3 p-1 w-full bg-gray-100 rounded-lg">
              <TabsTrigger value="all" className="text-xs py-1.5 rounded-md">All</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs py-1.5 rounded-md">Unread</TabsTrigger>
              <TabsTrigger value="mentions" className="text-xs py-1.5 rounded-md">Mentions</TabsTrigger>
            </TabsList>
          </div>
          
          <ScrollArea className="mt-1 max-h-[350px] overflow-auto">
            <TabsContent value={activeTab} className="mt-0 p-0 focus-visible:outline-none focus-visible:ring-0">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center text-gray-500">
                  <div className="flex justify-center mb-3">
                    <Bell className="h-10 w-10 text-gray-300" />
                  </div>
                  <p className="text-sm">No notifications to show</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activeTab === "all" ? "You're all caught up!" : 
                     activeTab === "unread" ? "No unread notifications" : 
                     "No mentions yet"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  <AnimatePresence>
                    {filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={false}
                        animate={{ 
                          opacity: animatingItems.includes(notification.id) ? 0 : 1,
                          height: animatingItems.includes(notification.id) ? 0 : 'auto',
                          marginTop: animatingItems.includes(notification.id) ? 0 : 'auto',
                          marginBottom: animatingItems.includes(notification.id) ? 0 : 'auto',
                          padding: animatingItems.includes(notification.id) ? 0 : 'auto',
                        }}
                        transition={{ duration: 0.2 }}
                        className={`p-3 flex items-start hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50' : ''}`}
                        onClick={() => handleMarkItemRead(notification.id)}
                      >
                        <div className="flex-shrink-0 mr-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${!notification.read ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatRelativeTime(notification.date)}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-gray-200"
                            onClick={(e) => handleDismiss(e, notification.id)}
                            aria-label="Dismiss notification"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-gray-200 hover:text-teal-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkItemRead(notification.id);
                              }}
                              aria-label="Mark as read"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
        
        <div className="mt-auto border-t p-2 bg-gray-50">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-xs font-medium hover:bg-gray-100"
            onClick={() => {
              onViewAllNotifications();
              setIsOpen(false);
            }}
          >
            View all notifications
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}