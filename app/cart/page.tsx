"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, CreditCard, Banknote } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { toast } from "@/hooks/use-toast"
import { Newsletter } from "@/components/newsletter"
import { useRouter } from "next/navigation"


export default function CartPage() {
  const { cart, updateCartItem, removeCartItem, loading } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [promoCode, setPromoCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const router = useRouter()
  const items = cart?.items || []
  const total = items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0)
  const shipping = total > 500 ? 0 : 50
  const finalTotal = total + shipping - discount

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeCartItem(id)
    } else {
      updateCartItem(id, newQuantity)
    }
  }

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(total * 0.1)
      toast({
        title: "Promo code applied!",
        description: "You saved 10% on your order.",
      })
    } else {
      toast({
        title: "Invalid promo code",
        description: "Please check your promo code and try again.",
        variant: "destructive",
      })
    }
  }

  const handleCheckout = () => {
    router.push('/checkout')

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      })
      return
    }
    const totalAmount = finalTotal.toFixed(2)

    toast({
      title: "Order placed successfully!",
      description: `Your order total is $${totalAmount}. ${
        paymentMethod === "cod" ? "You will pay on delivery." : "Payment processed."
      }`,
    })
    // Note: clearCart functionality would need to be implemented in the new cart hook
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/products">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8 border-b border-gray-200 pb-16">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} className="border border-gray-200 p-4 rounded-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={item.product?.thumbnail_image || "/placeholder.svg"} alt={item.product?.name || ""} fill className="object-cover" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.product?.name || ""}</h3>
                    <p className="text-gray-600">${item.price_at_time.toLocaleString()}</p>
                  </div>

                  <div className="flex items-center space-x-2 ">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="border border-gray-200 p-2 rounded-lg"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="border border-gray-200 p-2 rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${(item.price_at_time * item.quantity).toLocaleString()}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCartItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-6 ">
          {/* Promo Code */}
          <Card className="border border-gray-200 p-4 rounded-lg">
            <CardHeader>
              <CardTitle>Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="border border-gray-200 p-2 rounded-lg"
                />
                <Button onClick={handleApplyPromo} className="border border-gray-200 p-2 rounded-lg">Apply</Button>
              </div>
              {discount > 0 && (
                <Badge className="bg-green-100 text-green-800">Promo applied: -${discount.toFixed(2)}</Badge>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="border border-gray-200 p-4 rounded-lg">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>

              <Button className="w-full border border-gray-200 p-2 rounded-lg" size="lg" onClick={handleCheckout}>
                Place Order
              </Button>

              <div className="text-center">
                <Link href="/products">
                  <Button variant="outline" className="w-full bg-transparent border border-gray-200 p-2 rounded-lg">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Newsletter/>
    </div>
  )
}
