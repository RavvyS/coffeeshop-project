import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { FileText, Mail, Phone } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 text-coffee-600 rounded-full mb-6">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Last updated: December 1, 2024
          </p>
        </div>

        <Card className="p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the Brew & Bean website, mobile application, or services, you agree to be 
              bound by these Terms of Service and all applicable laws and regulations. If you do not agree with 
              any of these terms, you are prohibited from using our services.
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Definitions</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li><strong>"Company", "we", "us", "our"</strong> refers to Brew & Bean Coffee Shop</li>
              <li><strong>"Service"</strong> refers to our website, mobile app, and coffee shop services</li>
              <li><strong>"User", "you", "your"</strong> refers to the individual using our services</li>
              <li><strong>"Content"</strong> refers to all text, images, data, and other materials on our platform</li>
            </ul>
          </section>

          {/* Use License */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Use License</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Permission is granted to temporarily access and use our services for personal, non-commercial 
              transitory viewing only. Under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on our platform</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features of our service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password</li>
              <li>Accept all risks of unauthorized access to your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders and Payment</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Order Placement</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>All orders are subject to acceptance and availability</li>
              <li>We reserve the right to refuse or cancel orders at our discretion</li>
              <li>Prices are subject to change without notice</li>
              <li>Orders cannot be modified once confirmed</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Payment is due at the time of order placement</li>
              <li>We accept major credit cards, debit cards, and digital payments</li>
              <li>All payments are processed securely through third-party providers</li>
              <li>Refunds are provided in accordance with our refund policy</li>
            </ul>
          </section>

          {/* Reservations */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reservations</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Reservations are subject to availability and confirmation</li>
              <li>Tables are held for 15 minutes past the reservation time</li>
              <li>Cancellations must be made at least 2 hours in advance</li>
              <li>Repeated no-shows may result in reservation restrictions</li>
              <li>Large group reservations may require special arrangements</li>
            </ul>
          </section>

          {/* User Conduct */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Conduct</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree not to use our services to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Impersonate another person or entity</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with or disrupt our services</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use our services for any unlawful or prohibited purpose</li>
              <li>Harass, abuse, or harm other users or staff</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The service and its original content, features, and functionality are and will remain the 
              exclusive property of Brew & Bean and its licensors. The service is protected by copyright, 
              trademark, and other laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our trademarks and trade dress may not be used in connection with any product or service 
              without our prior written consent.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your 
              use of the service, to understand our practices regarding the collection and use of your 
              personal information.
            </p>
          </section>

          {/* Refund Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Policy</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Refunds are available for orders cancelled within 5 minutes of placement</li>
              <li>Defective or incorrect orders will be refunded or replaced</li>
              <li>Refunds for completed orders are at our discretion</li>
              <li>Processing time for refunds is 3-5 business days</li>
              <li>Loyalty points earned from refunded orders will be deducted</li>
            </ul>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent 
              permitted by law, we:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Exclude all representations and warranties relating to this website and its contents</li>
              <li>Exclude all liability for damages arising out of or in connection with your use of this website</li>
              <li>Do not guarantee the accuracy, completeness, or timeliness of information</li>
              <li>Cannot ensure the website will be available at all times</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall Brew & Bean, nor its directors, employees, partners, agents, suppliers, 
              or affiliates, be liable for any indirect, incidental, special, consequential, or punitive 
              damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your use of the service.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the service immediately, without 
              prior notice or liability, under our sole discretion, for any reason whatsoever including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Breach of these Terms of Service</li>
              <li>Violation of applicable laws or regulations</li>
              <li>Fraudulent, abusive, or otherwise harmful behavior</li>
              <li>Extended periods of inactivity</li>
            </ul>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be interpreted and governed by the laws of the State of Washington, 
              United States, without regard to its conflict of law provisions. Our failure to enforce 
              any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material, we will provide at least 30 days notice prior to any new terms 
              taking effect. Your continued use of our service after any such changes constitutes 
              acceptance of the new Terms of Service.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-coffee-500" />
                <span>legal@brewbean.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-coffee-500" />
                <span>(555) 123-4567</span>
              </div>
              <div className="text-sm text-gray-600 mt-4">
                Brew & Bean Coffee Shop<br/>
                123 Coffee Street<br/>
                Seattle, WA 98101<br/>
                United States
              </div>
            </div>
          </section>

          {/* Acknowledgment */}
          <section className="border-t pt-6">
            <p className="text-sm text-gray-600 italic">
              By using our service, you acknowledge that you have read these Terms of Service and 
              agree to be bound by them.
            </p>
          </section>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
}