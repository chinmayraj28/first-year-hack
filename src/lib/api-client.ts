/**
 * API client for SproutSense AI Analysis Backend
 * Base URL: https://7fg18gc3-8000.uks1.devtunnels.ms
 */

// Use Next.js API route as proxy to avoid CORS issues
const API_PROXY_URL = '/api/analyze';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Advanced analysis for Grade 6+ students
 * Maps the 5 factors to API parameters
 */
export interface AdvancedAnalysisRequest {
  studentId?: string;
  studentName: string;
  grade: string;
  academicYear?: string;
  subjectAssessments: Array<{
    subjectName: string;
    obtainedMarks: number;
    totalMarks?: number;
    assessmentParameters: {
      conceptualUnderstanding: number; // 1-5
      recall: number; // 1-5
      logicalReasoning: number; // 1-5
      attemptsBonusQuestions: number; // 1-5
      effortNonConservative: number; // 1-5
    };
  }>;
}

/**
 * Questionnaire data for LKG-Grade 2
 */
export interface QuestionnaireData {
  studentName: string;
  grade: string;
  responses: Array<{
    question: string;
    score: number; // 1-5
  }>;
}

/**
 * Call advanced analysis API for Grade 6+ students
 */
export async function analyzeAdvancedAssessment(
  request: AdvancedAnalysisRequest
): Promise<ApiResponse<any>> {
  try {
    // Map our 5 factors to API format
    // API expects: applicationBasedQuestions, theoryQuestions, effortPutIn, problemSolvingCaseStudy, recallQuestions
    // Our factors: conceptualUnderstanding, recall, logicalReasoning, attemptsBonusQuestions, effortNonConservative
    // Generate a studentId if not provided (API requires it)
    const studentId = request.studentId || `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const apiRequest = {
      studentId, // API requires this field
      studentName: request.studentName,
      grade: extractGradeNumber(request.grade)?.toString() || request.grade,
      academicYear: request.academicYear || `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
      subjectAssessments: request.subjectAssessments.map((subj, index) => ({
        subjectId: `subject-${Date.now()}-${index}`, // API requires subjectId
        subjectName: subj.subjectName,
        obtainedMarks: subj.obtainedMarks,
        totalMarks: subj.totalMarks || 100, // API requires totalMarks, default to 100 if not provided
        assessmentParameters: {
          applicationBasedQuestions: subj.assessmentParameters.conceptualUnderstanding,
          theoryQuestions: subj.assessmentParameters.attemptsBonusQuestions, // Map attemptsBonusQuestions to theoryQuestions
          effortPutIn: subj.assessmentParameters.effortNonConservative,
          problemSolvingCaseStudy: subj.assessmentParameters.logicalReasoning,
          recallQuestions: subj.assessmentParameters.recall,
        },
      })),
    };

    console.log('[API] Calling analysis endpoint via proxy:', API_PROXY_URL);
    console.log('[API] Request payload:', JSON.stringify(apiRequest, null, 2));

    // Use Next.js API route as proxy to avoid CORS issues
    const response = await fetch(API_PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest),
    });

    console.log('[API] Response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        errorData = { error: text || `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('[API] Error response:', errorData);
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log('[API] Success response:', data);
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('[API] Fetch error:', error);
    return {
      success: false,
      error: error.message || 'Failed to call analysis API',
    };
  }
}

/**
 * Extract numeric grade from grade string
 */
function extractGradeNumber(grade: string): number | null {
  const match = grade.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Health check
 */
export async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch('https://7fg18gc3-8000.uks1.devtunnels.ms/api/v1/health');
    return response.ok;
  } catch {
    return false;
  }
}

