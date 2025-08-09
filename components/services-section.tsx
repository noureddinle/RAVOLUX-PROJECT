"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Headphones, Settings, Calendar, Globe, Shield, Clock, Users } from "lucide-react"
import { motion } from "framer-motion"

const services = [
  {
    icon: Globe,
    title: "Import & Distribution",
    description:
      "Direct partnerships with leading manufacturers worldwide, ensuring authentic products and competitive pricing.",
    features: ["Global sourcing", "Bulk discounts", "Authentic products", "Fast customs clearance"],
    color: "bg-blue-500",
  },
  {
    icon: Headphones,
    title: "Technical Support",
    description: "Expert technical assistance from certified professionals with decades of industry experience.",
    features: ["24/7 support hotline", "Remote diagnostics", "On-site service", "Training programs"],
    color: "bg-green-500",
  },
  {
    icon: Settings,
    title: "Custom Solutions",
    description: "Tailored lighting solutions designed specifically for your venue, event, or production needs.",
    features: ["Design consultation", "System integration", "Custom programming", "Installation support"],
    color: "bg-purple-500",
  },
  {
    icon: Calendar,
    title: "Rental Programs",
    description: "Flexible rental options for short-term events, tours, and productions with full technical support.",
    features: ["Short & long-term rentals", "Delivery & pickup", "Technical operator", "Insurance coverage"],
    color: "bg-orange-500",
  },
]

const additionalServices = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Express shipping options available",
  },
  {
    icon: Shield,
    title: "Warranty Support",
    description: "Comprehensive warranty coverage",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Round-the-clock technical assistance",
  },
  {
    icon: Users,
    title: "Training",
    description: "Professional equipment training",
  },
]

export function ServicesSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render animations until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Complete Lighting Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From import and distribution to technical support and custom solutions, we provide comprehensive services to
              meet all your lighting needs.
            </p>
          </div>

          {/* Main Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={service.title} className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Services */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {additionalServices.map((service, index) => (
              <div key={service.title} className="flex items-center space-x-4 p-6 bg-background rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{service.title}</h4>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="px-8">
              Learn More About Our Services
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Our Services
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Complete Lighting Solutions</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From import and distribution to technical support and custom solutions, we provide comprehensive services to
            meet all your lighting needs.
          </p>
        </motion.div>

        {/* Main Services */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                  >
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <div className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Services */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {additionalServices.map((service, index) => (
            <div key={service.title} className="flex items-center space-x-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold">{service.title}</h4>
                <p className="text-sm text-muted-foreground">{service.description}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="px-8">
            Learn More About Our Services
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
