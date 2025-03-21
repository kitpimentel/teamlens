import React from 'react';
import { LandingHeader } from '@/components/LandingHeader';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Calendar, 
  BarChart3, 
  Link2, 
  FileText, 
  ListTodo,
  Video,
  ExternalLink
} from 'lucide-react';

const FeaturesPage = () => {
  const coreFeatures = [
    {
      icon: <Link2 className="h-10 w-10 text-blue-500" />,
      title: "Integration Hub",
      description: "Connect seamlessly with JIRA, ClickUp, and other popular PM tools. Get unified authentication, real-time updates, and comprehensive integration management.",
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-purple-500" />,
      title: "Performance Analytics",
      description: "Monitor sprint health, track completion rates, analyze team velocity, and forecast future performance with our comprehensive analytics dashboard.",
    },
    {
      icon: <Calendar className="h-10 w-10 text-emerald-500" />,
      title: "Schedule Management",
      description: "Get a consolidated view of deadlines across all projects, visualize resource allocation, and receive alerts for potential conflicts.",
    },
    {
      icon: <ExternalLink className="h-10 w-10 text-amber-500" />,
      title: "Project Drill-Down",
      description: "Access detailed reports for individual projects with issue tracking, risk assessment, and customizable KPIs tailored to your needs.",
    },
    {
      icon: <FileText className="h-10 w-10 text-rose-500" />,
      title: "Automated Reporting",
      description: "Create custom report templates, schedule generation, and distribute to stakeholders automatically. Export as PDF, Excel or shareable web links.",
    },
    {
      icon: <ListTodo className="h-10 w-10 text-cyan-500" />,
      title: "Task Management",
      description: "Create and assign tasks across integrated platforms, set priorities and dependencies, and track status updates from a single dashboard.",
    },
    {
      icon: <Video className="h-10 w-10 text-indigo-500" />,
      title: "Meeting Integration",
      description: "Connect to Zoom, Teams and other platforms for automatic transcription, task extraction from discussions, and action item tracking.",
    }
  ];

  const metrics = [
    { value: "40%", label: "Reduction in platform switching time" },
    { value: "25%", label: "Increase in on-time project delivery" },
    { value: "60%", label: "Reduction in reporting time" },
    { value: "80%", label: "User adoption rate" }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Centralized Project Management Hub</h1>
            <p className="text-xl text-gray-600 mb-8">
              Team Lens integrates with your existing tools to provide real-time insights into project status, team performance, and resource allocation.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Start Free Trial
            </Button>
          </div>
        </section>
        
        {/* Product Vision */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-6">Our Vision</h2>
            <p className="text-lg text-center text-gray-700">
              Team Lens eliminates the friction of managing multiple projects across different platforms by providing a unified dashboard where project managers can easily monitor performance metrics, generate stakeholder reports, and manage tasks—all without having to switch between multiple applications.
            </p>
          </div>
        </section>
        
        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {coreFeatures.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Phased Implementation */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Implementation Roadmap</h2>
            
            <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto">
              <div className="bg-blue-50 rounded-xl p-6 md:flex-1">
                <div className="inline-block bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">Phase 1 (MVP)</div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Core integration with JIRA and ClickUp</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Basic dashboard with performance metrics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manual report generation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Simple task creation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 md:flex-1">
                <div className="inline-block bg-purple-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">Phase 2</div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Additional PM tool integrations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Automated reporting</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Enhanced analytics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Mobile application</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-emerald-50 rounded-xl p-6 md:flex-1">
                <div className="inline-block bg-emerald-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">Phase 3</div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Meeting integration features</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Advanced scheduling capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>AI-powered insights and recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Custom API for enterprise clients</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* Success Metrics */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">Success Metrics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-white/80">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Target Users */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Who Team Lens Is For</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-xl mb-4">Project Managers</h3>
                  <p className="text-gray-600 mb-3">Who oversee multiple projects simultaneously across different platforms.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Unified dashboard for all projects</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Time-saving automated reporting</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-xl mb-4">Team Leads</h3>
                  <p className="text-gray-600 mb-3">Who need visibility into team performance and capacity planning.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Performance analytics and trends</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Resource allocation visualization</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-xl mb-4">Account Managers</h3>
                  <p className="text-gray-600 mb-3">Who need to provide regular updates to clients with minimal effort.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Customizable stakeholder reports</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Scheduled delivery of updates</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-xl mb-4">Executives</h3>
                  <p className="text-gray-600 mb-3">Who need high-level views of project health and resource allocation.</p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Executive dashboards and KPIs</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">Portfolio-level insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to streamline your project management?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join teams that use Team Lens to deliver projects on time and within budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p>© {new Date().getFullYear()} Team Lens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;