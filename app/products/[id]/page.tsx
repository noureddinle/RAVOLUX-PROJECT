import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { ProductReviews } from "@/components/product-reviews"

// This would typically come from a database
async function getProduct(id: string) {
  // Mock product data
  return {
    id,
    name: "LED Moving Head Spot",
    model: "MH-350X",
    brand: "ProLight",
    price: 2499,
    originalPrice: 2799,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    stockCount: 15,
    sku: "PL-MH350X-001",
    category: "Moving Head Lights",
    description:
      "Professional LED moving head spotlight with advanced features for stage and event lighting. Features high-quality optics, smooth movement, and reliable performance.",
    features: [
      "350W High-Power LED Source",
      "16-bit Resolution Pan/Tilt Movement",
      "CMY Color Mixing System",
      "Zoom Range: 6° - 50°",
      "Rotating Gobo Wheel (7 + Open)",
      "3-Facet Prism Effect",
      "Frost Filter for Soft Edge",
      "DMX-512 Control Protocol",
      "PowerCON TRUE1 Input/Output",
      "RDM Compatible",
    ],
    specifications: {
      "Light Source": "350W LED",
      "Color Temperature": "6500K",
      "Beam Angle": "6° - 50°",
      "Pan Range": "540°",
      "Tilt Range": "270°",
      "Control Channels": "20/26 DMX Channels",
      "Power Consumption": "400W",
      Weight: "22 kg",
      Dimensions: "380 x 520 x 680 mm",
      "IP Rating": "IP20",
    },
    warranty: "2 Years Manufacturer Warranty",
    shipping: {
      weight: "22 kg",
      dimensions: "380 x 520 x 680 mm",
      freeShipping: true,
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProduct(id)

  return (
    <div className="min-h-screen bg-background">
      <ProductDetail product={product} />
      <RelatedProducts categoryId={product.category} currentProductId={product.id} />
      <ProductReviews productId={product.id} />
    </div>
  )
}
