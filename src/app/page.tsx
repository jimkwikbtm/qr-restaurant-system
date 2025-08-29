"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Phone, Clock, Star, ShoppingCart, Utensils, Truck } from "lucide-react"
import Image from "next/image"
import CheckoutModal from "@/components/checkout-modal"

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
  _count: {
    tables: number
    orders: number
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

interface MenuResponse {
  categories: Category[]
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

export default function Home() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [menuData, setMenuData] = useState<MenuResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway" | "delivery">("dine-in")
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [tableNumber, setTableNumber] = useState<number | undefined>(undefined)

  useEffect(() => {
    // Check for URL parameters from QR code
    const urlParams = new URLSearchParams(window.location.search)
    const branchParam = urlParams.get("branch")
    const tableParam = urlParams.get("table")
    const typeParam = urlParams.get("type") as "dine-in" | "takeaway" | "delivery" | null

    if (tableParam) {
      setTableNumber(parseInt(tableParam))
    }

    fetchBranches(branchParam, typeParam)
  }, [])

  const fetchBranches = async (preSelectedBranch?: string | null, preSelectedType?: string | null) => {
    try {
      const response = await fetch("/api/branches")
      if (response.ok) {
        const data = await response.json()
        setBranches(data)
        
        // Set pre-selected branch from URL parameter
        if (preSelectedBranch) {
          setSelectedBranch(preSelectedBranch)
          fetchMenu(preSelectedBranch)
        }
        
        // Set pre-selected order type from URL parameter
        if (preSelectedType && (preSelectedType === "dine-in" || preSelectedType === "takeaway" || preSelectedType === "delivery")) {
          setOrderType(preSelectedType)
        }
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
    }
  }

  const fetchMenu = async (branchId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/menu?branchId=${branchId}`)
      if (response.ok) {
        const data = await response.json()
        setMenuData(data)
      }
    } catch (error) {
      console.error("Error fetching menu:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleBranchSelect = (branchId: string) => {
    setSelectedBranch(branchId)
    if (branchId) {
      fetchMenu(branchId)
    } else {
      setMenuData(null)
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

  const getAllMenuItems = () => {
    if (!menuData) return []
    return menuData.categories.flatMap(category => category.items)
  }

  const getCartTotal = () => {
    const allItems = getAllMenuItems()
    return Object.entries(cart).reduce((sum, [itemId, quantity]) => {
      const item = allItems.find(i => i.id === itemId)
      return sum + (item ? item.price * quantity : 0)
    }, 0)
  }

  const filteredCategories = menuData?.categories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.items.length > 0)

  const selectedBranchData = branches.find(b => b.id === selectedBranch)

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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-orange-500">QR Restaurant</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Experience the future of dining with our QR code-based ordering system
          </p>
        </div>

        {/* Branch Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Select Your Branch
            </CardTitle>
            <CardDescription>
              Choose your preferred restaurant branch to view the menu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedBranch} onValueChange={handleBranchSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                        {branch.restaurant.logo ? (
                          <Image
                            src={branch.restaurant.logo}
                            alt={branch.restaurant.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-bold">{branch.restaurant.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{branch.name}</div>
                        <div className="text-sm text-gray-500">{branch.address}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Order Type Selection */}
        {selectedBranch && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Type</CardTitle>
              <CardDescription>Choose how you'd like to enjoy your meal</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={orderType} onValueChange={(value) => setOrderType(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dine-in" className="flex items-center">
                    <Utensils className="w-4 h-4 mr-2" />
                    Dine-in
                  </TabsTrigger>
                  <TabsTrigger value="takeaway" className="flex items-center">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Takeaway
                  </TabsTrigger>
                  <TabsTrigger value="delivery" className="flex items-center">
                    <Truck className="w-4 h-4 mr-2" />
                    Delivery
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Menu Display */}
        {selectedBranch && menuData && (
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
              {/* Branch Info */}
              {selectedBranchData && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Branch Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold">{selectedBranchData.name}</h3>
                        <p className="text-sm text-gray-600">{selectedBranchData.address}</p>
                      </div>
                      {selectedBranchData.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm">{selectedBranchData.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm">Open: 10:00 AM - 10:00 PM</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-2 text-yellow-400" />
                        <span className="text-sm">4.5 (324 reviews)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Order Summary */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>৳0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>৳0.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>৳0.00</span>
                    </div>
                    <hr />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>৳{getCartTotal().toFixed(2)}</span>
                    </div>
                    <Button 
                      className="w-full bg-orange-500 hover:bg-orange-600"
                      onClick={() => setIsCheckoutOpen(true)}
                      disabled={getCartItemCount() === 0}
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* QR Code Option */}
              <Card>
                <CardHeader>
                  <CardTitle>Scan QR Code</CardTitle>
                  <CardDescription>
                    Scan the QR code at your table for faster ordering
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">QR Code</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Or scan this code to go directly to this branch
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading menu...</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">QR</span>
                </div>
                <span className="ml-2 text-lg font-bold">QR Restaurant</span>
              </div>
              <p className="text-gray-400">
                Modern QR code-based restaurant management system for Bangladesh
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Menu</a></li>
                <li><a href="#" className="hover:text-white">Locations</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Order Types</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Dine-in</a></li>
                <li><a href="#" className="hover:text-white">Takeaway</a></li>
                <li><a href="#" className="hover:text-white">Delivery</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +880 1234-567890
                </li>
                <li className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Dhaka, Bangladesh
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QR Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        menuItems={getAllMenuItems()}
        branchId={selectedBranch}
        orderType={orderType}
        tableNumber={tableNumber}
      />
    </div>
  )
}