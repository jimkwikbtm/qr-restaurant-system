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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  Puzzle, 
  Plus, 
  Search, 
  Download, 
  Upload, 
  Settings,
  Star,
  CheckCircle,
  XCircle,
  ExternalLink,
  Calendar,
  DollarSign,
  Users,
  Zap
} from "lucide-react"

interface Addon {
  id: string
  name: string
  version: string
  description: string
  type: "feature" | "theme" | "integration"
  category: string
  author: string
  price: number
  rating: number
  downloads: number
  active: boolean
  installed: boolean
  config?: string
  lastUpdated: string
  features: string[]
  requirements: string[]
}

interface RestaurantAddon {
  id: string
  addonId: string
  active: boolean
  config?: string
  installedAt: string
  addon: Addon
}

export default function AddonManagement() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showInstallAddon, setShowInstallAddon] = useState(false)
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null)

  const [availableAddons, setAvailableAddons] = useState<Addon[]>([])
  const [installedAddons, setInstalledAddons] = useState<RestaurantAddon[]>([])

  // Mock data for available add-ons
  const mockAvailableAddons: Addon[] = [
    {
      id: "1",
      name: "Advanced Analytics",
      version: "1.2.0",
      description: "Comprehensive analytics and reporting dashboard with detailed insights into your restaurant performance.",
      type: "feature",
      category: "analytics",
      author: "QR Restaurant Team",
      price: 29.99,
      rating: 4.8,
      downloads: 1250,
      active: false,
      installed: false,
      lastUpdated: "2024-01-15",
      features: ["Sales Analytics", "Customer Insights", "Menu Performance", "Staff Performance"],
      requirements: ["PHP 7.4+", "MySQL 5.7+", "SSL Certificate"]
    },
    {
      id: "2",
      name: "Customer Loyalty Program",
      version: "2.1.0",
      description: "Build customer loyalty with points, rewards, and membership tiers.",
      type: "feature",
      category: "marketing",
      author: "QR Restaurant Team",
      price: 19.99,
      rating: 4.6,
      downloads: 890,
      active: false,
      installed: false,
      lastUpdated: "2024-01-10",
      features: ["Points System", "Rewards Catalog", "Membership Tiers", "Birthday Rewards"],
      requirements: ["PHP 7.4+", "MySQL 5.7+"]
    },
    {
      name: "Online Payment Gateway",
      version: "3.0.0",
      description: "Accept payments online with multiple payment methods including credit cards and mobile wallets.",
      type: "integration",
      category: "payments",
      author: "QR Restaurant Team",
      price: 39.99,
      rating: 4.9,
      downloads: 2100,
      active: false,
      installed: false,
      lastUpdated: "2024-01-20",
      features: ["Credit Card Processing", "Mobile Wallets", "Recurring Payments", "Refund Management"],
      requirements: ["SSL Certificate", "PCI Compliance", "Payment Processor Account"]
    },
    {
      name: "Modern Dark Theme",
      version: "1.5.0",
      description: "Sleek dark theme perfect for evening dining and modern restaurants.",
      type: "theme",
      category: "themes",
      author: "Design Studio",
      price: 9.99,
      rating: 4.7,
      downloads: 567,
      active: false,
      installed: false,
      lastUpdated: "2024-01-12",
      features: ["Dark Color Scheme", "Modern Typography", "Responsive Design", "Customizable Colors"],
      requirements: ["No special requirements"]
    },
    {
      name: "Inventory Management",
      version: "2.3.0",
      description: "Track and manage your restaurant inventory in real-time with automated alerts.",
      type: "feature",
      category: "operations",
      author: "QR Restaurant Team",
      price: 24.99,
      rating: 4.5,
      downloads: 743,
      active: false,
      installed: false,
      lastUpdated: "2024-01-18",
      features: ["Real-time Tracking", "Low Stock Alerts", "Supplier Management", "Cost Analysis"],
      requirements: ["PHP 7.4+", "MySQL 5.7+", "Barcode Scanner (Optional)"]
    },
    {
      name: "Table Reservation System",
      version: "1.8.0",
      description: "Allow customers to book tables online with automated confirmation and reminders.",
      type: "feature",
      category: "reservations",
      author: "QR Restaurant Team",
      price: 15.99,
      rating: 4.4,
      downloads: 634,
      active: false,
      installed: false,
      lastUpdated: "2024-01-08",
      features: ["Online Booking", "Automated Reminders", "Table Management", "Waitlist System"],
      requirements: ["PHP 7.4+", "MySQL 5.7+", "Email/SMTP Setup"]
    }
  ]

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated") {
      fetchAddons()
    }
  }, [status, session, router])

  const fetchAddons = async () => {
    try {
      // In a real implementation, you would fetch from your API
      setAvailableAddons(mockAvailableAddons)
      setInstalledAddons([]) // Mock empty installed add-ons
    } catch (error) {
      console.error("Error fetching add-ons:", error)
    } finally {
      setLoading(false)
    }
  }

  const installAddon = async (addon: Addon) => {
    try {
      // In a real implementation, you would call your API to install the add-on
      console.log(`Installing addon: ${addon.name}`)
      
      // Simulate installation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update UI
      setAvailableAddons(prev => 
        prev.map(a => a.id === addon.id ? { ...a, installed: true } : a)
      )
      
      alert(`${addon.name} has been installed successfully!`)
    } catch (error) {
      console.error("Error installing add-on:", error)
      alert("Failed to install add-on. Please try again.")
    }
  }

  const toggleAddon = async (restaurantAddon: RestaurantAddon) => {
    try {
      // In a real implementation, you would call your API to toggle the add-on
      console.log(`Toggling addon: ${restaurantAddon.addon.name}`)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update UI
      setInstalledAddons(prev => 
        prev.map(ra => 
          ra.id === restaurantAddon.id 
            ? { ...ra, active: !ra.active } 
            : ra
        )
      )
      
      alert(`${restaurantAddon.addon.name} has been ${restaurantAddon.active ? 'deactivated' : 'activated'}!`)
    } catch (error) {
      console.error("Error toggling add-on:", error)
      alert("Failed to toggle add-on. Please try again.")
    }
  }

  const filteredAddons = availableAddons.filter(addon => {
    const matchesSearch = 
      addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      addon.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || addon.category === categoryFilter
    const matchesType = typeFilter === "all" || addon.type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const categories = [...new Set(availableAddons.map(addon => addon.category))]
  const types = [...new Set(availableAddons.map(addon => addon.type))]

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
              <span className="ml-3 text-xl font-bold text-gray-900">Add-on Management</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                Back
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Add-on
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add-ons</h1>
          <p className="text-gray-600">Extend your restaurant functionality with add-ons and themes</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Add-ons</TabsTrigger>
            <TabsTrigger value="installed">Installed</TabsTrigger>
            <TabsTrigger value="updates">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search add-ons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="feature">Features</SelectItem>
                      <SelectItem value="theme">Themes</SelectItem>
                      <SelectItem value="integration">Integrations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Add-ons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAddons.map((addon) => (
                <Card key={addon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        <Puzzle className="h-6 w-6 text-orange-500" />
                        <div>
                          <CardTitle className="text-lg">{addon.name}</CardTitle>
                          <CardDescription className="text-sm">v{addon.version}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-medium">{addon.rating}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{addon.description}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <Badge variant="outline">{addon.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Category:</span>
                        <span className="font-medium">{addon.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="font-medium text-green-600">
                          {addon.price === 0 ? "Free" : `$${addon.price}/month`}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Downloads:</span>
                        <span className="font-medium">{addon.downloads.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Features:</h4>
                      <div className="space-y-1">
                        {addon.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-600">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                            {feature}
                          </div>
                        ))}
                        {addon.features.length > 3 && (
                          <div className="text-xs text-gray-500">
                            +{addon.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-4">
                      {addon.installed ? (
                        <Button variant="outline" className="flex-1" disabled>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Installed
                        </Button>
                      ) : (
                        <Button 
                          className="flex-1" 
                          onClick={() => installAddon(addon)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          {addon.price === 0 ? "Install Free" : `Install $${addon.price}/mo`}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedAddon(addon)
                          setShowInstallAddon(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAddons.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Puzzle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No add-ons found</h3>
                  <p className="text-gray-600">
                    Try adjusting your filters or check back later for new add-ons.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="installed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Installed Add-ons
                </CardTitle>
                <CardDescription>
                  Manage your installed add-ons and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {installedAddons.length === 0 ? (
                  <div className="text-center py-12">
                    <Puzzle className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No add-ons installed</h3>
                    <p className="text-gray-600 mb-4">
                      Browse the add-on marketplace to extend your restaurant functionality.
                    </p>
                    <Button onClick={() => router.push("/admin/addons?tab=browse")}>
                      Browse Add-ons
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {installedAddons.map((restaurantAddon) => (
                      <div key={restaurantAddon.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Puzzle className="h-8 w-8 text-orange-500" />
                          <div>
                            <h3 className="font-medium">{restaurantAddon.addon.name}</h3>
                            <p className="text-sm text-gray-600">{restaurantAddon.addon.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Version {restaurantAddon.addon.version}</div>
                            <div className="text-sm text-gray-500">
                              Installed {new Date(restaurantAddon.installedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={restaurantAddon.active}
                              onCheckedChange={() => toggleAddon(restaurantAddon)}
                            />
                            <span className="text-sm">{restaurantAddon.active ? "Active" : "Inactive"}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="updates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Available Updates
                </CardTitle>
                <CardDescription>
                  Keep your add-ons up to date with the latest features and security patches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All add-ons are up to date</h3>
                  <p className="text-gray-600">
                    You're running the latest versions of all your installed add-ons.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Add-on Details Dialog */}
      <Dialog open={showInstallAddon} onOpenChange={setShowInstallAddon}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Puzzle className="h-5 w-5 mr-2" />
              {selectedAddon?.name}
            </DialogTitle>
            <DialogDescription>
              Version {selectedAddon?.version} by {selectedAddon?.author}
            </DialogDescription>
          </DialogHeader>
          
          {selectedAddon && (
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600">{selectedAddon.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <Badge variant="outline">{selectedAddon.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span>{selectedAddon.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Price:</span>
                      <span className="font-medium text-green-600">
                        {selectedAddon.price === 0 ? "Free" : `$${selectedAddon.price}/month`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{selectedAddon.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Downloads:</span>
                      <span>{selectedAddon.downloads.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Last Updated:</span>
                      <span>{new Date(selectedAddon.lastUpdated).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="space-y-1">
                    {selectedAddon.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Requirements</h4>
                <div className="space-y-1">
                  {selectedAddon.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Zap className="h-4 w-4 mr-2 text-blue-500" />
                      {requirement}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowInstallAddon(false)}>
                  Cancel
                </Button>
                {selectedAddon.installed ? (
                  <Button variant="outline" disabled>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Already Installed
                  </Button>
                ) : (
                  <Button onClick={() => {
                    installAddon(selectedAddon)
                    setShowInstallAddon(false)
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    {selectedAddon.price === 0 ? "Install Free" : `Install $${selectedAddon.price}/mo`}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}