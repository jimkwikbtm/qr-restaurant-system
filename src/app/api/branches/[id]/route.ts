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

    const branch = await db.branch.findUnique({
      where: { id: branchId },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true
          }
        },
        tables: {
          select: {
            id: true,
            number: true,
            capacity: true,
            qrCode: true,
            active: true
          }
        },
        _count: {
          select: {
            orders: true,
            users: true
          }
        }
      }
    })

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      )
    }

    // Check if user has access to this branch
    if (!canAccessBranch(user.branchId, branchId, user.role)) {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      )
    }

    return NextResponse.json(branch)
  } catch (error) {
    console.error("Error fetching branch:", error)
    return NextResponse.json(
      { error: "Failed to fetch branch" },
      { status: 500 }
    )
  }
}