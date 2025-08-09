"use client"

import { usePathname } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  const isDashboardRoute = pathname?.startsWith('/dashboard')

  if (isDashboardRoute) {
    // For dashboard routes, render without header/footer
    // The dashboard layout will handle its own structure
    return <>{children}</>
  }

  // For main website routes, render with header and footer
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
