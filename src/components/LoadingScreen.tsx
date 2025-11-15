'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  'Analyzing play patterns...',
  'Measuring reaction times...',
  'Evaluating accuracy scores...',
  'Generating insights...',
  'Almost there...',
];

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-8xl mb-6"
        >
          🌱
        </motion.div>

        <h2 className="text-3xl font-bold text-purple-600 mb-4">
          {LOADING_MESSAGES[messageIndex]}
        </h2>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <p className="text-gray-600 mt-4">{progress}% complete</p>
      </motion.div>
    </div>
  );
}
