# SproutSense - AI-Powered Student Assessment Platform

Comprehensive student assessment and analysis platform for teachers and students with AI-powered insights.

SproutSense is a modern web application that enables teachers to assess students and provides AI-powered analysis for personalized learning insights, career guidance, and development plans. The platform supports two distinct assessment types based on grade levels and provides comprehensive analytics dashboards.

## Key Features

### For Teachers
- **Dual Assessment Types**:
  - **Questionnaire Assessment** (LKG - Grade 2): Rate students on various parameters (1-5 scale)
  - **Marks Assessment** (Grade 6+): Enter subject marks and assess 5 key factors (conceptual understanding, recall, logical reasoning, attempts bonus questions, effort)
- **Unique Report Codes**: Generate unique codes for each assessment that students can use to access their reports
- **Comprehensive Dashboard**: View all student reports, track assessment history, and manage multiple students
- **AI-Powered Analysis**: Automatic analysis of student performance with detailed insights

### For Students
- **Simple Access**: Enter name and report code provided by teacher to access reports
- **Detailed Analytics**: View comprehensive analysis including:
  - Overall performance (strengths & improvement areas)
  - Subject-wise performance breakdown
  - Career recommendations with suitability scores
  - Stream suggestions
  - Study recommendations and strategies
  - Learning profile insights
  - Development plan (immediate actions, short-term goals, long-term objectives)
- **Responsive Design**: Access reports on any device

## Assessment Types

### Early Childhood (LKG - Grade 2)
Teachers fill out a questionnaire rating students on various parameters using a 1-5 scale. The system analyzes responses and provides insights into:
- Cognitive development
- Linguistic skills
- Mathematical understanding
- Visual-spatial abilities
- Attention and focus
- Memory capabilities
- Processing speed

### Grade 6 and Above
Teachers enter:
- **Subject Marks**: Obtained marks and total marks for each subject
- **5-Factor Assessment** (1-5 scale):
  - Conceptual Understanding
  - Recall
  - Logical Reasoning
  - Attempts Bonus Questions
  - Effort (Non-Conservative Approach)

The system sends this data to an AI analysis API that provides:
- Subject-wise analysis with grades and percentages
- Parameter analysis for each subject
- Overall performance metrics
- Career guidance and stream suggestions
- Personalized study recommendations
- Development plans

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Clerk account for authentication
- Convex account for database
- (Optional) Resend account for email functionality

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Convex Database
NEXT_PUBLIC_CONVEX_URL=your_convex_url
CONVEX_DEPLOY_KEY=your_convex_deploy_key

# API Configuration
NEXT_PUBLIC_API_KEY=your_api_key

# Email (Optional)
RESEND_API_KEY=your_resend_api_key
```

### 3. Set Up Clerk Authentication

See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed instructions.

Quick setup:
1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Create a new application
3. Add your API keys to `.env.local`
4. Configure redirect URLs in Clerk dashboard

### 4. Set Up Convex Database

1. Install Convex CLI: `npm install -g convex`
2. Run `npx convex dev` to initialize Convex
3. The schema and functions are already defined in `convex/schema.ts` and `convex/functions.ts`
4. Convex will generate the API types automatically

### 5. Set Up External AI Analysis API

The application integrates with an external AI analysis API:
- **Base URL**: `https://7fg18gc3-8000.uks1.devtunnels.ms/api/v1`
- **Endpoints**:
  - `/api/v1/analysis/advanced` - For Grade 6+ marks assessments
  - `/api/v1/analysis/game-based` - For LKG-Grade 2 questionnaire assessments
  - `/api/v1/health` - Health check endpoint
- The API is accessed via Next.js API proxy routes (`/api/analyze` and `/api/analyze/questionnaire`) to handle CORS
- API key is configured via `NEXT_PUBLIC_API_KEY` environment variable

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Tech Stack

**Frontend:**
- **Next.js 16.0.3** - React framework with App Router and Turbopack
- **React 19.2.0** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4.1.17** - Utility-first styling
- **shadcn/ui** - Accessible component library (Radix UI primitives)
- **Framer Motion 12.23.24** - Smooth animations and transitions

**Backend & Database:**
- **Convex 1.29.1** - Real-time database and serverless functions
- **Next.js API Routes** - Server-side API proxy for external services

**Authentication:**
- **Clerk 6.35.1** - User authentication and management

**3D Graphics & Effects:**
- **Three.js 0.181.1** - 3D graphics library
- **@react-three/fiber 9.4.0** - React renderer for Three.js
- **@react-three/drei 10.7.7** - Three.js helpers
- **shaders 2.1.10** - WebGL shader components (Swirl, ChromaFlow)

**UI Components:**
- **Lucide React 0.553.0** - Icon library
- **class-variance-authority** - Component variants
- **clsx & tailwind-merge** - Conditional class utilities

**Additional:**
- **Resend 6.4.2** - Email delivery service
- **@vercel/analytics 1.5.0** - Analytics

## How It Works

### User Flow

1. **Teacher Registration/Login**
   - Teacher signs up/logs in via Clerk
   - Completes onboarding (accepts terms, provides basic info)
   - Accesses Teacher Dashboard

2. **Creating Assessments**
   - Teacher selects student grade level
   - For LKG-Grade 2: Fills out questionnaire (1-5 scale for each question)
   - For Grade 6+: Enters subject marks and rates 5 assessment factors
   - System generates unique report code
   - Assessment data is sent to AI analysis API (for Grade 6+)
   - Results are stored in Convex database

3. **Student Access**
   - Student signs up/logs in via Clerk
   - Completes onboarding (enters name and report code)
   - System links report code to student account
   - Student accesses Student Dashboard to view all reports with that code

4. **Viewing Analytics**
   - Students see comprehensive analysis including:
     - Subject performance breakdown
     - Overall strengths and improvement areas
     - Career recommendations
     - Study recommendations
     - Learning profile
     - Development plan

### Data Flow

```
Teacher Input → Convex Database → AI Analysis API → Stored Results → Student Dashboard
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/              # API proxy for AI analysis
│   │   │   ├── route.ts          # Advanced analysis (Grade 6+)
│   │   │   └── questionnaire/    # Questionnaire analysis (LKG-Grade 2)
│   │   └── send-results/         # Email results API
│   ├── page.tsx                  # Main app router
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── sign-in/[[...sign-in]]/   # Clerk sign-in page
│   └── sign-up/[[...sign-up]]/   # Clerk sign-up page
├── components/
│   ├── forms/
│   │   ├── QuestionnaireForm.tsx     # LKG-Grade 2 questionnaire
│   │   └── MarksAssessmentForm.tsx   # Grade 6+ marks assessment
│   ├── TeacherDashboard.tsx          # Teacher dashboard
│   ├── StudentDashboard.tsx          # Student dashboard
│   ├── OnboardingFlow.tsx            # User onboarding
│   ├── LandingPage.tsx               # Landing page
│   ├── LoadingScreen.tsx             # Loading state
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── api-client.ts             # External AI API client
│   ├── scoring.ts                # Convex hooks and utilities
│   ├── profile.ts                # User profile management
│   ├── grade-utils.ts            # Grade level utilities
│   └── utils.ts                  # General utilities
├── types/
│   ├── profile.ts                # User type definitions
│   └── game.ts                   # Game type definitions
└── middleware.ts                 # Next.js middleware

convex/
├── schema.ts                     # Database schema
├── functions.ts                  # Convex queries and mutations
└── _generated/                    # Auto-generated Convex types
```

## Design Features

- **Modern Dark Theme**: Professional dark UI with WebGL shader backgrounds
- **Shader Effects**: Swirl and ChromaFlow shaders for dynamic backgrounds
- **Grain Overlay**: Subtle texture overlay for depth
- **Magnetic Buttons**: Interactive hover effects
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion for fluid transitions

## Security & Privacy

- **Clerk Authentication**: Secure user authentication and session management
- **Convex Security**: Row-level security and type-safe database operations
- **API Proxy**: Server-side API calls prevent CORS issues and protect API keys
- **Data Isolation**: Students can only access reports linked to their report code

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/chinmayraj28/first-year-hack)

### Environment Variables for Production

Ensure all environment variables from `.env.local` are set in your Vercel project settings.

## API Integration

The application integrates with the SproutSense AI Analysis Backend:

- **Base URL**: `https://7fg18gc3-8000.uks1.devtunnels.ms/api/v1`
- **Endpoints**:
  - `/api/v1/analysis/advanced` - Advanced analysis for Grade 6+ students
  - `/api/v1/analysis/game-based` - Game-based analysis for LKG-Grade 2 students
  - `/api/v1/health` - Health check endpoint
- **Authentication**: API key via `X-API-Key` header (configured via `NEXT_PUBLIC_API_KEY`)
- **Proxy Routes**: 
  - `/api/analyze` - Proxies to `/api/v1/analysis/advanced`
  - `/api/analyze/questionnaire` - Proxies to `/api/v1/analysis/game-based`
- **CORS Handling**: All external API calls are proxied through Next.js API routes to avoid CORS issues

See [API_DOCS.md](./API_DOCS.md) for detailed API documentation.

## User Roles

### Teacher
- Create assessments for students
- Generate unique report codes
- View all student reports
- Manage multiple students

### Student
- Access reports using teacher-provided code
- View comprehensive analytics
- Track assessment history
- Access personalized recommendations

## Assessment Data Structure

### Questionnaire Assessment (LKG-Grade 2)
```typescript
{
  questionnaireData: [
    { question: string, score: number } // 1-5 scale
  ],
  apiAnalysisResult: {
    strengths: string[],
    weaknesses: string[],
    skillsets: { [key: string]: number },
    learningProfile: {...},
    developmentPlan: {...}
  }
}
```

### Marks Assessment (Grade 6+)
```typescript
{
  subjectAssessments: [
    {
      subjectName: string,
      obtainedMarks: number,
      totalMarks: number,
      assessmentParameters: {
        conceptualUnderstanding: number, // 1-5
        recall: number, // 1-5
        logicalReasoning: number, // 1-5
        attemptsBonusQuestions: number, // 1-5
        effortNonConservative: number // 1-5
      }
    }
  ],
  apiAnalysisResult: {
    overallPerformance: {...},
    subjectAnalysis: [...],
    careerGuidance: {...},
    studyRecommendations: {...}
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this for educational and research purposes.

## Important Disclaimer

**This is not a medical or diagnostic tool.** The assessments and AI analysis are for educational and informational purposes only. If you have concerns about a student's learning, please consult with qualified educational professionals, psychologists, or pediatricians for comprehensive evaluation.

---

**Tagline**: "SproutSense - AI-powered student assessment platform connecting teachers and students with personalized learning insights."
