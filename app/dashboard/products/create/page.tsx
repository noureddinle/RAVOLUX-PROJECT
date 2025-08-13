"use client";
import { useState } from "react";
import { ChevronDown, Image, Sparkles, Wand2, Check, X } from "lucide-react";
import { createProduct, uploadFile } from "@/lib/data";
import { useRouter } from "next/navigation";
import { ProductInsert } from "@/types/supabase"; // Adjust import path

export default function CreateProductPage() {
  const [formData, setFormData] = useState<ProductInsert>({
    name: "",
    sku: "",
    category: "",
    description: "",
    price: 0,
    stock_quantity: 0,
    model: "",
    is_new: false,
    is_featured: false,
    is_best_seller: false,
    is_active: false,
    thumbnail_image: undefined,
    images: undefined,
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleInputChange = (field: keyof ProductInsert, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleCheckboxChange = (field: keyof ProductInsert, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please select an image file (PNG, JPEG, JPG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Please select an image smaller than 5MB");
        return;
      }
      setThumbnailFile(file);
      setErrorMessage("");
    }
  };

  const handleImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const validFiles: File[] = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          setErrorMessage("Please select image files (PNG, JPEG, JPG)");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrorMessage("Please select images smaller than 5MB");
          return;
        }
        validFiles.push(file);
      }
      setImageFiles(validFiles);
      setErrorMessage("");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        setThumbnailFile(file);
        setErrorMessage("");
      } else {
        setErrorMessage("Please select a valid image file under 5MB");
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
  };  

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push("Product name is required");
    if (!formData.sku.trim()) errors.push("SKU is required");
    if (!formData.price || formData.price <= 0) errors.push("Valid price is required");
    return errors;
  };

  const handleCreateProduct = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(", "));
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Upload thumbnail image
      let thumbnailUrl: string | undefined;
      if (thumbnailFile) {
        setUploadProgress(20);
        thumbnailUrl = await uploadFile(thumbnailFile, "product-images");
      }

      // Upload additional images
      const imageUrls: string[] = [];
      if (imageFiles.length > 0) {
        const totalImages = imageFiles.length;
        for (let i = 0; i < imageFiles.length; i++) {
          const file = imageFiles[i];
          const url = await uploadFile(file, "product-images");
          imageUrls.push(url);
          setUploadProgress(20 + (i + 1) * (70 / totalImages));
        }
      }

      // Prepare product data
      const productData: ProductInsert = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        category: formData.category.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price as any) || 0,
        stock_quantity: parseInt(formData.stock_quantity as any) || 0,
        model: formData.model.trim(),
        thumbnail_image: thumbnailUrl,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        is_active: true,
        is_new: formData.is_new,
        is_best_seller: formData.is_best_seller,
        is_featured: formData.is_featured,
        specifications: {},
        weight_kg: undefined,
      };

      // Create product
      setUploadProgress(90);
      const newProduct = await createProduct(productData);
      console.log("Product created:", newProduct);

      setUploadProgress(100);
      setSuccessMessage("Product created successfully! Redirecting to dashboard...");

      // Reset form and redirect
      setTimeout(() => {
        setFormData({
          name: "",
          sku: "",
          category: "",
          description: "",
          price: 0,
          stock_quantity: 0,
          model: "",
          is_new: false,
          is_best_seller: false,
          thumbnail_image: undefined,
          images: undefined,
        });
        setThumbnailFile(null);
        setImageFiles([]);
        setSuccessMessage("");
        router.push("/dashboard/products");
      }, 2000);
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      const errorMsg = error instanceof Error ? error.message : "Failed to create product. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600 mt-1">Add a new product to your inventory</p>
        </div>
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          <span className="text-sm text-gray-500">Auto-sync to Dashboard</span>
        </div>
      </div>
      {/* Status Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <Check className="h-5 w-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <X className="h-5 w-5 text-red-600" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}
      {/* Progress Bar */}
      {isLoading && uploadProgress > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Creating Product</span>
            <span className="text-sm text-gray-500">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      {/* Main Form */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                SKU *
              </label>
              <input
                id="sku"
                type="text"
                placeholder="Enter SKU (e.g., PRD-001)"
                value={formData.sku}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                id="model"
                type="text"
                placeholder="Product model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Product category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
          </div>
          {/* Descriptions */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Brief product description for listings"
              rows={2}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Detailed Description
            </label>
            <textarea
              id="description"
              placeholder="Detailed product description, features, specifications..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={isLoading}
            />
          </div>
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Thumbnail Image
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                thumbnailFile ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-gray-400"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => !isLoading && document.getElementById("thumbnail")?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {thumbnailFile ? (
                <div className="space-y-3">
                  <img
                    src={URL.createObjectURL(thumbnailFile)}
                    alt="Preview"
                    className="h-32 w-32 object-cover rounded-lg mx-auto border border-gray-200"
                  />
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-sm text-gray-600">{thumbnailFile.name}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeThumbnail();
                      }}
                      className="text-red-500 hover:text-red-700"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Image className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">Drop your thumbnail image here, or click to browse</p>
                    <p className="text-gray-400 text-sm mt-1">Max size: 5 MB • Supports: PNG, JPEG, JPG</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="thumbnail"
                className="hidden"
                onChange={handleThumbnailChange}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                imageFiles.length > 0 ? "border-green-300 bg-green-50" : "border-gray-300 hover:border-gray-400"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => !isLoading && document.getElementById("images")?.click()}
            >
              {imageFiles.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setImageFiles((prev) => prev.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-700"
                          disabled={isLoading}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Image className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">Drop your product images here, or click to browse</p>
                    <p className="text-gray-400 text-sm mt-1">Max size: 5 MB • Supports: PNG, JPEG, JPG</p>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="images"
                className="hidden"
                onChange={handleImagesChange}
                accept="image/png,image/jpeg,image/jpg,image/webp"
                multiple
                disabled={isLoading}
              />
            </div>
          </div>
          {/* Pricing and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price * ($)
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">
                Stock Quantity
              </label>
              <input
                id="stock_quantity"
                type="number"
                min="0"
                placeholder="0"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange("stock_quantity", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={isLoading}
              />
            </div>
          </div>
          {/* Checkboxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 flex items-center">
              <label htmlFor="is_new" className="block text-sm font-medium text-gray-700 mr-2">
                Is New
              </label>
              <input
                id="is_new"
                type="checkbox"
                checked={formData.is_new}
                onChange={(e) => handleCheckboxChange("is_new", e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2 flex items-center">
              <label htmlFor="is_best_seller" className="block text-sm font-medium text-gray-700 mr-2">
                Is Best Seller
              </label>
              <input
                id="is_best_seller"
                type="checkbox"
                checked={formData.is_best_seller}
                onChange={(e) => handleCheckboxChange("is_best_seller", e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2 flex items-center">
              <label htmlFor="is_featured" className="block text-sm font-medium text-gray-700 mr-2">
                Is Featured
              </label>
              <input
                id="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleCheckboxChange("is_featured", e.target.checked)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                disabled={isLoading}
              />
            </div>
          </div>
          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/dashboard/products")}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProduct}
              disabled={isLoading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  <span>Create Product</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}