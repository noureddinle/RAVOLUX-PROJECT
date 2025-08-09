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

export default function CreateProductPage() {
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState<File | null>(null)
  const [price, setPrice] = useState("")

  const handleGenerateDescription = () => {
    // Placeholder for AI description generation logic
    setDescription("Generated description based on name and category")
  }

  const handleDescribePicture = () => {
    // Placeholder for AI picture description logic
    setDescription("Generated description based on picture")
  }

  const handleGeneratePicture = () => {
    // Placeholder for AI picture generation logic
    setPicture(null)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPicture(event.target.files[0])
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* This is the page title section */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Create new</h1>
      </div>

      {/* This Card component defines the main "Product Details" section */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 grid gap-6">
          {/* Each div with 'grid gap-2' acts as a sub-section for a form field */}
          <div className="grid gap-2 ">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Product Name" className="border border-gray-200 dark:border-gray-700 text-gray-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" placeholder="Product Category" className="border border-gray-200 dark:border-gray-700 text-gray-500" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea className="border border-gray-200 dark:border-gray-700 text-gray-500" id="description" placeholder="Product Description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="picture">Picture</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center flex flex-col items-center justify-center h-48">
              {picture ? (
                <img src={URL.createObjectURL(picture)} alt="Uploaded" className="h-32 w-32 object-cover" />
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400 mt-2">Drop your file here, or click to browse</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Max size: 5 MB</p>
                  <p className="text-gray-400 dark:text-gray-500 text-sm">Supports: image/png, image/jpeg, image/jpg</p>
                </>
              )}
              <input type="file" id="picture" className="hidden border border-gray-200 dark:border-gray-700" onChange={handleFileChange} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} className="border border-gray-200 dark:border-gray-700 text-gray-500" />
          </div>
          <Button className="w-fit border border-gray-200 dark:border-gray-700 hover:bg-black hover:text-white dark:hover:bg-gray-800">Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
