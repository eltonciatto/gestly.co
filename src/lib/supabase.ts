import { AppError } from './error';

// This is a temporary export to help with transition
// It will throw an error to help identify places that need to be updated
export const supabase = new Proxy({}, {
  get: () => {
    throw new AppError(
      'Supabase client is deprecated. Please use apiClient from @/lib/api/client instead.',
      'deprecated_client'
    );
  }
});

// This file is deprecated and should not be used.
// We've moved to using direct PostgreSQL connections via src/lib/db
// and HTTP API calls via src/lib/api/client.ts

// This file can be deleted once all references are updated.