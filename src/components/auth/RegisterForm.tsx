'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from './AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { Eye, EyeOff, Coffee, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/**
 * Register Form Component
 * Handles new user registration with validation
 * Includes password confirmation and email verification flow
 */
export function RegisterForm() {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Setup form with react-hook-form and zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password for real-time validation feedback
  const password = watch('password');

  /**
   * Handle form submission
   * Creates new user account and sends confirmation email
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      // Attempt to register user
      const { error } = await signUp(data.email, data.password, data.name);
      
      if (error) {
        // Handle specific registration errors
        if (error.includes('User already registered')) {
          setError('email', { message: 'An account with this email already exists' });
        } else if (error.includes('Password should be at least 6 characters')) {
          setError('password', { message: 'Password must be at least 6 characters long' });
        } else {
          toast.error(error);
        }
        return;
      }

      // Success - show email confirmation message
      setIsSuccess(true);
      toast.success('Account created! Please check your email to confirm.');
      
    } catch (err) {
      console.error('Registration error:', err);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Check Your Email
          </h1>
          
          <p className="text-gray-600 mb-6">
            We've sent you a confirmation link. Please check your email and click the link to activate your account.
          </p>
          
          <div className="space-y-3">
            <Link href="/auth/login">
              <Button className="w-full">
                Back to Sign In
              </Button>
            </Link>
            
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or{' '}
              <button className="text-coffee-600 hover:text-coffee-800 underline">
                resend confirmation
              </button>
            </p>
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
            Join Brew & Bean
          </h1>
          <p className="text-coffee-600">
            Create your account to start ordering
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Field */}
          <Input
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            error={errors.name?.message}
            {...register('name')}
          />

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
              placeholder="Create a strong password"
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

          {/* Confirm Password Field */}
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
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

          {/* Terms and Conditions */}
          <div className="text-sm text-gray-600">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-coffee-600 hover:text-coffee-800 underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-coffee-600 hover:text-coffee-800 underline">
              Privacy Policy
            </Link>
            .
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={isLoading}
            className="w-full"
            size="lg"
          >
            Create Account
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/auth/login"
              className="text-coffee-600 hover:text-coffee-800 font-medium transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
