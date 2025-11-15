import { ChildProfile, ParentProfile } from '@/types/profile';

const PARENT_PROFILE_KEY = 'sproutsense-parent-profile';

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
