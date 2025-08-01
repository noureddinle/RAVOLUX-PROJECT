import { useState } from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    isInStock: boolean;
    isOnSale?: boolean;
    features: string[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden border-0 shadow-professional hover:shadow-glow transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isOnSale && (
            <Badge variant="destructive" className="bg-secondary text-secondary-foreground">
              -{discountPercentage}%
            </Badge>
          )}
          {!product.isInStock && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              Out of Stock
            </Badge>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 rounded-full p-0 shadow-md"
            onClick={() => setIsWishlisted(!isWishlisted)}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current text-destructive' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 rounded-full p-0 shadow-md"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Add to Cart */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button 
            className="w-full bg-primary/90 backdrop-blur hover:bg-primary"
            disabled={!product.isInStock}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {product.isInStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        {/* Brand */}
        <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
          {product.brand}
        </div>
        
        {/* Product Name */}
        <h3 className="font-semibold text-sm leading-tight mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'fill-secondary text-secondary'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>
        
        {/* Features */}
        <div className="text-xs text-muted-foreground mb-3">
          {product.features.slice(0, 2).join(' • ')}
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-primary">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.isInStock && (
            <Badge variant="outline" className="text-xs text-success border-success">
              In Stock
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}