"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building, 
  Users, 
  Utensils, 
  ShoppingCart, 
  Settings, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MapPin,
  Phone,
  Star,
  Table,
  ChefHat,
  Users2
} from "lucide-react"

interface Branch {
  id: string
  name: string
  description?: string
  address: string
  phone?: string
  email?: string
  active: boolean
  restaurant: {
    id: string
    name: string
  }
  tables: Table[]
  _count: {
    orders: number
    users: number
  }
}

interface Table {
  id: string
  number: number
  capacity: number
  qrCode: string
  active: boolean
}

interface DashboardStats {
  totalTables: number
  totalOrders: number
  totalStaff: number
  recentOrders: any[]
}

export default function BranchAdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [branch, setBranch] = useState<Branch | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && 
              session?.user?.role !== "BRANCH_MANAGER" && 
              session?.user?.role !== "MANAGER" && 
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

      const response = await fetch(`/api/branches/${branchId}/stats`)
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session || 
      (session.user.role !== "BRANCH_MANAGER" && 
       session.user.role !== "MANAGER" && 
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
              <span className="ml-3 text-xl font-bold text-gray-900">Branch Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-800">
                BRANCH MANAGER
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
                <Building className="h-5 w-5 mr-2" />
                {branch.name}
              </CardTitle>
              <CardDescription>{branch.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{branch.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">4.5 (324 reviews)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tables</CardTitle>
              <Table className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTables || 0}</div>
              <p className="text-xs text-muted-foreground">
                Available tables
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">
                All time orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalStaff || 0}</div>
              <p className="text-xs text-muted-foreground">
                Staff members
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest orders from your branch</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentOrders?.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">Table {order.table?.number || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={order.status === "PENDING" ? "secondary" : "default"}>
                            {order.status}
                          </Badge>
                          <p className="text-sm font-medium">৳{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common branch management tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="h-20 flex-col" variant="outline">
                      <Plus className="h-6 w-6 mb-2" />
                      Add Table
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Users2 className="h-6 w-6 mb-2" />
                      Manage Staff
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <Utensils className="h-6 w-6 mb-2" />
                      Update Menu
                    </Button>
                    <Button className="h-20 flex-col" variant="outline">
                      <TrendingUp className="h-6 w-6 mb-2" />
                      View Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Table Management</CardTitle>
                <CardDescription>Manage tables and QR codes for your branch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Your Tables</h3>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Table
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {branch?.tables.map((table) => (
                    <Card key={table.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">Table {table.number}</CardTitle>
                        <CardDescription>Capacity: {table.capacity} people</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Status:</span>
                            <Badge variant={table.active ? "default" : "secondary"}>
                              {table.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">QR Code:</span>
                            <span className="text-sm font-mono">{table.qrCode.slice(-8)}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View QR
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Menu Management</CardTitle>
                <CardDescription>Manage your branch menu and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Menu Management</h3>
                  <p className="text-gray-600 mb-4">
                    Update menu items, pricing, and availability for your branch.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Menu Item
                    </Button>
                    <Button variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Manage Categories
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>View and manage orders from your branch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Management</h3>
                  <p className="text-gray-600 mb-4">
                    Track, manage, and update orders from your branch.
                  </p>
                  <Button>
                    <Eye className="h-4 w-4 mr-2" />
                    View All Orders
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage your branch staff and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Staff Management</h3>
                  <p className="text-gray-600 mb-4">
                    Add, edit, and manage staff accounts for your branch.
                  </p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Branch Settings</CardTitle>
                <CardDescription>Configure your branch settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Branch Settings</h3>
                  <p className="text-gray-600 mb-4">
                    Update branch information, operating hours, and other preferences.
                  </p>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Settings
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