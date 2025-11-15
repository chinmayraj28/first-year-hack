import { GameMetrics, SignalLevel } from '@/types/game';
import { useMutation, useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';

// Type assertion for Convex API functions
type ConvexApi = {
  functions: {
    saveTestResults: any;
    getReportByCode: any;
    linkReportToStudent: any;
    getTestResults: any;
    getStudentReports: any;
    getReportsByCode: any;
    generateUploadUrl: any;
    getFileUrl: any;
  };
};

const convexApi = api as unknown as ConvexApi;

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

export function generateReportCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Hook-based functions for React components
export function useSaveReport() {
  return useMutation(convexApi.functions.saveTestResults);
}

export function useGetReportByCode(reportCode: string | null) {
  return useQuery(
    convexApi.functions.getReportByCode,
    reportCode ? { reportCode } : 'skip'
  );
}

export function useLinkReportToStudent() {
  return useMutation(convexApi.functions.linkReportToStudent);
}

export function useGetTeacherReports(teacherId: string | null) {
  return useQuery(
    convexApi.functions.getTestResults,
    teacherId ? { teacherId } : 'skip'
  );
}

export function useGetStudentReports(studentId: string | null) {
  return useQuery(
    convexApi.functions.getStudentReports,
    studentId ? { studentId } : 'skip'
  );
}

export function useGetReportsByCode(reportCode: string | null) {
  return useQuery(
    convexApi.functions.getReportsByCode,
    reportCode ? { reportCode } : 'skip'
  );
}

export function useGenerateUploadUrl() {
  return useMutation(convexApi.functions.generateUploadUrl);
}

export function useGetFileUrl(storageId: string | undefined | null) {
  return useQuery(
    convexApi.functions.getFileUrl,
    storageId ? { storageId: storageId as any } : 'skip'
  );
}

