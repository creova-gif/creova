/**
 * CREOVA Logger Utility
 * 
 * Conditional logging that only outputs in development mode.
 * Prevents console.log statements from running in production.
 * 
 * Usage:
 * import { logger } from '../utils/logger';
 * logger.log('Debug info');
 * logger.error('Error occurred');
 * logger.warn('Warning message');
 * logger.info('Info message');
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Standard log - only in development
   */
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  /**
   * Error log - always shown (critical for debugging)
   */
  error: (...args: any[]) => {
    console.error(...args);
  },

  /**
   * Warning log - only in development
   */
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Info log - only in development
   */
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Success log with emoji - only in development
   */
  success: (...args: any[]) => {
    if (isDevelopment) {
      console.log('✅', ...args);
    }
  },

  /**
   * Debug log with prefix - only in development
   */
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('🔍 [DEBUG]', ...args);
    }
  },

  /**
   * Group logs - only in development
   */
  group: (label: string, ...args: any[]) => {
    if (isDevelopment) {
      console.group(label);
      console.log(...args);
      console.groupEnd();
    }
  },

  /**
   * Table log - only in development
   */
  table: (data: any) => {
    if (isDevelopment) {
      console.table(data);
    }
  },
};

// Export individual functions for convenience
export const { log, error, warn, info, success, debug, group, table } = logger;

export default logger;
