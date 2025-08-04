"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const relatedProducts = [
  {
    id: "2",
    name: "RGB LED Par Light",
    model: "PAR-64RGB",
    brand: "StageMax",
    price: 299,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.6,
  },
  {
    id: "3",
    name: "Laser Light System",
    model: "LS-5000",
    brand: "LaserTech",
    price: 1299,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.9,
  },
  {
    id: "4",
    name: "LED Strip Light",
    model: "STRIP-1000",
    brand: "FlexLight",
    price: 149,
    image: "/placeholder.svg?height=300&width=400",
    rating: 4.7,
  },
]

interface RelatedProductsProps {
  categoryId: string
  currentProductId: string
}

export function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Related Products</h2>

        <div className="grid md:grid-cols-2  lg:grid-cols-3  gap-8">
          {relatedProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl  transition-all duration-300">
              <CardHeader className="p-0 ">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center bg-black/70 text-white px-2 py-1 rounded text-sm">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {product.rating}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <Badge variant="secondary" className="text-xs mb-2">
                  {product.brand}
                </Badge>
                <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                <p className="text-muted-foreground mb-4">{product.model}</p>
                <div className="text-2xl font-bold text-primary mb-4">${product.price.toLocaleString()}</div>

                <div className="flex gap-2">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Details
                    </Button>
                  </Link>
                  <Button size="sm" className="flex-1">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
