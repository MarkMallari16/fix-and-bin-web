# FIX&BIN Database Guide

## Overview

The FIX&BIN website uses a Supabase-powered backend with a key-value store database architecture. All data is organized and accessible through a RESTful API.

## Important: Supabase Client Usage

**Always use the singleton Supabase client to avoid multiple instance warnings:**

```typescript
// ✅ CORRECT - Use the singleton client
import { supabase } from './utils/supabaseClient';

// ❌ INCORRECT - Don't create new clients
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(...); // This creates duplicate instances
```

The singleton client is already configured and ready to use for authentication and other Supabase features.

## Database Structure

### Collections

1. **Users**
   - Customer accounts
   - Worker profiles with specialties (plumbing, electrical, carpentry)
   - Ratings and review counts

2. **Bookings**
   - Service requests
   - Customer-worker assignments
   - Status tracking (pending, accepted, in-progress, completed, cancelled)

3. **Reviews**
   - Customer ratings for workers
   - Comments and feedback
   - Automatic worker rating calculations

4. **Messages**
   - Direct messaging between customers and workers
   - Conversation threading
   - Read/unread status

5. **Tracking**
   - Real-time worker location updates
   - Job progress tracking
   - GPS coordinates

## Using the Database

### Import the database utility

```typescript
import { db } from './utils/database';
```

### User Operations

#### Create a new user
```typescript
const result = await db.users.create({
  email: 'john@example.com',
  name: 'John Doe',
  role: 'customer', // or 'worker'
  password: 'securepassword',
  phone: '+1234567890',
  specialty: 'plumbing', // for workers only
  bio: 'Experienced plumber with 10 years experience',
  avatar: 'https://...'
});
```

#### Get user by ID
```typescript
const user = await db.users.getById('user_123');
```

#### Update user profile
```typescript
const updated = await db.users.update('user_123', {
  name: 'John Smith',
  phone: '+0987654321',
  bio: 'Updated bio'
});
```

#### Get all workers
```typescript
// All workers
const workers = await db.users.getWorkers();

// Workers by specialty
const plumbers = await db.users.getWorkers('plumbing');
```

### Booking Operations

#### Create a booking
```typescript
const booking = await db.bookings.create({
  customerId: 'user_123',
  workerId: 'user_456',
  serviceType: 'plumbing',
  description: 'Fix leaking sink',
  scheduledDate: '2026-04-20T10:00:00Z',
  address: '123 Main St, City',
  phone: '+1234567890'
});
```

#### Get bookings
```typescript
// By booking ID
const booking = await db.bookings.getById('booking_789');

// By customer
const customerBookings = await db.bookings.getByCustomer('user_123');

// By worker
const workerJobs = await db.bookings.getByWorker('user_456');
```

#### Update booking status
```typescript
const updated = await db.bookings.updateStatus('booking_789', 'in-progress');
// Status options: 'pending', 'accepted', 'in-progress', 'completed', 'cancelled'
```

### Review Operations

#### Create a review
```typescript
const review = await db.reviews.create({
  bookingId: 'booking_789',
  customerId: 'user_123',
  workerId: 'user_456',
  rating: 5,
  comment: 'Excellent service! Very professional.'
});
```

#### Get reviews
```typescript
// Get all reviews for a worker
const workerReviews = await db.reviews.getByWorker('user_456');

// Get all reviews by a customer
const customerReviews = await db.reviews.getByCustomer('user_123');
```

### Message Operations

#### Send a message
```typescript
const message = await db.messages.send({
  senderId: 'user_123',
  receiverId: 'user_456',
  content: 'Hello, when will you arrive?',
  bookingId: 'booking_789' // optional
});
```

#### Get messages
```typescript
// Get conversation between two users
const conversation = await db.messages.getConversation('user_123', 'user_456');

// Get all messages for a user
const userMessages = await db.messages.getByUser('user_123');
```

### Tracking Operations

#### Update worker location
```typescript
const tracking = await db.tracking.updateLocation({
  workerId: 'user_456',
  bookingId: 'booking_789',
  latitude: 40.7128,
  longitude: -74.0060,
  status: 'On the way'
});
```

#### Get tracking data
```typescript
const location = await db.tracking.getByBooking('booking_789');
```

## Example Usage in Components

### Creating a booking in a component

```typescript
import { db } from '../utils/database';
import { useAuth } from '../contexts/AuthContext';

function BookingForm() {
  const { user } = useAuth();
  
  const handleSubmit = async (formData) => {
    try {
      const result = await db.bookings.create({
        customerId: user.id,
        workerId: selectedWorker.id,
        serviceType: formData.serviceType,
        description: formData.description,
        scheduledDate: formData.date,
        address: formData.address,
        phone: formData.phone
      });
      
      if (result.success) {
        alert('Booking created successfully!');
      }
    } catch (error) {
      console.error('Booking error:', error);
    }
  };
  
  // ... rest of component
}
```

### Loading reviews for a worker

```typescript
import { useEffect, useState } from 'react';
import { db } from '../utils/database';

function WorkerProfile({ workerId }) {
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
  
  // ... render reviews
}
```

## Data Models

### User
```typescript
{
  id: string;
  email: string;
  name: string;
  role: 'customer' | 'worker';
  specialty?: string; // 'plumbing' | 'electrical' | 'carpentry'
  phone?: string;
  bio?: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
}
```

### Booking
```typescript
{
  id: string;
  customerId: string;
  workerId: string;
  serviceType: 'plumbing' | 'electrical' | 'carpentry';
  description: string;
  scheduledDate: string;
  address: string;
  phone: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}
```

### Review
```typescript
{
  id: string;
  bookingId: string;
  customerId: string;
  workerId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}
```

### Message
```typescript
{
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  bookingId?: string;
  read: boolean;
  createdAt: string;
}
```

### Tracking
```typescript
{
  id: string;
  workerId: string;
  bookingId: string;
  latitude: number;
  longitude: number;
  status: string;
  timestamp: string;
}
```

## Notes

- All timestamps are in ISO 8601 format
- The database automatically calculates worker ratings when reviews are added
- Passwords are stored as-is in this prototype (should be hashed in production)
- All API responses follow the format: `{ success: boolean, data/error: ... }`
- The backend is running on Supabase Edge Functions with full CORS support