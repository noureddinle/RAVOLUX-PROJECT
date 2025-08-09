import Link from "next/link"
import { MoreHorizontal } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getOrders } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Order } from "@/types/supabase"
import OrderActions from "@/components/orderActions"

export default async function OrdersPage() {
  const orders = await getOrders()

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500 text-white font-semibold';
      case 'pending':
        return 'bg-yellow-500 text-white font-semibold';
      case 'cancelled':
        return 'bg-red-500 text-white font-semibold';
      default:
        return 'bg-gray-200 text-gray-700 font-semibold';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders <span className="text-base font-normal text-gray-500">({orders.length})</span></h1>
      </div>
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="w-[50px] border-none">ID</TableHead>
                <TableHead className="border-none">Customer</TableHead>
                <TableHead className="border-none">Delivery Address</TableHead>
                <TableHead className="border-none">Status</TableHead>
                <TableHead className="border-none">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-b border-gray-200">
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <Link href={`mailto:${order.customer_email}`} className="text-gray-600 underline">
                      {order.customer_email}
                    </Link>
                  </TableCell>
                  <TableCell>{order.delivery_address.city}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.updated_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                      <OrderActions order={order} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
