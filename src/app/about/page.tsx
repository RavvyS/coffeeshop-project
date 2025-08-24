import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Coffee, Heart, Award, Users, Clock, Leaf } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Coffee,
      title: 'Quality First',
      description: 'We source only the finest coffee beans from sustainable farms around the world.',
    },
    {
      icon: Heart,
      title: 'Community Focus',
      description: 'Building relationships and creating a warm, welcoming space for everyone.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Every cup is crafted with passion and precision by our skilled baristas.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Committed to ethical sourcing and environmentally responsible practices.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Head Roaster',
      bio: 'With 15 years of experience in the coffee industry, Sarah brings passion and expertise to every roast.',
      image: '/team/sarah.jpg', // Placeholder
    },
    {
      name: 'Marcus Chen',
      role: 'Head Barista',
      bio: 'Marcus is a certified Q Grader and latte art champion, dedicated to the perfect brew.',
      image: '/team/marcus.jpg', // Placeholder
    },
    {
      name: 'Emily Rodriguez',
      role: 'Store Manager',
      bio: 'Emily ensures every customer has an exceptional experience at Brew & Bean.',
      image: '/team/emily.jpg', // Placeholder
    },
    {
      name: 'David Kim',
      role: 'Pastry Chef',
      bio: 'David creates fresh, delicious pastries and treats daily using locally sourced ingredients.',
      image: '/team/david.jpg', // Placeholder
    },
  ];

  const stats = [
    { number: '50+', label: 'Coffee Varieties' },
    { number: '10k+', label: 'Happy Customers' },
    { number: '5', label: 'Years Serving' },
    { number: '4.9★', label: 'Average Rating' },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-coffee-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-coffee-900 mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-coffee-700 max-w-3xl mx-auto">
            Born from a passion for exceptional coffee and community, 
            Brew & Bean has been Seattle's favorite coffee destination since 2020.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-700 mb-6">
                At Brew & Bean, we believe that great coffee has the power to bring people together. 
                Our mission is to create exceptional coffee experiences while building a stronger, 
                more connected community.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We're committed to ethical sourcing, supporting coffee farmers, and reducing our 
                environmental impact. Every cup tells a story of craftsmanship, sustainability, 
                and the pursuit of perfection.
              </p>
              <p className="text-lg text-gray-700">
                Whether you're starting your day, meeting friends, or finding a quiet moment to yourself, 
                we're here to make it special with the perfect cup of coffee.
              </p>
            </div>
            <div className="relative">
              {/* Coffee beans image placeholder */}
              <div className="aspect-square bg-gradient-to-br from-coffee-200 to-cream-200 rounded-xl flex items-center justify-center">
                <Coffee className="h-32 w-32 text-coffee-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-coffee-700">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-coffee-100 text-coffee-600 rounded-full mb-6">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-coffee-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              By the Numbers
            </h2>
            <p className="text-xl text-coffee-200">
              Our journey in numbers
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-cream-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-coffee-200 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-coffee-700">
              The passionate people behind your perfect cup
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center p-6">
                <div className="w-24 h-24 bg-gradient-to-br from-coffee-200 to-cream-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-12 w-12 text-coffee-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-coffee-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-br from-cream-50 to-coffee-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-coffee-900 mb-6">
            Visit Us Today
          </h2>
          <p className="text-xl text-coffee-700 mb-8">
            Experience the Brew & Bean difference. We're open 7 days a week and always excited to serve you.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <Clock className="h-8 w-8 text-coffee-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 7AM-8PM<br/>Weekends: 8AM-9PM</p>
            </div>
            <div className="text-center">
              <Coffee className="h-8 w-8 text-coffee-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">123 Coffee Street<br/>Seattle, WA 98101</p>
            </div>
            <div className="text-center">
              <Heart className="h-8 w-8 text-coffee-500 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Connect</h3>
              <p className="text-gray-600">@brewandbean<br/>hello@brewandbean.com</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}