"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, Database, Settings, BarChart3 } from "lucide-react"

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      window.open("/admin", "_blank")
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">AdminJS Dashboard</h1>
          <p className="text-xl text-slate-600 mb-8">Professional admin panel powered by AdminJS</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.open("/admin", "_blank")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              Open Admin Panel
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/")}
              className="border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent px-8 py-3"
            >
              Back to Store
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-green-900 mb-2">Data Management</h3>
              <p className="text-sm text-green-700">Manage products, orders, and customers</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-blue-900 mb-2">Analytics</h3>
              <p className="text-sm text-blue-700">View sales reports and insights</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-purple-900 mb-2">Configuration</h3>
              <p className="text-sm text-purple-700">System settings and preferences</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-orange-900 mb-2">Security</h3>
              <p className="text-sm text-orange-700">User management and permissions</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-slate-900">AdminJS Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Core Features</h4>
                <ul className="space-y-2 text-slate-600">
                  <li>• Complete CRUD operations</li>
                  <li>• Advanced filtering and search</li>
                  <li>• Data validation and forms</li>
                  <li>• File upload management</li>
                  <li>• Role-based access control</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Business Tools</h4>
                <ul className="space-y-2 text-slate-600">
                  <li>• Sales analytics dashboard</li>
                  <li>• Order management system</li>
                  <li>• Customer relationship tools</li>
                  <li>• Inventory tracking</li>
                  <li>• Report generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">Redirecting to AdminJS panel in 3 seconds...</p>
        </div>
      </div>
    </div>
  )
}
