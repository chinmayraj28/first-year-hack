import { GameMetrics, SignalLevel } from '@/types/game';

export function evaluateDomain({
  accuracy,
  avgReactionTime,
  falseClicks,
  retries,
}: GameMetrics): SignalLevel {
  // Red flags - consistent friction
  if (accuracy < 0.6 || avgReactionTime > 2500 || falseClicks > 5) {
    return 'red';
  }
  
  // Yellow flags - mild friction
  if (accuracy < 0.8 || avgReactionTime > 2000 || falseClicks > 3 || retries > 2) {
    return 'yellow';
  }
  
  // Green - typical range
  return 'green';
}

export function generateFeedback(
  domain: string,
  signal: SignalLevel,
  metrics: GameMetrics
): string {
  const { accuracy, avgReactionTime, falseClicks } = metrics;
  
  if (signal === 'green') {
    return `Performance within typical range. Keep playing regularly!`;
  }
  
  const feedback: string[] = [];
  
  // Domain-specific feedback
  if (domain === 'Phonological Processing') {
    if (accuracy < 0.7) {
      feedback.push('Child showed difficulty matching sounds to letters.');
    }
    if (avgReactionTime > 2000) {
      feedback.push('Sound-letter recognition took longer than typical.');
    }
  } else if (domain === 'Attention Control') {
    if (falseClicks > 3) {
      feedback.push('Quick reactions but occasional impulsive taps.');
    }
    if (avgReactionTime > 2000) {
      feedback.push('Attention fluctuated; quick reactions but occasional impulsive taps.');
    }
  } else if (domain === 'Working Memory') {
    if (accuracy < 0.7) {
      feedback.push('Sequence recall showed challenge with longer patterns.');
    }
  }
  
  if (feedback.length === 0) {
    feedback.push('Performance within typical range. Keep playing regularly!');
  }
  
  return feedback.join(' ');
}

export function saveResults(results: any) {
  const existing = localStorage.getItem('sproutsense-results');
  const history = existing ? JSON.parse(existing) : [];
  history.push(results);
  localStorage.setItem('sproutsense-results', JSON.stringify(history));
}

export function getResultsHistory() {
  const existing = localStorage.getItem('sproutsense-results');
  return existing ? JSON.parse(existing) : [];
}
