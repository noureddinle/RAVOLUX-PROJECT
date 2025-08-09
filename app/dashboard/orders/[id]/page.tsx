
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrder, getCustomers, updateOrderStatus, deleteOrder } from "@/lib/data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id)
  const customers = await getCustomers()

  if (!order) {
    notFound()
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500 text-white font-semibold';
      case 'Pending':
        return 'bg-yellow-500 text-white font-semibold';
      case 'Cancelled':
        return 'bg-red-500 text-white font-semibold';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Page header and back button */}
      <div className="flex items-center gap-4">
        <Button className="border border-gray-200 dark:border-gray-800" variant="outline" size="icon" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Orders</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
      </div>

      {/* This grid holds two main information cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
        {/* Card for Customer Details and Order Information */}
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6 grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sub-section for Customer Details */}
              <div>
                <h2 className="text-lg font-semibold">Customer Details</h2>
                <p className="text-muted-foreground">{customers.find((customer) => customer.id === order.user_id)?.name}</p>
                <p className="text-muted-foreground">
                  <Link href={`mailto:${customers.find((customer) => customer.id === order.user_id)?.email}`} className="text- underline">
                    {customers.find((customer) => customer.id === order.user_id)?.email}
                  </Link>
                </p>
                <p className="text-muted-foreground">{customers.find((customer) => customer.id === order.user_id)?.phone}</p>
                <p className="text-muted-foreground">{order.delivery_address?.street}</p>
              </div>
              {/* Sub-section for Order Information */}
              <div>
                <h2 className="text-lg font-semibold">Order Information</h2>
                <p className="text-muted-foreground">Status: <Badge className={getStatusBadgeVariant(order.status)}>{order.status}</Badge></p>
                <p className="text-muted-foreground">Created: {order.created_at}</p>
                <p className="text-muted-foreground">Updated: {order.updated_at}</p>
              </div>
            </div>
            <Separator /> {/* Visual separator */}
            <h2 className="text-lg font-semibold">Products</h2>
            {/* Table for Products in Order */}
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 dark:border-gray-800">
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price (per Item)</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items?.map((item) => (
                  <TableRow key={item.product_id} className="border-b border-gray-200 dark:border-gray-800">
                    <TableCell className="font-medium">{item.product_name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.total_price.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Card for Order Summary */}
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {/* Summary details */}
            <p className="text-muted-foreground">Total Items: {order.items?.length}</p>
            <p className="text-muted-foreground">Total Price: ${order.items?.reduce((acc, item) => acc + item.total_price, 0).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
