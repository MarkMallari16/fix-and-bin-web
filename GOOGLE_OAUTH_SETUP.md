# Google OAuth Setup Guide for FIX&BIN

This guide will help you configure Google OAuth authentication for your handyman service website.

---

## Prerequisites

1. **Supabase Project** - You need an active Supabase project
2. **Google Cloud Account** - Access to Google Cloud Console
3. **Domain/URL** - Your application's URL (localhost for dev, production URL for live)

---

## Step 1: Configure Google Cloud Console

### 1.1 Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project or create a new one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Select **Web application** as the application type

### 1.2 Configure Authorized Redirect URIs

Add the following redirect URIs (replace `YOUR_PROJECT_ID` with your actual Supabase project ID):

**For Development:**
```
http://localhost:5173
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**For Production:**
```
https://your-production-domain.com
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**Important Notes:**
- You can find your Supabase project ID in your Supabase dashboard URL
- The callback URL format is always: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
- Add both your app URL and the Supabase callback URL

### 1.3 Save Your Credentials

After creating the OAuth client, you'll receive:
- **Client ID** (e.g., `123456789-abc.apps.googleusercontent.com`)
- **Client Secret** (e.g., `GOCSPX-xxxxxxxxxxxxx`)

**Save these securely** - you'll need them for Supabase configuration.

---

## Step 2: Configure Supabase

### 2.1 Enable Google Provider

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication > Providers**
4. Find **Google** in the provider list
5. Enable the toggle switch

### 2.2 Add Google Credentials

In the Google provider settings:
1. Paste your **Client ID** from Google Cloud Console
2. Paste your **Client Secret** from Google Cloud Console
3. Click **Save**

### 2.3 Configure Redirect URLs

1. Navigate to **Authentication > URL Configuration**
2. Add your site URL to **Site URL** field:
   - Development: `http://localhost:5173`
   - Production: `https://your-production-domain.com`

3. Add redirect URLs to **Redirect URLs** field:
   ```
   http://localhost:5173
   http://localhost:5173/**
   https://your-production-domain.com
   https://your-production-domain.com/**
   ```

4. Click **Save**

---

## Step 3: Update Application Configuration

### 3.1 Verify Supabase Client Configuration

Your `src/app/utils/supabaseClient.ts` should be configured as:

```typescript
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info.tsx';

export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);
```

### 3.2 Authentication Context

The `AuthContext.tsx` should handle OAuth redirects properly:

```typescript
const loginWithGoogle = async (): Promise<void> => {
  const redirectURL = window.location.origin;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectURL,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    }
  });

  if (error) throw error;
};
```

---

## Step 4: Testing Google Login

### 4.1 Development Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`
3. Click the **Login** button
4. Click **Continue with Google**
5. Select your Google account
6. Grant permissions
7. You should be redirected back to your app and logged in

### 4.2 Verify Session Persistence

1. After logging in, refresh the page
2. You should remain logged in (session persists)
3. Check browser DevTools > Application > Local Storage
4. You should see Supabase auth tokens stored

### 4.3 Common Issues & Solutions

#### Issue: "Redirect URI mismatch"
**Solution:**
- Verify redirect URIs in Google Cloud Console match exactly
- Ensure you've added both your app URL and Supabase callback URL
- No trailing slashes in URLs
- Protocol must match (http vs https)

#### Issue: "OAuth not enabled"
**Solution:**
- Enable Google provider in Supabase dashboard
- Verify Client ID and Secret are correctly entered
- Save changes and wait 1-2 minutes for propagation

#### Issue: Infinite loading after Google sign-in
**Solution:**
- Check that `detectSessionInUrl: true` is set in Supabase client
- Verify redirect URL matches your application's origin
- Clear browser cache and cookies
- Check browser console for errors

#### Issue: Session not persisting after refresh
**Solution:**
- Ensure `persistSession: true` in Supabase client config
- Check that `autoRefreshToken: true` is enabled
- Verify localStorage is not being cleared
- Check browser privacy settings (cookies must be enabled)

#### Issue: "Access denied" error
**Solution:**
- User denied permissions - they need to grant access
- Check Google Cloud Console for any restrictions
- Verify OAuth consent screen is properly configured

---

## Step 5: Production Deployment

### 5.1 Update Google Cloud Console

1. Add production redirect URIs:
   ```
   https://your-production-domain.com
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```

2. Update authorized JavaScript origins:
   ```
   https://your-production-domain.com
   ```

### 5.2 Update Supabase Configuration

1. Update **Site URL** to your production domain
2. Add production redirect URLs
3. Verify all settings are saved

### 5.3 Environment Variables

Ensure your production environment has:
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

---

## Step 6: Security Best Practices

### 6.1 OAuth Consent Screen

1. Configure OAuth consent screen in Google Cloud Console
2. Add app logo, privacy policy, and terms of service
3. Verify your domain ownership
4. Submit for verification if needed (for production)

### 6.2 Scopes

Only request necessary scopes:
- `email` - User's email address
- `profile` - Basic profile info (name, picture)
- `openid` - OpenID Connect

### 6.3 Rate Limiting

- Implement rate limiting for authentication attempts
- Monitor for suspicious OAuth activity
- Use Supabase's built-in security features

---

## Troubleshooting Checklist

- [ ] Google OAuth Client ID created in Google Cloud Console
- [ ] Client Secret saved securely
- [ ] Redirect URIs added to Google Cloud Console (app URL + Supabase callback)
- [ ] Google provider enabled in Supabase dashboard
- [ ] Client ID and Secret entered in Supabase
- [ ] Site URL configured in Supabase
- [ ] Redirect URLs configured in Supabase
- [ ] Supabase client configured with proper auth options
- [ ] Application running on correct URL (matches redirect URI)
- [ ] Browser allows cookies and localStorage
- [ ] No browser extensions blocking OAuth flow

---

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Google OAuth Guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## Support

If you encounter issues:

1. **Check Browser Console** - Look for JavaScript errors
2. **Check Network Tab** - Verify API requests are succeeding
3. **Check Supabase Logs** - View authentication logs in Supabase dashboard
4. **Clear Cache** - Clear browser cache, cookies, and localStorage
5. **Test Incognito** - Try in incognito/private browsing mode

---

## Quick Reference

### Required URLs Format

**App URL (Development):**
```
http://localhost:5173
```

**App URL (Production):**
```
https://your-production-domain.com
```

**Supabase Callback URL:**
```
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

### Where to Add URLs

**Google Cloud Console:**
- Authorized redirect URIs: [App URL, Supabase Callback URL]
- Authorized JavaScript origins: [App URL]

**Supabase Dashboard:**
- Site URL: [App URL]
- Redirect URLs: [App URL, App URL/**, variations with/without trailing slash]

---

**Last Updated:** May 12, 2026
**Version:** 1.0
