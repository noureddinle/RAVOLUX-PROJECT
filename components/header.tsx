"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, ShoppingCart, User, LogOut, Settings } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { toast } from "@/hooks/use-toast"
import { UserForm } from "@/types/supabase"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { cart, addToCart, updateCartItem, removeCartItem, loading: cartLoading } = useCart()
  const { user, login, logout, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth()
  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0

  // Debug logging
  useEffect(() => {
    console.log("Auth state changed:", { user, isAuthenticated, isAdmin, authLoading })
  }, [user, isAuthenticated, isAdmin, authLoading])

  // Handle mounted state
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const handleAuthSuccess = (userData: UserForm, token: string) => {
    console.log('Header handleAuthSuccess called with:', { userData, token });
    
    // The login function in useAuth already handles localStorage
    login(userData)
    
    // Only store the token separately since it's not part of the user object
    if (token) {
      localStorage.setItem("authToken", token)
    }
    
    console.log('Auth success completed, closing modal');
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    // The logout function in useAuth already handles localStorage cleanup
    localStorage.removeItem("authToken")
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      <header className={`sticky top-0 z-[100] w-full border-b border-slate-200 transition-all duration-300 bg-white`}>
        {/* Main navigation */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-22">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 md:space-x-3">
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8 text-slate-500">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors px-4 py-2 hover:text-slate-900`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Cart */}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className={`hover:bg-white/20 transition-colors `}>
                  <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-slate-500 hover:text-slate-900" />
                  {!cartLoading && itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              {!authLoading && isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className={`hover:bg-white/20 transition-colors `}>
                    <User className="h-5 w-5 md:h-6 md:w-6 text-slate-500 hover:text-slate-900" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/statistics" className="flex items-center">
                            <Settings className="h-4 w-4 mr-2" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : !authLoading ? (
                <Button variant="ghost" size="icon" className={`hover:bg-white/20 transition-colors`} onClick={() => setShowAuthModal(true)}>
                  <User className="h-5 w-5 md:h-6 md:w-6 text-slate-500 hover:text-slate-900" />
                </Button>
              ) : (
                <div className="w-10 h-10 bg-transparent" />
              )}

              {/* CTA Button - Hidden on small screens */}
              <div className="hidden md:flex items-center">
                <Button variant="outline" className={`transition-colors border border-slate-200 hover:bg-slate-200 hover:text-slate-900 hover:shadow-none text-sm text-slate-500 px-6 py-2`}>
                  Contact Us
                </Button>
              </div>

              {/* Mobile menu trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className={`hover:bg-white/20 transition-colors`}>
                    <Menu className="h-6 w-6 text-slate-500" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white">
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* User Info */}
                    {!authLoading && isAuthenticated && (
                      <div className="p-4 bg-slate-50 rounded-lg">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        {isAdmin && <Badge className="mt-2 bg-blue-500">Admin</Badge>}
                      </div>
                    )}

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="px-4 py-3 text-lg font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      {!authLoading && isAdmin && (
                        <Link
                          href="../dashboard/statistics"
                          className="px-4 py-3 text-lg font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                    </nav>

                    {/* Mobile CTA Buttons */}
                    <div className="flex flex-col space-y-3 pt-6 border-t border-slate-200">
                      {!authLoading && !isAuthenticated ? (
                        <Button
                          onClick={() => {
                            setShowAuthModal(true)
                            setIsOpen(false)
                          }}
                          className="w-full"
                        >
                          Sign In / Register
                        </Button>
                      ) : !authLoading ? (
                        <Button onClick={handleLogout} variant="outline" className="w-full bg-transparent">
                          Logout
                        </Button>
                      ) : (
                        <div className="w-full h-10 bg-transparent" />
                      )}
                      <Button variant="outline" className="w-full border-slate-300 text-slate-700 bg-transparent">
                        Get Quote
                      </Button>
                      <Link href="/cart" className="w-full">
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Cart {!cartLoading && `(${itemCount})`}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <AuthModal 
        key={`auth-modal-${isAuthenticated}`}
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onAuthSuccess={handleAuthSuccess} 
      />
    </>
  )
}
