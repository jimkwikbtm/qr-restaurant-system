import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { OrderType, OrderStatus, PaymentStatus } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      branchId,
      tableId,
      type,
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      items
    } = body

    // Validate required fields
    if (!branchId || !type || !customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    items.forEach((item: any) => {
      subtotal += item.price * item.quantity
    })

    const tax = subtotal * 0.1 // 10% tax
    const deliveryFee = type === OrderType.DELIVERY ? 50 : 0
    const total = subtotal + tax + deliveryFee

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    // Create order
    const order = await db.order.create({
      data: {
        orderNumber,
        type: type as OrderType,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        subtotal,
        tax,
        deliveryFee,
        total,
        notes: deliveryAddress ? `Delivery to: ${deliveryAddress}` : null,
        customerName,
        customerPhone,
        customerEmail,
        deliveryAddress,
        branchId,
        tableId
      }
    })

    // Create order items
    const orderItems = await Promise.all(
      items.map((item: any) =>
        db.orderItem.create({
          data: {
            orderId: order.id,
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price
          }
        })
      )
    )

    return NextResponse.json({
      ...order,
      items: orderItems
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    const status = searchParams.get("status")

    const whereClause: any = {}
    if (branchId) whereClause.branchId = branchId
    if (status) whereClause.status = status

    const orders = await db.order.findMany({
      where: whereClause,
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
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}