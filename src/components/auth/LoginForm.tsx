'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { Eye, EyeOff, Coffee } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/**
 * Login Form Component
 * Handles user authentication with email and password
 * Includes form validation and error handling
 */
export function LoginForm() {
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Setup form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle form submission
   * Attempts to sign in user and handles errors
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      // Attempt to sign in
      const { error } = await signIn(data.email, data.password);
      
      if (error) {
        // Handle specific auth errors
        if (error.includes('Invalid login credentials')) {
          setError('email', { message: 'Invalid email or password' });
          setError('password', { message: 'Invalid email or password' });
        } else if (error.includes('Email not confirmed')) {
          setError('email', { message: 'Please check your email and confirm your account' });
        } else {
          toast.error(error);
        }
        return;
      }

      // Success - user will be redirected by AuthProvider
      toast.success('Welcome back!');
      
    } catch (err) {
      console.error('Login error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Welcome Back
          </h1>
          <p className="text-coffee-600">
            Sign in to your Brew & Bean account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email')}
          />

          {/* Password Field */}
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              href="/auth/forgot-password"
              className="text-sm text-coffee-600 hover:text-coffee-800 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Sign In
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center mb-2">
            Demo Credentials:
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <div><strong>Customer:</strong> user@demo.com / password123</div>
            <div><strong>Admin:</strong> admin@demo.com / admin123</div>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/auth/register"
              className="text-coffee-600 hover:text-coffee-800 font-medium transition-colors"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}