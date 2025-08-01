import { CreditCard, Truck, Package, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Multiple payment options including Cash on Delivery for your convenience',
    bgColor: 'bg-secondary/10',
    iconColor: 'text-secondary-dark'
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary shipping on orders over $500 with fast delivery',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    icon: Package,
    title: 'Delivered with Care',
    description: 'Professional packaging ensures your equipment arrives safely',
    bgColor: 'bg-accent/10',
    iconColor: 'text-accent'
  },
  {
    icon: Heart,
    title: 'Excellent Service',
    description: 'Expert technical support and customer service that exceeds expectations',
    bgColor: 'bg-destructive/10',
    iconColor: 'text-destructive'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Why Choose StageLight Pro?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the difference with our professional service and commitment to excellence
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                className="text-center border-0 shadow-professional hover:shadow-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className={`mx-auto mb-4 h-16 w-16 rounded-full ${feature.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}