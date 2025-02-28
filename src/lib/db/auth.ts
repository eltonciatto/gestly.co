import { query, queryOne } from './postgres';
import { createUser, getUserByEmail } from './users';
import { createBusiness } from './businesses';
import type { User, Session } from './types';
import { generateToken, verifyToken } from './utils';

export async function signUp(data: {
  email: string;
  password?: string;
  name?: string;
  role?: 'admin' | 'attendant';
}): Promise<{ user: User | null; error: Error | null }> {
  try {
    // Check if user exists
    const existingUser = await getUserByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create user
    const user = await createUser({
      email: data.email,
      full_name: data.name || data.email.split('@')[0],
      role: data.role || 'admin'
    });

    // Create business for admin users
    if (user.role === 'admin') {
      const business = await createBusiness({
        owner_id: user.id,
        name: `${user.full_name}'s Business`,
        email: user.email,
        api_key: crypto.randomUUID(),
        default_commission_percentage: 40,
        settings: {
          allow_customer_portal: true,
          allow_team_portal: true,
          allow_affiliate_program: false,
          default_commission_percentage: 40,
          loyalty_points_per_currency: 1,
          loyalty_points_expiration_days: 365,
          auto_approve_appointments: false,
          require_deposit: false,
          deposit_percentage: 0,
          cancellation_policy_hours: 24,
          notification_preferences: {
            email: true,
            whatsapp: true,
            sms: false
          }
        },
        metrics: {
          total_customers: 0,
          total_appointments: 0,
          total_revenue: 0,
          average_rating: 0
        }
      });

      // Update user with business_id
      user.business_id = business.id;
    }

    return { user, error: null };
  } catch (error) {
    console.error('Error in signUp:', error);
    return { 
      user: null, 
      error: error instanceof Error ? error : new Error('Error during signup')
    };
  }
}

export async function signIn(email: string): Promise<{ session: Session | null; error: Error | null }> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // Create session
    const session = {
      access_token: generateToken({ userId: user.id, type: 'access' }),
      expires_at: Date.now() + 3600000, // 1 hour
      user
    };

    return { session, error: null };
  } catch (error) {
    console.error('Error in signIn:', error);
    return {
      session: null,
      error: error instanceof Error ? error : new Error('Error during signin')
    };
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  // Since we're not storing sessions in the database,
  // we just return success
  return { error: null };
}