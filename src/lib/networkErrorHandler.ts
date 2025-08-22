import toast from 'react-hot-toast';

export enum NetworkErrorType {
  OFFLINE = 'offline',
  TIMEOUT = 'timeout',
  SERVER_ERROR = 'server_error',
  CLIENT_ERROR = 'client_error',
  RATE_LIMIT = 'rate_limit',
  UNKNOWN = 'unknown',
}

interface NetworkError {
  type: NetworkErrorType;
  message: string;
  status?: number;
  retry?: () => Promise<any>;
  originalError?: Error;
}

/**
 * Network Error Handler
 * Centralized error handling for network requests with retry logic
 */
class NetworkErrorHandler {
  private retryAttempts = new Map<string, number>();
  private maxRetries = 3;
  private retryDelay = 1000; // Start with 1 second

  /**
   * Handle network errors with appropriate user feedback
   */
  handleError(error: any, context?: string): NetworkError {
    const networkError = this.categorizeError(error);
    
    // Log error for monitoring
    console.error(`Network Error [${context}]:`, networkError);
    
    // Show user-friendly notification
    this.showUserNotification(networkError);
    
    // Track error for analytics
    this.trackError(networkError, context);
    
    return networkError;
  }

  /**
   * Categorize error type
   */
  private categorizeError(error: any): NetworkError {
    // Offline detection
    if (!navigator.onLine) {
      return {
        type: NetworkErrorType.OFFLINE,
        message: 'You appear to be offline. Please check your internet connection.',
        originalError: error,
      };
    }

    // Supabase/API errors
    if (error?.message) {
      if (error.message.includes('fetch')) {
        return {
          type: NetworkErrorType.TIMEOUT,
          message: 'Request timed out. Please try again.',
          originalError: error,
        };
      }

      if (error.message.includes('rate limit')) {
        return {
          type: NetworkErrorType.RATE_LIMIT,
          message: 'Too many requests. Please wait a moment and try again.',
          originalError: error,
        };
      }
    }

    // HTTP status errors
    if (error?.status) {
      if (error.status >= 400 && error.status < 500) {
        return {
          type: NetworkErrorType.CLIENT_ERROR,
          message: this.getClientErrorMessage(error.status),
          status: error.status,
          originalError: error,
        };
      }

      if (error.status >= 500) {
        return {
          type: NetworkErrorType.SERVER_ERROR,
          message: 'Server error. Our team has been notified.',
          status: error.status,
          originalError: error,
        };
      }
    }

    // Default unknown error
    return {
      type: NetworkErrorType.UNKNOWN,
      message: 'Something went wrong. Please try again.',
      originalError: error,
    };
  }

  /**
   * Get user-friendly client error messages
   */
  private getClientErrorMessage(status: number): string {
    const messages = {
      400: 'Invalid request. Please check your input.',
      401: 'Please sign in to continue.',
      403: 'You don\'t have permission to perform this action.',
      404: 'The requested resource was not found.',
      409: 'This action conflicts with existing data.',
      422: 'Please check your input and try again.',
      429: 'Too many requests. Please wait a moment.',
    };

    return messages[status as keyof typeof messages] || 'Request failed. Please try again.';
  }

  /**
   * Show user notification
   */
  private showUserNotification(error: NetworkError) {
    switch (error.type) {
      case NetworkErrorType.OFFLINE:
        toast.error(error.message, { duration: 5000 });
        break;
      case NetworkErrorType.RATE_LIMIT:
        toast.error(error.message, { duration: 4000 });
        break;
      case NetworkErrorType.SERVER_ERROR:
        toast.error(error.message, { duration: 6000 });
        break;
      default:
        toast.error(error.message);
    }
  }

  /**
   * Track error for analytics
   */
  private trackError(error: NetworkError, context?: string) {
    const errorData = {
      type: error.type,
      message: error.message,
      status: error.status,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, send to analytics service
    console.log('Error tracked:', errorData);
  }

  /**
   * Create retry function with exponential backoff
   */
  createRetryFunction(
    originalFunction: () => Promise<any>,
    requestId: string
  ): () => Promise<any> {
    return async () => {
      const attempts = this.retryAttempts.get(requestId) || 0;
      
      if (attempts >= this.maxRetries) {
        this.retryAttempts.delete(requestId);
        throw new Error('Maximum retry attempts exceeded');
      }

      // Exponential backoff
      const delay = this.retryDelay * Math.pow(2, attempts);
      await new Promise(resolve => setTimeout(resolve, delay));

      this.retryAttempts.set(requestId, attempts + 1);
      
      try {
        const result = await originalFunction();
        this.retryAttempts.delete(requestId); // Success, clear attempts
        return result;
      } catch (error) {
        // If still failing, don't increment here - let the next call handle it
        throw error;
      }
    };
  }

  /**
   * Wrap async function with error handling
   */
  wrapWithErrorHandling<T>(
    fn: () => Promise<T>,
    context?: string
  ): () => Promise<T> {
    return async () => {
      try {
        return await fn();
      } catch (error) {
        const networkError = this.handleError(error, context);
        throw networkError;
      }
    };
  }
}

// Export singleton instance
export const networkErrorHandler = new NetworkErrorHandler();
