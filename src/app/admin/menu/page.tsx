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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Utensils,
  Image as ImageIcon,
  Tag,
  DollarSign,
  CheckCircle,
  XCircle
} from "lucide-react"

interface MenuItem {
  id: string
  name: string
  description?: string
  price: number
  image?: string
  vegetarian: boolean
  available: boolean
  sortOrder: number
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  description?: string
  image?: string
  sortOrder: number
  active: boolean
  _count: {
    menuItems: number
  }
}

interface Branch {
  id: string
  name: string
}

export default function MenuManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBranch, setSelectedBranch] = useState<string>("all")
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddMenuItem, setShowAddMenuItem] = useState(false)

  // Form states
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    sortOrder: 0
  })

  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    vegetarian: false,
    available: true,
    sortOrder: 0
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchCategories()
      fetchMenuItems()
      fetchBranches()
    }
  }, [status, session, router])

  const fetchCategories = async () => {
    try {
      const restaurantId = session?.user?.restaurantId
      if (!restaurantId) return

      const response = await fetch(`/api/categories?restaurantId=${restaurantId}`)
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchMenuItems = async () => {
    try {
      const restaurantId = session?.user?.restaurantId
      if (!restaurantId) return

      const response = await fetch(`/api/menu-items?restaurantId=${restaurantId}`)
      if (response.ok) {
        const data = await response.json()
        setMenuItems(data)
      }
    } catch (error) {
      console.error("Error fetching menu items:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBranches = async () => {
    try {
      const restaurantId = session?.user?.restaurantId
      if (!restaurantId) return

      const response = await fetch(`/api/branches?restaurantId=${restaurantId}`)
      if (response.ok) {
        const data = await response.json()
        setBranches(data)
      }
    } catch (error) {
      console.error("Error fetching branches:", error)
    }
  }

  const handleAddCategory = async () => {
    try {
      const restaurantId = session?.user?.restaurantId
      if (!restaurantId) return

      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCategory,
          restaurantId
        }),
      })

      if (response.ok) {
        setShowAddCategory(false)
        setNewCategory({ name: "", description: "", sortOrder: 0 })
        fetchCategories()
      }
    } catch (error) {
      console.error("Error adding category:", error)
    }
  }

  const handleAddMenuItem = async () => {
    try {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMenuItem),
      })

      if (response.ok) {
        setShowAddMenuItem(false)
        setNewMenuItem({
          name: "",
          description: "",
          price: 0,
          categoryId: "",
          vegetarian: false,
          available: true,
          sortOrder: 0
        })
        fetchMenuItems()
      }
    } catch (error) {
      console.error("Error adding menu item:", error)
    }
  }

  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || item.category.id === selectedCategory

    return matchesSearch && matchesCategory
  })

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
              <span className="ml-3 text-xl font-bold text-gray-900">Menu Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="menu-items" className="space-y-4">
          <TabsList>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="branch-menus">Branch Menus</TabsTrigger>
          </TabsList>

          <TabsContent value="menu-items" className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                <p className="text-gray-600">Manage your restaurant menu items</p>
              </div>
              <Dialog open={showAddMenuItem} onOpenChange={setShowAddMenuItem}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                    <DialogDescription>
                      Create a new menu item for your restaurant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Item name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Price (৳)</label>
                        <Input
                          type="number"
                          value={newMenuItem.price}
                          onChange={(e) => setNewMenuItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Select 
                          value={newMenuItem.categoryId} 
                          onValueChange={(value) => setNewMenuItem(prev => ({ ...prev, categoryId: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newMenuItem.vegetarian}
                          onChange={(e) => setNewMenuItem(prev => ({ ...prev, vegetarian: e.target.checked }))}
                        />
                        <span className="text-sm">Vegetarian</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newMenuItem.available}
                          onChange={(e) => setNewMenuItem(prev => ({ ...prev, available: e.target.checked }))}
                        />
                        <span className="text-sm">Available</span>
                      </label>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddMenuItem(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMenuItem}>
                        Add Item
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search menu items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {item.image && (
                    <div className="relative h-48">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      {item.vegetarian && (
                        <Badge className="absolute top-2 right-2 bg-green-500">
                          Vegetarian
                        </Badge>
                      )}
                      {!item.available && (
                        <Badge className="absolute top-2 left-2 bg-red-500">
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-orange-500">
                        ৳{item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{item.category.name}</Badge>
                        {item.available ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMenuItems.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Utensils className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or add your first menu item.
                  </p>
                  <Button onClick={() => setShowAddMenuItem(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Menu Item
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                <p className="text-gray-600">Manage your menu categories</p>
              </div>
              <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                      Create a new menu category for your restaurant
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <Input
                        value={newCategory.name}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Category name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={newCategory.description}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Category description"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sort Order</label>
                      <Input
                        type="number"
                        value={newCategory.sortOrder}
                        onChange={(e) => setNewCategory(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowAddCategory(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddCategory}>
                        Add Category
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {category._count.menuItems} items
                      </span>
                      <Badge variant={category.active ? "default" : "secondary"}>
                        {category.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="branch-menus" className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Branch Menus</h2>
              <p className="text-gray-600">Manage menu availability across different branches</p>
            </div>

            <Card>
              <CardContent className="text-center py-12">
                <Tag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Branch Menu Management</h3>
                <p className="text-gray-600 mb-4">
                  Configure which menus and menu items are available at each branch.
                </p>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Branch Menus
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}