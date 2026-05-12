# Database Not Set Up - Important Notice

## The Error You're Seeing

If you see these errors:
```
TypeError: Failed to fetch
AuthRetryableFetchError: Failed to fetch
```

**This means the database tables have not been created yet!**

## Why This Happens

The app is trying to:
1. Fetch service providers from the database → **Table doesn't exist**
2. Create provider profiles when workers register → **Table doesn't exist**
3. Save bookings → **Table doesn't exist**

## Solution: Run the Database Migration

You MUST create the database tables before the app will work properly.

### Step-by-Step Instructions:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the Migration SQL**
   - Open the file: `supabase/migrations/001_initial_schema.sql`
   - Copy ALL the contents (Ctrl+A, Ctrl+C)

4. **Paste and Execute**
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

5. **Verify Tables Created**
   - Go to "Table Editor" in the left sidebar
   - You should see two new tables:
     - `service_providers`
     - `bookings`

## What Happens After Migration

Once the tables are created:

✅ Workers can register and have profiles auto-created
✅ Customers can browse real service providers
✅ Bookings are saved to the database
✅ Workers can manage bookings in their dashboard
✅ Profile edits are saved permanently
✅ Data persists across devices and sessions

## Temporary Fallback (Before Migration)

The app currently has fallback behavior:
- **Mock providers** are shown if database is not set up
- **Registration still works** (profiles will be created once database is ready)
- **Login/logout works** normally

But for full functionality, you **MUST** run the migration!

## Quick Migration SQL

If you can't access the file, here's a quick version:

```sql
-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  primary_specialization TEXT NOT NULL,
  secondary_skills TEXT[] DEFAULT '{}',
  years_of_experience INTEGER DEFAULT 0,
  bio TEXT,
  certifications JSONB DEFAULT '[]',
  licenses JSONB DEFAULT '[]',
  training_background TEXT[] DEFAULT '{}',
  services_offered JSONB DEFAULT '[]',
  portfolio JSONB DEFAULT '[]',
  service_areas TEXT[] DEFAULT '{}',
  location JSONB,
  price_range JSONB,
  starting_rate NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  reviews JSONB DEFAULT '[]',
  status TEXT DEFAULT 'approved',
  is_verified BOOLEAN DEFAULT false,
  is_top_rated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  provider_id UUID NOT NULL,
  provider_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  service_description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  price NUMERIC DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view approved providers" ON service_providers FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can create their profile" ON service_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their profile" ON service_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can create bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Providers can update bookings" ON bookings FOR UPDATE USING (true);
```

**Note:** This is simplified. Use the full migration for production!

## Still Having Issues?

Check:
1. Supabase project is active and running
2. Network connection is working
3. Browser console for specific error messages
4. Supabase credentials in `/utils/supabase/info.tsx` are correct

## Need Help?

See `README_DATABASE_SETUP.md` for detailed setup instructions!
