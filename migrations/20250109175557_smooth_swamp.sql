/*
  # Notifications Schema

  1. New Tables
    - notification_templates
    - notification_logs
    - notification_preferences

  2. Features
    - Email, SMS, WhatsApp templates
    - Notification history
    - Per-user preferences
*/

-- Notification Templates
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  trigger VARCHAR(50) NOT NULL CHECK (
    trigger IN (
      'appointment_confirmation',
      'appointment_reminder',
      'appointment_cancelled',
      'birthday',
      'custom'
    )
  ),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  variables TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification Logs
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  appointment_id UUID REFERENCES appointments(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'failed', 'delivered', 'read')),
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Notification Preferences
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  email_enabled BOOLEAN DEFAULT true,
  sms_enabled BOOLEAN DEFAULT true,
  whatsapp_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (business_id, customer_id)
);

-- Indexes
CREATE INDEX idx_notification_templates_business_id ON notification_templates(business_id);
CREATE INDEX idx_notification_templates_type_trigger ON notification_templates(type, trigger);
CREATE INDEX idx_notification_logs_business_id ON notification_logs(business_id);
CREATE INDEX idx_notification_logs_customer_id ON notification_logs(customer_id);
CREATE INDEX idx_notification_preferences_business_id ON notification_preferences(business_id);
CREATE INDEX idx_notification_preferences_customer_id ON notification_preferences(customer_id);

-- Apply update timestamps triggers
CREATE TRIGGER update_notification_templates_updated_at
    BEFORE UPDATE ON notification_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
    BEFORE UPDATE ON notification_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();