import { getDB } from './db'
import { sendMagicLink } from './email'
import { AppError } from './error'

// User roles
export type UserRole = 'super_admin' | 'admin' | 'professional' | 'client'

// Sign in with magic link
export async function signInWithMagicLink(email: string) {
  try {
    const name = email.split('@')[0];
    const success = await sendMagicLink(email, name);

    if (!success) {
      throw new AppError('Failed to send magic link', 'email_error');
    }

    return { error: null }; 
  } catch (error) {
    console.error('Magic link error:', error);
    return { error };
  }
}

// Sign out
export async function signOut() {
  try {
    await getDB().auth.signOut()
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

// Get current user role
export async function getUserRole(): Promise<UserRole | null> {
  try {
    const user = await getDB().auth.getUser()
    return user?.user_metadata?.role as UserRole || null
  } catch (error) {
    console.error('Get user role error:', error)
    return null
  }
}

// Check if user is super admin
export async function isSuperAdmin(): Promise<boolean> {
  const role = await getUserRole()
  return role === 'super_admin'
}