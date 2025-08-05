"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Star, Users, Award, Truck } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"
import heroImage from "@/assets/images/pexels-jibarofoto-3689547.jpg"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex overflow-hidden -mt-16 pt-16">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat">
        <Image
          src={heroImage}
          alt="Professional stage lighting setup"
          fill
          className="object-cover bg-center"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Professional
              <span className="gradient-text block">Stage Lighting</span>
              Solutions
            </h1>

            <p className="text-1xl text-white-300 mb-8  text-center">
              Transform your events with cutting-edge lighting technology. We import and distribute the world's finest
              stage lighting equipment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="text-lg px-8 py-6">
                Browse Products
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">

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
