export type UserType = 'teacher' | 'student';

export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade?: string;
  concerns?: string[];
  notes?: string;
  createdAt: number;
  parentId?: string;
  teacherId?: string;
  classroomCode?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  grade: string;
  school?: string;
  reportCode?: string; // Report code entered during onboarding
  teacherId?: string;
  createdAt: number;
}

export interface Classroom {
  id: string;
  teacherId: string;
  name: string;
  code: string;
  gradeLevel: string;
  students: string[]; // Student IDs
  createdAt: number;
}

export interface AssessmentHistory {
  childId: string;
  sessionId: string;
  timestamp: number;
  domainResults: any[];
  overallSignal: 'green' | 'yellow' | 'red';
}

export interface ParentProfile {
  userId: string;
  userType: UserType;
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  children: ChildProfile[];
  classroomCode?: string;
  createdAt: number;
}

export interface TeacherProfile {
  userId: string;
  userType: UserType;
  name: string;
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  classrooms: Classroom[];
  createdAt: number;
}

export interface StudentUserProfile {
  userId: string;
  userType: UserType;
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  studentProfile: StudentProfile;
  createdAt: number;
}
