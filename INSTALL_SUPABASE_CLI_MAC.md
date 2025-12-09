# 🍎 Install Supabase CLI on Mac

## The Issue

The error you got means: npm global install doesn't work for Supabase CLI anymore.

We need to use a different installation method!

---

## ✅ BEST SOLUTION: Use Homebrew (Recommended)

### Step 1: Check if you have Homebrew

```bash
brew --version
```

If you see a version number, you have it! Skip to Step 3.

If you see "command not found", continue to Step 2.

---

### Step 2: Install Homebrew (if needed)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Follow the prompts. Takes about 2-3 minutes.

---

### Step 3: Install Supabase CLI

```bash
brew install supabase/tap/supabase
```

Wait for it to install (takes 1-2 minutes).

---

### Step 4: Verify Installation

```bash
supabase --version
```

Should show: `1.x.x`

✅ Done! You can now use `supabase` commands!

---

## 🔄 ALTERNATIVE: Use npx (No Install Needed!)

If you don't want to install Homebrew, you can use `npx` instead!

### What is npx?

- Comes with Node.js (you already have it)
- Runs commands without installing them globally
- Just replace `supabase` with `npx supabase` in all commands

### Example Commands

Instead of:
```bash
supabase login
```

Use:
```bash
npx supabase login
```

Instead of:
```bash
supabase link --project-ref xxx
```

Use:
```bash
npx supabase link --project-ref xxx
```

**All the same commands, just add `npx` before `supabase`!**

---

## 📋 Which Method Should You Use?

### Use Homebrew if:
- ✅ You plan to use Supabase CLI often
- ✅ You want faster command execution
- ✅ You don't mind installing Homebrew

### Use npx if:
- ✅ You want quick setup (no installation)
- ✅ You only need it occasionally
- ✅ You don't want to install Homebrew

**Both work perfectly fine!**

---

## 🎯 Your Next Steps

### Option A: Install with Homebrew

1. Check if you have Homebrew: `brew --version`
2. If not, install it (command above)
3. Install Supabase CLI: `brew install supabase/tap/supabase`
4. Verify: `supabase --version`
5. Continue with deployment!

### Option B: Use npx

1. No installation needed!
2. Just use `npx supabase` instead of `supabase`
3. Continue with deployment!

---

## 🚀 Ready to Deploy?

Once you've chosen your method, I'll give you all the deployment commands!

**Which method do you want to use?**
- A) Install with Homebrew
- B) Use npx (no install)

Let me know and I'll provide the exact commands! 🎉
