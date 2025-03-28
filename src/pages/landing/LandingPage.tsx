import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2, BarChart3, Users, Calendar, MessageSquare, Zap, Layers, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

/**
 * Landing page component displaying key features and benefits of Team Lens
 */
const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="relative container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col space-y-8">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Just Launched: AI-Driven Team Analytics
              </div>
              
              <div>
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
                  Unify Your Projects, Teams & Clients in <span className="text-primary">One Workspace</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 md:pr-12">
                  Team Lens centralizes your project management, automates reports, 
                  and provides AI-driven insights—all in a single dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Real-time data</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">AI-powered insights</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Secure access</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Automation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Quick setup</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm">Built-in chat</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="relative p-4 bg-gradient-to-br from-background to-muted rounded-lg border shadow-lg lg:scale-110 lg:translate-x-10">
              <div className="relative rounded-md overflow-hidden bg-background">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-primary/30 rounded-md"></div>
                <img 
                  src="https://ui-avatars.com/api/?name=Team+Lens&background=6366F1&color=fff&size=128" 
                  alt="Team Lens Dashboard" 
                  className="w-full h-auto opacity-0"
                  onLoad={(e) => {
                    // This is where you'd replace with your actual dashboard screenshot
                    e.currentTarget.classList.remove('opacity-0')
                  }}
                />
                <div className="aspect-[16/9] flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-xl font-semibold mb-2">Team Lens Dashboard</h3>
                    <p className="text-muted-foreground">A unified view of all your projects and team activities</p>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-background rounded-lg shadow-md p-3 border">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-background rounded-lg shadow-md p-3 border">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">40%</p>
              <p className="text-sm text-muted-foreground mt-2">Reduction in Platform Switching</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">25%</p>
              <p className="text-sm text-muted-foreground mt-2">Increase in On-Time Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">60%</p>
              <p className="text-sm text-muted-foreground mt-2">Reduction in Reporting Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary">8.5+</p>
              <p className="text-sm text-muted-foreground mt-2">Customer Satisfaction Score</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Modern Teams</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Team Lens combines all the tools you need to manage projects, teams, and clients in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Analytics</CardTitle>
                <CardDescription>
                  Monitor project health, team capacity, and client satisfaction in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Sprint health monitoring</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Completion rate tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Team velocity metrics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Driven Reporting</CardTitle>
                <CardDescription>
                  Automated reports with AI-powered insights and forecasting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Customizable report templates</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Scheduled report generation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Stakeholder-specific views</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Task & Schedule Automation</CardTitle>
                <CardDescription>
                  Automate routine tasks and coordinate team schedules effortlessly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Task prioritization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Task dependencies and relationships</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Status tracking and updates</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Built-in Communication</CardTitle>
                <CardDescription>
                  Chat directly with your team and clients in context with projects.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Direct & group messaging</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">File sharing in chat</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Task discussions linked to projects</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Layers className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Seamless Integrations</CardTitle>
                <CardDescription>
                  Connect with your favorite tools for a unified workflow.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">JIRA, ClickUp, Asana, Monday.com</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Microsoft Teams, Zoom, Google Meet</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Meeting transcription and analysis</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Multi-Tenant Security</CardTitle>
                <CardDescription>
                  Role-based access control with enterprise-grade security.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Role-based access control</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Multi-tenant architecture</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Data privacy and security compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-muted/30" id="integrations">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Seamless Integrations</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Team Lens connects with your favorite tools for a unified workflow.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {/* Integration Logos - These would be actual logos in a real implementation */}
            {["JIRA", "ClickUp", "Asana", "Monday.com", "Microsoft Teams", "Zoom"].map((tool) => (
              <div key={tool} className="flex flex-col items-center">
                <div className="h-20 w-20 rounded-xl bg-background shadow-sm border flex items-center justify-center mb-4">
                  <span className="text-xl font-semibold text-primary">{tool.substring(0, 2)}</span>
                </div>
                <span className="text-sm font-medium">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20" id="testimonials">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trusted by teams around the world to improve productivity and collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-muted-foreground">Project Manager at TechCorp</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "Team Lens has transformed how we manage projects. The unified dashboard and real-time analytics have increased our delivery speed by 30%."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">JS</span>
                  </div>
                  <div>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">CEO at DesignStudio</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The automated reporting features save us hours every week. Our clients love the transparent insights and communication channels."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-background">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="mr-3 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">RJ</span>
                  </div>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">Team Lead at InnovateCo</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The team capacity features help us balance workloads and prevent burnout. The insights from the AI analytics are incredibly valuable."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section (Simplified) */}
      <section className="py-20 bg-muted/30" id="pricing">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that fits your team's needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Pricing Card 1 */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <CardDescription>Perfect for small teams getting started</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Up to 5 team members</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">3 active projects</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Basic reporting</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Link to="/signup" className="block mt-6">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pricing Card 2 - Highlighted */}
            <Card className="border-primary relative">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle>Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$79</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <CardDescription>Ideal for growing organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Up to 20 team members</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Unlimited projects</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">All integrations</span>
                  </li>
                </ul>
                <Link to="/signup" className="block mt-6">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pricing Card 3 */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$199</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <CardDescription>For large teams with advanced needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Unlimited team members</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Unlimited projects</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Custom AI models</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Dedicated support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                </ul>
                <Link to="/signup" className="block mt-6">
                  <Button className="w-full">Contact Sales</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Project Management?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of teams who've improved their project delivery with Team Lens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Schedule Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage