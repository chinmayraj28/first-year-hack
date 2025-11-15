import { 
  ExamAttempt, 
  StudentProfile, 
  SkillAssessment, 
  SubjectAnalysis, 
  CompetencyArea,
  LearningRecommendation,
  Question
} from '@/types';

export class AnalysisEngine {
  /**
   * Analyzes a student's performance across all their exam attempts
   */
  static analyzeStudentPerformance(attempts: ExamAttempt[], questions: Question[]): StudentProfile['skillsMatrix'] {
    const skillsMap = new Map<string, {
      totalAttempted: number;
      totalCorrect: number;
      totalTime: number;
      scores: number[];
    }>();

    // Aggregate data by skill
    attempts.forEach(attempt => {
      attempt.answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (!question) return;

        question.skillsAssessed.forEach(skill => {
          if (!skillsMap.has(skill)) {
            skillsMap.set(skill, {
              totalAttempted: 0,
              totalCorrect: 0,
              totalTime: 0,
              scores: []
            });
          }

          const skillData = skillsMap.get(skill)!;
          skillData.totalAttempted++;
          skillData.totalTime += answer.timeSpent;

          // Calculate if answer was correct (simplified)
          const isCorrect = this.isAnswerCorrect(answer.answer, question);
          if (isCorrect) {
            skillData.totalCorrect++;
            skillData.scores.push(1);
          } else {
            skillData.scores.push(0);
          }
        });
      });
    });

    // Convert to SkillAssessment array
    return Array.from(skillsMap.entries()).map(([skillName, data]) => {
      const recentScores = data.scores.slice(-5); // Last 5 attempts
      const previousScores = data.scores.slice(-10, -5); // Previous 5 attempts
      
      const recentAverage = recentScores.length > 0 ? 
        recentScores.reduce((a, b) => a + b, 0) / recentScores.length : 0;
      const previousAverage = previousScores.length > 0 ? 
        previousScores.reduce((a, b) => a + b, 0) / previousScores.length : 0;
      
      const improvement = previousScores.length > 0 ? 
        ((recentAverage - previousAverage) / previousAverage) * 100 : 0;

      return {
        skillName,
        proficiencyLevel: (data.totalCorrect / data.totalAttempted) * 100,
        questionsAttempted: data.totalAttempted,
        questionsCorrect: data.totalCorrect,
        averageTimePerQuestion: data.totalTime / data.totalAttempted,
        improvement
      };
    });
  }

  /**
   * Identifies student's competency areas (strengths and weaknesses)
   */
  static identifyCompetencyAreas(skillsMatrix: SkillAssessment[], attempts: ExamAttempt[]): CompetencyArea[] {
    return skillsMatrix.map(skill => {
      let category: 'strength' | 'developing' | 'weakness';
      
      if (skill.proficiencyLevel >= 80) {
        category = 'strength';
      } else if (skill.proficiencyLevel >= 60) {
        category = 'developing';
      } else {
        category = 'weakness';
      }

      return {
        name: skill.skillName,
        category,
        score: skill.proficiencyLevel,
        evidence: [], // Would be populated with specific exam evidence
        recommendations: this.generateSkillRecommendations(skill, category)
      };
    });
  }

  /**
   * Analyzes performance by subject
   */
  static analyzeBySubject(attempts: ExamAttempt[], questions: Question[]): SubjectAnalysis[] {
    const subjectMap = new Map<string, {
      totalScore: number;
      maxScore: number;
      topicData: Map<string, {
        score: number;
        maxScore: number;
        questionsAttempted: number;
        timeSpent: number;
        skills: Set<string>;
      }>;
    }>();

    attempts.forEach(attempt => {
      attempt.answers.forEach(answer => {
        const question = questions.find(q => q.id === answer.questionId);
        if (!question) return;

        if (!subjectMap.has(question.subject)) {
          subjectMap.set(question.subject, {
            totalScore: 0,
            maxScore: 0,
            topicData: new Map()
          });
        }

        const subjectData = subjectMap.get(question.subject)!;
        const isCorrect = this.isAnswerCorrect(answer.answer, question);
        const score = isCorrect ? question.maxMarks : 0;

        subjectData.totalScore += score;
        subjectData.maxScore += question.maxMarks;

        // Topic level analysis
        if (!subjectData.topicData.has(question.topic)) {
          subjectData.topicData.set(question.topic, {
            score: 0,
            maxScore: 0,
            questionsAttempted: 0,
            timeSpent: 0,
            skills: new Set()
          });
        }

        const topicData = subjectData.topicData.get(question.topic)!;
        topicData.score += score;
        topicData.maxScore += question.maxMarks;
        topicData.questionsAttempted++;
        topicData.timeSpent += answer.timeSpent;
        question.skillsAssessed.forEach(skill => topicData.skills.add(skill));
      });
    });

    return Array.from(subjectMap.entries()).map(([subjectName, data]) => {
      const overallScore = (data.totalScore / data.maxScore) * 100;
      const topicBreakdown = Array.from(data.topicData.entries()).map(([topicName, topicData]) => ({
        topicName,
        score: (topicData.score / topicData.maxScore) * 100,
        questionsAttempted: topicData.questionsAttempted,
        timeSpent: topicData.timeSpent,
        skillsAssessed: [] as SkillAssessment[] // Would be populated with topic-specific skills
      }));

      // Identify strengths and weaknesses
      const strengths = topicBreakdown
        .filter(topic => topic.score >= 80)
        .map(topic => topic.topicName);
      
      const weaknesses = topicBreakdown
        .filter(topic => topic.score < 60)
        .map(topic => topic.topicName);

      return {
        subjectName,
        overallScore,
        topicBreakdown,
        strengths,
        weaknesses,
        recommendations: this.generateSubjectRecommendations(overallScore, strengths, weaknesses)
      };
    });
  }

  /**
   * Generates personalized learning recommendations
   */
  static generateRecommendations(
    competencyAreas: CompetencyArea[], 
    subjectAnalyses: SubjectAnalysis[]
  ): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = [];

    // High priority - Address weaknesses
    competencyAreas
      .filter(area => area.category === 'weakness')
      .forEach(area => {
        recommendations.push({
          type: 'remediate',
          priority: 'high',
          subject: 'General', // Would be more specific in real implementation
          topic: area.name,
          description: `Focus on improving ${area.name} skills through targeted practice`,
          estimatedTime: 60,
          resources: [
            {
              type: 'exercise',
              title: `${area.name} Practice Exercises`
            }
          ]
        });
      });

    // Medium priority - Develop developing areas
    competencyAreas
      .filter(area => area.category === 'developing')
      .forEach(area => {
        recommendations.push({
          type: 'practice',
          priority: 'medium',
          subject: 'General',
          topic: area.name,
          description: `Continue practicing ${area.name} to reach mastery level`,
          estimatedTime: 30,
          resources: [
            {
              type: 'quiz',
              title: `${area.name} Assessment Quiz`
            }
          ]
        });
      });

    return recommendations;
  }

  /**
   * Helper method to check if an answer is correct
   */
  private static isAnswerCorrect(studentAnswer: string | string[], question: Question): boolean {
    if (!question.correctAnswer) return false;
    
    if (Array.isArray(question.correctAnswer)) {
      if (Array.isArray(studentAnswer)) {
        return question.correctAnswer.every(ans => studentAnswer.includes(ans));
      }
      return question.correctAnswer.includes(studentAnswer as string);
    }
    
    return question.correctAnswer.toLowerCase() === (studentAnswer as string).toLowerCase();
  }

  /**
   * Generate skill-specific recommendations
   */
  private static generateSkillRecommendations(skill: SkillAssessment, category: string): string[] {
    if (category === 'weakness') {
      return [
        `Practice more questions focusing on ${skill.skillName}`,
        `Review fundamental concepts related to ${skill.skillName}`,
        `Seek additional help or tutoring for ${skill.skillName}`
      ];
    } else if (category === 'developing') {
      return [
        `Continue practicing ${skill.skillName} regularly`,
        `Try more challenging questions in ${skill.skillName}`,
        `Apply ${skill.skillName} to real-world scenarios`
      ];
    } else {
      return [
        `Maintain proficiency in ${skill.skillName}`,
        `Help peers with ${skill.skillName} concepts`,
        `Explore advanced applications of ${skill.skillName}`
      ];
    }
  }

  /**
   * Generate subject-specific recommendations
   */
  private static generateSubjectRecommendations(
    overallScore: number, 
    strengths: string[], 
    weaknesses: string[]
  ): string[] {
    const recommendations = [];
    
    if (overallScore < 60) {
      recommendations.push('Schedule regular review sessions for this subject');
      recommendations.push('Focus on understanding fundamental concepts');
    }
    
    if (weaknesses.length > 0) {
      recommendations.push(`Pay special attention to: ${weaknesses.join(', ')}`);
    }
    
    if (strengths.length > 0) {
      recommendations.push(`Leverage your strengths in: ${strengths.join(', ')}`);
    }
    
    return recommendations;
  }
}
