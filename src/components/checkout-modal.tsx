"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Phone, Mail, Home, Clock, CreditCard, X, ShoppingCart } from "lucide-react"
import Image from "next/image"

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  vegetarian: boolean
  available: boolean
}

interface CartItem extends MenuItem {
  quantity: number
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cart: { [key: string]: number }
  menuItems: MenuItem[]
  branchId: string
  orderType: "dine-in" | "takeaway" | "delivery"
  tableNumber?: number
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  menuItems,
  branchId,
  orderType,
  tableNumber
}: CheckoutModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    deliveryAddress: "",
    notes: ""
  })

  // Calculate order totals
  const cartItems: CartItem[] = Object.entries(cart).map(([itemId, quantity]) => {
    const menuItem = menuItems.find(item => item.id === itemId)
    return menuItem ? { ...menuItem, quantity } : null
  }).filter(Boolean) as CartItem[]

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1
  const deliveryFee = orderType === "delivery" ? 50 : 0
  const total = subtotal + tax + deliveryFee

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Validate required fields based on order type
      if (orderType === "delivery" && !orderData.deliveryAddress) {
        setError("Delivery address is required for delivery orders")
        return
      }

      if (orderType === "dine-in" && !tableNumber) {
        setError("Table number is required for dine-in orders")
        return
      }

      const orderItems = cartItems.map(item => ({
        menuItemId: item.id,
        quantity: item.quantity,
        price: item.price,
        notes: ""
      }))

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          branchId,
          type: orderType,
          tableId: tableNumber ? undefined : undefined, // Would need to get actual table ID
          items: orderItems,
          customerName: orderData.customerName || undefined,
          customerPhone: orderData.customerPhone || undefined,
          customerEmail: orderData.customerEmail || undefined,
          deliveryAddress: orderData.deliveryAddress || undefined,
          notes: orderData.notes || undefined
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create order")
      }

      const order = await response.json()
      setSuccess(true)
      
      // Clear cart and close modal after success
      setTimeout(() => {
        onClose()
        setSuccess(false)
        // Reset form
        setOrderData({
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          deliveryAddress: "",
          notes: ""
        })
      }, 3000)

    } catch (error) {
      console.error("Error creating order:", error)
      setError(error instanceof Error ? error.message : "Failed to create order")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Order Placed Successfully!</h3>
            <p className="text-gray-600">
              Your order has been received and is being prepared.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Review your order and complete your details
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ৳{item.price.toFixed(2)}
                        </p>
                      </div>
                      {item.vegetarian && (
                        <Badge variant="secondary" className="text-xs">
                          Veg
                        </Badge>
                      )}
                    </div>
                    <span className="font-medium">
                      ৳{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                <hr />
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>৳{tax.toFixed(2)}</span>
                </div>
                {orderType === "delivery" && (
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>৳{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span className="text-orange-500">৳{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>
                Please provide your contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="customerName">Full Name</Label>
                  <Input
                    id="customerName"
                    value={orderData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    value={orderData.customerPhone}
                    onChange={(e) => handleInputChange("customerPhone", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="customerEmail">Email (Optional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={orderData.customerEmail}
                  onChange={(e) => handleInputChange("customerEmail", e.target.value)}
                  placeholder="Enter your email address"
                />
              </div>
            </CardContent>
          </Card>

          {/* Order Type Specific Fields */}
          {orderType === "delivery" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={orderData.deliveryAddress}
                    onChange={(e) => handleInputChange("deliveryAddress", e.target.value)}
                    placeholder="Enter your complete delivery address"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {orderType === "dine-in" && tableNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Table Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">Table Number:</span>
                  <Badge variant="outline">#{tableNumber}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Order Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={orderData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any special instructions or notes for your order"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Estimated Time */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>
                  Estimated preparation time: {orderType === "delivery" ? "45-60 minutes" : "30-45 minutes"}
                </span>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || cartItems.length === 0}>
              {loading ? "Processing..." : `Place Order • ৳${total.toFixed(2)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}