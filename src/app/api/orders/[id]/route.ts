import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, canAccessBranch } from "@/lib/rbac"
import { OrderStatus } from "@prisma/client"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const orderId = params.id

    // Get the order to check permissions
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        branch: {
          select: {
            id: true,
            restaurantId: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this order's branch
    if (!canAccessBranch(user.branchId, order.branch.id, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Update order status
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus },
      include: {
        branch: {
          select: {
            id: true,
            name: true
          }
        },
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
      }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth()

    const orderId = params.id

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        branch: {
          select: {
            id: true,
            name: true,
            restaurantId: true
          }
        },
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
                price: true,
                description: true,
                image: true
              }
            }
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this order's branch
    if (!canAccessBranch(user.branchId, order.branch.id, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    )
  }
}