"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Users, Award, Truck } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center  overflow-hidden ">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Professional stage lighting setup"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-purple-900/60" />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <Badge variant="secondary" className="mb-4 bg-primary/20 text-primary-foreground border-primary/30">
              Industry Leader Since 1995
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Professional
              <span className="gradient-text block">Stage Lighting</span>
              Solutions
            </h1>

            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Transform your events with cutting-edge lighting technology. We import and distribute the world's finest
              stage lighting equipment, backed by expert technical support and unmatched industry experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-lg px-8 py-6">
                Browse Products
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6 text-yellow-400 mr-1" />
                  <span className="text-2xl font-bold">4.9</span>
                </div>
                <p className="text-sm text-gray-400">Customer Rating</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-400 mr-1" />
                  <span className="text-2xl font-bold">500+</span>
                </div>
                <p className="text-sm text-gray-400">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-green-400 mr-1" />
                  <span className="text-2xl font-bold">50+</span>
                </div>
                <p className="text-sm text-gray-400">Brands</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-purple-400 mr-1" />
                  <span className="text-2xl font-bold">24h</span>
                </div>
                <p className="text-sm text-gray-400">Fast Delivery</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
