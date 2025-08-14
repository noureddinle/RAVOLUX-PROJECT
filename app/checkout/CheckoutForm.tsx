"use client";
 
import type React from "react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { CartItem, OrderInsert, OrderItemInsert, Address } from "@/types/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function CheckoutForm() {
  const { cart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [sameAsBilling, setSameAsBilling] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: user?.name || "",
    customer_email: user?.email || "",
    customer_phone: user?.phone || "",
    billing_address: { 
      street: "", 
      city: "", 
      state: "", 
      postal_code: "", 
      country: "",
      company: ""
    } as Address,
    delivery_address: { 
      street: "", 
      city: "", 
      state: "", 
      postal_code: "", 
      country: "",
      company: ""
    } as Address,
  });

  const discount = Number(searchParams.get("discount")) || 0;
  const subtotal = cart?.items.reduce((sum, item) => sum + item.price_at_time * item.quantity, 0) || 0;
  const shippingCost = subtotal > 500 ? 0 : 50;
  const total_amount = subtotal + shippingCost - discount;

  useEffect(() => {
    if (!cartLoading) {
      setLoading(false);
    }
    if (cart?.items.length === 0 && !cartLoading) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checking out.",
        variant: "destructive",
      });
      router.push("/products");
    }
  }, [cart, cartLoading, router, toast]);

  // Update delivery address when "same as billing" is toggled
  useEffect(() => {
    if (sameAsBilling) {
      setFormData(prev => ({
        ...prev,
        delivery_address: { ...prev.billing_address }
      }));
    }
  }, [sameAsBilling, formData.billing_address]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const orderData: OrderInsert & { items: OrderItemInsert[] } = {
        user_id: user?.id,
        order_number: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        session_id: localStorage.getItem("session_id") || undefined,
        status: "pending",
        total_amount,
        customer_email: formData.customer_email,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        billing_address: formData.billing_address,
        delivery_address: formData.delivery_address,
        shipping_cost: shippingCost,
        payment_method: "cash-on-delivery",
        payment_status: "pending",
        items: cart?.items.map((item) => ({
          product_id: item.product_id,
          product_name: item.product?.name || "Unknown",
          product_sku: item.product?.sku || "UNKNOWN",
          quantity: item.quantity,
          unit_price: item.price_at_time,
          total_price: item.price_at_time * item.quantity,
        })) || [],
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` }),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to place order: ${response.status}`);
      }

      const { data } = await response.json();

      await fetch(`${API_URL}/api/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.accessToken && { Authorization: `Bearer ${user.accessToken}` }),
        },
        body: JSON.stringify({
          type: "order-confirmation",
          to: formData.customer_email,
          data: {
            orderData,
            orderNumber: orderData.order_number,
            items: cart?.items || [],
          }
        }),
      });

      toast({
        title: "Order Placed!",
        description: `Your order has been successfully placed.`,
        variant: "default",
      });

      // Clear local cart
      localStorage.removeItem("cart_id");
      localStorage.removeItem("session_id");

      router.push("/confirmation");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [addressType, field] = name.split(".");
      setFormData((prev) => {
        const addressKey = addressType as 'billing_address' | 'delivery_address';
        return {
          ...prev,
          [addressKey]: { 
            ...prev[addressKey], 
            [field]: value 
          } as Address,
        };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>Loading...</p>
      </div>
    );
  }

  if (!cart?.items.length) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <p>
          Cart is empty.{" "}
          <Link href="/products" className="text-blue-500">
            Shop now
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Customer Information */}
        <Card className="lg:col-span-1 border border-gray-200">
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="customer_name">Full Name</Label>
              <Input
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_email">Email</Label>
              <Input
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="customer_email"
                name="customer_email"
                type="email"
                value={formData.customer_email}
                onChange={handleInputChange}
                placeholder="john.doe@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customer_phone">Phone Number</Label>
              <Input
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="customer_phone"
                name="customer_phone"
                type="tel"
                value={formData.customer_phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Address */}
        <Card className="lg:col-span-1 border border-gray-200">
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="billing_address.street">Street Address</Label>
              <Textarea
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="billing_address.street"
                name="billing_address.street"
                value={formData.billing_address.street}
                onChange={handleInputChange}
                placeholder="123 Main St"
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billing_address.city">City</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="billing_address.city"
                  name="billing_address.city"
                  value={formData.billing_address.city}
                  onChange={handleInputChange}
                  placeholder="Anytown"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billing_address.state">State / Province</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="billing_address.state"
                  name="billing_address.state"
                  value={formData.billing_address.state}
                  onChange={handleInputChange}
                  placeholder="CA"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="billing_address.postal_code">Postal Code</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="billing_address.postal_code"
                  name="billing_address.postal_code"
                  value={formData.billing_address.postal_code}
                  onChange={handleInputChange}
                  placeholder="90210"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="billing_address.country">Country</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="billing_address.country"
                  name="billing_address.country"
                  value={formData.billing_address.country}
                  onChange={handleInputChange}
                  placeholder="USA"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="billing_address.company">Company (Optional)</Label>
              <Input
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="billing_address.company"
                name="billing_address.company"
                value={formData.billing_address.company || ""}
                onChange={handleInputChange}
                placeholder="Company Name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card className="lg:col-span-2 border border-gray-200">
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="same-as-billing"
                checked={sameAsBilling}
                onCheckedChange={(checked) => setSameAsBilling(checked as boolean)}
              />
              <Label htmlFor="same-as-billing">Same as billing address</Label>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="delivery_address.street">Street Address</Label>
              <Textarea
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="delivery_address.street"
                name="delivery_address.street"
                value={formData.delivery_address.street}
                onChange={handleInputChange}
                placeholder="123 Main St"
                rows={3}
                disabled={sameAsBilling}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="delivery_address.city">City</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="delivery_address.city"
                  name="delivery_address.city"
                  value={formData.delivery_address.city}
                  onChange={handleInputChange}
                  placeholder="Anytown"
                  disabled={sameAsBilling}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="delivery_address.state">State / Province</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="delivery_address.state"
                  name="delivery_address.state"
                  value={formData.delivery_address.state}
                  onChange={handleInputChange}
                  placeholder="CA"
                  disabled={sameAsBilling}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="delivery_address.postal_code">Postal Code</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="delivery_address.postal_code"
                  name="delivery_address.postal_code"
                  value={formData.delivery_address.postal_code}
                  onChange={handleInputChange}
                  placeholder="90210"
                  disabled={sameAsBilling}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="delivery_address.country">Country</Label>
                <Input
                  className="border border-gray-200 rounded-md p-2 text-gray-700"
                  id="delivery_address.country"
                  name="delivery_address.country"
                  value={formData.delivery_address.country}
                  onChange={handleInputChange}
                  placeholder="USA"
                  disabled={sameAsBilling}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="delivery_address.company">Company (Optional)</Label>
              <Input
                className="border border-gray-200 rounded-md p-2 text-gray-700"
                id="delivery_address.company"
                name="delivery_address.company"
                value={formData.delivery_address.company || ""}
                onChange={handleInputChange}
                placeholder="Company Name"
                disabled={sameAsBilling}
              />
            </div>
          </CardContent>
        </Card>

        {/* Order Summary & Payment */}
        <div className="grid gap-6 lg:col-span-2">
          <Card className="border border-gray-200">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead>Item</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart?.items.map((item: CartItem) => (
                    <TableRow key={item.id} className="border-t border-gray-200">
                      <TableCell className="font-medium ">{item.product?.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">${(item.price_at_time * item.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table >
              <div className="grid gap-2 text-sm border-t border-gray-200 border-w-full p-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button type="submit" className="w-full py-3 text-lg border border-gray-200 hover:bg-black hover:text-white" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}