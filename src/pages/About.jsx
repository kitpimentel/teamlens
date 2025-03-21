import React from 'react';
import { LandingHeader } from '@/components/LandingHeader';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  BarChart3, 
  Calendar, 
  ExternalLink, 
  FileText, 
  Link2,
  Video,
  CheckCircle2,
  Shield,
  Award,
  Code,
  Clock
} from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Alexandra Chen",
      role: "CEO & Co-Founder",
      bio: "Former project management director with 15+ years of experience leading cross-functional teams at Fortune 500 companies.",
      avatar: "https://ui-avatars.com/api/?name=Alexandra+Chen&background=0096c7&color=fff",
    },
    {
      name: "Marcus Johnson",
      role: "CTO & Co-Founder",
      bio: "Software architect with a background in building enterprise integration platforms and API-driven solutions.",
      avatar: "https://ui-avatars.com/api/?name=Marcus+Johnson&background=7209b7&color=fff",
    },
    {
      name: "Sarah Rodriguez",
      role: "Head of Product",
      bio: "Product leader with extensive experience in agile methodologies and user-centered design practices.",
      avatar: "https://ui-avatars.com/api/?name=Sarah+Rodriguez&background=4cc9f0&color=fff",
    },
    {
      name: "David Kim",
      role: "Head of Customer Success",
      bio: "Customer advocate focused on ensuring clients get maximum value from the Team Lens platform.",
      avatar: "https://ui-avatars.com/api/?name=David+Kim&background=f72585&color=fff",
    }
  ];

  const corePrinciples = [
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: "User-Centered Design",
      description: "We build solutions that address real pain points for project managers and teams."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Security & Privacy",
      description: "We implement industry-leading security measures to protect your sensitive project data."
    },
    {
      icon: <Code className="h-8 w-8 text-blue-500" />,
      title: "Open Integrations",
      description: "We believe in working with your existing tools, not forcing you to replace them."
    },
    {
      icon: <Award className="h-8 w-8 text-blue-500" />,
      title: "Continuous Improvement",
      description: "We constantly refine our platform based on user feedback and industry trends."
    }
  ];

  const milestones = [
    {
      year: "2021",
      title: "Company Founded",
      description: "Team Lens was founded to solve the growing challenge of managing projects across multiple platforms."
    },
    {
      year: "2022",
      title: "MVP Launch",
      description: "Released our first version with core integrations for JIRA and ClickUp, basic dashboard, and manual reporting."
    },
    {
      year: "2023",
      title: "Series A Funding",
      description: "Secured $8.5M in Series A funding to accelerate product development and market expansion."
    },
    {
      year: "2024",
      title: "Phase 2 Features",
      description: "Launched automated reporting, enhanced analytics, and mobile application support."
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Growing our team internationally to better serve customers worldwide."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission</h1>
                <p className="text-xl text-gray-600 mb-6">
                  We're building a unified platform that eliminates the friction of managing multiple projects across different tools and platforms.
                </p>
                <p className="text-gray-600">
                  Team Lens was born from our founders' firsthand experience with the challenges of modern project management. We believe that project managers shouldn't have to waste time switching between tools or manually compiling reports.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="aspect-square max-w-md mx-auto bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-3 p-3 w-full h-full">
                    <div className="bg-blue-100 rounded-lg flex items-center justify-center p-4">
                      <Link2 className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="bg-purple-100 rounded-lg flex items-center justify-center p-4">
                      <BarChart3 className="h-10 w-10 text-purple-500" />
                    </div>
                    <div className="bg-emerald-100 rounded-lg flex items-center justify-center p-4">
                      <Calendar className="h-10 w-10 text-emerald-500" />
                    </div>
                    <div className="bg-amber-100 rounded-lg flex items-center justify-center p-4">
                      <FileText className="h-10 w-10 text-amber-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Core Principles */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Principles</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {corePrinciples.map((principle, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 flex-shrink-0">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                    <p className="text-gray-600">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Our Story / Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
            
            <div className="relative border-l-2 border-blue-500 ml-4 md:ml-8 pl-8 md:pl-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="mb-12 relative">
                  <div className="absolute -left-14 md:-left-16 top-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -left-24 md:-left-28 top-0 font-bold text-blue-600">
                    {milestone.year}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-4">Meet Our Team</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We're a team of product specialists, engineers, and customer success experts passionate about solving complex project management challenges.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                View All Team Members
              </Button>
            </div>
          </div>
        </section>
        
        {/* Product Vision */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-8">Our Product Vision</h2>
            <p className="text-xl text-center mb-12 leading-relaxed">
              Team Lens aims to eliminate the friction of managing multiple projects across different platforms by providing a unified dashboard where project managers can easily monitor performance metrics, generate stakeholder reports, and manage tasks—all without having to switch between multiple applications.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <Link2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Integration Hub</h3>
                <p className="text-white/80">
                  Connect to all your favorite project management tools in one central location.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Insights</h3>
                <p className="text-white/80">
                  Get immediate visibility into project status, team performance, and resource allocation.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Effortless Reporting</h3>
                <p className="text-white/80">
                  Generate beautiful, customized reports for stakeholders with just a few clicks.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Technical Requirements & Compliance */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-10">
                <h2 className="text-3xl font-bold mb-6">Built to Enterprise Standards</h2>
                <p className="text-gray-600 mb-6">
                  Team Lens is built with security, reliability, and scalability in mind. Our platform follows industry best practices and standards to ensure your data is always safe and accessible.
                </p>
                
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">SOC 2 Compliance</span>
                      <p className="text-sm text-gray-600">Our platform undergoes regular security audits to maintain SOC 2 compliance.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">99.9% Uptime SLA</span>
                      <p className="text-sm text-gray-600">We guarantee 99.9% uptime with automated backups and disaster recovery.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Enterprise Scalability</span>
                      <p className="text-sm text-gray-600">Support for organizations with 5-500 users and up to 1000 concurrent projects.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium">Data Encryption</span>
                      <p className="text-sm text-gray-600">All data is encrypted at rest and in transit using industry-standard encryption.</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="md:w-1/2 bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Current Integrations</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {["JIRA", "ClickUp", "Asana", "Monday.com", "Trello", "GitHub"].map((tool, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg shadow-sm text-center text-sm">
                      {tool}
                    </div>
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mt-8 mb-4">Platform Availability</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Web Application</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">iOS App</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Android App</span>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">API Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact / CTA Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of teams that use Team Lens to streamline their project management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Contact Sales
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

export default AboutPage;