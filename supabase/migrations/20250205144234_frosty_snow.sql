/*
  # Add Performance Indexes

  1. Changes
    - Add indexes for frequently queried columns
    - Add composite indexes for common query patterns
    - Add partial indexes for filtered queries

  2. Tables Modified
    - appointments
    - customers
    - services
    - users
*/

-- Appointments indexes
CREATE INDEX idx_appointments_business_date ON appointments(business_id, start_time);
CREATE INDEX idx_appointments_customer_date ON appointments(customer_id, start_time);
CREATE INDEX idx_appointments_attendant_date ON appointments(attendant_id, start_time);
CREATE INDEX idx_appointments_status ON appointments(status) WHERE status != 'cancelled';

-- Customers indexes
CREATE INDEX idx_customers_business_name ON customers(business_id, name);
CREATE INDEX idx_customers_phone ON customers(phone);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_tags ON customers USING gin(tags);

-- Services indexes
CREATE INDEX idx_services_business_name ON services(business_id, name);
CREATE INDEX idx_services_price ON services(price);
CREATE INDEX idx_services_duration ON services(duration);

-- Users indexes
CREATE INDEX idx_users_business_role ON users(business_id, role);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;