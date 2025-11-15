# Email Setup Guide for SproutSense

This guide will help you set up email functionality to send test results to parents' registered email addresses.

## Overview

SproutSense uses [Resend](https://resend.com) to send beautiful, formatted email reports containing:
- Overall assessment summary
- Detailed results for each domain (Phonological Processing, Attention Control, etc.)
- Color-coded signals (Green/Yellow/Red)
- Metrics including accuracy, response times, and error counts
- Direct link back to the dashboard

## Setup Steps

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log into your Resend dashboard
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name like "SproutSense Production"
5. Copy the API key (it starts with `re_`)

### 3. Add API Key to Environment Variables

Open your `.env.local` file and update the `RESEND_API_KEY`:

```bash
RESEND_API_KEY=re_your_actual_api_key_here
```

**Important**: Replace `your_resend_api_key_here` with your actual API key from step 2.

### 4. Configure Your Domain (Optional but Recommended)

By default, emails are sent from `onboarding@resend.dev`. For production:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `sproutsense.com`)
4. Add the DNS records shown to your domain provider
5. Wait for verification (usually a few minutes)
6. Update the `from` field in `/src/app/api/send-results/route.ts`:

```typescript
from: 'SproutSense <hello@yourdomain.com>',
```

### 5. Update App URL for Production

When deploying to production, update the app URL in `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

This URL is used in the "View Full Dashboard" button in emails.

## Testing Email Functionality

### Development Testing

1. Make sure your `.env.local` has a valid `RESEND_API_KEY`
2. Run the development server: `npm run dev`
3. Complete a test assessment
4. Click the "📧 Email Results" button on the results page
5. Check your registered email address for the results

### Email Content

The email includes:
- **Header**: SproutSense branding with child's name
- **Assessment Date**: Full timestamp
- **Results Section**: 
  - Each domain with emoji and name
  - Overall score with color coding (✅ Strong, ⚠️ Watch, 🔴 Concern)
  - Detailed metrics (Accuracy %, Avg Response Time, Signal)
  - Notes and feedback
- **CTA Button**: Link to view full dashboard
- **Footer**: Disclaimer and professional guidance notice

### Rate Limits

Resend free tier includes:
- **100 emails/day**
- **3,000 emails/month**

For higher volumes, check [Resend pricing](https://resend.com/pricing).

## Troubleshooting

### "Failed to send email" Error

1. **Check API Key**: Verify your `RESEND_API_KEY` in `.env.local` is correct
2. **Restart Server**: After updating `.env.local`, restart `npm run dev`
3. **Check Console**: Look at the terminal for detailed error messages
4. **Verify Account**: Make sure your Resend account is active and verified

### Email Not Received

1. **Check Spam Folder**: Resend emails might be filtered initially
2. **Verify Email Address**: Ensure your Clerk account has a valid email
3. **Check Resend Dashboard**: View sent emails in the Resend Logs section
4. **Domain Setup**: Consider setting up a custom domain for better deliverability

### Rate Limit Exceeded

If you hit the free tier limit:
1. Upgrade your Resend plan
2. Or wait until the next day/month for limit reset

## Security Best Practices

1. **Never commit** `.env.local` to version control
2. **Use environment variables** for all sensitive keys
3. **Rotate API keys** periodically
4. **Use separate keys** for development and production
5. **Monitor usage** in Resend dashboard to detect anomalies

## Additional Features (Future)

Potential enhancements:
- Schedule automatic weekly summary emails
- Parent notification preferences
- Multiple recipient support (both parents)
- PDF attachment generation
- Email templates for different assessment types
- Reminder emails for follow-up assessments

## Support

- **Resend Documentation**: https://resend.com/docs
- **Resend Support**: hello@resend.com
- **SproutSense Issues**: Contact your development team

---

**Note**: Keep your API keys secure and never share them publicly!
