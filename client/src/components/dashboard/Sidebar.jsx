// src/components/dashboard/Sidebar.jsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, FolderKanban, PieChart, Calendar, Users, CheckSquare } from "lucide-react";
import Logo from '@/assets/Logo';


export default function Sidebar({ 
  navigationItems = [], 
  activeItem,
  userProfile = { name: "Sergey Goldberg", email: "sergey@teamlens.com", avatar: "https://github.com/shadcn.png" },
  logoText = "Team Lens"
}) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const location = useLocation();

  const defaultNavItems = [
    { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
    { id: "projects", name: "Projects", icon: <FolderKanban size={20} />, href: "/projects" },
    { id: "reports", name: "Reports", icon: <PieChart size={20} />, href: "/reports" },
    { id: "schedule", name: "Schedule", icon: <Calendar size={20} />, href: "/schedule" },
    { id: "team", name: "Team Capacity", icon: <Users size={20} />, href: "/team" },
    { id: "tasks", name: "Tasks", icon: <CheckSquare size={20} />, href: "/tasks" }
  ];
  
  const items = navigationItems.length ? navigationItems : defaultNavItems;

  // Determine active item based on current route if not explicitly provided
  const currentPath = location.pathname;
  const activeItemName = activeItem || items.find(item => 
    currentPath === item.href || currentPath.startsWith(`${item.href}/`)
  )?.name || "Dashboard";

  const toggleSidebar = () => setShowMobileSidebar(!showMobileSidebar);

  // Handle keyboard navigation within sidebar
  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = index < items.length - 1 ? index + 1 : 0;
      document.getElementById(`nav-item-${nextIndex}`)?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = index > 0 ? index - 1 : items.length - 1;
      document.getElementById(`nav-item-${prevIndex}`)?.focus();
    }
  };

  // Close sidebar when pressing Escape
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showMobileSidebar) {
        setShowMobileSidebar(false);
        toggleButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [showMobileSidebar]);

  // Handle click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showMobileSidebar && sidebarRef.current && !sidebarRef.current.contains(e.target) && 
          !toggleButtonRef.current?.contains(e.target)) {
        setShowMobileSidebar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileSidebar]);

  // Focus trap inside sidebar when open
  useEffect(() => {
    if (showMobileSidebar) {
      document.getElementById('nav-item-0')?.focus();
    }
  }, [showMobileSidebar]);

  // Mobile toggle button
  const MobileMenuToggle = () => (
    <Button 
      variant="ghost" 
      size="icon" 
      className="lg:hidden fixed top-4 left-4 z-50"
      onClick={toggleSidebar}
      aria-label={showMobileSidebar ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={showMobileSidebar}
      aria-controls="sidebar-menu"
      ref={toggleButtonRef}
    >
      {showMobileSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="px-4 py-3 border-b border-gray-200">
        <Link to="/" className="flex items-center focus:outline-none focus:ring-2 focus:ring-teal-500 rounded">
            <Logo className="w-8 h-8 text-primary" />
          <span className="font-bold">{logoText}</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav aria-label="Main Navigation" className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2" role="menu">
          {items.map((item, index) => (
            <li key={item.id} role="none">
              <Link
                id={`nav-item-${index}`}
                to={item.href}
                className={`${
                  activeItemName === item.name 
                    ? "bg-teal-50 text-teal-700" 
                    : "text-gray-600 hover:bg-gray-50"
                } rounded-md flex items-center py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full transition-colors`}
                aria-current={activeItemName === item.name ? "page" : undefined}
                onClick={() => {
                  if (showMobileSidebar) setShowMobileSidebar(false);
                }}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="menuitem"
                tabIndex={0}
              >
                <span className="mr-2" aria-hidden="true">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User profile */}
      {userProfile && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center" role="contentinfo" aria-label="User information">
            <Avatar className="mr-2">
              <AvatarImage src={userProfile.avatar} alt={`${userProfile.name}'s profile`} />
              <AvatarFallback>{getInitials(userProfile.name)}</AvatarFallback>
            </Avatar>
            <div className="text-xs">
              <div className="font-medium">{userProfile.name}</div>
              <div className="text-gray-500">{userProfile.email}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <MobileMenuToggle />
      
      {/* Desktop Sidebar - Always visible on large screens */}
      <div 
        className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col h-screen"
        role="navigation"
        aria-label="Main Navigation"
      >
        {sidebarContent}
      </div>
      
      {/* Mobile Sidebar - Overlay when shown */}
      {showMobileSidebar && (
        <div className="lg:hidden fixed inset-0 z-40 flex" role="dialog" aria-modal="true" aria-labelledby="sidebar-title">
          {/* Hidden title for screen readers */}
          <span id="sidebar-title" className="sr-only">Navigation menu</span>
          
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            onClick={toggleSidebar}
          ></div>
          
          {/* Sidebar Content */}
          <div 
            ref={sidebarRef}
            id="sidebar-menu"
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none"
            role="navigation"
            aria-label="Mobile Navigation"
          >
            <div className="absolute top-0 right-0 pt-2 pr-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                aria-label="Close sidebar"
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

// Helper to get initials from a name
function getInitials(name) {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
}
