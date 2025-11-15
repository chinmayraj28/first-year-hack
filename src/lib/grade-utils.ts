/**
 * Grade utility functions
 */

// Grades that use questionnaire (LKG to Grade 2)
const QUESTIONNAIRE_GRADES = ['LKG', 'UKG', '1st Grade', '1st', 'Grade 1', '2nd Grade', '2nd', 'Grade 2'];

// Grades that use marks + 5-factor assessment (Grade 6+)
const MARKS_ASSESSMENT_GRADES = ['6th Grade', '6th', 'Grade 6', '7th Grade', '7th', 'Grade 7', '8th Grade', '8th', 'Grade 8', 
  '9th Grade', '9th', 'Grade 9', '10th Grade', '10th', 'Grade 10', '11th Grade', '11th', 'Grade 11', 
  '12th Grade', '12th', 'Grade 12'];

/**
 * Check if a grade uses questionnaire (LKG-Grade 2)
 */
export function isQuestionnaireGrade(grade: string): boolean {
  const normalizedGrade = grade.trim();
  return QUESTIONNAIRE_GRADES.some(g => 
    normalizedGrade.toLowerCase().includes(g.toLowerCase())
  );
}

/**
 * Check if a grade uses marks + 5-factor assessment (Grade 6+)
 */
export function isMarksAssessmentGrade(grade: string): boolean {
  const normalizedGrade = grade.trim();
  return MARKS_ASSESSMENT_GRADES.some(g => 
    normalizedGrade.toLowerCase().includes(g.toLowerCase())
  );
}

/**
 * Extract numeric grade level for API
 */
export function extractGradeNumber(grade: string): number | null {
  const match = grade.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

