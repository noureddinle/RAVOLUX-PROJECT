"use client"

import Link from "next/link"
import { LogOut, Menu } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/hooks/use-auth"

export function AppHeader() {
  const { user, logout } = useAuth()
  
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 dark:border-gray-800 px-4">
      <SidebarTrigger className="-ml-1">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </SidebarTrigger>
      <div className="ml-auto flex items-center gap-2">
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border border-gray-200 dark:border-gray-700 w-8 h-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <DropdownMenuLabel className="border-b border-gray-200 dark:border-gray-700">{user?.name || 'Admin'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" >Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
