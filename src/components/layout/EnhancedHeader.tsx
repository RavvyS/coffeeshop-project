'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';
import { 
  Coffee, 
  Menu, 
  X, 
  User, 
  Calendar, 
  ShoppingCart,
  MessageCircle,
  Settings,
  LogOut
} from 'lucide-react';

/**
 * Enhanced Header with Real-time Notifications
 * Includes notification center and connection status
 */
export function EnhancedHeader() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '/menu', label: 'Menu', icon: Coffee },
    { href: '/reservations', label: 'Reservations', icon: Calendar },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const userMenuLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: User },
    { href: '/dashboard/orders', label: 'Live Order Tracking', icon: ShoppingCart },
    { href: '/dashboard/reservations', label: 'My Reservations', icon: Calendar },
    { href: '/dashboard/feedback', label: 'Feedback', icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-soft border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Coffee className="h-8 w-8 text-coffee-500" />
            <span className="text-xl font-bold text-coffee-900">
              Brew & Bean
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-coffee-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Notification Center */}
                <NotificationCenter />
                
                {/* Connection Status */}
                <ConnectionStatus />
                
                {/* User Menu */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.user_metadata?.name || user.email}</span>
                  </Button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200">
                      <div className="py-2">
                        {userMenuLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            {link.icon && <link.icon className="h-4 w-4 mr-3" />}
                            {link.label}
                          </Link>
                        ))}
                        <hr className="my-2" />
                        {user.user_metadata?.role === 'admin' && (
                          <>
                            <Link
                              href="/admin"
                              className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <Settings className="h-4 w-4 mr-3" />
                              Admin Dashboard
                            </Link>
                            <hr className="my-2" />
                          </>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {user && <NotificationCenter />}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Navigation Links */}
            <div className="space-y-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <hr className="my-4" />

            {/* User Menu */}
            {user ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-sm text-gray-500 flex items-center space-x-2">
                  <ConnectionStatus />
                  <span>Signed in as {user.user_metadata?.name || user.email}</span>
                </div>
                {userMenuLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon && <link.icon className="h-4 w-4 mr-3" />}
                    {link.label}
                  </Link>
                ))}
                {user.user_metadata?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4 mr-3" />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
