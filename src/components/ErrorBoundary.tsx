import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { motion } from 'motion/react';

// Sentry Integration (optional - works without configuration)
// To enable: Set VITE_SENTRY_DSN environment variable in your deployment settings
let SENTRY_DSN: string | undefined;
try {
  SENTRY_DSN = import.meta.env?.VITE_SENTRY_DSN;
} catch (e) {
  SENTRY_DSN = undefined;
}

// Simple Sentry error tracking function
async function reportErrorToSentry(error: Error, errorInfo: ErrorInfo) {
  if (!SENTRY_DSN) {
    return; // Skip if Sentry is not configured
  }

  try {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Send error to Sentry's store endpoint
    // This is a simplified implementation - in production you'd use @sentry/react
    await fetch(`https://sentry.io/api/${SENTRY_DSN}/store/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: error.message,
        exception: {
          values: [{
            type: error.name,
            value: error.message,
            stacktrace: errorData.stack,
          }]
        },
        extra: errorData,
        level: 'error',
      }),
    });
  } catch (sentryError) {
    // Silently fail if Sentry reporting fails
    console.error('Failed to report error to Sentry:', sentryError);
  }
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Update state with error details
    this.setState({
      error,
      errorInfo,
    });

    // Report error to Sentry (if configured)
    reportErrorToSentry(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center px-4"
          style={{ backgroundColor: '#121212' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full text-center p-8 rounded-lg"
            style={{ backgroundColor: '#F5F1EB' }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ backgroundColor: '#B1643B' }}
            >
              <AlertTriangle className="w-10 h-10" style={{ color: '#F5F1EB' }} />
            </motion.div>

            {/* Title */}
            <h1 
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#121212' }}
            >
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p 
              className="text-lg mb-6"
              style={{ color: '#7A6F66' }}
            >
              We're sorry, but something unexpected happened. Our team has been notified and we're working to fix it.
            </p>

            {/* Error Details (Development Only) */}
            {import.meta.env.DEV && this.state.error && (
              <div 
                className="mb-8 p-4 rounded-lg text-left overflow-auto max-h-64"
                style={{ backgroundColor: '#E3DCD3' }}
              >
                <p className="font-mono text-sm font-bold mb-2" style={{ color: '#121212' }}>
                  Error Details (Dev Only):
                </p>
                <p className="font-mono text-xs mb-2" style={{ color: '#B1643B' }}>
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="font-mono text-xs whitespace-pre-wrap" style={{ color: '#7A6F66' }}>
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={this.handleReset}
                size="lg"
                className="gap-2"
                style={{ 
                  backgroundColor: '#B1643B',
                  color: '#F5F1EB'
                }}
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </Button>

              <Button
                onClick={this.handleGoHome}
                size="lg"
                variant="outline"
                className="gap-2"
                style={{ 
                  borderColor: '#B1643B',
                  color: '#B1643B'
                }}
              >
                <Home className="w-5 h-5" />
                Go to Homepage
              </Button>
            </div>

            {/* Support Info */}
            <p 
              className="text-sm mt-8"
              style={{ color: '#7A6F66' }}
            >
              If this problem persists, please contact us at{' '}
              <a 
                href="mailto:support@creova.ca" 
                className="underline"
                style={{ color: '#B1643B' }}
              >
                support@creova.ca
              </a>
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}