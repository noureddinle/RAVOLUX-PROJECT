"use client"

import { UserForm } from "@/types/supabase"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  user: UserForm | null
  login: (user: UserForm) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserForm | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("role")
        localStorage.removeItem("authToken")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (userData: UserForm) => {
    console.log("Logging in user:", userData)
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("role", userData.role)
  }

  const logout = () => {
    console.log("Logging out user")
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    localStorage.removeItem("authToken")
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin, isLoading }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
