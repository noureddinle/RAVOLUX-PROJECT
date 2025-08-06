"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Grid, List, Star, ShoppingCart, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { Product, CartItem, ApiResponse } from "@/types/supabase"
import { API_URL } from "@/lib/api"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        const result: ApiResponse<Product[]> = await response.json()

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch products")
        }

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch products")
        }

        setProducts(result.data)
      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "Failed to load products",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.thumbnail_image || "/placeholder.svg",
      quantity: 1,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Professional Lighting Equipment</h1>
        <p className="text-gray-600 text-sm md:text-base">Discover our complete range of stage lighting products</p>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-gray-200 focus:ring-0 focus:ring-offset-0"
            />
          </div>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-4 border-gray-200 focus:border-gray-200 focus:ring-0 focus:ring-offset-0">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 border-gray-200 focus:border-gray-200 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 focus:border-gray-200 focus:ring-0 focus:ring-offset-0 cursor-pointer">
              <SelectItem value="name" className="cursor-pointer">Name (A-Z)</SelectItem>
              <SelectItem value="price-low" className="cursor-pointer">Price (Low to High)</SelectItem>
              <SelectItem value="price-high" className="cursor-pointer">Price (High to Low)</SelectItem>
            </SelectContent>
          </Select>

          
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 text-sm md:text-base">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {/* Products Grid */}
      <div
        className={`grid gap-4 md:gap-6 ${
          viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 border-none">
            <CardHeader className="p-0">
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.thumbnail_image || "/placeholder.svg"}
                  alt={product.name}
                  width={400}
                  height={300}
                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "grid" ? "w-full h-48 md:h-64" : "w-full h-48"
                  }`}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {product.is_new && <Badge className="bg-green-500 hover:bg-green-600 text-xs">New</Badge>}
                  {product.is_best_seller && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-xs">Bestseller</Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded text-xs">
                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                    {product.rating}
                  </div>
                </div>
                {!product.in_stock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="destructive" className="text-sm px-3 py-1">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 md:p-6">
              <div className="mb-2">
                <Badge variant="secondary" className="text-xs">
                  {product.brand}
                </Badge>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-muted-foreground mb-4 text-sm">{product.model}</p>

              <div className="flex items-center space-x-2 mb-4">
                <div className="text-xl md:text-2xl font-bold text-primary">${product.price.toLocaleString()}</div>
                {product.original_price && (
                  <div className="text-sm md:text-lg text-gray-500 line-through">
                    ${product.original_price.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex items-center text-xs md:text-sm text-gray-600 mb-4">
                <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 mr-1" />
                {product.rating} ({product.review_count} reviews)
              </div>

              <div className="flex gap-2">
                <Link href={`/products/${product.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent text-xs md:text-sm">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    View
                  </Button>
                </Link>
                <Button
                  size="sm"
                  className="flex-1 text-xs md:text-sm"
                  disabled={!product.in_stock}
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search terms</p>
          <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
        </div>
      )}
    </div>
  )
}
