'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/auth/AuthProvider';
import { emailService } from '@/lib/email';
import toast from 'react-hot-toast';
import type { Database } from '@/types/supabase';

type Feedback = Database['public']['Tables']['feedback']['Row'];
type CreateFeedbackData = Database['public']['Tables']['feedback']['Insert'];

/**
 * Enhanced Feedback Hook with Email Integration
 * Includes automatic email confirmations for feedback submissions
 */
export function useFeedback() {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's feedback
  const fetchFeedback = async () => {
    if (!user) {
      setFeedback([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setFeedback(data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch feedback');
    } finally {
      setLoading(false);
    }
  };

  // Submit new feedback with email notification
  const submitFeedback = async (feedbackData: Omit<CreateFeedbackData, 'user_id'>) => {
    if (!user) {
      throw new Error('User must be logged in to submit feedback');
    }

    try {
      const { data, error: submitError } = await supabase
        .from('feedback')
        .insert({
          ...feedbackData,
          user_id: user.id,
        })
        .select()
        .single();

      if (submitError) {
        throw submitError;
      }

      // Update local state
      setFeedback(prev => [data, ...prev]);

      // Send confirmation email to customer
      try {
        const userName = user.user_metadata?.name || user.email?.split('@')[0] || 'Customer';
        const userEmail = user.email || '';
        
        await emailService.sendFeedbackConfirmation(data, userName, userEmail);
        toast.success('Feedback submitted! Confirmation email sent.');
      } catch (emailError) {
        console.error('Failed to send feedback confirmation email:', emailError);
        toast.success('Feedback submitted! (Email notification failed)');
      }

      // Send admin notification
      try {
        const feedbackWithUser = {
          ...data,
          user: {
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Customer',
            email: user.email || '',
          }
        };
        await emailService.sendAdminNotification('feedback', feedbackWithUser);
      } catch (adminEmailError) {
        console.error('Failed to send admin notification:', adminEmailError);
      }

      return { data, error: null };
    } catch (err) {
      console.error('Error submitting feedback:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(errorMessage);
      toast.error(errorMessage);
      return { data: null, error: errorMessage };
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const subscription = supabase
      .channel('user_feedback')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'feedback',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Feedback change:', payload);
          
          switch (payload.eventType) {
            case 'INSERT':
              setFeedback(prev => [payload.new as Feedback, ...prev]);
              break;
            case 'UPDATE':
              setFeedback(prev =>
                prev.map(item =>
                  item.id === payload.new.id ? payload.new as Feedback : item
                )
              );
              // If admin responded, show notification
              if (payload.new.admin_response && !payload.old.admin_response) {
                toast.success('Admin has responded to your feedback!');
              }
              break;
            case 'DELETE':
              setFeedback(prev =>
                prev.filter(item => item.id !== payload.old.id)
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

  // Fetch feedback when user changes
  useEffect(() => {
    fetchFeedback();
  }, [user]);

  return {
    feedback,
    loading,
    error,
    submitFeedback,
    refetch: fetchFeedback,
  };
}