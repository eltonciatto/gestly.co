import { supabase } from './supabase';

export type IntegrationPlatform = 'typebot' | 'manychat' | 'sendbot' | 'whatsapp' | 'telegram';

interface IntegrationConfig {
  webhook_url?: string;
  api_key?: string;
  page_id?: string;
  access_token?: string;
  bot_id?: string;
  api_token?: string;
}

export async function createIntegration(
  businessId: string,
  platform: IntegrationPlatform,
  name: string,
  config: IntegrationConfig
) {
  try {
    const { data, error } = await supabase
      .from('webhook_integrations')
      .insert({
        business_id: businessId,
        platform,
        name,
        config,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating integration:', error);
    throw error;
  }
}

export async function updateIntegration(
  id: string,
  updates: Partial<{
    name: string;
    config: IntegrationConfig;
    is_active: boolean;
  }>
) {
  try {
    const { data, error } = await supabase
      .from('webhook_integrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating integration:', error);
    throw error;
  }
}

export async function deleteIntegration(id: string) {
  try {
    const { error } = await supabase
      .from('webhook_integrations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting integration:', error);
    throw error;
  }
}

export async function logIntegrationEvent(
  integrationId: string,
  eventType: string,
  payload: any,
  response?: any,
  error?: Error
) {
  try {
    await supabase.from('integration_logs').insert({
      integration_id: integrationId,
      event_type: eventType,
      payload,
      response,
      success: !error,
      error_message: error?.message,
    });
  } catch (error) {
    console.error('Error logging integration event:', error);
  }
}

export async function getIntegrationLogs(integrationId: string) {
  try {
    const { data, error } = await supabase
      .from('integration_logs')
      .select('*')
      .eq('integration_id', integrationId)
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching integration logs:', error);
    throw error;
  }
}

interface IntegrationConfig {
  webhook_url?: string;
  api_key?: string;
  page_id?: string;
  access_token?: string;
  bot_id?: string;
  api_token?: string;
}

export async function createIntegration(
  businessId: string,
  platform: IntegrationPlatform,
  name: string,
  config: IntegrationConfig
) {
  const { data, error } = await supabase
    .from('webhook_integrations')
    .insert({
      business_id: businessId,
      platform,
      name,
      config,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIntegration(
  id: string,
  updates: Partial<{
    name: string;
    config: IntegrationConfig;
    is_active: boolean;
  }>
) {
  const { data, error } = await supabase
    .from('webhook_integrations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIntegration(id: string) {
  const { error } = await supabase
    .from('webhook_integrations')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function logIntegrationEvent(
  integrationId: string,
  eventType: string,
  payload: any,
  response?: any,
  error?: Error
) {
  await supabase.from('integration_logs').insert({
    integration_id: integrationId,
    event_type: eventType,
    payload,
    response,
    success: !error,
    error_message: error?.message,
  });
}

export async function getIntegrationLogs(integrationId: string) {
  const { data, error } = await supabase
    .from('integration_logs')
    .select('*')
    .eq('integration_id', integrationId)
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data;
}