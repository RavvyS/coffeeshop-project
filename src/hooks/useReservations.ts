'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { emailService } from '@/lib/email';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Reservation = Database['public']['Tables']['reservations']['Row'];
type CreateReservationData = Database['public']['Tables']['reservations']['Insert'];
type UpdateReservationData = Database['public']['Tables']['reservations']['Update'];

/**
 * Enhanced Reservations Hook with Email Integration
 * Now includes automatic email notifications for all reservation actions
 */
export function useReservations() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's reservations
  const fetchReservations = async () => {
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user.id)
        .order('reservation_date', { ascending: true })
        .order('reservation_time', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      setReservations(data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  // Create a new reservation with email notification
  const createReservation = async (reservationData: Omit<CreateReservationData, 'user_id'>) => {
    if (!user) {
      throw new Error('User must be logged in to create reservations');
    }

    try {
      const { data, error: createError } = await supabase
        .from('reservations')
        .insert({
          ...reservationData,
          user_id: user.id,
        })
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Update local state
      setReservations(prev => [...prev, data]);
      
      // Send confirmation email to customer
      try {
        await emailService.sendReservationConfirmation(data);
        toast.success('Reservation created! Confirmation email sent.');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        toast.success('Reservation created! (Email notification failed)');
      }

      // Send admin notification
      try {
        await emailService.sendAdminNotification('reservation', data);
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error creating reservation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create reservation';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Update an existing reservation with email notification
  const updateReservation = async (id: string, updates: UpdateReservationData) => {
    try {
      const originalReservation = reservations.find(r => r.id === id);
      
      const { data, error: updateError } = await supabase
        .from('reservations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id ? data : reservation
        )
      );

      // Determine update type for email
      let updateType: 'modified' | 'confirmed' | 'cancelled' = 'modified';
      if (updates.status === 'confirmed') updateType = 'confirmed';
      if (updates.status === 'cancelled') updateType = 'cancelled';

      // Send update email to customer
      try {
        await emailService.sendReservationUpdate(data, updateType);
        const actionText = updateType === 'cancelled' ? 'cancelled' : 'updated';
        toast.success(`Reservation ${actionText}! Email notification sent.`);
      } catch (emailError) {
        console.error('Failed to send update email:', emailError);
        toast.success('Reservation updated! (Email notification failed)');
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error updating reservation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update reservation';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Cancel a reservation
  const cancelReservation = async (id: string) => {
    return updateReservation(id, { status: 'cancelled' });
  };

  // Delete a reservation with email notification
  const deleteReservation = async (id: string) => {
    try {
      const reservation = reservations.find(r => r.id === id);
      if (!reservation) {
        throw new Error('Reservation not found');
      }

      const { error: deleteError } = await supabase
        .from('reservations')
        .delete()
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Update local state
      setReservations(prev => prev.filter(r => r.id !== id));

      // Send cancellation email
      try {
        await emailService.sendReservationUpdate(reservation, 'cancelled');
        toast.success('Reservation deleted! Cancellation email sent.');
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError);
        toast.success('Reservation deleted! (Email notification failed)');
      }

      return { error: null };
    } catch (err) {
      console.error('Error deleting reservation:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete reservation';
      setError(errorMessage);
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('user_reservations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reservations',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Reservation change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setReservations(prev => [...prev, payload.new as Reservation]);
              break;
            case 'UPDATE':
              setReservations(prev =>
                prev.map(reservation =>
                  reservation.id === payload.new.id ? payload.new as Reservation : reservation
                )
              );
              break;
            case 'DELETE':
              setReservations(prev =>
                prev.filter(reservation => reservation.id !== payload.old.id)
              );
              break;
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // Fetch reservations when user changes
  useEffect(() => {
    fetchReservations();
  }, [user]);

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    cancelReservation,
    deleteReservation,
    refetch: fetchReservations,
  };
}