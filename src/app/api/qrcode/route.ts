import { NextRequest, NextResponse } from "next/server"
import QRCode from "qrcode"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tableId = searchParams.get("tableId")
    const branchId = searchParams.get("branchId")

    if (!tableId && !branchId) {
      return NextResponse.json(
        { error: "Either tableId or branchId is required" },
        { status: 400 }
      )
    }

    let qrData: string

    if (tableId) {
      // Generate QR code for specific table
      const table = await db.table.findUnique({
        where: { id: tableId },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              restaurant: {
                select: {
                  id: true,
                  name: true
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

      qrData = `${process.env.NEXTAUTH_URL}/table/${table.qrCode}`
    } else {
      // Generate QR code for branch
      const branch = await db.branch.findUnique({
        where: { id: branchId as string },
        select: {
          id: true,
          name: true,
          restaurant: {
            select: {
              id: true,
              name: true
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

      qrData = `${process.env.NEXTAUTH_URL}/branch/${branch.id}`
    }

    // Generate QR code
    const qrCode = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({
      qrCode,
      data: qrData
    })
  } catch (error) {
    console.error("Error generating QR code:", error)
    return NextResponse.json(
      { error: "Failed to generate QR code" },
      { status: 500 }
    )
  }
}