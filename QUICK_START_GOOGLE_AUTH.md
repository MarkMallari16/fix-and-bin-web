# Quick Start: Google OAuth Setup

Follow these 3 simple steps to enable Google authentication for your FIX&BIN handyman service website.

---

## Step 1: Google Cloud Console (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add these **Authorized redirect URIs**:

   ```
   http://localhost:5173
   https://YOUR_SUPABASE_PROJECT_ID.supabase.co/auth/v1/callback
   ```

   > Replace `YOUR_SUPABASE_PROJECT_ID` with your actual project ID from Supabase URL

7. Click **Create** and save your:
   - **Client ID** (looks like: `123456-abc.apps.googleusercontent.com`)
   - **Client Secret** (looks like: `GOCSPX-xxxxx`)

---

## Step 2: Supabase Dashboard (3 minutes)

1. Open your [Supabase Dashboard](https://app.supabase.com/)
2. Go to **Authentication > Providers**
3. Find **Google** and click to expand
4. Toggle it **ON**
5. Paste your **Client ID** from Step 1
6. Paste your **Client Secret** from Step 1
7. Click **Save**

8. Go to **Authentication > URL Configuration**
9. Set **Site URL** to: `http://localhost:5173`
10. Add to **Redirect URLs**:
    ```
    http://localhost:5173
    http://localhost:5173/**
    ```
11. Click **Save**

---

## Step 3: Test It! (1 minute)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. Click **Login** button

4. Click **Continue with Google**

5. Select your Google account

6. Grant permissions

7. ✅ You should be redirected back and logged in!

---

## ✅ Success Checklist

After completing the steps above, verify:

- [ ] Google login button appears on login page
- [ ] Clicking it redirects to Google sign-in
- [ ] After selecting account, you're redirected back to the app
- [ ] You see your name in the header (logged in)
- [ ] Refreshing the page keeps you logged in
- [ ] Clicking logout signs you out

---

## 🎯 Common Mistakes

### 1. Wrong Redirect URI Format
❌ **Wrong:** `https://supabase.co/auth/v1/callback`
✅ **Right:** `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`

### 2. Missing Localhost in Google Console
You need BOTH URLs in Google Cloud Console:
- `http://localhost:5173` (your app)
- `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback` (Supabase)

### 3. Not Saving in Supabase
Always click **Save** after adding credentials in Supabase dashboard.

### 4. Using Wrong Project ID
Your project ID is in your Supabase dashboard URL:
`https://app.supabase.com/project/YOUR_PROJECT_ID`

---

## 🚀 Production Setup

When deploying to production, add these URIs:

**Google Cloud Console:**
```
https://your-production-domain.com
https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
```

**Supabase Dashboard:**
- Site URL: `https://your-production-domain.com`
- Redirect URLs: Add your production domain

---

## 🆘 Need Help?

### Still not working?

1. **Check browser console** for error messages
2. **Clear cache and cookies** then try again
3. **Try incognito/private browsing** to rule out extensions
4. **Wait 2 minutes** after saving in Supabase (changes need to propagate)

### Error Messages:

**"Redirect URI mismatch"**
→ Double-check URLs in Google Cloud Console match exactly

**"OAuth not enabled"**
→ Make sure Google provider is toggled ON in Supabase

**Infinite loading**
→ Clear browser cache and verify Supabase Site URL is correct

---

## 📚 Detailed Documentation

For comprehensive documentation and troubleshooting:
- **Full Setup Guide:** See `GOOGLE_OAUTH_SETUP.md`
- **All Fixes Made:** See `GOOGLE_AUTH_FIXES.md`

---

## 💡 Pro Tips

1. **Test in incognito** to avoid cached auth states
2. **Use different Google accounts** to test multi-user scenarios
3. **Check Supabase logs** (Auth > Logs) if login fails
4. **Keep Client Secret secure** - never commit to git

---

**Setup Time:** ~10 minutes total
**Difficulty:** Easy
**Last Updated:** May 12, 2026
