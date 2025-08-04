import type { ResourceOptions } from "adminjs"
import { products, orders, customers, categories, brands } from "./admin-data"

// Product Resource Configuration
export const productResource: ResourceOptions = {
  resource: {
    model: products,
    client: null,
  },
  options: {
    navigation: {
      name: "Catalog",
      icon: "Package",
    },
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      name: {
        isTitle: true,
        isRequired: true,
      },
      model: {
        isRequired: true,
      },
      brand: {
        isRequired: true,
      },
      category: {
        isRequired: true,
      },
      price: {
        type: "number",
        isRequired: true,
      },
      stock: {
        type: "number",
        isRequired: true,
      },
      description: {
        type: "textarea",
      },
      image: {
        type: "string",
      },
      features: {
        type: "mixed",
        isArray: true,
      },
      specifications: {
        type: "mixed",
      },
      isActive: {
        type: "boolean",
      },
      createdAt: {
        type: "datetime",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      updatedAt: {
        type: "datetime",
        isVisible: { list: false, filter: false, show: true, edit: false },
      },
    },
    actions: {
      new: {
        isVisible: true,
      },
      edit: {
        isVisible: true,
      },
      delete: {
        isVisible: true,
      },
      show: {
        isVisible: true,
      },
    },
  },
}

// Order Resource Configuration
export const orderResource: ResourceOptions = {
  resource: {
    model: orders,
    client: null,
  },
  options: {
    navigation: {
      name: "Sales",
      icon: "ShoppingCart",
    },
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      customerName: {
        isTitle: true,
      },
      customerEmail: {
        type: "email",
      },
      items: {
        type: "mixed",
        isArray: true,
      },
      total: {
        type: "number",
      },
      status: {
        type: "string",
        availableValues: [
          { value: "pending", label: "Pending" },
          { value: "processing", label: "Processing" },
          { value: "shipped", label: "Shipped" },
          { value: "delivered", label: "Delivered" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
      paymentMethod: {
        type: "string",
        availableValues: [
          { value: "cod", label: "Cash on Delivery" },
          { value: "card", label: "Credit/Debit Card" },
          { value: "bank_transfer", label: "Bank Transfer" },
        ],
      },
      paymentStatus: {
        type: "string",
        availableValues: [
          { value: "pending", label: "Pending" },
          { value: "paid", label: "Paid" },
          { value: "failed", label: "Failed" },
        ],
      },
      shippingAddress: {
        type: "textarea",
      },
      createdAt: {
        type: "datetime",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      updatedAt: {
        type: "datetime",
        isVisible: { list: false, filter: false, show: true, edit: false },
      },
    },
  },
}

// Customer Resource Configuration
export const customerResource: ResourceOptions = {
  resource: {
    model: customers,
    client: null,
  },
  options: {
    navigation: {
      name: "Customers",
      icon: "Users",
    },
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      name: {
        isTitle: true,
        isRequired: true,
      },
      email: {
        type: "email",
        isRequired: true,
      },
      phone: {
        type: "phone",
      },
      company: {
        type: "string",
      },
      address: {
        type: "textarea",
      },
      totalOrders: {
        type: "number",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      totalSpent: {
        type: "number",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      createdAt: {
        type: "datetime",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      updatedAt: {
        type: "datetime",
        isVisible: { list: false, filter: false, show: true, edit: false },
      },
    },
  },
}

// Category Resource Configuration
export const categoryResource: ResourceOptions = {
  resource: {
    model: categories,
    client: null,
  },
  options: {
    navigation: {
      name: "Catalog",
      icon: "Tag",
    },
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      name: {
        isTitle: true,
        isRequired: true,
      },
      slug: {
        isRequired: true,
      },
      description: {
        type: "textarea",
      },
      image: {
        type: "string",
      },
      productCount: {
        type: "number",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      isActive: {
        type: "boolean",
      },
      createdAt: {
        type: "datetime",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      updatedAt: {
        type: "datetime",
        isVisible: { list: false, filter: false, show: true, edit: false },
      },
    },
  },
}

// Brand Resource Configuration
export const brandResource: ResourceOptions = {
  resource: {
    model: brands,
    client: null,
  },
  options: {
    navigation: {
      name: "Catalog",
      icon: "Award",
    },
    properties: {
      id: {
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      name: {
        isTitle: true,
        isRequired: true,
      },
      description: {
        type: "textarea",
      },
      logo: {
        type: "string",
      },
      website: {
        type: "url",
      },
      productCount: {
        type: "number",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      isActive: {
        type: "boolean",
      },
      createdAt: {
        type: "datetime",
        isVisible: { list: true, filter: true, show: true, edit: false },
      },
      updatedAt: {
        type: "datetime",
        isVisible: { list: false, filter: false, show: true, edit: false },
      },
    },
  },
}
