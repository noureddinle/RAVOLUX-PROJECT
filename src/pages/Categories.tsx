import { Link } from 'react-router-dom';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useState, useEffect } from 'react';

const categories = [
  {
    name: 'LED Moving Head Lights',
    description: 'Professional moving head LED fixtures for dynamic lighting effects and stunning visuals',
    productCount: 45,
    href: '/categories/led-moving-heads',
    imageUrl: '/placeholder.svg',
    features: ['Full RGBW color mixing', 'Pan/Tilt movement', 'DMX control', 'Gobos & effects']
  },
  {
    name: 'Par Lights & Wash Lights',
    description: 'High-quality par lights and wash fixtures for even illumination and color washes',
    productCount: 38,
    href: '/categories/par-lights',
    imageUrl: '/placeholder.svg',
    features: ['LED technology', 'Color mixing', 'Dimming control', 'Multiple beam angles']
  },
  {
    name: 'Beam & Spot Lights',
    description: 'Focused beam and spot lighting for precision applications and sharp projections',
    productCount: 32,
    href: '/categories/beam-spot',
    imageUrl: '/placeholder.svg',
    features: ['Sharp beam output', 'Gobo projection', 'Prism effects', 'Iris control']
  },
  {
    name: 'DJ & Club Lighting',
    description: 'Compact and versatile lighting solutions for entertainment venues and mobile DJs',
    productCount: 56,
    href: '/categories/dj-club',
    imageUrl: '/placeholder.svg',
    features: ['Sound activation', 'Auto programs', 'Strobe effects', 'Portable design']
  },
  {
    name: 'Architectural Lighting',
    description: 'Permanent installation fixtures for buildings, facades, and landscape lighting',
    productCount: 29,
    href: '/categories/architectural',
    imageUrl: '/placeholder.svg',
    features: ['Weather resistant', 'Long lifespan', 'Energy efficient', 'Pixel mapping']
  },
  {
    name: 'Controllers & DMX Equipment',
    description: 'Professional lighting controllers and DMX equipment for complete show control',
    productCount: 28,
    href: '/categories/controllers',
    imageUrl: '/placeholder.svg',
    features: ['Multi-universe output', 'Touch screen', 'Wireless control', 'Show programming']
  },
  {
    name: 'Truss & Rigging Hardware',
    description: 'Professional truss systems and rigging hardware for safe equipment mounting',
    productCount: 41,
    href: '/categories/truss-rigging',
    imageUrl: '/placeholder.svg',
    features: ['Aluminum construction', 'Modular design', 'Quick assembly', 'Safety tested']
  },
  {
    name: 'Fog & Haze Machines',
    description: 'Atmosphere generators and special effects machines for enhanced lighting',
    productCount: 22,
    href: '/categories/fog-haze',
    imageUrl: '/placeholder.svg',
    features: ['Water-based fluid', 'DMX control', 'Timer functions', 'Variable output']
  },
  {
    name: 'Laser Lighting Systems',
    description: 'Advanced laser lighting systems for spectacular visual effects and shows',
    productCount: 24,
    href: '/categories/lasers',
    imageUrl: '/placeholder.svg',
    features: ['Multiple colors', 'Pattern projection', 'Show software', 'Safety features']
  },
  {
    name: 'LED Strips & Panels',
    description: 'Flexible LED strips and panels for creative lighting installations and effects',
    productCount: 33,
    href: '/categories/led-strips',
    imageUrl: '/placeholder.svg',
    features: ['Pixel control', 'Flexible mounting', 'Color changing', 'Cut-to-length']
  }
];

export default function Categories() {
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
      <div className="bg-gradient-primary py-16">
        <div className="container text-center">
          <Lightbulb className="mx-auto h-16 w-16 text-primary-foreground mb-4" />
          <h1 className="text-4xl font-bold text-primary-foreground md:text-5xl">
            Lighting Categories
          </h1>
          <p className="mt-4 text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Explore our comprehensive range of professional lighting equipment, 
            organized by type and application
          </p>
        </div>
      </div>

      <div className="container py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold">{category.name}</h3>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {category.productCount} items
                  </span>
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {category.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold mb-2">Key Features:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {category.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link to={category.href}>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    variant="outline"
                  >
                    Browse {category.name}
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