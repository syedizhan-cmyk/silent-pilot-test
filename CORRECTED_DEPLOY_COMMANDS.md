# ✅ Corrected Deployment Commands

## The Issue

Supabase doesn't allow setting `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as secrets because they're automatically provided to edge functions!

We only need to set the Facebook credentials.

---

## 🎯 Correct Commands

### Step 1: Set Facebook Secrets Only

Copy and paste these **two commands only**:

```bash
supabase secrets set FACEBOOK_APP_ID=1482734112820631
```

```bash
supabase secrets set FACEBOOK_APP_SECRET=8a4f5161c32389e5eed68dba9efdfae2
```

---

### Step 2: Deploy All Functions

```bash
supabase functions deploy oauth-exchange
```

```bash
supabase functions deploy social-post
```

```bash
supabase functions deploy oauth-refresh
```

```bash
supabase functions deploy social-validate
```

---

### Step 3: Verify Deployment

```bash
supabase functions list
```

Should show all 4 functions! ✅

---

## 📝 Why This Works

Supabase edge functions automatically have access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key
- `SUPABASE_ANON_KEY` - Your anon key

These are built-in environment variables that don't need to be set manually!

We only need to add the **external API credentials** (like Facebook).

---

## ✅ Summary

**Run these in order:**

1. Set Facebook App ID:
   ```bash
   supabase secrets set FACEBOOK_APP_ID=1482734112820631
   ```

2. Set Facebook App Secret:
   ```bash
   supabase secrets set FACEBOOK_APP_SECRET=8a4f5161c32389e5eed68dba9efdfae2
   ```

3. Deploy oauth-exchange:
   ```bash
   supabase functions deploy oauth-exchange
   ```

4. Deploy social-post:
   ```bash
   supabase functions deploy social-post
   ```

5. Deploy oauth-refresh:
   ```bash
   supabase functions deploy oauth-refresh
   ```

6. Deploy social-validate:
   ```bash
   supabase functions deploy social-validate
   ```

7. Verify:
   ```bash
   supabase functions list
   ```

---

**Start with the two secret commands and then deploy!** 🚀
