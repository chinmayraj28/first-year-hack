'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { GameMetrics } from '@/types/game';

interface AttentionGameProps {
  onComplete: (metrics: GameMetrics) => void;
}

const TARGETS = ['🌟', '⭐', '✨', '💫', '🎯'];
const TARGET_EMOJI = '🌟';
const TOTAL_ROUNDS = 15;

export default function AttentionGame({ onComplete }: AttentionGameProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [currentEmoji, setCurrentEmoji] = useState('');
  const [isTarget, setIsTarget] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [falseClicks, setFalseClicks] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const startNextRound = useCallback(() => {
    if (currentRound >= TOTAL_ROUNDS) {
      // Game complete
      const avgReactionTime =
        reactionTimes.length > 0
          ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
          : 0;

      const totalClicks = correctClicks + falseClicks;
      const accuracy = totalClicks > 0 ? correctClicks / totalClicks : 0;

      const metrics: GameMetrics = {
        accuracy,
        avgReactionTime,
        falseClicks,
        retries: 0,
      };

      onComplete(metrics);
      return;
    }

    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    const willBeTarget = Math.random() > 0.4; // 60% target, 40% distractor

    setTimeout(() => {
      const emoji = willBeTarget
        ? TARGET_EMOJI
        : TARGETS[Math.floor(Math.random() * TARGETS.length)];
      
      setCurrentEmoji(emoji);
      setIsTarget(emoji === TARGET_EMOJI);
      setShowEmoji(true);
      setStartTime(Date.now());

      // Hide after 1.5 seconds
      setTimeout(() => {
        setShowEmoji(false);
        setCurrentRound(currentRound + 1);
        startNextRound();
      }, 1500);
    }, delay);
  }, [currentRound, correctClicks, falseClicks, reactionTimes, onComplete]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !gameStarted) {
      setGameStarted(true);
      startNextRound();
    }
  }, [countdown, gameStarted, startNextRound]);

  const handleClick = () => {
    if (!showEmoji) {
      // Clicked when nothing showing - false click
      setFalseClicks(falseClicks + 1);
      return;
    }

    const reactionTime = Date.now() - startTime;

    if (isTarget) {
      // Correct click
      setCorrectClicks(correctClicks + 1);
      setReactionTimes([...reactionTimes, reactionTime]);
      setShowEmoji(false);
      setCurrentRound(currentRound + 1);
      startNextRound();
    } else {
      // Clicked on distractor - false click
      setFalseClicks(falseClicks + 1);
    }
  };

  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-9xl font-bold text-orange-500"
        >
          {countdown}
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-8 flex items-center justify-center"
      onClick={handleClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 bg-white/80 backdrop-blur">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-orange-600 mb-2">⚡ Quick Tap Challenge</h2>
            <p className="text-gray-600">Tap only when you see the {TARGET_EMOJI}!</p>
            <div className="mt-4 text-sm text-gray-500">
              Round {currentRound + 1} of {TOTAL_ROUNDS}
            </div>
          </div>

          <div className="relative h-64 flex items-center justify-center border-4 border-dashed border-orange-300 rounded-2xl bg-orange-50/50">
            <AnimatePresence>
              {showEmoji && (
                <motion.div
                  key={currentRound}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="text-9xl cursor-pointer"
                >
                  {currentEmoji}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-100 rounded-xl p-4">
              <div className="text-sm text-gray-600">Correct Taps</div>
              <div className="text-3xl font-bold text-green-600">{correctClicks}</div>
            </div>
            <div className="bg-red-100 rounded-xl p-4">
              <div className="text-sm text-gray-600">Wrong Taps</div>
              <div className="text-3xl font-bold text-red-600">{falseClicks}</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-1">
            {Array.from({ length: TOTAL_ROUNDS }).map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx < currentRound ? 'bg-green-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
