import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  BarChart3, 
  Calendar, 
  MessageCircle, 
  Bell, 
  MessageSquare 
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Sidebar navigation for Client users
 */
function ClientSidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/client",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      name: "Reports & Insights",
      path: "/client/reports",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: "Project Timeline",
      path: "/client/timeline",
      icon: <Calendar className="h-5 w-5" />
    },
    {
      name: "Feedback & Requests",
      path: "/client/feedback",
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      name: "Notifications",
      path: "/client/notifications",
      icon: <Bell className="h-5 w-5" />
    },
    {
      name: "Chat",
      path: "/client/chat",
      icon: <MessageSquare className="h-5 w-5" />
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

export default ClientSidebar