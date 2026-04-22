# 🗄️ FIX&BIN Database Visual Guide

## Understanding Your KV Store "Tables"

Your database uses a **Key-Value Store** pattern that functions like having multiple tables, but stored in a single flexible table.

---

## 📊 Database Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE POSTGRES DATABASE                    │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Table: kv_store_42111711                     │  │
│  │  ┌──────────────────┬────────────────────────────────┐   │  │
│  │  │  key (TEXT)      │  value (JSONB)                 │   │  │
│  │  ├──────────────────┼────────────────────────────────┤   │  │
│  │  │  user:abc123     │  {...user profile...}          │   │  │
│  │  │  booking:xyz789  │  {...booking details...}       │   │  │
│  │  │  review:def456   │  {...review data...}           │   │  │
│  │  │  message:ghi101  │  {...message content...}       │   │  │
│  │  │  tracking:jkl202 │  {...location data...}         │   │  │
│  │  └──────────────────┴────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ "Virtual Tables" Structure

### 1. Users "Table" 👤

```
Key Pattern: user:{userId}

┌─────────────────────────────────────────────────────────┐
│ USER RECORD                                             │
├─────────────────────────────────────────────────────────┤
│ {                                                       │
│   "id": "user_1234567890_abc123",                      │
│   "email": "john@example.com",                         │
│   "name": "John Doe",                                  │
│   "role": "worker",                                    │
│   "specialty": "plumbing",                             │
│   "phone": "+1234567890",                              │
│   "bio": "Professional plumber with 10 years exp",    │
│   "avatar": "https://example.com/avatar.jpg",         │
│   "createdAt": "2026-04-16T10:30:00Z",               │
│   "rating": 4.8,                                       │
│   "reviewCount": 24                                    │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Example Keys:
• user:user_1713264000_abc123
• user:user_1713264001_def456
• user:user_1713264002_ghi789
```

### 2. Bookings "Table" 📅

```
Key Patterns: 
• Main: booking:{bookingId}
• Index: booking:customer:{customerId}:{bookingId}
• Index: booking:worker:{workerId}:{bookingId}

┌─────────────────────────────────────────────────────────┐
│ BOOKING RECORD                                          │
├─────────────────────────────────────────────────────────┤
│ {                                                       │
│   "id": "booking_1713264100_xyz789",                   │
│   "customerId": "user_1713264000_abc123",              │
│   "workerId": "user_1713264001_def456",                │
│   "serviceType": "plumbing",                           │
│   "description": "Fix kitchen sink leak",              │
│   "scheduledDate": "2026-04-20T14:00:00Z",            │
│   "address": "123 Main St, San Francisco, CA",        │
│   "phone": "+1234567890",                              │
│   "status": "confirmed",                               │
│   "createdAt": "2026-04-16T10:35:00Z",                │
│   "updatedAt": "2026-04-16T11:00:00Z"                 │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Status Values:
• "pending"     → Waiting for worker confirmation
• "confirmed"   → Worker accepted the job
• "in_progress" → Worker is currently working
• "completed"   → Job finished
• "cancelled"   → Booking was cancelled

Example Keys:
• booking:booking_1713264100_xyz789
• booking:customer:user_abc123:booking_1713264100_xyz789
• booking:worker:user_def456:booking_1713264100_xyz789
```

### 3. Reviews "Table" ⭐

```
Key Patterns:
• Main: review:{reviewId}
• Index: review:worker:{workerId}:{reviewId}
• Index: review:customer:{customerId}:{reviewId}

┌─────────────────────────────────────────────────────────┐
│ REVIEW RECORD                                           │
├─────────────────────────────────────────────────────────┤
│ {                                                       │
│   "id": "review_1713264200_uvw456",                    │
│   "bookingId": "booking_1713264100_xyz789",            │
│   "customerId": "user_1713264000_abc123",              │
│   "workerId": "user_1713264001_def456",                │
│   "rating": 5,                                         │
│   "comment": "Excellent work! Very professional.",     │
│   "createdAt": "2026-04-16T16:30:00Z"                 │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Rating Scale: 1-5 stars

Example Keys:
• review:review_1713264200_uvw456
• review:worker:user_def456:review_1713264200_uvw456
• review:customer:user_abc123:review_1713264200_uvw456
```

### 4. Messages "Table" 💬

```
Key Patterns:
• Main: message:{messageId}
• Index: message:user:{userId}:{messageId}
• Index: conversation:{userId1}:{userId2}:{messageId}

┌─────────────────────────────────────────────────────────┐
│ MESSAGE RECORD                                          │
├─────────────────────────────────────────────────────────┤
│ {                                                       │
│   "id": "message_1713264300_rst123",                   │
│   "senderId": "user_1713264000_abc123",                │
│   "receiverId": "user_1713264001_def456",              │
│   "content": "I'll be there at 2 PM tomorrow",         │
│   "bookingId": "booking_1713264100_xyz789",            │
│   "createdAt": "2026-04-16T12:00:00Z",                │
│   "read": false                                        │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Example Keys:
• message:message_1713264300_rst123
• message:user:user_abc123:message_1713264300_rst123
• message:user:user_def456:message_1713264300_rst123
• conversation:user_abc123:user_def456:message_1713264300_rst123
```

### 5. Tracking "Table" 📍

```
Key Patterns:
• Main: tracking:{trackingId}
• Latest: tracking:booking:{bookingId}:latest

┌─────────────────────────────────────────────────────────┐
│ TRACKING RECORD                                         │
├─────────────────────────────────────────────────────────┤
│ {                                                       │
│   "id": "tracking_1713264400_mno789",                  │
│   "workerId": "user_1713264001_def456",                │
│   "bookingId": "booking_1713264100_xyz789",            │
│   "latitude": 37.7749,                                 │
│   "longitude": -122.4194,                              │
│   "status": "on_the_way",                              │
│   "timestamp": "2026-04-20T13:45:00Z"                 │
│ }                                                       │
└─────────────────────────────────────────────────────────┘

Status Values:
• "on_the_way" → Worker traveling to location
• "arrived"    → Worker has arrived
• "working"    → Job in progress

Example Keys:
• tracking:tracking_1713264400_mno789
• tracking:booking:booking_xyz789:latest
```

---

## 🔍 How Queries Work

### Example 1: Get User Profile
```typescript
// Key: user:user_1713264001_def456
const user = await kv.get('user:user_1713264001_def456');

// Returns:
{
  "id": "user_1713264001_def456",
  "name": "John Doe",
  "role": "worker",
  "specialty": "plumbing",
  ...
}
```

### Example 2: Get All Worker Bookings
```typescript
// Query all keys starting with: booking:worker:user_def456:
const bookingIds = await kv.getByPrefix('booking:worker:user_def456:');

// Returns array of booking IDs:
['booking_xyz789', 'booking_abc123', 'booking_def456']

// Then fetch full booking details:
for (const id of bookingIds) {
  const booking = await kv.get(`booking:${id}`);
}
```

### Example 3: Get Conversation Between Two Users
```typescript
// Sort user IDs and create conversation key
const conversationKey = ['user_abc123', 'user_def456'].sort().join(':');

// Query: conversation:user_abc123:user_def456:
const messageIds = await kv.getByPrefix(`conversation:${conversationKey}:`);

// Returns all messages in this conversation
```

---

## 🎯 Why This Design Works

### ✅ Advantages

1. **Flexibility**
   - Store any JSON structure
   - No rigid schema constraints
   - Easy to add new fields

2. **Performance**
   - Fast key-based lookups
   - Efficient prefix queries
   - No complex JOINs needed

3. **Simplicity**
   - No migration files
   - No schema changes
   - Works immediately

4. **Scalability**
   - Add data types easily
   - No table alterations needed
   - Indexing via key patterns

### 📌 Best Practices

1. **Use Descriptive Prefixes**
   ```
   ✅ Good: user:user_123
   ❌ Bad:  u:123
   ```

2. **Create Indexes for Fast Lookups**
   ```
   ✅ Store: booking:customer:abc:xyz
   ✅ Store: booking:worker:def:xyz
   → Fast queries by customer OR worker
   ```

3. **Keep Latest State**
   ```
   ✅ tracking:booking:xyz:latest
   → Quick access to current location
   ```

---

## 📊 Data Flow Diagram

```
┌──────────┐
│ Frontend │ ──────┐
└──────────┘       │
                   ▼
              ┌─────────┐
              │  Fetch  │ https://...supabase.co/functions/v1/...
              └─────────┘
                   │
                   ▼
          ┌────────────────┐
          │ Backend Server │ (Hono.js)
          │  index.ts      │
          └────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │   kv_store.ts  │ (Utility Functions)
          └────────────────┘
                   │
                   ▼
    ┌──────────────────────────┐
    │  Supabase Postgres DB    │
    │  kv_store_42111711 table │
    │  { key: ..., value: ... }│
    └──────────────────────────┘
```

---

## 🎓 Quick Reference

### Common Operations

| Operation | Function | Example |
|-----------|----------|---------|
| Store data | `kv.set()` | `await kv.set('user:123', userData)` |
| Get data | `kv.get()` | `await kv.get('user:123')` |
| Delete data | `kv.del()` | `await kv.del('user:123')` |
| Query by prefix | `kv.getByPrefix()` | `await kv.getByPrefix('user:')` |
| Store multiple | `kv.mset()` | `await kv.mset(keys, values)` |
| Get multiple | `kv.mget()` | `await kv.mget(['user:1', 'user:2'])` |

### Key Naming Convention

```
{dataType}:{primaryId}
{dataType}:{indexType}:{indexId}:{primaryId}
{dataType}:{primaryId}:{modifier}
```

Examples:
- `user:user_123`
- `booking:customer:user_456:booking_789`
- `tracking:booking:booking_789:latest`

---

## ✨ Summary

Your database is **NOT a traditional table structure**, but it **functions exactly like one** using:

- ✅ Key prefixes as "table names"
- ✅ JSON values as "table rows"
- ✅ Secondary keys as "indexes"
- ✅ Prefix queries as "table scans"

**Result**: A flexible, fast, and fully operational database system! 🚀

---

**View your data**: https://supabase.com/dashboard/project/jxgaywrypkkknpynjanr/database/tables
