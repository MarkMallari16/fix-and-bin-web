# Supabase Client Multiple Instance Fix

## Problem
The application was showing warnings about multiple GoTrueClient instances:
```
Multiple GoTrueClient instances detected in the same browser context. 
It is not an error, but this should be avoided as it may produce 
undefined behavior when used concurrently under the same storage key.
```

## Root Cause
The Supabase client was being created inside the `AuthProvider` component:

```typescript
// ❌ BEFORE - Creating client on every render
export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );
  // ...
}
```

This caused a new Supabase client instance to be created every time the component rendered, leading to multiple instances in the browser.

## Solution
Created a singleton Supabase client that is instantiated only once and reused throughout the application.

### Changes Made

1. **Created `/src/app/utils/supabaseClient.ts`**
   ```typescript
   import { createClient } from '@supabase/supabase-js';
   import { projectId, publicAnonKey } from '/utils/supabase/info';

   // Create a singleton Supabase client to avoid multiple instances
   export const supabase = createClient(
     `https://${projectId}.supabase.co`,
     publicAnonKey
   );
   ```

2. **Updated `/src/app/contexts/AuthContext.tsx`**
   - Changed from `import { createClient } from '@supabase/supabase-js'`
   - To `import { supabase } from '../utils/supabaseClient'`
   - Removed the `createClient()` call inside the component

3. **Updated Documentation**
   - Added warning in `DATABASE_GUIDE.md` about using the singleton client
   - Created examples showing correct vs incorrect usage

## Best Practices Going Forward

### ✅ DO: Use the singleton client
```typescript
import { supabase } from './utils/supabaseClient';

// Use it for auth operations
await supabase.auth.signInWithPassword({ email, password });

// Use it for storage operations
await supabase.storage.from('bucket').upload('file.jpg', file);
```

### ❌ DON'T: Create new clients
```typescript
// Never do this in components or utilities
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(url, key); // Creates duplicate instances!
```

## Files Modified
- ✅ Created: `/src/app/utils/supabaseClient.ts`
- ✅ Updated: `/src/app/contexts/AuthContext.tsx`
- ✅ Updated: `/DATABASE_GUIDE.md`
- ✅ Updated: `/src/app/utils/database.ts` (added comment)

## Result
- No more multiple GoTrueClient instance warnings
- Single, reusable Supabase client across the entire application
- Better performance and memory usage
- Prevents potential authentication conflicts

## Testing
To verify the fix:
1. Open the browser console
2. Navigate through the app (login, register, etc.)
3. Confirm no "Multiple GoTrueClient instances detected" warnings appear
4. Authentication should work seamlessly with Google OAuth and regular login
