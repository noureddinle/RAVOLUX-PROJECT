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
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [picture, setPicture] = useState(null)
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
    setPicture("Generated picture")
  }

  const handleFileChange = (event) => {
    setPicture(event.target.files[0])
  }

  return (
    <div className="flex flex-col gap-4">
      {/* This is the page title section */}
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Create new</h1>
      </div>

      {/* This Card component defines the main "Product Details" section */}
      <Card>
        <CardContent className="p-6 grid gap-6">
          {/* Each div with 'grid gap-2' acts as a sub-section for a form field */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Product Name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Moving Head Lights">Moving Head Lights</SelectItem>
                <SelectItem value="Par Lights">Par Lights</SelectItem>
                <SelectItem value="Follow Spots">Follow Spots</SelectItem>
                <SelectItem value="Lasers">Lasers</SelectItem>
                <SelectItem value="Fog Machines">Fog Machines</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleGenerateDescription}>
                <Sparkles className="h-4 w-4" /> Generate from name & category
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleDescribePicture}>
                <Wand2 className="h-4 w-4" /> Describe picture
              </Button>
            </div>
            <Textarea id="description" placeholder="Product Description" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="picture">Picture</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleGeneratePicture}>
                <Sparkles className="h-4 w-4" /> Generate with AI
              </Button>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center h-48">
              {picture ? (
                <img src={URL.createObjectURL(picture) || "/placeholder.svg"} alt="Uploaded" className="h-32 w-32 object-cover" />
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <p className="text-gray-500 mt-2">Drop your file here, or click to browse</p>
                  <p className="text-gray-400 text-sm mt-1">Max size: 5 MB</p>
                  <p className="text-gray-400 text-sm">Supports: image/png, image/jpeg, image/jpg</p>
                </>
              )}
              <input type="file" id="picture" className="hidden" onChange={handleFileChange} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <Button className="w-fit">Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}
