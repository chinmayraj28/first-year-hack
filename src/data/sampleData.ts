import { Student, Subject, Question, Exam, ExamAttempt } from '@/types';

export const sampleStudents: Student[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@school.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-09-01'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@school.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-09-01'
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@school.edu',
    grade: '10th Grade',
    enrollmentDate: '2024-09-01'
  }
];

export const sampleSubjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Algebra, Geometry, and Basic Calculus',
    topics: [
      {
        id: 'algebra',
        name: 'Algebra',
        subjectId: 'math',
        skillsRequired: ['equation_solving', 'pattern_recognition', 'logical_reasoning'],
        difficulty: 'intermediate'
      },
      {
        id: 'geometry',
        name: 'Geometry',
        subjectId: 'math',
        skillsRequired: ['spatial_reasoning', 'theorem_application', 'proof_construction'],
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: 'english',
    name: 'English Literature',
    description: 'Reading comprehension, creative writing, and literary analysis',
    topics: [
      {
        id: 'reading_comp',
        name: 'Reading Comprehension',
        subjectId: 'english',
        skillsRequired: ['text_analysis', 'inference', 'vocabulary'],
        difficulty: 'intermediate'
      },
      {
        id: 'creative_writing',
        name: 'Creative Writing',
        subjectId: 'english',
        skillsRequired: ['creativity', 'grammar', 'storytelling'],
        difficulty: 'advanced'
      }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Physics, Chemistry, and Biology basics',
    topics: [
      {
        id: 'physics',
        name: 'Physics',
        subjectId: 'science',
        skillsRequired: ['problem_solving', 'mathematical_application', 'scientific_reasoning'],
        difficulty: 'advanced'
      },
      {
        id: 'chemistry',
        name: 'Chemistry',
        subjectId: 'science',
        skillsRequired: ['formula_application', 'observation', 'data_analysis'],
        difficulty: 'intermediate'
      }
    ]
  }
];

export const sampleQuestions: Question[] = [
  // Math Questions
  {
    id: 'q1',
    text: 'Solve for x: 2x + 5 = 15',
    type: 'short-answer',
    subject: 'Mathematics',
    topic: 'Algebra',
    skillsAssessed: ['equation_solving', 'arithmetic'],
    difficulty: 'easy',
    maxMarks: 5,
    correctAnswer: '5'
  },
  {
    id: 'q2',
    text: 'What is the area of a circle with radius 4 cm?',
    type: 'short-answer',
    subject: 'Mathematics',
    topic: 'Geometry',
    skillsAssessed: ['formula_application', 'calculation'],
    difficulty: 'medium',
    maxMarks: 5,
    correctAnswer: '16π' // or 50.24
  },
  {
    id: 'q3',
    text: 'Factor the expression: x² + 7x + 12',
    type: 'short-answer',
    subject: 'Mathematics',
    topic: 'Algebra',
    skillsAssessed: ['pattern_recognition', 'factoring', 'algebraic_manipulation'],
    difficulty: 'medium',
    maxMarks: 5,
    correctAnswer: '(x+3)(x+4)'
  },
  
  // English Questions
  {
    id: 'q4',
    text: 'What is the main theme of the passage you just read?',
    type: 'essay',
    subject: 'English Literature',
    topic: 'Reading Comprehension',
    skillsAssessed: ['text_analysis', 'theme_identification', 'critical_thinking'],
    difficulty: 'medium',
    maxMarks: 10,
    rubric: {
      criteria: [
        { name: 'Theme Identification', description: 'Correctly identifies the main theme', maxPoints: 4 },
        { name: 'Supporting Evidence', description: 'Uses examples from text', maxPoints: 3 },
        { name: 'Clarity of Expression', description: 'Clear and coherent writing', maxPoints: 3 }
      ]
    }
  },
  {
    id: 'q5',
    text: 'Which of the following best describes the author\'s tone?',
    type: 'multiple-choice',
    subject: 'English Literature',
    topic: 'Reading Comprehension',
    skillsAssessed: ['tone_analysis', 'reading_comprehension'],
    difficulty: 'medium',
    maxMarks: 3,
    options: ['Optimistic', 'Pessimistic', 'Neutral', 'Sarcastic'],
    correctAnswer: 'Optimistic'
  },
  
  // Science Questions
  {
    id: 'q6',
    text: 'Calculate the force needed to accelerate a 10kg object at 5 m/s²',
    type: 'short-answer',
    subject: 'Science',
    topic: 'Physics',
    skillsAssessed: ['formula_application', 'calculation', 'physics_concepts'],
    difficulty: 'medium',
    maxMarks: 5,
    correctAnswer: '50N'
  },
  {
    id: 'q7',
    text: 'What is the chemical formula for water?',
    type: 'short-answer',
    subject: 'Science',
    topic: 'Chemistry',
    skillsAssessed: ['chemical_knowledge', 'memorization'],
    difficulty: 'easy',
    maxMarks: 2,
    correctAnswer: 'H2O'
  }
];

export const sampleExams: Exam[] = [
  {
    id: 'exam1',
    title: 'Mathematics Midterm',
    description: 'Algebra and Geometry assessment',
    subject: 'Mathematics',
    duration: 90,
    totalMarks: 15,
    questions: [
      sampleQuestions[0], // q1
      sampleQuestions[1], // q2
      sampleQuestions[2]  // q3
    ],
    createdBy: 'teacher1',
    createdAt: '2024-10-01',
    isActive: true
  },
  {
    id: 'exam2',
    title: 'English Literature Quiz',
    description: 'Reading comprehension and analysis',
    subject: 'English Literature',
    duration: 60,
    totalMarks: 13,
    questions: [
      sampleQuestions[3], // q4
      sampleQuestions[4]  // q5
    ],
    createdBy: 'teacher2',
    createdAt: '2024-10-05',
    isActive: true
  },
  {
    id: 'exam3',
    title: 'Science Assessment',
    description: 'Physics and Chemistry basics',
    subject: 'Science',
    duration: 45,
    totalMarks: 7,
    questions: [
      sampleQuestions[5], // q6
      sampleQuestions[6]  // q7
    ],
    createdBy: 'teacher3',
    createdAt: '2024-10-10',
    isActive: true
  }
];

export const sampleExamAttempts: ExamAttempt[] = [
  // Alice's attempts
  {
    id: 'attempt1',
    examId: 'exam1',
    studentId: '1',
    startTime: '2024-10-15T09:00:00Z',
    endTime: '2024-10-15T10:15:00Z',
    status: 'completed',
    answers: [
      { questionId: 'q1', answer: '5', timeSpent: 120, confidence: 5 },
      { questionId: 'q2', answer: '50.24', timeSpent: 300, confidence: 4 },
      { questionId: 'q3', answer: '(x+3)(x+4)', timeSpent: 420, confidence: 3 }
    ],
    totalScore: 15,
    maxScore: 15
  },
  {
    id: 'attempt2',
    examId: 'exam2',
    studentId: '1',
    startTime: '2024-10-20T10:00:00Z',
    endTime: '2024-10-20T10:45:00Z',
    status: 'completed',
    answers: [
      { questionId: 'q4', answer: 'The main theme is about overcoming challenges...', timeSpent: 900, confidence: 4 },
      { questionId: 'q5', answer: 'Optimistic', timeSpent: 180, confidence: 4 }
    ],
    totalScore: 11,
    maxScore: 13
  },
  {
    id: 'attempt3',
    examId: 'exam3',
    studentId: '1',
    startTime: '2024-10-25T11:00:00Z',
    endTime: '2024-10-25T11:30:00Z',
    status: 'completed',
    answers: [
      { questionId: 'q6', answer: '50N', timeSpent: 240, confidence: 5 },
      { questionId: 'q7', answer: 'H2O', timeSpent: 60, confidence: 5 }
    ],
    totalScore: 7,
    maxScore: 7
  },

  // Bob's attempts (lower performance)
  {
    id: 'attempt4',
    examId: 'exam1',
    studentId: '2',
    startTime: '2024-10-15T09:00:00Z',
    endTime: '2024-10-15T10:30:00Z',
    status: 'completed',
    answers: [
      { questionId: 'q1', answer: '10', timeSpent: 300, confidence: 2 },
      { questionId: 'q2', answer: '16', timeSpent: 600, confidence: 2 },
      { questionId: 'q3', answer: 'x+12', timeSpent: 900, confidence: 1 }
    ],
    totalScore: 0,
    maxScore: 15
  },
  {
    id: 'attempt5',
    examId: 'exam2',
    studentId: '2',
    startTime: '2024-10-20T10:00:00Z',
    endTime: '2024-10-20T11:00:00Z',
    status: 'completed',
    answers: [
      { questionId: 'q4', answer: 'The passage is about things...', timeSpent: 1200, confidence: 2 },
      { questionId: 'q5', answer: 'Pessimistic', timeSpent: 300, confidence: 2 }
    ],
    totalScore: 4,
    maxScore: 13
  }
];

// Helper function to get student attempts
export function getStudentAttempts(studentId: string): ExamAttempt[] {
  return sampleExamAttempts.filter(attempt => attempt.studentId === studentId);
}

// Helper function to get exam by id
export function getExamById(examId: string): Exam | undefined {
  return sampleExams.find(exam => exam.id === examId);
}

// Helper function to get student by id
export function getStudentById(studentId: string): Student | undefined {
  return sampleStudents.find(student => student.id === studentId);
}
