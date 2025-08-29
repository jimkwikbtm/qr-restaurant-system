import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      role: UserRole
      restaurantId?: string
      branchId?: string
      phone?: string | null
      avatar?: string | null
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    role: UserRole
    restaurantId?: string
    branchId?: string
    phone?: string | null
    avatar?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    restaurantId?: string
    branchId?: string
    phone?: string | null
    avatar?: string | null
  }
}