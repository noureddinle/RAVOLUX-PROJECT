import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const categories = [
  {
    name: 'LED Moving Heads',
    description: 'Professional moving head LED fixtures for dynamic lighting effects',
    imageUrl: '/placeholder.svg',
    productCount: 45,
    href: '/categories/led-moving-heads'
  },
  {
    name: 'Par Lights & Wash',
    description: 'High-quality par lights and wash fixtures for even illumination',
    imageUrl: '/placeholder.svg',
    productCount: 38,
    href: '/categories/par-lights'
  },
  {
    name: 'Beam & Spot Lights',
    description: 'Focused beam and spot lighting for precision applications',
    imageUrl: '/placeholder.svg',
    productCount: 32,
    href: '/categories/beam-spot'
  },
  {
    name: 'DJ & Club Lighting',
    description: 'Compact and versatile lighting solutions for entertainment venues',
    imageUrl: '/placeholder.svg',
    productCount: 56,
    href: '/categories/dj-club'
  },
  {
    name: 'Controllers & DMX',
    description: 'Professional lighting controllers and DMX equipment',
    imageUrl: '/placeholder.svg',
    productCount: 28,
    href: '/categories/controllers'
  },
  {
    name: 'Laser Systems',
    description: 'Advanced laser lighting systems for spectacular visual effects',
    imageUrl: '/placeholder.svg',
    productCount: 24,
    href: '/categories/lasers'
  }
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Shop by Category
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover our comprehensive range of professional lighting equipment
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <Card 
              key={category.name}
              className="group overflow-hidden border-0 shadow-professional hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-video overflow-hidden bg-gradient-primary">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                    {category.productCount} items
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                <Link to={category.href}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Explore Category
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/categories">
            <Button size="lg" variant="outline">
              View All Categories
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}