"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Settings, 
  Building, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Image as ImageIcon,
  CreditCard,
  Truck,
  Clock
} from "lucide-react"

interface RestaurantSettings {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logo?: string
  coverImage?: string
  currency: string
  timezone: string
  language: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  orderNotifications: boolean
  staffNotifications: boolean
  customerNotifications: boolean
}

interface PaymentSettings {
  cashOnDelivery: boolean
  onlinePayment: boolean
  cardPayment: boolean
  mobilePayment: boolean
  defaultPaymentMethod: string
}

interface DeliverySettings {
  deliveryEnabled: boolean
  minimumOrderAmount: number
  deliveryFee: number
  freeDeliveryThreshold: number
  deliveryRadius: number
  estimatedDeliveryTime: number
}

interface ThemeSettings {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  layoutStyle: string
  customCSS: string
}

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Settings states
  const [restaurantSettings, setRestaurantSettings] = useState<RestaurantSettings>({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
    currency: "BDT",
    timezone: "Asia/Dhaka",
    language: "en"
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    staffNotifications: true,
    customerNotifications: true
  })

  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
    cashOnDelivery: true,
    onlinePayment: false,
    cardPayment: false,
    mobilePayment: false,
    defaultPaymentMethod: "cash"
  })

  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    deliveryEnabled: true,
    minimumOrderAmount: 200,
    deliveryFee: 50,
    freeDeliveryThreshold: 500,
    deliveryRadius: 5,
    estimatedDeliveryTime: 30
  })

  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primaryColor: "#f97316",
    secondaryColor: "#ffffff",
    fontFamily: "Inter",
    layoutStyle: "modern",
    customCSS: ""
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchSettings()
    }
  }, [status, session, router])

  const fetchSettings = async () => {
    try {
      // In a real implementation, you would fetch settings from your API
      // For now, we'll use mock data
      const mockRestaurantSettings: RestaurantSettings = {
        name: "Sample Restaurant",
        description: "A modern QR code-based restaurant",
        address: "123 Gulshan Avenue, Dhaka 1212",
        phone: "+8801234567890",
        email: "info@samplrestaurant.com",
        website: "https://samplrestaurant.com",
        currency: "BDT",
        timezone: "Asia/Dhaka",
        language: "en"
      }

      setRestaurantSettings(mockRestaurantSettings)
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async (section: string) => {
    setSaving(true)
    try {
      // In a real implementation, you would save settings to your API
      console.log(`Saving ${section} settings...`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success message
      alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`)
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/auth/signin")} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">QR</span>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Settings</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Back
              </Button>
              <Button variant="outline" size="sm" onClick={fetchSettings}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your restaurant settings and preferences</p>
        </div>

        <Tabs defaultValue="restaurant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="restaurant">Restaurant</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="delivery">Delivery</TabsTrigger>
            <TabsTrigger value="theme">Theme</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Restaurant Information
                </CardTitle>
                <CardDescription>
                  Basic information about your restaurant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Restaurant Name</Label>
                    <Input
                      id="name"
                      value={restaurantSettings.name}
                      onChange={(e) => setRestaurantSettings(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Restaurant name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={restaurantSettings.email}
                      onChange={(e) => setRestaurantSettings(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="restaurant@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={restaurantSettings.phone}
                      onChange={(e) => setRestaurantSettings(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+8801234567890"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={restaurantSettings.website}
                      onChange={(e) => setRestaurantSettings(prev => ({ ...prev, website: e.target.value }))}
                      placeholder="https://restaurant.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={restaurantSettings.description}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Restaurant description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={restaurantSettings.address}
                    onChange={(e) => setRestaurantSettings(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Full address"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={restaurantSettings.currency} onValueChange={(value) => setRestaurantSettings(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BDT">BDT (৳)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={restaurantSettings.timezone} onValueChange={(value) => setRestaurantSettings(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Dhaka">Asia/Dhaka</SelectItem>
                        <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={restaurantSettings.language} onValueChange={(value) => setRestaurantSettings(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="bn">বাংলা</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("restaurant")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via SMS</p>
                    </div>
                    <Switch
                      id="sms-notifications"
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, smsNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="order-notifications">Order Notifications</Label>
                      <p className="text-sm text-gray-500">Get notified for new orders</p>
                    </div>
                    <Switch
                      id="order-notifications"
                      checked={notificationSettings.orderNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, orderNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="staff-notifications">Staff Notifications</Label>
                      <p className="text-sm text-gray-500">Staff-related notifications</p>
                    </div>
                    <Switch
                      id="staff-notifications"
                      checked={notificationSettings.staffNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, staffNotifications: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="customer-notifications">Customer Notifications</Label>
                      <p className="text-sm text-gray-500">Customer-facing notifications</p>
                    </div>
                    <Switch
                      id="customer-notifications"
                      checked={notificationSettings.customerNotifications}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, customerNotifications: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("notifications")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Settings
                </CardTitle>
                <CardDescription>
                  Configure payment methods and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                      <p className="text-sm text-gray-500">Accept cash payments on delivery</p>
                    </div>
                    <Switch
                      id="cash-on-delivery"
                      checked={paymentSettings.cashOnDelivery}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, cashOnDelivery: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="online-payment">Online Payment</Label>
                      <p className="text-sm text-gray-500">Accept online payments</p>
                    </div>
                    <Switch
                      id="online-payment"
                      checked={paymentSettings.onlinePayment}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, onlinePayment: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="card-payment">Card Payment</Label>
                      <p className="text-sm text-gray-500">Accept credit/debit cards</p>
                    </div>
                    <Switch
                      id="card-payment"
                      checked={paymentSettings.cardPayment}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, cardPayment: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="mobile-payment">Mobile Payment</Label>
                      <p className="text-sm text-gray-500">Accept mobile wallet payments</p>
                    </div>
                    <Switch
                      id="mobile-payment"
                      checked={paymentSettings.mobilePayment}
                      onCheckedChange={(checked) => setPaymentSettings(prev => ({ ...prev, mobilePayment: checked }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="default-payment">Default Payment Method</Label>
                  <Select value={paymentSettings.defaultPaymentMethod} onValueChange={(value) => setPaymentSettings(prev => ({ ...prev, defaultPaymentMethod: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("payments")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="delivery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Delivery Settings
                </CardTitle>
                <CardDescription>
                  Configure delivery options and settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="delivery-enabled">Enable Delivery</Label>
                      <p className="text-sm text-gray-500">Allow delivery orders</p>
                    </div>
                    <Switch
                      id="delivery-enabled"
                      checked={deliverySettings.deliveryEnabled}
                      onCheckedChange={(checked) => setDeliverySettings(prev => ({ ...prev, deliveryEnabled: checked }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="minimum-order">Minimum Order Amount (৳)</Label>
                    <Input
                      id="minimum-order"
                      type="number"
                      value={deliverySettings.minimumOrderAmount}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, minimumOrderAmount: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-fee">Delivery Fee (৳)</Label>
                    <Input
                      id="delivery-fee"
                      type="number"
                      value={deliverySettings.deliveryFee}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, deliveryFee: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="free-delivery-threshold">Free Delivery Threshold (৳)</Label>
                    <Input
                      id="free-delivery-threshold"
                      type="number"
                      value={deliverySettings.freeDeliveryThreshold}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, freeDeliveryThreshold: parseFloat(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="delivery-radius">Delivery Radius (km)</Label>
                    <Input
                      id="delivery-radius"
                      type="number"
                      value={deliverySettings.deliveryRadius}
                      onChange={(e) => setDeliverySettings(prev => ({ ...prev, deliveryRadius: parseFloat(e.target.value) }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="delivery-time">Estimated Delivery Time (minutes)</Label>
                  <Input
                    id="delivery-time"
                    type="number"
                    value={deliverySettings.estimatedDeliveryTime}
                    onChange={(e) => setDeliverySettings(prev => ({ ...prev, estimatedDeliveryTime: parseInt(e.target.value) }))}
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("delivery")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theme" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Theme Settings
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your restaurant
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.primaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary-color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary-color"
                        type="color"
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={themeSettings.secondaryColor}
                        onChange={(e) => setThemeSettings(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="font-family">Font Family</Label>
                    <Select value={themeSettings.fontFamily} onValueChange={(value) => setThemeSettings(prev => ({ ...prev, fontFamily: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="layout-style">Layout Style</Label>
                    <Select value={themeSettings.layoutStyle} onValueChange={(value) => setThemeSettings(prev => ({ ...prev, layoutStyle: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern</SelectItem>
                        <SelectItem value="classic">Classic</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="bold">Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="custom-css">Custom CSS</Label>
                  <Textarea
                    id="custom-css"
                    value={themeSettings.customCSS}
                    onChange={(e) => setThemeSettings(prev => ({ ...prev, customCSS: e.target.value }))}
                    placeholder="Add custom CSS styles here..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => saveSettings("theme")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}