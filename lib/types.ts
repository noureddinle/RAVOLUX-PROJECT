export interface Product {
  id: string
  name: string
  model: string
  brand: string
  category: string
  price: number | null
  image: string
  images?: string[]
  rating: number
  reviewCount: number
  features: string[]
  specifications: Record<string, string>
  description: string
  isNew?: boolean
  isBestseller?: boolean
  inStock: boolean
  sku: string
}

export interface Brand {
  id: string
  name: string
  logo: string
  description: string
  website: string
  productCount: number
  featured: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  productCount: number
  subcategories?: Category[]
}

export interface Service {
  id: string
  title: string
  description: string
  features: string[]
  icon: string
  price?: number
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  content: string
  rating: number
  image?: string
}

export interface QuoteItem {
  productId: string
  quantity: number
  notes?: string
}

export interface Quote {
  id: string
  items: QuoteItem[]
  customerInfo: {
    name: string
    email: string
    phone: string
    company?: string
  }
  status: "pending" | "sent" | "accepted" | "rejected"
  createdAt: Date
  updatedAt: Date
}
