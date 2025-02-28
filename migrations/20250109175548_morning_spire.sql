/*
  # Commissions Schema

  1. New Tables
    - commission_settings
    - commission_records
    - commission_goals

  2. Features
    - Commission rules by service/attendant
    - Commission tracking
    - Goals and bonuses
*/

-- Commission Settings
CREATE TABLE commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  service_id UUID REFERENCES services(id),
  attendant_id UUID REFERENCES users(id),
  commission_percentage DECIMAL(5,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commission Records
CREATE TABLE commission_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  appointment_id UUID NOT NULL REFERENCES appointments(id),
  attendant_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'paid', 'cancelled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Commission Goals
CREATE TABLE commission_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  attendant_id UUID REFERENCES users(id),
  goal_type VARCHAR(20) NOT NULL CHECK (goal_type IN ('revenue', 'appointments', 'customers')),
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  bonus_percentage DECIMAL(5,2),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_date_range CHECK (start_date <= end_date)
);

-- Indexes
CREATE INDEX idx_commission_settings_business_id ON commission_settings(business_id);
CREATE INDEX idx_commission_settings_service_id ON commission_settings(service_id);
CREATE INDEX idx_commission_settings_attendant_id ON commission_settings(attendant_id);
CREATE INDEX idx_commission_records_business_id ON commission_records(business_id);
CREATE INDEX idx_commission_records_attendant_id ON commission_records(attendant_id);
CREATE INDEX idx_commission_records_appointment_id ON commission_records(appointment_id);
CREATE INDEX idx_commission_goals_business_id ON commission_goals(business_id);
CREATE INDEX idx_commission_goals_attendant_id ON commission_goals(attendant_id);

-- Apply update timestamps triggers
CREATE TRIGGER update_commission_settings_updated_at
    BEFORE UPDATE ON commission_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_records_updated_at
    BEFORE UPDATE ON commission_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commission_goals_updated_at
    BEFORE UPDATE ON commission_goals
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();