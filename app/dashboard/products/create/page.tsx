"use client"

import { useState } from "react"
import { ChevronDown, ImageIcon, Sparkles, Wand2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { createProduct, uploadFile } from "@/lib/data"
import { useRouter } from "next/navigation"

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: "",
    stock_quantity: "",
    model: "",
    short_description: ""
  })
  const [picture, setPicture] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateProduct = async () => {
    // Validate required fields
    if (!formData.name || !formData.sku || !formData.price) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Name, SKU, Price)",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // Handle file upload first if there's a picture
      let thumbnailImage = ""
      if (picture) {
        try {
          thumbnailImage = await uploadFile(picture)
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError)
          toast({
            title: "Upload Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive"
          })
          setIsLoading(false)
          return
        }
      }

      const productData = {
        name: formData.name,
        sku: formData.sku,
        category: formData.category || undefined,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        model: formData.model || undefined,
        thumbnail_image: thumbnailImage || undefined,
        images: picture ? [thumbnailImage] : [],
        is_active: true,
        specifications: {},
        weight_kg: undefined
      }

      const result = await createProduct(productData)
      
      toast({
        title: "Success",
        description: "Product created successfully!",
      })

      // Redirect to products page
      router.push('/dashboard/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (PNG, JPEG, JPG)",
          variant: "destructive"
        })
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        })
        return
      }

      setPicture(file)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
        setPicture(file)
      } else {
        toast({
          title: "Invalid file",
          description: "Please select a valid image file under 5MB",
          variant: "destructive"
        })
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* This is the page title section */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Create new product</h1>
      </div>

      {/* This Card component defines the main "Product Details" section */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 grid gap-6">
          {/* Each div with 'grid gap-2' acts as a sub-section for a form field */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              placeholder="Product Name" 
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border border-gray-200 dark:border-gray-700 text-gray-500" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input 
              id="sku" 
              placeholder="Product SKU" 
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              className="border border-gray-200 dark:border-gray-700 text-gray-500" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="model">Model</Label>
            <Input 
              id="model" 
              placeholder="Product Model" 
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className="border border-gray-200 dark:border-gray-700 text-gray-500" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              placeholder="Product Category" 
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="border border-gray-200 dark:border-gray-700 text-gray-500" 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea 
              className="border border-gray-200 dark:border-gray-700 text-gray-500" 
              id="short_description" 
              placeholder="Brief product description" 
              rows={3} 
              value={formData.short_description}
              onChange={(e) => handleInputChange('short_description', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              className="border border-gray-200 dark:border-gray-700 text-gray-500" 
              id="description" 
              placeholder="Detailed product description" 
              rows={5} 
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="picture">Picture</Label>
            <div 
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center flex flex-col items-center justify-center h-48 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => document.getElementById('picture')?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {picture ? (
                <div className="flex flex-col items-center">
                  <img src={URL.createObjectURL(picture)} alt="Uploaded" className="h-32 w-32 object-cover rounded" />
                  <p className="text-sm text-gray-500 mt-2">{picture.name}</p>
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Drop your file here, or click to browse</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Max size: 5 MB</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Supports: image/png, image/jpeg, image/jpg</p>
                </>
              )}
              <input 
                type="file" 
                id="picture" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/png,image/jpeg,image/jpg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input 
                id="price" 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                className="border border-gray-200 dark:border-gray-700 text-gray-500" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stock_quantity">Stock Quantity</Label>
              <Input 
                id="stock_quantity" 
                type="number" 
                placeholder="0" 
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                className="border border-gray-200 dark:border-gray-700 text-gray-500" 
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              className="w-fit border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-gray-800" 
              onClick={handleCreateProduct}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Product"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/products')}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
          </CardContent>
      </Card>
    </div>
  )
}
