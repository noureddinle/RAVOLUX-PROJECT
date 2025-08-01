import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function About() {
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
      
      <div className="container py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8">About StageLight Pro</h1>
          <div className="prose prose-lg mx-auto">
            <p className="text-lg text-muted-foreground text-center mb-12">
              Leading provider of professional stage lighting equipment for over two decades.
            </p>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground">
                  Founded in 2002, StageLight Pro has been at the forefront of the professional 
                  lighting industry, providing cutting-edge equipment to venues, production 
                  companies, and lighting professionals worldwide.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground">
                  To empower lighting professionals with the highest quality equipment, 
                  expert support, and innovative solutions that bring creative visions to life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}