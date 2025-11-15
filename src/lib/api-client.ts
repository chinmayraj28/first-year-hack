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
 * Questionnaire data for LKG-Grade 2 (Early Childhood)
 */
export interface QuestionnaireData {
  studentName: string;
  age?: number;
  grade: string;
  responses: Array<{
    question: string;
    score: number; // 1-5
  }>;
}

/**
 * Call questionnaire analysis API for Early Childhood students (below 6th grade)
 * Uses /api/v1/analysis/game-based endpoint with questionnaire format
 */
export async function analyzeQuestionnaireAssessment(
  request: QuestionnaireData
): Promise<ApiResponse<any>> {
  try {
    // Generate a studentId if not provided (API requires it)
    const studentId = `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Extract age from grade if not provided (estimate based on grade)
    let age = request.age;
    if (!age) {
      const gradeNum = extractGradeNumber(request.grade);
      if (gradeNum !== null) {
        age = gradeNum + 5; // Rough estimate: grade + 5 years
      } else {
        // For LKG/UKG, estimate age
        if (request.grade.toLowerCase().includes('lkg')) age = 4;
        else if (request.grade.toLowerCase().includes('ukg')) age = 5;
        else age = 6; // Default for Grade 1-2
      }
    }

    // Convert questionnaire responses to API format
    // The API expects gameResults and answers format
    // We'll map questionnaire scores to game-like results
    const apiRequest = {
      studentName: request.studentName,
      age: age,
      grade: extractGradeNumber(request.grade)?.toString() || request.grade.replace(/[^0-9]/g, '') || '1',
      gameResults: request.responses.map((response, index) => ({
        game: `Questionnaire Item ${index + 1}`,
        score: (response.score / 5) * 100, // Convert 1-5 scale to 0-100
        accuracy: (response.score / 5) * 100,
        reactionTime: 0, // Not applicable for questionnaire
        attempts: 1,
        timeSpent: 0,
        mistakes: response.score < 3 ? [{
          type: 'assessment',
          description: `Score below average for: ${response.question}`
        }] : []
      })),
      answers: request.responses.map((response) => ({
        subject: 'Early Childhood Assessment',
        topic: 'Questionnaire',
        question: response.question,
        answer: `${response.score}/5`
      }))
    };

    console.log('[API] Calling questionnaire analysis endpoint via proxy:', API_PROXY_URL);
    console.log('[API] Questionnaire request payload:', JSON.stringify(apiRequest, null, 2));

    // Use Next.js API route as proxy, but we need to route to game-based endpoint
    // Update proxy to handle questionnaire requests
    const response = await fetch('/api/analyze/questionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequest),
    });

    console.log('[API] Questionnaire response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        const text = await response.text();
        errorData = { error: text || `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('[API] Questionnaire error response:', errorData);
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();
    console.log('[API] Questionnaire success response:', data);
    return {
      success: true,
      data,
    };
  } catch (error: any) {
    console.error('[API] Questionnaire fetch error:', error);
    return {
      success: false,
      error: error.message || 'Failed to call questionnaire analysis API',
    };
  }
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

