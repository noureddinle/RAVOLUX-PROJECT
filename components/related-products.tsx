"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Product, ApiResponse } from "@/types/supabase"
import { useState, useEffect } from "react"
import { toast } from "@/hooks/use-toast"
import { API_URL } from "@/lib/api"



export function RelatedProducts() {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/api/products`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const result: ApiResponse<Product[]> = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch products");
        }

        setRelatedProducts(result.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch products");
        toast({
          title: "Error",
          description: err.message || "Failed to fetch products",
          variant: "destructive",
        })
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, []);

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Related Products</h2>

        <div className="grid md:grid-cols-2  lg:grid-cols-3  gap-8">
          {relatedProducts.map((product: Product) => (
            <Card key={product.id} className="group hover:shadow-xl  transition-all duration-300 border-none">
              <CardHeader className="p-0 ">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={product.thumbnail_image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                  />
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
                    <Button variant="outline" size="sm" className="w-full bg-transparent hover:bg-blue-500 hover:text-white">
                      View Details
                    </Button>
                  </Link>
                  <Button size="sm" className="flex-1 hover:bg-blue-500 hover:text-white">
                    <ShoppingCart className="h-4 w-4 mr-2 " />
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
