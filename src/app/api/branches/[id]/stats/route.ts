import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, canAccessBranch } from "@/lib/rbac"
import { UserRole } from "@prisma/client"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const branchId = params.id

    // Check if user has access to this branch
    if (!canAccessBranch(user.branchId, branchId, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Get total counts
    const [totalTables, totalOrders, totalStaff] = await Promise.all([
      db.table.count({ where: { branchId, active: true } }),
      db.order.count({ where: { branchId } }),
      db.user.count({
        where: {
          branchManagements: {
            some: {
              branchId,
              user: {
                active: true
              }
            }
          }
        }
      })
    ])

    // Get recent orders
    const recentOrders = await db.order.findMany({
      take: 10,
      where: { branchId },
      include: {
        table: {
          select: {
            id: true,
            number: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      totalTables,
      totalOrders,
      totalStaff,
      recentOrders
    })
  } catch (error) {
    console.error("Error fetching branch stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch branch stats" },
      { status: 500 }
    )
  }
}