// Single source of truth for the editable content collections.
// Each maps to a JSON file in the repo that the public site imports.

export type CollectionKey =
  | 'projects'
  | 'certificates'
  | 'experience'
  | 'achievements'
  | 'skills'
  | 'leadership'
  | 'coding_milestones'

export const COLLECTIONS: Record<CollectionKey, { label: string; path: string }> = {
  projects: { label: 'Projects', path: 'src/data/projects.json' },
  certificates: { label: 'Certificates', path: 'src/data/certificates.json' },
  experience: { label: 'Experience', path: 'src/data/experience.json' },
  achievements: { label: 'Achievements', path: 'src/data/achievements.json' },
  skills: { label: 'Skills', path: 'src/data/skills.json' },
  leadership: { label: 'Leadership', path: 'src/data/leadership.json' },
  coding_milestones: { label: 'Coding Milestones', path: 'src/data/coding_milestones.json' },
}

export function isCollectionKey(v: unknown): v is CollectionKey {
  return typeof v === 'string' && v in COLLECTIONS
}
