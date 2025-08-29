import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const restaurantId = searchParams.get("restaurantId")
    
    const whereClause: any = { active: true }
    if (restaurantId) {
      whereClause.restaurantId = restaurantId
    }

    const branches = await db.branch.findMany({
      where: whereClause,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true
          }
        },
        _count: {
          select: {
            tables: true,
            orders: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(branches)
  } catch (error) {
    console.error("Error fetching branches:", error)
    return NextResponse.json(
      { error: "Failed to fetch branches" },
      { status: 500 }
    )
  }
}