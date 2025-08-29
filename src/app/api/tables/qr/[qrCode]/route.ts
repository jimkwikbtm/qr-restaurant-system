import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { qrCode: string } }
) {
  try {
    const qrCode = params.qrCode

    const table = await db.table.findUnique({
      where: { qrCode },
      include: {
        branch: {
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
        }
      }
    })

    if (!table) {
      return NextResponse.json(
        { error: "Table not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(table)
  } catch (error) {
    console.error("Error fetching table:", error)
    return NextResponse.json(
      { error: "Failed to fetch table" },
      { status: 500 }
    )
  }
}