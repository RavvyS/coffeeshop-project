import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth/AuthProvider';

// Configure the Inter font
const inter = Inter({ subsets: ['latin'] });

// Metadata for SEO and social sharing
export const metadata: Metadata = {
  title: {
    default: 'Brew & Bean - Premium Coffee Experience',
    template: '%s | Brew & Bean'
  },
  description: 'Experience the finest coffee, delicious food, and exceptional service at Brew & Bean. Make reservations, order online, and join our coffee community.',
  keywords: ['coffee shop', 'coffee', 'reservations', 'online ordering', 'cafe'],
  authors: [{ name: 'Brew & Bean Team' }],
  creator: 'Brew & Bean',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://brewandbean.com',
    title: 'Brew & Bean - Premium Coffee Experience',
    description: 'Experience the finest coffee and exceptional service.',
    siteName: 'Brew & Bean',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brew & Bean - Premium Coffee Experience',
    description: 'Experience the finest coffee and exceptional service.',
    creator: '@brewandbean',
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * Root Layout Component
 * Wraps all pages with global providers and layout structure
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {/* Authentication Provider - manages user state globally */}
        <AuthProvider>
          {/* Main application content */}
          <main className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50">
            {children}
          </main>
          
          {/* Global toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}