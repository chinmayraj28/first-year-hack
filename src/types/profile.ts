export interface ChildProfile {
  id: string;
  name: string;
  age: number;
  grade?: string;
  concerns?: string[];
  notes?: string;
  createdAt: number;
  parentId: string;
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
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  children: ChildProfile[];
  createdAt: number;
}
