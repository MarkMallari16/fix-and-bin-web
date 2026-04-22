# 🏠 FIX&BIN - Professional Handyman Services

A modern, full-featured handyman service platform built with React, Supabase, and Tailwind CSS.

---

## 🎯 Quick Start

**👉 START HERE:** Read `START_HERE.md` for immediate next steps!

Your Supabase backend has been **fixed and configured**. Follow the quick start guide to verify deployment and test features.

---

## 📚 Documentation Index

### 🚀 Getting Started
| Document | Purpose | When to Read |
|----------|---------|--------------|
| **START_HERE.md** | Quick start guide | **Read this first!** |
| **HOW_IT_WORKS.md** | Architecture explanation | Want to understand the system |
| **SUPABASE_FIXED.md** | What was fixed | Need to know what changed |

### 📖 Deployment Guides
| Document | Purpose | When to Read |
|----------|---------|--------------|
| **SUPABASE_DEPLOYMENT_GUIDE.md** | Complete deployment instructions | Ready to deploy backend |
| **DEPLOYMENT_CHECKLIST.md** | Step-by-step verification | Verifying deployment |
| **BACKEND_READY.md** | Technical readiness confirmation | Want technical details |

### 📊 Reference
| Document | Purpose | When to Read |
|----------|---------|--------------|
| **SUPABASE_STATUS_SUMMARY.md** | Complete status overview | Need comprehensive summary |
| **CONNECTION_STATUS.md** | Connection information | Troubleshooting connectivity |
| **QUICK_REFERENCE.md** | Quick lookup guide | Need fast answers |

---

## ✨ Features

### 🏡 Core Services
- **Plumbing** - Professional plumbing services
- **Electrical/Technician** - Expert electrical work
- **Carpentry** - Quality carpentry solutions

### 📚 DIY Tutorials
- 9 comprehensive tutorials across all service categories
- Step-by-step guides for common household issues
- Professional tips and safety guidelines

### 👥 User System
- Email/password authentication
- Google OAuth login
- Customer and worker roles
- Profile management

### 🛠️ Booking System
- Service request creation
- Real-time status tracking
- Booking history
- Worker assignment

### ⭐ Reviews & Ratings
- 5-star rating system
- Written reviews
- Automatic average calculation
- E-commerce style review display

### 💬 Messaging
- Real-time customer-worker chat
- Conversation history
- Booking-linked messages
- Message notifications

### 📍 Location Tracking
- Real-time worker location
- Interactive map display
- Service progress tracking
- Delivery-style tracking UI

---

## 🏗️ Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 6.3.5** - Build tool
- **Tailwind CSS 4.1** - Styling
- **Lucide React** - Icons
- **Leaflet** - Maps
- **Sonner** - Notifications

### Backend
- **Supabase** - Backend platform
- **Deno** - Runtime environment
- **Hono** - Web framework
- **PostgreSQL** - Database
- **Supabase Auth** - Authentication

### Additional Libraries
- Motion (Framer Motion) - Animations
- React Hook Form - Forms
- Material UI - Additional components
- Recharts - Charts (if needed)

---

## 🗂️ Project Structure

```
fix-and-bin/
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Main app component
│   │   ├── components/
│   │   │   ├── Header.tsx             # Navigation header
│   │   │   ├── Hero.tsx               # Hero section
│   │   │   ├── Services.tsx           # Services showcase
│   │   │   ├── Tutorials.tsx          # DIY tutorials
│   │   │   ├── Login.tsx              # Login modal
│   │   │   ├── Register.tsx           # Registration modal
│   │   │   ├── WorkerTracker.tsx      # Job management
│   │   │   ├── CustomerTracker.tsx    # Service tracking
│   │   │   ├── Ratings.tsx            # Review system
│   │   │   ├── MessagingSystem.tsx    # Chat system
│   │   │   ├── EditProfile.tsx        # Profile editor
│   │   │   ├── Workers.tsx            # Worker directory
│   │   │   ├── WorkerCard.tsx         # Worker profiles
│   │   │   ├── SupabaseStatus.tsx     # Backend status
│   │   │   └── ...more components
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx        # Authentication state
│   │   └── utils/
│   │       ├── supabaseClient.ts      # Supabase client
│   │       └── database.ts            # Database helpers
│   └── styles/
│       ├── index.css                  # Global styles
│       ├── theme.css                  # Theme tokens
│       └── tailwind.css               # Tailwind config
├── supabase/
│   ├── functions/
│   │   └── server/
│   │       ├── index.tsx              # Main server
│   │       ├── kv_store.tsx           # Database layer
│   │       └── deno.json              # Deno config
│   └── config.toml                    # Supabase config
├── utils/
│   └── supabase/
│       └── info.tsx                   # Project credentials
└── [documentation files]              # All .md guides
```

---

## 🎨 Design System

### Colors
- **Primary:** Blue (#2563eb)
- **Success:** Green (#10b981)
- **Warning:** Yellow (#f59e0b)
- **Error:** Red (#ef4444)

### Typography
- **Brand:** "FIX&BIN" (always uppercase)
- **Hero:** "Professional Handyman Services at Your Doorstep" (uppercase)
- **Fonts:** System fonts via Tailwind

### Components
- Modern card-based layouts
- Responsive grid system
- Smooth animations
- Mobile-first design

---

## 🔐 Security

### Environment Variables
- ✅ SUPABASE_URL
- ✅ SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ SUPABASE_DB_URL

**Note:** Service role key is only used in backend, never exposed to frontend.

### Authentication
- Row-level security (RLS) via Supabase Auth
- JWT token validation
- Secure password hashing
- OAuth provider support

---

## 📊 Backend API

### Endpoints Overview

**Authentication:**
- POST `/auth/signup` - Register new user
- POST `/auth/sync-user` - Sync OAuth users

**Users:**
- GET `/users/:userId` - Get user profile
- PUT `/users/:userId` - Update profile
- GET `/users/workers` - List workers

**Bookings:**
- POST `/bookings` - Create booking
- GET `/bookings/:bookingId` - Get booking
- GET `/bookings/customer/:customerId` - Customer bookings
- GET `/bookings/worker/:workerId` - Worker bookings
- PUT `/bookings/:bookingId/status` - Update status

**Reviews:**
- POST `/reviews` - Submit review
- GET `/reviews/worker/:workerId` - Worker reviews
- GET `/reviews/customer/:customerId` - Customer reviews

**Messages:**
- POST `/messages` - Send message
- GET `/messages/conversation/:userId1/:userId2` - Get chat
- GET `/messages/user/:userId` - All messages

**Tracking:**
- POST `/tracking` - Update location
- GET `/tracking/:bookingId` - Get tracking data

**Health:**
- GET `/health` - Backend status check

---

## 🧪 Testing Your Deployment

### 1. Check Health Endpoint
```
https://ovgzpmcaheckbghwivpl.supabase.co/functions/v1/make-server-42111711/health
```
Expected: `{"status":"ok"}`

### 2. Test in Browser
1. Open your FIX&BIN website
2. Click database icon (top-right)
3. Verify status shows "🟢 Backend Active"

### 3. Test Features
1. Register a new account
2. Log in and out
3. View worker profiles
4. Create a test booking
5. Send a message
6. Submit a review

---

## 🐛 Troubleshooting

### Backend Not Active?

**Check:**
1. Health endpoint response
2. Supabase dashboard for deployment status
3. Function logs for errors
4. Environment variables are set

**Fix:**
- See `SUPABASE_DEPLOYMENT_GUIDE.md` for detailed steps
- Use `DEPLOYMENT_CHECKLIST.md` to verify each step

### Features Not Working?

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. Supabase function logs
4. User is logged in (if required)

**Fix:**
- Review error messages
- Check endpoint URLs
- Verify data format
- Test with simple requests first

---

## 📞 Quick Links

### Supabase Dashboard
- **Project:** https://supabase.com/dashboard/project/ovgzpmcaheckbghwivpl
- **Functions:** https://supabase.com/dashboard/project/ovgzpmcaheckbghwivpl/functions
- **Database:** https://supabase.com/dashboard/project/ovgzpmcaheckbghwivpl/database/tables
- **Auth:** https://supabase.com/dashboard/project/ovgzpmcaheckbghwivpl/auth/users

### Documentation
- **Supabase Docs:** https://supabase.com/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **Edge Functions:** https://supabase.com/docs/guides/functions
- **Google OAuth Setup:** https://supabase.com/docs/guides/auth/social-login/auth-google

---

## 🎯 Current Status

**✅ READY FOR DEPLOYMENT**

- All code is complete
- Configuration files in place
- Database table exists
- Documentation complete
- Tests passed

**Next Steps:**
1. Deploy edge function
2. Verify health endpoint
3. Test features
4. Launch to users!

---

## 📝 Notes

### About the Company Name
"FIX&BIN" should always appear in **ALL CAPS** throughout the site.

### About the Hero Heading
"Professional Handyman Services at Your Doorstep" should be displayed in **UPPERCASE**.

### About Backend Setup
The backend is **optional** - the app works great without it for browsing content. Deploy when you need user accounts, bookings, and data persistence.

### About Google OAuth
If you want to enable Google login, follow the setup guide at the Supabase docs link above and configure in your project dashboard.

---

## 🤝 Support

### Need Help?

1. **Check Documentation** - See the guides above
2. **Review Logs** - Check Supabase function logs
3. **Test Components** - Use the deployment checklist
4. **Verify Status** - Click the database icon in app

### Common Questions

**Q: Why does it say "Setup Optional"?**  
A: Backend isn't deployed yet. See `SUPABASE_DEPLOYMENT_GUIDE.md`

**Q: Can I use the app without backend?**  
A: Yes! Browsing services, tutorials, and content works without backend.

**Q: How do I enable all features?**  
A: Deploy the backend following `START_HERE.md`

**Q: Is it secure?**  
A: Yes! All sensitive keys are server-side, passwords are hashed, and auth uses JWTs.

---

## 🎊 Credits

Built with:
- React & Vite
- Supabase
- Tailwind CSS
- Lucide Icons
- Leaflet Maps
- And many other amazing open-source libraries

---

## 📜 License

This is a FIX&BIN project. All rights reserved.

---

**Ready to launch your handyman service platform? Start with `START_HERE.md`!** 🚀
