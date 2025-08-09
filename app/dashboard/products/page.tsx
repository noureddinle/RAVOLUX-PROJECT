import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, Filter } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { getProducts } from "@/lib/data"
import ProductAction from "@/components/productAction"

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products <span className="text-base font-normal text-gray-500">({products.length})</span></h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-gray-800">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button asChild className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-gray-800">
            <Link href="/dashboard/products/create">
              Create new
            </Link>
          </Button>
        </div>
      </div>
      <Card className="p-0 border-gray-200 dark:border-gray-700">
        <CardContent className="p-0">
          <Table className="border-gray-200 dark:border-gray-700"> 
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] hidden md:table-cell border-b border-gray-200 dark:border-gray-700">Image</TableHead>
                <TableHead className="border-b border-gray-200 dark:border-gray-700">Name</TableHead>
                <TableHead className="border-b border-gray-200 dark:border-gray-700">Category</TableHead>
                <TableHead className="border-b border-gray-200 dark:border-gray-700">Price</TableHead>
                <TableHead className="border-b border-gray-200 dark:border-gray-700">Stock</TableHead>
                <TableHead className="text-right border-b border-gray-200 dark:border-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className="border-b border-gray-200 dark:border-gray-700">
                  <TableCell className="hidden md:table-cell">
                    <Image
                      src={product.thumbnail_image || "/placeholder.svg"}
                      width={48}
                      height={48}
                      alt={product.name}
                      className="aspect-square rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                      {product.stock_quantity > 0 ? `${product.stock_quantity}` : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right border-b border-gray-200 dark:border-gray-700">
                    <ProductAction product={product} />
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
