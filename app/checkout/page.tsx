import { Suspense } from "react";
import CheckoutForm from "./CheckoutForm";

// Composant de chargement
function CheckoutSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-6 mx-auto w-48"></div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="lg:col-span-2 h-48 bg-gray-200 rounded"></div>
          <div className="lg:col-span-2 h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutForm />
    </Suspense>
  );
}