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

    // Check if user has access to this restaurant
    if (user.role !== UserRole.SUPER_ADMIN && user.restaurantId !== restaurantId) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Get total counts
    const [totalBranches, totalOrders, totalUsers] = await Promise.all([
      db.branch.count({ where: { restaurantId, active: true } }),
      db.order.count({
        where: {
          branch: {
            restaurantId
          }
        }
      }),
      db.user.count({
        where: {
          OR: [
            { restaurantOwnership: { id: restaurantId } },
            { branchManagements: { some: { branch: { restaurantId } } } }
          ]
        }
      })
    ])

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 10,
      where: {
        branch: {
          restaurantId
        }
      },
      include: {
        branch: {
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

    return NextResponse.json({
      totalBranches,
      totalOrders,
      totalUsers,
      recentOrders
    })
  } catch (error) {
    console.error("Error fetching restaurant stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch restaurant stats" },
      { status: 500 }
    )
  }
}