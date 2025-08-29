import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, requireRole } from "@/lib/rbac"
import { UserRole } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER)

    const restaurantId = params.id

    const restaurant = await db.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        branches: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            active: true,
            _count: {
              select: {
                orders: true,
                tables: true
              }
            }
          }
        },
        _count: {
          select: {
            orders: true,
            users: true
          }
        }
      }
    })

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this restaurant
    if (user.role !== UserRole.SUPER_ADMIN && user.restaurantId !== restaurantId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    return NextResponse.json(restaurant)
  } catch (error) {
    console.error("Error fetching restaurant:", error)
    return NextResponse.json(
      { error: "Failed to fetch restaurant" },
      { status: 500 }
    )
  }
}