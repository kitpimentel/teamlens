import { Link, useLocation } from "react-router-dom"
import { 
  CheckSquare, 
  Users, 
  FolderKanban, 
  BarChart3, 
  MessageSquare 
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Sidebar navigation for Team Member users
 */
function TeamMemberSidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    {
      name: "My Tasks",
      path: "/team",
      icon: <CheckSquare className="h-5 w-5" />,
      exact: true
    },
    {
      name: "Collaboration",
      path: "/team/collaboration",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Projects",
      path: "/team/projects",
      icon: <FolderKanban className="h-5 w-5" />
    },
    {
      name: "Reports",
      path: "/team/reports",
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      name: "Chat",
      path: "/team/chat",
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

export default TeamMemberSidebar