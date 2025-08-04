import AdminJS from "adminjs"
import AdminJSExpress from "@adminjs/express"
import express from "express"
import session from "express-session"
import bcrypt from "bcrypt"
import {
  productResource,
  orderResource,
  customerResource,
  categoryResource,
  brandResource,
} from "../lib/admin-resources"

// AdminJS Configuration
const adminJs = new AdminJS({
  resources: [productResource, orderResource, customerResource, categoryResource, brandResource],
  rootPath: "/admin",
  branding: {
    companyName: "LightPro Solutions",
    logo: "/logo.png",
    withMadeWithLove: false,
    favicon: "/favicon.ico",
    theme: {
      colors: {
        primary100: "#3b82f6",
        primary80: "#1d4ed8",
        primary60: "#1e40af",
        primary40: "#1e3a8a",
        primary20: "#1e3a8a",
        grey100: "#f8fafc",
        grey80: "#e2e8f0",
        grey60: "#94a3b8",
        grey40: "#64748b",
        grey20: "#334155",
        filterBg: "#ffffff",
        accent: "#10b981",
        hoverBg: "#f1f5f9",
      },
    },
  },
  dashboard: {
    component: AdminJS.bundle("./components/dashboard"),
    handler: async (request, response, context) => {
      // Dashboard data
      const dashboardData = {
        totalProducts: 25,
        totalOrders: 156,
        totalCustomers: 89,
        totalRevenue: 125000,
        recentOrders: [
          { id: "ORD-001", customer: "John Smith", total: 2499, status: "pending" },
          { id: "ORD-002", customer: "Sarah Johnson", total: 598, status: "delivered" },
        ],
        topProducts: [
          { name: "LED Moving Head Spot", sales: 45 },
          { name: "RGB LED Par Light", sales: 32 },
        ],
      }
      return dashboardData
    },
  },
  pages: {
    analytics: {
      component: AdminJS.bundle("./components/analytics"),
      handler: async (request, response, context) => {
        return {
          salesData: [
            { month: "Jan", sales: 12000 },
            { month: "Feb", sales: 15000 },
            { month: "Mar", sales: 18000 },
          ],
          categoryData: [
            { category: "Moving Head Lights", percentage: 45 },
            { category: "LED Par Lights", percentage: 30 },
            { category: "Controllers", percentage: 25 },
          ],
        }
      },
    },
    settings: {
      component: AdminJS.bundle("./components/settings"),
      handler: async (request, response, context) => {
        return {
          taxRate: 8,
          shippingFee: 50,
          freeShippingThreshold: 500,
          companyInfo: {
            name: "LightPro Solutions",
            email: "info@lightpro.com",
            phone: "+1 (555) 123-4567",
            address: "123 Lighting Boulevard, Los Angeles, CA 90028",
          },
        }
      },
    },
  },
})

// Authentication
const authenticate = async (email: string, password: string) => {
  // In production, this would check against a real database
  const adminUsers = [
    {
      email: "admin@lightpro.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  ]

  const user = adminUsers.find((u) => u.email === email)
  if (user && (await bcrypt.compare(password, user.password))) {
    return { email: user.email, role: user.role }
  }
  return null
}

// Create Express app for AdminJS
export const createAdminServer = () => {
  const app = express()

  // Session configuration
  app.use(
    session({
      secret: "lightpro-admin-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  )

  // AdminJS router with authentication
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate,
    cookieName: "lightpro-admin",
    cookiePassword: "lightpro-admin-cookie-secret",
  })

  app.use(adminJs.options.rootPath, adminRouter)

  return app
}

export default adminJs
