-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic Info
  full_name TEXT NOT NULL,
  profile_photo TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Professional Info
  primary_specialization TEXT NOT NULL,
  secondary_skills TEXT[] DEFAULT '{}',
  years_of_experience INTEGER NOT NULL,
  bio TEXT,

  -- Credentials (JSONB for flexible schema)
  certifications JSONB DEFAULT '[]',
  licenses JSONB DEFAULT '[]',
  training_background TEXT[] DEFAULT '{}',

  -- Services & Portfolio
  services_offered JSONB DEFAULT '[]',
  portfolio JSONB DEFAULT '[]',

  -- Location & Availability
  service_areas TEXT[] DEFAULT '{}',
  location JSONB NOT NULL,

  -- Pricing
  price_range JSONB NOT NULL,
  starting_rate NUMERIC NOT NULL,

  -- Stats
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,

  -- Reviews
  reviews JSONB DEFAULT '[]',

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  is_verified BOOLEAN DEFAULT false,
  is_top_rated BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Customer Info
  customer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,

  -- Provider Info
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  provider_name TEXT NOT NULL,

  -- Service Details
  service_type TEXT NOT NULL,
  service_description TEXT,

  -- Schedule
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled')),

  -- Payment
  price NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'gcash', 'paymaya')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_status ON service_providers(status);
CREATE INDEX IF NOT EXISTS idx_service_providers_specialization ON service_providers(primary_specialization);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Service Providers RLS Policies
-- Anyone can view approved providers
CREATE POLICY "Anyone can view approved providers"
  ON service_providers FOR SELECT
  USING (status = 'approved' OR auth.uid() = user_id);

-- Users can create their own provider profile
CREATE POLICY "Users can create their own provider profile"
  ON service_providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own provider profile
CREATE POLICY "Users can update their own provider profile"
  ON service_providers FOR UPDATE
  USING (auth.uid() = user_id);

-- Bookings RLS Policies
-- Customers can view their own bookings
CREATE POLICY "Customers can view their own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id OR
         auth.uid() IN (SELECT user_id FROM service_providers WHERE id = bookings.provider_id));

-- Customers can create bookings
CREATE POLICY "Customers can create bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

-- Providers can update bookings assigned to them
CREATE POLICY "Providers can update their bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() IN (SELECT user_id FROM service_providers WHERE id = bookings.provider_id));

-- Customers can update their own bookings (for cancellation)
CREATE POLICY "Customers can update their own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = customer_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON service_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
