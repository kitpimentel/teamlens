import { Outlet } from "react-router-dom"
import { useTheme } from "@/context/ThemeContext"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Moon, Sun } from "lucide-react"

/**
 * Layout component for the landing page
 * Provides a consistent header and footer for landing pages
 */
const LandingLayout = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2">
              {/* Logo */}
              <div className="relative h-8 w-8 overflow-hidden rounded-md bg-primary">
                <div className="absolute inset-0 flex items-center justify-center text-primary-foreground font-bold text-lg">
                  TL
                </div>
              </div>
              <span className="font-bold text-xl hidden sm:inline-block">Team Lens</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/#integrations" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Integrations
            </Link>
            <Link to="/#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testimonials
            </Link>
            <Link to="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {/* Auth buttons */}
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/40">
        <div className="container py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Lens</h3>
              <p className="text-sm text-muted-foreground">
                Centralized project management hub designed for businesses managing multiple clients and teams.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/#integrations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link to="/#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link to="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-10 pt-6 border-t">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Team Lens. All rights reserved.
              </p>
              <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingLayout