/*
  # Loyalty Program Schema

  1. New Tables
    - loyalty_programs
    - loyalty_points
    - loyalty_rewards
    - loyalty_redemptions

  2. Features
    - Points tracking
    - Rewards management
    - Points expiration
    - Redemption history
*/

-- Loyalty Programs
CREATE TABLE loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  name VARCHAR(255) NOT NULL,
  points_per_currency DECIMAL(10,2) DEFAULT 1.00,
  points_expiration_days INTEGER,
  rules TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty Points
CREATE TABLE loyalty_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  appointment_id UUID REFERENCES appointments(id),
  points INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('earned', 'redeemed', 'expired', 'bonus')),
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty Rewards
CREATE TABLE loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  quantity_available INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Loyalty Redemptions
CREATE TABLE loyalty_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  reward_id UUID NOT NULL REFERENCES loyalty_rewards(id),
  points_used INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'approved', 'used', 'cancelled')),
  used_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_loyalty_programs_business_id ON loyalty_programs(business_id);
CREATE INDEX idx_loyalty_points_business_id ON loyalty_points(business_id);
CREATE INDEX idx_loyalty_points_customer_id ON loyalty_points(customer_id);
CREATE INDEX idx_loyalty_rewards_business_id ON loyalty_rewards(business_id);
CREATE INDEX idx_loyalty_redemptions_business_id ON loyalty_redemptions(business_id);
CREATE INDEX idx_loyalty_redemptions_customer_id ON loyalty_redemptions(customer_id);

-- Apply update timestamps triggers
CREATE TRIGGER update_loyalty_programs_updated_at
    BEFORE UPDATE ON loyalty_programs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_rewards_updated_at
    BEFORE UPDATE ON loyalty_rewards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_loyalty_redemptions_updated_at
    BEFORE UPDATE ON loyalty_redemptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();