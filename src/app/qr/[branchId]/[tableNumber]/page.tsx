"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, MapPin, Phone, Clock, Star, ShoppingCart, Utensils, Truck, QrCode } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Branch {
  id: string
  name: string
  description?: string
  address: string
  phone?: string
  restaurant: {
    id: string
    name: string
    logo?: string
    description?: string
  }
}

interface Table {
  id: string
  number: number
  capacity: number
  qrCode: string
}

export default function QRPage({ params }: { params: { branchId: string; tableNumber: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [branch, setBranch] = useState<Branch | null>(null)
  const [table, setTable] = useState<Table | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")

  useEffect(() => {
    fetchBranchAndTable()
  }, [params.branchId, params.tableNumber])

  const fetchBranchAndTable = async () => {
    try {
      setLoading(true)
      setError("")

      // Fetch branch data
      const branchResponse = await fetch(`/api/branches?restaurantId=${params.branchId}`)
      if (!branchResponse.ok) {
        throw new Error("Failed to fetch branch data")
      }
      const branches = await branchResponse.json()
      const foundBranch = branches.find((b: Branch) => b.id === params.branchId)
      
      if (!foundBranch) {
        throw new Error("Branch not found")
      }
      setBranch(foundBranch)

      // Fetch table data
      const tableResponse = await fetch(`/api/tables?branchId=${params.branchId}`)
      if (!tableResponse.ok) {
        throw new Error("Failed to fetch table data")
      }
      const tables = await tableResponse.json()
      const foundTable = tables.find((t: Table) => t.number === parseInt(params.tableNumber))
      
      if (!foundTable) {
        throw new Error("Table not found")
      }
      setTable(foundTable)
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleOrderTypeSelect = (type: "dine-in" | "takeaway" | "delivery") => {
    setOrderType(type)
    // Redirect to homepage with pre-selected branch and table
    router.push(`/?branch=${params.branchId}&table=${params.tableNumber}&type=${type}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurant information...</p>
        </div>
      </div>
    )
  }

  if (error || !branch || !table) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-red-500" />
            </div>
            <CardTitle className="text-xl text-red-600">QR Code Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertDescription>{error || "Invalid QR code"}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button asChild>
                <Link href="/">Go to Homepage</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">QR</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">QR Restaurant</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Find Us
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-500">{branch.name}</span>
          </h1>
          <p className="text-lg text-gray-600">
            You have successfully scanned the QR code for Table {table.number}
          </p>
        </div>

        {/* Branch and Table Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  {branch.restaurant.logo ? (
                    <Image
                      src={branch.restaurant.logo}
                      alt={branch.restaurant.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-xs font-bold">{branch.restaurant.name.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{branch.name}</h3>
                    <p className="text-sm text-gray-600">{branch.restaurant.name}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">{branch.address}</p>
                  {branch.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{branch.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Open: 10:00 AM - 10:00 PM</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  <span>4.5 (324 reviews)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <QrCode className="w-5 h-5 mr-2" />
                Table Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Table Number:</span>
                  <span className="text-lg font-bold text-orange-500">#{table.number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Capacity:</span>
                  <span>{table.capacity} guests</span>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-32 h-32 bg-white mx-auto rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    QR Code for Table {table.number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">How would you like to order?</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred ordering method
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={orderType === "dine-in" ? "default" : "outline"}
                className="h-auto p-6 flex flex-col items-center space-y-3"
                onClick={() => handleOrderTypeSelect("dine-in")}
              >
                <Utensils className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Dine-in</h3>
                  <p className="text-sm text-gray-600">Order at your table</p>
                </div>
              </Button>
              
              <Button
                variant={orderType === "takeaway" ? "default" : "outline"}
                className="h-auto p-6 flex flex-col items-center space-y-3"
                onClick={() => handleOrderTypeSelect("takeaway")}
              >
                <ShoppingCart className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Takeaway</h3>
                  <p className="text-sm text-gray-600">Pick up your order</p>
                </div>
              </Button>
              
              <Button
                variant={orderType === "delivery" ? "default" : "outline"}
                className="h-auto p-6 flex flex-col items-center space-y-3"
                onClick={() => handleOrderTypeSelect("delivery")}
              >
                <Truck className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold">Delivery</h3>
                  <p className="text-sm text-gray-600">Get it delivered</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Options */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Or browse our full menu without ordering
          </p>
          <Button variant="outline" asChild>
            <Link href={`/?branch=${params.branchId}`}>
              View Menu Only
            </Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">QR</span>
              </div>
              <span className="ml-2 text-lg font-bold">QR Restaurant</span>
            </div>
            <p className="text-gray-400 mb-4">
              Modern QR code-based restaurant management system for Bangladesh
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2024 QR Restaurant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}