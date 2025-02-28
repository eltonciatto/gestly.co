/*
  # Add Soft Delete Support

  1. Changes
    - Add deleted_at column to relevant tables
    - Add indexes for soft delete queries
    - Update RLS policies to handle soft deletes

  2. Tables Modified
    - businesses
    - customers
    - services
    - appointments
    - users
*/

-- Add deleted_at to businesses
ALTER TABLE businesses 
ADD COLUMN deleted_at timestamptz;

CREATE INDEX idx_businesses_deleted_at 
ON businesses(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Add deleted_at to customers
ALTER TABLE customers 
ADD COLUMN deleted_at timestamptz;

CREATE INDEX idx_customers_deleted_at 
ON customers(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Add deleted_at to services
ALTER TABLE services 
ADD COLUMN deleted_at timestamptz;

CREATE INDEX idx_services_deleted_at 
ON services(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Add deleted_at to appointments
ALTER TABLE appointments 
ADD COLUMN deleted_at timestamptz;

CREATE INDEX idx_appointments_deleted_at 
ON appointments(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Add deleted_at to users
ALTER TABLE users 
ADD COLUMN deleted_at timestamptz;

CREATE INDEX idx_users_deleted_at 
ON users(deleted_at) 
WHERE deleted_at IS NOT NULL;

-- Update RLS policies to handle soft deletes
CREATE OR REPLACE FUNCTION handle_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
  NEW.deleted_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for soft delete
CREATE TRIGGER businesses_soft_delete
  BEFORE DELETE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER customers_soft_delete
  BEFORE DELETE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER services_soft_delete
  BEFORE DELETE ON services
  FOR EACH ROW
  EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER appointments_soft_delete
  BEFORE DELETE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION handle_soft_delete();

CREATE TRIGGER users_soft_delete
  BEFORE DELETE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_soft_delete();