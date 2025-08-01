import { useState, useEffect } from 'react';
import { 
  Package, 
  Tag, 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  model: string;
  sku: string;
  price: number;
  description: string;
  specifications: string;
  slug: string;
  is_active: boolean;
  brand_id: number;
  category_id: number;
}

export default function AdminDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('brands');
  
  // State for brands
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandForm, setBrandForm] = useState({ name: '', slug: '' });
  const [editingBrand, setEditingBrand] = useState<number | null>(null);
  
  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  
  // State for products
  const [products, setProducts] = useState<Product[]>([]);
  const [productForm, setProductForm] = useState({
    name: '',
    model: '',
    sku: '',
    price: '',
    description: '',
    specifications: '',
    slug: '',
    is_active: true,
    brand_id: '',
    category_id: ''
  });
  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Brand functions
  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBrand !== null) {
      setBrands(brands.map(brand => 
        brand.id === editingBrand 
          ? { ...brand, ...brandForm }
          : brand
      ));
      setEditingBrand(null);
    } else {
      const newBrand: Brand = {
        id: Date.now(),
        ...brandForm
      };
      setBrands([...brands, newBrand]);
    }
    setBrandForm({ name: '', slug: '' });
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleBrandNameChange = (name: string) => {
    setBrandForm({
      name,
      slug: generateSlug(name)
    });
  };

  // Category functions
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory !== null) {
      setCategories(categories.map(category => 
        category.id === editingCategory 
          ? { ...category, ...categoryForm }
          : category
      ));
      setEditingCategory(null);
    } else {
      const newCategory: Category = {
        id: Date.now(),
        ...categoryForm
      };
      setCategories([...categories, newCategory]);
    }
    setCategoryForm({ name: '', slug: '', description: '' });
  };

  const handleCategoryNameChange = (name: string) => {
    setCategoryForm({
      ...categoryForm,
      name,
      slug: generateSlug(name)
    });
  };

  // Product functions
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct !== null) {
      setProducts(products.map(product => 
        product.id === editingProduct 
          ? { 
              ...product, 
              ...productForm,
              price: parseFloat(productForm.price),
              brand_id: parseInt(productForm.brand_id),
              category_id: parseInt(productForm.category_id)
            }
          : product
      ));
      setEditingProduct(null);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...productForm,
        price: parseFloat(productForm.price),
        brand_id: parseInt(productForm.brand_id),
        category_id: parseInt(productForm.category_id)
      };
      setProducts([...products, newProduct]);
    }
    setProductForm({
      name: '',
      model: '',
      sku: '',
      price: '',
      description: '',
      specifications: '',
      slug: '',
      is_active: true,
      brand_id: '',
      category_id: ''
    });
  };

  const handleProductNameChange = (name: string) => {
    setProductForm({
      ...productForm,
      name,
      slug: generateSlug(name)
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your lighting equipment inventory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="brands" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Brands
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          {/* Brands Tab */}
          <TabsContent value="brands" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Brand</CardTitle>
                <CardDescription>
                  Add a new lighting equipment brand to your inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBrandSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brandName">Brand Name</Label>
                      <Input
                        id="brandName"
                        placeholder="e.g., Chauvet Professional"
                        value={brandForm.name}
                        onChange={(e) => handleBrandNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brandSlug">URL Slug</Label>
                      <Input
                        id="brandSlug"
                        placeholder="chauvet-professional"
                        value={brandForm.slug}
                        onChange={(e) => setBrandForm({...brandForm, slug: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingBrand !== null ? 'Update Brand' : 'Add Brand'}
                    </Button>
                    {editingBrand !== null && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingBrand(null);
                          setBrandForm({ name: '', slug: '' });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {brands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">{brand.name}</TableCell>
                        <TableCell className="text-muted-foreground">{brand.slug}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingBrand(brand.id);
                                setBrandForm({ name: brand.name, slug: brand.slug });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setBrands(brands.filter(b => b.id !== brand.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Category</CardTitle>
                <CardDescription>
                  Add a new product category to organize your inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCategorySubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        placeholder="e.g., Moving Head Lights"
                        value={categoryForm.name}
                        onChange={(e) => handleCategoryNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categorySlug">URL Slug</Label>
                      <Input
                        id="categorySlug"
                        placeholder="moving-head-lights"
                        value={categoryForm.slug}
                        onChange={(e) => setCategoryForm({...categoryForm, slug: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoryDescription">Description</Label>
                    <Textarea
                      id="categoryDescription"
                      placeholder="Brief description of this category..."
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingCategory !== null ? 'Update Category' : 'Add Category'}
                    </Button>
                    {editingCategory !== null && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(null);
                          setCategoryForm({ name: '', slug: '', description: '' });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell className="text-muted-foreground max-w-xs truncate">
                          {category.description}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingCategory(category.id);
                                setCategoryForm({
                                  name: category.name,
                                  slug: category.slug,
                                  description: category.description
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setCategories(categories.filter(c => c.id !== category.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>
                  Add a new lighting equipment product to your inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="e.g., Maverick MK3 Wash"
                        value={productForm.name}
                        onChange={(e) => handleProductNameChange(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productModel">Model</Label>
                      <Input
                        id="productModel"
                        placeholder="e.g., MK3-WASH"
                        value={productForm.model}
                        onChange={(e) => setProductForm({...productForm, model: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productSku">SKU</Label>
                      <Input
                        id="productSku"
                        placeholder="e.g., CHAUVET-MK3W-001"
                        value={productForm.sku}
                        onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productPrice">Price ($)</Label>
                      <Input
                        id="productPrice"
                        type="number"
                        step="0.01"
                        placeholder="2499.00"
                        value={productForm.price}
                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="productBrand">Brand</Label>
                      <Select 
                        value={productForm.brand_id} 
                        onValueChange={(value) => setProductForm({...productForm, brand_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={brand.id.toString()}>
                              {brand.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="productCategory">Category</Label>
                      <Select 
                        value={productForm.category_id} 
                        onValueChange={(value) => setProductForm({...productForm, category_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productSlug">URL Slug</Label>
                    <Input
                      id="productSlug"
                      placeholder="maverick-mk3-wash"
                      value={productForm.slug}
                      onChange={(e) => setProductForm({...productForm, slug: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      placeholder="High-output RGBW LED wash moving head..."
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productSpecs">Specifications (JSON)</Label>
                    <Textarea
                      id="productSpecs"
                      placeholder='{"power": {"consumption": {"value": 350, "unit": "W"}}}'
                      value={productForm.specifications}
                      onChange={(e) => setProductForm({...productForm, specifications: e.target.value})}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="productActive"
                      checked={productForm.is_active}
                      onChange={(e) => setProductForm({...productForm, is_active: e.target.checked})}
                    />
                    <Label htmlFor="productActive">Product is active</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingProduct !== null ? 'Update Product' : 'Add Product'}
                    </Button>
                    {editingProduct !== null && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          setEditingProduct(null);
                          setProductForm({
                            name: '',
                            model: '',
                            sku: '',
                            price: '',
                            description: '',
                            specifications: '',
                            slug: '',
                            is_active: true,
                            brand_id: '',
                            category_id: ''
                          });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Existing Products</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">{product.model}</TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(product.id);
                                setProductForm({
                                  name: product.name,
                                  model: product.model,
                                  sku: product.sku,
                                  price: product.price.toString(),
                                  description: product.description,
                                  specifications: product.specifications,
                                  slug: product.slug,
                                  is_active: product.is_active,
                                  brand_id: product.brand_id.toString(),
                                  category_id: product.category_id.toString()
                                });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setProducts(products.filter(p => p.id !== product.id))}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}