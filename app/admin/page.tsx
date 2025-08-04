"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Eye,
  AlertCircle,
  BarChart3,
  Settings,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/hooks/use-toast"

// Mock data - in real app this would come from API
const mockProducts = [
  {
    id: "1",
    name: "LED Moving Head Spot",
    model: "MH-350X",
    brand: "ProLight",
    price: 2499,
    stock: 15,
    category: "Moving Head Lights",
    status: "active",
  },
  {
    id: "2",
    name: "RGB LED Par Light",
    model: "PAR-64RGB",
    brand: "StageMax",
    price: 299,
    stock: 45,
    category: "LED Par Lights",
    status: "active",
  },
]

const mockOrders = [
  {
    id: "ORD-001",
    customer: "John Smith",
    total: 2499,
    status: "pending",
    date: "2024-01-15",
    paymentMethod: "COD",
  },
  {
    id: "ORD-002",
    customer: "Sarah Johnson",
    total: 598,
    status: "completed",
    date: "2024-01-14",
    paymentMethod: "Card",
  },
]

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState(mockProducts)
  const [orders, setOrders] = useState(mockOrders)
  const [newProduct, setNewProduct] = useState({
    name: "",
    model: "",
    brand: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Access Denied",
        description: "Please log in to access the admin dashboard.",
        variant: "destructive",
      })
      router.push("/")
      return
    }

    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have admin privileges to access this page.",
        variant: "destructive",
      })
      router.push("/")
      return
    }
  }, [isAuthenticated, isAdmin, router])

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the product name and price.",
        variant: "destructive",
      })
      return
    }

    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      model: newProduct.model,
      brand: newProduct.brand,
      price: Number.parseFloat(newProduct.price),
      stock: Number.parseInt(newProduct.stock) || 0,
      category: newProduct.category,
      status: "active",
      image: newProduct.image || "/placeholder.svg?height=300&width=400",
    }

    setProducts([...products, product])
    setNewProduct({
      name: "",
      model: "",
      brand: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      image: "",
    })
    setImagePreview(null)

    toast({
      title: "Product Added",
      description: "New product has been added successfully.",
    })
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
    toast({
      title: "Product Deleted",
      description: "Product has been removed from inventory.",
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setNewProduct({ ...newProduct, image: result })
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Don't render anything if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Access Denied</h1>
          <p className="text-slate-600 mb-8 leading-relaxed">You need admin privileges to access this page.</p>
          <Button onClick={() => router.push("/")} className="px-8 py-3 font-medium">
            Return Home
          </Button>
        </div>
      </div>
    )
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = products.length
  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3 tracking-tight">Admin Dashboard</h1>
              <p className="text-lg text-slate-600 font-light">
                Manage your lighting equipment business with precision
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200"
              >
                LightPro Admin Portal
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-2 tracking-wide uppercase">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-900 tracking-tight">${totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">+12% from last month</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-2 tracking-wide uppercase">Total Products</p>
                  <p className="text-3xl font-bold text-blue-900 tracking-tight">{totalProducts}</p>
                  <p className="text-xs text-blue-600 mt-1 font-medium">Active inventory</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Package className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700 mb-2 tracking-wide uppercase">Total Orders</p>
                  <p className="text-3xl font-bold text-purple-900 tracking-tight">{totalOrders}</p>
                  <p className="text-xs text-purple-600 mt-1 font-medium">All time orders</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingCart className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700 mb-2 tracking-wide uppercase">Pending Orders</p>
                  <p className="text-3xl font-bold text-orange-900 tracking-tight">{pendingOrders}</p>
                  <p className="text-xs text-orange-600 mt-1 font-medium">Requires attention</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="h-7 w-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white border shadow-sm rounded-xl p-2">
            <TabsTrigger
              value="products"
              className="font-medium text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
            >
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="font-medium text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="font-medium text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="font-medium text-slate-700 data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Add Product Form */}
              <Card className="border-0 shadow-xl bg-white">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-slate-900">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Plus className="h-5 w-5 text-white" />
                    </div>
                    <span>Add New Product</span>
                  </CardTitle>
                  <p className="text-slate-600 font-light">Create a new product listing</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700 tracking-wide">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Enter product name"
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="model" className="text-sm font-semibold text-slate-700 tracking-wide">
                        Model
                      </Label>
                      <Input
                        id="model"
                        value={newProduct.model}
                        onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
                        placeholder="Model number"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-sm font-semibold text-slate-700 tracking-wide">
                        Brand
                      </Label>
                      <Input
                        id="brand"
                        value={newProduct.brand}
                        onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                        placeholder="Brand name"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-sm font-semibold text-slate-700 tracking-wide">
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        placeholder="0.00"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-sm font-semibold text-slate-700 tracking-wide">
                        Stock Quantity
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        placeholder="0"
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold text-slate-700 tracking-wide">
                      Category
                    </Label>
                    <Input
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="Product category"
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-sm font-semibold text-slate-700 tracking-wide">
                      Product Image
                    </Label>
                    <div className="space-y-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {imagePreview && (
                        <div className="relative w-full h-32 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null)
                              setNewProduct({ ...newProduct, image: "" })
                            }}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-semibold text-slate-700 tracking-wide">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Product description and features..."
                      rows={4}
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium resize-none"
                    />
                  </div>
                  <Button
                    onClick={handleAddProduct}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </CardContent>
              </Card>

              {/* Products List */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Product Inventory</h3>
                  <Badge variant="outline" className="px-3 py-1 font-medium">
                    {products.length} Products
                  </Badge>
                </div>
                <div className="space-y-4">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {product.image && (
                            <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">{product.name}</h4>
                            <p className="text-slate-600 font-medium mb-3">
                              {product.model} • {product.brand}
                            </p>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 font-medium"
                              >
                                {product.category}
                              </Badge>
                              <span className="text-sm text-slate-600 font-medium">
                                Stock: <span className="font-bold text-slate-900">{product.stock}</span>
                              </span>
                              <span className="text-lg font-bold text-green-600">
                                ${product.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-6">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors bg-transparent"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                      Recent Orders
                    </CardTitle>
                    <p className="text-slate-600 font-light">Manage customer orders and transactions</p>
                  </div>
                  <Badge variant="outline" className="px-3 py-1 font-medium">
                    {orders.length} Orders
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-slate-200 rounded-xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-white to-slate-50"
                    >
                      <div className="flex-1 mb-4 md:mb-0">
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{order.id}</h4>
                        <p className="text-slate-600 font-medium mb-1">{order.customer}</p>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right">
                          <p className="text-xl font-bold text-slate-900 mb-1">${order.total.toLocaleString()}</p>
                          <Badge
                            variant={order.status === "completed" ? "default" : "secondary"}
                            className={`mb-1 font-medium ${
                              order.status === "completed"
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                                : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                          <p className="text-sm text-slate-600 font-medium">{order.paymentMethod}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors bg-transparent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl font-bold text-green-900">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-white" />
                    </div>
                    <span>Sales Analytics</span>
                  </CardTitle>
                  <p className="text-green-700 font-light">Revenue performance overview</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
                      <span className="font-semibold text-green-800">This Month</span>
                      <span className="text-xl font-bold text-green-900">${(totalRevenue * 0.3).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
                      <span className="font-semibold text-green-800">Last Month</span>
                      <span className="text-xl font-bold text-green-900">${(totalRevenue * 0.25).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
                      <span className="font-semibold">Growth Rate</span>
                      <span className="text-xl font-bold">+20%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center space-x-3 text-xl font-bold text-blue-900">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-white" />
                    </div>
                    <span>Top Categories</span>
                  </CardTitle>
                  <p className="text-blue-700 font-light">Best performing product categories</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
                      <span className="font-semibold text-blue-800">Moving Head Lights</span>
                      <span className="text-xl font-bold text-blue-900">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/50 rounded-lg">
                      <span className="font-semibold text-blue-800">LED Par Lights</span>
                      <span className="text-xl font-bold text-blue-900">30%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg text-white">
                      <span className="font-semibold">Controllers</span>
                      <span className="text-xl font-bold">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-8">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-slate-900">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <span>System Settings</span>
                </CardTitle>
                <p className="text-slate-600 font-light">Configure your store preferences</p>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="tax-rate" className="text-sm font-semibold text-slate-700 tracking-wide">
                      Tax Rate (%)
                    </Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      defaultValue="8"
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping-fee" className="text-sm font-semibold text-slate-700 tracking-wide">
                      Shipping Fee ($)
                    </Label>
                    <Input
                      id="shipping-fee"
                      type="number"
                      defaultValue="50"
                      className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free-shipping" className="text-sm font-semibold text-slate-700 tracking-wide">
                    Free Shipping Threshold ($)
                  </Label>
                  <Input
                    id="free-shipping"
                    type="number"
                    defaultValue="500"
                    className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 font-medium max-w-md"
                  />
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200">
                  <Settings className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
