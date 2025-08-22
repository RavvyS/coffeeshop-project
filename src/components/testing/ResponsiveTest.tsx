'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Smartphone, Tablet, Monitor, RotateCcw } from 'lucide-react';

interface ScreenSize {
  name: string;
  width: number;
  height: number;
  icon: React.ComponentType<any>;
}

/**
 * Responsive Testing Component
 * Helps test mobile responsiveness during development
 */
export function ResponsiveTest() {
  const [currentSize, setCurrentSize] = useState<ScreenSize | null>(null);
  const [screenInfo, setScreenInfo] = useState({
    width: 0,
    height: 0,
    orientation: '',
    pixelRatio: 1,
  });

  const screenSizes: ScreenSize[] = [
    { name: 'iPhone SE', width: 375, height: 667, icon: Smartphone },
    { name: 'iPhone 12', width: 390, height: 844, icon: Smartphone },
    { name: 'iPhone 12 Pro Max', width: 428, height: 926, icon: Smartphone },
    { name: 'iPad', width: 768, height: 1024, icon: Tablet },
    { name: 'iPad Pro', width: 1024, height: 1366, icon: Tablet },
    { name: 'Desktop', width: 1440, height: 900, icon: Monitor },
  ];

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        orientation: window.screen.orientation?.type || 'unknown',
        pixelRatio: window.devicePixelRatio,
      });
    };

    updateScreenInfo();
    window.addEventListener('resize', updateScreenInfo);
    window.addEventListener('orientationchange', updateScreenInfo);

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', updateScreenInfo);
    };
  }, []);

  const simulateScreenSize = (size: ScreenSize) => {
    // In development, you might use browser dev tools
    // This is more for documentation/testing purposes
    setCurrentSize(size);
    console.log(`Simulating ${size.name}: ${size.width}x${size.height}`);
    
    // You could also programmatically resize if in iframe or testing environment
    if (window.parent !== window) {
      window.parent.postMessage({
        type: 'RESIZE_WINDOW',
        width: size.width,
        height: size.height,
      }, '*');
    }
  };

  const resetSize = () => {
    setCurrentSize(null);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 p-4 bg-white shadow-lg border">
      <h4 className="font-semibold text-sm mb-3">Responsive Testing</h4>
      
      {/* Current Screen Info */}
      <div className="text-xs text-gray-600 mb-3">
        <div>Size: {screenInfo.width}x{screenInfo.height}</div>
        <div>Ratio: {screenInfo.pixelRatio}x</div>
        <div>Orientation: {screenInfo.orientation}</div>
      </div>

      {/* Size Buttons */}
      <div className="grid grid-cols-2 gap-1 mb-3">
        {screenSizes.map((size) => {
          const Icon = size.icon;
          return (
            <Button
              key={size.name}
              variant={currentSize?.name === size.name ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => simulateScreenSize(size)}
              className="text-xs p-1"
            >
              <Icon className="h-3 w-3 mr-1" />
              {size.name}
            </Button>
          );
        })}
      </div>

      {/* Reset Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={resetSize}
        className="w-full text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Reset
      </Button>
    </Card>
  );
}