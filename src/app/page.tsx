'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PhonologicalGame from '@/components/games/PhonologicalGame';
import AttentionGame from '@/components/games/AttentionGame';
import ResultsDashboard from '@/components/ResultsDashboard';
import LoadingScreen from '@/components/LoadingScreen';
import { GameMetrics, GameResult, DomainResult } from '@/types/game';
import { evaluateDomain, generateFeedback, saveResults } from '@/lib/scoring';

type GameState = 'landing' | 'phonological' | 'attention' | 'loading' | 'results';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('landing');
  const [gameResults, setGameResults] = useState<GameResult[]>([]);

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

    // Save to localStorage
    saveResults({
      id: Date.now().toString(),
      timestamp: Date.now(),
      games: gameResults,
      domainResults,
    });

    setGameState('results');
  };

  const handlePlayAgain = () => {
    setGameResults([]);
    setGameState('landing');
  };

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

  if (gameState === 'results') {
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

    return <ResultsDashboard results={domainResults} onPlayAgain={handlePlayAgain} />;
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            className="text-8xl mb-6"
          >
            🌱
          </motion.div>
          <h1 className="text-6xl font-bold text-green-600 mb-4">SproutSense</h1>
          <p className="text-2xl text-gray-600 font-medium">
            Early Learning Signal Detector
          </p>
          <p className="text-lg text-gray-500 mt-2 max-w-2xl mx-auto">
            Detect learning friction through play - helping children before frustration becomes
            struggle
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Playful Games</h3>
              <p className="text-gray-600">
                2-3 minute mini-games designed by learning specialists to measure behavior, not
                grades
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Insights</h3>
              <p className="text-gray-600">
                Get colour-coded signals highlighting areas that may need attention or support
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">100% Private</h3>
              <p className="text-gray-600">
                All data stays in your browser - we never collect or share your child's
                information
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-pink-200 bg-white/80 backdrop-blur">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">For Ages 5-10</h3>
              <p className="text-gray-600">
                Perfect for parents and teachers to spot early signals of learning differences
              </p>
            </CardContent>
          </Card>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-center"
        >
          <Button
            onClick={() => setGameState('phonological')}
            size="lg"
            className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full px-12 py-8 text-2xl font-bold shadow-2xl"
          >
            🚀 Start Playing
          </Button>
        </motion.div>

        <p className="text-center text-sm text-gray-500 mt-8 max-w-xl mx-auto">
          This tool provides observational insights only and is not a medical diagnostic
          instrument. Please consult professionals for comprehensive assessment.
        </p>
      </motion.div>
    </div>
  );
}
