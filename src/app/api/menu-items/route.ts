import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, canAccessRestaurant } from "@/lib/rbac"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")

    if (!restaurantId) {
      return NextResponse.json(
        { error: "Restaurant ID is required" },
        { status: 400 }
      )
    }

    // Check if user has access to this restaurant
    if (!canAccessRestaurant(user.restaurantId, restaurantId, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const menuItems = await db.menuItem.findMany({
      where: {
        category: {
          restaurantId
        }
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        sortOrder: "asc"
      }
    })

    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER, UserRole.MANAGER, UserRole.BRANCH_MANAGER)

    const body = await request.json()
    const { name, description, price, categoryId, vegetarian, available, sortOrder } = body

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { error: "Name, price, and category ID are required" },
        { status: 400 }
      )
    }

    // Verify the category exists and user has access
    const category = await db.category.findUnique({
      where: { id: categoryId },
      include: {
        restaurant: {
          select: {
            id: true
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this restaurant
    if (!canAccessRestaurant(user.restaurantId, category.restaurant.id, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const menuItem = await db.menuItem.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        vegetarian: vegetarian || false,
        available: available !== undefined ? available : true,
        sortOrder: sortOrder || 0
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(menuItem)
  } catch (error) {
    console.error("Error creating menu item:", error)
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    )
  }
}