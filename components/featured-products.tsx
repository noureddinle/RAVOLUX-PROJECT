"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Eye, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface Product {
  id: string
  name: string
  model: string
  brand: string
  price: number | null
  image: string
  rating: number
  features: string[]
  isNew?: boolean
  isBestseller?: boolean
}

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "LED Moving Head Spot",
    model: "MH-350X",
    brand: "ProLight",
    price: 2499,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    features: ["350W LED", "16-bit Resolution", "CMY Color Mixing", "Zoom 6°-50°"],
    isNew: true,
  },
  {
    id: "2",
    name: "RGB LED Par Light",
    model: "PAR-64RGB",
    brand: "StageMax",
    price: 299,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
    features: ["64 LEDs", "DMX Control", "RGB Color Mixing", "Silent Operation"],
    isBestseller: true,
  },
  {
    id: "3",
    name: "Laser Light System",
    model: "LS-5000",
    brand: "LaserTech",
    price: null,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
    features: ["5W RGB Laser", "ILDA Compatible", "Auto/Sound/DMX", "Safety Certified"],
  },
  {
    id: "4",
    name: "LED Strip Light",
    model: "STRIP-1000",
    brand: "FlexLight",
    price: 149,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
    features: ["1000 LEDs/m", "IP65 Rated", "Pixel Control", "5m Length"],
  },
  {
    id: "5",
    name: "Fog Machine Pro",
    model: "FOG-3000",
    brand: "AtmosFX",
    price: 899,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.5,
    features: ["3000W Output", "DMX Control", "Timer Function", "5L Tank"],
  },
  {
    id: "6",
    name: "Lighting Console",
    model: "CONSOLE-512",
    brand: "ControlMax",
    price: null,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.8,
    features: ["512 Channels", "Touch Screen", "USB Recording", "Scene Memory"],
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Featured Products
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Professional Lighting Equipment</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our carefully curated selection of premium stage lighting equipment from the world's leading
            manufacturers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 border-none">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group border-none hover:shadow-xl transition-all duration-300 shadow-lg">
                <CardHeader className="p-0 border-none">
                  <div className="relative overflow-hidden rounded-t-lg ">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {product.isNew && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                      {product.isBestseller && <Badge className="bg-orange-500 hover:bg-orange-600">Bestseller</Badge>}
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded text-sm">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {product.rating}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6 ">
                  <div className="mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {product.brand}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground mb-4">{product.model}</p>

                  <div className="space-y-2 mb-4">
                    {product.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="text-2xl font-bold text-primary mb-4">
                    {product.price ? `$${product.price.toLocaleString()}` : "Request Quote"}
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Quote
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" className="px-8 bg-transparent">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
