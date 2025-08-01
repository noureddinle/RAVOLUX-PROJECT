import { ProductCard } from './ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const trendingProducts = [
  {
    id: '1',
    name: 'Chauvet Professional Rogue R2X Wash',
    brand: 'Chauvet Professional',
    price: 1299,
    originalPrice: 1599,
    image: '/placeholder.svg',
    rating: 4.8,
    reviewCount: 124,
    isInStock: true,
    isOnSale: true,
    features: ['RGBW LED', '19° - 45° Zoom', 'IP65 Rated']
  },
  {
    id: '2',
    name: 'Martin MAC Aura XB LED Wash Light',
    brand: 'Martin by Harman',
    price: 2450,
    image: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 89,
    isInStock: true,
    features: ['Aura Backlight', 'CTC Control', 'Quiet Operation']
  },
  {
    id: '3',
    name: 'Ayrton Perseo Profile',
    brand: 'Ayrton',
    price: 4200,
    originalPrice: 4800,
    image: '/placeholder.svg',
    rating: 4.7,
    reviewCount: 67,
    isInStock: false,
    isOnSale: true,
    features: ['400W LED', 'Framing System', 'CMY + CTO']
  },
  {
    id: '4',
    name: 'Robe MegaPointe Moving Head',
    brand: 'Robe',
    price: 5600,
    image: '/placeholder.svg',
    rating: 4.9,
    reviewCount: 156,
    isInStock: true,
    features: ['470W Multi-Source', 'Prism Effects', 'Frost Filter']
  }
];

export function TrendingProducts() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Trending Products
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Discover the most popular lighting equipment chosen by professionals
            </p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="hidden md:flex">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trendingProducts.map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 md:hidden">
          <Link to="/products">
            <Button variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}