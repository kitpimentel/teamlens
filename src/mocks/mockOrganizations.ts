import { Organization } from "@/types/user"

/**
 * Mock organizations for development and testing
 */

export const mockOrganizations: Organization[] = [
  {
    id: "org-1",
    name: "Acme Technologies",
    logo: "https://ui-avatars.com/api/?name=Acme+Tech&background=6366f1&color=fff&format=svg",
    industry: "Information Technology",
    createdAt: "2024-01-10T09:00:00Z",
    usersCount: 15,
    projectsCount: 8,
    subscription: "premium",
    isActive: true
  },
  {
    id: "org-2",
    name: "InnovateX Solutions",
    logo: "https://ui-avatars.com/api/?name=InnovateX&background=10b981&color=fff&format=svg",
    industry: "Software Development",
    createdAt: "2024-01-15T14:30:00Z",
    usersCount: 12,
    projectsCount: 5,
    subscription: "standard",
    isActive: true
  },
  {
    id: "client-org-1",
    name: "Global Retail Inc.",
    logo: "https://ui-avatars.com/api/?name=Global+Retail&background=f59e0b&color=fff&format=svg",
    industry: "Retail",
    createdAt: "2024-01-20T11:15:00Z",
    usersCount: 3,
    projectsCount: 2,
    subscription: "standard",
    isActive: true
  },
  {
    id: "client-org-2",
    name: "EcoSmart Logistics",
    logo: "https://ui-avatars.com/api/?name=EcoSmart&background=ec4899&color=fff&format=svg",
    industry: "Logistics",
    createdAt: "2024-02-05T10:45:00Z",
    usersCount: 4,
    projectsCount: 1,
    subscription: "premium",
    isActive: true
  },
  {
    id: "org-3",
    name: "MetaVerse Designs",
    logo: "https://ui-avatars.com/api/?name=MetaVerse&background=8b5cf6&color=fff&format=svg",
    industry: "Digital Media",
    createdAt: "2024-02-10T13:20:00Z",
    usersCount: 8,
    projectsCount: 3,
    subscription: "free",
    isActive: false
  }
]

/**
 * Mock subscription plans with features
 */
export const mockSubscriptionPlans: Record<string, {
  name: string;
  price: number;
  features: string[];
  maxUsers: number;
  maxProjects: number;
}> = {
  free: {
    name: "Free",
    price: 0,
    features: [
      "Up to 3 users",
      "Up to 2 projects",
      "Basic analytics",
      "7-day data retention"
    ],
    maxUsers: 3,
    maxProjects: 2
  },
  standard: {
    name: "Standard",
    price: 29,
    features: [
      "Up to 15 users",
      "Up to 10 projects",
      "Advanced analytics",
      "30-day data retention",
      "Priority support"
    ],
    maxUsers: 15,
    maxProjects: 10
  },
  premium: {
    name: "Premium",
    price: 79,
    features: [
      "Up to 50 users",
      "Unlimited projects",
      "Premium analytics",
      "90-day data retention",
      "24/7 support",
      "Custom integrations"
    ],
    maxUsers: 50,
    maxProjects: 100 // Effectively unlimited
  },
  enterprise: {
    name: "Enterprise",
    price: 199,
    features: [
      "Unlimited users",
      "Unlimited projects",
      "Enterprise analytics",
      "1-year data retention",
      "Dedicated support manager",
      "Custom integrations",
      "On-premise deployment option",
      "SSO authentication",
      "Custom branding"
    ],
    maxUsers: 1000, // Effectively unlimited
    maxProjects: 1000 // Effectively unlimited
  }
}

/**
 * Get a mock organization by ID
 */
export function getMockOrganizationById(id: string): Organization | undefined {
  return mockOrganizations.find(org => org.id === id)
}

/**
 * Get mock organizations by subscription plan
 */
export function getMockOrganizationsBySubscription(plan: string): Organization[] {
  return mockOrganizations.filter(org => org.subscription === plan)
}

/**
 * Get active mock organizations
 */
export function getActiveMockOrganizations(): Organization[] {
  return mockOrganizations.filter(org => org.isActive)
}