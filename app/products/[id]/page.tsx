"use client"

import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { useParams } from "next/navigation"

export default function ProductPage() {
  const { id } = useParams()

  return (
    <div className="min-h-screen bg-background">
      {/* ProductDetail handles its own data fetching */}
      <ProductDetail />
      
      {/* RelatedProducts needs the current product ID */}
      <RelatedProducts  
      />
    </div>
  )
}