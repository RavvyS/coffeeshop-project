'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  MessageCircle, 
  Star, 
  Send, 
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

// Sample feedback data (replace with real useFeedback hook)
const SAMPLE_FEEDBACK = [
  {
    id: '1',
    type: 'compliment',
    subject: 'Amazing coffee and service!',
    message: 'I absolutely love coming to Brew & Bean. The staff is always friendly and the coffee is consistently excellent. Keep up the great work!',
    rating: 5,
    status: 'resolved',
    admin_response: 'Thank you so much for your kind words! We\'re thrilled to hear you enjoy your experience with us. Your feedback means the world to our team!',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'suggestion',
    subject: 'More vegan pastry options',
    message: 'Would love to see more vegan pastry options on the menu. The coffee selection is fantastic, but more plant-based food choices would be amazing!',
    rating: 4,
    status: 'resolved',
    admin_response: 'Thank you for your feedback! We are planning to add more vegan pastries next month. Stay tuned for our new plant-based croissants and muffins!',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'inquiry',
    subject: 'Catering services availability',
    message: 'Hi! I am organizing a corporate event for 50 people next month. Do you offer catering services? If so, what packages are available?',
    rating: null,
    status: 'open',
    admin_response: null,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const FEEDBACK_TYPES = [
  { value: 'compliment', label: 'Compliment', icon: '😊', description: 'Share what you loved' },
  { value: 'suggestion', label: 'Suggestion', icon: '💡', description: 'Ideas for improvement' },
  { value: 'complaint', label: 'Complaint', icon: '😞', description: 'Issues you experienced' },
  { value: 'inquiry', label: 'Inquiry', icon: '❓', description: 'Questions about our services' },
  { value: 'other', label: 'Other', icon: '📝', description: 'Anything else' },
];

export default function DashboardFeedbackPage() {
  const { user } = useAuth();
  const [showNewFeedback, setShowNewFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'compliment',
    subject: '',
    message: '',
    rating: 5,
  });

  // Filter feedback for current user
  const userFeedback = SAMPLE_FEEDBACK; // In real app: filter by user.email

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'warning',
      in_progress: 'info',
      resolved: 'success',
      closed: 'default',
    };
    return colors[status as keyof typeof colors] || 'default';
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.subject.trim() || !feedbackForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement with useFeedback hook
      // await submitFeedback(feedbackForm);
      toast.success('Thank you for your feedback! We\'ll review it shortly.');
      setFeedbackForm({
        type: 'compliment',
        subject: '',
        message: '',
        rating: 5,
      });
      setShowNewFeedback(false);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number | null, interactive = false) => {
    if (rating === null) return null;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => setFeedbackForm(prev => ({ ...prev, rating: star })) : undefined}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Feedback</h1>
          <p className="text-gray-600 mt-2">Share your thoughts and track responses</p>
        </div>
        <Button onClick={() => setShowNewFeedback(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Feedback
        </Button>
      </div>

      {/* New Feedback Form */}
      {showNewFeedback && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Submit New Feedback</h2>
            <Button variant="ghost" onClick={() => setShowNewFeedback(false)}>
              ×
            </Button>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            {/* Feedback Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of feedback do you have?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {FEEDBACK_TYPES.map((type) => (
                  <label key={type.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={type.value}
                      checked={feedbackForm.type === type.value}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-colors ${
                      feedbackForm.type === type.value
                        ? 'border-coffee-500 bg-coffee-50'
                        : 'border-gray-200 hover:border-coffee-300'
                    }`}>
                      <div className="text-center">
                        <div className="text-2xl mb-2">{type.icon}</div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                        <div className="text-xs text-gray-600 mt-1">{type.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {renderStars(feedbackForm.rating, true)}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFeedbackForm(prev => ({ ...prev, rating: 0 }))}
                  className="text-sm"
                >
                  No Rating
                </Button>
              </div>
            </div>

            {/* Subject */}
            <Input
              label="Subject"
              value={feedbackForm.subject}
              onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief summary of your feedback"
              required
            />

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Tell us more about your experience..."
                required
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-coffee-500"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowNewFeedback(false)}
              >
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                <Send className="h-4 w-4 mr-2" />
                Submit Feedback
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Feedback History */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Feedback History</h2>
        
        {userFeedback.length === 0 ? (
          <Card className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No feedback yet</h3>
            <p className="text-gray-600 mb-6">
              Share your thoughts and help us improve your coffee experience!
            </p>
            <Button onClick={() => setShowNewFeedback(true)}>
              Write Your First Feedback
            </Button>
          </Card>
        ) : (
          userFeedback.map((feedback) => (
            <Card key={feedback.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{feedback.subject}</h3>
                    <Badge variant={getStatusColor(feedback.status) as any}>
                      {feedback.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs mr-2">
                        {feedback.type}
                      </span>
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDate(feedback.created_at)}
                    </div>
                    {feedback.rating && renderStars(feedback.rating)}
                  </div>
                </div>
              </div>

              {/* Original Message */}
              <div className="mb-4">
                <p className="text-gray-800">{feedback.message}</p>
              </div>

              {/* Admin Response */}
              {feedback.admin_response && (
                <div className="mt-4 p-4 bg-coffee-50 rounded-lg border-l-4 border-coffee-500">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-coffee-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-coffee-900">Brew & Bean Team</span>
                        <span className="text-sm text-coffee-600">
                          {formatDate(feedback.updated_at)}
                        </span>
                      </div>
                      <p className="text-coffee-800">{feedback.admin_response}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Waiting for Response */}
              {feedback.status === 'open' && !feedback.admin_response && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      We've received your feedback and will respond within 24 hours.
                    </span>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Help Section */}
      <Card className="bg-blue-50 p-6">
        <div className="flex items-start space-x-4">
          <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">How Feedback Works</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• We read every piece of feedback and respond within 24 hours</p>
              <p>• Your feedback helps us improve our service and menu offerings</p>
              <p>• For urgent matters, please call us directly at (555) 123-4567</p>
              <p>• All feedback is kept confidential and used constructively</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}