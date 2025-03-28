import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  Mail, 
  FolderKanban, 
  Settings, 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  CheckSquare, 
  Video, 
  MessageSquare 
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Sidebar navigation for Organization Admin users
 */
function OrgAdminSidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/org-admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      name: "User Management",
      path: "/org-admin/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Team Invitations",
      path: "/org-admin/invitations",
      icon: <Mail className="h-5 w-5" />
    },
    {
      name: "Projects",
      path: "/org-admin/projects",
      icon: <FolderKanban className="h-5 w-5" />
    },
    {
      name: "Team Capacity",
      path: "/org-admin/capacity",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Schedule",
      path: "/org-admin/schedule",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Tasks",
      path: "/org-admin/tasks",
      icon: <CheckSquare className="h-5 w-5" />
    },
    {
      name: "Reports",
      path: "/org-admin/reports",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: "Meetings",
      path: "/org-admin/meetings",
      icon: <Video className="h-5 w-5" />
    },
    {
      name: "Chat",
      path: "/org-admin/chat",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      name: "Settings",
      path: "/org-admin/settings",
      icon: <Settings className="h-5 w-5" />
    }
  ]

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.path) && item.exact 
                    ? "bg-primary text-primary-foreground"
                    : isActive(item.path) && !item.exact 
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default OrgAdminSidebar