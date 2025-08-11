"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/supabase";
import { TableCell } from "./ui/table";
import { deleteProduct } from "@/lib/data";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface ProductActionProps {
  product: Product;
}


export default function ProductAction({ product }: ProductActionProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      router.refresh(); // Refresh the page to update the product list
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
      console.error('Error deleting product:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4"/>
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer" asChild>
          <Link href={`/dashboard/products/${product.id}`}>Show</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">Edit</DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-600 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};