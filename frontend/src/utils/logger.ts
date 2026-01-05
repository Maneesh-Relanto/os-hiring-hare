/**
 * Frontend logging utility
 * Logs messages to console in development, can be configured for production
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

type LogLevel = keyof typeof LOG_LEVELS;

class Logger {
  private enabled: boolean;
  private logLevel: LogLevel;

  constructor() {
    // Enable logging in development, disable in production
    this.enabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_LOGGING === 'true';
    this.logLevel = (import.meta.env.VITE_LOG_LEVEL as LogLevel) || 'DEBUG';
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabled && LOG_LEVELS[level] >= LOG_LEVELS[this.logLevel];
  }

  private formatMessage(level: LogLevel, context: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${context}] ${message}`;
  }

  debug(context: string, message: string, data?: any) {
    if (this.shouldLog('DEBUG')) {
      console.debug(this.formatMessage('DEBUG', context, message), data || '');
    }
  }

  info(context: string, message: string, data?: any) {
    if (this.shouldLog('INFO')) {
      console.info(this.formatMessage('INFO', context, message), data || '');
    }
  }

  warn(context: string, message: string, data?: any) {
    if (this.shouldLog('WARN')) {
      console.warn(this.formatMessage('WARN', context, message), data || '');
    }
  }

  error(context: string, message: string, error?: any) {
    if (this.shouldLog('ERROR')) {
      console.error(this.formatMessage('ERROR', context, message), error || '');
    }
  }

  // Log API requests
  apiRequest(method: string, url: string, data?: any) {
    this.debug('API', `→ ${method} ${url}`, data);
  }

  // Log API responses
  apiResponse(method: string, url: string, status: number, data?: any) {
    const level = status >= 400 ? 'ERROR' : 'DEBUG';
    const message = `← ${method} ${url} - ${status}`;
    
    if (level === 'ERROR') {
      this.error('API', message, data);
    } else {
      this.debug('API', message, data);
    }
  }

  // Log authentication events
  authEvent(event: string, details?: any) {
    this.info('AUTH', event, details);
  }
}

// Export singleton instance
export const logger = new Logger();
