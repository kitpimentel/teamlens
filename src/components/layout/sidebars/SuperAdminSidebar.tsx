import { Link, useLocation } from "react-router-dom"
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  BarChart3, 
  Puzzle 
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Sidebar navigation for Super Admin users
 */
function SuperAdminSidebar() {
  const location = useLocation()
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const navItems = [
    {
      name: "Dashboard",
      path: "/super-admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      exact: true
    },
    {
      name: "User Management",
      path: "/super-admin/users",
      icon: <Users className="h-5 w-5" />
    },
    {
      name: "Organizations",
      path: "/super-admin/organizations",
      icon: <Building2 className="h-5 w-5" />
    },
    {
      name: "Platform Settings",
      path: "/super-admin/settings",
      icon: <Settings className="h-5 w-5" />
    },
    {
      name: "Integrations",
      path: "/super-admin/integrations",
      icon: <Puzzle className="h-5 w-5" />
    },
    {
      name: "Reports & Analytics",
      path: "/super-admin/reports",
      icon: <BarChart3 className="h-5 w-5" />
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

export default SuperAdminSidebar