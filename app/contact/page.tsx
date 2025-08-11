"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { ContactMessageInsert } from "@/types/supabase"
import { API_URL } from "@/lib/api"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const contactMessage: ContactMessageInsert = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }

      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactMessage),
      })

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`)
      }

      const { data } = await response.json();

      await fetch(`${API_URL}/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "contact-response",
          to: formData.email,
          data: {
            contactMessage,
            contactNumber: data.id,
          }
        }),
      });
    } catch (error) {
      console.error("Error sending message:", error)
    }

    // Simulate form submission
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    })

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-16 bg-white border border-gray-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with our team for expert advice and support</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-white border border-gray-200">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      className="bg-white border border-gray-200 text-gray-500"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-white border border-gray-200 text-gray-500"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      className="bg-white border border-gray-200 text-gray-500"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      className="bg-white border border-gray-200 text-gray-500"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    className="bg-white border border-gray-200 text-gray-500"
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Tell us more about your requirements..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full border border-gray-200 hover:bg-black hover:text-white">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Visit Our Store</h3>
                    <p className="text-gray-600">
                      123 Lighting Boulevard
                      <br />
                      Los Angeles, CA 90028
                      <br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-gray-600">
                      Main: +1 (555) 123-4567
                      <br />
                      Support: +1 (555) 123-4568
                      <br />
                      Toll Free: 1-800-LIGHTPRO
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Email Us</h3>
                    <p className="text-gray-600">
                      General: info@lightpro.com
                      <br />
                      Sales: sales@lightpro.com
                      <br />
                      Support: support@lightpro.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 8:00 AM - 6:00 PM
                      <br />
                      Saturday: 9:00 AM - 4:00 PM
                      <br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle>Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Need urgent technical support? Our emergency hotline is available 24/7 for critical issues.
                </p>
                <Button className="w-full bg-transparent border border-gray-200 hover:bg-black hover:text-white" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Emergency Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
