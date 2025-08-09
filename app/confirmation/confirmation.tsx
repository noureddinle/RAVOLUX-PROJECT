// src/pages/order-confirmation.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderConfirmation() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
      <h1 className="text-3xl font-bold mb-6">Order Confirmed!</h1>
      <p className="text-lg text-gray-600 mb-6">
        Thank you for your order. You'll receive a confirmation email soon.
      </p>
      <Link href="/products">
        <Button className="py-3 text-lg">Continue Shopping</Button>
      </Link>
    </div>
  );
}