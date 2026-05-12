# Database Setup Instructions

This application uses Supabase as the backend database. Follow these steps to set up the database:

## Prerequisites

1. A Supabase project (already configured in this app)
2. Supabase CLI (optional, for local development)

## Setup Steps

### 1. Run the Migration

The database schema is defined in `supabase/migrations/001_initial_schema.sql`. To apply it:

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and execute the SQL

**Option B: Using Supabase CLI**
```bash
supabase db push
```

### 2. Verify the Setup

After running the migration, you should have:

- **Tables**:
  - `service_providers` - Stores worker/provider profiles
  - `bookings` - Stores booking requests and their status

- **RLS Policies**: Row Level Security is enabled with these policies:
  - Anyone can view approved providers
  - Users can create and update their own provider profile
  - Customers can view and create their own bookings
  - Providers can view and update bookings assigned to them

### 3. Database Schema

#### service_providers Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - References auth.users
- `full_name`, `email`, `phone` - Basic contact info
- `primary_specialization`, `secondary_skills` - Skills
- `years_of_experience` - Experience level
- `bio` - Provider description
- `certifications`, `licenses` - JSONB arrays for credentials
- `services_offered` - JSONB array of services
- `portfolio` - JSONB array of work examples
- `service_areas` - Array of Metro Manila cities
- `location` - JSONB with city and region
- `price_range`, `starting_rate` - Pricing info
- `rating`, `total_reviews`, `completed_jobs` - Stats
- `status` - pending/approved/rejected/suspended
- `is_verified`, `is_top_rated` - Badges

#### bookings Table
- `id` (UUID) - Primary key
- `customer_id` (UUID) - References auth.users
- `provider_id` (UUID) - References service_providers
- `customer_name`, `customer_phone`, `customer_address` - Customer details
- `provider_name` - Provider name (denormalized for performance)
- `service_type`, `service_description` - Service details
- `scheduled_date`, `scheduled_time` - Appointment schedule
- `status` - pending/accepted/rejected/in-progress/completed/cancelled
- `price` - Service price
- `payment_method`, `payment_status` - Payment details

## Features

### For Workers (Service Providers)

1. **Automatic Profile Creation**: When a user registers as a worker, a service provider profile is automatically created
2. **Profile Editing**: Workers can edit their:
   - Basic information (name, phone, email, bio)
   - Specialization and skills
   - Services offered with pricing
   - Certifications and licenses
   - Portfolio with images
   - Service areas (Metro Manila only)

3. **Booking Management**:
   - View pending booking requests
   - Accept or reject bookings
   - When accepted, bookings move to "Active Jobs"
   - Mark completed jobs as done

### For Customers

1. **Browse Providers**: View all approved service providers
2. **Filter & Search**: Filter by specialization, location, rating
3. **Book Services**: 
   - Select a provider (locked once selected)
   - Choose service, date, time
   - Select Metro Manila area
   - Cash-only payment

4. **Track Bookings**: View booking status in real-time

## Data Persistence

- All data is stored in Supabase PostgreSQL database
- Changes are immediately visible across all users and devices
- Row Level Security ensures users can only access their own data
- Provider profiles persist across sessions and devices

## Metro Manila Restriction

The app is restricted to Metro Manila with these 17 cities/areas:
- Manila, Quezon City, Caloocan, Las Piñas, Makati
- Malabon, Mandaluyong, Marikina, Muntinlupa, Navotas
- Parañaque, Pasay, Pasig, Pateros, San Juan, Taguig, Valenzuela

## Troubleshooting

### Provider profile not showing
- Check if the user registered as "worker" role
- Verify the service_providers table has an entry for the user_id
- Check provider status is "approved"

### Bookings not saving
- Verify RLS policies are enabled
- Check user authentication status
- Ensure all required fields are filled

### Database connection issues
- Verify Supabase project credentials in `/utils/supabase/info.tsx`
- Check network connection
- Verify Supabase project is active
