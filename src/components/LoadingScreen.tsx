'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { GrainOverlay } from '@/components/grain-overlay';
import { Activity } from 'lucide-react';

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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

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
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      <GrainOverlay />
      
      {/* WebGL Background */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
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

      {/* Content */}
      <div
        className={`relative z-10 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md px-8"
        >
          <div className="flex items-center justify-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border-2 border-primary/40"
            >
              <Activity className="h-10 w-10 text-primary" />
            </motion.div>
          </div>

          <motion.h2
            key={messageIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-light text-white mb-8 tracking-tight"
          >
            {LOADING_MESSAGES[messageIndex]}
          </motion.h2>

          <div className="backdrop-blur-2xl bg-card/80 border-2 border-border/30 rounded-3xl p-6 shadow-2xl mb-6">
            <div className="w-full bg-background/30 rounded-full h-3 overflow-hidden backdrop-blur-md">
              <motion.div
                className="bg-gradient-to-r from-primary via-primary/90 to-primary h-full rounded-full shadow-lg shadow-primary/20"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-white/70 mt-4 text-sm font-light">{progress}% complete</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
