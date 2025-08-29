import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")
    
    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID is required" },
        { status: 400 }
      )
    }

    // Get active menus for this branch
    const branchMenus = await db.branchMenu.findMany({
      where: {
        branchId: branchId,
        active: true,
        menu: {
          active: true
        }
      },
      include: {
        menu: {
          include: {
            menuItems: {
              where: {
                available: true
              },
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    image: true,
                    sortOrder: true
                  }
                }
              },
              orderBy: {
                sortOrder: "asc"
              }
            }
          }
        }
      }
    })

    // Group menu items by category
    const categoriesMap = new Map()
    
    branchMenus.forEach(branchMenu => {
      branchMenu.menu.menuItems.forEach(menuItem => {
        const category = menuItem.category
        if (!categoriesMap.has(category.id)) {
          categoriesMap.set(category.id, {
            ...category,
            items: []
          })
        }
        categoriesMap.get(category.id).items.push({
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image,
          vegetarian: menuItem.vegetarian,
          available: menuItem.available
        })
      })
    })

    const categories = Array.from(categoriesMap.values()).sort((a, b) => a.sortOrder - b.sortOrder)

    return NextResponse.json({
      categories,
      branch: await db.branch.findUnique({
        where: { id: branchId },
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          restaurant: {
            select: {
              id: true,
              name: true,
              logo: true
            }
          }
        }
      })
    })
  } catch (error) {
    console.error("Error fetching menu:", error)
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    )
  }
}