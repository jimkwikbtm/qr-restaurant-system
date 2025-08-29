import { UserRole } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export type RolePermissions = {
  [key in UserRole]: string[]
}

export const rolePermissions: RolePermissions = {
  SUPER_ADMIN: [
    "manage_restaurants",
    "manage_branches",
    "manage_users",
    "manage_menus",
    "manage_orders",
    "manage_settings",
    "manage_addons",
    "manage_themes",
    "view_analytics",
    "access_all_branches"
  ],
  RESTAURANT_OWNER: [
    "manage_restaurant",
    "manage_branches",
    "manage_users",
    "manage_menus",
    "manage_orders",
    "manage_settings",
    "view_analytics",
    "access_restaurant_branches"
  ],
  MANAGER: [
    "manage_branches",
    "manage_users",
    "manage_menus",
    "manage_orders",
    "view_analytics",
    "access_assigned_branches"
  ],
  BRANCH_MANAGER: [
    "manage_branch",
    "manage_users",
    "manage_menus",
    "manage_orders",
    "view_branch_analytics",
    "access_assigned_branch"
  ],
  CHEF: [
    "view_orders",
    "update_order_status",
    "manage_kitchen",
    "access_assigned_branch"
  ],
  WAITER: [
    "create_orders",
    "view_orders",
    "update_order_status",
    "manage_tables",
    "access_assigned_branch"
  ],
  STAFF: [
    "view_orders",
    "manage_tables",
    "access_assigned_branch"
  ]
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Authentication required")
  }
  return user
}

export async function requireRole(role: UserRole | UserRole[]) {
  const user = await requireAuth()
  const roles = Array.isArray(role) ? role : [role]
  
  if (!roles.includes(user.role)) {
    throw new Error("Insufficient permissions")
  }
  
  return user
}

export async function hasPermission(permission: string) {
  const user = await getCurrentUser()
  if (!user) {
    return false
  }
  
  return rolePermissions[user.role]?.includes(permission) || false
}

export async function requirePermission(permission: string) {
  const hasAccess = await hasPermission(permission)
  if (!hasAccess) {
    throw new Error("Insufficient permissions")
  }
}

export function canAccessBranch(userBranchId: string | null, targetBranchId: string, userRole: UserRole) {
  if (userRole === "SUPER_ADMIN") {
    return true
  }
  
  if (userRole === "RESTAURANT_OWNER" || userRole === "MANAGER") {
    return true // These roles can access all branches of their restaurant
  }
  
  if (userRole === "BRANCH_MANAGER" || userRole === "CHEF" || userRole === "WAITER" || userRole === "STAFF") {
    return userBranchId === targetBranchId
  }
  
  return false
}

export function canAccessRestaurant(userRestaurantId: string | null, targetRestaurantId: string, userRole: UserRole) {
  if (userRole === "SUPER_ADMIN") {
    return true
  }
  
  if (userRole === "RESTAURANT_OWNER" || userRole === "MANAGER") {
    return userRestaurantId === targetRestaurantId
  }
  
  return false
}