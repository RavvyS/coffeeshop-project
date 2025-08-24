'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/components/auth/AuthProvider';
import { Calendar, Clock, Users, MapPin, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ReservationsPage() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservationData, setReservationData] = useState({
    guest_name: user?.user_metadata?.name || '',
    guest_email: user?.email || '',
    guest_phone: '',
    reservation_date: '',
    reservation_time: '',
    guest_count: 2,
    special_requests: '',
  });

  // Available time slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: name === 'guest_count' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to make a reservation');
      window.location.href = '/auth/login';
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement reservation creation with useReservations hook
      // const { error } = await createReservation(reservationData);
      // if (error) throw new Error(error);
      
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Reservation confirmed! Check your email for details.');
      setStep(3); // Success step
    } catch (error) {
      console.error('Reservation failed:', error);
      toast.error('Failed to make reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (step === 3) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-8">
              <CheckCircle className="h-10 w-10" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Reservation Confirmed!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              We're excited to see you at Brew & Bean
            </p>
            
            <Card className="max-w-2xl mx-auto p-8 text-left">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Reservation Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{reservationData.guest_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(reservationData.reservation_date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{reservationData.reservation_time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Guests:</span>
                  <span className="font-medium">{reservationData.guest_count}</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-coffee-50 rounded-lg">
                <p className="text-sm text-coffee-800">
                  <strong>What's Next?</strong><br/>
                  • We've sent a confirmation email to {reservationData.guest_email}<br/>
                  • Please arrive 5-10 minutes before your reservation time<br/>
                  • Contact us at (555) 123-4567 if you need to make changes
                </p>
              </div>
            </Card>
            
            <div className="mt-8 space-x-4">
              <Button onClick={() => window.location.href = '/dashboard/reservations'}>
                View My Reservations
              </Button>
              <Button variant="ghost" onClick={() => window.location.href = '/menu'}>
                Browse Menu
              </Button>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-coffee-50 to-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-coffee-900 mb-6">
            Reserve Your Table
          </h1>
          <p className="text-xl md:text-2xl text-coffee-700 max-w-3xl mx-auto">
            Book your perfect coffee experience at Brew & Bean. 
            Whether it's a business meeting or casual catch-up, we've got the perfect spot for you.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-coffee-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-coffee-500' : 'bg-gray-200'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-coffee-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              2
            </div>
          </div>
        </div>

        {step === 1 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">When would you like to visit?</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Select Date
                  </label>
                  <input
                    type="date"
                    name="reservation_date"
                    value={reservationData.reservation_date}
                    onChange={handleInputChange}
                    min={getMinDate()}
                    max={getMaxDate()}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 inline mr-2" />
                    Number of Guests
                  </label>
                  <select
                    name="guest_count"
                    value={reservationData.guest_count}
                    onChange={(e) => setReservationData(prev => ({ ...prev, guest_count: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Time Selection */}
              {reservationData.reservation_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Available Times
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setReservationData(prev => ({ ...prev, reservation_time: time }))}
                        className={`p-3 text-sm font-medium rounded-lg border transition-colors ${
                          reservationData.reservation_time === time
                            ? 'bg-coffee-500 text-white border-coffee-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-coffee-300 hover:bg-coffee-50'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={!reservationData.reservation_date || !reservationData.reservation_time}
                  size="lg"
                >
                  Continue
                </Button>
              </div>
            </form>
          </Card>
        )}

        {step === 2 && (
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Guest Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="guest_name"
                  value={reservationData.guest_name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your full name"
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  name="guest_email"
                  value={reservationData.guest_email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <Input
                label="Phone Number (Optional)"
                type="tel"
                name="guest_phone"
                value={reservationData.guest_phone}
                onChange={handleInputChange}
                placeholder="+1 (555) 123-4567"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  name="special_requests"
                  value={reservationData.special_requests}
                  onChange={handleInputChange}
                  placeholder="Any special requests, dietary requirements, or occasion details..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
                />
              </div>
              
              {/* Reservation Summary */}
              <Card className="bg-coffee-50 p-6">
                <h3 className="text-lg font-semibold text-coffee-900 mb-4">Reservation Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{new Date(reservationData.reservation_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{reservationData.reservation_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-medium">{reservationData.guest_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-medium">123 Coffee Street, Seattle</span>
                  </div>
                </div>
              </Card>
              
              {/* Terms */}
              <div className="text-sm text-gray-600">
                <p>By making this reservation, you agree to our cancellation policy. 
                Please cancel at least 2 hours in advance if your plans change.</p>
              </div>

              <div className="flex justify-between">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  type="submit"
                  loading={isSubmitting}
                  size="lg"
                >
                  {user ? 'Confirm Reservation' : 'Sign In to Reserve'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 text-center">
            <MapPin className="h-8 w-8 text-coffee-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
            <p className="text-gray-600 text-sm">123 Coffee Street<br/>Seattle, WA 98101</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Clock className="h-8 w-8 text-coffee-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Hours</h3>
            <p className="text-gray-600 text-sm">Mon-Fri: 7AM-8PM<br/>Sat-Sun: 8AM-9PM</p>
          </Card>
          
          <Card className="p-6 text-center">
            <Users className="h-8 w-8 text-coffee-500 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">Group Size</h3>
            <p className="text-gray-600 text-sm">Up to 12 guests<br/>Larger groups call ahead</p>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}