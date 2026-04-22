# 🚀 FIX&BIN Quick Start Guide

## Your Database is Connected! ✅

Everything is set up and ready to use. Here's what you need to know:

## 1️⃣ How Authentication Works Now

### Register a New User
```typescript
// In Register component - already working!
// Just fill out the form and click "Create Account"
// User will be created in Supabase Auth automatically
```

### Login
```typescript
// In Login component - already working!
// Enter email/password and click "Log In"
// Session persists across browser refreshes
```

### Google Login
```typescript
// Click "Continue with Google" button
// Note: Requires Google OAuth setup in Supabase dashboard
// See: https://supabase.com/docs/guides/auth/social-login/auth-google
```

## 2️⃣ Using the Database in Your Components

### Import the database utility
```typescript
import { db } from '../utils/database';
import { useAuth } from '../contexts/AuthContext';
```

### Example: Create a Booking
```typescript
function BookingForm() {
  const { user } = useAuth();

  const handleBooking = async () => {
    const result = await db.bookings.create({
      customerId: user.id,
      workerId: 'worker_123',
      serviceType: 'plumbing',
      description: 'Fix leaking sink',
      scheduledDate: '2026-04-20T10:00:00Z',
      address: '123 Main St',
      phone: '+1234567890'
    });

    if (result.success) {
      alert('Booking created!');
    }
  };

  return <button onClick={handleBooking}>Book Now</button>;
}
```

### Example: Show Worker Reviews
```typescript
function WorkerReviews({ workerId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function loadReviews() {
      const result = await db.reviews.getByWorker(workerId);
      if (result.success) {
        setReviews(result.reviews);
      }
    }
    loadReviews();
  }, [workerId]);

  return (
    <div>
      {reviews.map(review => (
        <div key={review.id}>
          <p>Rating: {review.rating}/5</p>
          <p>{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example: Send a Message
```typescript
function ChatBox({ receiverId }) {
  const { user } = useAuth();
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    await db.messages.send({
      senderId: user.id,
      receiverId: receiverId,
      content: message
    });
    setMessage('');
  };

  return (
    <>
      <input 
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}
```

## 3️⃣ What's Available

### Database Collections
- ✅ **Users** - Customer and worker profiles
- ✅ **Bookings** - Service requests and jobs
- ✅ **Reviews** - Ratings and feedback
- ✅ **Messages** - Direct messaging
- ✅ **Tracking** - GPS location data

### API Methods
```typescript
// Users
db.users.getById(userId)
db.users.update(userId, { name, phone, bio })
db.users.getWorkers('plumbing') // or 'electrical', 'carpentry'

// Bookings
db.bookings.create({ ... })
db.bookings.getByCustomer(customerId)
db.bookings.getByWorker(workerId)
db.bookings.updateStatus(bookingId, 'in-progress')

// Reviews
db.reviews.create({ rating, comment, ... })
db.reviews.getByWorker(workerId)

// Messages
db.messages.send({ senderId, receiverId, content })
db.messages.getConversation(userId1, userId2)

// Tracking
db.tracking.updateLocation({ latitude, longitude, ... })
db.tracking.getByBooking(bookingId)
```

## 4️⃣ Testing Your Connection

### Option A: Quick Test in Browser Console
```javascript
// Test the backend is running
fetch('https://ovgzpmcaheckbghwivpl.supabase.co/functions/v1/make-server-42111711/health')
  .then(r => r.json())
  .then(data => console.log(data)); // Should show { status: "ok" }
```

### Option B: Add Test Component (Temporary)
```typescript
// In App.tsx
import { DatabaseTest } from './components/DatabaseTest';

// Add to JSX:
<DatabaseTest />

// Click "Run Tests" to verify all connections
```

### Option C: Check Supabase Dashboard
1. Visit [app.supabase.com](https://app.supabase.com)
2. Open your project
3. Go to **Authentication** → **Users** to see registered users
4. Go to **Table Editor** → `kv_store_42111711` to see data

## 5️⃣ Common Tasks

### Get Current Logged-In User
```typescript
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }
  
  return <p>Welcome, {user.name}!</p>;
}
```

### Access Supabase Directly (for advanced features)
```typescript
import { supabase } from '../utils/supabaseClient';

// Upload a file
await supabase.storage.from('avatars').upload('photo.jpg', file);

// Get current session
const { data: { session } } = await supabase.auth.getSession();
```

## 6️⃣ Important Notes

### ✅ What's Working
- Email/password authentication
- User registration and login
- All database operations (CRUD)
- Session persistence
- Data stored in Supabase

### ⚠️ Needs Setup
- **Google OAuth**: Requires configuration in Supabase dashboard
  - Follow: https://supabase.com/docs/guides/auth/social-login/auth-google
  - Add OAuth credentials
  - Configure redirect URLs

### 🔒 Security
- Passwords are hashed by Supabase Auth
- Service role key is only on the server
- Public anon key is safe for frontend
- All data persists to Supabase database

## 7️⃣ File Reference

- `/src/app/utils/database.ts` - Main database API
- `/src/app/utils/supabaseClient.ts` - Supabase singleton client
- `/src/app/contexts/AuthContext.tsx` - Authentication logic
- `/supabase/functions/server/index.tsx` - Backend server

## 8️⃣ Help & Documentation

- **Full API Guide**: `/DATABASE_GUIDE.md`
- **Connection Details**: `/SUPABASE_CONNECTION_GUIDE.md`
- **Complete Summary**: `/SUPABASE_INTEGRATION_COMPLETE.md`
- **Supabase Docs**: https://supabase.com/docs

## 🎉 You're All Set!

Your FIX&BIN website is now fully connected to Supabase. Start building your features!

---

**Pro Tip**: Open the browser DevTools → Console to see detailed logs of all database operations for debugging.
