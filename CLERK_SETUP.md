# Clerk Authentication Setup

SproutSense uses Clerk for user authentication. Follow these steps to set it up:

## 1. Create a Clerk Account

1. Go to [clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application

## 2. Get Your API Keys

1. In your Clerk dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**

## 3. Configure Environment Variables

Create a `.env.local` file in the root directory (it's already created for you) and add your keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Clerk redirect URLs (already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 4. Configure Clerk Dashboard

In your Clerk dashboard:

1. Go to **Paths** settings
2. Set the following paths:
   - Sign in: `/sign-in`
   - Sign up: `/sign-up`
   - After sign in: `/`
   - After sign up: `/`

## 5. Run the Application

```bash
npm run dev
```

Your app will now have:
- ✅ User authentication with email/password
- ✅ Social login options (Google, GitHub, etc.)
- ✅ User profile management
- ✅ Protected routes
- ✅ User button in the top-right corner

## Features

- **Sign In/Sign Up**: Beautiful pre-built authentication UI
- **User Button**: Shows user avatar with quick access to profile and sign out
- **Protected Routes**: Main app is protected and requires authentication
- **Welcome Message**: Personalized greeting for logged-in users

## Testing

You can test authentication by:
1. Going to `/sign-up` to create an account
2. Going to `/sign-in` to log in
3. The main page will show your name and a user button in the top-right

## Deployment Note

When deploying to Vercel or other platforms, make sure to add the environment variables in your deployment settings!
