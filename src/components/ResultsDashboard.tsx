'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DomainResult } from '@/types/game';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface ResultsDashboardProps {
  results: DomainResult[];
  onPlayAgain: () => void;
  childName?: string;
}

export default function ResultsDashboard({ results, onPlayAgain, childName }: ResultsDashboardProps) {
  const { user } = useUser();
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleEmailResults = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      alert('No email address found. Please add an email to your account.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatus('idle');

    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.primaryEmailAddress.emailAddress,
          childName: childName || 'Your Child',
          results: results.map(r => ({
            domain: r.domain,
            score: Math.round(r.metrics.accuracy * 100),
            signal: getSignalText(r.signal),
            metrics: {
              accuracy: (r.metrics.accuracy * 100).toFixed(0),
              avgResponseTime: r.metrics.avgReactionTime.toFixed(0),
            },
            notes: r.feedback,
          })),
          testDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setEmailStatus('success');
        setTimeout(() => setEmailStatus('idle'), 3000);
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setEmailStatus('error');
      setTimeout(() => setEmailStatus('idle'), 3000);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'green':
        return 'bg-green-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSignalBg = (signal: string) => {
    switch (signal) {
      case 'green':
        return 'bg-green-50 border-green-200';
      case 'yellow':
        return 'bg-yellow-50 border-yellow-200';
      case 'red':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getSignalText = (signal: string) => {
    switch (signal) {
      case 'green':
        return 'Typical Range';
      case 'yellow':
        return 'Watch / Mild Friction';
      case 'red':
        return 'Consistent Friction';
      default:
        return 'Unknown';
    }
  };

  const overallSignal = results.some((r) => r.signal === 'red')
    ? 'red'
    : results.some((r) => r.signal === 'yellow')
    ? 'yellow'
    : 'green';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-purple-600 mb-4"
          >
            🌱 Your Play Report
          </motion.h1>
          <p className="text-xl text-gray-600 mb-4">Here's what we observed during play</p>
          <Badge
            variant="secondary"
            className={`${getSignalColor(overallSignal)} text-white px-4 py-2 text-lg`}
          >
            Overall: {getSignalText(overallSignal)}
          </Badge>
        </div>

        {/* Results Cards */}
        <div className="space-y-4 mb-8">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`border-2 ${getSignalBg(result.signal)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{result.emoji}</span>
                      <div>
                        <CardTitle className="text-xl">{result.domain}</CardTitle>
                        <CardDescription className="mt-1">{result.feedback}</CardDescription>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${getSignalColor(result.signal)}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Accuracy</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {(result.metrics.accuracy * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Reaction Time</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {result.metrics.avgReactionTime.toFixed(0)}ms
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">False Clicks</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {result.metrics.falseClicks}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Retries</div>
                      <div className="text-2xl font-bold text-purple-600">
                        {result.metrics.retries}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-blue-50 border-2 border-blue-200 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <p className="text-sm text-blue-900 font-medium mb-1">Important Note</p>
                  <p className="text-sm text-blue-800">
                    This is not a medical or diagnostic tool. It highlights play patterns that may
                    warrant professional assessment. If you have concerns, please consult with an
                    educational psychologist or pediatrician.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onPlayAgain}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-8 py-6 text-lg font-semibold"
          >
            🎮 Play Again
          </Button>
          <Button
            onClick={handleEmailResults}
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-lg font-semibold"
            disabled={isSendingEmail}
          >
            {isSendingEmail ? (
              <>⏳ Sending...</>
            ) : emailStatus === 'success' ? (
              <>✅ Email Sent!</>
            ) : emailStatus === 'error' ? (
              <>❌ Failed</>
            ) : (
              <>📧 Email Results</>
            )}
          </Button>
          <Button
            onClick={() => window.print()}
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-lg font-semibold"
          >
            📄 Save Report
          </Button>
        </div>

        {/* Footer tip */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Results saved locally in your browser for privacy
        </p>
      </motion.div>
    </div>
  );
}
