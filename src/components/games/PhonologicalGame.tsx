'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GameMetrics } from '@/types/game';

interface PhonologicalGameProps {
  onComplete: (metrics: GameMetrics) => void;
}

const RHYME_PAIRS = [
  { word: 'CAT', rhymes: ['HAT', 'BAT', 'DOG'], correct: 'HAT' },
  { word: 'SUN', rhymes: ['FUN', 'RUN', 'CAR'], correct: 'FUN' },
  { word: 'TREE', rhymes: ['BEE', 'SEE', 'PIG'], correct: 'BEE' },
  { word: 'STAR', rhymes: ['CAR', 'JAR', 'BED'], correct: 'CAR' },
  { word: 'MOON', rhymes: ['SPOON', 'SOON', 'FISH'], correct: 'SPOON' },
];

export default function PhonologicalGame({ onComplete }: PhonologicalGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [falseClicks, setFalseClicks] = useState(0);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentRound]);

  const handleAnswer = (selected: string) => {
    const reactionTime = Date.now() - startTime;
    setReactionTimes([...reactionTimes, reactionTime]);

    const currentPair = RHYME_PAIRS[currentRound];
    const isCorrect = selected === currentPair.correct;

    if (isCorrect) {
      setScore(score + 1);
      setShowFeedback('correct');
    } else {
      setFalseClicks(falseClicks + 1);
      setShowFeedback('wrong');
    }

    setTimeout(() => {
      setShowFeedback(null);
      if (currentRound < RHYME_PAIRS.length - 1) {
        setCurrentRound(currentRound + 1);
      } else {
        // Game complete
        const avgReactionTime =
          reactionTimes.length > 0
            ? reactionTimes.reduce((a, b) => a + b, reactionTime) / (reactionTimes.length + 1)
            : reactionTime;

        const metrics: GameMetrics = {
          accuracy: score / RHYME_PAIRS.length,
          avgReactionTime,
          falseClicks,
          retries: 0,
        };

        onComplete(metrics);
      }
    }, 1000);
  };

  const currentPair = RHYME_PAIRS[currentRound];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-8 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 bg-white/80 backdrop-blur">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-purple-600 mb-2">🎵 Sound Matching</h2>
            <p className="text-gray-600">Find the word that rhymes!</p>
            <div className="mt-4 text-sm text-gray-500">
              Round {currentRound + 1} of {RHYME_PAIRS.length}
            </div>
          </div>

          <motion.div
            key={currentRound}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="mb-8"
          >
            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">Which word rhymes with:</p>
              <div className="text-5xl font-bold text-purple-600 bg-purple-100 rounded-2xl py-6 px-8 inline-block">
                {currentPair.word}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentPair.rhymes.map((rhyme, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => handleAnswer(rhyme)}
                    className="w-full h-24 text-2xl font-semibold bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 rounded-2xl shadow-lg"
                    disabled={showFeedback !== null}
                  >
                    {rhyme}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center py-4 rounded-xl text-xl font-bold ${
                showFeedback === 'correct'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {showFeedback === 'correct' ? '✨ Great job!' : '💫 Try again next time!'}
            </motion.div>
          )}

          <div className="mt-6 flex justify-center gap-2">
            {RHYME_PAIRS.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx < currentRound ? 'bg-green-400' : idx === currentRound ? 'bg-purple-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
