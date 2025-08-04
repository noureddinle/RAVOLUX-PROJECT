export interface Product {
  id: string
  name: string
  model: string
  brand: string
  category: string
  price: number
  stock: number
  description: string
  image?: string
  features: string[]
  specifications: Record<string, string>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentMethod: "cod" | "card" | "bank_transfer"
  paymentStatus: "pending" | "paid" | "failed"
  shippingAddress: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company?: string
  address: string
  totalOrders: number
  totalSpent: number
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image?: string
  productCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  description: string
  logo?: string
  website?: string
  productCount: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock data stores
export const products: Product[] = [
  {
    id: "1",
    name: "LED Moving Head Spot",
    model: "MH-350X",
    brand: "ProLight",
    category: "Moving Head Lights",
    price: 2499,
    stock: 15,
    description: "Professional LED moving head spotlight with advanced features for stage and event lighting.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["350W LED", "16-bit Resolution", "CMY Color Mixing", "Zoom 6°-50°"],
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
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "RGB LED Par Light",
    model: "PAR-64RGB",
    brand: "StageMax",
    category: "LED Par Lights",
    price: 299,
    stock: 45,
    description: "High-quality RGB LED Par light with DMX control for professional stage lighting.",
    image: "/placeholder.svg?height=300&width=400",
    features: ["64 LEDs", "DMX Control", "RGB Color Mixing", "Silent Operation"],
    specifications: {
      "Light Source": "64x 3W RGB LEDs",
      "Beam Angle": "25°",
      "Control Channels": "3/7 DMX Channels",
      "Power Consumption": "200W",
      Weight: "3.5 kg",
      Dimensions: "250 x 250 x 320 mm",
      "IP Rating": "IP20",
    },
    isActive: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-16"),
  },
]

export const orders: Order[] = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    customerName: "John Smith",
    customerEmail: "john@example.com",
    items: [
      {
        productId: "1",
        productName: "LED Moving Head Spot",
        quantity: 1,
        price: 2499,
      },
    ],
    total: 2499,
    status: "pending",
    paymentMethod: "cod",
    paymentStatus: "pending",
    shippingAddress: "123 Main St, Los Angeles, CA 90028",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "ORD-002",
    customerId: "CUST-002",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    items: [
      {
        productId: "2",
        productName: "RGB LED Par Light",
        quantity: 2,
        price: 299,
      },
    ],
    total: 598,
    status: "delivered",
    paymentMethod: "card",
    paymentStatus: "paid",
    shippingAddress: "456 Oak Ave, Beverly Hills, CA 90210",
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-16"),
  },
]

export const customers: Customer[] = [
  {
    id: "CUST-001",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1-555-0101",
    company: "Event Productions Inc.",
    address: "123 Main St, Los Angeles, CA 90028",
    totalOrders: 1,
    totalSpent: 2499,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "CUST-002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1-555-0102",
    company: "Creative Lighting Studio",
    address: "456 Oak Ave, Beverly Hills, CA 90210",
    totalOrders: 1,
    totalSpent: 598,
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-16"),
  },
]

export const categories: Category[] = [
  {
    id: "CAT-001",
    name: "Moving Head Lights",
    slug: "moving-head-lights",
    description: "Professional moving head lighting fixtures for stage and event use",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "CAT-002",
    name: "LED Par Lights",
    slug: "led-par-lights",
    description: "LED Par lights for wash lighting and color effects",
    image: "/placeholder.svg?height=200&width=300",
    productCount: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export const brands: Brand[] = [
  {
    id: "BRAND-001",
    name: "ProLight",
    description: "Professional lighting equipment manufacturer",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://prolight.com",
    productCount: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "BRAND-002",
    name: "StageMax",
    description: "Stage lighting solutions provider",
    logo: "/placeholder.svg?height=100&width=200",
    website: "https://stagemax.com",
    productCount: 1,
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]
