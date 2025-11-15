'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/nextjs';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { GrainOverlay } from '@/components/grain-overlay';
import { Activity } from 'lucide-react';
import PhonologicalGame from '@/components/games/PhonologicalGame';
import AttentionGame from '@/components/games/AttentionGame';
import ResultsDashboard from '@/components/ResultsDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import OnboardingFlow, { OnboardingData } from '@/components/OnboardingFlow';
import TeacherDashboard from '@/components/TeacherDashboard';
import StudentDashboard from '@/components/StudentDashboard';
import { LandingPage } from '@/components/LandingPage';
import { GameMetrics, GameResult, DomainResult } from '@/types/game';
import { 
  evaluateDomain, 
  generateFeedback, 
  useGetReportByCode,
  useLinkReportToStudent
} from '@/lib/scoring';
import { 
  getTeacherProfile, 
  getStudentProfile,
  saveTeacherProfile,
  saveStudentProfile
} from '@/lib/profile';
import { UserType, StudentProfile } from '@/types/profile';

type AppState = 'loading' | 'landing' | 'onboarding' | 'dashboard' | 'playing' | 'results';
type GameState = 'phonological' | 'attention' | 'loading';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [appState, setAppState] = useState<AppState>('loading');
  const [gameState, setGameState] = useState<GameState>('phonological');
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [pendingReportCode, setPendingReportCode] = useState<string | null>(null);
  const [pendingOnboardingData, setPendingOnboardingData] = useState<OnboardingData | null>(null);
  
  // Convex hooks
  const linkReport = useLinkReportToStudent();
  const report = useGetReportByCode(pendingReportCode);

  // Add timeout fallback in case Clerk gets stuck
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (appState === 'loading' && !isLoaded) {
        console.warn('Clerk loading timeout - proceeding anyway');
        // If Clerk hasn't loaded after 5 seconds, proceed anyway
        if (user) {
          const teacherProfile = getTeacherProfile(user.id);
          const studentProfile = getStudentProfile(user.id);

          if (teacherProfile) {
            setUserType('teacher');
            setAppState(teacherProfile.acceptedPrivacyPolicy ? 'dashboard' : 'onboarding');
          } else if (studentProfile) {
            setUserType('student');
            setAppState(studentProfile.acceptedPrivacyPolicy ? 'dashboard' : 'onboarding');
          } else {
            setAppState('onboarding');
          }
        } else {
          setAppState('landing');
        }
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [appState, isLoaded, user]);

  useEffect(() => {
    console.log('[App] State check:', { isLoaded, hasUser: !!user, appState, userType });
    
    if (isLoaded) {
      if (user) {
        // Check for existing profiles
        const teacherProfile = getTeacherProfile(user.id);
        const studentProfile = getStudentProfile(user.id);

        console.log('[App] Profiles:', { hasTeacher: !!teacherProfile, hasStudent: !!studentProfile });

        if (teacherProfile) {
          setUserType('teacher');
          if (!teacherProfile.acceptedPrivacyPolicy) {
            setAppState('onboarding');
          } else {
            setAppState('dashboard');
          }
        } else if (studentProfile) {
          setUserType('student');
          if (!studentProfile.acceptedPrivacyPolicy) {
            setAppState('onboarding');
          } else {
            setAppState('dashboard');
          }
        } else {
          // No profile found, start onboarding
          setAppState('onboarding');
        }
      } else {
        setAppState('landing');
      }
    }
  }, [isLoaded, user, refreshKey]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    if (!user) return;

    if (data.userType === 'teacher') {
      // Save teacher profile
      const teacherProfile = {
        userId: user.id,
        userType: 'teacher' as UserType,
        name: data.teacherName || '',
        acceptedPrivacyPolicy: data.acceptedPrivacy,
        acceptedTerms: data.acceptedTerms,
        acceptedDisclaimer: data.acceptedDisclaimer,
        classrooms: [],
        createdAt: Date.now(),
      };
      saveTeacherProfile(teacherProfile);
      setUserType('teacher');
      setAppState('dashboard');
    } else if (data.userType === 'student') {
      // Validate report code
      const reportCode = (data.reportCode || '').toUpperCase().trim();
      if (!reportCode) {
        alert('Please enter a report code.');
        return;
      }
      
      // Store onboarding data and set pending report code to trigger Convex query
      setPendingOnboardingData(data);
      setPendingReportCode(reportCode);
    }
  };

  // Handle report code validation when report is loaded
  useEffect(() => {
    if (!pendingReportCode || !user || !pendingOnboardingData || appState !== 'onboarding') return;
    
    const processStudentOnboarding = async () => {
      if (!report) {
        // Report not found - check if query is still loading
        if (report === undefined) return; // Still loading
        
        // Report not found
        alert(`Invalid report code "${pendingReportCode}". Please check with your teacher.`);
        setPendingReportCode(null);
        setPendingOnboardingData(null);
        return;
      }

      // Note: Multiple reports can share the same code
      // Students can view all reports with their code, so we don't check if code is already used

      // Use student name from report (teacher uploaded it) or fallback to entered name
      const studentName = report.studentName || pendingOnboardingData.studentName || '';

      // Create student profile - get student info from the report
      const studentProfile: StudentProfile = {
        id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        userId: user.id,
        name: studentName,
        age: 0, // Age not stored in report currently
        grade: report.grade || '', // Get from report
        school: undefined, // School not stored in report currently
        reportCode: pendingReportCode, // Store the report code with the student profile
        createdAt: Date.now(),
      };

      // Link the initial report to student (optional - for tracking)
      try {
        await linkReport({
          reportCode: pendingReportCode,
          studentId: studentProfile.id,
        });
      } catch (error: any) {
        // If linking fails, continue anyway - student can still view reports by code
        console.warn('Failed to link report:', error.message);
      }

      // Save student user profile
      const studentUserProfile = {
        userId: user.id,
        userType: 'student' as UserType,
        acceptedPrivacyPolicy: pendingOnboardingData.acceptedPrivacy,
        acceptedTerms: pendingOnboardingData.acceptedTerms,
        acceptedDisclaimer: pendingOnboardingData.acceptedDisclaimer,
        studentProfile,
        createdAt: Date.now(),
      };
      saveStudentProfile(studentUserProfile);
      setUserType('student');
      setAppState('dashboard');
      setPendingReportCode(null);
      setPendingOnboardingData(null);
    };

    processStudentOnboarding();
  }, [report, pendingReportCode, pendingOnboardingData, user, appState, linkReport]);


  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleGameComplete = (gameType: string, metrics: GameMetrics) => {
    const result: GameResult = {
      gameType: gameType as any,
      metrics,
      timestamp: Date.now(),
    };

    const updatedResults = [...gameResults, result];
    setGameResults(updatedResults);

    // Move to next game or loading
    if (gameType === 'phonological') {
      setGameState('attention');
    } else if (gameType === 'attention') {
      setGameState('loading');
    }
  };

  const handleLoadingComplete = () => {
    // Process results
    const domainResults: DomainResult[] = gameResults.map((result) => {
      const signal = evaluateDomain(result.metrics);
      
      let domain = '';
      let emoji = '';
      
      if (result.gameType === 'phonological') {
        domain = 'Phonological Processing';
        emoji = '🎵';
      } else if (result.gameType === 'attention') {
        domain = 'Attention Control';
        emoji = '⚡';
      }
      
      const feedback = generateFeedback(domain, signal, result.metrics);
      
      return {
        domain,
        emoji,
        signal,
        feedback,
        metrics: result.metrics,
      };
    });

    // Note: Game results are processed and displayed immediately
    // If you need to persist game results, use Convex mutations

    setAppState('results');
  };

  const handlePlayAgain = () => {
    setGameResults([]);
    setAppState('dashboard');
  };

  // Show loading
  if (!isLoaded || appState === 'loading') {
    return (
      <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
        <GrainOverlay />
        <div className="fixed inset-0 z-0">
          <Shader className="h-full w-full">
            <Swirl
              colorA="#1275d8"
              colorB="#e19136"
              speed={0.8}
              detail={0.8}
              blend={50}
              coarseX={40}
              coarseY={40}
              mediumX={40}
              mediumY={40}
              fineX={40}
              fineY={40}
            />
            <ChromaFlow
              baseColor="#0066ff"
              upColor="#0066ff"
              downColor="#d1d1d1"
              leftColor="#e19136"
              rightColor="#e19136"
              intensity={0.9}
              radius={1.8}
              momentum={25}
              maskType="alpha"
              opacity={0.97}
            />
          </Shader>
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border-2 border-primary/40 mx-auto mb-6"
          >
            <Activity className="h-8 w-8 text-primary" />
          </motion.div>
          <p className="text-xl text-white/80 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Show onboarding
  if (appState === 'onboarding' && user) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} userId={user.id} />;
  }

  // Show dashboard based on user type
  if (appState === 'dashboard' && user) {
    if (userType === 'teacher') {
      const teacherProfile = getTeacherProfile(user.id);
      if (teacherProfile) {
        return (
          <TeacherDashboard
            userId={user.id}
            teacherProfile={teacherProfile}
            onRefresh={handleRefresh}
          />
        );
      }
    } else if (userType === 'student') {
      const studentProfile = getStudentProfile(user.id);
      if (studentProfile) {
        return (
          <StudentDashboard
            userId={user.id}
            studentProfile={studentProfile}
            onRefresh={handleRefresh}
          />
        );
      }
    }
  }

  // Show games
  if (appState === 'playing') {
    if (gameState === 'phonological') {
      return (
        <PhonologicalGame
          onComplete={(metrics) => handleGameComplete('phonological', metrics)}
        />
      );
    }

    if (gameState === 'attention') {
      return (
        <AttentionGame onComplete={(metrics) => handleGameComplete('attention', metrics)} />
      );
    }

    if (gameState === 'loading') {
      return <LoadingScreen onComplete={handleLoadingComplete} />;
    }
  }

  // Show results
  if (appState === 'results') {
    const domainResults: DomainResult[] = gameResults.map((result) => {
      const signal = evaluateDomain(result.metrics);
      
      let domain = '';
      let emoji = '';
      
      if (result.gameType === 'phonological') {
        domain = 'Phonological Processing';
        emoji = '🎵';
      } else if (result.gameType === 'attention') {
        domain = 'Attention Control';
        emoji = '⚡';
      }
      
      const feedback = generateFeedback(domain, signal, result.metrics);
      
      return {
        domain,
        emoji,
        signal,
        feedback,
        metrics: result.metrics,
      };
    });

    return (
      <>
        <div className="absolute top-4 right-4 z-50">
          <UserButton afterSignOutUrl="/" />
        </div>
        <ResultsDashboard 
          results={domainResults} 
          onPlayAgain={handlePlayAgain}
        />
      </>
    );
  }

  // Show landing page
  if (appState === 'landing') {
    return <LandingPage />;
  }

  // Fallback
  return null;
}
