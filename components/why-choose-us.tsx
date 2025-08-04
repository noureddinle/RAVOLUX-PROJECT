"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Shield, Zap, Users, DollarSign, Star, Globe } from "lucide-react"
import { motion } from "framer-motion"

const reasons = [
  {
    icon: Award,
    title: "Industry Expertise",
    description:
      "Over 25 years of experience in professional stage lighting with certified technicians and industry partnerships.",
    stats: "25+ Years Experience",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description:
      "All products undergo rigorous testing and come with comprehensive warranties from authorized dealers.",
    stats: "100% Authentic Products",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    description: "Express shipping options and local inventory ensure quick delivery for urgent projects and events.",
    stats: "24-48 Hour Delivery",
  },
  {
    icon: Users,
    title: "Technical Support",
    description: "Dedicated support team available 24/7 with remote diagnostics and on-site service capabilities.",
    stats: "24/7 Support Available",
  },
  {
    icon: DollarSign,
    title: "Competitive Pricing",
    description:
      "Direct manufacturer relationships and bulk purchasing power enable us to offer the best prices in the market.",
    stats: "Best Price Guarantee",
  },
  {
    icon: Globe,
    title: "Global Network",
    description:
      "Partnerships with leading manufacturers worldwide ensure access to the latest technology and innovations.",
    stats: "50+ Brand Partners",
  },
]

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Event Production Manager",
    company: "Premier Events Co.",
    content:
      "LightPro Solutions has been our go-to supplier for over 5 years. Their expertise and reliability are unmatched.",
    rating: 5,
  },
  {
    name: "Mike Chen",
    role: "Technical Director",
    company: "City Theater",
    content: "The technical support team is incredible. They helped us design and install a complete lighting system.",
    rating: 5,
  },
  {
    name: "Lisa Rodriguez",
    role: "Lighting Designer",
    company: "Creative Lighting Studio",
    content: "Quality products, competitive prices, and fast delivery. Everything you need in a lighting supplier.",
    rating: 5,
  },
]

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Your Trusted Lighting Partner</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            With decades of experience and thousands of satisfied customers, we're the preferred choice for professional
            lighting solutions.
          </p>
        </motion.div>

        {/* Reasons Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                    <reason.icon className="h-8 w-8 text-primary group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{reason.title}</h3>
                  <p className="text-muted-foreground mb-4">{reason.description}</p>
                  <Badge variant="secondary" className="font-semibold">
                    {reason.stats}
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div> 
      </div>
    </section>
  )
}
