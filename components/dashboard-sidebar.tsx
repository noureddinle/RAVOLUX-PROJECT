"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, Mail, BarChart2, ExternalLink } from 'lucide-react' // Import BarChart2 for statistics icon

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Newsletter",
    href: "/dashboard/newsletter",
    icon: Mail,
  },
  {
    title: "Statistics", // New item
    href: "/dashboard/statistics", // New href
    icon: BarChart2, // New icon
  }
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar {...props} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg px-2 py-4">
          <Package className="h-6 w-6" />
          <span className="sr-only">Acme Inc</span>
          <span className="group-data-[state=collapsed]:hidden">Acme Inc</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent >
            <SidebarMenu className="">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title} className="px-5 py-2 border-l-2 border-transparent rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-medium">Website</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem className="px-5 py-2 border-l-2 border-transparent rounded hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
                <SidebarMenuButton asChild>
                  <Link href="/" target="_blank">
                    <ExternalLink />
                    <span>View Website</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
