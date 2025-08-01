import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50" />
      
      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Professional{' '}
            <span className="bg-gradient-secondary bg-clip-text text-transparent">
              Stage Lighting
            </span>{' '}
            Equipment
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Transform your venue with cutting-edge lighting technology. From LED moving heads 
            to laser systems, we provide the equipment that brings your vision to life.
          </p>
          
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-secondary text-secondary-foreground hover:shadow-glow transition-all duration-300"
            >
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <Play className="mr-2 h-4 w-4" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary md:text-3xl">500+</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary md:text-3xl">50+</div>
              <div className="text-sm text-muted-foreground">Brands</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary md:text-3xl">24/7</div>
              <div className="text-sm text-muted-foreground">Support</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary md:text-3xl">1000+</div>
              <div className="text-sm text-muted-foreground">Happy Clients</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating decoration elements */}
      <div className="absolute top-20 left-10 h-4 w-4 rounded-full bg-secondary/30 animate-float" />
      <div className="absolute top-40 right-20 h-6 w-6 rounded-full bg-accent/20 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-20 left-1/4 h-3 w-3 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
}