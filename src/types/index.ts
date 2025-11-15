// Student and User Types
export interface Student {
  id: string;
  name: string;
  email: string;
  grade: string;
  dateOfBirth?: string;
  enrollmentDate: string;
}

// Subject and Topic Types
export interface Subject {
  id: string;
  name: string;
  description?: string;
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  subjectId: string;
  skillsRequired: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Question and Exam Types
export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'short-answer' | 'essay' | 'fill-in-blank';
  subject: string;
  topic: string;
  skillsAssessed: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  maxMarks: number;
  options?: string[]; // For multiple choice
  correctAnswer?: string | string[]; // For objective questions
  rubric?: GradingRubric; // For subjective questions
}

export interface GradingRubric {
  criteria: {
    name: string;
    description: string;
    maxPoints: number;
  }[];
}

export interface Exam {
  id: string;
  title: string;
  description?: string;
  subject: string;
  duration: number; // in minutes
  totalMarks: number;
  questions: Question[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

// Answer and Response Types
export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
  timeSpent: number; // in seconds
  confidence?: number; // 1-5 scale
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  startTime: string;
  endTime?: string;
  status: 'in-progress' | 'completed' | 'abandoned';
  answers: StudentAnswer[];
  totalScore?: number;
  maxScore: number;
}

// Analysis and Assessment Types
export interface SkillAssessment {
  skillName: string;
  proficiencyLevel: number; // 0-100
  questionsAttempted: number;
  questionsCorrect: number;
  averageTimePerQuestion: number;
  improvement: number; // percentage change from previous assessments
}

export interface SubjectAnalysis {
  subjectName: string;
  overallScore: number;
  topicBreakdown: {
    topicName: string;
    score: number;
    questionsAttempted: number;
    timeSpent: number;
    skillsAssessed: SkillAssessment[];
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface StudentProfile {
  student: Student;
  overallGPA: number;
  subjectAnalyses: SubjectAnalysis[];
  skillsMatrix: SkillAssessment[];
  learningPattern: {
    preferredDifficulty: 'easy' | 'medium' | 'hard';
    averageSessionTime: number;
    peakPerformanceTime: string; // time of day
    consistencyScore: number; // 0-100
  };
  recentExamAttempts: ExamAttempt[];
  progressTrend: {
    date: string;
    overallScore: number;
    subjectScores: { [subject: string]: number };
  }[];
}

// Analytics Types
export interface PerformanceMetrics {
  accuracy: number;
  speed: number; // questions per minute
  consistency: number;
  improvement: number;
}

export interface CompetencyArea {
  name: string;
  category: 'strength' | 'developing' | 'weakness';
  score: number;
  evidence: {
    examId: string;
    questionIds: string[];
    performance: number;
  }[];
  recommendations: string[];
}

export interface LearningRecommendation {
  type: 'practice' | 'review' | 'advance' | 'remediate';
  priority: 'high' | 'medium' | 'low';
  subject: string;
  topic: string;
  description: string;
  estimatedTime: number; // in minutes
  resources?: {
    type: 'video' | 'article' | 'exercise' | 'quiz';
    title: string;
    url?: string;
  }[];
}
