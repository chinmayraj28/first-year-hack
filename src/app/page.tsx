'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton, useUser } from '@clerk/nextjs';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { GrainOverlay } from '@/components/grain-overlay';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PhonologicalGame from '@/components/games/PhonologicalGame';
import AttentionGame from '@/components/games/AttentionGame';
import ResultsDashboard from '@/components/ResultsDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import OnboardingFlow, { OnboardingData } from '@/components/OnboardingFlow';
import ProfessionalDashboard from '@/components/ProfessionalDashboard';
import { LandingPage } from '@/components/LandingPage';
import { GameMetrics, GameResult, DomainResult } from '@/types/game';
import { evaluateDomain, generateFeedback, saveResults } from '@/lib/scoring';
import { getParentProfile, saveParentProfile, addChild, getAllChildren } from '@/lib/profile';
import { ChildProfile } from '@/types/profile';

type AppState = 'loading' | 'landing' | 'onboarding' | 'dashboard' | 'playing' | 'results';
type GameState = 'phonological' | 'attention' | 'loading';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [appState, setAppState] = useState<AppState>('loading');
  const [gameState, setGameState] = useState<GameState>('phonological');
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [currentChild, setCurrentChild] = useState<ChildProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        const profile = getParentProfile(user.id);
        if (!profile || !profile.acceptedPrivacyPolicy) {
          setAppState('onboarding');
        } else {
          const userChildren = getAllChildren(user.id);
          setChildren(userChildren);
          setAppState('dashboard');
        }
      } else {
        setAppState('landing');
      }
    }
  }, [isLoaded, user]);

  const handleOnboardingComplete = (data: OnboardingData) => {
    if (!user) return;

    // Save parent profile with agreements
    saveParentProfile({
      userId: user.id,
      acceptedPrivacyPolicy: data.acceptedPrivacy,
      acceptedTerms: data.acceptedTerms,
      acceptedDisclaimer: data.acceptedDisclaimer,
      children: [],
      createdAt: Date.now(),
    });

    // Add the child
    const child = addChild(user.id, {
      name: data.childName,
      age: data.childAge,
      grade: data.childGrade,
      concerns: data.concerns,
      notes: data.notes || '',
    });

    setCurrentChild(child);
    setChildren([child]);
    setAppState('dashboard');
  };

  const handleSelectChild = (childId: string) => {
    const child = children.find((c) => c.id === childId);
    if (child) {
      setCurrentChild(child);
      setGameResults([]);
      setGameState('phonological');
      setAppState('playing');
    }
  };

  const handleAddChild = () => {
    setAppState('onboarding');
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

    // Save to localStorage with child ID
    saveResults({
      id: Date.now().toString(),
      timestamp: Date.now(),
      childId: currentChild?.id,
      childName: currentChild?.name,
      games: gameResults,
      domainResults,
    });

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

  // Show dashboard
  if (appState === 'dashboard' && user) {
    return (
      <ProfessionalDashboard
        userId={user.id}
        children={children}
        onSelectChild={handleSelectChild}
        onAddChild={handleAddChild}
      />
    );
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
          childName={currentChild?.name}
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
