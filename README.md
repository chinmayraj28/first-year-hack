# 🌱 SproutSense - Early Learning Signal Detector

**Detect learning friction through play - helping children before frustration becomes struggle.**

SproutSense is a browser-based tool that helps parents and teachers detect early learning friction in children aged 5–10 through short, playful mini-games. The app measures behavior (accuracy, reaction time, retries) instead of grades, to highlight possible early signals of dyslexia, ADHD, dyscalculia, and other learning differences.

## ✨ Features

- 🎮 **Playful Mini-Games** - 2-3 minute games designed by learning specialists
- 📊 **Smart Insights** - Color-coded signals (green/yellow/red) highlighting areas that may need attention
- 🔒 **100% Private** - All data stays in your browser, never collected or shared
- � **Email Results** - Send detailed assessment reports to registered email addresses
- �👥 **For Ages 5-10** - Perfect for parents and teachers to spot early signals
- 📱 **Works Everywhere** - Fully client-side, works on any device with a browser
- 🎯 **Professional Dashboard** - Track multiple children and view test history

## 🎯 Mini-Games

### 🎵 Phonological Processing
**Letter-sound matching game** that measures:
- Accuracy in rhyming word identification
- Reaction time for sound-letter mapping
- Potential signals of dyslexia

### ⚡ Attention Control
**Quick tap challenge** that measures:
- False clicks and impulsivity
- Variable attention patterns
- Potential signals of ADHD

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Clerk Authentication

See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed instructions on setting up Clerk authentication.

Quick setup:
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Add your API keys to `.env.local`
3. Configure the redirect URLs in Clerk dashboard

### 3. Set Up Email Functionality (Optional)

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for detailed instructions on setting up email results.

Quick setup:
1. Create a Resend account at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add `RESEND_API_KEY` to `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with pastel, child-friendly design
- **Framer Motion** - Smooth animations and transitions
- **shadcn/ui** - Accessible component library
- **Clerk** - User authentication and management
- **Resend** - Email delivery for assessment reports
- **LocalStorage** - Privacy-safe data persistence

## 📊 How It Works

### Measurement Heuristics

| Metric | Typical Range | Friction Signal |
|--------|--------------|-----------------|
| Accuracy | ≥ 80% | < 80% |
| Avg Reaction Time | < 2000ms | ≥ 2000ms |
| False Clicks | ≤ 3 | > 3 |
| Retries | ≤ 2 | > 2 |

### Signal Colors

- 🟢 **Green** - Performance within typical range
- 🟡 **Yellow** - Watch / mild friction detected
- 🔴 **Red** - Consistent friction, may warrant assessment

## ⚠️ Important Disclaimer

**This is not a medical or diagnostic tool.** It highlights play patterns that may warrant professional assessment. If you have concerns, please consult with an educational psychologist or pediatrician for comprehensive evaluation.

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main app with game state management
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── games/
│   │   ├── PhonologicalGame.tsx  # Sound-matching game
│   │   └── AttentionGame.tsx     # Quick tap challenge
│   ├── ResultsDashboard.tsx      # Results display with insights
│   ├── LoadingScreen.tsx         # Analysis animation
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── scoring.ts        # Evaluation logic and feedback generation
│   └── utils.ts          # Utility functions
└── types/
    └── game.ts           # TypeScript type definitions
```

## 🎨 Design Philosophy

- **Child-Friendly**: Pastel colors, rounded corners, bubbly buttons
- **Playful**: Emoji icons, celebratory animations, friendly language
- **Safe**: Clear disclaimer, privacy-first approach
- **Accessible**: Built on Radix UI primitives for keyboard navigation and screen readers

## 🚢 Deployment

Deploy easily on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chinmayraj28/first-year-hack)

## 📝 License

MIT License - feel free to use this for educational and research purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Tagline**: "SproutSense turns playful 2-minute games into early signals of learning friction — helping children before frustration becomes struggle."
