import { Suspense } from 'react';
import { HeroSection } from '@/components/layout/HeroSection';
import { FeaturesSection } from '@/components/layout/FeaturesSection';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

/**
 * Home Page Component
 * Landing page with hero section, features, and call-to-action
 */
export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header with navigation */}
      <Header />
      
      {/* Main content with Suspense boundary for loading states */}
      <Suspense fallback={<LoadingSpinner />}>
        {/* Hero section with main CTA */}
        <HeroSection />
        
        {/* Features showcase */}
        <FeaturesSection />
      </Suspense>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}