import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client for auth operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-42111711/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTH ENDPOINTS ==========

// Sign up endpoint - Creates user in Supabase Auth
app.post("/make-server-42111711/auth/signup", async (c) => {
  try {
    const { email, password, name, role, specialty, phone, bio } = await c.req.json();
    
    // Create user in Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Supabase Auth signup error:', error);
      return c.json({ success: false, error: error.message }, 400);
    }

    // Store additional user data in KV store
    const userProfile = {
      id: data.user.id,
      email: data.user.email,
      name,
      role,
      specialty: specialty || null,
      phone: phone || null,
      bio: bio || null,
      avatar: null,
      createdAt: new Date().toISOString(),
      rating: 0,
      reviewCount: 0
    };

    await kv.set(`user:${data.user.id}`, userProfile);
    
    return c.json({ 
      success: true, 
      user: userProfile,
      authUser: data.user 
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Sync user from Supabase Auth to KV store (for OAuth logins)
app.post("/make-server-42111711/auth/sync-user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ success: false, error: 'No access token provided' }, 401);
    }

    // Verify the user with the access token
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ success: false, error: 'Invalid token' }, 401);
    }

    // Check if user profile exists in KV store
    let userProfile = await kv.get(`user:${user.id}`);
    
    if (!userProfile) {
      // Create new profile for OAuth users
      userProfile = {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        role: user.user_metadata?.role || 'customer',
        specialty: null,
        phone: null,
        bio: null,
        avatar: user.user_metadata?.avatar_url || null,
        createdAt: new Date().toISOString(),
        rating: 0,
        reviewCount: 0
      };
      
      await kv.set(`user:${user.id}`, userProfile);
    }

    return c.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('Error syncing user:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== USER ENDPOINTS ==========

// Get user by ID
app.get("/make-server-42111711/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const user = await kv.get(`user:${userId}`);
    
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    // Remove password from response
    const { password, ...userResponse } = user;
    return c.json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Error getting user:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update user
app.put("/make-server-42111711/users/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    const user = await kv.get(`user:${userId}`);
    if (!user) {
      return c.json({ success: false, error: 'User not found' }, 404);
    }
    
    const updatedUser = { ...user, ...updates };
    await kv.set(`user:${userId}`, updatedUser);
    
    // Remove password from response
    const { password, ...userResponse } = updatedUser;
    return c.json({ success: true, user: userResponse });
  } catch (error) {
    console.error('Error updating user:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all workers
app.get("/make-server-42111711/users/workers", async (c) => {
  try {
    const specialty = c.req.query('specialty');
    const allUsers = await kv.getByPrefix('user:user_');
    
    let workers = allUsers.filter((user: any) => user.role === 'worker');
    
    if (specialty) {
      workers = workers.filter((worker: any) => worker.specialty === specialty);
    }
    
    // Remove passwords from response
    workers = workers.map(({ password, ...worker }: any) => worker);
    
    return c.json({ success: true, workers });
  } catch (error) {
    console.error('Error getting workers:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== BOOKING ENDPOINTS ==========

// Create booking
app.post("/make-server-42111711/bookings", async (c) => {
  try {
    const bookingData = await c.req.json();
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const booking = {
      id: bookingId,
      customerId: bookingData.customerId,
      workerId: bookingData.workerId,
      serviceType: bookingData.serviceType,
      description: bookingData.description,
      scheduledDate: bookingData.scheduledDate,
      address: bookingData.address,
      phone: bookingData.phone,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await kv.set(`booking:${bookingId}`, booking);
    await kv.set(`booking:customer:${bookingData.customerId}:${bookingId}`, bookingId);
    await kv.set(`booking:worker:${bookingData.workerId}:${bookingId}`, bookingId);
    
    return c.json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get booking by ID
app.get("/make-server-42111711/bookings/:bookingId", async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const booking = await kv.get(`booking:${bookingId}`);
    
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    
    return c.json({ success: true, booking });
  } catch (error) {
    console.error('Error getting booking:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get bookings by customer
app.get("/make-server-42111711/bookings/customer/:customerId", async (c) => {
  try {
    const customerId = c.req.param('customerId');
    const bookingIds = await kv.getByPrefix(`booking:customer:${customerId}:`);
    
    const bookings = [];
    for (const item of bookingIds) {
      const booking = await kv.get(`booking:${item}`);
      if (booking) bookings.push(booking);
    }
    
    return c.json({ success: true, bookings });
  } catch (error) {
    console.error('Error getting customer bookings:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get bookings by worker
app.get("/make-server-42111711/bookings/worker/:workerId", async (c) => {
  try {
    const workerId = c.req.param('workerId');
    const bookingIds = await kv.getByPrefix(`booking:worker:${workerId}:`);
    
    const bookings = [];
    for (const item of bookingIds) {
      const booking = await kv.get(`booking:${item}`);
      if (booking) bookings.push(booking);
    }
    
    return c.json({ success: true, bookings });
  } catch (error) {
    console.error('Error getting worker bookings:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update booking status
app.put("/make-server-42111711/bookings/:bookingId/status", async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const { status } = await c.req.json();
    
    const booking = await kv.get(`booking:${bookingId}`);
    if (!booking) {
      return c.json({ success: false, error: 'Booking not found' }, 404);
    }
    
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    
    await kv.set(`booking:${bookingId}`, booking);
    
    return c.json({ success: true, booking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== REVIEW ENDPOINTS ==========

// Create review
app.post("/make-server-42111711/reviews", async (c) => {
  try {
    const reviewData = await c.req.json();
    const reviewId = `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const review = {
      id: reviewId,
      bookingId: reviewData.bookingId,
      customerId: reviewData.customerId,
      workerId: reviewData.workerId,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };

    await kv.set(`review:${reviewId}`, review);
    await kv.set(`review:worker:${reviewData.workerId}:${reviewId}`, reviewId);
    await kv.set(`review:customer:${reviewData.customerId}:${reviewId}`, reviewId);
    
    // Update worker's average rating
    const workerReviews = await kv.getByPrefix(`review:worker:${reviewData.workerId}:`);
    const reviews = [];
    for (const rid of workerReviews) {
      const r = await kv.get(`review:${rid}`);
      if (r) reviews.push(r);
    }
    
    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;
    
    const worker = await kv.get(`user:${reviewData.workerId}`);
    if (worker) {
      worker.rating = avgRating;
      worker.reviewCount = reviews.length;
      await kv.set(`user:${reviewData.workerId}`, worker);
    }
    
    return c.json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get reviews by worker
app.get("/make-server-42111711/reviews/worker/:workerId", async (c) => {
  try {
    const workerId = c.req.param('workerId');
    const reviewIds = await kv.getByPrefix(`review:worker:${workerId}:`);
    
    const reviews = [];
    for (const rid of reviewIds) {
      const review = await kv.get(`review:${rid}`);
      if (review) reviews.push(review);
    }
    
    return c.json({ success: true, reviews });
  } catch (error) {
    console.error('Error getting worker reviews:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get reviews by customer
app.get("/make-server-42111711/reviews/customer/:customerId", async (c) => {
  try {
    const customerId = c.req.param('customerId');
    const reviewIds = await kv.getByPrefix(`review:customer:${customerId}:`);
    
    const reviews = [];
    for (const rid of reviewIds) {
      const review = await kv.get(`review:${rid}`);
      if (review) reviews.push(review);
    }
    
    return c.json({ success: true, reviews });
  } catch (error) {
    console.error('Error getting customer reviews:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== MESSAGE ENDPOINTS ==========

// Send message
app.post("/make-server-42111711/messages", async (c) => {
  try {
    const messageData = await c.req.json();
    const messageId = `message_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const message = {
      id: messageId,
      senderId: messageData.senderId,
      receiverId: messageData.receiverId,
      content: messageData.content,
      bookingId: messageData.bookingId || null,
      createdAt: new Date().toISOString(),
      read: false
    };

    await kv.set(`message:${messageId}`, message);
    await kv.set(`message:user:${messageData.senderId}:${messageId}`, messageId);
    await kv.set(`message:user:${messageData.receiverId}:${messageId}`, messageId);
    
    // Create conversation index
    const conversationKey = [messageData.senderId, messageData.receiverId].sort().join(':');
    await kv.set(`conversation:${conversationKey}:${messageId}`, messageId);
    
    return c.json({ success: true, message });
  } catch (error) {
    console.error('Error sending message:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get conversation between two users
app.get("/make-server-42111711/messages/conversation/:userId1/:userId2", async (c) => {
  try {
    const userId1 = c.req.param('userId1');
    const userId2 = c.req.param('userId2');
    
    const conversationKey = [userId1, userId2].sort().join(':');
    const messageIds = await kv.getByPrefix(`conversation:${conversationKey}:`);
    
    const messages = [];
    for (const mid of messageIds) {
      const message = await kv.get(`message:${mid}`);
      if (message) messages.push(message);
    }
    
    // Sort by timestamp
    messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    return c.json({ success: true, messages });
  } catch (error) {
    console.error('Error getting conversation:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all messages for a user
app.get("/make-server-42111711/messages/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const messageIds = await kv.getByPrefix(`message:user:${userId}:`);
    
    const messages = [];
    for (const mid of messageIds) {
      const message = await kv.get(`message:${mid}`);
      if (message) messages.push(message);
    }
    
    return c.json({ success: true, messages });
  } catch (error) {
    console.error('Error getting user messages:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// ========== TRACKING ENDPOINTS ==========

// Update tracking location
app.post("/make-server-42111711/tracking", async (c) => {
  try {
    const trackingData = await c.req.json();
    const trackingId = `tracking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tracking = {
      id: trackingId,
      workerId: trackingData.workerId,
      bookingId: trackingData.bookingId,
      latitude: trackingData.latitude,
      longitude: trackingData.longitude,
      status: trackingData.status,
      timestamp: new Date().toISOString()
    };

    await kv.set(`tracking:${trackingId}`, tracking);
    await kv.set(`tracking:booking:${trackingData.bookingId}:latest`, tracking);
    
    return c.json({ success: true, tracking });
  } catch (error) {
    console.error('Error updating tracking:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get tracking by booking
app.get("/make-server-42111711/tracking/:bookingId", async (c) => {
  try {
    const bookingId = c.req.param('bookingId');
    const tracking = await kv.get(`tracking:booking:${bookingId}:latest`);
    
    if (!tracking) {
      return c.json({ success: false, error: 'No tracking data found' }, 404);
    }
    
    return c.json({ success: true, tracking });
  } catch (error) {
    console.error('Error getting tracking:', error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);