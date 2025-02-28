import { supabase } from './supabase';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  BACKUP = 'backup',
  RESTORE = 'restore',
  SETTINGS_CHANGE = 'settings_change'
}

export interface AuditLogEntry {
  action: AuditAction;
  resource: string;
  resource_id?: string;
  user_id: string;
  business_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export async function logAuditEvent(entry: AuditLogEntry) {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        ...entry,
        created_at: new Date().toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error logging audit event:', error);
  }
}

export async function getAuditLogs(
  businessId: string,
  options: {
    action?: AuditAction;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  } = {}
) {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (options.action) {
    query = query.eq('action', options.action);
  }

  if (options.resource) {
    query = query.eq('resource', options.resource);
  }

  if (options.startDate) {
    query = query.gte('created_at', options.startDate.toISOString());
  }

  if (options.endDate) {
    query = query.lte('created_at', options.endDate.toISOString());
  }

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}