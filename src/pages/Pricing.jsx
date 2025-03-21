import React, { useState } from 'react';
import { LandingHeader } from '@/components/LandingHeader';
import { Button } from '@/components/ui/button';
import { CheckCircle2, HelpCircle, X } from 'lucide-react';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState('annual');
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  
  const plans = [
    {
      name: "Starter",
      price: billingPeriod === 'annual' ? 29 : 39,
      description: "Perfect for small teams with basic project management needs.",
      features: [
        "Core integration with JIRA and ClickUp",
        "Basic dashboard with performance metrics",
        "Manual report generation",
        "Simple task creation",
        "5 users included",
        "Up to 10 projects",
        "Email support"
      ],
      highlighted: false,
      maxConcurrentProjects: 10,
      maxUsers: 5,
      phase: 1
    },
    {
      name: "Professional",
      price: billingPeriod === 'annual' ? 79 : 99,
      description: "For growing teams that need more integrations and automation.",
      features: [
        "Everything in Starter, plus:",
        "Additional PM tool integrations",
        "Automated reporting",
        "Enhanced analytics",
        "Mobile application",
        "20 users included",
        "Up to 50 projects",
        "Priority email & chat support"
      ],
      highlighted: true,
      maxConcurrentProjects: 50,
      maxUsers: 20,
      phase: 2
    },
    {
      name: "Business",
      price: billingPeriod === 'annual' ? 199 : 249,
      description: "For teams that need advanced features and dedicated support.",
      features: [
        "Everything in Professional, plus:",
        "Meeting integration features",
        "Advanced scheduling capabilities",
        "AI-powered insights",
        "Custom API access",
        "50 users included",
        "Up to 100 projects",
        "Dedicated account manager"
      ],
      highlighted: false,
      maxConcurrentProjects: 100,
      maxUsers: 50,
      phase: 3
    }
  ];
  
  const faqs = [
    {
      question: "How does Team Lens integrate with my existing tools?",
      answer: "Team Lens connects to your existing project management tools like JIRA, ClickUp, and others through their APIs. Once authorized, Team Lens will sync data in real-time, allowing you to see all your projects in one place without having to switch between platforms."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be billed the prorated amount for the remainder of your billing cycle. When downgrading, the new rate will apply at the start of your next billing cycle."
    },
    {
      question: "What happens if I exceed my user or project limits?",
      answer: "If you approach your user or project limits, you'll receive notifications suggesting an upgrade. You can temporarily exceed limits by a small margin, but for sustained usage beyond your plan's limits, you'll need to upgrade to a higher tier."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial of our Professional plan with no credit card required. This gives you full access to explore our features and determine if Team Lens is right for your team."
    },
    {
      question: "What kind of support is included?",
      answer: "All plans include email support with varying response times. Professional plans add chat support, while Business plans include a dedicated account manager. Enterprise customers receive priority support with guaranteed response times and regular check-ins."
    },
    {
      question: "What are the security measures in place?",
      answer: "Team Lens is SOC 2 compliant with role-based access control. We implement data encryption at rest and in transit, and conduct regular security audits. We take data privacy and security very seriously and comply with industry best practices."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose the plan that's right for your team. All plans include a 14-day free trial.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex justify-center items-center mb-12">
              <span className={`mr-3 ${billingPeriod === 'monthly' ? 'font-medium' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'annual' ? 'monthly' : 'annual')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200"
              >
                <span 
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    billingPeriod === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`} 
                />
              </button>
              <span className={`ml-3 ${billingPeriod === 'annual' ? 'font-medium' : 'text-gray-500'}`}>
                Annual <span className="text-green-500 text-sm">Save 20%</span>
              </span>
            </div>
            
            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <div 
                  key={plan.name}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden ${
                    plan.highlighted 
                      ? 'border-blue-500 shadow-lg relative' 
                      : 'border-gray-100'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="bg-blue-500 text-white text-xs font-bold uppercase py-1 text-center">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-4">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/month per user</span>
                      {billingPeriod === 'annual' && (
                        <div className="text-sm text-green-600 font-medium">Billed annually</div>
                      )}
                    </div>
                    
                    <Button 
                      className={`w-full mb-6 ${
                        plan.highlighted 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Start Free Trial
                    </Button>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Max Projects</span>
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {plan.maxConcurrentProjects}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Included Users</span>
                        <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">
                          {plan.maxUsers}
                        </span>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="font-medium mb-2">Features</h3>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Enterprise Card */}
            <div className="mt-12 bg-gray-50 rounded-xl p-8 border border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
                  <p className="text-gray-600">
                    For organizations with 50+ users and complex project management needs.
                  </p>
                </div>
                <Button 
                  className="bg-gray-800 hover:bg-gray-900 text-white"
                  onClick={() => setShowEnterpriseModal(true)}
                >
                  Contact Sales
                </Button>
              </div>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div>
                  <h3 className="font-medium mb-3">Custom Integration</h3>
                  <p className="text-sm text-gray-600">
                    Connect with any tool in your stack with custom-built integrations.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Advanced Security</h3>
                  <p className="text-sm text-gray-600">
                    Enterprise-grade security with SSO, audit logs, and custom compliance.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Dedicated Support</h3>
                  <p className="text-sm text-gray-600">
                    24/7 priority support with a dedicated success manager.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Success Metrics */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">Why Teams Choose Team Lens</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">40%</div>
                <div className="text-sm">Reduction in platform switching time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">25%</div>
                <div className="text-sm">Increase in on-time project delivery</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">60%</div>
                <div className="text-sm">Reduction in reporting time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">80%</div>
                <div className="text-sm">User adoption rate</div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl mr-4">
                    JD
                  </div>
                  <div>
                    <h3 className="font-semibold">Jane Doe</h3>
                    <p className="text-sm text-gray-500">Project Manager, TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "Team Lens has transformed how we manage our projects. The time we save on reporting alone has made it worth every penny. I can't imagine going back to our old way of doing things."
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-xl mr-4">
                    MS
                  </div>
                  <div>
                    <h3 className="font-semibold">Mike Smith</h3>
                    <p className="text-sm text-gray-500">Team Lead, InnovateCo</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  "The analytics and capacity planning features have been game-changers for our team. We've improved our sprint completion rate by over 30% since we started using Team Lens."
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQs */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <details className="group">
                    <summary className="flex items-center justify-between cursor-pointer p-4 bg-gray-50">
                      <h3 className="font-medium">{faq.question}</h3>
                      <span className="ml-6 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </span>
                    </summary>
                    <div className="p-4 text-gray-600">
                      <p>{faq.answer}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-6">Ready to streamline your project management?</h2>
            <p className="text-xl opacity-90 mb-8">
              Try Team Lens free for 14 days, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white hover:bg-blue-700">
                View Demo
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Enterprise Modal */}
      {showEnterpriseModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-semibold text-lg">Contact our Enterprise Sales Team</h2>
              <button 
                onClick={() => setShowEnterpriseModal(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">
                Please fill out the form below and one of our enterprise specialists will contact you within 24 hours.
              </p>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="Your company" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full p-2 border rounded" placeholder="you@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input type="tel" className="w-full p-2 border rounded" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Users</label>
                  <select className="w-full p-2 border rounded">
                    <option>50-100 users</option>
                    <option>101-250 users</option>
                    <option>251-500 users</option>
                    <option>500+ users</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Information</label>
                  <textarea className="w-full p-2 border rounded" rows="3" placeholder="Tell us about your specific needs"></textarea>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Submit Request
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
      
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

export default PricingPage;