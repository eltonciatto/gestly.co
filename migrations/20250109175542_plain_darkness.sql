/*
  # Business Hours Schema

  1. New Tables
    - business_hours
    - special_days

  2. Features
    - Regular business hours
    - Break times
    - Special days (holidays, events)
*/

-- Business Hours
CREATE TABLE business_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_break_times CHECK (
    (break_start IS NULL AND break_end IS NULL) OR
    (break_start IS NOT NULL AND break_end IS NOT NULL AND break_start < break_end)
  ),
  CONSTRAINT valid_business_hours CHECK (start_time < end_time)
);

-- Special Days (holidays, events, etc)
CREATE TABLE special_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id),
  date DATE NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  is_closed BOOLEAN DEFAULT true,
  start_time TIME,
  end_time TIME,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_special_hours CHECK (
    is_closed = true OR
    (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
  )
);

-- Indexes
CREATE INDEX idx_business_hours_business_id ON business_hours(business_id);
CREATE INDEX idx_business_hours_day_of_week ON business_hours(day_of_week);
CREATE INDEX idx_special_days_business_id ON special_days(business_id);
CREATE INDEX idx_special_days_date ON special_days(date);

-- Apply update timestamps triggers
CREATE TRIGGER update_business_hours_updated_at
    BEFORE UPDATE ON business_hours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_special_days_updated_at
    BEFORE UPDATE ON special_days
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();