import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const brands = [
  {
    name: 'Chauvet Professional',
    description: 'Leading manufacturer of professional lighting equipment for entertainment applications',
    logo: '/placeholder.svg',
    productCount: 89,
    yearEstablished: 1998,
    specialties: ['LED Moving Heads', 'Par Lights', 'Controllers', 'Atmospheric Effects'],
    href: '/brands/chauvet-professional'
  },
  {
    name: 'Martin by Harman',
    description: 'Premium lighting solutions with innovative technology and superior build quality',
    logo: '/placeholder.svg',
    productCount: 67,
    yearEstablished: 1987,
    specialties: ['Moving Lights', 'Architectural', 'Control Systems', 'Media Servers'],
    href: '/brands/martin-by-harman'
  },
  {
    name: 'Ayrton',
    description: 'French manufacturer known for innovative LED technology and exceptional optics',
    logo: '/placeholder.svg',
    productCount: 42,
    yearEstablished: 2001,
    specialties: ['LED Moving Heads', 'Beam Lights', 'Wash Lights', 'Profile Lights'],
    href: '/brands/ayrton'
  },
  {
    name: 'Clay Paky',
    description: 'Italian excellence in professional lighting with cutting-edge technology',
    logo: '/placeholder.svg',
    productCount: 56,
    yearEstablished: 1976,
    specialties: ['Moving Heads', 'LED Fixtures', 'Controllers', 'Beam Lights'],
    href: '/brands/clay-paky'
  },
  {
    name: 'Robe',
    description: 'Czech manufacturer renowned for reliable, high-performance lighting fixtures',
    logo: '/placeholder.svg',
    productCount: 74,
    yearEstablished: 1994,
    specialties: ['Moving Heads', 'LED Technology', 'Beam Lights', 'Wash Lights'],
    href: '/brands/robe'
  },
  {
    name: 'ADJ',
    description: 'American DJ lighting solutions for mobile entertainers and venues',
    logo: '/placeholder.svg',
    productCount: 123,
    yearEstablished: 1985,
    specialties: ['DJ Lighting', 'LED Fixtures', 'Controllers', 'Atmospheric Effects'],
    href: '/brands/adj'
  }
];

export default function Brands() {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* Header */}
      <div className="bg-gradient-secondary py-16">
        <div className="container text-center">
          <Award className="mx-auto h-16 w-16 text-secondary-foreground mb-4" />
          <h1 className="text-4xl font-bold text-secondary-foreground md:text-5xl">
            Our Brand Partners
          </h1>
          <p className="mt-4 text-xl text-secondary-foreground/80 max-w-2xl mx-auto">
            We partner with the world's leading lighting manufacturers to bring you 
            the highest quality equipment and latest innovations
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => (
            <Card 
              key={brand.name}
              className="group overflow-hidden border-0 shadow-professional hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="h-16 w-32 mx-auto bg-muted rounded-lg flex items-center justify-center mb-3">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="max-h-12 max-w-28 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold">{brand.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Est. {brand.yearEstablished}
                  </p>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed text-center">
                  {brand.description}
                </p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-semibold mb-2">Specialties:</h4>
                  <div className="flex flex-wrap gap-2">
                    {brand.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm text-muted-foreground">
                    {brand.productCount} products available
                  </span>
                  <Badge variant="outline" className="text-xs">
                    Authorized Dealer
                  </Badge>
                </div>
                
                <Link to={brand.href}>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    View {brand.name} Products
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}