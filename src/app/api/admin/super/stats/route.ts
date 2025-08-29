import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, requireRole } from "@/lib/rbac"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN)

    // Get total counts
    const [totalRestaurants, totalBranches, totalUsers, totalOrders] = await Promise.all([
      db.restaurant.count({ where: { active: true } }),
      db.branch.count({ where: { active: true } }),
      db.user.count({ where: { active: true } }),
      db.order.count()
    ])

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 10,
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
      totalRestaurants,
      totalBranches,
      totalUsers,
      totalOrders,
      recentOrders
    })
  } catch (error) {
    console.error("Error fetching super admin stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}