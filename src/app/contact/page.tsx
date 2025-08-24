'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Implement contact form submission
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Coffee Street', 'Seattle, WA 98101', 'United States'],
      action: 'Get Directions',
      actionHref: 'https://maps.google.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', 'Mon-Fri: 7AM-8PM', 'Sat-Sun: 8AM-9PM'],
      action: 'Call Now',
      actionHref: 'tel:+15551234567',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['hello@brewandbean.com', 'info@brewandbean.com', 'Response within 24 hours'],
      action: 'Send Email',
      actionHref: 'mailto:hello@brewandbean.com',
    },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '7:00 AM - 8:00 PM' },
    { day: 'Saturday', hours: '8:00 AM - 9:00 PM' },
    { day: 'Sunday', hours: '8:00 AM - 9:00 PM' },
  ];

  const faqs = [
    {
      question: 'Do you take reservations?',
      answer: 'Yes! You can make reservations through our website or by calling us directly. We recommend booking ahead, especially for weekend evenings.'
    },
    {
      question: 'Do you offer catering services?',
      answer: 'We offer catering for events of all sizes. Contact us at least 48 hours in advance to discuss your needs.'
    },
    {
      question: 'Are your coffee beans organic?',
      answer: 'Many of our coffee beans are certified organic. We work directly with sustainable farms and can provide details about any specific blend.'
    },
    {
      question: 'Do you have WiFi?',
      answer: 'Yes, we offer complimentary high-speed WiFi for all customers. Perfect for remote work or casual browsing.'
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-coffee-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-coffee-900 mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-coffee-700 max-w-3xl mx-auto">
            Have a question, feedback, or just want to say hello? 
            We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 text-coffee-600 rounded-full mb-6">
                  <info.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{info.title}</h3>
                <div className="space-y-2 mb-6">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
                <a
                  href={info.actionHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-coffee-600 hover:text-coffee-800 font-medium"
                >
                  {info.action}
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-coffee-900 mb-8">Send us a Message</h2>
              <Card className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone (Optional)"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                    />
                    <Input
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What's this about?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us more about your inquiry..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </div>

            {/* Business Hours & Map */}
            <div className="space-y-8">
              {/* Business Hours */}
              <div>
                <h2 className="text-3xl font-bold text-coffee-900 mb-8">Business Hours</h2>
                <Card className="p-8">
                  <div className="flex items-center mb-6">
                    <Clock className="h-6 w-6 text-coffee-500 mr-3" />
                    <h3 className="text-lg font-semibold text-gray-900">We're Open</h3>
                  </div>
                  <div className="space-y-4">
                    {businessHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{schedule.day}</span>
                        <span className="font-medium text-coffee-600">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-coffee-50 rounded-lg">
                    <p className="text-sm text-coffee-800">
                      <strong>Holiday Hours:</strong> We may have special hours during holidays. 
                      Check our social media or call ahead to confirm.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Map Placeholder */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Find Us</h3>
                <Card className="p-0 overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-coffee-200 to-cream-200 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-coffee-500 mx-auto mb-4" />
                      <p className="text-coffee-700 font-medium">Interactive Map Coming Soon</p>
                      <p className="text-coffee-600 text-sm">123 Coffee Street, Seattle, WA</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-coffee-700">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-coffee-500 mt-1" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <Button variant="secondary">
              <Mail className="h-4 w-4 mr-2" />
              Ask Us Anything
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}