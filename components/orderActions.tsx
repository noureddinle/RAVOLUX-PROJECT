"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Order } from "@/types/supabase";
import { deleteOrder } from "@/lib/data";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface OrderActionsProps {
  order: Order;
}

export default function OrderActions({ order }: OrderActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteOrder = async () => {
    if (!confirm(`Are you sure you want to delete order #${order.id}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteOrder(order.id);
      toast({
        title: "Success",
        description: "Order deleted successfully",
      });
      router.refresh(); // Refresh the page to update the orders list
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting order:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border border-gray-200" align="end">
        <DropdownMenuItem className="cursor-pointer text-gray-600 hover:text-gray-800" asChild>
          <Link href={`/dashboard/orders/${order.id}`}>Show</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-gray-600 hover:text-gray-800">Edit</DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:text-red-800"
          onClick={handleDeleteOrder}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}