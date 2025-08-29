"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Phone, Clock, Star, ShoppingCart, Utensils, Motorcycle, Users } from "lucide-react"
import Image from "next/image"

interface TableData {
  id: string
  number: number
  capacity: number
  branch: {
    id: string
    name: string
    address: string
    phone?: string
    restaurant: {
      id: string
      name: string
      logo?: string
    }
  }
}

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  vegetarian: boolean
  available: boolean
}

interface Category {
  id: string
  name: string
  description?: string
  image?: string
  sortOrder: number
  items: MenuItem[]
}

export default function TablePage() {
  const params = useParams()
  const router = useRouter()
  const [tableData, setTableData] = useState<TableData | null>(null)
  const [menuData, setMenuData] = useState<{ categories: Category[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  })

  useEffect(() => {
    const qrCode = params.qrCode as string
    if (qrCode) {
      fetchTableData(qrCode)
    }
  }, [params.qrCode])

  const fetchTableData = async (qrCode: string) => {
    try {
      // First, get table info by QR code
      const tableResponse = await fetch(`/api/tables/qr/${qrCode}`)
      if (tableResponse.ok) {
        const table = await tableResponse.json()
        setTableData(table)
        
        // Then get menu data for the branch
        const menuResponse = await fetch(`/api/menu?branchId=${table.branch.id}`)
        if (menuResponse.ok) {
          const menu = await menuResponse.json()
          setMenuData(menu)
        }
      }
    } catch (error) {
      console.error("Error fetching table data:", error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (itemId: string) => {
    setCart(prev => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }))
  }

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev }
      if (newCart[itemId] > 1) {
        newCart[itemId]--
      } else {
        delete newCart[itemId]
      }
      return newCart
    })
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0)
  }

  const getCartTotal = () => {
    if (!menuData) return 0
    let total = 0
    Object.entries(cart).forEach(([itemId, quantity]) => {
      const item = menuData.categories.flatMap(c => c.items).find(i => i.id === itemId)
      if (item) {
        total += item.price * quantity
      }
    })
    return total
  }

  const filteredCategories = menuData?.categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  const handleOrderSubmit = async () => {
    if (getCartItemCount() === 0) {
      alert("Please add items to your cart")
      return
    }

    if (orderType === "delivery" && !customerInfo.address) {
      alert("Please provide delivery address")
      return
    }

    if (!customerInfo.name || !customerInfo.phone) {
      alert("Please provide your name and phone number")
      return
    }

    try {
      const orderData = {
        branchId: tableData?.branch.id,
        tableId: tableData?.id,
        type: orderType,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email,
        deliveryAddress: orderType === "delivery" ? customerInfo.address : null,
        items: Object.entries(cart).map(([itemId, quantity]) => ({
          menuItemId: itemId,
          quantity,
          price: menuData?.categories.flatMap(c => c.items).find(i => i.id === itemId)?.price || 0
        }))
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const order = await response.json()
        alert(`Order placed successfully! Order #${order.orderNumber}`)
        setCart({})
        router.push("/")
      } else {
        alert("Failed to place order. Please try again.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      alert("Failed to place order. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!tableData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Invalid QR Code</CardTitle>
            <CardDescription className="text-center">
              The QR code you scanned is not valid. Please try again or contact staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Go to Homepage
            </Button>
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
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  Table {tableData.number}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tableData.branch.name}
                </Badge>
              </div>
              <div className="relative">
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Cart
                  {getCartItemCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                      {getCartItemCount()}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Categories */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search menu..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </div>

            {filteredCategories?.map((category) => (
              <Card key={category.id} className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {category.image && (
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                    )}
                    {category.name}
                  </CardTitle>
                  {category.description && (
                    <CardDescription>{category.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.items.map((item) => (
                      <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {item.image && (
                          <div className="relative h-48">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                            {item.vegetarian && (
                              <Badge className="absolute top-2 right-2 bg-green-500">
                                Vegetarian
                              </Badge>
                            )}
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-orange-500">
                              ৳{item.price.toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2">
                              {cart[item.id] ? (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    -
                                  </Button>
                                  <span className="font-medium">{cart[item.id]}</span>
                                  <Button
                                    size="sm"
                                    onClick={() => addToCart(item.id)}
                                  >
                                    +
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(item.id)}
                                  className="bg-orange-500 hover:bg-orange-600"
                                >
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Table Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold">Table {tableData.number}</h3>
                    <p className="text-sm text-gray-600">Capacity: {tableData.capacity} people</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{tableData.branch.name}</h3>
                    <p className="text-sm text-gray-600">{tableData.branch.address}</p>
                  </div>
                  {tableData.branch.phone && (
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{tableData.branch.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">Open: 10:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Type */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="dine-in" className="flex items-center text-xs">
                      <Utensils className="w-3 h-3 mr-1" />
                      Dine-in
                    </TabsTrigger>
                    <TabsTrigger value="takeaway" className="flex items-center text-xs">
                      <ShoppingCart className="w-3 h-3 mr-1" />
                      Takeaway
                    </TabsTrigger>
                    <TabsTrigger value="delivery" className="flex items-center text-xs">
                      <Motorcycle className="w-3 h-3 mr-1" />
                      Delivery
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Customer Info */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Input
                    placeholder="Your Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="Phone Number"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <Input
                    placeholder="Email (optional)"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                  {orderType === "delivery" && (
                    <Input
                      placeholder="Delivery Address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>৳{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%):</span>
                    <span>৳{(getCartTotal() * 0.1).toFixed(2)}</span>
                  </div>
                  {orderType === "delivery" && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>৳50.00</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>৳{(getCartTotal() * 1.1 + (orderType === "delivery" ? 50 : 0)).toFixed(2)}</span>
                  </div>
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={handleOrderSubmit}
                    disabled={getCartItemCount() === 0}
                  >
                    Place Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}