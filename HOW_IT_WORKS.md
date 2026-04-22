# 🔧 How Your FIX&BIN Backend Works

A simple visual guide to understand your Supabase integration.

---

## 🎯 The Big Picture

```
┌─────────────────────────────────────────────────────┐
│                   YOUR BROWSER                      │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │        FIX&BIN Website (React)              │  │
│  │  - Browse services                          │  │
│  │  - View tutorials                           │  │
│  │  - See worker profiles                      │  │
│  │  - Login/Register                           │  │
│  └────────────────┬────────────────────────────┘  │
│                   │                                 │
└───────────────────┼─────────────────────────────────┘
                    │
                    │ HTTPS API Requests
                    ▼
┌─────────────────────────────────────────────────────┐
│              SUPABASE CLOUD                         │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │    Edge Function: make-server-42111711     │  │
│  │    (Your Backend Server)                    │  │
│  │  - Handles user registration               │  │
│  │  - Manages bookings                         │  │
│  │  - Processes reviews                        │  │
│  │  - Sends messages                           │  │
│  └────────┬───────────────────┬─────────────────┘  │
│           │                   │                     │
│           ▼                   ▼                     │
│  ┌────────────────┐  ┌────────────────────────┐   │
│  │  Supabase Auth │  │  PostgreSQL Database   │   │
│  │  - User login  │  │  - kv_store_42111711   │   │
│  │  - Sessions    │  │  - All your data       │   │
│  └────────────────┘  └────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 How a User Registration Works

### Step-by-Step Flow

```
1. USER CLICKS "REGISTER"
   ↓
   Opens registration form on website

2. USER FILLS IN DETAILS
   ↓
   - Email: john@example.com
   - Password: ••••••••
   - Name: John Doe
   - Role: Customer or Worker

3. CLICKS "SIGN UP"
   ↓
   Frontend sends API request

4. REQUEST GOES TO BACKEND
   ↓
   POST https://...supabase.co/functions/v1/make-server-42111711/auth/signup
   Body: { email, password, name, role }

5. BACKEND CREATES USER
   ↓
   - Creates account in Supabase Auth
   - Stores profile in database
   - Returns user data

6. FRONTEND RECEIVES RESPONSE
   ↓
   - Logs user in automatically
   - Shows success message
   - Updates UI

7. USER IS NOW LOGGED IN
   ✅ Can access all features
```

---

## 📊 Data Flow Examples

### Creating a Booking

```
Customer clicks "Book Service"
    ↓
Frontend: POST /bookings
    {
      customerId: "user_123",
      workerId: "user_456",
      serviceType: "plumbing",
      description: "Fix leaky faucet",
      scheduledDate: "2026-04-20",
      address: "123 Main St",
      phone: "555-0100"
    }
    ↓
Backend:
    - Creates booking ID
    - Saves to database
    - Creates customer index
    - Creates worker index
    - Returns booking data
    ↓
Customer sees: "Booking confirmed!"
Worker sees: New booking notification
```

### Sending a Message

```
Customer types message to worker
    ↓
Frontend: POST /messages
    {
      senderId: "customer_123",
      receiverId: "worker_456",
      content: "When will you arrive?",
      bookingId: "booking_789"
    }
    ↓
Backend:
    - Creates message ID
    - Saves message
    - Creates conversation index
    - Returns message data
    ↓
Both users see: Message in chat
```

### Submitting a Review

```
Customer rates service (5 stars)
    ↓
Frontend: POST /reviews
    {
      bookingId: "booking_789",
      customerId: "customer_123",
      workerId: "worker_456",
      rating: 5,
      comment: "Great service!"
    }
    ↓
Backend:
    - Saves review
    - Gets all worker reviews
    - Calculates new average
    - Updates worker rating
    - Returns review data
    ↓
Worker profile shows: Updated 5-star rating
```

---

## 🔐 Authentication Flow

### Email/Password Login

```
User enters credentials
    ↓
Frontend: Supabase.auth.signInWithPassword()
    ↓
Supabase Auth: Validates credentials
    ↓
Returns: Access token + User data
    ↓
Frontend: Calls /auth/sync-user
    ↓
Backend: Fetches user profile from database
    ↓
Frontend: Sets user in AuthContext
    ↓
UI Updates: Shows logged-in state
```

### Google OAuth Login

```
User clicks "Continue with Google"
    ↓
Frontend: Supabase.auth.signInWithOAuth({ provider: 'google' })
    ↓
Redirects to: Google login page
    ↓
User approves access
    ↓
Google redirects back to site
    ↓
Supabase creates account
    ↓
Frontend: Calls /auth/sync-user
    ↓
Backend: Creates or updates profile
    ↓
User is logged in
```

---

## 🗄️ Database Structure

### How Data is Stored

```
kv_store_42111711 Table
┌─────────────────────────────────┬──────────────────────┐
│ key                             │ value (JSONB)        │
├─────────────────────────────────┼──────────────────────┤
│ user:user_123                   │ { id, email, name,   │
│                                 │   role, rating... }  │
├─────────────────────────────────┼──────────────────────┤
│ booking:booking_789             │ { id, customerId,    │
│                                 │   workerId, status...│
├─────────────────────────────────┼──────────────────────┤
│ booking:customer:user_123:...   │ "booking_789"        │
├─────────────────────────────────┼──────────────────────┤
│ booking:worker:user_456:...     │ "booking_789"        │
├─────────────────────────────────┼──────────────────────┤
│ review:review_101               │ { id, rating,        │
│                                 │   comment... }       │
├─────────────────────────────────┼──────────────────────┤
│ message:message_202             │ { id, content,       │
│                                 │   senderId... }      │
└─────────────────────────────────┴──────────────────────┘
```

### Why Key-Value?

**Advantages:**
✅ Simple to understand  
✅ Flexible schema  
✅ Fast lookups  
✅ Easy to query  
✅ No migrations needed  

**How Queries Work:**
- **Get user:** `key = "user:user_123"`
- **Get booking:** `key = "booking:booking_789"`
- **Get customer bookings:** `key LIKE "booking:customer:user_123:%"`
- **Get worker reviews:** `key LIKE "review:worker:user_456:%"`

---

## 🔍 Status Detection

### How the App Knows Backend Status

```
Every time you open the app:
    ↓
1. Status component loads
    ↓
2. Sends request to health endpoint
    ↓
3. Waits 5 seconds for response
    ↓
┌───────────────────────────────────────┐
│ If response = {"status":"ok"}         │
│ → Shows: 🟢 "Backend Active"          │
│ → All features enabled                │
└───────────────────────────────────────┘
         OR
┌───────────────────────────────────────┐
│ If no response or error               │
│ → Shows: 🔵 "Setup Optional"          │
│ → Frontend-only mode                  │
└───────────────────────────────────────┘
```

You can manually check by clicking the database icon!

---

## 🚀 Deployment Process

### What Happens When You Deploy

```
1. CODE EXISTS IN FILES
   /supabase/functions/server/index.tsx
   /supabase/functions/server/kv_store.tsx
   /supabase/functions/server/deno.json
   /supabase/config.toml
    ↓
2. DEPLOYMENT TRIGGERS
   (Automatic or manual)
    ↓
3. SUPABASE EDGE FUNCTION CREATED
   - Uploads code to cloud
   - Sets up Deno runtime
   - Configures environment variables
   - Assigns URL endpoint
    ↓
4. FUNCTION BECOMES LIVE
   https://.../functions/v1/make-server-42111711/*
    ↓
5. HEALTH CHECK RESPONDS
   GET /health → {"status":"ok"}
    ↓
6. APP DETECTS BACKEND
   Status changes to: 🟢 Backend Active
    ↓
7. ALL FEATURES ENABLED
   ✅ Registration, Login, Bookings, etc.
```

---

## 💡 Understanding the URLs

### Base URL
```
https://ovgzpmcaheckbghwivpl.supabase.co
```
This is your Supabase project URL.

### Edge Function URL
```
https://ovgzpmcaheckbghwivpl.supabase.co/functions/v1/make-server-42111711
```
This is where your backend server lives.

### Health Check
```
https://ovgzpmcaheckbghwivpl.supabase.co/functions/v1/make-server-42111711/health
```
This endpoint tells you if backend is working.

### Example API Endpoint
```
https://ovgzpmcaheckbghwivpl.supabase.co/functions/v1/make-server-42111711/auth/signup
```
This is where registration requests go.

---

## 🎯 Why This Architecture?

### Three-Tier Design

```
┌─────────────┐
│  FRONTEND   │ ← What users see and interact with
│  (React)    │   Fast, responsive, beautiful UI
└─────────────┘
      │
      │ API Calls
      ▼
┌─────────────┐
│   SERVER    │ ← Business logic and security
│  (Hono API) │   Validates data, enforces rules
└─────────────┘
      │
      │ Database Queries
      ▼
┌─────────────┐
│  DATABASE   │ ← Stores all data
│ (PostgreSQL)│   Persistent, reliable, secure
└─────────────┘
```

**Benefits:**
- ✅ Secure (secrets stay on server)
- ✅ Scalable (can handle many users)
- ✅ Maintainable (easy to update)
- ✅ Fast (optimized for performance)
- ✅ Reliable (built on Supabase infrastructure)

---

## 🎊 Summary

Your FIX&BIN website uses a modern, scalable architecture:

1. **Frontend** (React) - Beautiful UI users interact with
2. **Backend** (Edge Function) - Secure API that handles logic
3. **Database** (PostgreSQL) - Stores all data reliably
4. **Auth** (Supabase) - Manages user accounts securely

Everything is connected and ready to go! 🚀

---

**For deployment instructions:** See `SUPABASE_DEPLOYMENT_GUIDE.md`  
**For quick start:** See `START_HERE.md`  
**For verification:** See `DEPLOYMENT_CHECKLIST.md`
