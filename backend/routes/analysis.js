const express = require('express');
const { Ollama } = require('ollama');
const Joi = require('joi');
const router = express.Router();

// Initialize Ollama client
const ollama = new Ollama({ 
  host: process.env.OLLAMA_BASE_URL || 'http://localhost:11434' 
});

// Validation schemas
const gameAnalysisSchema = Joi.object({
  studentName: Joi.string().required(),
  age: Joi.number().integer().min(3).max(18).required(),
  grade: Joi.string().required(),
  gameResults: Joi.array().items(
    Joi.object({
      game: Joi.string().required(),
      score: Joi.number().min(0).max(100).required(),
      accuracy: Joi.number().min(0).max(100).required(),
      reactionTime: Joi.number().min(0).required(),
      attempts: Joi.number().integer().min(0).required(),
      timeSpent: Joi.number().min(0).required(),
      mistakes: Joi.array().items(
        Joi.object({
          type: Joi.string().required(),
          description: Joi.string().required()
        })
      ).required()
    })
  ).required(),
  answers: Joi.array().items(
    Joi.object({
      subject: Joi.string().required(),
      topic: Joi.string().required(),
      question: Joi.string().required(),
      answer: Joi.string().required()
    })
  ).optional()
});

const advancedAnalysisSchema = Joi.object({
  studentId: Joi.string().required(),
  studentName: Joi.string().required(),
  grade: Joi.string().pattern(/^(6|7|8|9|10|11|12)$/).required(),
  academicYear: Joi.string().required(),
  subjectAssessments: Joi.array().items(
    Joi.object({
      subjectId: Joi.string().required(),
      subjectName: Joi.string().required(),
      totalMarks: Joi.number().valid(100).required(),
      obtainedMarks: Joi.number().min(0).max(100).required(),
      assessmentParameters: Joi.object({
        applicationBasedQuestions: Joi.number().integer().min(1).max(5).required(),
        theoryQuestions: Joi.number().integer().min(1).max(5).required(),
        effortPutIn: Joi.number().integer().min(1).max(5).required(),
        problemSolvingCaseStudy: Joi.number().integer().min(1).max(5).required(),
        recallQuestions: Joi.number().integer().min(1).max(5).required()
      }).required()
    })
  ).required()
});

const earlyChildhoodAnalysisSchema = Joi.object({
  studentName: Joi.string().required(),
  age: Joi.number().integer().min(3).max(7).required(),
  grade: Joi.string().valid('LKG', 'UKG', '1', '2').required(),
  teacherName: Joi.string().required(),
  assessmentDate: Joi.string().required(),
  developmentalAssessment: Joi.object({
    attentionAndImpulseControl: Joi.object({
      questions: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          text: Joi.string().required(),
          score: Joi.number().integer().min(1).max(5).required()
        })
      ).length(5).required() // Updated to 5 questions
    }).required(),
    languageAndCommunication: Joi.object({
      questions: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          text: Joi.string().required(),
          score: Joi.number().integer().min(1).max(5).required()
        })
      ).length(5).required() // Updated to 5 questions
    }).required(),
    cognitiveAndLearningSkills: Joi.object({
      questions: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          text: Joi.string().required(),
          score: Joi.number().integer().min(1).max(5).required()
        })
      ).length(5).required() // Updated to 5 questions
    }).required(),
    motorSkills: Joi.object({
      questions: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          text: Joi.string().required(),
          score: Joi.number().integer().min(1).max(5).required()
        })
      ).length(8).required() // Updated to 8 questions
    }).required(),
    socialAndEmotionalSkills: Joi.object({
      questions: Joi.array().items(
        Joi.object({
          id: Joi.number().integer().required(),
          text: Joi.string().required(),
          score: Joi.number().integer().min(1).max(5).required()
        })
      ).length(11).required() // Updated to 11 questions
    }).required()
  }).required()
});

/**
 * @route POST /api/v1/analysis/game-based
 * @desc Analyze student performance based on game results (Grades 1-12)
 * @access Public
 */
router.post('/game-based', async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = gameAnalysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const data = value;

    // Construct detailed prompt for AI analysis
    const analysisPrompt = `
You are an expert educational psychologist and career counselor specializing in early childhood learning assessment. Analyze the following student data and provide comprehensive insights.

STUDENT INFORMATION:
- Name: ${data.studentName}
- Age: ${data.age}
- Grade: ${data.grade}

ASSESSMENT RESULTS:
${data.gameResults.map(result => `
Game: ${result.game}
- Score: ${result.score}%
- Accuracy: ${result.accuracy}%
- Reaction Time: ${result.reactionTime}ms
- Attempts: ${result.attempts}
- Time Spent: ${result.timeSpent}s
- Common Mistakes: ${result.mistakes.map(m => m.description).join(', ')}
`).join('\n')}

${data.answers ? `
WRITTEN RESPONSES:
${data.answers.map(answer => `
Subject: ${answer.subject} (${answer.topic})
Q: ${answer.question}
A: ${answer.answer}
`).join('\n')}
` : ''}

Provide detailed analysis in JSON format with the following structure:
{
  "strengths": ["list of student strengths"],
  "weaknesses": ["list of areas for improvement"],
  "skillsets": {
    "cognitive": 0-100,
    "linguistic": 0-100,
    "mathematical": 0-100,
    "visual_spatial": 0-100,
    "attention_focus": 0-100,
    "memory": 0-100,
    "processing_speed": 0-100
  },
  "careerRecommendations": [
    {
      "field": "career field",
      "description": "detailed description",
      "alignment": 0-100,
      "requiredSkills": ["skill1", "skill2"]
    }
  ],
  "subjectRecommendations": [
    {
      "subject": "subject name",
      "focus_areas": ["area1", "area2"],
      "priority": "high|medium|low"
    }
  ],
  "learningProfile": {
    "learning_style": "description",
    "preferred_pace": "description",
    "attention_span": "description",
    "motivation_factors": ["factor1", "factor2"]
  },
  "developmentPlan": {
    "immediate_actions": ["action1", "action2"],
    "short_term_goals": ["goal1", "goal2"],
    "long_term_objectives": ["objective1", "objective2"]
  }
}`;

    console.log('Sending game-based analysis request to Ollama...');
    
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational counselor. Provide detailed, structured analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    });

    // Parse AI response
    let analysisResult;
    try {
      const aiResponse = response.message.content;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const cleanJson = jsonMatch[0];
      analysisResult = JSON.parse(cleanJson);

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Generate fallback analysis
      analysisResult = generateGameBasedFallbackAnalysis(data);
    }

    // Add metadata
    const finalResult = {
      ...analysisResult,
      metadata: {
        analysis_date: new Date().toISOString(),
        model_used: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
        student_name: data.studentName,
        analysis_type: 'game-based',
        confidence_score: Math.min(95, Math.max(75, 85))
      }
    };

    res.json({
      success: true,
      data: finalResult
    });

  } catch (error) {
    console.error('Error in game-based AI analysis:', error);
    next(error);
  }
});

/**
 * @route POST /api/v1/analysis/advanced
 * @desc Analyze student performance based on subject marks (Grades 6-12)
 * @access Public
 */
router.post('/advanced', async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = advancedAnalysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const data = value;

    // Calculate overall percentage
    const totalMarks = data.subjectAssessments.reduce((sum, subject) => sum + subject.obtainedMarks, 0);
    const totalPossibleMarks = data.subjectAssessments.length * 100;
    const overallPercentage = (totalMarks / totalPossibleMarks) * 100;

    // Construct detailed prompt for AI analysis
    const analysisPrompt = `
You are an expert educational counselor and career guidance specialist. Analyze the following detailed academic performance data for a Grade ${data.grade} student and provide comprehensive insights.

STUDENT INFORMATION:
- Name: ${data.studentName}
- Grade: ${data.grade}
- Academic Year: ${data.academicYear}
- Overall Percentage: ${overallPercentage.toFixed(2)}%

SUBJECT-WISE PERFORMANCE:
${data.subjectAssessments.map(subject => `
Subject: ${subject.subjectName}
- Marks: ${subject.obtainedMarks}/100 (${((subject.obtainedMarks / subject.totalMarks) * 100).toFixed(1)}%)
- Application-Based Questions: ${subject.assessmentParameters.applicationBasedQuestions}/5
- Theory Questions: ${subject.assessmentParameters.theoryQuestions}/5
- Effort Put In: ${subject.assessmentParameters.effortPutIn}/5
- Problem Solving & Case Study: ${subject.assessmentParameters.problemSolvingCaseStudy}/5
- Recall Questions: ${subject.assessmentParameters.recallQuestions}/5
`).join('\n')}

Provide detailed analysis in JSON format with the following structure:
{
  "overallPerformance": {
    "totalPercentage": ${overallPercentage.toFixed(2)},
    "strengthAreas": ["list of subject areas where student excels"],
    "improvementAreas": ["list of areas needing attention"],
    "careerRecommendations": [
      {
        "field": "career field name",
        "suitabilityScore": 85,
        "requiredSubjects": ["list of important subjects"],
        "reasoning": "detailed explanation",
        "futureProspects": ["list of future opportunities"]
      }
    ],
    "studyPlan": {
      "immediateActions": ["actions for next 1-2 months"],
      "shortTermGoals": ["goals for next 6 months"],
      "longTermGoals": ["goals for next 1-2 years"],
      "recommendedResources": [
        {
          "type": "book",
          "title": "resource title",
          "description": "description"
        }
      ]
    }
  },
  "subjectAnalysis": [
    {
      "subjectName": "subject name",
      "percentage": 85.5,
      "grade": "A",
      "strengths": ["specific strengths in this subject"],
      "improvements": ["areas to improve"],
      "parameterAnalysis": {
        "applicationBased": {
          "score": 4,
          "feedback": "specific feedback on application skills"
        },
        "theory": {
          "score": 3,
          "feedback": "feedback on theoretical understanding"
        },
        "effort": {
          "score": 5,
          "feedback": "feedback on effort and engagement"
        },
        "problemSolving": {
          "score": 4,
          "feedback": "feedback on analytical skills"
        },
        "recall": {
          "score": 3,
          "feedback": "feedback on memory and retention"
        }
      }
    }
  ],
  "careerGuidance": {
    "topRecommendations": [
      {
        "field": "Engineering",
        "suitabilityScore": 88,
        "requiredSubjects": ["Mathematics", "Physics", "Chemistry"],
        "reasoning": "Strong performance in STEM subjects with excellent problem-solving skills",
        "futureProspects": ["Software Engineer", "Mechanical Engineer", "Data Scientist"]
      }
    ],
    "streamSuggestions": [
      {
        "stream": "Science",
        "suitability": 85,
        "reasoning": "Strong STEM performance indicates aptitude for science stream",
        "subjects": ["Physics", "Chemistry", "Mathematics", "Biology"]
      }
    ],
    "skillGaps": ["areas where student needs development"]
  },
  "studyRecommendations": {
    "prioritySubjects": ["subjects needing immediate attention"],
    "improvementStrategies": ["specific study strategies"],
    "resourceRecommendations": ["recommended books, courses, tools"]
  }
}`;

    console.log('Sending advanced analysis request to Ollama...');
    
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educational counselor. Provide detailed, structured analysis in valid JSON format only.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      options: {
        temperature: 0.7,
        top_p: 0.9,
      }
    });

    // Parse AI response
    let analysisResult;
    try {
      const aiResponse = response.message.content;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const cleanJson = jsonMatch[0];
      analysisResult = JSON.parse(cleanJson);

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Generate fallback analysis
      analysisResult = generateAdvancedFallbackAnalysis(data, overallPercentage);
    }

    // Add metadata
    const finalResult = {
      ...analysisResult,
      metadata: {
        analysis_date: new Date().toISOString(),
        model_used: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
        student_id: data.studentId,
        analysis_type: 'advanced',
        confidence_score: Math.min(95, Math.max(75, overallPercentage + 10))
      }
    };

    res.json({
      success: true,
      data: finalResult
    });

  } catch (error) {
    console.error('Error in advanced AI analysis:', error);
    next(error);
  }
});

/**
 * @route POST /api/v1/analysis/early-childhood
 * @desc Analyze early childhood developmental assessment (Ages 3-7)
 * @access Public
 */
router.post('/early-childhood', async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = earlyChildhoodAnalysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: error.details[0].message
      });
    }

    const data = value;

    // Calculate section averages
    const sections = data.developmentalAssessment;
    const sectionAverages = {
      attentionAndImpulseControl: sections.attentionAndImpulseControl.questions.reduce((sum, q) => sum + q.score, 0) / sections.attentionAndImpulseControl.questions.length,
      languageAndCommunication: sections.languageAndCommunication.questions.reduce((sum, q) => sum + q.score, 0) / sections.languageAndCommunication.questions.length,
      cognitiveAndLearningSkills: sections.cognitiveAndLearningSkills.questions.reduce((sum, q) => sum + q.score, 0) / sections.cognitiveAndLearningSkills.questions.length,
      motorSkills: sections.motorSkills.questions.reduce((sum, q) => sum + q.score, 0) / sections.motorSkills.questions.length,
      socialAndEmotionalSkills: sections.socialAndEmotionalSkills.questions.reduce((sum, q) => sum + q.score, 0) / sections.socialAndEmotionalSkills.questions.length
    };

    // Construct detailed prompt for AI analysis
    const analysisPrompt = `
You are an expert developmental pediatric psychologist and early childhood educator specializing in developmental screening for ages 3-7. Analyze this comprehensive teacher assessment data and provide detailed developmental insights.

CHILD INFORMATION:
- Name: ${data.studentName}
- Age: ${data.age} years
- Grade: ${data.grade}
- Teacher: ${data.teacherName}
- Assessment Date: ${data.assessmentDate}

DEVELOPMENTAL ASSESSMENT RESULTS (1-5 scale, 5 = always/excellent, 1 = never/poor):

ATTENTION & IMPULSE CONTROL (Average: ${sectionAverages.attentionAndImpulseControl.toFixed(2)}):
${sections.attentionAndImpulseControl.questions.map(q => `- ${q.text}: ${q.score}/5`).join('\n')}

LANGUAGE & COMMUNICATION (Average: ${sectionAverages.languageAndCommunication.toFixed(2)}):
${sections.languageAndCommunication.questions.map(q => `- ${q.text}: ${q.score}/5`).join('\n')}

COGNITIVE & LEARNING SKILLS (Average: ${sectionAverages.cognitiveAndLearningSkills.toFixed(2)}):
${sections.cognitiveAndLearningSkills.questions.map(q => `- ${q.text}: ${q.score}/5`).join('\n')}

MOTOR SKILLS (Average: ${sectionAverages.motorSkills.toFixed(2)}):
${sections.motorSkills.questions.map(q => `- ${q.text}: ${q.score}/5`).join('\n')}

SOCIAL & EMOTIONAL SKILLS (Average: ${sectionAverages.socialAndEmotionalSkills.toFixed(2)}):
${sections.socialAndEmotionalSkills.questions.map(q => `- ${q.text}: ${q.score}/5`).join('\n')}

Provide comprehensive developmental analysis in JSON format with this exact structure:
{
  "developmentalProfile": {
    "overallDevelopmentLevel": "age-appropriate/below-age-appropriate/above-age-appropriate/age-appropriate-with-concerns",
    "developmentalAge": "estimated age in years.months",
    "chronologicalAge": "${data.age}.0 years",
    "areasOfStrength": ["specific strengths identified"],
    "areasOfConcern": ["specific areas needing attention"]
  },
  "riskAssessment": {
    "adhdRisk": {
      "riskLevel": "low/moderate/high",
      "confidence": 0-100,
      "indicators": ["specific behavioral indicators"],
      "score": 0-50,
      "threshold": 30,
      "recommendation": "specific next steps"
    },
    "dyslexiaRisk": {
      "riskLevel": "low/moderate/high", 
      "confidence": 0-100,
      "indicators": ["pre-literacy indicators"],
      "score": 0-50,
      "threshold": 25,
      "recommendation": "specific next steps"
    },
    "dysgraphiaRisk": {
      "riskLevel": "low/moderate/high",
      "confidence": 0-100,
      "indicators": ["fine motor/writing indicators"],
      "score": 0-50,
      "threshold": 20,
      "recommendation": "specific next steps"
    },
    "intellectualDisabilityRisk": {
      "riskLevel": "low/moderate/high",
      "confidence": 0-100,
      "indicators": ["cognitive indicators"],
      "score": 0-50,
      "threshold": 25,
      "recommendation": "specific next steps"
    },
    "autismRisk": {
      "riskLevel": "low/moderate/high",
      "confidence": 0-100,
      "indicators": ["social communication indicators"],
      "score": 0-50,
      "threshold": 30,
      "recommendation": "specific next steps"
    },
    "childhoodApraxiaOfSpeechRisk": {
      "riskLevel": "low/moderate/high",
      "confidence": 0-100,
      "indicators": ["speech motor indicators"],
      "score": 0-50,
      "threshold": 25,
      "recommendation": "specific next steps"
    }
  },
  "sectionAnalysis": [
    {
      "section": "Attention and Impulse Control",
      "averageScore": ${sectionAverages.attentionAndImpulseControl.toFixed(1)},
      "maxScore": 5.0,
      "percentile": "estimated percentile",
      "interpretation": "detailed interpretation",
      "keyFindings": ["specific observations"],
      "developmentalConcerns": ["concerns identified"]
    }
  ],
  "interventionPlan": {
    "immediateActions": ["specific actions for next 1-2 weeks"],
    "shortTermGoals": ["goals for next 1-3 months"], 
    "longTermObjectives": ["objectives for next 6-12 months"],
    "recommendedServices": [
      {
        "service": "specific service name",
        "priority": "low/medium/high",
        "frequency": "frequency recommendation",
        "duration": "expected duration",
        "focus": "specific focus areas"
      }
    ]
  },
  "parentRecommendations": {
    "homeActivities": ["specific activities parents can do"],
    "environmentalSupports": ["home environment modifications"],
    "monitoringGuidelines": ["what to observe and track"]
  },
  "followUpPlan": {
    "reassessmentRecommended": "timeframe for next assessment",
    "professionalReferrals": ["specific professionals to consult"],
    "progressIndicators": ["signs of improvement to watch for"]
  }
}

IMPORTANT: Base risk scores on developmental norms for ${data.age}-year-olds. Lower average scores indicate higher risk. Use evidence-based thresholds.`;

    console.log('Sending early childhood developmental analysis request to Ollama...');
    
    const response = await ollama.chat({
      model: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
      messages: [
        {
          role: 'system',
          content: 'You are an expert developmental pediatric psychologist. Provide detailed, evidence-based analysis in valid JSON format only. Focus on early identification and intervention.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      options: {
        temperature: 0.6,
        top_p: 0.8,
      }
    });

    // Parse AI response
    let analysisResult;
    try {
      const aiResponse = response.message.content;
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const cleanJson = jsonMatch[0];
      analysisResult = JSON.parse(cleanJson);

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Generate fallback analysis
      analysisResult = generateEarlyChildhoodFallbackAnalysis(data, sectionAverages);
    }

    // Add metadata
    const finalResult = {
      ...analysisResult,
      metadata: {
        analysis_date: new Date().toISOString(),
        model_used: process.env.OLLAMA_MODEL || 'gpt-oss:20b',
        student_name: data.studentName,
        analysis_type: 'early-childhood-developmental',
        confidence_score: Math.min(95, Math.max(70, (Object.values(sectionAverages).reduce((a, b) => a + b) / 5) * 20)),
        teacher_assessment: data.teacherName,
        age_group: data.grade
      }
    };

    res.json({
      success: true,
      data: finalResult
    });

  } catch (error) {
    console.error('Error in early childhood developmental analysis:', error);
    next(error);
  }
});

/**
 * @route GET /api/v1/analysis/test-ollama
 * @desc Test Ollama connection and model availability
 * @access Public
 */
router.get('/test-ollama', async (req, res, next) => {
  try {
    const response = await fetch(`${process.env.OLLAMA_BASE_URL}/api/tags`);
    const data = await response.json();
    
    res.json({
      success: true,
      status: 'Ollama is running',
      models: data.models?.map(m => m.name) || [],
      configuredModel: process.env.OLLAMA_MODEL
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Ollama not available',
      details: error.message
    });
  }
});

// Fallback analysis functions
function generateGameBasedFallbackAnalysis(data) {
  const avgScore = data.gameResults.reduce((sum, game) => sum + game.score, 0) / data.gameResults.length;
  
  return {
    strengths: avgScore >= 75 ? ["Strong problem-solving skills", "Good engagement with learning activities"] : ["Persistent effort", "Willingness to learn"],
    weaknesses: avgScore < 60 ? ["Needs more practice", "Requires additional support"] : ["Room for improvement in accuracy"],
    skillsets: {
      cognitive: Math.min(100, avgScore + 10),
      linguistic: Math.min(100, avgScore),
      mathematical: Math.min(100, avgScore + 5),
      visual_spatial: Math.min(100, avgScore),
      attention_focus: Math.min(100, avgScore - 5),
      memory: Math.min(100, avgScore),
      processing_speed: Math.min(100, avgScore + 3)
    },
    careerRecommendations: [
      {
        field: avgScore >= 80 ? "STEM Fields" : "Creative Arts",
        description: avgScore >= 80 ? "Strong analytical skills" : "Creative problem-solving approach",
        alignment: Math.min(95, avgScore + 10),
        requiredSkills: avgScore >= 80 ? ["problem-solving", "analytical thinking"] : ["creativity", "communication"]
      }
    ],
    subjectRecommendations: [
      {
        subject: "Mathematics",
        focus_areas: ["problem-solving", "logical reasoning"],
        priority: avgScore < 70 ? "high" : "medium"
      }
    ],
    learningProfile: {
      learning_style: "Interactive and hands-on learning",
      preferred_pace: "Moderate with regular breaks",
      attention_span: `${15 + Math.floor(data.age * 2)}-${20 + Math.floor(data.age * 2)} minutes`,
      motivation_factors: ["gamification", "immediate feedback", "visual aids"]
    },
    developmentPlan: {
      immediate_actions: ["Practice basic skills daily", "Use educational games"],
      short_term_goals: ["Improve accuracy by 10%", "Build confidence"],
      long_term_objectives: ["Develop strong foundation", "Explore interests"]
    }
  };
}

function generateAdvancedFallbackAnalysis(data, overallPercentage) {
  const subjectAnalysis = data.subjectAssessments.map(subject => {
    const percentage = (subject.obtainedMarks / subject.totalMarks) * 100;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : 'D';
    
    return {
      subjectName: subject.subjectName,
      percentage,
      grade,
      strengths: percentage >= 75 ? [`Strong performance in ${subject.subjectName}`] : [],
      improvements: percentage < 75 ? [`Needs improvement in ${subject.subjectName}`] : [],
      parameterAnalysis: {
        applicationBased: {
          score: subject.assessmentParameters.applicationBasedQuestions,
          feedback: subject.assessmentParameters.applicationBasedQuestions >= 4 ? 'Good application skills' : 'Work on practical applications'
        },
        theory: {
          score: subject.assessmentParameters.theoryQuestions,
          feedback: subject.assessmentParameters.theoryQuestions >= 4 ? 'Strong theoretical understanding' : 'Review theoretical concepts'
        },
        effort: {
          score: subject.assessmentParameters.effortPutIn,
          feedback: subject.assessmentParameters.effortPutIn >= 4 ? 'Excellent effort and engagement' : 'Increase study time and focus'
        },
        problemSolving: {
          score: subject.assessmentParameters.problemSolvingCaseStudy,
          feedback: subject.assessmentParameters.problemSolvingCaseStudy >= 4 ? 'Strong analytical skills' : 'Practice more problem-solving exercises'
        },
        recall: {
          score: subject.assessmentParameters.recallQuestions,
          feedback: subject.assessmentParameters.recallQuestions >= 4 ? 'Good memory retention' : 'Use memory techniques and regular revision'
        }
      }
    };
  });

  return {
    overallPerformance: {
      totalPercentage: overallPercentage,
      strengthAreas: subjectAnalysis.filter(s => s.percentage >= 75).map(s => s.subjectName),
      improvementAreas: subjectAnalysis.filter(s => s.percentage < 60).map(s => s.subjectName),
      careerRecommendations: [
        {
          field: overallPercentage >= 80 ? 'Engineering & Technology' : 'Applied Sciences',
          suitabilityScore: Math.min(95, overallPercentage + 5),
          requiredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
          reasoning: `Strong academic performance with ${overallPercentage.toFixed(1)}% overall`,
          futureProspects: ['Software Engineer', 'Data Analyst', 'Research Scientist']
        }
      ],
      studyPlan: {
        immediateActions: [
          'Focus on weak subjects with daily practice',
          'Create a structured study schedule',
          'Seek help from teachers for difficult topics'
        ],
        shortTermGoals: [
          'Improve scores in weaker subjects by 10-15%',
          'Develop better study habits and time management',
          'Complete additional practice exercises'
        ],
        longTermGoals: [
          'Maintain consistent academic performance',
          'Prepare for competitive exams if applicable',
          'Explore career options and required qualifications'
        ],
        recommendedResources: [
          {
            type: 'book',
            title: 'Subject-specific reference books',
            description: 'Comprehensive textbooks for weak subjects'
          }
        ]
      }
    },
    subjectAnalysis,
    careerGuidance: {
      topRecommendations: [
        {
          field: 'Engineering',
          suitabilityScore: Math.min(95, overallPercentage + 5),
          requiredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
          reasoning: 'Strong performance in core subjects',
          futureProspects: ['Software Engineer', 'Data Scientist']
        }
      ],
      streamSuggestions: [
        {
          stream: 'Science',
          suitability: Math.min(95, overallPercentage),
          reasoning: 'Good academic performance indicates science aptitude',
          subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology']
        }
      ],
      skillGaps: overallPercentage < 70 ? ['Time management', 'Study techniques'] : []
    },
    studyRecommendations: {
      prioritySubjects: subjectAnalysis.filter(s => s.percentage < 60).map(s => s.subjectName),
      improvementStrategies: [
        'Regular revision and practice',
        'Seek teacher guidance for weak areas',
        'Use visual aids and mnemonics'
      ],
      resourceRecommendations: [
        'NCERT textbooks and solutions',
        'Previous year question papers',
        'Educational YouTube channels'
      ]
    }
  };
}

function generateEarlyChildhoodFallbackAnalysis(data, sectionAverages) {
  const overallAverage = Object.values(sectionAverages).reduce((sum, avg) => sum + avg, 0) / 5;
  
  // Risk assessment based on developmental norms
  const calculateRisk = (sectionScore, threshold) => {
    const riskScore = Math.max(0, (threshold - (sectionScore * 10)));
    if (riskScore >= threshold * 0.7) return { level: "high", confidence: 85 };
    if (riskScore >= threshold * 0.4) return { level: "moderate", confidence: 75 };
    return { level: "low", confidence: 90 };
  };

  const adhdRisk = calculateRisk(sectionAverages.attentionAndImpulseControl, 30);
  const dyslexiaRisk = calculateRisk(sectionAverages.languageAndCommunication, 25);
  const dysgraphiaRisk = calculateRisk(sectionAverages.motorSkills, 20);
  const intellectualRisk = calculateRisk(overallAverage, 25);
  const autismRisk = calculateRisk(sectionAverages.socialAndEmotionalSkills, 30);
  const apraxiaRisk = calculateRisk(sectionAverages.languageAndCommunication, 25);

  return {
    developmentalProfile: {
      overallDevelopmentLevel: overallAverage >= 4.0 ? "age-appropriate" : overallAverage >= 3.0 ? "age-appropriate-with-concerns" : "below-age-appropriate",
      developmentalAge: `${Math.max(3.0, data.age - (4.0 - overallAverage) * 0.5).toFixed(1)} years`,
      chronologicalAge: `${data.age}.0 years`,
      areasOfStrength: [
        sectionAverages.attentionAndImpulseControl >= 3.5 && "Attention and focus",
        sectionAverages.languageAndCommunication >= 3.5 && "Communication skills",
        sectionAverages.cognitiveAndLearningSkills >= 3.5 && "Cognitive development",
        sectionAverages.motorSkills >= 3.5 && "Motor skills",
        sectionAverages.socialAndEmotionalSkills >= 3.5 && "Social interaction"
      ].filter(Boolean),
      areasOfConcern: [
        sectionAverages.attentionAndImpulseControl < 3.0 && "Attention and impulse control",
        sectionAverages.languageAndCommunication < 3.0 && "Language development",
        sectionAverages.cognitiveAndLearningSkills < 3.0 && "Learning skills",
        sectionAverages.motorSkills < 3.0 && "Motor skills development",
        sectionAverages.socialAndEmotionalSkills < 3.0 && "Social and emotional skills"
      ].filter(Boolean)
    },
    riskAssessment: {
      adhdRisk: {
        riskLevel: adhdRisk.level,
        confidence: adhdRisk.confidence,
        indicators: adhdRisk.level !== "low" ? ["Attention difficulties observed", "Impulse control challenges"] : [],
        score: Math.max(0, 30 - (sectionAverages.attentionAndImpulseControl * 10)),
        threshold: 30,
        recommendation: adhdRisk.level === "high" ? "Professional ADHD evaluation recommended" : adhdRisk.level === "moderate" ? "Monitor and implement attention-building strategies" : "Continue current support"
      },
      dyslexiaRisk: {
        riskLevel: dyslexiaRisk.level,
        confidence: dyslexiaRisk.confidence,
        indicators: dyslexiaRisk.level !== "low" ? ["Pre-literacy skills below expected", "Language processing concerns"] : [],
        score: Math.max(0, 25 - (sectionAverages.languageAndCommunication * 10)),
        threshold: 25,
        recommendation: dyslexiaRisk.level === "high" ? "Early literacy intervention needed" : dyslexiaRisk.level === "moderate" ? "Enhanced phonological awareness activities" : "Continue reading support"
      },
      dysgraphiaRisk: {
        riskLevel: dysgraphiaRisk.level,
        confidence: dysgraphiaRisk.confidence,
        indicators: dysgraphiaRisk.level !== "low" ? ["Fine motor skill delays", "Writing readiness concerns"] : [],
        score: Math.max(0, 20 - (sectionAverages.motorSkills * 10)),
        threshold: 20,
        recommendation: dysgraphiaRisk.level === "high" ? "Occupational therapy evaluation recommended" : dysgraphiaRisk.level === "moderate" ? "Fine motor skill activities daily" : "Continue motor development support"
      },
      intellectualDisabilityRisk: {
        riskLevel: intellectualRisk.level,
        confidence: intellectualRisk.confidence,
        indicators: intellectualRisk.level !== "low" ? ["Overall developmental delays", "Learning challenges across domains"] : [],
        score: Math.max(0, 25 - (overallAverage * 10)),
        threshold: 25,
        recommendation: intellectualRisk.level === "high" ? "Comprehensive developmental evaluation needed" : intellectualRisk.level === "moderate" ? "Additional learning support recommended" : "Continue monitoring development"
      },
      autismRisk: {
        riskLevel: autismRisk.level,
        confidence: autismRisk.confidence,
        indicators: autismRisk.level !== "low" ? ["Social interaction difficulties", "Communication challenges"] : [],
        score: Math.max(0, 30 - (sectionAverages.socialAndEmotionalSkills * 10)),
        threshold: 30,
        recommendation: autismRisk.level === "high" ? "Autism spectrum evaluation recommended" : autismRisk.level === "moderate" ? "Social skills support and monitoring" : "Continue social development activities"
      },
      childhoodApraxiaOfSpeechRisk: {
        riskLevel: apraxiaRisk.level,
        confidence: apraxiaRisk.confidence,
        indicators: apraxiaRisk.level !== "low" ? ["Speech clarity concerns", "Motor speech difficulties"] : [],
        score: Math.max(0, 25 - (sectionAverages.languageAndCommunication * 8)),
        threshold: 25,
        recommendation: apraxiaRisk.level === "high" ? "Speech-language pathology evaluation needed" : apraxiaRisk.level === "moderate" ? "Speech therapy screening recommended" : "Continue language development support"
      }
    },
    sectionAnalysis: [
      {
        section: "Attention and Impulse Control",
        averageScore: parseFloat(sectionAverages.attentionAndImpulseControl.toFixed(1)),
        maxScore: 5.0,
        percentile: Math.round(sectionAverages.attentionAndImpulseControl * 20),
        interpretation: sectionAverages.attentionAndImpulseControl >= 4 ? "Above average" : sectionAverages.attentionAndImpulseControl >= 3 ? "Average" : "Below average",
        keyFindings: sectionAverages.attentionAndImpulseControl < 3 ? ["Attention difficulties noted", "Impulse control challenges"] : ["Attention skills developing appropriately"],
        developmentalConcerns: sectionAverages.attentionAndImpulseControl < 3 ? ["ADHD risk indicators present"] : []
      }
    ],
    interventionPlan: {
      immediateActions: [
        overallAverage < 3 ? "Implement structured daily routines" : "Continue current positive practices",
        sectionAverages.attentionAndImpulseControl < 3 ? "Create attention-building activities" : "Maintain attention-supporting environment",
        sectionAverages.motorSkills < 3 ? "Daily fine motor practice" : "Continue motor skill development"
      ].filter(Boolean),
      shortTermGoals: [
        "Improve lowest-scoring developmental areas",
        "Establish consistent routines and expectations",
        "Build on identified strengths"
      ],
      longTermObjectives: [
        "Achieve age-appropriate developmental milestones",
        "Prepare for academic learning success",
        "Develop strong social and emotional regulation"
      ],
      recommendedServices: [
        overallAverage < 2.5 && {
          service: "Early Intervention Program",
          priority: "high",
          frequency: "2-3x per week",
          duration: "6-12 months",
          focus: "Overall developmental support"
        },
        sectionAverages.motorSkills < 2.5 && {
          service: "Occupational Therapy",
          priority: "medium",
          frequency: "1-2x per week", 
          duration: "3-6 months",
          focus: "Fine and gross motor skills"
        }
      ].filter(Boolean)
    },
    parentRecommendations: {
      homeActivities: [
        "Daily reading and storytelling",
        "Sensory play activities (playdough, sand, water)",
        "Simple puzzles and building activities",
        "Movement and dance activities"
      ],
      environmentalSupports: [
        "Consistent daily routines",
        "Clear, simple expectations",
        "Positive reinforcement system",
        "Calm, organized environment"
      ],
      monitoringGuidelines: [
        "Track attention span during activities",
        "Note language development progress",
        "Monitor social interaction improvements",
        "Document motor skill development"
      ]
    },
    followUpPlan: {
      reassessmentRecommended: overallAverage < 3 ? "3 months" : "6 months",
      professionalReferrals: [
        adhdRisk.level === "high" && "Pediatric psychologist for ADHD evaluation",
        dysgraphiaRisk.level === "high" && "Occupational therapist",
        dyslexiaRisk.level === "high" && "Speech-language pathologist",
        autismRisk.level === "high" && "Developmental pediatrician"
      ].filter(Boolean),
      progressIndicators: [
        "Improved attention span",
        "Better social interaction",
        "Enhanced communication skills",
        "Stronger motor coordination"
      ]
    }
  };
}

module.exports = router;
