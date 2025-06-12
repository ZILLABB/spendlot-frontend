import { AxiosError } from 'axios';
import { Alert } from 'react-native';
import { APIError } from '../types';

export interface ErrorContext {
  service: string;
  method: string;
  endpoint?: string;
  userId?: string;
  timestamp: string;
}

export interface ErrorReport {
  error: APIError;
  context: ErrorContext;
  userAgent: string;
  appVersion: string;
}

class ErrorHandler {
  private errorQueue: ErrorReport[] = [];
  private maxQueueSize = 50;

  // Handle API errors with context
  handleApiError(
    error: any,
    context: Partial<ErrorContext>
  ): APIError {
    const timestamp = new Date().toISOString();
    const fullContext: ErrorContext = {
      service: 'Unknown',
      method: 'Unknown',
      timestamp,
      ...context,
    };

    let apiError: APIError;

    if (this.isAxiosError(error)) {
      apiError = this.parseAxiosError(error);
    } else if (error instanceof Error) {
      apiError = {
        error: 'ClientError',
        message: error.message,
        status_code: 0,
      };
    } else {
      apiError = {
        error: 'UnknownError',
        message: 'An unknown error occurred',
        status_code: 0,
      };
    }

    // Log error for debugging
    this.logError(apiError, fullContext);

    // Queue error for reporting (if needed)
    this.queueError(apiError, fullContext);

    return apiError;
  }

  // Parse Axios errors into standardized format
  private parseAxiosError(error: AxiosError): APIError {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;
      return {
        error: data?.error || 'ServerError',
        message: data?.message || error.message,
        details: data?.details,
        status_code: error.response.status,
      };
    } else if (error.request) {
      // Network error
      return {
        error: 'NetworkError',
        message: 'Unable to connect to server. Please check your internet connection.',
        status_code: 0,
      };
    } else {
      // Request setup error
      return {
        error: 'RequestError',
        message: error.message,
        status_code: 0,
      };
    }
  }

  // Check if error is an Axios error
  private isAxiosError(error: any): error is AxiosError {
    return error.isAxiosError === true;
  }

  // Log error for debugging
  private logError(error: APIError, context: ErrorContext): void {
    console.group(`🚨 API Error - ${context.service}.${context.method}`);
    console.error('Error:', error.error);
    console.error('Message:', error.message);
    console.error('Status Code:', error.status_code);
    console.error('Context:', context);
    if (error.details) {
      console.error('Details:', error.details);
    }
    console.groupEnd();
  }

  // Queue error for reporting
  private queueError(error: APIError, context: ErrorContext): void {
    const errorReport: ErrorReport = {
      error,
      context,
      userAgent: 'React Native App', // Could be more specific
      appVersion: '1.0.0', // Should come from app config
    };

    this.errorQueue.push(errorReport);

    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }
  }

  // Show user-friendly error message
  showUserError(error: APIError, context?: Partial<ErrorContext>): void {
    const userMessage = this.getUserFriendlyMessage(error);
    
    Alert.alert(
      'Error',
      userMessage,
      [
        { text: 'OK', style: 'default' },
        ...(this.isRetryableError(error) ? [
          { text: 'Retry', onPress: () => this.handleRetry(context) }
        ] : []),
      ]
    );
  }

  // Get user-friendly error message
  private getUserFriendlyMessage(error: APIError): string {
    switch (error.error) {
      case 'NetworkError':
        return 'Unable to connect to the server. Please check your internet connection and try again.';
      
      case 'ValidationError':
        return error.message || 'Please check your input and try again.';
      
      case 'AuthenticationError':
      case 'Unauthorized':
        return 'Your session has expired. Please log in again.';
      
      case 'Forbidden':
        return 'You do not have permission to perform this action.';
      
      case 'NotFound':
        return 'The requested resource was not found.';
      
      case 'ServerError':
        return 'A server error occurred. Please try again later.';
      
      case 'RateLimitExceeded':
        return 'Too many requests. Please wait a moment and try again.';
      
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Check if error is retryable
  private isRetryableError(error: APIError): boolean {
    const retryableErrors = [
      'NetworkError',
      'ServerError',
      'TimeoutError',
      'ServiceUnavailable',
    ];
    
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];
    
    return retryableErrors.includes(error.error) || 
           (error.status_code ? retryableStatusCodes.includes(error.status_code) : false);
  }

  // Handle retry logic
  private handleRetry(context?: Partial<ErrorContext>): void {
    // This would trigger a retry of the original request
    // Implementation depends on how you want to handle retries
    console.log('Retry requested for:', context);
  }

  // Get error statistics
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    errorsByService: Record<string, number>;
    recentErrors: ErrorReport[];
  } {
    const errorsByType: Record<string, number> = {};
    const errorsByService: Record<string, number> = {};

    this.errorQueue.forEach(report => {
      // Count by error type
      const errorType = report.error.error;
      errorsByType[errorType] = (errorsByType[errorType] || 0) + 1;

      // Count by service
      const service = report.context.service;
      errorsByService[service] = (errorsByService[service] || 0) + 1;
    });

    return {
      totalErrors: this.errorQueue.length,
      errorsByType,
      errorsByService,
      recentErrors: this.errorQueue.slice(-10), // Last 10 errors
    };
  }

  // Clear error queue
  clearErrors(): void {
    this.errorQueue = [];
  }

  // Export errors for debugging
  exportErrors(): string {
    return JSON.stringify(this.errorQueue, null, 2);
  }

  // Handle specific error scenarios
  handleAuthenticationError(): void {
    // Clear stored tokens and redirect to login
    console.log('Authentication error - redirecting to login');
    // This would be implemented based on your auth flow
  }

  handleNetworkError(): void {
    // Show network error message and possibly enable offline mode
    console.log('Network error - enabling offline mode');
  }

  handleServerError(error: APIError): void {
    // Log server errors for monitoring
    console.log('Server error occurred:', error);
    // Could send to error monitoring service
  }

  // Validate error response format
  isValidErrorResponse(error: any): boolean {
    return error && 
           typeof error.error === 'string' && 
           typeof error.message === 'string';
  }

  // Create error from string
  createError(message: string, type: string = 'ClientError'): APIError {
    return {
      error: type,
      message,
      status_code: 0,
    };
  }
}

export const errorHandler = new ErrorHandler();

// Utility functions for common error scenarios
export const handleApiError = (error: any, context: Partial<ErrorContext>) => {
  return errorHandler.handleApiError(error, context);
};

export const showUserError = (error: APIError, context?: Partial<ErrorContext>) => {
  errorHandler.showUserError(error, context);
};

export const getErrorStats = () => {
  return errorHandler.getErrorStats();
};

export default ErrorHandler;
