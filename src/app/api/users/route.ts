import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, requireRole } from "@/lib/rbac"
import { UserRole } from "@prisma/client"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER, UserRole.MANAGER, UserRole.BRANCH_MANAGER)

    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    let whereClause: any = {}
    
    if (restaurantId && user.role !== UserRole.SUPER_ADMIN) {
      // For non-super admins, only show users from their restaurant
      whereClause = {
        OR: [
          { restaurantOwnership: { id: restaurantId } },
          { branchManagements: { some: { branch: { restaurantId } } } }
        ]
      }
    } else if (user.role === UserRole.SUPER_ADMIN) {
      // Super admin can see all users
      whereClause = {}
    } else {
      // Other roles can only see users from their restaurant
      whereClause = {
        OR: [
          { restaurantOwnership: { id: user.restaurantId } },
          { branchManagements: { some: { branch: { restaurantId: user.restaurantId } } } }
        ]
      }
    }

    const users = await db.user.findMany({
      where: whereClause,
      include: {
        restaurantOwnership: {
          select: {
            id: true,
            name: true
          }
        },
        branchManagements: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER, UserRole.MANAGER)

    const body = await request.json()
    const { email, name, password, role, phone, branchId } = body

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user based on role
    const userData: any = {
      email,
      name,
      password: hashedPassword,
      role: role as UserRole,
      phone,
      active: true
    }

    // For restaurant owners, assign restaurant ID
    if (role === UserRole.RESTAURANT_OWNER && user.restaurantId) {
      userData.restaurantOwnership = {
        connect: { id: user.restaurantId }
      }
    }

    // For branch-related roles, assign branch ID
    if ((role === UserRole.BRANCH_MANAGER || role === UserRole.CHEF || role === UserRole.WAITER || role === UserRole.STAFF) && branchId) {
      userData.branchManagements = {
        create: {
          branch: {
            connect: { id: branchId }
          }
        }
      }
    }

    const newUser = await db.user.create({
      data: userData,
      include: {
        restaurantOwnership: {
          select: {
            id: true,
            name: true
          }
        },
        branchManagements: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(newUser)
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    )
  }
}