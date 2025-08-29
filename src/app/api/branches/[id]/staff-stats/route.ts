import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, canAccessBranch } from "@/lib/rbac"
import { UserRole, OrderStatus } from "@prisma/client"

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

    // Get today's date range
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get order counts by status
    const [pendingOrders, preparingOrders, readyOrders, totalOrders] = await Promise.all([
      db.order.count({
        where: {
          branchId,
          status: OrderStatus.PENDING,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      db.order.count({
        where: {
          branchId,
          status: OrderStatus.PREPARING,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      db.order.count({
        where: {
          branchId,
          status: OrderStatus.READY,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }),
      db.order.count({
        where: {
          branchId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      })
    ])

    // Get recent orders with items
    const recentOrders = await db.order.findMany({
      take: 20,
      where: { 
        branchId,
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      },
      include: {
        table: {
          select: {
            id: true,
            number: true
          }
        },
        orderItems: {
          include: {
            menuItem: {
              select: {
                id: true,
                name: true,
                price: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json({
      pendingOrders,
      preparingOrders,
      readyOrders,
      totalOrders,
      recentOrders
    })
  } catch (error) {
    console.error("Error fetching branch staff stats:", error)
    return NextResponse.json(
      { error: "Failed to fetch branch staff stats" },
      { status: 500 }
    )
  }
}