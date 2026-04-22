# FIX&BIN Supabase Connection Guide

## ✅ Database Successfully Connected!

Your FIX&BIN website is now fully integrated with Supabase for authentication and data storage.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                         │
│                                                              │
│  ┌────────────────┐         ┌──────────────────┐           │
│  │  AuthContext   │────────>│ Supabase Client  │           │
│  │  (Login/Auth)  │         │   (Singleton)    │           │
│  └────────────────┘         └──────────────────┘           │
│                                      │                       │
│  ┌────────────────┐                  │                       │
│  │  Database API  │                  │                       │
│  │  (db utility)  │                  │                       │
│  └────────────────┘                  │                       │
│          │                           │                       │
└──────────┼───────────────────────────┼───────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTIONS (Server)                │
│                                                              │
│  ┌──────────────────┐       ┌──────────────────┐           │
│  │  Auth Endpoints  │       │ Supabase Auth    │           │
│  │  /auth/signup    │──────>│  (PostgreSQL)    │           │
│  │  /auth/sync-user │       └──────────────────┘           │
│  └──────────────────┘                                        │
│                                                              │
│  ┌──────────────────────────────────────────────┐           │
│  │         Data Endpoints (REST API)            │           │
│  │  - Users    - Bookings   - Reviews           │           │
│  │  - Messages - Tracking                       │           │
│  └──────────────────────────────────────────────┘           │
│                      │                                       │
│                      ▼                                       │
│  ┌──────────────────────────────────────────────┐           │
│  │         KV Store (PostgreSQL Table)          │           │
│  │    Stores: profiles, bookings, reviews,      │           │
│  │    messages, tracking data                   │           │
│  └──────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

## What's Connected

### 1. ✅ Supabase Authentication
- **Email/Password Login**: Users are created in Supabase Auth
- **Google OAuth**: Full OAuth integration (requires Supabase dashboard setup)
- **Session Management**: Automatic session handling and refresh
- **Secure Storage**: User credentials stored securely in Supabase Auth

### 2. ✅ User Data Storage (KV Store)
- User profiles (name, role, specialty, bio, avatar)
- Worker ratings and review counts
- Additional metadata

### 3. ✅ Application Data (KV Store)
- **Bookings**: Service requests and job tracking
- **Reviews**: Customer ratings and feedback
- **Messages**: Real-time messaging between users
- **Tracking**: GPS location data for workers

## How Authentication Works

### Registration Flow
1. User submits registration form
2. Frontend calls `/auth/signup` endpoint
3. Server creates user in **Supabase Auth** with email confirmation
4. Server stores additional profile data in **KV store**
5. User is automatically signed in
6. Session token is stored in browser

### Login Flow
1. User submits login credentials
2. Frontend uses Supabase client to authenticate
3. Supabase Auth validates credentials
4. On success, server syncs user profile from KV store
5. User session is established

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. Google returns to your app with auth token
4. Supabase creates/updates user account
5. Server creates profile in KV store (if new user)
6. User is logged in

## Connection Details

### Frontend → Supabase Auth (Direct)
```typescript
import { supabase } from './utils/supabaseClient';

// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Google OAuth
await supabase.auth.signInWithOAuth({ provider: 'google' });

// Get session
await supabase.auth.getSession();

// Sign out
await supabase.auth.signOut();
```

### Frontend → Backend API
```typescript
import { db } from './utils/database';

// Create booking
await db.bookings.create({ customerId, workerId, ... });

// Get reviews
await db.reviews.getByWorker(workerId);

// Send message
await db.messages.send({ senderId, receiverId, content });
```

### Backend → Supabase Auth
```typescript
// Server-side (Edge Function)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

// Create user
await supabaseAdmin.auth.admin.createUser({
  email,
  password,
  email_confirm: true
});

// Verify token
await supabaseAdmin.auth.getUser(accessToken);
```

### Backend → KV Store
```typescript
// Server-side (Edge Function)
import * as kv from "./kv_store.tsx";

// Store data
await kv.set(`user:${userId}`, userData);

// Retrieve data
await kv.get(`user:${userId}`);

// Query by prefix
await kv.getByPrefix('booking:customer:');
```

## Environment Variables (Already Configured)

These are automatically available in your Supabase environment:

- ✅ `SUPABASE_URL` - Your Supabase project URL
- ✅ `SUPABASE_ANON_KEY` - Public anonymous key (safe for frontend)
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Admin key (server-side only)
- ✅ `SUPABASE_DB_URL` - Database connection string

## Testing the Connection

### 1. Test User Registration
```typescript
// In your app, try registering a new user
// This will:
// - Create user in Supabase Auth
// - Store profile in KV store
// - Return authenticated session
```

### 2. Test Login
```typescript
// Try logging in with the registered user
// This will:
// - Authenticate via Supabase Auth
// - Retrieve profile from KV store
// - Establish session
```

### 3. Test Data Operations
```typescript
// Try creating a booking or sending a message
// This will:
// - Store data in KV store
// - Return confirmation
```

### 4. Check Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. You should see registered users listed
4. Check **Table Editor** → `kv_store_42111711` for stored data

## Key Features

### ✅ Real-time Authentication
- Instant login/logout
- Persistent sessions
- Auto-refresh tokens

### ✅ Data Persistence
- All data stored in Supabase
- Survives browser refresh
- Accessible across devices

### ✅ Secure by Default
- Passwords hashed by Supabase
- Service role key only on server
- CORS properly configured

### ✅ Scalable Architecture
- Edge Functions for serverless backend
- PostgreSQL for reliable storage
- Ready for production deployment

## Google OAuth Setup (Optional)

To enable Google login, follow these steps:

1. Visit [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)
2. Create OAuth credentials in Google Cloud Console
3. Add credentials to Supabase dashboard
4. Google login will automatically work!

## Data Models in Supabase

### Supabase Auth Users Table
```sql
-- Managed by Supabase (not editable)
- id (UUID)
- email
- encrypted_password
- email_confirmed_at
- user_metadata (JSON) - stores { name, role }
- created_at
- updated_at
```

### KV Store Data Structure
```
Keys follow this pattern:
- user:{userId} → User profile data
- booking:{bookingId} → Booking details
- review:{reviewId} → Review data
- message:{messageId} → Message content
- tracking:{trackingId} → Location data

Index keys for querying:
- booking:customer:{customerId}:{bookingId}
- booking:worker:{workerId}:{bookingId}
- review:worker:{workerId}:{reviewId}
- conversation:{userId1}:{userId2}:{messageId}
```

## Troubleshooting

### Users not appearing in Supabase dashboard?
- Check server logs for auth errors
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Ensure email_confirm is set to true in signup

### Login failing?
- Verify credentials are correct
- Check Supabase Auth logs in dashboard
- Ensure user was created successfully

### Data not persisting?
- Check Edge Function logs
- Verify KV store endpoints are working
- Test with `/health` endpoint first

### Google OAuth not working?
- Complete setup at Supabase dashboard
- Add OAuth credentials
- Check redirect URLs are configured

## What's Next?

Your database is fully connected and operational! You can now:

1. **Register users** - They'll be stored in Supabase Auth
2. **Create bookings** - Saved to KV store
3. **Add reviews** - Automatically updates worker ratings
4. **Send messages** - Real-time communication
5. **Track workers** - GPS location updates

Everything is production-ready and backed by Supabase's robust infrastructure!

## Support

For more information:
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- Check `/DATABASE_GUIDE.md` for API usage examples
