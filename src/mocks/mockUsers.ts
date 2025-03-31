import { User } from "@/types/user"

/**
 * Mock user data for development and testing
 * Contains users for all roles in the application
 */

/**
 * Super Admin user
 * Has access to all platform settings and organizations
 */
export const mockSuperAdmin: User = {
  id: "sa-1",
  name: "Alex Thompson",
  email: "super@teamlens.io",
  role: "superAdmin",
  avatar: "https://ui-avatars.com/api/?name=Alex+Thompson&background=6366f1&color=fff",
  createdAt: "2024-01-15T08:30:00Z",
}

/**
 * Organization Admin users
 * Manage their own organization settings, projects, and team
 */
export const mockOrgAdmins: User[] = [
  {
    id: "oa-1",
    name: "Jordan Smith",
    email: "org@acmetech.com",
    role: "orgAdmin", 
    organizationId: "org-1",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Smith&background=f43f5e&color=fff",
    createdAt: "2024-01-20T10:15:00Z",
  },
  {
    id: "oa-2",
    name: "Morgan Lee",
    email: "org@innovatex.com",
    role: "orgAdmin",
    organizationId: "org-2",
    avatar: "https://ui-avatars.com/api/?name=Morgan+Lee&background=f43f5e&color=fff",
    createdAt: "2024-02-05T09:45:00Z",
  }
]

/**
 * Team Member users
 * Work on assigned tasks and collaborate with teams
 */
export const mockTeamMembers: User[] = [
  {
    id: "tm-1",
    name: "Taylor Wilson",
    email: "team@acmetech.com",
    role: "teamMember",
    organizationId: "org-1",
    avatar: "https://ui-avatars.com/api/?name=Taylor+Wilson&background=10b981&color=fff",
    createdAt: "2024-01-25T14:20:00Z",
  },
  {
    id: "tm-2",
    name: "Riley Johnson",
    email: "team2@acmetech.com",
    role: "teamMember",
    organizationId: "org-1",
    avatar: "https://ui-avatars.com/api/?name=Riley+Johnson&background=10b981&color=fff",
    createdAt: "2024-02-10T11:30:00Z",
  },
  {
    id: "tm-3",
    name: "Casey Brown",
    email: "team@innovatex.com",
    role: "teamMember",
    organizationId: "org-2",
    avatar: "https://ui-avatars.com/api/?name=Casey+Brown&background=10b981&color=fff",
    createdAt: "2024-02-15T13:45:00Z",
  }
]

/**
 * Client users
 * View project status and reports with read-only access
 */
export const mockClients: User[] = [
  {
    id: "cl-1",
    name: "Jamie Garcia",
    email: "client@globalretail.com",
    role: "client",
    organizationId: "client-org-1",
    avatar: "https://ui-avatars.com/api/?name=Jamie+Garcia&background=fb923c&color=fff",
    createdAt: "2024-01-30T09:10:00Z",
  },
  {
    id: "cl-2",
    name: "Avery Martinez",
    email: "client@ecosmart.com",
    role: "client",
    organizationId: "client-org-2",
    avatar: "https://ui-avatars.com/api/?name=Avery+Martinez&background=fb923c&color=fff",
    createdAt: "2024-02-20T15:20:00Z",
  }
]

/**
 * All mock users in a single array
 * Useful for user search and filtering
 */
export const mockAllUsers: User[] = [
  mockSuperAdmin,
  ...mockOrgAdmins,
  ...mockTeamMembers,
  ...mockClients
]

/**
 * Get mock users by role
 * 
 * @param role - User role to filter by
 * @returns Array of users with the specified role
 */
export function getMockUsersByRole(role: string): User[] {
  return mockAllUsers.filter(user => user.role === role)
}

/**
 * Get mock users by organization
 * 
 * @param organizationId - Organization ID to filter by
 * @returns Array of users in the specified organization
 */
export function getMockUsersByOrganization(organizationId: string): User[] {
  return mockAllUsers.filter(user => user.organizationId === organizationId)
}

/**
 * Get a single mock user by email
 * Useful for authentication simulation
 * 
 * @param email - Email to search for
 * @returns User with the specified email or undefined
 */
export function getMockUserByEmail(email: string): User | undefined {
  return mockAllUsers.find(user => user.email === email)
}

/**
 * Get a single mock user by ID
 * 
 * @param id - User ID to search for
 * @returns User with the specified ID or undefined
 */
export function getMockUserById(id: string): User | undefined {
  return mockAllUsers.find(user => user.id === id)
}