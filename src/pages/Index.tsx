import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { CategoriesSection } from '@/components/CategoriesSection';
import { TrendingProducts } from '@/components/TrendingProducts';

const Index = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(3);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
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
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        cartItemCount={cartItemCount}
      />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <TrendingProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
