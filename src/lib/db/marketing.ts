import { query, queryOne } from './postgres';

export interface Campaign {
  id: string;
  business_id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'cancelled';
  subject?: string;
  content: string;
  schedule_date?: string;
  filter_criteria?: Record<string, any>;
  metrics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
  created_at: string;
  updated_at: string;
}

export interface CampaignRecipient {
  id: string;
  campaign_id: string;
  customer_id: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  sent_at?: string;
  delivered_at?: string;
  error?: string;
  created_at: string;
}

export async function getCampaigns(
  businessId: string,
  options?: {
    type?: string;
    status?: string;
    search?: string;
  }
): Promise<Campaign[]> {
  let sql = 'SELECT * FROM marketing_campaigns WHERE business_id = $1';
  const params: any[] = [businessId];
  let paramCount = 1;

  if (options?.type) {
    sql += ` AND type = $${++paramCount}`;
    params.push(options.type);
  }

  if (options?.status) {
    sql += ` AND status = $${++paramCount}`;
    params.push(options.status);
  }

  if (options?.search) {
    sql += ` AND name ILIKE $${++paramCount}`;
    params.push(`%${options.search}%`);
  }

  sql += ' ORDER BY created_at DESC';

  return query<Campaign>(sql, params);
}

export async function createCampaign(data: Omit<Campaign, 'id' | 'created_at' | 'updated_at' | 'metrics'>): Promise<Campaign> {
  const result = await queryOne<Campaign>(
    `INSERT INTO marketing_campaigns (
      business_id, name, type, status,
      subject, content, schedule_date,
      filter_criteria
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      data.business_id,
      data.name,
      data.type,
      data.status,
      data.subject,
      data.content,
      data.schedule_date,
      data.filter_criteria
    ]
  );

  if (!result) {
    throw new Error('Failed to create campaign');
  }

  return result;
}

export async function updateCampaignStatus(
  id: string,
  status: Campaign['status']
): Promise<Campaign | null> {
  return queryOne<Campaign>(
    `UPDATE marketing_campaigns 
     SET status = $2, updated_at = NOW() 
     WHERE id = $1 
     RETURNING *`,
    [id, status]
  );
}

export async function getCampaignRecipients(
  campaignId: string,
  options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }
): Promise<CampaignRecipient[]> {
  let sql = 'SELECT * FROM campaign_recipients WHERE campaign_id = $1';
  const params: any[] = [campaignId];
  let paramCount = 1;

  if (options?.status) {
    sql += ` AND status = $${++paramCount}`;
    params.push(options.status);
  }

  sql += ' ORDER BY created_at DESC';

  if (options?.limit) {
    sql += ` LIMIT $${++paramCount}`;
    params.push(options.limit);
  }

  if (options?.offset) {
    sql += ` OFFSET $${++paramCount}`;
    params.push(options.offset);
  }

  return query<CampaignRecipient>(sql, params);
}