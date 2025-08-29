import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { requireAuth, requireRole, canAccessBranch } from "@/lib/rbac"
import { UserRole } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get("branchId")

    if (!branchId) {
      return NextResponse.json(
        { error: "Branch ID is required" },
        { status: 400 }
      )
    }

    // Check if user has access to this branch
    if (!canAccessBranch(user.branchId, branchId, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    const tables = await db.table.findMany({
      where: { branchId },
      include: {
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: {
        number: "asc"
      }
    })

    return NextResponse.json(tables)
  } catch (error) {
    console.error("Error fetching tables:", error)
    return NextResponse.json(
      { error: "Failed to fetch tables" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    await requireRole(UserRole.SUPER_ADMIN, UserRole.RESTAURANT_OWNER, UserRole.MANAGER, UserRole.BRANCH_MANAGER)

    const body = await request.json()
    const { branchId, number, capacity } = body

    if (!branchId || !number || !capacity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if user has access to this branch
    if (!canAccessBranch(user.branchId, branchId, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    // Check if table number already exists in this branch
    const existingTable = await db.table.findFirst({
      where: {
        branchId,
        number
      }
    })

    if (existingTable) {
      return NextResponse.json(
        { error: "Table number already exists in this branch" },
        { status: 400 }
      )
    }

    // Create new table
    const qrCode = `qr-table-${branchId}-${number}`
    
    const table = await db.table.create({
      data: {
        branchId,
        number,
        capacity,
        qrCode,
        active: true
      },
      include: {
        branch: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(table)
  } catch (error) {
    console.error("Error creating table:", error)
    return NextResponse.json(
      { error: "Failed to create table" },
      { status: 500 }
    )
  }
}