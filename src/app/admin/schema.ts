// Field schema that drives the admin editor forms for each collection.
import type { CollectionKey } from '@/lib/content-config'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'list'
  | 'image'
  | 'images'
  | 'select'
  | 'color' // hex color with swatch + picker
  | 'icon' // simpleicons slug with live preview
  | 'date'
  | 'tags' // chip input -> string[]
  | 'markdown' // textarea with live preview toggle
  | 'number'
  | 'url'
  | 'boolean' // on/off checkbox

export type Field = {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  options?: string[] // for select
  help?: string
  required?: boolean
}

export const SCHEMA: Record<CollectionKey, { titleKey: string; subtitleKey?: string; fields: Field[] }> = {
  projects: {
    titleKey: 'name',
    subtitleKey: 'description',
    fields: [
      { key: 'name', label: 'Name', type: 'text', placeholder: 'Project name', required: true },
      { key: 'slug', label: 'Slug', type: 'text', placeholder: 'auto from name if blank', help: 'URL-safe id; leave blank to auto-generate' },
      { key: 'featured', label: 'Featured project', type: 'boolean', help: 'On = large case-study card. Off = compact grid card. (Projects with images default to featured.)' },
      { key: 'award', label: 'Winning position', type: 'text', placeholder: '🏆 1st Place — XYZ Hackathon', help: 'Optional — shows a highlighted award badge on the card. Leave blank if none.' },
      { key: 'role', label: 'Your role', type: 'text', placeholder: 'Full-stack developer', help: 'Optional — shown in the case-study metadata' },
      { key: 'year', label: 'Year', type: 'text', placeholder: '2025', help: 'Optional' },
      { key: 'status', label: 'Status', type: 'select', options: ['', 'live', 'archived'], help: 'Optional — shows a Live / Archived label' },
      { key: 'tech', label: 'Tech stack', type: 'list', help: 'One technology per line', required: true },
      { key: 'description', label: 'Description', type: 'textarea', required: true },
      { key: 'achievements', label: 'Other achievements', type: 'list', help: 'One per line (e.g. "Top 10 — XYZ Hackathon")' },
      { key: 'github', label: 'GitHub URL', type: 'text', placeholder: 'https://github.com/...' },
      { key: 'live', label: 'Live / demo URL', type: 'text', placeholder: 'https://... (or # / blank)' },
      { key: 'images', label: 'Images (2–3 recommended)', type: 'images' },
    ],
  },
  certificates: {
    titleKey: 'title',
    subtitleKey: 'issuer',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'issuer', label: 'Issuer', type: 'text', placeholder: 'Oracle, Cisco…' },
      { key: 'icon', label: 'Icon', type: 'select', options: ['oracle', 'robot', 'cplusplus', 'linux', 'cloud', 'certificate'] },
      { key: 'color', label: 'Gradient', type: 'text', placeholder: 'from-red-500 to-red-700' },
      { key: 'bgColor', label: 'BG color', type: 'text', placeholder: 'bg-red-500/10' },
      { key: 'borderColor', label: 'Border color', type: 'text', placeholder: 'border-red-500/20' },
      { key: 'link', label: 'Link', type: 'text', placeholder: 'https://...' },
    ],
  },
  experience: {
    titleKey: 'company',
    subtitleKey: 'role',
    fields: [
      { key: 'logo', label: 'Logo', type: 'image' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'time', label: 'Time / location', type: 'text', placeholder: 'Jun 2025 – Jul 2025 • Remote' },
      { key: 'points', label: 'Highlights', type: 'list', help: 'One bullet per line' },
      { key: 'certLink', label: 'Certificate / proof link', type: 'text' },
    ],
  },
  skills: {
    titleKey: 'name',
    subtitleKey: 'category',
    fields: [
      { key: 'name', label: 'Skill name', type: 'text', placeholder: 'TypeScript' },
      {
        key: 'category',
        label: 'Category',
        type: 'select',
        options: ['programming', 'web', 'database', 'tools'],
        help: 'Which group it shows under on the site',
      },
      {
        key: 'icon',
        label: 'Icon (Simple Icons slug)',
        type: 'text',
        placeholder: 'typescript',
        help: 'Lowercase slug from simpleicons.org (e.g. "typescript", "redis", "docker"). Unknown = generic code icon.',
      },
    ],
  },
  leadership: {
    titleKey: 'title',
    subtitleKey: 'role',
    fields: [
      { key: 'title', label: 'Organization', type: 'text', placeholder: 'AIALCHEMIST', required: true },
      { key: 'role', label: 'Role', type: 'text', placeholder: 'Technical Lead', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      {
        key: 'icon',
        label: 'Icon',
        type: 'select',
        options: ['users', 'target', 'rocket', 'code', 'flag', 'star', 'crown', 'award'],
        help: 'Pick an icon shown in the card',
      },
      { key: 'link', label: 'Link', type: 'text', placeholder: 'https://...' },
    ],
  },
  achievements: {
    titleKey: 'title',
    subtitleKey: 'rank',
    fields: [
      { key: 'title', label: 'Title', type: 'text', placeholder: 'Hackathon / award name' },
      { key: 'badge', label: 'Badge (emoji)', type: 'text', placeholder: '🏆' },
      { key: 'rank', label: 'Rank', type: 'text', placeholder: '1st Runner Up' },
      { key: 'rankType', label: 'Rank type', type: 'select', options: ['success', 'warning', 'neutral'], help: 'Controls badge color: success=green, warning=yellow, neutral=gray' },
      { key: 'year', label: 'Year', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'project', label: 'Project', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea' },
      { key: 'prize', label: 'Prize', type: 'text', placeholder: '₹70,000 / Certificate…' },
      { key: 'tech', label: 'Tech stack', type: 'list', help: 'One per line' },
      { key: 'gradient', label: 'Gradient', type: 'text', placeholder: 'from-green-400 to-cyan-400' },
      { key: 'liveLink', label: 'Live link', type: 'text' },
      { key: 'codeLink', label: 'Code link', type: 'text' },
    ],
  },
}

// Sensible empty record for "add new".
export function blankItem(key: CollectionKey): Record<string, unknown> {
  const obj: Record<string, unknown> = {}
  for (const f of SCHEMA[key].fields) {
    if (f.type === 'list' || f.type === 'images' || f.type === 'tags') obj[f.key] = []
    else obj[f.key] = ''
  }
  if (key === 'certificates') obj.icon = 'certificate'
  if (key === 'achievements') obj.rankType = 'neutral'
  if (key === 'skills') obj.category = 'programming'
  if (key === 'leadership') obj.icon = 'users'
  return obj
}
