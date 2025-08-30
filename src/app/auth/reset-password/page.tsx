'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Coffee, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password');

  // Check if user has a valid reset session
  useEffect(() => {
    const checkResetSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        setHasValidSession(false);
      } else {
        setHasValidSession(true);
      }
      
      setIsCheckingSession(false);
    };

    checkResetSession();

    // Handle auth state changes from email link
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setHasValidSession(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, text: '' };
    
    let strength = 0;
    const checks = [
      password.length >= 6,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    
    strength = checks.filter(Boolean).length;
    
    const strengthTexts = [
      '', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'
    ];
    
    const strengthColors = [
      '', 'text-red-500', 'text-red-400', 'text-yellow-500', 'text-green-400', 'text-green-500'
    ];
    
    return {
      strength,
      text: strengthTexts[strength],
      color: strengthColors[strength],
    };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      toast.success('Password updated successfully!');

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err) {
      console.error('Password update error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </Card>
      </div>
    );
  }

  // Invalid or expired reset link
  if (!hasValidSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-red-500 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Reset Link
          </h1>
          
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          
          <div className="space-y-3">
            <Link href="/auth/forgot-password">
              <Button className="w-full">
                Request New Reset Link
              </Button>
            </Link>
            
            <Link href="/auth/login">
              <Button variant="ghost" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-coffee-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Password Updated!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your password has been successfully updated. You can now sign in with your new password.
          </p>
          
          <p className="text-sm text-gray-500">
            Redirecting you to sign in...
          </p>
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
            Create New Password
          </h1>
          <p className="text-coffee-600">
            Please enter your new password below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your new password"
              error={errors.password?.message}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1 w-full rounded ${
                        level <= passwordStrength.strength
                          ? passwordStrength.strength <= 2
                            ? 'bg-red-400'
                            : passwordStrength.strength <= 3
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Update Password
          </Button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Security Tips</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Use at least 6 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid common passwords</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}