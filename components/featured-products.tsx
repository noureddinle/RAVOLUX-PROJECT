"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Product, ApiResponse } from "@/types/supabase";
import { toast } from "@/hooks/use-toast";
import { API_URL } from "@/lib/api";

export function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchFeaturedProducts = async () => {
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

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch products");
        }

        setFeaturedProducts(result.data);
      } catch (err: any) {
        setError(err.message || "Failed to load featured products");
        toast({
          title: "Error",
          description: err.message || "Failed to load featured products",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToQuote = async (product: Product) => {
    try {
      const response = await fetch(`${API_URL}/api/carts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "",
          session_id: "",
          product_id: product.id,
          quantity: 1,
          price_at_time: product.price,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to add to quote");
      }
      toast({
        title: "Added to Quote",
        description: `${product.name} has been added to your quote.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add to quote",
        variant: "destructive",
      });
    }
  };

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Featured Products
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Professional Lighting Equipment</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover our carefully curated selection of premium stage lighting equipment from the world's leading
              manufacturers.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

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

        {loading ? (
          <p className="text-center" aria-live="polite">
            Loading featured products...
          </p>
        ) : error ? (
          <p className="text-red-500 text-center" aria-live="polite">
            {error}
          </p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center" aria-live="polite">
            No featured products found
          </p>
        ) : (
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
                    <div className="relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.thumbnail_image || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {product.is_new && <Badge className="bg-green-500 hover:bg-green-600">New</Badge>}
                        {product.is_best_seller && (
                          <Badge className="bg-orange-500 hover:bg-orange-600">Bestseller</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="mb-2 w-full">
                      <h3 className="text-xl font-bold">{product.name}</h3>
                    </div>
                    {product.model && <p className="text-muted-foreground mb-2">{product.model}</p>}
                    <div className="text-2xl font-bold text-primary mb-2">
                      {product.price > 0 ? `$${product.price.toLocaleString()}` : "Request Quote"}
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/products/${product.slug || product.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleAddToQuote(product)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Quote
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" variant="outline" className="px-8 bg-transparent">
            <Link href="/products">View All Products</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}