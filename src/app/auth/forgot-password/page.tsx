'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Coffee, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        if (error.message.includes('User not found')) {
          setError('email', { message: 'No account found with this email address' });
        } else {
          toast.error(error.message);
        }
        return;
      }

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Password reset email sent!');

    } catch (err) {
      console.error('Password reset error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h1>
          
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <strong>{submittedEmail}</strong>. 
            Click the link in the email to create a new password.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 text-blue-800">
                <Mail className="h-4 w-4" />
                <span className="text-sm font-medium">What's next?</span>
              </div>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 text-left">
                <li>• Check your email inbox and spam folder</li>
                <li>• Click the reset link (expires in 1 hour)</li>
                <li>• Create your new password</li>
                <li>• Sign in with your new credentials</li>
              </ul>
            </div>
            
            <Link href="/auth/login">
              <Button className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>
            
            <button
              onClick={() => onSubmit({ email: submittedEmail })}
              className="text-sm text-coffee-600 hover:text-coffee-800 underline"
              disabled={isLoading}
            >
              Resend reset email
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-coffee-500 p-3 rounded-full">
              <Coffee className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-coffee-900 mb-2">
            Reset Your Password
          </h1>
          <p className="text-coffee-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Send Reset Link
          </Button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link 
            href="/auth/login"
            className="inline-flex items-center text-coffee-600 hover:text-coffee-800 font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Sign In
          </Link>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-xs text-gray-600">
            If you don't receive the email within a few minutes, check your spam folder or{' '}
            <a href="/contact" className="text-coffee-600 hover:text-coffee-800 underline">
              contact our support team
            </a>.
          </p>
        </div>
      </Card>
    </div>
  );
}