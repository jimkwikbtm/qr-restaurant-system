"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Utensils, 
  Table, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ChefHat,
  MapPin,
  Phone,
  Star,
  TrendingUp
} from "lucide-react"

interface Order {
  id: string
  orderNumber: string
  type: string
  status: string
  total: number
  createdAt: string
  table?: {
    number: number
  }
  customerName?: string
  orderItems: {
    id: string
    quantity: number
    menuItem: {
      name: string
      price: number
    }
  }[]
}

interface Branch {
  id: string
  name: string
  address: string
  phone?: string
}

interface DashboardStats {
  pendingOrders: number
  preparingOrders: number
  readyOrders: number
  totalOrders: number
  recentOrders: Order[]
}

export default function StaffDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [branch, setBranch] = useState<Branch | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && 
              session?.user?.role !== "CHEF" && 
              session?.user?.role !== "WAITER" && 
              session?.user?.role !== "STAFF" && 
              session?.user?.role !== "SUPER_ADMIN") {
      router.push("/")
    } else if (status === "authenticated") {
      fetchBranchData()
      fetchDashboardStats()
    }
  }, [status, session, router])

  const fetchBranchData = async () => {
    try {
      const branchId = session?.user?.branchId
      if (!branchId) return

      const response = await fetch(`/api/branches/${branchId}`)
      if (response.ok) {
        const data = await response.json()
        setBranch(data)
      }
    } catch (error) {
      console.error("Error fetching branch data:", error)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const branchId = session?.user?.branchId
      if (!branchId) return

      const response = await fetch(`/api/branches/${branchId}/staff-stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Refresh stats
        fetchDashboardStats()
      }
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session || 
      (session.user.role !== "CHEF" && 
       session.user.role !== "WAITER" && 
       session.user.role !== "STAFF" && 
       session.user.role !== "SUPER_ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don't have permission to access this page.
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

  const userRole = session.user.role
  const isChef = userRole === "CHEF"
  const isWaiter = userRole === "WAITER"

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
              <span className="ml-3 text-xl font-bold text-gray-900">Staff Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                {userRole.replace('_', ' ')}
              </Badge>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Welcome,</span>
                <span className="font-medium">{session.user.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/")}>
                View Site
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Branch Info */}
        {branch && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {branch.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting confirmation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preparing</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.preparingOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                In kitchen
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ready</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.readyOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                Ready for pickup
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                Orders today
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            {isWaiter && <TabsTrigger value="tables">Tables</TabsTrigger>}
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>
                  {isChef ? "View and update order status in the kitchen" : "Manage customer orders"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentOrders?.map((order) => (
                    <Card key={order.id} className="border-l-4 border-l-orange-500">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">Order #{order.orderNumber}</CardTitle>
                            <CardDescription>
                              {order.table ? `Table ${order.table.number}` : 'No table'} • {order.customerName}
                            </CardDescription>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              order.status === 'PENDING' ? 'secondary' :
                              order.status === 'CONFIRMED' ? 'default' :
                              order.status === 'PREPARING' ? 'secondary' :
                              order.status === 'READY' ? 'default' : 'outline'
                            }>
                              {order.status}
                            </Badge>
                            <span className="text-lg font-bold">৳{order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">Order Items:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {order.orderItems.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span>{item.quantity}x {item.menuItem.name}</span>
                                  <span>৳{(item.quantity * item.menuItem.price).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-3 border-t">
                            <div className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                            <div className="flex space-x-2">
                              {isChef && order.status === 'CONFIRMED' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                                >
                                  Start Preparing
                                </Button>
                              )}
                              {isChef && order.status === 'PREPARING' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateOrderStatus(order.id, 'READY')}
                                >
                                  Mark Ready
                                </Button>
                              )}
                              {isWaiter && order.status === 'PENDING' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                                >
                                  Confirm Order
                                </Button>
                              )}
                              {isWaiter && order.status === 'READY' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                                >
                                  Mark Delivered
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isWaiter && (
            <TabsContent value="tables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Table Management</CardTitle>
                  <CardDescription>View and manage restaurant tables</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Table className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Table Management</h3>
                    <p className="text-gray-600 mb-4">
                      View table status, availability, and generate QR codes.
                    </p>
                    <Button>
                      <Eye className="h-4 w-4 mr-2" />
                      View All Tables
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Profile</CardTitle>
                <CardDescription>View and update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-gray-600">{session.user.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-gray-600">{session.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <p className="text-gray-600">{userRole.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Branch</label>
                      <p className="text-gray-600">{branch?.name}</p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}