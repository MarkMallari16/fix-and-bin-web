import { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface DatabaseSetupProps {
  onComplete: () => void;
}

export function DatabaseSetup({ onComplete }: DatabaseSetupProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'checking' | 'not-setup' | 'setup' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState('');

  const checkDatabaseSetup = async () => {
    setIsChecking(true);
    try {
      // Try to query the service_providers table
      const { error } = await supabase
        .from('service_providers')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === 'PGRST205') {
          setStatus('not-setup');
        } else {
          setStatus('error');
          setErrorMessage(error.message);
        }
      } else {
        setStatus('setup');
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Unknown error');
    } finally {
      setIsChecking(false);
    }
  };

  const createTables = async () => {
    setIsCreating(true);
    setErrorMessage('');

    const migrationSQL = `
-- Create service_providers table
CREATE TABLE IF NOT EXISTS service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  profile_photo TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  primary_specialization TEXT NOT NULL,
  secondary_skills TEXT[] DEFAULT '{}',
  years_of_experience INTEGER NOT NULL,
  bio TEXT,
  certifications JSONB DEFAULT '[]',
  licenses JSONB DEFAULT '[]',
  training_background TEXT[] DEFAULT '{}',
  services_offered JSONB DEFAULT '[]',
  portfolio JSONB DEFAULT '[]',
  service_areas TEXT[] DEFAULT '{}',
  location JSONB NOT NULL,
  price_range JSONB NOT NULL,
  starting_rate NUMERIC NOT NULL,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  reviews JSONB DEFAULT '[]',
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  is_verified BOOLEAN DEFAULT false,
  is_top_rated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  provider_id UUID NOT NULL,
  provider_name TEXT NOT NULL,
  service_type TEXT NOT NULL,
  service_description TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled')),
  price NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'card', 'gcash', 'paymaya')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_service_providers_user_id ON service_providers(user_id);
CREATE INDEX IF NOT EXISTS idx_service_providers_status ON service_providers(status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON bookings(provider_id);

-- Enable RLS
ALTER TABLE service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view approved providers" ON service_providers;
DROP POLICY IF EXISTS "Users can create their own provider profile" ON service_providers;
DROP POLICY IF EXISTS "Users can update their own provider profile" ON service_providers;
DROP POLICY IF EXISTS "Customers can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can create bookings" ON bookings;
DROP POLICY IF EXISTS "Providers can update their bookings" ON bookings;
DROP POLICY IF EXISTS "Customers can update their own bookings" ON bookings;

-- Create policies
CREATE POLICY "Anyone can view approved providers" ON service_providers FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);
CREATE POLICY "Users can create their own provider profile" ON service_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own provider profile" ON service_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Customers can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = customer_id OR auth.uid() IN (SELECT user_id FROM service_providers WHERE id::text = provider_id));
CREATE POLICY "Customers can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Providers can update their bookings" ON bookings FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM service_providers WHERE id::text = provider_id));
CREATE POLICY "Customers can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = customer_id);
    `;

    try {
      const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

      if (error) {
        // RPC might not exist, try direct approach
        console.log('RPC method not available, please run migration manually');
        setStatus('error');
        setErrorMessage('Automatic setup not available. Please run the migration manually in Supabase Dashboard.');
      } else {
        setStatus('setup');
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage('Automatic setup not available. Please run the migration manually in Supabase Dashboard.');
    } finally {
      setIsCreating(false);
    }
  };

  useState(() => {
    checkDatabaseSetup();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Database Setup Required
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up the database tables for your handyman service app
          </p>
        </div>

        {/* Checking Status */}
        {status === 'checking' && (
          <div className="text-center py-8">
            <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Checking database setup...</p>
          </div>
        )}

        {/* Not Setup */}
        {status === 'not-setup' && (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-1">
                    Database tables not found
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    The required database tables haven't been created yet. You have two options:
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Option 1: Manual Setup (Recommended)
                </h3>
                <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
                  <li>Open your Supabase Dashboard</li>
                  <li>Go to SQL Editor</li>
                  <li>Copy the migration from <code className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">supabase/migrations/001_initial_schema.sql</code></li>
                  <li>Paste and execute the SQL</li>
                </ol>
                <a
                  href="https://supabase.com/dashboard/project/_/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Open Supabase SQL Editor
                </a>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Option 2: Continue Without Database
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  The app will use localStorage for temporary data. Perfect for testing, but data won't persist across devices.
                </p>
                <button
                  onClick={onComplete}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Continue Without Database
                </button>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={checkDatabaseSetup}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                I've run the migration, check again
              </button>
            </div>
          </div>
        )}

        {/* Setup Complete */}
        {status === 'setup' && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Database Ready!
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              All tables are set up and ready to use.
            </p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                    Setup Error
                  </h3>
                  <p className="text-sm text-red-800 dark:text-red-300">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={checkDatabaseSetup}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={onComplete}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Continue Anyway
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
