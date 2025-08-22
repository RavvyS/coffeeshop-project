import Link from 'next/link';
import { Coffee, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS, BUSINESS_HOURS } from '@/lib/constants';

/**
 * Footer Component
 * Site footer with contact info, links, and business hours
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Quick Links': [
      { href: '/menu', label: 'Menu' },
      { href: '/reservations', label: 'Reservations' },
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
    ],
    'Account': [
      { href: '/auth/login', label: 'Sign In' },
      { href: '/auth/register', label: 'Register' },
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/dashboard/orders', label: 'Order History' },
    ],
    'Support': [
      { href: '/help', label: 'Help Center' },
      { href: '/feedback', label: 'Feedback' },
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
    ],
  };

  return (
    <footer className="bg-coffee-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Coffee className="h-8 w-8 text-cream-400" />
              <span className="text-xl font-bold">Brew & Bean</span>
            </Link>
            
            <p className="text-coffee-200 mb-6 leading-relaxed">
              Your neighborhood coffee shop serving premium coffee, delicious food, 
              and creating memorable experiences since 2020.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-cream-400" />
                <span className="text-coffee-200">
                  {CONTACT_INFO.address.street}, {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-cream-400" />
                <span className="text-coffee-200">{CONTACT_INFO.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-cream-400" />
                <span className="text-coffee-200">{CONTACT_INFO.email}</span>
              </div>
            </div>
          </div>
          
          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-cream-200 mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="text-coffee-200 hover:text-cream-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Business hours */}
        <div className="mt-12 pt-8 border-t border-coffee-800">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-cream-400" />
            <h3 className="font-semibold text-cream-200">Business Hours</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-sm text-coffee-200">
            {Object.entries(BUSINESS_HOURS).map(([day, hours]) => (
              <div key={day}>
                <div className="font-medium capitalize">{day}</div>
                <div>
                  {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-coffee-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-coffee-300 text-sm">
            © {currentYear} Brew & Bean. All rights reserved.
          </p>
          
          {/* Social links */}
          <div className="flex space-x-4 mt-4 md:mt-0">
            {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-coffee-300 hover:text-cream-300 transition-colors"
                aria-label={`Follow us on ${platform}`}
              >
                {/* Social icons would go here */}
                <span className="capitalize">{platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}