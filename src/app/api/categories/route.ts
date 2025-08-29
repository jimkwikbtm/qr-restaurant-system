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

    const categories = await db.category.findMany({
      where: { restaurantId },
      include: {
        _count: {
          select: {
            menuItems: true
          }
        }
      },
      orderBy: {
        sortOrder: "asc"
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER)

    const body = await request.json()
    const { name, description, sortOrder, restaurantId } = body

    if (!name || !restaurantId) {
      return NextResponse.json(
        { error: "Name and restaurant ID are required" },
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

    // Check if category name already exists in this restaurant
    const existingCategory = await db.category.findFirst({
      where: {
        restaurantId,
        name
      }
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: "Category name already exists in this restaurant" },
        { status: 400 }
      )
    }

    const category = await db.category.create({
      data: {
        name,
        description,
        sortOrder: sortOrder || 0,
        active: true,
        restaurantId
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}