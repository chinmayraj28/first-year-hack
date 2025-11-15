# SproutSense AI Analysis API Documentation

## Overview

The SproutSense AI Analysis API provides **two specialized analysis systems** designed for different educational stages:

### **1. Early Childhood Psycho-Educational Analysis (LKG - Grade 2)**
- **Age Group**: 3-7 years
- **Purpose**: Developmental screening and early intervention identification
- **Assessment Type**: Teacher observation-based psychological assessment (34 questions across 5 domains)
- **Output**: Comprehensive developmental report with risk screening for learning disabilities and neurodevelopmental conditions
- **Dashboard Integration**: Student developmental profile with risk indicators and intervention recommendations

### **2. Academic Performance & Career Guidance Analysis (Grades 6-12)**
- **Age Group**: 11-18 years  
- **Purpose**: Subject-wise academic analysis and career path recommendations
- **Assessment Type**: Academic marks with detailed parameter evaluation (5-point scale assessment)
- **Output**: Career guidance report with stream recommendations and detailed study plans
- **Dashboard Integration**: Student academic profile with career suggestions and improvement strategies

**System Features:**
- AI-powered analysis using advanced language models
- Evidence-based developmental and academic assessments
- Student dashboard-ready comprehensive reports
- Risk screening for early intervention
- Personalized recommendations and action plans

**Base URL:** `http://localhost:8000`  
**Version:** v1.0.0  
**API Version:** v1  

## Authentication

All API endpoints require an API key to be included in the request headers.

**Header:** `x-api-key: 123`

```bash
curl -H "x-api-key: 123" http://localhost:8000/api/v1/health
```

## Response Format

All API responses follow this consistent format:

```json
{
  "success": true|false,
  "data": {}, // Response data (on success)
  "error": "", // Error message (on failure)
  "message": "", // Optional success message
  "pagination": {}, // Pagination info (for paginated endpoints)
  "metadata": {} // Additional metadata
}
```

## Endpoints

### Health & Status

#### GET /api/v1/health
Check if the AI analysis service is running.

**Response:**
```json
{
  "success": true,
  "message": "SproutSense AI Analysis Service is running",
  "timestamp": "2025-11-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0"
}
```

#### GET /api/v1/health/detailed
Get detailed health information including AI service status.

**Response:**
```json
{
  "success": true,
  "timestamp": "2025-11-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "development",
  "version": "1.0.0",
  "system": {
    "platform": "darwin",
    "nodeVersion": "v18.17.0",
    "memory": {
      "used": 45.67,
      "total": 128.45
    }
  },
  "aiService": {
    "ollama": {
      "url": "http://localhost:11434",
      "model": "gpt-oss:20b",
      "status": "connected"
    }
  }
}
```

### AI Analysis Endpoints

## **Primary Analysis System 1: Early Childhood Psycho-Educational Analysis**

#### POST /api/v1/analysis/early-childhood
**Early Childhood Developmental & Psychological Screening** for LKG to Grade 2 students.

**Purpose**: Comprehensive psycho-educational assessment to identify developmental delays, learning difficulties, and neurodevelopmental conditions in early learners.

**Target Age Group**: 3-7 years (LKG, UKG, Grade 1, Grade 2)

**Assessment Domains** (34 questions total):
1. **Attention & Impulse Control** (5 questions) - ADHD risk assessment
2. **Language & Communication** (5 questions) - Speech/language delays, dyslexia risk
3. **Cognitive & Learning Skills** (5 questions) - Intellectual development assessment  
4. **Motor Skills** (8 questions) - Fine/gross motor development, dysgraphia risk
5. **Social & Emotional Skills** (11 questions) - Autism spectrum, emotional regulation

**Conditions Screened**:
- ADHD (Attention Deficit Hyperactivity Disorder)
- Dyslexia (Early reading difficulties)
- Dysgraphia (Writing/fine motor difficulties)  
- Intellectual Disability
- Autism Spectrum Disorder (ASD)
- Childhood Apraxia of Speech (CAS)

**Student Dashboard Output**: 
- Developmental profile with risk assessment
- Section-wise analysis with recommendations
- Parent and teacher action plans
- Professional referral recommendations
- Progress monitoring guidelines

**Headers:**
```
Content-Type: application/json
x-api-key: 123
```

**Request Body:**
```json
{
  "studentName": "Sarah Chen",
  "age": 5,
  "grade": "LKG", // LKG, UKG, 1, 2
  "teacherName": "Ms. Johnson",
  "assessmentDate": "2025-11-15",    "developmentalAssessment": {
      "attentionAndImpulseControl": {
        "questions": [
          {"id": 1, "text": "The child has difficulty focusing on tasks for more than 5–10 minutes", "score": 4},
          {"id": 2, "text": "The child often interrupts others or speaks out of turn", "score": 4},
          {"id": 3, "text": "The child has difficulty waiting for their turn in group activities", "score": 3},
          {"id": 4, "text": "The child appears restless or fidgets frequently during seated tasks", "score": 4},
          {"id": 5, "text": "The child is easily distracted by external stimuli (noises, movement, objects)", "score": 4}
        ]
      },
      "languageAndCommunication": {
        "questions": [
          {"id": 1, "text": "The child struggles to express their thoughts clearly", "score": 2},
          {"id": 2, "text": "The child has trouble remembering the names of letters, numbers, or common objects", "score": 3},
          {"id": 3, "text": "The child mispronounces words frequently or has difficulty forming sentences", "score": 2},
          {"id": 4, "text": "The child struggles to follow 2–3 step verbal instructions", "score": 3},
          {"id": 5, "text": "The child has difficulty retelling a story or describing events in order", "score": 3}
        ]
      },
      "cognitiveAndLearningSkills": {
        "questions": [
          {"id": 1, "text": "The child has difficulty recognizing letters, numbers, or symbols", "score": 3},
          {"id": 2, "text": "The child struggles to identify which of two groups has more or fewer items", "score": 2},
          {"id": 3, "text": "The child often confuses sequences (days of week, counting, or letter order)", "score": 3},
          {"id": 4, "text": "The child takes longer than peers to solve simple puzzles or pattern tasks", "score": 3},
          {"id": 5, "text": "The child has difficulty understanding cause-and-effect relationships in simple tasks", "score": 2}
        ]
      },
      "motorSkills": {
        "questions": [
          {"id": 1, "text": "The child struggles with tasks requiring fine motor skills (cutting, drawing, holding pencil)", "score": 4},
          {"id": 2, "text": "The child's handwriting or drawing is noticeably messy compared to peers", "score": 4},
          {"id": 3, "text": "The child has difficulty copying shapes, letters, or numbers accurately", "score": 4},
          {"id": 4, "text": "The child has trouble tying shoelaces or manipulating small fasteners", "score": 4},
          {"id": 5, "text": "The child struggles to complete tasks requiring hand-eye coordination (e.g., stringing beads, placing pegs)", "score": 3},
          {"id": 6, "text": "The child's handwriting is messy or inconsistent compared to peers", "score": 4},
          {"id": 7, "text": "The child avoids tasks that require drawing, writing, or manipulating small objects", "score": 3},
          {"id": 8, "text": "The child copies letters, numbers, or simple shapes inaccurately or slowly", "score": 4}
        ]
      },
      "socialAndEmotionalSkills": {
        "questions": [
          {"id": 1, "text": "The child has difficulty making eye contact or interacting socially with peers", "score": 3},
          {"id": 2, "text": "The child struggles to understand or respond appropriately to others' emotions", "score": 3},
          {"id": 3, "text": "The child initiates play with other children without prompting", "score": 2},
          {"id": 4, "text": "The child responds appropriately when another child shares a toy or idea", "score": 3},
          {"id": 5, "text": "The child struggles to join group activities even when invited", "score": 3},
          {"id": 6, "text": "The child prefers solitary play most of the time", "score": 4},
          {"id": 7, "text": "The child maintains friendships or shows interest in peers over time", "score": 2},
          {"id": 8, "text": "The child follows rules in group settings consistently", "score": 3},
          {"id": 9, "text": "The child can participate in structured activities without disrupting others", "score": 3},
          {"id": 10, "text": "The child shifts attention smoothly between different tasks when asked", "score": 2},
          {"id": 11, "text": "The child can cope with minor criticism without strong negative reactions", "score": 2}
        ]
      }
    }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "developmentalProfile": {
      "overallDevelopmentLevel": "age-appropriate-with-concerns",
      "developmentalAge": "4.5 years",
      "chronologicalAge": "5.0 years",
      "areasOfStrength": [
        "Social interaction and empathy",
        "Cognitive curiosity and problem-solving",
        "Gross motor skills"
      ],
      "areasOfConcern": [
        "Attention and impulse control",
        "Fine motor skills development",
        "Pre-literacy skills"
      ]
    },
    "riskAssessment": {
      "adhdRisk": {
        "riskLevel": "moderate",
        "confidence": 75,
        "indicators": [
          "Difficulty with sustained attention",
          "Impulse control challenges",
          "Task completion difficulties"
        ],
        "score": 25,
        "threshold": 30,
        "recommendation": "Monitor closely, consider evaluation"
      },
      "dyslexiaRisk": {
        "riskLevel": "moderate", 
        "confidence": 70,
        "indicators": [
          "Below-expected letter recognition",
          "Limited phonological awareness",
          "Difficulty with rhyming"
        ],
        "score": 23,
        "threshold": 25,
        "recommendation": "Early literacy intervention recommended"
      },
      "dysgraphiaRisk": {
        "riskLevel": "high",
        "confidence": 80,
        "indicators": [
          "Poor pencil grip",
          "Difficulty with fine motor tasks",
          "Inconsistent hand dominance"
        ],
        "score": 19,
        "threshold": 20,
        "recommendation": "Occupational therapy evaluation needed"
      },
      "intellectualDisabilityRisk": {
        "riskLevel": "low",
        "confidence": 85,
        "indicators": [],
        "score": 36,
        "threshold": 25,
        "recommendation": "No concerns at this time"
      },
      "autismRisk": {
        "riskLevel": "low",
        "confidence": 80,
        "indicators": [
          "Good eye contact",
          "Strong social engagement",
          "Appropriate emotional expression"
        ],
        "score": 39,
        "threshold": 30,
        "recommendation": "Continue monitoring social development"
      },
      "childhoodApraxiaOfSpeechRisk": {
        "riskLevel": "low-moderate",
        "confidence": 65,
        "indicators": [
          "Mild speech clarity issues",
          "Some difficulty with complex sounds"
        ],
        "score": 27,
        "threshold": 25,
        "recommendation": "Speech therapy screening recommended"
      }
    },
    "sectionAnalysis": [
      {
        "section": "Attention and Impulse Control",
        "averageScore": 2.5,
        "maxScore": 5.0,
        "percentile": 40,
        "interpretation": "Below average for age group",
        "keyFindings": [
          "Struggles with sustained attention tasks",
          "Needs frequent reminders to complete activities",
          "Shows difficulty waiting turns"
        ],
        "developmentalConcerns": ["ADHD risk indicators present"]
      },
      {
        "section": "Language and Communication", 
        "averageScore": 3.5,
        "maxScore": 5.0,
        "percentile": 70,
        "interpretation": "Age-appropriate with some concerns",
        "keyFindings": [
          "Strong vocabulary and conversation skills",
          "Good comprehension of concepts",
          "Some pre-literacy skill delays"
        ],
        "developmentalConcerns": ["Pre-literacy skills need support"]
      }
    ],
    "interventionPlan": {
      "immediateActions": [
        "Implement structured attention-building activities",
        "Provide fine motor skill practice opportunities",
        "Create consistent daily routines",
        "Use visual schedules and reminders"
      ],
      "shortTermGoals": [
        "Improve sustained attention to 10-15 minutes",
        "Develop proper pencil grip through practice",
        "Enhance letter and sound recognition",
        "Build impulse control through games and activities"
      ],
      "longTermObjectives": [
        "Prepare for formal academic learning",
        "Develop emotional regulation skills", 
        "Build foundation for reading and writing",
        "Strengthen social interaction abilities"
      ],
      "recommendedServices": [
        {
          "service": "Occupational Therapy",
          "priority": "high",
          "frequency": "2x per week",
          "duration": "3-6 months",
          "focus": "Fine motor skills and pencil grip"
        },
        {
          "service": "Educational Support",
          "priority": "medium",
          "frequency": "Daily",
          "duration": "Ongoing",
          "focus": "Pre-literacy and attention skills"
        }
      ]
    },
    "parentRecommendations": {
      "homeActivities": [
        "Practice letter tracing in sand or finger paint",
        "Play attention games like 'Simon Says'",
        "Read together daily for 10-15 minutes",
        "Encourage fine motor activities (playdough, puzzles)"
      ],
      "environmentalSupports": [
        "Create quiet, distraction-free study space",
        "Use timers for activities",
        "Establish predictable routines",
        "Provide frequent positive reinforcement"
      ],
      "monitoringGuidelines": [
        "Track attention span during activities",
        "Note improvements in fine motor skills",
        "Monitor social interactions with peers",
        "Document progress with letter recognition"
      ]
    },
    "followUpPlan": {
      "reassessmentRecommended": "3 months",
      "professionalReferrals": [
        "Occupational therapist for fine motor evaluation",
        "Pediatrician for ADHD screening discussion"
      ],
      "progressIndicators": [
        "Improved attention span",
        "Better pencil grip",
        "Increased letter recognition",
        "Enhanced social regulation"
      ]
    },
    "metadata": {
      "analysis_date": "2025-11-15T10:30:00.000Z",
      "model_used": "gpt-oss:20b",
      "student_name": "Sarah Chen",
      "analysis_type": "early-childhood-developmental",
      "confidence_score": 78,
      "teacher_assessment": "Ms. Johnson",
      "age_group": "LKG"
    }
  }
}
```

## **Primary Analysis System 2: Academic Performance & Career Guidance Analysis**

#### POST /api/v1/analysis/advanced
**Academic Performance Analysis & Career Guidance** for Grades 6-12 students.

**Purpose**: Comprehensive academic performance evaluation with detailed career guidance and stream recommendations based on subject-wise assessment.

**Target Age Group**: 11-18 years (Grades 6, 7, 8, 9, 10, 11, 12)

**Assessment Parameters** (Per Subject):
- **Academic Marks**: Out of 100 for each subject
- **5-Point Parameter Evaluation**:
  1. **Application-Based Questions** (1-5) - Practical knowledge application
  2. **Theory Questions** (1-5) - Conceptual understanding
  3. **Effort Put In** (1-5) - Study dedication and engagement
  4. **Problem-Solving & Case Study** (1-5) - Analytical thinking
  5. **Recall Questions** (1-5) - Memory and retention

**Analysis Output**:
- Overall academic performance assessment
- Subject-wise strength/weakness analysis  
- Career stream recommendations (Science/Commerce/Arts)
- Specific career field suggestions with suitability scores
- Future prospects and required qualifications
- Detailed study plans and improvement strategies

**Student Dashboard Output**: 
- Academic performance profile with grades
- Career recommendations with reasoning
- Stream suitability analysis
- Subject improvement strategies
- Study resource recommendations
- Long-term academic goals

**Headers:**
```
Content-Type: application/json
x-api-key: 123
```

**Request Body:**
```json
{
  "studentId": "student-123",
  "studentName": "Jane Smith",
  "grade": "10",
  "academicYear": "2024-2025",
  "subjectAssessments": [
    {
      "subjectId": "math-001",
      "subjectName": "Mathematics",
      "totalMarks": 100,
      "obtainedMarks": 87,
      "assessmentParameters": {
        "applicationBasedQuestions": 4,
        "theoryQuestions": 3,
        "effortPutIn": 5,
        "problemSolvingCaseStudy": 4,
        "recallQuestions": 3
      }
    },
    {
      "subjectId": "phys-001",
      "subjectName": "Physics",
      "totalMarks": 100,
      "obtainedMarks": 79,
      "assessmentParameters": {
        "applicationBasedQuestions": 3,
        "theoryQuestions": 4,
        "effortPutIn": 4,
        "problemSolvingCaseStudy": 3,
        "recallQuestions": 4
      }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overallPerformance": {
      "totalPercentage": 83.0,
      "strengthAreas": ["Mathematics", "Physics"],
      "improvementAreas": [],
      "careerRecommendations": [
        {
          "field": "Engineering & Technology",
          "suitabilityScore": 88,
          "requiredSubjects": ["Mathematics", "Physics", "Chemistry"],
          "reasoning": "Strong performance in STEM subjects",
          "futureProspects": ["Software Engineer", "Data Scientist", "Mechanical Engineer"]
        }
      ],
      "studyPlan": {
        "immediateActions": [
          "Continue strong performance in mathematics",
          "Focus on practical applications in physics"
        ],
        "shortTermGoals": [
          "Maintain above 85% in core subjects",
          "Develop project-based learning approach"
        ],
        "longTermGoals": [
          "Prepare for engineering entrance exams",
          "Build strong foundation for higher studies"
        ],
        "recommendedResources": [
          {
            "type": "book",
            "title": "Advanced Mathematics for Engineers",
            "description": "Comprehensive guide for engineering mathematics"
          }
        ]
      }
    },
    "subjectAnalysis": [
      {
        "subjectName": "Mathematics",
        "percentage": 87.0,
        "grade": "A",
        "strengths": ["Strong analytical skills", "Good problem-solving"],
        "improvements": ["Work on theoretical concepts"],
        "parameterAnalysis": {
          "applicationBased": {
            "score": 4,
            "feedback": "Excellent application of mathematical concepts"
          },
          "theory": {
            "score": 3,
            "feedback": "Good but can improve theoretical understanding"
          },
          "effort": {
            "score": 5,
            "feedback": "Outstanding effort and dedication"
          },
          "problemSolving": {
            "score": 4,
            "feedback": "Strong analytical and problem-solving skills"
          },
          "recall": {
            "score": 3,
            "feedback": "Practice more for better retention"
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
          "reasoning": "Strong STEM performance with excellent problem-solving skills",
          "futureProspects": ["Software Engineer", "Data Scientist", "Mechanical Engineer"]
        }
      ],
      "streamSuggestions": [
        {
          "stream": "Science",
          "suitability": 90,
          "reasoning": "Excellent performance in core science subjects",
          "subjects": ["Physics", "Chemistry", "Mathematics", "Biology"]
        }
      ],
      "skillGaps": []
    },
    "studyRecommendations": {
      "prioritySubjects": [],
      "improvementStrategies": [
        "Focus on theoretical concepts in physics",
        "Practice more recall-based questions"
      ],
      "resourceRecommendations": [
        "NCERT textbooks and solutions",
        "Previous year question papers",
        "Educational YouTube channels"
      ]
    },
    "metadata": {
      "analysis_date": "2025-11-15T10:30:00.000Z",
      "model_used": "gpt-oss:20b",
      "student_id": "student-123",
      "analysis_type": "advanced",
      "confidence_score": 88
    }
  }
}
```

#### GET /api/v1/analysis/test-ollama
**AI Service Health Check:** Test the connection and availability of the underlying AI model.

**Use Case:** Verify that the AI analysis service is ready to process requests.

**Response:**
```json
{
  "success": true,
  "status": "Ollama AI service is running",
  "models": ["gpt-oss:20b", "llama2", "codellama"],
  "configuredModel": "gpt-oss:20b",
  "modelStatus": "loaded",
  "lastHealthCheck": "2025-11-15T10:30:00.000Z"
}
```

## AI Analysis Features

## **System 1: Early Childhood Psycho-Educational Analysis (LKG-Grade 2)**

### Comprehensive Developmental Assessment
The early childhood analysis system provides evidence-based psychological and educational screening:

**Assessment Domains:**
- **Attention & Impulse Control**: ADHD risk indicators, sustained attention, behavioral regulation
- **Language & Communication**: Speech clarity, vocabulary development, pre-literacy skills, dyslexia risk
- **Cognitive & Learning Skills**: Problem-solving, memory, intellectual development indicators
- **Motor Skills**: Fine motor coordination, gross motor development, dysgraphia risk indicators
- **Social & Emotional Skills**: Peer interaction, emotional regulation, autism spectrum indicators

**Risk Screening Capabilities:**
1. **ADHD (Attention Deficit Hyperactivity Disorder)** - Behavioral attention patterns
2. **Dyslexia** - Early reading and phonological awareness deficits
3. **Dysgraphia** - Fine motor and writing skill development delays
4. **Intellectual Disability** - Cognitive development assessment
5. **Autism Spectrum Disorder (ASD)** - Social communication patterns
6. **Childhood Apraxia of Speech (CAS)** - Speech motor planning difficulties

**Dashboard Report Includes:**
- Developmental age vs chronological age comparison
- Risk level assessment with confidence scores
- Section-wise analysis with percentile rankings
- Immediate intervention recommendations
- Parent home activity suggestions
- Professional referral guidelines
- Progress monitoring plans

### Assessment Methodology
- **50-question comprehensive evaluation** (5 sections × 10 questions each)
- **5-point Likert scale** (1=Never/Strongly Disagree to 5=Always/Strongly Agree)
- **Age-appropriate developmental norms** and benchmarks
- **Multi-domain risk factor analysis** using clinical thresholds
- **Evidence-based intervention recommendations**

## **System 2: Academic Performance & Career Guidance Analysis (Grades 6-12)**

### Comprehensive Academic & Career Assessment
The advanced analysis system provides detailed academic evaluation with career guidance:

**Academic Analysis:**
- **Subject-wise Performance Evaluation** - Detailed marks analysis with grade calculation
- **Multi-Parameter Assessment** - 5-point scale evaluation across cognitive dimensions
- **Trend Analysis** - Performance patterns and improvement areas
- **Strength/Weakness Mapping** - Subject-specific skill identification

**Career Guidance Features:**
- **Stream Recommendations** - Science/Commerce/Arts suitability analysis
- **Career Field Mapping** - Specific career suggestions with alignment scores
- **Future Prospects Analysis** - Career growth potential and requirements
- **Educational Pathway Planning** - Subject selection and preparation strategies

**Dashboard Report Includes:**
- Overall academic performance summary with percentage
- Subject-wise analysis with parameter breakdown
- Career recommendations with suitability scores
- Stream suggestions with reasoning
- Study improvement strategies
- Resource recommendations
- Long-term academic goals

### Assessment Parameters (Per Subject)
- **Application-Based Skills** - Practical knowledge application (1-5 scale)
- **Theoretical Understanding** - Conceptual grasp and comprehension (1-5 scale)
- **Effort & Engagement** - Study dedication and participation (1-5 scale)
- **Problem-Solving** - Analytical and critical thinking abilities (1-5 scale)
- **Memory & Recall** - Information retention and recall capabilities (1-5 scale)

## AI Model Information

**Primary Model:** gpt-oss:20b
- **Type:** Large Language Model optimized for educational analysis
- **Specialization:** Student assessment, career guidance, educational psychology
- **Response Time:** 2-5 seconds average
- **Accuracy:** 85-95% confidence scores

**Fallback System:** 
If AI service is unavailable, the system provides rule-based analysis ensuring continuous service availability.

## Request/Response Examples

### **Example 1: Early Childhood Psycho-Educational Analysis**

**Sample Request for LKG Student:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: 123" \
  -d '{
    "studentName": "Priya Sharma",
    "age": 5,
    "grade": "UKG",
    "teacherName": "Ms. Patel",
    "assessmentDate": "2025-11-15",
    "developmentalAssessment": {
      "attentionAndImpulseControl": {
        "questions": [
          {"id": 1, "text": "Child can focus on a task for age-appropriate time", "score": 2},
          {"id": 2, "text": "Child follows multi-step instructions", "score": 3},
          {"id": 3, "text": "Child waits their turn during activities", "score": 2},
          {"id": 4, "text": "Child sits still during quiet activities", "score": 2},
          {"id": 5, "text": "Child completes tasks without constant reminders", "score": 3},
          {"id": 6, "text": "Child thinks before acting", "score": 2},
          {"id": 7, "text": "Child can transition between activities smoothly", "score": 3},
          {"id": 8, "text": "Child maintains attention during story time", "score": 4},
          {"id": 9, "text": "Child avoids interrupting others", "score": 2},
          {"id": 10, "text": "Child shows self-control in exciting situations", "score": 3}
        ]
      },
      "languageAndCommunication": {
        "questions": [
          {"id": 1, "text": "Child speaks clearly and is easily understood", "score": 4},
          {"id": 2, "text": "Child uses age-appropriate vocabulary", "score": 4},
          {"id": 3, "text": "Child follows verbal instructions well", "score": 3},
          {"id": 4, "text": "Child engages in back-and-forth conversation", "score": 4},
          {"id": 5, "text": "Child asks questions appropriately", "score": 5},
          {"id": 6, "text": "Child understands concepts (big/small, colors)", "score": 5},
          {"id": 7, "text": "Child tells simple stories or experiences", "score": 3},
          {"id": 8, "text": "Child recognizes and names letters/sounds", "score": 2},
          {"id": 9, "text": "Child rhymes words or plays with sounds", "score": 3},
          {"id": 10, "text": "Child shows interest in books and reading", "score": 4}
        ]
      },
      "cognitiveAndLearningSkills": {
        "questions": [
          {"id": 1, "text": "Child solves age-appropriate puzzles", "score": 4},
          {"id": 2, "text": "Child remembers and follows routines", "score": 4},
          {"id": 3, "text": "Child counts objects accurately", "score": 3},
          {"id": 4, "text": "Child recognizes patterns", "score": 4},
          {"id": 5, "text": "Child shows curiosity and asks why questions", "score": 5},
          {"id": 6, "text": "Child learns new concepts quickly", "score": 3},
          {"id": 7, "text": "Child can categorize objects by attributes", "score": 4},
          {"id": 8, "text": "Child demonstrates problem-solving skills", "score": 3},
          {"id": 9, "text": "Child shows good memory for events and facts", "score": 4},
          {"id": 10, "text": "Child shows understanding of cause and effect", "score": 4}
        ]
      },
      "motorSkills": {
        "questions": [
          {"id": 1, "text": "Child holds pencil/crayon with proper grip", "score": 2},
          {"id": 2, "text": "Child can draw basic shapes and lines", "score": 3},
          {"id": 3, "text": "Child can cut with scissors appropriately", "score": 2},
          {"id": 4, "text": "Child buttons clothes and ties shoes", "score": 2},
          {"id": 5, "text": "Child runs, jumps, and climbs confidently", "score": 4},
          {"id": 6, "text": "Child throws and catches a ball", "score": 4},
          {"id": 7, "text": "Child balances on one foot briefly", "score": 3},
          {"id": 8, "text": "Child coordinates movements well", "score": 3},
          {"id": 9, "text": "Child shows hand dominance consistently", "score": 3},
          {"id": 10, "text": "Child manipulates small objects skillfully", "score": 2}
        ]
      },
      "socialAndEmotionalSkills": {
        "questions": [
          {"id": 1, "text": "Child plays cooperatively with peers", "score": 4},
          {"id": 2, "text": "Child shows empathy toward others", "score": 4},
          {"id": 3, "text": "Child expresses emotions appropriately", "score": 3},
          {"id": 4, "text": "Child seeks help when needed", "score": 4},
          {"id": 5, "text": "Child adapts to new situations well", "score": 3},
          {"id": 6, "text": "Child maintains eye contact during conversation", "score": 4},
          {"id": 7, "text": "Child shows interest in social activities", "score": 4},
          {"id": 8, "text": "Child responds to social cues appropriately", "score": 3},
          {"id": 9, "text": "Child manages frustration well", "score": 2},
          {"id": 10, "text": "Child forms attachments with caregivers", "score": 5}
        ]
      }
    }
  }' \
  http://localhost:8000/api/v1/analysis/early-childhood
```

### **Example 2: Academic Performance & Career Guidance Analysis**

**Sample Request for Grade 11 Student:**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: 123" \
  -d '{
    "studentId": "std-2024-001",
    "studentName": "Arjun Patel",
    "grade": "11",
    "academicYear": "2024-2025",
    "subjectAssessments": [
      {
        "subjectId": "math-adv",
        "subjectName": "Advanced Mathematics",
        "totalMarks": 100,
        "obtainedMarks": 89,
        "assessmentParameters": {
          "applicationBasedQuestions": 5,
          "theoryQuestions": 4,
          "effortPutIn": 5,
          "problemSolvingCaseStudy": 5,
          "recallQuestions": 3
        }
      },
      {
        "subjectId": "phys-11",
        "subjectName": "Physics",
        "totalMarks": 100,
        "obtainedMarks": 82,
        "assessmentParameters": {
          "applicationBasedQuestions": 4,
          "theoryQuestions": 4,
          "effortPutIn": 4,
          "problemSolvingCaseStudy": 4,
          "recallQuestions": 3
        }
      },
      {
        "subjectId": "chem-11",
        "subjectName": "Chemistry",
        "totalMarks": 100,
        "obtainedMarks": 76,
        "assessmentParameters": {
          "applicationBasedQuestions": 3,
          "theoryQuestions": 4,
          "effortPutIn": 4,
          "problemSolvingCaseStudy": 3,
          "recallQuestions": 4
        }
      }
    ]
  }' \
  http://localhost:8000/api/v1/analysis/advanced
```

## AI Analysis Accuracy & Confidence

### Confidence Scoring
Each AI analysis includes a confidence score (0-100) indicating the reliability of the assessment:
- **90-100**: Highly confident (extensive data, clear patterns)
- **80-89**: Confident (sufficient data, identifiable trends)
- **70-79**: Moderately confident (limited data, general insights)
- **Below 70**: Low confidence (minimal data, basic recommendations)

### Analysis Quality Factors
The AI considers multiple factors to ensure accurate analysis:
1. **Data Completeness**: Amount and quality of input data
2. **Performance Consistency**: Patterns across multiple games/subjects
3. **Age Appropriateness**: Grade-level expectations and norms
4. **Behavioral Indicators**: Engagement, effort, and learning patterns

## Integration Guidelines

### Frontend Integration
This AI-focused backend is designed to work with any frontend application. Typical integration flow:

1. **Collect Assessment Data** in your frontend (games, subject marks)
2. **Send to AI Analysis Endpoint** with proper authentication
3. **Receive Comprehensive AI Insights** with structured recommendations
4. **Display Results** in your preferred UI format
5. **Store Results** in your frontend's database if needed

### Recommended Usage Patterns
- **Real-time Analysis**: Send data immediately after assessment completion
- **Batch Processing**: Collect multiple assessments and analyze together
- **Progressive Analysis**: Start with game-based, upgrade to advanced analysis
- **Comparison Analysis**: Track improvement over time using multiple analyses

## Error Handling & AI Service Status

### AI-Specific Errors

**AI Model Unavailable:**
```json
{
  "success": false,
  "error": "AI Service Unavailable",
  "details": "Ollama service is not responding. Using fallback analysis.",
  "fallbackUsed": true
}
```

**Invalid Analysis Data:**
```json
{
  "success": false,
  "error": "Insufficient Data",
  "details": "Minimum 1 game result required for analysis",
  "requiredFields": ["gameResults"]
}
```

**AI Processing Error:**
```json
{
  "success": false,
  "error": "Analysis Failed",
  "details": "AI model returned invalid response. Please try again.",
  "retryAfter": 30
}
```

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "details": "Detailed error information"
}
```

### Common Error Codes for AI Analysis

- **400 Bad Request**: Invalid assessment data or validation errors
- **401 Unauthorized**: Missing or invalid API key
- **429 Too Many Requests**: Rate limit exceeded (AI analysis is resource-intensive)
- **503 Service Unavailable**: AI model is loading or unavailable
- **500 Internal Server Error**: AI processing error

### AI Service Error Examples

**AI Model Loading:**
```json
{
  "success": false,
  "error": "Service Temporarily Unavailable",
  "details": "AI model is loading. Please wait 30-60 seconds and retry.",
  "estimatedWaitTime": 45
}
```

**Invalid Assessment Parameters:**
```json
{
  "success": false,
  "error": "Validation Error",
  "details": "Assessment parameters must be between 1 and 5",
  "field": "assessmentParameters.applicationBasedQuestions"
}
```

**Rate Limit for AI Analysis:**
```json
{
  "success": false,
  "error": "Analysis Rate Limit Exceeded",
  "details": "AI analysis requests are limited to prevent overload. Please try again in 15 minutes.",
  "retryAfter": 900
}
```

## AI Analysis Rate Limiting

- **Window**: 15 minutes
- **Limit**: 50 AI analysis requests per IP (reduced due to computational cost)
- **Health Checks**: Unlimited
- **Headers**: Rate limit information included in response headers

**Rate Limit Headers:**
```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1699876543
```

## AI Service Setup & Configuration

### Prerequisites
- **Node.js 18+** - Runtime environment
- **Ollama AI Service** - Must be running on localhost:11434
- **AI Model**: gpt-oss:20b (download required, ~40GB)
- **Minimum RAM**: 8GB (16GB+ recommended for optimal performance)

### Ollama Installation & Setup
```bash
# Install Ollama (macOS)
brew install ollama

# Start Ollama service
ollama serve

# Download the required model
ollama pull gpt-oss:20b

# Verify model availability
ollama list
```

### Environment Variables (AI-Focused)
```env
# Core AI Configuration
NODE_ENV=development
PORT=5000
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gpt-oss:20b

# API Security
API_KEY=123
JWT_SECRET=your-secret-key

# Performance & Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# CORS for Frontend Integration
FRONTEND_URL=http://localhost:3000
```

### Starting the AI Analysis Service
```bash
cd backend
npm install
npm start

# For development with auto-restart
npm run dev
```

### Testing AI Endpoints
```bash
# Test AI service health
curl -H "x-api-key: 123" http://localhost:8000/api/v1/analysis/test-ollama

# Test Early Childhood Psycho-Educational Analysis (LKG-Grade 2)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: 123" \
  -d '{
    "studentName": "Test Child",
    "age": 5,
    "grade": "UKG",
    "teacherName": "Test Teacher",
    "assessmentDate": "2025-11-15",
    "developmentalAssessment": {
      "attentionAndImpulseControl": {"questions": [{"id": 1, "text": "The child has difficulty focusing on tasks for more than 5–10 minutes", "score": 3}, {"id": 2, "text": "The child often interrupts others or speaks out of turn", "score": 3}, {"id": 3, "text": "The child has difficulty waiting for their turn in group activities", "score": 3}, {"id": 4, "text": "The child appears restless or fidgets frequently during seated tasks", "score": 3}, {"id": 5, "text": "The child is easily distracted by external stimuli", "score": 3}]},
      "languageAndCommunication": {"questions": [{"id": 1, "text": "The child struggles to express their thoughts clearly", "score": 2}, {"id": 2, "text": "The child has trouble remembering the names of letters, numbers, or common objects", "score": 2}, {"id": 3, "text": "The child mispronounces words frequently or has difficulty forming sentences", "score": 2}, {"id": 4, "text": "The child struggles to follow 2–3 step verbal instructions", "score": 2}, {"id": 5, "text": "The child has difficulty retelling a story or describing events in order", "score": 2}]},
      "cognitiveAndLearningSkills": {"questions": [{"id": 1, "text": "The child has difficulty recognizing letters, numbers, or symbols", "score": 3}, {"id": 2, "text": "The child struggles to identify which of two groups has more or fewer items", "score": 3}, {"id": 3, "text": "The child often confuses sequences", "score": 3}, {"id": 4, "text": "The child takes longer than peers to solve simple puzzles or pattern tasks", "score": 3}, {"id": 5, "text": "The child has difficulty understanding cause-and-effect relationships", "score": 3}]},
      "motorSkills": {"questions": [{"id": 1, "text": "The child struggles with tasks requiring fine motor skills", "score": 4}, {"id": 2, "text": "The child's handwriting or drawing is noticeably messy compared to peers", "score": 4}, {"id": 3, "text": "The child has difficulty copying shapes, letters, or numbers accurately", "score": 4}, {"id": 4, "text": "The child has trouble tying shoelaces or manipulating small fasteners", "score": 4}, {"id": 5, "text": "The child struggles to complete tasks requiring hand-eye coordination", "score": 3}, {"id": 6, "text": "The child's handwriting is messy or inconsistent compared to peers", "score": 4}, {"id": 7, "text": "The child avoids tasks that require drawing, writing, or manipulating small objects", "score": 3}, {"id": 8, "text": "The child copies letters, numbers, or simple shapes inaccurately or slowly", "score": 4}]},
      "socialAndEmotionalSkills": {"questions": [{"id": 1, "text": "The child has difficulty making eye contact or interacting socially with peers", "score": 3}, {"id": 2, "text": "The child struggles to understand or respond appropriately to others' emotions", "score": 3}, {"id": 3, "text": "The child initiates play with other children without prompting", "score": 2}, {"id": 4, "text": "The child responds appropriately when another child shares a toy or idea", "score": 3}, {"id": 5, "text": "The child struggles to join group activities even when invited", "score": 3}, {"id": 6, "text": "The child prefers solitary play most of the time", "score": 4}, {"id": 7, "text": "The child maintains friendships or shows interest in peers over time", "score": 2}, {"id": 8, "text": "The child follows rules in group settings consistently", "score": 3}, {"id": 9, "text": "The child can participate in structured activities without disrupting others", "score": 3}, {"id": 10, "text": "The child shifts attention smoothly between different tasks when asked", "score": 2}, {"id": 11, "text": "The child can cope with minor criticism without strong negative reactions", "score": 2}]}
    }
  }' \
  http://localhost:8000/api/v1/analysis/early-childhood

# Test Academic Performance & Career Guidance Analysis (Grades 6-12)
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-api-key: 123" \
  -d '{
    "studentId": "test-001",
    "studentName": "Test Student",
    "grade": "10",
    "academicYear": "2024-2025",
    "subjectAssessments": [{
      "subjectId": "math",
      "subjectName": "Mathematics",
      "totalMarks": 100,
      "obtainedMarks": 85,
      "assessmentParameters": {
        "applicationBasedQuestions": 4,
        "theoryQuestions": 4,
        "effortPutIn": 5,
        "problemSolvingCaseStudy": 4,
        "recallQuestions": 3
      }
    }, {
      "subjectId": "physics",
      "subjectName": "Physics", 
      "totalMarks": 100,
      "obtainedMarks": 78,
      "assessmentParameters": {
        "applicationBasedQuestions": 3,
        "theoryQuestions": 4,
        "effortPutIn": 4,
        "problemSolvingCaseStudy": 3,
        "recallQuestions": 4
      }
    }]
  }' \
  http://localhost:8000/api/v1/analysis/advanced
```

## Security & Best Practices

### AI-Focused Security Features
- **API Key Authentication**: All analysis endpoints protected
- **Rate Limiting**: Prevents AI service overload
- **Input Validation**: Comprehensive data validation using Joi schemas
- **CORS Configuration**: Secure frontend integration
- **Request Size Limits**: Prevents large payload attacks
- **Helmet.js Security Headers**: Standard web security protections

### Performance Optimization
- **Fallback Analysis**: System continues working even if AI is unavailable
- **Response Caching**: Consider implementing caching for similar analyses
- **Compression**: All responses are compressed
- **Memory Management**: Efficient handling of AI model responses

### Production Recommendations
1. **Use Environment Secrets**: Replace default API key with secure random string
2. **Enable HTTPS**: Use SSL certificates in production
3. **Monitor AI Service**: Implement health checks and alerting
4. **Scale Horizontally**: Consider load balancing for high traffic
5. **Database Integration**: Add persistent storage for analysis results
6. **Logging**: Implement comprehensive logging for debugging

## AI Model Performance

### Expected Response Times
- **Game-Based Analysis**: 2-4 seconds
- **Advanced Analysis**: 3-6 seconds  
- **Health Checks**: < 100ms
- **Ollama Model Loading**: 30-60 seconds (first request)

### Optimization Tips
- Keep Ollama service running continuously
- Pre-warm the model with dummy requests
- Monitor memory usage (model requires ~40GB)
- Use SSD storage for better model loading times

## Troubleshooting

### Common Issues

**"Ollama service not available"**
- Ensure Ollama is running: `ollama serve`
- Check if model is pulled: `ollama list`
- Verify port 11434 is accessible

**"Model not found"**
- Download model: `ollama pull gpt-oss:20b`
- Check model name in .env matches exactly

**"Analysis taking too long"**
- Model may be loading on first request (wait 60 seconds)
- Check system memory (minimum 8GB required)
- Reduce analysis complexity if needed

## Support & Integration Help

This AI analysis backend is designed to be:
- **Framework Agnostic**: Works with any frontend (React, Vue, Angular, etc.)
- **Language Agnostic**: RESTful API accessible from any programming language
- **Scalable**: Stateless design allows horizontal scaling
- **Reliable**: Fallback mechanisms ensure continuous service

For technical support, integration assistance, or feature requests, refer to the project repository.

---

**SproutSense AI Analysis Backend**  
**Last Updated:** November 15, 2025  
**Version:** 1.0.0  
**AI Model:** gpt-oss:20b
