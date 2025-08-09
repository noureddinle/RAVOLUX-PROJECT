"use client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard-sidebar"
import { AppHeader } from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
