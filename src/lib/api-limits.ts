import { AppError } from './error';

const RATE_LIMIT_WINDOW = 3600; // 1 hour in seconds

interface LogApiRequestParams {
  businessId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  error?: Error;
}

export async function checkRateLimit(businessId: string): Promise<boolean> {
  try {
    // Simplified rate limit check for now
    return true;
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return false;
  }
}

export async function logApiRequest({
  businessId,
  endpoint,
  method,
  statusCode,
  duration,
  error
}: LogApiRequestParams) {
  try {
    // Simplified logging for now
    console.log('API Request:', {
      businessId,
      endpoint,
      method,
      statusCode,
      duration,
      error: error?.message
    });
  } catch (error) {
    console.error('Error logging API request:', error);
  }
}

export async function getApiUsage(businessId: string, period: 'hour' | 'day' | 'week' = 'hour') {
  try {
    // Simplified usage stats for now
    return {
      total: 0,
      success: 0,
      error: 0,
      byHour: Array(24).fill(0)
    };
  } catch (error) {
    console.error('Error getting API usage:', error);
    throw new AppError('Failed to get API usage', 'api_error');
  }
}