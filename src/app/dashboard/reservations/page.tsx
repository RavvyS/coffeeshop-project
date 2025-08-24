'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Edit, 
  Trash2, 
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';
import toast from 'react-hot-toast';

// Sample reservations data (replace with real useReservations hook)
const SAMPLE_RESERVATIONS = [
  {
    id: '1',
    guest_name: 'John Customer',
    guest_email: 'customer@brewbean.com',
    guest_phone: '+1 (555) 123-4567',
    reservation_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days from now
    reservation_time: '10:30',
    guest_count: 4,
    special_requests: 'Window seat preferred, celebrating anniversary',
    status: 'confirmed',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    guest_name: 'Sarah VIP',
    guest_email: 'vip@brewbean.com',
    guest_phone: '+1 (555) 987-6543',
    reservation_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day from now
    reservation_time: '14:00',
    guest_count: 2,
    special_requests: 'Business meeting, quiet area please',
    status: 'confirmed',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    guest_name: 'John Customer',
    guest_email: 'customer@brewbean.com',
    reservation_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
    reservation_time: '16:00',
    guest_count: 2,
    special_requests: null,
    status: 'completed',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export default function DashboardReservationsPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');
  const [editingReservation, setEditingReservation] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState<any>(null);

  // Filter reservations based on current user and tab
  const userReservations = SAMPLE_RESERVATIONS.filter(reservation => 
    reservation.guest_email === user?.email
  );

  const upcomingReservations = userReservations.filter(reservation => {
    const reservationDate = new Date(reservation.reservation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate >= today && ['pending', 'confirmed'].includes(reservation.status);
  });

  const pastReservations = userReservations.filter(reservation => {
    const reservationDate = new Date(reservation.reservation_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return reservationDate < today || ['completed', 'cancelled', 'no_show'].includes(reservation.status);
  });

  const currentReservations = selectedTab === 'upcoming' ? upcomingReservations : pastReservations;

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      completed: 'info',
      cancelled: 'error',
      no_show: 'error',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      // TODO: Implement with useReservations hook
      // await cancelReservation(reservationId);
      toast.success('Reservation cancelled successfully');
      setShowCancelModal(null);
    } catch (error) {
      toast.error('Failed to cancel reservation');
    }
  };

  const handleUpdateReservation = async (reservationData: any) => {
    try {
      // TODO: Implement with useReservations hook
      // await updateReservation(editingReservation.id, reservationData);
      toast.success('Reservation updated successfully');
      setEditingReservation(null);
    } catch (error) {
      toast.error('Failed to update reservation');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          <p className="text-gray-600 mt-2">Manage your table reservations at Brew & Bean</p>
        </div>
        <Link href="/reservations">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Reservation
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'upcoming'
                ? 'border-coffee-500 text-coffee-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({upcomingReservations.length})
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              selectedTab === 'past'
                ? 'border-coffee-500 text-coffee-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past Reservations ({pastReservations.length})
          </button>
        </nav>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {currentReservations.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No {selectedTab} reservations
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedTab === 'upcoming' 
                ? "You don't have any upcoming reservations. Book a table today!"
                : "You haven't made any reservations yet."
              }
            </p>
            <Link href="/reservations">
              <Button>Make a Reservation</Button>
            </Link>
          </Card>
        ) : (
          currentReservations.map((reservation) => (
            <Card key={reservation.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center text-lg font-semibold text-gray-900">
                      <Calendar className="h-5 w-5 mr-2 text-coffee-500" />
                      {formatDate(reservation.reservation_date, 'long')}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatTime(reservation.reservation_time)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {reservation.guest_count} {reservation.guest_count === 1 ? 'guest' : 'guests'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Guest Name</p>
                      <p className="font-medium">{reservation.guest_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium">{reservation.guest_email}</p>
                      {reservation.guest_phone && (
                        <p className="text-sm text-gray-500">{reservation.guest_phone}</p>
                      )}
                    </div>
                  </div>

                  {reservation.special_requests && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Special Requests</p>
                      <p className="text-gray-800">{reservation.special_requests}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Badge variant={getStatusColor(reservation.status) as any}>
                      {reservation.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      123 Coffee Street, Seattle, WA
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  {selectedTab === 'upcoming' && reservation.status !== 'cancelled' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingReservation(reservation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowCancelModal(reservation)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Edit Reservation Modal */}
      {editingReservation && (
        <Modal
          isOpen={true}
          onClose={() => setEditingReservation(null)}
          title="Edit Reservation"
          size="md"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdateReservation({
              guest_count: parseInt(formData.get('guest_count') as string),
              special_requests: formData.get('special_requests') as string,
            });
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <select
                name="guest_count"
                defaultValue={editingReservation.guest_count}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests
              </label>
              <textarea
                name="special_requests"
                defaultValue={editingReservation.special_requests || ''}
                placeholder="Any special requests or dietary requirements..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingReservation(null)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Update Reservation
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCancelModal(null)}
          title="Cancel Reservation"
          size="sm"
        >
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cancel this reservation?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your reservation for {formatDate(showCancelModal.reservation_date)} 
              at {formatTime(showCancelModal.reservation_time)}? This action cannot be undone.
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowCancelModal(null)}
              >
                Keep Reservation
              </Button>
              <Button
                variant="danger"
                onClick={() => handleCancelReservation(showCancelModal.id)}
              >
                Cancel Reservation
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Help Section */}
      <Card className="bg-coffee-50 p-6">
        <div className="flex items-start space-x-4">
          <CheckCircle className="h-6 w-6 text-coffee-600 mt-1" />
          <div>
            <h3 className="font-semibold text-coffee-900 mb-2">Reservation Policy</h3>
            <div className="text-sm text-coffee-800 space-y-1">
              <p>• Reservations can be cancelled up to 2 hours before your scheduled time</p>
              <p>• We'll hold your table for 15 minutes past your reservation time</p>
              <p>• For parties larger than 8, please call us directly at (555) 123-4567</p>
              <p>• Changes to reservation time require cancellation and rebooking</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}