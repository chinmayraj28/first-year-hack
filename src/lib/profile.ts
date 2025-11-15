import { 
  ChildProfile, 
  ParentProfile, 
  TeacherProfile, 
  StudentUserProfile,
  StudentProfile,
  Classroom,
  UserType 
} from '@/types/profile';

// Storage keys
const PARENT_PROFILE_KEY = 'sproutsense-parent-profile';
const TEACHER_PROFILE_KEY = 'sproutsense-teacher-profile';
const STUDENT_PROFILE_KEY = 'sproutsense-student-profile';
const CLASSROOM_KEY = 'sproutsense-classrooms';

// ========== Parent Profile Functions ==========

export function getParentProfile(userId: string): ParentProfile | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`${PARENT_PROFILE_KEY}-${userId}`);
  return data ? JSON.parse(data) : null;
}

export function saveParentProfile(profile: ParentProfile): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(`${PARENT_PROFILE_KEY}-${profile.userId}`, JSON.stringify(profile));
}

export function addChild(userId: string, child: Omit<ChildProfile, 'id' | 'createdAt' | 'parentId'>): ChildProfile {
  const profile = getParentProfile(userId) || {
    userId,
    userType: 'parent' as UserType,
    acceptedPrivacyPolicy: false,
    acceptedTerms: false,
    acceptedDisclaimer: false,
    children: [],
    createdAt: Date.now(),
  };

  const newChild: ChildProfile = {
    ...child,
    id: `child-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
    parentId: userId,
  };

  profile.children.push(newChild);
  saveParentProfile(profile);
  
  return newChild;
}

export function updateChild(userId: string, childId: string, updates: Partial<ChildProfile>): void {
  const profile = getParentProfile(userId);
  if (!profile) return;

  const childIndex = profile.children.findIndex((c) => c.id === childId);
  if (childIndex === -1) return;

  profile.children[childIndex] = {
    ...profile.children[childIndex],
    ...updates,
  };

  saveParentProfile(profile);
}

export function getChild(userId: string, childId: string): ChildProfile | null {
  const profile = getParentProfile(userId);
  if (!profile) return null;

  return profile.children.find((c) => c.id === childId) || null;
}

export function getAllChildren(userId: string): ChildProfile[] {
  const profile = getParentProfile(userId);
  return profile?.children || [];
}

// ========== Teacher Profile Functions ==========
export function getTeacherProfile(userId: string): TeacherProfile | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`${TEACHER_PROFILE_KEY}-${userId}`);
  return data ? JSON.parse(data) : null;
}

export function saveTeacherProfile(profile: TeacherProfile): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(`${TEACHER_PROFILE_KEY}-${profile.userId}`, JSON.stringify(profile));
}

export function createClassroom(teacherId: string, name: string, gradeLevel: string): Classroom {
  const teacher = getTeacherProfile(teacherId);
  if (!teacher) {
    throw new Error('Teacher profile not found');
  }

  const code = generateClassroomCode();
  const classroom: Classroom = {
    id: `classroom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    teacherId,
    name,
    code,
    gradeLevel,
    students: [],
    createdAt: Date.now(),
  };

  teacher.classrooms.push(classroom);
  saveTeacherProfile(teacher);
  saveClassroom(classroom);
  
  return classroom;
}

export function getClassroomByCode(code: string): Classroom | null {
  if (typeof window === 'undefined') return null;
  
  const classrooms = getAllClassrooms();
  return classrooms.find(c => c.code === code) || null;
}

export function getAllClassrooms(): Classroom[] {
  if (typeof window === 'undefined') return [];
  
  const keys = Object.keys(localStorage).filter(key => key.startsWith(CLASSROOM_KEY));
  return keys.map(key => JSON.parse(localStorage.getItem(key) || '{}')).filter(Boolean);
}

function saveClassroom(classroom: Classroom): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${CLASSROOM_KEY}-${classroom.id}`, JSON.stringify(classroom));
}

function generateClassroomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function addStudentToClassroom(classroomId: string, studentId: string): void {
  const classrooms = getAllClassrooms();
  const classroom = classrooms.find(c => c.id === classroomId);
  if (!classroom) return;

  if (!classroom.students.includes(studentId)) {
    classroom.students.push(studentId);
    saveClassroom(classroom);
    
    // Update teacher profile
    const teacher = getTeacherProfile(classroom.teacherId);
    if (teacher) {
      const classIndex = teacher.classrooms.findIndex(c => c.id === classroomId);
      if (classIndex !== -1) {
        teacher.classrooms[classIndex] = classroom;
        saveTeacherProfile(teacher);
      }
    }
  }
}

// ========== Student Profile Functions ==========
export function getStudentProfile(userId: string): StudentUserProfile | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem(`${STUDENT_PROFILE_KEY}-${userId}`);
  return data ? JSON.parse(data) : null;
}

export function saveStudentProfile(profile: StudentUserProfile): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(`${STUDENT_PROFILE_KEY}-${profile.userId}`, JSON.stringify(profile));
}

export function getStudentByUserId(userId: string): StudentProfile | null {
  const profile = getStudentProfile(userId);
  return profile?.studentProfile || null;
}

// ========== Generic User Profile Functions ==========
export function getUserProfile(userId: string, userType: UserType): ParentProfile | TeacherProfile | StudentUserProfile | null {
  switch (userType) {
    case 'parent':
      return getParentProfile(userId);
    case 'teacher':
      return getTeacherProfile(userId);
    case 'student':
      return getStudentProfile(userId);
    default:
      return null;
  }
}
